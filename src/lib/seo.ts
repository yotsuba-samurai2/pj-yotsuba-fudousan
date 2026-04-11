import type { Metadata } from "next";
import { groupBusinesses } from "@/config/group";

// ── Constants ──

export const SITE_URL = "https://luck428.com";

export const BUSINESS_URLS: Record<string, string> = {
  realestate: "https://luck428.com",
  legal: "https://luck428gyosei.com",
  // TODO: 社労士法人化後に復活
  // labor: "https://yotsuba-labor.com",
};

export const SHARED_ORG_INFO = {
  name: "四葉パートナーズ",
  nameEn: "YOTSUBA PARTNERS",
  representative: "浦松 丈二",
  representativeEn: "Joji Uramatsu",
  postalCode: "112-0006",
  streetAddress: "小日向４丁目２−５ 小日向安田ビル 203",
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
    url: "https://luck428.com",
    name: "四葉不動産",
    legalName: "四葉不動産株式会社",
    description:
      "元新聞記者が5カ国での在住経験を活かして立ち上げた、東京都文京区にある不動産屋。賃貸・売買・管理から相続不動産まで、多言語（日本語・英語・中国語）対応と専門家ネットワークで住まい探しから契約・法務までワンストップ対応。初回相談は無料、お気軽にどうぞ。",
    schemaType: "RealEstateAgent",
    ogImage: "/og.png",
    columnBasePath: "/column",
  },
  legal: {
    url: "https://luck428gyosei.com",
    name: "四葉行政書士事務所",
    legalName: "四葉行政書士事務所",
    description:
      "元新聞記者の文章力で「通る申請書」を作成する文京区の四葉行政書士事務所。補助金・助成金の採択率向上、ビザ・在留資格、会社設立、各種許認可までワンストップ対応。不動産・社労士とも連携し事業開始を総合支援。初回相談無料。",
    schemaType: "LegalService",
    ogImage: "",
    columnBasePath: "/legal/column",
  },
  /* TODO: 社労士法人化後に復活
  labor: {
    url: "https://yotsuba-labor.com",
    name: "四葉社会保険労務士法人",
    legalName: "四葉社会保険労務士法人",
    description:
      "社会保険・労務管理・助成金申請をトータルサポートする社労士法人。就業規則作成、労使トラブル防止まで。不動産・行政書士と連携し企業の人事・労務をワンストップ支援。",
    schemaType: "ProfessionalService",
    ogImage: "/yotsuba/labor-square.png",
    columnBasePath: "/labor/column",
  },
  */
};

// ── Helpers ──

/**
 * マルチテナントのcanonical URL生成
 * 内部パス `/legal/about` → `https://luck428gyosei.com/about`
 */
export function canonicalUrl(
  businessKey: string,
  internalPath: string,
): string {
  const baseUrl = BUSINESS_URLS[businessKey] ?? SITE_URL;
  const biz = groupBusinesses.find((b) => b.key === businessKey);
  const prefix = biz?.pathPrefix ?? "/";

  const publicPath =
    prefix !== "/" && internalPath.startsWith(prefix)
      ? internalPath.slice(prefix.length) || "/"
      : internalPath;

  return `${baseUrl}${publicPath === "/" ? "" : publicPath}`;
}

/** 翻訳データからネストされたキーを取得 */
export function getNestedValue(
  data: Record<string, unknown>,
  key: string,
): string {
  const keys = key.split(".");
  let current: unknown = data;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return "";
    }
  }
  return typeof current === "string" ? current : "";
}

/** OG locale マッピング */
const OG_LOCALES: Record<string, string> = {
  ja: "ja_JP",
  en: "en_US",
  "zh-tw": "zh_TW",
  zh: "zh_CN",
};

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
  locale = "ja",
  absoluteTitle = false,
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
  locale?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const biz = BUSINESS_SEO[businessKey];
  const url = canonicalUrl(businessKey, path);
  const ogImage = image ?? biz?.ogImage ?? "";
  const hasImage = Boolean(ogImage);
  const isRealestate = businessKey === "realestate";

  const ogBase = {
    title,
    description,
    url,
    siteName: biz?.name ?? "四葉パートナーズ",
    locale: OG_LOCALES[locale] ?? "ja_JP",
    type,
    ...(hasImage
      ? {
          images: [
            {
              url: ogImage,
              width: isRealestate ? 1322 : 512,
              height: isRealestate ? 834 : 512,
              alt: title,
            },
          ],
        }
      : {}),
  };

  const articleFields =
    type === "article"
      ? {
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
          ...(section ? { section } : {}),
        }
      : {};

  const bUrl = BUSINESS_URLS[businessKey] ?? SITE_URL;
  // publicPath is the path portion after the domain (extracted from canonical url)
  const publicPath = url.replace(bUrl, "") || "/";
  const langPath = publicPath === "/" ? "" : publicPath;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
      languages: {
        ja: `${bUrl}${langPath}`,
        en: `${bUrl}/en${langPath}`,
        "zh-Hant": `${bUrl}/zh-tw${langPath}`,
        "zh-Hans": `${bUrl}/zh${langPath}`,
        "x-default": `${bUrl}${langPath}`,
      },
    },
    openGraph: { ...ogBase, ...articleFields },
    twitter: {
      card: hasImage && isRealestate ? "summary_large_image" : "summary",
      title,
      description,
      ...(hasImage ? { images: [ogImage] } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
