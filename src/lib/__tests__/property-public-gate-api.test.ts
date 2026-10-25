import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { fixture } from "@/lib/rental-import/__tests__/fixtures";
import type { AdminProperty } from "@/lib/property-shared";

const deps = vi.hoisted(() => ({ get: vi.fn(), create: vi.fn(), cas: vi.fn(), notify: vi.fn(), schedule: vi.fn() }));
vi.mock("@/lib/api-auth", () => ({ verifyAdminRequest: vi.fn(), AuthError: class extends Error {} }));
vi.mock("@/lib/db/properties", () => ({ getPropertyById: deps.get, getPropertyBySlugAdmin: deps.get, createProperty: deps.create, updatePropertyIfUnchanged: deps.cas }));
vi.mock("@/lib/property-publication-notify", () => ({ recordPropertyPublicationChange: deps.notify, scheduleDuePropertyNotifications: deps.schedule }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/flush-revalidation", () => ({ flushRevalidation: vi.fn() }));
import { PATCH } from "@/app/api/admin/bukken/[id]/route";
import { POST } from "@/app/api/admin/bukken/route";

function property(): AdminProperty {
  return { ...fixture().property, id: "test", status: "published", updatedAt: "2026-10-24T00:00:00.000Z", dealType: "house", spec: { dealType: "house", landAreaSqm: 80, privateRoadAreaSqm: 0, buildingAreaSqm: 90, builtYm: "2000-01", deliveryYm: "相談" } };
}
function request(method: string, body: unknown) { return new NextRequest("https://example.test/api/admin/bukken/test", { method, body: JSON.stringify(body) }); }
const ctx = { params: Promise.resolve({ id: "test" }) };
beforeEach(() => { vi.clearAllMocks(); deps.get.mockResolvedValue(null); deps.create.mockResolvedValue("test"); deps.cas.mockResolvedValue(true); });
function expectNoWrite() {
  expect(deps.create).not.toHaveBeenCalled(); expect(deps.cas).not.toHaveBeenCalled(); expect(deps.notify).not.toHaveBeenCalled(); expect(deps.schedule).not.toHaveBeenCalled();
}
it("POST: 画像説明に業者間情報があればDB保存・通知前に拒否する", async () => {
  const p = property(); p.images[0].alt = "元付情報 AD100";
  expect((await POST(request("POST", p))).status).toBe(400); expectNoWrite();
});
it("PATCH: 概要だけの変更でも合成後の全公開項目を検査する", async () => {
  const p = property(); deps.get.mockResolvedValue(p);
  expect((await PATCH(request("PATCH", { spec: { ...p.spec, deliveryYm: "AD100" }, expectedUpdatedAt: p.updatedAt }), ctx)).status).toBe(400); expectNoWrite();
});
it("PATCH: statusだけの公開でも保存済み翻訳の内部情報を見落とさない", async () => {
  const p = property(); p.status = "draft"; p.translations = { en: { title: "Example", description: "AD100" } }; deps.get.mockResolvedValue(p);
  expect((await PATCH(request("PATCH", { status: "published", expectedUpdatedAt: p.updatedAt }), ctx)).status).toBe(400); expectNoWrite();
});
it("許可された公開文と社内専用情報の保存は従来通り通す", async () => {
  const p = property(); p.internal = { ad: "AD100" };
  expect((await POST(request("POST", p))).status).toBe(201); expect(deps.create).toHaveBeenCalledOnce();
});
it("賃貸の許諾根拠が不足した公開は書込み・通知より先に止める", async () => {
  const p = fixture().property; p.status = "published"; delete p.internal;
  expect((await POST(request("POST", p))).status).toBe(400); expectNoWrite();
});
it("PATCHのCASが負けたら公開検査に通っても通知しない", async () => {
  const p = property(); deps.get.mockResolvedValue(p); deps.cas.mockResolvedValue(false);
  expect((await PATCH(request("PATCH", { title: "更新後", expectedUpdatedAt: p.updatedAt }), ctx)).status).toBe(409);
  expect(deps.cas).toHaveBeenCalledOnce(); expect(deps.notify).not.toHaveBeenCalled(); expect(deps.schedule).not.toHaveBeenCalled();
});
it("POST upsertも全公開項目を検査してからCASする", async () => {
  const p = property(); deps.get.mockResolvedValue(p); p.translations = { en: { title: "Example", description: "AD100" } };
  const req = new NextRequest("https://example.test/api/admin/bukken?upsert=1", { method: "POST", body: JSON.stringify({ ...p, expectedUpdatedAt: p.updatedAt }) });
  expect((await POST(req)).status).toBe(400); expectNoWrite();
});
it("清潔なPATCHはCAS保存→記録→通知の順序を守る", async () => {
  const p = property(); deps.get.mockResolvedValue(p);
  expect((await PATCH(request("PATCH", { title: "更新後", expectedUpdatedAt: p.updatedAt }), ctx)).status).toBe(200);
  expect(deps.cas.mock.invocationCallOrder[0]).toBeLessThan(deps.notify.mock.invocationCallOrder[0]);
  expect(deps.notify.mock.invocationCallOrder[0]).toBeLessThan(deps.schedule.mock.invocationCallOrder[0]);
});
