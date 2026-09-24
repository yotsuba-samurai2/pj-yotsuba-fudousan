import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { LangCode } from "@/config/languages";
import {
  getColumnIllustrationAlt,
  getColumnIllustrationAssetPaths,
  getUnreachableIllustrationThemes,
  resolveColumnIllustration,
  type ColumnIllustrationInput,
} from "@/lib/column-illustrations";

function column(
  overrides: Partial<ColumnIllustrationInput> = {},
): ColumnIllustrationInput {
  return {
    business: "realestate",
    slug: "general-column",
    title: "不動産について考える",
    category: "基礎知識",
    tags: [],
    ...overrides,
  };
}

describe("resolveColumnIllustration", () => {
  it("記事固有のogImageをテーマ判定より優先する", () => {
    expect(
      resolveColumnIllustration(
        column({
          title: "外国人向けグループホーム投資",
          ogImage: "/assets/images/article.webp",
        }),
      ),
    ).toEqual({
      src: "/assets/images/article.webp",
      theme: "article",
      source: "ogImage",
    });
  });

  it("ogImageの相対パスと外部URLを安全に保持する", () => {
    expect(resolveColumnIllustration(column({ ogImage: "public/hero/custom.webp" })).src)
      .toBe("/hero/custom.webp");
    expect(resolveColumnIllustration(column({ ogImage: "https://cdn.example.com/custom.webp" })).src)
      .toBe("https://cdn.example.com/custom.webp");
    expect(resolveColumnIllustration(column({ ogImage: "javascript:alert(1)" })).source)
      .toBe("fallback");
    expect(resolveColumnIllustration(column({ ogImage: "//cdn.example.com/custom.webp" })).source)
      .toBe("fallback");
  });

  it("不動産は専門性の高いテーマを優先する", () => {
    expect(
      resolveColumnIllustration(
        column({ title: "外国人向けグループホーム物件", category: "障害福祉" }),
      ).theme,
    ).toBe("realestate-group-home");
    // 空き家・飲食店は専用画像を持つ（2026-09-24 の34点追加以降）。
    // 相続の総論より空き家、事業用の総論より飲食店が先に一致する。
    expect(resolveColumnIllustration(column({ title: "相続した空き家を売る" })).theme)
      .toBe("realestate-akiya");
    expect(resolveColumnIllustration(column({ title: "飲食店を開くための店舗選び" })).theme)
      .toBe("realestate-inshokuten");
    // 空き家を含まない相続記事は相続の画像に落ちる
    expect(resolveColumnIllustration(column({ title: "相続した土地を売る" })).theme)
      .toBe("realestate-souzoku");
  });

  it("行政書士の主要テーマを分類する", () => {
    expect(
      resolveColumnIllustration(
        column({ business: "legal", title: "特定技能の在留資格を申請する" }),
      ).theme,
    ).toBe("legal-visa");
    // 指定申請・運送は専用画像を持つ。グループホームの総論は引き続き障害福祉の画像。
    expect(
      resolveColumnIllustration(
        column({ business: "legal", title: "障害福祉グループホームの指定申請" }),
      ).theme,
    ).toBe("legal-shitei-shinsei");
    expect(
      resolveColumnIllustration(
        column({ business: "legal", title: "グループホームの開設にかかる費用" }),
      ).theme,
    ).toBe("legal-shogai-fukushi");
    expect(
      resolveColumnIllustration(
        column({ business: "legal", title: "一般貨物運送の許可申請" }),
      ).theme,
    ).toBe("legal-kensetsu-unsou");
  });

  it("社労士は複合テーマでも個別性の高い画像を選ぶ", () => {
    expect(
      resolveColumnIllustration(
        column({ business: "labor", title: "障害福祉事業所の処遇改善加算" }),
      ).theme,
    ).toBe("labor-shogu-kaizen");
    expect(
      resolveColumnIllustration(
        column({ business: "labor", title: "外国人雇用の採用と定着" }),
      ).theme,
    ).toBe("labor-gaikokujin-koyo");
  });

  it("一致しない記事は事業別の安全なフォールバックを使う", () => {
    expect(resolveColumnIllustration(column()).theme).toBe("realestate-toushi");
    expect(resolveColumnIllustration(column({ business: "legal" })).theme).toBe("legal-top");
    expect(resolveColumnIllustration(column({ business: "labor" })).theme)
      .toBe("labor-top");
  });

  it("画像1枚あたりの使用件数に上限を設けない", () => {
    const results = Array.from({ length: 25 }, (_, index) =>
      resolveColumnIllustration(
        column({
          business: "legal",
          slug: `souzoku-column-${index + 1}`,
          title: `相続手続の記事 ${index + 1}`,
        }),
      ),
    );

    expect(results.every(({ theme }) => theme === "legal-inheritance")).toBe(true);
    expect(new Set(results.map(({ src }) => src))).toEqual(
      new Set(["/hero/legal-inheritance-16x9.webp"]),
    );
  });

  it("同じ日本語正本は4言語で同じsrcになり、altは各言語に対応する", () => {
    const resolved = resolveColumnIllustration(
      column({ business: "legal", title: "遺言と相続手続" }),
    );
    const locales: LangCode[] = ["ja", "en", "zh-tw", "zh"];
    const titles = {
      ja: "遺言と相続手続",
      en: "Wills and inheritance procedures",
      "zh-tw": "遺囑與繼承手續",
      zh: "遗嘱与继承手续",
    } satisfies Record<LangCode, string>;

    expect(new Set(locales.map(() => resolved.src)).size).toBe(1);
    for (const locale of locales) {
      expect(getColumnIllustrationAlt(resolved, locale, titles[locale]).length).toBeGreaterThan(0);
    }
  });

  it("マニフェストの全テーマがルールから到達できる", () => {
    // 画像とaltを足しただけでルールを足し忘れると、表示されない画像が積み上がる。
    expect(getUnreachableIllustrationThemes()).toEqual([]);
  });

  it("マニフェストの既存画像がすべてpublic配下に存在する", () => {
    const assetPaths = getColumnIllustrationAssetPaths();
    expect(assetPaths.length).toBe(54);
    for (const assetPath of assetPaths) {
      const filePath = path.join(process.cwd(), "public", assetPath.replace(/^\//, ""));
      expect(fs.existsSync(filePath), assetPath).toBe(true);
      expect(fs.statSync(filePath).size, assetPath).toBeGreaterThan(0);
    }
  });
});
