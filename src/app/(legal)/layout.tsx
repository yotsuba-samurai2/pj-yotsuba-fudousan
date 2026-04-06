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

  const title = getNestedValue(t, "legal.meta.title") || "四葉行政書士事務所";
  const template = getNestedValue(t, "legal.meta.titleTemplate") || "%s | 四葉行政書士事務所";
  const description = getNestedValue(t, "legal.meta.description") || BUSINESS_SEO.legal.description;
  const biz = BUSINESS_SEO.legal;
  const url = BUSINESS_URLS.legal;

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

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantLayoutShell businessKey="legal">
      <OrganizationJsonLd businessKey="legal" />
      <WebSiteJsonLd businessKey="legal" />
      {children}
    </TenantLayoutShell>
  );
}
