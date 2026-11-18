import { describe, expect, it } from "vitest";
import { SCHOOL_EVENTS, SCHOOL_EVENT_COPY, upcomingSchoolEvents, jstDate, formatSchoolDate, schoolEventSources, SCHOOL_EVENT_SOURCES } from "../school-events";
import { listSchools } from "../school-district";
describe("school calendar", () => {
  it("has exactly one verified 2027 entry briefing for each of all 20 schools", () => {
    const entry = SCHOOL_EVENTS.filter(e => e.kind === "admission");
    expect(entry).toHaveLength(20);
    expect(new Set(entry.map(e => e.school))).toEqual(new Set(listSchools().map(s => s.slug)));
    expect(entry.every(e => e.date.startsWith("2027-") && /^1[45]:[0-5][0-9]$/.test(e.time!))).toBe(true);
  });
  it("matches key official PDF rows", () => {
    expect(SCHOOL_EVENTS.find(e => e.id === "otsuka-admission-2027")).toMatchObject({ date: "2027-02-02", time: "14:00" });
    expect(SCHOOL_EVENTS.find(e => e.id === "kubomachi-admission-2027")).toMatchObject({ date: "2027-02-09", time: "15:00" });
  });
  it("changes dates at JST midnight, not UTC midnight", () => {
    expect(jstDate(new Date("2027-02-02T14:59:59Z"))).toBe("2027-02-02");
    expect(jstDate(new Date("2027-02-02T15:00:00Z"))).toBe("2027-02-03");
    expect(upcomingSchoolEvents(new Date("2027-02-02T14:59:59Z"), "otsuka")).toHaveLength(1);
    expect(upcomingSchoolEvents(new Date("2027-02-02T15:00:00Z"), "otsuka")).toHaveLength(0);
  });
  it("excludes past, cancelled and pending dates and sorts", () => {
    expect(upcomingSchoolEvents(new Date("2028-01-01T00:00:00Z"))).toEqual([]);
    const e = SCHOOL_EVENTS[0];
    expect(upcomingSchoolEvents(new Date("2026-11-18"), undefined, [{ ...e, status: "cancelled" }, { ...e, status: "pending" }])).toEqual([]);
    const events = upcomingSchoolEvents(new Date("2026-11-18"));
    expect(events[0].date).toBe("2026-11-19");
    expect(new Set(events.map(e => e.id)).size).toBe(events.length);
  });
  it("keeps all four locales complete and uses Japan time", () => {
    for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
      expect(Object.keys(SCHOOL_EVENT_COPY[locale])).toEqual(Object.keys(SCHOOL_EVENT_COPY.ja));
      expect(formatSchoolDate(SCHOOL_EVENTS[0], locale)).toContain("2027");
    }
  });
});

describe("multi-day school activities", () => {
  it("retains all 10 existing open-class dates and adds only 3 distinct activities", () => {
    expect(SCHOOL_EVENTS.filter(e => e.kind === "open")).toHaveLength(10);
    const activities = SCHOOL_EVENTS.filter(e => e.kind === "presentation" || e.kind === "exhibition");
    expect(activities.map(e => [e.school, e.kind, e.date, e.endDate])).toEqual([
      ["sekiguchidaimachi", "presentation", "2026-11-19", "2026-11-21"],
      ["kohinatadaimachi", "exhibition", "2026-11-27", "2026-11-28"],
      ["kubomachi", "exhibition", "2026-12-04", "2026-12-05"],
    ]);
    expect(activities.every(e => e.time === undefined)).toBe(true);
  });
  it("keeps an ongoing event through its final JST day, then removes it", () => {
    const event = SCHOOL_EVENTS.find(e => e.kind === "presentation")!;
    for (const now of ["2026-11-18T00:00:00Z", "2026-11-20T00:00:00Z", "2026-11-21T14:59:59.999Z"]) {
      expect(upcomingSchoolEvents(new Date(now), event.school, [event])).toEqual([event]);
    }
    expect(upcomingSchoolEvents(new Date("2026-11-21T15:00:00Z"), event.school, [event])).toEqual([]);
    expect(upcomingSchoolEvents(new Date("2026-11-20T00:00:00Z"), "kubomachi", [event])).toEqual([]);
    expect(upcomingSchoolEvents(new Date("2026-11-20T00:00:00Z"), undefined, [{ ...event, status: "cancelled" }, { ...event, status: "pending" }])).toEqual([]);
  });
  it("orders current and future activities before later open days and entry briefings", () => {
    expect(upcomingSchoolEvents(new Date("2026-11-18T03:00:00Z")).slice(0, 3).map(e => e.school)).toEqual(["sekiguchidaimachi", "kohinatadaimachi", "kubomachi"]);
    expect(upcomingSchoolEvents(new Date("2026-11-20T03:00:00Z"))[0].kind).toBe("presentation");
    expect(upcomingSchoolEvents(new Date("2026-11-22T03:00:00Z"))[0].school).toBe("kohinatadaimachi");
  });
  it("uses the revised annual PDF, distinct from admission sources, and localizes ranges", () => {
    const event = SCHOOL_EVENTS.find(e => e.kind === "presentation")!;
    expect(schoolEventSources(event)).toEqual({ page: SCHOOL_EVENT_SOURCES.open, pdf: "https://www.city.bunkyo.lg.jp/documents/2068/r8gyouzi_shou-2.pdf" });
    expect(schoolEventSources(SCHOOL_EVENTS.find(e => e.kind === "admission")!).pdf).toBe(SCHOOL_EVENT_SOURCES.admissionPdf);
    for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
      expect(formatSchoolDate(event, locale)).toContain("19");
      expect(formatSchoolDate(event, locale)).toContain("21");
      expect(SCHOOL_EVENT_COPY[locale].presentation).not.toBe(SCHOOL_EVENT_COPY[locale].open);
      expect(SCHOOL_EVENT_COPY[locale].activityAudience).toBeTruthy();
    }
  });
});
