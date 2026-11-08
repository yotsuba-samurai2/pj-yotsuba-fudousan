import { describe, expect, it } from "vitest";
import { LABOR_OFFICE_INFO } from "@/lib/data/labor-office-info-patches";
import { LABOR_OFFICE_ENGAGEMENT, withLaborOfficeEngagement } from "@/lib/labor/office-engagement";

const locales = ["ja", "en", "zh-tw", "zh"] as const;

describe("labor office engagement terms", () => {
  it.each([
    ["ja", "入退社などの手続きや給与計算", "顧問契約なしでも", "障害年金", "外部監査人"],
    ["en", "Employee joining and leaving procedures and payroll-only work", "without an advisory retainer", "Disability pension", "external auditor"],
    ["zh-tw", "入離職等手續或薪資計算可單獨委託", "無須簽訂顧問契約", "障礙年金", "外部稽核人員"],
    ["zh", "入离职等手续或工资计算可单独委托", "无需签订顾问合同", "残障年金", "外部审计人员"],
  ] as const)("states the limited standalone scope and preserves existing exceptions: %s", (locale, scope, standalone, pension, audit) => {
    const value = LABOR_OFFICE_ENGAGEMENT[locale].value;
    for (const phrase of [scope, standalone, pension, audit]) expect(value).toContain(phrase);
  });

  it.each(locales)("aligns the office information source with standalone engagements: %s", (locale) => {
    expect(LABOR_OFFICE_INFO[locale]).toContainEqual(LABOR_OFFICE_ENGAGEMENT[locale]);
  });

  it.each(locales)("replaces only stale engagement terms, including Japanese fallback: %s", (locale) => {
    const address = { label: "Address", value: "existing address" };
    const rows = [address, { label: "受任の前提", value: "old retainer requirement" }];
    const original = structuredClone(rows);
    const aligned = withLaborOfficeEngagement(locale, rows);
    expect(aligned).toEqual([address, LABOR_OFFICE_ENGAGEMENT[locale]]);
    expect(aligned[0]).toBe(address);
    expect(rows).toEqual(original);
    expect(withLaborOfficeEngagement(locale, aligned)).toEqual(aligned);
  });

  it.each(locales)("keeps locale-specific old terms from surviving: %s", (locale) => {
    const labels = ["受任の前提", "Terms of engagement", "受任前提"];
    for (const label of labels) {
      expect(withLaborOfficeEngagement(locale, [{ label, value: "old requirement" }]))
        .toEqual([LABOR_OFFICE_ENGAGEMENT[locale]]);
    }
  });

  it.each(locales)("adds the approved terms when a dictionary has no terms row: %s", (locale) => {
    const rows = [{ label: "Phone", value: "existing phone" }];
    expect(withLaborOfficeEngagement(locale, rows)).toEqual([...rows, LABOR_OFFICE_ENGAGEMENT[locale]]);
    expect(withLaborOfficeEngagement(locale, [])).toEqual([LABOR_OFFICE_ENGAGEMENT[locale]]);
  });
});
