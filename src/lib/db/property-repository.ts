import { Prisma, type Property as PropertyRow, type PrismaClient } from "@prisma/client";
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

export class PropertyWriteConflictError extends Error {
  constructor() { super("PROPERTY_VERSION_CONFLICT"); }
}

function nextVersion(expectedUpdatedAt: string): { expected: Date; updatedAt: Date } | null {
  if (typeof expectedUpdatedAt !== "string") return null;
  const expected = new Date(expectedUpdatedAt);
  if (!Number.isFinite(expected.getTime()) || expected.toISOString() !== expectedUpdatedAt) return null;
  const updatedAt = new Date(Math.max(Date.now(), expected.getTime() + 1));
  return Number.isFinite(updatedAt.getTime()) ? { expected, updatedAt } : null;
}

/** Injectable client keeps isolated SQL checks away from the application singleton. */
export function createPropertyRepository(prisma: Pick<PrismaClient, "property">) {
/** 全物件取得（ステータス別） */
async function getProperties(status?: PropertyStatus): Promise<AdminProperty[]> {
  const rows = await prisma.property.findMany({
    where: { ...(status ? { status } : {}) },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(toProperty);
}

async function getPropertyById(id: string): Promise<AdminProperty | null> {
  const row = await prisma.property.findUnique({ where: { id } });
  return row ? toProperty(row) : null;
}

async function getPropertyBySlugAdmin(slug: string): Promise<AdminProperty | null> {
  const row = await prisma.property.findUnique({ where: { slug } });
  return row ? toProperty(row) : null;
}

async function createProperty(data: PropertyInput): Promise<string> {
  const row = await prisma.property.create({ data: toCreateInput(data) });
  return row.id;
}

/** The caller must retain the version it reviewed; never silently reread and overwrite. */
async function updateProperty(id: string, data: Partial<AdminProperty>, expectedUpdatedAt: string): Promise<void> {
  const version = nextVersion(expectedUpdatedAt);
  if (!version) throw new PropertyWriteConflictError();
  const result = await prisma.property.updateMany({ where: { id, updatedAt: version.expected }, data: { ...toUpdateInput(data), updatedAt: version.updatedAt } });
  if (result.count !== 1) throw new PropertyWriteConflictError();
}

/** 下書き確認後の公開・編集と競合した場合は削除せずfalse。条件を同じDB操作で照合する。 */
async function deleteProperty(id: string, expectedUpdatedAt: string): Promise<boolean> {
  const expected = new Date(expectedUpdatedAt);
  if (Number.isNaN(expected.getTime()) || expected.toISOString() !== expectedUpdatedAt) return false;
  const result = await prisma.property.deleteMany({ where: { id, status: "draft", updatedAt: expected } });
  return result.count === 1;
}

/** null means create-only; existing rows require an explicitly reviewed version. */
async function upsertPropertyBySlug(
  slug: string,
  data: PropertyInput,
  expectedUpdatedAt: string | null,
): Promise<{ id: string; action: "created" | "updated" }> {
  if (expectedUpdatedAt === null) {
    if (await prisma.property.findUnique({ where: { slug }, select: { id: true } })) throw new PropertyWriteConflictError();
    // A concurrent create after the read is still rejected by the unique constraint.
    try { return { id: await createProperty({ ...data, slug }), action: "created" }; }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new PropertyWriteConflictError();
      throw error;
    }
  }
  const version = nextVersion(expectedUpdatedAt);
  if (!version) throw new PropertyWriteConflictError();
  const existing = await prisma.property.findUnique({ where: { slug }, select: { id: true } });
  if (!existing) throw new PropertyWriteConflictError();
  const changed = await prisma.property.updateMany({ where: { id: existing.id, slug, updatedAt: version.expected },
    data: { ...toUpdateInput({ ...data, slug }), updatedAt: version.updatedAt } });
  if (changed.count !== 1) throw new PropertyWriteConflictError();
  return { id: existing.id, action: "updated" };
}

/** Optimistic update used by rental automation; never overwrite a concurrent admin edit. */
async function updatePropertyIfUnchanged(
  slug: string,
  expectedUpdatedAt: string,
  data: Partial<PropertyInput>,
): Promise<boolean> {
  const version = nextVersion(expectedUpdatedAt);
  if (!version) return false;
  const result = await prisma.property.updateMany({
    where: { slug, updatedAt: version.expected },
    data: { ...toUpdateInput(data), updatedAt: version.updatedAt },
  });
  return result.count === 1;
}

  return { getProperties, getPropertyById, getPropertyBySlugAdmin, createProperty, updateProperty, deleteProperty, upsertPropertyBySlug, updatePropertyIfUnchanged };
}
