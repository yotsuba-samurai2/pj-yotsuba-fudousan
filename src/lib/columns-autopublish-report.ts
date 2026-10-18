/** Publication facts from the API/status branch, including older skipped strings. */
export type PublishReportResult = {
  ok?: boolean;
  outcome?: "success" | "partial" | "held" | "dry-run" | "failure";
  dryRun?: boolean;
  targets?: { title: string; path: string }[];
  published?: { key?: string; title: string; path: string; business?: string }[];
  held?: { key?: string; title: string; path: string; qualityHoldReasons?: string[] }[];
  skipped?: string | { key?: string; title?: string; path?: string; skipReason?: string }[];
  errors?: { key: string; message: string }[];
  blocked?: string;
  refreshError?: string;
  error?: string;
};

export function publicationErrors(result: PublishReportResult) {
  return (result.errors ?? []).filter(error => !(result.held ?? []).some(held =>
    held.key === error.key && held.qualityHoldReasons?.length &&
    error.message === `品質確認待ち：${held.qualityHoldReasons.join("／")}`));
}

export function publicationOutcome(result: PublishReportResult) {
  if (result.outcome === "failure" || result.error || result.refreshError || publicationErrors(result).length) return "failure";
  if (typeof result.skipped === "string") return "not-run";
  if (result.dryRun) return "dry-run";
  if (result.blocked || result.held?.some(item => item.qualityHoldReasons?.length)) return result.published?.length ? "partial" : "held";
  if (result.ok === false) return "failure";
  return "success";
}

export function renderPublicationSummary(result: PublishReportResult): string[] {
  const labels = { failure: "失敗", "not-run": "未実行", "dry-run": "dry-run", partial: "部分成功", held: "保留", success: "成功" };
  const lines = [`- 公開結果：${labels[publicationOutcome(result)]}`];
  if (typeof result.skipped === "string") lines.push(`- 実行していません（${result.skipped}）`);
  if (result.error) lines.push(`- 失敗：${result.error}`);
  if (result.dryRun) {
    lines.push(`- dry-run（公開していません）：公開予定 ${result.targets?.length ?? 0}本`);
    for (const item of result.targets ?? []) lines.push(`  - https://luck428.com${item.path}　${item.title}`);
  }
  lines.push(Array.isArray(result.published) ? `- 公開した記事：${result.published.length}本` : "- 公開した記事：件数未確認（公開結果を取得できていません）");
  for (const item of result.published ?? []) lines.push(`  - https://luck428.com${item.path}　${item.title}`);
  if (result.blocked) lines.push(`- 公開保留：${result.blocked}`);
  if (result.held?.length) {
    lines.push(`- 保留中（自動公開していない）：${result.held.length}本`);
    for (const item of result.held) {
      lines.push(`  - ${item.title}`);
      for (const reason of item.qualityHoldReasons ?? []) lines.push(`    - ${reason}`);
    }
  }
  if (Array.isArray(result.skipped) && result.skipped.length) {
    lines.push(`- 競合等で対象外：${result.skipped.length}本（再公開していません）`);
    for (const item of result.skipped) lines.push(`  - ${item.title ?? item.key}：${item.skipReason ?? "対象外"}`);
  }
  for (const error of publicationErrors(result)) lines.push(`- 失敗：${error.key}：${error.message}`);
  if (result.refreshError) lines.push(`- 公開ページの更新に失敗：${result.refreshError}`);
  return lines;
}
