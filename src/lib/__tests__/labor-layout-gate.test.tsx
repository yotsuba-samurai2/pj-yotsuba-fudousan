import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const previous = process.env.NEXT_PUBLIC_SR_LAUNCHED;
const columnIndex = vi.hoisted(() => vi.fn(async () => ({})));
vi.mock("@/lib/column-language-index", () => ({ getColumnLanguageIndex: columnIndex }));
vi.mock("@/components/layout/TenantLayout", () => ({ TenantLayoutShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
vi.mock("@/components/seo/OrganizationJsonLd", () => ({ OrganizationJsonLd: () => null }));

beforeEach(() => { vi.resetModules(); columnIndex.mockClear(); });
afterAll(() => {
  if (previous === undefined) delete process.env.NEXT_PUBLIC_SR_LAUNCHED;
  else process.env.NEXT_PUBLIC_SR_LAUNCHED = previous;
});

describe("Labor publication gate", () => {
  it("returns 404 and noindex before loading any page data when disabled", async () => {
    process.env.NEXT_PUBLIC_SR_LAUNCHED = "false";
    const { default: Layout, generateMetadata } = await import("@/app/[locale]/(labor)/layout");
    await expect(Layout({ children: "review prices" })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(await generateMetadata()).toMatchObject({ robots: { index: false, follow: false } });
    expect(columnIndex).not.toHaveBeenCalled();
  });

  it("renders the labor page children when enabled", async () => {
    process.env.NEXT_PUBLIC_SR_LAUNCHED = "true";
    const { default: Layout } = await import("@/app/[locale]/(labor)/layout");
    expect(renderToStaticMarkup(await Layout({ children: "review prices" }))).toContain("review prices");
    expect(columnIndex).toHaveBeenCalledWith("labor");
  });
});
