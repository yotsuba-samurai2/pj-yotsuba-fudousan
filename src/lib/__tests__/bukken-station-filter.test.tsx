import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { PropertyAccess, PublicProperty } from "../property-shared";
import { filterProperties, rentalStations } from "../property-filters";
import BukkenListPage from "@/app/[locale]/(realestate)/bukken/page";

const { readListings } = vi.hoisted(() => ({ readListings: vi.fn() }));
vi.mock("@/lib/properties", () => ({
  getPublishedProperties: readListings,
  getLocalizedProperty: (p: PublicProperty) => ({ title: p.title }),
}));
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => "ja" }));
vi.mock("@/components/bukken/PropertyCard", () => ({
  PropertyCard: ({ p }: { p: PublicProperty }) => <div data-listing={p.slug}>{p.title}</div>,
}));
vi.mock("@/components/bukken/RentalCampaignCta", () => ({ RentalCampaignCta: () => null }));
vi.mock("@/components/shared/CtaBand", () => ({ CtaBand: () => null }));
vi.mock("@/components/shared/Breadcrumb", () => ({ Breadcrumb: () => null }));

function rental(slug: string, access: PropertyAccess[], accessText = ""): PublicProperty {
  return {
    slug, title: "交通フィルター検証用", status: "published", category: "other", tradeMode: "broker",
    dealType: "rental", priceYen: 220000, locationText: "東京都文京区", description: "検証用",
    infoUpdatedAt: "2026-11-21", nextUpdateAt: "2026-11-28", locales: ["ja"], access, images: [],
    spec: {
      dealType: "rental", buildingType: "マンション", layout: "2LDK", exclusiveAreaSqm: 52, structure: "RC",
      floors: "5階", floorLocated: "1階", builtYm: "2020-01", deliveryYm: "相談",
      accessText, managementFee: "未確認", deposit: "未確認", keyMoney: "未確認", guaranteeDeposit: "未確認",
      renewalFee: "未確認", insurance: "未確認", guarantor: "未確認", otherFees: "未確認",
      contractType: "普通借家", contractPeriod: "未確認", conditions: "未確認",
    },
  };
}

const legacy = rental("legacy-shape", [
  { line: "東京メトロ丸ノ内線", station: "後楽園駅", distanceM: 400 },
  { line: "東京メトロ南北線", station: "後楽園駅", distanceM: 400 },
  { line: "都営三田線", station: "春日駅", distanceM: 400 },
]);
const evidenceText = [
  "東京メトロ丸ノ内線「後楽園」駅 徒歩5分",
  "東京メトロ南北線『後楽園』駅 徒歩5分",
  "都営三田線「春日」駅 徒歩5分",
].join("／");
const revised = rental("evidence-text-only", [], evidenceText);
const mixed = rental("both-shapes", legacy.access, evidenceText);
const other = rental("different-station", [{ line: "都営三田線", station: "白山駅", distanceM: 180 }]);

describe("物件一覧の駅名互換", () => {
  it.each(["後楽園駅", "後楽園", "春日駅", "春日", "　後楽園駅 "])("旧・新のアクセスを同じ条件 %s で検索", (station) => {
    expect(filterProperties([legacy, revised, mixed, other], { station }).map((p) => p.slug))
      .toEqual([legacy.slug, revised.slug, mixed.slug]);
  });

  it("同一物件の複数路線と旧新の重複を除くが、交通根拠には触れない", () => {
    for (const p of [legacy, revised, mixed]) expect(rentalStations(p)).toEqual(["後楽園", "春日"]);
    expect(legacy.access[0]).toEqual({ line: "東京メトロ丸ノ内線", station: "後楽園駅", distanceM: 400 });
    expect(revised.access).toEqual([]);
    expect(revised.spec).toMatchObject({ accessText: evidenceText });
  });

  it("『駅』を正式名に含む停留場・『駅前』を別名として勝手に削らない", () => {
    const tram = rental("tram-c15", [{ line: "富山地方鉄道富山港線", station: "富山駅", distanceM: 200 }]);
    const rail = rental("rail-toyama", [{ line: "北陸新幹線", station: "富山", distanceM: 260 }]);
    const bus = rental("bus-front", [{ line: "バス", station: "春日駅前", distanceM: 70 }]);
    expect(rentalStations(tram)).toEqual(["富山駅"]);
    expect(rentalStations(bus)).toEqual(["春日駅前"]);
    expect(filterProperties([tram, rail, bus], { station: "富山駅" })).toEqual([tram]);
    expect(filterProperties([tram, rail, bus], { station: "富山" })).toEqual([rail]);
    expect(filterProperties([tram, rail, bus], { station: "春日駅" })).toEqual([]);
  });

  it("売買物件の構造化データでも確認済み別名は同じ駅フィルターに入る", () => {
    const sale: PublicProperty = {
      ...legacy, dealType: "land",
      spec: { dealType: "land", landAreaSqm: 50, privateRoadAreaSqm: 0, landCategory: "宅地", zoning: "住居地域", buildingCoverage: "60%", floorAreaRatio: "200%", legalRestrictions: "なし" },
    };
    expect(filterProperties([sale], { station: "後楽園" })).toEqual([sale]);
  });

  it.each(["後楽園駅", "後楽園", "春日駅", "春日"])("実際の一覧で保存リンク %s が一つの正規選択肢を選ぶ", async (station) => {
    readListings.mockResolvedValueOnce([legacy, revised, mixed, other]);
    const html = renderToStaticMarkup(await BukkenListPage({ searchParams: Promise.resolve({ station }) }));
    const options = html.match(/<select[^>]*\bname="station"[^>]*>(.*?)<\/select>/)?.[1];
    expect(options?.match(/value="後楽園"/g)).toHaveLength(1);
    expect(options?.match(/value="春日"/g)).toHaveLength(1);
    expect(options).not.toMatch(/value="(?:後楽園駅|春日駅)"/);
    expect(options).toContain('value="' + (station.startsWith("後楽園") ? "後楽園" : "春日") + '" selected=""');
    for (const p of [legacy, revised, mixed]) expect(html).toContain('data-listing="' + p.slug + '"');
    expect(html).not.toContain('data-listing="' + other.slug + '"');
  });
});
