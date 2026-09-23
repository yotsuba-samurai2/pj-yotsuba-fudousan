export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { getPublishedProperties } from "@/lib/properties";
import { findSchoolBySlug } from "@/lib/school-district";
import { schoolRentalPath, schoolRentalTitle, SCHOOL_RENTAL_COPY } from "@/lib/rental-school-district";
import { buildPageMetadata } from "@/lib/seo";
import { SchoolRentalListings } from "@/components/gakku/SchoolRentalPages";

type Props = { params: Promise<{ school: string }> };
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = findSchoolBySlug((await params).school);
  if (!school) notFound();
  const locale = await getRequestLocale();
  return buildPageMetadata({ businessKey: "realestate", title: schoolRentalTitle(school, locale), description: SCHOOL_RENTAL_COPY[locale].lead, path: schoolRentalPath(school.slug), locale, availableLocales: ["ja", "en", "zh-tw", "zh"] });
}

export default async function Page({ params }: Props) {
  const school = findSchoolBySlug((await params).school);
  if (!school) notFound();
  const locale = await getRequestLocale();
  return <SchoolRentalListings school={school} properties={await getPublishedProperties(locale)} locale={locale} />;
}
