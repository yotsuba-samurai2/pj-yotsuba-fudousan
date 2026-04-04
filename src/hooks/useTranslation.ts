"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { LangCode } from "@/config/languages";

import ja from "@/locales/ja.json";
import en from "@/locales/en.json";
import zhTw from "@/locales/zh-tw.json";
import zh from "@/locales/zh.json";

const dictionaries: Record<LangCode, Record<string, unknown>> = {
  ja,
  en,
  "zh-tw": zhTw,
  zh,
};

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function useTranslation() {
  const { locale } = useLanguage();

  const dict = dictionaries[locale] ?? dictionaries.ja;
  const fallback = dictionaries.ja;

  /** ドット記法でキーを引き、文字列を返す。見つからなければ ja → キー文字列 */
  function t(key: string): string {
    const val = getByPath(dict, key) ?? getByPath(fallback, key);
    if (typeof val === "string") return val;
    return key;
  }

  /** 配列を返す（サービス一覧等） */
  function tArray<T = Record<string, unknown>>(key: string): T[] {
    const val = getByPath(dict, key) ?? getByPath(fallback, key);
    if (Array.isArray(val)) return val as T[];
    return [];
  }

  /** オブジェクトを返す（ハイライト情報等） */
  function tObject<T = Record<string, unknown>>(key: string): T {
    const val = getByPath(dict, key) ?? getByPath(fallback, key);
    if (val && typeof val === "object" && !Array.isArray(val)) return val as T;
    return {} as T;
  }

  return { t, tArray, tObject, locale };
}
