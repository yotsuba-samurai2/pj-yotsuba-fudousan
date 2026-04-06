import type { LangCode } from "@/config/languages";

const PROJECT_ID = "pj-yotsuba-corporate";
const LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];

/**
 * Firestore REST APIのvalueをJSの値に変換する
 */
function decodeValue(value: Record<string, unknown>): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("mapValue" in value) {
    const map = (value.mapValue as { fields?: Record<string, Record<string, unknown>> }).fields ?? {};
    return decodeFields(map);
  }
  if ("arrayValue" in value) {
    const arr = (value.arrayValue as { values?: Record<string, unknown>[] }).values ?? [];
    return arr.map((v) => decodeValue(v));
  }
  return null;
}

function decodeFields(
  fields: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = decodeValue(value);
  }
  return result;
}

/**
 * Firestore REST APIから単一localeの翻訳を取得
 */
export async function fetchTranslationsFromFirestore(
  locale: LangCode,
): Promise<Record<string, unknown>> {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/translations/${locale}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`Failed to fetch translations/${locale}: ${res.status}`);
      return {};
    }
    const data = (await res.json()) as {
      fields?: Record<string, Record<string, unknown>>;
    };
    if (!data.fields) return {};
    return decodeFields(data.fields);
  } catch (err) {
    console.error(`Error fetching translations/${locale}:`, err);
    return {};
  }
}

/**
 * 全言語をFirestoreから並列取得
 */
export async function fetchAllTranslationsFromFirestore(): Promise<
  Record<LangCode, Record<string, unknown>>
> {
  const entries = await Promise.all(
    LOCALES.map(async (locale) => {
      const data = await fetchTranslationsFromFirestore(locale);
      return [locale, data] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<LangCode, Record<string, unknown>>;
}
