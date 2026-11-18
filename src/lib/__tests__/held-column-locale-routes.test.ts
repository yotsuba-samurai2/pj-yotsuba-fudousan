import { describe, expect, it } from "vitest";
import { isHeldManuscriptRoute } from "../../../scripts/helpers/held-column-routes-20261118";

const slug = "keiei-kanri-zairyu-2025-kaisei-shihonkin-joukin-shokuin-chuka-taiwan";

describe("held-column editorial link validation (not an approval)", () => {
  it.each(["en", "zh-tw", "zh"])("accepts precisely listed paths with their own %s prefix", (locale) => {
    expect(isHeldManuscriptRoute("legal", slug, locale, `/${locale}/global`)).toBe(true);
  });
  it.each(["/global", "/zh/global", "/en/legal/column/not-listed", "/en/global?x=1", "/en/x/../global", "//luck428.com/en/global", "/en/global#new"])
    ("does not authorize an unlisted or wrong-locale target: %s", (href) => {
      expect(isHeldManuscriptRoute("legal", slug, "en", href)).toBe(false);
    });
  it("does not make a rule for other articles, other businesses, or unsupported locales", () => {
    expect(isHeldManuscriptRoute("legal", "not-in-this-repair", "en", "/en/global")).toBe(false);
    expect(isHeldManuscriptRoute("realestate", slug, "en", "/en/global")).toBe(false);
    expect(isHeldManuscriptRoute("legal", slug, "ja", "/ja/global")).toBe(false);
  });
});
