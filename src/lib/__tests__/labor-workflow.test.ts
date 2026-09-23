import { describe, it, expect, vi, afterAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { LangCode } from "@/config/languages";
import { LABOR_WORKFLOW_COPY } from "@/lib/labor/workflow-copy";
import { LABOR_TOP_COPY } from "@/lib/labor/top-copy";
const state = vi.hoisted(() => {
  const previous = process.env.NEXT_PUBLIC_SR_LAUNCHED;
  process.env.NEXT_PUBLIC_SR_LAUNCHED = "true";
  return { locale: "ja" as LangCode, previous };
});
afterAll(() => {
  if (state.previous === undefined) delete process.env.NEXT_PUBLIC_SR_LAUNCHED;
  else process.env.NEXT_PUBLIC_SR_LAUNCHED = state.previous;
});
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => state.locale }));
vi.mock("@/components/shared/Breadcrumb", () => ({ Breadcrumb: () => null }));
vi.mock("@/components/shared/CtaBand", () => ({ CtaBand: () => null }));
import Flow, { generateMetadata } from "@/app/[locale]/(labor)/labor/nagare/page";
import Top from "@/app/[locale]/(labor)/labor/page";

const encoded = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");

for (const locale of ["ja", "en", "zh-tw", "zh"] as const) describe(`inquiry workflow (${locale})`, () => {
  it("renders the full eight-step account, outcomes, roles, scope and all six FAQ answers in initial HTML", async () => {
    state.locale = locale;
    const c = LABOR_WORKFLOW_COPY[locale];
    const html = renderToStaticMarkup(await Flow());
    expect(c.steps.map(step => step.id)).toEqual(Array.from({length:8}, (_, i) => `step-${i+1}`));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toContain("<main");
    for (const step of c.steps) {
      expect(html.match(new RegExp(`id="${step.id}"`, "g"))).toHaveLength(1);
      expect(html).toContain(`href="#${step.id}"`);
      expect(html).toContain(`<h3>${encoded(step.title)}</h3>`);
      for (const paragraph of [...step.paragraphs, step.outcome]) expect(html).toContain(encoded(paragraph));
    }
    expect(c.steps[6].roles).toHaveLength(2);
    for (const role of c.steps[6].roles!) expect(html).toContain(encoded(role.body));
    expect(c.cases.items).toHaveLength(3);
    expect(c.faqs).toHaveLength(6);
    for (const qa of c.faqs) { expect(html).toContain(encoded(qa.q)); expect(html).toContain(encoded(qa.a)); }
    for (const note of [c.scopeNote,c.scheduleNote,c.cases.note,c.cases.separationNote,c.materials.sharingNote,c.materials.note,c.information.judgmentNote]) expect(html).toContain(encoded(note));
    expect(html).not.toContain('"@type":"HowTo"');
    expect(html).not.toMatch(/33,000|55,000|88,000/);
  });
  it("keeps consultation, price links and metadata in the selected locale without duplicating fee data", async () => {
    state.locale = locale;
    const prefix = locale === "ja" ? "" : `/${locale}`;
    const html = renderToStaticMarkup(await Flow());
    expect(html.match(new RegExp(`href="${prefix}/labor/contact\\?intent=labor"`, "g"))).toHaveLength(3);
    expect(html).toContain(`href="${prefix}/labor/ryokin"`);
    expect(html).toContain(`href="${prefix}/line"`);
    if (prefix) expect(html).not.toMatch(/href="\/(labor|line)(\/|\?|"|#)/);
    const metadata = await generateMetadata();
    expect(metadata.title).toEqual({ absolute: LABOR_WORKFLOW_COPY[locale].metaTitle });
    expect(metadata.alternates?.canonical).toBe(`https://luck428.com${prefix}/labor/nagare`);
  });
  it("places three request types then the four-group banner before prices, without the former duplicate workflow", async () => {
    state.locale = locale;
    const html = renderToStaticMarkup(await Top());
    const requestIndex = html.indexOf('id="standalone-services"');
    const bannerIndex = html.indexOf('id="workflow-banner-title"');
    const pricesIndex = html.indexOf('id="advisory-plan"');
    expect(requestIndex).toBeGreaterThan(-1);
    expect(bannerIndex).toBeGreaterThan(requestIndex);
    expect(pricesIndex).toBeGreaterThan(bannerIndex);
    for (const service of LABOR_TOP_COPY[locale].services) expect(html).toContain(encoded(service.title));
    expect(LABOR_WORKFLOW_COPY[locale].banner.groups).toHaveLength(4);
    for (const group of LABOR_WORKFLOW_COPY[locale].banner.groups) expect(html).toContain(encoded(group.stepRange));
    expect(html).toContain("labor-representative-0169.webp");
    expect(html).not.toContain("labor-top-16x9.webp");
  });
});
