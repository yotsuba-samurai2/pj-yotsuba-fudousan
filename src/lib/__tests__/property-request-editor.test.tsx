import { beforeEach, expect, it, vi } from "vitest";
import { isValidElement, type ReactNode } from "react";
import type { AdminProperty, PropertyInput } from "../property-shared";
import { fixture } from "../rental-import/__tests__/fixtures";

const hooks = vi.hoisted(() => ({ value: undefined as unknown }));
vi.mock("react", async original => ({ ...await original<typeof import("react")>(),
  useState: (initial: () => unknown) => { hooks.value ??= initial(); return [hooks.value, vi.fn()]; },
  useSyncExternalStore: (_subscribe: unknown, snapshot: () => unknown) => snapshot(),
}));
vi.mock("@/components/admin/PropertyForm", () => ({ default: () => null }));
import PropertyForm from "@/components/admin/PropertyForm";
import PropertyRequestEditor from "@/components/admin/PropertyRequestEditor";
import PropertyMailReview from "@/components/admin/PropertyMailReview";
const property = { ...fixture().property, id: "00000000-0000-4000-8000-000000000001", updatedAt: "2026-10-25T00:00:00.000Z" } as AdminProperty;
function nodes(node: ReactNode): Array<{ type: unknown; props: Record<string, unknown> }> {
  if (Array.isArray(node)) return node.flatMap(nodes);
  if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [node, ...nodes(node.props.children as ReactNode)];
}
beforeEach(() => { hooks.value = undefined; });
it("editor freezes the form while unknown, exposes reconcile then same-ID retry, and never navigates on ambiguous save", async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error("Lost")), onReload = vi.fn();
  const render = () => nodes(PropertyRequestEditor({ initialData: property, send, onReload }));
  expect(render().find(n => n.type === PropertyForm)!.props.imageNetworkEnabled).toBe(false);
  await (render().find(n => n.type === PropertyForm)!.props.onSubmit as (data: PropertyInput) => Promise<void>)(fixture().property);
  expect(render().find(n => n.type === "fieldset")!.props.disabled).toBe(true);
  expect(render().filter(n => n.type === "button").map(n => n.props.children)).toEqual(["保存結果を照合"]);
  const requestId = send.mock.calls[0][0].requestId;
  send.mockResolvedValueOnce(Response.json({ propertyId: property.id, requestId, result: { status: "unknown", reason: "REQUEST_NOT_OBSERVED" }, publication: "not_checked" }, { status: 503 }));
  (render().find(n => n.props.children === "保存結果を照合")!.props.onClick as () => void)();
  await vi.waitFor(() => expect(render().filter(n => n.type === "button").map(n => n.props.children)).toEqual(["保存結果を照合", "同じ要求を再送"]));
  expect(onReload).not.toHaveBeenCalled(); expect(send).toHaveBeenCalledTimes(2);
});
it("switching property removes old actions until the editor remounts", async () => {
  const send = vi.fn().mockRejectedValue(new Error("Lost")), other = vi.fn();
  let tree = nodes(PropertyRequestEditor({ initialData: property, send, onReload: vi.fn() }));
  await (tree.find(n => n.type === PropertyForm)!.props.onSubmit as (data: PropertyInput) => Promise<void>)(fixture().property);
  tree = nodes(PropertyRequestEditor({ initialData: { ...property, id: "other", updatedAt: "newer" }, send: other, onReload: vi.fn() }));
  expect(tree.find(n => n.type === PropertyForm)).toBeUndefined();
  expect(tree.some(n => n.props.children === "保存結果を照合")).toBe(false);
  expect(send).toHaveBeenCalledTimes(1); expect(other).not.toHaveBeenCalled();
});
it("a held save keeps its reference but does not permanently disable a fresh editor", async () => {
  const data = new Map<string, string>(), storage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); } };
  const recovery = { operatorId: "00000000-0000-4000-8000-00000000000a", storage, send: vi.fn() };
  const send = vi.fn(async command => Response.json({ propertyId: property.id, requestId: command.requestId,
    result: { status: "held", reason: "VERSION_CONFLICT", requestId: command.requestId, replayed: false, resultVersion: "2026-10-25T00:00:00.001Z", resultHash: "a".repeat(64), current: "changed" }, publication: "not_checked" }, { status: 409 }));
  const render = () => nodes(PropertyRequestEditor({ initialData: property, send, onReload: vi.fn(), recovery }));
  await (render().find(n => n.type === PropertyForm)!.props.onSubmit as (data: PropertyInput) => Promise<void>)(fixture().property);
  expect(render().find(n => n.type === "fieldset")!.props.disabled).toBe(true);
  const before = [...data.values()][0]; expect(JSON.parse(before)).toHaveLength(1);
  hooks.value = undefined; // onReload mounts a new editor after loading its current version.
  expect(render().find(n => n.type === "fieldset")!.props.disabled).toBe(false);
  await (render().find(n => n.type === PropertyForm)!.props.onSubmit as (data: PropertyInput) => Promise<void>)(fixture().property);
  const after = JSON.parse([...data.values()][0]); expect(after).toHaveLength(2); expect(after[0]).toEqual(JSON.parse(before)[0]);
  expect(send.mock.calls[0][0].requestId).not.toBe(send.mock.calls[1][0].requestId);
});
it("the local editor mounts review controls only with explicit configuration and hides them after property switch", () => {
  const options = { initialData: property, send: vi.fn(), onReload: vi.fn() };
  expect(nodes(PropertyRequestEditor(options)).some(n => n.type === PropertyMailReview)).toBe(false);
  hooks.value = undefined;
  const mailReview = { operatorId: "00000000-0000-4000-8000-000000000058", reference: { propertyId: property.id, reviewRef: "synthetic-ui", reviewHash: "a".repeat(64) }, send: vi.fn() };
  expect(nodes(PropertyRequestEditor({ ...options, mailReview })).find(n => n.type === PropertyMailReview)?.props.propertyId).toBe(property.id);
  expect(nodes(PropertyRequestEditor({ ...options, mailReview, initialData: { ...property, id: "other" } })).some(n => n.type === PropertyMailReview)).toBe(false);
});
