import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { getRequestLocale } from "@/lib/getRequestLocale";
import type { LangCode } from "@/config/languages";
import ScatteredIcons from "@/components/ui/ScatteredIcons";
import { fetchAllTranslationsFromFirestore } from "@/lib/getTranslationData";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic-new",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// DESIGN.md §3：見出し＝Noto Serif JP（editorial）／本文・UI＝Noto Sans JP
const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "四葉グループ",
    template: "%s | 四葉グループ",
  },
  description: "四葉グループ — 不動産・行政書士のワンストップグループ。",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  // x-localeリクエストヘッダー優先（URL基準・middlewareが常に設定）、Cookieはフォールバック。
  // Cookieだけに頼ると初回アクセス・クローラー・素のリンク遷移でURLと言語がズレる。
  const locale: LangCode = await getRequestLocale();

  const allTranslations = await fetchAllTranslationsFromFirestore();

  // 社労士事務所（事業体）は開業まで非表示。labor配下の翻訳は全ページのRSC
  // ペイロードとしてHTMLに埋め込まれるため、開業フラグが立つまでクライアントに送らない
  // （「社会保険労務士」等が1ページあたり40件以上露出していた対策）。
  if (process.env.NEXT_PUBLIC_SR_LAUNCHED !== "true") {
    // 社労士（事業体）は開業まで非表示。RSCペイロードとしてHTMLに埋め込まれる翻訳から、
    // labor配下＋他名前空間の groupBusinesses 等の「社労士エントリ」を除去（源HTML漏れ防止・法27条）。
    // 例：legal.homePage.groupBusinesses[2].name / realestate.aboutPage.groupBusinesses[2].name
    // ※許容表記「社会保険労務士試験合格（2026年9月開業予定）」は文字列＝nameを持つ配列要素ではないため影響しない。
    const SR_RE = /社会保険労務士|社労士/;
    const stripSr = (node: unknown): unknown => {
      if (Array.isArray(node)) {
        return node
          .filter(
            (el) =>
              !(
                el &&
                typeof el === "object" &&
                SR_RE.test(String((el as Record<string, unknown>).name ?? ""))
              ),
          )
          .map(stripSr);
      }
      if (node && typeof node === "object") {
        const o = node as Record<string, unknown>;
        for (const k of Object.keys(o)) o[k] = stripSr(o[k]);
        return o;
      }
      return node;
    };
    for (const data of Object.values(allTranslations)) {
      if (data && typeof data === "object") {
        delete (data as Record<string, unknown>).labor;
        stripSr(data); // legal/realestate 等に残る groupBusinesses の社労士エントリを除去
      }
    }
  }

  return (
    <html lang={locale} className={`${zenKaku.variable} ${notoSerifJP.variable} ${notoSansJP.variable}`}>
      <body className="relative bg-surface text-text antialiased">
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
