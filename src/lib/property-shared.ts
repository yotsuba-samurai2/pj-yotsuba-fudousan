import type { LangCode } from "@/config/languages";

/**
 * 物件紹介（/bukken）の型定義と純関数（クライアント/サーバー共用）。
 * Prisma を import しないこと（column-shared.ts と同じ規約の純粋モジュール）。
 *
 * 必要表示事項の根拠＝「不動産の表示に関する公正競争規約」（2022-09-01施行改正）
 * 表示規約第8条・同施行規則第4条・別表（不動産公正取引協議会連合会）。
 * 各別表の「インターネット広告」列は原本PDFを目視確認済み（2026-09-01）：
 *  - 別表3（売地1区画）: 項目1〜14・16が必須（15「取引条件の有効期限」はチラシ等のみ）
 *  - 別表5（住宅1戸・一棟売り）: 項目1〜17・19が必須（14「引渡し可能年月」はネットのみ・18はチラシ等のみ）
 *  - 別表7（マンション1戸）: 項目1〜17・19が必須（13「引渡し可能年月」はネットのみ・18はチラシ等のみ）
 */

export type PropertyStatus = "draft" | "published" | "closed";
export type PropertyDealType =
  | "land"
  | "house"
  | "condo"
  | "wholeBuilding"
  | "businessBuilding";
export type PropertyCategory = "gh" | "jigyo" | "souzoku" | "toushi" | "other";
export type PropertyTradeMode = "seller" | "agent" | "broker";

/** 交通の利便。徒歩分数は保存せず distanceM（道路距離）から表示時に算出＝算出根拠を持つ */
export type PropertyAccess = {
  line: string;
  station: string;
  distanceM: number;
};

/** 借地の場合の表示（別表の「借地の場合はその旨」＋種類・内容等）。所有権なら undefined */
export type LeaseholdInfo = string;

/** 別表3（売地・1区画）由来の必須項目 */
export type LandSpec = {
  dealType: "land";
  landAreaSqm: number;
  /** 私道負担面積（㎡）。なしは 0（「私道負担：なし」と表示する） */
  privateRoadAreaSqm: number;
  /** 地目 */
  landCategory: string;
  /** 用途地域（市街化調整区域はその旨＋建築許可条件を含めて記載＝別表3(注)） */
  zoning: string;
  /** 建ぺい率（制限内容を含め文字列） */
  buildingCoverage: string;
  /** 容積率（制限があるときは制限の内容を含める） */
  floorAreaRatio: string;
  /** 都市計画法その他の法令に基づく制限（宅建業法施行令第3条に定めるもの） */
  legalRestrictions: string;
  leasehold?: LeaseholdInfo;
};

/** 別表5（新築・中古住宅で1戸）由来の必須項目 */
export type HouseSpec = {
  dealType: "house";
  landAreaSqm: number;
  privateRoadAreaSqm: number;
  buildingAreaSqm: number;
  /** 連棟式建物であるときは true（その旨を表示） */
  isRowHouse?: boolean;
  /** 建築年月（YYYY-MM） */
  builtYm: string;
  /** 引渡し可能年月（「即時」等の文字列可）＝インターネット広告の必須項目 */
  deliveryYm: string;
  leasehold?: LeaseholdInfo;
};

/** 別表7（中古マンション等で1戸）由来の必須項目 */
export type CondoSpec = {
  dealType: "condo";
  /** 建物の階数（例「地上10階建」） */
  floors: string;
  /** 当該物件が存在する階（例「5階」） */
  floorLocated: string;
  exclusiveAreaSqm: number;
  balconyAreaSqm: number;
  builtYm: string;
  deliveryYm: string;
  /** 管理費（月額・円等の表記込み文字列） */
  managementFee: string;
  /** 修繕積立金等 */
  repairReserve: string;
  /** 管理形態 */
  managementForm: string;
  /** 管理員の勤務形態 */
  managerWorkStyle: string;
  leasehold?: LeaseholdInfo;
};

/** 別表5（一棟売りマンション・アパート）由来の必須項目（「一棟売りである旨」は dealType から自動表示） */
export type WholeBuildingSpec = {
  dealType: "wholeBuilding";
  landAreaSqm: number;
  privateRoadAreaSqm: number;
  buildingAreaSqm: number;
  builtYm: string;
  deliveryYm: string;
  /** 建物内の住戸数 */
  unitCount: number;
  /** 各住戸の専有面積（最小） */
  unitAreaMinSqm: number;
  /** 各住戸の専有面積（最大） */
  unitAreaMaxSqm: number;
  /** 建物の主たる部分の構造（例「鉄筋コンクリート造」） */
  structure: string;
  /** 階数（例「地上3階建」） */
  floors: string;
  leasehold?: LeaseholdInfo;
};

/**
 * 事業用建物（店舗・事務所等）。施行規則第3条の種別・別表に事業用区分は存在しない
 * （原本確認2026-09-01）ため、別表5相当を自主基準として表示する（2026-09-01浦松承認①）。
 */
export type BusinessBuildingSpec = {
  dealType: "businessBuilding";
  landAreaSqm: number;
  privateRoadAreaSqm: number;
  buildingAreaSqm: number;
  builtYm: string;
  deliveryYm: string;
  structure?: string;
  floors?: string;
  zoning?: string;
  leasehold?: LeaseholdInfo;
};

export type PropertySpec =
  | LandSpec
  | HouseSpec
  | CondoSpec
  | WholeBuildingSpec
  | BusinessBuildingSpec;

export type PropertyImage = { url: string; alt: string };

export type PropertyTranslation = {
  title: string;
  description: string;
  /** 所在地の訳（省略時は ja の locationText を表示） */
  locationText?: string;
};

/** admin CRUD用の物件型（timestampはISO文字列。priceYenはJS number＝BigInt列からの変換値） */
export type AdminProperty = {
  id: string;
  slug: string;
  status: PropertyStatus;
  dealType: PropertyDealType;
  category: PropertyCategory;
  tradeMode: PropertyTradeMode;
  title: string;
  priceYen: number;
  priceNote?: string;
  locationText: string;
  access: PropertyAccess[];
  spec: PropertySpec;
  images: PropertyImage[];
  description: string;
  publishedAt?: string;
  infoUpdatedAt: string;
  nextUpdateAt: string;
  locales?: LangCode[];
  translations?: {
    en?: PropertyTranslation;
    "zh-tw"?: PropertyTranslation;
    zh?: PropertyTranslation;
  };
  /**
   * ★内部専用（自社媒介/広告許可の別・元付情報・経緯メモ等の業者間情報）。
   * 公開面・JSON-LD・OGPに一切出さない（toPublicProperty のホワイトリストに含めない）。
   */
  internal?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type PropertyInput = Omit<AdminProperty, "id" | "createdAt" | "updatedAt">;

/**
 * 公開ページ用の物件型。internal を型レベルでも持たない。
 * 生成は必ず toPublicProperty() を通す（削って作らない・ホワイトリストから組み立てる
 * ＝yotsuba-customer-doc-gate 第5条）。
 */
export type PublicProperty = {
  slug: string;
  status: PropertyStatus;
  dealType: PropertyDealType;
  category: PropertyCategory;
  tradeMode: PropertyTradeMode;
  title: string;
  priceYen: number;
  priceNote?: string;
  locationText: string;
  access: PropertyAccess[];
  spec: PropertySpec;
  images: PropertyImage[];
  description: string;
  publishedAt?: string;
  infoUpdatedAt: string;
  nextUpdateAt: string;
  locales: LangCode[];
  translations?: AdminProperty["translations"];
};

/**
 * 公開ビューへのホワイトリスト変換。ここに列挙したキーだけが公開面に渡る。
 * internal・id・createdAt/updatedAt は含めない（キーを増やすときは
 * property-shared.test.ts の非流出テストも必ず見直す）。
 */
export function toPublicProperty(p: AdminProperty | PropertyInput): PublicProperty {
  return {
    slug: p.slug,
    status: p.status,
    dealType: p.dealType,
    category: p.category,
    tradeMode: p.tradeMode,
    title: p.title,
    priceYen: p.priceYen,
    ...(p.priceNote ? { priceNote: p.priceNote } : {}),
    locationText: p.locationText,
    access: p.access,
    spec: p.spec,
    images: p.images,
    description: p.description,
    ...(p.publishedAt ? { publishedAt: p.publishedAt } : {}),
    infoUpdatedAt: p.infoUpdatedAt,
    nextUpdateAt: p.nextUpdateAt,
    locales: p.locales && p.locales.length > 0 ? p.locales : (["ja"] as LangCode[]),
    ...(p.translations ? { translations: p.translations } : {}),
  };
}

// ── 徒歩分数（規約施行規則第9条(9)・2022-09-01施行） ──

/**
 * 「徒歩による所要時間は、道路距離80メートルにつき1分間を要するものとして算出した数値を
 * 表示すること。この場合において、1分未満の端数が生じたときは、1分として算出すること。」
 */
export function walkMinutes(distanceM: number): number {
  if (!Number.isFinite(distanceM) || distanceM <= 0) return 1;
  return Math.max(1, Math.ceil(distanceM / 80));
}

/** 交通表示の文字列（例「東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分（道路距離400m）」） */
export function formatAccess(a: PropertyAccess): string {
  return `${a.line}「${a.station}」駅 徒歩${walkMinutes(a.distanceM)}分（道路距離${a.distanceM}m）`;
}

// ── 鮮度（おとり広告の構造的回避） ──

const DAY_MS = 24 * 60 * 60 * 1000;

/** 情報更新日から7日を超えた公開物件を管理画面で警告する（委任プロンプト指定） */
export const STALE_WARNING_DAYS = 7;
/** 次回更新予定日の既定＝情報更新日+14日（2026-09-01浦松承認④） */
export const NEXT_UPDATE_DEFAULT_DAYS = 14;

export function daysSince(isoDate: string, now: Date): number {
  const then = new Date(`${isoDate}T00:00:00+09:00`).getTime();
  if (Number.isNaN(then)) return 0;
  return Math.floor((now.getTime() - then) / DAY_MS);
}

export function isStaleListing(p: Pick<AdminProperty, "status" | "infoUpdatedAt">, now: Date): boolean {
  return p.status === "published" && daysSince(p.infoUpdatedAt, now) > STALE_WARNING_DAYS;
}

export function defaultNextUpdateAt(infoUpdatedAt: string): string {
  // 日付のみの加算はUTC固定で行う（+09:00基準でtoISOStringすると1日ずれる）
  const base = new Date(`${infoUpdatedAt}T00:00:00Z`);
  if (Number.isNaN(base.getTime())) return infoUpdatedAt;
  const next = new Date(base.getTime() + NEXT_UPDATE_DEFAULT_DAYS * DAY_MS);
  return next.toISOString().slice(0, 10);
}

// ── ロケール ──

export function isPropertyLocaleAllowed(
  p: Pick<PublicProperty, "locales">,
  locale: LangCode,
): boolean {
  return !p.locales || p.locales.length === 0 || p.locales.includes(locale);
}

export function getLocalizedProperty(p: PublicProperty, locale: LangCode): PublicProperty {
  if (locale === "ja" || !p.translations) return p;
  const trans = p.translations[locale as keyof typeof p.translations];
  if (!trans) return p;
  return {
    ...p,
    title: trans.title || p.title,
    description: trans.description || p.description,
    locationText: trans.locationText || p.locationText,
  };
}

// ── ラベル ──

export const DEAL_TYPE_LABELS: Record<PropertyDealType, string> = {
  land: "売地",
  house: "戸建",
  condo: "マンション",
  wholeBuilding: "一棟売りマンション・アパート",
  businessBuilding: "事業用建物",
};

export const CATEGORY_LABELS: Record<PropertyCategory, string> = {
  gh: "障害福祉GH向け",
  jigyo: "事業用・店舗",
  souzoku: "相続・売却",
  toushi: "投資用",
  other: "その他",
};

/** 取引態様（売主・代理・媒介（仲介）の別）＝規約別表・宅建業法第34条の表示文言 */
export const TRADE_MODE_LABELS: Record<PropertyTradeMode, string> = {
  seller: "売主",
  agent: "代理",
  broker: "媒介（仲介）",
};

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  draft: "下書き",
  published: "公開",
  closed: "成約（募集終了）",
};

/** 価格表示（円→万円・億円。1万円未満の端数は出さない運用＝入力は万円単位を想定） */
export function formatPriceYen(priceYen: number): string {
  const man = Math.floor(priceYen / 10000);
  const oku = Math.floor(man / 10000);
  const restMan = man % 10000;
  if (oku > 0) {
    return restMan > 0 ? `${oku}億${restMan.toLocaleString("ja-JP")}万円` : `${oku}億円`;
  }
  return `${man.toLocaleString("ja-JP")}万円`;
}

function formatArea(sqm: number): string {
  return `${sqm.toLocaleString("ja-JP", { maximumFractionDigits: 2 })}㎡`;
}

// ── 必要表示事項の行の組み立て（別表のインターネット広告列＝原本目視2026-09-01） ──

export type DisplayRow = { key: string; label: string; value: string };

function commonHeadRows(p: PublicProperty): DisplayRow[] {
  return [
    { key: "tradeMode", label: "取引態様", value: TRADE_MODE_LABELS[p.tradeMode] },
    { key: "location", label: "所在地", value: p.locationText },
    ...(p.access.length > 0
      ? [{ key: "access", label: "交通", value: p.access.map(formatAccess).join("／") }]
      : []),
    {
      key: "price",
      label: "価格",
      value: formatPriceYen(p.priceYen) + (p.priceNote ? `（${p.priceNote}）` : ""),
    },
  ];
}

function leaseholdRow(spec: PropertySpec): DisplayRow[] {
  return spec.leasehold
    ? [{ key: "leasehold", label: "借地", value: spec.leasehold }]
    : [];
}

/**
 * 種別ごとの必要表示事項を表示行に落とす。
 * 「情報公開日・情報更新日・次回更新予定日」と広告主に関する事項（商号・免許番号・所属団体・
 * 公取協加盟の旨等）はページ側の共通ブロックで自動表示する（この関数の対象外）。
 */
export function buildRequiredDisplayRows(p: PublicProperty): DisplayRow[] {
  const head = commonHeadRows(p);
  const s = p.spec;
  switch (s.dealType) {
    case "land":
      return [
        ...head,
        { key: "landArea", label: "土地面積", value: formatArea(s.landAreaSqm) },
        {
          key: "privateRoad",
          label: "私道負担面積",
          value: s.privateRoadAreaSqm > 0 ? formatArea(s.privateRoadAreaSqm) : "なし",
        },
        { key: "landCategory", label: "地目", value: s.landCategory },
        { key: "zoning", label: "用途地域", value: s.zoning },
        { key: "buildingCoverage", label: "建ぺい率", value: s.buildingCoverage },
        { key: "floorAreaRatio", label: "容積率", value: s.floorAreaRatio },
        { key: "legalRestrictions", label: "法令に基づく制限", value: s.legalRestrictions },
        ...leaseholdRow(s),
      ];
    case "house":
    case "businessBuilding":
      return [
        ...head,
        { key: "landArea", label: "土地面積", value: formatArea(s.landAreaSqm) },
        {
          key: "privateRoad",
          label: "私道負担面積",
          value: s.privateRoadAreaSqm > 0 ? formatArea(s.privateRoadAreaSqm) : "なし",
        },
        { key: "buildingArea", label: "建物面積", value: formatArea(s.buildingAreaSqm) },
        ...(s.dealType === "house" && s.isRowHouse
          ? [{ key: "rowHouse", label: "建物形式", value: "連棟式建物" }]
          : []),
        ...(s.dealType === "businessBuilding"
          ? [
              ...(s.structure ? [{ key: "structure", label: "構造", value: s.structure }] : []),
              ...(s.floors ? [{ key: "floors", label: "階数", value: s.floors }] : []),
              ...(s.zoning ? [{ key: "zoning", label: "用途地域", value: s.zoning }] : []),
            ]
          : []),
        { key: "builtYm", label: "建築年月", value: formatYm(s.builtYm) },
        { key: "deliveryYm", label: "引渡し可能年月", value: formatYm(s.deliveryYm) },
        ...leaseholdRow(s),
      ];
    case "condo":
      return [
        ...head,
        { key: "floors", label: "階数", value: s.floors },
        { key: "floorLocated", label: "所在階", value: s.floorLocated },
        { key: "exclusiveArea", label: "専有面積", value: formatArea(s.exclusiveAreaSqm) },
        { key: "balconyArea", label: "バルコニー面積", value: formatArea(s.balconyAreaSqm) },
        { key: "builtYm", label: "建築年月", value: formatYm(s.builtYm) },
        { key: "deliveryYm", label: "引渡し可能年月", value: formatYm(s.deliveryYm) },
        { key: "managementFee", label: "管理費", value: s.managementFee },
        { key: "repairReserve", label: "修繕積立金等", value: s.repairReserve },
        { key: "managementForm", label: "管理形態", value: s.managementForm },
        { key: "managerWorkStyle", label: "管理員の勤務形態", value: s.managerWorkStyle },
        ...leaseholdRow(s),
      ];
    case "wholeBuilding":
      return [
        ...head,
        { key: "wholeBuilding", label: "取引形態", value: "一棟売りマンション・アパート" },
        { key: "landArea", label: "土地面積", value: formatArea(s.landAreaSqm) },
        {
          key: "privateRoad",
          label: "私道負担面積",
          value: s.privateRoadAreaSqm > 0 ? formatArea(s.privateRoadAreaSqm) : "なし",
        },
        { key: "buildingArea", label: "建物面積", value: formatArea(s.buildingAreaSqm) },
        { key: "unitCount", label: "住戸数", value: `${s.unitCount}戸` },
        {
          key: "unitArea",
          label: "各住戸の専有面積",
          value: `${formatArea(s.unitAreaMinSqm)}〜${formatArea(s.unitAreaMaxSqm)}`,
        },
        { key: "structure", label: "構造", value: s.structure },
        { key: "floors", label: "階数", value: s.floors },
        { key: "builtYm", label: "建築年月", value: formatYm(s.builtYm) },
        { key: "deliveryYm", label: "引渡し可能年月", value: formatYm(s.deliveryYm) },
        ...leaseholdRow(s),
      ];
  }
}

function formatYm(ym: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return ym; // 「即時」等の文字列はそのまま
  return `${m[1]}年${Number(m[2])}月`;
}

// ── sitemap・一覧の収載判定（closed/draft を出さない） ──

/** sitemap・一覧・generateStaticParams に載せてよいのは published のみ */
export function isListable(p: Pick<PublicProperty, "status">): boolean {
  return p.status === "published";
}

export function filterListable<T extends Pick<PublicProperty, "status">>(items: T[]): T[] {
  return items.filter(isListable);
}

// ── 禁止語スキャン（物件広告用） ──

/**
 * 規約第18条・同施行規則の特定用語の使用基準（原本確認2026-09-01）に基づく、
 * 合理的根拠資料なしに使用できない用語＋業者間用語（顧客向けゲート第2条）。
 * 用途が広告文（title/description）のため日本語語彙が中心だが、
 * 英字の業者間略語（AD等）は単語境界で検査する。
 */
export const PROPERTY_BANNED_TERMS: readonly string[] = [
  // 最上級（規則・特定用語(1)）。「極」は単独1文字で「積極」等に誤検知するため
  // 自動スキャン対象外＝目視確認の対象（規約上の禁止自体は変わらない）
  "最高",
  "最高級",
  "特級",
  // 著しく安い印象（同(2)）
  "買得",
  "掘出",
  "掘り出し",
  "土地値",
  "格安",
  "投売り",
  "投げ売り",
  "破格",
  "特安",
  "激安",
  "バーゲンセール",
  "安値",
  // 完全性（同(3)）
  "完全",
  "完ぺき",
  "完璧",
  "絶対",
  "万全",
  // 優位性・限定（同(4)(5)等＋委任プロンプト指定）
  "日本一",
  "抜群",
  "特選",
  "厳選",
  // 業者間用語（顧客向けゲート第2条＝公開面に出さない）。
  // 「分かれ」「片手」「両手」は一般語と衝突して誤検知するため自動スキャン対象外＝目視確認の対象
  "元付",
  "客付",
  "広告料",
  "ＡＤ",
  "レインズ",
  "REINS",
  "ATBB",
] as const;

/** 英字略語は単語境界で誤検知を避ける（"AD" が "ADSL" 等に反応しない） */
const BANNED_WORD_BOUNDARY = [/\bAD\b/];

export type BannedTermHit = { term: string; index: number };

export function scanPropertyText(text: string): BannedTermHit[] {
  const hits: BannedTermHit[] = [];
  for (const term of PROPERTY_BANNED_TERMS) {
    const idx = text.indexOf(term);
    if (idx >= 0) hits.push({ term, index: idx });
  }
  for (const re of BANNED_WORD_BOUNDARY) {
    const m = re.exec(text);
    if (m) hits.push({ term: m[0], index: m.index });
  }
  return hits;
}

/** GH向けカテゴリの断定禁止（「GH可」と書かない）に対応する定型注記 */
export const GH_USE_NOTE =
  "障害福祉サービスでのご利用可否は、所管行政庁の指定基準等の確認が必要です。個別にご相談ください。";
