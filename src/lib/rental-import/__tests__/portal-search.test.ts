import { describe, expect, it } from "vitest";
import { fixture, NOW } from "./fixtures";
import { rentalContentDigest } from "../content-review";
import { brokerIncomeYen } from "../candidates";
import { validateRentalImport, type RentalImport } from "../validation";

type Policy = "bunkyo-income800k" | "bunkyo-rent200k-ad30-or-rent250k";
function candidate(rent = 260000, ad = "AD 2ヶ月", policy: Policy = "bunkyo-income800k"): RentalImport {
  const v: RentalImport = fixture();
  delete v.email; delete v.reins;
  v.source.advertising = { status: "allowed", evidence: { ...v.source.listingEvidence, quote: "広告掲載可否 可" } };
  v.source.applicationStatus = "not-applied";
  v.source.rent.yen = rent;
  v.source.rent.evidence.quote = `賃料${rent}円`;
  v.source.adQuote = ad;
  v.property.priceYen = rent;
  v.intake = { kind: "portal-search", policy, updateEvidence: { ...v.source.listingEvidence, quote: "募集条件更新 7時間前" } };
  v.contentReview = { ...v.contentReview!, digest: rentalContentDigest(v.property) };
  return v;
}

describe("仲介手数料＋AD 80万円以上（直接検索）", () => {
  it.each([
    ["AD 2ヶ月", 260000, 806000], ["AD 200%(外税)", 373000, 1156300], ["広告料 52.6万円", 263000, 815300],
    ["AD 3ヶ月", 252000, 1033200], ["AD 1ヶ月(内税)", 580000, 1218000], ["ADなし", 800000, 880000],
  ])("%s 賃料%i円 → %i円", (ad, rent, income) => expect(brokerIncomeYen(ad, rent)).toBe(income));
  it.each(["AD 相談", "入力なし", "AD 2ヶ月まで", "AD 1ヶ月 AD 2ヶ月", "広告費：56.80万円迄相談"])("%s は確定できない", (ad) => expect(brokerIncomeYen(ad, 260000)).toBeNull());

  it("80万円以上はメールなし・更新時刻なしで公開できる", () => {
    const v = candidate(); v.intake!.updateEvidence.quote = "掲載確認";
    const result = validateRentalImport(v, NOW, "published");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.property.internal?.rentalImport).toMatchObject({ intake: { kind: "portal-search", policy: "bunkyo-income800k" } });
  });
  it("万円表記のADも判定する", () => expect(validateRentalImport(candidate(263000, "広告料 52.6万円"), NOW).ok).toBe(true));
  it.each([[250000, "AD 2ヶ月"], [260000, "AD 1ヶ月"], [263000, "広告料 50万円"]])("80万円未満 %i %s を拒否する", (rent, ad) => {
    const result = validateRentalImport(candidate(rent, ad), NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reasons.join()).toContain("80万円未満");
  });
  it("文京区以外は拒否する", () => {
    const v = candidate(); v.source.address = "東京都新宿区新宿1丁目"; v.property.locationText = v.source.address;
    expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it("申込あり・広告不可は高収入でも拒否する", () => {
    const v = candidate(400000, "AD 3ヶ月"); v.source.applicationStatus = "applied";
    expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.source.applicationStatus = "not-applied"; v.source.advertising!.status = "denied";
    expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it("現在の掲載確認が24時間を過ぎていれば拒否する", () => {
    const v = candidate(); v.source.listingEvidence.checkedAt = "2026-08-01T00:00:00Z";
    expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it("ITANJIの申込欄が空欄なら進める", () => {
    const v = candidate(); v.source.applicationStatus = "unknown";
    expect(validateRentalImport(v, NOW).ok).toBe(true);
  });
});

describe("旧方針（賃料20万円・AD30%）", () => {
  it("新規登録には使えない", () => {
    const result = validateRentalImport(candidate(200000, "AD30%", "bunkyo-rent200k-ad30-or-rent250k"), NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reasons.join()).toContain("80万円以上");
  });
  it("登録済み物件の再確認は現在の掲載証拠があれば通す", () => {
    const v = candidate(200000, "AD30%", "bunkyo-rent200k-ad30-or-rent250k"); v.intake!.updateEvidence.checkedAt = "2026-08-01T00:00:00Z";
    expect(validateRentalImport(v, NOW, "published", true).ok).toBe(true);
    v.source.listingEvidence.checkedAt = "2026-08-01T00:00:00Z";
    expect(validateRentalImport(v, NOW, "published", true).ok).toBe(false);
  });
  it("従来のメール取込の要件は保持する", () => {
    const v = candidate(200000, "AD30%"); delete v.intake;
    expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.email = fixture().email;
    expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
});
