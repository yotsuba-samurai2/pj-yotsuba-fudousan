"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/config/languages";
import { addLocalePrefix, localeSwitchBasePath } from "@/lib/locale";
import { getColumnSwitchLocales, type ColumnLocaleIndex } from "@/lib/column-language-links";

export function LanguageSwitcher({ columnLocales }: { columnLocales: ColumnLocaleIndex }) {
  const { locale, setLocale } = useLanguage();
  const pathname = usePathname();

  // ハイドレーション完了前のクリックでも動くよう、実リンク（<a href>）として描画する
  // （onClick未接続の間は素のページ遷移になり、完了後は preventDefault + SPA切替）。
  // 画面遷移中の window.location は旧URLのことがあるため、ルーターのパスを使う。
  // 内部 /ja の除去とコラム一覧のページ番号の正規化は共通ヘルパーに任せる。
  const basePath = localeSwitchBasePath(pathname);
  const available = getColumnSwitchLocales(basePath, columnLocales, locale);
  const visibleLanguages = languages.filter(({ code }) => available.includes(code));

  return (
    <div className="flex items-center gap-1">
      {visibleLanguages.map(({ code, label }, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && (
            <span className="mx-1 text-border">|</span>
          )}
          <a
            href={addLocalePrefix(basePath, code)}
            suppressHydrationWarning
            onClick={(e) => {
              // 別タブ・別ウィンドウ等はブラウザー標準のリンク操作を維持する。
              if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return;
              }
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
