import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { OverseasTaxReference } from "@/components/labor/OverseasTaxReference";
const slug = "chugoku-chuzai-shakaihosho-kyotei-nijukanyu";
describe("overseas tax editorial reference", () => {
  it("shows the contextual link only on the designated Japanese article", () => {
    const html = renderToStaticMarkup(<OverseasTaxReference slug={slug} locale="ja" />);
    expect(html).toContain('href="https://arimura-cpa.com/column/kaigai-funin-kakuteishinkoku/tax-treaty/"');
    expect(html).toContain("別の制度です");
    expect(html).toContain("個別の税務判断は税理士");
    expect(html).not.toContain("提携");
  });
  it("does not add Japanese copy to other locales or unrelated columns", () => {
    for (const locale of ["en", "zh", "zh-tw"]) expect(renderToStaticMarkup(<OverseasTaxReference slug={slug} locale={locale} />)).toBe("");
    expect(renderToStaticMarkup(<OverseasTaxReference slug="other" locale="ja" />)).toBe("");
  });
});
