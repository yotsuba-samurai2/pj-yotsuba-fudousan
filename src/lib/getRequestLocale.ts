import { locale as localeRootParam } from "next/root-params";
import type { LangCode } from "@/config/languages";
import { DEFAULT_LOCALE, isValidLocale } from "@/lib/locale";

/**
 * Server Componentからリクエストのlocaleを取得する。
 *
 * app/[locale]/ ルートセグメントの値を next/root-params で読む
 * （next.config.ts の experimental.rootParams で有効化）。
 *
 * 旧実装は proxy.ts が付与する x-locale ヘッダー＋Cookieを headers()/cookies() で
 * 読んでいたが、リクエストAPIの使用は配下ルート全体を動的レンダリングにし、
 * 全公開ページが no-store・CDNキャッシュ不可になっていた（SEO監査2026-08-24 P0-1）。
 * root params は静的なルートアドレスの一部のため、SSG/ISRと両立する。
 *
 * 注意: Route Handler・Server Action では next/root-params は使えない（Next 16.2時点）。
 * そこでは URL やリクエストボディから locale を受け取ること。
 * [locale] セグメント外のルート（/admin 等）では undefined が返り、ja にフォールバックする。
 */
export async function getRequestLocale(): Promise<LangCode> {
  const locale = await localeRootParam();
  if (locale && isValidLocale(locale)) return locale;
  return DEFAULT_LOCALE;
}
