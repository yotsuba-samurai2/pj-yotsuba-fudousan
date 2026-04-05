"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { LangCode } from "@/config/languages";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStaticTranslationData, getAllStaticTranslations } from "@/lib/getTranslationData";

type TranslationContextType = {
  dictionary: Record<string, unknown>;
  fallback: Record<string, unknown>;
};

const TranslationContext = createContext<TranslationContextType>({
  dictionary: {},
  fallback: {},
});

/**
 * 翻訳辞書を提供する Provider
 * 初期値は静的 JSON、将来的に Firestore からの動的更新に対応可能
 */
export function TranslationProvider({
  initialData,
  children,
}: {
  initialData?: Record<LangCode, Record<string, unknown>>;
  children: React.ReactNode;
}) {
  const { locale } = useLanguage();
  const allData = initialData ?? getAllStaticTranslations();

  const [dictionary, setDictionary] = useState<Record<string, unknown>>(
    () => allData[locale] ?? allData.ja,
  );

  useEffect(() => {
    setDictionary(allData[locale] ?? allData.ja);
  }, [locale, allData]);

  const fallback = allData.ja;

  return (
    <TranslationContext.Provider value={{ dictionary, fallback }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  return useContext(TranslationContext);
}
