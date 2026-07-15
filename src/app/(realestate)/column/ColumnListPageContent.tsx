"use client";

import { useEffect, useState } from "react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getLatestColumns } from "@/lib/columns-actions";
import { getLocalizedColumn, type Column } from "@/lib/column-shared";

export default function ColumnListPageContent() {
  const { t, locale } = useTranslation();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLatestColumns(20, locale).then((cols) => {
      setColumns(cols.map((c) => getLocalizedColumn(c, locale)));
      setLoading(false);
    });
  }, [locale]);

  return (
    <div>
      <BreadcrumbJsonLd
        businessKey="realestate"
        items={[
          { name: t("realestate.nav.column"), href: "/" },
          { name: t("realestate.columnPage.title"), href: "/column" },
        ]}
      />
      {/* ─── Hero ─── */}
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div
          className="pointer-events-none absolute inset-0 bg-green-gradient"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
            COLUMN
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
            {t("realestate.columnPage.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
            {t("realestate.columnPage.heroDescription1")}
            <br />
            {t("realestate.columnPage.heroDescription2")}
          </p>
        </div>
      </section>

      {/* ─── 記事一覧 ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : columns.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center sm:p-16">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <ArrowRight size={24} className="text-primary" />
              </div>
              <p className="text-lg font-semibold">{t("common.column.emptyTitle")}</p>
              <p className="mt-2 text-sm text-text-muted">{t("common.column.emptyDescription")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 sm:space-y-6">
                {columns.map((col) => (
                  <Link
                    key={col.slug}
                    href={`/column/${col.slug}`}
                    className="group block overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted">
                        {col.date.replace(/-/g, ".")}
                      </span>
                      <span className="gradient-line rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white">
                        {col.category}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-bold leading-relaxed group-hover:text-primary sm:text-xl">
                      {col.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted line-clamp-2">
                      {col.excerpt}
                    </p>
                    <div className="mt-4 flex items-center text-xs font-medium text-primary">
                      {t("common.readMore")}
                      <ArrowRight
                        size={14}
                        className="ml-1 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  disabled
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors disabled:opacity-30"
                  aria-label={t("common.prevPage")}
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="gradient-line flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white">
                  1
                </span>
                <button
                  disabled
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors disabled:opacity-30"
                  aria-label={t("common.nextPage")}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            {t("common.cta.feelFreeToContact")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            {t("realestate.columnPage.ctaDescription")}
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
    </div>
  );
}
