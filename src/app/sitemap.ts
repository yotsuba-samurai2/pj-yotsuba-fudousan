import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getColumns, getLegalColumns } from "@/lib/columns";
import { BUSINESS_URLS } from "@/lib/seo";

export const revalidate = 300;

/** Generate hreflang alternates for a given base URL and path */
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

async function buildRealestateSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const re = BUSINESS_URLS.realestate;
  const columns = await getColumns();

  return [
    { url: re, lastModified: now, changeFrequency: "weekly", priority: 1.0, alternates: withLangs(re) },
    { url: `${re}/souzoku`, lastModified: now, changeFrequency: "monthly", priority: 0.9, alternates: withLangs(re, "/souzoku") },
    { url: `${re}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: withLangs(re, "/services") },
    { url: `${re}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7, alternates: withLangs(re, "/about") },
    { url: `${re}/column`, lastModified: now, changeFrequency: "weekly", priority: 0.8, alternates: withLangs(re, "/column") },
    ...columns.map((col) => ({
      url: `${re}/column/${col.slug}`,
      lastModified: col.modifiedDate ?? col.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: withLangs(re, `/column/${col.slug}`),
    })),
    { url: `${re}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5, alternates: withLangs(re, "/contact") },
    { url: `${re}/legal-notice`, lastModified: now, changeFrequency: "yearly", priority: 0.3, alternates: withLangs(re, "/legal-notice") },
    { url: `${re}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2, alternates: withLangs(re, "/privacy-policy") },
    { url: `${re}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2, alternates: withLangs(re, "/terms") },
  ];
}

async function buildLegalSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const le = BUSINESS_URLS.legal;
  const legalColumns = await getLegalColumns();

  return [
    { url: le, lastModified: now, changeFrequency: "weekly", priority: 1.0, alternates: withLangs(le) },
    { url: `${le}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7, alternates: withLangs(le, "/about") },
    { url: `${le}/column`, lastModified: now, changeFrequency: "weekly", priority: 0.8, alternates: withLangs(le, "/column") },
    ...legalColumns.map((col) => ({
      url: `${le}/column/${col.slug}`,
      lastModified: col.modifiedDate ?? col.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: withLangs(le, `/column/${col.slug}`),
    })),
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
