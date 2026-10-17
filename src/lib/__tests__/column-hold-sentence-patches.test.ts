import { describe, expect, it } from "vitest";
import {
  HOLD_SENTENCE_RULES,
  patchColumnHoldSentence,
  removeHoldSentences,
} from "@/lib/data/column-hold-sentence-patches";
import { LABOR_COLUMNS_SEED } from "@/lib/data/labor-columns-seed";
import { REALESTATE_COLUMNS_DAILY_SEED } from "@/lib/data/realestate-columns-daily-seed";
import { SOUZOKU_LEGAL_COLUMNS_SEED } from "@/lib/data/souzoku-legal-columns-seed";

describe("removeHoldSentences", () => {
  it("removes the standalone Japanese sentence and keeps the paragraph break", () => {
    const before = "改正があり得ます。公開は資格者確認待ちとして保留します。\n\n本記事は一般的な情報提供です。";
    expect(removeHoldSentences(before).text).toBe("改正があり得ます。\n\n本記事は一般的な情報提供です。");
  });

  it("keeps the unverified note when the hold clause is attached to it", () => {
    expect(removeHoldSentences("手数料と標準処理期間は未検証のため、公開は資格者確認待ちとして保留します。").text)
      .toBe("手数料と標準処理期間は未検証です。");
    expect(removeHoldSentences("取得済みとは扱いません。公開は資格者確認待ちとして保留し、登記・税務・権限は司法書士・税理士・弁護士が確認します。").text)
      .toBe("取得済みとは扱いません。登記・税務・権限は司法書士・税理士・弁護士が確認します。");
  });

  it("handles the English and Chinese translations", () => {
    expect(removeHoldSentences("may be amended. Publication remains held pending qualified review.").text)
      .toBe("may be amended.");
    expect(removeHoldSentences("fees and standard processing periods remain unverified; publication is held pending qualified review.").text)
      .toBe("fees and standard processing periods remain unverified.");
    expect(removeHoldSentences("not treated as retrieved. Publication is held pending qualified review; registration, tax and authority require a lawyer.").text)
      .toBe("not treated as retrieved. Registration, tax and authority require a lawyer.");
    expect(removeHoldSentences("可能有修正。公開以有資格者確認前保留。").text).toBe("可能有修正。");
    expect(removeHoldSentences("費用及標準處理期間未驗證，公開保留待資格者確認。").text).toBe("費用及標準處理期間未驗證。");
    expect(removeHoldSentences("可能有修正。公开以有资格者确认前保留。").text).toBe("可能有修正。");
    expect(removeHoldSentences("有效性未验证。取得不能不等于确定错误，公开保留待资格者确认。").text).toBe("有效性未验证。");
  });

  it("is idempotent and leaves unrelated text alone", () => {
    const text = "改正があり得ます。公開は資格者確認待ちとして保留します。";
    const once = removeHoldSentences(text).text;
    expect(removeHoldSentences(once)).toEqual({ text: once, hits: [] });
    expect(removeHoldSentences("未確認事項は資格者確認待ちです。")).toEqual({ text: "未確認事項は資格者確認待ちです。", hits: [] });
  });

  it("never leaves a replacement that matches another rule", () => {
    for (const [, replacement] of HOLD_SENTENCE_RULES) {
      for (const [removed] of HOLD_SENTENCE_RULES) {
        if (replacement) expect(replacement.includes(removed)).toBe(false);
      }
    }
  });
});

describe("patchColumnHoldSentence", () => {
  it("patches only the fields that contain the sentence, including translations", () => {
    const col = {
      id: "abc",
      slug: "sample",
      title: "見出し",
      content: "本文。公開は資格者確認待ちとして保留します。",
      translations: {
        en: { title: "Title", content: "Text. Publication remains held pending qualified review." },
        "zh-tw": { title: "標題", content: "本文。公開以有資格者確認前保留。" },
        zh: { title: "标题", content: "正文。公开以有资格者确认前保留。" },
      },
      updatedAt: "2026-10-17T00:00:00.000Z",
    };
    const { patchedFields, matches } = patchColumnHoldSentence(col);
    expect(Object.keys(patchedFields).sort()).toEqual(["content", "translations"]);
    expect(patchedFields.content).toBe("本文。");
    expect(patchedFields.translations).toEqual({
      en: { title: "Title", content: "Text." },
      "zh-tw": { title: "標題", content: "本文。" },
      zh: { title: "标题", content: "正文。" },
    });
    expect(matches.map((m) => m.path)).toEqual([
      "content",
      "translations.en.content",
      "translations.zh-tw.content",
      "translations.zh.content",
    ]);
  });

  it("returns nothing for a clean column", () => {
    expect(patchColumnHoldSentence({ id: "x", content: "本文です。", translations: {} }))
      .toEqual({ patchedFields: {}, matches: [] });
  });
});

describe("column seeds", () => {
  it("no longer contain the hold sentence in any language", () => {
    const seeds = [...REALESTATE_COLUMNS_DAILY_SEED, ...SOUZOKU_LEGAL_COLUMNS_SEED, ...LABOR_COLUMNS_SEED];
    const dirty = seeds
      .filter((article) => patchColumnHoldSentence(article as unknown as Record<string, unknown>).matches.length > 0)
      .map((article) => `${article.business}:${article.slug}`);
    expect(dirty).toEqual([]);
  });
});
