"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { LangCode } from "@/config/languages";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  addLocalePrefix,
  localeSwitchBasePath,
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
  initialLocale: LangCode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // サーバーが返したルートと辞書を同じレンダーで切り替える。
  // push前にlocaleだけを更新すると、未取得の辞書で旧画面を描画してしまう。
  const locale = initialLocale;

  // setLocale による遷移の完了後に router.refresh() を1回実行するためのフラグ。
  // push と refresh を同一tickで呼ぶと refresh が旧URLに対して走るレースがあり、
  // <head> のメタデータ（canonical等）が旧ページのまま残ることがある。
  const pendingRefreshRef = useRef(false);

  // 言語切り替えの遷移後にメタデータを更新する。
  useEffect(() => {
    if (pendingRefreshRef.current) {
      pendingRefreshRef.current = false;
      // push確定後の新URLに対してサーバー再描画を強制し、メタデータを再適用する
      router.refresh();
    }
  }, [pathname, router]);

  // html lang 属性を同期
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Cookie を現在ロケールに同期（SEO監査2026-08-24 P0-1）。
  // 旧実装は middleware が全レスポンスで set-cookie しており、公開ページが
  // CDNキャッシュ不可（no-store・毎回MISS）になっていた。middleware は
  // 「既存Cookieの値がURLとズレたときだけ」setする方式に変更したため、
  // Cookie未所持の非ja初回訪問（実ブラウザ）はここで補完する。
  // クローラーはCookieを送らない＝サーバー側 set-cookie が発生せずキャッシュ可能のまま。
  useEffect(() => {
    if (getLocaleFromCookie() !== locale) {
      document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    }
  }, [locale]);

  /** ロケール変更: URL遷移で切替 */
  const setLocale = (newLocale: LangCode) => {
    if (newLocale === locale) return;

    // 現在のパスからロケールプレフィックスを除去し、新しいプレフィックスを付与。
    // ※ window.location.pathname（ブラウザ実URL）を基準にする。
    //    usePathname() はミドルウェアのリライト後のパスを返すことがあり、
    //    その場合 strip が効かず同一URLへのpush（no-op）や誤ったパスになる。
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : pathname;
    const basePath = localeSwitchBasePath(currentPath);
    const newPath = addLocalePrefix(basePath, newLocale);

    // Cookie を設定
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

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
