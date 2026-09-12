"use client";
// フェーズK-4｜LINKA 追従FAB（コーポレート3サイト・開くとassistant-uiのThread＝LinkaWidget）
// - 【1ページ1LINKA】不動産トップは本文の60秒診断がLINKA＝suppressedでFABなし（TenantLayoutShellが制御）
// - パネル内の代表LINEを維持。2026-09-12：追従CTAと共存し、パネル表示中はCTAを退避。
// - laborは(labor)layoutの404＋APIのSR_LAUNCHEDゲートで二重に守られる（このFABはlaborページ内でのみ描画され得る）
// K-2b（2026-07-12）：UI文言を4ロケール化（正本＝lib/linka/ui-copy.ts）。
// useLanguage()はProvider不在でもDEFAULT_LOCALE("ja")を返す設計＝どこで描画しても安全。
import { useEffect, useRef, useState } from "react";
import contactStyles from "@/components/shared/ContactCta.module.css";
import Image from "next/image";
import { LazyLinkaWidget } from "@/components/linka/LazyLinkaWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { linkaUi } from "@/lib/linka/ui-copy";
import { gaEvent } from "@/lib/gtag";
import type { BusinessKey } from "@/lib/shared/office";

export function LinkaFab({
  businessKey,
  suppressed = false,
  linkaImg = "/linka/linka-512.webp",
}: {
  businessKey: BusinessKey;
  suppressed?: boolean;
  /** 互換のため残置（現在は共通画像を使用） */
  exits?: string[];
  linkaImg?: string;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const close = () => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); };
  useEffect(() => {
    if (open) panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [open]);
  const { locale } = useLanguage();
  const t = linkaUi(locale);
  if (suppressed) return null;

  return (
    // z-30＝モバイルメニュー(z-40)より下＝メニューを開いてもLINKAが言語切替を覆わない。SPはbottom-[112px]で上へ退避
    <div
      data-yotsuba-linka-open={open ? "true" : "false"}
      className={`fixed bottom-4 right-4 z-30 md:bottom-6 md:right-6 max-md:bottom-[112px] ${contactStyles.linkaOffset}`}
    >
      {open ? (
        <div ref={panel} role="dialog" aria-label={t.panelTitle} onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); close(); } }} className="flex h-[min(600px,75dvh)] w-[min(24rem,92vw)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          {/* ヘッダー */}
          <div className="flex items-center gap-2 bg-primary px-3 py-2.5 text-white">
            <Image
              src={linkaImg}
              alt="LINKA"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="text-sm font-semibold">{t.panelTitle}</span>
            <button
              type="button"
              aria-label={t.close}
              onClick={close}
              className="ml-auto rounded p-1 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              ✕
            </button>
          </div>
          {/* 本文＝assistant-ui Thread（AIはサーバ /api/linka） */}
          <LazyLinkaWidget site={businessKey} mode="concierge" className="min-h-0 flex-1" />
        </div>
      ) : (
        /* 折りたたみ＝SP84px／PC168px（2026-07-10浦松指示：PCは2倍・チップ文字はPC+5pt） */
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            gaEvent("linka_open", { site: businessKey });
          }}
          ref={trigger}
          aria-expanded={open}
          aria-label={t.fabAria}
          className={`flex items-center gap-2 focus:outline-none ${contactStyles.linkaTrigger}`}
        >
          <span className={`rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted shadow-sm md:px-4 md:py-2 md:text-[17px] ${contactStyles.linkaChip}`}>
            {t.fabChip}
          </span>
          <span className={`grid h-[84px] w-[84px] place-items-center overflow-hidden rounded-full bg-primary shadow-lg ring-2 ring-primary md:h-[168px] md:w-[168px] ${contactStyles.linkaAvatar}`}>
            <Image
              src={linkaImg}
              alt="LINKA"
              width={168}
              height={168}
              sizes="(min-width: 768px) 168px, 84px"
              className="h-full w-full object-cover"
            />
          </span>
        </button>
      )}
    </div>
  );
}
