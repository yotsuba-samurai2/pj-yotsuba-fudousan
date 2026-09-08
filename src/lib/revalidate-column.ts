import { revalidatePath, revalidateTag } from "next/cache";
import { COLUMN_LOCALE_CACHE_TAG } from "@/lib/column-language-links";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import type { AdminColumn } from "@/lib/column-shared";
import { flushRevalidation } from "@/lib/flush-revalidation";
import { submitToIndexNow } from "@/lib/indexnow";

type ColumnLocation = Pick<AdminColumn, "business" | "slug">;

/** DB mutation成功後に呼ぶ。公開解除・空localesも全4言語を失効する。 */
export async function revalidateColumn(...locations: ColumnLocation[]): Promise<void> {
  revalidateTag(COLUMN_LOCALE_CACHE_TAG, { expire: 0 });
  const paths = new Set<string>();
  const businesses = new Set(locations.map(column => column.business));
  for (const business of businesses) {
    const prefix = business === "realestate" ? "" : `/${business}`;
    // route groupを含む内部パターン。一覧・ページ送り・関連記事を持つ詳細も更新。
    revalidatePath(`/[locale]/(${business})${prefix}/column`, "layout");
    paths.add(prefix || "/");
    paths.add(`${prefix}/column`);
  }
  for (const { business, slug } of locations) {
    const prefix = business === "realestate" ? "" : `/${business}`;
    paths.add(`${prefix}/column/${slug}`);
  }
  for (const path of paths) {
    for (const locale of SUPPORTED_LOCALES) {
      revalidatePath(`/${locale}${path === "/" ? "" : path}`);
    }
  }
  // sitemapはlocale配下でなくapp/sitemap.ts。
  revalidatePath("/sitemap.xml");
  await flushRevalidation();
  // 既存の検索エンジン通知を維持。IndexNowの失敗はキャッシュ失効とは独立。
  await submitToIndexNow([...paths, "/sitemap.xml"]);
}
