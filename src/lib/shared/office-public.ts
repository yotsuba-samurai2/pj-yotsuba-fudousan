// クライアント安全な共有定数（フェーズK-4で分離・2026-07-10）
// 背景：client component（MobileStickyBar等）が office.ts を import すると、
// TENANT.labor の事務所名・CTA文言までクライアントJSチャンクに同梱される（法27条ソース漏れ）。
// → クライアントから参照してよいのは本ファイルのみ。事務所名・テナント別文言は office.ts（サーバ専用）に残す。
// ここに社労士の事務所名・説明文を追加しないこと（grep検証対象）。

export type BusinessKey = "realestate" | "legal" | "labor";

/** 3サイト共通の代表LINE（公開情報） */
export const LINE_URL = "https://line.me/ti/p/EF5782JXqJ";

/** 事務所の共有連絡先（公開情報・サイト表示済みの範囲） */
export const OFFICE = {
  tel: "03-6161-9428",
  telHref: "tel:0361619428",
  access: "東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分",
  mapUrl:
    "https://maps.google.com/?q=" +
    encodeURIComponent("東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３"),
};

/** テナント別の問い合わせ先パス（名称・文言は含めない） */
export const CONTACT_HREF: Record<BusinessKey, string> = {
  realestate: "/contact",
  legal: "/legal/contact",
  labor: "/labor/contact",
};

/**
 * 事業別GBP（Googleビジネスプロフィール）直リンクの正本（JSON-LD hasMap／地図リンク共用。
 * 2026-07-11 P2仕様・浦松承認済み）。laborはGBP未整備のため未設定（未検証の値を置かない）。
 * seo.ts（BUSINESS_SEO.gbpUrl）もここを参照する＝値の二重管理をしない。
 */
export const GBP_URL = {
  realestate: "https://maps.google.com/?cid=2684416286346615973",
  legal: "https://share.google/qw9imD2snNKDEQS3Z",
} as const;

/** 事業別の地図リンク（フッター・下部固定バー用）。GBP直リンク優先／無い事業（labor）は住所クエリへフォールバック */
export const MAP_URL: Record<BusinessKey, string> = {
  realestate: GBP_URL.realestate,
  legal: GBP_URL.legal,
  labor: OFFICE.mapUrl,
};
