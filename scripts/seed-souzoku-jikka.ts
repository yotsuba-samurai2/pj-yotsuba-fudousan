/**
 * 定点#25「相続した空き家 賃貸に出すか売るか 判断基準」対策の投入スクリプト（1本）
 *
 * 対象＝ realestate / souzoku-jikka-uru-nokosu（既存ページの強化。新規ページは作らない。
 * luck428-column-seo 第2条＝着手前にサイトマップで既存を洗う。本ページはサイトマップに実在）。
 *
 * 【本スクリプトを分けた理由】
 *   本コラムはリポジトリのシードに存在せず（管理画面から直接作成）、コード側に本文が無かった。
 *   改稿前の現行値は scripts/backup/column-souzoku-jikka-uru-nokosu-2026-08-05.json に退避済み。
 *   既存の seed-realestate-columns.ts に相乗りすると、投入ページを押した際に無関係な他コラムまで
 *   一括上書きされる。本タスクで触れる1本だけを upsert する専用ページに分離し、巻き添え更新を避ける
 *   （PR #166 の seed-akiya-gh-tenyo と同じ増分パターン）。
 *
 * 【メタデータの扱い】
 *   upsert は未指定フィールドを触らないが、渡したフィールドはDB値を上書きする。
 *   そのため title / date / category / excerpt / status / author / tags / locales は
 *   退避した現行値をそのまま転記している（verify() が退避JSONと機械照合する）。
 *   意図した変更は次の3点のみ：
 *     - content：直答ブロック・判断基準の表・FAQ節・出典の追記（既存の段落は削らない）
 *     - keywords：設問語2件を追加（既存6件は保持）
 *     - faq：未設定→6件（FAQPage JSON-LD が出るようになる）
 *     - modifiedDate：未設定→2026-08-05（改稿日。BlogPosting の dateModified に反映）
 *
 * 使い方:
 *   npx tsx scripts/seed-souzoku-jikka.ts            # dry-run（preview JSON を出力・DB接続なし）
 *   npx tsx scripts/seed-souzoku-jikka.ts --emit-ts  # src/lib/data/souzoku-jikka-seed.ts を生成
 *   npx tsx scripts/seed-souzoku-jikka.ts --write    # DATABASE_URL/DIRECT_URL を設定して直接upsert
 *
 * 本番反映は、本番環境変数がSensitive設定で env pull できないため
 * /admin/columns/seed-souzoku-jikka からの管理者セッション経由投入を正とする。
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

type Faq = { question: string; answer: string };

type SeedColumn = {
  business: "realestate";
  slug: string;
  title: string;
  date: string;
  modifiedDate: string;
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

const SLUG = "souzoku-jikka-uru-nokosu";
const BACKUP = `backup/column-${SLUG}-2026-08-05.json`;

/** 表示コンプライアンス上の禁止語（本コラムに固有名詞での例外は存在しない） */
const FORBIDDEN_WORDS = [
  "ワンストップ",
  "一括受任",
  "まとめて契約",
  "一括サポート",
  "一括対応",
  "一気通貫",
  "一体で",
  "one-stop",
  "街の不動産屋",
];

/** 設問語（定点#25「相続した空き家 賃貸に出すか売るか 判断基準」）。本文に最低1回は出ること */
const REQUIRED_TERMS = ["判断基準", "賃貸に出す", "どちらが", "売るか", "相続した空き家"];

/** 評価を集約する方向の内部リンク（luck428-column-seo 第6条5） */
const REQUIRED_LINKS = [
  "https://luck428.com/souzoku",
  "https://luck428.com/souzoku/akiya",
  "https://luck428.com/column/akiya-3000man-kojo-gyakusan",
];

const META: Omit<SeedColumn, "content" | "faq"> = {
  business: "realestate",
  slug: SLUG,
  // ↓ title / date / category / excerpt / status / author / tags / locales は退避した現行DB値の転記（変更しない）
  title: "相続した実家は、売るべきか残すべきか──そろばんの外側にある「感情という壁」",
  date: "2026-07-19",
  // ↓ 改稿日。現行値は未設定（null）
  modifiedDate: "2026-08-05",
  category: "相続",
  excerpt:
    "母から相続した一戸建てを、なかなか売れずに維持し続けた私自身の経験から。相続した実家を売るか残すかは、損得のそろばん勘定だけでは割り切れず、「感情」というやっかいな壁が立ちはだかります。相続登記の義務化や、被相続人の居住用財産（空き家）の3,000万円特別控除など、判断を急ぐ前に知っておきたい公的制度もあわせて整理しました。四葉不動産は「売る・残す・貸す」の判断そのものをお手伝いします。",
  status: "published",
  author: {
    name: "浦松 丈二",
    title: "四葉不動産株式会社 代表取締役／行政書士・宅建士",
  },
  keywords: [
    "相続した実家",
    "実家 売却 残す",
    "空き家 3000万円特別控除",
    "相続登記 義務化",
    "文京区 相続相談",
    "相続 判断",
    // ↓ 定点#25 の設問語（追加分）
    "相続した空き家 賃貸に出すか売るか 判断基準",
    "空き家 貸すか売るか どちらが",
  ],
  tags: ["相続", "実家", "空き家", "相続登記", "譲渡所得", "文京区"],
  locales: ["ja"],
};

/** 退避した改稿前スナップショット（現行DB値） */
type Backup = {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  status: string;
  author: { name: string; title: string };
  keywords: string[];
  tags: string[];
  locales: string[];
  faq: unknown;
  modifiedDate: unknown;
};

function loadBackup(): Backup {
  return JSON.parse(readFileSync(resolve(__dirname, BACKUP), "utf-8")) as Backup;
}

/** Markdownリンク・強調を平文化（FAQ JSON-LD用。本文には適用しない） */
function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

/** 「## よくある質問」節から **Q. …** / A. … の組をパースする */
function parseFaq(content: string, file: string): Faq[] {
  const m = content.match(/## よくある質問(?:（FAQ）)?\n([\s\S]*?)(?=\n## |\n---|$)/);
  if (!m) throw new Error(`${file}: 「## よくある質問」節が見つかりません`);
  const faqs: Faq[] = [];
  const re = /\*\*Q\.\s*([\s\S]*?)\*\*\s*\n+\s*(A\.\s*[\s\S]*?)(?=\n\s*\*\*Q\.|\s*$)/g;
  let q: RegExpExecArray | null;
  while ((q = re.exec(m[1])) !== null) {
    faqs.push({
      question: toPlainText(q[1]),
      answer: toPlainText(q[2].replace(/^A\.\s*/, "")),
    });
  }
  if (faqs.length === 0) throw new Error(`${file}: FAQを1件もパースできません`);
  return faqs;
}

function buildColumn(): SeedColumn {
  const file = "souzoku-columns/souzoku-jikka-uru-nokosu.md";
  const content = readFileSync(resolve(__dirname, file), "utf-8").trim();
  return { ...META, content, faq: parseFaq(content, file) };
}

/**
 * 退避スナップショットとの機械照合。
 * 公開中の記事をシード化する過程で、意図しないメタデータ変更や本文の欠落が起きないことを検査する。
 */
function verifyAgainstBackup(c: SeedColumn, b: Backup): string[] {
  const notes: string[] = [];
  const same = (k: string, a: unknown, x: unknown) => {
    if (JSON.stringify(a) !== JSON.stringify(x)) {
      notes.push(`NG: ${k} が退避値と一致しない（意図した変更は content/keywords/faq/modifiedDate のみ）`);
    }
  };
  same("title", c.title, b.title);
  same("date", c.date, b.date);
  same("category", c.category, b.category);
  same("excerpt", c.excerpt, b.excerpt);
  same("status", c.status, b.status);
  same("author", c.author, b.author);
  same("tags", c.tags, b.tags);
  same("locales", c.locales, b.locales);

  // keywords は「既存を全件保持したうえでの追加」だけを許す
  for (const k of b.keywords) {
    if (!c.keywords.includes(k)) notes.push(`NG: 既存キーワード「${k}」が失われている`);
  }

  // 本文：改稿前の記述が1行も失われていないこと（見出しの並べ替え・行の追加は許す）。
  // 箇条書きの途中に出典を足すため、段落単位ではなく行単位で照合する。
  const oldLines = b.content
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("#") && s !== "---");
  for (const line of oldLines) {
    if (!c.content.includes(line)) {
      notes.push(`NG: 改稿前の記述が本文から失われている → ${line.slice(0, 40)}…`);
    }
  }
  const oldHeadings = b.content.match(/^## .*/gm) ?? [];
  for (const h of oldHeadings) {
    if (!c.content.includes(h)) notes.push(`WARN: 改稿前の見出しが無い → ${h}`);
  }
  return notes;
}

function verify(c: SeedColumn, b: Backup): string[] {
  const notes: string[] = [...verifyAgainstBackup(c, b)];

  // 第7条1＝冒頭の直答ブロック
  if (!c.content.startsWith("**結論（先に要点）**：")) {
    notes.push("NG: 「**結論（先に要点）**：」で始まっていない");
  }

  // 定点#25の設問語
  for (const t of REQUIRED_TERMS) {
    if (!c.content.includes(t)) notes.push(`NG: 設問語「${t}」がない`);
  }

  // 第7条3＝判断の軸は表で示す
  const tableRows = (c.content.match(/^\|/gm) ?? []).length;
  if (tableRows < 5) notes.push(`NG: 判断基準の表が無い（表の行 ${tableRows}）`);

  // 内部リンク（評価の集約方向）
  for (const l of REQUIRED_LINKS) {
    if (!c.content.includes(l)) notes.push(`NG: 内部リンク ${l} がない`);
  }
  if (!c.content.includes("役割")) notes.push("WARN: 役割分担の明示が見当たらない");

  // 表示コンプライアンス：禁止語（luck428-column-seo 第9条／shigyo-compliance-gate）
  for (const w of FORBIDDEN_WORDS) {
    if (c.content.includes(w)) notes.push(`NG: 禁止語「${w}」あり`);
  }

  // 判断留保（税は税理士・登記は司法書士へ送る）
  if (!c.content.includes("一般的な情報提供")) notes.push("NG: 判断留保の記載なし");
  if (!/税理士/.test(c.content)) notes.push("NG: 税理士への留保がない");
  if (!/司法書士/.test(c.content)) notes.push("NG: 司法書士への留保がない");

  // 出典（第7条4）
  if (!/### このコラムで触れた公的機関の情報/.test(c.content)) notes.push("NG: 出典節なし");
  if (!/租税特別措置法第35条第3項/.test(c.content)) notes.push("NG: 根拠条文の明記なし");

  if (c.faq.length < 3) notes.push(`WARN: FAQが${c.faq.length}件と少ない`);
  return notes;
}

async function main() {
  const write = process.argv.includes("--write");
  const emitTs = process.argv.includes("--emit-ts");
  const col = buildColumn();
  const backup = loadBackup();
  const notes = verify(col, backup);
  const hasNg = notes.some((n) => n.startsWith("NG"));

  if (emitTs) {
    if (hasNg) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(__dirname, "../src/lib/data/souzoku-jikka-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-souzoku-jikka.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/souzoku-columns/souzoku-jikka-uru-nokosu.md。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-souzoku-jikka からの管理者セッション経由upsert（定点#25対策の1本のみ）。\n\nexport type SouzokuJikkaSeedColumn = {\n  business: "realestate";\n  slug: string;\n  title: string;\n  date: string;\n  modifiedDate: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const SOUZOKU_JIKKA_SEED: SouzokuJikkaSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify([col], null, 2) + ";\n");
    console.log(`emit-ts → ${out}（1本）`);
    return;
  }

  const preview = {
    note: "定点#25 相続した空き家 賃貸に出すか売るか 判断基準。原稿mdから生成。--write でupsert。",
    articleCount: 1,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: [
      { ...col, content: `${col.content.slice(0, 200)}…（全${col.content.length}字）` },
    ],
  };
  writeFileSync(
    resolve(__dirname, "souzoku-jikka.preview.json"),
    JSON.stringify(preview, null, 2),
  );
  console.log("preview → scripts/souzoku-jikka.preview.json（1本）");
  for (const n of notes) console.log("  " + n);
  if (hasNg) {
    console.error("NGがあるため中断します。");
    process.exit(1);
  }
  if (!write) {
    console.log("dry-run 完了。本番投入は /admin/columns/seed-souzoku-jikka から行ってください。");
    return;
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const { business, slug, ...data } = col;
    const row = await prisma.column.upsert({
      where: { business_slug: { business, slug } },
      create: { business, slug, ...data },
      update: data,
    });
    console.log(`upsert: ${business}/${slug} (id=${row.id})`);
    console.log("投入完了。本番URLの200と FAQPage JSON-LD 出力を確認してください。");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
