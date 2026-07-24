/**
 * グループホーム・コラムクラスタ P2（B物件系★5本）投入スクリプト
 *
 * 出典設計＝samurai-app/tasks/gh-column-cluster-placement-plan.md（ハブ＆スポーク）。
 * 原稿＝scripts/gh-columns/*.md（浦松検収済み 2026-07-24。文言は検収版から変更しない）。
 * P1（seed-gh-columns.ts）と同型：dry-run 既定 → preview JSON、--write で本番upsert、--emit-ts で管理画面投入用データ生成。
 *
 * P1との差分：
 *   - P2記事はP1の5本（既に本番公開済み）へ相互リンクする。verify() のslug存在チェックは
 *     「今回のバッチ内」だけでなく「KNOWN_LIVE_SLUGS（P1既存5本）」も許容するよう拡張している。
 *
 * 使い方:
 *   npx tsx scripts/seed-gh-columns-p2.ts            # dry-run（scripts/gh-columns-p2.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-gh-columns-p2.ts --write    # DATABASE_URL/DIRECT_URL を設定して本番upsert（冪等）
 *   npx tsx scripts/seed-gh-columns-p2.ts --emit-ts  # src/lib/data/gh-columns-seed-p2.ts を生成（admin/columns/seed-gh-p2 投入ページ用。
 *                                                    #  本番環境変数がSensitive設定でenv pull不可のため、P1同型のadmin経由投入を正とする）
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
const DATE = "2026-07-24";

// P1（既に本番公開済み・2026-07-23〜24投入）のslug。P2記事から相互リンクするためverify()で既知slugとして許容する。
const KNOWN_LIVE_SLUGS = [
  "group-home-kaisetsu-nagare-tokyo-bunkyo", // #1
  "group-home-bukken-shitei-onestop", // #21
  "group-home-shobo-setsubi-sprinkler", // #5
  "group-home-bunkyo-ku-kaisetsu", // #19
  "group-home-kaisetsu-hiyo-zentaizo", // #16
  // 2026-07-24追記（Issue #119）：#7→#23の逆リンク用（P3b・scripts/seed-gh-columns-p3b.ts投入済み）。
  "group-home-yokuaru-temodori-kaihi", // #23
];

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
    file: "03-bukken-sagashikata.md",
    slug: "group-home-bukken-sagashikata-youto-chiiki",
    title: "グループホームに使える物件の探し方｜用途地域と立地の確認ポイント",
    excerpt:
      "障害者グループホーム（共同生活援助）に使える物件は、一般の賃貸物件探しとは確認項目が違います。建築基準法上「寄宿舎」として扱われるため用途地域の確認が要り、駅からの距離や近隣環境も開設後の運営に直結します。契約前に見るべきポイントを、宅地建物取引業を持つ四葉が整理します。",
    keywords: [
      "グループホーム 物件 探し方",
      "用途地域 寄宿舎",
      "障害者グループホーム 立地",
      "グループホーム 建築基準法",
      "寄宿舎 用途地域",
      "グループホーム 物件条件",
    ],
    tags: ["グループホーム", "物件", "用途地域", "立地", "宅建業"],
  },
  {
    file: "04-shitei-kijun-menseki.md",
    slug: "group-home-shitei-kijun-bukken-menseki",
    title: "グループホームの指定基準を満たす物件条件｜居室7.43㎡・定員・設備",
    excerpt:
      "障害者グループホーム（共同生活援助）の指定を受けるには、居室面積・入居定員・共用設備が指定基準を満たす必要があります。東京都の条例に基づく数値基準を、表で整理して解説します。",
    keywords: [
      "グループホーム 指定基準",
      "居室 7.43平米",
      "グループホーム 定員",
      "共同生活住居 基準",
      "東京都 障害福祉 条例",
      "グループホーム 設備基準",
    ],
    tags: ["グループホーム", "指定基準", "居室面積", "定員", "設備基準"],
  },
  {
    file: "06-youto-henko.md",
    slug: "group-home-kenchikukijunho-youto-henko",
    title: "グループホーム開設と建築基準法｜用途変更確認申請の要否",
    excerpt:
      "既存の建物をグループホームに転用する場合、建築基準法上の「用途変更」の手続きが必要になることがあります。確認申請が必要になる面積の基準と、申請が不要でも押さえておくべき点を整理します。",
    keywords: [
      "グループホーム 用途変更",
      "建築基準法 確認申請",
      "用途変更 200平米",
      "グループホーム 既存建物 転用",
      "寄宿舎 用途変更",
      "グループホーム 建築基準法",
    ],
    tags: ["グループホーム", "建築基準法", "用途変更", "確認申請", "既存建物"],
  },
  {
    file: "07-jizen-kyogi.md",
    slug: "group-home-keiyakumae-jizen-kyogi",
    title: "グループホーム開設｜契約前にやる事前協議（区・消防・建築の3窓口）",
    excerpt:
      "障害者グループホームの物件は、契約してからでは直しにくい確認事項ばかりです。区市町村・消防・建築部署という3つの窓口に、契約前に図面を持ち込んで確認する——その進め方と、窓口ごとに見られるポイントを実体験を交えて解説します。",
    keywords: [
      "グループホーム 事前協議",
      "グループホーム 契約前",
      "関係機関相談状況確認書",
      "グループホーム 事前相談",
      "障害者グループホーム 図面確認",
      "グループホーム 消防 建築 相談",
    ],
    tags: ["グループホーム", "事前協議", "契約前", "実体験", "手戻り防止"],
  },
  {
    file: "08-kodate-satellite.md",
    slug: "group-home-kodate-apart-satellite-chigai",
    title: "グループホームの3類型｜戸建て型・アパート型・サテライト型の違い",
    excerpt:
      "障害者グループホームの住居は、戸建て型・アパート型・サテライト型の3つに大きく分けられます。それぞれの特徴とサテライト型特有の要件（本体住居との距離・部屋数上限）を、物件選びの視点で整理します。",
    keywords: [
      "グループホーム 戸建て型",
      "グループホーム アパート型",
      "サテライト型住居",
      "グループホーム 類型",
      "サテライト型 要件",
      "グループホーム 物件選び",
    ],
    tags: ["グループホーム", "戸建て型", "アパート型", "サテライト型", "物件選び"],
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

function verify(cols: SeedColumn[]): string[] {
  const notes: string[] = [];
  const batchSlugs = new Set(cols.map((c) => c.slug));
  const knownSlugs = new Set([...batchSlugs, ...KNOWN_LIVE_SLUGS]);
  if (batchSlugs.size !== cols.length) notes.push("NG: slug重複あり");
  for (const c of cols) {
    if (c.faq.length !== 6) notes.push(`WARN: ${c.slug} のFAQが${c.faq.length}件（想定6件）`);
    if (c.content.length < 2000) notes.push(`WARN: ${c.slug} の本文が短い（${c.content.length}字）`);
    // スポーク→ハブ必須リンク
    if (!c.content.includes("](/group-home)")) notes.push(`NG: ${c.slug} に /group-home リンクなし`);
    // 相互リンク先slugの実在（このバッチ5本＋P1既存5本を既知集合として検査）
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
    const out = resolve(__dirname, "../src/lib/data/gh-columns-seed-p2.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-gh-columns-p2.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/gh-columns/*.md（浦松検収済み 2026-07-24）。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-gh-p2 からの管理者セッション経由バルクupsert（seed-gh-columns.ts/gh-columns-seed.ts と同型）。\n\nexport type GhSeedColumn = {\n  business: "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const GH_COLUMNS_SEED_P2: GhSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "GHコラムクラスタP2（B物件系★5本）。検収済み原稿md（scripts/gh-columns/）から生成。--write でupsert。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
      contentFull: undefined,
    })),
  };
  writeFileSync(resolve(__dirname, "gh-columns-p2.preview.json"), JSON.stringify(preview, null, 2));
  console.log(`preview → scripts/gh-columns-p2.preview.json（${cols.length}本）`);
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
