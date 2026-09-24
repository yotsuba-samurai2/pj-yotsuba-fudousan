// ペット横断 指示書 版2.0 第6章・受入テスト T07
import { describe, expect, it } from "vitest";
import { allowsLargeDog, allowsMultiplePets, isPetSurveyTarget, petTermsSchema } from "@/lib/rental-survey/pet-terms";
import { pet } from "./rental-survey-fixtures";

const cat2 = pet({ multi: "allowed", species: "cat", limits: { cats: 2, dogs: null, total: 2 }, largeDog: "not-allowed", petQuote: "猫2匹まで可" });
const cat3 = pet({ multi: "allowed", species: "cat", limits: { cats: 3, dogs: null, total: 3 }, largeDog: "not-allowed", petQuote: "猫3匹まで可" });
const largeDogOne = pet({ multi: "single-only", species: "dog", limits: { cats: null, dogs: 1, total: 1 }, largeDog: "allowed", petQuote: "大型犬1頭可" });
const consultOnly = pet({ multi: "unconfirmed-count", species: "other-or-unconfirmed", limits: { cats: null, dogs: null, total: null }, largeDog: "unconfirmed", petQuote: "ペット相談" });

describe("ペット条件の分類（T07）", () => {
  it.each([["猫2頭可", cat2], ["猫3頭可", cat3], ["大型犬1頭可", largeDogOne], ["ペット相談のみ", consultOnly]])("%s は正しく検証を通る", (_, t) => {
    expect(petTermsSchema.safeParse(t).success).toBe(true);
  });

  it("猫2頭可は複数飼育の対象だが、猫3頭以上には含めない（頭数は別に持つ）", () => {
    expect(allowsMultiplePets(cat2)).toBe(true);
    expect(isPetSurveyTarget(cat2)).toBe(true);
    expect(cat2.limits.cats).toBeLessThan(3);
    expect(cat3.limits.cats).toBeGreaterThanOrEqual(3);
  });

  it("大型犬1頭可は大型犬の対象だが、複数飼育可には含めない", () => {
    expect(allowsLargeDog(largeDogOne)).toBe(true);
    expect(allowsMultiplePets(largeDogOne)).toBe(false);
    expect(isPetSurveyTarget(largeDogOne)).toBe(true);
  });

  it("「ペット相談」だけでは複数飼育相談可にせず、確定対象にしない", () => {
    expect(allowsMultiplePets(consultOnly)).toBe(false);
    expect(allowsLargeDog(consultOnly)).toBe(false);
    expect(isPetSurveyTarget(consultOnly)).toBe(false);
  });

  it("複数飼育相談可・大型犬相談可は対象（和集合）", () => {
    expect(isPetSurveyTarget(pet({ multi: "consult", largeDog: "unconfirmed" }))).toBe(true);
    expect(isPetSurveyTarget(pet({ multi: "single-only", species: "dog", limits: { cats: null, dogs: 1, total: 1 }, largeDog: "consult" }))).toBe(true);
    expect(isPetSurveyTarget(pet({ multi: "not-allowed", largeDog: "not-allowed" }))).toBe(false);
  });

  it("根拠の原文なしに可・相談・不可を確定できない", () => {
    expect(petTermsSchema.safeParse({ ...cat2, petQuote: "" }).success).toBe(false);
    expect(petTermsSchema.safeParse({ ...largeDogOne, petQuote: "" }).success).toBe(false);
    expect(petTermsSchema.safeParse({ ...consultOnly, petQuote: "" }).success).toBe(true);
  });

  it.each([
    ["複数飼育可なのに合計1頭まで", { ...cat2, limits: { cats: null, dogs: null, total: 1 } }],
    ["1頭限定なのに合計2頭まで", { ...largeDogOne, limits: { cats: null, dogs: null, total: 2 } }],
    ["猫のみ可なのに大型犬可", { ...cat2, largeDog: "allowed" }],
  ])("矛盾する記載は受け付けない：%s", (_, t) => {
    expect(petTermsSchema.safeParse(t).success).toBe(false);
  });
});
