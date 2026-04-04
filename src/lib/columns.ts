import columnsData from "./data/columns.json";

export type BusinessKey = "realestate" | "legal" | "labor";

export type Column = {
  business: BusinessKey;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  paragraphs: string[];
  // SEO fields
  modifiedDate?: string;
  ogImage?: string;
  author?: { name: string; title: string };
  keywords?: string[];
  faq?: Array<{ question: string; answer: string }>;
  tags?: string[];
};

const allColumns: Column[] = columnsData as Column[];

// ── Business filter helpers ──

function byBusiness(business: BusinessKey): Column[] {
  return allColumns.filter((c) => c.business === business);
}

// ── Realestate ──

export const columns: Column[] = byBusiness("realestate");

export function getLatestColumns(n: number): Column[] {
  return [...columns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

export function getColumnBySlug(slug: string): Column | undefined {
  return columns.find((c) => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return columns.map((c) => c.slug);
}

// ── Legal ──

export const legalColumns: Column[] = byBusiness("legal");

export function getLatestLegalColumns(n: number): Column[] {
  return [...legalColumns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

export function getLegalColumnBySlug(slug: string): Column | undefined {
  return legalColumns.find((c) => c.slug === slug);
}

export function getAllLegalSlugs(): string[] {
  return legalColumns.map((c) => c.slug);
}

// ── Labor ──

export const laborColumns: Column[] = byBusiness("labor");

export function getLatestLaborColumns(n: number): Column[] {
  return [...laborColumns].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

export function getLaborColumnBySlug(slug: string): Column | undefined {
  return laborColumns.find((c) => c.slug === slug);
}

export function getAllLaborSlugs(): string[] {
  return laborColumns.map((c) => c.slug);
}
