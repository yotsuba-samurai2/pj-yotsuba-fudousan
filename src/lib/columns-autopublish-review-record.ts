import { z } from "zod";
import type { ColumnInput } from "@/lib/column-shared";
import { columnQualityFingerprint, columnQualityReasons, type ColumnQualityReview } from "@/lib/columns-autopublish-quality";

export type QualityCandidate = { key: string; fingerprint: string };
const reportSchema = z.object({
  pass: z.boolean(),
  findings: z.array(z.object({ file: z.string(), severity: z.enum(["blocker", "major", "minor"]), issue: z.string(), fix: z.string() })),
  articles: z.array(z.object({
    key: z.string(), fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
    requiresQualifiedReview: z.boolean(),
    checks: z.object({ primarySources: z.enum(["pass", "hold"]), duplicateIntent: z.enum(["pass", "hold"]),
      legalClaims: z.enum(["pass", "hold"]), translationAlignment: z.enum(["pass", "hold"]) }),
    sources: z.array(z.object({ url: z.string(), checkedAt: z.string(), relevantClaim: z.string(), verified: z.boolean() })),
    blockingFindings: z.array(z.string()),
  })),
});

/** Record only the existing independent review's unchanged, complete proof. No AI calls. */
export function recordIndependentColumnReviews(
  candidates: readonly QualityCandidate[],
  output: unknown,
  inventory: readonly ColumnInput[],
  existing: readonly ColumnQualityReview[],
  todayJst: string,
  evidenceUrl: string,
): { reviews: ColumnQualityReview[]; held: { key: string; reasons: string[] }[] } {
  const result = reportSchema.safeParse(output);
  const changed = new Set(candidates.map((candidate) => candidate.key));
  const reviews = existing.filter((review) => !changed.has(review.key));
  const held: { key: string; reasons: string[] }[] = [];
  for (const candidate of candidates) {
    const article = inventory.find((a) => `${a.business}:${a.slug}` === candidate.key);
    const proof = result.success ? result.data.articles.filter((a) => a.key === candidate.key) : [];
    if (!result.success || !article || proof.length !== 1 || candidate.fingerprint !== proof[0].fingerprint ||
      candidate.fingerprint !== columnQualityFingerprint(article)) {
      held.push({ key: candidate.key, reasons: ["独立レビューの証跡不足、重複、またはレビュー後の原稿変更"] });
      continue;
    }
    // A global failed/major review cannot be transformed into per-article approval.
    // Keep the conservative batch hold when findings cannot be reliably scoped.
    if (!result.data.pass || result.data.findings.some((f) => f.severity !== "minor")) {
      held.push({ key: candidate.key, reasons: ["独立レビューに未解決の重大な指摘があります"] });
      continue;
    }
    const { checks, ...rest } = proof[0];
    if (Object.values(checks).some((check) => check !== "pass")) {
      held.push({ key: candidate.key, reasons: ["記事別の一次根拠・重複・法的事項・翻訳整合が未完了"] });
      continue;
    }
    const review: ColumnQualityReview = { ...rest, checks: checks as ColumnQualityReview["checks"],
      reviewer: { kind: "independent-model", name: "Daily Columns independent review", evidenceUrl },
      reviewedAt: todayJst,
      // The next noon publication can be delayed; re-review after two JST days.
      validThrough: new Date(Date.parse(todayJst) + 2 * 86400000).toISOString().slice(0, 10),
    };
    const reasons = columnQualityReasons(article, inventory, [review], todayJst);
    if (reasons.length) held.push({ key: candidate.key, reasons });
    else reviews.push(review);
  }
  return { reviews, held };
}
