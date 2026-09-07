import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/prisma", () => ({ prisma: {} }));
import { columnPagePath, columnSummaryQuery, parseColumnPage } from "@/lib/columns";
import { localeSwitchBasePath } from "@/lib/locale";
import { canonicalUrl } from "@/lib/seo";

describe("column pagination contract", () => {
  it("accepts first and later pages", () => {
    expect(parseColumnPage(undefined)).toBe(1);
    expect(parseColumnPage("1")).toBe(1);
    expect(parseColumnPage("12")).toBe(12);
  });
  it.each(["", "0", "-1", "1.5", "NaN", "Infinity", "1e2", "01", "2147483647", ["1", "2"]])(
    "rejects invalid page %s", value => expect(parseColumnPage(value)).toBeUndefined(),
  );
  it("keeps locale and page in canonical URLs", () => {
    for (const locale of ["ja", "en", "zh-tw", "zh"]) {
      const prefix = locale === "ja" ? "" : `/${locale}`;
      expect(canonicalUrl("legal", columnPagePath("/legal/column", 2), locale))
        .toBe(`https://luck428.com${prefix}/legal/column/page/2`);
      expect(columnPagePath("/column", 1)).toBe("/column");
    }
  });
  it.each(["ja", "en", "zh-tw", "zh"] as const)("projects only summary fields for %s", locale => {
    const query = columnSummaryQuery("realestate", locale, 20, 20);
    expect(query.text).not.toMatch(/\bcontent\b/);
    expect(query.text).not.toMatch(/SELECT\s+\*/i);
    expect(query.text).toMatch(/ORDER BY date DESC, slug ASC LIMIT \$\d+ OFFSET \$\d+/);
    expect(query.values.slice(-2)).toEqual([20, 20]);
    if (locale === "ja") expect(query.text).not.toContain("translations");
    else {
      expect(query.text).toContain("COALESCE(NULLIF(translations ->");
      expect(query.values).toContain(locale);
      expect(query.values).not.toContain("content");
    }
  });
});

it("switches paginated column lists to a valid locale entry point only", () => {
  for (const locale of ["ja", "en", "zh-tw", "zh"]) {
    for (const path of ["/column", "/legal/column", "/labor/column"]) {
      expect(localeSwitchBasePath(`/${locale}${path}/page/5`)).toBe(path);
      expect(localeSwitchBasePath(`/${locale}${path}/article`)).toBe(`${path}/article`);
    }
  }
  expect(localeSwitchBasePath("/en/other/page/5")).toBe("/other/page/5");
});
