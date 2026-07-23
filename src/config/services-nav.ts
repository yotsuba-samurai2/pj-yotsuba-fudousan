// 「サービス」ナビの4カテゴリ単一ソース定義（タスク＝ヘッダー・フッター・/servicesピラー露出計画）
// 手本＝tasks/services-nav-pillar-exposure-plan.md §カテゴリ設計。ヘッダーのメガメニュー・
// フッターの4カラム・/servicesページの4カードが、すべてこのファイルの SERVICE_NAV_CATEGORIES /
// SERVICE_NAV_UTILITY_LINKS を参照する（表示のズレを防ぐ＝保守性優先）。
//
// カテゴリ・カテゴリ名・「/group-homeをGHの唯一の入口にする」方針は設計書で固定済み（変更しない）。
// /toushi/group-home はここに含めない（ナビ非露出のまま・/group-home本文からの内部リンクのみで到達）。
//
// ロケール可用性は sitemap.ts の StaticPage.locales / 各ページの buildPageMetadata availableLocales
// と同じ考え方（`locales` 未指定＝ja/en/zh-tw/zh 全4ロケール実在）。新設ピラーの多くは ja 先行公開
// （availableLocales:["ja"]）のため、他ロケールでは locales で絞ってリンクを出さない。
import type { LangCode } from "@/config/languages";

/** ja は必須（フォールバック先）・他ロケールは実在する言語版のみ埋める */
export type NavLabel = Partial<Record<LangCode, string>> & { ja: string };

export type ServiceNavLink = {
  href: string;
  label: NavLabel;
  /** このリンク先が実在するロケール（未指定＝ja/en/zh-tw/zh 全4ロケール）。sitemap.ts と必ず一致させる */
  locales?: LangCode[];
};

export type ServiceNavCategory = {
  id: string;
  hubHref: string;
  categoryLabel: NavLabel;
  children: ServiceNavLink[];
};

/** 指定ロケールでのラベル文字列を返す（未翻訳ロケールは ja にフォールバック） */
export function resolveNavLabel(label: NavLabel, locale: LangCode): string {
  return label[locale] ?? label.ja;
}

/** 指定ロケールでこのリンクを表示してよいか（存在しないロケールのURLを広告しない） */
export function isNavLinkVisible(link: { locales?: LangCode[] }, locale: LangCode): boolean {
  return !link.locales || link.locales.includes(locale);
}

export const SERVICE_NAV_CATEGORIES: ServiceNavCategory[] = [
  // ① 相続不動産
  {
    id: "souzoku",
    hubHref: "/souzoku",
    categoryLabel: { ja: "相続不動産", en: "Inherited Property", "zh-tw": "繼承不動產", zh: "继承不动产" },
    children: [
      { href: "/souzoku", label: { ja: "総合ガイド", en: "Complete guide", "zh-tw": "完整指南", zh: "完整指南" } },
      {
        href: "/souzoku/nagare",
        label: { ja: "相談〜売却・活用の流れ", en: "Consultation to resolution", "zh-tw": "諮詢〜解決的流程", zh: "咨询〜解决的流程" },
      },
      {
        href: "/souzoku/akiya",
        label: { ja: "空き家の売却・活用", "zh-tw": "空屋的出售・活用", zh: "空置房屋的出售・活用" },
        locales: ["ja", "zh-tw", "zh"],
      },
      {
        href: "/souzoku/taiwan",
        label: { ja: "台湾の相続人向けガイド", "zh-tw": "給台灣繼承人的指南" },
        locales: ["ja", "zh-tw"],
      },
    ],
  },
  // ② グループホーム開設（/group-home を唯一の入口にする＝設計書で固定。/toushi/group-home は含めない）
  {
    id: "group-home",
    hubHref: "/group-home",
    categoryLabel: { ja: "グループホーム開設", en: "Opening a Group Home", "zh-tw": "開設團體家屋", zh: "开设团体家屋" },
    children: [
      {
        href: "/group-home",
        label: { ja: "開設の完全ガイド", en: "The complete opening guide", "zh-tw": "開設的完整指南", zh: "开设的完整指南" },
      },
    ],
  },
  // ③ 投資・事業用不動産（開業支援）
  {
    id: "toushi",
    hubHref: "/toushi",
    categoryLabel: {
      ja: "投資・事業用不動産（開業支援）",
      en: "Investment & Business Use (Opening Support)",
      "zh-tw": "投資・事業用不動產（開業支援）",
      zh: "投资・事业用不动产（开业支持）",
    },
    children: [
      { href: "/toushi", label: { ja: "総合ガイド", en: "Complete guide", "zh-tw": "完整指南", zh: "完整指南" } },
      { href: "/kaigo", label: { ja: "介護事業所の開業" }, locales: ["ja"] },
      { href: "/minpaku", label: { ja: "民泊の開業" }, locales: ["ja"] },
      { href: "/inshokuten", label: { ja: "飲食店の開業" }, locales: ["ja"] },
      { href: "/office", label: { ja: "会社設立×オフィス" }, locales: ["ja"] },
      {
        href: "/toushi/shataku",
        label: { ja: "社宅・法人契約", en: "Company housing & corporate leases", "zh-tw": "員工宿舍・法人租賃", zh: "员工宿舍・法人租赁" },
      },
    ],
  },
  // ④ 外国人・多言語
  {
    id: "global",
    hubHref: "/global",
    categoryLabel: { ja: "外国人・多言語", en: "International & Multilingual", "zh-tw": "外國人・多語言", zh: "外国人・多语言" },
    children: [
      { href: "/global", label: { ja: "総合ガイド", en: "Complete guide", "zh-tw": "完整指南", zh: "完整指南" } },
      {
        href: "/global/chinese",
        label: { ja: "中国語相談", "zh-tw": "中文諮詢", zh: "中文咨询" },
        locales: ["ja", "zh-tw", "zh"],
      },
    ],
  },
];

/** カテゴリ外の補助導線（メガメニュー下部・フッター会社情報列で使用） */
export const SERVICE_NAV_UTILITY_LINKS: ServiceNavLink[] = [
  { href: "/faq", label: { ja: "よくある質問", en: "FAQ", "zh-tw": "常見問題", zh: "常见问题" } },
  { href: "/jirei", label: { ja: "相談事例" }, locales: ["ja"] },
  { href: "/ryokin", label: { ja: "料金", en: "Fees", "zh-tw": "費用", zh: "费用" } },
];
