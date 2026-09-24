import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { fixture } from "@/lib/rental-import/__tests__/fixtures";
import { toPublicProperty, type PublicProperty, type PropertySpec } from "@/lib/property-shared";
import { groupSchoolSales, schoolSaleArea, SCHOOL_SALE_COPY, schoolSalePath } from "@/lib/sale-school-district";
import { groupSchoolRentals } from "@/lib/rental-school-district";
import { listSchools, findSchoolBySlug } from "@/lib/school-district";
import { SchoolSaleIndex, SchoolSaleListings } from "@/components/gakku/SchoolSalePages";
import { PropertySchoolDistrict } from "@/components/gakku/RentalSchoolDistrict";
import type { LangCode } from "@/config/languages";
vi.mock("@/components/shared/Breadcrumb", () => ({ Breadcrumb: () => null }));
const specs: Record<"land" | "house" | "condo", PropertySpec> = {
  land: { dealType: "land", landAreaSqm: 55, privateRoadAreaSqm: 0, landCategory: "宅地", zoning: "一住", buildingCoverage: "60%", floorAreaRatio: "200%", legalRestrictions: "準防火" },
  house: { dealType: "house", landAreaSqm: 30, privateRoadAreaSqm: 0, buildingAreaSqm: 55, builtYm: "2000-01", deliveryYm: "相談" },
  condo: { dealType: "condo", exclusiveAreaSqm: 55, balconyAreaSqm: 6, floors: "10階建", floorLocated: "3階", builtYm: "2000-01", deliveryYm: "相談", managementFee: "10000円", repairReserve: "10000円", managementForm: "全部委託", managerWorkStyle: "日勤" },
};
function sale(kind: keyof typeof specs, slug: string = kind): PublicProperty {
  const p = toPublicProperty(fixture().property);
  return { ...p, slug, dealType: kind, spec: specs[kind], status: "published", locationText: "東京都文京区春日２丁目12-12", images: [], locales: ["ja", "en", "zh-tw", "zh"], translations: { en: {title:"Home",description:"Home",locationText:"Kasuga, Bunkyo"} } };
}
function grouped(ps: PublicProperty[], locale: LangCode = "ja") { return groupSchoolSales(ps, locale).get("kanatomi")!; }
describe("売買学区の面積・公開集合", () => {
  it.each(["land","house","condo"] as const)("%s uses the correct area and includes exactly 55", kind => {
    expect(schoolSaleArea(sale(kind))).toBe(55); expect(grouped([sale(kind)])).toHaveLength(1);
    const p = sale(kind); p.spec = {...p.spec, ...kind === "land" ? {landAreaSqm:54.99} : kind === "house" ? {buildingAreaSqm:54.99} : {exclusiveAreaSqm:54.99}};
    expect(grouped([p])).toHaveLength(0);
  });
  it("同じslugは一件、別号室と独立区画は別件、写真・一括複数筆は増やさない", () => {
    const a=sale("condo","room-101"); const b=sale("condo","room-102"); const bulk=sale("land","bulk-three-parcels");
    expect(grouped([a,a,b,bulk,sale("land","plot-b")])).toHaveLength(4);
  });
  it("非公開・他地域・番地不足・不一致種別・非数値面積を除外", () => {
    const p=sale("house");
    expect(grouped([{...p,status:"closed"},{...p,status:"draft"},{...p,locationText:"東京都豊島区目白１丁目1"},{...p,locationText:"文京区小石川3丁目"},{...p,dealType:"condo"},{...p,spec:{...specs.house,buildingAreaSqm:NaN} as PropertySpec}])).toHaveLength(0);
  });
  it("小石川3丁目売地は一次資料で確認した柳町小学校区へ掲載する", () => {
    const p = sale("land", "koishikawa-3-land");
    p.locationText = "東京都文京区小石川三丁目";
    const groups = groupSchoolSales([p], "ja");
    expect(groups.get("yanagicho")).toEqual([p]);
    expect(groups.get("rekisen")).toEqual([]);
    const detail = renderToStaticMarkup(createElement(PropertySchoolDistrict, { property: p, locale: "ja" }));
    expect(detail).toContain("文京区立柳町小学校");
    expect(detail).toContain("/gakku/yanagicho/sales");
  });
  it("言語と賃貸・売買を別集計、原住所で判定", () => {
    const p=sale("house"); expect(grouped([p],"en")).toHaveLength(1);
    expect(grouped([{...p,locales:["ja"]}],"en")).toHaveLength(0);
    const r=toPublicProperty(fixture().property);r.status="published";r.locationText=p.locationText;r.locales=["ja"];if(r.spec.dealType==="rental")r.spec.availabilityExpiresAt="2999-01-01T00:00:00Z";
    expect(grouped([p,r])).toHaveLength(1);expect(groupSchoolRentals([p,r],"ja").get("kanatomi")).toHaveLength(1);
  });
});
describe("売買学区の画面・集計・動線", () => {
  it.each(["ja","en","zh-tw","zh"] as LangCode[])("%s: 20校と売買導線、QA非表示", locale => {
    const properties=[sale("house"),sale("land"),sale("condo")]; const prefix=locale==="ja"?"":"/"+locale;
    const hub=renderToStaticMarkup(createElement(SchoolSaleIndex,{properties,locale}));
    for(const s of listSchools())expect(hub).toContain(prefix+schoolSalePath(s.slug));
    expect(hub).toContain('"numberOfItems":20');
    const html=renderToStaticMarkup(createElement(SchoolSaleListings,{school:findSchoolBySlug("kanatomi")!,properties,locale,type:"condo"}));
    expect(html).toContain('"numberOfItems":1');expect(html).toContain(prefix+"/bukken/condo");expect(html).not.toContain(prefix+"/bukken/land");
    expect(html).toContain(SCHOOL_SALE_COPY[locale].count.replace("{count}","1"));expect(html).not.toContain("FAQPage");
    const detail=renderToStaticMarkup(createElement(PropertySchoolDistrict,{property:properties[0],locale}));expect(detail).toContain(prefix+"/gakku/kanatomi/sales");
  });
  it("未知の種別は全件、0件の学校は他校を出さない",()=>{
    const props={school:findSchoolBySlug("kanatomi")!,properties:[sale("house"),sale("condo")],locale:"ja" as const,type:"bad"};
    expect(renderToStaticMarkup(createElement(SchoolSaleListings,props))).toContain('"numberOfItems":2');
    const html=renderToStaticMarkup(createElement(SchoolSaleListings,{...props,school:findSchoolBySlug("kubomachi")!}));expect(html).toContain('"numberOfItems":0');expect(html).toContain(SCHOOL_SALE_COPY.ja.empty);expect(html).not.toContain("/bukken/house");
  });
});
