import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { LangCode } from "@/config/languages";
import {
  PropertySearchSampleSection,
  PropertySearchSampleTeaser,
  type PropertySearchSampleKind,
} from "../PropertySearchSample";

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: ComponentProps<"img">) =>
    createElement("img", { ...props, alt, src: String(src) }),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: ComponentProps<"a">) =>
    createElement("a", { ...props, href }, children),
}));
vi.mock("@/lib/gtag", () => ({ gaEvent: vi.fn() }));

describe("PropertySearchSampleSection", () => {
  it("opens the PDF in the current tab so browser back returns to the source page", () => {
    const html = renderToStaticMarkup(createElement(PropertySearchSampleSection));

    expect(html).toContain('href="/samples/property-search/property-search-sample.pdf"');
    expect(html).not.toContain('target="_blank"');
    expect(html).toContain("ブラウザの「戻る」でこのページへ戻れます");
  });

  it("uses the matching nine-page PDF and preview for every purpose and locale", () => {
    const expected: Record<PropertySearchSampleKind, Record<LangCode, string>> = {
      welfare: {
        ja: "property-search-sample.pdf",
        en: "property-search-sample-en.pdf",
        "zh-tw": "property-search-sample-zh-tw.pdf",
        zh: "property-search-sample-zh.pdf",
      },
      "group-home": {
        ja: "group-home-sample-ja.pdf",
        en: "group-home-sample-en.pdf",
        "zh-tw": "group-home-sample-zh-tw.pdf",
        zh: "group-home-sample-zh.pdf",
      },
      office: {
        ja: "office-sample-ja.pdf",
        en: "office-sample-en.pdf",
        "zh-tw": "office-sample-zh-tw.pdf",
        zh: "office-sample-zh.pdf",
      },
      restaurant: {
        ja: "restaurant-sample-ja.pdf",
        en: "restaurant-sample-en.pdf",
        "zh-tw": "restaurant-sample-zh-tw.pdf",
        zh: "restaurant-sample-zh.pdf",
      },
      investment: {
        ja: "investment-sample-ja.pdf",
        en: "investment-sample-en.pdf",
        "zh-tw": "investment-sample-zh-tw.pdf",
        zh: "investment-sample-zh.pdf",
      },
    };

    const renderedHrefs = new Set<string>();
    for (const [kind, byLocale] of Object.entries(expected) as [PropertySearchSampleKind, Record<LangCode, string>][]) {
      for (const [locale, pdf] of Object.entries(byLocale) as [LangCode, string][]) {
        const html = renderToStaticMarkup(createElement(PropertySearchSampleTeaser, { kind, locale, page: "/test" }));
        const href = `/samples/property-search/${pdf}`;
        expect(html).toContain(`href="${href}"`);
        expect(html).toContain(kind === "welfare" && locale === "ja" ? "/preview.webp" : `preview-${locale}.webp`);
        expect(html).not.toContain('target="_blank"');
        renderedHrefs.add(href);
      }
    }
    expect(renderedHrefs).toHaveLength(20);
  });
});
