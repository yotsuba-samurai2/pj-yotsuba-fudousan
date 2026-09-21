import { describe, expect, it } from "vitest";
import { parsePropertyInput } from "@/lib/property-validation";
import { buildRequiredDisplayRows, type PublicProperty } from "@/lib/property-shared";
import { buildLocalizedDisplayRows } from "@/lib/property-i18n";

const condo = {
  slug: "example-condo", status: "published", dealType: "condo", category: "other", tradeMode: "broker",
  title: "Example condo", priceYen: 20000000, locationText: "Example town", access: [], images: [], description: "Example",
  infoUpdatedAt: "2026-09-21", nextUpdateAt: "2026-10-05",
  spec: { dealType: "condo", floors: "4", floorLocated: "3", exclusiveAreaSqm: 60, balconyAreaSqm: "不明", builtYm: "1990-10", deliveryYm: "相談", managementFee: "10000", repairReserve: "20000", managementForm: "全部委託", managerWorkStyle: "なし" },
};

describe("source explicitly records unknown balcony area", () => {
  it("preserves the source's unknown value without coercing it to zero", () => {
    const result = parsePropertyInput(condo);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.spec).toMatchObject({ balconyAreaSqm: "不明" });
  });
  it.each([undefined, null, "", "未確認", -1, NaN])("rejects absent or unsupported value %s", (value) => {
    expect(parsePropertyInput({ ...condo, spec: { ...condo.spec, balconyAreaSqm: value } }).ok).toBe(false);
  });
  it.each([0, 4.05])("keeps known numeric area %s", (value) => {
    const result = parsePropertyInput({ ...condo, spec: { ...condo.spec, balconyAreaSqm: value } });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.spec).toMatchObject({ balconyAreaSqm: value });
  });
  it("shows unknown in all languages, without NaN or a zero area", () => {
    const property = condo as unknown as PublicProperty;
    expect(buildRequiredDisplayRows(property).find((row) => row.key === "balconyArea")?.value).toBe("不明");
    for (const [locale, expected] of [["ja", "不明"], ["en", "Unknown"], ["zh-tw", "不明"], ["zh", "不详"]] as const) {
      expect(buildLocalizedDisplayRows(property, locale).find((row) => row.key === "balconyArea")?.value).toBe(expected);
    }
  });
});
