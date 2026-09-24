import type { LangCode } from "@/config/languages";
import { isPubliclyVisible, type PublicProperty } from "./property-shared";
import { listSchools, type SchoolInfo } from "./school-district";
import { rentalSchoolDistrict } from "./rental-school-district";

export const SCHOOL_SALE_INDEX_PATH = "/gakku/sales";
export const SALE_TYPES = ["condo", "house", "land"] as const;
export function schoolSalePath(slug: string) { return `/gakku/${slug}/sales`; }
export function saleSchoolDistrict(p: Pick<PublicProperty, "dealType" | "locationText">) {
  if (p.dealType !== "condo" && p.dealType !== "house" && p.dealType !== "land") return null;
  return rentalSchoolDistrict({ ...p, dealType: "rental" });
}
export function schoolSaleArea(p: PublicProperty) {
  if (p.dealType !== p.spec.dealType) return null;
  switch (p.spec.dealType) {
    case "condo": return p.spec.exclusiveAreaSqm;
    case "house": return p.spec.buildingAreaSqm;
    case "land": return p.spec.landAreaSqm;
    default: return null;
  }
}
/** One saved sale unit has one slug. Cross-provider identity resolution happens before saving. */
export function groupSchoolSales(properties: readonly PublicProperty[], locale: LangCode) {
  const groups = new Map(listSchools().map(s => [s.slug, [] as PublicProperty[]]));
  const seen = new Set<string>();
  for (const p of properties) {
    const area = schoolSaleArea(p);
    if (!isPubliclyVisible(p, locale) || area === null || !Number.isFinite(area) || area < 55 || seen.has(p.slug)) continue;
    const district = saleSchoolDistrict(p);
    if (district?.status !== "determined") continue;
    groups.get(district.school.slug)?.push(p);
    seen.add(p.slug);
  }
  return groups;
}
export const SCHOOL_SALE_COPY = {
  ja: { indexTitle: "文京区の小学校区から売買物件を探す", title: "{school}区の売買物件", view: "この学区の売買物件を見る", count: "売出中 {count}件", rental: "賃貸 {count}件", sale: "売買 {count}件", condo: "マンション", house: "戸建て", land: "売地", all: "すべて", empty: "現在、この条件でご紹介できる売買物件はありません。", lead: "文京区で売出中のマンション・戸建て・売地を小学校区別にご紹介します。マンションは専有面積、戸建ては建物面積、売地は土地面積が55㎡以上で、所在地から学区を確認できた公開物件を掲載しています。", request: "この学区の購入を相談する", back: "すべての学区の売買物件を見る" },
  en: { indexTitle: "Find properties for sale by school district in Bunkyo", title: "Properties for sale in the {school} district", view: "View properties for sale in this district", count: "{count} for sale", rental: "Rentals: {count}", sale: "For sale: {count}", condo: "Condominiums", house: "Houses", land: "Land", all: "All", empty: "No properties are currently listed for these criteria.", lead: "Explore properties for sale in Bunkyo by elementary school district. Listings have at least 55 m² of exclusive floor area for condominiums, building floor area for houses, or land area for plots, and an address that can be matched to a school district.", request: "Ask about buying in this school district", back: "View sales in all school districts" },
  "zh-tw": { indexTitle: "依文京區小學學區尋找出售物件", title: "{school}學區的出售物件", view: "查看此學區的出售物件", count: "出售中 {count}件", rental: "出租 {count}件", sale: "出售 {count}件", condo: "公寓", house: "獨棟住宅", land: "土地", all: "全部", empty: "目前沒有符合此條件的出售物件。", lead: "依小學學區介紹文京區出售中的公寓、獨棟住宅及土地。公寓專有面積、獨棟住宅建築面積或土地面積須達55平方公尺，且地址可確認學區。", request: "諮詢此學區的購屋", back: "查看所有學區的出售物件" },
  zh: { indexTitle: "按文京区小学学区查找出售房源", title: "{school}学区的出售房源", view: "查看此学区的出售房源", count: "出售中 {count}套", rental: "出租 {count}套", sale: "出售 {count}套", condo: "公寓", house: "独栋住宅", land: "土地", all: "全部", empty: "目前没有符合此条件的出售房源。", lead: "按小学学区介绍文京区出售中的公寓、独栋住宅及土地。公寓专有面积、独栋住宅建筑面积或土地面积须达到55平方米，且地址可确认学区。", request: "咨询此学区的购房", back: "查看所有学区的出售房源" },
} satisfies Record<LangCode, Record<string, string>>;
export function schoolSaleTitle(school: SchoolInfo, locale: LangCode) { return SCHOOL_SALE_COPY[locale].title.replace("{school}", school.formalName.replace(/^文京区立/, "")); }
