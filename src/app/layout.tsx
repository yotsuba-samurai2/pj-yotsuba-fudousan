import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "四葉パートナーズ",
    template: "%s | 四葉パートナーズ",
  },
  description: "四葉パートナーズ — 不動産・行政書士のワンストップグループ。",
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

  return (
    <html lang={locale} className={`${zenKaku.variable}`}>
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
