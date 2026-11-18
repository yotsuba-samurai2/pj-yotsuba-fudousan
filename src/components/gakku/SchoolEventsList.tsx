"use client";

import { useEffect, useState } from "react";
import type { LangCode } from "@/config/languages";
import { SCHOOL_EVENT_COPY, schoolBriefingStartMs, upcomingSchoolEvents } from "@/lib/school-events";
import { SchoolEventRow } from "./SchoolEventRow";

/** SSR snapshot is also the hydration snapshot. Recheck locally after mount,
 * at a confirmed briefing start or JST midnight, and when a sleeping tab returns.
 * No network requests, browser storage or user data are involved. */
export function SchoolEventsList({ locale, school, initialNow, limit }: {
  locale: LangCode; school?: string; initialNow: string; limit?: number;
}) {
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      const current = new Date();
      setNow(current.toISOString());
      const day = 86_400_000;
      const toMidnight = day - ((current.getTime() + 9 * 3_600_000) % day);
      const [first] = upcomingSchoolEvents(current, school);
      const toStart = first ? schoolBriefingStartMs(first) - current.getTime() : Infinity;
      timer = setTimeout(refresh, Math.min(toMidnight, toStart) + 25);
    };
    refresh();
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [school]);
  const events = upcomingSchoolEvents(new Date(now), school).slice(0, limit);
  return events.length
    ? <ul>{events.map(event => <SchoolEventRow event={event} locale={locale} key={event.id} />)}</ul>
    : <p className="my-4 text-sm">{SCHOOL_EVENT_COPY[locale].empty}</p>;
}
