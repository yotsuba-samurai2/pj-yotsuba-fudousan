import type { MetadataRoute } from "next";
import { columns, legalColumns, laborColumns } from "@/lib/columns";
import { BUSINESS_URLS } from "@/lib/seo";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const re = BUSINESS_URLS.realestate;
  const le = BUSINESS_URLS.legal;
  const la = BUSINESS_URLS.labor;

  return [
    // ── Real Estate ──
    { url: re, lastModified: now, changeFrequency: "weekly", priority: 1.0, alternates: withLangs(re) },
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

    // ── Legal ──
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

    // ── Labor ──
    { url: la, lastModified: now, changeFrequency: "weekly", priority: 1.0, alternates: withLangs(la) },
    { url: `${la}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7, alternates: withLangs(la, "/about") },
    { url: `${la}/column`, lastModified: now, changeFrequency: "weekly", priority: 0.8, alternates: withLangs(la, "/column") },
    ...laborColumns.map((col) => ({
      url: `${la}/column/${col.slug}`,
      lastModified: col.modifiedDate ?? col.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: withLangs(la, `/column/${col.slug}`),
    })),

    // ── Shared ──
    { url: `${re}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5, alternates: withLangs(re, "/contact") },
    { url: `${re}/legal-notice`, lastModified: now, changeFrequency: "yearly", priority: 0.3, alternates: withLangs(re, "/legal-notice") },
    { url: `${re}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2, alternates: withLangs(re, "/privacy-policy") },
    { url: `${re}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2, alternates: withLangs(re, "/terms") },
  ];
}
