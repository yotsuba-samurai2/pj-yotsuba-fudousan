import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { mismatchedTranslationLinks } from "@/lib/columns-autopublish-quality";
import { qualityArticle } from "./fixtures/column-quality";

const source = readFileSync("scripts/seed-souzoku-legal-columns.ts", "utf8");
const verify = source.slice(source.indexOf("function verify("), source.indexOf("async function main("));
function notes(date: string, locale: "en" | "zh-tw" | "zh", href: string): string[] {
  const article = qualityArticle();
  article.date = date;
  article.translations![locale]!.content += ` [fixture](${href})`;
  return runInNewContext(ts.transpile(verify) + "\nverify([article])", {
    article, mismatchedTranslationLinks, REQUIRED_HUB_LINKS: {}, KNOWN_EXISTING_LEGAL_SLUGS: new Set(),
    FORBIDDEN_WORDS: [], REVIEWED_COLUMNS_20261010: new Set(), REQUIRED_PHRASES: {}, FORBIDDEN_PHRASES: {},
    isReviewedLocaleLink: () => false,
  }).filter((note: string) => note.includes("内部リンクに言語不一致"));
}

describe("Daily legal translation language regression", () => {
  it.each(["en", "zh-tw", "zh"] as const)("rejects absolute Japanese links in new %s seed drafts", (locale) => {
    expect(notes("2026-10-10", locale, "https://luck428.com/legal/ryokin#fees")).toHaveLength(1);
    expect(notes("2026-10-11", locale, `https://luck428.com/${locale}/legal/ryokin#fees`)).toEqual([]);
    expect(notes("2026-10-09", locale, "https://luck428.com/legal/ryokin#fees")).toEqual([]);
  });
  it.each(["en", "zh-tw", "zh"] as const)("recognizes complete %s language segments and leaves sources, images and anchors alone", (locale) => {
    expect(mismatchedTranslationLinks(`[ok](/${locale}) [ok](/${locale}/legal/contact?intent=legal#form) [source](https://www.nta.go.jp/taxes) ![image](/image.png) [section](#faq)`, locale)).toEqual([]);
    expect(mismatchedTranslationLinks(`[bad](https://luck428.com/${locale}-other/legal) [bad](/${locale}/../legal)`, locale)).toHaveLength(2);
  });
});
