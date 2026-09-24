export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { getPublishedProperties } from "@/lib/properties";
import { getSchoolRentalSummaries } from "@/lib/school-rental-feed-store";
import { buildPageMetadata } from "@/lib/seo";
import { SCHOOL_SALE_COPY, SCHOOL_SALE_INDEX_PATH } from "@/lib/sale-school-district";
import { SchoolSaleIndex } from "@/components/gakku/SchoolSalePages";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale(); const c = SCHOOL_SALE_COPY[locale];
  return buildPageMetadata({ businessKey: "realestate", title: c.indexTitle, description: c.lead, path: SCHOOL_SALE_INDEX_PATH, locale, availableLocales: ["ja", "en", "zh-tw", "zh"] });
}
export default async function Page() {
  const locale = await getRequestLocale();
  const [properties, summaries] = await Promise.all([getPublishedProperties(locale), getSchoolRentalSummaries()]);
  return <SchoolSaleIndex properties={properties} summaries={summaries} locale={locale} />;
}
