import { describe, expect, it } from "vitest";
import { recordIndependentColumnReviews } from "@/lib/columns-autopublish-review-record";
import { qualityArticle, qualityReview } from "./fixtures/column-quality";

const URL = "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/1";
function fixture() {
  const article = qualityArticle();
  const review = qualityReview(article);
  const candidates = [{ key: review.key, fingerprint: review.fingerprint }];
  const output = { pass: true, findings: [] as { file: string; severity: string; issue: string; fix: string }[], articles: [review] };
  return { article, review, candidates, output };
}
describe("existing independent review proof bridge", () => {
  it("records unchanged complete independent proof with no extra review calls", () => {
    const { article, candidates, output } = fixture();
    const result = recordIndependentColumnReviews(candidates, output, [article], [], "2026-10-08", URL);
    expect(result.held).toEqual([]);
    expect(result.reviews).toHaveLength(1);
    expect(result.reviews[0].validThrough).toBe("2026-10-10");
    expect(result.reviews[0].reviewer.kind).toBe("independent-model");
  });
  it.each([undefined, { pass: true, findings: [] }, { pass: true, findings: [], articles: [] }])("holds incomplete legacy report %#", (output) => {
    const { article, candidates } = fixture();
    const result = recordIndependentColumnReviews(candidates, output, [article], [], "2026-10-08", URL);
    expect(result.reviews).toEqual([]);
    expect(result.held).toHaveLength(1);
  });
  it("does not approve a fixed article using its earlier rejected or stale review", () => {
    const { article, candidates, output } = fixture();
    article.content += "fix after review";
    const result = recordIndependentColumnReviews(candidates, output, [article], [], "2026-10-08", URL);
    expect(result.reviews).toEqual([]);
    expect(result.held[0].reasons.join()).toContain("原稿変更");
  });
  it("rejects a pass=true report with major findings", () => {
    const { article, candidates, output } = fixture();
    output.findings.push({ file: "anonymous.md", severity: "major", issue: "unverified central claim", fix: "verify" });
    expect(recordIndependentColumnReviews(candidates, output, [article], [], "2026-10-08", URL).reviews).toEqual([]);
  });
  it("does not manufacture qualified review from model output", () => {
    const { article, candidates, output } = fixture();
    output.articles[0].requiresQualifiedReview = true;
    output.articles[0].reviewer.kind = "qualified-person";
    output.articles[0].qualification = "行政書士";
    const result = recordIndependentColumnReviews(candidates, output, [article], [], "2026-10-08", URL);
    expect(result.reviews).toEqual([]);
    expect(result.held[0].reasons.join()).toContain("資格者確認");
  });
  it("replaces changed key reviews but preserves unrelated approvals", () => {
    const { article, candidates } = fixture();
    const other = qualityArticle("other");
    const existing = [qualityReview(article), qualityReview(other)];
    const result = recordIndependentColumnReviews(candidates, undefined, [article, other], existing, "2026-10-08", URL);
    expect(result.reviews).toEqual([existing[1]]);
  });
});
