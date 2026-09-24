// 多頭飼い・大型犬の住まい探し（/pet-housing・ペット横断 指示書 版2.0 Phase 3）の公開フラグ・日付・掲載文言の単一ソース。
// ページ本体・メニュー（services-nav）・/services・sitemap・llms.txt・言語切替が同じ値を読む。
//
// ⚠️ クライアント安全ファイル：services-nav.ts（ヘッダー＝client component）から参照するため、
//    社労士事務所名・office.ts 由来の文言を置かない（法27条ソース漏れ対策＝wakeari.ts と同じ決まり）。
//
// 【段階公開（マージ＝公開にしない）】
//   NEXT_PUBLIC_PET_HOUSING_PUBLISHED（既定 off）。off の間は /pet-housing が全言語で404になり、
//   メニュー・/services・sitemap・llms.txt にも出さない。公開の順序（それぞれ別承認）＝
//   マージ → 本番DBに inquiries テーブルを作成 → Vercel でこのフラグを true にして再デプロイ → GSC へのインデックス登録。
//   NEXT_PUBLIC_ 変数はビルド時に埋め込まれるため、切り替えには再デプロイが要る（SR_LAUNCHED と同じ）。

export const PET_HOUSING_PATH = "/pet-housing";

/** 公開フラグ。"true" のときだけ公開（未設定・その他の値は非公開） */
export const PET_HOUSING_PUBLISHED = process.env.NEXT_PUBLIC_PET_HOUSING_PUBLISHED === "true";

/** 可視の最終更新日。WebPage JSON-LD の dateModified・sitemap の lastmod と同じ日付にそろえる */
export const PET_HOUSING_LAST_UPDATED_ISO = "2026-09-24";
export const PET_HOUSING_LAST_UPDATED_JA = "2026年9月24日";

/** 法令・公的資料の参照日（e-Gov 法令API と国土交通省のガイドラインを取得した日） */
export const PET_HOUSING_REFERENCE_DATE_JA = "2026年9月24日";

/** メニュー（SERVICE_NAV_UTILITY_LINKS）の表示名。日本語のみ */
export const PET_HOUSING_NAV_LABEL = "多頭飼い・大型犬の住まい探し";

/** /services の4領域カードの下に置く1行（指示書 第15章の短文を基本に、実対応に合わせた） */
export const PET_HOUSING_SERVICES_LINE =
  "猫3匹以上の多頭飼育や大型犬と暮らせる住まい探しをサポートします。大家さんへの受入れのご相談も行います。";
