import { describe, it, expect } from "vitest";
import io from "node:fs";
import path from "node:path";

/**
 * /bukken の収載経路と「published のみ」のガード（sitemap-labor.test.ts と同方式）。
 *
 * - 一覧・sitemap・generateStaticParams に closed / draft が出ないことは
 *   純関数側（isListable / filterListable）を property-shared.test.ts で検証済み。
 *   ここでは sitemap.ts・properties.ts がその経路を実際に使っていることを
 *   ソース文字列で検査する（sitemap() の実行にはDBと next/headers が要るため）。
 */

const SITEMAP = io.readFileSync(path.join(process.cwd(), "src/app/sitemap.ts"), "utf-8");
const PROPERTIES = io.readFileSync(
  path.join(process.cwd(), "src/lib/properties.ts"),
  "utf-8",
);
const DETAIL_PAGE = io.readFileSync(
  path.join(process.cwd(), "src/app/[locale]/(realestate)/bukken/[slug]/page.tsx"),
  "utf-8",
);

describe("sitemap に /bukken の経路がある", () => {
  it("STATIC_REALESTATE に /bukken の静的エントリがある（ja先行）", () => {
    const block = SITEMAP.slice(
      SITEMAP.indexOf("const STATIC_REALESTATE"),
      SITEMAP.indexOf("const STATIC_LEGAL"),
    );
    expect(block).toContain('path: "/bukken"');
    const entry = block.slice(block.indexOf('path: "/bukken"'));
    expect(entry.slice(0, entry.indexOf("}"))).toContain('locales: ["ja"]');
  });

  it("物件詳細の展開関数（expandProperty）が realestate sitemap に合流している", () => {
    expect(SITEMAP).toContain("function expandProperty");
    const fn = SITEMAP.slice(SITEMAP.indexOf("async function buildRealestateSitemap"));
    expect(fn.slice(0, fn.indexOf("async function buildLegalSitemap"))).toContain(
      "expandProperty",
    );
  });

  it("published 限定の取得関数＋isListable の二重ガードを通している", () => {
    expect(SITEMAP).toContain("getAllPublishedPropertiesAllLocales");
    expect(SITEMAP).toContain("filter(isListable)");
  });
});

describe("公開面の取得クエリが published を限定している", () => {
  it("一覧・sitemap用クエリは status:'published' のみ", () => {
    // getPublishedProperties / getAllPublishedPropertiesAllLocales の両方
    const matches = PROPERTIES.match(/status: "published"/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("詳細は published と closed のみ返す（draft は404・closedは募集終了表示）", () => {
    expect(PROPERTIES).toContain('status: { in: ["published", "closed"] }');
  });

  it("draft を返す公開クエリが存在しない", () => {
    expect(PROPERTIES).not.toContain('"draft"');
  });
});

describe("closed 詳細ページの挙動（おとり広告の構造的回避）", () => {
  it("closed で noindex を立てる", () => {
    expect(DETAIL_PAGE).toContain("noindex: isClosed");
  });
  it("募集終了の表示がある", () => {
    expect(DETAIL_PAGE).toContain("募集を終了しました");
  });
  it("generateStaticParams は published のみ（closedは事前生成しない）", () => {
    const fn = DETAIL_PAGE.slice(
      DETAIL_PAGE.indexOf("export async function generateStaticParams"),
      DETAIL_PAGE.indexOf("function summarize"),
    );
    expect(fn).toContain("getAllPublishedPropertiesAllLocales");
  });
});
