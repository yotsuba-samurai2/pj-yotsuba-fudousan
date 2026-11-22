import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ColumnBody from "@/components/column/ColumnBody";
import { getLocalizedColumn, type Column } from "@/lib/column-shared";
import { fixMainlandInheritanceLinks } from "@/lib/legal/mainland-inheritance-links";

vi.mock("next/navigation", () => ({
  usePathname: () => "/zh/legal/column/chugoku-tairiku-souzokunin-shinzoku-koshosho-ryoji-ninsho",
}));

const householdPath = "/legal/column/taiwan-koseki-jokoseki-shutoku";
const sealPath = "/legal/column/taiwan-inkan-shomei-isan-bunkatsu";
const oldHousehold = `[台湾户籍、除籍的取得](https://luck428.com${householdPath})`;
const oldSeal = `[台湾的印鉴证明与遗产分割](https://luck428.com${sealPath})`;
const outsideScope = `[日本語参考](https://luck428.com${householdPath})・[繁體中文](/zh-tw${sealPath})`;
const legacyBody = `台湾的文件从 ${oldHousehold} 与 ${oldSeal} 查阅。\n\n${outsideScope}`;
const correctedBody = `台湾的文件从 [台湾户籍、除籍的取得](/zh${householdPath}) 与 [台湾的印鉴证明与遗产分割](/zh${sealPath}) 查阅。\n\n${outsideScope}`;

const article: Column = {
  business: "legal",
  slug: "chugoku-tairiku-souzokunin-shinzoku-koshosho-ryoji-ninsho",
  title: "Title",
  category: "Category",
  date: "2026-09-04",
  excerpt: "Excerpt",
  content: legacyBody,
  translations: {
    zh: { title: "标题", excerpt: "摘要", content: legacyBody },
    "zh-tw": { title: "標題", excerpt: "摘要", content: legacyBody },
    en: { title: "Title", excerpt: "Excerpt", content: legacyBody },
  },
};

describe("Mainland inheritance Simplified Chinese body links", () => {
  it("changes exactly the two known hrefs in the selected translation, with no new text", () => {
    const selected = getLocalizedColumn(article, "zh");
    const content = fixMainlandInheritanceLinks(article, "zh", selected.content);

    expect(content).toBe(correctedBody);
    expect(selected.content).toBe(legacyBody);
    const html = renderToStaticMarkup(createElement(ColumnBody, { content }));
    expect(html).toContain(`<a href="/zh${householdPath}">台湾户籍、除籍的取得</a>`);
    expect(html).toContain(`<a href="/zh${sealPath}">台湾的印鉴证明与遗产分割</a>`);
    expect(html).toContain(`<a href="https://luck428.com${householdPath}">日本語参考</a>`);
  });

  it.each(["ja", "zh-tw", "en"] as const)("leaves %s unchanged even with the same link literals", locale => {
    const content = getLocalizedColumn(article, locale).content;
    expect(fixMainlandInheritanceLinks(article, locale, content)).toBe(content);
  });

  it("leaves unrelated zh and missing, empty or unselected translations unchanged", () => {
    expect(fixMainlandInheritanceLinks({ ...article, slug: "unrelated" }, "zh", legacyBody)).toBe(legacyBody);
    expect(fixMainlandInheritanceLinks({ ...article, translations: {} }, "zh", legacyBody)).toBe(legacyBody);
    const noZhBody: Column = { ...article, translations: { zh: { title: "标题", excerpt: "摘要", content: "" } } };
    expect(fixMainlandInheritanceLinks(noZhBody, "zh", getLocalizedColumn(noZhBody, "zh").content)).toBe(legacyBody);
    const notSelected = `Lead\n${legacyBody}`;
    expect(fixMainlandInheritanceLinks(article, "zh", notSelected)).toBe(notSelected);
  });

  it("is a no-op after the two links are corrected and declines ambiguous duplicates", () => {
    const corrected = { ...article, translations: { zh: { title: "标题", excerpt: "摘要", content: correctedBody } } };
    expect(fixMainlandInheritanceLinks(corrected, "zh", correctedBody)).toBe(correctedBody);
    const duplicateBody = `${oldHousehold} ${oldHousehold}`;
    const duplicate = { ...article, translations: { zh: { title: "标题", excerpt: "摘要", content: duplicateBody } } };
    expect(fixMainlandInheritanceLinks(duplicate, "zh", duplicateBody)).toBe(duplicateBody);
  });
});
