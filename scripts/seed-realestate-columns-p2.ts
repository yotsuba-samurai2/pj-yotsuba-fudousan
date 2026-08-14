/**
 * 不動産コラム 第2弾（3本）投入スクリプト
 *
 * 対象＝luck428.com /column（business=realestate）。コラムプロット_5本_2026-08-14 の①③④。
 * 原稿＝scripts/realestate-columns/04〜06 の *.md（法令・期限は実装時にWebで一次確認済み。
 * 残る未検証事項は本文の「この記事の出典」節に **未検証** と明記）。
 *
 * 勝ち筋3本への配分＝物件×許認可1（④民泊…04）・相続2（③賃貸相続…05、④登記義務化…06）。
 * カニバリ回避＝サイトマップ全URL照合済み（2026-08-14・slug衝突なし）：
 *   - 04 minpaku-bukken-joken-kakunin：/minpaku（サービス案内）が主力、本記事は物件条件の深掘り
 *   - 05 chintai-apart-souzoku-hikitsugi：owner-change-shikikin-shokei（売買）と相続で分担・相互リンク
 *   - 06 souzoku-toki-gimuka-baikyaku：jusho-henko-toki-gimuka-2026（住所変更＝別制度）と分担・相互リンク
 *
 * ⑤（chuka-fudosan-pro-kyodo-torihiki）は scripts/realestate-columns/drafts/ に退避。
 * 石井弁護士確認前は公開しないため、本スクリプトの対象外（p3で4言語展開の予定）。
 *
 * seed-realestate-columns.ts と同型：dry-run 既定 → preview JSON、--emit-ts で admin 投入ページ用
 * の seed データを生成。本番投入は /admin/columns/seed-realestate-p2 の管理者セッション経由を正とする
 * （seed-realestate と同じ理由＝本番環境変数がSensitive設定のため）。
 *
 * 使い方:
 *   npx tsx scripts/seed-realestate-columns-p2.ts            # dry-run（scripts/realestate-columns-p2.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-realestate-columns-p2.ts --emit-ts  # src/lib/data/realestate-columns-p2-seed.ts を生成
 *
 * 設計メモ:
 *   - FAQ は本文md「## よくある質問」から自動パース（各記事4問）。faq.answer は JSON-LD 向けに平文化。
 *   - upsert キー＝ @@unique([business, slug])。再実行しても重複しない。
 *   - locales: ["ja"]＝日本語のみ公開（多言語展開は別タスク）。
 *   - 表示コンプライアンス＝shigyo-compliance-gate / luck428-column-seo v2.9 準拠：
 *     禁止語（ワンストップ・一括対応・一体で）不使用／分離受任の明示（「独立した事業体」を機械検査）／
 *     可否の断定なし（最終確認は自治体窓口・所轄消防署・法務局等）／登記=司法書士・税務=税理士を明記・
 *     紹介料を受け取らない旨を明記／執筆者経歴に「中国総局長として中国や台湾、タイに駐在」等の禁止表現を使わない。
 *   - 一次確認の記録（2026-08-14）：住宅宿泊事業法＝平成29年法律第65号（e-Gov）／180日と算定方法
 *     （民泊制度ポータル）／文京区の対象地域・日曜正午〜金曜正午（区公式）／相続登記の施行日・3年・
 *     令和9年3月31日・過料10万円以下・相続人申告登記の限界（法務省Q＆A 令和7年3月27日現在）／
 *     最判平成17年9月8日＝民集59巻7号1931頁。
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";

type Faq = { question: string; answer: string };

type SeedColumn = {
  business: "realestate";
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
  title: "代表取締役・宅地建物取引士（四葉不動産株式会社）",
} as const;

const DATE = "2026-08-14";

/** 各記事が評価を集約すべきハブ（本文に必須の内部リンク）。verify() で機械検査する */
const REQUIRED_HUB_LINKS: Record<string, string[]> = {
  "minpaku-bukken-joken-kakunin": ["/minpaku", "/toushi"],
  "chintai-apart-souzoku-hikitsugi": ["/souzoku"],
  "souzoku-toki-gimuka-baikyaku": ["/souzoku"],
};

/** 本セット外へ張る既存コラムslug（サイトマップで実在確認済み 2026-08-14） */
const KNOWN_EXISTING_COLUMN_SLUGS = new Set([
  "inuki-bukken-keiyakumae-hokenjo",
  "owner-change-shikikin-shokei",
  "souzoku-jikka-uru-nokosu",
  "jusho-henko-toki-gimuka-2026",
  "kenrisho-nakute-mo-ureru",
]);

/** /legal/column 側へ張る既存slug（同上） */
const KNOWN_EXISTING_LEGAL_SLUGS = new Set(["isan-bunkatsu-kyougisho"]);

/** 表示コンプライアンス上の禁止語 */
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
    file: "04-minpaku-bukken-joken-kakunin.md",
    slug: "minpaku-bukken-joken-kakunin",
    title: "民泊を始められる物件の条件──用途地域・管理規約・消防設備はどう確認するか",
    category: "事業用不動産",
    excerpt:
      "民泊（住宅宿泊事業）は届出制ですが、どの物件でもできるわけではありません。契約前に確認すべきは、①自治体条例による区域・期間の制限、②マンションなら管理規約、③消防法令への適合の3点です。文京区では対象地域で日曜正午から金曜正午まで営業できません（区公式・2026年8月14日参照）。180日の数え方、転貸型で必要な貸主の承諾、消防法令適合通知書までの手順を、契約前のチェックリストとして整理しました。",
    keywords: [
      "民泊 物件 条件",
      "民泊 用途地域",
      "マンション 民泊 できない",
      "民泊 管理規約 禁止",
      "民泊 消防法令適合通知書",
      "文京区 民泊 条例",
    ],
    tags: ["民泊", "事業用不動産", "用途地域", "管理規約", "消防法"],
  },
  {
    file: "05-chintai-apart-souzoku-hikitsugi.md",
    slug: "chintai-apart-souzoku-hikitsugi",
    title: "賃貸アパートを相続したら──入居者との契約・敷金・家賃はどう引き継がれるか",
    category: "相続",
    excerpt:
      "賃貸中のアパートを相続すると、入居者との賃貸借契約と敷金の返還義務は自動的に相続人へ引き継がれます（民法896条）。入居者に退去してもらう必要はありません。遺産分割までの家賃は、判例により法定相続分どおり各相続人が取得します（最高裁平成17年9月8日判決）。口座凍結への対応、管理会社との調整、入居者がいるまま売るオーナーチェンジという選択肢まで、引き継ぎの実務を順に説明します。",
    keywords: [
      "アパート 相続 契約",
      "相続 敷金 返還 義務",
      "相続 家賃 誰のもの",
      "遺産分割前 賃料 帰属",
      "大家 死亡 賃貸借契約",
      "オーナーチェンジ 相続",
    ],
    tags: ["相続", "賃貸経営", "敷金", "遺産分割", "オーナーチェンジ"],
  },
  {
    file: "06-souzoku-toki-gimuka-baikyaku.md",
    slug: "souzoku-toki-gimuka-baikyaku",
    title: "相続登記をしないまま実家は売れますか──義務化・過料と売却の順序",
    category: "相続",
    excerpt:
      "相続登記をしないまま実家を売ることはできません。買主へ所有権を移す前提として、先に相続登記が必要です。相続登記は2024年4月1日から義務になり、正当な理由なく期限を過ぎると10万円以下の過料の対象。義務化前に相続した不動産も対象で、期限は2027年3月31日です（法務省Q＆A・2026年8月14日参照）。相続人申告登記では売却できない理由、住所変更登記の義務化との違い、売却までの順序を整理しました。",
    keywords: [
      "相続登記 しないまま 売却",
      "相続登記 義務化 いつまで",
      "相続登記 過料 10万円",
      "相続人申告登記 売却できない",
      "相続登記 2027年3月31日",
      "実家 名義変更 売却",
    ],
    tags: ["相続", "相続登記", "義務化", "売却", "実家"],
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
  const dir = resolve(process.cwd(), "scripts", "realestate-columns");
  return ARTICLES.map((a) => {
    const content = readFileSync(join(dir, a.file), "utf-8").trim();
    const faq = parseFaq(content, a.file);
    return {
      business: "realestate" as const,
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

    // /column/<slug> リンク＝本セット内 or 既存実在slugのみ許可
    const links = [...c.content.matchAll(/\]\(\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of links) {
      if (!slugs.has(l) && !KNOWN_EXISTING_COLUMN_SLUGS.has(l)) {
        notes.push(`NG: ${c.slug} → 不明slug ${l}`);
      }
    }
    const legalLinks = [...c.content.matchAll(/\]\(\/legal\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of legalLinks) {
      if (!KNOWN_EXISTING_LEGAL_SLUGS.has(l)) notes.push(`NG: ${c.slug} → 不明legal slug ${l}`);
    }

    for (const w of FORBIDDEN_WORDS) {
      if (c.content.includes(w)) notes.push(`NG: ${c.slug} に禁止語「${w}」あり`);
    }

    // 事業体をまたぐ言及には分離受任の明示（JA判定語）
    if (!c.content.includes("独立した事業体")) {
      notes.push(`NG: ${c.slug} に分離受任の明示（「独立した事業体」）なし`);
    }

    // 独占業務の範囲（lessons 2026-07-19 C-2）
    if (/作成・提出[^。]{0,40}独占業務/.test(c.content)) {
      notes.push(`NG: ${c.slug} に「作成・提出＝独占業務」の誤表現あり`);
    }

    // 執筆者経歴の禁止表現（luck428-column-seo v2.9 第9条）
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
      "--write は用意していません。本番投入は /admin/columns/seed-realestate-p2（管理者セッション経由）を正とします。",
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
    const out = resolve(process.cwd(), "src/lib/data/realestate-columns-p2-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-realestate-columns-p2.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/realestate-columns/04〜06 の *.md。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-realestate-p2 からの管理者セッション経由バルクupsert（seed-realestate と同型）。\n\nexport type RealestateSeedColumnP2 = {\n  business: "realestate";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const REALESTATE_COLUMNS_P2_SEED: RealestateSeedColumnP2[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "不動産コラム第2弾（3本＝プロット①③④）。原稿md（scripts/realestate-columns/04〜06）から生成。投入は /admin/columns/seed-realestate-p2。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
    })),
  };
  const out = resolve(process.cwd(), "scripts", "realestate-columns-p2.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}`);
  console.log(preview.verification.join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
