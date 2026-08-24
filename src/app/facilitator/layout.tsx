import "../globals.css";
import { fontVariables } from "@/app/fonts";

/**
 * /facilitator（LINKAプレビュー・noindex）のルートレイアウト。
 * 公開サイトのルートレイアウトが app/[locale]/layout.tsx へ移動した
 * （SEO監査2026-08-24 P0-1・root params 化）ため、[locale] 外の本ルートは
 * 独立したルートレイアウトを持つ（マルチルートレイアウト構成）。
 */
export default function FacilitatorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={fontVariables}>
      <body className="relative bg-surface text-text antialiased">
        {children}
      </body>
    </html>
  );
}
