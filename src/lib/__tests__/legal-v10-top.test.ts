import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect, vi, afterEach } from "vitest";
import type { LangCode } from "@/config/languages";
import type { CrossLink } from "@/lib/cross-links";
import { LEGAL_TOP_V10_COPY } from "@/lib/legal/top-copy";
const state = vi.hoisted(() => ({ locale: "ja" as LangCode }));
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => state.locale }));
vi.mock("@/components/shared/CtaBand", () => ({ CtaBand: () => null }));
vi.mock("@/components/shared/CrossLinkBanner", () => ({
  CrossLinkBanner: ({link}: {link: CrossLink}) => createElement("aside", {}, link.targets.map(t => createElement("a", { key:t.href, href:(state.locale === "ja" ? "" : `/${state.locale}`) + t.href }, t.anchorI18n?.[state.locale] ?? t.anchor))),
}));
afterEach(() => vi.unstubAllEnvs());

for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
  for (const launched of [false, true]) {
    describe(`V10 legal top (${locale}, labor launched: ${launched})`, () => {
      async function page() {
        state.locale = locale;
        vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED", String(launched));
        vi.resetModules();
        return import("@/app/[locale]/(legal)/legal/page");
      }
      it("prioritizes residence status, hiring and China, preserving GH as a distinct industry", async () => {
        const mod = await page();
        const html = renderToStaticMarkup(await mod.default());
        const c = LEGAL_TOP_V10_COPY[locale];
        expect(html.match(/<h1\b/g)).toHaveLength(1);
        expect(html).toContain(launched ? c.hero : c.beforeLaunchHero);
        expect(html).toContain("四葉行政書士事務所");
        const titles = [c.visaTitle,c.foreignTitle,c.chineseTitle,c.companyTitle,c.ghTitle,c.filingTitle]
          .map(title => renderToStaticMarkup(createElement("span",null,title)).replace(/^<span>|<\/span>$/g,""));
        for (let i=1;i<titles.length;i++) expect(html.indexOf(titles[i])).toBeGreaterThan(html.indexOf(titles[i-1]));
        expect(html).toContain(c.industry);
        expect(html).toContain(c.consistency);
        expect(html).toContain(c.disclaimer);
        const prefix = locale === "ja" ? "" : `/${locale}`;
        for (const path of ["visa","gaikokujin-shain","company","shogai-fukushi","inheritance","subsidy"]) expect(html).toContain(`href="${prefix}/legal/services/${path}"`);
        expect(html).toContain(`href="${prefix}/legal/contact"`);
      });
      it("gates labor claims, links and FAQ answers with the launch state", async () => {
        const mod = await page();
        const html = renderToStaticMarkup(await mod.default());
        const c = LEGAL_TOP_V10_COPY[locale];
        const prefix = locale === "ja" ? "" : `/${locale}`;
        if (launched) {
          expect(html).toContain(c.dual);
          expect(html).toContain(`href="${prefix}/labor"`);
          expect(html).toContain(`href="${prefix}/labor/services/kaigo-roumu"`);
          expect(html).not.toContain(c.unavailable);
        } else {
          expect(html).not.toMatch(/href="(?:\/en|\/zh-tw|\/zh)?\/labor(?:\/|")/);
          expect(html).not.toContain(c.dual);
          expect(html).not.toContain(c.ghLabor);
          expect(html).toContain(c.unavailable);
        }
        const scripts = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(x => JSON.parse(x[1]));
        const faq = scripts.find(x => x["@type"] === "FAQPage");
        expect(faq.mainEntity).toHaveLength(5);
        expect(faq.mainEntity[4].acceptedAnswer.text).toBe(launched ? c.labor : c.unavailable);
      });
      it("keeps legal SEO metadata and localized canonical/alternates", async () => {
        const mod = await page();
        const metadata = await mod.generateMetadata();
        const prefix = locale === "ja" ? "" : `/${locale}`;
        expect(metadata.alternates?.canonical).toBe(`https://luck428.com${prefix}/legal`);
        expect(Object.keys(metadata.alternates?.languages ?? {})).toHaveLength(5);
        expect(metadata.title).toEqual({absolute:LEGAL_TOP_V10_COPY[locale].title});
        expect(metadata.description).toBe(LEGAL_TOP_V10_COPY[locale].description);
      });
    });
  }
  it(`renders real independent engagement notes and localized labor destinations (${locale})`, async () => {
    state.locale=locale;
    const { getCrossLinks, INDEPENDENT_NOTES_TRIPLE } = await import("@/lib/cross-links");
    const { CrossLinkBanner } = await vi.importActual<typeof import("@/components/shared/CrossLinkBanner")>("@/components/shared/CrossLinkBanner");
    expect(getCrossLinks("/legal",false)).toEqual([]);
    const links=getCrossLinks(`/${locale}/legal`,true);
    expect(links.map(x=>x.id)).toEqual(["C17","C18"]);
    for (const link of links) {
      const html=renderToStaticMarkup(await CrossLinkBanner({link}));
      expect(html).toContain(INDEPENDENT_NOTES_TRIPLE[locale]);
      expect(html).toContain(`${locale === "ja" ? "" : `/${locale}`}${link.targets[0].href}`);
      expect(html).toContain(link.targets[0].anchorI18n?.[locale] ?? link.targets[0].anchor);
    }
  });
}
