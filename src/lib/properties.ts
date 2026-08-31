import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Property as PropertyRow } from "@prisma/client";
import type { LangCode } from "@/config/languages";
import {
  toPublicProperty,
  isPropertyLocaleAllowed,
  getLocalizedProperty,
  type AdminProperty,
  type PublicProperty,
} from "@/lib/property-shared";

export { isPropertyLocaleAllowed, getLocalizedProperty };
export type { PublicProperty };

/**
 * 公開ページ用の物件取得（columns.ts と同型）。
 * 公開面へ渡す値は必ず toPublicProperty()（ホワイトリスト変換）を通す＝
 * internal（業者間情報）はこのモジュールから外に出ない。
 */

function rowToPublic(row: PropertyRow): PublicProperty {
  const admin: AdminProperty = {
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
    // internal は意図的に写さない（公開系へ持ち込まない）
  };
  return toPublicProperty(admin);
}

/** 公開中（published）の物件一覧。現在ロケールで公開されているもののみ */
export const getPublishedProperties = cache(
  async (locale: LangCode): Promise<PublicProperty[]> => {
    const rows = await prisma.property.findMany({
      where: { status: "published" },
      orderBy: { infoUpdatedAt: "desc" },
    });
    return rows.map(rowToPublic).filter((p) => isPropertyLocaleAllowed(p, locale));
  },
);

/** sitemap.ts・generateStaticParams 専用（全ロケール横断・published のみ） */
export const getAllPublishedPropertiesAllLocales = cache(
  async (): Promise<PublicProperty[]> => {
    const rows = await prisma.property.findMany({
      where: { status: "published" },
      orderBy: { infoUpdatedAt: "desc" },
    });
    return rows.map(rowToPublic);
  },
);

/**
 * 詳細ページ用。published に加え closed も返す（closed は「募集終了」表示＋noindex で
 * 200を返す仕様＝おとり広告の構造的回避）。draft は返さない（404）。
 */
export const getPublicPropertyBySlug = cache(
  async (slug: string): Promise<PublicProperty | undefined> => {
    const row = await prisma.property.findFirst({
      where: { slug, status: { in: ["published", "closed"] } },
    });
    return row ? rowToPublic(row) : undefined;
  },
);
