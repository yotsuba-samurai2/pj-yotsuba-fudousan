import { describe, expect, it } from "vitest";
import { buildRecheckQueue, parseVerificationBatch } from "../recheck-queue";

const row = (slug: string, due: string, conditions = "", status = "published") => ({
  slug, status,
  property: { status, title: slug, nextUpdateAt: due, spec: { dealType:"rental", conditions } },
  evidence: { source: { provider:"itandi", roomId:"78032532" } },
});

describe("read-only rental recheck queue", () => {
  it("prioritizes month-end promotions and follows JST, omitting draft and closed rooms", () => {
    const listings = [
      row("rent-current", "2026-11-29"),
      row("rent-due", "2026-11-28"),
      row("rent-promo", "2026-12-06", "2026年11月末までの契約開始に限り、賃料1か月無料。"),
      row("rent-unknown", "2026-02-30"),
      row("rent-draft", "2026-11-28", "", "draft"),
      row("rent-closed", "2026-11-28", "", "closed"),
    ];
    const result = buildRecheckQueue(listings,new Date("2026-11-27T15:01:00Z"));
    expect(result.map(r=>r.priority)).toEqual(["promotion","due","unknown","current"]);
    expect(result[0].promotionEnds).toEqual(["2026-11-30"]);
    expect(result[0].sourceUrl).toBe("https://itandibb.com/rent_rooms/78032532");
    expect(listings[2].status).toBe("published");
  });
  it("finds the exact guarantee deadline, deduplicates it and leaves unrelated dates alone", () => {
    const x = row("rent-example","2026-12-20","2026年11月末までに契約開始の場合は1ヶ月フリーレント。2026年11月29日までに入居。");
    Object.assign(x.property.spec,{guarantor:"初回保証料無料キャンペーンは２０２６年１１月３０日までの申込が対象。"});
    const [result] = buildRecheckQueue([x],new Date("2026-12-01T00:00:00Z"));
    expect(result.promotionEnds).toEqual(["2026-11-30"]);
  });
  it("does not treat far-future or explicitly ended promotions as urgent", () => {
    const cases = [
      row("rent-ended","2026-12-20","2026年11月30日までのフリーレントは終了済み。"),
      row("rent-future","2026-12-20","2026年12月20日までのフリーレント。")
    ];
    expect(buildRecheckQueue(cases,new Date("2026-12-01T00:00:00Z")).map(r=>r.priority)).toEqual(["current","current"]);
  });
  it("never links outside the verified source host or builds unsafe public paths", () => {
    const x = row("rent-example","2026-12-20");
    const bad = {...x,evidence:{source:{provider:"eslife",listingEvidence:{reference:"https://rent.es-square.net.attacker.invalid/a"}}}};
    const ok = {...x,evidence:{source:{provider:"eslife",listingEvidence:{reference:"https://rent.es-square.net/a"}}}};
    const now = new Date("2026-12-01T00:00:00Z");
    expect(buildRecheckQueue([bad],now)[0].sourceUrl).toBeNull();
    expect(buildRecheckQueue([ok],now)[0].sourceUrl).toBe("https://rent.es-square.net/a");
    expect(buildRecheckQueue([{...x,slug:"../admin"}],now)).toEqual([]);
  });
});

describe("verification data input", () => {
  it("accepts a BOM-prefixed array unchanged for server preflight",()=>{
    expect(parseVerificationBatch("\uFEFF[{\"source\":{}}]")).toEqual([{source:{}}]);
  });
  it("ranks an inventory export, a broken input, and an oversized file as different errors",()=>{
    expect(()=>parseVerificationBatch('{"listings":[]}')).toThrow("そのまま取込");
    expect(()=>parseVerificationBatch("{")).toThrow("JSON形式");
    expect(()=>parseVerificationBatch(JSON.stringify(Array(51).fill({})))).toThrow("1〜50件");
    expect(()=>parseVerificationBatch('"'+"あ".repeat(680_000)+'"')).toThrow("2MB以下");
  });
});
