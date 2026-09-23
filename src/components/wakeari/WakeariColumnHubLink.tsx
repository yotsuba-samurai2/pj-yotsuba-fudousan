// WakeariColumnHubLink — 既存コラム → 受け皿（/wakeari 配下）への1本（2026-09-23）。
// 企画書 第6章「既存コラム 20 本 → 対応する受け皿 → 関連記事欄に 1 本」。
// DB の本文は触らず、コード側の対応表（WAKEARI_HUB_BY_COLUMN_SLUG）で slug が一致した記事だけに出す。
// 受け皿は ja 先行公開のため、呼び出し側（column/[slug]）は ja のときだけ描画する。
// server / client どちらの親からも使える純プレゼンテーション（フック・"use client" 無し）。
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  WAKEARI_COLUMN_HUB_HEADING,
  WAKEARI_COLUMN_HUB_NOTE,
  WAKEARI_HUB_BY_COLUMN_SLUG,
} from "@/lib/wakeari";

export function WakeariColumnHubLink({ slug }: { slug: string }) {
  const page = WAKEARI_HUB_BY_COLUMN_SLUG[slug];
  if (!page) return null;
  return (
    <section className="border-t border-border py-10 sm:py-14" aria-label={WAKEARI_COLUMN_HUB_HEADING}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold sm:text-2xl">{WAKEARI_COLUMN_HUB_HEADING}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{WAKEARI_COLUMN_HUB_NOTE}</p>
        <Link
          href={page.path}
          className="group mt-4 block rounded-xl border border-border bg-surface p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md sm:p-5"
        >
          <p className="text-sm font-bold leading-relaxed group-hover:text-primary sm:text-base">{page.h1}</p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">{page.summary}</p>
          <span className="mt-2 flex items-center text-xs font-medium text-primary">
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </section>
  );
}
