import type { LangCode } from "@/config/languages";
import { addLocalePrefix, detectLocaleFromPath, localeSwitchBasePath, SUPPORTED_LOCALES } from "@/lib/locale";
import { languages } from "@/config/languages";
import type { BusinessKey } from "@/lib/column-shared";
import { isLocaleAllowed } from "@/lib/column-shared";

/** 公開済み記事のみ。空配列＝全言語という既存のColumn.locales規約を維持する。 */
export type ColumnLocaleIndex = Record<string, LangCode[]>;
export const COLUMN_LOCALE_CACHE_TAG = "column-language-index";

export type ColumnLinkOverride = { href: string; language: string };
export type ColumnLinkOverrides = Record<string, ColumnLinkOverride>;

/** 自サイトのコラムリンクだけを対象にする。外部サイト・プロトコル相対URLは保持。 */
export function parseColumnLink(href: string) {
  if (!(href.startsWith("/") && !href.startsWith("//")) && !href.startsWith("https://luck428.com/")) return;
  const url = new URL(href, "https://luck428.com");
  const { locale, strippedPath } = detectLocaleFromPath(url.pathname);
  const match = strippedPath.match(/^\/(?:((?:legal|labor))\/)?column\/([^/]+)$/);
  if (!match) return;
  return { url, locale, basePath: strippedPath, business: (match[1] || "realestate") as BusinessKey, slug: match[2] };
}

/** 未公開の翻訳への本文リンクは、実在言語へのリンクと移動先言語の表示に置き換える。 */
export function resolveColumnLink(href: string, index: ColumnLocaleIndex): ColumnLinkOverride | undefined {
  const target = parseColumnLink(href);
  if (!target || !Object.prototype.hasOwnProperty.call(index, target.slug)) return;
  const column = { locales: index[target.slug] };
  if (isLocaleAllowed(column, target.locale)) return;
  const fallback = SUPPORTED_LOCALES.find(locale => isLocaleAllowed(column, locale));
  if (!fallback) return;
  const path = addLocalePrefix(target.basePath, fallback) + target.url.search + target.url.hash;
  return {
    href: href.startsWith("https:") ? `https://luck428.com${path}` : path,
    language: languages.find(language => language.code === fallback)!.native,
  };
}

/** SSRの内部/jaパス、公開URL、行政書士ドメインの素パスを同じ記事に対応させる。 */
export function getColumnSwitchLocales(
  pathname: string,
  index: ColumnLocaleIndex,
  currentLocale: LangCode,
): readonly LangCode[] {
  const path = localeSwitchBasePath(pathname).replace(/\/$/, "");
  const match = path.match(/^\/(?:legal\/|labor\/)?column\/([^/]+)$/);
  if (!match) return SUPPORTED_LOCALES;

  // 古いブラウザ内レイアウトや取得失敗で記事を確認できない場合は、翻訳URLを推測しない。
  const slug = match[1];
  if (!Object.prototype.hasOwnProperty.call(index, slug)) return [currentLocale];
  return SUPPORTED_LOCALES.filter(locale => isLocaleAllowed({ locales: index[slug] }, locale));
}
