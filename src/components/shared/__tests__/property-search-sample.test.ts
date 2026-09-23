import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { LangCode } from "@/config/languages";
import {
  PropertySearchSampleSection,
  PropertySearchSampleTeaser,
  type PropertySearchSampleKind,
} from "../PropertySearchSample";
import { SAMPLE_ASSETS } from "@/lib/property-search-samples";

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
  it("opens the in-site viewer instead of the raw PDF so phones can always go back", () => {
    const html = renderToStaticMarkup(createElement(PropertySearchSampleSection));

    // PDFへ直接リンクしない（2026-09-23：スマホで戻れなくなる不具合の是正）
    expect(html).toContain('href="/sample/welfare"');
    expect(html).not.toMatch(/href="[^"]*\.pdf"/);
    expect(html).not.toContain('target="_blank"');
    expect(html).toContain("「元のページに戻る」でこのページへ戻れます");
  });

  it("links every purpose and locale to its viewer page and keeps the matching preview", () => {
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
        const href = locale === "ja" ? `/sample/${kind}` : `/${locale}/sample/${kind}`;
        expect(html).toContain(`href="${href}"`);
        expect(html).not.toMatch(/href="[^"]*\.pdf"/);
        expect(html).toContain(kind === "welfare" && locale === "ja" ? "/preview.webp" : `preview-${locale}.webp`);
        expect(html).not.toContain('target="_blank"');
        // ビューアがダウンロード用に使うPDFも、用途×言語で取り違えていない
        expect(SAMPLE_ASSETS[kind][locale].pdf).toBe(`/samples/property-search/${pdf}`);
        renderedHrefs.add(href);
      }
    }
    expect(renderedHrefs).toHaveLength(20);
  });
});
