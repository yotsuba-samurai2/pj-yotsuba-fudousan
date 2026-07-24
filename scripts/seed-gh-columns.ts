/**
 * グループホーム・コラムクラスタ P1（5本）投入スクリプト
 *
 * 出典設計＝samurai-app/tasks/gh-column-cluster-placement-plan.md（ハブ＆スポーク）。
 * 原稿＝scripts/gh-columns/*.md（浦松検収済み 2026-07-23。文言は検収版から変更しない）。
 * 台湾9本（seed-taiwan-columns.ts）と同型：dry-run 既定 → preview JSON、--write で本番upsert。
 *
 * 使い方:
 *   npx tsx scripts/seed-gh-columns.ts            # dry-run（scripts/gh-columns.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-gh-columns.ts --write    # DATABASE_URL/DIRECT_URL を設定して本番upsert（冪等）
 *   npx tsx scripts/seed-gh-columns.ts --emit-ts  # src/lib/data/gh-columns-seed.ts を生成（admin/columns/seed-gh 投入ページ用。
 *                                                 #  本番環境変数がSensitive設定でenv pull不可のため、taiwan同型のadmin経由投入を正とする）
 *
 * 設計メモ:
 *   - FAQ は本文md「## よくある質問」から自動パース＝本文が単一ソース（FAQPage JSON-LD は
 *     (legal)/legal/column/[slug] の FAQJsonLd が faq フィールドから出力）。
 *   - faq.answer は JSON-LD 向けに Markdown リンク [text](url) → text へ平文化する（本文表示はmdのまま）。
 *   - upsert キー＝ @@unique([business, slug])。再実行しても重複しない。
 *   - locales: ["ja"]＝日本語のみ公開（2026-07-23 浦松判断・多言語展開なし）。
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

const CATEGORY = "グループホーム開設";
const DATE = "2026-07-23";

// 検収済みドラフト（samurai-app/tasks/draft-gh-column-*.md）のDBメタと一致させる
const ARTICLES: Array<{
  file: string;
  slug: string;
  title: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
}> = [
  {
    file: "01-nagare.md",
    slug: "group-home-kaisetsu-nagare-tokyo-bunkyo",
    title:
      "グループホーム開設の流れ【東京都・文京区版】｜物件と指定申請を同時に進める7ステップ",
    excerpt:
      "障害者グループホーム（共同生活援助）の開設を、法人設立から指定申請までの流れで整理。東京都の指定・文京区の事前相談・物件の指定基準を「同時に見る」視点で、手戻りのない順番を宅地建物取引業と行政書士業務を持つ四葉が解説します。",
    keywords: [
      "グループホーム 開設 流れ",
      "共同生活援助 指定申請",
      "障害者グループホーム 東京都",
      "文京区 グループホーム",
      "事前協議",
      "開設 準備期間",
    ],
    tags: ["グループホーム", "開設の流れ", "東京都", "文京区", "指定申請"],
  },
  {
    file: "21-bukken-onestop.md",
    slug: "group-home-bukken-shitei-onestop",
    title:
      "物件と指定申請を一つの窓口で｜グループホーム開設で「別々に頼む」と何が起きるか",
    excerpt:
      "グループホーム開設の手戻りの多くは、物件（不動産）と指定申請（行政手続）を別々に頼むことから起きます。宅地建物取引業と行政書士業務の両方を持つ四葉が、なぜ「一つの窓口」が手戻りを防ぐのかを、起きがちな失敗の順に解説します。",
    keywords: [
      "グループホーム 物件",
      "指定申請 ワンストップ",
      "障害者グループホーム 開設 物件探し",
      "宅建 行政書士",
      "用途地域 消防 面積",
      "物件 契約前 確認",
    ],
    tags: ["グループホーム", "物件", "ワンストップ", "宅建業", "差別化"],
  },
  {
    file: "05-shobo.md",
    slug: "group-home-shobo-setsubi-sprinkler",
    title:
      "グループホームの消防設備の要否｜スプリンクラー・自動火災報知設備・通報装置の基準",
    excerpt:
      "障害者グループホーム（共同生活援助）の消防設備は、入居者の障害支援区分の割合で要否が変わります。スプリンクラー（平成27年4月改正）、自動火災報知設備、消防機関へ通報する火災報知設備の基準を、物件選びの視点で整理します。最終確認は管轄消防署へ。",
    keywords: [
      "グループホーム 消防設備",
      "スプリンクラー 障害者グループホーム",
      "消防法施行令 6項ロ",
      "自動火災報知設備",
      "障害支援区分 8割",
      "グループホーム 消防 免除",
    ],
    tags: ["グループホーム", "消防設備", "スプリンクラー", "指定基準", "物件"],
  },
  {
    file: "19-bunkyo.md",
    slug: "group-home-bunkyo-ku-kaisetsu",
    title:
      "文京区でグループホームを開設するには｜区の窓口・独自補助・事前相談の進め方",
    excerpt:
      "文京区で障害者グループホーム（共同生活援助）を開設するときの、区の相談窓口（障害福祉課 障害者施設担当）、区独自の補助制度、東京都への指定申請と事前相談の関係を、地元・小日向の四葉が整理します。事前相談は指定申請の添付書類になります。",
    keywords: [
      "文京区 グループホーム 開設",
      "文京区 障害福祉課",
      "障害者グループホーム 整備費補助",
      "共同生活援助 東京都 指定",
      "文京区 事前相談",
      "関係機関相談状況確認書",
    ],
    tags: ["グループホーム", "文京区", "地域特化", "補助制度", "事前相談"],
  },
  {
    file: "16-hiyo.md",
    slug: "group-home-kaisetsu-hiyo-zentaizo",
    title: "グループホーム開設費用の全体像｜初期費用の内訳と、物件で変わるコスト",
    excerpt:
      "障害者グループホーム（共同生活援助）の開設費用は、ゼロから立ち上げる場合でおおむね数百万〜1,000万円規模が一つの目安です。法人設立・物件・改修/消防・什器・運転資金の内訳と、物件条件でコストが大きく動く理由を、宅地建物取引業を持つ四葉が整理します。金額は幅と出典で示します。",
    keywords: [
      "グループホーム 開設費用",
      "障害者グループホーム 初期費用",
      "共同生活援助 立ち上げ 費用",
      "グループホーム 補助金",
      "開設資金 内訳",
      "物件取得費 改修費",
    ],
    tags: ["グループホーム", "開設費用", "資金", "補助金", "物件"],
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
  const dir = resolve(__dirname, "gh-columns");
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

// P2（scripts/seed-gh-columns-p2.ts・2026-07-24投入済み）のslug。
// P1側（#21等）からP2記事への逆リンクを追加したため、verify()で既知slugとして許容する。
const KNOWN_EXTERNAL_SLUGS = [
  // P2（scripts/seed-gh-columns-p2.ts・2026-07-24投入済み）のslug。
  "group-home-bukken-sagashikata-youto-chiiki", // #3
  "group-home-shitei-kijun-bukken-menseki", // #4
  "group-home-kenchikukijunho-youto-henko", // #6
  "group-home-keiyakumae-jizen-kyogi", // #7
  "group-home-kodate-apart-satellite-chigai", // #8
  // P3（scripts/seed-gh-columns-p3.ts・2026-07-24投入済み）のslug。#1→#2,#9／#21→#9,#11の逆リンク用（Issue #119対応）。
  "group-home-kaisetsu-schedule-junbi-kikan", // #2
  "group-home-shitei-shinsei-shorui-ichiran", // #9
  "group-home-tokyo-jizen-kyogi-setsumeikai", // #10
  "group-home-kankei-kikan-soudan-kakuninsho", // #11
  "group-home-henkotodoke-koshin-taimingu", // #12
  // P3b（scripts/seed-gh-columns-p3b.ts・2026-07-24投入）のslug。#16→#17,#18／#19→#17の逆リンク用。
  "group-home-service-kanri-sekininsha-yoken", // #13
  "group-home-sewanin-seikatsushienin-haichi", // #14
  "group-home-unei-kitei-kobetsushien-keikaku", // #15
  "group-home-bunkyo-hojokin-seibi-unei", // #17
  "group-home-hoshu-taikei-kasan-kiso", // #18
  "group-home-tokyo23ku-shiteikensha-chigai", // #20
  "group-home-gaikokujin-keieikanri-zairyushikaku", // #22
  "group-home-yokuaru-temodori-kaihi", // #23
];
// 2026-07-24追記（Issue #119：内部リンク構造監査への対応）：
// #1→#2,#9／#21→#9,#11,#22,#23／#19→#20 の逆リンクをP1側3本（01/19/21）に追加。

function verify(cols: SeedColumn[]): string[] {
  const notes: string[] = [];
  const slugs = new Set(cols.map((c) => c.slug));
  const knownSlugs = new Set([...slugs, ...KNOWN_EXTERNAL_SLUGS]);
  if (slugs.size !== cols.length) notes.push("NG: slug重複あり");
  for (const c of cols) {
    if (c.faq.length !== 6) notes.push(`WARN: ${c.slug} のFAQが${c.faq.length}件（想定6件）`);
    if (c.content.length < 2000) notes.push(`WARN: ${c.slug} の本文が短い（${c.content.length}字）`);
    // スポーク→ハブ必須リンク
    if (!c.content.includes("](/group-home)")) notes.push(`NG: ${c.slug} に /group-home リンクなし`);
    // 相互リンク先slugの実在（この5本＋P2既知slugを検査対象に含める）
    const links = [...c.content.matchAll(/\]\(\/legal\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of links) if (!knownSlugs.has(l)) notes.push(`NG: ${c.slug} → 不明slug ${l}`);
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
    const out = resolve(__dirname, "../src/lib/data/gh-columns-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-gh-columns.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/gh-columns/*.md（浦松検収済み 2026-07-23）。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-gh からの管理者セッション経由バルクupsert（taiwan-columns-seed と同型）。\n\nexport type GhSeedColumn = {\n  business: "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const GH_COLUMNS_SEED: GhSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "GHコラムクラスタP1（5本）。検収済み原稿md（scripts/gh-columns/）から生成。--write でupsert。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
      contentFull: undefined,
    })),
  };
  writeFileSync(resolve(__dirname, "gh-columns.preview.json"), JSON.stringify(preview, null, 2));
  console.log(`preview → scripts/gh-columns.preview.json（${cols.length}本）`);
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
