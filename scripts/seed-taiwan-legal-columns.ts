/**
 * 台湾×相続のコラム2本のシード再生成（2026-08-07 新設）。
 *
 * 原稿の正本＝scripts/taiwan-legal-columns/NN-<slug>.md（日本語本文）
 * 翻訳原稿＝scripts/taiwan-legal-columns/{en,zh-tw,zh}/NN-<slug>.md（定義済み記事のみ）
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

type Translation = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  faq?: Array<{ question: string; answer: string }>;
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

/** 翻訳原稿を持つ記事のみ translations を seed に載せる（無い記事は既存DB値を温存） */
const TRANSLATION_FILES: Record<string, Record<"en" | "zh-tw" | "zh", string>> = {
  "taiwan-inkan-shomei-isan-bunkatsu": {
    en: "en/02-taiwan-inkan-shomei-isan-bunkatsu.md",
    "zh-tw": "zh-tw/02-taiwan-inkan-shomei-isan-bunkatsu.md",
    zh: "zh/02-taiwan-inkan-shomei-isan-bunkatsu.md",
  },
};

function parseFrontmatter(raw: string, label: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${label}: frontmatterが見つかりません`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").trim();
  }
  for (const key of ["title", "excerpt", "category"]) {
    if (!meta[key]) throw new Error(`${label}: frontmatterに ${key} がありません`);
  }
  return { meta, body: m[2].trim() };
}

const FAQ_HEADINGS: Record<"en" | "zh-tw" | "zh", string> = {
  en: "FAQ",
  "zh-tw": "常見問題",
  zh: "常见问题",
};

function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

function parseFaq(content: string, file: string, heading: string): Array<{ question: string; answer: string }> {
  const m = content.match(new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`));
  if (!m) return [];
  const block = m[1];
  const faqs: Array<{ question: string; answer: string }> = [];
  const re = /\*\*Q\.\s*([\s\S]*?)\*\*\n(A\.\s*[\s\S]*?)(?=\n\*\*Q\.|\s*$)/g;
  let q: RegExpExecArray | null;
  while ((q = re.exec(block)) !== null) {
    faqs.push({
      question: toPlainText(q[1]),
      answer: toPlainText(q[2].replace(/^A\.\s*/, "")),
    });
  }
  return faqs;
}

function readTranslations(slug: string): Partial<Record<"en" | "zh-tw" | "zh", Translation>> | undefined {
  const files = TRANSLATION_FILES[slug];
  if (!files) return undefined;
  const result: Record<string, Translation> = {};
  for (const [locale, file] of Object.entries(files) as Array<["en" | "zh-tw" | "zh", string]>) {
    const p = join(MD_DIR, file);
    const { meta, body } = parseFrontmatter(readFileSync(p, "utf8"), file);
    result[locale] = {
      title: meta.title,
      excerpt: meta.excerpt,
      category: meta.category,
      content: body,
      faq: parseFaq(body, file, FAQ_HEADINGS[locale]),
    };
  }
  return result;
}

const sha = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

const entries = TAIWAN_LEGAL_COLUMNS_SEED.map((c) => {
  const file = FILES[c.slug];
  if (!file) throw new Error(`md の対応が未定義: ${c.slug}`);
  const content = readFileSync(join(MD_DIR, file), "utf8").trim();
  const changed = content !== c.content;
  console.log(
    `${c.slug}\n  md ${content.length}字 sha=${sha(content).slice(0, 12)}` +
      `\n  ts ${c.content.length}字 sha=${sha(c.content).slice(0, 12)}` +
      `\n  → ${changed ? "差分あり（--emit-ts で反映）" : "一致"}`,
  );
  const translations = readTranslations(c.slug);
  return translations ? { ...c, content, translations } : { ...c, content };
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
