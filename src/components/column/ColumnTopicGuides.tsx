import Link from "next/link";
import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";
import { COLUMN_TOPICS, columnTopicCopy, columnTopicLinks, type ColumnTopic } from "@/lib/column-topic-routes";

/** Plain HTML links. No database query, event subscription or client-side filter required. */
export function ColumnTopicGuides({ locale, topics = COLUMN_TOPICS, related = false }: {
  locale: LangCode;
  topics?: readonly ColumnTopic[];
  related?: boolean;
}) {
  if (!topics.length) return null;
  const c = columnTopicCopy(locale);
  const heading = related ? c.related : c.heading;
  return <nav aria-label={heading} className="mx-auto my-8 max-w-4xl rounded-xl border border-border bg-primary-tint p-5 sm:p-6">
    <h2 className="font-serif text-lg font-semibold text-ink">{heading}</h2>
    {!related && <p className="mt-2 text-sm leading-relaxed text-text-muted">{c.intro}</p>}
    <ul className="mt-3 flex flex-wrap gap-3">
      {columnTopicLinks(topics, locale).map(({ href, label }) => <li key={href}>
        <Link href={addLocalePrefix(href, locale)} className="inline-flex min-h-11 items-center rounded-lg border border-primary/20 bg-surface px-4 py-2 text-sm font-medium text-primary-dark underline underline-offset-4 hover:border-primary">{label}</Link>
      </li>)}
    </ul>
  </nav>;
}
