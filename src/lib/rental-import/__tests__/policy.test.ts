import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { conditionChoiceSchema, validTitleHighlight, selectCondition, type ConditionChoice } from "../policy";
import { validateRentalImport } from "../validation";
import { rentalPublicationError } from "../publication";
import { rentalContentDigest } from "../content-review";
import { fixture, NOW } from "./fixtures";
const proof = (quote: string) => ({ checkedAt: NOW.toISOString(), reference: "https://itandibb.com/rent_rooms/123", quote });
function choiceWithChecks(input: Record<string, unknown>) {
  const options = input.options as { provider: "itandi" | "reins"; value: string; evidence: { checkedAt: string; reference: string; quote: string } }[];
  const checkedSources = Object.fromEntries((["itandi", "reins"] as const).map(provider => {
    const rows = options.filter(o => o.provider === provider);
    return [provider, { status: rows.length ? "recorded" : "not-stated", evidence: { checkedAt: NOW.toISOString(), reference: provider === "itandi" ? "https://itandibb.com/rent_rooms/123" : "https://system.reins.jp/", quote: rows.length ? rows.map(o => o.value).join("\n") : "当該項目の記載なし（テスト用観測）" } }];
  }));
  return conditionChoiceSchema.parse({ ...input, checkedSources });
}
beforeEach(() => vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://demo.supabase.co"));
afterEach(() => vi.unstubAllEnvs());
function review(v: ReturnType<typeof fixture>) {
  const draft = validateRentalImport(v, NOW, "draft"); if (!draft.ok) throw new Error(draft.reasons.join());
  v.contentReview = { checkedAt: NOW.toISOString(), reference: "原文・本文・翻訳の照合済み", digest: rentalContentDigest(draft.property), locales: v.property.locales ?? ["ja"] };
}
const fees = (): ConditionChoice => choiceWithChecks({ rule: "strictest", field: "guarantor", basis: "同じ保証契約・月額賃料と管理費の合計", options: [
  { provider: "itandi", value: "初回50%・年間1万円", burden: { initialPercent: 50, annualYen: 10000 }, evidence: proof("初回50%・年間1万円") },
  { provider: "itandi", value: "初回100%・年間1万円", burden: { initialPercent: 100, annualYen: 10000 }, evidence: proof("初回100%・年間1万円") },
] });
describe("2026-09-20の採用ルール", () => {
  it.each([
    ["pets", "小型犬猫1匹不可"], ["pets", "犬猫1匹まで不可"], ["pets", "ペット相談"], ["pets", "ペット相談可"],
    ["foreignResidents", "外国人相談可"], ["corporateLease", "法人契約相談可"],
  ] as const)("%s: %sを可の強調表示に変えない", (kind, quote) => {
    expect(validTitleHighlight({ kind, provider: "itandi", evidence: proof(quote) }, NOW)).toBe(false);
  });
  it("確認した可条件を物件名へ付け、未確認・別号室・ポータルの根拠は拒否", () => {
    const v = fixture(); v.property.title = "【外国人可】【法人契約可】【ペット可】検証用マンション 001";
    v.titleHighlights = [
      { kind: "foreignResidents", provider: "itandi", evidence: proof("外国人可") },
      { kind: "corporateLease", provider: "itandi", evidence: proof("法人契約可") },
      { kind: "pets", provider: "itandi", evidence: proof("小型犬猫1匹迄可・敷金1ヶ月積増") },
    ];
    review(v); expect(validateRentalImport(v, NOW, "published").ok).toBe(true);
    v.titleHighlights[0].evidence.quote = "外国人未確認"; expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.titleHighlights[0].evidence.quote = "外国人可"; v.titleHighlights[0].evidence.reference = "https://itandibb.com/rent_rooms/other"; expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.titleHighlights[0].evidence.reference = "https://suumo.jp/"; expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it("明示指示のある未確認費用は未確認表示で公開し、許可なし・隠した表示は通さない", () => {
    const v = fixture(); if (v.property.spec.dealType !== "rental") throw new Error();
    v.property.spec.guarantor = "日本セーフティー加入必須（初回・更新料金は未確認）";
    expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.unconfirmedTerms = { fields: ["guarantor"], operatorInstruction: "未確認です。未確認と書いてください。", recordedAt: NOW.toISOString() };
    review(v); const result = validateRentalImport(v, NOW, "published"); expect(result.ok).toBe(true);
    if (result.ok) expect(result.property.internal?.rentalImport).toHaveProperty("unconfirmedTerms", v.unconfirmedTerms);
    v.property.spec.guarantor = "日本セーフティー加入必須"; expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.property.spec.guarantor = "日本セーフティー加入必須（料金未確認）";
    v.source.availability = "unknown"; expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it.each(["strictest", "most-pets"] as const)("%sの比較で片側欠落・同一サイト重複は両サイト確認にならない", (rule) => {
    const c = rule === "strictest" ? fees() : choiceWithChecks({ rule, field: "conditions", replace: "ペット不可", options: [
      { provider: "itandi", value: "犬猫1匹", maxCount: 1, evidence: proof("犬猫1匹") },
      { provider: "itandi", value: "犬猫2匹", maxCount: 2, evidence: proof("犬猫2匹") },
    ] });
    const { checkedSources: _checks, ...without } = c; void _checks;
    expect(conditionChoiceSchema.safeParse(without).success).toBe(false);
    c.checkedSources.reins.status = "recorded";
    expect(selectCondition(c, NOW).ok).toBe(false);
    c.checkedSources.reins.status = "unavailable";
    expect(selectCondition(c, NOW).ok).toBe(false);
    c.checkedSources.reins.status = "not-stated";
    expect(selectCondition(c, NOW).ok).toBe(true);
  });
  it("管理費や旧新複数金額を賃料として選ばない", () => {
    const v = fixture(); v.source.rent.evidence.quote = "賃料85,500円 管理費5,000円"; v.source.rent.yen = 5000;
    expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.source.rent.yen = 85500; expect(validateRentalImport(v, NOW).ok).toBe(true);
    v.source.rent.evidence.quote = "賃料85,500円\n賃料90,000円"; expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it("両サイト同額でも本文と翻訳の照合記録が必要", () => {
    const v = fixture(); delete v.contentReview; expect(validateRentalImport(v, NOW, "published").ok).toBe(false);
    review(v); v.property.description = "賃料8万円です";
    expect(validateRentalImport(v, NOW, "published").ok).toBe(false);
  });
  it("賃料はITANJIの確認値を採用し、本文の再照合なしでは公開しない", () => {
    const v = fixture(); v.reins.rent.yen = 90000; v.reins.rent.evidence.quote = "賃料9万円";
    v.source.advertising = { status: "allowed", evidence: proof("広告可") }; Reflect.deleteProperty(v, "reins");
    const draft = validateRentalImport(v, NOW); expect(draft.ok).toBe(true); if (draft.ok) expect(draft.property.priceYen).toBe(85500);
    expect(validateRentalImport(v, NOW, "published").ok).toBe(true);
    v.property.priceYen = 85500; review(v); const pub = validateRentalImport(v, NOW, "published"); if (!pub.ok) throw new Error(pub.reasons.join());
    pub.property.priceYen = 90000; expect(rentalPublicationError(pub.property, NOW)).toContain("ITANJI");
  });
  it("公開ポータルの費用条件や賃料原文を採用しない", () => {
    const c = fees(); c.options[1].evidence.reference = "https://suumo.jp/chintai/bc_123/"; expect(selectCondition(c, NOW).ok).toBe(false);
    expect(conditionChoiceSchema.safeParse({ ...c, options: c.options.map(o => ({ ...o, provider: "homes" })) }).success).toBe(false);
    const v = fixture(); v.source.rent.evidence.reference = "https://www.homes.co.jp/chintai/"; expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.source.rent.evidence.reference = v.source.url; v.source.rent.yen = 999999; expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it.each(["unknown", "denied"] as const)("REINSが%sでも別資料の広告可を採用", (status) => {
    const v = fixture(); v.reins.advertising = status; v.reins.evidence.quote = status === "denied" ? "広告不可" : "入力なし";
    v.advertisingEvidence = [{ ...v.source, status: "allowed", evidence: proof("広告掲載可") }];
    expect(validateRentalImport(v, NOW).ok).toBe(true);
  });
  it("広告可がITANJIの別資料にあれば公開できる", () => { const v = fixture(); const { reins: _reins, ...input } = v; void _reins; expect(validateRentalImport({ ...input, advertisingEvidence: [{ ...v.source, status: "allowed", evidence: proof("広告可") }] }, NOW).ok).toBe(true); });
  it.each(["広告可否", "広告可ではありません", "広告不可"])("ラベルや否定文を広告可と誤認しない: %s", (quote) => { const v = fixture(); v.reins.evidence.quote = quote; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("他の部屋の許可を採用しない", () => { const v = fixture(); v.reins.advertising = "unknown"; v.advertisingEvidence = [{ ...v.source, unit: "002", status: "allowed", evidence: proof("広告可") }]; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("広告可の根拠が古ければ保留", () => { const v = fixture(); v.reins.evidence.checkedAt = "2026-09-18T01:00:00Z"; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it.each(["unknown", "denied"] as const)("画像は包括許可を使い元の%s表示も記録", (status) => { const v = fixture(); v.photoPermission.status = status; v.photoPermission.evidence.checkedAt = "2026-01-01T00:00:00Z"; expect(validateRentalImport(v, NOW).ok).toBe(true); });
  it("同じ保証契約なら高い費用の原文をそのまま採用", () => { expect(selectCondition(fees(), NOW)).toMatchObject({ ok: true, index: 1, value: "初回100%・年間1万円" }); const v = fixture(); v.conditionChoices = [fees()]; const result = validateRentalImport(v, NOW); if (!result.ok) throw new Error(result.reasons.join()); expect(result.property.spec).toMatchObject({ guarantor: "初回100%・年間1万円" }); expect(result.property.internal?.rentalImport).toHaveProperty("decisions"); });
  it("初回と継続費用の大小が逆なら原文を混ぜない", () => { const c = fees(); if (c.rule !== "strictest") throw new Error(); c.options[0].burden.annualYen = 20000; expect(selectCondition(c, NOW).ok).toBe(false); });
  it("比較項目が欠けていればゼロとみなさない", () => { const c = fees(); if (c.rule !== "strictest") throw new Error(); delete c.options[0].burden.annualYen; expect(selectCondition(c, NOW).ok).toBe(false); });
  it("原文にない費用を転載しない", () => { const c = fees(); c.options[1].value = "初回200%"; expect(selectCondition(c, NOW).ok).toBe(false); });
  it("ペット1匹と2匹なら2匹の記載と付帯条件を採用", () => {
    const c = choiceWithChecks({ rule: "most-pets", field: "conditions", replace: "ペット不可", resolves: ["ペット頭数が相違"], options: [
      { provider: "itandi", value: "小型犬・猫合計1匹まで", maxCount: 1, evidence: proof("小型犬・猫合計1匹まで") },
      { provider: "itandi", value: "小型犬・猫計2匹迄可・敷金1ヶ月積増", maxCount: 2, evidence: proof("小型犬・猫計2匹迄可・敷金1ヶ月積増") },
    ] });
    const v = fixture(); v.conflicts = ["ペット頭数が相違"]; v.conditionChoices = [c];
    if (v.property.spec.dealType !== "rental") throw new Error();
    v.property.spec.conditions = "1年未満解約で賃料1ヶ月の違約金。ペット不可";
    review(v); const result = validateRentalImport(v, NOW, "published");
    if (!result.ok) throw new Error(result.reasons.join()); expect(result.property.spec).toMatchObject({ conditions: `1年未満解約で賃料1ヶ月の違約金。${c.options[1].value}` });
    expect(rentalPublicationError(result.property, NOW)).toBeNull();
    v.conflicts.push("住所が相違"); expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it("通常管理画面から保証料を低い条件に書き換えて公開できない", () => {
    const v = fixture(); v.conditionChoices = [fees()]; review(v); const result = validateRentalImport(v, NOW, "published");
    if (!result.ok || result.property.spec.dealType !== "rental") throw new Error();
    result.property.spec.guarantor = "初回50%・年間1万円";
    expect(rentalPublicationError(result.property, NOW)).toContain("採用ルール");
  });
});
