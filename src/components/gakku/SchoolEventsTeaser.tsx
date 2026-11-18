import Link from "next/link";
import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";
import { SCHOOL_CALENDAR_PATH, SCHOOL_EVENT_COPY, SCHOOL_EVENTS_CHECKED } from "@/lib/school-events";
import { SchoolEventsList } from "./SchoolEventsList";
export { SchoolEventRow } from "./SchoolEventRow";

export async function SchoolEventsTeaser({ locale, school }: { locale: LangCode; school?: string }) {
  const c = SCHOOL_EVENT_COPY[locale];
  const initialNow = new Date().toISOString();
  return <section className="my-8 rounded-2xl border border-border bg-surface-dim p-5 sm:p-7" aria-label={c.title}>
    <h2 className="font-serif text-xl font-semibold text-ink">{c.title}</h2>
    <p className="mt-2 text-sm leading-relaxed text-text-muted">{c.lead}</p>
    <SchoolEventsList locale={locale} school={school} initialNow={initialNow} limit={3} />
    <p className="mt-3 text-xs text-text-muted">{c.checked}: {SCHOOL_EVENTS_CHECKED} · {c.note}</p>
    <Link className="mt-4 inline-block font-semibold text-primary underline" href={addLocalePrefix(SCHOOL_CALENDAR_PATH, locale) + (school ? `#${school}` : "")}>{c.all} →</Link>
  </section>;
}

/** Lightweight reverse link for all 20 school rental/sale pages. */
export function SchoolCalendarLink({ locale, school }: { locale: LangCode; school: string }) {
  return <Link className="mt-4 block text-sm font-semibold text-primary underline" href={addLocalePrefix(SCHOOL_CALENDAR_PATH, locale) + `#${school}`}>{SCHOOL_EVENT_COPY[locale].title} →</Link>;
}
