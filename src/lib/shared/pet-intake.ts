// クライアント安全：ペット住宅の借り手・大家フォームの項目定義（ペット横断 指示書 版2.0 第12章）。
// フォーム・受付API・通知メール・管理画面が同じ定義を使う。GH 大家フォームの値（gh-owner 等）は流用しない。
import { z } from "zod";
import { contactFieldsShape, contactIssues, text } from "./inquiry-intake";

export const PET_RENTER_CATEGORY = "pet-housing-renter";
export const PET_OWNER_CATEGORY = "pet-housing-owner";
export type PetCategory = typeof PET_RENTER_CATEGORY | typeof PET_OWNER_CATEGORY;

export const PET_CATEGORY_LABELS: Record<PetCategory, string> = {
  [PET_RENTER_CATEGORY]: "ペットと暮らす住まい探し（借り手・買い手）",
  [PET_OWNER_CATEGORY]: "ペット飼育者への賃貸の相談（大家さん）",
};

// 選択肢。「未定」「わからない」を選べるようにする（第12章）。
export const DEAL_VALUES = ["rent", "buy", "either", "undecided"] as const;
export const DEAL_LABELS: Record<(typeof DEAL_VALUES)[number], string> = { rent: "賃貸", buy: "購入", either: "賃貸・購入どちらも", undecided: "未定" };
export const SPECIES_VALUES = ["cat", "dog", "cat-and-dog", "other", "undecided"] as const;
export const SPECIES_LABELS: Record<(typeof SPECIES_VALUES)[number], string> = { cat: "猫", dog: "犬", "cat-and-dog": "犬と猫", other: "その他の動物", undecided: "未定" };
export const COUNT_VALUES = ["1", "2", "3", "4", "5+", "undecided"] as const;
export const COUNT_LABELS: Record<(typeof COUNT_VALUES)[number], string> = { "1": "1頭（匹）", "2": "2頭（匹）", "3": "3頭（匹）", "4": "4頭（匹）", "5+": "5頭（匹）以上", undecided: "未定" };
export const DOG_SIZE_VALUES = ["small", "medium", "large", "none", "undecided"] as const;
export const DOG_SIZE_LABELS: Record<(typeof DOG_SIZE_VALUES)[number], string> = { small: "小型犬", medium: "中型犬", large: "大型犬", none: "犬はいない", undecided: "未定・わからない" };
export const ARRIVAL_VALUES = ["yes", "no", "undecided"] as const;
export const ARRIVAL_LABELS: Record<(typeof ARRIVAL_VALUES)[number], string> = { yes: "海外から犬・猫と日本へ来る予定がある", no: "ない", undecided: "未定" };
export const PROPERTY_TYPE_VALUES = ["unit", "building", "house", "other"] as const;
export const PROPERTY_TYPE_LABELS: Record<(typeof PROPERTY_TYPE_VALUES)[number], string> = { unit: "マンションの1室", building: "一棟マンション・アパート", house: "戸建て", other: "その他" };
export const VACANCY_VALUES = ["vacant", "soon", "occupied", "undecided"] as const;
export const VACANCY_LABELS: Record<(typeof VACANCY_VALUES)[number], string> = { vacant: "空室", soon: "近く空く予定", occupied: "入居中", undecided: "未定・わからない" };
export const PET_POLICY_VALUES = ["allowed", "consult", "not-allowed", "undecided"] as const;
export const PET_POLICY_LABELS: Record<(typeof PET_POLICY_VALUES)[number], string> = { allowed: "ペット可", consult: "ペット相談", "not-allowed": "ペット不可", undecided: "わからない" };

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) => z.union([z.enum(values), z.literal("")]);
const requiredEnum = <T extends readonly [string, ...string[]]>(values: T, message: string) => z.enum(values, { error: message });

export const petRenterSchema = z.object({
  ...contactFieldsShape,
  deal: requiredEnum(DEAL_VALUES, "賃貸・購入のどちらかを選んでください（未定も選べます）"),
  area: text(200).min(1, "希望エリアを入力してください"),
  species: requiredEnum(SPECIES_VALUES, "動物の種類を選んでください（未定も選べます）"),
  count: requiredEnum(COUNT_VALUES, "頭数を選んでください（未定も選べます）"),
  dogSize: optionalEnum(DOG_SIZE_VALUES),
  budget: text(100),
  layout: text(50),
  timing: text(100),
  schoolDistrict: text(100),
  arrival: optionalEnum(ARRIVAL_VALUES),
  /** 四葉行政書士事務所（別事業者）へこの相談内容を伝えることへの同意。既定は同意しない。 */
  consentShare: z.boolean(),
  note: text(2000),
}).strict().superRefine((v, ctx) => {
  for (const i of contactIssues(v)) ctx.addIssue({ code: "custom", path: [i.path], message: i.message });
});
export type PetRenterFields = z.infer<typeof petRenterSchema>;

export const petOwnerSchema = z.object({
  ...contactFieldsShape,
  propertyArea: text(200).min(1, "物件のエリアを入力してください"),
  propertyType: requiredEnum(PROPERTY_TYPE_VALUES, "物件の種別を選んでください"),
  consultation: text(2000).min(1, "ご相談内容を入力してください"),
  address: text(200),
  builtYear: text(50),
  layout: text(50),
  floorArea: text(50),
  rent: text(100),
  vacancy: optionalEnum(VACANCY_VALUES),
  currentPolicy: optionalEnum(PET_POLICY_VALUES),
  acceptableAnimals: text(200),
}).strict().superRefine((v, ctx) => {
  for (const i of contactIssues(v)) ctx.addIssue({ code: "custom", path: [i.path], message: i.message });
});
export type PetOwnerFields = z.infer<typeof petOwnerSchema>;

const BLANK = "未入力";
const or = (v: string) => v || BLANK;
const pick = <K extends string>(labels: Record<K, string>, v: K | "") => (v ? labels[v] : BLANK);

/** 通知メール・管理画面に出す「項目：値」の並び（入力された順）。連絡先（名前・メール・電話）は別に扱う。 */
export function petRenterRows(f: PetRenterFields): { label: string; value: string }[] {
  return [
    { label: "賃貸／購入", value: DEAL_LABELS[f.deal] },
    { label: "希望エリア", value: f.area },
    { label: "動物の種類", value: SPECIES_LABELS[f.species] },
    { label: "頭数", value: COUNT_LABELS[f.count] },
    { label: "犬の大きさ", value: pick(DOG_SIZE_LABELS, f.dogSize) },
    { label: "予算", value: or(f.budget) },
    { label: "間取り", value: or(f.layout) },
    { label: "希望時期", value: or(f.timing) },
    { label: "学区", value: or(f.schoolDistrict) },
    { label: "海外からの来日予定", value: pick(ARRIVAL_LABELS, f.arrival) },
    { label: "四葉行政書士事務所への共有", value: f.consentShare ? "同意あり" : "同意なし（共有しない）" },
    { label: "その他", value: or(f.note) },
  ];
}

export function petOwnerRows(f: PetOwnerFields): { label: string; value: string }[] {
  return [
    { label: "物件のエリア", value: f.propertyArea },
    { label: "物件の種別", value: PROPERTY_TYPE_LABELS[f.propertyType] },
    { label: "ご相談内容", value: f.consultation },
    { label: "所在地（詳細）", value: or(f.address) },
    { label: "築年", value: or(f.builtYear) },
    { label: "間取り", value: or(f.layout) },
    { label: "面積", value: or(f.floorArea) },
    { label: "賃料", value: or(f.rent) },
    { label: "空室状況", value: pick(VACANCY_LABELS, f.vacancy) },
    { label: "現在のペット可否", value: pick(PET_POLICY_LABELS, f.currentPolicy) },
    { label: "受け入れられる動物", value: or(f.acceptableAnimals) },
  ];
}

/** GA4 に送ってよいパラメータ（固定値だけ。入力値は送らない＝指示書 第18章）。 */
export const PET_FORM_IDS: Record<PetCategory, "pet_housing_renter" | "pet_housing_owner"> = {
  [PET_RENTER_CATEGORY]: "pet_housing_renter",
  [PET_OWNER_CATEGORY]: "pet_housing_owner",
};
export function petFormGaParams(category: PetCategory) {
  return { business: "realestate", form_id: PET_FORM_IDS[category], page: "pet_housing" } as const;
}
