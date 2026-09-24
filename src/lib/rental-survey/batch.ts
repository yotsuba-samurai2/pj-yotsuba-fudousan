import { z } from "zod";
import { providers } from "@/lib/school-rental-feed";
import { petTermsSchema } from "./pet-terms";

/**
 * 調査バッチ（1 scope × 1 媒体 × 1 回の取得）。ペット横断 指示書 版2.0 第4.2・5章。
 * - verified は「宣言した検索条件の全ページ」の結果。ペット対象で絞り込まない（expectedCount の突合を意味あるものにする）。
 * - incomplete / failed は状態と理由だけを記録し、観測行を持たない（確定には使えない）。
 * - 観測行はデータ最小化のため、住戸の照合・募集状態・ペット条件に必要な項目だけ。賃料・広告可否・画像は持たない。
 *   未知の項目は strict で拒否する。
 */
export const MAX_SURVEY_RECORDS = 3000;
export const MAX_SURVEY_BODY_BYTES = 5_000_000;

const text = z.string().trim().max(1600);

export const surveyRecordSchema = z.object({
  sourceId: z.string().trim().min(1).max(160),
  building: text.min(1),
  unit: text,
  address: text.min(1),
  availability: z.enum(["active", "closed", "unknown"]),
  application: z.enum(["none", "present", "unknown"]),
  applicationQuote: text,
  pet: petTermsSchema,
}).strict();
export type SurveyRecord = z.infer<typeof surveyRecordSchema>;

export const surveyBatchSchema = z.object({
  version: z.literal(1),
  scopeId: z.string().trim().min(1).max(80),
  scopeVersion: z.number().int().positive(),
  provider: z.enum(providers),
  status: z.enum(["verified", "incomplete", "failed"]),
  failureReason: text.optional(),
  observedFrom: z.iso.datetime({ offset: true }),
  observedTo: z.iso.datetime({ offset: true }),
  allPagesChecked: z.boolean(),
  expectedCount: z.number().int().nonnegative().max(MAX_SURVEY_RECORDS).optional(),
  records: z.array(surveyRecordSchema).max(MAX_SURVEY_RECORDS),
}).strict().superRefine((b, ctx) => {
  if (Date.parse(b.observedFrom) > Date.parse(b.observedTo))
    ctx.addIssue({ code: "custom", path: ["observedFrom"], message: "観測開始は観測終了以前にしてください" });
  if (b.status === "verified") {
    if (!b.allPagesChecked) ctx.addIssue({ code: "custom", path: ["allPagesChecked"], message: "全ページを確認していないバッチは verified にできません" });
    if (b.expectedCount === undefined) ctx.addIssue({ code: "custom", path: ["expectedCount"], message: "取得元で確認した検索総登録数 expectedCount を指定してください" });
    else if (b.expectedCount !== b.records.length) ctx.addIssue({ code: "custom", path: ["expectedCount"], message: "検索総登録数と取得件数が一致しません" });
    if (new Set(b.records.map(r => r.sourceId)).size !== b.records.length)
      ctx.addIssue({ code: "custom", path: ["records"], message: "取得元の物件IDが重複しています" });
  } else {
    if (b.records.length) ctx.addIssue({ code: "custom", path: ["records"], message: "未完了・失敗のバッチは観測行を持てません" });
    if (!b.failureReason) ctx.addIssue({ code: "custom", path: ["failureReason"], message: "未完了・失敗の理由を記録してください" });
  }
});
export type SurveyBatch = z.infer<typeof surveyBatchSchema>;
