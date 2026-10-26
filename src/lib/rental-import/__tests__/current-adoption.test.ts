import { afterEach, expect, it, vi } from "vitest";
import { fixture } from "./fixtures";
import { CURRENT_RENTAL_ADOPTION_POLICY as policy, type CompanyIncomeEvidence } from "../adoption-policy";
import { isRecentMail, selectMailCandidates } from "../candidates";
import { validateRentalImport, type RentalImport } from "../validation";
import { rentalContentDigest } from "../content-review";
import { rentalPublicationError } from "../publication";
import { toPublicProperty } from "../../property-shared";

const now = new Date("2026-10-26T00:25:35.000Z"), windowMs = 168 * 3600_000;
function current(totalYen = 200000) {
  const v: RentalImport = fixture(); v.version = 2; delete v.reins;
  v.email!.receivedAt = now.toISOString();
  v.source.checkedAt = now.toISOString();
  v.source.listingEvidence.checkedAt = now.toISOString();
  v.source.rent.evidence.checkedAt = now.toISOString();
  v.source.advertising = { status: "allowed", evidence: { checkedAt: now.toISOString(), reference: v.source.url, quote: "広告掲載可" } };
  const { provider, roomId, building, address, unit } = v.source;
  v.companyIncome = { totalYen, basis: "company_total_including_ad", taxBasis: "included", certainty: "confirmed",
    source: { provider, roomId, building, address, unit }, messageId: v.email!.messageId, reviewerRef: "synthetic-reviewer",
    evidence: { checkedAt: now.toISOString(), reference: "synthetic-income-confirmation", quote: "AD込み当社報酬総額の確認 PRIVATE_INCOME_CANARY" } };
  v.contentReview = { checkedAt: now.toISOString(), digest: rentalContentDigest(v.property), locales: ["ja"], reference: "synthetic-content-review" };
  return v as RentalImport & { companyIncome: CompanyIncomeEvidence; email: NonNullable<RentalImport["email"]> };
}
afterEach(() => vi.unstubAllEnvs());

it.each([[199999, false], [200000, true], [200001, true]])("税込報酬総額%s円の境界は%s", (total, accepted) => {
  const v = current(total), result = validateRentalImport(v, now);
  expect(result.ok).toBe(accepted);
  if (!result.ok) expect(result.reasons).toContain("AD込み・税込の当社報酬総額が20万円未満です");
  else expect(result.property.internal?.rentalImport).toMatchObject({ adoptionPolicy: policy, companyIncome: { totalYen: total } });
});

it("AD・賃料・借主手数料を総額に二重加算せず、ADなしでも総額の根拠で判定する", () => {
  const tooLow = current(199999); tooLow.source.adQuote = "AD100ヶ月"; tooLow.email.adQuote = "AD100ヶ月";
  expect(validateRentalImport(tooLow, now).ok).toBe(false);
  const enough = current(); enough.source.adQuote = "ADなし"; enough.email.adQuote = "ADなし";
  expect(validateRentalImport(enough, now).ok).toBe(true);
});

it.each(["missing", "amount-unknown", "tax-excluded", "tax-unknown", "basis", "conditional", "reviewer", "expired", "future", "other-room", "other-message"])("%sの報酬根拠を旧AD条件で代用しない", kind => {
  const v: RentalImport = current(); const e = v.companyIncome!;
  if (kind === "missing") delete v.companyIncome;
  if (kind === "amount-unknown") e.totalYen = null;
  if (kind === "tax-excluded") e.taxBasis = "excluded";
  if (kind === "tax-unknown") e.taxBasis = "unknown";
  if (kind === "basis") e.basis = "other";
  if (kind === "conditional") e.certainty = "conditional";
  if (kind === "reviewer") e.reviewerRef = null;
  if (kind === "expired") e.evidence.checkedAt = new Date(now.getTime() - 24 * 3600_000 - 1).toISOString();
  if (kind === "future") e.evidence.checkedAt = new Date(now.getTime() + 1).toISOString();
  if (kind === "other-room") e.source.unit = "999";
  if (kind === "other-message") e.messageId = "unrelated";
  expect(validateRentalImport(v, now).ok).toBe(false);
});

it.each([[windowMs, true], [windowMs + 1, false], [-1, false]])("受信から%s msで新規採用=%s", (age, accepted) => {
  const v = current(); v.email.receivedAt = new Date(now.getTime() - age).toISOString();
  expect(isRecentMail(v.email.receivedAt, now)).toBe(accepted);
  expect(validateRentalImport(v, now).ok).toBe(accepted);
});

it.each(["company-total-tax-included-200k-v1", "bunkyo-income800k", "eslife-new-income400k", "bunkyo-p033-income300k", "bunkyo-rent200k-ad30-or-rent250k"] as const)("直接検索のID %sも現在は税込総額20万円だけで採算判定する", oldId => {
  const v: RentalImport = current(); delete v.email; v.companyIncome!.messageId = null;
  v.intake = { kind: "portal-search", policy: oldId, updateEvidence: v.source.listingEvidence };
  v.source.adQuote = "ADなし";
  expect(validateRentalImport(v, now).ok).toBe(true);
  v.companyIncome!.totalYen = 199999;
  expect(validateRentalImport(v, now).ok).toBe(false);
});

it("scanも7日以内・税込総額で判定し、AD月数だけのメールは要確認", () => {
  const v = current(), common = { id: v.email.messageId, receivedAt: now.toISOString(), subject: "合成物件", text: "AD2ヶ月", companyIncome: v.companyIncome };
  expect(selectMailCandidates([common], now)[0]).toMatchObject({ decision: "candidate", policy: policy.id });
  expect(selectMailCandidates([{ ...common, companyIncome: undefined }], now)[0]).toMatchObject({ decision: "review" });
  expect(selectMailCandidates([{ ...common, companyIncome: { ...v.companyIncome, totalYen: 199999 } }], now)[0]).toMatchObject({ decision: "excluded" });
  expect(selectMailCandidates([{ ...common, receivedAt: new Date(now.getTime() - windowMs - 1).toISOString() }], now)).toEqual([]);
});

it("通常公開ゲートにも新基準が届き、報酬根拠は公開projectionへ出ない", () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://demo.supabase.co");
  const v = current(), result = validateRentalImport(v, now, "published");
  expect(result.ok).toBe(true); if (!result.ok) return;
  expect(rentalPublicationError(result.property, now)).toBeNull();
  expect(JSON.stringify(toPublicProperty(result.property))).not.toMatch(/PRIVATE_INCOME_CANARY|companyIncome|reviewerRef|adoptionPolicy/);
  const changed = structuredClone(result.property);
  const proof = changed.internal!.rentalImport as { companyIncome: CompanyIncomeEvidence };
  proof.companyIncome.totalYen = 199999;
  expect(rentalPublicationError(changed, now, result.property)).toContain("20万円未満");
  expect(result.property.status).toBe("published");
});

it("既存物件の再確認は受信日だけで停止せず、現在の採算根拠は必要とする", () => {
  const v = current(); v.email.receivedAt = "2026-09-01T00:00:00.000Z";
  expect(validateRentalImport(v, now, "draft", true).ok).toBe(true);
  v.companyIncome.totalYen = 199999;
  expect(validateRentalImport(v, now, "draft", true).ok).toBe(false);
});
