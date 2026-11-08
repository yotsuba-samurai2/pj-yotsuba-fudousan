import { z } from "zod";
import { evidenceSchema, isCurrentEvidence } from "./policy";

/** Historical policy, retained only to reproduce decisions before the user removed the income gate. */
export const PREVIOUS_RENTAL_ADOPTION_POLICY = Object.freeze({
  id: "company-total-tax-included-200k-v1", version: 1,
  effectiveFrom: "2026-10-26T00:25:34.000Z", approvalRef: "user-20261026-mail-income-override",
  mailMaxAgeHours: 168, minimumTotalYen: 200_000,
  basis: "company_total_including_ad", taxBasis: "included", boundary: "inclusive",
} as const);
/** 2026-11-08 user instruction: income amount/evidence must not block property publication. */
export const CURRENT_RENTAL_ADOPTION_POLICY = Object.freeze({
  id: "publication-evidence-only-v2", version: 2,
  effectiveFrom: "2026-11-08T09:11:26.000Z", approvalRef: "user-20261108-remove-income-publication-gate",
  mailMaxAgeHours: 168, companyIncomeRequired: false,
} as const);
export const requiresCompanyIncome = (now: Date) => !Number.isFinite(now.getTime())
  || now.getTime() < Date.parse(CURRENT_RENTAL_ADOPTION_POLICY.effectiveFrom);
export const rentalAdoptionPolicyAt = (now: Date) => requiresCompanyIncome(now)
  ? PREVIOUS_RENTAL_ADOPTION_POLICY : CURRENT_RENTAL_ADOPTION_POLICY;
export const usesCurrentAdoptionPolicy = (now: Date) => Number.isFinite(now.getTime())
  && now.getTime() >= Date.parse(PREVIOUS_RENTAL_ADOPTION_POLICY.effectiveFrom);

const identity = z.object({ provider: z.enum(["itandi", "eslife", "reins", "other"]), roomId: z.string().min(1).max(100),
  building: z.string().trim().min(1).max(300), address: z.string().trim().min(1).max(300), unit: z.string().trim().min(1).max(30) }).strict();
export const companyIncomeEvidenceSchema = z.object({
  totalYen: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).nullable(),
  basis: z.enum(["company_total_including_ad", "other", "unknown"]),
  taxBasis: z.enum(["included", "excluded", "unknown"]), certainty: z.enum(["confirmed", "conditional", "unknown"]),
  source: identity, messageId: z.string().min(1).max(100).nullable(),
  reviewerRef: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/).nullable(), evidence: evidenceSchema,
}).strict();
export type CompanyIncomeEvidence = z.infer<typeof companyIncomeEvidenceSchema>;

/** Historical income check only: no AD/month/tax/tenant-fee arithmetic or fallback. */
export function checkCurrentCompanyIncome(raw: unknown, expected: { source?: unknown; messageId: string | null }, now: Date) {
  const parsed = companyIncomeEvidenceSchema.safeParse(raw);
  if (!parsed.success) return "当社報酬総額の確認記録がありません";
  const e = parsed.data;
  if (e.messageId !== expected.messageId) return "当社報酬の確認記録が対象メールと一致しません";
  if (expected.source !== undefined) {
    const source = identity.safeParse(expected.source);
    if (!source.success) return "当社報酬の照合元が不正です";
    const norm = (v: string) => v.normalize("NFKC").replace(/\s/g, "").toLowerCase();
    if (e.source.provider !== source.data.provider || e.source.roomId !== source.data.roomId
      || (["building", "address", "unit"] as const).some(k => norm(e.source[k]) !== norm(source.data[k]))) return "当社報酬の確認記録が対象物件と一致しません";
  }
  if (e.totalYen === null || e.basis !== PREVIOUS_RENTAL_ADOPTION_POLICY.basis || e.taxBasis !== PREVIOUS_RENTAL_ADOPTION_POLICY.taxBasis
    || e.certainty !== "confirmed" || !e.reviewerRef || !isCurrentEvidence(e.evidence.checkedAt, now)) return "AD込みの当社報酬総額・税込・確定額を最新の根拠で確認してください";
  return e.totalYen >= PREVIOUS_RENTAL_ADOPTION_POLICY.minimumTotalYen ? null : "AD込み・税込の当社報酬総額が20万円未満です";
}
