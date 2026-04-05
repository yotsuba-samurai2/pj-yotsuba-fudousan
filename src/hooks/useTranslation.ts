"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationContext } from "@/contexts/TranslationContext";

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
  const { dictionary, fallback } = useTranslationContext();

  function t(key: string): string {
    const val = getByPath(dictionary, key) ?? getByPath(fallback, key);
    if (typeof val === "string") return val;
    return key;
  }

  function tArray<T = Record<string, unknown>>(key: string): T[] {
    const val = getByPath(dictionary, key) ?? getByPath(fallback, key);
    if (Array.isArray(val)) return val as T[];
    return [];
  }

  function tObject<T = Record<string, unknown>>(key: string): T {
    const val = getByPath(dictionary, key) ?? getByPath(fallback, key);
    if (val && typeof val === "object" && !Array.isArray(val)) return val as T;
    return {} as T;
  }

  return { t, tArray, tObject, locale };
}
