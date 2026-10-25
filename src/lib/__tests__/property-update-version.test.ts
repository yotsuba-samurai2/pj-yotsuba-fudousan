import { afterEach, expect, it, vi } from "vitest";
import type { PrismaClient } from "@prisma/client";
import { createPropertyRepository } from "../db/property-repository";

afterEach(() => vi.useRealTimers());
const at = "2026-10-25T12:00:00.000Z";
function fixture() {
  let row = { title: "original", updatedAt: new Date(at) };
  // Model Prisma's automatic timestamp when no explicit updatedAt is supplied.
  const updateMany = vi.fn(async ({ where, data }) => {
    if (where.updatedAt.getTime() !== row.updatedAt.getTime()) return { count: 0 };
    row = { ...row, ...data, updatedAt: data.updatedAt ?? new Date() };
    return { count: 1 };
  });
  const repo = createPropertyRepository({ property: { updateMany } } as unknown as Pick<PrismaClient, "property">);
  return { repo, updateMany, read: () => row };
}

it.each([at, "2026-10-24T12:00:00.000Z"])("same-millisecond/backward clock %s cannot reuse a saved version", async clock => {
  vi.useFakeTimers(); vi.setSystemTime(new Date(clock));
  const f = fixture();
  expect(await f.repo.updatePropertyIfUnchanged("synthetic", at, { title: "first" })).toBe(true);
  expect(f.read().updatedAt.getTime()).toBeGreaterThan(Date.parse(at));
  expect(await f.repo.updatePropertyIfUnchanged("synthetic", at, { title: "stale" })).toBe(false);
  expect(f.read().title).toBe("first");
});

it.each(["invalid", "2026-10-25", "2026-10-25T12:00:00Z", "+275760-09-13T00:00:00.000Z"])("invalid/noncanonical/unadvanceable version %s never reaches SQL", async version => {
  const f = fixture();
  expect(await f.repo.updatePropertyIfUnchanged("synthetic", version, { title: "unsafe" })).toBe(false);
  expect(f.updateMany).not.toHaveBeenCalled();
});
