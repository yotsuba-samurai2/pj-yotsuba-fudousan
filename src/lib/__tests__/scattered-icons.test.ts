import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// 2026-09-24：背景の透かし（透明度2.5%）が <img> だと LCP の候補になり、
// 「表示完了」が装飾の描画時刻で決まっていた。インラインSVGの図形に替えた。退行を防ぐ。
describe("ScatteredIcons（背景の透かし）は LCP の候補にならない描き方を保つ", () => {
  const src = readFileSync(join(process.cwd(), "src/components/ui/ScatteredIcons.tsx"), "utf8");
  it("img・next/image・background-image を使わない", () => {
    expect(src).not.toMatch(/<img\b/);
    expect(src).not.toMatch(/from "next\/image"/);
    expect(src).not.toMatch(/backgroundImage/);
  });
  it("mask-image も使わない（LCP の候補に残ることを実測で確認済み）", () => {
    expect(src).not.toMatch(/maskImage/);
  });
  it("インラインSVGの図形で描く", () => {
    expect(src).toMatch(/<symbol\b/);
    expect(src).toMatch(/<use href=/);
  });
});
