// ペット横断 指示書 版2.0 第5・6章：取込画面で確認するための整理（対象の数え方・確定に使うバッチの選び方）
import { describe, expect, it } from "vitest";
import { pickFinalizationBatches, summarizeBatch, type BatchMeta } from "@/lib/rental-survey/review";
import { currentSurveyScope } from "@/lib/rental-survey/scope";
import { batch, pet, record } from "./rental-survey-fixtures";

const scope = currentSurveyScope("bunkyo-rent-pet")!;
const r = (sourceId: string, petOver: Parameters<typeof pet>[0], over: Parameters<typeof record>[0] = {}) =>
  record({ sourceId, unit: sourceId, pet: pet(petOver), ...over });

describe("summarizeBatch（対象の数え方・第6章）", () => {
  it("「ペット相談」だけの記載（頭数未確認）は対象にせず、対象外として数える", () => {
    const s = summarizeBatch(batch("eslife", [r("a", { multi: "unconfirmed-count", largeDog: "unconfirmed", limits: { cats: null, dogs: null, total: null }, petQuote: "ペット相談" })]));
    expect(s.counts).toMatchObject({ target: 0, unconfirmedCount: 1 });
    expect(s.targets).toEqual([]);
  });

  it("猫2頭可を猫3頭以上に含めない。頭数の書かれていない多頭可も含めない", () => {
    const s = summarizeBatch(batch("eslife", [
      r("two", { multi: "allowed", species: "cat", limits: { cats: 2, dogs: null, total: 2 } }),
      r("three", { multi: "allowed", species: "cat", limits: { cats: 3, dogs: null, total: 3 } }),
      r("unknown", { multi: "allowed", species: "cat", limits: { cats: null, dogs: null, total: null }, petQuote: "多頭飼育可" }),
    ]));
    expect(s.counts).toMatchObject({ target: 3, multiplePets: 3, catsThreeOrMore: 1 });
  });

  it("大型犬1頭可は、大型犬の対象だが複数飼育には含めない", () => {
    const s = summarizeBatch(batch("itandi", [
      r("dog", { multi: "single-only", species: "dog", limits: { cats: null, dogs: 1, total: 1 }, largeDog: "allowed", petQuote: "大型犬1頭可" }),
    ]));
    expect(s.counts).toMatchObject({ target: 1, multiplePets: 0, largeDog: 1, singleOnly: 0 });
  });

  it("内訳は重複し得るので、足しても対象の数にならない", () => {
    const s = summarizeBatch(batch("eslife", [
      r("both", { multi: "allowed", species: "cat-and-dog", limits: { cats: null, dogs: null, total: 3 }, largeDog: "consult", petQuote: "犬猫3頭まで・大型犬相談" }),
    ]));
    expect(s.counts.target).toBe(1);
    expect(s.counts.multiplePets + s.counts.largeDog).toBe(2);
  });

  it("対象のうち募集終了・申込ありは、確定時に除外される件数として示す。根拠の原文を一覧に出す", () => {
    const s = summarizeBatch(batch("reins", [
      r("ok", {}),
      r("applied", {}, { application: "present", applicationQuote: "申込あり（試験用）" }),
      r("no", { multi: "not-allowed", largeDog: "not-allowed", limits: { cats: null, dogs: null, total: null }, petQuote: "ペット不可" }),
    ]));
    expect(s.counts).toMatchObject({ target: 2, targetNotActive: 1, notAllowed: 1 });
    expect(s.targets.map(t => t.petQuote)).toEqual(["猫2匹まで可（試験用の記載）", "猫2匹まで可（試験用の記載）"]);
    expect(s).toMatchObject({ provider: "reins", status: "verified", expectedCount: 3, recordCount: 3 });
  });
});

describe("pickFinalizationBatches（確定に使うバッチ）", () => {
  const meta = (id: string, provider: string, over: Partial<BatchMeta> = {}): BatchMeta => ({
    id, provider, status: "verified", observedFrom: "2026-09-29T03:00:00Z", observedTo: "2026-09-30T06:00:00Z", createdAt: "2026-09-30T07:00:00Z", ...over,
  });

  it("媒体ごとに最も新しく保存された verified を選び、未完了・失敗は使わない", () => {
    const p = pickFinalizationBatches([
      meta("reins-old", "reins", { createdAt: "2026-09-23T07:00:00Z" }),
      meta("reins-new", "reins"),
      meta("itandi-failed", "itandi", { status: "failed", createdAt: "2026-09-30T08:00:00Z" }),
      meta("itandi-ok", "itandi"),
      meta("eslife", "eslife"),
    ], scope);
    expect(p.batchIds.sort()).toEqual(["eslife", "itandi-ok", "reins-new"]);
    expect(p).toMatchObject({ missing: [], withinWindow: true });
  });

  it("足りない媒体を示す（REINS を行えなかった週は確定できない）", () => {
    const p = pickFinalizationBatches([meta("itandi", "itandi"), meta("eslife", "eslife"), meta("reins-inc", "reins", { status: "incomplete" })], scope);
    expect(p.missing).toEqual(["reins"]);
  });

  it("観測期間の幅が7日を超えたら、確定できない組み合わせとして示す", () => {
    const p = pickFinalizationBatches([
      meta("reins", "reins", { observedFrom: "2026-09-21T00:00:00Z", observedTo: "2026-09-21T06:00:00Z" }),
      meta("itandi", "itandi"), meta("eslife", "eslife"),
    ], scope);
    expect(p.withinWindow).toBe(false);
    expect(p.windowDays).toBeGreaterThan(7);
  });

  it("対象外の媒体のバッチは選ばない", () => {
    expect(pickFinalizationBatches([meta("x", "suumo")], scope)).toMatchObject({ batchIds: [], windowDays: null, withinWindow: false });
  });
});
