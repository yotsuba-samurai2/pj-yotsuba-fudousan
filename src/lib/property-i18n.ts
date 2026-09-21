import type { LangCode } from "@/config/languages";
import {
  buildRequiredDisplayRows,
  formatPriceYen,
  walkMinutes,
  type PropertyAccess,
  type PropertyCategory,
  type PropertyDealType,
  type PropertyImage,
  type PropertyTradeMode,
  type PublicProperty,
} from "@/lib/property-shared";

/**
 * 物件ページ（/bukken）の4言語表示（純関数・Prisma非依存）。
 * - 定型部分（項目名・種別・取引態様・単位）は辞書で訳す。
 * - 自由記述は translations[locale].spec / priceNote の訳だけを使う。
 *   定型辞書は「値全体の完全一致」だけに当てる（部分一致で「ペット不可」を「可」に化けさせない）。
 * - 訳が無い自由記述は日本語原文のまま表示し untranslated=true を立てる
 *   （必要表示事項を落とさない／黙って「翻訳済み」にしない）。
 * - 商号・免許番号・所属団体名・路線名・駅名は固有表記として日本語を維持する。
 */

export type PropertySectionKey = "overview" | "costs" | "terms" | "zoning" | "price" | "building" | "access";

type Ui = {
  home: string;
  listing: string;
  rowLabels: Record<string, string>;
  dealType: Record<PropertyDealType, string>;
  category: Record<PropertyCategory, string>;
  tradeMode: Record<PropertyTradeMode, string>;
  sections: Record<PropertySectionKey, string>;
  descriptionHeading: string;
  photosHeading: string;
  relatedHeading: string;
  companyHeading: string;
  none: string;
  imageKind: { photo: string; floorplan: string };
  noteLandBusiness: string;
  noteRental: string;
  ghNote: string;
  reverseHeading: string;
  reverseNote: string;
  reverseAll: string;
  legal: { name: string; address: string; tel: string; license: string; licensePrefix: string; membership: string; published: string; updated: string; nextUpdate: string };
};

const JA_ROW_LABELS: Record<string, string> = {
  tradeMode: "取引態様", location: "所在地", access: "交通", accessText: "交通", price: "価格", rent: "賃料",
  exclusiveArea: "専有面積", buildingType: "建物種別", layout: "間取り", structure: "構造", floors: "階数",
  floorsRental: "建物の階数", floorLocated: "所在階", builtYm: "建築年月", deliveryYm: "引渡し可能年月",
  deliveryYmRental: "入居可能時期", managementFee: "管理費", managementFeeRental: "管理費・共益費", deposit: "敷金",
  keyMoney: "礼金", guaranteeDeposit: "保証金・敷引", renewalFee: "更新料", insurance: "保険", guarantor: "保証会社",
  otherFees: "その他の費用", contractType: "契約種別", contractPeriod: "契約期間", conditions: "入居条件・特約",
  landArea: "土地面積", privateRoad: "私道負担面積", landCategory: "地目", zoning: "用途地域",
  buildingCoverage: "建ぺい率", floorAreaRatio: "容積率", legalRestrictions: "法令に基づく制限", leasehold: "借地",
  buildingArea: "建物面積", rowHouse: "建物形式", balconyArea: "バルコニー面積", repairReserve: "修繕積立金等",
  managementForm: "管理形態", managerWorkStyle: "管理員の勤務形態", wholeBuilding: "取引形態", unitCount: "住戸数",
  unitArea: "各住戸の専有面積",
};

export const PROPERTY_UI: Record<LangCode, Ui> = {
  ja: {
    home: "ホーム", listing: "取扱物件", rowLabels: JA_ROW_LABELS,
    dealType: { land: "売地", house: "戸建", condo: "マンション", wholeBuilding: "一棟売りマンション・アパート", businessBuilding: "事業用建物", rental: "賃貸" },
    category: { gh: "障害福祉GH向け", jigyo: "事業用・店舗", souzoku: "相続・売却", toushi: "投資用", other: "その他" },
    tradeMode: { seller: "売主", agent: "代理", broker: "媒介（仲介）" },
    sections: { overview: "物件概要", costs: "賃料と初期費用", terms: "契約条件・入居条件", zoning: "用途地域と建築の制限", price: "価格・取引条件", building: "建物・土地の情報", access: "交通" },
    descriptionHeading: "物件のご紹介", photosHeading: "写真・間取り", relatedHeading: "関連する解説", companyHeading: "取扱会社",
    none: "なし", imageKind: { photo: "写真", floorplan: "間取り図" },
    noteLandBusiness: "建築や営業の可否は、計画の内容により、建築士・特定行政庁・所管の行政庁への個別の確認が必要です。",
    noteRental: "用途の可否は、最終的に貸主様のご判断となります。",
    ghNote: "障害福祉サービスでのご利用可否は、所管行政庁の指定基準等の確認が必要です。個別にご相談ください。",
    reverseHeading: "現在掲載中の物件",
    reverseNote: "関連情報として掲載しています。特定の事業用途や入居・契約条件への適合を保証するものではありません。",
    reverseAll: "取扱物件の一覧へ",
    legal: { name: "商号", address: "事務所所在地", tel: "電話番号", license: "免許番号", licensePrefix: "宅地建物取引業", membership: "所属団体", published: "情報公開日", updated: "情報更新日", nextUpdate: "次回更新予定日" },
  },
  en: {
    home: "Home", listing: "Property listings",
    rowLabels: {
      tradeMode: "Transaction type", location: "Location", access: "Access", accessText: "Access", price: "Price", rent: "Rent",
      exclusiveArea: "Floor area (exclusive)", buildingType: "Building type", layout: "Layout", structure: "Structure", floors: "Number of floors",
      floorsRental: "Number of floors", floorLocated: "Floor", builtYm: "Built", deliveryYm: "Available for handover",
      deliveryYmRental: "Available from", managementFee: "Management fee", managementFeeRental: "Management / common-area fee", deposit: "Security deposit (shikikin)",
      keyMoney: "Key money (reikin)", guaranteeDeposit: "Guarantee deposit / non-refundable portion", renewalFee: "Renewal fee", insurance: "Insurance", guarantor: "Rent guarantee company",
      otherFees: "Other fees", contractType: "Lease type", contractPeriod: "Lease term", conditions: "Occupancy conditions / special terms",
      landArea: "Land area", privateRoad: "Private road burden", landCategory: "Land category (chimoku)", zoning: "Zoning (use district)",
      buildingCoverage: "Building coverage ratio", floorAreaRatio: "Floor area ratio", legalRestrictions: "Restrictions under laws and regulations", leasehold: "Leasehold",
      buildingArea: "Building area", rowHouse: "Building form", balconyArea: "Balcony area", repairReserve: "Repair reserve fund, etc.",
      managementForm: "Management form", managerWorkStyle: "Building manager's working arrangement", wholeBuilding: "Form of sale", unitCount: "Number of units",
      unitArea: "Exclusive area per unit",
    },
    dealType: { land: "Land for sale", house: "Detached house", condo: "Condominium", wholeBuilding: "Whole apartment building for sale", businessBuilding: "Commercial building", rental: "For rent" },
    category: { gh: "For disability welfare group homes", jigyo: "Commercial / retail", souzoku: "Inheritance / sale", toushi: "Investment", other: "Other" },
    tradeMode: { seller: "Seller", agent: "Agent (proxy)", broker: "Brokerage (intermediary)" },
    sections: { overview: "Property overview", costs: "Rent and initial costs", terms: "Lease terms and occupancy conditions", zoning: "Zoning and building restrictions", price: "Price and transaction terms", building: "Building and land information", access: "Access" },
    descriptionHeading: "About this property", photosHeading: "Photos and floor plan", relatedHeading: "Related guides", companyHeading: "Listing company",
    none: "None", imageKind: { photo: "photo", floorplan: "floor plan" },
    noteLandBusiness: "Whether construction or a proposed business use is permitted requires case-specific confirmation with an architect and the relevant authorities, depending on the plan.",
    noteRental: "Approval of the proposed use is ultimately subject to the landlord’s decision.",
    ghNote: "Whether the property can be used for disability welfare services requires confirmation of the designation standards of the competent authority. Please consult us individually.",
    reverseHeading: "Current property listings",
    reverseNote: "These listings are provided for reference. They do not guarantee suitability for a particular business use or eligibility under occupancy or lease conditions.",
    reverseAll: "View all property listings",
    legal: { name: "Trade name", address: "Office address", tel: "Telephone", license: "License number", licensePrefix: "Real estate brokerage license:", membership: "Memberships", published: "Date published", updated: "Date updated", nextUpdate: "Next scheduled update" },
  },
  "zh-tw": {
    home: "首頁", listing: "物件介紹",
    rowLabels: {
      tradeMode: "交易型態", location: "所在地", access: "交通", accessText: "交通", price: "價格", rent: "租金",
      exclusiveArea: "專有面積", buildingType: "建物類型", layout: "格局", structure: "構造", floors: "樓層數",
      floorsRental: "建物樓層數", floorLocated: "所在樓層", builtYm: "建築年月", deliveryYm: "可交屋年月",
      deliveryYmRental: "可入住時間", managementFee: "管理費", managementFeeRental: "管理費・公共費", deposit: "押金（敷金）",
      keyMoney: "禮金", guaranteeDeposit: "保證金・敷引", renewalFee: "續約費", insurance: "保險", guarantor: "保證公司",
      otherFees: "其他費用", contractType: "契約類型", contractPeriod: "契約期間", conditions: "入住條件・特約",
      landArea: "土地面積", privateRoad: "私有道路負擔面積", landCategory: "地目", zoning: "用途地域",
      buildingCoverage: "建蔽率", floorAreaRatio: "容積率", legalRestrictions: "依法令之限制", leasehold: "借地",
      buildingArea: "建物面積", rowHouse: "建物形式", balconyArea: "陽台面積", repairReserve: "修繕公積金等",
      managementForm: "管理形態", managerWorkStyle: "管理員勤務型態", wholeBuilding: "交易形態", unitCount: "戶數",
      unitArea: "各戶專有面積",
    },
    dealType: { land: "土地出售", house: "獨棟住宅", condo: "公寓", wholeBuilding: "整棟公寓出售", businessBuilding: "事業用建物", rental: "出租" },
    category: { gh: "障礙福祉團體家屋用", jigyo: "事業用・店面", souzoku: "繼承・出售", toushi: "投資用", other: "其他" },
    tradeMode: { seller: "賣方", agent: "代理", broker: "媒介（仲介）" },
    sections: { overview: "物件概要", costs: "租金與初期費用", terms: "契約條件・入住條件", zoning: "用途地域與建築限制", price: "價格・交易條件", building: "建物・土地資訊", access: "交通" },
    descriptionHeading: "物件介紹", photosHeading: "照片・格局圖", relatedHeading: "相關說明", companyHeading: "經手公司",
    none: "無", imageKind: { photo: "照片", floorplan: "格局圖" },
    noteLandBusiness: "能否建築或經營特定業務，須依計畫內容，向建築師及相關主管機關個別確認。",
    noteRental: "擬定用途是否獲准，最終由出租人決定。",
    ghNote: "能否用於障礙福祉服務，須確認主管機關的指定基準等。請個別洽詢。",
    reverseHeading: "目前刊登的物件",
    reverseNote: "本區物件僅供參考，並不保證符合特定營業用途或入住、簽約條件。",
    reverseAll: "查看物件一覽",
    legal: { name: "商號", address: "事務所所在地", tel: "電話號碼", license: "執照號碼", licensePrefix: "宅地建物取引業", membership: "所屬團體", published: "資訊公開日", updated: "資訊更新日", nextUpdate: "下次預定更新日" },
  },
  zh: {
    home: "首页", listing: "物件介绍",
    rowLabels: {
      tradeMode: "交易形态", location: "所在地", access: "交通", accessText: "交通", price: "价格", rent: "租金",
      exclusiveArea: "专有面积", buildingType: "建筑类型", layout: "户型", structure: "结构", floors: "楼层数",
      floorsRental: "建筑楼层数", floorLocated: "所在楼层", builtYm: "建成年月", deliveryYm: "可交房年月",
      deliveryYmRental: "可入住时间", managementFee: "管理费", managementFeeRental: "管理费・公共费", deposit: "押金（敷金）",
      keyMoney: "礼金", guaranteeDeposit: "保证金・敷引", renewalFee: "续约费", insurance: "保险", guarantor: "保证公司",
      otherFees: "其他费用", contractType: "合同类型", contractPeriod: "合同期限", conditions: "入住条件・特约",
      landArea: "土地面积", privateRoad: "私有道路负担面积", landCategory: "地目", zoning: "用途地域",
      buildingCoverage: "建蔽率", floorAreaRatio: "容积率", legalRestrictions: "依法令的限制", leasehold: "借地",
      buildingArea: "建筑面积", rowHouse: "建筑形式", balconyArea: "阳台面积", repairReserve: "修缮公积金等",
      managementForm: "管理形态", managerWorkStyle: "管理员工作形态", wholeBuilding: "交易形态", unitCount: "户数",
      unitArea: "各户专有面积",
    },
    dealType: { land: "土地出售", house: "独栋住宅", condo: "公寓", wholeBuilding: "整栋公寓出售", businessBuilding: "事业用建筑", rental: "出租" },
    category: { gh: "残障福利团体之家用", jigyo: "商用・店铺", souzoku: "继承・出售", toushi: "投资用", other: "其他" },
    tradeMode: { seller: "卖方", agent: "代理", broker: "媒介（中介）" },
    sections: { overview: "物件概要", costs: "租金与初期费用", terms: "合同条件・入住条件", zoning: "用途地域与建筑限制", price: "价格・交易条件", building: "建筑・土地信息", access: "交通" },
    descriptionHeading: "物件介绍", photosHeading: "照片・户型图", relatedHeading: "相关说明", companyHeading: "经办公司",
    none: "无", imageKind: { photo: "照片", floorplan: "户型图" },
    noteLandBusiness: "能否建设或经营特定业务，须根据计划内容，向建筑师及相关主管机关逐项确认。",
    noteRental: "拟定用途是否获准，最终由出租人决定。",
    ghNote: "能否用于残障福利服务，须确认主管机关的指定标准等。请单独咨询。",
    reverseHeading: "当前刊登的房源",
    reverseNote: "本区房源仅供参考，并不保证符合特定经营用途或入住、签约条件。",
    reverseAll: "查看物件一览",
    legal: { name: "商号", address: "事务所所在地", tel: "电话号码", license: "执照号码", licensePrefix: "宅地建物取引业", membership: "所属团体", published: "信息公开日", updated: "信息更新日", nextUpdate: "下次预定更新日" },
  },
};

export function propertyUi(locale: LangCode): Ui {
  return PROPERTY_UI[locale] ?? PROPERTY_UI.ja;
}

// ── 価格・面積・年月・交通（数値と単位は変えない。外貨換算しない） ──

export function formatPropertyPriceL(p: Pick<PublicProperty, "dealType" | "priceYen">, locale: LangCode): string {
  const n = p.priceYen.toLocaleString("en-US");
  if (p.dealType === "rental") {
    if (locale === "en") return `JPY ${n}/month`;
    if (locale === "zh-tw") return `${n}日圓／月`;
    if (locale === "zh") return `${n}日元／月`;
    return `${p.priceYen.toLocaleString("ja-JP")}円／月`;
  }
  if (locale === "en") return `JPY ${n}`;
  const ja = formatPriceYen(p.priceYen);
  if (locale === "zh-tw") return ja.replace("億", "億").replace("万円", "萬日圓").replace(/円$/, "日圓");
  if (locale === "zh") return ja.replace("億", "亿").replace("万円", "万日元").replace(/円$/, "日元");
  return ja;
}

export function formatAreaL(sqm: number, locale: LangCode): string {
  const n = sqm.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return locale === "en" ? `${n} m²` : `${n}㎡`;
}

export function formatYmL(ym: string, locale: LangCode): string | null {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return null;
  if (locale === "en") {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][Number(m[2]) - 1];
    return month ? `${month} ${m[1]}` : null;
  }
  return `${m[1]}年${Number(m[2])}月`;
}

/** 路線名・駅名は固有表記のまま。徒歩分は80m=1分の算出値（規則第9条(9)） */
export function formatAccessL(a: PropertyAccess, locale: LangCode): string {
  const min = walkMinutes(a.distanceM);
  if (locale === "en") return `${a.line} "${a.station}" Station, ${min}-minute walk (${a.distanceM} m by road)`;
  if (locale === "zh-tw") return `${a.line}「${a.station}」站 步行${min}分鐘（道路距離${a.distanceM}m）`;
  if (locale === "zh") return `${a.line}「${a.station}」站 步行${min}分钟（道路距离${a.distanceM}m）`;
  return `${a.line}「${a.station}」駅 徒歩${min}分（道路距離${a.distanceM}m）`;
}

// ── 定型値（値全体の完全一致のみ） ──

type Tri = [en: string, zhTw: string, zh: string];
const FIXED_VALUES: Record<string, Tri> = {
  "なし": ["None", "無", "无"],
  "未確認": ["Unconfirmed", "未確認", "未确认"],
  "確認中": ["Being confirmed", "確認中", "确认中"],
  "相談": ["Negotiable", "可洽談", "可洽谈"],
  "即時": ["Immediate", "即時", "即时"],
  "即入居可": ["Available immediately", "可立即入住", "可立即入住"],
  "マンション": ["Apartment (condominium-type building)", "公寓大樓", "公寓楼"],
  "アパート": ["Apartment", "公寓", "公寓"],
  "一戸建て": ["Detached house", "獨棟住宅", "独栋住宅"],
  "連棟式建物": ["Row house", "連棟式建物", "联排式建筑"],
  "一棟売りマンション・アパート": ["Whole apartment building for sale", "整棟公寓出售", "整栋公寓出售"],
  "鉄筋コンクリート造": ["Reinforced concrete (RC)", "鋼筋混凝土造", "钢筋混凝土结构"],
  "鉄骨鉄筋コンクリート造": ["Steel-reinforced concrete (SRC)", "鋼骨鋼筋混凝土造", "钢骨钢筋混凝土结构"],
  "鉄骨造": ["Steel frame", "鋼骨造", "钢结构"],
  "木造": ["Wooden", "木造", "木结构"],
  "普通借家契約": ["Ordinary building lease", "普通租賃契約", "普通租赁合同"],
  "定期借家契約": ["Fixed-term building lease", "定期租賃契約", "定期租赁合同"],
  "宅地": ["Residential land (takuchi)", "宅地", "宅地"],
  "第一種低層住居専用地域": ["Category 1 low-rise exclusive residential district", "第一種低層住居專用地域", "第一种低层住居专用地域"],
  "第二種低層住居専用地域": ["Category 2 low-rise exclusive residential district", "第二種低層住居專用地域", "第二种低层住居专用地域"],
  "第一種中高層住居専用地域": ["Category 1 medium-to-high-rise exclusive residential district", "第一種中高層住居專用地域", "第一种中高层住居专用地域"],
  "第二種中高層住居専用地域": ["Category 2 medium-to-high-rise exclusive residential district", "第二種中高層住居專用地域", "第二种中高层住居专用地域"],
  "第一種住居地域": ["Category 1 residential district", "第一種住居地域", "第一种住居地域"],
  "第二種住居地域": ["Category 2 residential district", "第二種住居地域", "第二种住居地域"],
  "準住居地域": ["Quasi-residential district", "準住居地域", "准住居地域"],
  "田園住居地域": ["Rural residential district", "田園住居地域", "田园住居地域"],
  "近隣商業地域": ["Neighborhood commercial district", "近鄰商業地域", "近邻商业地域"],
  "商業地域": ["Commercial district", "商業地域", "商业地域"],
  "準工業地域": ["Quasi-industrial district", "準工業地域", "准工业地域"],
  "工業地域": ["Industrial district", "工業地域", "工业地域"],
  "工業専用地域": ["Exclusive industrial district", "工業專用地域", "工业专用地域"],
};

const FIXED_PATTERNS: Array<[RegExp, (m: RegExpExecArray, l: LangCode) => string]> = [
  [/^地上(\d+)階建$/, (m, l) => (l === "en" ? `${m[1]} stories above ground` : l === "zh-tw" ? `地上${m[1]}層` : `地上${m[1]}层`)],
  [/^(\d+)階$/, (m, l) => (l === "en" ? `Floor ${m[1]}` : l === "zh-tw" ? `${m[1]}樓` : `${m[1]}楼`)],
  [/^(\d+)年$/, (m, l) => (l === "en" ? `${m[1]} year${m[1] === "1" ? "" : "s"}` : `${m[1]}年`)],
  [/^(\d+)[ヶか]月$/, (m, l) => (l === "en" ? `${m[1]} month${m[1] === "1" ? "" : "s"}` : l === "zh-tw" ? `${m[1]}個月` : `${m[1]}个月`)],
  [/^([\d,]+)円$/, (m, l) => (l === "en" ? `JPY ${m[1]}` : l === "zh-tw" ? `${m[1]}日圓` : `${m[1]}日元`)],
  [/^(\d+(?:\.\d+)?)[%％]$/, (m) => `${m[1]}%`],
];

/** 値全体が定型に一致したときだけ訳を返す。一致しなければ null（自由記述扱い） */
export function localizeFixedValue(value: string, locale: LangCode): string | null {
  if (locale === "ja") return value;
  const v = value.trim();
  const idx = locale === "en" ? 0 : locale === "zh-tw" ? 1 : 2;
  const hit = FIXED_VALUES[v];
  if (hit) return hit[idx];
  for (const [re, fn] of FIXED_PATTERNS) {
    const m = re.exec(v);
    if (m) return fn(m, locale);
  }
  return null;
}

// ── 概要表（区分つき・ロケール対応） ──

export type LocalizedRow = { key: string; label: string; value: string; section: PropertySectionKey; untranslated: boolean };

const RENTAL_SECTION: Record<string, PropertySectionKey> = {
  price: "costs", managementFee: "costs", deposit: "costs", keyMoney: "costs", guaranteeDeposit: "costs", renewalFee: "costs",
  insurance: "costs", guarantor: "costs", otherFees: "costs", contractType: "terms", contractPeriod: "terms", conditions: "terms",
  access: "access", accessText: "access",
};
const LAND_SECTION: Record<string, PropertySectionKey> = {
  zoning: "zoning", buildingCoverage: "zoning", floorAreaRatio: "zoning", legalRestrictions: "zoning", access: "access",
};
const SALE_SECTION: Record<string, PropertySectionKey> = {
  price: "price", managementFee: "price", repairReserve: "price", deliveryYm: "price", access: "access",
  tradeMode: "overview", location: "overview", wholeBuilding: "overview", rowHouse: "overview",
};

function sectionOf(dealType: PropertyDealType, key: string): PropertySectionKey {
  if (dealType === "rental") return RENTAL_SECTION[key] ?? "overview";
  if (dealType === "land") return LAND_SECTION[key] ?? "overview";
  return SALE_SECTION[key] ?? "building";
}

export function sectionOrder(dealType: PropertyDealType): PropertySectionKey[] {
  if (dealType === "rental") return ["overview", "costs", "terms", "access"];
  if (dealType === "land") return ["overview", "zoning", "access"];
  return ["overview", "price", "building", "access"];
}

function labelKey(dealType: PropertyDealType, key: string): string {
  if (dealType === "rental") {
    if (key === "price") return "rent";
    if (key === "floors") return "floorsRental";
    if (key === "deliveryYm") return "deliveryYmRental";
    if (key === "managementFee") return "managementFeeRental";
  }
  return key;
}

/**
 * 日本語の必要表示行（buildRequiredDisplayRows＝正本）と同じキー・順序で、ロケール別の行を作る。
 * `p` は getLocalizedProperty 済みでも未済みでもよい（locationText はここでも訳を当てる）。
 */
export function buildLocalizedDisplayRows(p: PublicProperty, locale: LangCode): LocalizedRow[] {
  const ui = propertyUi(locale);
  const trans = locale === "ja" ? undefined : p.translations?.[locale as "en" | "zh-tw" | "zh"];
  const s = p.spec;
  const num = s as unknown as Record<string, unknown>;
  return buildRequiredDisplayRows(p).map((row) => {
    const section = sectionOf(p.dealType, row.key);
    const label = ui.rowLabels[labelKey(p.dealType, row.key)] ?? row.label;
    if (locale === "ja") return { ...row, label: row.label, section, untranslated: false };
    let value: string | null = null;
    switch (row.key) {
      case "tradeMode": value = ui.tradeMode[p.tradeMode]; break;
      case "location": value = trans?.locationText || null; break;
      case "access": value = p.access.map((a) => formatAccessL(a, locale)).join(" / "); break;
      case "price": {
        const note = p.priceNote ? trans?.priceNote ?? localizeFixedValue(p.priceNote, locale) : undefined;
        if (p.priceNote && !note) { value = null; break; }
        value = formatPropertyPriceL(p, locale) + (note ? ` (${note})` : "");
        break;
      }
      case "exclusiveArea": value = formatAreaL(num.exclusiveAreaSqm as number, locale); break;
      case "landArea": value = formatAreaL(num.landAreaSqm as number, locale); break;
      case "buildingArea": value = formatAreaL(num.buildingAreaSqm as number, locale); break;
      case "balconyArea": value = num.balconyAreaSqm === "不明"
        ? { ja: "不明", en: "Unknown", "zh-tw": "不明", zh: "不详" }[locale]
        : formatAreaL(num.balconyAreaSqm as number, locale); break;
      case "privateRoad": value = (num.privateRoadAreaSqm as number) > 0 ? formatAreaL(num.privateRoadAreaSqm as number, locale) : ui.none; break;
      case "unitCount": value = locale === "en" ? `${num.unitCount} units` : locale === "zh-tw" ? `${num.unitCount}戶` : `${num.unitCount}户`; break;
      case "unitArea": value = `${formatAreaL(num.unitAreaMinSqm as number, locale)} – ${formatAreaL(num.unitAreaMaxSqm as number, locale)}`; break;
      case "wholeBuilding": value = ui.dealType.wholeBuilding; break;
      case "rowHouse": value = localizeFixedValue("連棟式建物", locale); break;
      case "builtYm":
      case "deliveryYm": value = formatYmL(String(num[row.key] ?? ""), locale); break;
    }
    if (value == null) value = trans?.spec?.[row.key] || localizeFixedValue(row.value, locale);
    return value == null
      ? { key: row.key, label, value: row.value, section, untranslated: true }
      : { key: row.key, label, value, section, untranslated: false };
  });
}

/** 確認済みの物件名＋画像種別だけで作る alt。ja は登録済みの alt を維持する */
export function localizedImageAlt(img: PropertyImage, title: string, locale: LangCode): string {
  if (locale === "ja") return img.alt;
  const kind = propertyUi(locale).imageKind[img.kind === "floorplan" ? "floorplan" : "photo"];
  return locale === "en" ? `${title} — ${kind}` : `${title} ${kind}`;
}

/** 留保文の出し分け（賃貸／売地・事業用）。該当しなければ null */
export function usageNote(p: Pick<PublicProperty, "dealType" | "category">, locale: LangCode): string | null {
  const ui = propertyUi(locale);
  if (p.dealType === "rental") return ui.noteRental;
  if (p.dealType === "land" || p.dealType === "businessBuilding" || p.category === "jigyo") return ui.noteLandBusiness;
  return null;
}
