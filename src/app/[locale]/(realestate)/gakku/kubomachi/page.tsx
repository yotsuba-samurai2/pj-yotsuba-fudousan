// /gakku/kubomachi＝学校別の通学区域ページ。本体は SchoolDistrictPage（4校で共通）。
import type { Metadata } from "next";
import type { LangCode } from "@/config/languages";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { SchoolDistrictPage } from "@/components/gakku/SchoolDistrictPage";
import { findSchoolBySlug } from "@/lib/school-district";
import { gakkuCopy } from "@/lib/gakku";

const SLUG = "kubomachi";
/** 本ページを公開するロケール（hreflang・sitemap と一致させる） */
const PAGE_LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = gakkuCopy(locale);
  const school = findSchoolBySlug(SLUG);
  const name = school?.formalName ?? SLUG;
  return buildPageMetadata({
    businessKey: "realestate",
    title: c.school.titleTemplate.replace("{school}", name),
    description: c.school.districtH2.replace("{school}", name) + " " + c.disclaimer,
    path: `/gakku/${SLUG}`,
    locale,
    availableLocales: PAGE_LOCALES,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  return <SchoolDistrictPage slug={SLUG} locale={locale} />;
}
