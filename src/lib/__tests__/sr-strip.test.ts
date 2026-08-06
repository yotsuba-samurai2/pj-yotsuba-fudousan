import { describe, it, expect } from "vitest";
import { SR_ENTITY_NAME_RE, stripSrEntities } from "@/lib/shared/sr-strip";

/**
 * 社労士（事業体）エントリ除去のガード（法27条・源HTML漏れ対策）。
 *
 * 2026-08-05、**繁体字の「社會保險勞務士法人」が除去されず本番の全ロケールのHTMLに
 * 配信されていた**ことを実測で確認した。原因は判定が /社会保険労務士|社労士/ で
 * 日本語の漢字だけを見ていたこと。同じ取りこぼしを繰り返さないための番人。
 */

describe("SR_ENTITY_NAME_RE：全書体の社労士名称を検出する", () => {
  const MUST_MATCH = [
    // 日本語
    "四葉社会保険労務士事務所",
    "社会保険労務士",
    "社労士",
    "四葉社会保険労務士法人",
    // 繁体字（2026-08-05 に本番で漏れていた実値）
    "四葉社會保險勞務士法人",
    "四葉社會保險勞務士事務所",
    "社會保險勞務士",
    // 簡体字
    "四叶社会保险劳务士法人",
    "四叶社会保险劳务士事务所",
    "社会保险劳务士",
    // 英語
    "Yotsuba Labor & Social Insurance Office",
    "Yotsuba Labor and Social Insurance Office",
    "Labor and Social Security Attorney",
  ];

  it.each(MUST_MATCH)("検出する: %s", (name) => {
    expect(SR_ENTITY_NAME_RE.test(name)).toBe(true);
  });

  const MUST_NOT_MATCH = [
    "四葉不動産",
    "四葉行政書士事務所",
    "四葉行政书士事务所",
    "Yotsuba Real Estate",
    "Yotsuba Administrative Scrivener Office",
    // 「社会保険」単体は社労士事業体ではない（労務手続きの説明文等で使う）
    "社会保険",
    "社会保険・労働保険の手続き",
  ];

  it.each(MUST_NOT_MATCH)("検出しない: %s", (name) => {
    expect(SR_ENTITY_NAME_RE.test(name)).toBe(false);
  });
});

describe("stripSrEntities：groupBusinesses から社労士エントリだけを落とす", () => {
  it("繁体字の社労士エントリを除去する（2026-08-05 の漏れの再現）", () => {
    const data = {
      legal: {
        homePage: {
          groupBusinesses: [
            { name: "四葉不動産", description: "租賃・買賣・管理" },
            { name: "四葉行政書士事務所", description: "" },
            { name: "四葉社會保險勞務士法人", description: "社會保險・勞務管理" },
          ],
        },
      },
    };
    stripSrEntities(data);
    const names = data.legal.homePage.groupBusinesses.map((b) => b.name);
    expect(names).toEqual(["四葉不動産", "四葉行政書士事務所"]);
  });

  it("簡体字の社労士エントリを除去する", () => {
    const data = {
      arr: [
        { name: "四葉不動産" },
        { name: "四叶社会保险劳务士事务所" },
      ],
    };
    stripSrEntities(data);
    expect(data.arr.map((b) => b.name)).toEqual(["四葉不動産"]);
  });

  it("英語の社労士エントリを除去する", () => {
    const data = {
      arr: [
        { name: "Yotsuba Real Estate" },
        { name: "Yotsuba Labor & Social Insurance Office" },
      ],
    };
    stripSrEntities(data);
    expect(data.arr.map((b) => b.name)).toEqual(["Yotsuba Real Estate"]);
  });

  it("文字列値の「試験合格」注記は残す（name を持つ配列要素ではないため）", () => {
    const data = {
      representative: {
        srExamNote: "社会保険労務士試験合格（2026年9月開業予定）",
        qualifications: "宅地建物取引士・行政書士",
      },
    };
    stripSrEntities(data);
    expect(data.representative.srExamNote).toBe(
      "社会保険労務士試験合格（2026年9月開業予定）",
    );
  });

  it("入れ子の配列も再帰的に処理する", () => {
    const data = {
      a: { b: [{ c: [{ name: "四葉社會保險勞務士法人" }, { name: "四葉不動産" }] }] },
    };
    stripSrEntities(data);
    expect(data.a.b[0].c.map((x) => x.name)).toEqual(["四葉不動産"]);
  });
});
