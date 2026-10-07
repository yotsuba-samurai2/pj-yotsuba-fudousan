import { LABOR_SETUP_COPY } from "@/lib/labor/setup-copy";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { languages } from "@/config/languages";
import { LABOR_PLAN_COPY } from "@/lib/labor/plan-copy";
import { LaborPlanPricing, LaborPlanPriceSummary, LaborPlanResponsibility, formatLaborYen } from "@/components/labor/LaborPlanPricing";

describe("V10 plan presentation", () => {
  it.each(languages)("renders both fees and responsibilities in $code without interaction", ({ code }) => {
    const html = renderToStaticMarkup(createElement(LaborPlanPricing, { locale: code }));
    const c = LABOR_PLAN_COPY[code];
    const rows = html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1];
    for (const [people, monthly] of [[1, 16500], [2, 22000], [3, 33000], [4, 44000], [5, 44000], [6, 55000], [7, 55000], [8, 55000], [9, 55000], [10, 55000]]) {
      expect(rows).toMatch(new RegExp(`>${people}</th><td[^>]*>${formatLaborYen(monthly, code)}`));
    }
    expect(rows?.match(/<tr>/g)).toHaveLength(11);
    expect(html).toContain(formatLaborYen(16500, code));
    expect(html).toContain(formatLaborYen(22000, code));
    expect(html).not.toMatch(/1–3|1–1|2–2|3–3|7,700|7700/);
    expect(html).toContain(formatLaborYen(33000, code));
    expect(html).toContain(formatLaborYen(88000, code));
    expect(html).toContain(formatLaborYen(55000, code));
    expect(html).toContain(c.monthly);
    expect(html).toContain(c.setup);
    expect(html).toContain(c.tax);
    expect(html).toContain(c.responsibility);
    expect(html).toContain(LABOR_SETUP_COPY[code].standardCondition);
    expect(html).toContain(LABOR_SETUP_COPY[code].migrationCondition);
    expect(html).toContain(LABOR_SETUP_COPY[code].quoteNote);
    expect(html).toContain("11+");
    expect(html).toContain(formatLaborYen(3300, code));
    expect(html).not.toContain("2,200");
    expect(html).not.toContain("31+");
    for (const item of [...LABOR_SETUP_COPY[code].standardItems, ...LABOR_SETUP_COPY[code].migrationItems]) expect(html).toContain(item);
    for (const heading of c.scopeHeadings) expect(html).toContain(heading);
    expect(html).toContain(c.system);
    const emphasized = renderToStaticMarkup(createElement(LaborPlanPriceSummary, { locale: code, emphasizePayroll: true }));
    expect(emphasized).toContain(c.payrollEligibility);
    expect(emphasized).toContain(formatLaborYen(16500, code));
    expect(emphasized).not.toMatch(/1–3|1〜3|1至3/);
    expect(html).toContain(c.separate);
    expect(html).not.toMatch(/<details|hidden|role="tab"/);
    expect(html.indexOf(LABOR_SETUP_COPY[code].heading)).toBeLessThan(html.indexOf("<table"));
    expect(html.indexOf("</table>")).toBeLessThan(html.indexOf(c.scopeHeadings[0]));
  });

  it("renders the exact requested Japanese Hero responsibility", () => {
    const html = renderToStaticMarkup(createElement(LaborPlanResponsibility, { locale: "ja" }));
    expect(html).toContain("勤怠の確認・確定と給与計算結果の最終承認は会社側");
  });
});
