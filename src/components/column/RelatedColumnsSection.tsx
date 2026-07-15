// RelatedColumnsSection — 関連コラム／関連記事の内部リンクブロック。
// server / client どちらの親からも使える純プレゼンテーション（フック・"use client" 無し）。
// リンクは next/link + addLocalePrefix（1回だけ接頭辞付与）で SSR HTML に href を出す。
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { addLocalePrefix } from "@/lib/locale";
import type { LangCode } from "@/config/languages";
import type { Column } from "@/lib/columns";

const DEFAULT_HEADING: Record<LangCode, string> = {
  ja: "関連コラム",
  en: "Related Columns",
  "zh-tw": "相關專欄",
  zh: "相关专栏",
};

type Props = {
  columns: Column[];
  locale: LangCode;
  /** 見出し。省略時はロケール別の「関連コラム」 */
  heading?: string;
  /** ラップ <section> の className（各ページの余白トーンに合わせて上書き可） */
  className?: string;
};

export function RelatedColumnsSection({
  columns,
  locale,
  heading,
  className,
}: Props) {
  if (columns.length === 0) return null;
  const title = heading ?? DEFAULT_HEADING[locale] ?? DEFAULT_HEADING.ja;

  return (
    <section
      className={
        className ??
        "border-t border-border py-14 sm:py-20 md:py-24"
      }
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        <ul className="mt-6 space-y-3 sm:space-y-4">
          {columns.map((col) => (
            <li key={col.slug}>
              <Link
                href={addLocalePrefix(`/column/${col.slug}`, locale)}
                className="group block rounded-xl border border-border bg-surface p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-muted">
                    {col.date.replace(/-/g, ".")}
                  </span>
                  <span className="gradient-line rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white">
                    {col.category}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold leading-relaxed group-hover:text-primary sm:text-base">
                  {col.title}
                </p>
                <div className="mt-2 flex items-center text-xs font-medium text-primary">
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
