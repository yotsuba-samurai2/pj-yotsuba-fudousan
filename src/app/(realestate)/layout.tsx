import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TenantLayoutShell } from "@/components/layout/TenantLayout";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { LOCALE_COOKIE, DEFAULT_LOCALE, isValidLocale } from "@/lib/locale";
import { getStaticTranslationData } from "@/lib/getTranslationData";
import { getNestedValue, BUSINESS_SEO, BUSINESS_URLS } from "@/lib/seo";
import type { LangCode } from "@/config/languages";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: LangCode = localeCookie && isValidLocale(localeCookie) ? localeCookie : DEFAULT_LOCALE;
  const t = getStaticTranslationData(locale);

  const title = getNestedValue(t, "realestate.meta.title") || "四葉不動産";
  const template = getNestedValue(t, "realestate.meta.titleTemplate") || "%s | 四葉不動産";
  const description = getNestedValue(t, "realestate.meta.description") || BUSINESS_SEO.realestate.description;
  const biz = BUSINESS_SEO.realestate;
  const url = BUSINESS_URLS.realestate;

  return {
    title: { default: title, template },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: biz.name,
      locale: locale === "ja" ? "ja_JP" : locale === "en" ? "en_US" : locale === "zh-tw" ? "zh_TW" : "zh_CN",
      type: "website",
      images: [{ url: biz.ogImage, width: 512, height: 512, alt: biz.name }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [biz.ogImage],
    },
  };
}

export default function RealEstateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantLayoutShell businessKey="realestate">
      <OrganizationJsonLd businessKey="realestate" />
      <WebSiteJsonLd businessKey="realestate" />
      {children}
    </TenantLayoutShell>
  );
}
