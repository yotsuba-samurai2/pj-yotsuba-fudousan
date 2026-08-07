/**
 * 台湾×相続の日本語コラム2本のシード再生成（2026-08-07 新設）。
 *
 * 原稿の正本＝scripts/taiwan-legal-columns/NN-<slug>.md（本文markdownのみ）
 * メタ情報＝本ファイル下部の META（title / date / category / excerpt / author / keywords / locales）
 *
 * 使い方：
 *   npx tsx scripts/seed-taiwan-legal-columns.ts --emit-ts
 *     → src/lib/data/taiwan-legal-columns-seed.ts を再生成する
 *   npx tsx scripts/seed-taiwan-legal-columns.ts
 *     → 差分の確認のみ（本文の字数とSHA-256を表示）
 *
 * 投入は /admin/columns/seed-taiwan-legal から（このスクリプトはDBに書き込まない）。
 *
 * 【経緯】この2本は管理画面から直接作られたFirestore専用ページで、リポジトリに実体が無かった。
 * 定点#19 が引用するのが除戸謄本のコラムで、改善したくてもPRで直せない状態だったため、
 * 本番の現行本文をSHA-256照合つきで書き出してmd化した。
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Meta = {
  file: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  author: { name: string; title: string };
  keywords: string[];
  locales: ("ja" | "en" | "zh-tw" | "zh")[];
};

const ROOT = process.cwd();
const MD_DIR = join(ROOT, "scripts/taiwan-legal-columns");
const OUT = join(ROOT, "src/lib/data/taiwan-legal-columns-seed.ts");

// 既存のシードからメタ情報を読み、mdの本文だけを差し替える方式にする。
// （メタを二重管理しないため。メタを変えるときは taiwan-legal-columns-seed.ts を直接編集し、
//   本文を変えるときは md を編集してこのスクリプトを流す）
import { TAIWAN_LEGAL_COLUMNS_SEED } from "../src/lib/data/taiwan-legal-columns-seed";

const FILES: Record<string, string> = {
  "taiwan-koseki-jokoseki-shutoku": "01-taiwan-koseki-jokoseki-shutoku.md",
  "taiwan-inkan-shomei-isan-bunkatsu": "02-taiwan-inkan-shomei-isan-bunkatsu.md",
};

const sha = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

const entries = TAIWAN_LEGAL_COLUMNS_SEED.map((c) => {
  const file = FILES[c.slug];
  if (!file) throw new Error(`md の対応が未定義: ${c.slug}`);
  const content = readFileSync(join(MD_DIR, file), "utf8");
  const changed = content !== c.content;
  console.log(
    `${c.slug}\n  md ${content.length}字 sha=${sha(content).slice(0, 12)}` +
      `\n  ts ${c.content.length}字 sha=${sha(c.content).slice(0, 12)}` +
      `\n  → ${changed ? "差分あり（--emit-ts で反映）" : "一致"}`,
  );
  return { ...c, content };
});

if (process.argv.includes("--emit-ts")) {
  const src = readFileSync(OUT, "utf8");
  const marker = "export const TAIWAN_LEGAL_COLUMNS_SEED: TaiwanLegalSeedColumn[] = ";
  const head = src.slice(0, src.indexOf(marker) + marker.length);
  writeFileSync(OUT, head + JSON.stringify(entries, null, 2) + ";\n", "utf8");
  console.log(`\nemit-ts → ${OUT}（${entries.length}本）`);
} else {
  console.log("\n（--emit-ts を付けると src/lib/data/taiwan-legal-columns-seed.ts を再生成します）");
}

export type { Meta };
