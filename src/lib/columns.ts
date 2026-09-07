import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { Prisma, type Business, type Column as ColumnRow } from "@prisma/client";
import { languages, type LangCode } from "@/config/languages";
import {
  isLocaleAllowed,
  getLocalizedColumn,
  pickRelatedColumns,
  filterColumnsByTheme,
  type BusinessKey,
  type Column,
  type ColumnSummary,
  type ColumnIndexEntry,
  type ColumnTheme,
  type ColumnTranslationLocalized,
} from "@/lib/column-shared";

export { isLocaleAllowed, getLocalizedColumn, pickRelatedColumns, filterColumnsByTheme };
export type { BusinessKey, Column, ColumnSummary, ColumnIndexEntry, ColumnTheme, ColumnTranslationLocalized };

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

export const COLUMN_PAGE_SIZE = 20;
const INDEX_BATCH_SIZE = 100;

export function parseColumnPage(value: string | string[] | undefined): number | undefined {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return undefined;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= Math.floor(2147483647 / COLUMN_PAGE_SIZE)
    ? page : undefined;
}

export function columnPagePath(path: string, page: number): string {
  return page === 1 ? path : `${path}/page/${page}`;
}

function publishedWhere(business: BusinessKey, locale: LangCode) {
  return Prisma.sql`business = ${business}::"Business" AND status = 'published'::"ColumnStatus"
    AND (locales = ARRAY[]::text[] OR ${locale} = ANY(locales))`;
}

/** JSONを丸ごと返さず、対象言語のカード・関連記事照合用フィールドだけを抽出する。 */
export function columnSummaryQuery(business: BusinessKey, locale: LangCode, take: number, skip: number) {
  const translated = (field: "title" | "excerpt" | "category") => locale === "ja"
    ? Prisma.sql`${Prisma.raw(field)}`
    : Prisma.sql`COALESCE(NULLIF(translations -> ${locale} ->> ${field}, ''), ${Prisma.raw(field)})`;
  const tags = locale === "ja" ? Prisma.sql`tags` : Prisma.sql`
    CASE WHEN jsonb_typeof(translations -> ${locale} -> 'tags') = 'array'
      AND translations -> ${locale} -> 'tags' <> '[]'::jsonb
      THEN ARRAY(SELECT jsonb_array_elements_text(translations -> ${locale} -> 'tags'))
      ELSE tags END`;
  return Prisma.sql`SELECT business, slug, date,
    ${translated("title")} AS title, ${translated("excerpt")} AS excerpt,
    ${translated("category")} AS category, ${tags} AS tags
    FROM public.columns WHERE ${publishedWhere(business, locale)}
    ORDER BY date DESC, slug ASC LIMIT ${take} OFFSET ${skip}`;
}

const fetchSummaryPage = cache(async (business: BusinessKey, locale: LangCode, take: number, skip: number) =>
  prisma.$queryRaw<ColumnSummary[]>(columnSummaryQuery(business, locale, take, skip)),
);

export async function getColumnPage(business: BusinessKey, locale: LangCode, page = 1) {
  if (parseColumnPage(String(page)) === undefined) throw new RangeError("Invalid column page");
  const [columns, count] = await Promise.all([
    fetchSummaryPage(business, locale, COLUMN_PAGE_SIZE, (page - 1) * COLUMN_PAGE_SIZE),
    prisma.column.count({ where: {
      business, status: "published",
      OR: [{ locales: { isEmpty: true } }, { locales: { has: locale } }],
    } }),
  ]);
  return { columns, total: count, page, pageSize: COLUMN_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(count / COLUMN_PAGE_SIZE)) };
}

/** 言語ごとに記事数が異なるため、実在するページだけをhreflangに載せる。 */
export async function getColumnPageLocales(business: BusinessKey, page: number): Promise<LangCode[]> {
  if (page === 1) return languages.map(language => language.code);
  const counts = await prisma.$queryRaw<{ locale: LangCode; total: number }[]>(Prisma.sql`
    SELECT l.locale, count(c.slug)::integer AS total
    FROM unnest(ARRAY['ja', 'en', 'zh-tw', 'zh']::text[]) AS l(locale)
    LEFT JOIN public.columns c ON c.business = ${business}::"Business"
      AND c.status = 'published'::"ColumnStatus"
      AND (c.locales = ARRAY[]::text[] OR l.locale = ANY(c.locales))
    GROUP BY l.locale`);
  return languages.map(language => language.code).filter(locale =>
    counts.some(count => count.locale === locale && count.total > (page - 1) * COLUMN_PAGE_SIZE),
  );
}

/**
 * 詳細の前後記事・関連度ランキング・テーマ別照合用の軽量インデックス。
 * 候補を先頭20件に切ると古い記事への導線が消えるため、100件ずつ全候補を読む。
 * 一覧ページ・新着欄はこの関数を使わず、必要な1ページだけをDBから取得する。
 */
const fetchPublished = cache(async (business: BusinessKey, locale: LangCode): Promise<ColumnSummary[]> => {
  const result: ColumnSummary[] = [];
  for (let skip = 0; ; skip += INDEX_BATCH_SIZE) {
    const batch = await fetchSummaryPage(business, locale, INDEX_BATCH_SIZE, skip);
    result.push(...batch);
    if (batch.length < INDEX_BATCH_SIZE) return result;
  }
});

/** sitemap / generateStaticParams は全公開URLを維持し、本文・翻訳は取得しない。 */
const fetchAllPublished = cache(async (business: BusinessKey): Promise<ColumnIndexEntry[]> => {
  const result: ColumnIndexEntry[] = [];
  for (let skip = 0; ; skip += INDEX_BATCH_SIZE) {
    const rows = await prisma.column.findMany({
      where: { business: business as Business, status: "published" },
      select: { slug: true, date: true, modifiedDate: true, locales: true },
      orderBy: [{ date: "desc" }, { slug: "asc" }],
      take: INDEX_BATCH_SIZE, skip,
    });
    result.push(...rows.map(row => ({ ...row,
      modifiedDate: row.modifiedDate ?? undefined, locales: row.locales as LangCode[],
    })));
    if (rows.length < INDEX_BATCH_SIZE) return result;
  }
});

function latestLimit(n: number): number {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError("Invalid column limit");
  return Math.min(n, INDEX_BATCH_SIZE);
}

const fetchPublishedBySlug = cache(
  async (business: BusinessKey, slug: string): Promise<Column | undefined> => {
    const row = await prisma.column.findFirst({
      where: { business: business as Business, slug, status: "published" },
    });
    return row ? toColumn(row) : undefined;
  },
);

// ── Realestate ──

export async function getColumns(locale: LangCode): Promise<ColumnSummary[]> {
  return fetchPublished("realestate", locale);
}

export async function getLatestColumns(n: number, locale: LangCode): Promise<ColumnSummary[]> {
  return fetchSummaryPage("realestate", locale, latestLimit(n), 0);
}

export async function getColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("realestate", slug);
}

/** sitemap.ts・generateStaticParams専用（全ロケール横断） */
export async function getAllColumnsAllLocales(): Promise<ColumnIndexEntry[]> {
  return fetchAllPublished("realestate");
}

export async function getAllSlugs(): Promise<string[]> {
  const cols = await fetchAllPublished("realestate");
  return cols.map((c) => c.slug);
}

// ── Legal ──

export async function getLegalColumns(locale: LangCode): Promise<ColumnSummary[]> {
  return fetchPublished("legal", locale);
}

export async function getLatestLegalColumns(n: number, locale: LangCode): Promise<ColumnSummary[]> {
  return fetchSummaryPage("legal", locale, latestLimit(n), 0);
}

export async function getLegalColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("legal", slug);
}

/** sitemap.ts・generateStaticParams専用（全ロケール横断） */
export async function getAllLegalColumnsAllLocales(): Promise<ColumnIndexEntry[]> {
  return fetchAllPublished("legal");
}

export async function getAllLegalSlugs(): Promise<string[]> {
  const cols = await fetchAllPublished("legal");
  return cols.map((c) => c.slug);
}

// ── Labor ──

export async function getLaborColumns(locale: LangCode): Promise<ColumnSummary[]> {
  return fetchPublished("labor", locale);
}

export async function getLatestLaborColumns(n: number, locale: LangCode): Promise<ColumnSummary[]> {
  return fetchSummaryPage("labor", locale, latestLimit(n), 0);
}

export async function getLaborColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("labor", slug);
}

export async function getAllLaborSlugs(): Promise<string[]> {
  const cols = await fetchAllPublished("labor");
  return cols.map((c) => c.slug);
}

/** sitemap.ts 専用（全ロケール横断）。2026-08-09 追加＝labor が sitemap に載っていなかった */
export async function getAllLaborColumnsAllLocales(): Promise<ColumnIndexEntry[]> {
  return fetchAllPublished("labor");
}
