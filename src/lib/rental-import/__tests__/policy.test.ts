import { describe, expect, it } from "vitest";
import { conditionChoiceSchema, selectCondition, type ConditionChoice } from "../policy";
import { validateRentalImport } from "../validation";
import { rentalPublicationError } from "../publication";
import { fixture, NOW } from "./fixtures";
const proof = (quote: string) => ({ checkedAt: NOW.toISOString(), reference: "確認済みの募集資料", quote });
const fees = (): ConditionChoice => conditionChoiceSchema.parse({ rule: "strictest", field: "guarantor", basis: "同じ保証契約・月額賃料と管理費の合計", options: [
  { value: "初回50%・年間1万円", burden: { initialPercent: 50, annualYen: 10000 }, evidence: proof("初回50%・年間1万円") },
  { value: "初回100%・年間1万円", burden: { initialPercent: 100, annualYen: 10000 }, evidence: proof("初回100%・年間1万円") },
] });
describe("2026-09-20の採用ルール", () => {
  it.each(["unknown", "denied"] as const)("REINSが%sでも別資料の広告可を採用", (status) => {
    const v = fixture(); v.reins.advertising = status; v.reins.evidence.quote = status === "denied" ? "広告不可" : "入力なし";
    v.advertisingEvidence = [{ ...v.source, status: "allowed", evidence: proof("広告掲載可") }];
    expect(validateRentalImport(v, NOW).ok).toBe(true);
  });
  it("REINS記録なしでも同一物件の広告可を採用", () => { const v = fixture(); const { reins: _reins, ...input } = v; void _reins; expect(validateRentalImport({ ...input, advertisingEvidence: [{ ...v.source, status: "allowed", evidence: proof("広告可") }] }, NOW).ok).toBe(true); });
  it.each(["広告可否", "広告可ではありません", "広告不可"])("ラベルや否定文を広告可と誤認しない: %s", (quote) => { const v = fixture(); v.reins.evidence.quote = quote; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("他の部屋の許可を採用しない", () => { const v = fixture(); v.reins.advertising = "unknown"; v.advertisingEvidence = [{ ...v.source, unit: "002", status: "allowed", evidence: proof("広告可") }]; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("広告可の根拠が古ければ保留", () => { const v = fixture(); v.reins.evidence.checkedAt = "2026-09-18T01:00:00Z"; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it.each(["unknown", "denied"] as const)("画像は包括許可を使い元の%s表示も記録", (status) => { const v = fixture(); v.photoPermission.status = status; v.photoPermission.evidence.checkedAt = "2026-01-01T00:00:00Z"; expect(validateRentalImport(v, NOW).ok).toBe(true); });
  it("同じ保証契約なら高い費用の原文をそのまま採用", () => { expect(selectCondition(fees(), NOW)).toMatchObject({ ok: true, index: 1, value: "初回100%・年間1万円" }); const v = fixture(); v.conditionChoices = [fees()]; const result = validateRentalImport(v, NOW); if (!result.ok) throw new Error(result.reasons.join()); expect(result.property.spec).toMatchObject({ guarantor: "初回100%・年間1万円" }); expect(result.property.internal?.rentalImport).toHaveProperty("decisions"); });
  it("初回と継続費用の大小が逆なら原文を混ぜない", () => { const c = fees(); if (c.rule !== "strictest") throw new Error(); c.options[0].burden.annualYen = 20000; expect(selectCondition(c, NOW).ok).toBe(false); });
  it("比較項目が欠けていればゼロとみなさない", () => { const c = fees(); if (c.rule !== "strictest") throw new Error(); delete c.options[0].burden.annualYen; expect(selectCondition(c, NOW).ok).toBe(false); });
  it("原文にない費用を転載しない", () => { const c = fees(); c.options[1].value = "初回200%"; expect(selectCondition(c, NOW).ok).toBe(false); });
  it("ペット1匹と2匹なら2匹の記載と付帯条件を採用", () => {
    const c = conditionChoiceSchema.parse({ rule: "most-pets", field: "conditions", replace: "ペット不可", resolves: ["ペット頭数が相違"], options: [
      { value: "小型犬・猫合計1匹まで", maxCount: 1, evidence: proof("小型犬・猫合計1匹まで") },
      { value: "小型犬・猫計2匹迄可・敷金1ヶ月積増", maxCount: 2, evidence: proof("小型犬・猫計2匹迄可・敷金1ヶ月積増") },
    ] });
    const v = fixture(); v.conflicts = ["ペット頭数が相違"]; v.conditionChoices = [c];
    if (v.property.spec.dealType !== "rental") throw new Error();
    v.property.spec.conditions = "1年未満解約で賃料1ヶ月の違約金。ペット不可";
    const result = validateRentalImport(v, NOW, "published");
    if (!result.ok) throw new Error(result.reasons.join()); expect(result.property.spec).toMatchObject({ conditions: `1年未満解約で賃料1ヶ月の違約金。${c.options[1].value}` });
    expect(rentalPublicationError(result.property, NOW)).toBeNull();
    v.conflicts.push("住所が相違"); expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it("通常管理画面から保証料を低い条件に書き換えて公開できない", () => {
    const v = fixture(); v.conditionChoices = [fees()]; const result = validateRentalImport(v, NOW, "published");
    if (!result.ok || result.property.spec.dealType !== "rental") throw new Error();
    result.property.spec.guarantor = "初回50%・年間1万円";
    expect(rentalPublicationError(result.property, NOW)).toContain("採用ルール");
  });
});
