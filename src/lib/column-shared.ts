import type { LangCode } from "@/config/languages";

/**
 * コラムの型定義とロケール判定ヘルパー（クライアント/サーバー共用）。
 * Prisma を import しないこと（クライアントバンドルに含められる前提の純粋モジュール）。
 */

export type BusinessKey = "realestate" | "legal" | "labor";

export type ColumnStatus = "draft" | "published" | "deleted";

export type ColumnTranslation = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  keywords?: string[];
  tags?: string[];
  author?: { name: string; title: string };
  faq?: Array<{ question: string; answer: string }>;
};

/** 旧 columns.ts の ColumnTranslationLocalized と同形（互換エイリアス） */
export type ColumnTranslationLocalized = ColumnTranslation;

/** 公開ページ用のコラム型（旧 src/lib/columns.ts の Column と同形） */
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
  /** このコラムを公開する言語。空配列＝全言語（Firestore時代の「未設定」と等価） */
  locales?: LangCode[];
  translations?: {
    en?: ColumnTranslationLocalized;
    "zh-tw"?: ColumnTranslationLocalized;
    zh?: ColumnTranslationLocalized;
  };
};

/** admin CRUD用のコラム型（旧 FirestoreColumn と同形。timestampはISO文字列） */
export type AdminColumn = {
  id: string;
  business: BusinessKey;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  status: ColumnStatus;
  modifiedDate?: string;
  ogImage?: string;
  author?: { name: string; title: string };
  keywords?: string[];
  faq?: Array<{ question: string; answer: string }>;
  tags?: string[];
  /** このコラムを公開する言語。空配列＝全言語（後方互換のデフォルト） */
  locales?: LangCode[];
  translations?: {
    en?: ColumnTranslation;
    "zh-tw"?: ColumnTranslation;
    zh?: ColumnTranslation;
  };
  createdAt?: string;
  updatedAt?: string;
};

/** 互換エイリアス（旧 src/lib/firestore/columns.ts の FirestoreColumn） */
export type FirestoreColumn = AdminColumn;

/** 作成・upsert用の入力型 */
export type ColumnInput = Omit<AdminColumn, "id" | "createdAt" | "updatedAt">;

// ── Locale-aware helpers ──

/** locales 空配列（旧: 未設定）＝全言語許可。設定済みなら現在ロケールを含むかで判定 */
export function isLocaleAllowed(column: Column, locale: LangCode): boolean {
  return (
    !column.locales ||
    column.locales.length === 0 ||
    column.locales.includes(locale)
  );
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

// ── Internal linking helpers（main由来の純関数。Prisma非依存＝クライアント共用可） ──

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
