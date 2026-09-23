import type { Metadata } from "next";
import { TenantLayoutShell } from "@/components/layout/TenantLayout";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { fetchTranslations } from "@/lib/getTranslationData";
import { getNestedValue, BUSINESS_SEO, BUSINESS_URLS } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import type { LangCode } from "@/config/languages";
import { getColumnLanguageIndex } from "@/lib/column-language-index";
import { getPropertyLanguageIndex } from "@/lib/property-language-index";

export async function generateMetadata(): Promise<Metadata> {
  // 旧実装のCookie参照はリクエストAPI＝配下全ルートを動的化するため、
  // [locale] ルートセグメント（root params）から取得する（SEO監査2026-08-24 P0-1）
  const locale: LangCode = await getRequestLocale();
  const t = await fetchTranslations(locale);

  const title = getNestedValue(t, "realestate.meta.title") || "四葉不動産";
  const template =
    getNestedValue(t, "realestate.meta.titleTemplate") || "%s | 四葉不動産";
  const description =
    getNestedValue(t, "realestate.meta.description") ||
    BUSINESS_SEO.realestate.description;
  const biz = BUSINESS_SEO.realestate;
  const url = BUSINESS_URLS.realestate;

  return {
    metadataBase: new URL("https://luck428.com"),
    title: { default: title, template },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: biz.name,
      locale:
        locale === "ja"
          ? "ja_JP"
          : locale === "en"
            ? "en_US"
            : locale === "zh-tw"
              ? "zh_TW"
              : "zh_CN",
      type: "website",
      images: [{ url: "/og.png", width: 1322, height: 834, alt: biz.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function RealEstateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 言語切替の表＝記事（slug）＋物件（bukken/<slug>）。日本語のみ公開の物件で
  // 未公開言語へのリンク（404）を出さない（2026-09-23 本番実測で16件中1件が該当）。
  const [columnLocales, propertyLocales] = await Promise.all([
    getColumnLanguageIndex("realestate"),
    getPropertyLanguageIndex(),
  ]);
  return (
    <TenantLayoutShell businessKey="realestate" columnLocales={{ ...columnLocales, ...propertyLocales }}>
      <OrganizationJsonLd businessKey="realestate" />
      {/* WebSite（サイト名）＝ホスト全体で「四葉グループ」1ノード。出力はこのlayoutだけ（P1-1） */}
      <WebSiteJsonLd />
      {children}
    </TenantLayoutShell>
  );
}
