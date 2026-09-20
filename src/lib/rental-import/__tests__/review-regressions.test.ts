import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fixture, NOW } from "./fixtures";
import { validateRentalImport } from "../validation";
import { rentalPublicationError } from "../publication";
import { conditionChoiceSchema } from "../policy";
import { rentalContentDigest } from "../content-review";

beforeEach(() => vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://demo.supabase.co"));
afterEach(() => vi.unstubAllEnvs());
function published() {
  const gate = validateRentalImport(fixture(), NOW, "published"); if (!gate.ok) throw new Error(gate.reasons.join()); return gate.property;
}
describe("独立レビューの回帰検証", () => {
  it.each(["draft", "published"] as const)("終了物件を通常画面から%sに戻せない", (status) => {
    const old = published(), next = structuredClone(old); old.status = "closed"; next.status = status;
    expect(rentalPublicationError(next, NOW, old)).toContain("再公開できません");
  });
  it.each(["draft", "published", "closed"] as const)("%sでも識別情報を外して監視対象から外せない", (status) => {
    const old = published(), next = structuredClone(old); next.status = status; next.slug = "custom-rental-001";
    expect(rentalPublicationError(next, NOW, old)).toContain("識別情報");
    next.slug = old.slug; next.internal = {}; expect(rentalPublicationError(next, NOW, old)).toContain("確認記録");
  });
  it("自動取込の下書きも計算したslugに固定する", () => { const p = published(); p.status = "draft"; p.slug = "custom"; expect(rentalPublicationError(p, NOW)).toContain("slug"); });
  it("通常APIでも外部の画像URLは公開しない", () => { const p = published(); p.images[0].url = "https://provider.example/photo?token=private"; expect(rentalPublicationError(p, NOW)).toContain("自社ストレージ"); });
  it("受信期間を免除できるのはDBに存在する自動取込物件だけ", () => {
    const p = published(); const proof = p.internal!.rentalImport as { email: { receivedAt: string } }; proof.email.receivedAt = "2020-01-01T00:00:00Z";
    expect(rentalPublicationError(p, NOW)).toContain("1暦月"); expect(rentalPublicationError(p, NOW, structuredClone(p))).toBeNull();
  });
  it("条件を選択した後の本文・翻訳の照合を省略できず、照合後の変更も検出", () => {
    const v = fixture(); v.property.description = "保証料は初回50%"; v.property.translations = { en: { title: "Sample 001", description: "Initial guarantee fee 50%." } }; v.property.locales = ["ja", "en"];
    const evidence = (quote: string) => ({ checkedAt: NOW.toISOString(), reference: "https://itandibb.com/rent_rooms/123", quote });
    v.conditionChoices = [conditionChoiceSchema.parse({ rule: "strictest", field: "guarantor", basis: "同じ保証会社・同じ算定基準", options: [
      { provider: "itandi", value: "初回50%", burden: { initialPercent: 50 }, evidence: evidence("初回50%") },
      { provider: "itandi", value: "初回100%", burden: { initialPercent: 100 }, evidence: evidence("初回100%") },
    ] })];
    expect(validateRentalImport(v, NOW, "published")).toMatchObject({ ok: false, reasons: expect.arrayContaining([expect.stringContaining("contentReview")]) });
    v.property.description = "保証料は初回100%"; v.property.translations.en!.description = "Initial guarantee fee 100%.";
    const draft = validateRentalImport(v, NOW); if (!draft.ok) throw new Error(draft.reasons.join());
    v.contentReview = { checkedAt: NOW.toISOString(), digest: rentalContentDigest(draft.property), locales: ["ja", "en"], reference: "原文と日本語・英語の表示を照合" };
    expect(validateRentalImport(v, NOW, "published").ok).toBe(true);
    v.property.translations.en!.description = "Initial guarantee fee 50%."; expect(validateRentalImport(v, NOW, "published").ok).toBe(false);
  });
});
