import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { LangCode } from "@/config/languages";
import { LABOR_OFFICE_ENGAGEMENT, type OfficeInfoRow } from "@/lib/labor/office-engagement";
import { Faq } from "@/components/shared/Faq";
import { getAdditionalLaborFaqs } from "@/lib/labor/additional-faqs";

const state = vi.hoisted(() => ({ locale: "ja" as LangCode, rows: [] as OfficeInfoRow[] }));
vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({ locale: state.locale, t: (key: string) => key, tArray: () => state.rows }),
}));
vi.mock("next/image", () => ({ default: () => null }));
vi.mock("@/components/ui/LocaleLink", () => ({
  LocaleLink: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));
import { LaborAboutPageContent } from "@/app/[locale]/(labor)/labor/about/PageContent";

const locales = ["ja", "en", "zh-tw", "zh"] as const;

describe("live labor policy and FAQ markup", () => {
  it.each(locales)("renders approved terms even when the DB still contains old text: %s", (locale) => {
    state.locale = locale;
    state.rows = [
      { label: "Phone", value: "03-6161-9428" },
      { label: LABOR_OFFICE_ENGAGEMENT[locale].label, value: "STALE_RETAINER_REQUIREMENT" },
    ];
    const html = renderToStaticMarkup(<LaborAboutPageContent />);
    expect(html).toContain(LABOR_OFFICE_ENGAGEMENT[locale].value);
    expect(html).not.toContain("STALE_RETAINER_REQUIREMENT");
    expect(html).toContain("03-6161-9428");
    expect((html.match(/<dt /g) ?? [])).toHaveLength(2);
    expect(state.rows[1].value).toBe("STALE_RETAINER_REQUIREMENT");
  });

  it.each(locales)("renders identical corrected disability-pension answers and JSON-LD: %s", (locale) => {
    const items = getAdditionalLaborFaqs(locale);
    const html = renderToStaticMarkup(<Faq items={items} withJsonLd />);
    const json = JSON.parse(html.match(/<script[^>]*>([\s\S]*?)<\/script>/)![1]);
    const pension = items.find(faq => /障害年金|disability pension/i.test(faq.q))!;
    const question = json.mainEntity.find((q: { name: string }) => q.name === pension.q);
    expect(question.acceptedAnswer.text).toBe(pension.a);
    expect(html).toContain(pension.a);
    expect(html).not.toContain("44,000");
  });
});
