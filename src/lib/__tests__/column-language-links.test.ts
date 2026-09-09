import { Children, createElement, isValidElement, type AnchorHTMLAttributes, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getColumnSwitchLocales, type ColumnLocaleIndex } from "@/lib/column-language-links";
import { SUPPORTED_LOCALES } from "@/lib/locale";

const state = vi.hoisted(() => ({ pathname: "/ja/column/ja-only", locale: "ja", setLocale: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ locale: state.locale, setLocale: state.setLocale }),
}));
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const index: ColumnLocaleIndex = {
  "ja-only": ["ja"],
  "chinese": ["ja", "zh-tw", "zh"],
  "taiwan": ["zh-tw"],
  "all-four": [],
};

describe("published column language links", () => {
  beforeEach(() => { state.pathname = "/ja/column/ja-only"; state.locale = "ja"; state.setLocale.mockClear(); });
  afterEach(() => { vi.unstubAllGlobals(); });

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

  it.each([
    ["/labor", "/ja/labor/ryokin", "/en/labor/ryokin"],
    ["/labor/ryokin", "/ja/labor/about", "/en/labor/about"],
    ["/legal", "/ja/legal/about", "/en/legal/about"],
    ["/", "/ja/about", "/en/about"],
    ["/labor/about", "/en/labor/ryokin", "/en/labor/ryokin"],
  ])("follows the router from %s to %s before browser history is committed", (oldPath, nextPath, expected) => {
    vi.stubGlobal("window", { location: { pathname: oldPath } });
    state.pathname = nextPath;
    const html = renderToStaticMarkup(createElement(LanguageSwitcher, { columnLocales: index }));
    expect(html).toContain('href="' + expected + '"');
    expect(html).not.toContain("/en/ja/");
  });

  it("updates published-language availability when entering an article", () => {
    vi.stubGlobal("window", { location: { pathname: "/column" } });
    state.pathname = "/ja/column/ja-only";
    const html = renderToStaticMarkup(createElement(LanguageSwitcher, { columnLocales: index }));
    expect(html).toContain('href="/column/ja-only"');
    expect(html).not.toMatch(/href="\/(en|zh-tw|zh)\//);
  });

  function linksIn(node: ReactNode): ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>[] {
    if (!isValidElement<{ children?: ReactNode }>(node)) return [];
    if (node.type === "a") return [node as ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>];
    return Children.toArray(node.props.children).flatMap(linksIn);
  }

  function clickEnglish(overrides: Partial<MouseEvent<HTMLAnchorElement>> = {}) {
    state.pathname = "/ja/labor/ryokin";
    const link = linksIn(LanguageSwitcher({ columnLocales: index })).find(link => link.props["aria-label"] === "EN")!;
    const preventDefault = vi.fn();
    const event = {
      defaultPrevented: false, button: 0,
      metaKey: false, ctrlKey: false, shiftKey: false, altKey: false,
      preventDefault, ...overrides,
    } as MouseEvent<HTMLAnchorElement>;
    link.props.onClick!(event);
    return preventDefault;
  }

  it.each([
    { metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true },
    { button: 1 }, { button: 2 }, { defaultPrevented: true },
  ])("preserves browser link behavior for %o", event => {
    expect(clickEnglish(event)).not.toHaveBeenCalled();
    expect(state.setLocale).not.toHaveBeenCalled();
  });

  it("keeps ordinary clicks on the existing locale navigation flow", () => {
    expect(clickEnglish()).toHaveBeenCalledOnce();
    expect(state.setLocale).toHaveBeenCalledWith("en");
  });
});
