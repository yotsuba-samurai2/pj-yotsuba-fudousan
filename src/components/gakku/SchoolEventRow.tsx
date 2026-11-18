import type { LangCode } from "@/config/languages";
import { SCHOOL_EVENT_COPY, schoolEventSources, formatSchoolDate, schoolEventName, type SchoolEvent } from "@/lib/school-events";

export function SchoolEventRow({ event, locale }: { event: SchoolEvent; locale: LangCode }) {
  const c = SCHOOL_EVENT_COPY[locale];
  const source = schoolEventSources(event);
  return <li className="border-b border-border py-4 last:border-0">
    <p className="font-semibold text-ink">{schoolEventName(event)}</p>
    <p className="mt-1 text-sm">{c[event.kind]} · <time dateTime={event.time ? `${event.date}T${event.time}:00+09:00` : event.date}>{formatSchoolDate(event, locale)}{event.time ? ` ${event.time} JST` : ""}</time></p>
    <p className="mt-1 text-sm text-text-muted">{event.kind === "admission" ? c.audience : event.kind === "open" ? c.openAudience : c.activityAudience}</p>
    <p className="mt-2 text-xs text-text-muted">{c.checked}: <time dateTime={event.checkedAt}>{event.checkedAt}</time> · <a className="underline" href={source.page} target="_blank" rel="noopener noreferrer">{c.source}</a> · <a className="underline" href={source.pdf} target="_blank" rel="noopener noreferrer">{c.pdf}</a></p>
  </li>;
}
