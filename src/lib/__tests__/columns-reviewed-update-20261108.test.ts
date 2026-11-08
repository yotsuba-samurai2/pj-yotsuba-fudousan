import { describe, expect, it, vi } from "vitest";
import type { AdminColumn } from "@/lib/column-shared";
import { applyReviewedUpdate, reviewedMaterial, reviewedMaterialFingerprint, reviewedUpdatePatch } from "@/lib/columns-reviewed-update";
import { FAMILY_COLUMN_UPDATE } from "@/lib/data/columns-reviewed-update-20261108";
import { SOUZOKU_LEGAL_COLUMNS_SEED } from "@/lib/data/souzoku-legal-columns-seed";

describe("reviewed family column database correction", () => {
  const slug = "kazoku-taizai-zairyu-shikakugai-katsudo-28jikan-yobiyose";
  const record = FAMILY_COLUMN_UPDATE[0];
  const seed = SOUZOKU_LEGAL_COLUMNS_SEED.find(column => column.slug === slug)!;
  const current: AdminColumn = { ...seed, ...record.original, id: "target-id", updatedAt: "2026-11-08T00:00:00.000Z" };

  it("targets only the approved family column and matches the PR504 reviewed manuscript", async () => {
    expect(FAMILY_COLUMN_UPDATE).toHaveLength(1);
    expect(record).toMatchObject({ business: "legal", slug, date: "2026-11-07", locales: ["ja", "en", "zh-tw", "zh"] });
    expect(reviewedMaterial(record.revised)).toEqual(reviewedMaterial(seed));
    expect(await reviewedMaterialFingerprint(record.original)).toBe(record.originalFingerprint);
    expect(await reviewedMaterialFingerprint(record.revised)).toBe(record.revisedFingerprint);
    expect(record.originalFingerprint).not.toBe(record.revisedFingerprint);
  });

  it("writes body and FAQ for all four languages with CAS and without publication changes", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const result = await applyReviewedUpdate(current.id, record, { get: vi.fn().mockResolvedValue(current), update });
    expect(result).toMatchObject({ state: "unchanged", updated: true });
    expect(update).toHaveBeenCalledExactlyOnceWith(current.id, reviewedUpdatePatch(current, record), current.updatedAt);
    const patch = update.mock.calls[0][1];
    expect(patch.faq).toEqual(seed.faq);
    for (const locale of ["en", "zh-tw", "zh"] as const) {
      expect(patch.translations[locale].faq).toEqual(seed.translations[locale].faq);
      expect(patch.translations[locale].content).toEqual(seed.translations[locale].content);
    }
    for (const field of ["business", "slug", "status", "date", "locales", "tags", "author", "category"]) expect(patch).not.toHaveProperty(field);
  });

  it("does not write a different article, a hand-edited article, or the corrected article", async () => {
    for (const changed of [
      { ...current, slug: "another-article" },
      { ...current, content: current.content + "\nManual edit" },
      { ...current, ...reviewedUpdatePatch(current, record) },
    ]) {
      const update = vi.fn();
      await applyReviewedUpdate(current.id, record, { get: vi.fn().mockResolvedValue(changed), update });
      expect(update).not.toHaveBeenCalled();
    }
  });
});
