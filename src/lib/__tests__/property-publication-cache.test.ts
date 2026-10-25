import { beforeEach, expect, it, vi } from "vitest";
const deps = vi.hoisted(() => ({ path: vi.fn(), flush: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: deps.path }));
vi.mock("@/lib/flush-revalidation", () => ({ flushRevalidation: deps.flush }));
import { refreshPropertyPublication, PropertyPublicationRefreshError } from "../property-publication-cache";
beforeEach(() => { vi.resetAllMocks(); deps.flush.mockResolvedValue(undefined); });

it("変更前後slugと依存先の内部locale path、root sitemapを失効要求してflush完了を待つ", async () => {
  let finish!: () => void; deps.flush.mockImplementation(() => new Promise<void>(resolve => { finish = resolve; }));
  let done = false; const pending = refreshPropertyPublication(["old-slug", "new-slug", "old-slug"]).then(() => { done = true; });
  expect(done).toBe(false); expect(deps.flush).toHaveBeenCalledOnce();
  const calls = deps.path.mock.calls;
  for (const locale of ["ja", "en", "zh-tw", "zh"]) {
    for (const page of ["/bukken", "/bukken/old-slug", "/bukken/new-slug", "/services", "/global/chinese", "/gakku", "/gakku/rentals", "/gakku/sales", "/bunkyo/chukai-033", "/gakku/seishi", "/gakku/showa", "/gakku/sendagi", "/gakku/kubomachi"]) {
      expect(calls.filter(call => call[0] === `/${locale}${page}`)).toHaveLength(1);
    }
    expect(calls.some(call => call[0] === `/${locale}/sitemap.xml`)).toBe(false);
  }
  expect(deps.path).toHaveBeenCalledWith("/[locale]/(realestate)/gakku/[school]/rentals", "page");
  expect(deps.path).toHaveBeenCalledWith("/[locale]/(realestate)/gakku/[school]/sales", "page");
  expect(deps.path).toHaveBeenCalledWith("/[locale]/(realestate)/column/[slug]", "page");
  expect(deps.path).toHaveBeenCalledWith("/sitemap.xml");
  expect(calls.some(call => call[0].includes("(legal)") || call[0].includes("(labor)") || call[1] === "layout")).toBe(false);
  finish(); await pending; expect(done).toBe(true);
});
it("既存schemaで許容した連続hyphenや長いslugを保存後失敗へ変えない", async () => {
  await refreshPropertyPublication(["old--slug-", "x".repeat(1100)]);
  expect(deps.path).toHaveBeenCalledWith("/ja/bukken/old--slug-");
  expect(deps.path).toHaveBeenCalledWith("/[locale]/(realestate)/bukken/[slug]", "page");
  expect(deps.path.mock.calls.every(call => call[0].length <= 1024)).toBe(true);
});
it.each(["path", "flush"] as const)("%s障害を保存済み用の固定例外として返す", async target => {
  deps[target].mockImplementation(() => { throw new Error("PRIVATE_CACHE_SECRET"); });
  await expect(refreshPropertyPublication(["test-slug"])).rejects.toBeInstanceOf(PropertyPublicationRefreshError);
  await expect(refreshPropertyPublication(["test-slug"])).rejects.not.toThrow("PRIVATE_CACHE_SECRET");
});
it("route/path injectionはcacheに渡さない", async () => {
  await expect(refreshPropertyPublication(["../admin"])).rejects.toBeInstanceOf(PropertyPublicationRefreshError);
  expect(deps.path).not.toHaveBeenCalled(); expect(deps.flush).not.toHaveBeenCalled();
});
