import { describe, it, expect } from "vitest";
import {
  COMPLIANCE_SCAN_TERMS,
  COMPLIANCE_SCAN_TERMS_CONDITIONAL,
  COMPLIANCE_SCAN_ALLOWLIST,
  COMPLIANCE_SCAN_EXCLUSIONS,
} from "@/lib/data/compliance-patches";

/**
 * スキャンの2段構えのガード。
 *
 * 2026-08-10 の残存スキャンは130件で、うち約100件が誤検出だった。
 *   ・コラムの「〜にまとめています」（内部リンク文）… 約30件
 *   ・2026-07-29 に可となった「單一窗口」「伴走」… 約31件
 *   ・浦松が個別に許容した4件
 * 許容済みが毎回警告に出ると、本物の違反が埋もれる。
 */

describe("常に不可（violation）と条件付き可（conditional）が重複していない", () => {
  it("同じ語が両方に入っていない", () => {
    const dup = COMPLIANCE_SCAN_TERMS.filter((t) =>
      COMPLIANCE_SCAN_TERMS_CONDITIONAL.includes(t),
    );
    expect(dup, `重複: ${dup.join(", ")}`).toEqual([]);
  });
});

describe("2026-07-29 に可となった語は violation に残っていない", () => {
  // 石井弁護士確認（U6解決）。正本 6-3
  const PERMITTED = [
    "一つの窓口",
    "同じ窓口",
    "窓口は一つ",
    "窓口を一本化",
    "窓口の一本化",
    "単一窓口",
    "入口は同じ",
    "伴走",
    "並走",
    "單一窗口",
    "单一窗口",
  ];

  it.each(PERMITTED)("%s は violation に無い", (t) => {
    expect(COMPLIANCE_SCAN_TERMS).not.toContain(t);
  });

  it.each(PERMITTED)("%s は conditional にある（見えなくならない）", (t) => {
    expect(COMPLIANCE_SCAN_TERMS_CONDITIONAL).toContain(t);
  });
});

describe("常に不可の語は violation に残っている（緩めすぎていない）", () => {
  const MUST_STAY = [
    "ワンストップ",
    "一括対応",
    "一気通貫",
    "一站式",
    "一條龍",
    "一条龙",
    "one-stop",
    "all-in-one",
    "under one roof",
    "提携税理士",
    "提携司法書士",
    "提携弁護士",
    "合作稅理士",
    "合作司法書士",
    "社会保険労務士法人",
    "社會保險勞務士法人",
    "4カ国",
    "four countries",
  ];

  it.each(MUST_STAY)("%s は violation にある", (t) => {
    expect(COMPLIANCE_SCAN_TERMS).toContain(t);
  });
});

describe("個別の許容リスト", () => {
  it("すべてに理由と決裁日が書かれている", () => {
    for (const a of COMPLIANCE_SCAN_ALLOWLIST) {
      expect(a.reason.length, a.path).toBeGreaterThan(10);
      expect(a.decidedAt, a.path).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
  });

  it("path と term が重複していない", () => {
    const keys = COMPLIANCE_SCAN_ALLOWLIST.map((a) => `${a.path}|${a.term}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("labor.* を許容していない（開業前で未点検の名前空間を素通しにしない）", () => {
    for (const a of COMPLIANCE_SCAN_ALLOWLIST) {
      expect(a.path.startsWith("labor.")).toBe(false);
    }
  });
});

describe("除外句", () => {
  it("TOSBEC が入っている（禁止語ルールの唯一の例外）", () => {
    expect(COMPLIANCE_SCAN_EXCLUSIONS).toContain("TOSBEC");
    expect(COMPLIANCE_SCAN_EXCLUSIONS).toContain("東京開業ワンストップセンター");
  });

  it("コラムの内部リンク文「にまとめています」が入っている", () => {
    expect(COMPLIANCE_SCAN_EXCLUSIONS).toContain("にまとめています");
  });

  it("制度用語「一体的に運営／支援」が入っている", () => {
    expect(COMPLIANCE_SCAN_EXCLUSIONS).toContain("一体的に運営");
    expect(COMPLIANCE_SCAN_EXCLUSIONS).toContain("一体的に支援");
  });

  it("除外句が広すぎない（単独の「まとめて」「一体で」を除外していない）", () => {
    // これらを除外すると「まとめて契約」「一体で受任」まで見逃す
    expect(COMPLIANCE_SCAN_EXCLUSIONS).not.toContain("まとめて");
    expect(COMPLIANCE_SCAN_EXCLUSIONS).not.toContain("一体で");
    expect(COMPLIANCE_SCAN_EXCLUSIONS).not.toContain("一括して");
  });
});

describe("除外句が実際に効くか（文字列シミュレーション）", () => {
  const excludedRanges = (s: string): Array<[number, number]> => {
    const r: Array<[number, number]> = [];
    for (const ex of COMPLIANCE_SCAN_EXCLUSIONS) {
      let i = s.indexOf(ex);
      while (i >= 0) {
        r.push([i, i + ex.length]);
        i = s.indexOf(ex, i + ex.length);
      }
    }
    return r;
  };
  const hits = (s: string) => {
    const ex = excludedRanges(s);
    const out: string[] = [];
    for (const t of COMPLIANCE_SCAN_TERMS) {
      let i = s.indexOf(t);
      while (i >= 0) {
        if (!ex.some(([a, b]) => i >= a && i + t.length <= b)) out.push(t);
        i = s.indexOf(t, i + t.length);
      }
    }
    return out;
  };

  it("「詳しくは〜にまとめています」は検出しない", () => {
    expect(hits("詳しくは姉妹コラム「物件と指定申請」にまとめています。")).toEqual([]);
  });

  it("「一体的に運営する」は検出しない（制度用語）", () => {
    expect(hits("本体となる共同生活住居と一体的に運営するサテライト型")).toEqual([]);
  });

  it("「東京開業ワンストップセンター（TOSBEC）」は検出しない", () => {
    expect(hits("国と東京都が共同運営する東京開業ワンストップセンター（TOSBEC）")).toEqual([]);
  });

  it("★「まとめて契約」は検出する（除外に巻き込まれていない）", () => {
    expect(hits("3つの事務所とまとめて契約できます")).toContain("まとめて");
  });

  it("★「ワンストップで対応」は検出する", () => {
    expect(hits("法務×不動産をワンストップで対応します")).toContain("ワンストップ");
  });

  it("★「一体で受任」は検出する", () => {
    expect(hits("3事業体が一体で受任します")).toContain("一体で");
  });
});
