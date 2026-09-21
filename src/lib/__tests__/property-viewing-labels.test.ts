import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PropertyViewingCta } from "@/components/bukken/PropertyViewingCta";
import { propertyViewingLabels } from "../property-viewing-labels";

describe("property viewing form languages", () => {
  it.each(["ja", "en", "zh-tw", "zh"] as const)("renders the form in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(PropertyViewingCta, { propertyTitle: "Example", propertyUrl: "/bukken/example", locale }));
    const labels = propertyViewingLabels[locale];
    for (const key of ["heading", "intro", "name", "email", "phone", "contract", "residents", "pets", "dates", "date1", "date2", "date3", "send"] as const) {
      expect(html).toContain(labels[key]);
    }
    if (locale !== "ja") expect(html).not.toContain("内見可能日をお知らせください");
    expect(html).toContain('value="個人"'); // Preserve the internal submission value.
    expect(html).toContain('value="法人"');
  });
});
