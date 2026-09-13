import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactForm } from "@/components/ui/ContactForm";
import { CATEGORY_ORDER_BY_BUSINESS, CATEGORY_ORDER_DEFAULT } from "@/lib/shared/contact-intake";
const state = vi.hoisted(() => ({ locale: "ja" }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/hooks/useTranslation", () => ({ useTranslation: () => ({ locale: state.locale, t: (key: string) => `${state.locale}:${key}` }) }));

describe("contact category order", () => {
  it.each(["ja", "en", "zh-tw", "zh"])("puts labor first without selecting it: %s", (locale) => {
    state.locale = locale;
    const html = renderToStaticMarkup(createElement(ContactForm, { business: "labor" }));
    const options = [...html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>/g)].map((m) => m[1]);
    expect(options.slice(0, 9)).toEqual(["", "labor", "subsidy", "visa", "bukken", "rental", "sale", "management", "other"]);
    expect(html).toContain('<option value="" selected="">');
    expect(html).not.toMatch(/<option value="labor" selected/);
  });
  it("preserves other business and unknown-business choices", () => {
    expect(CATEGORY_ORDER_BY_BUSINESS.realestate).toEqual(["bukken", "rental", "sale", "management", "souzoku", "akiya", "foreign-housing", "subsidy", "visa", "labor", "other"]);
    expect(CATEGORY_ORDER_BY_BUSINESS.legal).toEqual(["souzoku-legal", "oyanakiato", "shogai-fukushi", "gaikokujin-shain", "ikuseishuro-gaibu-kansa", "kikoku-funin", "kyoninka", "subsidy", "visa", "labor", "bukken", "other"]);
    expect(CATEGORY_ORDER_DEFAULT).toEqual(["bukken", "rental", "sale", "management", "subsidy", "visa", "labor", "other"]);
  });
});
