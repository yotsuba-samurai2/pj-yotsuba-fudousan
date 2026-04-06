"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import ColumnBody from "@/components/column/ColumnBody";
import type { Column } from "@/lib/columns";

type Props = {
  col: Column;
  prev: Column | null;
  next: Column | null;
};

export function LaborColumnDetailPageContent({ col, prev, next }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div className="pointer-events-none absolute inset-0 bg-green-gradient" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted">{col.date.replace(/-/g, ".")}</span>
              <span className="gradient-line rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white">{col.category}</span>
            </div>
            <h1 className="article-headline mt-4 text-2xl font-bold leading-relaxed sm:text-3xl md:text-4xl">{col.title}</h1>
        </div>
      </section>

      <section className="py-10 sm:py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center gap-4 border-b border-border pb-8">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Image src="/uramatsu.png" alt={t("labor.columnDetail.authorName")} width={48} height={48} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold">{t("labor.columnDetail.authorName")}</p>
              <p className="text-xs text-text-muted">{t("labor.columnDetail.authorTitle")}</p>
            </div>
          </div>
          <p className="article-summary sr-only">{col.excerpt}</p>
          <ColumnBody content={col.content} />
          <div className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={`/labor/column/${prev.slug}`} className="group rounded-lg border border-border p-4 transition-all hover:border-primary/30 hover:shadow-md">
                <p className="text-[10px] text-text-muted">{t("common.prevArticle")}</p>
                <p className="mt-1 text-sm font-bold leading-relaxed group-hover:text-primary line-clamp-2">{prev.title}</p>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/labor/column/${next.slug}`} className="group rounded-lg border border-border p-4 text-right transition-all hover:border-primary/30 hover:shadow-md">
                <p className="text-[10px] text-text-muted">{t("common.nextArticle")}</p>
                <p className="mt-1 text-sm font-bold leading-relaxed group-hover:text-primary line-clamp-2">{next.title}</p>
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>
    </>
  );
}
