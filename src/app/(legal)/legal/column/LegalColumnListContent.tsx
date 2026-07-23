"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Column } from "@/lib/column-shared";

type Props = {
  /** server（page.tsx）で取得・ローカライズ済みのコラム配列。SSR HTML にリンクを出すため props で受け取る */
  columns: Column[];
};

export default function LegalColumnListContent({ columns }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div className="pointer-events-none absolute inset-0 bg-green-gradient" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">COLUMN</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">{t("legal.columnPage.title")}</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">{t("legal.columnPage.heroDescription1")}<br />{t("legal.columnPage.heroDescription2")}</p>
        </div>
      </section>

      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {columns.length === 0 ? (
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
                  <Link key={col.slug} href={`/legal/column/${col.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-6 md:p-8">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted">{col.date.replace(/-/g, ".")}</span>
                      <span className="gradient-line rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white">{col.category}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-bold leading-relaxed group-hover:text-primary sm:text-xl">{col.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted line-clamp-2">{col.excerpt}</p>
                    <div className="mt-4 flex items-center text-xs font-medium text-primary">
                      {t("common.readMore")}<ArrowRight size={14} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-12 flex items-center justify-center gap-2">
                <button disabled className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors disabled:opacity-30" aria-label={t("common.prevPage")}><ChevronLeft size={18} /></button>
                <span className="gradient-line flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white">1</span>
                <button disabled className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors disabled:opacity-30" aria-label={t("common.nextPage")}><ChevronRight size={18} /></button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
