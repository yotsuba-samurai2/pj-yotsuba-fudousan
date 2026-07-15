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
