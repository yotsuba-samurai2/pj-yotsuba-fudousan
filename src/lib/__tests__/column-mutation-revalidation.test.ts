import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({
  getColumnById: vi.fn(), createColumn: vi.fn(), updateColumn: vi.fn(),
  deleteColumn: vi.fn(), upsertColumnBySlug: vi.fn(), verifyAdminRequest: vi.fn(),
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), flush: vi.fn(), indexnow: vi.fn(),
}));
vi.mock("@/lib/db/columns", () => mocks);
vi.mock("@/lib/api-auth", () => ({ verifyAdminRequest: mocks.verifyAdminRequest, AuthError: class extends Error {} }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath, revalidateTag: mocks.revalidateTag }));
vi.mock("@/lib/flush-revalidation", () => ({ flushRevalidation: mocks.flush }));
vi.mock("@/lib/indexnow", () => ({ submitToIndexNow: mocks.indexnow }));
import { POST } from "@/app/api/admin/columns/route";
import { PATCH, DELETE } from "@/app/api/admin/columns/[id]/route";
import { COLUMN_LOCALE_CACHE_TAG } from "@/lib/column-language-links";

const existing = { id: "test", business: "labor", slug: "a", title: "Test", status: "published", locales: ["ja"] };
const ctx = { params: Promise.resolve({ id: existing.id }) };
function request(method: string, body?: object, query = "") {
  return new NextRequest(`http://localhost/api/admin/columns${query}`, {
    method, ...(body && { body: JSON.stringify(body), headers: { "content-type": "application/json" } }),
  });
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.getColumnById.mockResolvedValue({ ...existing });
  mocks.createColumn.mockResolvedValue(existing.id);
  mocks.upsertColumnBySlug.mockResolvedValue({ id: existing.id, action: "updated" });
});
function expectInvalidated(business = "labor", slug = "a") {
  expect(mocks.revalidateTag).toHaveBeenCalledWith(COLUMN_LOCALE_CACHE_TAG, { expire: 0 });
  const prefix = business === "realestate" ? "" : `/${business}`;
  for (const locale of ["ja", "en", "zh-tw", "zh"]) {
    expect(mocks.revalidatePath).toHaveBeenCalledWith(`/${locale}${prefix}/column/${slug}`);
    expect(mocks.revalidatePath).toHaveBeenCalledWith(`/${locale}${prefix}/column`);
    expect(mocks.revalidatePath).toHaveBeenCalledWith(`/${locale}${prefix}`);
  }
  expect(mocks.revalidatePath).toHaveBeenCalledWith(`/[locale]/(${business})${prefix}/column`, "layout");
  expect(mocks.revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
  expect(mocks.flush).toHaveBeenCalledOnce();
}

describe("PATCH owns cache invalidation including list soft delete", () => {
  it.each([
    { before: { locales: ["ja"] }, after: { locales: ["ja", "en"] } },
    { before: { locales: ["ja", "en"] }, after: { locales: ["ja"] } },
    { before: { status: "published" }, after: { status: "deleted" } },
    { before: { status: "published" }, after: { status: "draft" } },
    { before: { status: "draft" }, after: { status: "published" } },
    { before: { locales: ["ja"] }, after: { locales: [] } },
  ])("invalidates after $before → $after", async ({ before, after }) => {
    mocks.getColumnById.mockResolvedValue({ ...existing, ...before });
    expect((await PATCH(request("PATCH", after), ctx)).status).toBe(200);
    expect(mocks.updateColumn).toHaveBeenCalledWith(existing.id, after);
    expectInvalidated();
    expect(mocks.updateColumn.mock.invocationCallOrder[0]).toBeLessThan(mocks.revalidateTag.mock.invocationCallOrder[0]);
  });
  it.each([{ slug: "b" }, { business: "legal" }, { business: "realestate", slug: "b" }])(
    "invalidates both old and new locations for %j", async after => {
      expect((await PATCH(request("PATCH", after), ctx)).status).toBe(200);
      expectInvalidated();
      expectInvalidated(after.business ?? "labor", after.slug ?? "a");
    },
  );
});
it.each(["realestate", "labor", "legal"])("POST creates and invalidates %s", async business => {
  expect((await POST(request("POST", { ...existing, business }))).status).toBe(201);
  expectInvalidated(business);
});
it.each(["created", "updated"])("upsert %s invalidates in the same API", async action => {
  mocks.upsertColumnBySlug.mockResolvedValue({ id: existing.id, action });
  const response = await POST(request("POST", { ...existing, locales: [] }, "?upsert=1"));
  expect(await response.json()).toEqual({ id: existing.id, action });
  expectInvalidated();
});
it("DELETE invalidates the saved location after deleting", async () => {
  expect((await DELETE(request("DELETE"), ctx)).status).toBe(200);
  expectInvalidated();
  expect(mocks.deleteColumn.mock.invocationCallOrder[0]).toBeLessThan(mocks.revalidateTag.mock.invocationCallOrder[0]);
});
const mutations = [
  ["POST", () => POST(request("POST", existing)), "createColumn"],
  ["upsert", () => POST(request("POST", existing, "?upsert=1")), "upsertColumnBySlug"],
  ["PATCH", () => PATCH(request("PATCH", { status: "deleted" }), ctx), "updateColumn"],
  ["DELETE", () => DELETE(request("DELETE"), ctx), "deleteColumn"],
] as const;
it.each(mutations)("%s waits for cache storage acknowledgement", async (_, mutate) => {
  let finish!: () => void;
  mocks.flush.mockImplementation(() => new Promise<void>(resolve => { finish = resolve; }));
  let responded = false;
  const pending = mutate().then(response => { responded = true; return response; });
  await vi.waitFor(() => expect(mocks.flush).toHaveBeenCalledOnce());
  expect(responded).toBe(false);
  finish();
  expect((await pending).ok).toBe(true);
});
it.each(mutations)("%s returns 500 if asynchronous revalidation fails", async (_, mutate) => {
  mocks.flush.mockRejectedValue(new Error("cache storage unavailable"));
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  expect((await mutate()).status).toBe(500);
  expect(mocks.indexnow).not.toHaveBeenCalled();
  log.mockRestore();
});
it.each(mutations)("%s does not invalidate if DB mutation fails", async (_, mutate, key) => {
  mocks[key].mockRejectedValue(new Error("DB unavailable"));
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  expect((await mutate()).status).toBe(500);
  expect(mocks.revalidateTag).not.toHaveBeenCalled();
  log.mockRestore();
});
it.each([PATCH, DELETE])("missing record returns 404 without invalidation", async mutate => {
  mocks.getColumnById.mockResolvedValue(null);
  expect((await mutate(request("PATCH", {}), ctx)).status).toBe(404);
  expect(mocks.revalidateTag).not.toHaveBeenCalled();
});
it.each(["revalidateTag", "revalidatePath"] as const)("%s synchronous failure returns 500", async key => {
  mocks[key].mockImplementation(() => { throw new Error("invalidation unavailable"); });
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  expect((await PATCH(request("PATCH", { slug: "b" }), ctx)).status).toBe(500);
  log.mockRestore();
});
