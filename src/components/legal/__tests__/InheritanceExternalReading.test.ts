import { describe, expect, it } from "vitest";
import { getInheritanceExternalReading } from "../InheritanceExternalReading";

const hk = "kaigai-honkon-singapore-souzokunin-isanbunkatsu-shomei";
const abroad = "souzoku-kaigai-gaikokuseki";
const taiwan = "taiwan-inkan-shomei-isan-bunkatsu";

describe("international inheritance external reading", () => {
  it("limits links to the intended articles and audiences", () => {
    expect(getInheritanceExternalReading(hk, "ja")).toHaveLength(3);
    expect(getInheritanceExternalReading(hk, "en")).toHaveLength(1);
    expect(getInheritanceExternalReading(abroad, "ja")).toHaveLength(3);
    expect(getInheritanceExternalReading(abroad, "en")).toHaveLength(1);
    expect(getInheritanceExternalReading(taiwan, "zh-tw")).toHaveLength(3);
    expect(getInheritanceExternalReading(taiwan, "zh")).toEqual([]);
    expect(getInheritanceExternalReading(hk, "zh")).toEqual([]);
    expect(getInheritanceExternalReading(taiwan, "ja")).toEqual([]);
    expect(getInheritanceExternalReading("some-unrelated-column", "ja")).toEqual([]);
    expect(getInheritanceExternalReading("constructor", "ja")).toEqual([]);
  });

  it("contains unique direct links and does not add declined or already published sources", () => {
    const rows = [
      ...getInheritanceExternalReading(hk, "ja"), ...getInheritanceExternalReading(hk, "en"),
      ...getInheritanceExternalReading(abroad, "ja"), ...getInheritanceExternalReading(abroad, "en"),
      ...getInheritanceExternalReading(taiwan, "zh-tw"),
    ];
    expect(new Set(rows.map(({ href }) => href)).size).toBe(rows.length);
    for (const { href, source, title } of rows) {
      const url = new URL(href);
      expect(url.protocol).toBe("https:");
      expect(url.hostname).not.toMatch(/drewnapier|zenbridge|google/);
      expect(source).not.toEqual("");
      expect(title).not.toEqual("");
    }
  });
});
