// NAP住所（四葉不動産・各事務所）の表示表記を正式表記へ正規化する（2026-07-20 浦松承認）。
//
// 正式表記：
//   小日向４丁目２－５ 小日向安田ビル ２０３
//   - ダッシュは全角ハイフンマイナス「－」(U+FF0D)
//   - 番地とビル名の間、ビル名と部屋番号の間にそれぞれ半角スペース
//   street単独：小日向４丁目２－５／building単独：小日向安田ビル ２０３
//
// 背景：JSON-LD（seo.ts / office.ts）は既に正式表記だが、表示側UI翻訳（DB translationテーブル）に
// 変種が残存していた（ダッシュ U+2212「−」・スペース欠落・半角数字・labor「2F」）。
//
// 方針：
//  - 住所文字列を「その場で」正規化し、前後の〒・都道府県・改行等は保持する。
//  - アンカー（小日向◯丁目／小日向安田ビル／Kohinata Yasuda Bldg.）に一致する箇所のみ置換するため、
//    「小日向・茗荷谷駅…」等の近隣地名の言及（住所ではない）は一切変更しない。
//  - 英語（ローマ字）は表記を維持し、labor「2F」→「203」の号数統一のみ行う（浦松決定）。

/** 正式表記の定数（参照・スキャン・テスト用） */
export const NAP_OFFICIAL = {
  streetJa: "小日向４丁目２－５",
  buildingJa: "小日向安田ビル ２０３",
  buildingEn: "Kohinata Yasuda Bldg. 203",
} as const;

// 半角/全角スペース（0個以上）
const SP = "[ \\u3000]*";
// ダッシュ類（ハイフン・マイナス記号・各種ダッシュ・全角ハイフンマイナス）
const DASH = "[-\\u2010\\u2011\\u2012\\u2013\\u2014\\u2015\\u2212\\uFF0D]";

// 1) 日本語の番地：小日向４丁目２－５（半角/全角数字・各種ダッシュを吸収）
const JP_STREET = new RegExp(
  `小日向${SP}[4４]${SP}丁目${SP}[2２]${SP}${DASH}${SP}[5５]`,
  "g",
);
// 2) 日本語のビル名＋号数：203/２０３/2F/２Ｆ をすべて「小日向安田ビル ２０３」に統一
const JP_BUILDING = new RegExp(
  `小日向安田ビル${SP}(?:２０３|203|２Ｆ|2Ｆ|２F|2F)`,
  "g",
);
// 3) 英語ビル名の号数統一（labor「2F」→「203」。ローマ字表記は維持）
const EN_BUILDING_2F = /Kohinata Yasuda Bldg\.\s*2F\b/g;

/** 単一文字列をNAP正式表記へ正規化（住所以外・近隣地名の言及は不変） */
export function normalizeNapAddress(s: string): string {
  if (typeof s !== "string") return s;
  return s
    .replace(JP_STREET, NAP_OFFICIAL.streetJa)
    .replace(JP_BUILDING, NAP_OFFICIAL.buildingJa)
    .replace(EN_BUILDING_2F, NAP_OFFICIAL.buildingEn);
}

/** 正規化後に残ってはならない変種（残存スキャン用・部分文字列の完全一致） */
export const NAP_BAD_VARIANTS: readonly string[] = [
  "小日向安田ビル２０３", // スペース欠落（全角数字）
  "小日向安田ビル203", // スペース欠落（半角数字）
  "小日向安田ビル 203", // 半角数字（→全角へ）
  "小日向安田ビル2F",
  "小日向安田ビル 2F",
  "小日向４丁目２−５", // ダッシュ U+2212
  "小日向４丁目２‐５", // ダッシュ U+2010
  "小日向4丁目2−5",
  "小日向4丁目2-5",
  "Kohinata Yasuda Bldg. 2F",
] as const;
