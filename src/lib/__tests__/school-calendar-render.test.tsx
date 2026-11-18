import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
vi.mock("next/server", () => ({ connection: async () => undefined }));
import { SchoolEventsTeaser, SchoolCalendarLink } from "../../components/gakku/SchoolEventsTeaser";
import { SCHOOL_EVENT_COPY } from "../school-events";
import { listSchools } from "../school-district";

describe("school calendar server output", () => {
  for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
    it(`${locale}: server text, official sources and localized links`, async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-11-18T03:00:00Z"));
      try {
        const html = renderToStaticMarkup(await SchoolEventsTeaser({ locale, school: "otsuka" }));
        const path = locale === "ja" ? "/gakku/calendar" : `/${locale}/gakku/calendar`;
        expect(html).toContain(SCHOOL_EVENT_COPY[locale].title);
        expect(html).toContain(`${path}#otsuka`);
        expect(html).toContain("2027-02-02T14:00:00+09:00");
        expect(html).toContain("https://www.city.bunkyo.lg.jp/");
        expect(html).toContain("2026-11-18");
        expect(html).not.toContain('"@type":"Event"');
        for (const school of listSchools()) {
          const link = renderToStaticMarkup(<SchoolCalendarLink locale={locale} school={school.slug} />);
          expect(link).toContain(`${path}#${school.slug}`);
          expect(link).toContain(SCHOOL_EVENT_COPY[locale].title);
        }
      } finally { vi.useRealTimers(); }
    });
  }
  it("registers a calendar sitemap entry and four-locale metadata", () => {
    expect(readFileSync("src/app/sitemap.ts", "utf8")).toContain('path: "/gakku/calendar"');
    const page = readFileSync("src/app/[locale]/(realestate)/gakku/calendar/page.tsx", "utf8");
    expect(page).toContain('availableLocales: ["ja", "en", "zh-tw", "zh"]');
    expect(page).not.toContain("await connection()");
    expect(page).toContain("export const revalidate = 300");
    expect(page).toContain("<SchoolEventsList");
  });
});

describe("admission-only public school surfaces", () => {
  for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
    it(`${locale}: only incoming-pupil briefings appear in the initial teaser HTML`, async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-11-18T03:00:00Z"));
      try {
        const c = SCHOOL_EVENT_COPY[locale];
        const html = renderToStaticMarkup(await SchoolEventsTeaser({ locale }));
        expect(html).toContain(c.admission);
        expect(html).toContain(c.audience);
        expect(html).toContain("reiwa9nennsetumeikai.pdf");
        expect(html).not.toMatch(/r8gyouzi|p002090|2026-11-19|2026-11-27|2026-12-04/);
        expect(html).not.toMatch(/学習発表会|展覧会|授業公開|一般来校者|未確認|學校活動|学校活动|unverified|Student exhibition|learning showcase/);
        expect(html).not.toContain('"@type":"Event"');
      } finally { vi.useRealTimers(); }
    });
  }
  it("uses the same admission copy for calendar metadata, page, teaser and all reverse links", () => {
    const page = readFileSync("src/app/[locale]/(realestate)/gakku/calendar/page.tsx", "utf8");
    expect(page).toContain("title: c.title, description: c.lead");
    expect(page).toContain("{ name: c.title }");
    expect(page).toContain("{c.lead}");
    expect(page).toContain("{c.note}");
    const surfaces = [
      ["src/app/[locale]/(realestate)/HomePageContent.tsx", "SchoolEventsTeaser"],
      ["src/app/[locale]/(realestate)/gakku/page.tsx", "SchoolEventsTeaser"],
      ["src/components/gakku/SchoolDistrictPage.tsx", "SchoolEventsTeaser"],
      ["src/components/gakku/SchoolRentalPages.tsx", "SchoolCalendarLink"],
      ["src/components/gakku/SchoolSalePages.tsx", "SchoolCalendarLink"],
    ];
    for (const [path, component] of surfaces) expect(readFileSync(path, "utf8")).toContain(`<${component}`);
  });
});
