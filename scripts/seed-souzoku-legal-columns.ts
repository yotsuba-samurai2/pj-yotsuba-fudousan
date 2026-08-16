/**
 * 相続コラム（行政書士）シリーズ（第1号〜第3号）投入スクリプト
 *
 * 対象＝luck428.com /legal/column（business=legal）。
 * 原稿＝scripts/legal-columns/NN-*.md。
 * 法令・公的資料は実装時に一次確認済み（2026-08-16）：
 *   - 文京区「【受付は午後4時まで】戸籍証明書等の広域交付」（更新日 2026年4月9日）
 *   - 法務局「法定相続情報証明制度の具体的な手続について」（更新日 2024年4月1日）
 *   - 東京法務局「相続登記が義務化されました」（更新日 2024年8月7日）
 *   - 裁判所「相続の放棄の申述」（courts.go.jp）
 *   - 国税庁「No.4205 相続税の申告と納税」（令和7年4月1日現在）
 *
 * カニバリ回避＝サイトマップ・既存legalコラム照合済み。本件は「相続の入口（戸籍収集・
 * 相続人調査）」であり、既存の台湾×相続（taiwan-legal-columns）や電子契約×委任状
 * （denshi-keiyaku）とは役割分担する。遺言は本スクリプトにはまだ追加しない（別タスク）。
 *
 * seed-denshi-keiyaku-columns.ts と同型：dry-run既定 → preview JSON、--emit-ts で
 * admin投入ページ用の seed データを生成。本番投入は /admin/columns/seed-souzoku-legal
 * の管理者セッション経由を正とする（本番環境変数がSensitive設定のため）。
 *
 * 使い方:
 *   npx tsx scripts/seed-souzoku-legal-columns.ts            # dry-run（preview JSON出力・DB接続なし）
 *   npx tsx scripts/seed-souzoku-legal-columns.ts --emit-ts  # src/lib/data/souzoku-legal-columns-seed.ts を生成
 *
 * 表示コンプライアンス＝shigyo-compliance-gate / luck428-column-seo 準拠：
 *   禁止語不使用／分離受任の明示（「独立した事業体」「別事業体」）／可否の断定なし／
 *   登記=司法書士・税務=税理士・紛争性のあるもの=弁護士を明記／紹介料を受け取らない旨を明記／
 *   執筆者経歴に禁止表現を使わない。
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

const DATE = "2026-08-16";

/** 各記事が評価を集約すべきハブ（本文に必須の内部リンク）。verify() で機械検査する */
const REQUIRED_HUB_LINKS: Record<string, string[]> = {
  "souzoku-hajime-koseki-chosa-bunkyo": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
  ],
  "isan-bunkatsu-kyougisho": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
  ],
  "houtei-souzoku-jouhou-ichiran-zu": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
  ],
};

/** 表示コンプライアンス上の禁止語 */
const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "one-stop", "一気通貫"];

/** 記事ごとに必ず含めるべき表現（機械ゲート。最低限の合否判定） */
const REQUIRED_PHRASES: Record<string, string[]> = {
  "souzoku-hajime-koseki-chosa-bunkyo": [
    "courts.go.jp/saiban/syurui/syurui_kazi/kazi_06_13",
    "nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4205",
    "必要な戸籍の範囲、請求先の数、手続にかけられる時間",
  ],
  "isan-bunkatsu-kyougisho": [
    "10年",
    "法定相続情報一覧図",
    "実印",
    "印鑑証明書",
    "houmukyoku.moj.go.jp/homu/page7_000014",
    "houmukyoku.moj.go.jp/sapporo/page000236",
  ],
  "houtei-souzoku-jouhou-ichiran-zu": [
    "法定相続情報証明制度",
    "相続関係説明図",
    "認証文",
    "5年",
    "遺産分割の内容",
    "法定相続情報番号",
    "法定相続情報を識別するために登記官が付す",
    "住所を証する書面",
    "被相続人の相続人（又はその相続人）",
    "自らの資格では再交付を受けることができません",
    "提出の手間を減らせるのがこの制度の利用目的",
    "houmukyoku.moj.go.jp/homu/page7_000014",
    "houmukyoku.moj.go.jp/sapporo/page000236",
  ],
};

/** 記事ごとに含めてはならない表現 */
const FORBIDDEN_PHRASES: Record<string, string[]> = {
  "souzoku-hajime-koseki-chosa-bunkyo": ["トレードオフ"],
  "isan-bunkatsu-kyougisho": ["独占業務"],
  "houtei-souzoku-jouhou-ichiran-zu": [
    "戸籍の束を1枚",
    "唯一の番号",
    "印鑑登録証明書",
    "手間と取得費用",
    "相続登記は司法書士",
  ],
};

/** 本セット外へ張る既存legalコラムslug（リポジトリの他シードで実在確認済み） */
const KNOWN_EXISTING_LEGAL_SLUGS = new Set([
  "taiwan-koseki-jokoseki-shutoku",
  "taiwan-inkan-shomei-isan-bunkatsu",
  "denshi-keiyaku-enpo-inin-kami",
]);

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
    file: "02-souzoku-hajime-koseki-chosa-bunkyo.md",
    slug: "souzoku-hajime-koseki-chosa-bunkyo",
    title: "相続は何から始める？文京区で進める戸籍収集・相続人調査と行政書士に頼めること",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続手続の初期段階で重要なのが、「誰が相続人か」「どんな財産があるか」を確認することです。戸籍収集と相続人調査の進め方、2024年開始の戸籍の広域交付、相続関係説明図と法定相続情報一覧図の違い、行政書士に依頼できる範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "相続 戸籍 収集 行政書士",
      "相続人調査 文京区",
      "相続関係説明図 法定相続情報一覧図 違い",
      "戸籍 広域交付 代理人 対象外",
      "相続 何から始める 文京区",
      "行政書士 相続 文京区 相談",
    ],
    tags: ["相続", "戸籍", "相続人調査", "広域交付", "相続関係説明図", "法定相続情報一覧図"],
  },
  {
    file: "03-isan-bunkatsu-kyougisho.md",
    slug: "isan-bunkatsu-kyougisho",
    title: "遺産分割協議書は自分で作れる？必要書類・書き方のポイントと行政書士に頼めること",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "遺産分割協議書は、相続人全員が遺産の分け方について合意した内容を文書にしたものです。法定相続情報一覧図との違い、実印・印鑑証明書の使い分け、行政書士に頼める範囲と頼めないことを文京区の実務に沿って整理しました。",
    keywords: [
      "遺産分割協議書 作り方",
      "遺産分割協議書 必要書類",
      "遺産分割協議書 行政書士",
      "遺産分割協議書 印鑑証明書",
      "遺産分割協議書 相続登記",
      "遺産分割協議書 法定相続情報一覧図 違い",
    ],
    tags: ["遺産分割協議書", "相続", "印鑑証明書", "法定相続情報一覧図", "相続登記", "行政書士"],
  },
  {
    file: "04-houtei-souzoku-jouhou-ichiran-zu.md",
    slug: "houtei-souzoku-jouhou-ichiran-zu",
    title: "法定相続情報一覧図とは？戸籍一式の代わりに利用できる制度と申出のしかた",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "法定相続情報一覧図は、戸籍から判明する法定相続人を一覧にした図で、法定相続情報証明制度として法務局へ申出ると登記官の認証文付きの写しを交付してもらえます。相続関係説明図との違い、申出方法、5年保存・再交付、行政書士に頼める範囲を整理しました。",
    keywords: [
      "法定相続情報一覧図 とは",
      "法定相続情報証明制度",
      "法定相続情報一覧図 作り方",
      "法定相続情報一覧図 申出",
      "法定相続情報一覧図 相続関係説明図 違い",
      "法定相続情報一覧図 再交付",
    ],
    tags: ["法定相続情報一覧図", "法定相続情報証明制度", "相続", "戸籍", "相続関係説明図", "行政書士"],
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
  const dir = resolve(process.cwd(), "scripts", "legal-columns");
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

    // /legal/column/<slug> リンク＝本セット内 or 既存実在slugのみ許可
    const legalLinks = [...c.content.matchAll(/\]\(\/legal\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of legalLinks) {
      if (!slugs.has(l) && !KNOWN_EXISTING_LEGAL_SLUGS.has(l)) {
        notes.push(`NG: ${c.slug} → 不明legal slug ${l}`);
      }
    }

    for (const w of FORBIDDEN_WORDS) {
      if (c.content.includes(w)) notes.push(`NG: ${c.slug} に禁止語「${w}」あり`);
    }

    // 事業体をまたぐ言及には分離受任の明示（JA判定語）
    if (!c.content.includes("独立した事業体")) {
      notes.push(`NG: ${c.slug} に分離受任の明示（「独立した事業体」）なし`);
    }
    // 不動産側 /souzoku への導線には「別事業体」であることの明示
    if (!c.content.includes("別事業体")) {
      notes.push(`NG: ${c.slug} に /souzoku 導線の「別事業体」明示なし`);
    }
    // 各専門家は独立契約・紹介料を受け取らない旨の明示（ユーザー修正事項3）
    if (!c.content.includes("紹介料を受け取りません")) {
      notes.push(`NG: ${c.slug} に「紹介料を受け取りません」の明示なし`);
    }

    // 執筆者経歴の禁止表現（luck428-column-seo v2.9 第9条）
    if (c.content.includes("中国総局長として中国や台湾") || c.content.includes("記者歴34年")) {
      notes.push(`NG: ${c.slug} の執筆者経歴に禁止表現あり`);
    }

    if (!c.content.includes("## この記事の出典（一次情報）")) {
      notes.push(`NG: ${c.slug} に出典節なし`);
    }

    // 記事ごとの必須表現・禁止表現
    for (const phrase of REQUIRED_PHRASES[c.slug] ?? []) {
      if (!c.content.includes(phrase)) notes.push(`NG: ${c.slug} に必須表現「${phrase}」なし`);
    }
    for (const phrase of FORBIDDEN_PHRASES[c.slug] ?? []) {
      if (c.content.includes(phrase)) notes.push(`NG: ${c.slug} に禁止表現「${phrase}」あり`);
    }

    if (!c.content.includes("一般的な情報提供")) {
      notes.push(`NG: ${c.slug} に判断留保の記載なし`);
    }
  }
  return notes;
}

async function main() {
  if (process.argv.includes("--write")) {
    console.error(
      "--write は用意していません。本番投入は /admin/columns/seed-souzoku-legal（管理者セッション経由）を正とします。",
    );
    process.exit(1);
  }
  const emitTs = process.argv.includes("--emit-ts");
  const cols = buildColumns();
  const notes = verify(cols);

  if (emitTs) {
    if (notes.some((n) => n.startsWith("NG"))) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(process.cwd(), "src/lib/data/souzoku-legal-columns-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-souzoku-legal-columns.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/legal-columns/02-souzoku-hajime-koseki-chosa-bunkyo.md。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-souzoku-legal からの管理者セッション経由バルクupsert（seed-denshi-keiyaku と同型）。\n\nexport type SouzokuLegalSeedColumn = {\n  business: "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const SOUZOKU_LEGAL_COLUMNS_SEED: SouzokuLegalSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "相続コラム（行政書士）シリーズ。原稿md（scripts/legal-columns/NN-*.md）から生成。投入は /admin/columns/seed-souzoku-legal。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
    })),
  };
  const out = resolve(process.cwd(), "scripts", "souzoku-legal-columns.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}`);
  console.log(preview.verification.join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
