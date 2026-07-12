// A-4 cross-links.ts — 事業間クロスリンクの一元定義（正本＝内部リンク一覧と要確認集約_3サイト_v1.md §2）
// 実装時はこの表のとおりに a タグを張る（曖昧アンカー「こちら」禁止）。将来 Firestore へ。
// 開業日開通(C7〜C14)は launchFlag:"SR_LAUNCHED" ＝ フラグ false の間は描画しない（社労士の露出防止）。
// 全リンクに「独立受任注記」を添付（別事業体・紹介料等の授受なし＝非弁・業際配慮）。
import type { BusinessKey } from "@/lib/shared/office";
import type { LangCode } from "@/config/languages";

export type CrossTarget = {
  href: string;
  /** ja（既存・フォールバック） */
  anchor: string;
  /** 2026-07-12：en/zh-tw/zh のアンカー文言。未定義なら anchor（ja）へフォールバック */
  anchorI18n?: Partial<Record<LangCode, string>>;
  business: BusinessKey;
};
export type CrossLink = {
  id: string;
  from: string[]; // このパスのページに表示（末尾一致で判定・locale接頭辞は判定側で除去）
  targets: CrossTarget[];
  launchFlag?: "SR_LAUNCHED";
};

// 他事業体リンク直下に一字一句同一で添える（原稿サイト共通・正本）
export const INDEPENDENT_NOTE =
  "※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。";

// 社労士が関与するリンク用（開業後のみ表示される文脈・原稿_社労士v1.0サイト共通）
export const INDEPENDENT_NOTE_TRIPLE =
  "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。";

/**
 * 2026-07-12｜独立受任注記の4ロケール版（CrossLinkBanner＝server component専用）。
 *
 * ⚠️ **本ファイルをクライアントへ持ち込まない**（TRIPLEとlabor系anchorに社労士事務所名の
 *    リテラルが含まれる＝法27条のソース漏れ経路）。CrossLinkBannerはserverのまま維持すること。
 * ⚠️ 「別事業体・独立受任・紹介料の授受なし」（非弁・業際配慮）を全言語で**弱めない**。
 *    en/zh の文面は**石井弁護士レビュー済み**（2026-07-12・修正なしで承認）。**変更時は再レビュー必須**。
 * ※ ja は既存定数をそのまま参照＝表示回帰ゼロ。
 */
export const INDEPENDENT_NOTES: Record<LangCode, string> = {
  ja: INDEPENDENT_NOTE,
  en: "Note: Yotsuba Real Estate Co., Ltd. and Yotsuba Gyoseishoshi Office are separate, independent business entities and accept engagements individually (no referral fees are exchanged).",
  "zh-tw":
    "※四葉不動産株式会社與四葉行政書士事務所為各自獨立的事業體，分別承接委託（不收取亦不支付介紹費）。",
  zh: "※四葉不動産株式会社与四葉行政書士事務所为各自独立的事业体，分别承接委托（不收取亦不支付介绍费）。",
};

export const INDEPENDENT_NOTES_TRIPLE: Record<LangCode, string> = {
  ja: INDEPENDENT_NOTE_TRIPLE,
  en: "Note: Yotsuba Real Estate Co., Ltd., Yotsuba Gyoseishoshi Office, and Yotsuba Labor and Social Security Attorney Office are separate, independent business entities and accept engagements individually (no referral fees are exchanged).",
  "zh-tw":
    "※四葉不動産株式会社、四葉行政書士事務所、四葉社会保険労務士事務所為各自獨立的事業體，分別承接委託（不收取亦不支付介紹費）。",
  zh: "※四葉不動産株式会社、四葉行政書士事務所、四葉社会保険労務士事務所为各自独立的事业体，分别承接委托（不收取亦不支付介绍费）。",
};

// 2026-07-12：anchorI18n（en/zh-tw/zh）を追加。ja（anchor）は既存文言のまま＝表示回帰ゼロ。
// 訳は石井弁護士レビュー済み（2026-07-12・修正なしで承認／変更時は再レビュー必須）。事務所名は各言語とも日本語表記のまま（固有名＝実体名）。
const A_SOUZOKU: Partial<Record<LangCode, string>> = {
  en: "Inheriting property in Bunkyo — the complete guide to managing, utilizing, or selling (四葉不動産 / Yotsuba Real Estate)",
  "zh-tw": "在文京區繼承不動產——管理・活用・出售的完整指南（四葉不動産）",
  zh: "在文京区继承不动产——管理・活用・出售的完整指南（四葉不動産）",
};
const A_GROUP_HOME: Partial<Record<LangCode, string>> = {
  en: "Finding a property suitable for a group home (四葉不動産 / Yotsuba Real Estate)",
  "zh-tw": "尋找可用於團體家屋的物件（四葉不動産）",
  zh: "寻找可用于团体家屋的物件（四葉不動産）",
};
const A_SHOGAI_SHITEI: Partial<Record<LangCode, string>> = {
  en: "Designation application for disability welfare services (四葉行政書士事務所 / Yotsuba Gyoseishoshi Office)",
  "zh-tw": "障礙福祉服務的指定申請（四葉行政書士事務所）",
  zh: "残障福祉服务的指定申请（四葉行政書士事務所）",
};
const A_SHATAKU_SUPPORT: Partial<Record<LangCode, string>> = {
  en: "Support for company housing and corporate leases (四葉不動産 / Yotsuba Real Estate)",
  "zh-tw": "員工宿舍・法人租賃的支援（四葉不動産）",
  zh: "员工宿舍・法人租赁的支持（四葉不動産）",
};
const A_GLOBAL: Partial<Record<LangCode, string>> = {
  en: "Multilingual room-hunting support for international residents (四葉不動産 / Yotsuba Real Estate)",
  "zh-tw": "外國人・多語言找房（四葉不動産）",
  zh: "外国人・多语言找房（四葉不動産）",
};
const A_VISA: Partial<Record<LangCode, string>> = {
  en: "Visa and residence status applications (四葉行政書士事務所 / Yotsuba Gyoseishoshi Office)",
  "zh-tw": "在留資格・簽證申請（四葉行政書士事務所）",
  zh: "在留资格・签证申请（四葉行政書士事務所）",
};
const A_SHATAKU: Partial<Record<LangCode, string>> = {
  en: "Company housing and corporate leases (四葉不動産 / Yotsuba Real Estate)",
  "zh-tw": "員工宿舍・法人租賃（四葉不動産）",
  zh: "员工宿舍・法人租赁（四葉不動産）",
};
const A_SUBSIDY: Partial<Record<LangCode, string>> = {
  en: "Subsidy application support (四葉行政書士事務所 / Yotsuba Gyoseishoshi Office)",
  "zh-tw": "補助金申請支援（四葉行政書士事務所）",
  zh: "补助金申请支援（四葉行政書士事務所）",
};
const A_LEGAL_RYOKIN: Partial<Record<LangCode, string>> = {
  en: "Fee schedule of 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office)",
  "zh-tw": "四葉行政書士事務所的報酬額表",
  zh: "四葉行政書士事務所的报酬额表",
};
// ── 以下はSR_LAUNCHED（社労士開業）まで描画されない（社労士名を含む） ──
const A_SR_RYOKIN: Partial<Record<LangCode, string>> = {
  en: "Fees for labor management, treatment-improvement add-ons, and employment grants (四葉社会保険労務士事務所)",
  "zh-tw": "勞務・待遇改善加算・雇用相關補助的費用（四葉社会保険労務士事務所）",
  zh: "劳务・待遇改善加算・雇用相关补助的费用（四葉社会保険労務士事務所）",
};
const A_SR_SHOGU: Partial<Record<LangCode, string>> = {
  en: "Support for treatment-improvement add-ons (四葉社会保険労務士事務所)",
  "zh-tw": "待遇改善加算的支援（四葉社会保険労務士事務所）",
  zh: "待遇改善加算的支持（四葉社会保険労務士事務所）",
};
const A_SR_KAIGO: Partial<Record<LangCode, string>> = {
  en: "Labor management for care and disability-welfare providers (四葉社会保険労務士事務所)",
  "zh-tw": "照護・障礙福祉的勞務管理（四葉社会保険労務士事務所）",
  zh: "护理・残障福祉的劳务管理（四葉社会保険労務士事務所）",
};
const A_SR_JOSEIKIN: Partial<Record<LangCode, string>> = {
  en: "Applications for employment-related grants (四葉社会保険労務士事務所)",
  "zh-tw": "雇用相關補助的申請（四葉社会保険労務士事務所）",
  zh: "雇用相关补助的申请（四葉社会保険労務士事務所）",
};

export const CROSS_LINKS: CrossLink[] = [
  // ── 即時開通（C1〜C6） ──
  { id: "C1", from: ["/legal/services/inheritance"], targets: [{ href: "/souzoku", anchor: "文京区で不動産を相続したら——管理・活用・売却の完全ガイド（四葉不動産）", anchorI18n: A_SOUZOKU, business: "realestate" }] },
  { id: "C2", from: ["/legal/services/shogai-fukushi"], targets: [{ href: "/toushi/group-home", anchor: "グループホームに使える物件探し（四葉不動産）", anchorI18n: A_GROUP_HOME, business: "realestate" }] },
  { id: "C3", from: ["/toushi", "/toushi/group-home"], targets: [{ href: "/legal/services/shogai-fukushi", anchor: "障害福祉サービスの指定申請（四葉行政書士事務所）", anchorI18n: A_SHOGAI_SHITEI, business: "legal" }] },
  { id: "C4", from: ["/legal/services/visa"], targets: [{ href: "/toushi/shataku", anchor: "社宅・法人賃貸のサポート（四葉不動産）", anchorI18n: A_SHATAKU_SUPPORT, business: "realestate" }] },
  { id: "C5", from: ["/legal/services/visa"], targets: [{ href: "/global", anchor: "外国人・多言語のお部屋探し（四葉不動産）", anchorI18n: A_GLOBAL, business: "realestate" }] },
  { id: "C6", from: ["/toushi/shataku", "/global"], targets: [{ href: "/legal/services/visa", anchor: "在留資格・ビザ申請（四葉行政書士事務所）", anchorI18n: A_VISA, business: "legal" }] },

  // ── 開業日開通（C7〜C14・SR_LAUNCHED） ──
  { id: "C7", from: ["/legal/ryokin"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/labor/ryokin", anchor: "労務・処遇改善加算・雇用関係助成金の料金（四葉社会保険労務士事務所）", anchorI18n: A_SR_RYOKIN, business: "labor" }] },
  { id: "C8", from: ["/labor/ryokin"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/legal/ryokin", anchor: "四葉行政書士事務所の報酬額表", anchorI18n: A_LEGAL_RYOKIN, business: "legal" }] },
  { id: "C9", from: ["/legal/services/shogai-fukushi"], launchFlag: "SR_LAUNCHED", targets: [
      { href: "/labor/services/shogu-kaizen", anchor: "処遇改善加算のサポート（四葉社会保険労務士事務所）", anchorI18n: A_SR_SHOGU, business: "labor" },
      { href: "/labor/services/kaigo-roumu", anchor: "介護・障害福祉の労務管理（四葉社会保険労務士事務所）", anchorI18n: A_SR_KAIGO, business: "labor" },
    ] },
  { id: "C10", from: ["/labor/services/shogu-kaizen", "/labor/services/kaigo-roumu"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/legal/services/shogai-fukushi", anchor: "障害福祉サービスの指定申請（四葉行政書士事務所）", anchorI18n: A_SHOGAI_SHITEI, business: "legal" }] },
  { id: "C11", from: ["/legal/services/subsidy"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/labor/services/joseikin", anchor: "雇用関係助成金の申請（四葉社会保険労務士事務所）", anchorI18n: A_SR_JOSEIKIN, business: "labor" }] },
  { id: "C12", from: ["/labor/services/joseikin"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/legal/services/subsidy", anchor: "補助金申請サポート（四葉行政書士事務所）", anchorI18n: A_SUBSIDY, business: "legal" }] },
  { id: "C13", from: ["/labor/services/kaigo-roumu", "/labor"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/toushi/group-home", anchor: "グループホームに使える物件探し（四葉不動産）", anchorI18n: A_GROUP_HOME, business: "realestate" }] },
  { id: "C14", from: ["/labor/services/gaikokujin-koyo"], launchFlag: "SR_LAUNCHED", targets: [
      { href: "/legal/services/visa", anchor: "在留資格・ビザ申請（四葉行政書士事務所）", anchorI18n: A_VISA, business: "legal" },
      { href: "/toushi/shataku", anchor: "社宅・法人賃貸（四葉不動産）", anchorI18n: A_SHATAKU, business: "realestate" },
    ] },
];

// normalizePathは分離モジュールから再エクスポート（client側はlib/normalize-pathを直接使う）
export { normalizePath } from "@/lib/normalize-path";
import { normalizePath } from "@/lib/normalize-path";

/** リンクが社労士に関与するか（注記の3者版を使うか） */
export function involvesLabor(link: CrossLink): boolean {
  return (
    link.targets.some((t) => t.business === "labor") ||
    link.from.some((f) => f.startsWith("/labor"))
  );
}

/** 指定ページに表示すべきクロスリンクを返す（SR_LAUNCHED未開通は除外） */
export function getCrossLinks(pathname: string, srLaunched: boolean): CrossLink[] {
  const p = normalizePath(pathname).replace(/\/$/, "") || "/";
  return CROSS_LINKS.filter((c) => (c.launchFlag === "SR_LAUNCHED" ? srLaunched : true)).filter((c) =>
    c.from.some((f) => (f.replace(/\/$/, "") || "/") === p),
  );
}
