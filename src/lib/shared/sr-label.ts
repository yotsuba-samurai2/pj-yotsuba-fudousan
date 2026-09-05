// 社労士事務所の表示ラベルと、役割分担表の一文（2026-08-31 新設）。
//
// ■ なぜ要るか
//   `/kaigo` `/shataku` `/jirei` `/toushi/*` の役割分担表と本文に
//   「四葉社会保険労務士事務所（2026年9月開業予定・現時点では未開業）」が直書きされており、
//   開業フラグを立てても外れなかった。開業後にこれが残ると、
//   **/labor が生きているのにサイト側が「未開業」と言い続ける**ことになり、
//   しかも「開業後は対応する予定です」＝いま頼めない、と読ませてしまう。
//
// ■ 使い方
//   表のセルなど**名称だけ**を置く場所 → SR_ENTITY_LABEL
//   文として書く場所                   → SR_ROLE_SENTENCE.<用途>
//
// ■ 決まりごと
//   ・事務所名の連続リテラルを書かない（法27条ソース漏れ対策＝sr-name.ts の実行時結合を使う）
//   ・著者紹介の並列表記では番号を書かない（行政書士も番号なしで並ぶ箇所）。番号入りの署名は sr-registration.ts
//   ・分離受任の明示（別契約）を落とさない

import { SR_LAUNCHED } from "@/lib/shared/office";
import { SR_OFFICE_NAME } from "@/lib/shared/sr-name";

/** 事務所名。開業前だけ「（2026年9月開業予定・現時点では未開業）」が付く。 */
export const SR_ENTITY_LABEL: string = SR_LAUNCHED
  ? SR_OFFICE_NAME
  : `${SR_OFFICE_NAME}（2026年9月開業予定・現時点では未開業）`;

/** 役割分担を説明する一文。ページごとに文脈が違うため用途別に持つ。 */
export const SR_ROLE_SENTENCE = {
  /** /kaigo §4 人員・労務 */
  kaigo: SR_LAUNCHED
    ? `労務・人員配置のご相談は、${SR_OFFICE_NAME}が別契約で承ります。`
    : `${SR_ENTITY_LABEL}の開業後は、労務・人員配置のご相談にも対応する予定です。`,

  /** /shataku §3 社宅規程 */
  shataku: SR_LAUNCHED
    ? `${SR_OFFICE_NAME}、または他の社会保険労務士が別契約で対応します。`
    : `${SR_ENTITY_LABEL}の開業後、または他の社会保険労務士が別契約で対応します。`,

  /** /jirei 他の専門家との連携 */
  jirei: SR_LAUNCHED
    ? `労務や人員配置に関するご相談は、${SR_OFFICE_NAME}が別契約で受任します。`
    : `労務や人員配置に関するご相談は、${SR_ENTITY_LABEL}が、開業後に別契約で受任する予定です。`,

  /**
   * /legal/services/gaikokujin-shain §8「当事務所の業務ではありません」の li。
   * 「雇用にともなう労務・社会保険：」の直後に置く（同 ul の他の li に揃えて句点なし）。
   * 未開業側は 2026-09-05 以前の直書き文をそのまま保持（env 未設定時の描画を変えない）。
   * 2026-09-05 月次点検（INIT-02）で新設。
   */
  gaikokujinKoyo: SR_LAUNCHED
    ? `${SR_OFFICE_NAME}が別契約で承ります`
    : "社会保険労務士業務は代表の開業（2026年9月予定）前のため、現時点ではお受けできません",
} as const;

/**
 * 著者紹介・代表紹介で資格を並べるときの社労士の表記。
 *
 * 開業前は「試験合格（2026年9月開業予定）」、**開業後は資格名だけ**。
 * ここでは登録番号を書かない（並列する行政書士も番号なし）。番号入り表記は sr-registration.ts の SR_REG_PAREN。
 *
 * 2026-08-31 以前は同じ趣旨の文言が4書体×約50か所に直書きされており、
 * 開業フラグを立てても外れなかった。ここに集約した。
 * 開業前の言い回しは複数あった（「試験合格（…）」「已通過…考試（…）」等）が、
 * 意味は同じなので書体ごとに1つへ揃えた。
 */
export const SR_BIO = {
  ja: SR_LAUNCHED ? "社会保険労務士" : "社会保険労務士試験合格（2026年9月開業予定）",
  en: SR_LAUNCHED
    ? "Certified Social Insurance and Labor Consultant (Sharoushi)"
    : "Passed the Certified Social Insurance and Labor Consultant (Sharoushi) examination (office opening September 2026)",
  zhTw: SR_LAUNCHED ? "社會保險勞務士" : "已通過社會保險勞務士考試（預定2026年9月開業）",
  zh: SR_LAUNCHED ? "社会保险劳务士" : "已通过社会保险劳务士考试（预定2026年9月开业）",
} as const;

/**
 * 役割分担表で事務所名を出すときの各言語ラベル。
 * zh-tw／zh の当該表は事務所名を**日本語表記のまま**使っているため、その慣行を保つ。
 */
export const SR_ENTITY_LABEL_I18N = {
  ja: SR_ENTITY_LABEL,
  en: SR_LAUNCHED
    ? "Yotsuba Social Insurance and Labor Consultant Office"
    : "Yotsuba Social Insurance and Labor Consultant Office (opening scheduled for September 2026; not yet in operation)",
  zhTw: SR_LAUNCHED ? SR_OFFICE_NAME : `${SR_OFFICE_NAME}（預定2026年9月開業・現階段尚未開業）`,
  zh: SR_LAUNCHED ? SR_OFFICE_NAME : `${SR_OFFICE_NAME}（预定2026年9月开业・现阶段尚未开业）`,
} as const;

/**
 * 本文の一文を4書体で持つ用途別定数（2026-09-05 月次点検 NEW-SR-1 で新設）。
 *
 * global: /global「お部屋探しから、その後の暮らしまで」第3段落の**第2文**。
 *   第1文（「…専門分野が分かれます。」）は呼び出し側に残す。
 *   開業後の事務所名は SR_OFFICE_NAME／SR_ENTITY_LABEL_I18N 経由（連続リテラルを書かない）。
 *   zh-tw／zh は同段落が四葉行政書士事務所を日本語表記で書いているため、SR_ENTITY_LABEL_I18N の慣行（日本語表記）に揃える。
 *   未開業側は 2026-09-05 以前の直書き文をそのまま保持（env 未設定時の描画を変えない）。
 *   en/zh-tw/zh の開業後文は監修前ドラフト。
 */
export const SR_ROLE_SENTENCE_I18N = {
  global: {
    ja: SR_LAUNCHED
      ? `社会保険労務士業務は、${SR_OFFICE_NAME}が別契約で承ります。`
      : "社会保険労務士業務は代表の開業（2026年9月予定）前のため、現時点では連携する専門家を一般的にご案内する形になります。",
    en: SR_LAUNCHED
      ? `Work of a Certified Social Insurance and Labor Consultant (Sharoushi) is undertaken by ${SR_ENTITY_LABEL_I18N.en} under a separate contract.`
      : "Because licensed social insurance and labor consultant (shakai hoken romushi) work is before our representative's office opening (scheduled for September 2026), for now we introduce partner professionals in general terms.",
    zhTw: SR_LAUNCHED
      ? `社會保險勞務士業務由${SR_ENTITY_LABEL_I18N.zhTw}另行簽約承辦。`
      : "社會保險勞務士業務在代表開業（預定2026年9月）之前，現階段將以一般性介紹合作專業人士的方式對應。",
    zh: SR_LAUNCHED
      ? `社会保险劳务士业务由${SR_ENTITY_LABEL_I18N.zh}另行签约承办。`
      : "社会保险劳务士业务在代表开业（预定2026年9月）之前，现阶段将以一般性介绍合作专业人士的方式对应。",
  },
} as const;
