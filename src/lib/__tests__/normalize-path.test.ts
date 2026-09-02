// normalizePath の ja 剥がし回帰防止（2026-09-02）。フッターのいい相続バナー・LINKA FAB抑制・
// cross-links の判定が「/ja/...」で全て外れていた本番実測に基づく。
import { describe, it, expect } from "vitest";
import { normalizePath } from "@/lib/normalize-path";

describe("normalizePath", () => {
  it("ja セグメントを剥がす", () => {
    expect(normalizePath("/ja/legal")).toBe("/legal");
    expect(normalizePath("/ja")).toBe("/");
  });
  it("非デフォルトロケールを剥がす", () => {
    expect(normalizePath("/en/legal")).toBe("/legal");
    expect(normalizePath("/zh-tw/souzoku")).toBe("/souzoku");
    expect(normalizePath("/zh")).toBe("/");
  });
  it("ロケール風のスラッグを誤って剥がさない", () => {
    expect(normalizePath("/japan-guide")).toBe("/japan-guide");
    expect(normalizePath("/zhtml")).toBe("/zhtml");
  });
});
