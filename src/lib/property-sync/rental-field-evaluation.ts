import "server-only";
import { z } from "zod";
import { contentHash, resolveRule, scopeSchema } from "./rules";
import { matchSchoolEvidence } from "./school-evidence";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const hash = z.string().regex(/^[a-f0-9]{64}$/), instant = z.iso.datetime({ precision: 3 });
const integer = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const kitchen = z.enum(["K", "DK", "LDK"]);
const binding = z.object({ propertyId: z.uuid(), episodeId: id }).strict();
export const rentalEvaluationPolicySchema = z.object({
  id, version: integer.positive(), scope: scopeSchema, ruleHash: hash,
  effectiveFrom: instant, effectiveUntil: instant.nullable(),
  status: z.enum(["pending", "approved", "revoked"]), approvedAt: instant.nullable(), approvalRef: id.nullable(),
  rentBasis: z.enum(["rent_only", "rent_plus_management"]).nullable(),
  minimumInclusive: z.boolean().nullable(), maximumInclusive: z.boolean().nullable(),
  roomCountBasis: z.literal("main_rooms_excluding_service_rooms").nullable(),
  allowedKitchens: z.array(kitchen).min(1).max(3).nullable(),
  normalizationContractRef: id.nullable(),
  // Alternatives restrict the baseline room/kitchen checks; they never override them.
  layoutAlternatives: z.array(z.object({ minimumMainRooms: integer.positive(), maximumMainRooms: integer.positive().nullable(),
    kitchens: z.array(kitchen).min(1).max(3) }).strict()).min(1).max(10).optional(),
  fixedLeaseSchoolException: z.object({ municipalityRef: id, schoolRefs: z.array(id).min(1).max(100),
    academicYear: z.number().int().min(1900).max(2200).nullable(), applicableOn: z.iso.date().nullable() }).strict().optional(),
  // Opt-in extension. Omitted legacy settings retain the previous four-field contract.
  additionalChecks: z.object({
    minimumArea: z.object({ mainRoomsAtLeast: integer.positive(), kitchens: z.array(kitchen).min(1).max(3),
      sqm: z.number().positive().finite().max(Number.MAX_SAFE_INTEGER) }).strict().nullable(),
    propertyUpdateWindow: z.object({ maxAgeHours: z.number().positive().finite(), boundary: z.literal("inclusive"),
      basis: z.literal("elapsed_time") }).strict().nullable(),
    incomeBasis: z.literal("company_total_including_ad").nullable(),
  }).strict().optional(),
}).strict().superRefine((p, ctx) => {
  if (p.scope.market !== "residential_rental" || (p.effectiveUntil && p.effectiveUntil <= p.effectiveFrom)
    || (p.allowedKitchens && new Set(p.allowedKitchens).size !== p.allowedKitchens.length)
    || p.layoutAlternatives?.some(a => (a.maximumMainRooms !== null && a.minimumMainRooms > a.maximumMainRooms) || new Set(a.kitchens).size !== a.kitchens.length)
    || (p.fixedLeaseSchoolException && new Set(p.fixedLeaseSchoolException.schoolRefs).size !== p.fixedLeaseSchoolException.schoolRefs.length)
    || (p.additionalChecks?.minimumArea && new Set(p.additionalChecks.minimumArea.kitchens).size !== p.additionalChecks.minimumArea.kitchens.length)) {
    ctx.addIssue({ code: "custom", message: "INVALID_EVALUATION_POLICY" });
  }
});
export type RentalEvaluationPolicy = z.infer<typeof rentalEvaluationPolicySchema>;
export const rentalFieldEvidenceSchema = z.object({
  binding, sourceHash: hash, observedAt: instant,
  normalization: z.enum(["confirmed", "unconfirmed"]), normalizationContractRef: id.nullable(),
  // JPY per month. Management charges are not inferred from prose or treated as zero when absent.
  rentYen: integer.nullable(), managementYen: integer.nullable(),
  mainRooms: integer.positive().nullable(), kitchen: kitchen.nullable(),
  areaSqm: z.number().positive().finite().max(Number.MAX_SAFE_INTEGER).nullable(),
  leaseType: z.enum(["ordinary", "fixed"]).nullable(),
  sourcePropertyUpdate: z.object({ updatedAt: instant.nullable(), evidenceRef: id.nullable(),
    basis: z.enum(["source_listing_update", "local_record_update", "retrieved_at", "unknown"]) }).strict().optional(),
}).strict();
export type RentalFieldEvidence = z.infer<typeof rentalFieldEvidenceSchema>;
// Keep private compensation outside the rental/public field evidence. No separate AD amount is accepted.
const incomeEvidenceSchema = z.object({ binding, sourceHash: hash, observedAt: instant,
  normalization: z.enum(["confirmed", "unconfirmed"]), normalizationContractRef: id.nullable(), evidenceRef: id.nullable(),
  totalYen: integer.nullable(), basis: z.enum(["company_total_including_ad", "other", "unknown"]),
  taxBasis: z.enum(["included", "excluded", "unknown"]), certainty: z.enum(["confirmed", "conditional", "unknown"]),
}).strict();
const requestSchema = z.object({ scope: scopeSchema, binding, sourceHash: hash,
  expectedRuleHash: hash, expectedPolicyHash: hash, expectedEvidenceHash: hash,
  expectedIncomeEvidenceHash: hash.optional(), expectedSchoolEvidenceHash: hash.optional(), asOf: instant }).strict();
// Validate the inner contracts through the existing matcher; never accept a precomputed match.
const schoolEvidenceSchema = z.object({ request: z.unknown(), address: z.unknown(), dataset: z.unknown(), expectedDataset: z.unknown() }).strict();
const held = (reason: string) => ({ status: "held" as const, executable: false as const, eligibilityConfirmed: false as const, reason });
type Match = "matched" | "outside" | "unknown";

/** Evaluate normalized, pinned evidence only. No prose parsing, tax conversion or publication. */
export function evaluateRentalFields(rawRequest: unknown, ruleHistory: unknown, policyHistory: unknown, rawEvidence: unknown, rawIncomeEvidence?: unknown, rawSchoolEvidence?: unknown) {
  try {
    const request = requestSchema.safeParse(rawRequest), evidence = rentalFieldEvidenceSchema.safeParse(rawEvidence);
    const policies = z.array(rentalEvaluationPolicySchema).max(1000).safeParse(policyHistory);
    if (!request.success || !evidence.success || !policies.success) return held("INVALID_RENTAL_EVALUATION_INPUT");
    const r = request.data, e = evidence.data;
    if (r.scope.market !== "residential_rental") return held("RENTAL_EVALUATION_MARKET_UNSUPPORTED");
    const selected = resolveRule(ruleHistory, r.scope, r.asOf);
    if (selected.status !== "selected") return held(selected.reason);
    if (selected.hash !== r.expectedRuleHash) return held("EVALUATION_RULE_CHANGED");
    const criteria = selected.rule.criteria;
    if (criteria.market !== "residential_rental") return held("RENTAL_EVALUATION_MARKET_UNSUPPORTED");
    const matching = policies.data.filter(p => contentHash(p.scope) === contentHash(r.scope));
    if (new Set(matching.map(p => `${p.id}:${p.version}`)).size !== matching.length) return held("DUPLICATE_EVALUATION_POLICY_VERSION");
    const started = matching.filter(p => p.effectiveFrom <= r.asOf);
    if (!started.length) return held("NO_EFFECTIVE_EVALUATION_POLICY");
    if (new Set(started.map(p => p.id)).size !== 1) return held("AMBIGUOUS_EVALUATION_POLICY_FAMILY");
    const policy = started.sort((a, b) => b.version - a.version)[0];
    if (started.some(p => p.version < policy.version && p.effectiveFrom > policy.effectiveFrom)) return held("EVALUATION_POLICY_HISTORY_ORDER");
    if (policy.status !== "approved" || !policy.approvedAt || policy.approvedAt > r.asOf || !policy.approvalRef) return held("EVALUATION_POLICY_NOT_APPROVED");
    if (policy.effectiveUntil && r.asOf >= policy.effectiveUntil) return held("EVALUATION_POLICY_EXPIRED");
    if (contentHash(policy) !== r.expectedPolicyHash || policy.ruleHash !== selected.hash) return held("EVALUATION_POLICY_CHANGED");
    if ([policy.rentBasis, policy.minimumInclusive, policy.maximumInclusive, policy.roomCountBasis, policy.allowedKitchens, policy.normalizationContractRef].some(v => v === null)) return held("EVALUATION_SEMANTICS_UNRESOLVED");
    const additional = policy.additionalChecks;
    const incomeSelection = criteria.rentSelectionBasis === "company_income_total";
    if (incomeSelection && additional?.incomeBasis !== "company_total_including_ad") return held("INCOME_SELECTION_NOT_CONFIGURED");
    if (additional && Object.values(additional).some(v => v === null)) return held("EVALUATION_SEMANTICS_UNRESOLVED");
    if (!additional && (rawIncomeEvidence !== undefined || r.expectedIncomeEvidenceHash !== undefined || e.sourcePropertyUpdate !== undefined)) return held("EVALUATION_EXTENSION_NOT_CONFIGURED");
    if (contentHash(e) !== r.expectedEvidenceHash || e.sourceHash !== r.sourceHash || contentHash(e.binding) !== contentHash(r.binding)) return held("RENTAL_EVIDENCE_MISMATCH");
    if (e.normalization !== "confirmed" || e.normalizationContractRef !== policy.normalizationContractRef) return held("RENTAL_NORMALIZATION_UNCONFIRMED");
    if (e.observedAt > r.asOf) return held("RENTAL_EVIDENCE_FROM_FUTURE");
    const maxAgeMs = (criteria.maxEvidenceAgeHours ?? 0) * 3_600_000;
    if (!Number.isFinite(maxAgeMs) || maxAgeMs <= 0 || maxAgeMs > Number.MAX_SAFE_INTEGER) return held("RENTAL_EVIDENCE_AGE_UNREPRESENTABLE");
    if (Date.parse(r.asOf) - Date.parse(e.observedAt) >= maxAgeMs) return held("RENTAL_EVIDENCE_EXPIRED");
    // resolveRule has already required these settings; keep the narrowing explicit.
    if ((!incomeSelection && (criteria.rentMinYen === null || criteria.rentMaxYen === null)) || criteria.minLayoutRooms === null || !criteria.leaseTypes) return held("RULE_SETTINGS_UNRESOLVED");
    const rent = e.rentYen === null || (policy.rentBasis === "rent_plus_management" && e.managementYen === null)
      ? null : BigInt(e.rentYen) + (policy.rentBasis === "rent_plus_management" ? BigInt(e.managementYen!) : BigInt(0));
    let rentCheck: Match | "not_applicable" = rent === null ? "unknown" : "not_applicable";
    if (!incomeSelection && rent !== null) {
      const lower = BigInt(criteria.rentMinYen!), upper = BigInt(criteria.rentMaxYen!);
      rentCheck = (policy.minimumInclusive ? rent >= lower : rent > lower) && (policy.maximumInclusive ? rent <= upper : rent < upper) ? "matched" : "outside";
    }
    const checks: Record<string, Match | "not_applicable"> = {
      rent: rentCheck,
      mainRooms: e.mainRooms === null ? "unknown" : e.mainRooms >= criteria.minLayoutRooms ? "matched" : "outside",
      kitchen: e.kitchen === null ? "unknown" : policy.allowedKitchens!.includes(e.kitchen) ? "matched" : "outside",
      leaseType: e.leaseType === null ? "unknown" : criteria.leaseTypes.includes(e.leaseType) ? "matched" : "outside",
    };
    if (policy.layoutAlternatives) {
      checks.layoutAlternative = e.mainRooms === null || e.kitchen === null ? "unknown" : policy.layoutAlternatives.some(a =>
        e.mainRooms! >= a.minimumMainRooms && (a.maximumMainRooms === null || e.mainRooms! <= a.maximumMainRooms) && a.kitchens.includes(e.kitchen!)) ? "matched" : "outside";
    }
    const exception = policy.fixedLeaseSchoolException;
    if (exception && criteria.leaseTypes.includes("fixed")) return held("FIXED_LEASE_SCOPE_CONFLICT");
    const hasSchoolEvidence = rawSchoolEvidence !== undefined || r.expectedSchoolEvidenceHash !== undefined;
    if (hasSchoolEvidence && (!exception || e.leaseType !== "fixed")) return held("SCHOOL_EXCEPTION_EVIDENCE_NOT_APPLICABLE");
    let schoolEvidenceHash: string | undefined;
    if (exception && e.leaseType === "fixed") {
      checks.leaseType = "unknown";
      if (hasSchoolEvidence) {
        const school = schoolEvidenceSchema.safeParse(rawSchoolEvidence);
        if (!school.success || !r.expectedSchoolEvidenceHash) return held("INVALID_SCHOOL_EXCEPTION_EVIDENCE");
        if (contentHash(school.data) !== r.expectedSchoolEvidenceHash) return held("SCHOOL_EXCEPTION_EVIDENCE_MISMATCH");
        if (exception.academicYear === null || exception.applicableOn === null) return held("SCHOOL_EXCEPTION_APPLICABILITY_UNRESOLVED");
        const s = school.data;
        const result = matchSchoolEvidence(s.request, s.address, s.dataset, s.expectedDataset, r.asOf);
        if (result.status !== "matched") return held(result.reason);
        const ref = result.reference;
        if (ref.binding.propertyId !== r.binding.propertyId || ref.binding.episodeId !== r.binding.episodeId
          || ref.binding.sourceVersion.fullHash !== r.sourceHash || ref.binding.sourceVersion.updatedAt > e.observedAt) return held("SCHOOL_EXCEPTION_BINDING_MISMATCH");
        if (ref.schoolType !== "elementary" || ref.academicYear !== exception.academicYear || ref.applicableOn !== exception.applicableOn) return held("SCHOOL_EXCEPTION_APPLICABILITY_MISMATCH");
        checks.leaseType = ref.municipalityRef === exception.municipalityRef && exception.schoolRefs.includes(ref.schoolRef) ? "matched" : "outside";
        schoolEvidenceHash = r.expectedSchoolEvidenceHash;
      }
    }
    if (additional) {
      const area = additional.minimumArea!;
      const areaApplies = e.mainRooms !== null && e.mainRooms < area.mainRoomsAtLeast || e.kitchen !== null && !area.kitchens.includes(e.kitchen)
        ? false : e.mainRooms === null || e.kitchen === null ? null : true;
      checks.minimumArea = areaApplies === false ? "not_applicable" : areaApplies === null || e.areaSqm === null ? "unknown" : e.areaSqm >= area.sqm ? "matched" : "outside";

      const updateAgeMs = additional.propertyUpdateWindow!.maxAgeHours * 3_600_000;
      if (!Number.isFinite(updateAgeMs) || updateAgeMs <= 0 || updateAgeMs > Number.MAX_SAFE_INTEGER) return held("PROPERTY_UPDATE_WINDOW_UNREPRESENTABLE");
      const update = e.sourcePropertyUpdate;
      if (update?.updatedAt && update.updatedAt > e.observedAt) return held("PROPERTY_UPDATE_AFTER_OBSERVATION");
      checks.propertyUpdate = !update?.updatedAt || !update.evidenceRef || update.basis !== "source_listing_update" ? "unknown"
        : Date.parse(r.asOf) - Date.parse(update.updatedAt) <= updateAgeMs ? "matched" : "outside";

      checks.internalIncome = "unknown";
      if (rawIncomeEvidence !== undefined || r.expectedIncomeEvidenceHash !== undefined) {
        const income = incomeEvidenceSchema.safeParse(rawIncomeEvidence);
        if (!income.success || !r.expectedIncomeEvidenceHash) return held("INVALID_INCOME_EVIDENCE");
        const i = income.data;
        if (contentHash(i) !== r.expectedIncomeEvidenceHash || i.sourceHash !== r.sourceHash || contentHash(i.binding) !== contentHash(r.binding)) return held("INCOME_EVIDENCE_MISMATCH");
        if (i.observedAt > r.asOf) return held("INCOME_EVIDENCE_FROM_FUTURE");
        if (Date.parse(r.asOf) - Date.parse(i.observedAt) >= maxAgeMs) return held("INCOME_EVIDENCE_EXPIRED");
        if (i.normalization === "confirmed" && i.normalizationContractRef === policy.normalizationContractRef && i.evidenceRef
          && i.basis === additional.incomeBasis && i.taxBasis === criteria.incomeTaxBasis && i.certainty === "confirmed" && i.totalYen !== null) {
          checks.internalIncome = i.totalYen >= criteria.companyIncomeMinYen! ? "matched" : "outside";
        }
      }
    }
    const values = Object.values(checks);
    const fieldVerdict: Match = values.includes("outside") ? "outside" : values.includes("unknown") ? "unknown" : "matched";
    const areaPreference = criteria.preferredAreaSqm === null ? "not_configured" : e.areaSqm === null ? "unknown" : e.areaSqm >= criteria.preferredAreaSqm ? "met" : "below_preference";
    return { status: "evaluated" as const, executable: false as const, eligibilityConfirmed: false as const, fieldVerdict, checks, areaPreference,
      reference: { ruleHash: selected.hash, policyHash: r.expectedPolicyHash, evidenceHash: r.expectedEvidenceHash,
        ...(schoolEvidenceHash ? { schoolEvidenceHash } : {}),
        ...(additional && r.expectedIncomeEvidenceHash ? { incomeEvidenceHash: r.expectedIncomeEvidenceHash } : {}), evaluatedAt: r.asOf },
      pendingGates: ["SOURCE_AND_NORMALIZATION_AUTHENTICITY", "SCHOOL_SCOPE", additional ? "INTERNAL_INCOME_AUTHENTICITY" : "INTERNAL_INCOME", "PERMISSION_AND_PUBLICATION_GATES"] as const };
  } catch { return held("RENTAL_EVALUATION_FAILED"); }
}
