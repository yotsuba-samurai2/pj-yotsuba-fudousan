import { beforeEach, expect, it, vi } from "vitest";
import { isValidElement, type ReactNode } from "react";
import type { MailReviewCommand } from "../mail-review-contract";
const hooks = vi.hoisted(() => ({ value: undefined as unknown, effect: undefined as (() => void) | undefined }));
vi.mock("react", async original => ({ ...await original<typeof import("react")>(),
  useState: (init: () => unknown) => { if (hooks.value === undefined) hooks.value = init(); return [hooks.value, vi.fn()]; },
  useEffect: (effect: () => void) => { hooks.effect = effect; }, useSyncExternalStore: (_s: unknown, get: () => unknown) => get(),
}));
import PropertyMailReview from "@/components/admin/PropertyMailReview";
const propertyId = "00000000-0000-4000-8000-000000000057", operatorId = "00000000-0000-4000-8000-000000000058";
const reference = { propertyId, reviewRef: "synthetic-ui", reviewHash: "a".repeat(64) };
function nodes(node: ReactNode): Array<{ type: unknown; props: Record<string, unknown> }> {
  if (Array.isArray(node)) return node.flatMap(nodes); if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [node, ...nodes(node.props.children as ReactNode)];
}
beforeEach(() => { hooks.value = undefined; hooks.effect = undefined; });
it("component opens read-only, wires register/reconcile/revoke, and labels receipts separately from publication", async () => {
  let saved: string | null = null, registered = false;
  const send = vi.fn(async (action, c) => {
    if (action === "inspect") return Response.json({ ...reference, result: registered ? { status: "present", revision: 1, headHash: "b".repeat(64), reviewStatus: "active", expiresAt: "2026-10-27T00:00:00.000Z" } : { status: "unavailable" } }, { status: registered ? 200 : 503 });
    registered = true;
    return Response.json({ propertyId, requestId: c.requestId, result: { status: "recorded", requestId: c.requestId, event: "registered", revision: 1, headHash: "b".repeat(64), current: "matches", replayed: action === "reconcile" } });
  });
  const options = { reference, operatorId, storage: { getItem: () => saved, setItem: (_k: string,v: string) => { saved = v; } }, send };
  const render = () => nodes(PropertyMailReview({ propertyId, options, onReload: vi.fn() }));
  render(); hooks.effect!(); await vi.waitFor(() => expect(render().some(n => n.props.children === "準備済みの確認記録を登録")).toBe(true));
  expect(send.mock.calls.every(c => c[0] === "inspect")).toBe(true);
  (render().find(n => n.props.children === "準備済みの確認記録を登録")!.props.onClick as () => void)();
  await vi.waitFor(() => expect(render().some(n => n.props.children === "この確認記録を撤回")).toBe(true));
  expect(render().some(n => String(n.props.children).includes("この操作では物件を掲載しません"))).toBe(true);
  expect(JSON.parse(saved!).command.operation).toBe("register");
  hooks.value = undefined; render(); hooks.effect!(); await vi.waitFor(() => expect(send.mock.calls.some(c => c[0] === "reconcile")).toBe(true));
  expect(send.mock.calls.filter(c => c[0] === "apply")).toHaveLength(1);
});
it.each(["property", "operator", "reference", "hash"])("%s switch hides prior actions even after a late reply", async change => {
  let release!: (r: Response) => void, command!: MailReviewCommand;
  const data = new Map<string, string>(), send = vi.fn(async (_action, c) => { command = c; return new Promise<Response>(r => { release = r; }); });
  const options = { reference, operatorId, storage: { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string,v: string) => { data.set(k,v); } }, send };
  let tree = nodes(PropertyMailReview({ propertyId, options, onReload: vi.fn() }));
  (tree.find(n => n.props.children === "準備済みの確認記録を登録")!.props.onClick as () => void)();
  const changed = { propertyId: change === "property" ? "00000000-0000-4000-8000-000000000099" : propertyId,
    options: { ...options, operatorId: change === "operator" ? "00000000-0000-4000-8000-000000000099" : operatorId,
      reference: { ...reference, reviewRef: change === "reference" ? "other-review" : reference.reviewRef, reviewHash: change === "hash" ? "d".repeat(64) : reference.reviewHash } }, onReload: vi.fn() };
  const render = () => nodes(PropertyMailReview(changed)); tree = render(); hooks.effect!();
  expect(tree.filter(n => n.type === "button").map(n => n.props.children)).toEqual(["確認画面を開き直す"]);
  release(Response.json({ propertyId, requestId: command.requestId, result: { status: "unknown", reason: "STORE_OUTCOME_UNKNOWN" } }, { status: 503 }));
  await vi.waitFor(() => expect(render().filter(n => n.type === "button").map(n => n.props.children)).toEqual(["確認画面を開き直す"]));
  expect(send).toHaveBeenCalledTimes(1);
});
