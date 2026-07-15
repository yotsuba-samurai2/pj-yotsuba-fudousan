import { prisma } from "@/lib/prisma";
import { Prisma, type Business, type Column as ColumnRow } from "@prisma/client";
import type { LangCode } from "@/config/languages";
import type {
  AdminColumn,
  ColumnInput,
  ColumnStatus,
  ColumnTranslation,
} from "@/lib/column-shared";

/**
 * admin CRUD用のサーバー専用データ層（旧 src/lib/firestore/columns.ts の役割）。
 * APIルート・スクリプトからのみ import すること（クライアントには admin-api.ts 経由）。
 */

export type Column = AdminColumn;
/** 互換エイリアス（旧 FirestoreColumn） */
export type FirestoreColumn = AdminColumn;
export type { ColumnStatus, ColumnTranslation, ColumnInput };

/** undefined混じりのオブジェクトをJSON安全な値に正規化 */
function cleanJson(v: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(v)) as Prisma.InputJsonValue;
}

function toJsonOrNull(v: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return v === undefined || v === null ? Prisma.JsonNull : cleanJson(v);
}

function toColumn(row: ColumnRow): Column {
  return {
    id: row.id,
    business: row.business,
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
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toCreateInput(data: ColumnInput): Prisma.ColumnCreateInput {
  return {
    business: data.business,
    slug: data.slug,
    title: data.title,
    date: data.date,
    category: data.category,
    excerpt: data.excerpt,
    content: data.content,
    status: data.status ?? "draft",
    modifiedDate: data.modifiedDate ?? null,
    ogImage: data.ogImage ?? null,
    author: toJsonOrNull(data.author),
    keywords: data.keywords ?? [],
    faq: toJsonOrNull(data.faq),
    tags: data.tags ?? [],
    locales: data.locales ?? [],
    translations: toJsonOrNull(data.translations),
  };
}

function toUpdateInput(data: Partial<Column>): Prisma.ColumnUpdateInput {
  const u: Prisma.ColumnUpdateInput = {};
  if (data.business !== undefined) u.business = data.business;
  if (data.slug !== undefined) u.slug = data.slug;
  if (data.title !== undefined) u.title = data.title;
  if (data.date !== undefined) u.date = data.date;
  if (data.category !== undefined) u.category = data.category;
  if (data.excerpt !== undefined) u.excerpt = data.excerpt;
  if (data.content !== undefined) u.content = data.content;
  if (data.status !== undefined) u.status = data.status;
  if (data.modifiedDate !== undefined) u.modifiedDate = data.modifiedDate;
  if (data.ogImage !== undefined) u.ogImage = data.ogImage;
  if ("author" in data) u.author = toJsonOrNull(data.author);
  if (data.keywords !== undefined) u.keywords = data.keywords;
  if ("faq" in data) u.faq = toJsonOrNull(data.faq);
  if (data.tags !== undefined) u.tags = data.tags;
  if (data.locales !== undefined) u.locales = data.locales;
  if ("translations" in data) u.translations = toJsonOrNull(data.translations);
  return u;
}

/** 全コラム取得（ビジネス別、ステータス別） */
export async function getColumns(business?: string, status?: ColumnStatus): Promise<Column[]> {
  const rows = await prisma.column.findMany({
    where: {
      ...(business ? { business: business as Business } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { date: "desc" },
  });
  return rows.map(toColumn);
}

/** 公開コラムのみ取得（フロントエンド用） */
export async function getPublishedColumns(business?: string): Promise<Column[]> {
  return getColumns(business, "published");
}

/** slug でコラム取得 */
export async function getColumnBySlug(business: string, slug: string): Promise<Column | null> {
  const row = await prisma.column.findUnique({
    where: { business_slug: { business: business as Business, slug } },
  });
  return row ? toColumn(row) : null;
}

/**
 * slug基準の冪等upsert。(business, slug) のDBユニーク制約で重複を防ぐ。
 * 同じslugで複数回実行しても重複を作らない。
 */
export async function upsertColumnBySlug(
  business: Column["business"],
  slug: string,
  data: ColumnInput,
): Promise<{ id: string; action: "created" | "updated" }> {
  const existing = await prisma.column.findUnique({
    where: { business_slug: { business: business as Business, slug } },
    select: { id: true },
  });
  if (existing) {
    await updateColumn(existing.id, { ...data, business, slug });
    return { id: existing.id, action: "updated" };
  }
  const id = await createColumn({ ...data, business, slug });
  return { id, action: "created" };
}

/** コラム作成 */
export async function createColumn(data: ColumnInput): Promise<string> {
  const row = await prisma.column.create({ data: toCreateInput(data) });
  return row.id;
}

/** コラム更新 */
export async function updateColumn(id: string, data: Partial<Column>): Promise<void> {
  await prisma.column.update({ where: { id }, data: toUpdateInput(data) });
}

/** コラム削除 */
export async function deleteColumn(id: string): Promise<void> {
  await prisma.column.delete({ where: { id } });
}

/** ID でコラム取得 */
export async function getColumnById(id: string): Promise<Column | null> {
  const row = await prisma.column.findUnique({ where: { id } });
  return row ? toColumn(row) : null;
}
