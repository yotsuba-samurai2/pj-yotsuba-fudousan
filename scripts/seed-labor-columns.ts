/**
 * 労務コラム（4本）投入スクリプト
 *
 * 設計＝01_設計書と進行表/60_QAとコラム_設計見直し.md「4-2 決定済みから導出するコラム」（C-1・C-3・C-4・C-6）。
 * 原稿＝scripts/labor-columns/*.md。報酬額表 v18 の決定30件と相場調査から起こしている。
 * seed-office-columns.ts と同型：dry-run 既定 → preview JSON、--write で本番upsert、--emit-ts で admin 投入用データを生成。
 *
 * 使い方:
 *   npx tsx scripts/seed-labor-columns.ts            # dry-run（scripts/labor-columns.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-labor-columns.ts --write    # DATABASE_URL/DIRECT_URL を設定して本番upsert（冪等）
 *   npx tsx scripts/seed-labor-columns.ts --emit-ts  # src/lib/data/labor-columns-seed.ts を生成（/admin/columns/seed-labor 用）
 *
 * 設計メモ:
 *   - business="labor"。SR_LAUNCHED=false の間は (labor)/layout.tsx が notFound() を返すため、
 *     status="published" で投入しても開業日（2026-09-01）まで表に出ない。sitemap にも出ない。
 *   - date="2026-09-01"＝開業日。クラスタの公開と足並みを揃える。
 *   - FAQ は本文md「## よくある質問」から自動パース＝本文が単一ソース。各記事4問。
 *   - upsert キー＝ @@unique([business, slug])。再実行しても重複しない。
 *   - locales: ["ja"]＝日本語のみ（浦松判断 2026-08-12・開業前の多言語展開は見送り）。
 *   - 表示コンプライアンス＝「ワンストップ」等の一体提供語を使わない／事業体をまたぐ記述には分離受任を明示／
 *     裏取りできない条文番号・告示番号を書かない（shigyo-compliance-gate 第4条）。
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";

type Faq = { question: string; answer: string };

type SeedColumn = {
  business: "labor";
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
  title: "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）",
} as const;

const DATE = "2026-09-01"; // 開業日＝クラスタ公開日

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
    file: "01-shogu-kaizen-dochira.md",
    slug: "shogu-kaizen-sharoushi-gyoseishoshi-dochira",
    title: "処遇改善加算は、社会保険労務士と行政書士のどちらに頼むのか",
    category: "誰に頼むか",
    excerpt:
      "処遇改善加算は工程で担当が分かれます。賃金制度の設計と賃金改善額の算定は社会保険労務士、指定権者へ提出する計画書・実績報告書の作成は行政書士です。根拠となる法律が違うため、ひとつの事務所が両方を名乗ることはできません。四葉での分担と料金もあわせて示します。",
    keywords: [
      "処遇改善加算 社労士 行政書士 どちら",
      "処遇改善加算 誰に頼む",
      "処遇改善加算 計画書 代行",
      "処遇改善加算 賃金改善額 算定",
      "障害福祉 処遇改善加算 相談",
      "処遇改善加算 業際",
    ],
    tags: ["処遇改善加算", "障害福祉", "介護", "業際", "社会保険労務士", "行政書士"],
  },
  {
    file: "02-joseikin-hojokin-dochira.md",
    slug: "joseikin-hojokin-dochira-ni-tanomu",
    title: "助成金と補助金は、どちらに頼めばいいのか",
    category: "誰に頼むか",
    excerpt:
      "「人を雇う・働き方を変える」お金が助成金で社会保険労務士の領域、「事業を興す・設備を入れる」お金が補助金で行政書士の領域です。原資も審査の考え方も違います。雇用保険法第62条という根拠から、なぜ頼む相手が分かれるのかを整理します。",
    keywords: [
      "助成金 補助金 違い",
      "助成金 社労士 行政書士 どちら",
      "雇用関係助成金 誰に頼む",
      "助成金 申請代行 資格",
      "補助金 行政書士",
      "助成金 コンサル 社労士",
    ],
    tags: ["助成金", "補助金", "雇用保険", "業際", "社会保険労務士", "行政書士"],
  },
  {
    file: "03-kyuyo-keisan-soba.md",
    slug: "kyuyo-keisan-soba-sharoushi",
    title: "給与計算を社会保険労務士に頼むと、いくらかかるのか",
    category: "料金の考え方",
    excerpt:
      "給与計算の代行は「基本料金＋従業員1人あたりいくら」が一般的で、1人あたりは月200〜500円（税別）と説明されることが多い形です。なぜ基本料金があるのか、代行と伴走支援をどう見分けるのか、比べるときに揃えるべき4点を整理します。四葉は基本料金なし・1人1,100円（税込）です。",
    keywords: [
      "給与計算 社労士 相場",
      "給与計算 代行 費用",
      "給与計算 アウトソーシング 料金",
      "給与計算 基本料金 人数",
      "給与計算 社労士 独占業務",
      "給与計算 年末調整 税理士",
    ],
    tags: ["給与計算", "料金", "相場", "アウトソーシング", "社会保険労務士"],
  },
  {
    file: "04-komonryo-nan-no-taika.md",
    slug: "sharoushi-komonryo-nan-no-taika",
    title: "社会保険労務士の顧問料は、何の対価なのか",
    category: "料金の考え方",
    excerpt:
      "顧問料は事務所によって中身が違います。多くは「相談＋基本的な手続」を含む包括料金ですが、四葉は相談だけの対価にし、手続は顧問先でも都度いただく形をとりました。なぜその設計にしたのか、包括型と比べて何が変わるのかを、隠さずに書きます。",
    keywords: [
      "社労士 顧問料 相場",
      "社労士 顧問料 何が含まれる",
      "社労士 顧問契約 内容",
      "社労士 手続だけ 依頼",
      "社労士 顧問料 従業員数",
      "社労士 相談 回数制限",
    ],
    tags: ["顧問料", "料金", "受任方針", "就業規則", "社会保険労務士"],
  },
];

/** Markdownリンク・強調を平文化（FAQ JSON-LD用。本文には適用しない） */
function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

/** 「## よくある質問」節から **Q. …** / A. … の組をパースする */
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
  const dir = resolve(__dirname, "labor-columns");
  return ARTICLES.map((a) => {
    const content = readFileSync(join(dir, a.file), "utf-8").trim();
    const faq = parseFaq(content, a.file);
    return {
      business: "labor" as const,
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

/** 開業前に書いてはいけない語・撤回済みの誤り（yotsuba-sharoushi-kaigyo 第6条／2026-08-11 の撤回） */
const BANNED = [
  "ワンストップ",
  "一気通貫",
  "シームレス",
  "一括対応",
  "第25条第1項第5号ロ",
  "2026年4月15日",
  "推奨申請期限",
];

function verify(cols: SeedColumn[]): string[] {
  const notes: string[] = [];
  const slugs = new Set(cols.map((c) => c.slug));
  if (slugs.size !== cols.length) notes.push("NG: slug重複あり");
  for (const c of cols) {
    if (c.faq.length !== 4) notes.push(`WARN: ${c.slug} のFAQが${c.faq.length}件（想定4件）`);
    if (c.content.length < 2000) notes.push(`WARN: ${c.slug} の本文が短い（${c.content.length}字）`);
    // 評価集約＝労務クラスタ内への発リンクが最低1本（luck428-column-seo 第6条5）
    if (!/\]\(\/labor\//.test(c.content)) notes.push(`NG: ${c.slug} に /labor 配下へのリンクなし`);
    // 表示コンプライアンス
    for (const w of BANNED) if (c.content.includes(w)) notes.push(`NG: ${c.slug} に禁止語「${w}」`);
    // 事業体をまたぐ記述には分離受任の明示（shigyo-compliance-gate 第2条）
    const crosses = c.content.includes("四葉行政書士事務所") || c.content.includes("四葉不動産");
    const declared =
      c.content.includes("独立した事業体") ||
      c.content.includes("別々にご契約") ||
      c.content.includes("それぞれ別の事業体");
    if (crosses && !declared) notes.push(`NG: ${c.slug} 事業体をまたぐが分離受任の明示なし`);
    // 姉妹コラム・既存コラムへのリンク先slugの実在（労務クラスタ内のみ検査）
    const links = [...c.content.matchAll(/\]\(\/labor\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of links) if (!slugs.has(l)) notes.push(`NG: ${c.slug} → 不明slug ${l}`);
    // 第7条：H2は疑問文（「この記事の根拠」「よくある質問」は除く）
    const h2 = [...c.content.matchAll(/^## (.+)$/gm)].map((x) => x[1]);
    const body = h2.filter((h) => h !== "よくある質問" && h !== "この記事の根拠");
    const q = body.filter((h) => h.endsWith("？"));
    if (q.length < Math.ceil(body.length / 2))
      notes.push(`WARN: ${c.slug} の疑問文H2が${q.length}/${body.length}本（第7条2）`);
    // 第7条4：末尾に根拠
    if (!c.content.includes("## この記事の根拠")) notes.push(`NG: ${c.slug} に「この記事の根拠」なし`);
    // 第1条：判断留保
    if (!c.content.includes("資格者が行います")) notes.push(`WARN: ${c.slug} に判断留保の一文なし`);
  }
  return notes;
}

async function main() {
  const write = process.argv.includes("--write");
  const emitTs = process.argv.includes("--emit-ts");
  const cols = buildColumns();
  const notes = verify(cols);

  if (emitTs) {
    if (notes.some((n) => n.startsWith("NG"))) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(__dirname, "../src/lib/data/labor-columns-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-labor-columns.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/labor-columns/*.md。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-labor からの管理者セッション経由バルクupsert（seed-office と同型）。\n\nexport type LaborSeedColumn = {\n  business: "labor";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const LABOR_COLUMNS_SEED: LaborSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "労務コラム（4本）。報酬額表 v18 の決定と相場調査から起こした原稿md（scripts/labor-columns/）から生成。--write でupsert。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
    })),
  };
  writeFileSync(resolve(__dirname, "labor-columns.preview.json"), JSON.stringify(preview, null, 2));
  console.log(`preview → scripts/labor-columns.preview.json（${cols.length}本）`);
  for (const n of notes) console.log("  " + n);
  if (notes.some((n) => n.startsWith("NG"))) {
    console.error("NGがあるため中断します。");
    process.exit(1);
  }
  if (!write) {
    console.log("\ndry-run です。本番投入は --write（DATABASE_URL/DIRECT_URL が必要）、");
    console.log("または --emit-ts のうえ /admin/columns/seed-labor から投入してください。");
    return;
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    for (const c of cols) {
      const r = await prisma.column.upsert({
        where: { business_slug: { business: c.business, slug: c.slug } },
        create: c as never,
        update: c as never,
      });
      console.log(`  upsert ${c.slug} → ${r.id}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
