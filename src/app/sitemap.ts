import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getAllColumnsAllLocales, getAllLegalColumnsAllLocales } from "@/lib/columns";
import { canonicalUrl } from "@/lib/seo";
import type { Column } from "@/lib/columns";

export const revalidate = 300;

const ALL_LOCALES = ["ja", "en", "zh-tw", "zh"] as const;
/** sitemap の xhtml:link hreflang 値（ページmetadataの alternates と同一マッピング） */
const HREFLANG: Record<string, string> = { ja: "ja", en: "en", "zh-tw": "zh-Hant", zh: "zh-Hans" };

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
type StaticPage = {
  path: string;
  changeFrequency: ChangeFreq;
  priority: number;
  /** このページが実在するロケール（未指定＝全4ロケール）。ja先行公開ページはjaのみ出す＝存在しないロケールURLを広告しない */
  locales?: readonly (typeof ALL_LOCALES)[number][];
};

/**
 * hreflang alternates を生成する。URL生成は canonicalUrl（＝ページmetadataの alternates と
 * 同一の単一情報源）を再利用し、ロケール接頭辞・マルチテナントのパス結合を一箇所に集約する。
 */
function alternatesFor(businessKey: string, path: string, locales: readonly string[]) {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[HREFLANG[loc] ?? loc] = canonicalUrl(businessKey, path, loc);
  }
  return { languages };
}

/**
 * 固定ページを全4ロケールに展開。各ロケールURLを独立した <loc> として出力し、
 * それぞれに全4言語の hreflang alternates を付与する
 * （Next.js は配列1要素につき <url> 1件・<loc>=url のみを出すため、ロケール別に要素化しないと
 *  /en・/zh が <loc> として現れない）。
 */
function expandStatic(
  businessKey: string,
  page: StaticPage,
  lastModified: string,
): MetadataRoute.Sitemap {
  const locales = page.locales ?? ALL_LOCALES;
  const alternates = alternatesFor(businessKey, page.path, locales);
  return locales.map((loc) => ({
    url: canonicalUrl(businessKey, page.path, loc),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates,
  }));
}

/**
 * コラムを、そのコラムが実際に公開されているロケール（col.locales）のみ展開する
 * （存在しないロケールのURLを機械生成して404を量産しない）。locales 未設定＝後方互換で全4言語。
 * lastModified は frontmatter 相当の modifiedDate → date の順で採用（両方欠落時のみビルド時刻）。
 */
function expandColumn(
  businessKey: string,
  path: string,
  col: Column,
  fallbackModified: string,
): MetadataRoute.Sitemap {
  const active = col.locales && col.locales.length > 0 ? col.locales : [...ALL_LOCALES];
  const alternates = alternatesFor(businessKey, path, active);
  const lastModified = col.modifiedDate ?? col.date ?? fallbackModified;
  return active.map((loc) => ({
    url: canonicalUrl(businessKey, path, loc),
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.6,
    alternates,
  }));
}

const STATIC_REALESTATE: StaticPage[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/souzoku", changeFrequency: "monthly", priority: 0.9 },
  { path: "/souzoku/nagare", changeFrequency: "monthly", priority: 0.7 },
  // タスクC-4（2026-07-19）：相続空き家。現フェーズ＝ja先行公開（/ryokinと同方式）
  { path: "/souzoku/akiya", changeFrequency: "monthly", priority: 0.7, locales: ["ja"] },
  { path: "/toushi", changeFrequency: "monthly", priority: 0.9 },
  { path: "/toushi/group-home", changeFrequency: "monthly", priority: 0.8 },
  // タスクC-2（2026-07-19）：指定申請と物件の分離受任。現フェーズ＝ja先行公開（/ryokinと同方式）
  { path: "/toushi/shitei-shinsei", changeFrequency: "monthly", priority: 0.7, locales: ["ja"] },
  { path: "/toushi/shataku", changeFrequency: "monthly", priority: 0.7 },
  { path: "/global", changeFrequency: "monthly", priority: 0.8 },
  // タスクC-3（2026-07-19）：中国語圏特化ハブ。現フェーズ＝ja先行公開（中国語版はC-6で展開）
  { path: "/global/chinese", changeFrequency: "monthly", priority: 0.7, locales: ["ja"] },
  { path: "/access", changeFrequency: "monthly", priority: 0.7 },
  // タスクB-1（2026-07-19）：不動産・料金ページ。現フェーズ＝ja先行公開（多言語は後続ステップでlocales解除）
  { path: "/ryokin", changeFrequency: "monthly", priority: 0.8, locales: ["ja"] },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  // タスクB-2（2026-07-19）：代表者プロフィール。現フェーズ＝ja先行公開（/ryokinと同方式）
  { path: "/about/uramatsu", changeFrequency: "monthly", priority: 0.6, locales: ["ja"] },
  { path: "/column", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/legal-notice", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

const STATIC_LEGAL: StaticPage[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/shogai-fukushi", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/visa", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/inheritance", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/company", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services/subsidy", changeFrequency: "monthly", priority: 0.7 },
  { path: "/ryokin", changeFrequency: "monthly", priority: 0.8 },
  { path: "/nagare", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/column", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

async function buildRealestateSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const columns = await getAllColumnsAllLocales();
  return [
    ...STATIC_REALESTATE.flatMap((page) => expandStatic("realestate", page, now)),
    ...columns.flatMap((col) =>
      expandColumn("realestate", `/column/${col.slug}`, col, now),
    ),
  ];
}

async function buildLegalSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const legalColumns = await getAllLegalColumnsAllLocales();
  return [
    ...STATIC_LEGAL.flatMap((page) => expandStatic("legal", page, now)),
    ...legalColumns.flatMap((col) =>
      expandColumn("legal", `/column/${col.slug}`, col, now),
    ),
  ];
}

/**
 * ホスト名で振り分け:
 * - luck428gyosei.com → 行政書士のsitemap
 * - それ以外 → 不動産のsitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("host") || "";

  if (host.includes("luck428gyosei.com")) {
    return buildLegalSitemap();
  }

  return buildRealestateSitemap();
}
