import { describe, expect, it } from "vitest";
import { fixture, NOW } from "./fixtures";
import { rentalContentDigest } from "../content-review";
import { validateRentalImport, type RentalImport } from "../validation";

function candidate(rent = 200000, ad = "AD30%") : RentalImport {
  const v: RentalImport = fixture();
  delete v.email; delete v.reins;
  v.source.advertising = { status: "allowed", evidence: { ...v.source.listingEvidence, quote: "広告掲載可否 可" } };
  v.source.applicationStatus = "not-applied";
  v.source.rent.yen = rent;
  v.source.rent.evidence.quote = `賃料${rent}円`;
  v.source.adQuote = ad;
  v.property.priceYen = rent;
  v.intake = { kind: "portal-search", policy: "bunkyo-rent200k-ad30-or-rent250k", updateEvidence: { ...v.source.listingEvidence, quote: "募集条件更新 7時間前" } };
  v.contentReview = { ...v.contentReview!, digest: rentalContentDigest(v.property) };
  return v;
}
describe("文京区のポータル直接検索", () => {
  it("20万円・AD30%をメールなしで公開し、根拠を保持する", () => {
    const result = validateRentalImport(candidate(), NOW, "published");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.property.internal?.rentalImport).toMatchObject({ intake: { kind: "portal-search" } });
  });
  it.each([[199999,"AD200%"],[249999,"AD29%"]])("閾値外 %i %s を拒否する", (rent,ad) => expect(validateRentalImport(candidate(rent,ad), NOW).ok).toBe(false));
  it.each(["ADなし", "AD20%", "記載なし"])("25万円以上は %s でも対象にする", ad => expect(validateRentalImport(candidate(250000,ad), NOW).ok).toBe(true));
  it("文京区以外は拒否する", () => {
    const v=candidate(); v.source.address="東京都新宿区新宿1丁目"; v.property.locationText=v.source.address;
    expect(validateRentalImport(v,NOW).ok).toBe(false);
  });
  it.each(["募集条件更新 24時間前", "募集条件更新 昨日", "掲載確認 7時間前"])("更新証拠 %s は24時間以内とみなさない", quote => {
    const v=candidate(); v.intake!.updateEvidence.quote=quote;
    expect(validateRentalImport(v,NOW).ok).toBe(false);
  });
  it("証拠取得後の経過時間も更新の古さに含める", () => {
    const v=candidate(); v.intake!.updateEvidence.quote="募集条件更新 23時間前";
    v.intake!.updateEvidence.checkedAt=new Date(NOW.getTime()-2*3600000).toISOString();
    expect(validateRentalImport(v,NOW).ok).toBe(false);
  });
  it("申込あり・広告不可は高賃料でも拒否する", () => {
    const v=candidate(350000); v.source.applicationStatus="applied";
    expect(validateRentalImport(v,NOW).ok).toBe(false);
    v.source.applicationStatus="not-applied"; v.source.advertising!.status="denied";
    expect(validateRentalImport(v,NOW).ok).toBe(false);
  });
  it("ITANJIの空欄は進める", () => {
    const v=candidate(); v.source.applicationStatus="unknown";
    expect(validateRentalImport(v,NOW).ok).toBe(true);
  });
  it("既登録物件の再確認では初回検索の更新日時を使わず、現在の掲載証拠を必須にする", () => {
    const v=candidate(); v.intake!.updateEvidence.checkedAt="2026-08-01T00:00:00Z";
    expect(validateRentalImport(v,NOW,"published",true).ok).toBe(true);
    v.source.listingEvidence.checkedAt="2026-08-01T00:00:00Z";
    expect(validateRentalImport(v,NOW,"published",true).ok).toBe(false);
  });
  it("従来のメール取込の要件は保持する", () => {
    const v=candidate(); delete v.intake;
    expect(validateRentalImport(v,NOW).ok).toBe(false);
    v.email=fixture().email;
    expect(validateRentalImport(v,NOW).ok).toBe(false);
  });
});
