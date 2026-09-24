// ペット横断 指示書 版2.0 第4章・受入テスト T02・T04
import { describe, expect, it } from "vitest";
import { lookupDistrictByAddress } from "@/lib/school-district";
import { surveyRecordSchema } from "@/lib/rental-survey/batch";
import { currentSurveyScope, resolveSurveyScope, SCHOOL_SCOPE_ID, scopeKey } from "@/lib/rental-survey/scope";
import { compileSurveySnapshot } from "@/lib/rental-survey/units";
import { observation, record } from "./rental-survey-fixtures";

describe("調査 scope の検証（T02）", () => {
  it("現行の scope・版だけを受け付ける", () => {
    expect(resolveSurveyScope("bunkyo-rent-pet", 2)).toMatchObject({ scopeId: "bunkyo-rent-pet", version: 2, region: "文京区", providers: ["reins", "itandi", "eslife"] });
  });

  it.each([
    ["scope 欠落", undefined, 1], ["版の欠落", "bunkyo-rent-pet", undefined], ["null", null, null],
    ["未知の scope", "unknown-scope", 1], ["現行でない版", "bunkyo-rent-pet", 1], ["現行でない版", "bunkyo-rent-pet", 3], ["文字列の版", "bunkyo-rent-pet", "2"],
    ["学区の scope", SCHOOL_SCOPE_ID, 1], ["プロトタイプ名", "__proto__", 1], ["プロトタイプ名", "constructor", 1],
  ])("%s は拒否する（全 scope・別 scope と解釈しない）", (_, id, version) => {
    expect(resolveSurveyScope(id, version)).toBeNull();
  });

  it("学区 scope は調査 scope の公開面でも扱わない（学区は既存テーブル専用）", () => {
    expect(currentSurveyScope(SCHOOL_SCOPE_ID)).toBeNull();
  });

  it("公開フラグの識別子は版を含む（新しい版が自動で公開されない）", () => {
    expect(scopeKey(currentSurveyScope("bunkyo-rent-pet")!)).toBe("bunkyo-rent-pet:2");
  });
});

describe("ペット scope に学区の条件を流用しない（T04）", () => {
  const scope = currentSurveyScope("bunkyo-rent-pet")!;

  it("学区が確定しない文京区の住所でも、住戸とペット条件の根拠があれば対象になる", () => {
    const address = "東京都文京区";
    expect(lookupDistrictByAddress(address).status).not.toBe("determined");
    const snapshot = compileSurveySnapshot([observation("reins", { address })], scope);
    expect(snapshot.units).toHaveLength(1);
  });

  it("観測行は賃料・面積を持たない（175,000円・48㎡の条件は構造上かからない）", () => {
    expect(surveyRecordSchema.safeParse({ ...record(), rentYen: 100000 }).success).toBe(false);
    expect(surveyRecordSchema.safeParse({ ...record(), areaSqm: 20 }).success).toBe(false);
    expect(surveyRecordSchema.safeParse(record()).success).toBe(true);
  });

  it("文京区外は地域外として除外する", () => {
    const snapshot = compileSurveySnapshot([observation("reins", { address: "東京都豊島区南大塚１丁目２－３" })], scope);
    expect(snapshot.units).toHaveLength(0);
    expect(snapshot.excludedObservations["out-of-area"]).toBe(1);
  });
});
