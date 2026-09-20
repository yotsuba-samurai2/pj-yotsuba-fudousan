import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { fixture, NOW } from "./fixtures";
import { validateRentalImport } from "../validation";
const deps = vi.hoisted(() => ({ auth: vi.fn(), get: vi.fn(), create: vi.fn(), update: vi.fn(), cas: vi.fn() }));
vi.mock("@/lib/api-auth", () => ({ verifyAdminRequest: deps.auth, AuthError: class extends Error {} }));
vi.mock("@/lib/db/properties", () => ({ getPropertyById: deps.get, getPropertyBySlugAdmin: deps.get, createProperty: deps.create, updateProperty: deps.update, updatePropertyIfUnchanged: deps.cas }));
import { PATCH } from "@/app/api/admin/bukken/[id]/route";
import { POST } from "@/app/api/admin/bukken/route";
function published() { const r = validateRentalImport(fixture(), NOW, "published"); if (!r.ok) throw new Error(r.reasons.join()); return { ...r.property, id: "id", updatedAt: NOW.toISOString() }; }
function req(method: string, body: unknown) { return new NextRequest("https://example.test/api/admin/bukken?upsert=1", { method, body: JSON.stringify(body) }); }
const ctx = { params: Promise.resolve({ id: "id" }) };
beforeEach(() => { vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(NOW); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://demo.supabase.co"); deps.auth.mockResolvedValue({ uid: "admin" }); deps.cas.mockResolvedValue(true); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
describe("通常編集APIの賃貸同時更新保護", () => {
  it("古い編集画面の保存を拒否", async () => {
    const p = published(); deps.get.mockResolvedValue(p);
    expect((await PATCH(req("PATCH", { description: p.description, expectedUpdatedAt: "2020-01-01T00:00:00Z" }), ctx)).status).toBe(409);
    expect(deps.cas).not.toHaveBeenCalled(); expect(deps.update).not.toHaveBeenCalled();
  });
  it("検証後に終了された場合にもCASで上書きしない", async () => {
    const p = published(); deps.get.mockResolvedValue(p); deps.cas.mockResolvedValue(false);
    expect((await PATCH(req("PATCH", { description: p.description, expectedUpdatedAt: p.updatedAt }), ctx)).status).toBe(409);
    expect(deps.cas).toHaveBeenCalledWith(p.slug, p.updatedAt, { description: p.description }); expect(deps.update).not.toHaveBeenCalled();
  });
  it("終了を知っている画面でも再公開できない", async () => {
    const p = published(); deps.get.mockResolvedValue({ ...p, status: "closed" });
    expect((await PATCH(req("PATCH", { status: "published", expectedUpdatedAt: p.updatedAt }), ctx)).status).toBe(400);
    expect(deps.cas).not.toHaveBeenCalled();
  });
  it("upsertでも古い版・同時更新は上書きしない", async () => {
    const p = published(); deps.get.mockResolvedValue(p);
    expect((await POST(req("POST", p))).status).toBe(409);
    deps.cas.mockResolvedValue(false);
    expect((await POST(req("POST", { ...p, expectedUpdatedAt: p.updatedAt }))).status).toBe(409);
    expect(deps.create).not.toHaveBeenCalled(); expect(deps.update).not.toHaveBeenCalled();
  });
  it("新規upsertの検証後に他処理で作成済みなら更新に切り替えない", async () => {
    deps.get.mockResolvedValue(null); deps.create.mockRejectedValue({ code: "P2002" });
    expect((await POST(req("POST", published()))).status).toBe(409);
    expect(deps.cas).not.toHaveBeenCalled(); expect(deps.update).not.toHaveBeenCalled();
  });
});
