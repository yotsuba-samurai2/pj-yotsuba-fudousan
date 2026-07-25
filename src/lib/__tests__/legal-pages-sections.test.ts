import { describe, it, expect } from "vitest";
import {
  TERMS_ADDITIONAL_SECTIONS,
  PRIVACY_ADDITIONAL_SECTIONS,
  type LegalSection,
} from "@/lib/data/legal-pages-sections";

/**
 * /terms・/privacy-policy の追加条項に対するコンプライアンス・ガード。
 *
 * 士業サイトの規約本文は「条番号の連番が崩れない」「未検証の法令条番号を書かない」
 * 「断定・保証表現を使わない」「未開業の業務を現業として書かない」ことが要件。
 * 条項を追加・編集したらこのテストが番人になる。
 */

const ALL_SECTIONS: readonly LegalSection[] = [
  ...TERMS_ADDITIONAL_SECTIONS,
  ...PRIVACY_ADDITIONAL_SECTIONS,
];

/** 既存条項（DB管理）のキー＝追加分と衝突すると既存本文を上書き表示してしまう */
const EXISTING_TERMS_KEYS = ["application", "prohibited", "disclaimer", "changes"];
const EXISTING_PRIVACY_KEYS = [
  "collection",
  "purpose",
  "thirdParty",
  "security",
  "analytics",
  "inquiry",
];

/** e-Gov 法令検索で条文を確認済みの引用だけを許可する */
const VERIFIED_LAW_CITATIONS = ["行政書士法第12条", "宅地建物取引業法第45条"];

describe("追加条項のキー", () => {
  it("追加分どうしで重複せず、既存条項のキーとも衝突しない", () => {
    const termsKeys = TERMS_ADDITIONAL_SECTIONS.map((s) => s.key);
    const privacyKeys = PRIVACY_ADDITIONAL_SECTIONS.map((s) => s.key);

    expect(new Set(termsKeys).size).toBe(termsKeys.length);
    expect(new Set(privacyKeys).size).toBe(privacyKeys.length);
    expect(termsKeys.filter((k) => EXISTING_TERMS_KEYS.includes(k))).toEqual([]);
    expect(privacyKeys.filter((k) => EXISTING_PRIVACY_KEYS.includes(k))).toEqual([]);
  });
});

describe("条番号の連番", () => {
  it("利用規約は既存の第4条に続く第5条から連番になっている", () => {
    const numbers = TERMS_ADDITIONAL_SECTIONS.map((s) => {
      const m = s.title.match(/^第(\d+)条/);
      expect(m, `見出しが「第N条（…）」形式ではない: ${s.title}`).not.toBeNull();
      return Number(m![1]);
    });
    expect(numbers).toEqual([5, 6, 7, 8, 9]);
  });

  it("プライバシーポリシーは既存の6.に続く7.から連番になっている", () => {
    const numbers = PRIVACY_ADDITIONAL_SECTIONS.map((s) => {
      const m = s.title.match(/^(\d+)\./);
      expect(m, `見出しが「N. …」形式ではない: ${s.title}`).not.toBeNull();
      return Number(m![1]);
    });
    expect(numbers).toEqual([7, 8, 9, 10, 11]);
  });
});

describe("本文の中身", () => {
  it("見出し・本文が空でなく、箇条書きも空文字を含まない", () => {
    for (const section of ALL_SECTIONS) {
      expect(section.title.trim().length).toBeGreaterThan(0);
      expect(section.content.trim().length).toBeGreaterThan(0);
      for (const item of section.items ?? []) {
        expect(item.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("断定・保証にあたる表現を含まない", () => {
    const forbidden = ["完全に安全", "絶対に安全", "一切ありません", "保証します", "保証いたします"];
    for (const section of ALL_SECTIONS) {
      const body = [section.content, ...(section.items ?? [])].join("\n");
      for (const word of forbidden) {
        expect(body.includes(word), `${section.key} に禁止表現「${word}」が含まれる`).toBe(false);
      }
    }
  });

  it("法令の条番号は検証済みの引用だけを使う", () => {
    for (const section of ALL_SECTIONS) {
      const body = [section.content, ...(section.items ?? [])].join("\n");
      const citations = body.match(/[^\s、。（(]*法第\d+条/g) ?? [];
      for (const citation of citations) {
        expect(
          VERIFIED_LAW_CITATIONS.includes(citation),
          `${section.key} に未検証の法令引用「${citation}」が含まれる`,
        ).toBe(true);
      }
    }
  });

  it("2026年9月開業予定の社会保険労務士業務を現業として記載していない", () => {
    for (const section of ALL_SECTIONS) {
      const body = [section.title, section.content, ...(section.items ?? [])].join("\n");
      expect(body.includes("社会保険労務士"), `${section.key} に社労士の記載がある`).toBe(false);
      expect(body.includes("社労士"), `${section.key} に社労士の記載がある`).toBe(false);
    }
  });
});
