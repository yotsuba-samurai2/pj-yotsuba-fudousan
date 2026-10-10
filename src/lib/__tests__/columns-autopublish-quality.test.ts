import { describe, expect, it } from "vitest";
import { columnQualityFingerprint, columnQualityReasons } from "@/lib/columns-autopublish-quality";
import { qualityArticle, qualityReview } from "./fixtures/column-quality";

describe("content-bound autopublish quality", () => {
  it("independent verified general-information review can pass", () => {
    const article = qualityArticle();
    expect(columnQualityReasons(article, [article], [qualityReview(article)], "2026-10-08")).toEqual([]);
  });
  it.each(["title", "excerpt", "content", "date"] as const)("invalidates changed Japanese %s", (field) => {
    const article = qualityArticle();
    const review = qualityReview(article);
    article[field] += " changed";
    expect(columnQualityReasons(article, [article], [review], "2026-10-08").join()).toContain("レビュー時から変更");
  });
  it.each(["en", "zh-tw", "zh"] as const)("invalidates changed %s FAQ metadata", (locale) => {
    const article = qualityArticle();
    const review = qualityReview(article);
    article.translations![locale]!.faq![0].answer += "changed";
    expect(columnQualityReasons(article, [article], [review], "2026-10-08").join()).toContain("レビュー時から変更");
  });
  it("fingerprint is stable for object key ordering and ignores publication status", () => {
    const article = qualityArticle();
    expect(columnQualityFingerprint({ ...article, status: "draft" })).toBe(columnQualityFingerprint(article));
    expect(columnQualityFingerprint(Object.fromEntries(Object.entries(article).reverse()) as typeof article)).toBe(columnQualityFingerprint(article));
  });
  it("requires qualified review of concrete legal decisions", () => {
    const article = qualityArticle();
    const review = qualityReview(article);
    review.requiresQualifiedReview = true;
    expect(columnQualityReasons(article, [article], [review], "2026-10-08").join()).toContain("資格者確認");
    review.reviewer.kind = "qualified-person";
    review.qualification = "行政書士";
    expect(columnQualityReasons(article, [article], [review], "2026-10-08")).toEqual([]);
  });
  it("blocks missing, duplicate and expired reviews", () => {
    const article = qualityArticle();
    const review = qualityReview(article);
    expect(columnQualityReasons(article, [article], [], "2026-10-08")).not.toEqual([]);
    expect(columnQualityReasons(article, [article], [review, review], "2026-10-08")).not.toEqual([]);
    expect(columnQualityReasons(article, [article], [review], "2026-10-09").join()).toContain("期限切れ");
  });
  it("blocks duplicates, untranslated content, missing languages and unsafe internal links", () => {
    const article = qualityArticle();
    const duplicate = qualityArticle("other");
    duplicate.title = article.title;
    article.translations!.en!.content = article.content;
    article.translations!.zh!.content += " [bad](/zh/../legal/services)";
    delete article.translations!["zh-tw"];
    const reasons = columnQualityReasons(article, [article, duplicate], [qualityReview(article)], "2026-10-08").join();
    expect(reasons).toContain("重複");
    expect(reasons).toContain("日本語原稿と同一");
    expect(reasons).toContain("zh-tw");
    expect(reasons).toContain("言語不一致");
  });
  it("blocks unverified sources and unresolved major findings even with a pass label", () => {
    const article = qualityArticle();
    const review = qualityReview(article);
    review.sources[0].verified = false;
    review.blockingFindings = ["unresolved major claim"];
    const reasons = columnQualityReasons(article, [article], [review], "2026-10-08").join();
    expect(reasons).toContain("一次根拠");
    expect(reasons).toContain("重大");
  });
  it("accepts locale home paths but blocks a Japanese FAQ with empty answers", () => {
    const article = qualityArticle();
    article.translations!.en!.content += " [home](/en)";
    expect(columnQualityReasons(article, [article], [qualityReview(article)], "2026-10-08")).toEqual([]);
    article.faq![0].answer = "";
    expect(columnQualityReasons(article, [article], [qualityReview(article)], "2026-10-08").join()).toContain("日本語");
  });
  it("checks absolute same-site locale links without rejecting sources or images", () => {
    const article = qualityArticle();
    article.translations!.en!.content += " [source](https://www.mhlw.go.jp/fixture) ![image](/images/fixture.png) [section](#faq)";
    expect(columnQualityReasons(article, [article], [qualityReview(article)], "2026-10-08")).toEqual([]);
    article.translations!.en!.content += " [wrong](https://luck428.com/legal/services)";
    expect(columnQualityReasons(article, [article], [qualityReview(article)], "2026-10-08").join()).toContain("言語不一致");
  });
});
