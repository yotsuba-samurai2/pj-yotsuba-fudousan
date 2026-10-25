import { createHash } from "node:crypto";
import { z } from "zod";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const instant = z.iso.datetime({ precision: 3 });
const amount = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).nullable();
const positive = z.number().positive().finite().nullable();
export const scopeSchema = z.object({
  market: z.enum(["residential_rental", "sale", "business"]),
  audience: z.enum(["global", "client"]), clientRef: id.nullable(),
}).strict().refine(s => s.audience === "global" ? s.clientRef === null : s.clientRef !== null);
const criteria = z.discriminatedUnion("market", [
  z.object({ market: z.literal("residential_rental"), rentMinYen: amount, rentMaxYen: amount,
    rentSelectionBasis: z.enum(["rent_range", "company_income_total"]).optional(),
    minLayoutRooms: z.number().int().positive().nullable(), preferredAreaSqm: positive,
    leaseTypes: z.array(z.enum(["ordinary", "fixed"])).nonempty().nullable(), schoolScopeRef: id.nullable(),
    companyIncomeMinYen: amount, incomeTaxBasis: z.enum(["included", "excluded"]).nullable(), maxEvidenceAgeHours: positive }).strict(),
  z.object({ market: z.literal("sale"), priceMinYen: amount, priceMaxYen: amount,
    assetTypes: z.array(id).nonempty().nullable(), maxEvidenceAgeHours: positive }).strict(),
  z.object({ market: z.literal("business"), rentMinYen: amount, rentMaxYen: amount,
    useClasses: z.array(id).nonempty().nullable(), maxEvidenceAgeHours: positive }).strict(),
]);
export const ruleSchema = z.object({
  id, version: z.number().int().positive().max(Number.MAX_SAFE_INTEGER), scope: scopeSchema,
  effectiveFrom: instant, effectiveUntil: instant.nullable(),
  status: z.enum(["pending", "approved", "revoked"]), approvedAt: instant.nullable(), approvalRef: id.nullable(), criteria,
}).strict().superRefine((r, ctx) => {
  if (r.scope.market !== r.criteria.market || (r.effectiveUntil && r.effectiveUntil <= r.effectiveFrom)) ctx.addIssue({ code: "custom", message: "INVALID_RULE" });
  const c = r.criteria, min = c.market === "sale" ? c.priceMinYen : c.rentMinYen, max = c.market === "sale" ? c.priceMaxYen : c.rentMaxYen;
  if (min !== null && max !== null && min > max) ctx.addIssue({ code: "custom", message: "INVALID_RANGE" });
  if (c.market === "residential_rental" && c.rentSelectionBasis === "company_income_total" && (min !== null || max !== null)) {
    ctx.addIssue({ code: "custom", message: "INCOME_SELECTION_WITH_RENT_RANGE" });
  }
});
export type SyncRule = z.infer<typeof ruleSchema>;
export type RuleScope = z.infer<typeof scopeSchema>;
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(",")}}`;
  return JSON.stringify(value);
}
export const contentHash = (value: unknown): string => createHash("sha256").update(canonicalJson(value)).digest("hex");
type Held = { status: "held"; executable: false; reason: string };
export type RuleResolution = Held | { status: "selected"; executable: false; rule: SyncRule; hash: string; resolvedAt: string };

/** Select only within an exact scope. No defaults, customer inheritance or fallback to an older version. */
export function resolveRule(history: unknown, requested: unknown, asOf: string): RuleResolution {
  const parsed = z.array(ruleSchema).max(1000).safeParse(history), scope = scopeSchema.safeParse(requested);
  const held = (reason: string): Held => ({ status: "held", executable: false, reason });
  if (!parsed.success || !scope.success || !instant.safeParse(asOf).success) return held("INVALID_RULE_INPUT");
  const matching = parsed.data.filter(r => canonicalJson(r.scope) === canonicalJson(scope.data));
  const identities = matching.map(r => `${r.id}:${r.version}`);
  if (new Set(identities).size !== identities.length) return held("DUPLICATE_RULE_VERSION");
  const started = matching.filter(r => r.effectiveFrom <= asOf);
  if (!started.length) return held("NO_EFFECTIVE_RULE");
  if (new Set(started.map(r => r.id)).size !== 1) return held("AMBIGUOUS_RULE_FAMILY");
  const rule = [...started].sort((a, b) => b.version - a.version)[0];
  // A higher version with an earlier start than an older version is an ambiguous history.
  if (started.some(r => r.version < rule.version && r.effectiveFrom > rule.effectiveFrom)) return held("RULE_HISTORY_ORDER");
  if (rule.status !== "approved" || !rule.approvalRef || !rule.approvedAt || rule.approvedAt > asOf) return held("RULE_NOT_APPROVED");
  if (rule.effectiveUntil && asOf >= rule.effectiveUntil) return held("RULE_EXPIRED");
  const incomeSelection = rule.criteria.market === "residential_rental" && rule.criteria.rentSelectionBasis === "company_income_total";
  if (Object.entries(rule.criteria).some(([k, v]) => k !== "preferredAreaSqm"
    && !(incomeSelection && (k === "rentMinYen" || k === "rentMaxYen")) && v === null)) return held("RULE_SETTINGS_UNRESOLVED");
  return { status: "selected", executable: false, rule: structuredClone(rule), hash: contentHash(rule), resolvedAt: asOf };
}

/** A selected rule is a planning input, never an execution authorization. */
export function rulePlanReference(result: RuleResolution) {
  return result.status === "selected"
    ? { executable: false as const, ruleId: result.rule.id, version: result.rule.version, scope: result.rule.scope, ruleHash: result.hash, resolvedAt: result.resolvedAt }
    : { executable: false as const, reason: result.reason };
}
