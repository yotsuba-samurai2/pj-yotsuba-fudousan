import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { isValidElement, type ReactNode } from "react";
import type { AdminProperty } from "../property-shared";

const hooks = vi.hoisted(() => ({ index: 0, values: [] as unknown[] }));
vi.mock("react", async importOriginal => ({ ...await importOriginal<typeof import("react")>(), useEffect: () => {},
  useState: (initial: unknown) => {
    const i = hooks.index++;
    if (!(i in hooks.values)) hooks.values[i] = initial;
    return [hooks.values[i], (next: unknown) => { hooks.values[i] = typeof next === "function" ? next(hooks.values[i]) : next; }];
  },
}));
vi.mock("@/lib/supabase/client", () => ({ getSupabaseClient: () => ({ auth: { getSession: async () => ({ data: { session: null } }) } }) }));
import BukkenListPage from "@/app/admin/bukken/page";

const property = { id: "synthetic", slug: "synthetic-property", title: "合成物件", status: "published", updatedAt: "2026-10-25T00:00:00.000Z",
  dealType: "land", category: "other", priceYen: 100, infoUpdatedAt: "2026-10-25", nextUpdateAt: "2026-11-01", locales: ["ja"] } as AdminProperty;
const fetcher = vi.fn(), alertUser = vi.fn();
function closeButton(node: ReactNode): (() => Promise<void>) | undefined {
  if (Array.isArray(node)) { for (const child of node) { const found = closeButton(child); if (found) return found; } return; }
  if (!isValidElement<Record<string, unknown>>(node)) return;
  if (node.type === "button" && node.props.title === "成約（募集終了）にする") return node.props.onClick as () => Promise<void>;
  return closeButton(node.props.children as ReactNode);
}
beforeEach(() => {
  hooks.index = 0; hooks.values = [[property], false, "all", null, ""];
  fetcher.mockReset(); alertUser.mockReset();
  vi.stubGlobal("window", { confirm: vi.fn(() => true) }); vi.stubGlobal("alert", alertUser); vi.stubGlobal("fetch", fetcher);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it("実APIクライアントの保存済み503を一覧handlerまで保持し、PATCH再送せずGETでclosedを再取得", async () => {
  const message = "物件データの保存は完了しましたが、公開ページの更新要求に失敗しました。再保存せず、物件一覧を再読み込みして保存内容をご確認ください。";
  fetcher.mockResolvedValueOnce(new Response(JSON.stringify({ error: message, mutationSucceeded: true, publicationRefresh: "failed" }), { status: 503 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ properties: [{ ...property, status: "closed", updatedAt: "new-version" }] })));
  const action = closeButton(BukkenListPage()); expect(action).toBeTypeOf("function"); await action!();
  expect(alertUser).toHaveBeenCalledWith(message);
  expect(fetcher.mock.calls.map(([path, init]) => [path, init.method ?? "GET"])).toEqual([["/api/admin/bukken/synthetic", "PATCH"], ["/api/admin/bukken", "GET"]]);
  expect(hooks.values[0]).toEqual([{ ...property, status: "closed", updatedAt: "new-version" }]);
  expect(hooks.values[3]).toBeNull();
});
it("CAS競合でもサーバーmessageを残し最新状態を再取得", async () => {
  fetcher.mockResolvedValueOnce(new Response(JSON.stringify({ error: "同時更新を検出しました" }), { status: 409 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ properties: [{ ...property, updatedAt: "newer" }] })));
  await closeButton(BukkenListPage())!();
  expect(alertUser).toHaveBeenCalledWith("同時更新を検出しました");
  expect(hooks.values[0]).toEqual([{ ...property, updatedAt: "newer" }]);
});
it("保存応答喪失と再取得失敗でも公開中/終了を推測して書き換えず、再送しない", async () => {
  fetcher.mockRejectedValueOnce(new Error("通信が切れました")).mockRejectedValueOnce(new Error("再読取り失敗"));
  await closeButton(BukkenListPage())!();
  expect(alertUser).toHaveBeenCalledWith("通信が切れました");
  expect(hooks.values[0]).toEqual([property]); expect(hooks.values[4]).toBe("物件の取得に失敗しました");
  expect(fetcher).toHaveBeenCalledTimes(2); expect(hooks.values[3]).toBeNull();
});
it("正常保存時の既存動作は維持し、即時公開反映は確認文で保証しない", async () => {
  fetcher.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }))).mockResolvedValueOnce(new Response(JSON.stringify({ revalidated: [] })));
  await closeButton(BukkenListPage())!();
  expect(alertUser).not.toHaveBeenCalled(); expect(hooks.values[0]).toEqual([{ ...property, status: "closed" }]);
  expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("公開画面への反映は別途"));
});
