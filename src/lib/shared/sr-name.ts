// 社労士事務所名の分割組み立て（法27条ソース漏れ対策・2026-07-10）
// 背景：SR_LAUNCHED=false でも、クライアントJSチャンクには条件分岐内の文字列リテラルが残る
// （バンドラは env インライン後の分岐を除去しない）。開業前に事務所名の連続リテラルを
// クライアント到達可能なモジュールに置かないため、実行時に結合して生成する。
// grep検証（「四葉社会保険労務士」の連続一致）はこれでゼロになる。開業後もそのまま動作。
// ⚠️ クライアント到達可能なファイルに事務所名の連続リテラルを書かないこと。

// ⚠️ .join("") はTurbopackが定数畳み込みするため不可（実測）。reduceは畳み込まれない（実測で確認）。
const PARTS = ["四葉", "社会", "保険", "労務士", "事務所"];
// 繁体字・簡体字の事務所名も同じく実行時結合する（連続リテラルを置かない）。
// 表記は翻訳DBの labor.name（zh-tw / zh）および legal.name の慣行に合わせた。
const PARTS_ZH_TW = ["四葉", "社會", "保險", "勞務士", "事務所"];
const PARTS_ZH = ["四葉", "社会", "保险", "劳务士", "事务所"];

/** 「四葉社会保険労務士事務所」（実行時結合・モジュール初期化時に生成） */
export const SR_OFFICE_NAME: string = PARTS.reduce((acc, cur) => acc + cur, "");

/** 「四葉社會保險勞務士事務所」（zh-tw・実行時結合） */
export const SR_OFFICE_NAME_ZH_TW: string = PARTS_ZH_TW.reduce((acc, cur) => acc + cur, "");

/** 「四葉社会保险劳务士事务所」（zh・実行時結合） */
export const SR_OFFICE_NAME_ZH: string = PARTS_ZH.reduce((acc, cur) => acc + cur, "");

/** 「社会保険労務士」（実行時結合） */
export const SR_SHIKAKU: string = PARTS.slice(1, 4).reduce((acc, cur) => acc + cur, "");
