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
//   ・開業後も**登録番号は書かない**（交付は2026年9月下旬・yotsuba-sharoushi-kaigyo 第14条）
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
} as const;

/**
 * 著者紹介・代表紹介で資格を並べるときの社労士の表記。
 *
 * 開業前は「試験合格（2026年9月開業予定）」、**開業後は資格名だけ**。
 * 登録番号は書かない（交付は2026年9月下旬・yotsuba-sharoushi-kaigyo 第14条）。
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
