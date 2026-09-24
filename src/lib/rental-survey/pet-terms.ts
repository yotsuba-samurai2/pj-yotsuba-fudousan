import { z } from "zod";

/**
 * ペット条件の正式分類（ペット横断 指示書 版2.0 第6章）。「複数飼育」と「大型犬」は別の軸。
 * - 複数飼育は2頭以上。「ペット相談」だけでは複数飼育相談可にしない（unconfirmed-count）。
 * - 猫2頭可を猫3頭可に含めない、大型犬1頭可を複数飼育可に含めない（頭数は limits で別に持つ）。
 * - 確定的な状態（可・相談・1頭限定・不可）は根拠の原文 petQuote を必須にする。
 * 分類は媒体の記載を人が確認して入れる。AI・正規表現で「可」を確定しない。
 */
export const multiPetStates = ["allowed", "consult", "unconfirmed-count", "single-only", "not-allowed"] as const;
export const largeDogStates = ["allowed", "consult", "not-allowed", "unconfirmed"] as const;
export const speciesStates = ["cat", "dog", "cat-and-dog", "other-or-unconfirmed"] as const;

const quote = z.string().trim().max(1600);
const headLimit = z.number().int().positive().max(99).nullable();

export const petTermsSchema = z.object({
  multi: z.enum(multiPetStates),
  species: z.enum(speciesStates),
  limits: z.object({ cats: headLimit, dogs: headLimit, total: headLimit }).strict(),
  largeDog: z.enum(largeDogStates),
  /** 貸主承諾・管理規約・敷金の追加などの条件（原文）。 */
  conditions: quote,
  /** 分類の根拠にした原文。 */
  petQuote: quote,
}).strict().superRefine((t, ctx) => {
  const definite = t.multi !== "unconfirmed-count" || t.largeDog !== "unconfirmed";
  if (definite && !t.petQuote) ctx.addIssue({ code: "custom", path: ["petQuote"], message: "可・相談・不可などを確定するには根拠の原文が必要です" });
  if ((t.multi === "allowed" || t.multi === "consult") && t.limits.total === 1)
    ctx.addIssue({ code: "custom", path: ["limits", "total"], message: "合計1頭までの記載と複数飼育可は両立しません" });
  if (t.multi === "single-only" && t.limits.total !== null && t.limits.total > 1)
    ctx.addIssue({ code: "custom", path: ["limits", "total"], message: "1頭限定と2頭以上の上限は両立しません" });
  if (t.species === "cat" && (t.largeDog === "allowed" || t.largeDog === "consult"))
    ctx.addIssue({ code: "custom", path: ["largeDog"], message: "猫のみ可の記載と大型犬可は両立しません" });
});
export type PetTerms = z.infer<typeof petTermsSchema>;

export function allowsMultiplePets(t: Pick<PetTerms, "multi">) {
  return t.multi === "allowed" || t.multi === "consult";
}
export function allowsLargeDog(t: Pick<PetTerms, "largeDog">) {
  return t.largeDog === "allowed" || t.largeDog === "consult";
}
/** 住宅マッチング調査の確定対象：複数飼育可・相談可、または大型犬可・相談可（和集合）。 */
export function isPetSurveyTarget(t: Pick<PetTerms, "multi" | "largeDog">) {
  return allowsMultiplePets(t) || allowsLargeDog(t);
}
