// 社会保険労務士の登録番号（正本・1か所）
//
// 2026-09-01 に登録証（全国社会保険労務士会連合会）が到着し、実数を確認した。
//   登録番号：第13260359号
//   登録年月日：令和8年（2026年）9月1日
//
// ★ 試験合格番号（令和7年 第202500525号）とは別物。取り違えないこと。
//   （sr-credential.test.ts が identifier に試験合格番号が混ざっていないことを検査する）
// ★ この番号を出す場所は、すべてここを参照する。数字を直書きしない。
//   seo.ts（PERSON_JSONLD・BUSINESS_SEO.labor）／sr-launch-patches.ts／
//   labor-office-info-patches.ts／labor 各ページの署名／reasons／llms.txt
// ★ 開業前の「連続リテラル禁止」（sr-strip.ts）は SR_LAUNCHED=true の今は該当しない。

/** 登録番号（数字のみ） */
export const SR_REGISTRATION_NUMBER = "13260359";

/** 登録年月日（ISO） */
export const SR_REGISTRATION_DATE = "2026-09-01";

/** 「第◯号」形＝JSON-LD の identifier・事務所概要の値に使う */
export const SR_REGISTRATION_ID = `第${SR_REGISTRATION_NUMBER}号`;

/**
 * 名称の直後に付ける括弧書き（4書体）。
 * 例：「社会保険労務士（登録番号 第13260359号）・行政書士（登録番号 第25087022号）」
 * 行政書士の既存表記「（登録番号 第25087022号）」と同じ体裁に揃える。
 */
export const SR_REG_PAREN = {
  ja: `（登録番号 ${SR_REGISTRATION_ID}）`,
  en: ` (Registration No. ${SR_REGISTRATION_NUMBER})`,
  zhTw: `（登錄號 第${SR_REGISTRATION_NUMBER}號）`,
  zh: `（登录号 第${SR_REGISTRATION_NUMBER}号）`,
} as const;

/** LangCode（"zh-tw"）から SR_REG_PAREN のキーへ */
export function srRegParen(locale: string): string {
  switch (locale) {
    case "en":
      return SR_REG_PAREN.en;
    case "zh-tw":
      return SR_REG_PAREN.zhTw;
    case "zh":
      return SR_REG_PAREN.zh;
    default:
      return SR_REG_PAREN.ja;
  }
}
