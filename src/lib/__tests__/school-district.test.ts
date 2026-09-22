import { describe, expect, it } from "vitest";

import {
  DISTRICT_SOURCE,
  listDistrictRows,
  listDistrictRowsBySchool,
  listSchools,
  lookupDistrict,
  lookupDistrictByAddress,
  parseBunkyoAddress,
  parseNumberSpec,
} from "../school-district";

describe("一次データ（区の表）", () => {
  it("区の公表と同じ326行を保持している", () => {
    expect(listDistrictRows()).toHaveLength(DISTRICT_SOURCE.rowCount);
    expect(DISTRICT_SOURCE.rowCount).toBe(326);
  });

  it("出典と更新日を持つ", () => {
    expect(DISTRICT_SOURCE.url).toBe(
      "https://www.city.bunkyo.lg.jp/b048/p002107.html",
    );
    expect(DISTRICT_SOURCE.updatedAt).toBe("2026-01-09");
  });

  it("20校すべての行があり、学校名が一覧と一致する", () => {
    const names = new Set(listDistrictRows().map((r) => r.school));
    expect(names.size).toBe(20);
    for (const school of listSchools()) {
      expect(names.has(school.name)).toBe(true);
    }
  });

  it("すべての行に町丁目・番・号が入っている", () => {
    for (const row of listDistrictRows()) {
      expect(row.chome).not.toBe("");
      expect(row.ban).not.toBe("");
      expect(row.go).not.toBe("");
    }
  });

  it("学校ごとの行数が区の表と一致する", () => {
    expect(listDistrictRowsBySchool("kubomachi")).toHaveLength(12);
    expect(listDistrictRowsBySchool("seishi")).toHaveLength(19);
    expect(listDistrictRowsBySchool("sendagi")).toHaveLength(21);
    expect(listDistrictRowsBySchool("showa")).toHaveLength(20);
    expect(listDistrictRowsBySchool("hongo")).toHaveLength(4);
  });
});

describe("番・号の表記の解釈", () => {
  it("全", () => {
    expect(parseNumberSpec("全")).toEqual({ kind: "all" });
  });

  it("範囲と列挙", () => {
    expect(parseNumberSpec("1～3、8、9")).toEqual({
      kind: "set",
      values: [1, 2, 3, 8, 9],
    });
  });

  it("除外の2表記（を除く全／を除く全域）", () => {
    expect(parseNumberSpec("2を除く全")).toEqual({
      kind: "all-except",
      values: [2],
    });
    expect(parseNumberSpec("14を除く全域")).toEqual({
      kind: "all-except",
      values: [14],
    });
  });
});

describe("住所の分解", () => {
  it("丁目・番・号の表記ゆれを吸収する", () => {
    const expected = { town: "小日向", chome: 4, ban: 2, go: 5 };
    expect(parseBunkyoAddress("東京都文京区小日向4丁目2番5号")).toEqual(expected);
    expect(parseBunkyoAddress("文京区小日向4-2-5")).toEqual(expected);
    expect(parseBunkyoAddress("小日向4丁目2-5")).toEqual(expected);
    expect(parseBunkyoAddress("東京都文京区小日向４丁目２－５")).toEqual(expected);
  });

  it("番までしかない住所は号を空にする", () => {
    expect(parseBunkyoAddress("文京区大塚3丁目5")).toEqual({
      town: "大塚",
      chome: 3,
      ban: 5,
      go: undefined,
    });
  });

  it("文京区以外は対象外", () => {
    expect(parseBunkyoAddress("東京都豊島区南池袋1-1-1")).toBeUndefined();
    expect(parseBunkyoAddress("")).toBeUndefined();
  });
});

describe("通学区域の判定", () => {
  it("当社事務所（小日向4-2-5）は窪町小の通学区域内", () => {
    const result = lookupDistrictByAddress("東京都文京区小日向4丁目2－5");
    expect(result.status).toBe("determined");
    if (result.status !== "determined") return;
    expect(result.school.slug).toBe("kubomachi");
    expect(result.school.formalName).toBe("文京区立窪町小学校");
  });

  it("同じ小日向4丁目でも1番は金富小になる", () => {
    const result = lookupDistrictByAddress("文京区小日向4-1-1");
    expect(result.status).toBe("determined");
    if (result.status !== "determined") return;
    expect(result.school.slug).toBe("kanatomi");
  });

  it("町丁目全域が1校の区域なら番が無くても確定する", () => {
    const result = lookupDistrict({ town: "大塚", chome: 1 });
    expect(result.status).toBe("determined");
    if (result.status !== "determined") return;
    expect(result.school.slug).toBe("kubomachi");
  });

  it("備考「一部、◯◯小」に当たる住所は確定させない", () => {
    // 大塚2丁目4番10号＝青柳小の行に「一部、窪町小」、窪町小の行に「一部、青柳小」
    const result = lookupDistrict({ town: "大塚", chome: 2, ban: 4, go: 10 });
    expect(result.status).toBe("needs-inquiry");
    if (result.status !== "needs-inquiry") return;
    expect(result.reason).toBe("split-by-note");
    expect(result.candidates.map((s) => s.slug).sort()).toEqual([
      "aoyagi",
      "kubomachi",
    ]);
  });

  it("番までしか分からず学校が割れる町丁目は確定させない", () => {
    // 白山1丁目32番は指ケ谷小と誠之小に分かれる
    const result = lookupDistrict({ town: "白山", chome: 1, ban: 32 });
    expect(result.status).toBe("needs-inquiry");
    if (result.status !== "needs-inquiry") return;
    expect(result.reason).toBe("go-unknown");
    expect(result.candidates.length).toBeGreaterThan(1);
  });

  it("丁目だけで学校が割れる町丁目も確定させない", () => {
    const result = lookupDistrict({ town: "小石川", chome: 3 });
    expect(result.status).toBe("needs-inquiry");
    if (result.status !== "needs-inquiry") return;
    expect(result.reason).toBe("ban-unknown");
  });

  it("除外表記を正しく扱う（春日1丁目5番2号は金富小）", () => {
    // 礫川小は「5番＝2を除く全」、金富小は「5番＝2」
    expect(lookupDistrict({ town: "春日", chome: 1, ban: 5, go: 2 })).toMatchObject({
      status: "determined",
      school: { slug: "kanatomi" },
    });
    expect(lookupDistrict({ town: "春日", chome: 1, ban: 5, go: 3 })).toMatchObject({
      status: "determined",
      school: { slug: "rekisen" },
    });
  });

  it("表に無い町丁目・番は not-found を返す（推測しない）", () => {
    expect(lookupDistrict({ town: "存在しない町", chome: 1 })).toEqual({
      status: "not-found",
    });
    // 小日向4丁目は1番（金富小）と2〜9番（窪町小）だけが表にある
    expect(lookupDistrict({ town: "小日向", chome: 4, ban: 99 })).toEqual({
      status: "not-found",
    });
  });

  it("3S1Kの4校それぞれで確定するサンプル", () => {
    const cases: Array<[string, string]> = [
      ["文京区西片2-1-1", "seishi"],
      ["文京区本駒込5-1-1", "showa"],
      ["文京区千駄木4-1-1", "sendagi"],
      ["文京区小石川5-1-1", "kubomachi"],
    ];
    for (const [address, slug] of cases) {
      const result = lookupDistrictByAddress(address);
      expect(result.status, address).toBe("determined");
      if (result.status !== "determined") continue;
      expect(result.school.slug, address).toBe(slug);
    }
  });
});
