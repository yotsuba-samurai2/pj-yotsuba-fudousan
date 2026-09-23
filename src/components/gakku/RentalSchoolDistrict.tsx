import Link from "next/link";
import type { LangCode } from "@/config/languages";
import type { PublicProperty } from "@/lib/property-shared";
import { DISTRICT_SOURCE } from "@/lib/school-district";
import { gakkuCopy } from "@/lib/gakku";
import { addLocalePrefix } from "@/lib/locale";
import { rentalSchoolDistrict, schoolRentalPath, SCHOOL_RENTAL_COPY } from "@/lib/rental-school-district";

export function DistrictSourceNote({ locale }: { locale: LangCode }) {
  const c = SCHOOL_RENTAL_COPY[locale];
  return <p className="mt-3 text-xs leading-relaxed text-text-muted">
    <a href={DISTRICT_SOURCE.url} className="underline" target="_blank" rel="noopener noreferrer">{c.source}</a>
    {` · ${c.updated} ${DISTRICT_SOURCE.updatedAt} · ${c.checked} ${DISTRICT_SOURCE.fetchedAt}`}<br />{c.note}
  </p>;
}

/** A span, not a nested link, so cards can keep one accessible click target. */
export function SchoolDistrictTag({ property, locale }: { property: Pick<PublicProperty, "dealType" | "locationText">; locale: LangCode }) {
  const district = rentalSchoolDistrict(property);
  if (!district) return null;
  const c = SCHOOL_RENTAL_COPY[locale];
  return <span className="mt-2 inline-flex rounded-md border border-primary/25 bg-primary-tint px-2.5 py-1 text-xs font-semibold text-primary">
    {district.status === "determined" ? `${c.label}：${district.school.formalName.replace(/^文京区立/, "")}` : c.pending}
  </span>;
}

export function PropertySchoolDistrict({ property, locale }: { property: PublicProperty; locale: LangCode }) {
  const district = rentalSchoolDistrict(property);
  if (!district) return null;
  const c = SCHOOL_RENTAL_COPY[locale];
  return <section aria-label={c.label} className="mt-5 rounded-xl border-2 border-primary/25 bg-primary-tint p-4 sm:p-5">
    <p className="text-xs font-semibold text-primary">{c.label}</p>
    <h2 className="mt-1 text-lg font-bold text-ink">{district.status === "determined" ? district.school.formalName : c.pending}</h2>
    {district.status === "determined" ? <Link href={addLocalePrefix(schoolRentalPath(district.school.slug), locale)} className="mt-3 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">{c.view} →</Link>
      : <p className="mt-2 text-sm leading-relaxed text-text">{c.pendingNote} <Link className="underline" href={addLocalePrefix("/contact?intent=gakku", locale)}>{gakkuCopy(locale).school.noticeH2}</Link></p>}
    <DistrictSourceNote locale={locale} />
  </section>;
}
