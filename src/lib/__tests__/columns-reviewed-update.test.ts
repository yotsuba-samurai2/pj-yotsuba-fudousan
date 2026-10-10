import { describe, expect, it, vi } from "vitest";
import type { AdminColumn } from "@/lib/column-shared";
import {
  applyReviewedUpdate, checkReviewedUpdate, reviewedMaterialFingerprint, reviewedUpdatePatch,
  type ReviewedUpdate,
} from "@/lib/columns-reviewed-update";
import { REVIEWED_COLUMN_UPDATES } from "@/lib/data/columns-reviewed-update-20261010";

function fixture(): AdminColumn {
  return {
    id: "anonymous-id", business: "labor", slug: "anonymous-article", date: "2026-10-09",
    status: "published", category: "category", title: "Old", excerpt: "Old summary", content: "Old body",
    locales: ["ja", "en", "zh-tw", "zh"], tags: ["keep"], author: { name: "Office", title: "Editor" },
    updatedAt: "2026-10-10T03:00:00.000Z", modifiedDate: "2026-10-09", keywords: ["old"],
    translations: Object.fromEntries(["en", "zh-tw", "zh"].map(locale => [locale, {
      title: `${locale} old`, excerpt: "Summary", content: "Body", category: "Keep category",
      author: { name: "Keep author", title: "Editor" }, tags: ["keep translated"],
    }])),
  };
}
async function target(old: AdminColumn): Promise<ReviewedUpdate> {
  const revised = { ...old, title: "Corrected", content: "Corrected general guidance with retained uncertainty",
    translations: Object.fromEntries(["en", "zh-tw", "zh"].map(locale => [locale, {
      title: `${locale} corrected`, excerpt: "New summary", content: "Corrected qualified general guidance",
      faq: [{ question: "Question", answer: "Qualified answer" }],
    }])),
  };
  return {
    business: old.business, slug: old.slug, date: old.date, locales: old.locales, original: old, revised,
    originalFingerprint: await reviewedMaterialFingerprint(old), revisedFingerprint: await reviewedMaterialFingerprint(revised),
    notice: "Specific legal approval remains pending.",
  };
}

describe("published-column corrections", () => {
  it("updates original material with timestamp CAS and keeps protected fields and translation metadata", async () => {
    const old = fixture(); const record = await target(old);
    const update = vi.fn().mockResolvedValue(undefined);
    const result = await applyReviewedUpdate(old.id, record, { get: vi.fn().mockResolvedValue(old), update });
    expect(result.state).toBe("unchanged");
    expect(update).toHaveBeenCalledTimes(1);
    const patch = update.mock.calls[0][1];
    expect(update.mock.calls[0][2]).toBe(old.updatedAt);
    expect(Object.keys(patch).sort()).toEqual(["content", "excerpt", "faq", "keywords", "title", "translations"]);
    for (const field of ["business", "slug", "status", "date", "locales", "modifiedDate", "tags", "author"]) expect(patch).not.toHaveProperty(field);
    expect(patch.translations.en).toMatchObject({ category: "Keep category", author: old.translations?.en?.author, tags: ["keep translated"] });
  });
  it("skips an already corrected article on repeat", async () => {
    const old = fixture(); const record = await target(old); const update = vi.fn();
    const current = { ...old, ...reviewedUpdatePatch(old, record) };
    expect((await applyReviewedUpdate(old.id, record, { get: vi.fn().mockResolvedValue(current), update })).state).toBe("unchanged");
    expect(update).not.toHaveBeenCalled();
  });
  it("rejects human edits made after the original snapshot including translation edits", async () => {
    const old = fixture(); const record = await target(old);
    expect((await checkReviewedUpdate({ ...old, content: "Human edit" }, record)).state).toBe("blocked");
    expect((await checkReviewedUpdate({ ...old, translations: { ...old.translations, en: { ...old.translations!.en!, title: "Human translation" } } }, record)).state).toBe("blocked");
  });
  it.each(["business", "slug", "status", "date", "locales", "updatedAt"])("rejects a protected field mismatch: %s", async field => {
    const old = fixture(); const record = await target(old); const update = vi.fn();
    const changed = { ...old, [field]: field === "locales" ? ["ja"] : field === "updatedAt" ? undefined : "different" } as AdminColumn;
    expect((await applyReviewedUpdate(old.id, record, { get: vi.fn().mockResolvedValue(changed), update })).state).toBe("blocked");
    expect(update).not.toHaveBeenCalled();
  });
  it("re-reads by ID and propagates a conflict instead of continuing", async () => {
    const old = fixture(); const record = await target(old); const get = vi.fn().mockResolvedValue(old);
    const conflict = new Error("Conflict"); const update = vi.fn().mockRejectedValue(conflict);
    await expect(applyReviewedUpdate(old.id, record, { get, update })).rejects.toBe(conflict);
    expect(get).toHaveBeenCalledWith(old.id);
  });
  it("accepts equivalent all-language storage but does not change it", async () => {
    const old = fixture(); const record = await target(old);
    expect((await checkReviewedUpdate({ ...old, locales: [] }, record)).state).toBe("ready");
  });
  it("detects changed correction data", async () => {
    const old = fixture(); const record = await target(old); record.revised.content = "Not the reviewed revision";
    expect((await checkReviewedUpdate(old, record)).state).toBe("blocked");
  });
  it("has exactly 18 unique fixed targets with all 72 translations and matching generated fingerprints", async () => {
    expect(REVIEWED_COLUMN_UPDATES).toHaveLength(18);
    expect(new Set(REVIEWED_COLUMN_UPDATES.map(row => `${row.business}:${row.slug}`)).size).toBe(18);
    for (const record of REVIEWED_COLUMN_UPDATES) {
      expect(await reviewedMaterialFingerprint(record.original)).toBe(record.originalFingerprint);
      expect(await reviewedMaterialFingerprint(record.revised)).toBe(record.revisedFingerprint);
      for (const locale of ["en", "zh-tw", "zh"] as const) expect(record.revised.translations?.[locale]?.content).toBeTruthy();
    }
  });
});
