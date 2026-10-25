import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const deps = vi.hoisted(() => ({ find: vi.fn(), remove: vi.fn(), unsafeRemove: vi.fn(), auth: vi.fn(), notify: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { property: { findUnique: deps.find, deleteMany: deps.remove, delete: deps.unsafeRemove } } }));
vi.mock("@/lib/api-auth", () => ({ verifyAdminRequest: deps.auth, AuthError: class extends Error {} }));
vi.mock("@/lib/property-publication-notify", () => ({ recordPropertyPublicationChange: deps.notify, scheduleDuePropertyNotifications: deps.notify }));
import { deleteProperty } from "../db/properties";
import { DELETE } from "@/app/api/admin/bukken/[id]/route";

const at = "2026-10-24T12:00:00.000Z", later = "2026-10-24T12:01:00.000Z", id = "00000000-0000-4000-8000-000000000001";
function fixture() {
  return { id, slug: "synthetic", status: "draft", dealType: "land", category: "other", tradeMode: "broker", title: "synthetic",
    priceYen: BigInt(123), priceNote: null, locationText: "synthetic", access: [], spec: {}, images: [], description: "synthetic",
    publishedAt: null, infoUpdatedAt: "2026-10-24", nextUpdateAt: "2026-10-25", locales: ["ja"], translations: null, internal: null,
    createdAt: new Date(at), updatedAt: new Date(at) };
}
let row: ReturnType<typeof fixture> | null, mutateAfterRead: (() => void) | undefined;
beforeEach(() => {
  vi.clearAllMocks(); row = fixture(); mutateAfterRead = undefined;
  deps.auth.mockResolvedValue({ uid: "test-admin" });
  deps.find.mockImplementation(async () => { const found = structuredClone(row); mutateAfterRead?.(); return found; });
  deps.remove.mockImplementation(async ({ where }: { where: { id: string; status: string; updatedAt: Date } }) => {
    if (!row || row.id !== where.id || row.status !== where.status || row.updatedAt.getTime() !== where.updatedAt.getTime()) return { count: 0 };
    row = null; return { count: 1 };
  });
});
const request = () => new NextRequest("https://example.test/api/admin/bukken/" + id, { method: "DELETE" });
const context = () => ({ params: Promise.resolve({ id }) });

it("既存のbody無しDELETEで変更のない下書きだけを削除する", async () => {
  const response = await DELETE(request(), context());
  expect(response.status).toBe(200); expect(await response.json()).toEqual({ ok: true });
  expect(row).toBeNull();
  expect(deps.remove).toHaveBeenCalledWith({ where: { id, status: "draft", updatedAt: new Date(at) } });
  expect(deps.unsafeRemove).not.toHaveBeenCalled(); expect(deps.notify).not.toHaveBeenCalled();
});

it.each(["published", "closed", "edited", "removed", "published-same-timestamp"])("確認後の%s変更と競合したら削除せず409", async kind => {
  mutateAfterRead = () => {
    if (kind === "removed") { row = null; return; }
    if (kind === "edited") row!.title = "manual edit";
    else row!.status = kind === "closed" ? "closed" : "published";
    if (kind !== "published-same-timestamp") row!.updatedAt = new Date(later);
  };
  const response = await DELETE(request(), context());
  expect(response.status).toBe(409);
  if (kind !== "removed") expect(row).not.toBeNull();
  if (kind === "edited") expect(row!.title).toBe("manual edit");
  expect(deps.unsafeRemove).not.toHaveBeenCalled(); expect(deps.notify).not.toHaveBeenCalled();
});

it.each(["published", "closed"])("最初から%sの物件は400でDB削除も呼ばない", async status => {
  row!.status = status;
  expect((await DELETE(request(), context())).status).toBe(400);
  expect(deps.remove).not.toHaveBeenCalled();
});

it("初回読取りで存在しなければ404", async () => {
  row = null;
  expect((await DELETE(request(), context())).status).toBe(404);
  expect(deps.remove).not.toHaveBeenCalled();
});

it.each(["", "invalid", "2026-10-24", "2026-10-24T12:00:00Z"])("不正/非標準の期待日時%sではDBを呼ばない", async expected => {
  expect(await deleteProperty(id, expected)).toBe(false);
  expect(deps.remove).not.toHaveBeenCalled(); expect(row).not.toBeNull();
});
