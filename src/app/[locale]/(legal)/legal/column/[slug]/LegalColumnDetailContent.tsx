"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import ColumnBody from "@/components/column/ColumnBody";
import {
  ColumnArticleHero,
  type ColumnArticleHeroIllustration,
} from "@/components/column/ColumnArticleHero";
import type { Column, ColumnSummary } from "@/lib/column-shared";

type Props = {
  column: Column;
  prev: ColumnSummary | null;
  next: ColumnSummary | null;
  illustration: ColumnArticleHeroIllustration;
};

export default function LegalColumnDetailContent({ column: col, prev, next, illustration }: Props) {
  const { t, locale } = useTranslation();

  return (
    <>
      <ColumnArticleHero
        date={col.date}
        category={col.category}
        title={col.title}
        illustration={illustration}
      />

      <section className="py-10 sm:py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center gap-4 border-b border-border pb-8">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Image src="/uramatsu.png" alt={col.author?.name || t("legal.columnDetail.authorName")} width={48} height={48} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold">{col.author?.name || t("legal.columnDetail.authorName")}</p>
              <p className="text-xs text-text-muted">{col.author?.title || t("legal.columnDetail.authorTitle")}</p>
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
          <p className="article-summary sr-only">{col.excerpt}</p>
          <ColumnBody content={col.content} />
          <div className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={`/legal/column/${prev.slug}`} className="group rounded-lg border border-border bg-surface p-4 transition-all hover:border-primary/30 hover:shadow-md">
                <p className="text-[10px] text-text-muted">{t("common.prevArticle")}</p>
                <p className="mt-1 text-sm font-bold leading-relaxed group-hover:text-primary line-clamp-2">{prev.title}</p>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/legal/column/${next.slug}`} className="group rounded-lg border border-border bg-surface p-4 text-right transition-all hover:border-primary/30 hover:shadow-md">
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
