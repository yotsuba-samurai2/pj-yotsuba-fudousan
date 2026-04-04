import type { MetadataRoute } from "next";
import { columns, legalColumns, laborColumns } from "@/lib/columns";
import { BUSINESS_URLS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const realEstateBase = BUSINESS_URLS.realestate;
  const legalBase = BUSINESS_URLS.legal;
  const laborBase = BUSINESS_URLS.labor;

  return [
    // ── Real Estate ──
    { url: realEstateBase, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${realEstateBase}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${realEstateBase}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${realEstateBase}/column`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...columns.map((col) => ({
      url: `${realEstateBase}/column/${col.slug}`,
      lastModified: col.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),

    // ── Legal ──
    { url: legalBase, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${legalBase}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${legalBase}/column`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...legalColumns.map((col) => ({
      url: `${legalBase}/column/${col.slug}`,
      lastModified: col.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),

    // ── Labor ──
    { url: laborBase, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${laborBase}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${laborBase}/column`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...laborColumns.map((col) => ({
      url: `${laborBase}/column/${col.slug}`,
      lastModified: col.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),

    // ── Shared ──
    { url: `${realEstateBase}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${realEstateBase}/legal-notice`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${realEstateBase}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${realEstateBase}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
