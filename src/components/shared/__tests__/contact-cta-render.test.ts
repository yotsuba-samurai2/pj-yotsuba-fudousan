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
