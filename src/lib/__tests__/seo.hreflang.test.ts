import { describe, it, expect } from "vitest";
import { buildPageMetadata } from "@/lib/seo";

/**
 * GSC「見つかりませんでした(404)」対策の中核＝hreflang を「実在するロケール」に限定する挙動の回帰テスト。
 * zh-tw専用コラムが ja/en/zh の存在しないURLを hreflang に出していたのが taiwan系404の出力元だった。
 */

function langs(meta: ReturnType<typeof buildPageMetadata>) {
  return (meta.alternates?.languages ?? {}) as Record<string, string>;
}

describe("buildPageMetadata hreflang (availableLocales)", () => {
  const path = "/column/taiwan-tetsuzuki-onestop";

  it("availableLocales 未指定＝全ロケール＋x-default=ja（従来挙動の後方互換）", () => {
    const l = langs(
      buildPageMetadata({ businessKey: "realestate", title: "t", description: "d", path }),
    );
    expect(l.ja).toBe("https://luck428.com/column/taiwan-tetsuzuki-onestop");
    expect(l.en).toBe("https://luck428.com/en/column/taiwan-tetsuzuki-onestop");
    expect(l["zh-Hant"]).toBe("https://luck428.com/zh-tw/column/taiwan-tetsuzuki-onestop");
    expect(l["zh-Hans"]).toBe("https://luck428.com/zh/column/taiwan-tetsuzuki-onestop");
    expect(l["x-default"]).toBe("https://luck428.com/column/taiwan-tetsuzuki-onestop");
  });

  it("zh-tw専用＝zh-Hant と x-default(=zh-tw) のみ。ja/en/zh-Hans は出さない", () => {
    const l = langs(
      buildPageMetadata({
        businessKey: "realestate",
        title: "t",
        description: "d",
        path,
        locale: "zh-tw",
        availableLocales: ["zh-tw"],
      }),
    );
    expect(Object.keys(l).sort()).toEqual(["x-default", "zh-Hant"]);
    expect(l["zh-Hant"]).toBe("https://luck428.com/zh-tw/column/taiwan-tetsuzuki-onestop");
    // ja が無いので x-default は公開先頭（zh-tw）を指す＝404を広告しない
    expect(l["x-default"]).toBe("https://luck428.com/zh-tw/column/taiwan-tetsuzuki-onestop");
    expect(l.ja).toBeUndefined();
    expect(l.en).toBeUndefined();
    expect(l["zh-Hans"]).toBeUndefined();
  });

  it("ja+en 公開＝ja/en と x-default(=ja) のみ。zh 系は出さない", () => {
    const l = langs(
      buildPageMetadata({
        businessKey: "realestate",
        title: "t",
        description: "d",
        path,
        availableLocales: ["ja", "en"],
      }),
    );
    expect(Object.keys(l).sort()).toEqual(["en", "ja", "x-default"]);
    expect(l["x-default"]).toBe("https://luck428.com/column/taiwan-tetsuzuki-onestop");
    expect(l["zh-Hant"]).toBeUndefined();
    expect(l["zh-Hans"]).toBeUndefined();
  });
});
