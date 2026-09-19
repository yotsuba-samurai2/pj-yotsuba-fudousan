"use client";

import { useEffect } from "react";
import { collectBrandFontText, prepareBrandFontSwap } from "@/lib/brand-fonts";

/** Keep the font-face sheets out of the render-blocking CSS graph. */
export function DeferredBrandFonts() {
  useEffect(() => {
    let cancelled = false;
    let firstFrame = 0;
    let secondFrame = 0;
    // Let the eager hero decode and paint before introducing optional font
    // sheets. Two frames alone do not guarantee that the image is ready.
    const heroes = document.querySelectorAll<HTMLImageElement>('img[fetchpriority="high"]');
    Promise.all([...heroes].map(image => image.decode().catch(() => {}))).then(() => {
      if (cancelled) return;
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          // next/font still self-hosts the unchanged, full CJK variable fonts.
          // A failed download leaves the metric-adjusted local fallback readable.
          import("@/app/fonts").then(async ({ fontVariables, notoSerifJP, notoSansJP }) => {
            if (cancelled) return;
            // Applying the families before their unicode slices arrive reflows the
            // whole page for each slice. Keep the readable local fallback until
            // all currently used slices are ready, then swap both families once.
            await prepareBrandFontSwap(collectBrandFontText(document.body), {
              serif: notoSerifJP.style.fontFamily,
              sans: notoSansJP.style.fontFamily,
            }, document.fonts);
            if (!cancelled) document.documentElement.classList.add(...fontVariables.split(" "));
          }).catch(() => {});
        });
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
