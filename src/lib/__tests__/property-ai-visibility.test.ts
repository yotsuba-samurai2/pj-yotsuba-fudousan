import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { toPublicProperty, isPubliclyVisible, type AdminProperty, type RentalSpec } from "@/lib/property-shared";
import { buildLocalizedDisplayRows, formatPropertyPriceL, localizeFixedValue, localizedImageAlt, usageNote, PROPERTY_UI } from "@/lib/property-i18n";
import { buildRealEstateListingJsonLd, buildPropertyItemListJsonLd } from "@/lib/property-jsonld";
import { PROPERTY_RELATED_LINKS, relatedLinksFor } from "@/config/property-related-links";

const NOW = new Date("2026-09-20T03:00:00Z");
const SECRET = "ZZ-INTERNAL-MARKER-元付ヒミツ商事-AD200";

const rentalSpec: RentalSpec = {
  dealType: "rental", availabilityExpiresAt: "2026-09-21T03:00:00Z", buildingType: "マンション", layout: "1SLDK",
  exclusiveAreaSqm: 45.5, structure: "鉄筋コンクリート造", floors: "地上5階建", floorLocated: "3階", builtYm: "2020-03",
  deliveryYm: "即入居可", accessText: "架空線「架空」駅 徒歩5分", managementFee: "10,000円", deposit: "1ヶ月", keyMoney: "1ヶ月",
  guaranteeDeposit: "未確認", renewalFee: "新賃料の1ヶ月分", insurance: "加入必須（保険料・期間は未確認）", guarantor: "加入必須",
  otherFees: "なし", contractType: "普通借家契約", contractPeriod: "2年", conditions: "ペット不可。事務所利用は相談。",
};

function rental(over: Partial<AdminProperty> = {}): AdminProperty {
  return {
    id: "id-1", slug: "rent-test", status: "published", dealType: "rental", category: "other", tradeMode: "broker",
    title: "テスト荘 101", priceYen: 105_000, locationText: "東京都架空区架空町", access: [], spec: rentalSpec,
    images: [{ url: "https://example.supabase.co/a.webp", alt: "テスト荘 101 写真", kind: "photo" }, { url: "https://example.supabase.co/b.webp", alt: "テスト荘 101 間取り図", kind: "floorplan" }],
    description: "説明", publishedAt: "2026-09-20", infoUpdatedAt: "2026-09-20", nextUpdateAt: "2026-10-04",
    locales: ["ja", "en", "zh-tw", "zh"],
    translations: { en: { title: "Test House 101", description: "desc", locationText: "Kaku-cho, Kaku-ku, Tokyo", spec: { conditions: "No pets. Office use is negotiable." } } },
    internal: { memo: SECRET }, ...over,
  };
}

const land = (over: Partial<AdminProperty> = {}): AdminProperty => rental({
  slug: "land-test", dealType: "land", category: "jigyo", title: "テスト売地", priceYen: 58_000_000,
  spec: { dealType: "land", landAreaSqm: 100.5, privateRoadAreaSqm: 0, landCategory: "確認中", zoning: "商業地域", buildingCoverage: "80%", floorAreaRatio: "600%", legalRestrictions: "防火地域" },
  translations: undefined, ...over,
});

const urls = { url: "https://luck428.com/en/bukken/rent-test", siteUrl: "https://luck428.com", inLanguage: "en", images: [] };

describe("共通公開判定 isPubliclyVisible（T05・T12）", () => {
  it("published かつ期限内かつロケール公開のときだけ true", () => {
    const p = toPublicProperty(rental());
    expect(isPubliclyVisible(p, "en", NOW)).toBe(true);
    expect(isPubliclyVisible(toPublicProperty(rental({ status: "closed" })), "ja", NOW)).toBe(false);
    expect(isPubliclyVisible(toPublicProperty(rental({ status: "draft" })), "ja", NOW)).toBe(false);
    expect(isPubliclyVisible(toPublicProperty(rental({ locales: ["ja"] })), "zh", NOW)).toBe(false);
  });
  it("書込みが無くても確認期限を過ぎれば公開対象外（closed とは別理由）", () => {
    const p = toPublicProperty(rental());
    expect(isPubliclyVisible(p, "ja", new Date("2026-09-21T03:00:01Z"))).toBe(false);
    expect(p.status).toBe("published");
  });
});

describe("4言語の概要表（T06・T07）", () => {
  it("日本語は既存の行・ラベル・値のまま", () => {
    const rows = buildLocalizedDisplayRows(toPublicProperty(rental()), "ja");
    expect(rows.find((r) => r.key === "price")).toMatchObject({ label: "賃料", value: "105,000円／月", section: "costs" });
    expect(rows.every((r) => !r.untranslated)).toBe(true);
  });
  it("賃料は円建て・月額のまま。管理費を混ぜない", () => {
    expect(formatPropertyPriceL({ dealType: "rental", priceYen: 274_000 }, "en")).toBe("JPY 274,000/month");
    expect(formatPropertyPriceL({ dealType: "rental", priceYen: 274_000 }, "zh-tw")).toBe("274,000日圓／月");
    expect(formatPropertyPriceL({ dealType: "land", priceYen: 158_000_000 }, "zh")).toBe("1亿5,800万日元");
  });
  it("否定条件を定型辞書の部分一致で肯定に変えない", () => {
    expect(localizeFixedValue("ペット不可", "en")).toBeNull();
    expect(localizeFixedValue("ペット可（小型犬1匹まで）", "en")).toBeNull();
    const rows = buildLocalizedDisplayRows(toPublicProperty(rental()), "en");
    expect(rows.find((r) => r.key === "conditions")!.value).toBe("No pets. Office use is negotiable.");
    const zh = buildLocalizedDisplayRows(toPublicProperty(rental()), "zh").find((r) => r.key === "conditions")!;
    expect(zh).toMatchObject({ value: rentalSpec.conditions, untranslated: true });
  });
  it("未確認は未確認のまま訳す（無料・なし・0にしない）", () => {
    const rows = buildLocalizedDisplayRows(toPublicProperty(rental()), "en");
    expect(rows.find((r) => r.key === "guaranteeDeposit")!.value).toBe("Unconfirmed");
    expect(rows.find((r) => r.key === "insurance")).toMatchObject({ untranslated: true, value: rentalSpec.insurance });
  });
  it("必要表示の行を言語によって落とさない", () => {
    const p = toPublicProperty(rental());
    const ja = buildLocalizedDisplayRows(p, "ja").map((r) => r.key);
    for (const l of ["en", "zh-tw", "zh"] as const) expect(buildLocalizedDisplayRows(p, l).map((r) => r.key)).toEqual(ja);
  });
  it("4言語すべてに見出し・留保文がある", () => {
    for (const l of ["ja", "en", "zh-tw", "zh"] as const) {
      expect(usageNote({ dealType: "rental", category: "other" }, l)).toBe(PROPERTY_UI[l].noteRental);
      expect(usageNote({ dealType: "land", category: "other" }, l)).toBe(PROPERTY_UI[l].noteLandBusiness);
      expect(usageNote({ dealType: "condo", category: "toushi" }, l)).toBeNull();
    }
  });
  it("新しい公開文言に禁止表現を含まない", () => {
    const all = JSON.stringify(PROPERTY_UI) + JSON.stringify(PROPERTY_RELATED_LINKS.map((r) => r.label));
    for (const w of ["ワンストップ", "一気通貫", "一括サポート", "一括受任", "まとめて契約", "one-stop", "一站式", "街の不動産屋"]) expect(all.toLowerCase()).not.toContain(w.toLowerCase());
  });
});

describe("alt", () => {
  it("ja は登録済みalt、他言語は 物件名＋画像種別 だけ", () => {
    const p = toPublicProperty(rental());
    expect(localizedImageAlt(p.images[1], "Test House 101", "en")).toBe("Test House 101 — floor plan");
    expect(localizedImageAlt(p.images[0], "テスト荘 101", "ja")).toBe("テスト荘 101 写真");
  });
});

describe("JSON-LD（T07・T13）", () => {
  it("未確認・未翻訳の値と internal を出さず、不明はプロパティごと省く", () => {
    const data = buildRealEstateListingJsonLd(toPublicProperty(rental()), "en", urls);
    const s = JSON.stringify(data);
    expect(JSON.parse(s)).toBeTruthy();
    expect(s).not.toContain(SECRET);
    expect(s).not.toMatch(/未確認|確認中|Unconfirmed|Being confirmed/);
    expect(s).not.toContain("numberOfRooms");
    expect(s).not.toContain("petsAllowed");
    expect(s).not.toContain("availability");
  });
  it("賃貸は Apartment＋LeaseOut＋月額の UnitPriceSpecification。mainEntity に @id", () => {
    const d = buildRealEstateListingJsonLd(toPublicProperty(rental()), "en", urls) as Record<string, unknown>;
    const mainEntity = d.mainEntity as Record<string, unknown>, offers = d.offers as Record<string, unknown>;
    expect(mainEntity["@type"]).toBe("Apartment");
    expect(mainEntity["@id"]).toBe(`${urls.url}#property`);
    expect(mainEntity.floorSize).toEqual({ "@type": "QuantitativeValue", value: 45.5, unitCode: "MTK" });
    expect(offers.businessFunction).toBe("http://purl.org/goodrelations/v1#LeaseOut");
    expect(offers.price).toBe(105_000);
    expect(offers.priceSpecification).toMatchObject({ "@type": "UnitPriceSpecification", price: 105_000, priceCurrency: "JPY", unitCode: "MON" });
  });
  it("売地は Place＋PropertyValue。土地面積を floorSize に流用せず、確認中の地目は出さない", () => {
    const d = buildRealEstateListingJsonLd(toPublicProperty(land()), "ja", { ...urls, inLanguage: "ja" }) as Record<string, unknown>;
    const mainEntity = d.mainEntity as Record<string, unknown>, offers = d.offers as Record<string, unknown>;
    expect(mainEntity["@type"]).toBe("Place");
    expect(mainEntity.floorSize).toBeUndefined();
    const names = (mainEntity.additionalProperty as { name: string }[]).map((x) => x.name);
    expect(names).toEqual(["土地面積", "用途地域", "建ぺい率", "容積率"]);
    expect(offers.businessFunction).toBe("http://purl.org/goodrelations/v1#Sell");
    expect(offers.priceSpecification).toBeUndefined();
  });
  it("ItemList は渡した順の position を持つ", () => {
    const d = buildPropertyItemListJsonLd([{ name: "A", url: "https://luck428.com/bukken/a" }, { name: "B", url: "https://luck428.com/bukken/b" }], "https://luck428.com/bukken", "ja") as Record<string, unknown>;
    expect(d.numberOfItems).toBe(2);
    const items = d.itemListElement as { position: number; name: string }[];
    expect(items.map((x) => [x.position, x.name])).toEqual([[1, "A"], [2, "B"]]);
  });
});

describe("関連リンク対応表", () => {
  it("リンク先の page.tsx が実在する", () => {
    for (const r of PROPERTY_RELATED_LINKS) {
      expect(existsSync(join(process.cwd(), "src/app/[locale]/(realestate)", r.path, "page.tsx")), r.path).toBe(true);
    }
  });
  it("2〜4本・全ロケールにラベル・用途可否を示唆する導線（飲食店・民泊）を含まない", () => {
    for (const l of ["ja", "en", "zh-tw", "zh"] as const) {
      const links = relatedLinksFor({ category: "jigyo", dealType: "rental" }, l);
      expect(links.length).toBeGreaterThanOrEqual(2);
      expect(links.length).toBeLessThanOrEqual(4);
      expect(links.every((x) => x.label)).toBe(true);
      expect(links.some((x) => /inshokuten|minpaku/.test(x.path))).toBe(false);
    }
    expect(relatedLinksFor({ category: "toushi", dealType: "condo" }, "ja")[0].path).toBe("/toushi");
  });
});
