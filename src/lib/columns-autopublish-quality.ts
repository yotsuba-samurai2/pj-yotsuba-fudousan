import { createHash } from "node:crypto";
import type { ColumnInput } from "@/lib/column-shared";

export type ColumnQualityReview = {
  key: string;
  fingerprint: string;
  reviewer: { kind: "independent-model" | "qualified-person"; name: string; evidenceUrl: string };
  /** General information may use independent review; concrete legal decisions need a person. */
  requiresQualifiedReview: boolean;
  qualification?: "宅地建物取引士" | "行政書士" | "社会保険労務士";
  reviewedAt: string;
  validThrough: string;
  checks: {
    primarySources: "pass";
    duplicateIntent: "pass";
    legalClaims: "pass";
    translationAlignment: "pass";
  };
  sources: { url: string; checkedAt: string; relevantClaim: string; verified: boolean }[];
  blockingFindings: string[];
};

const LOCALES = ["ja", "en", "zh-tw", "zh"] as const;
const CHECKS = ["primarySources", "duplicateIntent", "legalClaims", "translationAlignment"] as const;

/** Absolute and relative site links must stay in the translation's language. */
export function mismatchedTranslationLinks(content: string, locale: "en" | "zh-tw" | "zh"): string[] {
  return [...content.matchAll(/(?<!!)\[[^\]]*\]\(([^\s)]*)\)/g)].map(([, href]) => href).filter((href) => {
    try {
      if (href.startsWith("#")) return false;
      const url = new URL(href, "https://luck428.com");
      if (url.hostname !== "luck428.com") return false;
      return url.pathname !== `/${locale}` && !url.pathname.startsWith(`/${locale}/`);
    } catch { return true; }
  });
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, canonical(v)]));
  }
  return value;
}

/** Bind every editorial field, including titles, all translations and FAQ/JSON-LD. */
export function columnQualityFingerprint(article: ColumnInput): string {
  const { status: _status, ...editorial } = article;
  void _status;
  return createHash("sha256").update(JSON.stringify(canonical(editorial))).digest("hex");
}

function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

function publicPrimaryUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password &&
      /\.(?:go|lg)\.jp$/.test(url.hostname);
  } catch { return false; }
}

const normalized = (value: string) => value.normalize("NFKC").replace(/\s+/g, "").toLowerCase();

/** Mechanical checks and a content-bound human review. This does not prove legal accuracy. */
export function columnQualityReasons(
  article: ColumnInput,
  inventory: readonly ColumnInput[],
  reviews: readonly ColumnQualityReview[],
  todayJst: string,
): string[] {
  const key = `${article.business}:${article.slug}`;
  const reasons: string[] = [];
  if (!validDate(article.date)) reasons.push("記事の日付が不正です");
  if (inventory.filter((a) => `${a.business}:${a.slug}` === key).length !== 1) {
    reasons.push("seedの識別子が重複しています");
  }
  if (inventory.some((a) => `${a.business}:${a.slug}` !== key &&
    (normalized(a.title) === normalized(article.title) || normalized(a.content) === normalized(article.content)))) {
    reasons.push("既存seedとタイトルまたは本文が重複しています");
  }
  if (article.locales?.length && LOCALES.some((locale) => !article.locales?.includes(locale))) {
    reasons.push("公開言語が4言語揃っていません");
  }
  if (![article.title, article.excerpt, article.content].every((s) => s.trim()) || article.faq?.length !== 4 ||
    article.faq.some((faq) => !faq.question.trim() || !faq.answer.trim())) {
    reasons.push("日本語の本文・見出し・FAQ4問が不足しています");
  }
  for (const locale of LOCALES.slice(1) as ("en" | "zh-tw" | "zh")[]) {
    const translation = article.translations?.[locale];
    if (!translation || ![translation.title, translation.excerpt, translation.content].every((s) => s.trim()) ||
      translation.faq?.length !== 4 || translation.faq.some((faq) => !faq.question.trim() || !faq.answer.trim())) {
      reasons.push(`${locale}の本文・見出し・FAQ4問が不足しています`);
      continue;
    }
    if (normalized(translation.content) === normalized(article.content)) {
      reasons.push(`${locale}の本文が日本語原稿と同一です`);
    }
    if (mismatchedTranslationLinks(translation.content, locale).length) reasons.push(`${locale}の内部リンクに言語不一致があります`);
  }
  const approvals = reviews.filter((review) => review.key === key);
  const review = approvals[0];
  if (approvals.length !== 1) {
    reasons.push("公開レビュー記録が未登録または重複しています");
    return reasons;
  }
  if (review.fingerprint !== columnQualityFingerprint(article)) reasons.push("原稿がレビュー時から変更されています");
  const requiredQualification = { realestate: "宅地建物取引士", legal: "行政書士", labor: "社会保険労務士" };
  if (!review.reviewer.name.trim() || !/^https:\/\/github\.com\/yotsuba-samurai2\/pj-yotsuba-fudousan\/(?:actions\/runs\/\d+|pull\/\d+)$/.test(review.reviewer.evidenceUrl)) {
    reasons.push("独立した公開レビューの証跡が不足しています");
  }
  if (review.requiresQualifiedReview && (review.reviewer.kind !== "qualified-person" ||
    review.qualification !== requiredQualification[article.business])) {
    reasons.push("担当分野の資格者確認が不足しています");
  }
  if (!validDate(review.reviewedAt) || !validDate(review.validThrough) ||
    review.reviewedAt > todayJst || review.validThrough < todayJst || review.validThrough < review.reviewedAt) {
    reasons.push("公開レビューの確認日または有効期限が不正・期限切れです");
  }
  if (CHECKS.some((check) => review.checks[check] !== "pass")) reasons.push("一次根拠・重複意図・法的事項・翻訳整合の確認が未完了です");
  if (!review.sources.length || review.sources.some((source) => !source.verified ||
    !publicPrimaryUrl(source.url) || !source.relevantClaim.trim() || !validDate(source.checkedAt) ||
    source.checkedAt > review.reviewedAt)) reasons.push("確認済みの公的な一次根拠が不足しています");
  if (review.blockingFindings.length) reasons.push("未解決の重大な確認事項があります");
  return reasons;
}
