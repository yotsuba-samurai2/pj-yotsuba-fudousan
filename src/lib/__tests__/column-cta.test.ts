// 不動産コラム末尾CTAの出し分け（2026-09-05 月次点検 INIT-04）。
// 判定は ja 正本の category のみ。tags で判定すると買主向け記事に売主向けCTAが出る誤爆が起きるため、
// tags を持たせたケースでも category だけで決まることを固定する。
import { describe, it, expect } from "vitest";
import { resolveRealestateColumnCta, type Column } from "@/lib/column-shared";
import { CATEGORY_ORDER_BY_BUSINESS } from "@/lib/shared/contact-intake";

/** ja 正本（getLocalizedColumn 前の base）の不動産コラムを模したフィクスチャ */
function column(category: string, tags?: string[]): Column {
  return {
    business: "realestate",
    slug: "test-column",
    title: "t",
    date: "2026-09-05",
    category,
    excerpt: "e",
    content: "c",
    ...(tags ? { tags } : {}),
  };
}

describe("resolveRealestateColumnCta", () => {
  it("category「相続」→ sale バリアント・intent souzoku", () => {
    expect(resolveRealestateColumnCta(column("相続"))).toEqual({ variant: "sale", intent: "souzoku" });
  });

  it("category「相続空き家」（前方一致）→ souzoku", () => {
    expect(resolveRealestateColumnCta(column("相続空き家"))).toEqual({
      variant: "sale",
      intent: "souzoku",
    });
  });

  it("category「離日・売却」は tags に「相続」があっても sale（category のみで判定）", () => {
    expect(resolveRealestateColumnCta(column("離日・売却", ["離日", "相続"]))).toEqual({
      variant: "sale",
      intent: "sale",
    });
  });

  it("category「海外オーナー向け」→ management", () => {
    expect(resolveRealestateColumnCta(column("海外オーナー向け"))).toEqual({
      variant: "sale",
      intent: "management",
    });
  });

  it("買主向け記事（投資・事業用不動産＋tags 非居住者）は undefined＝現行既定のCTAのまま", () => {
    expect(
      resolveRealestateColumnCta(
        column("投資・事業用不動産", ["投資・事業用不動産", "重要事項説明", "非居住者", "外為法"]),
      ),
    ).toBeUndefined();
  });

  it("その他カテゴリ（グループホーム／賃貸の基礎 等）・空文字も undefined", () => {
    for (const c of ["グループホーム", "賃貸の基礎", "外国人の住まい", "海外の不動産会社向け", "事業用不動産", ""]) {
      expect(resolveRealestateColumnCta(column(c))).toBeUndefined();
    }
  });

  it("翻訳後の category（Inheritance／继承）には一致しない＝ja 正本 base を渡す前提の回帰ガード", () => {
    expect(resolveRealestateColumnCta(column("Inheritance"))).toBeUndefined();
    expect(resolveRealestateColumnCta(column("继承"))).toBeUndefined();
  });

  it("返す intent は contact フォームの realestate カテゴリ（CATEGORY_ORDER_BY_BUSINESS.realestate）に存在する", () => {
    const keys = CATEGORY_ORDER_BY_BUSINESS.realestate;
    for (const c of ["相続", "離日・売却", "海外オーナー向け"]) {
      const cta = resolveRealestateColumnCta(column(c));
      expect(cta?.intent).toBeDefined();
      expect(keys).toContain(cta?.intent);
    }
  });
});
