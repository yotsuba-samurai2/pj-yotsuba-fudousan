// ペット横断 指示書 版2.0 第8.2・16・17章・受入テスト T15・T16（共通表示部品）
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LangCode } from "@/config/languages";
import { SurveyCountsPanel } from "@/components/rental-survey/SurveyCountsPanel";
import { publicSurveySummarySchema, type PublicSurveySummary } from "@/lib/rental-survey/summary";

const LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];
const shown: PublicSurveySummary = {
  state: "shown", conditionsKey: "bunkyo-rent-pet-v2", observedFrom: "2026-09-22T00:00:00.000Z", observedTo: "2026-09-23T00:00:00.000Z",
  finalizedAt: "2026-09-23T06:00:00.000Z", sourceKind: "single", attribution: null, x: 12, breakdown: { y: 2, z: 10 },
};
const render = (summary: PublicSurveySummary, locale: LangCode = "ja", cta?: string) =>
  renderToStaticMarkup(createElement(SurveyCountsPanel, { summary, locale, cta: cta ? createElement("a", { href: "/contact" }, cta) : undefined }));

describe("表示部品（T15）", () => {
  it("hidden・条件文の無い scope では何も出さない", () => {
    expect(render({ state: "hidden" })).toBe("");
    expect(render({ ...shown, conditionsKey: "unknown" } as PublicSurveySummary)).toBe("");
  });

  it("日本語：指示書のひな型どおりの見出し・件数・注記", () => {
    const html = render(shown, "ja", "掲載されていない物件も含めて相談する");
    for (const text of ["今回の調査で確認した対象物件", "重複を除いた確認件数：12件", "うち当サイトで詳細掲載中：2件", "うち当サイトでは詳細非掲載：10件",
      "地域内の全募集物件を網羅するものではありません", "ご紹介の可否は物件ごとに確認します", "無条件の入居を保証するものではありません",
      "2026/09/22〜2026/09/23", "掲載されていない物件も含めて相談する"]) expect(html).toContain(text);
  });

  it.each(LOCALES)("%s：誤認させる表現・内部情報・JSON-LD を出さない", locale => {
    const html = render(shown, locale);
    expect(html).not.toMatch(/市場全体|全件|必ず|ご紹介できる物件はありません|未公開物件|水面下|ld\+json|sourceId|bunkyo-rent-pet|reins|atbb|itandi|eslife|レインズ|アットホーム|イタンジ|いい生活/i);
    expect(html).toMatch(/12/);
  });

  it.each([
    ["ja", "当社が独自に集計したものです"],
    ["en", "This is our own tally"],
    ["zh-tw", "本公司"],
    ["zh", "本公司"],
  ] as const)("%s：媒体名を出さない当社の独自集計であることを示す（2026-09-24 浦松指示）", (locale, text) => {
    expect(render({ ...shown, sourceKind: "multiple" }, locale)).toContain(text);
  });

  it("複数媒体は「複数の」、1媒体なら付けない", () => {
    expect(render({ ...shown, sourceKind: "multiple" })).toContain("当社が利用する複数の業者向け物件情報");
    expect(render(shown)).not.toContain("複数の業者向け");
  });

  it("0件は調査範囲での結果であることを添える／内訳が決まらなければ Y・Z を出さない", () => {
    expect(render({ ...shown, x: 0, breakdown: { y: 0, z: 0 } })).toContain("存在しないことを示すものではありません");
    const html = render({ ...shown, breakdown: null });
    expect(html).not.toContain("詳細掲載中");
    expect(html).not.toContain("詳細非掲載には");
  });

  it("公開用データの型は許可した項目以外を受け付けない", () => {
    expect(publicSurveySummarySchema.safeParse({ ...shown, sourceId: "x" }).success).toBe(false);
    expect(publicSurveySummarySchema.safeParse({ ...shown, excluded: 3 }).success).toBe(false);
    expect(publicSurveySummarySchema.safeParse({ state: "hidden", x: 1 }).success).toBe(false);
  });
});

describe("段階公開（T16）", () => {
  // Phase 2 ではどのページにも組み込まなかった。Phase 3 で /pet-housing（第10章 4）にだけ組み込む。
  // 学区の公開一覧・ItemList には組み込まない。表示の可否は getPublicSurveySummary（公開フラグ＋許諾台帳）が決める。
  it("組み込むのは /pet-housing だけ（学区の一覧・ItemList は変わらない）", () => {
    const root = resolve(__dirname, "../../app");
    const files: string[] = [];
    const walk = (dir: string) => { for (const name of readdirSync(dir)) { const p = join(dir, name); if (statSync(p).isDirectory()) walk(p); else if (/\.tsx?$/.test(name)) files.push(p); } };
    walk(root);
    const users = files.filter(f => /SurveyCountsPanel|getPublicSurveySummary/.test(readFileSync(f, "utf8"))).map(f => relative(root, f));
    expect(users).toEqual([join("[locale]", "(realestate)", "pet-housing", "page.tsx")]);
  });
});
