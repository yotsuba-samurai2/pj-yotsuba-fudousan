/**
 * 不動産コラム（3本）投入スクリプト
 *
 * 対象＝luck428.com /column（business=realestate）。2026-07-25 浦松承認のテーマ3本。
 * 原稿＝scripts/realestate-columns/*.md（法令・統計は実装時にWebで裏取り済み。未検証事項は本文の
 * 「この記事の出典」節に **未検証** と明記）。
 *
 * 既存の /column は相続・空き家クラスタに4本が偏在し、コラムトップの meta description が謳う
 * 「部屋探し・契約書の読み方」および H1 リード文の「外国人の住まい探し」に対応する記事が0本だった。
 * 本3本はその空白クラスタを埋め、支えるサービスページ（/global・/kaigo・/toushi・/services）へ
 * 評価を集約する。グループホーム・クラスタの役割分担（luck428-column-seo 第2条）は崩さない
 * ＝02 は通所/訪問系に限定し、居住系は /group-home へ送出するのみ。
 *
 * seed-office-columns.ts と同型：dry-run 既定 → preview JSON、--write で本番upsert、
 * --emit-ts で admin 投入ページ用の seed データを生成。
 *
 * 使い方:
 *   npx tsx scripts/seed-realestate-columns.ts            # dry-run（scripts/realestate-columns.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-realestate-columns.ts --write     # DATABASE_URL/DIRECT_URL を設定して本番upsert（冪等）
 *   npx tsx scripts/seed-realestate-columns.ts --emit-ts   # src/lib/data/realestate-columns-seed.ts を生成
 *                                                          #（本番環境変数がSensitive設定でenv pull不可のため、
 *                                                          #  GH/officeと同型の admin 経由投入を正とする）
 *
 * 設計メモ:
 *   - FAQ は本文md「## よくある質問」から自動パース＝本文が単一ソース（FAQPage JSON-LD は
 *     (realestate)/column/[slug] の FAQJsonLd が faq フィールドから出力）。各記事4問。
 *   - faq.answer は JSON-LD 向けに Markdown リンク [text](url) → text へ平文化する（本文表示はmdのまま）。
 *   - upsert キー＝ @@unique([business, slug])。再実行しても重複しない。
 *   - locales: ["ja"]＝日本語のみ公開（多言語展開は別タスク。未公開ロケールのhreflangは
 *     availableLocales で抑止される＝2026-07-15 GSC 404対応の設計に乗る）。
 *   - 表示コンプライアンス（tasks/lessons.md 2026-07-19 C-2）＝
 *     独占業務は「作成」のみ。「作成・提出は独占業務」と書かない／禁止語（ワンストップ・一括対応・一体で）不使用／
 *     可否の断定なし（「最終確認は特定行政庁・所轄消防署の窓口」）／登記=司法書士・訴訟=弁護士・設計=建築士を明記。
 *   - 代表経歴は「中国総局長として中国や台湾、タイに駐在しました」（国数表記は使わない＝lessons 2026-07-08）。
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

const DATE = "2026-07-25";

/** 各記事が評価を集約すべきハブ（本文に必須の内部リンク）。verify() で機械検査する */
const REQUIRED_HUB_LINKS: Record<string, string[]> = {
  "gaikokujin-nyukyo-oya-no-fuan": ["/global", "/services"],
  "kaigo-jigyousho-bukken-youto-chiiki": ["/kaigo", "/toushi", "/group-home"],
  "chintaishaku-keiyakusho-doko-wo-yomu": ["/services", "/faq"],
};

/** 表示コンプライアンス上の禁止語（固有名詞での例外は本3本に存在しない） */
const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "one-stop"];

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
    file: "01-gaikokujin-nyukyo-oya-no-fuan.md",
    slug: "gaikokujin-nyukyo-oya-no-fuan",
    title: "外国人に部屋を貸すのは、本当にリスクか──断る前に大家さんが確認したい3つのこと",
    category: "外国人の住まい",
    excerpt:
      "「外国人はちょっと」と断る前に。家賃、近隣トラブル、失踪という3つの不安を分解すると、その多くは在留カードの確認と保証会社、そして入居者が読める言語でのルール提示で手当てできます。一方で「連絡が取れなくなったら荷物を処分できる」という特約は、契約書に書いても効きません（自力救済の禁止）。備えるべきは在留期間満了日の管理と緊急連絡先の二重取得です。令和7年末の在留外国人は412万人。文京区の宅建士が貸主目線で整理しました。",
    keywords: [
      "外国人 賃貸 大家",
      "外国人 入居審査",
      "外国人 部屋 貸す 不安",
      "在留カード 確認 賃貸",
      "賃借人 行方不明 残置物",
      "追い出し条項 無効",
    ],
    tags: ["外国人", "賃貸", "貸主向け", "入居審査", "残置物"],
  },
  {
    file: "02-kaigo-jigyousho-bukken-youto-chiiki.md",
    slug: "kaigo-jigyousho-bukken-youto-chiiki",
    title: "介護事業所の物件が見つからない本当の理由──用途地域と消防法、そして大家さんの誤解",
    category: "事業用不動産",
    excerpt:
      "人員も資金計画も整っているのに、物件だけが半年決まらない。介護・障害福祉サービスの開業でいちばん多い詰まりどころを、用途地域・用途変更の確認申請と検査済証・消防法・貸主側の懸念という4つの壁に分けて整理しました。訪問介護事業所が「老人福祉センターその他これに類するもの」として扱われ得ることは、実務で見落とされがちです。確認の順番を間違えないための記事です。",
    keywords: [
      "介護事業所 物件 探し方",
      "事業用 賃貸 用途地域",
      "訪問介護 事務所 用途地域",
      "デイサービス 消防法 スプリンクラー",
      "用途変更 確認申請 200㎡",
      "検査済証 ない 用途変更",
    ],
    tags: ["事業用不動産", "介護", "障害福祉", "用途地域", "消防法", "用途変更"],
  },
  {
    file: "03-chintaishaku-keiyakusho-doko-wo-yomu.md",
    slug: "chintaishaku-keiyakusho-doko-wo-yomu",
    title: "賃貸借契約書、どこを読めばいいか──宅建士が「ここだけは」と言う5つの条項",
    category: "賃貸の基礎",
    excerpt:
      "契約日に読み上げられる書類の束を、その場で理解するのは分量の面で無理があります。全部は読まなくて構いません。後から揉めるのは決まった場所です。普通借家か定期借家か、解約予告期間、更新料、原状回復の特約欄、禁止事項と使用目的——説明する側の宅建士が「ここだけは先に見てほしい」と考える5つの条項と、重要事項説明を契約前に受けるという原則を整理しました。",
    keywords: [
      "賃貸借契約書 読み方",
      "重要事項説明 わかりやすく",
      "原状回復 特約 有効",
      "定期借家契約 注意点",
      "解約予告期間",
      "敷金 民法 622条の2",
    ],
    tags: ["賃貸", "契約", "借主向け", "原状回復", "重要事項説明"],
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
  const dir = resolve(__dirname, "realestate-columns");
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

    // 冒頭の結論先出し（GH/office と同型の読者導線）
    if (!c.content.startsWith("**結論（先に要点）**：")) {
      notes.push(`NG: ${c.slug} が「**結論（先に要点）**：」で始まっていない`);
    }

    // ハブへの必須リンク（評価の集約先）
    for (const hub of REQUIRED_HUB_LINKS[c.slug] ?? []) {
      if (!c.content.includes(`](${hub})`)) notes.push(`NG: ${c.slug} に ${hub} リンクなし`);
    }

    // 姉妹コラムの相互リンク先slugが本セット内に実在するか
    const links = [...c.content.matchAll(/\]\(\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of links) if (!slugs.has(l)) notes.push(`NG: ${c.slug} → 不明slug ${l}`);

    // 表示コンプライアンス：禁止語
    for (const w of FORBIDDEN_WORDS) {
      if (c.content.includes(w)) notes.push(`NG: ${c.slug} に禁止語「${w}」あり`);
    }

    // 表示コンプライアンス：独占業務の範囲（lessons 2026-07-19 C-2）
    // 独占業務は「官公署提出書類の作成」のみ。「作成・提出は…独占業務」と書かない。
    if (/作成・提出[^。]{0,40}独占業務/.test(c.content)) {
      notes.push(`NG: ${c.slug} に「作成・提出＝独占業務」の誤表現あり`);
    }

    // 出典・判断留保の節が存在するか
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
    const out = resolve(__dirname, "../src/lib/data/realestate-columns-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-realestate-columns.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/realestate-columns/*.md。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-realestate からの管理者セッション経由バルクupsert（gh-columns-seed / office-columns-seed と同型）。\n\nexport type RealestateSeedColumn = {\n  business: "realestate";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const REALESTATE_COLUMNS_SEED: RealestateSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "不動産コラム（3本）。原稿md（scripts/realestate-columns/）から生成。--write でupsert。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
    })),
  };
  writeFileSync(
    resolve(__dirname, "realestate-columns.preview.json"),
    JSON.stringify(preview, null, 2),
  );
  console.log(`preview → scripts/realestate-columns.preview.json（${cols.length}本）`);
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
