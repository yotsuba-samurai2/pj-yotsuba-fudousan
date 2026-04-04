import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { SITE_URL } from "@/lib/seo";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic-new",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "四葉パートナーズ",
    template: "%s | 四葉パートナーズ",
  },
  description:
    "四葉パートナーズ — 不動産・行政書士・社会保険労務士のワンストップグループ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenKaku.variable}`}>
      <body className="bg-surface text-text antialiased">
        <LanguageProvider>
          <SkipToContent />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
