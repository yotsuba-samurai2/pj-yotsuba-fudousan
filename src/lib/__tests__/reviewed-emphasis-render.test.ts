import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ColumnBody from "@/components/column/ColumnBody";
import { REVIEWED_COLUMN_UPDATES } from "@/lib/data/columns-reviewed-update-20261010";
import type { ReviewedMaterial } from "@/lib/columns-reviewed-update";

vi.mock("next/navigation", () => ({ usePathname: () => "/labor/column/render-fixture" }));
vi.mock("@/components/shared/ContactCta", () => ({ InlineContactCta: () => null }));

const render = (content: string) => renderToStaticMarkup(createElement(ColumnBody, { content }));
const pairs = REVIEWED_COLUMN_UPDATES.flatMap(row => [
  { key: `${row.business}:${row.slug}:ja`, before: row.original.content, after: row.revised.content },
  ...(["en", "zh-tw", "zh"] as const).map(locale => ({
    key: `${row.business}:${row.slug}:${locale}`,
    before: row.original.translations![locale]!.content,
    after: row.revised.translations![locale]!.content,
  })),
]);

function withoutBodyWhitespace(material: ReviewedMaterial) {
  return {
    ...material, content: material.content.replace(/\s/g, ""),
    translations: Object.fromEntries(Object.entries(material.translations ?? {}).map(([locale, value]) => [
      locale, { ...value, content: value!.content.replace(/\s/g, "") },
    ])),
  };
}

describe("reviewed column emphasis rendering", () => {
  it.each([
    ["**先說結論：**本文", "**先說結論：** 本文", "先說結論："],
    ["**先讲要点：**正文", "**先讲要点：** 正文", "先讲要点："],
    ["**個別規制は残ります。**自律管理", "**個別規制は残ります。** 自律管理", "個別規制は残ります。"],
  ])("renders a strong span at a punctuation boundary: %s", (before, after, strongText) => {
    expect(render(before)).toContain("**");
    expect(render(after)).toContain(`<strong>${strongText}</strong>`);
    expect(render(after)).not.toContain("**");
  });

  it("repairs exactly 24 failing bodies with one space each using the production renderer", () => {
    const changed = pairs.filter(pair => pair.before !== pair.after);
    expect(changed).toHaveLength(24);
    for (const pair of changed) {
      expect(pair.after.length, pair.key).toBe(pair.before.length + 1);
      expect(pair.after.replace(/\s/g, ""), pair.key).toBe(pair.before.replace(/\s/g, ""));
      const before = render(pair.before), after = render(pair.after);
      expect(before, pair.key).toContain("**");
      expect(after, pair.key).not.toContain("**");
      expect((after.match(/<strong>/g) ?? []).length, pair.key)
        .toBe((before.match(/<strong>/g) ?? []).length + 1);
    }
  });

  it("preserves every claim, title, excerpt, keyword, FAQ and translation field in the fixed batch", () => {
    expect(REVIEWED_COLUMN_UPDATES.filter(row => row.originalFingerprint !== row.revisedFingerprint)).toHaveLength(11);
    for (const row of REVIEWED_COLUMN_UPDATES) {
      expect(withoutBodyWhitespace(row.revised), row.slug).toEqual(withoutBodyWhitespace(row.original));
    }
  });

  it("renders all 72 revised bodies without literal strong-emphasis delimiters", () => {
    expect(pairs).toHaveLength(72);
    for (const pair of pairs) expect(render(pair.after), pair.key).not.toContain("**");
  });
});
