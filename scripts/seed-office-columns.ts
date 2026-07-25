/**
 * オフィス許認可コラム（3本）投入スクリプト
 *
 * 出典設計＝samurai-app/tasks/draft-office-rewrite-and-columns.md Part B（浦松検収済み 2026-07-25）。
 * 原稿＝scripts/office-columns/*.md（検収済みドラフトの構成・要点・FAQ案に忠実に肉付け。条文は実装時裏取り済み）。
 * GHコラム（seed-gh-columns.ts）と同型：dry-run 既定 → preview JSON、--write で本番upsert。
 *
 * 使い方:
 *   npx tsx scripts/seed-office-columns.ts            # dry-run（scripts/office-columns.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-office-columns.ts --write    # DATABASE_URL/DIRECT_URL を設定して本番upsert（冪等）
 *   npx tsx scripts/seed-office-columns.ts --emit-ts  # src/lib/data/office-columns-seed.ts を生成（admin/columns/seed-office 投入ページ用。
 *                                                     #  本番環境変数がSensitive設定でenv pull不可のため、GH同型のadmin経由投入を正とする）
 *
 * 設計メモ:
 *   - FAQ は本文md「## よくある質問」から自動パース＝本文が単一ソース（FAQPage JSON-LD は
 *     (legal)/legal/column/[slug] の FAQJsonLd が faq フィールドから出力）。FAQは各記事4問（GHの6問と異なる）。
 *   - faq.answer は JSON-LD 向けに Markdown リンク [text](url) → text へ平文化する（本文表示はmdのまま）。
 *   - upsert キー＝ @@unique([business, slug])。再実行しても重複しない。
 *   - locales: ["ja"]＝日本語のみ公開（/office ピラーと同方針・多言語展開なし）。
 *   - ハブ必須リンク＝/office（GHの/group-homeに相当）。姉妹コラムの相互リンクslugは verify() で実在検査。
 *   - 表示コンプライアンス＝「ワンストップ」不使用（固有名詞「東京開業ワンストップセンター」のみ例外）／
 *     許認可可否の断定なし（「最終的には申請先の個別判断」）／登記=司法書士・労働関係=社労士の業際明記。
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

const CATEGORY = "会社設立とオフィス";
const DATE = "2026-07-25";

// 検収済みドラフト（samurai-app/tasks/draft-office-rewrite-and-columns.md Part B）のslug・想定検索と一致させる
const ARTICLES: Array<{
  file: string;
  slug: string;
  title: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
}> = [
  {
    file: "01-takken-jimusho-yoken.md",
    slug: "office-takken-menkyo-jimusho-yoken",
    title: "宅建業免許と事務所要件｜オフィス選びで先に確認すること",
    excerpt:
      "宅地建物取引業の免許では、事務所の独立性・実体と、事務所ごとの専任の宅地建物取引士の設置（宅建業法第3条・第31条の3）が審査されます。契約してから「この間取りでは説明が難しい」とならないよう、オフィス選びの段階で確認する観点を、文京区で宅建業免許を取得して営業する四葉が整理します。",
    keywords: [
      "宅建業免許 事務所 要件",
      "宅建業 開業 オフィス",
      "宅建業免許 事務所 独立性",
      "専任の宅地建物取引士 設置",
      "東京都 宅建業免許 手引き",
      "自宅 宅建業免許",
    ],
    tags: ["会社設立", "オフィス", "宅建業免許", "事務所要件", "許認可"],
  },
  {
    file: "02-kensetsugyo-eigyosho-yoken.md",
    slug: "office-kensetsugyo-kyoka-eigyosho-yoken",
    title: "建設業許可と営業所要件｜「実体のある営業所」とは",
    excerpt:
      "建設業許可では、常時建設工事の請負契約を締結する「営業所」としての実体（執務スペース・設備・常勤・独立性）が確認され、営業所の写真等の提出を求められるのが一般的です。登記上の本店でも実体がなければ営業所とは認められません。オフィス選びの段階で確認する観点を整理します。",
    keywords: [
      "建設業許可 営業所 要件",
      "建設業 オフィス 要件",
      "建設業許可 営業所 写真",
      "建設業許可 自宅 営業所",
      "常時建設工事の請負契約を締結する事務所",
      "東京都 建設業許可 手引き",
    ],
    tags: ["会社設立", "オフィス", "建設業許可", "営業所要件", "許認可"],
  },
  {
    file: "03-virtual-office-kyoninka.md",
    slug: "office-virtual-office-kyoninka",
    title: "バーチャルオフィスで会社設立｜できること・許認可で詰まること",
    excerpt:
      "バーチャルオフィスでも会社設立（本店登記）自体はできる場合が多い一方、事務所・営業所の実体や独立性が要件になる許認可（宅建業・建設業・古物営業など）は原則として取得が難しいとされています。予定業種の許認可要件から逆算するオフィス選びを解説します。登記の手続きは提携司法書士の領域です。",
    keywords: [
      "バーチャルオフィス 許認可",
      "バーチャルオフィス 会社設立 デメリット",
      "バーチャルオフィス 宅建業",
      "バーチャルオフィス 建設業",
      "バーチャルオフィス 古物商",
      "本店所在地 バーチャルオフィス",
    ],
    tags: ["会社設立", "オフィス", "バーチャルオフィス", "許認可", "本店所在地"],
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
  const dir = resolve(__dirname, "office-columns");
  return ARTICLES.map((a) => {
    const content = readFileSync(join(dir, a.file), "utf-8").trim();
    const faq = parseFaq(content, a.file);
    return {
      business: "legal" as const,
      slug: a.slug,
      title: a.title,
      date: DATE,
      category: CATEGORY,
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
    // スポーク→ハブ（/office）必須リンク
    if (!c.content.includes("](/office)")) notes.push(`NG: ${c.slug} に /office リンクなし`);
    // 表示コンプライアンス：「ワンストップ」は固有名詞「東京開業ワンストップセンター」以外で使わない
    const stripped = c.content.replaceAll("東京開業ワンストップセンター", "");
    if (stripped.includes("ワンストップ")) notes.push(`NG: ${c.slug} に固有名詞以外の「ワンストップ」あり`);
    // 相互リンク先slugの実在（この3本を検査対象に含める）
    const links = [...c.content.matchAll(/\]\(\/legal\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of links) if (!slugs.has(l)) notes.push(`NG: ${c.slug} → 不明slug ${l}`);
    // 姉妹コラム2本への相互リンク（ハブ＆スポークの横糸）
    const sisters = new Set(links.filter((l) => l !== c.slug));
    if (sisters.size < 2) notes.push(`WARN: ${c.slug} の姉妹コラムリンクが${sisters.size}本（想定2本）`);
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
    const out = resolve(__dirname, "../src/lib/data/office-columns-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-office-columns.ts --emit-ts)。直接編集しない。\n// 原稿の正本＝scripts/office-columns/*.md（浦松検収済みドラフト 2026-07-25 準拠）。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-office からの管理者セッション経由バルクupsert（gh-columns-seed と同型）。\n\nexport type OfficeSeedColumn = {\n  business: "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const OFFICE_COLUMNS_SEED: OfficeSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "オフィス許認可コラム（3本）。検収済みドラフト準拠の原稿md（scripts/office-columns/）から生成。--write でupsert。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
      contentFull: undefined,
    })),
  };
  writeFileSync(resolve(__dirname, "office-columns.preview.json"), JSON.stringify(preview, null, 2));
  console.log(`preview → scripts/office-columns.preview.json（${cols.length}本）`);
  for (const n of notes) console.log("  " + n);
  if (notes.some((n) => n.startsWith("NG"))) {
    console.error("NGがあるため中断します。");
    process.exit(1);
  }

  if (!write) {
    console.log("dry-run 完了。本番投入は --write を付けて実行してください。");
    return;
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    for (const c of cols) {
      const { business, slug, ...data } = c;
      const row = await prisma.column.upsert({
        where: { business_slug: { business, slug } },
        create: { business, slug, ...data },
        update: data,
      });
      console.log(`upsert: ${business}/${slug} (id=${row.id})`);
    }
    console.log("投入完了。本番URLの200と FAQPage JSON-LD 出力を確認してください。");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
