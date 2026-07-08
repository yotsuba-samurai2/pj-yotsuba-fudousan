"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { LangCode } from "@/config/languages";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  detectLocaleFromPath,
  addLocalePrefix,
  stripLocalePrefix,
} from "@/lib/locale";

type LanguageContextType = {
  locale: LangCode;
  setLocale: (locale: LangCode) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

/** Cookie からロケールを読み取る */
function getLocaleFromCookie(): LangCode | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`),
  );
  return match ? (match[1] as LangCode) : null;
}

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale?: LangCode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // 初期値: props > URL > Cookie > デフォルト
  const [locale, setLocaleState] = useState<LangCode>(() => {
    if (initialLocale) return initialLocale;
    if (typeof window !== "undefined") {
      const fromPath = detectLocaleFromPath(window.location.pathname);
      if (fromPath.locale !== DEFAULT_LOCALE) return fromPath.locale;
      const fromCookie = getLocaleFromCookie();
      if (fromCookie) return fromCookie;
    }
    return DEFAULT_LOCALE;
  });

  // setLocale による遷移の完了後に router.refresh() を1回実行するためのフラグ。
  // push と refresh を同一tickで呼ぶと refresh が旧URLに対して走るレースがあり、
  // <head> のメタデータ（canonical等）が旧ページのまま残ることがある。
  const pendingRefreshRef = useRef(false);

  // URL変更時にロケールを同期
  // ※ usePathname() はミドルウェアのリライト後のパスを返すため、
  //    window.location.pathname（ブラウザ実URL）から検出する
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { locale: pathLocale } = detectLocaleFromPath(
      window.location.pathname,
    );
    if (pathLocale !== locale) {
      setLocaleState(pathLocale);
    }
    if (pendingRefreshRef.current) {
      pendingRefreshRef.current = false;
      // push確定後の新URLに対してサーバー再描画を強制し、メタデータを再適用する
      router.refresh();
    }
  }, [pathname]);

  // html lang 属性を同期
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  /** ロケール変更: URL遷移で切替 */
  const setLocale = (newLocale: LangCode) => {
    if (newLocale === locale) return;

    // 現在のパスからロケールプレフィックスを除去し、新しいプレフィックスを付与。
    // ※ locale検出のuseEffectと同じく window.location.pathname（ブラウザ実URL）を基準にする。
    //    usePathname() はミドルウェアのリライト後のパスを返すことがあり、
    //    その場合 strip が効かず同一URLへのpush（no-op）や誤ったパスになる。
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : pathname;
    const basePath = stripLocalePrefix(currentPath);
    const newPath = addLocalePrefix(basePath, newLocale);

    // Cookie を設定
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    setLocaleState(newLocale);
    pendingRefreshRef.current = true;
    router.push(newPath);
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
