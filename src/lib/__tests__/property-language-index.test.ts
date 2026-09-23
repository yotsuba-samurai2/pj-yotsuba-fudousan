import { describe, it, expect, vi, beforeEach } from "vitest";
import io from "node:fs";
import path from "node:path";

/**
 * 物件の言語切替表（getPropertyLanguageIndex）と、不動産レイアウトがそれを言語切替へ渡していることの番人。
 * 2026-09-23 本番実測：日本語のみ公開の物件で EN・繁體・简体 が404へのリンクだった。
 */
const state = vi.hoisted(() => ({ properties: [] as { slug: string; locales: string[] }[], fail: false }));
vi.mock("@/lib/properties", () => ({
  getAllPublishedPropertiesAllLocales: async () => {
    if (state.fail) throw new Error("db down");
    return state.properties;
  },
}));

describe("getPropertyLanguageIndex", () => {
  beforeEach(() => { state.fail = false; state.properties = []; });

  it("公開中の物件だけを bukken/<slug> のキーで返す（公開判定は取得関数側に委ねる）", async () => {
    state.properties = [
      { slug: "ja-only-flat", locales: ["ja"] },
      { slug: "four", locales: ["ja", "en", "zh-tw", "zh"] },
    ];
    const { getPropertyLanguageIndex } = await import("@/lib/property-language-index");
    expect(await getPropertyLanguageIndex()).toEqual({
      "bukken/ja-only-flat": ["ja"],
      "bukken/four": ["ja", "en", "zh-tw", "zh"],
    });
  });

  it("DB障害では空の表を返し、レイアウト全体を落とさない", async () => {
    state.fail = true;
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { getPropertyLanguageIndex } = await import("@/lib/property-language-index");
    expect(await getPropertyLanguageIndex()).toEqual({});
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("不動産レイアウトが物件の表を言語切替に渡している", () => {
  const LAYOUT = io.readFileSync(
    path.join(process.cwd(), "src/app/[locale]/(realestate)/layout.tsx"),
    "utf-8",
  );
  it("getPropertyLanguageIndex を取得し、記事の表と合流させて TenantLayoutShell へ渡す", () => {
    expect(LAYOUT).toContain("getPropertyLanguageIndex()");
    expect(LAYOUT).toMatch(/columnLocales=\{\{ \.\.\.columnLocales, \.\.\.propertyLocales \}\}/);
  });
});
