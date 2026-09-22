import { afterAll, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import io from "node:fs";
import path from "node:path";
import type { LangCode } from "@/config/languages";
import { THANKS_COPY } from "@/lib/shared/contact-page-copy";

/**
 * 送信完了ページ（/labor/thanks・/legal/thanks）の番人。
 *
 * 2026-09-22 に見つけた3つの不具合の回帰テスト。
 *   1. 本文がJSX直書きの日本語で、4ロケールとも日本語を返していた
 *   2. `ContactForm` の遷移がロケール接頭辞を付けず、非日本語版から送信した人も
 *      日本語版URLへ落ちていた（1が気づかれなかった原因）
 *   3. /labor/thanks の `title` に事務所名が入っており、layout の template と二重になっていた
 *      （2026-09-05 月次点検 NEW-TECH-1 が contact・about で直した型。本ページが漏れていた）
 */

const state = vi.hoisted(() => {
  const previous = process.env.NEXT_PUBLIC_SR_LAUNCHED;
  process.env.NEXT_PUBLIC_SR_LAUNCHED = "true";
  return { locale: "ja" as LangCode, previous };
});
afterAll(() => {
  if (state.previous === undefined) delete process.env.NEXT_PUBLIC_SR_LAUNCHED;
  else process.env.NEXT_PUBLIC_SR_LAUNCHED = state.previous;
});
vi.mock("next/root-params", () => ({ locale: async () => state.locale }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ host: "luck428.com" }) }));
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => state.locale }));

const LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];

/** layout の template `%s｜事務所名` が付けるので、ページ側の title に事務所名を書いてはいけない */
const OFFICE_NAMES = [
  "四葉社会保険労務士事務所",
  "四葉社會保險勞務士事務所",
  "四葉社会保险劳务士事务所",
  "四葉行政書士事務所",
];

describe.each([
  ["labor", "@/app/[locale]/(labor)/labor/thanks/page", "/labor/thanks", "/labor"],
  ["legal", "@/app/[locale]/(legal)/legal/thanks/page", "/legal/thanks", "/legal"],
] as const)("%s の送信完了ページ", (_lane, modulePath, pagePath, homePath) => {
  it.each(LOCALES)("%s で本文・見出し・戻り先がそのロケールになる", async (locale) => {
    state.locale = locale;
    vi.resetModules();
    const mod = await import(/* @vite-ignore */ modulePath);
    const c = THANKS_COPY[locale];
    const prefix = locale === "ja" ? "" : `/${locale}`;

    const metadata = await mod.generateMetadata();
    expect(metadata.title).toBe(c.metaTitle);
    expect(metadata.description).toBe(c.metaDescription);
    expect(metadata.robots).toMatchObject({ index: false });
    expect(metadata.alternates?.canonical).toContain(`${prefix}${pagePath}`);

    const html = renderToStaticMarkup(await mod.default());
    expect(html).toContain(c.title);
    expect(html).toContain(c.body1);
    expect(html).toContain(c.body2);
    expect(html).toContain(c.backToTop);
    expect(html).toContain(`href="${prefix}${homePath}"`);
  });

  it("日本語以外では日本語の文言が残らない", async () => {
    for (const locale of ["en", "zh-tw", "zh"] as LangCode[]) {
      state.locale = locale;
      vi.resetModules();
      const mod = await import(/* @vite-ignore */ modulePath);
      const html = renderToStaticMarkup(await mod.default());
      for (const ja of [THANKS_COPY.ja.title, THANKS_COPY.ja.body1, THANKS_COPY.ja.body2, THANKS_COPY.ja.backToTop]) {
        expect(html, `${locale} に日本語が残っている: ${ja}`).not.toContain(ja);
      }
    }
  });
});

describe("ContactForm は完了画面へロケール接頭辞つきで遷移する", () => {
  const SRC = io.readFileSync(path.join(process.cwd(), "src/components/ui/ContactForm.tsx"), "utf-8");

  it("router.push に addLocalePrefix を通している", () => {
    expect(SRC).toContain("router.push(addLocalePrefix(thanksPath, locale))");
  });

  it("接頭辞なしの router.push(thanksPath) が残っていない", () => {
    expect(SRC).not.toMatch(/router\.push\(\s*thanksPath\s*\)/);
  });
});

/**
 * 2026-09-05 月次点検 NEW-TECH-1 の根本原因ガード。
 * `absoluteTitle` を使わないページの `title` は layout の template に食わせる「見出しだけ」でなければならない。
 * ここに事務所名を書くと <title> に事務所名が2回出る（/labor/thanks が実際にそうなっていた）。
 */
describe("labor / legal の title に事務所名を書いていない", () => {
  function walk(dir: string, out: string[] = []): string[] {
    for (const e of io.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, out);
      else if (e.name === "page.tsx") out.push(p);
    }
    return out;
  }

  const root = path.join(process.cwd(), "src/app/[locale]");
  /** 動的ルートは params を要するため、ここでは検査しない（明示的に除外する） */
  const DYNAMIC = ["/column/[slug]/", "/column/page/[page]/"];
  const files = [...walk(path.join(root, "(labor)")), ...walk(path.join(root, "(legal)"))]
    .map((f) => f.slice(root.length).replace(/\\/g, "/"))
    .filter((rel) => !DYNAMIC.some((d) => rel.includes(d)));

  it("検査対象のページを列挙できている", () => {
    expect(files.length).toBeGreaterThanOrEqual(30);
  });

  it.each(files)("%s", async (rel) => {
    state.locale = "ja";
    vi.resetModules();
    const mod = await import(/* @vite-ignore */ "@/app/[locale]" + rel.replace(/\.tsx$/, ""));
    if (typeof mod.generateMetadata !== "function") return;
    const { title } = await mod.generateMetadata();
    // absoluteTitle: true のページは { absolute } で完成形を渡す＝事務所名を含んでよい
    if (typeof title !== "string") return;
    for (const office of OFFICE_NAMES) {
      expect(title, `template が事務所名を足すので title に書けない: ${title}`).not.toContain(office);
    }
  });
});
