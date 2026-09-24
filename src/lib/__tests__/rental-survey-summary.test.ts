// ペット横断 指示書 版2.0 第8・9章・受入テスト T08〜T11・T14（公開件数の定義と算出）
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getProperties } from "@/lib/db/properties";
import { currentSurveyScope } from "@/lib/rental-survey/scope";
import { readVisibleRentalIdentities } from "@/lib/rental-survey/store";
import { buildPublicSurveySummary, countListed, publicSurveyScopes } from "@/lib/rental-survey/summary";
import { compileSurveySnapshot } from "@/lib/rental-survey/units";
import { confirmedLedger, finalization, NOW, observation, ownRental, PET_SCOPE_KEY } from "./rental-survey-fixtures";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));
vi.mock("@/lib/db/properties", () => ({ getProperties: vi.fn() }));

const scope = currentSurveyScope("bunkyo-rent-pet")!;
const ledger = confirmedLedger();
const publicScopes = new Set([PET_SCOPE_KEY]);
// 3住戸（千石205・千石301・本駒込402）
const snapshot = compileSurveySnapshot([
  observation("reins", { sourceId: "a" }),
  observation("reins", { sourceId: "b", unit: "301" }),
  observation("itandi", { sourceId: "c", unit: "402", building: "別の建物", address: "東京都文京区本駒込２丁目３－４" }),
], scope);
const listed205 = { building: "試験マンション", unit: "205", address: "東京都文京区千石１丁目２０－２０" };
const build = (over: Partial<Parameters<typeof buildPublicSurveySummary>[0]> = {}) =>
  buildPublicSurveySummary({ scope, finalization: finalization({ snapshot }), visible: [listed205], ledger, publicScopes, now: NOW, ...over });

describe("X・Y・Z（T08・T09）", () => {
  it("X＝確定対象の住戸数、Y＝そのうち当サイトで詳細掲載中、Z＝X−Y", () => {
    const s = build();
    expect(s).toMatchObject({ state: "shown", x: 3, breakdown: { y: 1, z: 2 } });
    if (s.state === "shown" && s.breakdown) expect(s.breakdown.y + s.breakdown.z).toBe(s.x);
  });

  it("自社の掲載が調査の範囲と一致しなくても、既存の一覧件数で Y を置き換えない（積集合だけ）", () => {
    const other = { building: "範囲外の物件", unit: "101", address: "東京都文京区大塚１丁目１－１" };
    expect(build({ visible: [listed205, other] })).toMatchObject({ x: 3, breakdown: { y: 1, z: 2 } });
  });

  it("公開用データは許可した項目だけ（広告不可件数・除外件数・住戸・原文を持たない）", () => {
    const s = build();
    expect(Object.keys(s).sort()).toEqual(["attribution", "breakdown", "conditionsKey", "finalizedAt", "observedFrom", "observedTo", "sourceKind", "state", "x"]);
    expect(JSON.stringify(s)).not.toMatch(/千石|試験マンション|excluded|adNot|sourceId|Quote/);
  });

  it("住戸と掲載物件の対応が1対1で決まらなければ Y・Z を出さない", () => {
    // 所在地の前方一致で2住戸に当たる掲載物件
    const units = [
      { identities: [{ building: "試験マンション", unit: "205", address: "東京都文京区千石１丁目２０－２０" }] },
      { identities: [{ building: "試験マンション", unit: "205", address: "東京都文京区千石１丁目２０－２１" }] },
    ];
    expect(countListed(units, [{ building: "試験マンション", unit: "205", address: "東京都文京区千石１丁目２０" }])).toBeNull();
    expect(countListed(units.slice(0, 1), [listed205, { ...listed205, building: "試験マンション " }])).toBeNull();
  });
});

describe("状態の区別（T11）", () => {
  it("未確定は数値を出さない（0件と混同しない）", () => {
    expect(build({ finalization: null })).toEqual({ state: "hidden" });
  });

  it("確定済みの0件は「0件」として出す", () => {
    expect(build({ finalization: finalization() })).toMatchObject({ state: "shown", x: 0, breakdown: { y: 0, z: 0 } });
  });

  it.each([
    ["公開フラグなし", { publicScopes: new Set<string>() }],
    ["別の版だけ公開", { publicScopes: new Set(["bunkyo-rent-pet:1"]) }],
    ["同一性判定の版が古い", { finalization: finalization({ snapshot, dedupVersion: 0 }) }],
    ["別の版の確定", { finalization: finalization({ snapshot, scopeVersion: 1 }) }],
    ["snapshot が壊れている", { finalization: finalization({ snapshot: { units: "broken" } }) }],
  ])("%s なら hidden", (_, over) => {
    expect(build(over)).toEqual({ state: "hidden" });
  });

  it("公開フラグは環境変数の scope:版 で指定する（既定は空）", () => {
    expect(publicSurveyScopes({}).size).toBe(0);
    expect([...publicSurveyScopes({ RENTAL_SURVEY_PUBLIC_SCOPES: " bunkyo-rent-pet:1 , ,other:3" })]).toEqual(["bunkyo-rent-pet:1", "other:3"]);
  });
});

describe("当サイトの掲載物件 V_l（T10・T14）", () => {
  beforeEach(() => vi.mocked(getProperties).mockReset());

  it("公開面と同じ判定：公開中・その言語で公開している賃貸だけ（確認目安超過も含む）", async () => {
    vi.mocked(getProperties).mockResolvedValue([
      ownRental({ id: "ja", title: "試験マンション 205" }),
      ownRental({ id: "en-only", title: "試験マンション 301", locales: ["en"] }),
      ownRental({ id: "no-locales", title: "試験マンション 501", locales: [] }),
      ownRental({ id: "draft", title: "試験マンション 601", status: "draft" }),
      ownRental({ id: "closed", title: "試験マンション 701", status: "closed" }),
      ownRental({ id: "expired", title: "試験マンション 801", spec: { ...ownRental().spec, dealType: "rental", availabilityExpiresAt: "2026-01-01T00:00:00Z" } as never }),
      ownRental({ id: "sale", title: "試験マンション 901", dealType: "used_mansion" as never }),
    ]);
    const ja = (await readVisibleRentalIdentities("ja")).map(i => i.unit).sort();
    const en = (await readVisibleRentalIdentities("en")).map(i => i.unit).sort();
    expect(ja).toEqual(["205", "501", "801"]); // locales が空＝日本語のみ（toPublicProperty と同じ）
    expect(en).toEqual(["301"]);
  });

  it("他言語だけで掲載中の物件は、その言語でだけ Y に入る（広告不可とは数えない）", () => {
    const en301 = { building: "試験マンション", unit: "301", address: "東京都文京区千石１丁目２０－２０" };
    expect(build({ visible: [] })).toMatchObject({ x: 3, breakdown: { y: 0, z: 3 } });
    expect(build({ visible: [en301] })).toMatchObject({ x: 3, breakdown: { y: 1, z: 2 } });
  });

  it("募集終了で非公開にした物件は、次の確定を待たずに Y から外れる（X は確定値のまま）", () => {
    expect(build({ visible: [listed205] })).toMatchObject({ x: 3, breakdown: { y: 1, z: 2 } });
    expect(build({ visible: [] })).toMatchObject({ x: 3, breakdown: { y: 0, z: 3 } });
  });
});
