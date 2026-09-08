import { beforeEach, expect, it, vi } from "vitest";
import type { WorkStore } from "next/dist/server/app-render/work-async-storage.external";
const mocks = vi.hoisted(() => ({ getStore: vi.fn() }));
vi.mock("next/dist/server/app-render/work-async-storage.external", () => ({ workAsyncStorage: { getStore: mocks.getStore } }));
import { flushRevalidation } from "@/lib/flush-revalidation";
import { executeRevalidates } from "next/dist/server/revalidation-utils";

beforeEach(() => vi.resetAllMocks());
function fixture() {
  const revalidateTag = vi.fn().mockResolvedValue(undefined);
  const store = {
    incrementalCache: { revalidateTag },
    pendingRevalidatedTags: [{ tag: "column-language-index", profile: { expire: 0 } }, { tag: "_N_T_/ja/labor/column/a" }],
    pendingRevalidates: {}, pendingRevalidateWrites: [],
  } as unknown as WorkStore;
  mocks.getStore.mockReturnValue(store);
  return { store, revalidateTag };
}
it("uses Next's real executor and drains pending work before response handling", async () => {
  const { store, revalidateTag } = fixture();
  await flushRevalidation();
  expect(revalidateTag).toHaveBeenCalledWith(["column-language-index"], { expire: 0 });
  expect(revalidateTag).toHaveBeenCalledWith(["_N_T_/ja/labor/column/a"], undefined);
  expect(executeRevalidates(store)).toBe(false);
});
it("awaits storage failures and prevents a detached retry after the error response", async () => {
  const { store, revalidateTag } = fixture();
  revalidateTag.mockRejectedValue(new Error("storage unavailable"));
  await expect(flushRevalidation()).rejects.toThrow("storage unavailable");
  expect(executeRevalidates(store)).toBe(false);
});
it("fails closed outside a Next request", async () => {
  await expect(flushRevalidation()).rejects.toThrow("request context");
});
