// オンディスクの翻訳バックアップJSONの住所表記を正式表記へ正規化する（2026-07-20）。
// 本番DBの是正は /admin/translations/fix-nap-address で行う。本スクリプトは
// リポジトリ内バックアップを同一ロジック（normalizeNapAddress）で整合させ、repo全体の
// 非正式表記をゼロにするためのもの。
//
// 使い方: npx tsx scripts/fix-nap-backups.ts
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { normalizeNapAddress } from "../src/lib/data/nap-address-patches";

const FILES = [
  "scripts/backup/translations-ja.json",
  "scripts/backup/translations-en.json",
  "scripts/backup/translations-zh-tw.json",
  "scripts/backup/translations-zh.json",
  "_backup/20260710_translations/ja.json",
  "_backup/20260710_translations/en.json",
  "_backup/20260710_translations/zh-tw.json",
  "_backup/20260710_translations/zh.json",
];

// 生テキストへ正規化を適用（元のフォーマット・キー順を保持＝差分を住所文字列のみに限定）。
// 住所パターンは単一のstring値内に連続して現れ、JSON構造やエスケープ（\n等）とは重ならないため安全。
let totalFiles = 0;
for (const f of FILES) {
  if (!existsSync(f)) {
    console.log(`skip (not found): ${f}`);
    continue;
  }
  const raw = readFileSync(f, "utf8");
  const next = normalizeNapAddress(raw);
  if (next !== raw) {
    // 整合性チェック：正規化後もJSONとして妥当であること
    JSON.parse(next);
    writeFileSync(f, next, "utf8");
    totalFiles++;
    console.log(`fixed: ${f}`);
  } else {
    console.log(`no change: ${f}`);
  }
}
console.log(`\ntotal files fixed: ${totalFiles}`);
