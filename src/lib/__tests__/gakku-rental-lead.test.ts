// 学区ページ強化 作業手順書 v1・PR-2：リードを「設問への直答＋主語が事業者の一文＋留保」にする
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SCHOOL_RENTAL_COPY, schoolRentalLead } from "@/lib/rental-school-district";
import { findSchoolBySlug, listSchools } from "@/lib/school-district";
import { SchoolRentalIndex, SchoolRentalListings } from "@/components/gakku/SchoolRentalPages";
import type { LangCode } from "@/config/languages";

vi.mock("@/components/shared/Breadcrumb", () => ({ Breadcrumb: () => null }));

const LOCALES = ["ja", "en", "zh-tw", "zh"] as LangCode[];
const COMPANY: Record<LangCode, string> = {
  ja: "四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304号）",
  en: "Yotsuba Real Estate Co., Ltd. (real estate brokerage licence: Tokyo Governor (1) No. 113304)",
  "zh-tw": "四葉不動產株式會社（宅地建物取引業 東京都知事(1)第113304號）",
  zh: "四叶不动产株式会社（宅地建物取引业 东京都知事(1)第113304号）",
};
const RESERVATION: Record<LangCode, string> = {
  ja: "入学時点の指定校は文京区が決定します。",
  en: "The assigned school at enrollment is decided by Bunkyo City.",
  "zh-tw": "入學時的指定學校由文京區決定。",
  zh: "入学时的指定学校由文京区决定。",
};
// 手順書 第5節・shigyo-compliance-gate：学区ページで使わない表現
const FORBIDDEN = ["名門", "有名校", "人気校", "マンモス", "安心", "最適", "一括受任", "ワンストップ", "一気通貫", "街の不動産屋", "3S1K"];

describe("学区別賃貸のリード（PR-2）", () => {
  it.each(LOCALES)("%s: ハブと学区別の両方に社名・免許番号・留保が入る", locale => {
    const c = SCHOOL_RENTAL_COPY[locale];
    for (const text of [c.lead, c.schoolLead]) {
      expect(text).toContain(COMPANY[locale]);
      expect(text).toContain(RESERVATION[locale]);
    }
    expect(c.schoolLead).toContain("{school}");
  });
  it.each(LOCALES)("%s: 学区別ページのリードに学校名が入り、画面に出る", locale => {
    for (const s of listSchools()) {
      const lead = schoolRentalLead(s, locale);
      expect(lead).toContain(s.formalName.replace(/^文京区立/, ""));
      expect(lead).not.toContain("{school}");
    }
    const school = findSchoolBySlug("seishi")!;
    const html = renderToStaticMarkup(createElement(SchoolRentalListings, { school, properties: [], summaries: [], locale }));
    expect(html).toContain(COMPANY[locale].replace(/&/g, "&amp;"));
    const hub = renderToStaticMarkup(createElement(SchoolRentalIndex, { properties: [], summaries: [], locale }));
    expect(hub).toContain(COMPANY[locale].replace(/&/g, "&amp;"));
  });
  it("禁止表現を含まない（全言語・ハブと学区別）", () => {
    for (const locale of LOCALES) {
      const c = SCHOOL_RENTAL_COPY[locale];
      for (const w of FORBIDDEN) { expect(c.lead).not.toContain(w); expect(c.schoolLead).not.toContain(w); }
    }
  });
  it("日本語の直答：町丁目単位・番号まで分かれる区域があることを述べる", () => {
    expect(SCHOOL_RENTAL_COPY.ja.lead).toMatch(/町丁目.*番・号/);
    expect(SCHOOL_RENTAL_COPY.ja.lead).toContain("番地によって通う学校が分かれる区域");
  });
});
