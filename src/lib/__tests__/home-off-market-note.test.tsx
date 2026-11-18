import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HomeOffMarketNote } from "../../components/shared/HomeOffMarketNote";

const cases = [
  ["ja", "ja", "非公開物件も多数ご案内"],
  ["en", "en", "We can also introduce you to many properties that are not publicly listed."],
  ["zh-tw", "zh-Hant", "也可為您介紹許多未公開刊登的物件。"],
  ["zh", "zh-Hans", "也可为您介绍许多未公开发布的房源。"],
] as const;

describe("owner-approved off-market home note", () => {
  for (const [locale, lang, expected] of cases) {
    it(`${locale}: server-renders only the approved qualitative message without exact counts, guarantees or internal notes`, () => {
      const html = renderToStaticMarkup(<HomeOffMarketNote locale={locale} />);
      const text = html.replace(/<[^>]*>/g, "").trim();
      expect(text).toBe(expected);
      expect(text).not.toMatch(/[0-9０-９]|[百佰千仟]|数十|數十|幾十|几十|hundred|dozens|guaranteed|exclusive|always available|常時|必ず|独占|獨家|独家|保證|保证|メール|飛び込|来訪|email|walk-in|承認|审批|審批|確認事項|公开前|公開前|社内|内部|internal|approval/i);
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
