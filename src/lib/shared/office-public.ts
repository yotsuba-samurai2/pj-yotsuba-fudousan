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
  // FAX は3事業体で共通（浦松確定・2026-08-05 に /contact・/legal/contact・/labor/contact・/access へ新規掲載）。
  // tel: と違い href を持たせない（FAX はリンクにしない）。表記は半角固定。
  fax: "03-6161-2576",
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
// 形式はcid（恒久URL）に統一する。share.google の共有リンクは再発行のたびに変わり、
// 同一GBPに複数の短縮URLが並存することを実測で確認したため使わない（2026-07-25）。
/**
 * ★社労士GBPのcid（2026-09-01 新規作成・指示書30 v2.0＝3リスティング体制）。
 * 作成後、`maps.google.com/?cid=` のcid数値を**ここ1か所**に貼ればよい。
 * 空文字のあいだは hasMap・sameAs・MAP_URL のいずれにも出力されない（下の分岐参照）。
 * ※プレースホルダー文字列を入れないこと（空文字のみ許可）。
 */
export const LABOR_GBP_CID = "";

export const GBP_URL = {
  // cid=2684416286346615973（=0x2540f663c8f69ca5・kgmid /g/11ytdshcrj）現物確認済み
  realestate: "https://maps.google.com/?cid=2684416286346615973",
  // cid=5422744564688438984（=0x4b4175735def46c8・kgmid /g/11z5sjqsxz）現物確認済み（2026-07-25）
  // 旧値 https://share.google/qw9imD2snNKDEQS3Z から差し替え（同一GBPに解決することを確認済み）
  legal: "https://maps.google.com/?cid=5422744564688438984",
  /** labor＝cid未設定のあいだ undefined（出力側は ?? でフォールバック） */
  ...(LABOR_GBP_CID
    ? { labor: `https://maps.google.com/?cid=${LABOR_GBP_CID}` }
    : {}),
} as const;

/** 事業別の地図リンク（フッター・下部固定バー用）。GBP直リンク優先／無い事業（labor）は住所クエリへフォールバック */
export const MAP_URL: Record<BusinessKey, string> = {
  realestate: GBP_URL.realestate,
  legal: GBP_URL.legal,
  // 社労士GBPのcidが入り次第、自動でGBP直リンクに切り替わる
  labor: LABOR_GBP_CID ? `https://maps.google.com/?cid=${LABOR_GBP_CID}` : OFFICE.mapUrl,
};
