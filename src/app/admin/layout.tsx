import type { Metadata } from "next";
import "../globals.css";
import AdminShell from "@/components/admin/AdminShell";
import { fontVariables } from "@/app/fonts";

/**
 * 管理画面のルートレイアウト。公開サイトのルートレイアウトが app/[locale]/layout.tsx へ
 * 移動した（SEO監査2026-08-24 P0-1・root params 化）ため、[locale] 外の /admin は
 * 独立したルートレイアウトを持つ（マルチルートレイアウト構成）。
 * 言語は管理画面＝日本語固定。LanguageProvider / TranslationProvider は公開サイト専用のため含めない。
 */

export const metadata: Metadata = {
  title: {
    default: "管理画面 | 四葉グループ",
    template: "%s | 四葉グループ管理画面",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={fontVariables}>
      <body className="relative bg-surface text-text antialiased">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
