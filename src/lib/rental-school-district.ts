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
    lead: "文京区の区立小学校の通学区域は町丁目の単位で、区域によっては番・号まで定められており、同じ町丁目でも番地によって通う学校が分かれる区域があります。四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304号）は、文京区が公表する通学区域と募集中の賃貸物件の所在地を照合し、学校別に掲載しています。学校を選ぶと、その学区の一覧が開きます。入学時点の指定校は文京区が決定します。",
    schoolLead: "{school}の通学区域は、文京区が町丁目の単位で、区域によっては番・号まで定めています。四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304号）が、区の公表区域と所在地を照合できた募集中の賃貸物件を、この学区の一覧として掲載しています。入学時点の指定校は文京区が決定します。",
    empty: "現在、この学区でご紹介できる賃貸物件はありません。希望の入居時期・賃料・間取りをお知らせください。",
    request: "この学区の物件を相談する", back: "すべての学区を見る", guide: "学区・通学区域の紹介を見る",
    source: "通学区域の出典：文京区", updated: "区の更新日", checked: "データ取得日",
    note: "区の公表区域と所在地の照合結果です。入学時点の指定校は文京区にご確認ください。",
    pendingNote: "所在地だけでは通学区域を特定できません。番・号や旧町名による区分を確認してご案内します。",
  },
  en: {
    indexTitle: "Find rentals by elementary school district in Bunkyo", label: "Elementary school district", pending: "School district to be confirmed",
    title: "Rentals in the {school} district", view: "View rentals in this district", count: "{count} available",
    lead: "Bunkyo City sets the district of each city elementary school by chōme, and in some areas down to the lot and building number, so addresses in the same chōme can belong to different schools. Yotsuba Real Estate Co., Ltd. (real estate brokerage licence: Tokyo Governor (1) No. 113304) checks the address of each available rental against the districts published by Bunkyo City and lists the results by school. Choose a school to see its listings. School names retain their official Japanese spelling. The assigned school at enrollment is decided by Bunkyo City.",
    schoolLead: "Bunkyo City defines the {school} district by chōme, and in some areas by lot and building number. Yotsuba Real Estate Co., Ltd. (real estate brokerage licence: Tokyo Governor (1) No. 113304) lists the available rentals whose addresses match the district published by the city. The assigned school at enrollment is decided by Bunkyo City.",
    empty: "No rentals are currently listed in this school district. Tell us your preferred move-in date, rent and layout.",
    request: "Ask about rentals in this district", back: "View all school districts", guide: "Read the school district guide",
    source: "District source: Bunkyo City", updated: "City update", checked: "Data retrieved",
    note: "Matched against the city’s published districts. Confirm the assigned school with Bunkyo City at the time of enrollment.",
    pendingNote: "The address does not uniquely identify a school district. We will check the block, lot and any former-town boundaries.",
  },
  "zh-tw": {
    indexTitle: "依文京區小學學區尋找租屋", label: "小學學區", pending: "小學學區待確認",
    title: "{school}學區的出租物件", view: "查看此學區的出租物件", count: "招租中 {count}件",
    lead: "文京區區立小學的通學區域以町丁目為單位劃定，部分區域更細分至番、號，因此同一町丁目內也可能分屬不同學校。四葉不動產株式會社（宅地建物取引業 東京都知事(1)第113304號）將招租中出租物件的地址與文京區公布的通學區域比對，依學校分別刊登。選擇學校即可查看列表。校名沿用官方日文名稱。入學時的指定學校由文京區決定。",
    schoolLead: "{school}的通學區域由文京區以町丁目為單位劃定，部分區域細分至番、號。四葉不動產株式會社（宅地建物取引業 東京都知事(1)第113304號）刊登地址經比對符合區公布區域的招租中出租物件。入學時的指定學校由文京區決定。",
    empty: "目前此學區沒有可介紹的出租物件。歡迎告知希望入住時間、租金與格局。",
    request: "諮詢此學區的租屋", back: "查看所有學區", guide: "查看學區及通學區域介紹",
    source: "通學區域出處：文京區", updated: "區公布更新日", checked: "資料取得日",
    note: "本資訊依區公布的通學區域與地址比對。入學時的指定學校請向文京區確認。",
    pendingNote: "僅憑地址無法確定學區。我們會確認番、號及舊町名的區分後提供說明。",
  },
  zh: {
    indexTitle: "按文京区小学学区查找租房", label: "小学学区", pending: "小学学区待确认",
    title: "{school}学区的出租房源", view: "查看此学区的出租房源", count: "招租中 {count}套",
    lead: "文京区区立小学的通学区域以町丁目为单位划定，部分区域更细分至番、号，因此同一町丁目内也可能分属不同学校。四叶不动产株式会社（宅地建物取引业 东京都知事(1)第113304号）将招租中出租房源的地址与文京区公布的通学区域进行匹配，按学校分别刊登。选择学校即可查看列表。校名沿用官方日文名称。入学时的指定学校由文京区决定。",
    schoolLead: "{school}的通学区域由文京区以町丁目为单位划定，部分区域细分至番、号。四叶不动产株式会社（宅地建物取引业 东京都知事(1)第113304号）刊登地址经匹配符合区公布区域的招租中出租房源。入学时的指定学校由文京区决定。",
    empty: "目前此学区没有可介绍的出租房源。欢迎告知希望入住时间、租金与户型。",
    request: "咨询此学区的租房", back: "查看所有学区", guide: "查看学区及通学区域介绍",
    source: "通学区域出处：文京区", updated: "区公布更新日", checked: "资料取得日",
    note: "本信息按区公布的通学区域与地址匹配。入学时的指定学校请向文京区确认。",
    pendingNote: "仅凭地址无法确定学区。我们会确认番、号及旧町名的区分后提供说明。",
  },
} satisfies Record<LangCode, Record<string, string>>;

/**
 * 学区別ページのリード（学区ページ強化 作業手順書 v1・PR-2）。
 * 設問への直答（通学区域は町丁目単位・区域により番・号まで）＋主語が事業者の一文＋指定校は区が決定する留保。
 */
export function schoolRentalLead(school: SchoolInfo, locale: LangCode) {
  return SCHOOL_RENTAL_COPY[locale].schoolLead.replace("{school}", school.formalName.replace(/^文京区立/, ""));
}

export function schoolRentalTitle(school: SchoolInfo, locale: LangCode) {
  return SCHOOL_RENTAL_COPY[locale].title.replace("{school}", school.formalName.replace(/^文京区立/, ""));
}
