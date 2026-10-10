import type { ColumnInput } from "@/lib/column-shared";
import { columnQualityFingerprint, type ColumnQualityReview } from "@/lib/columns-autopublish-quality";

export function qualityArticle(slug = "anonymous-fixture"): ColumnInput {
  const faq = Array.from({ length: 4 }, (_, i) => ({ question: `Q${i}`, answer: `A${i}` }));
  return {
    business: "legal", slug, title: `title-${slug}`, date: "2026-10-07", category: "fixture",
    excerpt: "anonymous", content: `日本語原稿-${slug}`, status: "published", faq,
    translations: Object.fromEntries(["en", "zh-tw", "zh"].map((locale) => [locale, {
      title: `${locale}-${slug}`, excerpt: "anonymous", content: `${locale}-content-${slug}`,
      faq: faq.map(({ question, answer }) => ({ question: `${locale}-${question}`, answer: `${locale}-${answer}` })),
    }])),
  };
}

export function qualityReview(article: ColumnInput): ColumnQualityReview {
  return {
    key: `${article.business}:${article.slug}`, fingerprint: columnQualityFingerprint(article),
    reviewer: { kind: "independent-model", name: "anonymous independent reviewer",
      evidenceUrl: "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/1" },
    requiresQualifiedReview: false, reviewedAt: "2026-10-07", validThrough: "2026-10-08",
    checks: { primarySources: "pass", duplicateIntent: "pass", legalClaims: "pass", translationAlignment: "pass" },
    sources: [{ url: "https://www.mhlw.go.jp/anonymous-fixture", checkedAt: "2026-10-07",
      relevantClaim: "anonymous fixture only, no network request", verified: true }], blockingFindings: [],
  };
}
