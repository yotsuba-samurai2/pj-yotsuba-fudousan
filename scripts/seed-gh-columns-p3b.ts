/**
 * グループホーム・コラムクラスタ P3b（D人員3本＋E金残り2本＋F残り1本＋G残り2本＝計8本）投入スクリプト
 *
 * 出典設計＝samurai-app/tasks/gh-column-cluster-placement-plan.md（ハブ＆スポーク）。
 * 原稿＝scripts/gh-columns/*.md（浦松検収済み 2026-07-24。文言は検収版から変更しない）。
 * P1（seed-gh-columns.ts）/P2（seed-gh-columns-p2.ts）と同型：dry-run既定→preview JSON、--writeで本番upsert、--emit-tsで管理画面投入用データ生成。
 *
 * 既存バッチとの関係：
 *   - このバッチ（#13,14,15,17,18,20,22,23）は、既に本番公開済みのP1（5本）・P2（5本）・
 *     P3/P3a（別チャット担当・#2,9,10,11,12の5本）へ相互リンクする。
 *   - verify() のslug存在チェックは「今回のバッチ内」に加え、KNOWN_LIVE_SLUGS（既公開15本）も許容する。
 *
 * 使い方:
 *   npx tsx scripts/seed-gh-columns-p3b.ts            # dry-run（scripts/gh-columns-p3b.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-gh-columns-p3b.ts --write    # DATABASE_URL/DIRECT_URL を設定して本番upsert（冪等）
 *   npx tsx scripts/seed-gh-columns-p3b.ts --emit-ts  # src/lib/data/gh-columns-seed-p3b.ts を生成（admin/columns/seed-gh-p3b 投入ページ用。
 *                                                     #  本番環境変数がSensitive設定でenv pull不可のため、P1/P2/P3同型のadmin経由投入を正とする）
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

// 既に本番公開済み（P1・P2・P3/P3a＝2026-07-23〜24投入）のslug。
// P3bの記事から相互リンクするためverify()で既知slugとして許容する。
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
  // P3 / P3a（別チャット担当）
  "group-home-kaisetsu-schedule-junbi-kikan", // #2
  "group-home-shitei-shinsei-shorui-ichiran", // #9
  "group-home-tokyo-jizen-kyogi-setsumeikai", // #10
  "group-home-kankei-kikan-soudan-kakuninsho", // #11
  "group-home-henkotodoke-koshin-taimingu", // #12
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
    file: "13-sabikan-yoken.md",
    slug: "group-home-service-kanri-sekininsha-yoken",
    title: "グループホーム開設｜サービス管理責任者（サビ管）の要件と配置",
    excerpt:
      "共同生活援助の指定申請で必ず問われるのが「サービス管理責任者（サビ管）」の配置です。実務経験と研修修了という2つの要件、事業所ごとの配置の考え方を解説します。",
    keywords: [
      "グループホーム サービス管理責任者",
      "サビ管 要件",
      "サービス管理責任者研修",
      "グループホーム 人員基準",
      "共同生活援助 サビ管 配置",
      "サビ管 実務経験",
    ],
    tags: ["グループホーム", "サービス管理責任者", "サビ管", "人員基準", "指定申請"],
  },
  {
    file: "14-sewanin-haichi.md",
    slug: "group-home-sewanin-seikatsushienin-haichi",
    title: "グループホーム開設｜世話人・生活支援員の配置基準",
    excerpt:
      "利用者の日常生活を支える「世話人」と「生活支援員」。配置数は利用者数と障害支援区分によって変わります。常勤換算の考え方と計算の目安を解説します。",
    keywords: [
      "グループホーム 世話人",
      "生活支援員 配置基準",
      "グループホーム 人員配置",
      "常勤換算",
      "障害支援区分 配置基準",
      "共同生活援助 世話人 生活支援員",
    ],
    tags: ["グループホーム", "世話人", "生活支援員", "人員基準", "常勤換算"],
  },
  {
    file: "15-unei-kitei-keikaku.md",
    slug: "group-home-unei-kitei-kobetsushien-keikaku",
    title: "グループホーム開設｜運営規程・個別支援計画の整え方",
    excerpt:
      "指定申請には「運営規程」の整備が必須です。開設後は「個別支援計画」の作成・定期的な見直しが運営の柱になります。記載すべき項目と実務の流れを解説します。",
    keywords: [
      "グループホーム 運営規程",
      "個別支援計画",
      "グループホーム 指定申請 書類",
      "運営規程 記載事項",
      "サービス管理責任者 個別支援計画",
      "グループホーム 実地指導",
    ],
    tags: ["グループホーム", "運営規程", "個別支援計画", "指定申請", "実地指導"],
  },
  {
    file: "17-bunkyo-hojokin.md",
    slug: "group-home-bunkyo-hojokin-seibi-unei",
    title: "グループホーム開設｜文京区の整備費補助・運営費補助",
    excerpt:
      "文京区には障害者グループホームの「整備費等補助金」と、精神障害者グループホームの「運営費補助金」という区独自の制度があります。対象・窓口の考え方と、行政書士・社労士の役割分担を解説します。",
    keywords: [
      "文京区 グループホーム 補助金",
      "障害者グループホーム 整備費補助",
      "精神障害者グループホーム 運営費補助",
      "文京区 障害福祉課",
      "グループホーム 補助金 申請",
    ],
    tags: ["グループホーム", "文京区", "補助金", "整備費補助", "運営費補助"],
  },
  {
    file: "18-hoshu-kasan.md",
    slug: "group-home-hoshu-taikei-kasan-kiso",
    title: "グループホーム開設｜報酬体系・加算の基礎",
    excerpt:
      "共同生活援助の収入は「基本報酬＋各種加算」で構成されます。令和6年度報酬改定で処遇改善加算が一本化された概要を含め、収支の考え方を整理します。加算の算定実務（労務手続き）は連携する社会保険労務士がサポートします。",
    keywords: [
      "グループホーム 報酬体系",
      "共同生活援助 基本報酬",
      "処遇改善加算",
      "グループホーム 加算",
      "障害福祉サービス等報酬改定",
      "グループホーム 収支",
    ],
    tags: ["グループホーム", "報酬", "加算", "処遇改善加算", "収支"],
  },
  {
    file: "20-23ku-chigai.md",
    slug: "group-home-tokyo23ku-shiteikensha-chigai",
    title: "グループホーム開設｜東京23区の指定権者・運用の違い",
    excerpt:
      "「23区によって指定権者が違う」と思われがちですが、実は東京都内の指定権者は東京都知事と八王子市長の2者だけです。23区の\"違い\"は指定権者ではなく、区独自の補助制度・事前相談の運用にあります。",
    keywords: [
      "グループホーム 23区 指定権者",
      "障害福祉サービス 指定権者 東京都",
      "グループホーム 開設 区 違い",
      "東京都知事 指定申請",
      "グループホーム 特別区",
    ],
    tags: ["グループホーム", "23区", "指定権者", "東京都", "自治体比較"],
  },
  {
    file: "22-gaikokujin-zairyushikaku.md",
    slug: "group-home-gaikokujin-keieikanri-zairyushikaku",
    title: "グループホーム開設｜外国人がグループホーム事業を始めるには",
    excerpt:
      "外国人がグループホーム（共同生活援助）事業の経営者になる場合、多くは在留資格「経営・管理」が関わります。2025年10月施行の要件厳格化のポイントと、指定申請との関係を整理します。",
    keywords: [
      "外国人 グループホーム 経営",
      "経営管理ビザ グループホーム",
      "在留資格 経営管理 障害福祉",
      "グループホーム 外国人 起業",
      "経営・管理 在留資格 2025年改正",
    ],
    tags: ["グループホーム", "外国人", "経営管理ビザ", "在留資格", "多言語対応"],
  },
  {
    file: "23-temodori-kaihi.md",
    slug: "group-home-yokuaru-temodori-kaihi",
    title: "グループホーム開設｜よくある手戻りと回避（実体験から）",
    excerpt:
      "グループホーム開設でよくある「手戻り」を実体験をもとに整理しました。多くは「契約前の窓口確認」を飛ばしたことが原因です。回避のコツと、対話を最短ルートにする考え方を解説します。",
    keywords: [
      "グループホーム 開設 失敗",
      "グループホーム 手戻り",
      "グループホーム開設 注意点",
      "障害者グループホーム よくある失敗",
      "グループホーム 開設 遅れる 原因",
    ],
    tags: ["グループホーム", "手戻り", "失敗事例", "開設の注意点", "実体験"],
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
    // 相互リンク先slugの実在（このバッチ8本＋既公開15本を既知集合として検査）
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
    const out = resolve(__dirname, "../src/lib/data/gh-columns-seed-p3b.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-gh-columns-p3b.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/gh-columns/*.md（浦松検収済み 2026-07-24）。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-gh-p3b からの管理者セッション経由バルクupsert（seed-gh-columns.ts/gh-columns-seed.ts/gh-columns-seed-p2.ts と同型）。\n\nexport type GhSeedColumn = {\n  business: "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const GH_COLUMNS_SEED_P3B: GhSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "GHコラムクラスタP3b（D人員3＋E金残り2＋F残り1＋G残り2＝計8本）。検収済み原稿md（scripts/gh-columns/）から生成。--write でupsert。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
      contentFull: undefined,
    })),
  };
  writeFileSync(resolve(__dirname, "gh-columns-p3b.preview.json"), JSON.stringify(preview, null, 2));
  console.log(`preview → scripts/gh-columns-p3b.preview.json（${cols.length}本）`);
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
