"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/config/languages";
import { addLocalePrefix, stripLocalePrefix } from "@/lib/locale";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const pathname = usePathname();

  // ハイドレーション完了前のクリックでも動くよう、実リンク（<a href>）として描画する
  // （onClick未接続の間は素のページ遷移になり、完了後は preventDefault + SPA切替）。
  // SSR時は usePathname（リライト後＝ロケール除去済みパス）、クライアントでは
  // window.location.pathname を基準にする。どちらも stripLocalePrefix 後は同じ
  // ベースパスに収束する（テナントドメインのみ僅かに異なるため suppressHydrationWarning）。
  const basePath = stripLocalePrefix(
    typeof window !== "undefined" ? window.location.pathname : pathname,
  );

  return (
    <div className="flex items-center gap-1">
      {languages.map(({ code, label }, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && (
            <span className="mx-1 text-border">|</span>
          )}
          <a
            href={addLocalePrefix(basePath, code)}
            suppressHydrationWarning
            onClick={(e) => {
              e.preventDefault();
              setLocale(code);
            }}
            className={`text-xs transition-all duration-200 ${
              locale === code
                ? "cta-gradient-text font-bold"
                : "text-text-muted hover:text-text"
            }`}
            aria-label={`${label}`}
          >
            {label}
          </a>
        </span>
      ))}
    </div>
  );
}
