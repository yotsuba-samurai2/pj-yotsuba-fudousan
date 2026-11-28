import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CONTACT_CTA_COPY } from "@/lib/shared/contact-cta-copy";
import {
  MAINLAND_INHERITANCE_COLUMN_PATH,
  getMainlandInheritanceContact,
} from "@/lib/legal/mainland-inheritance-contact";
import { contactIntentPreset } from "@/lib/shared/contact-intent-preset";
import { addLocalePrefix } from "@/lib/locale";
import { CONTACT_HREF, OFFICE } from "@/lib/shared/office-public";
import { StickyContactCta, InlineContactCta } from "../ContactCta";
import ColumnBody from "@/components/column/ColumnBody";
import LegalColumnDetailContent from "@/app/[locale]/(legal)/legal/column/[slug]/LegalColumnDetailContent";
import { TAIWAN_LEGAL_COLUMNS_SEED } from "@/lib/data/taiwan-legal-columns-seed";
import { getLocalizedColumn, type Column } from "@/lib/column-shared";
import type { LangCode } from "@/config/languages";

const state = vi.hoisted(() => ({ pathname: "/column/test", locale: "ja" }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
vi.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ locale: state.locale }) }));
vi.mock("@/components/ui/LocaleLink", () => ({
  // Nextのルーター部分だけを置き換える。React、CSS Modules、CTA本体は実依存で読む。
  LocaleLink: ({ href = "", children, ...props }: ComponentProps<"a">) => createElement(
    "a", { ...props, href: state.locale === "ja" ? href : `/${state.locale}${href}` }, children,
  ),
}));
vi.mock("@/lib/gtag", () => ({ gaEvent: vi.fn() }));

describe("CTA server render (router hooks are mocked; not a Next E2E test)", () => {
  for (const locale of ["ja", "en", "zh", "zh-tw"] as const) {
    for (const businessKey of ["realestate", "legal", "labor"] as const) {
      it(`renders the correct links for ${locale}/${businessKey}`, () => {
        state.locale = locale;
        const segment = businessKey === "realestate" ? "" : `/${businessKey}`;
        state.pathname = addLocalePrefix(`${segment}/column/test`, locale);
        const html = renderToStaticMarkup(createElement(StickyContactCta, { businessKey }));
        expect(html).toContain('data-contact-cta="sticky"');
        expect(html).toContain('role="navigation"');
        expect(html).toContain(CONTACT_CTA_COPY[locale].line);
        expect(html).toContain(`href="${addLocalePrefix("/line", locale)}"`);
        expect(html).toContain(`href="${addLocalePrefix(CONTACT_HREF[businessKey], locale)}"`);
        expect(html).toContain(`href="${OFFICE.telHref}"`);
        const inline = renderToStaticMarkup(createElement(InlineContactCta, { businessKey }));
        expect(inline).toContain('data-contact-cta="mid_article"');
        expect(inline).toContain(CONTACT_CTA_COPY[locale].inlineBody[businessKey]);
        // 本番のColumnBody経由でも挿入と既存の言語別リンク補正が共存する。
        const paragraph = "Original article explanation. ".repeat(35);
        const content = `## First section\n\n${paragraph}\n\n[Reference](/column/source)\n\n${paragraph}\n\n## Last section\n\n${paragraph}`;
        const article = renderToStaticMarkup(createElement(ColumnBody, {
          content,
          linkOverrides: { "/column/source": { href: "/zh-tw/column/source", language: "繁體中文" } },
        }));
        expect(article.split('data-contact-cta="mid_article"')).toHaveLength(2);
        expect(article).toContain(CONTACT_CTA_COPY[locale].inlineBody[businessKey]);
        expect(article).toContain('href="/zh-tw/column/source"');
        expect(article).toContain("繁體中文");
        expect(article).toContain("<h2>Last section</h2>");
        state.pathname = addLocalePrefix(CONTACT_HREF[businessKey], locale);
        expect(renderToStaticMarkup(createElement(ColumnBody, { content }))).not.toContain('data-contact-cta="mid_article"');
        expect(renderToStaticMarkup(createElement(StickyContactCta, { businessKey }))).toBe("");
      });
    }
  }
  it("keeps internal /ja and browser paths consistent on the server", () => {
    state.locale = "ja";
    state.pathname = "/ja/legal/column/test";
    const internal = renderToStaticMarkup(createElement(StickyContactCta, { businessKey: "legal" }));
    state.pathname = "/legal/column/test";
    expect(renderToStaticMarkup(createElement(StickyContactCta, { businessKey: "legal" }))).toBe(internal);
  });
});

describe("mainland inheritance article contact", () => {
  for (const locale of ["ja", "en", "zh"] as const) {
    it("uses the existing inheritance category in both CTAs for " + locale, () => {
      state.locale = locale;
      state.pathname = addLocalePrefix(MAINLAND_INHERITANCE_COLUMN_PATH, locale);
      const expectedHref = addLocalePrefix("/legal/contact?intent=souzoku-legal", locale);
      const routeContact = getMainlandInheritanceContact(MAINLAND_INHERITANCE_COLUMN_PATH, locale);
      expect(routeContact?.label).toBeTruthy();
      const sticky = renderToStaticMarkup(createElement(StickyContactCta, { businessKey: "legal" }));
      const inline = renderToStaticMarkup(createElement(InlineContactCta, { businessKey: "legal" }));
      for (const html of [sticky, inline]) {
        expect(html).toContain('href="' + expectedHref + '"');
        expect(html).toContain(routeContact?.label);
        expect(html).not.toContain('href="' + addLocalePrefix("/line", locale) + '"');
        expect(html).not.toContain(CONTACT_CTA_COPY[locale].line);
      }
      expect(contactIntentPreset("souzoku-legal", "legal", locale)?.category).toBe("souzoku-legal");
    });
  }

  it("leaves zh-tw and superficially similar paths on the existing CTA", () => {
    for (const [locale, path] of [
      ["zh-tw", MAINLAND_INHERITANCE_COLUMN_PATH],
      ["zh", MAINLAND_INHERITANCE_COLUMN_PATH + "-different"],
      ["en", "/legal/column/test"],
    ] as const) {
      state.locale = locale;
      state.pathname = addLocalePrefix(path, locale);
      expect(getMainlandInheritanceContact(path, locale)).toBeNull();
      for (const Component of [StickyContactCta, InlineContactCta]) {
        const html = renderToStaticMarkup(createElement(Component, { businessKey: "legal" }));
        expect(html).toContain('href="' + addLocalePrefix("/line", locale) + '"');
        expect(html).not.toContain("?intent=souzoku-legal");
      }
    }
  });
});

describe("Taiwan seal article inline contact", () => {
  const slug = "taiwan-inkan-shomei-isan-bunkatsu";
  const seed = TAIWAN_LEGAL_COLUMNS_SEED.find((article) => article.slug === slug)!;
  function renderArticle(locale: LangCode, article: Column) {
    state.locale = locale;
    state.pathname = addLocalePrefix("/legal/column/" + article.slug, locale);
    return renderToStaticMarkup(createElement(LegalColumnDetailContent, {
      column: article, prev: null, next: null,
      illustration: { src: "/illustration.png", alt: "", source: "test", theme: "test" },
    }));
  }
  it("replaces just the generic mid-article block, directly after the recipient distinction", () => {
    const html = renderArticle("zh-tw", getLocalizedColumn(seed, "zh-tw"));
    const blocks = html.match(/<section [^>]*data-contact-cta="mid_article"[\s\S]*?<\/section>/g) ?? [];
    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.match(/href="[^"]+"/g)).toEqual(['href="/zh-tw/legal/contact"']);
    expect(blocks[0]).toContain("請勿提供證件號碼、銀行帳號或文件影本");
    expect(html).toMatch(/接受何者而定。<\/p>\s*<section [^>]*data-contact-cta="mid_article"/);
    expect(html).toMatch(/<\/section>\s*<h2>順序應如何進行？<\/h2>/);
    expect(html).not.toContain(CONTACT_CTA_COPY["zh-tw"].inlineBody.legal);
    expect(renderToStaticMarkup(createElement(StickyContactCta, { businessKey: "legal" }))).toContain('href="/zh-tw/line"');
  });
  it("still renders one contextual block if the editor renames the heading", () => {
    const article = getLocalizedColumn(seed, "zh-tw");
    const html = renderArticle("zh-tw", { ...article, content: article.content.replace("## 順序應如何進行？", "## 辦理步驟") });
    expect(html.match(/data-contact-cta="mid_article"/g)).toHaveLength(1);
    expect(html).toContain("詢問印鑑證明的準備方式");
    expect(html).toContain("<h2>辦理步驟</h2>");
  });
  it("preserves the original rendered body for other editions and the other Taiwan article", () => {
    const other = TAIWAN_LEGAL_COLUMNS_SEED.find((article) => article.slug !== slug)!;
    for (const [locale, source] of [["ja", seed], ["en", seed], ["zh", seed], ["zh-tw", other]] as const) {
      const article = getLocalizedColumn(source, locale);
      const html = renderArticle(locale, article);
      expect(html).toContain(renderToStaticMarkup(createElement(ColumnBody, { content: article.content })));
      expect(html).toContain(CONTACT_CTA_COPY[locale].inlineBody.legal);
    }
  });
});
