/** Collect only text that actually uses our two brand families. */
export function collectBrandFontText(root: HTMLElement): Map<string, string> {
  const text = new Map<string, Set<string>>();
  const styles = new Map<Element, CSSStyleDeclaration>();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || !node.textContent?.trim() || parent.closest("script, style, noscript")) continue;
    // Do not force style/layout or font downloads inside skipped offscreen
    // sections. Unsupported browsers retain the ordinary full-page behavior.
    if (parent.checkVisibility && !parent.checkVisibility({ contentVisibilityAuto: true })) continue;
    let style = styles.get(parent);
    if (!style) {
      style = getComputedStyle(parent);
      styles.set(parent, style);
    }
    const family = style.fontFamily.includes("Yotsuba Serif Fallback") ? "serif"
      : style.fontFamily.includes("Yotsuba Sans Fallback") ? "sans" : null;
    if (!family || style.display === "none" || style.visibility === "hidden") continue;
    const key = `${family}:${style.fontWeight}`;
    const characters = text.get(key) ?? new Set<string>();
    for (const character of node.textContent) characters.add(character);
    text.set(key, characters);
  }
  return new Map([...text].map(([key, characters]) => [key, [...characters].join("")]));
}

/** Load the used unicode ranges before changing the font of any visible text. */
export async function prepareBrandFontSwap(
  text: Map<string, string>,
  families: { serif: string; sans: string },
  fonts: Pick<FontFaceSet, "load">,
): Promise<void> {
  await Promise.all([...text].map(([key, characters]) => {
    const [family, weight] = key.split(":") as ["serif" | "sans", string];
    return fonts.load(`${weight} 16px ${families[family]}`, characters);
  }));
}
