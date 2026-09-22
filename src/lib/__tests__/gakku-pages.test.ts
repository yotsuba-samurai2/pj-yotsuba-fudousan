/**
 * 学区特集（/gakku）の文言・データ・収載の検査。
 * 表示規約（不動産の表示に関する公正競争規約）に触れる語を混入させないための固定。
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { languages, type LangCode } from "@/config/languages";
import {
  FEATURED_SCHOOL_SLUGS,
  GAKKU_COPY,
  SCHOOL_PROFILES,
  gakkuCopy,
  getFeaturedSchools,
  isFeaturedSchoolSlug,
} from "@/lib/gakku";
import { listDistrictRowsBySchool, listSchools } from "@/lib/school-district";
import { summarizeByChome } from "@/components/gakku/DistrictSection";

const ROOT = path.resolve(__dirname, "../../..");
const readRepo = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

/** 規約第18条第2項の列挙語＋四葉の禁止語（誇大・断定） */
const BANNED_TERMS = [
  "名門",
  "厳選",
  "特選",
  "最高",
  "最高級",
  "格安",
  "激安",
  "完全",
  "完ぺき",
  "絶対",
  "万全",
  "日本一",
  "業界一",
  "抜群",
  "当社だけ",
  "他に類を見ない",
  "完売",
  "人気校",
  "激戦",
  "越境入学",
  "ワンストップ",
  "一気通貫",
  "未公開物件",
];

const LOCALES: LangCode[] = languages.map((l) => l.code);

const copyText = (locale: LangCode): string => JSON.stringify(GAKKU_COPY[locale]);

describe("学区特集の文言", () => {
  it("4ロケールすべての文言がある", () => {
    for (const locale of LOCALES) {
      expect(GAKKU_COPY[locale], locale).toBeTruthy();
      expect(gakkuCopy(locale).hub.h1, locale).not.toBe("");
    }
  });

  it("表示規約に触れる語を含まない", () => {
    for (const locale of LOCALES) {
      const text = copyText(locale);
      for (const term of BANNED_TERMS) {
        expect(text.includes(term), `${locale}: ${term}`).toBe(false);
      }
    }
  });

  it("「3S1K」は世間の通称であり当社の評価ではないと明示している", () => {
    expect(GAKKU_COPY.ja.hub.nickname).toContain("通称");
    expect(GAKKU_COPY.ja.hub.nickname).toContain("当社がこの4校を評価して選んだものではありません");
    expect(GAKKU_COPY.en.hub.nickname).toContain("not our own assessment");
    expect(GAKKU_COPY["zh-tw"].hub.nickname).toContain("並非本公司的評價");
    expect(GAKKU_COPY.zh.hub.nickname).toContain("并非本公司的评价");
  });

  it("入学時点の通学区域は区の決定である旨を全ロケールで持つ", () => {
    for (const locale of LOCALES) {
      const c = gakkuCopy(locale);
      expect(c.disclaimer.length, locale).toBeGreaterThan(10);
      expect(c.school.notice.length, locale).toBeGreaterThan(30);
    }
    expect(GAKKU_COPY.ja.disclaimer).toContain("区の決定");
    expect(GAKKU_COPY.ja.school.notice).toContain("03-5803-1295");
  });

  it("分離受任を全ロケールで明示している（他士業の独占業務を当方が行う形で書かない）", () => {
    expect(GAKKU_COPY.ja.school.separateContracts).toContain("別契約");
    expect(GAKKU_COPY.ja.school.separateContracts).toContain("紹介料を受け取りません");
    expect(GAKKU_COPY["zh-tw"].school.separateContracts).toContain("另行簽訂契約承辦");
    expect(GAKKU_COPY.zh.school.separateContracts).toContain("另行签订合同承办");
    expect(GAKKU_COPY.en.school.separateContracts).toContain("separate contract");
  });
});

describe("特集4校", () => {
  it("誠之・昭和・千駄木・窪町の4校", () => {
    expect([...FEATURED_SCHOOL_SLUGS]).toEqual(["seishi", "showa", "sendagi", "kubomachi"]);
    expect(getFeaturedSchools().map((s) => s.name)).toEqual([
      "誠之小",
      "昭和小",
      "千駄木小",
      "窪町小",
    ]);
    expect(isFeaturedSchoolSlug("seishi")).toBe(true);
    expect(isFeaturedSchoolSlug("hongo")).toBe(false);
  });

  it("20校すべてに区公表の所在地がある", () => {
    for (const school of listSchools()) {
      const profile = SCHOOL_PROFILES[school.slug];
      expect(profile, school.slug).toBeTruthy();
      expect(profile.address, school.slug).toMatch(/^文京区/);
      expect(profile.tel, school.slug).toMatch(/^03-\d{4}-\d{4}$/);
    }
  });
});

describe("町丁目の要約", () => {
  it("丁目全域が1校の区域を「全域」と判定する", () => {
    const rows = listDistrictRowsBySchool("kubomachi");
    const otsuka1 = summarizeByChome(rows).find((x) => x.chome === "大塚1丁目");
    expect(otsuka1?.whole).toBe(true);
  });

  it("番地により分かれる町丁目は「全域」と判定しない", () => {
    const rows = listDistrictRowsBySchool("kubomachi");
    const otsuka2 = summarizeByChome(rows).find((x) => x.chome === "大塚2丁目");
    expect(otsuka2?.whole).toBe(false);
  });
});

describe("収載", () => {
  it("sitemap にハブと4校が載っている", () => {
    const sitemap = readRepo("src/app/sitemap.ts");
    expect(sitemap).toContain('{ path: "/gakku"');
    for (const slug of FEATURED_SCHOOL_SLUGS) {
      expect(sitemap, slug).toContain(`{ path: "/gakku/${slug}"`);
    }
  });

  it("llms.txt にハブと4校が載っている", () => {
    const llms = readRepo("src/app/llms.txt/route.ts");
    expect(llms).toContain("https://luck428.com/gakku)");
    for (const slug of FEATURED_SCHOOL_SLUGS) {
      expect(llms, slug).toContain(`https://luck428.com/gakku/${slug}`);
    }
    // 通称の但し書きを機械可読層にも置く
    expect(llms).toContain("四葉不動産の評価ではない");
  });

  it("ヘッダー・フッター・サービス一覧から到達できる", () => {
    const layout = readRepo("src/components/layout/TenantLayout.tsx");
    expect(layout.match(/href: "\/gakku"/g)?.length).toBe(2);
    expect(readRepo("src/config/services-nav.ts")).toContain('href: "/gakku"');
  });

  it("ページのロケール宣言が sitemap と一致する（4ロケール）", () => {
    const hub = readRepo("src/app/[locale]/(realestate)/gakku/page.tsx");
    expect(hub).toContain('const PAGE_LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"]');
    for (const slug of FEATURED_SCHOOL_SLUGS) {
      const page = readRepo(`src/app/[locale]/(realestate)/gakku/${slug}/page.tsx`);
      expect(page, slug).toContain('const PAGE_LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"]');
    }
  });
});
