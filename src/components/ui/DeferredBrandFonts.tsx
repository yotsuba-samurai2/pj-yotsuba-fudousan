"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scheduleBrandFonts } from "@/lib/schedule-brand-fonts";

/** Keep the font-face sheets out of the render-blocking CSS graph. */
export function DeferredBrandFonts() {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    // On labor mobile pages, finish the initial image load/paint before a font
    // swap recalculates the long page. Desktop and other sites keep their timing.
    const afterPageLoad = /^\/(?:(?:ja|en|zh-tw|zh)\/)?labor(?:\/|$)/.test(pathname ?? "")
      && window.matchMedia("(max-width: 767px)").matches;
    const cancelScheduled = scheduleBrandFonts(() => {
      // next/font still self-hosts the unchanged, full CJK variable fonts.
      // A failed download leaves the metric-adjusted local fallback readable.
      import("@/app/fonts").then(({ fontVariables }) => {
        if (!cancelled) document.documentElement.classList.add(...fontVariables.split(" "));
      }).catch(() => {});
    }, afterPageLoad);
    return () => {
      cancelled = true;
      cancelScheduled();
    };
  }, [pathname]);
  return null;
}
