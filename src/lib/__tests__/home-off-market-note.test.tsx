import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HomeOffMarketNote } from "../../components/shared/HomeOffMarketNote";

const cases = [
  ["ja", "ja", "サイト未掲載の物件も個別にお探しします。"],
  ["en", "en", "We can also look for properties not listed on our website, based on your needs."],
  ["zh-tw", "zh-Hant", "我們也會依您的需求，個別尋找網站上尚未刊登的物件。"],
  ["zh", "zh-Hans", "我们也会根据您的需求，单独寻找网站上尚未刊登的房源。"],
] as const;

describe("safe off-market home note", () => {
  for (const [locale, lang, expected] of cases) {
    it(`${locale}: server-renders only natural customer copy without quantity or internal notes`, () => {
      const html = renderToStaticMarkup(<HomeOffMarketNote locale={locale} />);
      const text = html.replace(/<[^>]*>/g, "").trim();
      expect(text).toBe(expected);
      expect(text).not.toMatch(/[0-9０-９]|多数|多數|大量|numerous|many|count|inventory|承認|审批|審批|未確認|未确认|確認事項|确认事项|公開前|公開前|社内|内部|internal|unverified|approval|pending/i);
      expect(html).toMatch(new RegExp(`^<p lang="${lang}"`));
      expect(html).toContain(`<strong class="font-semibold">${expected}</strong>`);
      // Static information is readable in document flow, not a fake interactive
      // control, an inaccessible image, or an unsolicited live announcement.
      expect(html).not.toMatch(/aria-hidden|role="(?:alert|button)"|aria-live|tabindex|<img|<button|<script|<input/i);
    });
  }
  it("has no client runtime, data/API access, environment switch or alternate public state", () => {
    const source = readFileSync("src/components/shared/HomeOffMarketNote.tsx", "utf8");
    expect(source.match(/^import .+$/gm)).toEqual(['import type { LangCode } from "@/config/languages";']);
    expect(source).not.toMatch(/use client|process\.env|fetch\(|axios|prisma|supabase|useEffect|dangerouslySetInnerHTML|async function/);
    expect(source).toContain("{ locale: LangCode }");
    expect(source).not.toMatch(/approved:|count:|enabled:|preview:/);
  });
});
