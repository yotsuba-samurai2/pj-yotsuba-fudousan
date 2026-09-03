import { describe, it, expect } from "vitest";
import {
  initialLocaleSelection,
  isLocaleAllowed,
  type Column,
} from "@/lib/column-shared";
import type { LangCode } from "@/config/languages";

const ALL: LangCode[] = ["ja", "en", "zh-tw", "zh"];

function column(locales?: LangCode[]): Column {
  return {
    business: "labor",
    slug: "shuro-shien-ab-jinin-kijun-roumu",
    title: "t",
    date: "2026-09-01",
    category: "労務のしくみ",
    excerpt: "e",
    content: "c",
    ...(locales ? { locales } : {}),
  };
}

describe("initialLocaleSelection", () => {
  it("空配列（＝全言語公開）は全言語チェック済みで復元する", () => {
    // 修正前は `?? ` が空配列を素通りさせ、[] のまま＝1言語も選択なしになっていた。
    expect(initialLocaleSelection([], ALL)).toEqual(ALL);
  });

  it("undefined（旧・未設定）も全言語チェック済みで復元する", () => {
    expect(initialLocaleSelection(undefined, ALL)).toEqual(ALL);
  });

  it("明示指定はそのまま尊重する（ja のみ公開の記事を全言語に広げない）", () => {
    expect(initialLocaleSelection(["ja"], ALL)).toEqual(["ja"]);
  });

  it("返り値は入力と別配列（フォームの setState が元データを破壊しない）", () => {
    const src: LangCode[] = ["ja"];
    const out = initialLocaleSelection(src, ALL);
    out.push("en");
    expect(src).toEqual(["ja"]);
  });
});

describe("フォーム初期値をそのまま保存しても公開状態が変わらないこと", () => {
  it("locales:[] の記事と、全言語を明示した記事は、どのロケールでも同じ判定になる", () => {
    const empty = column([]);
    const explicit = column(initialLocaleSelection([], ALL));
    for (const loc of ALL) {
      expect(isLocaleAllowed(explicit, loc)).toBe(isLocaleAllowed(empty, loc));
      expect(isLocaleAllowed(explicit, loc)).toBe(true);
    }
  });

  it("ja のみの記事は他言語で404のまま（回帰防止）", () => {
    const jaOnly = column(initialLocaleSelection(["ja"], ALL));
    expect(isLocaleAllowed(jaOnly, "ja")).toBe(true);
    expect(isLocaleAllowed(jaOnly, "en")).toBe(false);
    expect(isLocaleAllowed(jaOnly, "zh-tw")).toBe(false);
    expect(isLocaleAllowed(jaOnly, "zh")).toBe(false);
  });
});
