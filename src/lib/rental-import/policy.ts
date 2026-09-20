import { z } from "zod";

/** Business rules explicitly instructed by the operator on 2026-09-20. */
export const RENTAL_IMPORT_POLICY = {
  id: "operator-20260920-v2",
  advertising: "any-matched-current-allow",
  images: "operator-blanket-allow",
  conditions: "strictest-observed",
  pets: "largest-observed-count",
  endedListings: "exclude-any-confirmed-end",
} as const;

export const evidenceSchema = z.object({
  checkedAt: z.iso.datetime({ offset: true }),
  reference: z.string().trim().min(1).max(1000),
  quote: z.string().trim().min(1).max(5000),
});
const option = z.object({ value: z.string().trim().min(1), evidence: evidenceSchema });
const common = {
  resolves: z.array(z.string()).default([]),
  /** When changing one clause, preserve the remaining special conditions verbatim. */
  replace: z.string().trim().min(1).optional(),
};
/** Quantities come from the cited terms; all options must use the same base and units. */
const burdenSchema = z.partialRecord(z.enum([
  "initialYen", "monthlyYen", "annualYen", "initialPercent", "monthlyPercent", "annualPercent",
  "required", "minimumStayMonths", "noticeMonths", "penaltyRentMonths", "depositRentMonths",
]), z.number().finite().nonnegative()).refine((v) => Object.keys(v).length > 0, "比較値が必要です");
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
]);
export type ConditionChoice = z.infer<typeof conditionChoiceSchema>;
export function normalized(text: string) { return text.normalize("NFKC").replace(/\s/g, "").toLowerCase(); }
export function isCurrentEvidence(t: string, now: Date, hours = 24) {
  const age = now.getTime() - Date.parse(t);
  return Number.isFinite(age) && age >= 0 && age <= hours * 3600_000;
}
export function hasAdvertisingAllow(quote: string) {
  // A field caption (広告可否) is not an affirmative value. Negative wording is separate evidence.
  const text = quote.normalize("NFKC");
  return /広告(?:掲載|転載)?[\s:：]*可(?:$|[\s。、,;；」』）)])/m.test(text)
    && !/広告(?:掲載|転載)?[\s:：]*(?:不可|禁止)|広告(?:掲載|転載)?可[\s]*では(?:ない|ありません)/.test(text);
}

/** Select an entire observed term; never manufacture a combination of separate fee plans. */
export function selectCondition(choice: ConditionChoice, now: Date): { ok: true; index: number; value: string } | { ok: false; reason: string } {
  const held = (reason: string) => ({ ok: false as const, reason: `${choice.field}: ${reason}` });
  if (choice.options.some((o) => !isCurrentEvidence(o.evidence.checkedAt, now) || !normalized(o.evidence.quote).includes(normalized(o.value)))) return held("最新の原文と転載内容を照合してください");
  let indices: number[];
  if (choice.rule === "most-pets") {
    if (choice.options.some((o) => !Array.from(o.value.normalize("NFKC").matchAll(/(\d+)\s*匹/g)).some((m) => Number(m[1]) === o.maxCount))) return held("ペット頭数が原文と一致しません");
    const max = Math.max(...choice.options.map((o) => o.maxCount));
    indices = choice.options.flatMap((o, i) => o.maxCount === max ? [i] : []);
  } else {
    const keys = Object.keys(choice.options[0].burden).sort() as (keyof typeof choice.options[number]["burden"])[];
    if (choice.options.some((o) => JSON.stringify(Object.keys(o.burden).sort()) !== JSON.stringify(keys))) return held("同じ項目・算定基準で条件を比較してください");
    indices = choice.options.flatMap((o, i) => choice.options.every((other) => keys.every((key) => o.burden[key]! >= other.burden[key]!)) ? [i] : []);
  }
  if (!indices.length) return held("初回費用と継続費用などの大小が逆で、厳しい方を一意に選べません");
  if (new Set(indices.map((i) => normalized(choice.options[i].value))).size > 1) return held("比較値が同じでその他の条件が異なります");
  const index = indices[0];
  return { ok: true, index, value: choice.options[index].value };
}
