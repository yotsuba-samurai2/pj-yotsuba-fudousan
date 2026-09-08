import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { BusinessKey } from "@/lib/column-shared";
import type { LangCode } from "@/config/languages";
import { COLUMN_LOCALE_CACHE_TAG, type ColumnLocaleIndex } from "@/lib/column-language-links";

/** 本文・翻訳JSONを読まず、事業ごとの公開言語だけを共有する。 */
const fetchIndex = unstable_cache(
  async (business: BusinessKey): Promise<ColumnLocaleIndex> => {
    const rows = await prisma.column.findMany({
      where: { business, status: "published" },
      select: { slug: true, locales: true },
      orderBy: { slug: "asc" },
    });
    return Object.fromEntries(rows.map(row => [row.slug, row.locales as LangCode[]]));
  },
  [COLUMN_LOCALE_CACHE_TAG],
  { tags: [COLUMN_LOCALE_CACHE_TAG], revalidate: 3600 },
);

export async function getColumnLanguageIndex(business: BusinessKey): Promise<ColumnLocaleIndex> {
  try {
    return await fetchIndex(business);
  } catch {
    // 一時的なDB障害で固定ページまで表示不能にしない。記事の言語切替は現在言語に限定。
    console.error(`Failed to load column language index: ${business}`);
    return {};
  }
}
