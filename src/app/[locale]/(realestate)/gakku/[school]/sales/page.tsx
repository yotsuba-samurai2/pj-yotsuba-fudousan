export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { getPublishedProperties } from "@/lib/properties";
import { findSchoolBySlug } from "@/lib/school-district";
import { buildPageMetadata } from "@/lib/seo";
import { SCHOOL_SALE_COPY, schoolSalePath, schoolSaleTitle } from "@/lib/sale-school-district";
import { SchoolSaleListings } from "@/components/gakku/SchoolSalePages";
type Props = { params: Promise<{ school: string }>; searchParams: Promise<{ type?: string | string[] }> };
export function generateStaticParams() { return []; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = findSchoolBySlug((await params).school); if (!school) notFound();
  const locale = await getRequestLocale();
  return buildPageMetadata({ businessKey: "realestate", title: schoolSaleTitle(school, locale), description: SCHOOL_SALE_COPY[locale].lead, path: schoolSalePath(school.slug), locale, availableLocales: ["ja", "en", "zh-tw", "zh"] });
}
export default async function Page({ params, searchParams }: Props) {
  const school = findSchoolBySlug((await params).school); if (!school) notFound();
  const locale = await getRequestLocale(); const type = (await searchParams).type;
  return <SchoolSaleListings school={school} properties={await getPublishedProperties(locale)} locale={locale} type={typeof type === "string" ? type : undefined} />;
}
