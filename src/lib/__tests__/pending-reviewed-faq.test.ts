import { describe, expect, it } from "vitest";
import { REALESTATE_COLUMNS_DAILY_SEED } from "@/lib/data/realestate-columns-daily-seed";
import { getLocalizedColumn, type Column } from "@/lib/column-shared";

// 公開前修正の7本。翻訳本文のFAQに対して日本語JSON-LDへfallbackしないこと。
const reviewedSlugs = [
  "jinko-toseki-clinic-bukken-youken-kyusuihaisui",
  "chugokugo-buyer-kanri-kiyaku-shuzen-keikaku-check",
  "ninka-hoikusho-20nin-bukken-youto-engei",
  "keieikanri-zairyu-jimusho-bukken-youken-chugokugo",
  "ginou-tokutei-ginou-ryo-shukusha-bukken-menseki-shobo",
  "karaoke-box-tenpo-bukken-youto-shoubou-soon",
  "souzoku-bunke-nouka-jutaku-zokujinsei-baikyaku"
] as const;

describe("reviewed realestate translations have localized FAQ data", () => {
  it.each(reviewedSlugs)("%s", slug => {
    const column = REALESTATE_COLUMNS_DAILY_SEED.find(item => item.slug === slug)! as Column;
    expect(column, slug).toBeDefined();
    for (const locale of ["en", "zh-tw", "zh"] as const) {
      const translation = column.translations?.[locale];
      expect(translation?.faq, `${slug}/${locale}: FAQ JSON-LD must use the translated answers`).toHaveLength(4);
      const localized = getLocalizedColumn(column, locale);
      expect(localized.faq).toEqual(translation!.faq);
      expect(localized.faq).not.toEqual(column.faq);
      for (const faq of localized.faq!) {
        expect(faq.question.trim()).not.toBe("");
        expect(faq.answer.trim()).not.toBe("");
      }
    }
  });
});
