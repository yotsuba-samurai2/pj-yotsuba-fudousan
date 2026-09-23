/* eslint-disable @typescript-eslint/no-explicit-any -- migration-compatible choice payloads are runtime-validated by Zod. */
import { z } from "zod";

/** Business rules explicitly instructed by the operator on 2026-09-20. */
export const RENTAL_IMPORT_POLICY = {
  id: "operator-20260920-v7-itandi-reins-ad-gate",
  advertising: "tokyo-tatemono-mail-or-itandi-or-reins-current-allow",
  images: "operator-blanket-allow",
  conditions: "strictest-itandi-only",
  rent: "itandi-current",
  pets: "largest-itandi-count-from-confirmed-options",
  availability: "itandi-current",
  endedListings: "close-on-itandi-end",
  portalEnd: "ignored",
  unconfirmedFees: "explicit-operator-instruction-and-visible-disclosure",
} as const;

export const evidenceSchema = z.object({
  checkedAt: z.iso.datetime({ offset: true }),
  reference: z.string().trim().min(1).max(1000),
  quote: z.string().trim().min(1).max(5000),
});
export type RentalProvider = "itandi" | "reins" | "eslife";
export function isPrimaryReference(reference: string, provider: RentalProvider = "itandi") {
  try {
    const url = new URL(reference);
    const host = provider === "itandi" ? "itandibb.com" : provider === "reins" ? "system.reins.jp" : "rent.es-square.net";
    return url.protocol === "https:" && url.hostname === host;
  }
  catch { return false; }
}
const option = z.object({ provider: z.enum(["itandi", "reins"]), value: z.string().trim().min(1), evidence: evidenceSchema });
export const rentEvidenceSchema = z.object({ yen: z.number().int().positive(), evidence: evidenceSchema });
export function validRentEvidence(rent: z.infer<typeof rentEvidenceSchema>, provider: RentalProvider, now: Date) {
  const values = Array.from(rent.evidence.quote.normalize("NFKC").replace(/,/g, "").matchAll(/(?:^|\s)(?:月額)?(?:賃料|家賃)\s*[:：=]?\s*(\d+(?:\.\d+)?)\s*(万円|円)/g)).map((m) => Math.round(Number(m[1]) * (m[2] === "万円" ? 10000 : 1)));
  return isCurrentEvidence(rent.evidence.checkedAt, now) && isPrimaryReference(rent.evidence.reference, provider) && values.length > 0 && values.every((value) => value === rent.yen);
}
const conditionObservationSchema = z.object({
  status: z.enum(["recorded", "not-stated", "unavailable"]),
  evidence: evidenceSchema,
});
const common = {
  // v1.2 uses ITANJI as the sole external property source. `reins` remains
  // optional in the input type only so old saved drafts can be revalidated and
  // migrated without silently rewriting their evidence.
  checkedSources: z.object({ itandi: conditionObservationSchema, reins: conditionObservationSchema.optional() }),
  resolves: z.array(z.string()).default([]),
  /** When changing one clause, preserve the remaining special conditions verbatim. */
  replace: z.string().trim().min(1).optional(),
};
/** Quantities come from the cited terms; all options must use the same base and units. */
const burdenSchema = z.partialRecord(z.enum([
  "initialYen", "monthlyYen", "annualYen", "initialPercent", "monthlyPercent", "annualPercent",
  "required", "minimumStayMonths", "noticeMonths", "penaltyRentMonths", "depositRentMonths",
]), z.number().finite().nonnegative()).refine((v) => Object.keys(v).length > 0, "比較値が必要です");
type ConditionObservation = z.infer<typeof conditionObservationSchema>;
type ChoiceOption = { provider: "itandi" | "reins"; value: string; evidence: z.infer<typeof evidenceSchema>; burden: any; maxCount: any };
export type ConditionChoice = {
  rule: "strictest" | "most-pets";
  field: "managementFee" | "deposit" | "keyMoney" | "guaranteeDeposit" | "renewalFee" | "insurance" | "guarantor" | "otherFees" | "conditions";
  basis?: string;
  checkedSources: { itandi: ConditionObservation; reins: ConditionObservation };
  options: ChoiceOption[];
  resolves: string[];
  replace?: string;
};
export const conditionChoiceSchema = z.discriminatedUnion("rule", [
  z.object({
    ...common, rule: z.literal("strictest"),
    field: z.enum(["managementFee", "deposit", "keyMoney", "guaranteeDeposit", "renewalFee", "insurance", "guarantor", "otherFees", "conditions"]),
    basis: z.string().trim().min(1),
    options: z.array(option.extend({ burden: burdenSchema })).min(2),
  }),
  z.object({
    ...common, rule: z.literal("most-pets"), field: z.literal("conditions"),
    options: z.array(option.extend({ maxCount: z.number().int().nonnegative() })).min(2),
  }),
]) as unknown as z.ZodType<ConditionChoice>;
export function normalized(text: string) { return text.normalize("NFKC").replace(/\s/g, "").toLowerCase(); }
export function isCurrentEvidence(t: string, now: Date, hours = 24) {
  const age = now.getTime() - Date.parse(t);
  return Number.isFinite(age) && age >= 0 && age <= hours * 3600_000;
}
export function hasAdvertisingAllow(quote: string) {
  // A field caption (広告可否) is not an affirmative value. Negative wording is separate evidence.
  const text = quote.normalize("NFKC");
  const allowed = /広告(?:掲載|転載)?(?:可否)?[\s:：]*可(?:$|[\s。、,;；」』）)])|(?:エンド向け)?掲載[\s:：]*(?:可|OK)(?!では|でない|不可)/mi.test(text);
  return allowed && !/広告(?:掲載|転載)?[\s:：]*(?:不可|禁止)|広告(?:掲載|転載)?可[\s]*では(?:ない|ありません)|掲載[\s:：]*(?:不可|禁止|ではない|ではありません)/i.test(text);
}

/** Select an entire observed term; never manufacture a combination of separate fee plans. */
export function selectCondition(choice: ConditionChoice, now: Date): { ok: true; index: number; value: string } | { ok: false; reason: string } {
  const held = (reason: string) => ({ ok: false as const, reason: `${choice.field}: ${reason}` });
  const legacy = !!choice.checkedSources.reins;
  const check = choice.checkedSources.itandi, options = choice.options.filter((o) => o.provider === "itandi");
  if (!isPrimaryReference(check.evidence.reference, "itandi") || !isCurrentEvidence(check.evidence.checkedAt, now)) return held("ITANJIの当該条件の確認記録が必要です");
  if (check.status === "unavailable") return held("ITANJIの当該条件を取得できていません");
  if ((check.status === "recorded") !== (options.length > 0)) return held("ITANJIの記載あり／記載なしと比較候補が一致しません");
  if (options.some((o) => !normalized(check.evidence.quote).includes(normalized(o.value)))) return held("ITANJIの条件確認原文に比較候補が含まれていません");
  // A saved v1.1 draft may still be reviewed for migration. This branch is
  // intentionally unreachable for new v1.2 inputs (which omit `reins`).
  if (legacy) {
    const other = choice.checkedSources.reins!;
    const otherOptions = choice.options.filter((o) => o.provider === "reins");
    if (!isPrimaryReference(other.evidence.reference, "reins") || !isCurrentEvidence(other.evidence.checkedAt, now) || other.status === "unavailable") return held("旧形式のREINS根拠を移行できません");
    if ((other.status === "recorded") !== (otherOptions.length > 0) || otherOptions.some((o) => !normalized(other.evidence.quote).includes(normalized(o.value)))) return held("旧形式の条件根拠が一致しません");
  }
  if (choice.options.some((o) => o.provider !== "itandi" || !isPrimaryReference(o.evidence.reference, "itandi"))) return held("条件の比較元はITANJIに限定してください");
  if (choice.options.some((o) => !isCurrentEvidence(o.evidence.checkedAt, now) || !normalized(o.evidence.quote).includes(normalized(o.value)))) return held("最新の原文と転載内容を照合してください");
  let indices: number[];
  if (choice.rule === "most-pets") {
    if (choice.options.some((o) => !Array.from(o.value.normalize("NFKC").matchAll(/(\d+)\s*匹/g)).some((m: RegExpMatchArray) => Number(m[1]) === o.maxCount!))) return held("ペット頭数が原文と一致しません");
    const max = Math.max(...choice.options.map((o) => o.maxCount!));
    indices = choice.options.flatMap((o, i) => o.maxCount === max ? [i] : []);
  } else {
    const keys = Object.keys(choice.options[0].burden ?? {}).sort();
    if (choice.options.some((o) => JSON.stringify(Object.keys(o.burden ?? {}).sort()) !== JSON.stringify(keys))) return held("同じ項目・算定基準で条件を比較してください");
    indices = choice.options.flatMap((o, i) => choice.options.every((other) => keys.every((key) => (o.burden?.[key] ?? 0) >= (other.burden?.[key] ?? 0))) ? [i] : []);
  }
  if (!indices.length) return held("初回費用と継続費用などの大小が逆で、厳しい方を一意に選べません");
  if (new Set(indices.map((i) => normalized(choice.options[i].value))).size > 1) return held("比較値が同じでその他の条件が異なります");
  const index = indices[0];
  return { ok: true, index, value: choice.options[index].value };
}

export const TITLE_HIGHLIGHT_LABELS = { foreignResidents: "外国人可", corporateLease: "法人契約可", pets: "ペット可" } as const;
export const titleHighlightSchema = z.object({ kind: z.enum(["foreignResidents", "corporateLease", "pets"]), provider: z.enum(["itandi", "reins"]), evidence: evidenceSchema });
export function validTitleHighlight(item: z.infer<typeof titleHighlightSchema>, now: Date) {
  if (!isCurrentEvidence(item.evidence.checkedAt, now) || !isPrimaryReference(item.evidence.reference, item.provider)) return false;
  const text = item.evidence.quote.normalize("NFKC");
  if (item.kind === "foreignResidents") return !/外国(?:人|籍).*?(?:不可|禁止|未確認|要確認)/.test(text) && /外国(?:人|籍)(?:入居|契約)?[\s:：]*可(?:$|[\s。、・])/.test(text);
  if (item.kind === "corporateLease") return !/法人(?:契約|入居)?.*?(?:不可|禁止|未確認|要確認)/.test(text) && /法人(?:契約|入居)?[\s:：]*可(?:$|[\s。、・])/.test(text);
  return !/(?:ペット|犬|猫).{0,30}(?:不可|禁止|未確認|要確認|相談)/.test(text) && (/ペット[\s:：]*可(?:$|[\s。、・])/.test(text) || /(?:犬|猫).{0,24}(?:匹|頭)(?:まで|迄)?可(?:$|[\s。、・])/.test(text));
}
