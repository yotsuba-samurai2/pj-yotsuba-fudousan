import { describe, expect, it } from "vitest";
import { getAdditionalLaborFaqs } from "@/lib/labor/additional-faqs";
import { LABOR_ANCILLARY_FEES, type AncillarySection } from "@/lib/labor/ancillary-fees";
import { buildFaqJsonLd } from "@/components/shared/Faq";

const locales = ["ja", "en", "zh-tw", "zh"] as const;

describe("disability pension FAQ", () => {
  it.each(locales)("does not append another pension procedure's fees: %s", (locale) => {
    const faqs = getAdditionalLaborFaqs(locale);
    const pension = faqs.find(faq => /障害年金|disability pension/i.test(faq.q))!;
    expect(pension).toBeDefined();
    expect(pension.a).not.toMatch(/44,000|55,000|16,500|脱退|脫退|lump-sum/i);
    expect(pension.a).not.toMatch(/\d/);
    const structured = buildFaqJsonLd(faqs).mainEntity.find(question => question.name === pension.q)!;
    expect(structured.acceptedAnswer.text).toBe(pension.a);
    // The withdrawal-payment fee itself and the other FAQs remain intact.
    const withdrawal = (LABOR_ANCILLARY_FEES[locale].sections as AncillarySection[]).find(section => section.id === "dattai-ichijikin")!;
    expect(withdrawal.rows[0].value).toBe(44000);
    expect(faqs[0].a).toContain("11,000");
    expect(faqs).toHaveLength(9);
  });

  it.each(locales)("does not select fees by their array position: %s", (locale) => {
    const sections = LABOR_ANCILLARY_FEES[locale].sections;
    const expected = getAdditionalLaborFaqs(locale).find(faq => /障害年金|disability pension/i.test(faq.q))!.a;
    sections.push({ title: "unrelated last section", rows: [{ name: "sentinel fee", unit: "case", price: "999,999" }] });
    try {
      expect(getAdditionalLaborFaqs(locale).find(faq => /障害年金|disability pension/i.test(faq.q))!.a).toBe(expected);
    } finally {
      sections.pop();
    }
  });
});
