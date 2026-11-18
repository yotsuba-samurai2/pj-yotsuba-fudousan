import type { Metadata } from "next";
import Link from "next/link";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { buildPageMetadata } from "@/lib/seo";
import { addLocalePrefix } from "@/lib/locale";
import { listSchools } from "@/lib/school-district";
import { schoolRentalPath } from "@/lib/rental-school-district";
import { schoolSalePath } from "@/lib/sale-school-district";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { SchoolEventsList } from "@/components/gakku/SchoolEventsList";
import { SCHOOL_CALENDAR_PATH, SCHOOL_EVENTS_CHECKED, SCHOOL_EVENT_COPY } from "@/lib/school-events";

// Refresh crawlable server HTML without making the shared layout dynamic.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale(); const c = SCHOOL_EVENT_COPY[locale];
  return buildPageMetadata({ businessKey: "realestate", path: SCHOOL_CALENDAR_PATH, title: c.title, description: c.lead, locale, availableLocales: ["ja", "en", "zh-tw", "zh"] });
}
export default async function SchoolCalendarPage() {
  const locale = await getRequestLocale(); const c = SCHOOL_EVENT_COPY[locale];
  const initialNow = new Date().toISOString();
  return <>
    <Breadcrumb items={[{ name: c.home, href: "/" }, { name: c.overview, href: "/gakku" }, { name: c.title }]} />
    <article className="mx-auto max-w-4xl px-4 pb-16">
      <h1 className="font-serif text-3xl font-semibold text-ink">{c.title}</h1>
      <p className="mt-4 leading-relaxed">{c.lead}</p>
      <p className="mt-4 rounded-xl bg-surface-dim p-4 text-sm leading-relaxed">{c.note}</p>
      <p className="mt-3 text-xs text-text-muted">{c.checked}: <time dateTime={SCHOOL_EVENTS_CHECKED}>{SCHOOL_EVENTS_CHECKED}</time> · {c.timezone}</p>
      <nav aria-label={c.heading} className="mt-6 flex flex-wrap gap-2">{listSchools().map(s => <a className="rounded-full border border-border px-3 py-2 text-sm underline" href={`#${s.slug}`} key={s.slug}>{s.name}</a>)}</nav>
      {listSchools().map(s => {
        return <section className="mt-8 scroll-mt-24 rounded-xl border border-border p-5" id={s.slug} key={s.slug}>
          <h2 className="font-serif text-xl font-semibold text-ink">{s.formalName}</h2>
          <SchoolEventsList locale={locale} school={s.slug} initialNow={initialNow} />
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-primary">
            <Link href={addLocalePrefix(schoolRentalPath(s.slug), locale)} className="underline">{c.rent} →</Link>
            <Link href={addLocalePrefix(schoolSalePath(s.slug), locale)} className="underline">{c.sale} →</Link>
            {["seishi", "showa", "sendagi", "kubomachi"].includes(s.slug) && <Link href={addLocalePrefix(`/gakku/${s.slug}`, locale)} className="underline">{c.district} →</Link>}
          </div>
        </section>;
      })}
      <section className="mt-10 text-sm leading-relaxed"><h2 className="text-lg font-semibold">{c.sources}</h2><p className="mt-3">{c.update}</p></section>
      <Link href={addLocalePrefix("/line", locale)} className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-white">{c.consult} →</Link>
    </article>
  </>;
}
