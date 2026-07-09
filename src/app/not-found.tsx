import Link from "next/link";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { ArrowRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  description: "お探しのページは見つかりませんでした。",
  robots: { index: false, follow: false },
};

/**
 * グローバル 404 ページ
 *
 * - 不動産ドメイン: 不動産向けの404
 * - 行政書士ドメイン: TODO 社労士開業（2026年9月）後に専用デザイン
 */
export default async function NotFound() {
  const h = await headers();
  const host = h.get("host") || "";
  const isLegal = host.includes("luck428gyosei.com");

  // TODO: 行政書士・社労士ドメイン専用の404（社労士開業（2026年9月）後に実装）
  const homeHref = isLegal ? "/legal" : "/";
  const siteName = isLegal ? "四葉行政書士事務所" : "四葉不動産";

  const links = isLegal
    ? [
        { href: "/legal", label: "ホーム" },
        { href: "/legal/about", label: "会社概要" },
        { href: "/legal/column", label: "コラム" },
        { href: "/contact", label: "お問い合わせ" },
      ]
    : [
        { href: "/", label: "ホーム" },
        { href: "/services", label: "サービス" },
        { href: "/about", label: "会社概要" },
        { href: "/column", label: "コラム" },
        { href: "/contact", label: "お問い合わせ" },
      ];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        {/* 404 large */}
        <p className="cta-gradient-text text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
          404
        </p>

        <div className="mx-auto mt-6 h-0.5 w-16 rounded-full gradient-line" />

        {/* Heading */}
        <h1 className="mt-8 text-2xl font-bold leading-[1.4] text-text sm:text-3xl md:text-4xl">
          ページが見つかりません
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm leading-[1.9] text-text-muted sm:text-base">
          お探しのページは削除されたか、URLが変更された可能性があります。
          <br className="hidden sm:block" />
          以下のリンクから目的のページをお探しください。
        </p>

        {/* Primary CTA */}
        <div className="mt-10">
          <Link
            href={homeHref}
            className="gradient-line inline-flex items-center gap-2 rounded-md px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 sm:py-3.5"
          >
            <Home size={16} />
            {siteName}のトップへ
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Nav links */}
        <nav
          className="mt-12 border-t border-border pt-8"
          aria-label="主要ページ"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
            主要ページ
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-text-muted transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
