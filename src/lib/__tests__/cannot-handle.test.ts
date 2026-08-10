import { describe, it, expect } from "vitest";
import { buildCannotHandleText } from "@/components/shared/CannotHandle";
import type { LangCode } from "@/config/languages";

/**
 * CannotHandle の開業前／開業後の切り替えガード。
 *
 * 2026-08-09 の本番実測（全277URL）で、「社会保険労務士業務は2026年9月の開業まで
 * お受けできません」が ja 10件・zh-tw 4件出ていた。開業後も残ると事実に反する。
 * env 1行の切替で入れ替わることを、ここで固定する。
 */

const LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];

const BEFORE_MARK: Record<string, string> = {
  ja: "開業までお受けできません",
  en: "cannot be accepted until our office opens in September 2026",
  "zh-tw": "在2026年9月開業之前無法受理",
  zh: "在2026年9月开业之前无法受理",
};

describe("開業前（SR_LAUNCHED=false）", () => {
  it.each(LOCALES)("%s：未開業の注記が入る", (loc) => {
    expect(buildCannotHandleText(loc, false)).toContain(BEFORE_MARK[loc]);
  });

  it.each(LOCALES)("%s：分離受任と紹介料否認が残る", (loc) => {
    const t = buildCannotHandleText(loc, false);
    const mark = { ja: "紹介料", en: "referral fee", "zh-tw": "介紹費", zh: "介绍费" }[loc];
    expect(t).toContain(mark);
  });
});

describe("開業後（SR_LAUNCHED=true）", () => {
  it.each(LOCALES)("%s：未開業の注記が消える", (loc) => {
    expect(buildCannotHandleText(loc, true)).not.toContain(BEFORE_MARK[loc]);
  });

  it.each(LOCALES)("%s：「2026年9月」が残っていない", (loc) => {
    const t = buildCannotHandleText(loc, true);
    expect(t).not.toContain("2026年9月");
    expect(t).not.toContain("September 2026");
    expect(t).not.toContain("2026年9月开业");
  });

  it.each(LOCALES)("%s：別契約で承ることを明示する", (loc) => {
    const t = buildCannotHandleText(loc, true);
    const mark = { ja: "別契約", en: "separate contract", "zh-tw": "另行簽約", zh: "另行签约" }[loc];
    expect(t).toContain(mark);
  });

  it.each(LOCALES)("%s：分離受任と紹介料否認が残る", (loc) => {
    const t = buildCannotHandleText(loc, true);
    const mark = { ja: "紹介料", en: "referral fee", "zh-tw": "介紹費", zh: "介绍费" }[loc];
    expect(t).toContain(mark);
  });
});

describe("両状態に共通する要件", () => {
  it.each(LOCALES)("%s：他事務所が「受任します」と読める形にしない", (loc) => {
    for (const launched of [false, true]) {
      const t = buildCannotHandleText(loc, launched);
      // 当社が他事務所の受任を約束する形（日本語）
      expect(t).not.toContain("弁護士が受任します");
      expect(t).not.toContain("司法書士が受任します");
      expect(t).not.toContain("税理士が受任します");
    }
  });

  it.each(LOCALES)("%s：「提携◯◯士」を書かない（U12＝書面での提携なし）", (loc) => {
    for (const launched of [false, true]) {
      const t = buildCannotHandleText(loc, launched);
      for (const w of ["提携税理士", "提携司法書士", "提携弁護士", "合作稅理士", "合作司法書士", "合作律師"]) {
        expect(t).not.toContain(w);
      }
    }
  });

  it.each(LOCALES)("%s：事務所名の文字列リテラルを含まない（法27条のソース漏れ対策）", (loc) => {
    for (const launched of [false, true]) {
      expect(buildCannotHandleText(loc, launched)).not.toContain("四葉社会保険労務士事務所");
    }
  });

  it.each(LOCALES)("%s：一体提供を示唆する語を含まない", (loc) => {
    for (const launched of [false, true]) {
      const t = buildCannotHandleText(loc, launched);
      for (const w of ["ワンストップ", "一括対応", "まとめて", "一気通貫", "一站式", "一條龍", "one-stop"]) {
        expect(t).not.toContain(w);
      }
    }
  });
});

describe("開業前の文言が、切り出し前と一字一句同じであること（退行防止）", () => {
  // 2026-08-09 のリファクタ前に本番へ出ていた確定文言（浦松確定・一字一句変更しない）
  const BEFORE_EXACT: Record<string, string> = {
    ja: "当社が対応できないこと：紛争性のある相続案件の代理交渉（弁護士におつなぎします）、不動産登記の申請代理（司法書士におつなぎします）、相続税申告（税理士におつなぎします）。社会保険労務士業務は2026年9月の開業までお受けできません。各専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。",
    "zh-tw":
      "本公司無法承接的事項：具爭訟性之繼承案件的代理協商（將為您引介律師）、不動產登記的申請代理（將為您引介司法書士〔日本的登記申請代理專業資格〕）、遺產稅申報（將為您引介稅理士〔日本的稅務專業資格〕）。社會保險勞務士（日本語：社会保険労務士）業務在2026年9月開業之前無法受理。與各專家均為分離受任・個別簽約，本公司不會收取介紹費。",
    zh: "本公司无法承接的事项：具争议性之继承案件的代理协商（将为您引介律师）、不动产登记的申请代理（将为您引介司法书士〔日本的登记申请代理专业资格〕）、遗产税申报（将为您引介税理士〔日本的税务专业资格〕）。社会保险劳务士（日本語：社会保険労務士）业务在2026年9月开业之前无法受理。与各专家均为分离受任・个别签约，本公司不会收取介绍费。",
    en: "What our company cannot handle: representation and negotiation in contested inheritance disputes (we will connect you with an attorney); filing real estate registration on your behalf (we will connect you with a Judicial Scrivener (司法書士)); and inheritance tax filing (we will connect you with a Tax Accountant (税理士)). Licensed social insurance and labor consultant (社会保険労務士) services cannot be accepted until our office opens in September 2026. Each specialist is engaged under a separate, individual contract, and our company does not receive any referral fee.",
  };

  it.each(Object.keys(BEFORE_EXACT))("%s", (loc) => {
    expect(buildCannotHandleText(loc as LangCode, false)).toBe(BEFORE_EXACT[loc]);
  });
});
