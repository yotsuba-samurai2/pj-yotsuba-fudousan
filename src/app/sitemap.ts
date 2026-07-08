import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getAllColumnsAllLocales, getAllLegalColumnsAllLocales } from "@/lib/columns";
import { BUSINESS_URLS } from "@/lib/seo";

export const revalidate = 300;

const ALL_LOCALES = ["ja", "en", "zh-tw", "zh"] as const;
const HREFLANG: Record<string, string> = { ja: "ja", en: "en", "zh-tw": "zh-Hant", zh: "zh-Hans" };

/** Generate hreflang alternates for a given base URL and path (固定ページ＝常に全4言語) */
function withLangs(base: string, path: string = "") {
  const p = path || "";
  return {
    languages: {
      ja: `${base}${p}`,
      en: `${base}/en${p}`,
      "zh-Hant": `${base}/zh-tw${p}`,
      "zh-Hans": `${base}/zh${p}`,
    },
  };
}

/**
 * コラム用: col.locales に限定してalternatesを出す（locale不一致404を防ぐ）。
 * locales未設定＝後方互換で全4言語（withLangsと同じ挙動）。
 * 正規urlは ja があればjaパス、無ければ locales の先頭言語のプレフィックスを使う
 * （台湾9本のようにzh-tw限定のコラムを、存在しないjaパスとして出さないため）。
 */
function columnUrlAndAlternates(base: string, path: string, locales: string[] | undefined) {
  const active = locales && locales.length > 0 ? locales : [...ALL_LOCALES];
  const primary = active.includes("ja") ? "ja" : active[0];
  const prefix = (loc: string) => (loc === "ja" ? "" : `/${loc}`);
  const languages: Record<string, string> = {};
  for (const loc of active) {
    languages[HREFLANG[loc] ?? loc] = `${base}${prefix(loc)}${path}`;
  }
  return { url: `${base}${prefix(primary)}${path}`, alternates: { languages } };
}

async function buildRealestateSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const re = BUSINESS_URLS.realestate;
  const columns = await getAllColumnsAllLocales();

  return [
    { url: re, lastModified: now, changeFrequency: "weekly", priority: 1.0, alternates: withLangs(re) },
    { url: `${re}/souzoku`, lastModified: now, changeFrequency: "monthly", priority: 0.9, alternates: withLangs(re, "/souzoku") },
    { url: `${re}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: withLangs(re, "/services") },
    { url: `${re}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7, alternates: withLangs(re, "/about") },
    { url: `${re}/column`, lastModified: now, changeFrequency: "weekly", priority: 0.8, alternates: withLangs(re, "/column") },
    ...columns.map((col) => {
      const { url, alternates } = columnUrlAndAlternates(re, `/column/${col.slug}`, col.locales);
      return {
        url,
        lastModified: col.modifiedDate ?? col.date,
        changeFrequency: "yearly" as const,
        priority: 0.6,
        alternates,
      };
    }),
    { url: `${re}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5, alternates: withLangs(re, "/contact") },
    { url: `${re}/legal-notice`, lastModified: now, changeFrequency: "yearly", priority: 0.3, alternates: withLangs(re, "/legal-notice") },
    { url: `${re}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2, alternates: withLangs(re, "/privacy-policy") },
    { url: `${re}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2, alternates: withLangs(re, "/terms") },
  ];
}

async function buildLegalSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const le = BUSINESS_URLS.legal;
  const legalColumns = await getAllLegalColumnsAllLocales();

  return [
    { url: le, lastModified: now, changeFrequency: "weekly", priority: 1.0, alternates: withLangs(le) },
    { url: `${le}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7, alternates: withLangs(le, "/about") },
    { url: `${le}/column`, lastModified: now, changeFrequency: "weekly", priority: 0.8, alternates: withLangs(le, "/column") },
    ...legalColumns.map((col) => {
      const { url, alternates } = columnUrlAndAlternates(le, `/column/${col.slug}`, col.locales);
      return {
        url,
        lastModified: col.modifiedDate ?? col.date,
        changeFrequency: "yearly" as const,
        priority: 0.6,
        alternates,
      };
    }),
    { url: `${le}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5, alternates: withLangs(le, "/contact") },
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
