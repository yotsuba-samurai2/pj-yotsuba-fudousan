import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeSchoolFinder, homeSchoolFinderRoutes } from "@/components/gakku/HomeSchoolFinder";
import { listSchools, DISTRICT_SOURCE } from "@/lib/school-district";
import { isFeaturedSchoolSlug } from "@/lib/gakku";
import { addLocalePrefix } from "@/lib/locale";
import { languages } from "@/config/languages";
import { SCHOOL_CALENDAR_PATH } from "@/lib/school-events";
import { schoolRentalPath } from "@/lib/rental-school-district";
import { schoolSalePath } from "@/lib/sale-school-district";

describe("home school finder", () => {
  it.each(languages)("SSR includes 20 canonical schools and usable default links in $code", ({code}) => {
    const html = renderToStaticMarkup(<HomeSchoolFinder locale={code} />);
    expect((html.match(/<option /g) ?? [])).toHaveLength(20);
    for (const school of listSchools()) expect(html).toContain(school.formalName);
    expect(html).toMatch(/value="kubomachi" selected=""/);
    for (const path of ["/gakku/kubomachi/rentals", "/gakku/kubomachi/sales", "/gakku/kubomachi", "/gakku/calendar#kubomachi", "/gakku"])
      expect(html).toContain(`href="${addLocalePrefix(path, code)}"`);
    expect(html).toContain(DISTRICT_SOURCE.url);
    expect(html).toContain('aria-live="polite"');
    const id = html.match(/<select id="([^"']+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(`for="${id}"`);
    expect(html).not.toContain("0.33");
    const scope = {
      ja: ["入学予定児の保護者向け新入学説明会", "この学校の新入学説明会"],
      en: ["parents and guardians of incoming pupils", "entry briefing"],
      "zh-tw": ["預計入學兒童家長", "新生入學說明會"],
      zh: ["拟入学儿童家长", "新生入学说明会"],
    };
    for (const text of scope[code]) expect(html).toContain(text);
    expect(html).not.toMatch(/学校の予定|学校行事|學校日程|学校日程|school dates|予約不要|no reservation required/);

  });
  for (const {code} of languages) for (const school of listSchools()) {
    it(`${code}: selection ${school.slug} updates all four canonical routes`, () => {
      const routes = homeSchoolFinderRoutes(school.slug, code);
      expect(routes.school).toBe(school);
      expect(routes.rent).toBe(addLocalePrefix(schoolRentalPath(school.slug), code));
      expect(routes.sale).toBe(addLocalePrefix(schoolSalePath(school.slug), code));
      expect(routes.calendar).toBe(addLocalePrefix(SCHOOL_CALENDAR_PATH, code) + `#${school.slug}`);
      expect(routes.detail).toBe(isFeaturedSchoolSlug(school.slug));
      expect(routes.zone).toBe(addLocalePrefix(isFeaturedSchoolSlug(school.slug) ? `/gakku/${school.slug}` : "/gakku", code));
    });
  }
  it("unknown inputs cannot become URLs", () => {
    for (const value of ["", "../private", "https://example.org", "kubomachi?x=1", "SEISHI"])
      expect(homeSchoolFinderRoutes(value, "ja")).toEqual(homeSchoolFinderRoutes("kubomachi", "ja"));
  });
  it("each rendered instance has distinct accessible IDs", () => {
    const html = renderToStaticMarkup(<><HomeSchoolFinder locale="ja" /><HomeSchoolFinder locale="en" /></>);
    const ids = [...html.matchAll(/<select id="([^"']+)"/g)].map(m => m[1]);
    expect(new Set(ids).size).toBe(2);
  });
});
