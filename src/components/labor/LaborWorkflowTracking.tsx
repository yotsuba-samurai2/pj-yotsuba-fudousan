"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import type { LangCode } from "@/config/languages";
import { gaEvent } from "@/lib/gtag";

type Placement = "hero" | "top_banner" | "detail_intro" | "detail_steps" | "detail_end";
type Channel = "form" | "line" | "phone";
type Props = { href: string; locale: LangCode; placement: Placement; className?: string; children: ReactNode } & (
  { event: "workflow_banner_click"; channel?: never } |
  { event: "workflow_cta_click"; channel: Channel } |
  { event: "cta_contact_click"; channel: "form" }
);

/** Consent and delivery remain owned by the existing gtag integration. */
export function LaborWorkflowLink({ href, locale, placement, className, children, event, channel }: Props) {
  const track = () => gaEvent(event, {
    business: "labor", locale, placement, ...(channel ? { channel } : {}),
  });
  return <Link href={href} className={className} onClick={track}>{children}</Link>;
}

/** Children are rendered by the server; only the visibility observer is client code. */
export function LaborWorkflowImpression({ locale, children, className }: { locale: LangCode; children: ReactNode; className?: string }) {
  const target = useRef<HTMLDivElement>(null);
  const sent = useRef(false);
  useEffect(() => {
    if (!target.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (!sent.current && entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
        sent.current = true;
        gaEvent("workflow_banner_view", { business: "labor", locale, placement: "top_banner" });
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(target.current);
    return () => observer.disconnect();
  }, [locale]);
  return <div ref={target} className={className} data-workflow-banner="true">{children}</div>;
}
