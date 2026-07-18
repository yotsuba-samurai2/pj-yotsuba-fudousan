// A-3 共通部品の共有定数（phaseA_components_reference/constants.ts 由来・2026-07-10統合）
// 一本化方針：
//   - エンティティ系（PERSON_ID / PERSON_SAME_AS / REALESTATE_SAME_AS / memberOf 等）は
//     既存の正本 src/lib/seo.ts にあるため、ここには置かない（値の二重管理をしない）。
//   - ナビ・ロゴ・ドメインは src/config/group.ts が正本。
//   - ここに置くのは共通部品（CtaBand/MobileStickyBar/LinkaFab 等）が使う
//     事務所連絡先・テナント別CTA文言・公開フラグのみ。
// 2026-07-11: CTA帯文言の4ロケール化はTENANT_CTA_I18N（本ファイル内・server専用のまま）で対応済み。
// Firestoreに新キーは増やさない（B1教訓）。

import type { LangCode } from "@/config/languages";

export type BusinessKey = "realestate" | "legal" | "labor";

/** 3サイト共通の代表LINE（浦松確定・全サイト同一） */
export const LINE_URL = "https://line.me/ti/p/EF5782JXqJ";

/** 事務所の共有情報（住所・電話・アクセス・地図）。営業時間・CTA文言はテナント別（TENANT）。 */
export const OFFICE = {
  tel: "03-6161-9428",
  telHref: "tel:0361619428",
  address: "東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３",
  access: "東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分",
  // 注：画面の地図リンクは事業別MAP_URL（office-public.ts）へ移行済み（2026-07-11 P2）。
  // ここはlaborフォールバック値の元＝住所クエリ形式のまま維持（office-public.OFFICE.mapUrlと同値）。
  mapUrl:
    "https://maps.google.com/?q=" +
    encodeURIComponent("東京都文京区小日向4-2-5 小日向安田ビル203"),
};

/** テナント別：ルート・表示名・問い合わせ先・営業時間・CTA帯文言（各原稿v1.0「サイト共通」より転記） */
export const TENANT: Record<
  BusinessKey,
  {
    home: string;
    name: string;
    contactHref: string;
    hours: string; // 表示用
    openingHours: string[]; // schema.org openingHours
    ctaHeading: string;
    ctaLead: string;
  }
> = {
  realestate: {
    home: "/",
    name: "四葉不動産株式会社",
    contactHref: "/contact",
    hours: "10:00〜18:00（定休：火・水）",
    openingHours: ["Mo,Th,Fr,Sa,Su 10:00-18:00"],
    ctaHeading: "「これ、どうしたらいい？」の一言からで大丈夫です。",
    ctaLead:
      "代表が直接お返事し、ご希望を伺って条件に合う物件があればLINEでご紹介します。",
  },
  legal: {
    home: "/legal",
    name: "四葉行政書士事務所",
    contactHref: "/legal/contact",
    hours: "火・水 10:00〜19:00／月・木・金・土・日 18:00〜19:00",
    openingHours: ["Tu,We 10:00-19:00", "Mo,Th,Fr,Sa,Su 18:00-19:00"],
    ctaHeading: "まずは、状況を整理するところから。",
    ctaLead:
      "四葉行政書士事務所（文京区小日向・東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分）が、要件の整理から書類作成・申請までお手伝いします。",
  },
  labor: {
    home: "/labor",
    name: "四葉社会保険労務士事務所",
    contactHref: "/labor/contact",
    hours: "", // 【要確認：浦松＝社労士事務所の営業時間】開業時確定まで空欄（未検証は出力しない）
    openingHours: [],
    ctaHeading: "「人」の手続き、まとめて整理しませんか。",
    ctaLead:
      "四葉社会保険労務士事務所（文京区小日向・東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分）が、労務の現状整理からお手伝いします。",
  },
};

/**
 * CTA帯（CtaBand）テナント別文言の4ロケール版（2026-07-11・診断_ロケール保持リンク_v1 §B-1）。
 * - server専用のまま＝SR名（社労士事務所名）を含むため office-public / client側へ移さないこと。
 * - ja はTENANT正文の参照（バイト不変＝ja表示回帰なしの担保）。
 * - en/zh-tw/zh は監修前ドラフト（realestateはHomePageContent COPYの既存訳を転用、legal/laborは新規訳＝要監修）。
 * - labor.hours は全ロケール空欄維持（【要確認：浦松】開業時確定まで。未検証は出力しない）。
 */
export const TENANT_CTA_I18N: Record<
  BusinessKey,
  Record<LangCode, { ctaHeading: string; ctaLead: string; hours: string }>
> = {
  realestate: {
    ja: {
      ctaHeading: TENANT.realestate.ctaHeading,
      ctaLead: TENANT.realestate.ctaLead,
      hours: TENANT.realestate.hours,
    },
    en: {
      ctaHeading: "It's fine to start with just one line: “What should I do with this?”",
      ctaLead:
        "Our representative replies to you personally, and if a property matches your needs, we will introduce it via LINE.",
      hours: "10:00–18:00 (Closed Tue & Wed)",
    },
    "zh-tw": {
      ctaHeading: "從一句「這該怎麼辦？」開始就可以。",
      ctaLead: "代表將親自回覆，了解您的需求後，若有符合條件的物件將透過LINE為您介紹。",
      hours: "10:00〜18:00（週二・週三公休）",
    },
    zh: {
      ctaHeading: "从一句“这该怎么办？”开始就可以。",
      ctaLead: "代表将亲自回复，了解您的需求后，若有符合条件的物件将通过LINE为您介绍。",
      hours: "10:00〜18:00（周二・周三定休）",
    },
  },
  legal: {
    ja: {
      ctaHeading: TENANT.legal.ctaHeading,
      ctaLead: TENANT.legal.ctaLead,
      hours: TENANT.legal.hours,
    },
    en: {
      ctaHeading: "Let's start by sorting out your situation.",
      ctaLead:
        "Yotsuba Gyoseishoshi Office (Kohinata, Bunkyo-ku; a 5-minute walk from Myogadani Station on the Tokyo Metro Marunouchi Line) supports you from organizing the requirements through document preparation and application.",
      hours: "Tue & Wed 10:00–19:00 / Mon, Thu–Sun 18:00–19:00",
    },
    "zh-tw": {
      ctaHeading: "先從整理您的狀況開始。",
      ctaLead:
        "四葉行政書士事務所（文京區小日向・東京Metro丸之內線「茗荷谷」站 步行5分）從要件的整理到文件製作・申請，全程協助您。",
      hours: "週二・週三 10:00〜19:00／週一・週四〜週日 18:00〜19:00",
    },
    zh: {
      ctaHeading: "先从整理您的情况开始。",
      ctaLead:
        "四葉行政書士事務所（文京区小日向・东京Metro丸之内线“茗荷谷”站 步行5分）从要件的整理到文件制作・申请，全程协助您。",
      hours: "周二・周三 10:00〜19:00／周一・周四〜周日 18:00〜19:00",
    },
  },
  labor: {
    ja: {
      ctaHeading: TENANT.labor.ctaHeading,
      ctaLead: TENANT.labor.ctaLead,
      hours: TENANT.labor.hours,
    },
    en: {
      ctaHeading: "Why not sort out all your “people” procedures at once?",
      ctaLead:
        "Yotsuba Labor and Social Security Attorney Office (Kohinata, Bunkyo-ku; a 5-minute walk from Myogadani Station on the Tokyo Metro Marunouchi Line) helps you, starting with a review of your current labor practices.",
      hours: "",
    },
    "zh-tw": {
      ctaHeading: "與「人」相關的手續，一次整理好如何？",
      ctaLead:
        "四葉社会保険労務士事務所（文京區小日向・東京Metro丸之內線「茗荷谷」站 步行5分）從勞務現狀的整理開始協助您。",
      hours: "",
    },
    zh: {
      ctaHeading: "与“人”相关的手续，一次整理好如何？",
      ctaLead:
        "四葉社会保険労務士事務所（文京区小日向・东京Metro丸之内线“茗荷谷”站 步行5分）从劳务现状的整理开始协助您。",
      hours: "",
    },
  },
};

/** 社労士の公開フラグ（開業=2026年9月まで false）。SSR/CSR両方から参照可（NEXT_PUBLIC_）。 */
export const SR_LAUNCHED = process.env.NEXT_PUBLIC_SR_LAUNCHED === "true";
