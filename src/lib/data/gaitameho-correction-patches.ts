// 既存コラム /column/overseas-owners-guide-japan-real-estate-sale の是正差分
// （2026-08-12 浦松承認）。
//
// 【なぜ必要か】同コラムのQ7とQ11に、外為法についての誤りがある。
//   (1) Q7「非居住者が他の非居住者から取得する場合、外為法の取得報告は不要」
//       → この免除は2026年4月1日以降の取得では廃止されている（財務省リーフレット
//         令和8年6月）。しかも同じ記事のQ11に「すべての非居住者取引が20日以内の
//         事後報告対象に」とあり、記事内で自己矛盾している。
//   (2) Q11の罰則「50万円以下の過料」
//       → 誤り。外為法第71条は「六月以下の拘禁刑又は五十万円以下の罰金」と定め、
//         同条第3号が「第55条の3第1項又は第2項の規定による報告をせず、又は虚偽の
//         報告をしたとき」を掲げる。過料（行政上の秩序罰）ではなく刑事罰であり、
//         法的性質がまったく違う。e-Gov法令検索で条文本体を確認済み。
//
// 【当初E-3として挙げた「事務所目的の取得」行について】
//   居住用・非営利業務用・本人の事務所用の免除は、2026年4月1日以降も
//   「不動産に関する権利」（賃借権・借地権等）については残る。ただし比較表の記述は
//   「不動産そのもの」を前提とすれば誤りではなく omission にとどまる。表の行を
//   いじるとMarkdownの表を壊すリスクがあるため、表は触らず、P3のクロスリンク文で
//   新コラムに送る方針に変えた。
//
// 【方式】本文の正典は Supabase の Column（ja＝content・他は
//   translations.<locale>.content）。fix-kaigai-owner-crosslink /
//   fix-nozei-kanrinin-consistency と同じ「現在値と find を照合し、出現数が一致した
//   ときだけ置換」方式。marker で適用済みを判定し、重複適用を防ぐ。
//
// 【find の出所】2026-08-12 に本番4ロケール（ja / en / zh-tw / zh）の公開HTMLから
//   実測。採取時点でいずれも出現1回であることを確認済み。句読点の全角/半角が
//   ロケールで揺れる既知の事故を避けるため、find には句読点を含めていない
//   （P3のみ例外。理由は当該箇所に記す）。

import type { ColumnTextPatch } from "./nozei-kanrinin-consistency-patches";

export const OVERSEAS_GUIDE_SLUG =
  "overseas-owners-guide-japan-real-estate-sale";

/** 新コラム（買主側の外為法報告）のslug。P3のクロスリンク先。 */
export const NEW_COLUMN_SLUG = "hikyojusha-fudosan-shutoku-gaitameho-houkoku";

export const GAITAMEHO_CORRECTION_PATCHES: ColumnTextPatch[] = [
  // ─────────── P1: Q7 の「非居住者間は報告不要」を是正（4ロケール） ───────────
  {
    path: "content",
    find: "外為法の取得報告は不要",
    replace:
      "外為法の取得報告は2026年3月31日以前の取得では不要でしたが、2026年4月1日以降の取得ではこの免除が廃止され、買主に報告義務があります",
    count: 1,
    marker: "この免除が廃止され",
    label: "ja P1 Q7「非居住者間の取得は報告不要」を是正",
  },
  {
    path: "translations.en.content",
    find: "FEFTA acquisition reporting is not required",
    replace:
      "FEFTA acquisition reporting was not required for acquisitions on or before 31 March 2026, but that exemption was abolished for acquisitions from 1 April 2026 and the buyer now has a reporting obligation",
    count: 1,
    marker: "that exemption was abolished for acquisitions from 1 April 2026",
    label: "en P1 Q7「非居住者間の取得は報告不要」を是正",
  },
  {
    path: "translations.zh-tw.content",
    find: "無需外為法的取得申報",
    replace:
      "在2026年3月31日以前的取得無需外為法的取得申報，但2026年4月1日以後的取得已廢除此項免除，買方負有申報義務",
    count: 1,
    marker: "已廢除此項免除",
    label: "zh-tw P1 Q7「非居住者間の取得は報告不要」を是正",
  },
  {
    path: "translations.zh.content",
    find: "无需外为法的取得申报",
    replace:
      "在2026年3月31日以前的取得无需外为法的取得申报，但2026年4月1日以后的取得已废除该项免除，买方负有申报义务",
    count: 1,
    marker: "已废除该项免除",
    label: "zh P1 Q7「非居住者間の取得は報告不要」を是正",
  },

  // ─────────── P2: Q11 の罰則「過料」を刑事罰に是正（4ロケール） ───────────
  // 外為法第71条柱書＋第3号。過料は同法第73条（十万円以下）で別の違反類型。
  {
    path: "content",
    find: "50万円以下の過料",
    replace: "六月以下の拘禁刑または50万円以下の罰金（外為法第71条第3号）",
    count: 1,
    marker: "外為法第71条第3号",
    label: "ja P2 罰則「過料」→「拘禁刑または罰金」に是正",
  },
  {
    path: "translations.en.content",
    find: "Administrative fine up to 500,000 yen",
    replace:
      "Imprisonment for up to 6 months or a fine of up to 500,000 yen (FEFTA, Article 71, item 3)",
    count: 1,
    marker: "FEFTA, Article 71, item 3",
    label: "en P2 罰則「過料」→「拘禁刑または罰金」に是正",
  },
  {
    path: "translations.zh-tw.content",
    find: "50萬日圓以下罰款",
    replace: "6個月以下拘禁刑或50萬日圓以下罰金（外為法第71條第3號）",
    count: 1,
    marker: "外為法第71條第3號",
    label: "zh-tw P2 罰則「過料」→「拘禁刑または罰金」に是正",
  },
  {
    path: "translations.zh.content",
    find: "50万日元以下罚款",
    replace: "6个月以下拘禁刑或50万日元以下罚金（外为法第71条第3号）",
    count: 1,
    marker: "外为法第71条第3号",
    label: "zh P2 罰則「過料」→「拘禁刑または罰金」に是正",
  },

  // ─────────── P3: 買主側コラムへのクロスリンク（jaのみ） ───────────
  // 新コラムは当面 ja のみ公開のため、en/zh-tw/zh には当てない。
  // 翻訳を公開したら、各ロケールの該当段落を実測して同形のパッチを足すこと。
  //
  // ここだけ find に句読点を含める。理由：アンカーが強調記法（**）を挟んで
  // 分断されており（本番HTMLで <strong> を確認）、句読点を外すと一意にならない。
  // 全角の「、」「。」のみで、半角揺れのリスクは低いと判断した。
  // なお、もし本番の現在値が ** を使っていなければ count 不一致でスキップされる。
  // その場合は本番の当該段落を実測し直して find を更新すること（勝手に壊さない）。
  {
    path: "content",
    find: "**取引相手の報告義務を売主も意識する必要**があります。",
    replace:
      "**取引相手の報告義務を売主も意識する必要**があります。\n\nなお、本記事は売却する側の解説です。非居住者として日本の不動産を**買った側**に生じる20日以内の報告義務、2026年4月1日からの対象拡大（居住用等の免除が「不動産に関する権利」については残る点を含む）、報告事項に加わった不動産番号の扱いは、[非居住者が東京の不動産を買ったら、20日以内に外為法の報告](https://luck428.com/column/hikyojusha-fudosan-shutoku-gaitameho-houkoku)にまとめています。",
    count: 1,
    marker: "hikyojusha-fudosan-shutoku-gaitameho-houkoku",
    label: "ja P3 買主側コラムへのクロスリンクを追加",
  },
];

/** 適用後に各ロケール本文へ含まれているべき語（取りこぼし検知用）。 */
export const GAITAMEHO_EXPECT_TERMS: { locale: string; term: string }[] = [
  { locale: "ja", term: "外為法第71条第3号" },
  { locale: "ja", term: "この免除が廃止され" },
  { locale: "ja", term: "hikyojusha-fudosan-shutoku-gaitameho-houkoku" },
  { locale: "en", term: "FEFTA, Article 71, item 3" },
  { locale: "zh-tw", term: "外為法第71條第3號" },
  { locale: "zh", term: "外为法第71条第3号" },
];
