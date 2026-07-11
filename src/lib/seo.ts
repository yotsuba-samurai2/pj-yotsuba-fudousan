import type { Metadata } from "next";
import { groupBusinesses } from "@/config/group";
import { SR_OFFICE_NAME } from "@/lib/shared/sr-name";
import { GBP_URL } from "@/lib/shared/office-public";
import { DEFAULT_LOCALE, isValidLocale } from "@/lib/locale";

// ── Constants ──

export const SITE_URL = "https://luck428.com";

export const BUSINESS_URLS: Record<string, string> = {
  realestate: "https://luck428.com",
  legal: "https://luck428.com/legal",
  // 社労士（/labor維持＝2026-07-09浦松決定。旧yotsuba-labor.comは使わない）：
  // SR_LAUNCHED=true（開業日）まで登録しない＝robots.tsのsitemap一覧等へ露出しない。
  ...(process.env.NEXT_PUBLIC_SR_LAUNCHED === "true"
    ? { labor: "https://luck428.com/labor" }
    : {}),
};

export const SHARED_ORG_INFO = {
  name: "四葉グループ",
  nameEn: "YOTSUBA GROUP",
  representative: "浦松 丈二",
  representativeEn: "Joji Uramatsu",
  postalCode: "112-0006",
  streetAddress: "小日向４丁目２−５ 小日向安田ビル２０３",
  addressLocality: "文京区",
  addressRegion: "東京都",
  addressCountry: "JP",
  telephone: "03-6161-9428",
  geo: { latitude: 35.715069, longitude: 139.739822 },
  foundingDate: "2025",
} as const;

export type OpeningHoursSpec = {
  dayOfWeek: string[];
  opens: string;
  closes: string;
};

/**
 * 事業別の営業時間（不動産と士業で異なる）
 * - 不動産: 月木金土日 10:00-18:00（火・水休）
 * - 行政書士・社労士: 火水 10:00-19:00 ＋ 月木金土日 18:00-19:00
 */
export const BUSINESS_HOURS: Record<
  string,
  { specs: OpeningHoursSpec[]; display: string }
> = {
  realestate: {
    specs: [
      {
        dayOfWeek: ["Monday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    display: "10:00〜18:00（火・水休）",
  },
  legal: {
    specs: [
      { dayOfWeek: ["Tuesday", "Wednesday"], opens: "10:00", closes: "19:00" },
      {
        dayOfWeek: ["Monday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "18:00",
        closes: "19:00",
      },
    ],
    display: "火・水 10:00〜19:00 ／ 月・木・金・土・日 18:00〜19:00",
  },
  labor: {
    specs: [
      { dayOfWeek: ["Tuesday", "Wednesday"], opens: "10:00", closes: "19:00" },
      {
        dayOfWeek: ["Monday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "18:00",
        closes: "19:00",
      },
    ],
    display: "火・水 10:00〜19:00 ／ 月・木・金・土・日 18:00〜19:00",
  },
};

/** 代表者（浦松丈二）Personノードの共通@id — 全記事のauthor・全組織のfounderからこれを参照する */
export const PERSON_ID = "https://luck428.com/#uramatsu-joji";

/** 士業ドットコムの浦松個人ページ（実在確認済み 2026-07-08） */
export const SAMURAI_URAMATSU_URL =
  "https://www.samurai.co.jp/samurai/reserve/uramatsu-joji";

/**
 * 代表者（浦松丈二）の外部プロフィールURL（いずれも現物確認済み）。
 * 個人のSNS・ブログはここ（Person）にのみ載せる＝組織のsameAsへ混ぜない（Person/Org境界）。
 * gyosei-bunkyo.org＝東京都行政書士会文京支部の公式会員名簿・本人ページ（2026-07-10実在確認）。
 */
export const PERSON_SAME_AS = [
  "https://www.wikidata.org/wiki/Q139738129",
  SAMURAI_URAMATSU_URL,
  "https://gyosei-bunkyo.org/membersearch/%e6%b5%a6%e6%9d%be-%e4%b8%88%e4%ba%8c.html",
  "https://note.com/luck428",
  "https://x.com/uramatsujoji",
  "https://www.facebook.com/uramatsujoji",
  "https://www.instagram.com/uramatsu_joji/",
  "https://www.threads.com/@uramatsu_joji",
  "https://www.linkedin.com/in/joji-uramatsu/",
] as const;

/**
 * 代表者（浦松丈二）のPersonフルノード。/aboutのProfilePageで出力し、
 * 他所からは { "@id": PERSON_ID } で参照する（エンティティ外部シグナル強化仕様_v1 §1-1）。
 * 社労士関連（jobTitle・worksFor）は開業まで出力しない。
 */
export const PERSON_JSONLD = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "浦松 丈二",
  alternateName: "Joji Uramatsu",
  // jobTitle＝役職／資格はhasCredentialへ分離。社労士関連は開業（2026年9月）まで出力しない
  jobTitle: ["四葉不動産株式会社 代表取締役", "四葉行政書士事務所 代表行政書士"],
  description:
    "元毎日新聞中国総局長（記者歴34年）。文京区小日向で四葉不動産株式会社・四葉行政書士事務所を営む。",
  url: "https://luck428.com/about",
  worksFor: [
    { "@id": "https://luck428.com/#organization" },
    { "@id": "https://luck428.com/legal/#organization" },
  ],
  hasCredential: [
    "行政書士（登録番号 第25087022号）",
    "宅地建物取引士（東京 第293544号）",
    "社会保険労務士試験合格（2026年9月開業予定）",
  ],
  memberOf: [
    {
      "@type": "Organization",
      name: "東京都行政書士会",
      url: "https://www.tokyo-gyosei.or.jp/",
    },
    {
      "@type": "Organization",
      name: "日本行政書士会連合会",
      url: "https://www.gyosei.or.jp/",
    },
  ],
  affiliation: [
    {
      "@type": "Organization",
      name: "東京都行政書士会 文京支部",
      url: "https://gyosei-bunkyo.org/",
    },
    {
      "@type": "Organization",
      name: "士業ドットコム",
      url: "https://www.samurai.co.jp/",
    },
  ],
  knowsLanguage: ["ja", "en", "zh"],
  sameAs: [...PERSON_SAME_AS],
} as const;

/**
 * 四葉不動産（RealEstateAgent）の外部プロフィールURL（Wikidata Q139738235＝現物確認済み）。
 * sameAs＝「同一エンティティの別ページ」のみ：
 * - 別事業体（/legal）を入れない（別エンティティの同一視＝業法分離と矛盾）
 * - 個人SNS・noteはPerson側にのみ（Person/Org境界）
 * 事業間の関係は founder（Person @id）と可視リンクで表現する。
 */
export const REALESTATE_SAME_AS = [
  "https://www.wikidata.org/wiki/Q139738235",
  "https://www.samurai.co.jp/samurai/reserve/yotubahudousan",
  "https://maps.google.com/?cid=2684416286346615973",
  // 東京都宅建協会 会員検索の当社詳細ページ（2026-07-10現物確認＝免許 知事(1)113304・商号・住所一致・HP欄=luck428.com）
  "https://www.tokyo-takken.or.jp/search-member/detail/31253",
  // ナレッジパネル（kgmid）＝JSON-LD修正P2（2026-07-11浦松承認済み仕様）
  "https://www.google.com/search?kgmid=/g/11ytdshcrj",
] as const;

/**
 * 四葉行政書士事務所（LegalService）の外部プロフィールURL（Wikidata Q139738259＝現物確認済み）。
 * 士業ドットコムに事務所単体ページは無い＝浦松個人ページはPerson.sameAs経由で接続（Orgへは混ぜない）。
 * 文京支部の会員名簿は本人名義ページのためPerson側に収載。
 */
export const LEGAL_SAME_AS = [
  "https://www.wikidata.org/wiki/Q139738259",
  // GBP共有リンク＋ナレッジパネル（kgmid）＝JSON-LD修正P2（2026-07-11浦松承認済み仕様）
  "https://share.google/qw9imD2snNKDEQS3Z",
  "https://www.google.com/search?kgmid=/g/11z5sjqsxz",
] as const;

/**
 * 組織のmemberOf（公的所属団体）。会員ページ等で裏取りできたもののみ出力（監査原則）。
 * - 宅建協会・全宅保証＝会員検索詳細ページで確認（2026-07-10・正会員）
 * - 日本賃貸住宅管理協会＝会員裏取り未了のため出力保留（確認後に追加）
 */
export const REALESTATE_MEMBER_OF = [
  {
    "@type": "Organization",
    name: "公益社団法人 東京都宅地建物取引業協会",
    url: "https://www.tokyo-takken.or.jp/",
  },
  {
    "@type": "Organization",
    name: "公益社団法人 全国宅地建物取引業保証協会",
    url: "https://www.zentaku.or.jp/",
  },
] as const;

export const LEGAL_MEMBER_OF = [
  {
    "@type": "Organization",
    name: "東京都行政書士会",
    url: "https://www.tokyo-gyosei.or.jp/",
  },
  {
    "@type": "Organization",
    name: "日本行政書士会連合会",
    url: "https://www.gyosei.or.jp/",
  },
] as const;

export type BusinessSEOConfig = {
  url: string;
  name: string;
  legalName: string;
  description: string;
  schemaType: string;
  ogImage: string;
  /** JSON-LDのlogo/image用・正方形ロゴ（ルート相対。SNS共有用ogImageとは独立＝ogImage値は変更しない） */
  squareLogo?: string;
  /** GBP直リンク（JSON-LD hasMap・地図リンク用）。正本=office-public.tsのGBP_URL。labor＝GBP未整備のため未設定 */
  gbpUrl?: string;
  columnBasePath: string;
};

export const BUSINESS_SEO: Record<string, BusinessSEOConfig> = {
  realestate: {
    url: "https://luck428.com",
    name: "四葉不動産",
    legalName: "四葉不動産株式会社",
    description:
      "元新聞記者が4カ国での在住経験を活かして立ち上げた、東京都文京区にある不動産屋。賃貸・売買・管理から相続不動産まで、多言語（日本語・英語・中国語繁体字・中国語簡体字）対応と専門家ネットワークで住まい探しから契約・法務までワンストップ対応。初回相談は無料、お気軽にどうぞ。",
    schemaType: "RealEstateAgent",
    ogImage: "/og.png",
    squareLogo: "/yotsuba/realestate-square.png",
    gbpUrl: GBP_URL.realestate,
    columnBasePath: "/column",
  },
  legal: {
    url: "https://luck428.com/legal",
    name: "四葉行政書士事務所",
    legalName: "四葉行政書士事務所",
    // 原稿_行政書士サイト_v1.0 #10 の確定meta description（業際：雇用関係助成金＝社労士領域のため「助成金」を出さない）
    description:
      "東京都文京区小日向・茗荷谷駅徒歩5分の四葉行政書士事務所。障害福祉サービスの指定申請、在留資格・ビザ、相続、会社設立、補助金申請に対応。元毎日新聞中国総局長の行政書士が、中国語・英語も交え、書類作成から申請までお手伝いします。",
    schemaType: "LegalService",
    ogImage: "",
    squareLogo: "/yotsuba/legal-square.png",
    gbpUrl: GBP_URL.legal,
    columnBasePath: "/legal/column",
  },
  // 社労士：SR_LAUNCHED=true（開業日）までキー自体を登録しない（名称・説明の露出防止）
  ...(process.env.NEXT_PUBLIC_SR_LAUNCHED === "true"
    ? {
        labor: {
          url: "https://luck428.com/labor",
          name: SR_OFFICE_NAME, // 事務所名は実行時結合（法27条ソース漏れ対策＝sr-name.ts参照）
          legalName: SR_OFFICE_NAME,
          // 原稿_社労士サイト_v1.0 #1 の確定meta description
          description:
            `東京都文京区小日向・茗荷谷駅徒歩5分の${SR_OFFICE_NAME}。障害福祉・介護事業所の労務管理、処遇改善加算、社会保険手続き、雇用関係助成金、外国人介護人材の労務に対応。元新聞記者の社労士が、複雑な労務を整理してお手伝いします。`,
          schemaType: "ProfessionalService",
          ogImage: "",
          columnBasePath: "/labor/column",
        },
      }
    : {}),
};

// ── Helpers ──

/** パス断片を安全に連結（重複スラッシュ・空断片を除去） */
function joinPath(...segments: string[]): string {
  const parts = segments.flatMap((s) => s.split("/")).filter(Boolean);
  return parts.length ? `/${parts.join("/")}` : "/";
}

/**
 * マルチテナント×多言語のcanonical URL生成
 * 内部パス `/legal/about` + locale `en` → `https://luck428.com/en/legal/about`
 * 内部パス `/legal/about` + locale `ja`（デフォルト）→ `https://luck428.com/legal/about`
 */
export function canonicalUrl(
  businessKey: string,
  internalPath: string,
  locale: string = DEFAULT_LOCALE,
): string {
  const baseUrl = BUSINESS_URLS[businessKey] ?? SITE_URL;
  const biz = groupBusinesses.find((b) => b.key === businessKey);
  const prefix = biz?.pathPrefix ?? "/";

  const publicPath =
    prefix !== "/" && internalPath.startsWith(prefix)
      ? internalPath.slice(prefix.length) || "/"
      : internalPath;

  const { origin, pathname: basePath } = new URL(baseUrl);
  const localePrefix =
    isValidLocale(locale) && locale !== DEFAULT_LOCALE ? `/${locale}` : "";
  const path = joinPath(localePrefix, basePath, publicPath);

  return `${origin}${path === "/" ? "" : path}`;
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
  const url = canonicalUrl(businessKey, path, locale);
  const ogImage = image ?? biz?.ogImage ?? "";
  const hasImage = Boolean(ogImage);
  const isRealestate = businessKey === "realestate";

  const ogBase = {
    title,
    description,
    url,
    siteName: biz?.name ?? "四葉グループ",
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

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
      languages: {
        ja: canonicalUrl(businessKey, path, "ja"),
        en: canonicalUrl(businessKey, path, "en"),
        "zh-Hant": canonicalUrl(businessKey, path, "zh-tw"),
        "zh-Hans": canonicalUrl(businessKey, path, "zh"),
        "x-default": canonicalUrl(businessKey, path, "ja"),
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
