import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(), get: vi.fn(), create: vi.fn(), upsert: vi.fn(), update: vi.fn(), remove: vi.fn(),
  tag: vi.fn(), path: vi.fn(), flush: vi.fn(), after: vi.fn(), indexnow: vi.fn(),
}));
vi.mock("@/lib/api-auth", () => ({ verifyAdminRequest: mocks.auth,
  AuthError: class extends Error { constructor(message: string, public status: number) { super(message); } },
}));
vi.mock("@/lib/db/columns", () => ({ getColumnById: mocks.get, getColumns: vi.fn(),
  createColumn: mocks.create, upsertColumnBySlug: mocks.upsert, updateColumn: mocks.update, deleteColumn: mocks.remove,
}));
vi.mock("@/lib/flush-revalidation", () => ({ flushRevalidation: mocks.flush }));
vi.mock("next/cache", () => ({ revalidateTag: mocks.tag, revalidatePath: mocks.path }));
vi.mock("next/server", async importOriginal => ({ ...await importOriginal<typeof import("next/server")>(), after: mocks.after }));
vi.mock("@/lib/indexnow", () => ({ submitToIndexNow: mocks.indexnow }));
import { POST } from "@/app/api/admin/columns/route";
import { PATCH, DELETE } from "@/app/api/admin/columns/[id]/route";
import { AuthError } from "@/lib/api-auth";
import { COLUMN_LOCALE_CACHE_TAG } from "@/lib/column-language-links";

const column = { id: "column-id", business: "labor", slug: "before", title: "Title", status: "published", locales: ["ja"] };
const ctx = { params: Promise.resolve({ id: column.id }) };
const request = (method: string, body?: unknown, query = "") => new NextRequest(`https://luck428.com/api/admin/columns${query}`, {
  method, headers: { "content-type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});
beforeEach(() => {
  vi.resetAllMocks(); vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.get.mockResolvedValue(column); mocks.create.mockResolvedValue(column.id);
  mocks.upsert.mockResolvedValue({ id: column.id, action: "updated" });
});
afterEach(() => vi.restoreAllMocks());

function expectLocation(path: string) {
  for (const locale of ["ja", "en", "zh-tw", "zh"]) expect(mocks.path).toHaveBeenCalledWith(`/${locale}${path}`);
}

it.each([
  { locales: ["ja", "en"] }, { locales: ["ja"] }, { locales: [] },
  { status: "deleted" }, { status: "draft" }, { status: "published" },
])("invalidates inside PATCH after a successful mutation: %j", async changes => {
  const response = await PATCH(request("PATCH", changes), ctx);
  expect(response.status).toBe(200);
  expect(mocks.update).toHaveBeenCalledWith(column.id, changes);
  expect(mocks.tag).toHaveBeenCalledWith(COLUMN_LOCALE_CACHE_TAG, { expire: 0 });
  expect(mocks.tag.mock.invocationCallOrder[0]).toBeGreaterThan(mocks.update.mock.invocationCallOrder[0]);
  expectLocation("/labor/column/before");
  expect(mocks.path).toHaveBeenCalledWith("/[locale]/(labor)", "layout");
  expect(mocks.path).toHaveBeenCalledWith("/sitemap.xml");
});

it("invalidates both old and new slug and business, including their lists", async () => {
  await PATCH(request("PATCH", { business: "legal", slug: "after" }), ctx);
  expectLocation("/labor/column/before"); expectLocation("/legal/column/after");
  expect(mocks.path).toHaveBeenCalledWith("/[locale]/(labor)", "layout");
  expect(mocks.path).toHaveBeenCalledWith("/[locale]/(legal)", "layout");
});

it.each(["", "?upsert=1"])("invalidates created or upserted records in POST %s", async query => {
  const response = await POST(request("POST", { ...column, business: "realestate" }, query));
  expect(response.status).toBe(query ? 200 : 201);
  const mutation = query ? mocks.upsert : mocks.create;
  expect(mutation).toHaveBeenCalledOnce();
  expect(mocks.tag.mock.invocationCallOrder[0]).toBeGreaterThan(mutation.mock.invocationCallOrder[0]);
  expectLocation("/column/before");
});

it("invalidates after a physical DELETE as well as soft delete", async () => {
  expect((await DELETE(request("DELETE"), ctx)).status).toBe(200);
  expect(mocks.remove).toHaveBeenCalledWith(column.id);
  expect(mocks.tag.mock.invocationCallOrder[0]).toBeGreaterThan(mocks.remove.mock.invocationCallOrder[0]);
  expectLocation("/labor/column/before");
});

it.each(["POST", "UPSERT", "PATCH", "DELETE"])("reports a completed mutation with failed publication refresh as 503: %s", async method => {
  mocks.tag.mockImplementation(() => { throw new Error("cache unavailable"); });
  const response = method === "POST" || method === "UPSERT"
    ? await POST(request("POST", column, method === "UPSERT" ? "?upsert=1" : ""))
    : method === "PATCH" ? await PATCH(request("PATCH", { status: "draft" }), ctx) : await DELETE(request("DELETE"), ctx);
  expect(response.status).toBe(503);
  expect(await response.json()).toMatchObject({ mutationSucceeded: true, error: expect.stringContaining("保存・削除は完了") });
  expect(mocks.after).not.toHaveBeenCalled();
});

it("does not invalidate when DB update fails", async () => {
  mocks.update.mockRejectedValue(new Error("DB unavailable"));
  expect((await PATCH(request("PATCH", { status: "draft" }), ctx)).status).toBe(500);
  expect(mocks.tag).not.toHaveBeenCalled();
});

it("rejects unauthenticated mutations without updating or invalidating", async () => {
  mocks.auth.mockRejectedValue(new AuthError("Unauthorized", 401));
  expect((await POST(request("POST", column))).status).toBe(401);
  expect(mocks.create).not.toHaveBeenCalled(); expect(mocks.tag).not.toHaveBeenCalled();
});

it("returns 404 for a missing record without invalidating", async () => {
  mocks.get.mockResolvedValue(null);
  expect((await DELETE(request("DELETE"), ctx)).status).toBe(404);
  expect(mocks.remove).not.toHaveBeenCalled(); expect(mocks.tag).not.toHaveBeenCalled();
});

it("schedules the existing search notification after the response", async () => {
  await PATCH(request("PATCH", { slug: "after" }), ctx);
  expect(mocks.indexnow).not.toHaveBeenCalled();
  await mocks.after.mock.calls[0][0]();
  expect(mocks.indexnow).toHaveBeenCalledWith(expect.arrayContaining(["/labor/column/before", "/en/labor/column/after"]));
});

it.each(["POST", "PATCH"])("keeps %s successful if search notification scheduling fails", async method => {
  mocks.after.mockImplementation(() => { throw new Error("scheduling unavailable"); });
  const response = method === "POST" ? await POST(request("POST", column)) : await PATCH(request("PATCH", { status: "draft" }), ctx);
  expect(response.status).toBe(method === "POST" ? 201 : 200);
  expect(mocks.tag).toHaveBeenCalledWith(COLUMN_LOCALE_CACHE_TAG, { expire: 0 });
});

it("isolates unexpected errors in the notification callback", async () => {
  mocks.indexnow.mockRejectedValue(new Error("notification unavailable"));
  await PATCH(request("PATCH", { status: "draft" }), ctx);
  await expect(mocks.after.mock.calls[0][0]()).resolves.toBeUndefined();
});


it.each(["POST", "UPSERT", "PATCH", "DELETE"])("awaits asynchronous cache failure and reports the mutation as saved: %s", async method => {
  mocks.flush.mockRejectedValue(new Error("asynchronous storage rejection"));
  const response = method === "POST" || method === "UPSERT"
    ? await POST(request("POST", column, method === "UPSERT" ? "?upsert=1" : ""))
    : method === "PATCH" ? await PATCH(request("PATCH", { status: "draft" }), ctx) : await DELETE(request("DELETE"), ctx);
  expect(response.status).toBe(503);
  expect(await response.json()).toMatchObject({ mutationSucceeded: true, error: expect.stringContaining("保存・削除は完了") });
  expect(mocks.after).not.toHaveBeenCalled();
});

it("does not send a successful mutation response before invalidation completes", async () => {
  let release!: () => void;
  let completed = false;
  mocks.flush.mockImplementation(() => new Promise<void>(resolve => { release = resolve; }));
  const result = PATCH(request("PATCH", { status: "draft" }), ctx).then(response => { completed = true; return response; });
  await vi.waitFor(() => expect(mocks.flush).toHaveBeenCalledOnce());
  expect(completed).toBe(false);
  expect(mocks.after).not.toHaveBeenCalled();
  release();
  expect((await result).status).toBe(200);
});
