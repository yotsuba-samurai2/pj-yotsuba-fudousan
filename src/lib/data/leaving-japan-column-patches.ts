// 既存コラム /column/overseas-owners-guide-japan-real-estate-sale への /leaving-japan 導線追記
// （離日売却クラスタ新設・2026-08-09。PR＝浦松レビュー後に管理画面から適用）。
//
// 【方式】コラム本文の正典は DB（ja＝content・他ロケール＝translations.<locale>.content）で
//   リポジトリに実体が無いため、fix-kaigai-owner-crosslink と同じ
//   「現在値と find を照合して一致した場合のみ置換」方式で当てる。適用は浦松が管理画面から行う。
//
// 【find の出所】2026-07-27 適用済みの KAIGAI_OWNER_COLUMN_PATCHES ①（要約ブロックの
//   /kaigai-owner 導線文）を逐語で anchor に使う。ja は 2026-08-09 に本番ページの表示で
//   文面の存在を確認済み。zh は未検証（不一致ならスキップされ、管理画面に現在値差異として出る）。
//
// 【対象ロケール】ja・zh・en（2026-08-09 en版ページ追加に伴い en パッチを追加）。
//   zh-tw のコラムからは（当該ロケール版ページを作るまで）リンクしない
//   ＝存在しないロケールでの読者導線を作らない（C-6-1 の趣旨）。
import type { ColumnTextPatch } from "@/lib/data/kaigai-owner-column-patches";

export const LEAVING_JAPAN_COLUMN_SLUG =
  "overseas-owners-guide-japan-real-estate-sale";

export const LEAVING_JAPAN_COLUMN_PATCHES: ColumnTextPatch[] = [
  {
    path: "content",
    find: "本記事は**売却**の手法比較です。**売らずに貸す・持ち続ける**場合の源泉徴収と納税管理人については[海外に住んだまま、日本の家をどうするか](/kaigai-owner)をご覧ください。",
    replace:
      "本記事は**売却**の手法比較です。**売らずに貸す・持ち続ける**場合の源泉徴収と納税管理人については[海外に住んだまま、日本の家をどうするか](/kaigai-owner)をご覧ください。\n\nこれから日本を**出国する予定で、売却の時間がない**方は[【特集】緊急帰国・不動産スピード換金——出国まで30日でも売れます](/leaving-japan)へ。",
    count: 1,
    marker: "(/leaving-japan)",
    label: "ja 要約に /leaving-japan への導線を追加",
  },
  {
    path: "translations.zh.content",
    find: "本文比较的是**出售**的手法。若您**不出售、而是出租或继续持有**,租金的源泉征收与纳税管理人请见[人在海外,日本的房子该怎么办](/kaigai-owner)。",
    replace:
      "本文比较的是**出售**的手法。若您**不出售、而是出租或继续持有**,租金的源泉征收与纳税管理人请见[人在海外,日本的房子该怎么办](/kaigai-owner)。\n\n若您**即将离开日本、时间紧迫**,请见[【专题】紧急回国·房产快速变现——距离出境只剩30天也能卖](/leaving-japan)。",
    count: 1,
    marker: "(/leaving-japan)",
    label: "zh 要約に /leaving-japan への導線を追加",
  },
  {
    path: "translations.en.content",
    find: "This article compares methods of **selling**. If you are **keeping the property and renting it out instead**, see [Owning a Japanese home while living abroad](/kaigai-owner) for withholding tax and tax representatives.",
    replace:
      "This article compares methods of **selling**. If you are **keeping the property and renting it out instead**, see [Owning a Japanese home while living abroad](/kaigai-owner) for withholding tax and tax representatives.\n\nIf you are **about to leave Japan and short on time**, see [Special Feature: Leaving Japan on Short Notice — Even With 30 Days Left, You Can Still Sell](/leaving-japan).",
    count: 1,
    marker: "(/leaving-japan)",
    label: "en 要約に /leaving-japan への導線を追加",
  },
];

/** 適用後スキャン用（含まれていなければ管理画面に「要確認」で出す） */
export const LEAVING_JAPAN_EXPECT_TERMS: { locale: string; term: string }[] = [
  { locale: "ja", term: "/leaving-japan" },
  { locale: "zh", term: "/leaving-japan" },
  { locale: "en", term: "/leaving-japan" },
];
