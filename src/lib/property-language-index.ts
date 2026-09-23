import { getAllPublishedPropertiesAllLocales } from "@/lib/properties";
import { buildPropertyLocaleIndex, type ColumnLocaleIndex } from "@/lib/column-language-links";

/**
 * 物件詳細の言語切替用に、公開中（published・確認期限内）の物件の公開ロケールだけを共有する
 * （column-language-index.ts と同じ役割。sitemap・詳細ページと同じ公開判定を通す）。
 *
 * 記事の表と違い unstable_cache を挟まない：件数が十数件で、物件詳細ページ自体が
 * リクエストごとにDBを引く動的ページのため、鮮度を落としてまで節約する量ではない。
 */
export async function getPropertyLanguageIndex(): Promise<ColumnLocaleIndex> {
  try {
    return buildPropertyLocaleIndex(await getAllPublishedPropertiesAllLocales());
  } catch {
    // 一時的なDB障害で固定ページまで表示不能にしない。物件の言語切替は現在言語に限定。
    console.error("Failed to load property language index");
    return {};
  }
}
