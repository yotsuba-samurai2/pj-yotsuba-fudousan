import { describe, expect, it } from "vitest";
import { fixture, NOW } from "./fixtures";
import { rentalContentDigest } from "../content-review";
import { adYenUpperLimit, subtrackIncomeYen, tenantFeeYen } from "../candidates";
import { validateRentalImport, type RentalImport } from "../validation";

type Fee = "full" | "half" | "free";
function candidate(rent = 250000, ad = "AD 100%", fee: Fee | null = "full", provider: "eslife" | "itandi" = "eslife"): RentalImport {
  const v: RentalImport = fixture();
  delete v.email; delete v.reins;
  const url = provider === "eslife" ? "https://rent.es-square.net/bukken/chintai/search/detail/es-001" : "https://itandibb.com/rent_rooms/12345";
  v.source.provider = provider;
  v.source.roomId = provider === "eslife" ? "es-001" : "12345";
  v.source.url = url;
  v.source.address = "東京都文京区小石川1-1-1";
  v.source.building = "いい生活テストマンション";
  v.source.unit = "101";
  v.source.availability = "available";
  v.source.checkedAt = NOW.toISOString();
  v.source.listingEvidence = { ...v.source.listingEvidence, reference: url, quote: "募集中・広告可" };
  v.source.rent = { yen: rent, evidence: { ...v.source.rent.evidence, reference: url, quote: `賃料${rent}円` } };
  v.source.adQuote = ad;
  v.source.applicationStatus = "not-applied";
  v.source.advertising = { status: "allowed", evidence: { ...v.source.listingEvidence, quote: "広告可" } };
  v.property.title = "いい生活テストマンション 101";
  v.property.locationText = v.source.address;
  v.property.priceYen = rent;
  if (v.property.spec.dealType === "rental") {
    if (fee) v.property.spec.brokerFee = fee;
    else delete v.property.spec.brokerFee;
  }
  v.intake = { kind: "portal-search", policy: "eslife-new-income400k", updateEvidence: { ...v.source.listingEvidence, quote: "掲載確認" } };
  v.contentReview = { ...v.contentReview!, digest: rentalContentDigest(v.property) };
  return v;
}

describe("サブトラック：いい生活の新着（AD＋借主手数料 40万円超）", () => {
  it.each([
    [200000, "full", 220000], [200000, "half", 110000], [200000, "free", 0],
  ] as const)("借主手数料 賃料%i円 %s → %i円", (rent, fee, yen) => expect(tenantFeeYen(rent, fee)).toBe(yen));

  it.each([
    ["AD 100%", 250000, 250000], ["広告費:賃料の100.00%迄相談", 250000, 250000], ["広告費:56.80万円迄相談", 250000, 568000],
    ["AD 2ヶ月まで", 200000, 400000], ["ADなし", 300000, 0], ["AD -", 300000, 0], ["-", 300000, null], ["AD 相談", 300000, null],
    ["AD 1ヶ月 AD 2ヶ月", 200000, null], ["AD 2ヶ月（10月末で終了）", 200000, null],
  ] as const)("AD「%s」賃料%i円 → %s", (quote, rent, yen) => expect(adYenUpperLimit(quote, rent)).toBe(yen));

  it("手数料満額＋AD1か月で40万円超なら公開できる", () => {
    const result = validateRentalImport(candidate(250000, "AD 100%", "full"), NOW, "published");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.property.internal?.rentalImport).toMatchObject({ intake: { kind: "portal-search", policy: "eslife-new-income400k" } });
  });
  it("80万円未満でもサブトラックなら登録できる（メイン方針なら拒否）", () => {
    expect(subtrackIncomeYen("AD 100%", 250000, "full")).toBe(525000);
    expect(validateRentalImport(candidate(250000, "AD 100%", "full"), NOW).ok).toBe(true);
    const main = candidate(250000, "AD 100%", "full"); main.intake!.policy = "bunkyo-income800k";
    expect(validateRentalImport(main, NOW).ok).toBe(false);
  });
  it("「迄相談」の上限を確定額として扱う", () => expect(validateRentalImport(candidate(250000, "広告費:賃料の100.00%迄相談", "full"), NOW).ok).toBe(true));
  it("手数料を半額にすると40万円以下になる部屋は拒否する", () => {
    expect(subtrackIncomeYen("AD 100%", 250000, "half")).toBe(387500);
    const result = validateRentalImport(candidate(250000, "AD 100%", "half"), NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reasons.join()).toContain("40万円以下");
  });
  it("ちょうど40万円は拒否する（超える場合だけ）", () => {
    expect(subtrackIncomeYen("AD 2ヶ月", 200000, "free")).toBe(400000);
    expect(validateRentalImport(candidate(200000, "AD 2ヶ月", "free"), NOW).ok).toBe(false);
  });
  it("借主手数料の設定がなければ拒否する", () => {
    const result = validateRentalImport(candidate(250000, "AD 100%", null), NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reasons.join()).toContain("借主の仲介手数料");
  });
  it("ITANDIの部屋には使えない", () => {
    const result = validateRentalImport(candidate(250000, "AD 100%", "full", "itandi"), NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reasons.join()).toContain("いい生活の物件だけ");
  });
  it("申込あり・文京区以外は拒否する", () => {
    const applied = candidate(); applied.source.applicationStatus = "applied";
    expect(validateRentalImport(applied, NOW).ok).toBe(false);
    const outside = candidate(); outside.source.address = "東京都新宿区新宿1丁目"; outside.property.locationText = outside.source.address;
    expect(validateRentalImport(outside, NOW).ok).toBe(false);
  });
});
