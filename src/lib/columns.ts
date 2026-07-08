import { cache } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import type { LangCode } from "@/config/languages";

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
  status?: string;
  modifiedDate?: string;
  ogImage?: string;
  author?: { name: string; title: string };
  keywords?: string[];
  faq?: Array<{ question: string; answer: string }>;
  tags?: string[];
  /** このコラムを公開する言語。未設定＝全言語（後方互換のデフォルト） */
  locales?: LangCode[];
  translations?: {
    en?: ColumnTranslationLocalized;
    "zh-tw"?: ColumnTranslationLocalized;
    zh?: ColumnTranslationLocalized;
  };
};

export type ColumnTranslationLocalized = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  keywords?: string[];
  tags?: string[];
  author?: { name: string; title: string };
  faq?: Array<{ question: string; answer: string }>;
};

const COLLECTION = "columns";

function toColumn(id: string, data: Record<string, unknown>): Column {
  const { createdAt, updatedAt, ...rest } = data;
  return { id, ...rest } as Column;
}

// ── Firestore queries (published only) ──

/** 現在ロケールの一覧・prev/next用。locales に current locale を含むもののみ（array-contains） */
const fetchPublished = cache(async (business: BusinessKey, locale: LangCode): Promise<Column[]> => {
  const q = query(
    collection(db, COLLECTION),
    where("business", "==", business),
    where("status", "==", "published"),
    where("locales", "array-contains", locale),
    orderBy("date", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toColumn(d.id, d.data()));
});

/**
 * 全ロケール横断（localeフィルタ無し）。sitemap.ts と generateStaticParams 専用。
 * 一覧・詳細ページの表示には使わない（使うと出し分けが効かなくなる）。
 */
const fetchAllPublished = cache(async (business: BusinessKey): Promise<Column[]> => {
  const q = query(
    collection(db, COLLECTION),
    where("business", "==", business),
    where("status", "==", "published"),
    orderBy("date", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toColumn(d.id, d.data()));
});

const fetchPublishedBySlug = cache(async (business: BusinessKey, slug: string): Promise<Column | undefined> => {
  const q = query(
    collection(db, COLLECTION),
    where("business", "==", business),
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return undefined;
  const d = snap.docs[0];
  return toColumn(d.id, d.data());
});

// ── Realestate ──

export async function getColumns(locale: LangCode): Promise<Column[]> {
  return fetchPublished("realestate", locale);
}

export async function getLatestColumns(n: number, locale: LangCode): Promise<Column[]> {
  const cols = await fetchPublished("realestate", locale);
  return cols.slice(0, n);
}

export async function getColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("realestate", slug);
}

/** sitemap.ts・generateStaticParams専用（全ロケール横断） */
export async function getAllColumnsAllLocales(): Promise<Column[]> {
  return fetchAllPublished("realestate");
}

export async function getAllSlugs(): Promise<string[]> {
  const cols = await fetchAllPublished("realestate");
  return cols.map((c) => c.slug);
}

// ── Legal ──

export async function getLegalColumns(locale: LangCode): Promise<Column[]> {
  return fetchPublished("legal", locale);
}

export async function getLatestLegalColumns(n: number, locale: LangCode): Promise<Column[]> {
  const cols = await fetchPublished("legal", locale);
  return cols.slice(0, n);
}

export async function getLegalColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("legal", slug);
}

/** sitemap.ts・generateStaticParams専用（全ロケール横断） */
export async function getAllLegalColumnsAllLocales(): Promise<Column[]> {
  return fetchAllPublished("legal");
}

export async function getAllLegalSlugs(): Promise<string[]> {
  const cols = await fetchAllPublished("legal");
  return cols.map((c) => c.slug);
}

// ── Labor ──

export async function getLaborColumns(locale: LangCode): Promise<Column[]> {
  return fetchPublished("labor", locale);
}

export async function getLatestLaborColumns(n: number, locale: LangCode): Promise<Column[]> {
  const cols = await fetchPublished("labor", locale);
  return cols.slice(0, n);
}

export async function getLaborColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("labor", slug);
}

export async function getAllLaborSlugs(): Promise<string[]> {
  const cols = await fetchAllPublished("labor");
  return cols.map((c) => c.slug);
}

// ── Locale-aware helper ──

/** locales 未設定＝全言語許可（後方互換）。設定済みなら現在ロケールを含むかで判定 */
export function isLocaleAllowed(column: Column, locale: LangCode): boolean {
  return !column.locales || column.locales.includes(locale);
}

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
    author:
      trans.author && (trans.author.name || trans.author.title)
        ? trans.author
        : column.author,
  };
}
