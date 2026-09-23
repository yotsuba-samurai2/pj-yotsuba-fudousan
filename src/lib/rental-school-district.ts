import type { LangCode } from "@/config/languages";
import type { PublicProperty } from "./property-shared";
import { isPubliclyVisible } from "./property-shared";
import { DISTRICT_SOURCE, listSchools, lookupDistrictByAddress, type SchoolInfo } from "./school-district";

export type RentalSchoolDistrict =
  | { status: "determined"; school: SchoolInfo; source: typeof DISTRICT_SOURCE }
  | { status: "needs-inquiry"; source: typeof DISTRICT_SOURCE }
  | null;

/** Always pass the original Japanese location, before getLocalizedProperty(). */
export function rentalSchoolDistrict(p: Pick<PublicProperty, "dealType" | "locationText">): RentalSchoolDistrict {
  if (p.dealType !== "rental" || !/^(東京都)?文京区/.test(p.locationText.normalize("NFKC").replace(/\s/g, ""))) return null;
  const result = lookupDistrictByAddress(p.locationText);
  return result.status === "determined"
    ? { status: "determined", school: result.school, source: DISTRICT_SOURCE }
    : { status: "needs-inquiry", source: DISTRICT_SOURCE };
}

export const SCHOOL_RENTAL_INDEX_PATH = "/gakku/rentals";
export function schoolRentalPath(slug: string) { return `/gakku/${slug}/rentals`; }

/** Locale/expiry/status are enforced here as well as in the database read. */
export function groupSchoolRentals(properties: readonly PublicProperty[], locale: LangCode, now = new Date()) {
  const groups = new Map(listSchools().map(s => [s.slug, [] as PublicProperty[]]));
  for (const p of properties) {
    if (!isPubliclyVisible(p, locale, now)) continue;
    const district = rentalSchoolDistrict(p);
    if (district?.status === "determined") groups.get(district.school.slug)?.push(p);
  }
  return groups;
}

export const SCHOOL_RENTAL_COPY = {
  ja: {
    indexTitle: "文京区の小学校区から賃貸を探す", label: "小学校区", pending: "小学校区は要確認",
    title: "{school}区の賃貸物件", view: "この学区の賃貸物件を見る", count: "募集中 {count}件",
    lead: "文京区の通学区域と所在地を照合できた、公開中の賃貸物件をご紹介します。学校を選ぶと、その学区の一覧が開きます。",
    empty: "現在、この学区でご紹介できる賃貸物件はありません。希望の入居時期・賃料・間取りをお知らせください。",
    request: "この学区の物件を相談する", back: "すべての学区を見る", guide: "学区・通学区域の紹介を見る",
    source: "通学区域の出典：文京区", updated: "区の更新日", checked: "データ取得日",
    note: "区の公表区域と所在地の照合結果です。入学時点の指定校は文京区にご確認ください。",
    pendingNote: "所在地だけでは通学区域を特定できません。番・号や旧町名による区分を確認してご案内します。",
  },
  en: {
    indexTitle: "Find rentals by elementary school district in Bunkyo", label: "Elementary school district", pending: "School district to be confirmed",
    title: "Rentals in the {school} district", view: "View rentals in this district", count: "{count} available",
    lead: "Browse current rentals matched to Bunkyo’s published school districts using the property address. Choose a school to see its listings. School names retain their official Japanese spelling.",
    empty: "No rentals are currently listed in this school district. Tell us your preferred move-in date, rent and layout.",
    request: "Ask about rentals in this district", back: "View all school districts", guide: "Read the school district guide",
    source: "District source: Bunkyo City", updated: "City update", checked: "Data retrieved",
    note: "Matched against the city’s published districts. Confirm the assigned school with Bunkyo City at the time of enrollment.",
    pendingNote: "The address does not uniquely identify a school district. We will check the block, lot and any former-town boundaries.",
  },
  "zh-tw": {
    indexTitle: "依文京區小學學區尋找租屋", label: "小學學區", pending: "小學學區待確認",
    title: "{school}學區的出租物件", view: "查看此學區的出租物件", count: "招租中 {count}件",
    lead: "依物件原始地址與文京區公布的通學區域比對，介紹目前刊登中的出租物件。選擇學校即可查看列表。校名沿用官方日文名稱。",
    empty: "目前此學區沒有可介紹的出租物件。歡迎告知希望入住時間、租金與格局。",
    request: "諮詢此學區的租屋", back: "查看所有學區", guide: "查看學區及通學區域介紹",
    source: "通學區域出處：文京區", updated: "區公布更新日", checked: "資料取得日",
    note: "本資訊依區公布的通學區域與地址比對。入學時的指定學校請向文京區確認。",
    pendingNote: "僅憑地址無法確定學區。我們會確認番、號及舊町名的區分後提供說明。",
  },
  zh: {
    indexTitle: "按文京区小学学区查找租房", label: "小学学区", pending: "小学学区待确认",
    title: "{school}学区的出租房源", view: "查看此学区的出租房源", count: "招租中 {count}套",
    lead: "按房源原始地址与文京区公布的通学区域匹配，介绍目前发布中的出租房源。选择学校即可查看列表。校名沿用官方日文名称。",
    empty: "目前此学区没有可介绍的出租房源。欢迎告知希望入住时间、租金与户型。",
    request: "咨询此学区的租房", back: "查看所有学区", guide: "查看学区及通学区域介绍",
    source: "通学区域出处：文京区", updated: "区公布更新日", checked: "资料取得日",
    note: "本信息按区公布的通学区域与地址匹配。入学时的指定学校请向文京区确认。",
    pendingNote: "仅凭地址无法确定学区。我们会确认番、号及旧町名的区分后提供说明。",
  },
} satisfies Record<LangCode, Record<string, string>>;

export function schoolRentalTitle(school: SchoolInfo, locale: LangCode) {
  return SCHOOL_RENTAL_COPY[locale].title.replace("{school}", school.formalName.replace(/^文京区立/, ""));
}
