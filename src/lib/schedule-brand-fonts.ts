/** Leave two frames for the readable fallback before loading decorative fonts. */
export function scheduleBrandFonts(load: () => void, afterPageLoad = false, browser: Window = window) {
  let cancelled = false;
  let firstFrame: number | undefined;
  let secondFrame: number | undefined;
  let idle: number | undefined;

  const run = () => { if (!cancelled) load(); };
  const afterPaint = () => {
    firstFrame = browser.requestAnimationFrame(() => {
      secondFrame = browser.requestAnimationFrame(() => {
        if (afterPageLoad && typeof browser.requestIdleCallback === "function") {
          idle = browser.requestIdleCallback(run, { timeout: 1000 });
        } else {
          run();
        }
      });
    });
  };

  if (afterPageLoad && browser.document.readyState !== "complete") {
    browser.addEventListener("load", afterPaint, { once: true });
  } else {
    afterPaint();
  }

  return () => {
    cancelled = true;
    browser.removeEventListener("load", afterPaint);
    if (firstFrame !== undefined) browser.cancelAnimationFrame(firstFrame);
    if (secondFrame !== undefined) browser.cancelAnimationFrame(secondFrame);
    if (idle !== undefined) browser.cancelIdleCallback(idle);
  };
}
