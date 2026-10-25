import { expect, it, vi } from "vitest";
import { isValidElement, type ReactNode } from "react";
import { fixture } from "../rental-import/__tests__/fixtures";
import type { AdminProperty } from "../property-shared";

vi.mock("react", async original => ({ ...await original<typeof import("react")>(), useState: (initial: unknown) => [initial, vi.fn()] }));
vi.mock("@/lib/admin-api", () => ({ uploadImage: vi.fn(async () => "https://example.test/uploaded.jpg") }));
import PropertyForm from "@/components/admin/PropertyForm";
import { uploadImage } from "@/lib/admin-api";
function nodes(node: ReactNode): Array<{ type: unknown; props: Record<string, unknown> }> {
  if (Array.isArray(node)) return node.flatMap(nodes);
  if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [node, ...nodes(node.props.children as ReactNode)];
}
const initialData = { ...fixture().property, images: [{ url: "https://example.test/synthetic.jpg", alt: "Synthetic" }] } as AdminProperty;
it("local form emits no image src and ignores a programmatic file event", async () => {
  vi.mocked(uploadImage).mockClear();
  const tree = nodes(PropertyForm({ initialData, onSubmit: vi.fn(), imageNetworkEnabled: false }));
  expect(tree.filter(n => n.type === "img")).toEqual([]);
  const input = tree.find(n => n.props.type === "file")!; expect(input.props.disabled).toBe(true);
  (input.props.onChange as (e: unknown) => void)({ target: { files: [new File(["synthetic"], "synthetic.jpg")], value: "synthetic" } });
  expect(uploadImage).not.toHaveBeenCalled();
});
it("the existing form default still renders images and uses its original uploader", async () => {
  vi.mocked(uploadImage).mockClear();
  const tree = nodes(PropertyForm({ initialData, onSubmit: vi.fn() }));
  expect(tree.find(n => n.type === "img")!.props.src).toBe(initialData.images[0].url);
  const input = tree.find(n => n.props.type === "file")!; expect(input.props.disabled).toBe(false);
  const file = new File(["synthetic"], "synthetic.jpg");
  (input.props.onChange as (e: unknown) => void)({ target: { files: [file], value: "synthetic" } });
  expect(uploadImage).toHaveBeenCalledWith(file, "bukken");
});
