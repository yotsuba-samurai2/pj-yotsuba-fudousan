"use client";
// GhOwnerCta — 大家募集ページ（/group-home/ooya）のCTA①②（2026-09-24・指示書 v1.0 第5章 5-1）。
// 主CTA＝ページ内フォーム（#form）、副CTA＝LINE（/line 中継）。CtaBand（本文末CTA③）の複製ではなく軽量帯。
// GA4：cta_contact_click（location=gh_owner_hero|gh_owner_mid・page=gh_owner）。LINE は LineLink が
// cta_line_click を送る。クライアント安全：office 系を参照しない。
import { LineLink } from "@/components/shared/LineLink";
import { gaEvent } from "@/lib/gtag";

type Props = {
  /** GA4 の location 用（hero＝ファーストビュー・mid＝流れの直後） */
  location: "hero" | "mid";
  lead?: string;
  formLabel?: string;
  lineLabel?: string;
};

export function GhOwnerCta({
  location,
  lead,
  formLabel = "物件情報を送って相談する",
  lineLabel = "LINEで相談する",
}: Props) {
  const loc = `gh_owner_${location}`;
  return (
    <aside
      aria-label="ご相談の入口"
      className="rounded-xl border border-border bg-primary-tint p-4 sm:p-5"
    >
      {lead && <p className="text-sm leading-relaxed text-text">{lead}</p>}
      <div className={`flex flex-wrap items-center gap-3 ${lead ? "mt-3" : ""}`}>
        <a
          href="#form"
          onClick={() => gaEvent("cta_contact_click", { location: loc, page: "gh_owner" })}
          className="inline-flex min-h-[44px] items-center rounded-lg bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary focus:outline-none focus:ring-2 focus:ring-focus"
        >
          {formLabel}
        </a>
        <LineLink
          location={loc}
          page="gh_owner"
          className="inline-flex min-h-[44px] items-center rounded-lg border border-primary px-5 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-focus"
        >
          {lineLabel}
        </LineLink>
      </div>
    </aside>
  );
}
