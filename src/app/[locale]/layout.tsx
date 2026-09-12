import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { SkipToContent } from "@/components/ui/SkipToContent";
import type { LangCode } from "@/config/languages";
import ScatteredIcons from "@/components/ui/ScatteredIcons";
import { fetchTranslations } from "@/lib/getTranslationData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { prepareClientTranslations } from "@/lib/client-translations";
import { DeferredBrandFonts } from "@/components/ui/DeferredBrandFonts";
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

// dynamicParams は既定の true のまま（ここで false にしない）。
//
// この設定はロケールだけでなく配下の全動的セグメント（コラム詳細の [slug] 等）に
// 及ぶ。false にすると、ビルド時の generateStaticParams に含まれない slug は
// 恒久的に404になり、DBへ投入しても再デプロイするまで公開されない。
// revalidatePath でも直せない（存在しない経路は再検証できないため）。
//
// 2026-08-25〜08-28、投入済みコラムが sitemap には載るのに詳細ページだけ404、
// という事象が3日続いた。そのつど再デプロイで回避していたが（ee6bbf0・#302）、
// 原因はこの1行だった。
//
// 不正なロケール（/xyz 等）は下の RootLayout が isValidLocale で notFound() する
// ので、この設定が無くても404になる。実行時ガードが正本。

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

  const translations = await prepareClientTranslations(
    locale,
    fetchTranslations,
    process.env.NEXT_PUBLIC_SR_LAUNCHED === "true",
  );

  return (
    <html lang={locale}>
      <body className="relative bg-surface text-text antialiased">
        <DeferredBrandFonts />
        <GoogleAnalytics />
        <ScatteredIcons />
        <LanguageProvider initialLocale={locale}>
          <TranslationProvider initialData={translations}>
            <SkipToContent />
            {children}
          </TranslationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
