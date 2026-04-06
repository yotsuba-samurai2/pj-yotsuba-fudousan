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

  const title = getNestedValue(t, "labor.meta.title") || "四葉社会保険労務士法人";
  const template = getNestedValue(t, "labor.meta.titleTemplate") || "%s | 四葉社会保険労務士法人";
  const description = getNestedValue(t, "labor.meta.description") || BUSINESS_SEO.labor.description;
  const biz = BUSINESS_SEO.labor;
  const url = BUSINESS_URLS.labor;

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

export default function LaborLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantLayoutShell businessKey="labor">
      <OrganizationJsonLd businessKey="labor" />
      <WebSiteJsonLd businessKey="labor" />
      {children}
    </TenantLayoutShell>
  );
}
