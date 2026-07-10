/**
 * 「四葉パートナーズ」表示層除去パッチ（翻訳データ編）。
 *
 * 方針（浦松 2026-07-10）:
 *  - 共通グループ表記 → 「四葉グループ」（表示専用の総称。登記実体でないためJSON-LDには出さない＝別PRで削除済）
 *  - 法務文書（privacy/terms）本文の「当社」→ 実体名「四葉不動産株式会社」（(realestate)配下の運営主体）
 *  - legal トップFAQ（faq[2]）→ 独立事業体表現へ全面改稿（コード側 /legal/services と同一文言）
 *  - labor.* → 「四葉社会保険労務士事務所（法人化しない方針）」＋総称は四葉グループ。※社労士は2026-09開業まで labor は notFound()＝非表示。開業タスクと同時整合させる想定で既定OFF。
 *
 * 実装形態: translation-patches.ts（静的 from/to）と同じ「現在値一致→書換／不一致はスキップ」の
 * 安全方式を踏襲しつつ、from の手動転記ミスを避けるため **規則ベース**にした。
 * 管理ページ（/admin/translations/fix-partners-brand）が本番の現在値を読み、下記ルールで to を算出し、
 * from→to をプレビュー表示してから適用する（現在値が既に置換済/対象外なら自動スキップ）。
 *
 * 棚卸し正本: 四葉基幹CRM/Firestore翻訳棚卸し_四葉パートナーズ除去_v1.md（全4ロケール・ユニーク33キー）
 */

import type { LangCode } from "@/config/languages";

export type PatchGroupId = "brand" | "legalDoc" | "faq" | "labor";

/** 総称ブランド → 四葉グループ（メタ・ヘッダー・フッター・aboutの運営本部欄 等） */
export const BRAND_KEYS: string[] = [
  "brand.groupName",
  "brand.groupNameEn",
  "brand.metaTitle",
  "brand.metaTitleTemplate",
  "common.footer.copyright",
  "common.footer.legalHeadquartersLine",
  "contact.metaTitle",
  "contact.metaDescription",
  "thanks.metaTitle",
  "privacyPolicy.metaTitle",
  "privacyPolicy.metaDescription",
  "terms.metaTitle",
  "terms.metaDescription",
  "realestate.aboutPage.partnersTitle",
  "realestate.aboutPage.companyInfo.0.value",
  "legal.aboutPage.officeInfo.0.value",
  "legal.homePage.metaDescription",
  "legal.meta.description",
];

/** 法務文書の本文（当社＝登記実体を名乗る）→ 四葉不動産株式会社 */
export const LEGALDOC_KEYS: string[] = [
  "terms.sections.application.content",
  "privacyPolicy.sections.collection.content",
  "privacyPolicy.sections.inquiry.contactInfo",
];

/** labor（現状404・非公開。開業タスクで有効化）→ 四葉社会保険労務士事務所＋四葉グループ */
export const LABOR_KEYS: string[] = [
  "labor.aboutPage.officeInfo.0.value",
  "labor.aboutPage.officeInfo.8.value",
  "labor.aboutPage.representativeBio2",
  "labor.homePage.metaDescription",
  "labor.meta.description",
];

/** legal トップFAQ（独立事業体表現へ全面改稿・ロケール別上書き） */
export const FAQ_KEY = "legal.homePage.faq.2.answer";

export const FAQ_OVERRIDE: Record<LangCode, string> = {
  ja: "はい、四葉不動産では、四葉行政書士事務所と連携し、事務所の賃貸契約と会社設立手続きなどをワンストップで対応できます。",
  en: "Yes. 四葉不動産 (Yotsuba Real Estate) works together with 四葉行政書士事務所 (our administrative scrivener office), so matters spanning real estate and legal—such as office lease contracts and company formation—can be handled in one place.",
  "zh-tw": "是的。四葉不動産與四葉行政書士事務所聯動，辦公室租賃合約與公司設立手續等不動產・法務事宜可一站式辦理。",
  zh: "是的。四葉不動産与四葉行政书士事务所联动，办公室租赁合同与公司设立手续等不动产・法务事宜可一站式办理。",
};

/** 総称ブランド置換 */
export function brandReplace(s: string): string {
  return s
    .replace(/YOTSUBA\s*PARTNERS/gi, "YOTSUBA GROUP")
    .replace(/四葉パートナーズ/g, "四葉グループ");
}

/** 法務文書：当社＝実体名 */
export function legalDocReplace(s: string): string {
  return s.replace(/四葉パートナーズ/g, "四葉不動産株式会社");
}

/**
 * labor：社労士「法人」表記→事務所（法人化しない方針）＋総称→四葉グループ。
 * ※中文の「社会保险劳务士法人／社會保險勞務士法人」は開業時に最終確認（現状は総称のみ置換）。
 */
export function laborReplace(s: string): string {
  return s
    .replace(/四葉パートナーズの社会保険労務士法人/g, "四葉社会保険労務士事務所")
    .replace(/四葉パートナーズの社労士法人/g, "四葉社会保険労務士事務所")
    .replace(/社会保険労務士法人/g, "四葉社会保険労務士事務所")
    .replace(/四葉パートナーズ/g, "四葉グループ");
}

export type BrandPatchGroup = {
  id: PatchGroupId;
  label: string;
  note: string;
  keys: string[];
  /** キーの現在値→変更後を算出。null は「このキーは対象外/上書き型（FAQ）」 */
  replace: ((s: string) => string) | null;
  /** FAQ のようにロケール別の固定文へ上書きする場合 */
  override?: Record<LangCode, string>;
  /** 既定で適用対象に含めるか */
  defaultOn: boolean;
};

export const PATCH_GROUPS: BrandPatchGroup[] = [
  {
    id: "brand",
    label: "総称ブランド → 四葉グループ",
    note: "メタ・ヘッダー・フッター・各aboutの運営本部欄。live影響あり。",
    keys: BRAND_KEYS,
    replace: brandReplace,
    defaultOn: true,
  },
  {
    id: "legalDoc",
    label: "法務文書の当社 → 四葉不動産株式会社",
    note: "privacy/terms 本文。登記実体を名乗るべき箇所。",
    keys: LEGALDOC_KEYS,
    replace: legalDocReplace,
    defaultOn: true,
  },
  {
    id: "faq",
    label: "legalトップFAQ → 独立事業体表現",
    note: "faq[2]。コード側 /legal/services と同一文言（浦松確定）。",
    keys: [FAQ_KEY],
    replace: null,
    override: FAQ_OVERRIDE,
    defaultOn: true,
  },
  {
    id: "labor",
    label: "labor（社労士）→ 事務所＋四葉グループ",
    note: "現状404・非公開。社労士開業（2026-09）タスクと同時整合。既定OFF。",
    keys: LABOR_KEYS,
    replace: laborReplace,
    defaultOn: false,
  },
];
