/**
 * グループホーム・コラムクラスタ P3（A全体像#2＋C手続き系#9-12・計5本）投入スクリプト
 *
 * 出典設計＝samurai-app/tasks/gh-column-cluster-placement-plan.md（ハブ＆スポーク）。
 * 原稿＝scripts/gh-columns/*.md（浦松承認 2026-07-24付「進めてください」指示に基づき執筆）。
 * P1（seed-gh-columns.ts）・P2（seed-gh-columns-p2.ts）と同型：
 *   dry-run 既定 → preview JSON、--write で本番upsert、--emit-ts で管理画面投入用データ生成。
 *
 * P1・P2との差分：
 *   - P3記事はP1（5本）・P2（5本）の計10本へ相互リンクする。verify() のslug存在チェックは
 *     「今回のバッチ内」だけでなく「KNOWN_LIVE_SLUGS（P1・P2既存10本）」も許容するよう拡張している。
 *   - 既存の01/21等の.mdファイルは変更していない（並行編集中の別セッションとの衝突回避のため、
 *     逆リンクの追加は今回のスコープに含めず、新規5本からの片方向リンクに留めている）。
 *
 * 使い方:
 *   npx tsx scripts/seed-gh-columns-p3.ts            # dry-run（scripts/gh-columns-p3.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-gh-columns-p3.ts --write    # DATABASE_URL/DIRECT_URL を設定して本番upsert（冪等）
 *   npx tsx scripts/seed-gh-columns-p3.ts --emit-ts  # src/lib/data/gh-columns-seed-p3.ts を生成（admin/columns/seed-gh-p3 投入ページ用。
 *                                                    #  本番環境変数がSensitive設定でenv pull不可のため、P1・P2同型のadmin経由投入を正とする）
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

// P1（2026-07-23〜24投入）＋P2（2026-07-24投入）の既存公開slug。
// P3記事から相互リンクするためverify()で既知slugとして許容する。
const KNOWN_LIVE_SLUGS = [
  // P1
  "group-home-kaisetsu-nagare-tokyo-bunkyo", // #1
  "group-home-bukken-shitei-onestop", // #21
  "group-home-shobo-setsubi-sprinkler", // #5
  "group-home-bunkyo-ku-kaisetsu", // #19
  "group-home-kaisetsu-hiyo-zentaizo", // #16
  // P2
  "group-home-bukken-sagashikata-youto-chiiki", // #3
  "group-home-shitei-kijun-bukken-menseki", // #4
  "group-home-kenchikukijunho-youto-henko", // #6
  "group-home-keiyakumae-jizen-kyogi", // #7
  "group-home-kodate-apart-satellite-chigai", // #8
];

// 検収対象の新規原稿（scripts/gh-columns/*.md）のDBメタ
const ARTICLES: Array<{
  file: string;
  slug: string;
  title: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
}> = [
  {
    file: "02-schedule-junbi-kikan.md",
    slug: "group-home-kaisetsu-schedule-junbi-kikan",
    title: "グループホーム開設のスケジュールと準備期間｜開設日から逆算する3〜6か月",
    excerpt:
      "障害者グループホーム（共同生活援助）は、開設したい時期から逆算してスケジュールを組むと手戻りが減ります。法人準備・説明会・物件確保・事前相談・人員確保・指定申請の工程を、目安の期間とあわせて整理します。",
    keywords: [
      "グループホーム 開設 スケジュール",
      "グループホーム 準備期間",
      "グループホーム 開設 期間",
      "障害者グループホーム スケジュール",
      "グループホーム 逆算",
      "グループホーム 開設 何ヶ月",
    ],
    tags: ["グループホーム", "スケジュール", "準備期間", "開設の流れ", "逆算"],
  },
  {
    file: "09-shorui-ichiran.md",
    slug: "group-home-shitei-shinsei-shorui-ichiran",
    title: "グループホーム指定申請の必要書類一覧｜法人設立から申請までを網羅",
    excerpt:
      "障害者グループホーム（共同生活援助）の指定申請には、法人・物件・人員・運営体制に関する書類一式が必要です。何が要るのか、誰が作成するのか（業際）を含めて一覧化します。",
    keywords: [
      "グループホーム 指定申請 必要書類",
      "グループホーム 書類一覧",
      "共同生活援助 指定申請 書類",
      "グループホーム 定款",
      "グループホーム 誓約書",
      "障害者総合支援法 第36条",
    ],
    tags: ["グループホーム", "指定申請", "必要書類", "法人設立", "業際"],
  },
  {
    file: "10-jizen-kyogi-setsumeikai.md",
    slug: "group-home-tokyo-jizen-kyogi-setsumeikai",
    title: "東京都の障害者グループホーム説明会と事前協議とは｜指定申請前に知っておくこと",
    excerpt:
      "東京都で共同生活援助（グループホーム）の指定を受けるには、事業者向け説明会への参加や事前協議を経て指定申請に進みます。説明会・事前協議の位置づけと、申請受付窓口である東京都福祉保健財団との関係を整理します。",
    keywords: [
      "グループホーム 説明会 東京都",
      "グループホーム 事前協議",
      "東京都福祉保健財団 指定申請",
      "障害者グループホーム 事業者説明会",
      "グループホーム 指定権者",
      "東京都 共同生活援助 指定",
    ],
    tags: ["グループホーム", "説明会", "事前協議", "東京都", "指定申請"],
  },
  {
    file: "11-kankei-kikan-kakuninsho.md",
    slug: "group-home-kankei-kikan-soudan-kakuninsho",
    title: "「関係機関相談状況確認書及び議事録」とは｜グループホーム指定申請の添付書類",
    excerpt:
      "障害者グループホーム（共同生活援助）の指定申請には、区市町村・消防・建築部署との事前相談の記録「関係機関相談状況確認書及び議事録」の添付が求められます。何を書き、いつ・誰と作る書類なのかを整理します。",
    keywords: [
      "関係機関相談状況確認書",
      "グループホーム 議事録",
      "グループホーム 事前相談 記録",
      "指定申請 添付書類 グループホーム",
      "グループホーム 消防 建築 相談記録",
      "共同生活援助 事前協議 書類",
    ],
    tags: ["グループホーム", "事前相談", "確認書", "添付書類", "実体験"],
  },
  {
    file: "12-henkotodoke-koshin.md",
    slug: "group-home-henkotodoke-koshin-taimingu",
    title: "グループホーム指定後の変更届・更新のタイミング｜10日以内の届出と6年ごとの更新",
    excerpt:
      "障害者グループホーム（共同生活援助）は、指定を受けて終わりではありません。代表者や職員体制などが変わったときの変更届（10日以内）と、6年ごとの指定更新が必要です。タイミングと根拠条文を整理します。",
    keywords: [
      "グループホーム 変更届",
      "グループホーム 指定更新",
      "障害者総合支援法 第46条",
      "障害者総合支援法 第41条",
      "グループホーム 6年更新",
      "共同生活援助 変更届 10日以内",
    ],
    tags: ["グループホーム", "変更届", "指定更新", "開設後", "運営"],
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
    // 相互リンク先slugの実在（このバッチ5本＋P1・P2既存10本を既知集合として検査）
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
    const out = resolve(__dirname, "../src/lib/data/gh-columns-seed-p3.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-gh-columns-p3.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/gh-columns/*.md（浦松承認 2026-07-24）。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-gh-p3 からの管理者セッション経由バルクupsert（seed-gh-columns.ts/gh-columns-seed.ts と同型）。\n\nexport type GhSeedColumn = {\n  business: "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const GH_COLUMNS_SEED_P3: GhSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "GHコラムクラスタP3（A全体像#2＋C手続き系#9-12・計5本）。新規原稿md（scripts/gh-columns/）から生成。--write でupsert。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
      contentFull: undefined,
    })),
  };
  writeFileSync(resolve(__dirname, "gh-columns-p3.preview.json"), JSON.stringify(preview, null, 2));
  console.log(`preview → scripts/gh-columns-p3.preview.json（${cols.length}本）`);
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
