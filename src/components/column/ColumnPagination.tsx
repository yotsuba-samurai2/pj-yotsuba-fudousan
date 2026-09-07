"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

const LABELS = {
  ja: { navigation: "コラムのページ移動", total: "件" },
  en: { navigation: "Column pagination", total: "articles" },
  "zh-tw": { navigation: "專欄分頁", total: "篇" },
  zh: { navigation: "专栏分页", total: "篇" },
};

export function ColumnPagination({ path, page, total, totalPages }: {
  path: string; page: number; total: number; totalPages: number;
}) {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const label = LABELS[locale];
  const href = (n: number) => n === 1 ? path : `${path}/page/${n}`;
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter(n => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const button = "flex h-10 min-w-10 items-center justify-center rounded-lg border border-border bg-surface px-2 text-sm";
  return (
    <nav aria-label={label.navigation} className="mt-12 text-center">
      <p className="mb-4 text-sm text-text-muted">{total} {label.total}</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 ? <Link href={href(page - 1)} rel="prev" className={button} aria-label={t("common.prevPage")}><ChevronLeft size={18} /></Link>
          : <button disabled className={`${button} opacity-30`} aria-label={t("common.prevPage")}><ChevronLeft size={18} /></button>}
        {pages.map((n, i) => <span key={n} className="flex items-center gap-2">
          {i > 0 && n > pages[i - 1] + 1 && <span aria-hidden="true">…</span>}
          {n === page ? <span aria-current="page" className={`${button} gradient-line font-bold text-white`}>{n}</span>
            : <Link href={href(n)} className={button} aria-label={`${label.navigation} ${n}`}>{n}</Link>}
        </span>)}
        {page < totalPages ? <Link href={href(page + 1)} rel="next" className={button} aria-label={t("common.nextPage")}><ChevronRight size={18} /></Link>
          : <button disabled className={`${button} opacity-30`} aria-label={t("common.nextPage")}><ChevronRight size={18} /></button>}
      </div>
    </nav>
  );
}
