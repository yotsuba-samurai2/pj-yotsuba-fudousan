"use client";

import { useEffect } from "react";

/** Keep the font-face sheets out of the render-blocking CSS graph. */
export function DeferredBrandFonts() {
  useEffect(() => {
    let cancelled = false;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        // next/font still self-hosts the unchanged, full CJK variable fonts.
        // A failed download leaves the metric-adjusted local fallback readable.
        import("@/app/fonts").then(({ fontVariables }) => {
          if (!cancelled) document.documentElement.classList.add(...fontVariables.split(" "));
        }).catch(() => {});
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);
  return null;
}
