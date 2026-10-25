import { z } from "zod";
import { contentHash } from "./rules";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/), instant = z.iso.datetime({ precision: 3 });
const count = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER), hash = z.string().regex(/^[a-f0-9]{64}$/);
const period = z.object({ start: instant, end: instant }).strict().refine(p => p.start < p.end);
const reference = z.object({ id, version: count.min(1), hash }).strict();
const target = z.object({ propertyId: z.uuid(), episodeId: id, media: z.literal("athome"), listingRevision: count, listingHash: hash,
  companyRef: id, officeRef: id, surface: z.enum(["pc", "mobileWeb", "mobileApp"]) }).strict();
const context = z.object({ id, version: count.min(1), distribution: z.enum(["consumer", "broker", "partner"]),
  loginState: z.enum(["anonymous", "authenticated", "unknown"]), regionRef: id.nullable(), filtersRef: id.nullable(), sortRef: id.nullable(), queryRef: id.nullable(),
  confirmation: z.enum(["confirmed", "unconfirmed"]), confirmationRef: id.nullable(), confirmedAt: instant.nullable() }).strict();
export const placementPlanSchema = z.object({ id, version: count.min(1), target, context, period,
  createdAt: instant, confirmedAt: instant.nullable(), confirmationRef: id.nullable(),
  slots: z.array(z.object({ id, period }).strict()).min(1).max(1000) }).strict();
const scope = z.object({ target, context: reference }).strict();
const common = { id, evidenceRef: id, slotId: id, scope, observedAt: instant, receivedAt: instant,
  acquisition: z.enum(["manual_confirmed", "official_export", "official_api", "mock", "unknown"]), authorizationRef: id.nullable() };
export const placementObservationSchema = z.discriminatedUnion("outcome", [
  z.object({ ...common, outcome: z.literal("read_failure"), reason: z.enum(["auth_required", "captcha", "network", "parse_failed", "unknown"]) }).strict(),
  z.object({ ...common, outcome: z.literal("not_found"), searchCoverage: z.enum(["complete", "partial", "unknown"]) }).strict(),
  z.object({ ...common, outcome: z.literal("read"), visibility: z.enum(["published", "not_published", "unknown"]), exactUnitConfirmed: z.boolean(),
    targetCompanyConfirmed: z.boolean(), contentHash: hash.nullable(), listKind: z.enum(["same_unit_company_list", "search_results", "unknown"]),
    companyFirst: z.enum(["yes", "no", "unknown", "not_applicable"]) }).strict(),
]);
export type PlacementPlan = z.infer<typeof placementPlanSchema>;
export type PlacementObservation = z.infer<typeof placementObservationSchema>;
export const placementReference = (p: { id: string; version: number }) => ({ id: p.id, version: p.version, hash: contentHash(p) });
const held = (reason: string) => ({ status: "held" as const, executable: false as const, decisionEligible: false as const, reason });
const same = (a: unknown, b: unknown) => contentHash(a) === contentHash(b);
const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;

function missingReason(o: PlacementObservation): string | undefined {
  if (!o.authorizationRef || o.acquisition === "mock" || o.acquisition === "unknown") return "UNVERIFIED_ACQUISITION";
  if (o.outcome === "read_failure") return "READ_FAILURE_" + o.reason.toUpperCase();
  if (o.outcome === "not_found") return "TARGET_NOT_FOUND_" + o.searchCoverage.toUpperCase();
  if (o.visibility !== "published") return o.visibility === "unknown" ? "VISIBILITY_UNKNOWN" : "NOT_PUBLISHED";
  if (!o.exactUnitConfirmed) return "UNIT_UNCONFIRMED";
  if (!o.targetCompanyConfirmed) return "TARGET_COMPANY_UNCONFIRMED";
  if (!o.contentHash) return "CONTENT_UNVERIFIED";
  if (o.listKind !== "same_unit_company_list") return "NOT_SAME_UNIT_COMPANY_LIST";
  if (o.companyFirst !== "yes" && o.companyFirst !== "no") return "COMPANY_FIRST_UNKNOWN";
}

/** Historical slot coverage only; no scheduling, browser access, ranking inference or listing decision. */
export function summarizePlacementCoverage(rawPlan: unknown, expectedPlan: unknown, rawObservations: unknown, now: string) {
  try {
    if (!Array.isArray(rawObservations) || rawObservations.length > 4000) return held("OBSERVATION_LIMIT");
    // Bound slots before recursive parsing. Inputs are private JSON contracts, not executable adapters.
    if (!rawPlan || typeof rawPlan !== "object" || !("slots" in rawPlan) || !Array.isArray(rawPlan.slots) || rawPlan.slots.length > 1000) return held("INVALID_PLACEMENT_PLAN");
    const plan = placementPlanSchema.safeParse(rawPlan), expected = reference.safeParse(expectedPlan), observations = z.array(placementObservationSchema).safeParse(rawObservations);
    if (!plan.success || !expected.success || !observations.success || !instant.safeParse(now).success) return held("INVALID_PLACEMENT_INPUT");
    const p = plan.data, c = p.context;
    if (!same(expected.data, placementReference(p))) return held("PLACEMENT_PLAN_MISMATCH");
    if (p.createdAt > p.period.start || !p.confirmationRef || !p.confirmedAt || p.confirmedAt < p.createdAt || p.confirmedAt > p.period.start) return held("PLAN_NOT_CONFIRMED_BEFORE_START");
    if (p.period.end > now) return held("PLACEMENT_PERIOD_NOT_ENDED");
    if (c.confirmation !== "confirmed" || !c.confirmationRef || !c.confirmedAt || c.confirmedAt > p.createdAt || c.loginState === "unknown"
      || !c.regionRef || !c.filtersRef || !c.sortRef || !c.queryRef) return held("PLACEMENT_CONTEXT_UNCONFIRMED");
    const slots = [...p.slots].sort((a, b) => compare(a.period.start, b.period.start));
    const bySlot = new Map<string, typeof slots[number]>();
    let priorEnd = p.period.start;
    for (const slot of slots) {
      if (bySlot.has(slot.id)) return held("DUPLICATE_PLACEMENT_SLOT");
      if (slot.period.start < priorEnd || slot.period.end > p.period.end) return held("INVALID_PLACEMENT_SLOT_PERIOD");
      bySlot.set(slot.id, slot); priorEnd = slot.period.end;
    }
    const expectedScope = { target: p.target, context: placementReference(c) };
    const byId = new Map<string, PlacementObservation>(), byEvidence = new Map<string, string>(), matched = new Map<string, PlacementObservation>();
    let ignoredDuplicates = 0;
    for (const o of observations.data) {
      if (!same(o.scope, expectedScope)) return held("PLACEMENT_SCOPE_MISMATCH");
      const slot = bySlot.get(o.slotId);
      if (!slot) return held("UNKNOWN_PLACEMENT_SLOT");
      if (o.observedAt < slot.period.start || o.observedAt >= slot.period.end || o.receivedAt < o.observedAt || o.receivedAt > now) return held("INVALID_PLACEMENT_OBSERVATION_TIME");
      const old = byId.get(o.id);
      if (old) { if (!same(old, o)) return held("PLACEMENT_OBSERVATION_ID_CONFLICT"); ignoredDuplicates++; continue; }
      if (byEvidence.has(o.evidenceRef)) return held("PLACEMENT_EVIDENCE_REUSED");
      if (matched.has(o.slotId)) return held("PLACEMENT_SLOT_CONFLICT");
      byId.set(o.id, o); byEvidence.set(o.evidenceRef, o.id); matched.set(o.slotId, o);
    }
    let validObservedSlots = 0, firstSlots = 0, notFirstSlots = 0;
    const missing: { slotId: string; reason: string }[] = [];
    for (const slot of slots) {
      const o = matched.get(slot.id);
      if (!o) { missing.push({ slotId: slot.id, reason: "NOT_OBSERVED" }); continue; }
      const issue = missingReason(o);
      if (issue) missing.push({ slotId: slot.id, reason: issue });
      else if (o.outcome === "read") { validObservedSlots++; if (o.companyFirst === "yes") firstSlots++; else notFirstSlots++; }
    }
    const expectedSlots = slots.length;
    const ratio = (n: number, d: number) => ({ numerator: String(n), denominator: String(d), approximate: n / d });
    const body = { plan: expected.data, scope: expectedScope, period: p.period,
      observationsHash: contentHash([...byId.values()].sort((a, b) => compare(a.id, b.id))), checkedAt: now };
    return { status: "summarized" as const, executable: false as const, decisionEligible: false as const, periodEnded: true as const,
      expectedSlots, validObservedSlots, firstSlots, notFirstSlots, missing, ignoredDuplicates,
      observationCoverage: ratio(validObservedSlots, expectedSlots), firstShareAmongValid: validObservedSlots > 0 ? ratio(firstSlots, validObservedSlots) : null,
      reference: { ...body, hash: contentHash(body) } };
  } catch { return held("INVALID_PLACEMENT_INPUT"); }
}
