import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
vi.mock("next/server", () => ({ connection: async () => undefined }));
import { SchoolEventsTeaser, SchoolCalendarLink, SchoolEventRow } from "../../components/gakku/SchoolEventsTeaser";
import { SCHOOL_EVENT_COPY, SCHOOL_EVENTS } from "../school-events";

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
        expect(renderToStaticMarkup(<SchoolCalendarLink locale={locale} school="otsuka" />)).toContain(`${path}#otsuka`);
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

describe("school activities in server-rendered native UI", () => {
  for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
    it(`${locale}: renders both range endpoints, unknown attendance, latest source and natural order`, async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-11-18T03:00:00Z"));
      try {
        const c = SCHOOL_EVENT_COPY[locale];
        const html = renderToStaticMarkup(await SchoolEventsTeaser({ locale }));
        expect(html).toContain(c.presentation);
        expect(html).toContain(c.exhibition);
        expect(html).toContain(c.activityAudience);
        expect(html).toContain("r8gyouzi_shou-2.pdf");
        expect(html).not.toContain("r8gyouzi_shou.pdf");
        expect(html).not.toContain(c.open + " ·");
        expect(html).not.toContain(c.audience);
        expect(html.indexOf("関口台町小学校")).toBeLessThan(html.indexOf("小日向台町小学校"));
        expect(html.indexOf("小日向台町小学校")).toBeLessThan(html.indexOf("窪町小学校"));
        const event = SCHOOL_EVENTS.find(e => e.kind === "presentation")!;
        const row = renderToStaticMarkup(<SchoolEventRow event={event} locale={locale} />);
        expect(row).toContain("19"); expect(row).toContain("21");
        expect(row).not.toContain("00:00");
        vi.setSystemTime(new Date("2026-11-21T15:00:00Z"));
        expect(renderToStaticMarkup(await SchoolEventsTeaser({ locale }))).not.toContain(c.presentation);
      } finally { vi.useRealTimers(); }
    });
  }
});
