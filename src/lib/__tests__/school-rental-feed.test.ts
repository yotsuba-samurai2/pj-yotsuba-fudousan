import { describe, expect, it } from "vitest";
import { compileRentalSummaries, compileRentalMarket, splitUnit, fixLayoutAsBuilding, normalizeFeedUnits, feedSchema, monthlyTotal, sameUnit, nextWeeklyReviewAt, type RentalFeed, type FeedRecord } from "../school-rental-feed";
import { extractReinsRecord } from "../../../scripts/rental-import/reins-school-feed";
const now = new Date("2026-09-23T05:00:00Z");
function row(): FeedRecord {
  return { sourceId: "private-123", advertising: "allowed", advertisingQuote: "広告可", availability: "active", application: "none", applicationQuote: "申込数空欄（数値表示なし）", adQuote: "AD100%", adStatus: "confirmed", summary: {
    building: "試験マンション", unit: "0205", address: "東京都文京区千石１丁目２０－２０", rentYen: 250000, managementYen: 10000, commonYen: 0, deposit: "1ヶ月", keyMoney: "1ヶ月", layout: "2LDK", areaSqm: 60, availabilityText: "相談", pets: "unknown", foreignNationals: "unknown", corporate: "unknown", petTerms: "", foreignTerms: "", corporateTerms: "", buildingType: "マンション", access: "都営三田線 千石 徒歩5分", built: "2000年1月", structure: "RC", floors: "3階", contractType: "普通借家", contractPeriod: "2年", guaranteeDeposit: "", renewalFee: "", insurance: "", guarantor: "", otherFees: "",
    companyHousing: "unknown", companyHousingTerms: "",
  } };
}
function feed(provider: RentalFeed["provider"] = "reins", records = [row()]): RentalFeed {
  return { version: 1, provider, scope: "bunkyo-rent-175000-area-48", complete: true, checkedAt: "2026-09-23T04:00:00Z", records };
}
describe("School rental summaries", () => {
  it("accounts for every source registration exactly once, without adding AD candidates", () => {
    const a = row(), duplicate = row(), denied = row();
    duplicate.sourceId = "duplicate"; denied.sourceId = "denied"; denied.advertising = "not-allowed";
    const f = feed("reins", [a, duplicate, denied]);
    const result = compileRentalSummaries([f], [], now);
    expect(result.summaries.length + result.excluded.length).toBe(3);
    expect(result.summaries).toHaveLength(1);
    expect(result.adCandidates).toHaveLength(1);
    expect(feedSchema.safeParse({ ...f, expectedCount: 3 }).success).toBe(true);
    expect(feedSchema.safeParse({ ...f, expectedCount: 4 }).success).toBe(false);
    expect(feedSchema.safeParse(f).success).toBe(true); // Legacy saved data remains readable.
  });
  it("includes the final 175,000 yen / 48 m² boundary without requiring AD", () => {
    const r = row(); r.summary.rentYen = 175000; r.summary.areaSqm = 48; r.adQuote = ""; r.adStatus = "none";
    const result = compileRentalSummaries([feed("itandi", [r])], [], now);
    expect(result.summaries).toHaveLength(1); expect(result.adCandidates).toHaveLength(0);
  });
  it("keeps unknown fees unknown and never exposes AD/source internals", () => {
    const f = feed(); f.records[0].summary.commonYen = null;
    const result = compileRentalSummaries([f], [], now);
    expect(monthlyTotal(result.summaries[0])).toBeNull();
    expect(JSON.stringify(result.summaries)).not.toMatch(/AD100|private-123|sourceId|adQuote|advertising/);
    expect(result.adCandidates).toHaveLength(1);
    expect(result.summaries[0].schoolSlug).toBeTruthy();
  });
  it.each(["contact-required", "not-allowed", "unknown"] as const)("excludes %s advertising", advertising => {
    const r = row(); r.advertising = advertising;
    expect(compileRentalSummaries([feed("reins", [r])], [], now).summaries).toHaveLength(0);
  });
  it.each(["itandi", "eslife", "atbb"] as const)("requires absence of applications with evidence for %s", provider => {
    const r = row(); r.application = "unknown";
    expect(compileRentalSummaries([feed(provider, [r])], [], now).summaries).toHaveLength(0);
    r.application = "none"; r.applicationQuote = "";
    expect(compileRentalSummaries([feed(provider, [r])], [], now).summaries).toHaveLength(0);
    r.applicationQuote = "申込数空欄（数値表示なし）";
    expect(compileRentalSummaries([feed(provider, [r])], [], now).summaries).toHaveLength(1);
  });
  it("allows REINS inventory without a separate application field", () => {
    const r = row(); r.application = "unknown";
    expect(compileRentalSummaries([feed("reins", [r])], [], now).summaries).toHaveLength(1);
  });
  it("keeps listings after 26 hours and still rejects future evidence and outside criteria", () => {
    const f = feed(); f.checkedAt = "2026-09-22T03:00:00Z";
    expect(compileRentalSummaries([f], [], now).summaries).toHaveLength(1);
    expect(compileRentalSummaries([f], [], new Date("2026-10-01T05:00:00Z")).summaries).toHaveLength(1);
    f.checkedAt = "2026-09-23T06:00:00Z";
    expect(compileRentalSummaries([f], [], now).summaries).toHaveLength(0);
    for (const patch of [{ rentYen: 174999 }, { areaSqm: 47.99 }, { address: "東京都港区芝1丁目" }]) {
      const r = row(); Object.assign(r.summary, patch);
      expect(compileRentalSummaries([feed("reins", [r])], [], now).summaries).toHaveLength(0);
    }
  });
  it("deduplicates across feeds and existing full listings without collapsing different towers/rooms", () => {
    const a = feed(), b = feed("itandi"); b.records[0].summary.unit = "205";
    expect(compileRentalSummaries([a,b], [], now).summaries).toHaveLength(1);
    expect(compileRentalSummaries([a], [b.records[0].summary], now).summaries).toHaveLength(0);
    b.records[0].summary.unit = "206";
    expect(compileRentalSummaries([a,b], [], now).summaries).toHaveLength(2);
    b.records[0].summary.unit = "205"; b.records[0].summary.building = "別棟";
    expect(sameUnit(a.records[0].summary,b.records[0].summary)).toBe(false);
  });
  it("a fresh withdrawal on another feed suppresses an active listing even when advertising is now denied", () => {
    const a = feed(), b = feed("eslife"); b.records[0].availability = "closed"; b.records[0].advertising = "not-allowed";
    expect(compileRentalSummaries([a,b], [], now).summaries).toHaveLength(0);
    b.checkedAt = "2026-09-21T04:00:00Z";
    expect(compileRentalSummaries([a,b], [], now).summaries).toHaveLength(0);
    b.records = [];
    expect(compileRentalSummaries([a,b], [], now).summaries).toHaveLength(1);
  });
  it("shows the next Sunday or Wednesday 13:00 JST without treating it as expiry", () => {
    expect(nextWeeklyReviewAt("2026-09-23T06:23:23Z")).toBe("2026-09-27T04:00:00.000Z");
    expect(nextWeeklyReviewAt("2026-09-27T04:00:00Z")).toBe("2026-09-30T04:00:00.000Z");
    expect(nextWeeklyReviewAt("2026-09-25T15:00:00Z")).toBe("2026-09-27T04:00:00.000Z");
    expect(nextWeeklyReviewAt("2026-09-22T23:00:00Z")).toBe("2026-09-23T04:00:00.000Z");
    expect(nextWeeklyReviewAt("2026-09-23T04:00:00Z")).toBe("2026-09-27T04:00:00.000Z");
  });
  it("matches verified spelling aliases and matching room suffixes without collapsing wings", () => {
    const a = row().summary, b = { ...a, building: "試験マンション ２０５号室" };
    expect(sameUnit(a, b)).toBe(true);
    expect(sameUnit(a, { ...b, building: "試験マンション ２０６号室" })).toBe(false);
    expect(sameUnit({ ...a, building: "真砂マンション" }, { ...b, building: "真砂マンション（マサゴマンション）" })).toBe(true);
    expect(sameUnit({ ...a, building: "試験マンション（イースト）" }, { ...b, building: "試験マンション（ウエスト）" })).toBe(false);
  });
  it("preserves private AD evidence from a duplicate while keeping selected public terms", () => {
    const a = row(), b = row(); a.sourceId = "a"; a.adStatus = "none"; a.adQuote = "";
    b.sourceId = "b"; b.summary.rentYen = 260000;
    const result = compileRentalSummaries([feed("reins", [a,b])], [], now);
    expect(result.summaries).toHaveLength(1); expect(result.summaries[0].rentYen).toBe(250000);
    expect(result.adCandidates).toHaveLength(1); expect(result.adCandidates[0].sourceId).toBe("b");
    expect(compileRentalSummaries([feed("reins", [a,b])], [a.summary], now).adCandidates).toHaveLength(0);
    b.advertising = "contact-required";
    expect(compileRentalSummaries([feed("reins", [a,b])], [], now).adCandidates).toHaveLength(0);
  });
  it("excludes an ambiguous district from every public list and AD candidates", () => {
    const r = row(); r.summary.address = "東京都文京区千石4丁目";
    const result = compileRentalSummaries([feed("reins", [r])], [], now);
    expect(result.summaries).toHaveLength(0);
    expect(result.adCandidates).toHaveLength(0);
    expect(result.excluded).toContainEqual({ provider: "reins", sourceId: r.sourceId, reason: "学区未確定" });
  });
  it("rejects incomplete snapshots and duplicate source IDs", () => {
    expect(feedSchema.safeParse({ ...feed(), complete: false }).success).toBe(false);
    expect(feedSchema.safeParse(feed("reins", [row(),row()])).success).toBe(false);
  });
});
describe("REINS snapshot extraction", () => {
  const raw = '- generic: 物件番号\n- generic: "123"\n- generic: 広告転載区分\n- generic: 広告可\n- generic: 賃料\n- generic: 25万円\n- generic: 使用部分面積\n- generic: 60㎡\n- generic: 建物名\n- generic: 試験物件\n- generic: 部屋番号\n- generic: 角部屋\n- generic: 管理費\n- generic: なし\n- generic: 共益費\n- generic: 更新区分\n- generic: 設備・条件・住宅性能等\n- generic: オートロック,ペット相談,二人入居可\n- generic: 備考１\n- generic: 広告費：賃料の１００．００％迄相談\n- generic: 備考２\n- heading "画像" [level=2]';
  it("does not mistake the next label for a blank room/fee, and normalizes AD numbers", () => {
    const r = extractReinsRecord(raw);
    expect(r.summary.unit).toBe(""); expect(r.summary.commonYen).toBeNull(); expect(r.summary.managementYen).toBe(0);
    expect(r.summary.pets).toBe("consult"); expect(r.summary.petTerms).toBe("ペット相談");
    expect(r.adStatus).toBe("consult");
  });
  it("gives explicit pet refusal precedence", () => {
    expect(extractReinsRecord(raw.replace("ペット相談", "ペット不可")).summary.pets).toBe("not-allowed");
  });
  it("2026-09-25: dedups a room number carried only in the building name against a row with a unit field", () => {
    const a = feed("reins"), b = feed("eslife");
    a.records[0].summary.building = "ビューテラス茗荷谷"; a.records[0].summary.unit = "503";
    a.records[0].summary.address = "東京都文京区大塚４丁目１１－５";
    b.records[0].sourceId = "eslife-1"; b.records[0].summary.building = "ビューテラス茗荷谷 503"; b.records[0].summary.unit = "";
    b.records[0].summary.address = "東京都文京区大塚４丁目11-5";
    const result = compileRentalSummaries([a, b], [], now);
    expect(result.summaries).toHaveLength(1);
    expect(result.excluded.map(e => e.reason)).toContain("同一号室の重複");
    // 写真付き個別物件（号室欄あり）とも同一住戸として除外する
    expect(compileRentalSummaries([b], [a.records[0].summary], now).summaries).toHaveLength(0);
    // 公開表示では建物名と号室を分ける
    const only = compileRentalSummaries([b], [], now).summaries[0];
    expect(only.building).toBe("ビューテラス茗荷谷"); expect(only.unit).toBe("503");
    expect(splitUnit({ building: "試験マンション", unit: "" }).derived).toBe(false);
  });
  it("holds same-source registrations whose shared trailing number cannot identify a room", () => {
    const x = row(), y = row(), z = row();
    x.sourceId = "100140850574"; y.sourceId = "100140850521"; z.sourceId = "100140850531";
    for (const r of [x, y, z]) { r.summary.building = "ルミークアン本郷 １００"; r.summary.unit = ""; r.summary.address = "東京都文京区本郷１丁目８－１４"; }
    y.summary.rentYen = 339000; z.summary.rentYen = 339000;
    const result = compileRentalSummaries([feed("reins", [x, y, z])], [], now);
    expect(result.summaries).toHaveLength(0);
    expect(result.excluded).toEqual([
      expect.objectContaining({ sourceId: "100140850521", reason: "号室未確定" }),
      expect.objectContaining({ sourceId: "100140850531", reason: "号室未確定" }),
      expect.objectContaining({ sourceId: "100140850574", reason: "号室未確定" }),
    ]);
  });
  it("counts the market regardless of advertising permission, one unit once across sources", () => {
    const a = feed("reins"), b = feed("eslife");
    const denied = row(); denied.sourceId = "denied"; denied.advertising = "not-allowed"; denied.summary.unit = "0301";
    const small = row(); small.sourceId = "small"; small.summary.unit = "0401"; small.summary.areaSqm = 40;
    const applied = row(); applied.sourceId = "applied"; applied.summary.unit = "0501"; applied.application = "present";
    a.records.push(denied, small, applied);
    b.records[0].sourceId = "e1"; b.records[0].summary.unit = ""; b.records[0].summary.building = "試験マンション 205";
    b.records[0].summary.address = "東京都文京区千石１丁目20-20";
    const market = compileRentalMarket([a, b], now);
    expect(market.total).toBe(2); // 0205（2取得元で1件）＋広告不可の0301
    expect(market.checkedAt).toBe("2026-09-23T04:00:00Z");
  });
  it("does not publish a layout as a building name", () => {
    const fixed = fixLayoutAsBuilding({ building: "4Ｋ", layout: "", address: "東京都文京区千石４丁目３－２", buildingType: "貸家" });
    expect(fixed.building).toBe("千石４丁目 貸家"); expect(fixed.layout).toBe("4K");
    expect(fixLayoutAsBuilding({ building: "試験マンション", layout: "2LDK", address: "東京都文京区千石１丁目", buildingType: "" }).building).toBe("試験マンション");
  });
  it("normalizes a room number carried in the building name before saving", () => {
    const f = feed("eslife"); f.records[0].summary.building = "試験マンション 0205"; f.records[0].summary.unit = "";
    const out = normalizeFeedUnits(f);
    expect(out.splitCount).toBe(1); expect(out.feed.records[0].summary.building).toBe("試験マンション"); expect(out.feed.records[0].summary.unit).toBe("0205");
    const g = feed("eslife"); g.records[0].summary.unit = "";
    expect(normalizeFeedUnits(g).unitMissing).toBe(1);
  });
});
