import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { fixture } from "./fixtures";
import { CURRENT_RENTAL_ADOPTION_POLICY as policy, PREVIOUS_RENTAL_ADOPTION_POLICY, rentalAdoptionPolicyAt, requiresCompanyIncome } from "../adoption-policy";
import { selectMailCandidates } from "../candidates";
import { validateRentalImport, type RentalImport } from "../validation";
import { rentalContentDigest } from "../content-review";
import { rentalPublicationError } from "../publication";
import { toPublicProperty } from "../../property-shared";

const now = new Date("2026-11-08T09:11:26.000Z");
function candidate(): RentalImport {
  const v: RentalImport = fixture();
  v.version = 2; delete v.reins;
  v.email!.receivedAt = now.toISOString();
  v.source.checkedAt = now.toISOString();
  v.source.listingEvidence.checkedAt = now.toISOString();
  v.source.rent.evidence.checkedAt = now.toISOString();
  v.source.advertising = { status: "allowed", evidence: { checkedAt: now.toISOString(), reference: v.source.url, quote: "広告掲載可" } };
  v.photoPermission!.evidence.checkedAt = now.toISOString();
  v.contentReview = { checkedAt: now.toISOString(), digest: rentalContentDigest(v.property), locales: ["ja"], reference: "synthetic-reviewed-content" };
  return v;
}
beforeEach(() => vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://demo.supabase.co"));
afterEach(() => vi.unstubAllEnvs());

it.each(["draft", "published"] as const)("報酬根拠なしで%sの通常検証を通過する", mode => {
  const result = validateRentalImport(candidate(), now, mode);
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.property.internal?.rentalImport).toMatchObject({ adoptionPolicy: policy });
});

it.each([0, 199999, 200000, null])("任意の報酬額%s円は掲載条件にしない", totalYen => {
  const v = candidate();
  const { provider, roomId, building, address, unit } = v.source;
  v.companyIncome = { totalYen, basis: "unknown", taxBasis: "unknown", certainty: "unknown",
    source: { provider, roomId, building, address, unit }, messageId: null, reviewerRef: null,
    evidence: { checkedAt: "2026-09-01T00:00:00Z", reference: "synthetic-history", quote: "PRIVATE_INCOME_CANARY" } };
  const result = validateRentalImport(v, now, "published");
  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(rentalPublicationError(result.property, now)).toBeNull();
    expect(JSON.stringify(toPublicProperty(result.property))).not.toMatch(/companyIncome|PRIVATE_INCOME_CANARY|adoptionPolicy/);
  }
});

it.each(["publication-evidence-only-v2", "company-total-tax-included-200k-v1", "bunkyo-income800k", "eslife-new-income400k", "bunkyo-p033-income300k", "bunkyo-rent200k-ad30-or-rent250k"])("直接検索の%sも旧報酬条件に戻らない", id => {
  const v = candidate(); delete v.email;
  v.intake = { kind: "portal-search", policy: id as NonNullable<RentalImport["intake"]>["policy"], updateEvidence: v.source.listingEvidence };
  v.source.adQuote = "ADなし";
  expect(validateRentalImport(v, now, "published").ok).toBe(true);
});

it("報酬なし・AD額不明のメールも候補にし、受信7日の期限と重複排除は維持する", () => {
  const mail = { id: "synthetic-mail", receivedAt: now.toISOString(), subject: "合成物件", text: "掲載条件は別途確認" };
  expect(selectMailCandidates([mail, mail], now)).toMatchObject([{ decision: "candidate", policy: policy.id, reason: null }]);
  expect(selectMailCandidates([{ ...mail, receivedAt: new Date(now.getTime() - 168 * 3600_000 - 1).toISOString() }], now)).toEqual([]);
});

it("通常管理画面の公開と既存物件の再確認も報酬だけでは止めない", () => {
  const v = candidate(); v.email!.receivedAt = "2026-09-01T00:00:00Z";
  expect(validateRentalImport(v, now, "published").ok).toBe(false);
  const result = validateRentalImport(v, now, "published", true);
  expect(result.ok).toBe(true);
  if (result.ok) expect(rentalPublicationError(result.property, now, result.property)).toBeNull();
});

it.each([
  ["募集終了", (v: RentalImport) => { v.source.availability = "closed"; }],
  ["申込済み", (v: RentalImport) => { v.source.applicationStatus = "applied"; }],
  ["号室未照合", (v: RentalImport) => { v.source.listingEvidence.exactRoomMatched = false; }],
  ["認証なし", (v: RentalImport) => { v.source.listingEvidence.authenticated = false; }],
  ["募集根拠期限切れ", (v: RentalImport) => { v.source.listingEvidence.checkedAt = "2026-09-01T00:00:00Z"; }],
  ["賃料根拠期限切れ", (v: RentalImport) => { v.source.rent.evidence.checkedAt = "2026-09-01T00:00:00Z"; }],
  ["広告許可なし", (v: RentalImport) => { delete v.source.advertising; }],
  ["広告期限切れ", (v: RentalImport) => { v.source.adValidUntil = "2026-09-01T00:00:00Z"; }],
  ["未解決条件", (v: RentalImport) => { v.conflicts = ["合成条件が一致しない"]; }],
  ["本文照合なし", (v: RentalImport) => { delete v.contentReview; }],
  ["本文照合後の変更", (v: RentalImport) => { v.property.description += " 変更"; }],
  ["翻訳照合不足", (v: RentalImport) => { v.property.locales = ["ja", "en"]; v.contentReview!.digest = rentalContentDigest(v.property); }],
  ["写真なし", (v: RentalImport) => { v.property.images = v.property.images.filter(i => i.kind !== "photo"); }],
  ["間取りなし", (v: RentalImport) => { v.property.images = v.property.images.filter(i => i.kind !== "floorplan"); }],
] as const)("報酬規定廃止後も%sは拒否する", (_label, change) => {
  const v = candidate(); change(v);
  const result = validateRentalImport(v, now, "published");
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasons.join(" ")).not.toContain("当社報酬");
});

it("改定時刻の直前だけ旧報酬条件を適用し、改定時刻からは復活させない", () => {
  const before = new Date(now.getTime() - 1);
  expect(requiresCompanyIncome(before)).toBe(true);
  expect(rentalAdoptionPolicyAt(before)).toBe(PREVIOUS_RENTAL_ADOPTION_POLICY);
  expect(requiresCompanyIncome(now)).toBe(false);
  expect(rentalAdoptionPolicyAt(now)).toBe(policy);
  expect(rentalAdoptionPolicyAt(new Date("2027-01-01T00:00:00Z"))).toBe(policy);
});
