import Link from "next/link";
import type { LangCode } from "@/config/languages";
import type { PublicProperty } from "@/lib/property-shared";
import type { SchoolInfo } from "@/lib/school-district";
import { listSchools } from "@/lib/school-district";
import { isFeaturedSchoolSlug } from "@/lib/gakku";
import { addLocalePrefix } from "@/lib/locale";
import { getLocalizedProperty } from "@/lib/property-shared";
import { canonicalUrl } from "@/lib/seo";
import { buildPropertyItemListJsonLd } from "@/lib/property-jsonld";
import { groupSchoolRentals, SCHOOL_RENTAL_COPY, SCHOOL_RENTAL_INDEX_PATH, schoolRentalPath, schoolRentalTitle } from "@/lib/rental-school-district";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PropertyCard } from "@/components/bukken/PropertyCard";
import { DistrictSourceNote } from "./RentalSchoolDistrict";
import { RentalComparison } from "./RentalComparison";
import type { PublicRentalSummary } from "@/lib/school-rental-feed";

export function SchoolRentalIndex({ properties, locale, summaries = [] }: { properties: PublicProperty[]; locale: LangCode; summaries?: PublicRentalSummary[] }) {
  const c = SCHOOL_RENTAL_COPY[locale];
  const groups = groupSchoolRentals(properties, locale);
  return <>
    <Breadcrumb items={[{ name: c.guide, href: "/gakku" }, { name: c.indexTitle }]} />
    <article className="mx-auto max-w-4xl px-4 pb-16">
      <header className="rounded-2xl border border-primary/20 bg-primary-tint p-5 sm:p-8">
        <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.indexTitle}</h1>
        <p className="mt-4 leading-relaxed text-text">{c.lead}</p>
      </header>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {listSchools().map(school => <li key={school.slug}>
          <Link href={addLocalePrefix(schoolRentalPath(school.slug), locale)} className="flex h-full items-center justify-between gap-3 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary">
            <span className="font-semibold text-ink">{school.formalName}</span>
            <span className="shrink-0 rounded-full bg-primary-tint px-3 py-1 text-sm font-semibold text-primary">{c.count.replace("{count}", String((groups.get(school.slug)?.length ?? 0) + summaries.filter(r => r.schoolSlug === school.slug).length))} →</span>
          </Link>
        </li>)}
      </ul>
      <DistrictSourceNote locale={locale} />
      <RentalComparison rows={summaries} locale={locale} />
      <Link href={addLocalePrefix("/gakku", locale)} className="mt-6 inline-block text-sm text-primary underline">{c.guide}</Link>
    </article>
  </>;
}

export function SchoolRentalListings({ school, properties, locale, summaries = [] }: { school: SchoolInfo; properties: PublicProperty[]; locale: LangCode; summaries?: PublicRentalSummary[] }) {
  const c = SCHOOL_RENTAL_COPY[locale];
  const listings = groupSchoolRentals(properties, locale).get(school.slug) ?? [];
  const title = schoolRentalTitle(school, locale);
  const schoolSummaries = summaries.filter(r => r.schoolSlug === school.slug);
  const path = schoolRentalPath(school.slug);
  return <>
    <JsonLd data={buildPropertyItemListJsonLd(listings.map(p => ({ name: getLocalizedProperty(p, locale).title, url: canonicalUrl("realestate", `/bukken/${p.slug}`, locale) })), canonicalUrl("realestate", path, locale), locale)} />
    <Breadcrumb items={[{ name: c.guide, href: "/gakku" }, { name: c.indexTitle, href: SCHOOL_RENTAL_INDEX_PATH }, { name: title }]} />
    <article className="mx-auto max-w-3xl px-4 pb-16">
      <header className="rounded-2xl border border-primary/20 bg-primary-tint p-5 sm:p-8">
        <p className="text-sm font-semibold text-primary">{c.label}</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
        <p className="mt-3 text-lg font-semibold text-primary">{c.count.replace("{count}", String(listings.length + schoolSummaries.length))}</p>
        <DistrictSourceNote locale={locale} />
      </header>
      {listings.length ? <ul className="mt-6 space-y-3">{listings.map(p => <li key={p.slug}><PropertyCard p={p} locale={locale} /></li>)}</ul>
        : !schoolSummaries.length && <p className="mt-6 rounded-xl border border-border p-6 leading-relaxed text-text">{c.empty}</p>}
      <RentalComparison rows={schoolSummaries} locale={locale} />
      <Link href={addLocalePrefix(`/contact?intent=gakku-${school.slug}-rental`, locale)} className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90">{c.request}</Link>
      <nav aria-label={c.back} className="mt-6 flex flex-wrap gap-5 text-sm text-primary underline">
        <Link href={addLocalePrefix(SCHOOL_RENTAL_INDEX_PATH, locale)}>{c.back}</Link>
        <Link href={addLocalePrefix(isFeaturedSchoolSlug(school.slug) ? `/gakku/${school.slug}` : "/gakku", locale)}>{c.guide}</Link>
      </nav>
    </article>
  </>;
}
