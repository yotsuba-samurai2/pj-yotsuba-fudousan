import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getColumnSwitchLocales, type ColumnLocaleIndex } from "@/lib/column-language-links";
import { SUPPORTED_LOCALES } from "@/lib/locale";

const state = vi.hoisted(() => ({ pathname: "/ja/column/ja-only", locale: "ja" }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ locale: state.locale, setLocale: vi.fn() }),
}));
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const index: ColumnLocaleIndex = {
  "ja-only": ["ja"],
  "chinese": ["ja", "zh-tw", "zh"],
  "taiwan": ["zh-tw"],
  "all-four": [],
};

describe("published column language links", () => {
  beforeEach(() => { state.pathname = "/ja/column/ja-only"; state.locale = "ja"; });

  it.each(["/column/ja-only", "/ja/column/ja-only", "/legal/column/ja-only", "/ja/labor/column/ja-only/"])(
    "uses the same published locales for %s", path => {
      expect(getColumnSwitchLocales(path, index, "ja")).toEqual(["ja"]);
    },
  );
  it("respects Chinese-only and Taiwan-only publication without inventing Japanese or English", () => {
    expect(getColumnSwitchLocales("/zh/column/chinese", index, "zh")).toEqual(["ja", "zh-tw", "zh"]);
    expect(getColumnSwitchLocales("/zh-tw/column/taiwan", index, "zh-tw")).toEqual(["zh-tw"]);
  });
  it("preserves the legacy empty-array = all-languages rule", () => {
    expect(getColumnSwitchLocales("/en/labor/column/all-four", index, "en")).toEqual(SUPPORTED_LOCALES);
  });
  it.each(["/", "/services", "/column", "/en/legal/column/page/5"])(
    "preserves existing navigation outside article details: %s", path => {
      expect(getColumnSwitchLocales(path, index, "ja")).toEqual(SUPPORTED_LOCALES);
    },
  );
  it("does not guess translation URLs for an unknown or newly published article", () => {
    expect(getColumnSwitchLocales("/en/column/new-article", index, "en")).toEqual(["en"]);
    expect(getColumnSwitchLocales("/column/toString", {}, "ja")).toEqual(["ja"]);
  });
  it("removes unavailable translation links from the first server-rendered HTML", () => {
    const html = renderToStaticMarkup(createElement(LanguageSwitcher, { columnLocales: index }));
    expect(html).toContain('href="/column/ja-only"');
    expect(html).not.toMatch(/href="\/(en|zh-tw|zh)\//);
    expect(html).not.toContain("|");
  });
  it("renders newly published translations and removes unpublished ones when fresh data arrives", () => {
    state.pathname = "/ja/legal/column/changing";
    const render = (columnLocales: ColumnLocaleIndex) =>
      renderToStaticMarkup(createElement(LanguageSwitcher, { columnLocales }));
    expect(render({ changing: ["ja"] })).not.toContain('href="/en/legal/column/changing"');
    expect(render({ changing: ["ja", "en"] })).toContain('href="/en/legal/column/changing"');
    expect(render({ changing: ["ja"] })).not.toContain('href="/en/legal/column/changing"');
  });
  it("keeps language switching on later list pages pointed at page one", () => {
    state.pathname = "/ja/legal/column/page/5";
    const html = renderToStaticMarkup(createElement(LanguageSwitcher, { columnLocales: index }));
    expect(html).toContain('href="/en/legal/column"');
    expect(html).not.toContain("/page/5");
  });
});
