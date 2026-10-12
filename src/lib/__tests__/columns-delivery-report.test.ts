import { describe, expect, it } from "vitest";
import { buildColumnDeliveryReport, renderColumnDeliveryReport } from "@/lib/columns-autopublish-delivery";
import { recordIndependentColumnReviews } from "@/lib/columns-autopublish-review-record";
import { columnQualityFingerprint } from "@/lib/columns-autopublish-quality";
import { qualityArticle, qualityReview } from "./fixtures/column-quality";

const runUrl = "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/38160195514";
function fixture() {
  const a = qualityArticle();
  const b = { ...qualityArticle(), slug: "other-daily-article", title: "Other daily article", content: qualityArticle().content + " Another intent." };
  const inventory = [a, b];
  const candidates = inventory.map(article => ({ key: `${article.business}:${article.slug}`, fingerprint: columnQualityFingerprint(article) }));
  const reviews = inventory.map(article => qualityReview(article));
  const output = { pass: true, findings: [] as { file: string; severity: "minor" | "major"; issue: string; fix: string }[], articles: reviews };
  return { inventory, candidates, output };
}
function assess(f: ReturnType<typeof fixture>, reviewResult = "success") {
  const result = recordIndependentColumnReviews(f.candidates, reviewResult === "success" ? f.output : undefined,
    f.inventory, [], "2026-10-08", runUrl);
  const report = buildColumnDeliveryReport({ ...f, recordedReviews: result.reviews, recordedHolds: result.held,
    reviewOutput: f.output, reviewResult, todayJst: "2026-10-08", runUrl });
  return { report, text: renderColumnDeliveryReport(report), result };
}
describe("truthful Daily delivery and publication state", () => {
  it("keeps generation success separate from zero approvals and failed source retrieval", () => {
    const f = fixture();
    f.output.articles.forEach(article => { article.sources[0].verified = false; });
    const { report, text, result } = assess(f);
    expect(report.generatedCount).toBe(2);
    expect(report.registeredCount).toBe(0);
    expect(report.qualityEligibleCount).toBe(0);
    expect(report.heldCount).toBe(2);
    expect(report.unverifiedSourceCount).toBe(2);
    expect(result.reviews).toEqual([]);
    expect(text).toContain("自動公開の品質候補：0本");
    expect(text).toContain("2本は保留");
    expect(text).not.toContain("正午に自動で公開されます");
  });
  it("reports partial approval and each held article without unlocking other-day drafts", () => {
    const f = fixture();
    f.output.articles[1].sources[0].verified = false;
    const { report, result, text } = assess(f);
    expect(report.registeredCount).toBe(1);
    expect(report.qualityEligibleCount).toBe(1);
    expect(report.heldCount).toBe(1);
    expect(result.reviews.map(r => r.key)).toEqual([f.candidates[0].key]);
    expect(text).toContain("公開実行時に再判定");
    expect(text).not.toContain("全記事公開");
  });
  it("shows minor findings even when the overall review passes", () => {
    const f = fixture(); f.output.findings.push({ file: "anonymous.md", severity: "minor", issue: "Broken primary URL", fix: "Replace URL" });
    const { report, text } = assess(f);
    expect(report.findings?.minor).toBe(1);
    expect(text).toContain("minor 1");
    expect(text).not.toContain("指摘なし");
  });
  it.each(["failure", "cancelled", "skipped", "unknown"])("holds cached proof on review process %s", (reviewResult) => {
    const f = fixture(); const { report, result, text } = assess(f, reviewResult);
    expect(result.reviews).toEqual([]);
    expect(report.registeredCount).toBe(0);
    expect(report.qualityEligibleCount).toBe(0);
    expect(report.heldCount).toBe(2);
    expect(report.findings).toBeNull();
    expect(text).toContain("レビュー結果は未確認");
    expect(text).not.toContain("指摘なし");
  });
  it("rejects malformed reports and stale fingerprints instead of treating missing findings as zero", () => {
    const f = fixture(); const result = recordIndependentColumnReviews(f.candidates, { pass: true }, f.inventory, [], "2026-10-08", runUrl);
    const malformed = buildColumnDeliveryReport({ ...f, recordedReviews: [], recordedHolds: result.held, reviewOutput: { pass: true }, reviewResult: "success", todayJst: "2026-10-08", runUrl });
    expect(malformed.findings).toBeNull();
    expect(malformed.qualityEligibleCount).toBe(0);
    f.inventory[0].content += " Revised content.";
    const stale = assess(f);
    expect(stale.report.heldCount).toBe(1);
    expect(stale.report.articles[0].reasons.join(" ")).toContain("指紋");
    f.candidates[0].fingerprint = columnQualityFingerprint(f.inventory[0]);
    expect(assess(f).report.unverifiedSourceCount).toBeNull();
  });
  it("does not promise noon publication even for complete proof", () => {
    const { report, text } = assess(fixture());
    expect(report.qualityEligibleCount).toBe(2);
    expect(text).toContain("手動保留・既存DB・公開日・有効期限");
    expect(text).not.toContain("正午に自動で公開されます");
  });
});
