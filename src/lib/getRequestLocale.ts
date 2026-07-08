import { cookies, headers } from "next/headers";
import type { LangCode } from "@/config/languages";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale } from "@/lib/locale";

/**
 * Server Componentからリクエストのlocaleを取得する。
 * middleware.tsが設定する `x-locale` リクエストヘッダーを優先する
 * （Cookieは次回リクエストからしか反映されず、初回アクセス・クローラーでは読めないため）。
 */
export async function getRequestLocale(): Promise<LangCode> {
  const headerStore = await headers();
  const headerLocale = headerStore.get("x-locale");
  if (headerLocale && isValidLocale(headerLocale)) return headerLocale;

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) return cookieLocale;

  return DEFAULT_LOCALE;
}
