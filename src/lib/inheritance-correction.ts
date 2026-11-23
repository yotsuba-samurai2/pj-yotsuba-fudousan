import type { AdminColumn, ColumnTranslation } from "@/lib/column-shared";
import { isColumnUpdateTimestamp } from "@/lib/column-update-conflict";
import { canonicalJson, reviewedMaterialFingerprint, type ReviewedMaterial } from "@/lib/columns-reviewed-update";
import type { LangCode } from "@/config/languages";
import type { CorrectionDiff, CorrectionPreview, InheritanceCorrectionBusiness } from "@/lib/inheritance-correction-types";

const TRANSLATIONS = ["en", "zh-tw", "zh"] as const;
const FIELDS = ["excerpt", "content", "faq"] as const;

export type InheritanceTarget = {
  business: InheritanceCorrectionBusiness;
  slug: string;
  date: string;
  locales: readonly LangCode[];
  originalFingerprint: string;
  revisedFingerprint: string;
  revised: ReviewedMaterial;
};

function onlyCorrectionFields(input: ReviewedMaterial): ReviewedMaterial {
  const translations: NonNullable<ReviewedMaterial["translations"]> = {};
  for (const lang of TRANSLATIONS) {
    const source = input.translations?.[lang];
    if (source) translations[lang] = {
      title: source.title, excerpt: source.excerpt, content: source.content, faq: source.faq,
    };
  }
  return { title: input.title, excerpt: input.excerpt, content: input.content, faq: input.faq, translations };
}

/** Compare public editorial material; preserve all other fields, even if they differ from the seed. */
export function inheritanceFingerprint(column: ReviewedMaterial) {
  return reviewedMaterialFingerprint(onlyCorrectionFields(column));
}

const normalizedLocales = (locales: readonly LangCode[] | undefined) =>
  [...(locales?.length ? locales : ["ja", ...TRANSLATIONS])].sort();
const same = (a: unknown, b: unknown) => canonicalJson(a) === canonicalJson(b);

function patchFor(current: AdminColumn, revised: ReviewedMaterial) {
  const patch: Partial<AdminColumn> = {};
  if (current.content !== revised.content) patch.content = revised.content;
  if (current.excerpt !== revised.excerpt) patch.excerpt = revised.excerpt;
  if (!same(current.faq ?? [], revised.faq ?? [])) patch.faq = revised.faq ?? [];

  const translations = { ...current.translations };
  let changed = false;
  for (const lang of TRANSLATIONS) {
    const live = translations[lang];
    const target = revised.translations?.[lang];
    if (!live || !target) continue;
    const next: ColumnTranslation = { ...live };
    if (live.content !== target.content) next.content = target.content;
    if (live.excerpt !== target.excerpt) next.excerpt = target.excerpt;
    if (!same(live.faq ?? [], target.faq ?? [])) next.faq = target.faq ?? [];
    if (!same(next, live)) { translations[lang] = next; changed = true; }
  }
  if (changed) patch.translations = translations;
  return patch;
}

function diffFor(current: AdminColumn, revised: ReviewedMaterial, locales: readonly LangCode[]): CorrectionDiff[] {
  const values: CorrectionDiff[] = [];
  for (const lang of locales) {
    const before = lang === "ja" ? current : current.translations?.[lang];
    const after = lang === "ja" ? revised : revised.translations?.[lang];
    if (!before || !after) continue;
    for (const field of FIELDS) {
      const from = before[field] ?? (field === "faq" ? [] : "");
      const to = after[field] ?? (field === "faq" ? [] : "");
      if (!same(from, to)) values.push({ lang, field, before: from, after: to });
    }
  }
  return values;
}

/** Server is the authority: a client cannot supply article fields or the expected hashes. */
export async function inspectInheritanceCorrection(current: AdminColumn | null, target: InheritanceTarget):
  Promise<{ preview: CorrectionPreview; patch?: Partial<AdminColumn> }> {
  const common = {
    business: target.business, slug: target.slug,
    title: target.revised.translations?.["zh-tw"]?.title && !target.locales.includes("ja")
      ? target.revised.translations["zh-tw"].title : target.revised.title,
    locales: target.locales, date: target.date,
  };
  const stopped = (reason: string) => ({
    preview: { ...common, state: "blocked" as const, reason, changes: [] },
  });
  if (!current || current.business !== target.business || current.slug !== target.slug) {
    return stopped("特定の記事を取得できません。新規作成しません。");
  }
  if (current.status !== "published" || current.date !== target.date
      || !same(normalizedLocales(current.locales), normalizedLocales(target.locales))) {
    return stopped("公開状態・公開日・公開言語が確認稿と異なります。");
  }
  if (!current.updatedAt || !isColumnUpdateTimestamp(current.updatedAt)) {
    return stopped("現在の記事の版を確認できません。");
  }
  if (target.originalFingerprint === target.revisedFingerprint
      || await inheritanceFingerprint(target.revised) !== target.revisedFingerprint) {
    return stopped("訂正稿の指紋が一致しません。");
  }
  const state = await inheritanceFingerprint(current);
  if (state === target.revisedFingerprint) {
    return { preview: { ...common, state: "unchanged", reason: "訂正稿と一致しています。再保存しません。", changes: [] } };
  }
  if (state !== target.originalFingerprint) {
    return stopped("元の原稿と一致しません。CMSの手編集を優先し、上書きしません。");
  }
  const patch = patchFor(current, target.revised);
  if (Object.keys(patch).length === 0
      || await inheritanceFingerprint({ ...current, ...patch }) !== target.revisedFingerprint) {
    return stopped("差替え後の指紋が確認稿と一致しません。");
  }
  return {
    patch,
    preview: {
      ...common, state: "ready", reason: "現行の原稿は承認前の版と一致。差分を確認できます。",
      changes: diffFor(current, target.revised, target.locales),
      confirmation: { business: target.business, slug: target.slug, expectedUpdatedAt: current.updatedAt,
        originalFingerprint: target.originalFingerprint, revisedFingerprint: target.revisedFingerprint },
    },
  };
}
