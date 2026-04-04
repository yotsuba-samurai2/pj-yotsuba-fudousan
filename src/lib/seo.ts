import type { Metadata } from "next";
import { groupBusinesses } from "@/config/group";

// ── Constants ──

export const SITE_URL = "https://yotsuba-fudousan.com";

export const BUSINESS_URLS: Record<string, string> = {
  realestate: "https://yotsuba-fudousan.com",
  legal: "https://yotsuba-legal.com",
  labor: "https://yotsuba-labor.com",
};

export const SHARED_ORG_INFO = {
  name: "四葉パートナーズ",
  nameEn: "YOTSUBA PARTNERS",
  representative: "浦松 丈二",
  representativeEn: "Joji Uramatsu",
  postalCode: "112-0006",
  streetAddress: "小日向４丁目２−５ 小日向安田ビル 2F",
  addressLocality: "文京区",
  addressRegion: "東京都",
  addressCountry: "JP",
  telephone: "03-6161-9428",
  openingHours: "Mo-Su 09:00-18:00",
  geo: { latitude: 35.7178, longitude: 139.7343 },
  foundingDate: "2025",
} as const;

export type BusinessSEOConfig = {
  url: string;
  name: string;
  legalName: string;
  description: string;
  schemaType: string;
  ogImage: string;
  columnBasePath: string;
};

export const BUSINESS_SEO: Record<string, BusinessSEOConfig> = {
  realestate: {
    url: "https://yotsuba-fudousan.com",
    name: "四葉不動産",
    legalName: "四葉不動産株式会社",
    description:
      "5言語対応の不動産屋。元新聞記者・海外赴任経験者の代表が、外国人の住まい探しを経験者の視点でサポートします。賃貸・売買・管理のご相談はお気軽にどうぞ。",
    schemaType: "RealEstateAgent",
    ogImage: "/yotsuba/realestate-square.png",
    columnBasePath: "/column",
  },
  legal: {
    url: "https://yotsuba-legal.com",
    name: "四葉行政書士事務所",
    legalName: "四葉行政書士事務所",
    description:
      "補助金・助成金申請、在留資格・ビザ申請、会社設立、各種許認可。四葉パートナーズの行政書士事務所が法務手続きをワンストップでサポートします。",
    schemaType: "LegalService",
    ogImage: "/yotsuba/legal-square.png",
    columnBasePath: "/legal/column",
  },
  labor: {
    url: "https://yotsuba-labor.com",
    name: "四葉社会保険労務士法人",
    legalName: "四葉社会保険労務士法人",
    description:
      "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉パートナーズの社労士法人が企業の人事・労務をトータルサポートします。",
    schemaType: "ProfessionalService",
    ogImage: "/yotsuba/labor-square.png",
    columnBasePath: "/labor/column",
  },
};

// ── Helpers ──

/**
 * マルチテナントのcanonical URL生成
 * 内部パス `/legal/about` → `https://yotsuba-legal.com/about`
 */
export function canonicalUrl(businessKey: string, internalPath: string): string {
  const baseUrl = BUSINESS_URLS[businessKey] ?? SITE_URL;
  const biz = groupBusinesses.find((b) => b.key === businessKey);
  const prefix = biz?.pathPrefix ?? "/";

  const publicPath =
    prefix !== "/" && internalPath.startsWith(prefix)
      ? internalPath.slice(prefix.length) || "/"
      : internalPath;

  return `${baseUrl}${publicPath === "/" ? "" : publicPath}`;
}

/**
 * 全ページ共通のMetadata生成
 */
export function buildPageMetadata({
  businessKey,
  title,
  description,
  path,
  image,
  keywords,
  type = "website",
  noindex = false,
  publishedTime,
  modifiedTime,
  section,
}: {
  businessKey: string;
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
}): Metadata {
  const biz = BUSINESS_SEO[businessKey];
  const url = canonicalUrl(businessKey, path);
  const ogImage = image ?? biz?.ogImage ?? "/yotsuba/realestate-square.png";

  const ogBase = {
    title,
    description,
    url,
    siteName: biz?.name ?? "四葉パートナーズ",
    locale: "ja_JP",
    type,
    images: [
      {
        url: ogImage,
        width: 512,
        height: 512,
        alt: title,
      },
    ],
  };

  const articleFields =
    type === "article"
      ? {
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
          ...(section ? { section } : {}),
        }
      : {};

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: { ...ogBase, ...articleFields },
    twitter: {
      card: "summary",
      title,
      description,
      images: [ogImage],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
