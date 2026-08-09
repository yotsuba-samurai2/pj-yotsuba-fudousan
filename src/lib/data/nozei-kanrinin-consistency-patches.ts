// 既存コラム /column/overseas-owners-guide-japan-real-estate-sale の是正差分
// （2026-08-09 浦松決定「納税管理人には四葉は就任せず、税理士におつなぎする」の反映）。
//
// 【なぜ必要か】同日公開した離日売却クラスタ7本と特集 /leaving-japan は
//   「納税管理人には税理士におつなぎします」に統一済み。しかし本コラムだけが
//   「納税管理人サービス｜行政書士として直接就任」のまま残っており、
//   **公開中のページ同士で食い違っている**。
//   あわせて「提携税理士」「SAMURAI税理士ネットワーク連携」も是正する
//   （計画v2 禁止事項／2026-07-29 浦松指示・指示書11）。
//
// 【方式】本文の正典は Supabase Postgres の Column（ja＝content・他は
//   translations.<locale>.content）。リポジトリにファイルが無いため、
//   fix-kaigai-owner-crosslink と同じ「現在値と find を照合し、出現数が一致した
//   ときだけ置換」方式で当てる。marker で適用済みを判定し、重複挿入を防ぐ。
//
// 【find の出所】2026-08-09 に本番4ロケールから実測して採取した。
//
// 【スコープ外（要判断のまま）】事実4の「e-Taxが利用できない非居住者にとって」。
//   国税庁 A1-7 は納税管理人届出書の e-Tax 提出を標準の方法として案内しており
//   誤読を招くおそれがあるが、文中の読点の全角/半角がロケールにより揺れており
//   誤爆リスクがあるため今回は当てない。別途 浦松の判断で。

export type ColumnTextPatch = {
  /** 値のパス。ja は "content"、他は "translations.<locale>.content" */
  path: string;
  /** 現在値に対する部分一致文字列。出現回数が count と一致したときのみ置換する */
  find: string;
  replace: string;
  count: number;
  /** 適用後にだけ存在する一意な文字列。重複適用の防止に使う */
  marker: string;
  label: string;
};

export const OVERSEAS_GUIDE_SLUG =
  "overseas-owners-guide-japan-real-estate-sale";

export const NOZEI_KANRININ_CONSISTENCY_PATCHES: ColumnTextPatch[] = [
  // ───────── ja ─────────
  {
    path: "content",
    find: "行政書士として直接就任",
    replace:
      "税理士におつなぎします（ご本人と直接ご契約。当社は紹介料を受け取りません）",
    count: 1,
    marker: "税理士におつなぎします（ご本人と直接ご契約。当社は紹介料を受け取りません）",
    label: "ja ①「納税管理人サービス｜行政書士として直接就任」を是正",
  },
  {
    path: "content",
    find: "SAMURAI税理士ネットワーク連携",
    replace: "税理士におつなぎします（ご本人と直接ご契約）",
    count: 1,
    marker: "税理士におつなぎします（ご本人と直接ご契約）",
    label: "ja ②「確定申告サポート｜SAMURAI税理士ネットワーク連携」を是正",
  },
  {
    path: "content",
    find: "四葉不動産＋提携税理士",
    replace: "四葉不動産＋税理士",
    count: 1,
    marker: "四葉不動産＋税理士",
    label: "ja ③ 比較表の見出しから「提携」を外す",
  },
  {
    path: "content",
    find: "申告は提携税理士と",
    replace: "納税管理人と申告は税理士におつなぎし、ご本人と",
    count: 1,
    marker: "納税管理人と申告は税理士におつなぎし、ご本人と",
    label: "ja ④ 比較表の説明から「提携」を外す",
  },

  // ───────── en ─────────
  {
    path: "translations.en.content",
    find: "Administrative Scrivener serves directly",
    replace:
      "We introduce you to a licensed tax accountant (direct contract with you; we receive no referral fee)",
    count: 1,
    marker: "we receive no referral fee)",
    label: "en ①「Tax Representative service｜Administrative Scrivener serves directly」を是正",
  },
  {
    path: "translations.en.content",
    find: "In coordination with SAMURAI tax accountant network",
    replace:
      "We introduce you to a licensed tax accountant (direct contract with you)",
    count: 1,
    marker: "We introduce you to a licensed tax accountant (direct contract with you)",
    label: "en ② 確定申告サポートの記述を是正",
  },
  {
    path: "translations.en.content",
    find: "Yotsuba Real Estate + partner tax accountant",
    replace: "Yotsuba Real Estate + a licensed tax accountant",
    count: 1,
    marker: "Yotsuba Real Estate + a licensed tax accountant",
    label: "en ③ 比較表の見出しから partner を外す",
  },
  {
    path: "translations.en.content",
    find: "direct contract with the partner tax accountant",
    replace:
      "direct contract with a licensed tax accountant, who also acts as your Tax Representative",
    count: 1,
    marker: "who also acts as your Tax Representative",
    label: "en ④ 比較表の説明から partner を外す",
  },

  // ───────── zh-tw ─────────
  {
    path: "translations.zh-tw.content",
    find: "由行政書士直接擔任",
    replace: "為您介紹稅理士擔任（由您直接簽約，本公司不收介紹費）",
    count: 1,
    marker: "為您介紹稅理士擔任（由您直接簽約，本公司不收介紹費）",
    label: "zh-tw ①「納稅管理人服務｜由行政書士直接擔任」を是正",
  },
  {
    path: "translations.zh-tw.content",
    find: "SAMURAI稅理士網絡聯動",
    replace: "為您介紹稅理士（由您直接簽約）",
    count: 1,
    marker: "為您介紹稅理士（由您直接簽約）",
    label: "zh-tw ② 確定申告支援の記述を是正",
  },
  {
    path: "translations.zh-tw.content",
    find: "四葉不動產＋合作稅理士",
    replace: "四葉不動產＋稅理士",
    count: 1,
    marker: "四葉不動產＋稅理士",
    label: "zh-tw ③ 比較表の見出しから「合作」を外す",
  },
  {
    path: "translations.zh-tw.content",
    find: "與合作稅理士",
    replace: "納稅管理人與申報則由我們為您介紹稅理士，並與其",
    count: 1,
    marker: "納稅管理人與申報則由我們為您介紹稅理士，並與其",
    label: "zh-tw ④ 比較表の説明から「合作」を外す",
  },

  // ───────── zh ─────────
  {
    path: "translations.zh.content",
    find: "由行政书士直接担任",
    replace: "为您介绍税理士担任（由您直接签约，本公司不收介绍费）",
    count: 1,
    marker: "为您介绍税理士担任（由您直接签约，本公司不收介绍费）",
    label: "zh ①「纳税管理人服务｜由行政书士直接担任」を是正",
  },
  {
    path: "translations.zh.content",
    find: "SAMURAI税理士网络联动",
    replace: "为您介绍税理士（由您直接签约）",
    count: 1,
    marker: "为您介绍税理士（由您直接签约）",
    label: "zh ② 确定申告支援の記述を是正",
  },
  {
    path: "translations.zh.content",
    find: "四叶不动产＋合作税理士",
    replace: "四叶不动产＋税理士",
    count: 1,
    marker: "四叶不动产＋税理士",
    label: "zh ③ 比較表の見出しから「合作」を外す",
  },
  {
    path: "translations.zh.content",
    find: "与合作税理士",
    replace: "纳税管理人与申报则由我们为您介绍税理士，并与其",
    count: 1,
    marker: "纳税管理人与申报则由我们为您介绍税理士，并与其",
    label: "zh ④ 比較表の説明から「合作」を外す",
  },
];

/** 適用後に本文へ残っていてはいけない語（報告のみ・自動置換しない） */
export const FORBIDDEN_TERMS = [
  "行政書士として直接就任",
  "提携税理士",
  "提携司法書士",
  "SAMURAI税理士ネットワーク",
  "由行政書士直接擔任",
  "由行政书士直接担任",
  "合作稅理士",
  "合作税理士",
  "partner tax accountant",
  "Administrative Scrivener serves directly",
];
