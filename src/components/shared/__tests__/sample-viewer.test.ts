/**
 * サンプル資料ビューア（/sample/[kind]）の検査。
 * 2026-09-23：スマートフォンでPDFから元のページへ戻れなくなる不具合の是正を固定する。
 */
import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { languages, type LangCode } from "@/config/languages";
import { SampleBackButton } from "../SampleBackButton";
import {
  SAMPLE_ASSETS,
  SAMPLE_FALLBACK_RETURN,
  SAMPLE_KINDS,
  SAMPLE_VIEWER_COPY,
  isSampleKind,
  samplePages,
  sampleViewerPath,
} from "@/lib/property-search-samples";

const ROOT = path.resolve(__dirname, "../../../..");
const LOCALES: LangCode[] = languages.map((l) => l.code);
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

describe("ページ画像（scripts/render-sample-pages.py の出力）", () => {
  it("5用途×4言語すべてに9ページ分の画像があり、ファイルが実在する", () => {
    let total = 0;
    for (const kind of SAMPLE_KINDS) {
      for (const locale of LOCALES) {
        const pages = samplePages(kind, locale);
        expect(pages, `${kind}/${locale}`).toHaveLength(9);
        for (const page of pages) {
          expect(fs.existsSync(path.join(ROOT, "public", page.src)), page.src).toBe(true);
          expect(page.width).toBeGreaterThan(0);
          expect(page.height).toBeGreaterThan(page.width); // A4縦
        }
        total += pages.length;
      }
    }
    expect(total).toBe(180);
  });

  it("元のPDFも20本すべて実在する（ダウンロード用に残す）", () => {
    for (const kind of SAMPLE_KINDS) {
      for (const locale of LOCALES) {
        const pdf = SAMPLE_ASSETS[kind][locale].pdf;
        expect(fs.existsSync(path.join(ROOT, "public", pdf)), pdf).toBe(true);
      }
    }
  });

  it("manifest がPDFの本数と一致する（PDFを足したのに書き出し忘れ、を検出する）", () => {
    const pdfs = fs
      .readdirSync(path.join(ROOT, "public/samples/property-search"))
      .filter((f) => f.endsWith(".pdf"))
      .map((f) => f.replace(/\.pdf$/, ""))
      .sort();
    const manifest = JSON.parse(read("public/samples/property-search/pages/manifest.json"));
    expect(Object.keys(manifest).sort()).toEqual(pdfs);
  });
});

describe("用途の判定とURL", () => {
  it("5用途だけを受け付ける", () => {
    expect([...SAMPLE_KINDS].sort()).toEqual(["group-home", "investment", "office", "restaurant", "welfare"]);
    expect(isSampleKind("office")).toBe(true);
    expect(isSampleKind("property-search")).toBe(false);
    expect(isSampleKind("../etc")).toBe(false);
  });

  it("ビューアのURLは public/samples（PDFの置き場所）と衝突しない", () => {
    for (const kind of SAMPLE_KINDS) {
      expect(sampleViewerPath(kind)).toBe(`/sample/${kind}`);
      expect(sampleViewerPath(kind).startsWith("/samples/")).toBe(false);
    }
  });

  it("直接開いたときの戻り先は、その用途のサンプルを載せているページ", () => {
    expect(SAMPLE_FALLBACK_RETURN).toEqual({
      welfare: "/nagare#property-search",
      "group-home": "/group-home",
      office: "/office",
      restaurant: "/inshokuten",
      investment: "/toushi",
    });
  });
});

describe("戻るボタン", () => {
  it("JavaScriptが無くても戻れるよう、既定の戻り先を href に持つ素のリンク", () => {
    const html = renderToStaticMarkup(
      createElement(SampleBackButton, { fallbackHref: "/group-home", label: "元のページに戻る" }),
    );
    expect(html).toContain('href="/group-home"');
    expect(html).toContain("元のページに戻る");
    expect(html).not.toContain('target="_blank"');
  });

  it("4言語の文言がある", () => {
    for (const locale of LOCALES) {
      expect(SAMPLE_VIEWER_COPY[locale].back.length, locale).toBeGreaterThan(2);
      expect(SAMPLE_VIEWER_COPY[locale].download, locale).toMatch(/PDF/);
    }
  });
});

describe("ビューアページの宣言", () => {
  const page = read("src/app/[locale]/(realestate)/sample/[kind]/page.tsx");

  it("noindex（画像だけの薄いページ）", () => {
    expect(page).toContain("noindex: true");
  });

  it("用途は5種類で固定し、未知の値は404（dynamicParams はページ単位）", () => {
    expect(page).toContain("export const dynamicParams = false");
    expect(page).toContain("generateStaticParams");
    // 2026-08-24 の事故（レイアウトの dynamicParams=false）を繰り返さない
    expect(read("src/app/[locale]/layout.tsx")).not.toMatch(/export const dynamicParams\s*=\s*false/);
  });

  it("PDFへのリンクは download 属性つき（遷移させない）", () => {
    expect(page).toMatch(/<a href=\{pdf\} download/);
  });

  it("sitemap には載せない", () => {
    expect(read("src/app/sitemap.ts")).not.toContain("/sample/");
  });
});
