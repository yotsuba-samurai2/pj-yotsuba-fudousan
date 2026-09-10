import { afterAll, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
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
vi.mock("@/components/shared/TelLink", () => ({
  TelLink: ({ phone, children }: { phone: string; children: string }) =>
    createElement("a", { href: "tel:" + phone }, children),
}));
vi.mock("@/components/ui/ContactForm", () => ({
  ContactForm: ({ business, thanksPath }: { business: string; thanksPath: string }) =>
    createElement("form", { "data-business": business, "data-thanks": thanksPath }),
}));
vi.mock("@/app/[locale]/(realestate)/contact/ContactPageClient", () => ({ ContactPageClient: () => null }));

import RealestateContact, { generateMetadata as realestateMetadata } from "@/app/[locale]/(realestate)/contact/page";
import LegalContact, { generateMetadata as legalMetadata } from "@/app/[locale]/(legal)/legal/contact/page";
import LaborContact, { generateMetadata as laborMetadata } from "@/app/[locale]/(labor)/labor/contact/page";

const locales = [
  ["ja", "お問い合わせ", "ホーム", "パンくずリスト"],
  ["en", "Contact", "Home", "Breadcrumbs"],
  ["zh-tw", "聯絡我們", "首頁", "麵包屑導覽"],
  ["zh", "联系我们", "首页", "面包屑导航"],
] as const;
const sites = [
  { business: "realestate", base: "", page: RealestateContact, metadata: realestateMetadata },
  { business: "legal", base: "/legal", page: LegalContact, metadata: legalMetadata },
  { business: "labor", base: "/labor", page: LaborContact, metadata: laborMetadata },
] as const;

describe.each(sites)("$business contact localization", (site) => {
  it.each(locales)("serves matching metadata and breadcrumb URLs in %s", async (locale, title, home, navLabel) => {
    state.locale = locale;
    const prefix = locale === "ja" ? "" : "/" + locale;
    const path = site.base + "/contact";
    const canonical = "https://luck428.com" + prefix + path;
    const metadata = await site.metadata();
    expect(metadata.title).toEqual(expect.stringContaining(title));
    expect(metadata.description).toBeTruthy();
    if (locale !== "ja") {
      expect(metadata.description).not.toMatch(/ご相談|お問い合わせ|こちら|文京区の/);
    }
    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.openGraph).toMatchObject({ url: canonical, description: metadata.description });
    expect(metadata.alternates?.languages).toMatchObject({
      ja: "https://luck428.com" + path,
      en: "https://luck428.com/en" + path,
      "zh-Hant": "https://luck428.com/zh-tw" + path,
      "zh-Hans": "https://luck428.com/zh" + path,
    });
    const html = renderToStaticMarkup(await site.page());
    expect(html).toContain('aria-label="' + navLabel + '"');
    expect(html).toContain(home);
    expect(html).toContain(title);
    expect(html).toContain('href="' + (prefix + site.base || "/") + '"');
    expect(html).toContain('"item":"https://luck428.com' + prefix + site.base + '"');
  });
});

describe.each(sites.filter((site) => site.business !== "realestate"))("$business contact content", (site) => {
  it.each(locales)("translates visible details in %s and preserves contact destinations", async (locale, title) => {
    state.locale = locale;
    const html = renderToStaticMarkup(await site.page());
    expect(html).toMatch(new RegExp("<h1[^>]*>" + title + "</h1>"));
    expect(html).toContain('href="tel:03-6161-9428"');
    expect(html).toContain("03-6161-2576");
    expect(html).toContain("112-0006");
    expect(html).toContain('data-business="' + site.business + '"');
    expect(html).toContain('data-thanks="' + site.base + '/thanks"');
    if (locale !== "ja") {
      expect(html).not.toMatch(/お問い合わせ|所在地|営業時間|お気軽に|いただけます/);
    }
    if (locale === "en") {
      expect(html).toContain("4-2-5 Kohinata, Bunkyo-ku, Tokyo");
      expect(html).toContain(site.business === "labor" ? "social insurance" : "visa applications");
    }
    if (site.business === "labor") {
      expect(html).toContain('href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"');
      expect(html).toContain('rel="noopener noreferrer"');
      if (locale === "en") {
        expect(html).toContain("Tue–Wed 10:00–19:00");
        expect(html).toContain("Mon, Thu–Sun 18:00–19:00");
      }
    }
  });
});
