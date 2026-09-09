import { LABOR_SETUP_COPY, FREEE_SUPPORT_URL } from "@/lib/labor/setup-copy";
import { describe, it, expect, vi, afterAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { LangCode } from "@/config/languages";
import { LABOR_PLAN_COPY } from "@/lib/labor/plan-copy";
import { LABOR_SERVICE_COPY } from "@/lib/labor/service-copy";
import { getLaborPriceStructuredData } from "@/lib/labor/structured-data";
import { LABOR_ANCILLARY_FEES } from "@/lib/labor/ancillary-fees";
const state = vi.hoisted(() => {
  const previous = process.env.NEXT_PUBLIC_SR_LAUNCHED;
  process.env.NEXT_PUBLIC_SR_LAUNCHED = "true";
  return { locale: "ja" as LangCode, previous };
});
afterAll(() => {
  if (state.previous === undefined) delete process.env.NEXT_PUBLIC_SR_LAUNCHED;
  else process.env.NEXT_PUBLIC_SR_LAUNCHED = state.previous;
});
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => state.locale }));
vi.mock("@/components/shared/CtaBand", () => ({ CtaBand: () => null }));
vi.mock("@/components/shared/Breadcrumb", () => ({ Breadcrumb: () => null }));
vi.mock("@/components/shared/CrossLinkBanner", () => ({ CrossLinkBanner: () => null }));
import Top, { generateMetadata as topMetadata } from "@/app/[locale]/(labor)/labor/page";
import Prices from "@/app/[locale]/(labor)/labor/ryokin/page";
import Faq from "@/app/[locale]/(labor)/labor/faq/page";
import Flow from "@/app/[locale]/(labor)/labor/nagare/page";

for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
  describe(`V10 pages (${locale})`, () => {
    it("preserves resident tax and workplace change/closure fees", () => {
      const rows = LABOR_ANCILLARY_FEES[locale].sections.flatMap(section => section.rows);
      expect(rows.some(row => "value" in row && row.value === 550)).toBe(true);
      expect(rows.filter(row => "value" in row && row.value === 6050)).toHaveLength(2);
      expect(rows.some(row => "value" in row && row.value === 11550)).toBe(true);
    });
    it("shows the Hero boundary and prioritizes the plan, foreign employers, then GH", async () => {
      state.locale = locale;
      const html = renderToStaticMarkup(await Top());
      const c = LABOR_SERVICE_COPY[locale];
      const p = LABOR_PLAN_COPY[locale];
      expect(html).toContain(c.hero);
      expect(html).toContain(c.sub);
      expect(html).toContain(c.foreignHighlightBody);
      expect(html).toContain(c.visaContractNotice);
      expect(html.indexOf(c.visaContractNotice)).toBeLessThan(html.indexOf(c.visaLink));
      expect(html.indexOf(c.chineseTitle)).toBeLessThan(html.indexOf(c.recruitmentTitle));
      expect(html.indexOf(p.scopeHeadings[1])).toBeLessThan(html.indexOf(c.foreignHighlightTitle));
      expect(html).not.toContain("<main");
      expect(html.indexOf(p.responsibility)).toBeGreaterThan(html.indexOf("<h1"));
      expect(html.indexOf(p.responsibility)).toBeLessThan(html.indexOf(c.foreignHighlightTitle));
      expect(html.indexOf(p.name)).toBeLessThan(html.indexOf(c.foreignHighlightTitle));
      expect(html.indexOf(c.foreignHighlightTitle)).toBeLessThan(html.indexOf(c.ghTitle));
      expect(html).toContain("33,000");
      expect(html).toContain("55,000");
      expect(html).toContain("88,000");
      const setup = LABOR_SETUP_COPY[locale];
      expect(html).toContain(setup.freeeSupport);
      expect(html).toContain(`href="https://www.freee.co.jp/hr/contacts/"`);
      expect(html.indexOf(setup.comparisonTitle)).toBeGreaterThan(html.indexOf("88,000"));
      expect(html.indexOf(setup.comparisonTitle)).toBeLessThan(html.indexOf(p.scopeHeadings[0]));
      expect(html).not.toContain("https://www.freee.co.jp/accounting/smb/support/");
      const prefix = locale === "ja" ? "" : `/${locale}`;
      expect(html).toContain(`href="${prefix}/legal/services/visa"`);
      expect(html).toContain(`href="${prefix}/legal/services/shogai-fukushi"`);
      expect(html).toContain(`href="${prefix}/labor/contact"`);
      const metadata = await topMetadata();
      expect(metadata.title).toEqual({ absolute: c.title });
      expect(metadata.description).toBe(c.intro);
      expect(JSON.stringify(metadata.alternates)).toContain(`${prefix}/labor`);
    });

    it.each([["prices", Prices], ["faq", Faq], ["flow", Flow]] as const)("keeps %s consistent with the new fee and scope", async (_name, Page) => {
      state.locale = locale;
      const html = renderToStaticMarkup(await Page());
      expect(html).toContain("33,000");
      expect(html).toContain("55,000");
      expect(html).toContain("88,000");
      expect(html).toContain("freee");
      expect(html).toContain("LINE");
      expect(html).not.toMatch(/23,100|50％|50%|顧問料は、労務のご相談に対する対価|ご相談だけです|in-house|内製|内制|內製/);
    });

    it("shows both conditional setup tiers and a fair freee comparison", async () => {
      state.locale = locale;
      const html = renderToStaticMarkup(await Prices());
      const setup = LABOR_SETUP_COPY[locale];
      expect(html).toContain(setup.standardTitle);
      expect(html).toContain(setup.standardCondition);
      expect(html).toContain(setup.migrationTitle);
      expect(html).toContain(setup.migrationCondition);
      expect(html).toContain(setup.quoteNote);
      expect(html).toContain(setup.freeeSupport);
      expect(html).toContain(setup.comparison);
      expect(html).toContain(`href="${FREEE_SUPPORT_URL}"`);
      expect(html).not.toContain("https://www.freee.co.jp/accounting/smb/support/");
      expect(html).not.toContain("<main");
      expect(html).not.toContain("31+");
    });

    it("has fixed offers from the canonical calculation and no invented setup price", () => {
      const offers = getLaborPriceStructuredData(locale).offers;
      expect(offers[10].priceSpecification.price).toBe(57200);
      expect(offers[29].priceSpecification.price).toBe(99000);
      expect(offers.filter(x => x.name.startsWith(LABOR_PLAN_COPY[locale].name))).toHaveLength(30);
      expect(offers.some(x => x.name.includes(LABOR_PLAN_COPY[locale].setup))).toBe(false);
    });
  });
}
