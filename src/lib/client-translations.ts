import type { LangCode } from "@/config/languages";
import { stripSrEntities } from "@/lib/shared/sr-strip";

type Dictionary = Record<string, unknown>;
export type ClientTranslations = Partial<Record<LangCode, Dictionary>>;

/** Server-only payload preparation. Never mutate a dictionary shared by React's cache. */
export async function prepareClientTranslations(
  locale: LangCode,
  fetchDictionary: (locale: LangCode) => Promise<Dictionary>,
  srLaunched: boolean,
): Promise<ClientTranslations> {
  const locales: LangCode[] = locale === "ja" ? ["ja"] : [locale, "ja"];
  const entries = await Promise.all(locales.map(async (language) => {
    const dictionary = structuredClone(await fetchDictionary(language));
    if (!srLaunched) {
      delete dictionary.labor;
      stripSrEntities(dictionary);
    }
    return [language, dictionary] as const;
  }));
  return Object.fromEntries(entries);
}
