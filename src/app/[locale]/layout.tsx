import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { SkipToContent } from "@/components/ui/SkipToContent";
import type { LangCode } from "@/config/languages";
import ScatteredIcons from "@/components/ui/ScatteredIcons";
import { fetchAllTranslations } from "@/lib/getTranslationData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { stripSrEntities } from "@/lib/shared/sr-strip";
import { fontVariables } from "@/app/fonts";
import { SUPPORTED_LOCALES, isValidLocale } from "@/lib/locale";

/**
 * 公開サイトのルートレイアウト＝ロケールURLセグメント（SEO監査2026-08-24 P0-1の根本対応）。
 *
 * 旧構成は app/layout.tsx が proxy.ts の x-locale ヘッダーを headers() で読んでおり、
 * リクエストAPIの使用で全公開ページが動的レンダリング（常に no-store・CDNキャッシュ不可）
 * だった。ルートレイアウト自体を app/[locale]/ に置くことで locale は「root param」＝
 * 静的なルートアドレスの一部になり、公開ページをSSG/ISRとして配信できる。
 * 各Server Componentからの取得は next/root-params 経由（getRequestLocale.ts 参照。
 * root params はルートレイアウトのセグメント以上の動的パラメータのみが対象のため、
 * この配置が必須）。admin・facilitator は別系統のルートレイアウトを持つ。
 *
 * URL規約は不変（ja=素パス・/en・/zh-tw・/zh）。ja の内部ルート /ja/... への
 * 振替と、/ja 直アクセスの素パスへの301は proxy.ts が担う。
 */

// 公開ページのISR再検証間隔。コラム等の即時反映は
// /api/admin/revalidate の revalidatePath が担う（1時間は自己修復の上限）。
export const revalidate = 3600;

// 公開ツリーでのリクエストAPI（headers/cookies等）使用をビルドエラーにするガード。
// 黙って動的（no-store）に降格して全ページのCDNキャッシュが剥がれる事故を、
// ビルド時に「どのルートが何のAPIを使ったか」のエラーで検出する
// （実例: 移設直後の not-found.tsx の headers() が全laborページを動的化していた）。
export const dynamic = "error";

// generateStaticParams に無いロケール（/xyz 等の任意文字列）は動的レンダリング
// せず404にする。proxy.ts が非ロケール接頭辞を /ja/... に振替えるため、
// ここに来る不正値は直リンク・内部バグのみ。
export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: "四葉グループ",
    template: "%s | 四葉グループ",
  },
  description: "四葉グループ — 不動産・行政書士の専門家グループ。",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: LangCode = rawLocale;

  const allTranslations = await fetchAllTranslations();

  // 社労士事務所（事業体）は開業まで非表示。labor配下の翻訳は全ページのRSC
  // ペイロードとしてHTMLに埋め込まれるため、開業フラグが立つまでクライアントに送らない
  // （「社会保険労務士」等が1ページあたり40件以上露出していた対策）。
  if (process.env.NEXT_PUBLIC_SR_LAUNCHED !== "true") {
    // 社労士（事業体）は開業まで非表示。RSCペイロードとしてHTMLに埋め込まれる翻訳から、
    // labor配下＋他名前空間の groupBusinesses 等の「社労士エントリ」を除去（源HTML漏れ防止・法27条）。
    // 例：legal.homePage.groupBusinesses[2].name / realestate.aboutPage.groupBusinesses[2].name
    // ※許容表記「社会保険労務士試験合格（2026年9月開業予定）」は文字列＝nameを持つ配列要素ではないため影響しない。
    //
    // 判定は src/lib/shared/sr-strip.ts に切り出した（テスト sr-strip.test.ts で全書体を固定）。
    // 2026-08-05：旧実装 /社会保険労務士|社労士/ は日本語の漢字しか見ておらず、
    // 繁体字「四葉社會保險勞務士法人」が除去されずに本番の全ロケールへ配信されていた。
    for (const data of Object.values(allTranslations)) {
      if (data && typeof data === "object") {
        delete (data as Record<string, unknown>).labor;
        stripSrEntities(data); // legal/realestate 等に残る groupBusinesses の社労士エントリを除去
      }
    }
  }

  return (
    <html lang={locale} className={fontVariables}>
      <body className="relative bg-surface text-text antialiased">
        <GoogleAnalytics />
        <ScatteredIcons />
        <LanguageProvider initialLocale={locale}>
          <TranslationProvider initialData={allTranslations}>
            <SkipToContent />
            {children}
          </TranslationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
