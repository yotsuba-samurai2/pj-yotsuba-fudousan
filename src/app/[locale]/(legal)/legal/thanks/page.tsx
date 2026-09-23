// /legal/thanks（送信完了）。noindex・sitemap未収載。
// 2026-09-22 多言語化：本文がJSX直書きの日本語で、4ロケールとも日本語を返していた。
//   文言は /labor/thanks と同一のため THANKS_COPY（src/lib/shared/contact-page-copy.ts）を共有する。
//   ContactForm の遷移にロケール接頭辞を付けたことで、非日本語版URLに実際に到達するようになるため
//   本ページも同時に直す（到達可能にした先が日本語のまま、という状態を作らない）。
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { THANKS_COPY } from "@/lib/shared/contact-page-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = THANKS_COPY[locale] ?? THANKS_COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/legal/thanks",
    noindex: true,
    locale,
  });
}

export default async function LegalThanksPage() {
  const locale = await getRequestLocale();
  const c = THANKS_COPY[locale] ?? THANKS_COPY.ja;
  return (
    <div>
      <section className="flex min-h-[70vh] items-center justify-center px-4 pt-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h1 className="mt-8 text-2xl font-bold sm:text-3xl">{c.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            {c.body1}
            <br />
            {c.body2}
          </p>
          <div className="mt-10">
            <Link
              href={addLocalePrefix("/legal", locale)}
              className="gradient-line inline-flex items-center gap-2 rounded-md px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 opacity-80"
            >
              {c.backToTop}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
