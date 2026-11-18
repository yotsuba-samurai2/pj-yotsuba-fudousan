import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { SCHOOL_EVENTS, SCHOOL_EVENT_COPY, upcomingSchoolEvents, jstDate, formatSchoolDate, schoolEventSources, SCHOOL_EVENT_SOURCES, schoolBriefingStartMs, verifiedSchoolEvent } from "../school-events";
import { listSchools } from "../school-district";
const now = new Date("2026-11-18T00:00:00Z");
describe("verified entry briefings only", () => {
  it("contains exactly one official briefing for every school", () => {
    expect(SCHOOL_EVENTS).toHaveLength(20);
    expect(new Set(SCHOOL_EVENTS.map(e => e.school))).toEqual(new Set(listSchools().map(s => s.slug)));
    expect(SCHOOL_EVENTS.every(e => e.kind === "admission" && e.status === "scheduled" && e.entryYear === 2027 && e.audience === "incoming-guardians")).toBe(true);
    expect(SCHOOL_EVENTS.map(e => [e.school, e.date, e.time])).toEqual([
      ["rekisen","2027-01-26","14:30"],["yanagicho","2027-02-09","14:15"],
      ["sasugaya","2027-02-13","14:00"],["hayashicho","2027-02-09","14:00"],
      ["meika","2027-02-04","15:00"],["aoyagi","2027-02-04","15:00"],
      ["sekiguchidaimachi","2027-02-01","15:00"],["kohinatadaimachi","2027-02-01","14:45"],
      ["kanatomi","2027-01-29","14:30"],["kubomachi","2027-02-09","15:00"],
      ["otsuka","2027-02-02","14:00"],["yushima","2027-02-09","14:20"],
      ["seishi","2027-01-27","14:00"],["nezu","2027-02-04","15:00"],
      ["sendagi","2027-01-27","15:00"],["shiomi","2027-01-25","15:00"],
      ["showa","2027-02-02","14:20"],["komamoto","2027-02-01","14:30"],
      ["kagomachi","2027-02-10","14:30"],["hongo","2027-02-01","14:00"],
    ]);
  });
  it("keeps reception separate from the verified start", () => {
    expect(SCHOOL_EVENTS.filter(e => e.receptionTime)).toHaveLength(12);
    const e = SCHOOL_EVENTS.find(e => e.school === "seishi")!;
    expect(e).toMatchObject({ time: "14:00", receptionTime: "13:30" });
    expect(upcomingSchoolEvents(new Date("2027-01-27T04:30:00Z"), e.school)).toEqual([e]);
    expect(upcomingSchoolEvents(new Date("2027-01-27T04:59:59.999Z"), e.school)).toEqual([e]);
    expect(upcomingSchoolEvents(new Date("2027-01-27T05:00:00Z"), e.school)).toEqual([]);
    expect(schoolBriefingStartMs(e)).toBe(Date.parse("2027-01-27T05:00:00Z"));
  });
  it("fails closed for unverified, malformed, altered or non-admission records", () => {
    const e = SCHOOL_EVENTS[0];
    for (const change of [
      {kind:"open"},{kind:"presentation"},{kind:"exhibition"},{kind:"unknown"},
      {status:"cancelled"},{status:"pending"},{status:"unknown"},{date:"2028-01-26"},
      {date:"2027-02-30"},{time:undefined},{time:"99:99"},{school:"unknown"},
      {entryYear:2028},{audience:"everyone"},{sourcePage:"https://example.com"},
      {sourcePdf:undefined},{checkedAt:undefined},{receptionTime:"13:00"},
      {privateNote:"not public"},{endDate:"2027-01-27"},
    ]) expect(upcomingSchoolEvents(now, undefined, [{...e,...change}])).toEqual([]);
    expect(upcomingSchoolEvents(now, undefined, [null, {}, "admission"])).toEqual([]);
    expect(verifiedSchoolEvent({...e, status:"pending"})).toBeUndefined();
    expect(schoolEventSources({...e,status:"pending"})).toBeUndefined();
  });
  it("deduplicates, filters by school, orders by start and never invents a new year", () => {
    expect(upcomingSchoolEvents(now, undefined, [SCHOOL_EVENTS[0], SCHOOL_EVENTS[0]])).toHaveLength(1);
    expect(upcomingSchoolEvents(now).slice(0,3).map(e=>e.school)).toEqual(["shiomi","rekisen","seishi"]);
    expect(upcomingSchoolEvents(now,"unknown")).toEqual([]);
    expect(upcomingSchoolEvents(new Date("2028-01-01"))).toEqual([]);
    expect(upcomingSchoolEvents(new Date("invalid"))).toEqual([]);
    expect(upcomingSchoolEvents(now,undefined,[])).toEqual([]);
  });
  it("retains explicit JST dates and official sources in all languages", () => {
    expect(jstDate(new Date("2027-02-02T15:00:00Z"))).toBe("2027-02-03");
    for (const locale of ["ja","en","zh-tw","zh"] as const) {
      expect(Object.keys(SCHOOL_EVENT_COPY[locale])).toEqual(Object.keys(SCHOOL_EVENT_COPY.ja));
      expect(formatSchoolDate(SCHOOL_EVENTS[0],locale)).toContain("2027");
      expect(SCHOOL_EVENT_COPY[locale].start).toBeTruthy();
      expect(SCHOOL_EVENT_COPY[locale].reception).toBeTruthy();
    }
    expect(schoolEventSources(SCHOOL_EVENTS[0])).toEqual({page:SCHOOL_EVENT_SOURCES.admission,pdf:SCHOOL_EVENT_SOURCES.admissionPdf});
  });
  it("ships no former activity payload or internal/booking assertions", () => {
    const source=readFileSync("src/lib/school-events.ts","utf8");
    expect(source).not.toMatch(/r8gyouzi|p002090|ACTIVITY_ROWS|OPEN_ROWS|展覧会|学習発表会|授業公開|openAudience|activityAudience/);
    expect(JSON.stringify(SCHOOL_EVENT_COPY)).not.toMatch(/未確認|unverified|予約不要|no booking|no reservation|內部|内部|承認/);
  });
});
