import { describe, it, expect, vi, afterEach } from "vitest";
import io from "node:fs";
import path from "node:path";
import type { LangCode } from "@/config/languages";

/**
 * 不動産・行政書士の固定ページについて、sitemap.ts の `locales` とページ側 `buildPageMetadata` の
 * `availableLocales`／`locale` が食い違っていないことの番人（sitemap-labor.test.ts の型を realestate・legal に広げた）。
 *
 * 発見した実害（2026-09-23 本番実測）：
 *   ・/reasons・/network は sitemap が ja のみなのに、ページは4言語の hreflang を出し、
 *     /en/reasons 等は日本語本文で canonical は /reasons ＝「英語版がある」と「日本語版と同一」を同時に主張していた。
 *   ・/funin は ja 本文へフォールバックする en/zh でリクエストロケールを canonical に渡し、
 *     /en/funin・/zh/funin が日本語本文のまま自己canonicalの重複URLになっていた（文字列検査では拾えないため下の実行検査で固定）。
 */
const SRC = io.readFileSync(path.join(process.cwd(), "src/app/sitemap.ts"), "utf-8");
const ALL: LangCode[] = ["ja", "en", "zh-tw", "zh"];

type Entry = { path: string; locales: string[] };

/** ブロック内の `{ path: "…" … }` を1エントリずつ読む（locales 省略＝全4ロケール）。関数生成の学区エントリは対象外。 */
function parseEntries(block: string): Entry[] {
  return [...block.matchAll(/\{ path: "([^"]*)"([^}]*)\}/g)].map((m) => {
    const locales = /locales:\s*\[([^\]]*)\]/.exec(m[2]);
    return {
      path: m[1],
      locales: locales ? locales[1].split(",").map((s) => s.trim().replace(/"/g, "")).filter(Boolean) : [...ALL],
    };
  });
}

/** コメント行を落として同階層の .tsx を読む（コメント中の `availableLocales:["ja"]` を実装値と誤認しない） */
function readRouteSource(dir: string): string {
  return io
    .readdirSync(dir)
    .filter((name) => name.endsWith(".tsx"))
    .map((name) => io.readFileSync(path.join(dir, name), "utf-8"))
    .join("\n")
    .split("\n")
    .filter((line) => !/^\s*(\/\/|\/?\*)/.test(line))
    .join("\n");
}

const GROUPS = [
  {
    name: "STATIC_REALESTATE",
    block: SRC.slice(SRC.indexOf("const STATIC_REALESTATE"), SRC.indexOf("const STATIC_LEGAL")),
    routeDir: (p: string) => path.join(process.cwd(), "src/app/[locale]/(realestate)", p),
    minEntries: 40,
  },
  {
    name: "STATIC_LEGAL",
    block: SRC.slice(SRC.indexOf("const STATIC_LEGAL"), SRC.indexOf("const STATIC_LABOR")),
    // legal の path は「/legal 抜き」が基本。/legal/voices のように /legal 付きで書かれた例外は canonicalUrl が剥がす
    routeDir: (p: string) => path.join(process.cwd(), "src/app/[locale]/(legal)/legal", p.replace(/^\/legal(?=\/|$)/, "")),
    minEntries: 15,
  },
];

for (const group of GROUPS) {
  describe(`${group.name} の locales とページの availableLocales が一致する`, () => {
    const entries = parseEntries(group.block);

    it("全エントリを走査できている", () => {
      expect(entries.length).toBeGreaterThanOrEqual(group.minEntries);
    });

    for (const entry of entries) {
      it(`${entry.path || "/"}`, () => {
        const src = readRouteSource(group.routeDir(entry.path));
        const literal = /availableLocales:\s*\[([^\]]*)\]/.exec(src);
        const isDynamic = !literal && /availableLocales[,\s]*[,}]/.test(src);
        if (isDynamic) {
          // 実行時にDBから決めるページ（コラム一覧＝getColumnPageLocales）。静的には突合できない。
          expect(entry.locales.length).toBeGreaterThan(0);
          return;
        }
        const advertised = literal
          ? literal[1].split(",").map((s) => s.trim().replace(/"/g, "")).filter(Boolean)
          : [...ALL];
        expect([...entry.locales].sort()).toEqual([...advertised].sort());
      });
    }

    it("ja 限定のページは canonical も ja に固定している（自己canonicalの重複URLを作らない）", () => {
      for (const entry of entries.filter((e) => e.locales.length === 1 && e.locales[0] === "ja")) {
        const src = readRouteSource(group.routeDir(entry.path));
        expect(src, `${entry.path} に locale: "ja" が無い`).toContain('locale: "ja"');
      }
    });
  });
}

/**
 * 実行検査：未公開ロケールのURLで生成される canonical・hreflang。
 * 文字列検査では /funin のような「2ロケール公開＋残りは ja フォールバック」の型を拾えない。
 */
const state = vi.hoisted(() => ({ locale: "ja" as LangCode }));
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => state.locale }));
vi.mock("@/components/shared/CtaBand", () => ({ CtaBand: () => null }));
afterEach(() => vi.unstubAllEnvs());

async function metadataFor(page: string, locale: LangCode) {
  state.locale = locale;
  vi.resetModules();
  const mod = await import(/* @vite-ignore */ page);
  return mod.generateMetadata();
}

describe("未公開ロケールのURLは日本語版を canonical にし、存在するロケールだけを hreflang に出す", () => {
  it("/funin：ja＋zh-tw 公開。en・zh は ja 本文のフォールバックなので canonical は /funin", async () => {
    const page = "@/app/[locale]/(realestate)/funin/page";
    for (const locale of ["ja", "en", "zh"] as const) {
      const md = await metadataFor(page, locale);
      expect(md.alternates?.canonical, locale).toBe("https://luck428.com/funin");
      expect(Object.keys(md.alternates?.languages ?? {}).sort()).toEqual(["ja", "x-default", "zh-Hant"]);
    }
    const tw = await metadataFor(page, "zh-tw");
    expect(tw.alternates?.canonical).toBe("https://luck428.com/zh-tw/funin");
  });

  it.each(["reasons", "network"])("/%s：ja 先行。hreflang は ja と x-default だけ、canonical は ja", async (slug) => {
    for (const locale of ALL) {
      const md = await metadataFor(`@/app/[locale]/(realestate)/${slug}/page`, locale);
      expect(md.alternates?.canonical, locale).toBe(`https://luck428.com/${slug}`);
      expect(Object.keys(md.alternates?.languages ?? {}).sort()).toEqual(["ja", "x-default"]);
    }
  });
});
