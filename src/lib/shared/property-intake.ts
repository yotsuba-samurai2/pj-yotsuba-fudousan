// 物件条件インテークの共有コピー（2026-07-24 CTA刷新v2・浦松指示）。
// ⚠️ クライアント安全ファイル：社労士事務所名（SR名）・office.ts由来の文言を置かないこと。
//    CtaBandActions（client）・ContactForm（client）・CtaBand（server）から共通参照する。
// Firestore翻訳辞書に新キーは増やさない（B1教訓）＝4ロケールは本ファイルに直書き。
// ja=確定文言（浦松指示の趣旨）。en/zh-tw/zh=監修前ドラフト。
import type { LangCode } from "@/config/languages";

/**
 * コピペ用の希望条件テンプレート（一般：飲食・オフィス・社宅・民泊など）。
 * LINEの個人リンクは本文プリセット不可のため、「コピー→LINEに貼り付け」の2タップで送れる形にする。
 */
export const PROPERTY_TEMPLATE: Record<LangCode, string> = {
  ja: "駅・エリア：\n賃料の上限：\n広さ（坪数）：\n居抜きかスケルトンか：\n業種（飲食など）：",
  en: "Station / area:\nMax rent:\nSize (tsubo / m²):\nTurnkey (with fixtures) or bare-shell:\nBusiness type (e.g. restaurant):",
  "zh-tw": "車站・區域：\n租金上限：\n坪數・面積：\n留有裝潢（居抜き）或毛坯（スケルトン）：\n業種（如餐飲）：",
  zh: "车站・区域：\n租金上限：\n面积（坪数）：\n带装修（居抜き）或毛坯（スケルトン）：\n业种（如餐饮）：",
};

/** グループホーム系ページ向けテンプレート（ja固定＝該当ページがja先行公開のため） */
export const PROPERTY_TEMPLATE_GH_JA =
  "エリア・駅：\n賃料の目安：\n広さ・面積：\n開設予定時期：\nその他（物件の希望など）：";

/**
 * トップページ向け一般テンプレート（2026-07-24 v2.1）。
 * 住まい・事業用の両方が来る入口のため「用途」欄で受け分ける（店舗専門の語に寄せない）。
 */
export const PROPERTY_TEMPLATE_GENERAL: Record<LangCode, string> = {
  ja: "駅・エリア：\n賃料の上限：\n広さ・間取り：\n用途（住まい／店舗／事務所など）：\n入居希望時期：",
  en: "Station / area:\nMax rent:\nSize / layout:\nUse (home / shop / office):\nDesired move-in timing:",
  "zh-tw": "車站・區域：\n租金上限：\n面積・格局：\n用途（自住／店鋪／辦公室等）：\n希望入住時期：",
  zh: "车站・区域：\n租金上限：\n面积・户型：\n用途（自住／店铺／办公室等）：\n希望入住时期：",
};

/** テンプレートのコピー操作ラベル */
export const TEMPLATE_COPY_LABELS: Record<LangCode, { copy: string; copied: string }> = {
  ja: { copy: "条件テンプレをコピー", copied: "コピーしました" },
  en: { copy: "Copy the template", copied: "Copied" },
  "zh-tw": { copy: "複製條件範本", copied: "已複製" },
  zh: { copy: "复制条件模板", copied: "已复制" },
};

/**
 * お問い合わせフォームのカテゴリ「物件を探してほしい」ラベル。
 * Firestore翻訳辞書（contact.form.categoryOptions.*）に新キーを増やさないため、部品内直書きで解決する
 * （手本＝MobileStickyBarのLABELS方式）。API側の管理者メール表示ラベルは api/contact/route.ts の
 * categoryLabels（ja固定）が対応する。
 */
export const BUKKEN_CATEGORY_LABEL: Record<LangCode, string> = {
  ja: "物件を探してほしい（希望条件を送る）",
  en: "Find a property for me (send my conditions)",
  "zh-tw": "希望協助尋找物件（傳送希望條件）",
  zh: "希望协助寻找物件（发送希望条件）",
};
