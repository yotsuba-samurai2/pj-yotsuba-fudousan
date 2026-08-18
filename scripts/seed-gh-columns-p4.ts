/**
 * グループホーム・コラムクラスタ P4（1本）投入スクリプト
 *
 * 対象＝luck428.com /legal/column（business=legal）。AI可視性定点 #22 の対策記事
 * 「東京都で障害者グループホームを開設するときの費用と補助金」。
 *
 * 一次確認（2026-08-18）：
 *   - 令和7年度の開設準備経費等補助＝1共同生活住居あたり309,000円・補助率3/4（前年参考）。
 *   - 2026-08-18現在、東京都「開設準備経費等補助事業」の公式書式ライブラリーで確認できる
 *     申請様式は令和7年度GH交付申請様式。令和8年度GH事業説明資料自体は公開済みだが、
 *     令和8年度の金額・補助率は同ライブラリーで確認できないため現年度額として記載しない。
 *   - 大田区＝東京都施設整備費補助を補完するGH整備費補助、足立区＝GH消防設備設置補助（別種類）。
 *   - 令和8年度も共同生活援助を対象に含む防災・減災、感染症対策の東京都補助を確認済み。
 *
 * カニバリ回避：東京都全域を主題とし、文京区スコープの
 * group-home-bunkyo-hojokin-seibi-unei と分担。開設費用の全体像は
 * group-home-kaisetsu-hiyo-zentaizo へ送出。
 *
 * 使い方:
 *   npx tsx scripts/seed-gh-columns-p4.ts            # dry-run（scripts/gh-columns-p4.preview.json）
 *   npx tsx scripts/seed-gh-columns-p4.ts --emit-ts  # src/lib/data/gh-columns-seed-p4.ts を生成
 *
 * 本番投入は /admin/columns/seed-gh-p4（管理者セッション経由・冪等upsert）を正とする。
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

type Faq = { question: string; answer: string };

type SeedColumn = {
  business: "legal";
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  status: "published";
  author: { name: string; title: string };
  keywords: string[];
  tags: string[];
  locales: string[];
  faq: Faq[];
};

const AUTHOR = {
  name: "浦松 丈二",
  title: "行政書士・宅地建物取引士（四葉行政書士事務所／四葉不動産株式会社）",
} as const;

const CATEGORY = "グループホーム開設";
const DATE = "2026-08-18";

const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "一気通貫", "one-stop"];

const KNOWN_LIVE_SLUGS = [
  "group-home-kaisetsu-hiyo-zentaizo", // #16
  "group-home-bunkyo-hojokin-seibi-unei", // #17
];

const ARTICLE = {
  file: "24-group-home-tokyo-kaisetsu-hiyo-hojokin.md",
  slug: "group-home-tokyo-kaisetsu-hiyo-hojokin",
  title: "東京都で障害者グループホームを開設するときの費用と補助金──都の制度と区市町村独自制度の調べ方",
  excerpt:
    "東京都で障害者グループホームを開設するときの補助金を、開設準備・施設整備・特定目的・区市町村独自・運営開始後に分類。指定要件と補助要件の違い、営利法人の対象可否、大田区・足立区の例を整理します。",
  keywords: [
    "障害者グループホーム 開設 費用 補助金 東京都",
    "東京都 グループホーム 補助金",
    "障害者グループホーム 開設準備経費 補助",
    "東京都 グループホーム 施設整備費補助",
    "グループホーム 補助金 区市町村",
  ],
  tags: ["グループホーム", "東京都", "補助金", "開設準備", "施設整備"],
};

function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

function parseFaq(content: string, label: string): Faq[] {
  const m = content.match(/## よくある質問\n([\s\S]*?)(?=\n## |$)/);
  if (!m) throw new Error(`${label}: 「## よくある質問」節が見つかりません`);
  const faqs: Faq[] = [];
  const re = /\*\*Q\.\s*([\s\S]*?)\*\*\n(A\.\s*[\s\S]*?)(?=\n\*\*Q\.|\s*$)/g;
  let q: RegExpExecArray | null;
  while ((q = re.exec(m[1])) !== null) {
    faqs.push({
      question: toPlainText(q[1]),
      answer: toPlainText(q[2].replace(/^A\.\s*/, "")),
    });
  }
  if (faqs.length === 0) throw new Error(`${label}: FAQを1件もパースできません`);
  return faqs;
}

function buildColumn(): SeedColumn {
  const jaPath = resolve(process.cwd(), "scripts", "gh-columns", ARTICLE.file);
  const content = readFileSync(jaPath, "utf-8").trim();
  return {
    business: "legal",
    slug: ARTICLE.slug,
    title: ARTICLE.title,
    date: DATE,
    category: CATEGORY,
    excerpt: ARTICLE.excerpt,
    content,
    status: "published",
    author: { ...AUTHOR },
    keywords: [...ARTICLE.keywords],
    tags: [...ARTICLE.tags],
    locales: ["ja"],
    faq: parseFaq(content, ARTICLE.file),
  };
}

function verify(c: SeedColumn): string[] {
  const notes: string[] = [];
  if (!c.content.startsWith("**結論（先に要点）**：")) {
    notes.push("NG: ja が「**結論（先に要点）**：」で始まっていない");
  }
  if (c.faq.length < 4) notes.push(`WARN: FAQが${c.faq.length}件`);
  if (c.content.length < 1500) notes.push(`WARN: ja本文が短い（${c.content.length}字）`);
  const links = [...c.content.matchAll(/\]\(\/legal\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
  for (const l of links) {
    if (l !== c.slug && !KNOWN_LIVE_SLUGS.includes(l)) notes.push(`NG: ja → 不明slug ${l}`);
  }
  if (!c.content.includes("## この記事の出典（一次情報）")) notes.push("NG: ja に出典節なし");
  if (!c.content.includes("一般的な情報提供")) notes.push("NG: ja に判断留保なし");
  for (const w of FORBIDDEN_WORDS) {
    if ((c.content + c.excerpt).toLowerCase().includes(w.toLowerCase())) {
      notes.push(`NG: ja に禁止語「${w}」あり`);
    }
  }
  return notes;
}

function main() {
  const emitTs = process.argv.includes("--emit-ts");
  if (process.argv.includes("--write")) {
    console.error("--write は用意していません。本番投入は /admin/columns/seed-gh-p4 を正とします。");
    process.exit(1);
  }
  const col = buildColumn();
  const notes = verify(col);

  if (emitTs) {
    if (notes.some((n) => n.startsWith("NG"))) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(process.cwd(), "src/lib/data/gh-columns-seed-p4.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-gh-columns-p4.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/gh-columns/24-group-home-tokyo-kaisetsu-hiyo-hojokin.md。\n// 修正はmd側→再生成で行う。用途＝/admin/columns/seed-gh-p4 からの管理者セッション経由upsert。\n\nexport type GhSeedColumnP4 = {\n  business: "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const GH_COLUMNS_P4_SEED: GhSeedColumnP4[] = `;
    writeFileSync(out, header + JSON.stringify([col], null, 2) + ";\n");
    console.log(`emit-ts → ${out}（1本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "グループホーム・コラム P4（1本＝東京都GH開設費用・補助金）。投入は /admin/columns/seed-gh-p4。",
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    article: {
      slug: col.slug,
      title: col.title,
      faq: col.faq.length,
      contentChars: col.content.length,
    },
  };
  const out = resolve(process.cwd(), "scripts", "gh-columns-p4.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}`);
  console.log(preview.verification.join("\n"));
}

main();
