"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { LangCode } from "@/config/languages";

type LanguageContextType = {
  locale: LangCode;
  setLocale: (locale: LangCode) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "ja",
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LangCode>("ja");

  useEffect(() => {
    const saved = localStorage.getItem("yotsuba-lang") as LangCode | null;
    if (saved) setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (code: LangCode) => {
    setLocaleState(code);
    localStorage.setItem("yotsuba-lang", code);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
