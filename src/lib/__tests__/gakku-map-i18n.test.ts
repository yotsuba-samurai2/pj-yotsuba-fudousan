// 学区参考図の4ロケール表示（2026-09-23）。ja だけに戻さないようソースで固定する。
import { describe, it, expect } from "vitest";
import io from "node:fs";
import path from "node:path";
import vm from "node:vm";

const read = (file: string) => io.readFileSync(path.join(process.cwd(), file), "utf-8");
const PAGE = read("src/app/[locale]/(realestate)/gakku/page.tsx");
const EMBED = read("src/components/gakku/GakkuMapEmbed.tsx");
const MAP_JS = read("public/gakku/school-map.js");

type Dict = Record<string, unknown>;

/** school-map.js の辞書 T を lang ごとに取り出す（DOM を触る前の宣言部だけを評価） */
function dictionary(lang: string): { T: Dict; path: string } {
  const head = MAP_JS.slice(0, MAP_JS.indexOf("// 日本語は HTML の原文をそのまま使う"));
  const sandbox = { location: { search: lang ? `?lang=${lang}` : "" }, URLSearchParams, result: {} };
  vm.runInNewContext(`${head}\nresult = { T, path: localePath("/gakku") };`, sandbox);
  return sandbox.result as { T: Dict; path: string };
}

describe("学区参考図の多言語表示", () => {
  it("ハブは ja 以外でも地図を出し、iframe に lang を渡す", () => {
    expect(PAGE).not.toMatch(/locale === "ja" && \(\s*<section\s+aria-labelledby="gakku-map-heading"/);
    expect(PAGE).toContain("<GakkuMapEmbed locale={locale}");
    expect(EMBED).toContain("?lang=${locale}");
  });
  it.each(["en", "zh-tw", "zh"])("%s: 地図内の文言がそろい、リンクにロケールが付く", lang => {
    const { T, path: p } = dictionary(lang);
    for (const key of Object.keys(dictionary("").T)) expect(T[key], key).toBeTruthy();
    for (const key of ["navLabel", "back", "backToList", "mapLabel", "reset", "error", "listLabel", "note"]) expect(T[key], key).toBeTruthy();
    expect(p).toBe(`/${lang}/gakku`);
  });
  it("未知の lang は日本語（ロケールなしのパス）に落ちる", () => {
    expect(dictionary("xx").path).toBe("/gakku");
  });
});
