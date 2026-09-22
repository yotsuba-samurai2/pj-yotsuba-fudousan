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
      "/labor/services/gaibu-kansanin",
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

/**
 * 2026-09-22 追加。STATIC_LABOR の `locales` と、ページ側 `buildPageMetadata` の
 * `availableLocales` が食い違っていないことの番人。
 *
 * 発見した実害：
 *   ・/labor/services/joseikin と /labor/services/jinin-kijun-roumu は本文が日本語のみなのに
 *     `availableLocales` 未指定＝4言語の hreflang を出し、sitemap は `["ja"]` だった。
 *     訳の無いURLを代替ページとしてGoogleに申告していた。
 *   ・/labor/about・/labor/contact・/labor/column は逆に、本文は4ロケールとも訳出済みで
 *     hreflang も4言語なのに、sitemap だけ `["ja"]` に狭まっていた。
 *
 * STATIC_LABOR のコメントが求めている「ページ側の availableLocales と本表の両方を同時に直す」を
 * 人間の注意力ではなくテストで担保する。
 */
describe("STATIC_LABOR の locales とページの availableLocales が一致する", () => {
  const ALL = ["ja", "en", "zh-tw", "zh"] as const;
  const block = SRC.slice(SRC.indexOf("const STATIC_LABOR"), SRC.indexOf("/** 社労士サイトマップ"));

  /**
   * そのルートの page.tsx と同階層の .tsx（metadata を切り出している実装があるため）をまとめて読む。
   * **コメント行は落とす**。2026-09-22、ページ冒頭の解説コメントに書かれた
   * `availableLocales:["ja"]` という文字列を実装値と誤認して誤検知した。
   */
  function readRouteSource(routePath: string): string {
    const dir = path.join(process.cwd(), "src/app/[locale]/(labor)", routePath);
    return io
      .readdirSync(dir)
      .filter((name) => name.endsWith(".tsx"))
      .map((name) => io.readFileSync(path.join(dir, name), "utf-8"))
      .join("\n")
      .split("\n")
      .filter((line) => !/^\s*(\/\/|\/?\*)/.test(line))
      .join("\n");
  }

  const entries = [...block.matchAll(/\{ path: "([^"]+)".*?locales: \[([^\]]*)\]/g)].map((m) => ({
    path: m[1],
    locales: m[2].split(",").map((s) => s.trim().replace(/"/g, "")).filter(Boolean),
  }));

  it("STATIC_LABOR の全エントリを走査できている", () => {
    expect(entries.length).toBeGreaterThanOrEqual(15);
  });

  for (const entry of entries) {
    it(`${entry.path}`, () => {
      const src = readRouteSource(entry.path);
      const literal = /availableLocales:\s*\[([^\]]*)\]/.exec(src);
      const isDynamic = !literal && /availableLocales[,\s]*[,}]/.test(src);
      if (isDynamic) {
        // 実行時にDBから決めるページ（コラム一覧＝getColumnPageLocales）。静的には突合できない。
        expect(entry.locales.length).toBeGreaterThan(0);
        return;
      }
      const advertised = literal
        ? literal[1].split(",").map((s) => s.trim().replace(/"/g, "")).filter(Boolean)
        : [...ALL]; // availableLocales 未指定＝全4ロケールの hreflang を出す
      expect([...entry.locales].sort()).toEqual([...advertised].sort());
    });
  }

  /**
   * ja 限定ページの canonical 固定（2026-08-10 PR#210・#211 で確立した型）。
   * ja 限定のページが1つも無い状態もありうる（全ページ4言語化後）。そのときは検査対象ゼロで通す
   * ＝「ja限定ページが存在すること」ではなく「存在するなら locale:"ja" を持つこと」を固定する。
   */
  it("ja 限定のページは canonical も ja に固定している（自己canonicalの重複URLを作らない）", () => {
    const jaOnly = entries.filter((e) => e.locales.length === 1 && e.locales[0] === "ja");
    for (const entry of jaOnly) {
      const src = readRouteSource(entry.path);
      expect(src, `${entry.path} に locale: "ja" が無い`).toContain('locale: "ja"');
    }
  });
});
