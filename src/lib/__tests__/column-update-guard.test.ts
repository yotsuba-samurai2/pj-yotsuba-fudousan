import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
const mocks = vi.hoisted(() => ({ get: vi.fn(), update: vi.fn(), auth: vi.fn(), refresh: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { column: { findUnique: mocks.get, update: mocks.update } } }));
vi.mock("@/lib/api-auth", () => ({ verifyAdminRequest: mocks.auth, AuthError: class extends Error {} }));
vi.mock("@/lib/column-publication-cache", () => ({ refreshColumnPublication: mocks.refresh, ColumnPublicationRefreshError: class extends Error {} }));
import { PATCH } from "@/app/api/admin/columns/[id]/route";
import { updateColumn } from "@/lib/db/columns";
import { ColumnUpdateConflictError, isColumnUpdateTimestamp } from "@/lib/column-update-conflict";
const stamp = "2026-10-10T03:00:00.000Z";
const row = { id: "anonymous-id", business: "labor", slug: "anonymous-article", title: "Old", excerpt: "Summary", content: "Old body", status: "published", date: "2026-10-09", category: "Category", keywords: [], tags: [], locales: [], createdAt: new Date(stamp), updatedAt: new Date(stamp) };
const ctx = { params: Promise.resolve({ id: row.id }) };
function request(timestamp?: string) {
  return new NextRequest(`https://example.test/api/admin/columns/${row.id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json", ...(timestamp === undefined ? {} : { "X-Column-Updated-At": timestamp }) },
    body: JSON.stringify({ title: "Corrected" }),
  });
}
beforeEach(() => { vi.resetAllMocks(); mocks.get.mockResolvedValue(row); mocks.update.mockResolvedValue(row); });
it("enforces expected updatedAt atomically in the Prisma write", async () => {
  expect((await PATCH(request(stamp), ctx)).status).toBe(200);
  expect(mocks.update.mock.calls[0][0].where).toEqual({ id: row.id, updatedAt: new Date(stamp) });
  expect(mocks.update.mock.calls[0][0].data.modifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(mocks.refresh).toHaveBeenCalledTimes(1);
});
it("returns 409 for a race and does not refresh or retry", async () => {
  mocks.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("not found", { code: "P2025", clientVersion: "fixture" }));
  expect((await PATCH(request(stamp), ctx)).status).toBe(409);
  expect(mocks.update).toHaveBeenCalledTimes(1); expect(mocks.refresh).not.toHaveBeenCalled();
  await expect(updateColumn(row.id, { title: "Corrected" }, stamp)).rejects.toBeInstanceOf(ColumnUpdateConflictError);
});
it.each(["", "invalid", "2026-02-31T03:00:00.000Z", "2026-10-10"])("rejects invalid header before any DB call: %s", async timestamp => {
  expect(isColumnUpdateTimestamp(timestamp)).toBe(false);
  expect((await PATCH(request(timestamp), ctx)).status).toBe(400);
  expect(mocks.get).not.toHaveBeenCalled(); expect(mocks.update).not.toHaveBeenCalled();
});
it("preserves the existing two-argument update without a guard", async () => {
  expect((await PATCH(request(), ctx)).status).toBe(200);
  expect(mocks.update.mock.calls[0][0].where).toEqual({ id: row.id });
});
