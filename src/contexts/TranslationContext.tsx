"use client";

import { createContext, useContext, useMemo } from "react";
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

  // 辞書は initialData と locale から一意に決まる派生値。
  // state + useEffect で同期すると余分な再レンダーが1回挟まるため useMemo で導出する。
  const dictionary = useMemo(
    () => initialData[locale] ?? initialData.ja ?? {},
    [initialData, locale],
  );
  const fallback = useMemo(() => initialData.ja ?? {}, [initialData]);
  const value = useMemo(() => ({ dictionary, fallback }), [dictionary, fallback]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  return useContext(TranslationContext);
}
