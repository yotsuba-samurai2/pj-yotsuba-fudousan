"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import ColumnBody from "@/components/column/ColumnBody";
import { RelatedColumnsSection } from "@/components/column/RelatedColumnsSection";
import type { Column } from "@/lib/column-shared";

type Props = {
  col: Column;
  prev: Column | null;
  next: Column | null;
  related: Column[];
};

const RELATED_HEADING: Record<string, string> = {
  ja: "関連記事",
  en: "Related Articles",
  "zh-tw": "相關文章",
  zh: "相关文章",
};

export default function ColumnDetailContent({ col, prev, next, related }: Props) {
  const { t, locale } = useTranslation();

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div
          className="pointer-events-none absolute inset-0 bg-green-gradient"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">
              {col.date.replace(/-/g, ".")}
            </span>
            <span className="gradient-line rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white">
              {col.category}
            </span>
          </div>
          <h1 className="article-headline mt-4 text-2xl font-bold leading-relaxed sm:text-3xl md:text-4xl">
            {col.title}
          </h1>
        </div>
      </section>

      {/* ─── 本文 ─── */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Author */}
          <div className="mb-12 flex items-center gap-4 border-b border-border pb-8">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/uramatsu.png"
                alt={col.author?.name || t("realestate.columnDetail.authorName")}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold">
                {col.author?.name || t("realestate.columnDetail.authorName")}
              </p>
              <p className="text-xs text-text-muted">
                {col.author?.title || t("realestate.columnDetail.authorTitle")}
              </p>
              <a
                href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-block text-xs text-primary hover:text-primary-dark"
              >
                {locale === "ja" ? "プロフィール（士業ドットコム）↗" : "Profile (samurai.co.jp) ↗"}
              </a>
            </div>
          </div>

          {/* Summary for Speakable */}
          <p className="article-summary sr-only">{col.excerpt}</p>

          {/* Content */}
          <ColumnBody content={col.content} />

          {/* Prev / Next */}
          <div className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/column/${prev.slug}`}
                className="group rounded-lg border border-border bg-surface p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <p className="text-[10px] text-text-muted">{t("common.prevArticle")}</p>
                <p className="mt-1 text-sm font-bold leading-relaxed group-hover:text-primary line-clamp-2">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/column/${next.slug}`}
                className="group rounded-lg border border-border bg-surface p-4 text-right transition-all hover:border-primary/30 hover:shadow-md"
              >
                <p className="text-[10px] text-text-muted">{t("common.nextArticle")}</p>
                <p className="mt-1 text-sm font-bold leading-relaxed group-hover:text-primary line-clamp-2">
                  {next.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* ─── 関連記事 ─── */}
      <RelatedColumnsSection
        columns={related}
        locale={locale}
        heading={RELATED_HEADING[locale] ?? RELATED_HEADING.ja}
      />

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            {t("common.cta.feelFreeToContact")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            {t("realestate.columnDetail.ctaDescription")}
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="gradient-line inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
            >
              {t("common.cta.contactUs")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
