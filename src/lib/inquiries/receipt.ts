import { randomInt } from "node:crypto";

/** 受付番号に使う文字（読み違えやすい 0・1・I・O を除いた32文字）。 */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * 受付番号（例：Y260924-7K3F）。日付は日本時間。重複は保存時の一意制約で検出して作り直す。
 * 個人を推測できる情報は含めない。
 */
export function generateReceiptNo(now = new Date(), random: (max: number) => number = randomInt) {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const ymd = jst.toISOString().slice(2, 10).replace(/-/g, "");
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += ALPHABET[random(ALPHABET.length)];
  return `Y${ymd}-${suffix}`;
}

export const RECEIPT_NO_PATTERN = /^Y\d{6}-[2-9A-HJ-NP-Z]{4}$/;
