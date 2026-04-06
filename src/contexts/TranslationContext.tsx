"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { LangCode } from "@/config/languages";
import { useLanguage } from "@/contexts/LanguageContext";

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
 * Firestoreから取得した辞書をRootLayoutから受け取る
 */
export function TranslationProvider({
  initialData,
  children,
}: {
  initialData: Record<LangCode, Record<string, unknown>>;
  children: React.ReactNode;
}) {
  const { locale } = useLanguage();

  const [dictionary, setDictionary] = useState<Record<string, unknown>>(
    () => initialData[locale] ?? initialData.ja ?? {},
  );

  useEffect(() => {
    setDictionary(initialData[locale] ?? initialData.ja ?? {});
  }, [locale, initialData]);

  const fallback = initialData.ja ?? {};

  return (
    <TranslationContext.Provider value={{ dictionary, fallback }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  return useContext(TranslationContext);
}
