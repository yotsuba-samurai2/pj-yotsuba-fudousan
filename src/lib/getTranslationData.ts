import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { LangCode } from "@/config/languages";

const LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];

/**
 * DB（translationsテーブル）から単一localeのUI翻訳を取得。
 * 取得不能時は空オブジェクト（旧REST実装のフォールバック挙動を維持）。
 */
export const fetchTranslations = cache(
  async (locale: LangCode): Promise<Record<string, unknown>> => {
    try {
      const row = await prisma.translation.findUnique({ where: { locale } });
      return (row?.data as Record<string, unknown>) ?? {};
    } catch (err) {
      console.error(`Error fetching translations/${locale}:`, err);
      return {};
    }
  },
);

/** 全言語を並列取得 */
export async function fetchAllTranslations(): Promise<
  Record<LangCode, Record<string, unknown>>
> {
  const entries = await Promise.all(
    LOCALES.map(async (locale) => {
      const data = await fetchTranslations(locale);
      return [locale, data] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<LangCode, Record<string, unknown>>;
}
