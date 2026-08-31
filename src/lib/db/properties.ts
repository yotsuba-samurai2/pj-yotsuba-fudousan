import { prisma } from "@/lib/prisma";
import { Prisma, type Property as PropertyRow } from "@prisma/client";
import type { LangCode } from "@/config/languages";
import type {
  AdminProperty,
  PropertyInput,
  PropertyStatus,
} from "@/lib/property-shared";

/**
 * 物件 admin CRUD用のサーバー専用データ層（db/columns.ts と同型）。
 * APIルート・スクリプトからのみ import すること（クライアントには admin-api.ts 経由）。
 * priceYen はDBでは BigInt、アプリ内では JS number（21.4億超対応・Number.MAX_SAFE_INTEGER
 * ＝約9,007兆円まで安全）。JSON.stringify が BigInt を扱えないため境界で変換する。
 */

export type { AdminProperty, PropertyInput, PropertyStatus };

function cleanJson(v: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(v)) as Prisma.InputJsonValue;
}

function toJsonOrNull(v: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  return v === undefined || v === null ? Prisma.JsonNull : cleanJson(v);
}

function toProperty(row: PropertyRow): AdminProperty {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    dealType: row.dealType,
    category: row.category,
    tradeMode: row.tradeMode,
    title: row.title,
    priceYen: Number(row.priceYen),
    priceNote: row.priceNote ?? undefined,
    locationText: row.locationText,
    access: (row.access as AdminProperty["access"]) ?? [],
    spec: row.spec as AdminProperty["spec"],
    images: (row.images as AdminProperty["images"]) ?? [],
    description: row.description,
    publishedAt: row.publishedAt ?? undefined,
    infoUpdatedAt: row.infoUpdatedAt,
    nextUpdateAt: row.nextUpdateAt,
    locales: row.locales as LangCode[],
    translations: (row.translations as AdminProperty["translations"]) ?? undefined,
    internal: (row.internal as AdminProperty["internal"]) ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toCreateInput(data: PropertyInput): Prisma.PropertyCreateInput {
  return {
    slug: data.slug,
    status: data.status ?? "draft",
    dealType: data.dealType,
    category: data.category,
    tradeMode: data.tradeMode,
    title: data.title,
    priceYen: BigInt(Math.round(data.priceYen)),
    priceNote: data.priceNote ?? null,
    locationText: data.locationText,
    access: cleanJson(data.access ?? []),
    spec: cleanJson(data.spec),
    images: cleanJson(data.images ?? []),
    description: data.description,
    publishedAt: data.publishedAt ?? null,
    infoUpdatedAt: data.infoUpdatedAt,
    nextUpdateAt: data.nextUpdateAt,
    locales: data.locales ?? ["ja"],
    translations: toJsonOrNull(data.translations),
    internal: toJsonOrNull(data.internal),
  };
}

function toUpdateInput(data: Partial<AdminProperty>): Prisma.PropertyUpdateInput {
  const u: Prisma.PropertyUpdateInput = {};
  if (data.slug !== undefined) u.slug = data.slug;
  if (data.status !== undefined) u.status = data.status;
  if (data.dealType !== undefined) u.dealType = data.dealType;
  if (data.category !== undefined) u.category = data.category;
  if (data.tradeMode !== undefined) u.tradeMode = data.tradeMode;
  if (data.title !== undefined) u.title = data.title;
  if (data.priceYen !== undefined) u.priceYen = BigInt(Math.round(data.priceYen));
  if ("priceNote" in data) u.priceNote = data.priceNote ?? null;
  if (data.locationText !== undefined) u.locationText = data.locationText;
  if (data.access !== undefined) u.access = cleanJson(data.access);
  if (data.spec !== undefined) u.spec = cleanJson(data.spec);
  if (data.images !== undefined) u.images = cleanJson(data.images);
  if (data.description !== undefined) u.description = data.description;
  if ("publishedAt" in data) u.publishedAt = data.publishedAt ?? null;
  if (data.infoUpdatedAt !== undefined) u.infoUpdatedAt = data.infoUpdatedAt;
  if (data.nextUpdateAt !== undefined) u.nextUpdateAt = data.nextUpdateAt;
  if (data.locales !== undefined) u.locales = data.locales;
  if ("translations" in data) u.translations = toJsonOrNull(data.translations);
  if ("internal" in data) u.internal = toJsonOrNull(data.internal);
  return u;
}

/** 全物件取得（ステータス別） */
export async function getProperties(status?: PropertyStatus): Promise<AdminProperty[]> {
  const rows = await prisma.property.findMany({
    where: { ...(status ? { status } : {}) },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(toProperty);
}

export async function getPropertyById(id: string): Promise<AdminProperty | null> {
  const row = await prisma.property.findUnique({ where: { id } });
  return row ? toProperty(row) : null;
}

export async function getPropertyBySlugAdmin(slug: string): Promise<AdminProperty | null> {
  const row = await prisma.property.findUnique({ where: { slug } });
  return row ? toProperty(row) : null;
}

export async function createProperty(data: PropertyInput): Promise<string> {
  const row = await prisma.property.create({ data: toCreateInput(data) });
  return row.id;
}

export async function updateProperty(id: string, data: Partial<AdminProperty>): Promise<void> {
  await prisma.property.update({ where: { id }, data: toUpdateInput(data) });
}

/** 下書きの物理削除（誤登録の整理用。公開済みの非公開化は status=closed で行う） */
export async function deleteProperty(id: string): Promise<void> {
  await prisma.property.delete({ where: { id } });
}

/** slug基準の冪等upsert（seedスクリプト用。slug のDBユニーク制約で重複を防ぐ） */
export async function upsertPropertyBySlug(
  slug: string,
  data: PropertyInput,
): Promise<{ id: string; action: "created" | "updated" }> {
  const existing = await prisma.property.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing) {
    await updateProperty(existing.id, { ...data, slug });
    return { id: existing.id, action: "updated" };
  }
  const id = await createProperty({ ...data, slug });
  return { id, action: "created" };
}
