// A-3 共通部品の共有定数（phaseA_components_reference/constants.ts 由来・2026-07-10統合）
// 一本化方針：
//   - エンティティ系（PERSON_ID / PERSON_SAME_AS / REALESTATE_SAME_AS / memberOf 等）は
//     既存の正本 src/lib/seo.ts にあるため、ここには置かない（値の二重管理をしない）。
//   - ナビ・ロゴ・ドメインは src/config/group.ts が正本。
//   - ここに置くのは共通部品（CtaBand/MobileStickyBar/LinkaFab 等）が使う
//     事務所連絡先・テナント別CTA文言・公開フラグのみ。
// TODO(フェーズI): ラベル・CTA文言の多言語化（t()置換・Firestore翻訳追加は浦松承認後）。

export type BusinessKey = "realestate" | "legal" | "labor";

/** 3サイト共通の代表LINE（浦松確定・全サイト同一） */
export const LINE_URL = "https://line.me/ti/p/EF5782JXqJ";

/** 事務所の共有情報（住所・電話・アクセス・地図）。営業時間・CTA文言はテナント別（TENANT）。 */
export const OFFICE = {
  tel: "03-6161-9428",
  telHref: "tel:0361619428",
  address: "東京都文京区小日向４丁目２−５ 小日向安田ビル ２０３",
  access: "東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分",
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

/** 社労士の公開フラグ（開業=2026年9月まで false）。SSR/CSR両方から参照可（NEXT_PUBLIC_）。 */
export const SR_LAUNCHED = process.env.NEXT_PUBLIC_SR_LAUNCHED === "true";
