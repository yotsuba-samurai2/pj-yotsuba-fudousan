import { describe, expect, it } from "vitest";
import { localizeFixedValue } from "../property-i18n";

describe("sale listing fixed value translations", () => {
  it.each(["en", "zh-tw", "zh"] as const)("translates supported sale fields in %s without losing amounts", (locale) => {
    for (const value of ["税込", "全部委託", "通勤", "なし（清掃員のみ）", "地上3階建（RC造陸屋根）", "地上4階建（RC造）", "3・4階"]) {
      expect(localizeFixedValue(value, locale), value).toBeTruthy();
    }
    expect(localizeFixedValue("月額16,370円", locale)).toContain("16,370");
    const combined = localizeFixedValue("修繕積立金 月額21,220円／ルーフバルコニー使用料 月額1,260円", locale);
    expect(combined).toContain("21,220");
    expect(combined).toContain("1,260");
  });
  it("does not silently drop extra conditions from free text", () => {
    expect(localizeFixedValue("月額16,370円（別途費用あり）", "en")).toBeNull();
    expect(localizeFixedValue("地上4階建（RC造）・増築あり", "en")).toBeNull();
  });
});
