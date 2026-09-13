import { describe, expect, it } from "vitest";
import { LABOR_ENGAGEMENT_EXAMPLE as model, LABOR_ENGAGEMENT_ITEMS } from "@/lib/labor/engagement-pricing";
import { getLaborMonthlyFee } from "@/lib/labor/pricing";

describe("one-director, one-employee model (tax included)", () => {
  it("keeps initial fees, recurring fees and the conditional discount distinct", () => {
    expect(model).toMatchObject({ standalone: 144950, insuranceOnly: 54450, documents: 90500, advisoryWork: 136700, advisoryInitial: 191700, monthly: 33000, advisoryWithOneMonth: 224700, conditionalInitial: 136700, conditionalWithOneMonth: 169700 });
    expect(model.advisoryInitial - model.conditionalDiscount).toBe(model.conditionalInitial);
    expect(model.advisoryWithOneMonth - model.advisoryInitial).toBe(getLaborMonthlyFee(2));
    expect(model.insuranceOnly + model.documents).toBe(model.standalone);
  });
  it("charges individual enrollments once and does not waive company enrollment under the retainer", () => {
    const enrollments = LABOR_ENGAGEMENT_ITEMS.filter(item => item.key === "socialEnrollment" || item.key === "employmentEnrollment");
    expect(enrollments.reduce((total, item) => total + item.standalone, 0)).toBe(8250);
    expect(enrollments.reduce((total, item) => total + item.advisory, 0)).toBe(0);
    expect(LABOR_ENGAGEMENT_ITEMS.filter(item => item.category === "insurance").reduce((total, item) => total + item.advisory, 0)).toBe(46200);
  });
});
