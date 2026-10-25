import { z } from "zod";
import { mediaStateSchema } from "./media-state";
import { contentHash, resolveRule, scopeSchema } from "./rules";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const instant = z.iso.datetime({ precision: 3 });
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const version = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const propertyVersion = z.object({ updatedAt: instant, fullHash: hash }).strict();
const binding = z.object({ propertyId: z.uuid(), episodeId: id, media: z.enum(["site", "athome"]) }).strict();
const intent = z.object({
  desiredState: z.enum(["published", "not_published"]),
  managementId: id.nullable(), publicId: id.nullable(),
}).strict();

/** Metadata from an independent source read, not a copy of mediaState.listing.propertyVersion. */
export const planContextSchema = z.object({
  requestedScope: scopeSchema,
  snapshot: z.object({
    propertyId: z.uuid(), episodeId: id, market: z.enum(["residential_rental", "sale", "business"]),
    snapshotRef: id, capturedAt: instant, version: propertyVersion,
  }).strict(),
  mediaState: mediaStateSchema,
  ruleHistory: z.unknown(),
}).strict();
const requestSchema = z.object({ planId: z.uuid(), jobVersion: version.min(1), expiresAt: instant, intent }).strict();
export const changePlanSchema = z.object({
  schemaVersion: z.literal(1), executable: z.literal(false),
  planId: z.uuid(), jobVersion: version.min(1), createdAt: instant, expiresAt: instant,
  binding, scope: scopeSchema,
  rule: z.object({ id, version: version.min(1), hash }).strict(),
  source: z.object({ snapshotRef: id, capturedAt: instant, version: propertyVersion }).strict(),
  listingBefore: z.object({ revision: version, hash }).strict(),
  intent,
}).strict().refine(p => p.createdAt < p.expiresAt && p.source.capturedAt <= p.createdAt
  && p.source.version.updatedAt <= p.source.capturedAt);
export const planReferenceSchema = z.object({ planId: z.uuid(), jobVersion: version.min(1), hash }).strict();
export type ChangePlan = z.infer<typeof changePlanSchema>;
export type ChangePlanReference = z.infer<typeof planReferenceSchema>;
export type PlanContext = z.infer<typeof planContextSchema>;
type Held = { status: "held"; executable: false; identityChecksPassed: false; reason: string };
const held = (reason: string): Held => ({ status: "held", executable: false, identityChecksPassed: false, reason });

function contextIssue(context: PlanContext, now: string): string | undefined {
  const { snapshot, mediaState: state, requestedScope: scope } = context;
  if (snapshot.propertyId !== state.propertyId || snapshot.episodeId !== state.episodeId) return "BINDING_MISMATCH";
  if (snapshot.market !== scope.market) return "MARKET_MISMATCH";
  if (snapshot.capturedAt > now || snapshot.version.updatedAt > snapshot.capturedAt) return "INVALID_SNAPSHOT_TIME";
  if (!state.listing.changedAt) return "LISTING_TIME_UNCONFIRMED";
  if (state.listing.changedAt > now || state.listing.propertyVersion.updatedAt > state.listing.changedAt) return "INVALID_LISTING_TIME";
  const prior = state.listing.propertyVersion;
  if (snapshot.version.updatedAt < prior.updatedAt) return "PROPERTY_VERSION_REGRESSION";
  if (snapshot.version.updatedAt === prior.updatedAt && snapshot.version.fullHash !== prior.fullHash) return "SAME_TIMESTAMP_HASH_CONFLICT";
}

/** Local proposal only. Rules are selected, not evaluated against property eligibility here. */
export function createChangePlan(rawRequest: unknown, rawContext: unknown, now: string):
  Held | { status: "planned"; executable: false; plan: ChangePlan; reference: ChangePlanReference } {
  const request = requestSchema.safeParse(rawRequest), context = planContextSchema.safeParse(rawContext);
  if (!request.success || !context.success || !instant.safeParse(now).success) return held("INVALID_PLAN_INPUT");
  if (request.data.expiresAt <= now) return held("INVALID_PLAN_EXPIRY");
  const issue = contextIssue(context.data, now);
  if (issue) return held(issue);
  const resolved = resolveRule(context.data.ruleHistory, context.data.requestedScope, now);
  if (resolved.status !== "selected") return held(resolved.reason);
  if (resolved.rule.effectiveUntil && request.data.expiresAt > resolved.rule.effectiveUntil) return held("PLAN_OUTLIVES_RULE");
  const state = context.data.mediaState, snapshot = context.data.snapshot;
  const plan: ChangePlan = {
    schemaVersion: 1, executable: false, planId: request.data.planId, jobVersion: request.data.jobVersion,
    createdAt: now, expiresAt: request.data.expiresAt,
    binding: { propertyId: state.propertyId, episodeId: state.episodeId, media: state.media },
    scope: context.data.requestedScope,
    rule: { id: resolved.rule.id, version: resolved.rule.version, hash: resolved.hash },
    source: { snapshotRef: snapshot.snapshotRef, capturedAt: snapshot.capturedAt, version: snapshot.version },
    listingBefore: { revision: state.listing.revision, hash: contentHash(state.listing) },
    intent: request.data.intent,
  };
  return { status: "planned", executable: false, plan,
    reference: { planId: plan.planId, jobVersion: plan.jobVersion, hash: contentHash(plan) } };
}

export const pendingPlanGates = [
  "PROPERTY_ELIGIBILITY", "SOURCE_AUTHORIZATION", "ADVERTISING_PERMISSION", "ASSET_CLEARANCE",
  "MEDIA_CAPABILITY", "MEDIA_CAPACITY", "EXECUTION_APPROVAL", "WRITER_FENCE",
] as const;
type MatchedButHeld = {
  status: "held"; executable: false; identityChecksPassed: true;
  reason: "ELIGIBILITY_AND_EXECUTION_GATES_UNIMPLEMENTED";
  reference: ChangePlanReference; checkedAt: string; pendingGates: typeof pendingPlanGates;
};

/**
 * expected must come from a trusted plan store/coordinator, not the same untrusted JSON as plan.
 * freshContext must independently read the property source and resolve the requested scope.
 * No writer, journal persistence, publication permission or post-check CAS is implemented here.
 */
export function preflightChangePlan(rawPlan: unknown, rawContext: unknown, expected: unknown, now: string): Held | MatchedButHeld {
  const parsed = changePlanSchema.safeParse(rawPlan), context = planContextSchema.safeParse(rawContext), trusted = planReferenceSchema.safeParse(expected);
  if (!parsed.success || !context.success || !trusted.success || !instant.safeParse(now).success) return held("INVALID_PREFLIGHT_INPUT");
  const plan = parsed.data, current = context.data, reference = trusted.data;
  if (plan.planId !== reference.planId || plan.jobVersion !== reference.jobVersion || contentHash(plan) !== reference.hash) return held("PLAN_REFERENCE_MISMATCH");
  if (now < plan.createdAt) return held("PLAN_NOT_STARTED");
  if (now >= plan.expiresAt) return held("PLAN_EXPIRED");
  const issue = contextIssue(current, now);
  if (issue) return held(issue);
  if (contentHash(plan.scope) !== contentHash(current.requestedScope)) return held("SCOPE_MISMATCH");
  const state = current.mediaState;
  if (plan.binding.propertyId !== state.propertyId || plan.binding.episodeId !== state.episodeId || plan.binding.media !== state.media) return held("BINDING_MISMATCH");
  if (current.snapshot.capturedAt < plan.createdAt) return held("SNAPSHOT_PREDATES_PLAN");
  if (contentHash(current.snapshot.version) !== contentHash(plan.source.version)) return held("PROPERTY_SOURCE_CONFLICT");
  if (state.listing.revision !== plan.listingBefore.revision || contentHash(state.listing) !== plan.listingBefore.hash) return held("LISTING_SOURCE_CONFLICT");
  const resolved = resolveRule(current.ruleHistory, current.requestedScope, now);
  if (resolved.status !== "selected") return held(resolved.reason);
  if (resolved.rule.id !== plan.rule.id || resolved.rule.version !== plan.rule.version || resolved.hash !== plan.rule.hash) return held("RULE_VERSION_CONFLICT");
  return { status: "held", executable: false, identityChecksPassed: true,
    reason: "ELIGIBILITY_AND_EXECUTION_GATES_UNIMPLEMENTED", reference, checkedAt: now,
    pendingGates: [...pendingPlanGates] };
}
