// ペット横断 指示書 版2.0 第5章・受入テスト T05・T06（住戸の同一性・媒体間の矛盾・募集状態）
import { describe, expect, it } from "vitest";
import { currentSurveyScope } from "@/lib/rental-survey/scope";
import { compileSurveySnapshot, groupObservations, type Observation } from "@/lib/rental-survey/units";
import { observation, pet } from "./rental-survey-fixtures";

const scope = currentSurveyScope("bunkyo-rent-pet")!;
const snap = (obs: Observation[]) => compileSurveySnapshot(obs, scope);

describe("住戸の同一性（T05）", () => {
  it("同じ住戸が複数の媒体・複数の掲載行にあっても1住戸", () => {
    const s = snap([
      observation("reins", { sourceId: "r-1" }),
      observation("reins", { sourceId: "r-2" }), // 同じ媒体で別業者が掲載
      observation("atbb", { sourceId: "a-1", unit: "205号室" }),
      observation("itandi", { sourceId: "i-1", address: "東京都文京区千石1丁目20-20" }),
    ]);
    expect(s.units).toHaveLength(1);
    expect(s.excludedObservations["unresolved-identity"]).toBe(0);
  });

  it("号室が違えば別住戸", () => {
    const s = snap([observation("reins", { sourceId: "a", unit: "205" }), observation("reins", { sourceId: "b", unit: "301" })]);
    expect(s.units).toHaveLength(2);
  });
});

describe("推定で同一・別住戸を確定しない（T06）", () => {
  it("号室が無い（戸建て等を含む）観測行は確認待ちで、確定件数に入れない", () => {
    const s = snap([observation("reins", { unit: "" }), observation("atbb", { unit: "号室" })]);
    expect(s.units).toHaveLength(0);
    expect(s.excludedObservations["unresolved-identity"]).toBe(2);
  });

  it("所在地の前方一致が推移的でない連鎖は、まとめて確認待ち", () => {
    // 千石1-20 は 1-20-20 とも 1-20-21 とも一致するが、1-20-20 と 1-20-21 は別の所在地
    const obs = [
      observation("reins", { sourceId: "a", address: "東京都文京区千石１丁目２０" }),
      observation("atbb", { sourceId: "b", address: "東京都文京区千石１丁目２０－２０" }),
      observation("itandi", { sourceId: "c", address: "東京都文京区千石１丁目２０－２１" }),
    ];
    const s = snap(obs);
    expect(s.units).toHaveLength(0);
    expect(s.excludedObservations["unresolved-identity"]).toBe(3);
  });

  it("同じ所在地・号室で建物名が違う組は、表記ゆれか別建物か決めずに確認待ち", () => {
    const s = snap([observation("reins", { sourceId: "a", building: "試験マンション" }), observation("atbb", { sourceId: "b", building: "試験ハイツ" })]);
    expect(s.units).toHaveLength(0);
    expect(s.excludedObservations["unresolved-identity"]).toBe(2);
  });

  it("入力の順序を入れ替えても結果は同じ", () => {
    const obs = [
      observation("reins", { sourceId: "a" }), observation("atbb", { sourceId: "b" }),
      observation("reins", { sourceId: "c", unit: "301" }), observation("itandi", { sourceId: "d", unit: "" }),
      observation("eslife", { sourceId: "e", unit: "402", building: "別の建物", address: "東京都文京区本駒込２丁目３－４" }),
      observation("atbb", { sourceId: "f", unit: "402", building: "別の建物", address: "東京都文京区本駒込２丁目３－４", pet: pet({ multi: "not-allowed", largeDog: "not-allowed" }) }),
    ];
    const expected = snap(obs);
    for (const order of [[5, 4, 3, 2, 1, 0], [2, 0, 5, 1, 3, 4], [3, 5, 0, 4, 2, 1]])
      expect(snap(order.map(i => obs[i]))).toEqual(expected);
    expect(groupObservations(obs).groups).toHaveLength(3);
  });
});

describe("媒体間の矛盾と募集状態", () => {
  it.each([
    ["複数飼育の可否", { pet: pet({ multi: "not-allowed", limits: { cats: null, dogs: null, total: null } }) }],
    ["頭数上限", { pet: pet({ limits: { cats: 3, dogs: null, total: 3 } }) }],
    ["大型犬の可否", { pet: pet({ largeDog: "allowed", species: "cat-and-dog" }) }],
    ["募集状態", { availability: "closed" as const }],
  ])("%s が食い違えば、都合のよい値を採らずに除外する", (_, over) => {
    const s = snap([observation("reins", { sourceId: "a" }), observation("atbb", { sourceId: "b", ...over })]);
    expect(s.units).toHaveLength(0);
    expect(s.excludedUnits.conflict).toBe(1);
  });

  it("未確認の値は矛盾として扱わない（根拠のある媒体の記載で判定する）", () => {
    const s = snap([observation("reins", { sourceId: "a" }), observation("atbb", { sourceId: "b", pet: pet({ multi: "unconfirmed-count", species: "other-or-unconfirmed", limits: { cats: null, dogs: null, total: null }, largeDog: "unconfirmed", petQuote: "" }) })]);
    expect(s.units).toHaveLength(1);
  });

  it("募集終了・申込ありは除外", () => {
    expect(snap([observation("reins", { availability: "closed" })]).excludedUnits["closed-or-applied"]).toBe(1);
    expect(snap([observation("atbb", { application: "present" })]).excludedUnits["closed-or-applied"]).toBe(1);
  });

  it("学区と同じ申込状態のルール：REINS は申込ありの記載が無いこと、他媒体は申込なしの原文が必要", () => {
    expect(snap([observation("reins", { application: "unknown", applicationQuote: "" })]).units).toHaveLength(1);
    expect(snap([observation("atbb", { application: "unknown" })]).excludedUnits["status-unconfirmed"]).toBe(1);
    expect(snap([observation("itandi", { application: "none", applicationQuote: "" })]).excludedUnits["status-unconfirmed"]).toBe(1);
    expect(snap([observation("reins", { availability: "unknown" })]).excludedUnits["status-unconfirmed"]).toBe(1);
  });

  it("ペット対象外（「ペット相談」のみ等）は数えない", () => {
    const s = snap([observation("reins", { pet: pet({ multi: "unconfirmed-count", species: "other-or-unconfirmed", limits: { cats: null, dogs: null, total: null }, largeDog: "unconfirmed", petQuote: "ペット相談" }) })]);
    expect(s.units).toHaveLength(0);
    expect(s.excludedUnits["not-target"]).toBe(1);
  });

  it("内訳（複数飼育・大型犬）は重複し得るので、総数は住戸数で数える", () => {
    const both = pet({ multi: "allowed", species: "cat-and-dog", limits: { cats: 2, dogs: 1, total: 3 }, largeDog: "allowed", petQuote: "犬猫可・大型犬可" });
    const s = snap([observation("reins", { pet: both })]);
    expect(s.units).toHaveLength(1);
    expect(s.targetBreakdown).toEqual({ multiplePets: 1, largeDog: 1 });
  });

  it("確定用の snapshot に媒体の物件ID・原文・媒体名を残さない", () => {
    const text = JSON.stringify(snap([observation("reins", { sourceId: "SECRET-SOURCE-ID", applicationQuote: "SECRET-QUOTE" }), observation("atbb", { sourceId: "x" })]));
    expect(text).not.toMatch(/SECRET-SOURCE-ID|SECRET-QUOTE|petQuote|sourceId|reins|atbb/);
  });
});
