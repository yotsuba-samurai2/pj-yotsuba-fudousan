import type { LangCode } from "@/config/languages";

export const DEFAULT_LOCALE: LangCode = "ja";
export const SUPPORTED_LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];
export const NON_DEFAULT_LOCALES: LangCode[] = ["en", "zh-tw", "zh"];

/** Cookie名 */
export const LOCALE_COOKIE = "yotsuba-locale";

/** パスの先頭からロケールプレフィックスを検出 */
export function detectLocaleFromPath(pathname: string): { locale: LangCode; strippedPath: string } {
  for (const loc of NON_DEFAULT_LOCALES) {
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) {
      const stripped = pathname.slice(loc.length + 1) || "/";
      return { locale: loc, strippedPath: stripped };
    }
  }
  return { locale: DEFAULT_LOCALE, strippedPath: pathname };
}

/** パスにロケールプレフィックスを付与（ja はプレフィックスなし） */
export function addLocalePrefix(path: string, locale: LangCode): string {
  if (locale === DEFAULT_LOCALE) return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

/** パスからロケールプレフィックスを除去 */
export function stripLocalePrefix(pathname: string): string {
  return detectLocaleFromPath(pathname).strippedPath;
}

/** 文字列が有効なロケールコードかチェック */
export function isValidLocale(code: string): code is LangCode {
  return (SUPPORTED_LOCALES as string[]).includes(code);
}
