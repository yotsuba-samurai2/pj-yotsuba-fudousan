import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LangCode } from "@/config/languages";

const state = vi.hoisted(() => ({ locale: "ja" as LangCode, pathname: "/" }));
vi.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ locale: state.locale, setLocale: vi.fn() }) }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
vi.mock("@/components/shared/MobileStickyBar", () => ({ MobileStickyBar: () => null }));
vi.mock("@/components/shared/LinkaFab", () => ({ LinkaFab: () => null }));

const businesses = [
  { key: "realestate", path: "/" },
  { key: "legal", path: "/legal" },
  { key: "labor", path: "/labor" },
] as const;
const locales = [
  ["ja", "", "グループサイト"],
  ["en", "/en", "Group websites"],
  ["zh-tw", "/zh-tw", "集團網站"],
  ["zh", "/zh", "集团网站"],
] as const;

describe.each([true, false])("group menu with SR_LAUNCHED=%s", (launched) => {
  let Layout: typeof import("@/components/layout/TenantLayout").TenantLayoutShell;
  let Provider: typeof import("@/contexts/TranslationContext").TranslationProvider;
  let prepare: typeof import("@/lib/client-translations").prepareClientTranslations;
  beforeAll(async () => {
    vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED", String(launched));
    vi.resetModules();
    Layout = (await import("@/components/layout/TenantLayout")).TenantLayoutShell;
    Provider = (await import("@/contexts/TranslationContext")).TranslationProvider;
    prepare = (await import("@/lib/client-translations")).prepareClientTranslations;
  });
  afterAll(() => vi.unstubAllEnvs());

  for (const current of businesses.filter(business => launched || business.key !== "labor")) {
    it.each(locales)(`links from ${current.key} to the other published sites in %s`, async (locale, prefix, heading) => {
      state.locale = locale;
      state.pathname = `${prefix}${current.path}`;
      const initialData = await prepare(locale, async () => ({}), launched);
      const layoutProps = { businessKey: current.key, columnLocales: {}, children: null };
      const providerProps = {
        initialData,
        children: createElement(Layout, layoutProps),
      };
      const html = renderToStaticMarkup(createElement(Provider, providerProps));
      const section = html.match(/<section aria-labelledby="mobile-group-sites-title"[^>]*>([\s\S]*?)<\/section>/)?.[1];
      expect(section).toBeDefined();
      expect(section).toContain(heading);
      const available = businesses.filter(business => business.key !== current.key && (launched || business.key !== "labor"));
      for (const other of available) {
        const path = prefix && other.path === "/" ? "" : other.path;
        expect(section).toContain(`href="https://luck428.com${prefix}${path}"`);
      }
      const currentPath = prefix && current.path === "/" ? "" : current.path;
      expect(section).not.toContain(`href="https://luck428.com${prefix}${currentPath}"`);
      expect(section).not.toMatch(/(?:realestate|legal|labor)\.name/);
      expect(section).toContain('href="https://www.samurai.co.jp/"');
      expect(section).toMatch(/士[業业]ドットコム/);
      expect(section?.match(/<a /g)).toHaveLength(available.length + 1);
      if (!launched) expect(section).not.toContain("/labor");
    });
  }
});
