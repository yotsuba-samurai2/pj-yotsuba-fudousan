// 言語スイッチャーの二重ロケールURL（/en/ja/...→404）回帰防止（2026-09-02 本番実測で発見）。
// PR#297のロケールURLセグメント化以降、サーバ描画時の usePathname は ja でも「/ja/...」を返すため、
// stripLocalePrefix は既定ロケール ja も剥がさなければならない。
import { describe, it, expect } from "vitest";
import { addLocalePrefix, stripLocalePrefix, detectLocaleFromPath } from "@/lib/locale";

describe("stripLocalePrefix", () => {
  it("非デフォルトロケールを剥がす", () => {
    expect(stripLocalePrefix("/en/legal/column/x")).toBe("/legal/column/x");
    expect(stripLocalePrefix("/zh-tw/souzoku")).toBe("/souzoku");
    expect(stripLocalePrefix("/zh")).toBe("/");
  });
  it("内部セグメントの /ja も剥がす（PR#297以降のusePathname対策）", () => {
    expect(stripLocalePrefix("/ja/legal/column/x")).toBe("/legal/column/x");
    expect(stripLocalePrefix("/ja")).toBe("/");
  });
  it("素のパスはそのまま", () => {
    expect(stripLocalePrefix("/legal/column/x")).toBe("/legal/column/x");
    expect(stripLocalePrefix("/")).toBe("/");
  });
  it("ロケール風のスラッグを誤って剥がさない", () => {
    expect(stripLocalePrefix("/japan-guide")).toBe("/japan-guide");
    expect(stripLocalePrefix("/zhtml")).toBe("/zhtml");
  });
});

describe("addLocalePrefix × stripLocalePrefix の合成（言語スイッチャーの実経路）", () => {
  it("ja内部パスから各ロケールURLを正しく生成する（二重ロケールを生まない）", () => {
    const base = stripLocalePrefix("/ja/legal/column/x");
    expect(addLocalePrefix(base, "ja")).toBe("/legal/column/x");
    expect(addLocalePrefix(base, "en")).toBe("/en/legal/column/x");
    expect(addLocalePrefix(base, "zh-tw")).toBe("/zh-tw/legal/column/x");
    expect(addLocalePrefix(base, "zh")).toBe("/zh/legal/column/x");
  });
  it("トップページでも同様", () => {
    const base = stripLocalePrefix("/ja");
    expect(addLocalePrefix(base, "en")).toBe("/en");
    expect(addLocalePrefix(base, "ja")).toBe("/");
  });
});

describe("detectLocaleFromPath", () => {
  it("/ja/... は locale=ja として検出する", () => {
    expect(detectLocaleFromPath("/ja/souzoku")).toEqual({ locale: "ja", strippedPath: "/souzoku" });
  });
  it("zh-tw が zh に誤マッチしない", () => {
    expect(detectLocaleFromPath("/zh-tw/souzoku").locale).toBe("zh-tw");
  });
});
