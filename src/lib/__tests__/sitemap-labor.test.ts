import { describe, it, expect } from "vitest";
import io from "node:fs";
import path from "node:path";

/**
 * /labor が sitemap に載る経路を持っていることのガード。
 *
 * 2026-08-09 の発見：`src/app/sitemap.ts` には labor の定義が一切なく、
 * `sitemap()` は realestate と legal しか返していなかった。
 * `BUSINESS_URLS.labor` は SR_LAUNCHED=true で追加されるが、それは
 * canonical URL の組み立てと robots.ts の露出に効くだけで、
 * **sitemap のエントリは1件も作られない**。
 *
 * このままだと 9月1日にフラグを立てても /labor 配下は sitemap に載らず、
 * Search Console へ送れない。同じ欠落を繰り返さないための番人。
 *
 * ソースを文字列として検査する。sitemap() の実行には Firestore と
 * next/headers が要り、単体テストで動かすには重いため。
 */

const SRC = io.readFileSync(path.join(process.cwd(), "src/app/sitemap.ts"), "utf-8");
const COLUMNS = io.readFileSync(path.join(process.cwd(), "src/lib/columns.ts"), "utf-8");

describe("sitemap に labor の経路がある", () => {
  it("STATIC_LABOR が定義されている", () => {
    expect(SRC).toContain("const STATIC_LABOR");
  });

  it("buildLaborSitemap が定義されている", () => {
    expect(SRC).toContain("async function buildLaborSitemap");
  });

  it("sitemap() の返り値に buildLaborSitemap が合流している", () => {
    const body = SRC.slice(SRC.indexOf("export default async function sitemap"));
    expect(body).toContain("buildLaborSitemap()");
  });

  it("labor のコラム取得関数が存在する", () => {
    expect(COLUMNS).toContain("getAllLaborColumnsAllLocales");
    expect(SRC).toContain("getAllLaborColumnsAllLocales");
  });
});

describe("開業までは1件も出さない", () => {
  it("buildLaborSitemap が SR_LAUNCHED で早期リターンする", () => {
    const fn = SRC.slice(
      SRC.indexOf("async function buildLaborSitemap"),
      SRC.indexOf("async function buildRealestateSitemap"),
    );
    expect(fn).toContain("NEXT_PUBLIC_SR_LAUNCHED");
    expect(fn).toContain("return []");
    // 早期リターンが、エントリを組み立てるより前にあること
    expect(fn.indexOf("return []")).toBeLessThan(fn.indexOf("expandStatic"));
  });
});

describe("STATIC_LABOR の中身", () => {
  const block = SRC.slice(SRC.indexOf("const STATIC_LABOR"), SRC.indexOf("/** 社労士サイトマップ"));

  it("実装済みの主要ページを網羅している", () => {
    for (const p of [
      "/labor",
      "/labor/services",
      "/labor/services/kaigo-roumu",
      "/labor/services/jinin-kijun-roumu",
      "/labor/services/shogu-kaizen",
      "/labor/services/joseikin",
      "/labor/services/gaikokujin-koyo",
      "/labor/ryokin",
      "/labor/faq",
      "/labor/about",
      "/labor/column",
    ]) {
      expect(block).toContain(`path: "${p}"`);
    }
  });

  it("送信完了ページ（/labor/thanks）を含まない", () => {
    expect(block).not.toContain("/labor/thanks");
  });

  it("すべて locales を明示している（存在しないロケールURLを広告しない）", () => {
    const entries = block.split("{ path:").slice(1);
    expect(entries.length).toBeGreaterThan(0);
    for (const e of entries) {
      expect(e).toContain("locales:");
    }
  });
});
