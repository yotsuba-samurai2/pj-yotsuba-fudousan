// 学区ページ強化 作業手順書 v1・PR-1：ItemList を画面の件数と一致させる
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { fixture } from "@/lib/rental-import/__tests__/fixtures";
import { toPublicProperty, type PublicProperty } from "@/lib/property-shared";
import { schoolRentalPath } from "@/lib/rental-school-district";
import { findSchoolBySlug, listSchools } from "@/lib/school-district";
import { SchoolRentalIndex, SchoolRentalListings } from "@/components/gakku/SchoolRentalPages";
import type { PublicRentalSummary } from "@/lib/school-rental-feed";
import type { LangCode } from "@/config/languages";

vi.mock("@/components/shared/Breadcrumb", () => ({ Breadcrumb: () => null }));

function rental(address = "東京都文京区春日２丁目12-12"): PublicProperty {
  const p = fixture().property;
  p.locationText = address; p.status = "published"; p.locales = ["ja", "en", "zh-tw", "zh"];
  if (p.spec.dealType === "rental") p.spec.availabilityExpiresAt = "2999-01-01T00:00:00Z";
  p.translations = { en: { title: "Kasuga Apartment", description: "Apartment", locationText: "2-12-12 Kasuga, Bunkyo-ku, Tokyo" } };
  return toPublicProperty(p);
}

function summary(id: string, schoolSlug: string | null, building = "試験マンション", unit = "0205"): PublicRentalSummary {
  return {
    id, schoolSlug, checkedAt: "2026-09-23T03:00:00Z", nextReviewAt: "2026-09-30T03:00:00Z",
    building, unit, address: "東京都文京区春日２丁目", rentYen: 250000, managementYen: 10000, commonYen: 0,
    deposit: "1ヶ月", keyMoney: "1ヶ月", layout: "2LDK", areaSqm: 60, availabilityText: "相談",
    pets: "unknown", foreignNationals: "unknown", corporate: "unknown", companyHousing: "unknown", companyHousingTerms: "",
    petTerms: "", foreignTerms: "", corporateTerms: "", buildingType: "マンション", access: "", built: "", structure: "", floors: "",
    contractType: "", contractPeriod: "", guaranteeDeposit: "", renewalFee: "", insurance: "", guarantor: "", otherFees: "",
  } as PublicRentalSummary;
}

function itemLists(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => JSON.parse(m[1].replace(/\\u003c/g, "<")))
    .filter(d => d["@type"] === "ItemList");
}

describe("学区別ページの ItemList（PR-1）", () => {
  it.each(["ja", "en", "zh-tw", "zh"] as LangCode[])("%s: 自社物件＋フィード物件の件数が見出しの件数と一致する", locale => {
    const rows = [summary("rental-aaa", "kanatomi"), summary("rental-bbb", "kanatomi", "別マンション", "101"), summary("rental-zzz", "hongo")];
    const html = renderToStaticMarkup(createElement(SchoolRentalListings, { school: findSchoolBySlug("kanatomi")!, properties: [rental()], summaries: rows, locale }));
    const [list] = itemLists(html);
    expect(list.numberOfItems).toBe(3);
    expect(list.itemListElement).toHaveLength(3);
    const urls = list.itemListElement.map((i: { url: string }) => i.url);
    expect(urls.some((u: string) => u.includes("/bukken/"))).toBe(true);
    expect(urls.filter((u: string) => u.endsWith("#rental-aaa") || u.endsWith("#rental-bbb"))).toHaveLength(2);
    expect(urls.some((u: string) => u.includes("rental-zzz"))).toBe(false);
    for (const u of urls.filter((x: string) => x.includes("#rental-"))) expect(u).toContain(schoolRentalPath("kanatomi"));
    expect(html).toContain('id="rental-aaa"');
  });
  it("フィード物件だけの学区でも ItemList に入る（自社物件ゼロ）", () => {
    const html = renderToStaticMarkup(createElement(SchoolRentalListings, { school: findSchoolBySlug("aoyagi")!, properties: [], summaries: [summary("rental-ccc", "aoyagi")], locale: "ja" }));
    const [list] = itemLists(html);
    expect(list.numberOfItems).toBe(1);
    expect(list.itemListElement[0].name).toBe("試験マンション 0205");
  });
  it("物件もフィードもない学区は 0 件のまま", () => {
    const html = renderToStaticMarkup(createElement(SchoolRentalListings, { school: findSchoolBySlug("kubomachi")!, properties: [], summaries: [], locale: "ja" }));
    expect(itemLists(html)[0].numberOfItems).toBe(0);
  });
  it("ItemList に価格・面積・Offer を入れない", () => {
    const html = renderToStaticMarkup(createElement(SchoolRentalListings, { school: findSchoolBySlug("kanatomi")!, properties: [], summaries: [summary("rental-aaa", "kanatomi")], locale: "ja" }));
    const json = JSON.stringify(itemLists(html)[0]);
    expect(json).not.toMatch(/Offer|price|250000|floorSize/);
  });
});

describe("ハブの ItemList（PR-1）", () => {
  it.each(["ja", "en", "zh-tw", "zh"] as LangCode[])("%s: 20校の学区別ページを並べる", locale => {
    const html = renderToStaticMarkup(createElement(SchoolRentalIndex, { properties: [], summaries: [], locale }));
    const [list] = itemLists(html);
    expect(list.numberOfItems).toBe(20);
    expect(list["@id"]).toMatch(/#schools$/);
    const urls = list.itemListElement.map((i: { url: string }) => i.url);
    for (const s of listSchools()) expect(urls.some((u: string) => u.endsWith(schoolRentalPath(s.slug)))).toBe(true);
  });
});
