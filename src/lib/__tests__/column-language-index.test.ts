import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { column: { findMany: mocks.findMany } } }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
import { getColumnLanguageIndex } from "@/lib/column-language-index";

beforeEach(() => vi.resetAllMocks());

it("reads only public slugs and locale settings, without article content or translations", async () => {
  mocks.findMany.mockResolvedValue([{ slug: "restricted", locales: ["ja"] }, { slug: "full", locales: [] }]);
  expect(await getColumnLanguageIndex("legal")).toEqual({ restricted: ["ja"], full: [] });
  expect(mocks.findMany).toHaveBeenCalledWith({
    where: { business: "legal", status: "published" },
    select: { slug: true, locales: true },
    orderBy: { slug: "asc" },
  });
});

it("keeps fixed pages usable without guessing article translations if the DB read fails", async () => {
  mocks.findMany.mockRejectedValue(new Error("unavailable"));
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  expect(await getColumnLanguageIndex("labor")).toEqual({});
  log.mockRestore();
});
