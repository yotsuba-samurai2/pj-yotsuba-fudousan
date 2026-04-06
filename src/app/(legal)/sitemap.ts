import type { MetadataRoute } from "next";
import { getLegalColumns } from "@/lib/columns";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const le = BUSINESS_URLS.legal;

  const legalColumns = await getLegalColumns();

  return [
    {
      url: le,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: withLangs(le),
    },
    {
      url: `${le}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: withLangs(le, "/about"),
    },
    {
      url: `${le}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: withLangs(le, "/services"),
    },
    {
      url: `${le}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
      alternates: withLangs(le, "/contact"),
    },
    {
      url: `${le}/column`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: withLangs(le, "/column"),
    },
    ...legalColumns.map((col) => ({
      url: `${le}/column/${col.slug}`,
      lastModified: col.modifiedDate ?? col.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: withLangs(le, `/column/${col.slug}`),
    })),
  ];
}
