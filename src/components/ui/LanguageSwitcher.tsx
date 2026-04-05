"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/config/languages";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      {languages.map(({ code, label }, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && (
            <span className="mx-1 text-border">|</span>
          )}
          <button
            onClick={() => setLocale(code)}
            className={`text-xs transition-all duration-200 ${
              locale === code
                ? "cta-gradient-text font-bold"
                : "text-text-muted hover:text-text"
            }`}
            aria-label={`${label}`}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}
