import { describe, it, expect } from "vitest";
import {
  hasMaterialChange,
  touchesMaterialFields,
  resolveModifiedDate,
  todayInJst,
  type MaterialFields,
} from "@/lib/column-modified-date";

const BASE: MaterialFields = {
  title: "固定残業代（定額残業代）は適法か",
  excerpt: "要件を満たせば適法です。",
  content: "**結論（先に要点）**：…",
  faq: [{ question: "Q1", answer: "A1" }],
  translations: { en: { title: "Fixed overtime pay" } },
};

const TODAY = "2026-09-05";

describe("touchesMaterialFields", () => {
  it("status だけの更新は本文に触れていない（DB読み取り不要）", () => {
    expect(touchesMaterialFields({})).toBe(false);
    expect(touchesMaterialFields({ ...({ status: "deleted" } as object) })).toBe(false);
  });

  it("content があれば触れている", () => {
    expect(touchesMaterialFields({ content: "x" })).toBe(true);
  });

  it("faq キーが存在すれば値が undefined でも触れている（＝消す操作）", () => {
    expect(touchesMaterialFields({ faq: undefined })).toBe(true);
  });
});

describe("hasMaterialChange", () => {
  it("同一内容なら false", () => {
    expect(hasMaterialChange(BASE, { ...BASE })).toBe(false);
  });

  it("content が変われば true", () => {
    expect(hasMaterialChange(BASE, { ...BASE, content: "書き直した本文" })).toBe(true);
  });

  it("title・excerpt が変われば true", () => {
    expect(hasMaterialChange(BASE, { ...BASE, title: "別のタイトル" })).toBe(true);
    expect(hasMaterialChange(BASE, { ...BASE, excerpt: "別の要約" })).toBe(true);
  });

  it("faq が変われば true", () => {
    expect(
      hasMaterialChange(BASE, { ...BASE, faq: [{ question: "Q1", answer: "A1改" }] }),
    ).toBe(true);
  });

  it("translations が変われば true", () => {
    expect(
      hasMaterialChange(BASE, { ...BASE, translations: { en: { title: "Changed" } } }),
    ).toBe(true);
  });

  it("部分更新で送られてこなかった項目は変更なし扱い", () => {
    // 管理画面の単体編集は faq を送らない。status だけの更新は何も送らない
    expect(hasMaterialChange(BASE, { title: BASE.title })).toBe(false);
    expect(hasMaterialChange(BASE, {})).toBe(false);
  });

  it("JSON のキー順が違うだけなら false（DB往復で順序が変わっても誤検知しない）", () => {
    expect(
      hasMaterialChange(BASE, { ...BASE, faq: [{ answer: "A1", question: "Q1" }] }),
    ).toBe(false);
  });

  it("translations の中の undefined 値は無視する（フォームは未入力言語を undefined で送る）", () => {
    expect(
      hasMaterialChange(BASE, {
        ...BASE,
        translations: { en: { title: "Fixed overtime pay" }, zh: undefined },
      }),
    ).toBe(false);
  });

  it("faq: null（DBの空）と faq 未設定は同じ扱い", () => {
    const existing: MaterialFields = { title: "t", excerpt: "e", content: "c", faq: null };
    expect(hasMaterialChange(existing, { faq: undefined })).toBe(false);
    expect(hasMaterialChange(existing, { faq: null })).toBe(false);
  });

  it("翻訳なしの記事をフォームから保存（translations: {}）しても DB の null と同一視する", () => {
    const existing: MaterialFields = {
      title: "t",
      excerpt: "e",
      content: "c",
      translations: null,
    };
    // ColumnForm は { en: undefined, "zh-tw": undefined, zh: undefined } を送り、JSON で {} になる
    expect(hasMaterialChange(existing, { translations: {} })).toBe(false);
    expect(
      hasMaterialChange(existing, { translations: { en: undefined, zh: undefined } }),
    ).toBe(false);
  });

  it("faq: [] と faq: null は同一視する", () => {
    const existing: MaterialFields = { title: "t", excerpt: "e", content: "c", faq: [] };
    expect(hasMaterialChange(existing, { faq: null })).toBe(false);
  });

  it("faq を空から中身ありに変えれば true", () => {
    const existing: MaterialFields = { title: "t", excerpt: "e", content: "c", faq: null };
    expect(hasMaterialChange(existing, { faq: [{ question: "Q", answer: "A" }] })).toBe(true);
  });
});

describe("resolveModifiedDate", () => {
  it("既存行がなければ undefined", () => {
    expect(
      resolveModifiedDate({ existing: null, incoming: BASE, today: TODAY }),
    ).toBeUndefined();
  });

  it("内容を変えずに再upsertしても undefined（＝既存の modifiedDate を動かさない）", () => {
    expect(
      resolveModifiedDate({ existing: BASE, incoming: { ...BASE }, today: TODAY }),
    ).toBeUndefined();
  });

  it("status だけの更新では undefined", () => {
    expect(resolveModifiedDate({ existing: BASE, incoming: {}, today: TODAY })).toBeUndefined();
  });

  it("content を変えて再upsertすると当日になる", () => {
    expect(
      resolveModifiedDate({
        existing: BASE,
        incoming: { ...BASE, content: "改稿後の本文" },
        today: TODAY,
      }),
    ).toBe(TODAY);
  });

  it("管理画面の単体編集（faq を送らない部分更新）でも content が変われば当日", () => {
    expect(
      resolveModifiedDate({
        existing: BASE,
        incoming: {
          title: BASE.title,
          excerpt: BASE.excerpt,
          content: "手で直した本文",
          translations: BASE.translations,
        },
        today: TODAY,
      }),
    ).toBe(TODAY);
  });

  it("fix-* 系の一括修正（content だけ差し替え）でも当日", () => {
    expect(
      resolveModifiedDate({
        existing: BASE,
        incoming: { content: "表記を修正した本文" },
        today: TODAY,
      }),
    ).toBe(TODAY);
  });

  it("translations だけ変えても当日になる", () => {
    expect(
      resolveModifiedDate({
        existing: BASE,
        incoming: { translations: { en: { title: "Rewritten" } } },
        today: TODAY,
      }),
    ).toBe(TODAY);
  });

  it("明示的な modifiedDate が渡されればそれを優先する", () => {
    expect(
      resolveModifiedDate({
        existing: BASE,
        incoming: { ...BASE, content: "改稿後", modifiedDate: "2026-01-01" },
        today: TODAY,
      }),
    ).toBe("2026-01-01");
  });
});

describe("todayInJst", () => {
  it("UTCで前日でもJSTの日付を返す", () => {
    // 2026-09-04T17:13Z = JST 2026-09-05 02:13
    expect(todayInJst(new Date("2026-09-04T17:13:00Z"))).toBe("2026-09-05");
  });

  it("JST 09:00 ちょうど（UTC 00:00）は当日", () => {
    expect(todayInJst(new Date("2026-09-05T00:00:00Z"))).toBe("2026-09-05");
  });

  it("JST 23:59 は当日、JST 00:00 は翌日", () => {
    expect(todayInJst(new Date("2026-09-05T14:59:59Z"))).toBe("2026-09-05");
    expect(todayInJst(new Date("2026-09-05T15:00:00Z"))).toBe("2026-09-06");
  });
});
