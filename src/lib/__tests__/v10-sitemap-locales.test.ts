import { afterEach, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ host: "luck428.com" }),
}));
vi.mock("@/lib/columns", () => ({
  getAllColumnsAllLocales: async () => [],
  getAllLegalColumnsAllLocales: async () => [],
  getAllLaborColumnsAllLocales: async () => [],
}));
vi.mock("@/lib/properties", () => ({
  getAllPublishedPropertiesAllLocales: async () => [],
}));

afterEach(() => vi.unstubAllEnvs());

const translatedPaths = ["/labor/faq", "/labor/services/kaigo-roumu", "/labor/services/shogu-kaizen"];

it("lists every translated V10 route with the matching hreflang alternatives", async () => {
  vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED", "true");
  vi.resetModules();
  const { default: sitemap } = await import("@/app/sitemap");
  const entries = await sitemap();
  for (const path of translatedPaths) {
    const expected = {
      ja: `https://luck428.com${path}`,
      en: `https://luck428.com/en${path}`,
      "zh-Hant": `https://luck428.com/zh-tw${path}`,
      "zh-Hans": `https://luck428.com/zh${path}`,
    };
    for (const url of Object.values(expected)) {
      const matches = entries.filter((entry) => entry.url === url);
      expect(matches).toHaveLength(1);
      expect(matches[0].alternates?.languages).toEqual(expected);
    }
  }
});

it("keeps translated labor routes out of the sitemap when labor is unpublished", async () => {
  vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED", "false");
  vi.resetModules();
  const { default: sitemap } = await import("@/app/sitemap");
  const entries = await sitemap();
  expect(entries.some((entry) => /\/labor(?:\/|$)/.test(new URL(entry.url).pathname))).toBe(false);
  expect(entries.some((entry) => new URL(entry.url).pathname === "/legal")).toBe(true);
});
