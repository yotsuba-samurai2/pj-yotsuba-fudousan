import { afterAll, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { prepareClientTranslations } from "@/lib/client-translations";
import { withLayoutTranslations } from "@/lib/layout-translations";
import type { LangCode } from "@/config/languages";

const state = vi.hoisted(() => {
  const previous = process.env.NEXT_PUBLIC_SR_LAUNCHED;
  process.env.NEXT_PUBLIC_SR_LAUNCHED = "true";
  return { locale: "ja" as LangCode, previous };
});
afterAll(() => {
  if (state.previous === undefined) delete process.env.NEXT_PUBLIC_SR_LAUNCHED;
  else process.env.NEXT_PUBLIC_SR_LAUNCHED = state.previous;
});
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ locale: state.locale, setLocale: vi.fn() }),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/labor" }));
vi.mock("@/components/shared/MobileStickyBar", () => ({ MobileStickyBar: () => null }));
vi.mock("@/components/shared/LinkaFab", () => ({ LinkaFab: () => null }));

import { TranslationProvider } from "@/contexts/TranslationContext";
import { TenantLayoutShell } from "@/components/layout/TenantLayout";

const locales = [
  ["ja", "サービス", "事務所情報", "予約"],
  ["en", "Services", "Office", "Booking"],
  ["zh-tw", "服務內容", "事務所資訊", "預約"],
  ["zh", "服务内容", "事务所信息", "预约"],
] as const;

describe("labor layout when DB translations are unavailable", () => {
  it.each(locales)("renders the real header and footer in %s without exposing keys", async (locale, services, office, booking) => {
    state.locale = locale;
    // Both active language and Japanese fail, reproducing the production screenshot.
    const initialData = await prepareClientTranslations(locale, async () => ({}), true);
    const layoutProps = { businessKey: "labor" as const, columnLocales: {}, children: null };
    const providerProps = {
      initialData,
      children: createElement(TenantLayoutShell, layoutProps),
    };
    const html = renderToStaticMarkup(createElement(TranslationProvider, providerProps));
    expect(html).toContain(services);
    expect(html).toContain(office);
    expect(html).toContain(booking);
    expect(html).toContain("112-0006");
    expect(html).toContain('href="tel:03-6161-9428"');
    expect(html).not.toMatch(/(?:labor|legal|realestate|common|address|brand|representative)\.[a-zA-Z]+/);
    expect(Object.keys(initialData)).toEqual(locale === "ja" ? ["ja"] : [locale, "ja"]);
  });

  it("fills partial and malformed data while preserving valid edits and intentional empty notices", () => {
    const source = {
      labor: { nav: { services: "Updated services", contact: "labor.nav.contact", about: null }, footerNav: [] },
      common: { footer: { terms: "Custom terms" } },
      address: null,
      representative: { srExamNote: "" },
      pageContent: { title: "DB content", items: ["unchanged"] },
    };
    const original = structuredClone(source);
    const result = withLayoutTranslations("en", source);
    expect(result).toMatchObject({
      labor: { nav: { services: "Updated services", contact: "Contact", about: "About Us" }, footerNav: { office: { title: "Office" } } },
      common: { footer: { terms: "Custom terms" } },
      address: { phone: "03-6161-9428" },
      representative: { srExamNote: "" },
      pageContent: source.pageContent,
    });
    expect(source).toEqual(original);
  });

  it.each(locales)("keeps the unpublished labor dictionary out of the %s payload", async (locale) => {
    const data = await prepareClientTranslations(locale, async () => ({}), false);
    for (const dictionary of Object.values(data)) expect(dictionary).not.toHaveProperty("labor");
  });
});
