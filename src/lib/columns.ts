import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export type BusinessKey = "realestate" | "legal" | "labor";

export type Column = {
  id?: string;
  business: BusinessKey;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  status?: string;
  modifiedDate?: string;
  ogImage?: string;
  author?: { name: string; title: string };
  keywords?: string[];
  faq?: Array<{ question: string; answer: string }>;
  tags?: string[];
  translations?: {
    en?: { title: string; excerpt: string; content: string; category?: string; keywords?: string[]; tags?: string[]; faq?: Array<{ question: string; answer: string }> };
    "zh-tw"?: { title: string; excerpt: string; content: string; category?: string; keywords?: string[]; tags?: string[]; faq?: Array<{ question: string; answer: string }> };
    zh?: { title: string; excerpt: string; content: string; category?: string; keywords?: string[]; tags?: string[]; faq?: Array<{ question: string; answer: string }> };
  };
};

const COLLECTION = "columns";

function toColumn(id: string, data: Record<string, unknown>): Column {
  const { createdAt, updatedAt, ...rest } = data;
  return { id, ...rest } as Column;
}

// ── Firestore queries (published only) ──

async function fetchPublished(business: BusinessKey): Promise<Column[]> {
  const q = query(
    collection(db, COLLECTION),
    where("business", "==", business),
    where("status", "==", "published"),
    orderBy("date", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toColumn(d.id, d.data()));
}

async function fetchPublishedBySlug(business: BusinessKey, slug: string): Promise<Column | undefined> {
  const q = query(
    collection(db, COLLECTION),
    where("business", "==", business),
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return undefined;
  const d = snap.docs[0];
  return toColumn(d.id, d.data());
}

// ── Realestate ──

export async function getColumns(): Promise<Column[]> {
  return fetchPublished("realestate");
}

export async function getLatestColumns(n: number): Promise<Column[]> {
  const cols = await fetchPublished("realestate");
  return cols.slice(0, n);
}

export async function getColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("realestate", slug);
}

export async function getAllSlugs(): Promise<string[]> {
  const cols = await fetchPublished("realestate");
  return cols.map((c) => c.slug);
}

// ── Legal ──

export async function getLegalColumns(): Promise<Column[]> {
  return fetchPublished("legal");
}

export async function getLatestLegalColumns(n: number): Promise<Column[]> {
  const cols = await fetchPublished("legal");
  return cols.slice(0, n);
}

export async function getLegalColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("legal", slug);
}

export async function getAllLegalSlugs(): Promise<string[]> {
  const cols = await fetchPublished("legal");
  return cols.map((c) => c.slug);
}

// ── Labor ──

export async function getLaborColumns(): Promise<Column[]> {
  return fetchPublished("labor");
}

export async function getLatestLaborColumns(n: number): Promise<Column[]> {
  const cols = await fetchPublished("labor");
  return cols.slice(0, n);
}

export async function getLaborColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("labor", slug);
}

export async function getAllLaborSlugs(): Promise<string[]> {
  const cols = await fetchPublished("labor");
  return cols.map((c) => c.slug);
}

// ── Locale-aware helper ──

import type { LangCode } from "@/config/languages";

export function getLocalizedColumn(column: Column, locale: LangCode): Column {
  if (locale === "ja" || !column.translations) return column;

  const trans = column.translations[locale as keyof typeof column.translations];
  if (!trans) return column;

  return {
    ...column,
    title: trans.title || column.title,
    excerpt: trans.excerpt || column.excerpt,
    content: trans.content || column.content,
    category: trans.category || column.category,
    keywords: trans.keywords?.length ? trans.keywords : column.keywords,
    tags: trans.tags?.length ? trans.tags : column.tags,
    faq: trans.faq?.length ? trans.faq : column.faq,
  };
}
