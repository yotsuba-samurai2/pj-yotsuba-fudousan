import { describe, expect, it, vi } from "vitest";
import { prepareClientTranslations } from "@/lib/client-translations";
import type { LangCode } from "@/config/languages";

const dictionary = {
  common: { title: "sample" },
  labor: { title: "private" },
  legal: { businesses: [{ name: "四葉不動産" }, { name: "四葉社會保險勞務士事務所" }] },
};

describe("client translation payload", () => {
  it.each(["ja", "en", "zh-tw", "zh"] as LangCode[])("only fetches the active locale and Japanese: %s", async (locale) => {
    const fetch = vi.fn(async (lang: LangCode) => ({ ...dictionary, locale: lang }));
    const data = await prepareClientTranslations(locale, fetch, true);
    expect(Object.keys(data)).toEqual(locale === "ja" ? ["ja"] : [locale, "ja"]);
    expect(fetch).toHaveBeenCalledTimes(locale === "ja" ? 1 : 2);
    expect(data[locale]?.locale).toBe(locale);
    expect(data.ja?.locale).toBe("ja");
  });
  it("strips unpublished entities without changing the cached source or subsequent public requests", async () => {
    const original = structuredClone(dictionary);
    const fetch = async () => dictionary;
    const privateData = await prepareClientTranslations("zh-tw", fetch, false);
    expect(JSON.stringify(privateData)).not.toContain("勞務士");
    expect(privateData.ja).not.toHaveProperty("labor");
    expect(dictionary).toEqual(original);
    const publicData = await prepareClientTranslations("en", fetch, true);
    expect(publicData.en).toEqual(original);
    expect(publicData.en).not.toBe(dictionary);
  });
  it("retains Japanese fallback if an active dictionary cannot be fetched", async () => {
    const data = await prepareClientTranslations("en", async (lang) => lang === "en" ? {} : dictionary, true);
    expect(data.en).toEqual({});
    expect(data.ja?.common).toEqual(dictionary.common);
  });
});
