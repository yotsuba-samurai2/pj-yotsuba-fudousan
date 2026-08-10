// 社会保険労務士 開業版パッチ（2026年9月1日／登録日に適用する）
//
// ■ なぜ別ファイルなのか
//   /admin/fix-sr-notation（sr-notation-patches.ts）は **from → to の一方向にしか
//   適用できない**（`cur !== p.from` ならスキップする実装）。
//   したがって「7月8日のパッチを逆に流す」ことはできない。開業版は別に用意する。
//
// ■ from の出どころ
//   2026-08-09 に **本番の翻訳ペイロードとHTMLから実測した現行値**。
//   sr-notation-patches.ts の `to` は**使っていない**。同ファイルの `to` は7月8日時点の
//   値であり、その後 7/10 のブランド統一パッチ・8/9 のコンプライアンスパッチで
//   上書きされているものがあるため、`from` の根拠にできない。
//
// ■ 適用画面
//   /admin/sr-launch （ドライラン → 差分確認 → 適用 の3段）
//
// ■ 登録番号
//   REGISTRATION_NUMBER が唯一の差し替え箇所。9月1日はここだけ書き換える。
//   プレースホルダーのままでは適用画面が実行を拒否する（sr-launch-patches.test.ts でも検査）。

import type { LangCode } from "@/config/languages";

/**
 * 社会保険労務士の登録番号。
 *
 * ★ 2026年9月1日（登録日）に、登録証で確認した**実数**へ差し替える。
 *   ここ1か所だけを直せば、下の全パッチに反映される。
 *
 * ★ 登録番号であって**試験合格番号ではない**。
 *   試験合格番号は「令和7年 第202500525号」。取り違えないこと。
 */
export const REGISTRATION_NUMBER = "【登録番号】";

/** プレースホルダーのままかどうか。true の間は適用してはならない。 */
export const IS_PLACEHOLDER = REGISTRATION_NUMBER.includes("【");

const N = REGISTRATION_NUMBER;

/** 翻訳データ：キー単位の全値置換（from照合・不一致はスキップ） */
export type SrLaunchTranslationPatch = {
  path: string;
  from: string;
  to: string;
  note?: string;
};

export const SR_LAUNCH_TRANSLATION_PATCHES: Record<
  LangCode,
  SrLaunchTranslationPatch[]
> = {
  ja: [
    {
      path: "representative.qualificationsRealestate",
      from: "宅地建物取引士・行政書士",
      to: "宅地建物取引士・行政書士・社会保険労務士",
      note: "不動産サイトの代表資格。宅建士を先頭に保つ",
    },
    {
      path: "representative.qualificationsLegal",
      from: "行政書士・宅地建物取引士",
      to: "行政書士・社会保険労務士・宅地建物取引士",
      note: "行政書士サイト。行政書士を先頭に保つ",
    },
    {
      path: "representative.qualificationsLabor",
      from: "行政書士・宅地建物取引士",
      to: "社会保険労務士・行政書士・宅地建物取引士",
      note: "社労士サイト。社労士を先頭に出す",
    },
    {
      path: "common.footer.laborRepRegistration",
      from: "社会保険労務士試験合格（2026年9月開業予定）",
      to: `社会保険労務士 登録番号第${N}号`,
    },
    {
      path: "representative.srExamNote",
      from: "社会保険労務士試験合格（2026年9月開業予定）",
      to: "",
      note: "未開業の注記。開業後は役目を終える。描画側は空文字なら非表示（TenantLayout・AboutPageContent とも `t(...) && (...)`）",
    },
  ],
  en: [
    {
      path: "representative.qualificationsRealestate",
      from: "Licensed Real Estate Transaction Specialist, Administrative Scrivener (Gyoseishoshi)",
      to: "Licensed Real Estate Transaction Specialist, Administrative Scrivener (Gyoseishoshi), Certified Social Insurance and Labor Consultant",
    },
    {
      path: "representative.qualificationsLegal",
      from: "Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist",
      to: "Administrative Scrivener (Gyoseishoshi), Certified Social Insurance and Labor Consultant, Licensed Real Estate Transaction Specialist",
    },
    {
      path: "representative.qualificationsLabor",
      from: "Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist",
      to: "Certified Social Insurance and Labor Consultant, Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist",
    },
    {
      path: "common.footer.laborRepRegistration",
      from: "Passed the Certified Social Insurance and Labor Consultant Examination (opening planned for September 2026)",
      to: `Certified Social Insurance and Labor Consultant, Registration No. ${N}`,
    },
    {
      path: "representative.srExamNote",
      from: "Passed the Certified Social Insurance and Labor Consultant Examination (opening planned for September 2026)",
      to: "",
    },
  ],
  "zh-tw": [
    {
      path: "representative.qualificationsRealestate",
      from: "不動產交易士・行政書士",
      to: "不動產交易士・行政書士・社會保險勞務士",
    },
    {
      path: "representative.qualificationsLegal",
      from: "行政書士・不動產交易士",
      to: "行政書士・社會保險勞務士・不動產交易士",
    },
    {
      path: "representative.qualificationsLabor",
      from: "行政書士・不動產交易士",
      to: "社會保險勞務士・行政書士・不動產交易士",
    },
    {
      path: "common.footer.laborRepRegistration",
      from: "社會保險勞務士考試合格（預定2026年9月開業）",
      to: `社會保險勞務士 登錄號第${N}號`,
    },
    {
      path: "representative.srExamNote",
      from: "社會保險勞務士考試合格（預定2026年9月開業）",
      to: "",
    },
  ],
  zh: [
    {
      path: "representative.qualificationsRealestate",
      from: "不动产交易士・行政书士",
      to: "不动产交易士・行政书士・社会保险劳务士",
    },
    {
      path: "representative.qualificationsLegal",
      from: "行政书士・不动产交易士",
      to: "行政书士・社会保险劳务士・不动产交易士",
    },
    {
      path: "representative.qualificationsLabor",
      from: "行政书士・不动产交易士",
      to: "社会保险劳务士・行政书士・不动产交易士",
    },
    {
      path: "common.footer.laborRepRegistration",
      from: "社会保险劳务士考试合格（预定2026年9月开业）",
      to: `社会保险劳务士 登录号第${N}号`,
    },
    {
      path: "representative.srExamNote",
      from: "社会保险劳务士考试合格（预定2026年9月开业）",
      to: "",
    },
  ],
};

/**
 * コラム本文の部分置換パッチ（slug "*" ＝全コラム）。
 *
 * ★ 適用は配列順。**長い語句を先に置くこと。**
 *   先に「社会保険労務士試験合格」を処理すると、
 *   「社会保険労務士試験合格・2026年9月開業予定」のような複合形を拾えなくなる。
 *
 * ★ 4書体すべてを列挙すること。日本語だけを見ると必ず取りこぼす
 *   （2026年8月に同じ失敗を3回している。正本スキル 第13条）。
 */
export type SrLaunchColumnPatch = { from: string; to: string; note?: string };

export const SR_LAUNCH_COLUMN_PATCHES: SrLaunchColumnPatch[] = [
  // ── 長い複合形を先に ──────────────────────────────
  {
    from: "四葉社会保険労務士事務所は2026年9月開業予定・現時点では未開業",
    to: `四葉社会保険労務士事務所（登録番号第${N}号）`,
    note: "/column/kikoku-karikage-shataku-shain 等の本文",
  },
  {
    from: "四葉社会保険労務士事務所（預定2026年9月開業・現階段尚未開業）",
    to: `四葉社会保険労務士事務所（登錄號第${N}號）`,
    note: "zh-tw。事務所名が日本語表記のままである点は現状維持",
  },
  {
    from: "四葉社会保険労務士事務所（预定2026年9月开业・现阶段尚未开业）",
    to: `四葉社会保険労務士事務所（登录号第${N}号）`,
  },
  {
    from: "社会保険労務士業務は2026年9月の開業までお受けできません",
    to: "社会保険労務士業務は四葉社会保険労務士事務所が別契約で承ります",
    note: "「お受けできません」は開業後は誤り。CannotHandle 相当の文言がコラムにも入っている",
  },
  {
    from: "社會保險勞務士（日本語：社会保険労務士）業務在2026年9月開業之前無法受理",
    to: "社會保險勞務士（日本語：社会保険労務士）業務由四葉社会保険労務士事務所另行簽約承辦",
  },
  {
    from: "社会保险劳务士（日本語：社会保険労務士）业务在2026年9月开业之前无法受理",
    to: "社会保险劳务士（日本語：社会保険労務士）业务由四葉社会保険労務士事務所另行签约承办",
  },
  {
    from: "社会保険労務士試験合格・2026年9月開業予定",
    to: `社会保険労務士・登録番号第${N}号`,
    note: "著者紹介の中黒つなぎ形",
  },
  {
    from: "社會保險勞務士考試合格・預定2026年9月開業",
    to: `社會保險勞務士・登錄號第${N}號`,
  },
  {
    from: "社会保险劳务士考试合格・预定2026年9月开业",
    to: `社会保险劳务士・登录号第${N}号`,
  },
  {
    from: "登録番号 第25087022号、社会保険労務士試験合格（2026年9月開業予定）",
    to: `登録番号 第25087022号、社会保険労務士 登録番号第${N}号`,
  },
  {
    from: "登錄號　第25087022號、社會保險勞務士考試合格（預定2026年9月開業）",
    to: `登錄號　第25087022號、社會保險勞務士 登錄號第${N}號`,
  },
  {
    from: "登录号 第25087022号、社会保险劳务士考试合格（预定2026年9月开业）",
    to: `登录号 第25087022号、社会保险劳务士 登录号第${N}号`,
  },
  {
    from: "已通過社會保險勞務士考試（預定2026年9月開業）",
    to: `社會保險勞務士（登錄號第${N}號）`,
  },
  {
    from: "已通过社会保险劳务士考试（预定2026年9月开业）",
    to: `社会保险劳务士（登录号第${N}号）`,
  },
  {
    from: "Passed the Certified Social Insurance and Labor Consultant Examination (office opening September 2026)",
    to: `Certified Social Insurance and Labor Consultant (Registration No. ${N})`,
  },
  {
    from: "Certified Social Insurance and Labor Consultant Examination (office opening September 2026)",
    to: `Certified Social Insurance and Labor Consultant (Registration No. ${N})`,
  },
  // ── ★ 語順違い。完全一致だと落とすため個別に置く ──────────
  {
    from: "社會保險勞務士考試合格（2026年9月開業預定）",
    to: `社會保險勞務士（登錄號第${N}號）`,
    note: "★ /zh-tw/leaving-japan だけ語順が違う（他は「預定2026年9月開業」）。2026-08-09 実測",
  },
  // ── 一般形（最後に置く）─────────────────────────────
  {
    from: "社会保険労務士試験合格（2026年9月開業予定）",
    to: `社会保険労務士（登録番号第${N}号）`,
  },
  {
    from: "社會保險勞務士考試合格（預定2026年9月開業）",
    to: `社會保險勞務士（登錄號第${N}號）`,
  },
  {
    from: "社会保险劳务士考试合格（预定2026年9月开业）",
    to: `社会保险劳务士（登录号第${N}号）`,
  },
];

/**
 * 適用後スキャン用。**0件になること**を確認する。
 * 4書体すべてを入れる（正本スキル 第13条）。
 */
export const SR_LAUNCH_SCAN_TERMS: string[] = [
  // ja
  "2026年9月開業予定",
  "2026年9月開業",
  "開業までお受け",
  "社会保険労務士試験合格",
  // zh-tw
  "預定2026年9月開業",
  "2026年9月開業預定",
  "社會保險勞務士考試合格",
  "尚未開業",
  "無法受理",
  // zh
  "预定2026年9月开业",
  "社会保险劳务士考试合格",
  "尚未开业",
  "无法受理",
  // en
  "opening September 2026",
  "opening planned for September 2026",
  "scheduled to open",
  // プレースホルダー
  "【登録番号】",
];

/**
 * ★ 残すもの（**置換してはいけない**）。
 * ドライラン画面でも警告として表示する。
 */
export const SR_LAUNCH_KEEP_AS_IS: string[] = [
  "令和7年10月 社会保険労務士試験合格", // /about/uramatsu の経歴年表＝事実の記録
  "令和7年 第202500525号", // 試験合格番号。hasCredential は 9/1 に別途差し替える
];
