import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Business, Column as ColumnRow } from "@prisma/client";
import type { LangCode } from "@/config/languages";
import {
  isLocaleAllowed,
  getLocalizedColumn,
  pickRelatedColumns,
  filterColumnsByTheme,
  type BusinessKey,
  type Column,
  type ColumnTheme,
  type ColumnTranslationLocalized,
} from "@/lib/column-shared";

export { isLocaleAllowed, getLocalizedColumn, pickRelatedColumns, filterColumnsByTheme };
export type { BusinessKey, Column, ColumnTheme, ColumnTranslationLocalized };

function toColumn(row: ColumnRow): Column {
  return {
    id: row.id,
    business: row.business as BusinessKey,
    slug: row.slug,
    title: row.title,
    date: row.date,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    status: row.status,
    modifiedDate: row.modifiedDate ?? undefined,
    ogImage: row.ogImage ?? undefined,
    author: (row.author as Column["author"]) ?? undefined,
    keywords: row.keywords,
    faq: (row.faq as Column["faq"]) ?? undefined,
    tags: row.tags,
    locales: row.locales as LangCode[],
    translations: (row.translations as Column["translations"]) ?? undefined,
  };
}

// ── Prisma queries (published only) ──

/**
 * 現在ロケールの一覧・prev/next用。
 * locales 空配列＝全言語公開（Firestoreの「未設定」と等価）を含める。
 */
const fetchPublished = cache(
  async (business: BusinessKey, locale: LangCode): Promise<Column[]> => {
    const rows = await prisma.column.findMany({
      where: {
        business: business as Business,
        status: "published",
        OR: [{ locales: { isEmpty: true } }, { locales: { has: locale } }],
      },
      orderBy: { date: "desc" },
    });
    return rows.map(toColumn);
  },
);

/**
 * 全ロケール横断（localeフィルタ無し）。sitemap.ts と generateStaticParams 専用。
 * 一覧・詳細ページの表示には使わない（使うと出し分けが効かなくなる）。
 */
const fetchAllPublished = cache(async (business: BusinessKey): Promise<Column[]> => {
  const rows = await prisma.column.findMany({
    where: { business: business as Business, status: "published" },
    orderBy: { date: "desc" },
  });
  return rows.map(toColumn);
});

const fetchPublishedBySlug = cache(
  async (business: BusinessKey, slug: string): Promise<Column | undefined> => {
    const row = await prisma.column.findFirst({
      where: { business: business as Business, slug, status: "published" },
    });
    return row ? toColumn(row) : undefined;
  },
);

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
