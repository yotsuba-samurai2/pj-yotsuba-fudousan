import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LangCode } from "@/config/languages";
import { SR_REGISTRATION_NUMBER } from "@/lib/shared/sr-registration";
import { SR_OFFICE_NAME } from "@/lib/shared/sr-name";

const state = vi.hoisted(() => ({ locale: "ja" as LangCode, pathname: "/" }));
vi.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ locale: state.locale }) }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
vi.mock("@/components/shared/MobileStickyBar", () => ({ MobileStickyBar: () => null }));
vi.mock("@/components/shared/LinkaFab", () => ({ LinkaFab: () => null }));

const businesses = ["realestate", "legal", "labor"] as const;
const locales = ["ja", "en", "zh-tw", "zh"] as const;

describe.each([true, false])("footer credentials, SR_LAUNCHED=%s", (launched) => {
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

  for (const businessKey of businesses.filter(key => launched || key !== "labor")) {
    it.each(locales)(`${businessKey}: keeps other credentials and replaces stale exam copy in %s`, async (locale) => {
      state.locale = locale;
      state.pathname = businessKey === "realestate" ? "/" : `/${businessKey}`;
      // DBに旧文言が残っていても公開後は登録表示だけを使う。
      const staleExam = "旧試験合格・開業予定の案内";
      const initialData = await prepare(locale, async () => ({ representative: { srExamNote: staleExam } }), launched);
      const layoutProps = { businessKey, columnLocales: {}, children: null };
      const providerProps = {
        initialData,
        children: createElement(Layout, layoutProps),
      };
      const html = renderToStaticMarkup(createElement(Provider, providerProps));
      const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? "";
      expect(footer).toContain("25087022");
      expect(footer).toContain("293544");
      expect(footer).toContain('href="https://www.samurai.co.jp/"');
      const registrationLines = footer.match(new RegExp(`<p[^>]*>[^<]*${SR_REGISTRATION_NUMBER}[^<]*<\\/p>`, "g")) ?? [];
      if (launched) {
        expect(registrationLines).toHaveLength(1);
        expect(registrationLines[0]).toContain(SR_OFFICE_NAME);
        expect(registrationLines[0]).toContain("浦松丈二");
        expect(footer.indexOf(SR_REGISTRATION_NUMBER)).toBeGreaterThan(footer.indexOf("25087022"));
        expect(footer).not.toContain(staleExam);
        expect(footer).not.toContain("representative.srExamNote");
        expect(footer).not.toContain("202500525");
        if (locale === "ja") expect(registrationLines[0]).toContain(`代表社会保険労務士 浦松丈二　登録番号：第${SR_REGISTRATION_NUMBER}号`);
      } else {
        expect(registrationLines).toHaveLength(0);
        expect(footer).not.toContain(SR_REGISTRATION_NUMBER);
        expect(footer).toContain(staleExam);
      }
    });
  }
});
