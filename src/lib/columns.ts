import { cache } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import type { LangCode } from "@/config/languages";

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
  /** このコラムを公開する言語。未設定＝全言語（後方互換のデフォルト） */
  locales?: LangCode[];
  translations?: {
    en?: ColumnTranslationLocalized;
    "zh-tw"?: ColumnTranslationLocalized;
    zh?: ColumnTranslationLocalized;
  };
};

export type ColumnTranslationLocalized = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  keywords?: string[];
  tags?: string[];
  author?: { name: string; title: string };
  faq?: Array<{ question: string; answer: string }>;
};

const COLLECTION = "columns";

function toColumn(id: string, data: Record<string, unknown>): Column {
  const { createdAt, updatedAt, ...rest } = data;
  return { id, ...rest } as Column;
}

// ── Firestore queries (published only) ──

/** 現在ロケールの一覧・prev/next用。locales に current locale を含むもののみ（array-contains） */
const fetchPublished = cache(async (business: BusinessKey, locale: LangCode): Promise<Column[]> => {
  const q = query(
    collection(db, COLLECTION),
    where("business", "==", business),
    where("status", "==", "published"),
    where("locales", "array-contains", locale),
    orderBy("date", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toColumn(d.id, d.data()));
});

/**
 * 全ロケール横断（localeフィルタ無し）。sitemap.ts と generateStaticParams 専用。
 * 一覧・詳細ページの表示には使わない（使うと出し分けが効かなくなる）。
 */
const fetchAllPublished = cache(async (business: BusinessKey): Promise<Column[]> => {
  const q = query(
    collection(db, COLLECTION),
    where("business", "==", business),
    where("status", "==", "published"),
    orderBy("date", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toColumn(d.id, d.data()));
});

const fetchPublishedBySlug = cache(async (business: BusinessKey, slug: string): Promise<Column | undefined> => {
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
});

// ── Realestate ──

export async function getColumns(locale: LangCode): Promise<Column[]> {
  return fetchPublished("realestate", locale);
}

export async function getLatestColumns(n: number, locale: LangCode): Promise<Column[]> {
  const cols = await fetchPublished("realestate", locale);
  return cols.slice(0, n);
}

export async function getColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("realestate", slug);
}

/** sitemap.ts・generateStaticParams専用（全ロケール横断） */
export async function getAllColumnsAllLocales(): Promise<Column[]> {
  return fetchAllPublished("realestate");
}

export async function getAllSlugs(): Promise<string[]> {
  const cols = await fetchAllPublished("realestate");
  return cols.map((c) => c.slug);
}

// ── Legal ──

export async function getLegalColumns(locale: LangCode): Promise<Column[]> {
  return fetchPublished("legal", locale);
}

export async function getLatestLegalColumns(n: number, locale: LangCode): Promise<Column[]> {
  const cols = await fetchPublished("legal", locale);
  return cols.slice(0, n);
}

export async function getLegalColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("legal", slug);
}

/** sitemap.ts・generateStaticParams専用（全ロケール横断） */
export async function getAllLegalColumnsAllLocales(): Promise<Column[]> {
  return fetchAllPublished("legal");
}

export async function getAllLegalSlugs(): Promise<string[]> {
  const cols = await fetchAllPublished("legal");
  return cols.map((c) => c.slug);
}

// ── Labor ──

export async function getLaborColumns(locale: LangCode): Promise<Column[]> {
  return fetchPublished("labor", locale);
}

export async function getLatestLaborColumns(n: number, locale: LangCode): Promise<Column[]> {
  const cols = await fetchPublished("labor", locale);
  return cols.slice(0, n);
}

export async function getLaborColumnBySlug(slug: string): Promise<Column | undefined> {
  return fetchPublishedBySlug("labor", slug);
}

export async function getAllLaborSlugs(): Promise<string[]> {
  const cols = await fetchAllPublished("labor");
  return cols.map((c) => c.slug);
}

// ── Locale-aware helper ──

/** locales 未設定＝全言語許可（後方互換）。設定済みなら現在ロケールを含むかで判定 */
export function isLocaleAllowed(column: Column, locale: LangCode): boolean {
  return !column.locales || column.locales.includes(locale);
}

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
    author:
      trans.author && (trans.author.name || trans.author.title)
        ? trans.author
        : column.author,
  };
}

// ── Internal linking helpers ──

/**
 * ある記事に関連する記事を最大 `limit` 本選ぶ。
 * 優先度: タグ一致数（重み2）→ カテゴリ一致（重み1）→ 公開日の新しい順。自身は除外。
 * 呼び出し側は現在ロケールで取得済み・ローカライズ済みの配列を渡す想定。
 */
export function pickRelatedColumns(
  all: Column[],
  opts: { excludeSlug?: string; category?: string; tags?: string[]; limit?: number },
): Column[] {
  const { excludeSlug, category, tags, limit = 3 } = opts;
  const score = (c: Column): number => {
    let s = 0;
    if (tags?.length && c.tags?.length) {
      s += c.tags.filter((t) => tags.includes(t)).length * 2;
    }
    if (category && c.category === category) s += 1;
    return s;
  };
  return all
    .filter((c) => c.slug !== excludeSlug)
    .slice()
    .sort((a, b) => {
      const diff = score(b) - score(a);
      if (diff !== 0) return diff;
      return b.date.localeCompare(a.date);
    })
    .slice(0, limit);
}

/** ハブページのテーマ。カテゴリ・タグ文言はロケール依存・自由記述のためキーワードで横断照合する。 */
export type ColumnTheme = "souzoku" | "toushi" | "global";

const THEME_KEYWORDS: Record<ColumnTheme, string[]> = {
  // 相続・継承
  souzoku: ["相続", "繼承", "继承", "inherit", "inheritance", "estate"],
  // 投資・収益物件・グループホーム・社宅
  toushi: [
    "投資", "投资", "収益", "收益", "グループホーム", "社宅",
    "invest", "yield", "rental income",
  ],
  // 外国人・多言語・台湾・在留資格
  global: [
    "外国人", "外國人", "台湾", "台灣", "在留", "ビザ", "査証",
    "foreign", "overseas", "visa", "resident",
  ],
};

/**
 * テーマに合致するコラムを新着順で最大 `limit` 本返す。
 * category・tags のいずれかにキーワード（部分一致・大文字小文字無視）が含まれれば合致とみなす。
 */
export function filterColumnsByTheme(
  all: Column[],
  theme: ColumnTheme,
  limit = 3,
): Column[] {
  const keywords = THEME_KEYWORDS[theme].map((k) => k.toLowerCase());
  const matches = (c: Column): boolean => {
    const haystack = [c.category, ...(c.tags ?? [])]
      .join(" ")
      .toLowerCase();
    return keywords.some((k) => haystack.includes(k));
  };
  return all
    .filter(matches)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
