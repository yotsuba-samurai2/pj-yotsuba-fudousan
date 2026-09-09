import { afterAll, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
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
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => state.locale }));
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ locale: state.locale, setLocale: vi.fn() }),
}));
vi.mock("@/components/shared/CtaBand", () => ({ CtaBand: () => null }));
vi.mock("@/app/[locale]/(labor)/labor/about/PageContent", () => ({ LaborAboutPageContent: () => null }));
import About, { generateMetadata } from "@/app/[locale]/(labor)/labor/about/page";

describe("labor about locale metadata", () => {
  it.each([
    ["ja", "事務所概要", "ホーム"],
    ["en", "About Us", "Home"],
    ["zh-tw", "事務所概況", "首頁"],
    ["zh", "事务所概况", "首页"],
  ] as const)("keeps metadata and breadcrumbs in %s", async (locale, title, home) => {
    state.locale = locale;
    const prefix = locale === "ja" ? "" : "/" + locale;
    const canonical = "https://luck428.com" + prefix + "/labor/about";
    const metadata = await generateMetadata();
    expect(metadata.title).toEqual(expect.stringContaining(title));
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.openGraph).toMatchObject({ url: canonical, title });
    expect(metadata.alternates?.languages).toMatchObject({
      ja: "https://luck428.com/labor/about",
      en: "https://luck428.com/en/labor/about",
      "zh-Hant": "https://luck428.com/zh-tw/labor/about",
      "zh-Hans": "https://luck428.com/zh/labor/about",
    });
    const html = renderToStaticMarkup(await About());
    expect(html).toContain(home);
    expect(html).toContain(title);
    expect(html).toContain('href="' + prefix + '/labor"');
    expect(html).toContain('"item":"https://luck428.com' + prefix + '/labor"');
  });
});
