/**
 * 行政書士コラム 第2弾（1本）投入スクリプト
 *
 * 対象＝luck428.com /legal/column（business=legal）。コラムプロット_5本_2026-08-14 の②。
 * 原稿＝scripts/office-columns/04-shuro-b-hoday-bukken-yoken.md。
 *
 * カニバリ回避（サイトマップ全URL照合済み 2026-08-14・slug衝突なし）：
 *   - GH23本は業態限定（住まい系）＝通所系（B型・放デイ）は空白クラスタ。導入文で「GHは別記事」と明示
 *   - 介護保険側の kaigo-jigyousho-bukken-youto-chiiki（/column）とは主語（障害福祉／介護保険）で分離・相互リンク
 *
 * 東京都の基準数値は一次確認するまで本文に書かない方針（プロット②）＝本記事は「基準の構造と確認の順番」に
 * 限定し、数値は指定権者の公表資料へ誘導する。数値を追記する場合は都の条例・規則を一次確認のうえmd側を更新する。
 *
 * seed-office-columns.ts と同型：dry-run 既定 → preview JSON、--emit-ts で admin 投入ページ用の
 * seed データを生成。本番投入は /admin/columns/seed-office-p2 の管理者セッション経由を正とする。
 *
 * 使い方:
 *   npx tsx scripts/seed-office-columns-p2.ts            # dry-run（scripts/office-columns-p2.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-office-columns-p2.ts --emit-ts  # src/lib/data/office-columns-p2-seed.ts を生成
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";

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

const DATE = "2026-08-14";

const REQUIRED_HUB_LINKS: Record<string, string[]> = {
  "shuro-b-hoday-bukken-yoken": ["/legal/services/shogai-fukushi", "/toushi"],
};

/** 本セット外へ張る既存slug（サイトマップで実在確認済み 2026-08-14） */
const KNOWN_EXISTING_LEGAL_SLUGS = new Set(["group-home-shitei-kijun-bukken-menseki"]);
const KNOWN_EXISTING_COLUMN_SLUGS = new Set(["kaigo-jigyousho-bukken-youto-chiiki"]);

const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "one-stop", "一気通貫"];

const ARTICLES: Array<{
  file: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
}> = [
  {
    file: "04-shuro-b-hoday-bukken-yoken.md",
    slug: "shuro-b-hoday-bukken-yoken",
    title: "就労継続支援B型・放課後等デイサービスの物件要件──グループホームと何が違うか",
    category: "障害福祉の開業",
    excerpt:
      "就労継続支援B型や放課後等デイサービスは「通所」の施設で、グループホームとは物件の見方が異なります。確認すべきは①用途地域②面積・部屋の基準③避難・消防の3点。面積などの基準は指定権者（都道府県・政令市・中核市等）ごとに異なるため、候補物件の図面を持って指定権者に事前相談してから契約する——この順番がすべてです。グループホームとの違いを比較表で整理し、契約前に確認する項目と相談先をまとめました。",
    keywords: [
      "就労継続支援B型 物件 要件",
      "放課後等デイサービス 物件 面積",
      "障害福祉 通所 用途地域",
      "放デイ 指導訓練室 広さ",
      "就労継続支援B型 開設 物件",
      "障害福祉 指定申請 事前相談",
    ],
    tags: ["障害福祉", "就労継続支援B型", "放課後等デイサービス", "物件", "指定申請"],
  },
];

function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

function parseFaq(content: string, file: string): Faq[] {
  const m = content.match(/## よくある質問\n([\s\S]*?)(?=\n## |$)/);
  if (!m) throw new Error(`${file}: 「## よくある質問」節が見つかりません`);
  const block = m[1];
  const faqs: Faq[] = [];
  const re = /\*\*Q\.\s*([\s\S]*?)\*\*\n(A\.\s*[\s\S]*?)(?=\n\*\*Q\.|\s*$)/g;
  let q: RegExpExecArray | null;
  while ((q = re.exec(block)) !== null) {
    faqs.push({
      question: toPlainText(q[1]),
      answer: toPlainText(q[2].replace(/^A\.\s*/, "")),
    });
  }
  if (faqs.length === 0) throw new Error(`${file}: FAQを1件もパースできません`);
  return faqs;
}

function buildColumns(): SeedColumn[] {
  const dir = resolve(process.cwd(), "scripts", "office-columns");
  return ARTICLES.map((a) => {
    const content = readFileSync(join(dir, a.file), "utf-8").trim();
    const faq = parseFaq(content, a.file);
    return {
      business: "legal" as const,
      slug: a.slug,
      title: a.title,
      date: DATE,
      category: a.category,
      excerpt: a.excerpt,
      content,
      status: "published" as const,
      author: { ...AUTHOR },
      keywords: a.keywords,
      tags: a.tags,
      locales: ["ja"],
      faq,
    };
  });
}

function verify(cols: SeedColumn[]): string[] {
  const notes: string[] = [];
  const slugs = new Set(cols.map((c) => c.slug));
  if (slugs.size !== cols.length) notes.push("NG: slug重複あり");

  for (const c of cols) {
    if (c.faq.length !== 4) notes.push(`WARN: ${c.slug} のFAQが${c.faq.length}件（想定4件）`);
    if (c.content.length < 2000) notes.push(`WARN: ${c.slug} の本文が短い（${c.content.length}字）`);

    if (!c.content.startsWith("**結論（先に要点）**：")) {
      notes.push(`NG: ${c.slug} が「**結論（先に要点）**：」で始まっていない`);
    }

    for (const hub of REQUIRED_HUB_LINKS[c.slug] ?? []) {
      if (!c.content.includes(`](${hub})`)) notes.push(`NG: ${c.slug} に ${hub} リンクなし`);
    }

    const legalLinks = [...c.content.matchAll(/\]\(\/legal\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of legalLinks) {
      if (!slugs.has(l) && !KNOWN_EXISTING_LEGAL_SLUGS.has(l)) {
        notes.push(`NG: ${c.slug} → 不明legal slug ${l}`);
      }
    }
    const columnLinks = [...c.content.matchAll(/\]\(\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of columnLinks) {
      if (!KNOWN_EXISTING_COLUMN_SLUGS.has(l)) notes.push(`NG: ${c.slug} → 不明column slug ${l}`);
    }

    for (const w of FORBIDDEN_WORDS) {
      if (c.content.includes(w)) notes.push(`NG: ${c.slug} に禁止語「${w}」あり`);
    }

    if (!c.content.includes("独立した事業体")) {
      notes.push(`NG: ${c.slug} に分離受任の明示（「独立した事業体」）なし`);
    }

    if (/作成・提出[^。]{0,40}独占業務/.test(c.content)) {
      notes.push(`NG: ${c.slug} に「作成・提出＝独占業務」の誤表現あり`);
    }

    if (c.content.includes("中国総局長として中国や台湾") || c.content.includes("記者歴34年")) {
      notes.push(`NG: ${c.slug} の執筆者経歴に禁止表現あり`);
    }

    if (!c.content.includes("## この記事の出典（一次情報）")) {
      notes.push(`NG: ${c.slug} に出典節なし`);
    }
    if (!c.content.includes("一般的な情報提供")) {
      notes.push(`NG: ${c.slug} に判断留保の記載なし`);
    }
  }
  return notes;
}

async function main() {
  const emitTs = process.argv.includes("--emit-ts");
  if (process.argv.includes("--write")) {
    console.error(
      "--write は用意していません。本番投入は /admin/columns/seed-office-p2（管理者セッション経由）を正とします。",
    );
    process.exit(1);
  }
  const cols = buildColumns();
  const notes = verify(cols);

  if (emitTs) {
    if (notes.some((n) => n.startsWith("NG"))) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(process.cwd(), "src/lib/data/office-columns-p2-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-office-columns-p2.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/office-columns/04-shuro-b-hoday-bukken-yoken.md。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-office-p2 からの管理者セッション経由バルクupsert（seed-office と同型）。\n\nexport type OfficeSeedColumnP2 = {\n  business: "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const OFFICE_COLUMNS_P2_SEED: OfficeSeedColumnP2[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "行政書士コラム第2弾（1本＝プロット②）。原稿md（scripts/office-columns/04）から生成。投入は /admin/columns/seed-office-p2。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
    })),
  };
  const out = resolve(process.cwd(), "scripts", "office-columns-p2.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}`);
  console.log(preview.verification.join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
