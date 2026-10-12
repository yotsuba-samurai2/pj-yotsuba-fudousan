import type { ColumnInput } from "@/lib/column-shared";
import { columnQualityFingerprint, columnQualityReasons, type ColumnQualityReview } from "@/lib/columns-autopublish-quality";
import { independentColumnReportSchema, type QualityCandidate } from "@/lib/columns-autopublish-review-record";

type Input = {
  candidates: readonly QualityCandidate[];
  inventory: readonly ColumnInput[];
  recordedReviews: readonly ColumnQualityReview[];
  recordedHolds: readonly { key: string; reasons: string[] }[];
  reviewOutput: unknown;
  reviewResult: string;
  todayJst: string;
  runUrl: string;
};

/** Offline delivery facts. Quality eligibility never promises a DB/publication result. */
export function buildColumnDeliveryReport(input: Input) {
  const parsed = independentColumnReportSchema.safeParse(input.reviewResult === "success" ? input.reviewOutput : undefined);
  const findings = parsed.success ? {
    blocker: parsed.data.findings.filter(f => f.severity === "blocker").length,
    major: parsed.data.findings.filter(f => f.severity === "major").length,
    minor: parsed.data.findings.filter(f => f.severity === "minor").length,
  } : null;
  const reviews = parsed.success ? input.recordedReviews : [];
  const articles = input.candidates.map(candidate => {
    const article = input.inventory.find(a => `${a.business}:${a.slug}` === candidate.key);
    const registered = reviews.some(r => r.key === candidate.key && r.fingerprint === candidate.fingerprint);
    const proof = parsed.success ? parsed.data.articles.find(a => a.key === candidate.key && a.fingerprint === candidate.fingerprint) : undefined;
    const sourceFailures = proof?.sources.filter(s => !s.verified) ?? [];
    const reasons = article ? columnQualityReasons(article, input.inventory, reviews, input.todayJst) : ["対象原稿がありません"];
    if (article && columnQualityFingerprint(article) !== candidate.fingerprint) reasons.push("候補指紋と修正後原稿が一致しません");
    if (!parsed.success) reasons.push("レビュー結果は未確認です（処理失敗・未取得・形式不正）");
    for (const reason of input.recordedHolds.filter(h => h.key === candidate.key).flatMap(h => h.reasons)) {
      if (!reasons.includes(reason)) reasons.push(reason);
    }
    const state = reasons.length ? "held" : article!.date > input.todayJst ? "scheduled" : "quality-eligible";
    return { ...candidate, title: article?.title ?? candidate.key, registered, state, reasons, sourceFailures,
      sourceEvidenceAvailable: Boolean(proof) };
  });
  return {
    todayJst: input.todayJst, runUrl: input.runUrl,
    generationStatus: "validated" as const, generatedCount: articles.length,
    reviewResult: input.reviewResult, reviewReportAvailable: parsed.success,
    reviewPass: parsed.success ? parsed.data.pass : null, findings,
    reviewFindings: parsed.success ? parsed.data.findings : null,
    registeredCount: articles.filter(a => a.registered).length,
    qualityEligibleCount: articles.filter(a => a.state === "quality-eligible").length,
    heldCount: articles.filter(a => a.state === "held").length,
    scheduledCount: articles.filter(a => a.state === "scheduled").length,
    unverifiedSourceCount: parsed.success && articles.every(a => a.sourceEvidenceAvailable)
      ? articles.reduce((n, a) => n + a.sourceFailures.length, 0) : null,
    publishedCount: null, // This offline recorder never reads or writes production DB.
    articles,
  };
}

export type ColumnDeliveryReport = ReturnType<typeof buildColumnDeliveryReport>;

export function renderColumnDeliveryReport(report: ColumnDeliveryReport): string {
  const lines = [
    `# コラム生成・レビュー・公開判定（${report.todayJst}）`, "",
    `- 生成・機械検証：成功 ${report.generatedCount}本`,
    `- レビュー処理：${report.reviewResult} ／ 判定：${report.reviewPass === null ? "未確認" : report.reviewPass}`,
    report.findings ? `- レビュー指摘：blocker ${report.findings.blocker}／major ${report.findings.major}／minor ${report.findings.minor}` : "- レビュー結果は未確認です。指摘件数は不明です。",
    `- 今回の候補指紋に対応する公開証跡登録：${report.registeredCount}本`,
    `- 自動公開の品質候補：${report.qualityEligibleCount}本`,
    `- 品質保留：${report.heldCount}本 ／ 公開日待ち：${report.scheduledCount}本`,
    `- 未確認の一次資料：${report.unverifiedSourceCount === null ? "未照会（件数不明）" : `${report.unverifiedSourceCount}件`}`,
    "- 本番公開：この処理では実行していません。公開済み件数は未照会です。", "",
    report.qualityEligibleCount === 0
      ? `正午の自動公開に渡せる品質候補は0本です。${report.heldCount}本は保留、${report.scheduledCount}本は公開日待ちです。`
      : `${report.qualityEligibleCount}本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。`,
    "未確認記事の品質保留はforceでも解除しません。", "",
    "## 記事別の判定", "",
  ];
  for (const article of report.articles) {
    lines.push(`- ${article.title}：${article.state}（${article.key}）`);
    for (const reason of article.reasons) lines.push(`  - ${reason}`);
    for (const source of article.sourceFailures) lines.push(`  - 未確認一次資料：${source.url} — ${source.relevantClaim}`);
  }
  if (report.reviewFindings?.length) {
    lines.push("", "## レビューの指摘", "");
    for (const finding of report.reviewFindings) lines.push(`- [${finding.severity}] ${finding.file}：${finding.issue} ／ 修正案：${finding.fix}`);
  }
  if (report.runUrl) lines.push("", `実行証跡：${report.runUrl}`);
  return lines.join("\n") + "\n";
}
