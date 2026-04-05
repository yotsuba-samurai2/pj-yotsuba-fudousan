import columnsData from "./data/columns.json";

export type BusinessKey = "realestate" | "legal" | "labor";

export type Column = {
  id?: string;
  business: BusinessKey;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  modifiedDate?: string;
  ogImage?: string;
  author?: { name: string; title: string };
  keywords?: string[];
  faq?: Array<{ question: string; answer: string }>;
  tags?: string[];
  translations?: {
    en?: { title: string; excerpt: string; content: string; category?: string; keywords?: string[]; tags?: string[]; faq?: Array<{ question: string; answer: string }> };
    "zh-tw"?: { title: string; excerpt: string; content: string; category?: string; keywords?: string[]; tags?: string[]; faq?: Array<{ question: string; answer: string }> };
    zh?: { title: string; excerpt: string; content: string; category?: string; keywords?: string[]; tags?: string[]; faq?: Array<{ question: string; answer: string }> };
  };
};

/** 静的 JSON をフォールバックとして使用 */
const allColumns: Column[] = columnsData as Column[];

// ── Business filter helpers ──

function byBusiness(business: BusinessKey): Column[] {
  return allColumns.filter((c) => c.business === business);
}

// ── Realestate ──

export const columns: Column[] = byBusiness("realestate");

export function getLatestColumns(n: number): Column[] {
  return [...columns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

export function getColumnBySlug(slug: string): Column | undefined {
  return columns.find((c) => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return columns.map((c) => c.slug);
}

// ── Legal ──

export const legalColumns: Column[] = byBusiness("legal");

export function getLatestLegalColumns(n: number): Column[] {
  return [...legalColumns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

export function getLegalColumnBySlug(slug: string): Column | undefined {
  return legalColumns.find((c) => c.slug === slug);
}

export function getAllLegalSlugs(): string[] {
  return legalColumns.map((c) => c.slug);
}

// ── Labor ──

export const laborColumns: Column[] = byBusiness("labor");

export function getLatestLaborColumns(n: number): Column[] {
  return [...laborColumns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

export function getLaborColumnBySlug(slug: string): Column | undefined {
  return laborColumns.find((c) => c.slug === slug);
}

export function getAllLaborSlugs(): string[] {
  return laborColumns.map((c) => c.slug);
}

// ── Locale-aware helper ──

import type { LangCode } from "@/config/languages";

/**
 * ロケールに応じたコラムデータを返す
 * 翻訳が存在する場合はマージ、なければ日本語（デフォルト）
 */
export function getLocalizedColumn(column: Column, locale: LangCode): Column {
  if (locale === "ja" || !column.translations) return column;

  const trans = column.translations[locale as keyof typeof column.translations];
  if (!trans) return column;

  return {
    ...column,
    title: trans.title || column.title,
    excerpt: trans.excerpt || column.excerpt,
    content: trans.content || column.content,
    category: trans.category || column.category,
    keywords: trans.keywords?.length ? trans.keywords : column.keywords,
    tags: trans.tags?.length ? trans.tags : column.tags,
    faq: trans.faq?.length ? trans.faq : column.faq,
  };
}
