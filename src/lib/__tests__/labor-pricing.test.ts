import { describe, expect, it } from "vitest";
import { getLaborMonthlyFee, LABOR_PRICING } from "@/lib/labor/pricing";

describe("V10 labor pricing (JPY, tax included)", () => {
  it.each([
    [1, 33000], [2, 33000], [3, 33000], [4, 44000], [5, 44000],
    [6, 55000], [7, 55000], [8, 55000], [9, 55000], [10, 55000],
    [11, 57200], [12, 59400], [13, 61600], [14, 63800], [15, 66000],
    [16, 68200], [17, 70400], [18, 72600], [19, 74800], [20, 77000],
    [21, 79200], [22, 81400], [23, 83600], [24, 85800], [25, 88000],
    [26, 90200], [27, 92400], [28, 94600], [29, 96800], [30, 99000],
  ])("quotes %i payroll recipients at %i yen per month", (people, yen) => {
    expect(getLaborMonthlyFee(people)).toBe(yen);
  });

  it.each([31, 32, 100, 1000])("requires a separate quote for %i recipients", (people) => {
    expect(getLaborMonthlyFee(people)).toBeNull();
  });

  it.each([0, -1, 1.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid payroll counts (%s) instead of displaying a misleading quote",
    (people) => expect(() => getLaborMonthlyFee(people)).toThrow(RangeError),
  );

  it("keeps setup and recruitment separate from the recurring fee", () => {
    expect(LABOR_PRICING.initialSetupFrom).toBe(88000);
    expect(LABOR_PRICING.recruitmentSupportFrom).toBe(22000);
    expect(LABOR_PRICING.currency).toBe("JPY");
    expect(LABOR_PRICING.taxIncluded).toBe(true);
    expect(getLaborMonthlyFee(1)).toBe(33000);
  });
});
