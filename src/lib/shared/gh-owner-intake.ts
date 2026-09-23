// グループホーム向け物件・大家募集ページ（/group-home/ooya）の専用フォームの共有定義
// （2026-09-24・指示書 v1.0 第6章 6-1）。
// ⚠️ クライアント安全ファイル：事務所名・office.ts 由来の文言を置かない（GhOwnerForm＝client から参照）。
// 物件項目は既存の /api/contact のスキーマに無いため、buildGhOwnerMessage で本文（message）に整形して送る
// （手本＝PropertyViewingCta の details）。通知メールでそのまま読める形にする。

/** /api/contact の category 値。表示ラベルは contact-intake.ts の EXTRA_CATEGORY_LABELS が正本 */
export const GH_OWNER_CATEGORY = "gh-owner";

/** 物件の種別（必須）。value は GA4 の property_type にも使う＝閉じた選択肢のキーのみを送る */
export const GH_OWNER_PROPERTY_TYPES = [
  { value: "kodate", label: "戸建て" },
  { value: "apart", label: "アパート・一棟" },
  { value: "mansion", label: "マンションの一室" },
  { value: "akiya", label: "空き家" },
  { value: "tochi", label: "土地" },
  { value: "other", label: "その他" },
] as const;

/** 現在の利用状況（任意） */
export const GH_OWNER_USAGE_OPTIONS = [
  { value: "vacant", label: "空室・空き家" },
  { value: "self", label: "自己使用中" },
  { value: "rented", label: "賃貸中（入居者あり）" },
  { value: "other", label: "その他" },
] as const;

export type GhOwnerIntake = {
  /** 所在地（必須）。区市町村と町名まで（番地は任意） */
  address: string;
  /** GH_OWNER_PROPERTY_TYPES の value */
  propertyType: string;
  layout: string;
  floorArea: string;
  /** GH_OWNER_USAGE_OPTIONS の value（未選択は空文字） */
  usage: string;
  rent: string;
  hasDrawings: boolean;
  note: string;
};

const BLANK = "未入力";

function labelOf(options: readonly { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? "";
}

/** 任意項目：空なら「未入力」（項目の欠落と入力漏れを通知メールで区別できるようにする） */
function orBlank(value: string): string {
  const v = value.trim();
  return v ? v : BLANK;
}

/** GA4 の property_type 用。一覧に無い値は "other" に丸める（自由入力を送らない） */
export function propertyTypeParam(value: string): string {
  return GH_OWNER_PROPERTY_TYPES.some((o) => o.value === value) ? value : "other";
}

/**
 * 送信本文（/api/contact の message）を組み立てる。
 * 通知メールは改行を <br /> にして表示するため、1行1項目にする。
 */
export function buildGhOwnerMessage(v: GhOwnerIntake): string {
  const area = v.floorArea.trim();
  const areaText = area ? (/^[0-9０-９]+(?:[.．][0-9０-９]+)?$/.test(area) ? `${area}㎡` : area) : BLANK;
  return [
    "【グループホーム向け物件のご相談】",
    `所在地：${orBlank(v.address)}`,
    `種別：${labelOf(GH_OWNER_PROPERTY_TYPES, v.propertyType) || BLANK}`,
    `間取り・部屋数：${orBlank(v.layout)}`,
    `延床面積：${areaText}`,
    `利用状況：${labelOf(GH_OWNER_USAGE_OPTIONS, v.usage) || BLANK}`,
    `希望賃料：${orBlank(v.rent)}`,
    `図面・資料：${v.hasDrawings ? "あり（LINE またはメールで送付）" : "なし"}`,
    `備考：${orBlank(v.note)}`,
  ].join("\n");
}
