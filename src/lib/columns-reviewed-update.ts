import type { AdminColumn, ColumnTranslation } from "@/lib/column-shared";

const TRANSLATION_LOCALES = ["en", "zh-tw", "zh"] as const;
export type ReviewedMaterial = Pick<AdminColumn, "title" | "excerpt" | "content" | "keywords" | "faq" | "translations">;
export type ReviewedUpdate = {
  business: AdminColumn["business"];
  slug: string;
  date: string;
  locales: AdminColumn["locales"];
  originalFingerprint: string;
  revisedFingerprint: string;
  original: ReviewedMaterial;
  revised: ReviewedMaterial;
  notice: string;
};
export type ReviewedUpdateCheck = { state: "ready" | "unchanged" | "blocked"; reason: string; updated?: boolean };

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).filter(key => object[key] !== undefined).sort()
    .map(key => `${JSON.stringify(key)}:${canonicalJson(object[key])}`).join(",")}}`;
}

/** Compare only the editable material. Translation author/category/tags remain untouched. */
export function reviewedMaterial(column: ReviewedMaterial): ReviewedMaterial {
  const translations: NonNullable<ReviewedMaterial["translations"]> = {};
  for (const locale of TRANSLATION_LOCALES) {
    const translation = column.translations?.[locale];
    if (translation) translations[locale] = {
      title: translation.title, excerpt: translation.excerpt, content: translation.content,
      keywords: translation.keywords ?? [], faq: translation.faq ?? [],
    };
  }
  return {
    title: column.title, excerpt: column.excerpt, content: column.content,
    keywords: column.keywords ?? [], faq: column.faq ?? [], translations,
  };
}

export async function reviewedMaterialFingerprint(column: ReviewedMaterial): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalJson(reviewedMaterial(column)));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
}

function publicLocales(locales: AdminColumn["locales"]): string[] {
  return (locales?.length ? [...locales] : ["ja", ...TRANSLATION_LOCALES]).sort();
}

export async function checkReviewedUpdate(
  current: AdminColumn | null, target: ReviewedUpdate,
): Promise<ReviewedUpdateCheck> {
  if (!current || current.business !== target.business || current.slug !== target.slug)
    return { state: "blocked", reason: "対象記事が見つからないか、URLが異なります。" };
  if (current.status !== "published" || current.date !== target.date
    || canonicalJson(publicLocales(current.locales)) !== canonicalJson(publicLocales(target.locales)))
    return { state: "blocked", reason: "公開状態・公開日・公開言語が確認稿と異なります。" };
  if (!current.updatedAt)
    return { state: "blocked", reason: "記事の更新日時を取得できません。" };
  // The checked-in fingerprints also detect stale/corrupt correction data.
  if (await reviewedMaterialFingerprint(target.original) !== target.originalFingerprint
    || await reviewedMaterialFingerprint(target.revised) !== target.revisedFingerprint)
    return { state: "blocked", reason: "確認稿の内容と指紋が一致しません。" };
  const fingerprint = await reviewedMaterialFingerprint(current);
  if (fingerprint === target.revisedFingerprint)
    return { state: "unchanged", reason: "確認稿と同じ内容です。" };
  if (fingerprint !== target.originalFingerprint)
    return { state: "blocked", reason: "確認稿の作成後に本文が変わっています。手編集を確認してください。" };
  return { state: "ready", reason: "変更前の本文と一致。訂正可能です。" };
}

export function reviewedUpdatePatch(current: AdminColumn, target: ReviewedUpdate): ReviewedMaterial {
  const translations = { ...current.translations };
  for (const locale of TRANSLATION_LOCALES) {
    const revised = target.revised.translations?.[locale];
    if (!revised) throw new Error(`確認稿の翻訳がありません: ${locale}`);
    const material: Partial<ColumnTranslation> = {
      title: revised.title, excerpt: revised.excerpt, content: revised.content,
    };
    // An absent field is deliberately not supplied, preserving existing metadata.
    if (revised.keywords !== undefined) material.keywords = revised.keywords;
    if (revised.faq !== undefined) material.faq = revised.faq;
    translations[locale] = { ...translations[locale], ...material } as ColumnTranslation;
  }
  return {
    title: target.revised.title, excerpt: target.revised.excerpt, content: target.revised.content,
    keywords: target.revised.keywords, faq: target.revised.faq, translations,
  };
}

/** Re-read immediately before the CAS write. No create/publish endpoint is used. */
export async function applyReviewedUpdate(currentId: string, target: ReviewedUpdate, io: {
  get: (id: string) => Promise<AdminColumn | null>;
  update: (id: string, patch: Partial<AdminColumn>, expectedUpdatedAt?: string) => Promise<void>;
}): Promise<ReviewedUpdateCheck> {
  const current = await io.get(currentId);
  if (current && current.id !== currentId) return { state: "blocked", reason: "再取得した記事IDが異なります。" };
  const check = await checkReviewedUpdate(current, target);
  if (check.state !== "ready" || !current) return check;
  await io.update(current.id, reviewedUpdatePatch(current, target), current.updatedAt);
  return { state: "unchanged", reason: "訂正を保存し、公開ページの更新を要求しました。", updated: true };
}
