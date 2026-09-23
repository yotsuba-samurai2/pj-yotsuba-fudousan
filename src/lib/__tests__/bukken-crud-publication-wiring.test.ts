import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const NOW = new Date("2026-09-20T03:00:00.000Z");

/**
 * 土地（非賃貸）で作る：rentalPublicationError の賃貸専用ロジック（募集期限・広告可の
 * 再検証等）を経路に持ち込まない＝この通知配線テストの関心事（before/afterの受け渡し）
 * だけを検証できる。rental-importの実配線は rental-import/__tests__/publication-wiring.test.ts
 * （import route）で検証済み。
 */
function land(over: Record<string, unknown> = {}) {
  return {
    id: "id", updatedAt: "v1",
    slug: "koishikawa-3-land", status: "published", dealType: "land", category: "other", tradeMode: "broker",
    title: "小石川3丁目 売地", priceYen: 98_000_000, locationText: "東京都文京区小石川3丁目",
    access: [{ line: "都営三田線", station: "白山", distanceM: 480 }],
    spec: { dealType: "land", landAreaSqm: 65.4, privateRoadAreaSqm: 0, landCategory: "宅地", zoning: "第一種住居地域", buildingCoverage: "60%", floorAreaRatio: "200%", legalRestrictions: "なし" },
    images: [{ url: "https://demo.supabase.co/storage/v1/object/public/column-images/bukken/land/1.jpg", alt: "外観" }],
    description: "閑静な住宅地の売地です。", infoUpdatedAt: "2026-09-20", nextUpdateAt: "2026-10-04", locales: ["ja"],
    ...over,
  };
}

/** 管理画面（通常編集）APIが保存成功時だけ公開変更通知を呼ぶことの検証。 */
const deps = vi.hoisted(() => ({
  auth: vi.fn(), getById: vi.fn(), getBySlug: vi.fn(), create: vi.fn(), update: vi.fn(), cas: vi.fn(), del: vi.fn(),
  record: vi.fn(), schedule: vi.fn(),
}));
vi.mock("@/lib/api-auth", () => ({ verifyAdminRequest: deps.auth, AuthError: class extends Error {} }));
vi.mock("@/lib/db/properties", () => ({
  getPropertyById: deps.getById, getPropertyBySlugAdmin: deps.getBySlug,
  createProperty: deps.create, updateProperty: deps.update, updatePropertyIfUnchanged: deps.cas, deleteProperty: deps.del,
}));
vi.mock("@/lib/property-publication-notify", () => ({ recordPropertyPublicationChange: deps.record, scheduleDuePropertyNotifications: deps.schedule }));
import { PATCH } from "@/app/api/admin/bukken/[id]/route";
import { POST } from "@/app/api/admin/bukken/route";

const ctx = { params: Promise.resolve({ id: "id" }) };
function req(method: string, body: unknown, query = "") { return new NextRequest(`https://example.test/api/admin/bukken${query}`, { method, body: JSON.stringify(body) }); }

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(NOW); vi.clearAllMocks(); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://demo.supabase.co"); deps.auth.mockResolvedValue({ uid: "admin" }); deps.cas.mockResolvedValue(true); deps.create.mockResolvedValue("new-id"); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });

describe("管理画面APIの公開変更通知（新規作成・PATCH）", () => {
  it.each([undefined, "stale-version"])("売買PATCHで版が未指定または古ければ書込・通知しない (%s)", async (expectedUpdatedAt) => {
    deps.getById.mockResolvedValue(land());
    const res = await PATCH(req("PATCH", { priceYen: 90_000_000, expectedUpdatedAt }), ctx);
    expect(res.status).toBe(409);
    expect(deps.cas).not.toHaveBeenCalled();
    expect(deps.update).not.toHaveBeenCalled();
    expect(deps.record).not.toHaveBeenCalled();
  });
  it.each([undefined, "stale-version"])("売買upsertも古い取得結果で上書きしない (%s)", async (expectedUpdatedAt) => {
    deps.getBySlug.mockResolvedValue(land());
    const res = await POST(req("POST", { ...land(), priceYen: 90_000_000, expectedUpdatedAt }, "?upsert=1"));
    expect(res.status).toBe(409);
    expect(deps.cas).not.toHaveBeenCalled();
    expect(deps.create).not.toHaveBeenCalled();
    expect(deps.record).not.toHaveBeenCalled();
  });
  it("売買PATCHの検証中に更新された物件をCASで保護する", async () => {
    deps.getById.mockResolvedValue(land());
    deps.cas.mockResolvedValue(false);
    const res = await PATCH(req("PATCH", { priceYen: 90_000_000, expectedUpdatedAt: "v1" }), ctx);
    expect(res.status).toBe(409);
    expect(deps.cas).toHaveBeenCalledWith("koishikawa-3-land", "v1", { priceYen: 90_000_000 });
    expect(deps.update).not.toHaveBeenCalled();
    expect(deps.record).not.toHaveBeenCalled();
  });
  it("新規作成: before=null・afterは保存内容", async () => {
    const p = land();
    const res = await POST(req("POST", p));
    expect(res.status).toBe(201);
    expect(deps.record).toHaveBeenCalledTimes(1);
    expect(deps.record.mock.calls[0][0]).toBeNull();
    expect(deps.record.mock.calls[0][1]).toMatchObject({ slug: "koishikawa-3-land" });
    expect(deps.schedule).toHaveBeenCalledWith(NOW);
  });
  it("upsert更新: before=既存・afterは新しい入力", async () => {
    const existing = land();
    deps.getBySlug.mockResolvedValue(existing);
    const res = await POST(req("POST", { ...existing, priceYen: 99_000_000, expectedUpdatedAt: "v1" }, "?upsert=1"));
    expect((await res.json()).created).toBe(false);
    expect(deps.record).toHaveBeenCalledTimes(1);
    expect(deps.record.mock.calls[0][0]).toBe(existing);
    expect(deps.record.mock.calls[0][1]).toMatchObject({ priceYen: 99_000_000 });
  });
  it("同時更新で保存に失敗した場合は通知しない", async () => {
    deps.getBySlug.mockResolvedValue(land()); deps.cas.mockResolvedValue(false);
    const res = await POST(req("POST", { ...land(), expectedUpdatedAt: "v1" }, "?upsert=1"));
    expect(res.status).toBe(409);
    expect(deps.record).not.toHaveBeenCalled();
  });
  it("PATCH: before=既存・afterはマージ後の保存内容", async () => {
    const existing = land();
    deps.getById.mockResolvedValue(existing);
    const res = await PATCH(req("PATCH", { title: "改題後", expectedUpdatedAt: "v1" }), ctx);
    expect(res.status).toBe(200);
    expect(deps.cas).toHaveBeenCalledWith(existing.slug, existing.updatedAt, { title: "改題後" });
    expect(deps.update).not.toHaveBeenCalled();
    expect(deps.record).toHaveBeenCalledTimes(1);
    expect(deps.record.mock.calls[0][0]).toBe(existing);
    expect(deps.record.mock.calls[0][1]).toMatchObject({ title: "改題後" });
    expect(deps.schedule).toHaveBeenCalledTimes(1);
  });
  it("PATCHが400等で拒否された場合は通知しない", async () => {
    deps.getById.mockResolvedValue(land());
    const res = await PATCH(req("PATCH", { dealType: "house", expectedUpdatedAt: "v1" }), ctx);
    expect(res.status).toBe(400); // spec.dealTypeとの不一致で拒否される
    expect(deps.record).not.toHaveBeenCalled();
  });
});
