import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TenantLayoutShell } from "@/components/layout/TenantLayout";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { LOCALE_COOKIE, DEFAULT_LOCALE, isValidLocale } from "@/lib/locale";
import { fetchTranslations } from "@/lib/getTranslationData";
import { getNestedValue, BUSINESS_SEO, BUSINESS_URLS, SITE_URL } from "@/lib/seo";
import type { LangCode } from "@/config/languages";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: LangCode = localeCookie && isValidLocale(localeCookie) ? localeCookie : DEFAULT_LOCALE;
  const t = await fetchTranslations(locale);

  const title = getNestedValue(t, "legal.meta.title") || "四葉行政書士事務所";
  const template = getNestedValue(t, "legal.meta.titleTemplate") || "%s | 四葉行政書士事務所";
  const description = getNestedValue(t, "legal.meta.description") || BUSINESS_SEO.legal.description;
  const biz = BUSINESS_SEO.legal;
  const url = BUSINESS_URLS.legal;

  return {
    metadataBase: new URL("https://luck428gyosei.com"),
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
      // 行政書士サイト既定のOG画像（SEO監査2026-08-24 P1-4：旧実装は og:image なし）。
      // 相対パスだと本layoutの metadataBase（luck428gyosei.com）で解決されるため、
      // 正規ホスト（luck428.com）の絶対URLで出力する
      images: [
        { url: `${SITE_URL}${biz.ogImage}`, width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}${biz.ogImage}`],
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
      {/* WebSiteノードは出力しない（SEO監査2026-08-24 P1-1）：Googleのサイト名はホスト単位のため、
          サブディレクトリ /legal に別サイト名を主張しない。サイト名＝「四葉グループ」は
          (realestate)/layout.tsx の WebSiteJsonLd が1箇所で出力する。事業体は LegalService（Organization）で表現 */}
      {children}
    </TenantLayoutShell>
  );
}
