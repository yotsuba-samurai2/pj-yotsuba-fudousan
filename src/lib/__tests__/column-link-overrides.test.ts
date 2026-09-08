import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
vi.mock("@/lib/column-language-index", () => ({
  getColumnLanguageIndex: vi.fn(async () => ({ "ja-only": ["ja"], "all-four": [], "taiwan": ["zh-tw"] })),
}));
import { getColumnLinkOverrides } from "@/lib/column-link-overrides";
import { resolveColumnLink } from "@/lib/column-language-links";
import ColumnBody from "@/components/column/ColumnBody";

it.each(["en", "zh-tw", "zh"])("links %s readers to the existing Japanese article with a language label", async locale => {
  const href=`/${locale}/legal/column/ja-only`;
  const content=`[Related article](${href} "Details")`;
  const linkOverrides=await getColumnLinkOverrides(content);
  const html=renderToStaticMarkup(createElement(ColumnBody,{content,linkOverrides}));
  expect(html).toContain('href="/legal/column/ja-only"');
  expect(html).toContain('title="Details"');
  expect(html).toContain('Related article (日本語)');
  expect(html).not.toContain(`href="${href}"`);
});
it("preserves absolute links, query strings and fragments on a fallback", () => {
  expect(resolveColumnLink("https://luck428.com/en/legal/column/ja-only?source=related#fees", {"ja-only":["ja"]}))
    .toEqual({href:"https://luck428.com/legal/column/ja-only?source=related#fees",language:"日本語"});
});
it("uses the published Taiwan version when no Japanese version exists", () => {
  expect(resolveColumnLink("/en/column/taiwan", {taiwan:["zh-tw"]}))
    .toEqual({href:"/zh-tw/column/taiwan",language:"繁體中文"});
});
it("does not change valid, external, unknown, or non-article links", async () => {
  const content="[A](/en/column/all-four) [B](https://example.com/en/column/ja-only) [C](/en/column/unknown) [D](/en/contact)";
  expect(await getColumnLinkOverrides(content)).toEqual({});
  expect(resolveColumnLink("//example.com/en/column/ja-only",{"ja-only":["ja"]})).toBeUndefined();
});
