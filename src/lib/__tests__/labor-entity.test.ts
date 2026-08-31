import { describe, it, expect } from "vitest";
import {
  LABOR_MEMBER_OF,
  LABOR_SAME_AS,
  LEGAL_MEMBER_OF,
  LEGAL_SAME_AS,
  REALESTATE_MEMBER_OF,
  REALESTATE_SAME_AS,
} from "@/lib/seo";

/**
 * 事業体エンティティの取り違えガード（2026-09-01の事故を受けて新設）。
 *
 * 【何が起きたか】OrganizationJsonLd の分岐が `realestate ? … : legal` の二分岐で、
 * 社労士事務所を追加した日に /labor が行政書士事務所の sameAs / memberOf を
 * そのまま出力した。可視テキストは社労士用に直っていたため画面では気づけず、
 * 機械にだけ「四葉社会保険労務士事務所＝四葉行政書士事務所」と読める状態が生まれた。
 *
 * 【守るもの】別事業体が同じ外部識別子・同じ所属団体を名乗らないこと。
 * sameAs は「同一エンティティの別ページ」の宣言であり、共有した時点で
 * 別事業体を同一視する主張になる（業法分離と矛盾する）。
 */

const LEGAL_WIKIDATA = "https://www.wikidata.org/wiki/Q139738259";
const REALESTATE_WIKIDATA = "https://www.wikidata.org/wiki/Q139738235";

describe("sameAs は事業体をまたいで共有されない", () => {
  const pairs: [string, readonly string[], string, readonly string[]][] = [
    ["社労士", LABOR_SAME_AS, "行政書士", LEGAL_SAME_AS],
    ["社労士", LABOR_SAME_AS, "不動産", REALESTATE_SAME_AS],
    ["行政書士", LEGAL_SAME_AS, "不動産", REALESTATE_SAME_AS],
  ];

  it.each(pairs)("%s と %s は sameAs を1件も共有しない", (_a, a, _b, b) => {
    expect(a.filter((u) => (b as readonly string[]).includes(u))).toEqual([]);
  });
});

describe("社労士事務所は他事業体の識別子を名乗らない", () => {
  it("行政書士のWikidata（Q139738259）を持たない", () => {
    expect(LABOR_SAME_AS as readonly string[]).not.toContain(LEGAL_WIKIDATA);
  });

  it("不動産のWikidata（Q139738235）を持たない", () => {
    expect(LABOR_SAME_AS as readonly string[]).not.toContain(REALESTATE_WIKIDATA);
  });

  it("行政書士系の外部ディレクトリを持たない", () => {
    const legalOnly = ["i-sozoku.com", "egyoseishoshi.jp", "sozoku-price.com"];
    const leaked = (LABOR_SAME_AS as readonly string[]).filter((u) =>
      legalOnly.some((d) => u.includes(d)),
    );
    expect(leaked).toEqual([]);
  });
});

describe("memberOf は資格ごとに正しい会である", () => {
  const names = (xs: readonly { name: string }[]) => xs.map((x) => x.name);

  it("社労士事務所は行政書士会に所属しない", () => {
    expect(names(LABOR_MEMBER_OF).filter((n) => n.includes("行政書士"))).toEqual(
      [],
    );
  });

  it("社労士事務所は宅建協会に所属しない", () => {
    expect(
      names(LABOR_MEMBER_OF).filter((n) => n.includes("宅地建物取引業")),
    ).toEqual([]);
  });

  it("社労士事務所は都道府県会と連合会の両方を持つ", () => {
    const n = names(LABOR_MEMBER_OF);
    expect(n).toContain("東京都社会保険労務士会");
    expect(n).toContain("全国社会保険労務士会連合会");
  });

  it("行政書士事務所は社労士会に所属しない", () => {
    expect(
      names(LEGAL_MEMBER_OF).filter((n) => n.includes("社会保険労務士")),
    ).toEqual([]);
  });

  it("不動産は社労士会・行政書士会に所属しない", () => {
    const n = names(REALESTATE_MEMBER_OF);
    expect(
      n.filter((x) => x.includes("社会保険労務士") || x.includes("行政書士")),
    ).toEqual([]);
  });
});

describe("社労士の sameAs は裏取りできたものだけを出す", () => {
  it("Wikidata・GBPが未整備のあいだは空である", () => {
    // 整備できたらこのテストを更新して足す。空のまま他事業体から借りないことが要点。
    expect(LABOR_SAME_AS).toEqual([]);
  });
});
