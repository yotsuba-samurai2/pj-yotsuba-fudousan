import { describe, expect, it } from "vitest";
import { toPublicProperty, type PropertyInput, type PropertySpec } from "@/lib/property-shared";
import { publicContentHash } from "@/lib/property-publication";
import { buildLocalizedDisplayRows } from "@/lib/property-i18n";
import { buildRealEstateListingJsonLd } from "@/lib/property-jsonld";
import { bannedTermsError } from "@/lib/property-validation";
import { fixture } from "@/lib/rental-import/__tests__/fixtures";

const privateValue = "PRIVATE_CANARY_AD100_当社報酬_元付";
const privateFields = { internal: { ad: privateValue }, commission: privateValue, sourceEvidence: privateValue };
const house = { dealType: "house", landAreaSqm: 80, privateRoadAreaSqm: 0, buildingAreaSqm: 90, builtYm: "2000-01", deliveryYm: "相談", isRowHouse: false, leasehold: "普通借地" } as const;
const specs: PropertySpec[] = [
  { dealType: "land", landAreaSqm: 80, privateRoadAreaSqm: 0, landCategory: "宅地", zoning: "住居", buildingCoverage: "60%", floorAreaRatio: "200%", legalRestrictions: "なし", leasehold: "普通借地" },
  house,
  { dealType: "condo", floors: "5階", floorLocated: "3階", exclusiveAreaSqm: 60, balconyAreaSqm: "不明", builtYm: "2000-01", deliveryYm: "相談", managementFee: "1万円", repairReserve: "1万円", managementForm: "委託", managerWorkStyle: "日勤", leasehold: "普通借地" },
  { dealType: "wholeBuilding", landAreaSqm: 80, privateRoadAreaSqm: 0, buildingAreaSqm: 90, builtYm: "2000-01", deliveryYm: "相談", unitCount: 2, unitAreaMinSqm: 30, unitAreaMaxSqm: 50, structure: "RC", floors: "3階", leasehold: "普通借地" },
  { dealType: "businessBuilding", landAreaSqm: 80, privateRoadAreaSqm: 0, buildingAreaSqm: 90, builtYm: "2000-01", deliveryYm: "相談", structure: "RC", floors: "3階", zoning: "商業", leasehold: "普通借地" },
  { ...fixture().property.spec, brokerFee: "p033", availabilityExpiresAt: "2026-10-25T00:00:00Z" } as PropertySpec,
];
function property(spec = specs[5]): PropertyInput {
  return { ...fixture().property, status: "published", dealType: spec.dealType, spec: structuredClone(spec), access: [{ line: "テスト線", station: "テスト", distanceM: 400 }], locales: ["ja", "en", "zh-tw", "zh"], translations: {
    en: { title: "Example", description: "For families", locationText: "Bunkyo", priceNote: "Monthly", spec: spec.dealType === "land" ? { legalRestrictions: "None" } : { deliveryYm: "Negotiable" } },
    "zh-tw": { title: "測試", description: "家庭住宅" }, zh: { title: "测试", description: "家庭住宅" },
  } };
}
function contaminate(p: PropertyInput) {
  Object.assign(p, privateFields);
  Object.assign(p.spec, privateFields);
  p.access.forEach((a) => Object.assign(a, privateFields));
  p.images.forEach((i) => Object.assign(i, privateFields));
  Object.assign(p.translations!, { internal: privateFields, de: { title: privateValue } });
  for (const locale of ["en", "zh-tw", "zh"] as const) {
    Object.assign(p.translations![locale]!, privateFields);
    p.translations![locale]!.spec = { ...p.translations![locale]!.spec, commission: privateValue };
  }
  return p;
}

describe("公開データ境界", () => {
  it("空の任意ルート項目は従来どおり省略する", () => {
    const p = property(); p.priceNote = ""; p.publishedAt = "";
    const pub = toPublicProperty(p);
    expect(pub).not.toHaveProperty("priceNote"); expect(pub).not.toHaveProperty("publishedAt");
  });
  it.each(specs)("$dealType: ネストした非公開項目を除き既存の公開値を保つ", (spec) => {
    const clean = property(spec);
    const pub = toPublicProperty(contaminate(structuredClone(clean)));
    expect(pub.spec).toEqual(clean.spec);
    expect(pub.access).toEqual(clean.access);
    expect(pub.images).toEqual(clean.images);
    expect(pub.translations?.en).toEqual(clean.translations?.en);
    expect(JSON.stringify(pub)).not.toContain(privateValue);
    expect(Object.keys(pub.translations!)).toEqual(["en", "zh-tw", "zh"]);
  });
  it("公開後に社内オブジェクトを変更しても公開値が変わらない", () => {
    const p = property(); const pub = toPublicProperty(p); const before = JSON.stringify(pub);
    contaminate(p); p.images[0].alt = privateValue; p.access[0].line = privateValue;
    p.locales!.push("zh"); p.translations!.en!.spec!.deliveryYm = privateValue;
    expect(JSON.stringify(pub)).toBe(before);
  });
  it("私的な観測情報が公開差分hashを変えず、公開値の変更は変える", () => {
    const clean = property(); const dirty = contaminate(structuredClone(clean));
    expect(publicContentHash(dirty)).toBe(publicContentHash(clean));
    dirty.priceYen += 1000;
    expect(publicContentHash(dirty)).not.toBe(publicContentHash(clean));
  });
  it("概要表・翻訳・JSON-LDへ非公開項目を渡さない", () => {
    const p = toPublicProperty(contaminate(property()));
    const output = [p, buildLocalizedDisplayRows(p, "en"), buildRealEstateListingJsonLd(p, "en", { url: "https://example.test/bukken/test", siteUrl: "https://example.test", inLanguage: "en", images: p.images.map((i) => i.url) })];
    expect(JSON.stringify(output)).not.toContain(privateValue);
    expect(buildLocalizedDisplayRows(p, "en").find((r) => r.key === "deliveryYm")?.value).toBe("Negotiable");
  });
  it.each(["title", "spec", "access", "images", "translation"])("許可した文字列欄にオブジェクトが入っても丸渡ししない: %s", (field) => {
    const p = property();
    const targets = { title: [p, "title"], spec: [p.spec, "conditions"], access: [p.access[0], "line"], images: [p.images[0], "alt"], translation: [p.translations!.en!, "title"] } as const;
    const [target, key] = targets[field as keyof typeof targets]; Object.assign(target, { [key]: { internal: privateValue } });
    expect(() => toPublicProperty(p)).toThrow("公開物件のデータ形式が不正です");
  });
});

describe("公開前の全テキスト検査", () => {
  it.each(["spec", "alt", "translation", "translatedSpec", "location", "access"])("通常APIの公開入力に業者間用語があれば拒否: %s", (field) => {
    const p = property();
    if (field === "spec" && p.spec.dealType === "rental") p.spec.conditions = "ＡＤ１００";
    if (field === "alt") p.images[0].alt = "元付の図面";
    if (field === "translation") p.translations!.en!.description = "AD100";
    if (field === "translatedSpec") p.translations!.en!.spec!.deliveryYm = "広告料100%";
    if (field === "location") p.locationText = "業務委託料20万円";
    if (field === "access") p.access[0].line = "ATBB掲載";
    expect(bannedTermsError(p)).not.toBeNull();
    expect(bannedTermsError({ ...p, status: "draft" })).toBeNull();
  });
  it("社内専用欄、画像URLの文字列、顧客の仲介手数料は拒否しない", () => {
    const p = property(); p.internal = privateFields; p.images[0].url = "https://example.test/AD100.jpg";
    p.description = "仲介手数料は0.33ヶ月。ADSL対応。";
    expect(bannedTermsError(p)).toBeNull();
  });
});
