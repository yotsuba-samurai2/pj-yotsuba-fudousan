// コラム詳細はオンデマンド生成（ビルド時に全記事×4言語を事前生成しない）。2026-09-23
// 事前生成に戻すと Vercel のビルドが約30分に戻るため、ソースで固定する。
import { describe, it, expect } from "vitest";
import io from "node:fs";
import path from "node:path";

const DETAIL_PAGES = [
  "src/app/[locale]/(realestate)/column/[slug]/page.tsx",
  "src/app/[locale]/(legal)/legal/column/[slug]/page.tsx",
  "src/app/[locale]/(labor)/labor/column/[slug]/page.tsx",
];

describe("コラム詳細のオンデマンド生成", () => {
  it.each(DETAIL_PAGES)("%s: generateStaticParams は空で、DBを読まない", file => {
    const src = io.readFileSync(path.join(process.cwd(), file), "utf-8");
    const start = src.indexOf("export function generateStaticParams");
    expect(start).toBeGreaterThan(-1);
    const fn = src.slice(start, src.indexOf("}", start) + 1);
    expect(fn).toContain("return [];");
    expect(fn).not.toMatch(/await|Slugs/);
    // dynamicParams=false にすると空リストのせいで全記事が404になる（layout.tsx の注記）
    expect(src).not.toMatch(/dynamicParams\s*=\s*false/);
  });
});
