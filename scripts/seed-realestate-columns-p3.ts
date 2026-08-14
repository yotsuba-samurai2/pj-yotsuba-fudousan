/**
 * 不動産コラム 第3弾（1本・4言語）投入スクリプト
 *
 * 対象＝luck428.com /column（business=realestate）。コラムプロット_5本_2026-08-14 の⑤
 * 「中華圏の不動産会社・営業担当の方へ」。
 *
 * 公開経緯：宅建業法3条「業として媒介」の海外業者の関与形態の線引きは石井弁護士の確認待ちだったため
 * drafts/ に退避していた。2026-08-14 石井弁護士の確認完了（現行原稿のまま公開可＝浦松確認）を受けて
 * 昇格。本文は一般論に留め、報酬分配・紹介料には一切触れない構成を維持している（verify()で機械検査）。
 *
 * 原稿＝scripts/realestate-columns/07-chuka-fudosan-pro-kyodo-torihiki.md（ja・正本）
 * 翻訳＝scripts/realestate-columns/{zh,zh-tw,en}/07-chuka-fudosan-pro-kyodo-torihiki.md
 *   （frontmatter＝title/excerpt/category、本文は簡体字・繁体字を別々に執筆。訳語は#243の規律に準拠：
 *     条項号＝繁「第◯條」・簡「第◯条」で「款」不可／法令名は日本語漢字のまま／日本の資格は初出に説明／
 *     事務所名＝zh「四叶不动产株式会社」・zh-tw「四葉不動產株式會社」（既存seedの表記に一致）／
 *     翻訳内の内部リンクは既存4言語コラムと同じくロケール接頭辞なしの絶対URL）
 *
 * locales: []＝全言語公開（column-shared の仕様。translations 3言語が揃っているため4言語同時公開）。
 *
 * 使い方:
 *   npx tsx scripts/seed-realestate-columns-p3.ts            # dry-run（scripts/realestate-columns-p3.preview.json）
 *   npx tsx scripts/seed-realestate-columns-p3.ts --emit-ts  # src/lib/data/realestate-columns-p3-seed.ts を生成
 *
 * 本番投入は /admin/columns/seed-realestate-p3（管理者セッション経由・冪等upsert）を正とする。
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

type Faq = { question: string; answer: string };

type Translation = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
};

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
  translations: { en: Translation; "zh-tw": Translation; zh: Translation };
};

const SLUG = "chuka-fudosan-pro-kyodo-torihiki";
const DATE = "2026-08-14";

const META = {
  title: "中華圏の不動産会社・営業担当の方へ──日本の宅建業者と組んで日本の物件取引を進める方法",
  category: "海外の不動産会社向け",
  excerpt:
    "日本国内の不動産売買を業として媒介するには、日本の宅地建物取引業の免許が必要です。免許のない海外の会社は、日本の宅建業者と役割を分けて取引を進めます。顧客に日本の物件を紹介したい中華圏の不動産会社・営業担当の方に向けて、役割分担の表、重要事項説明を誰が行うか、売主が非居住者の場合の決済、一棟・複数戸をまとめた取引の進め方、四葉不動産に頼めることを整理しました。相談は無料で、中国語（簡体字・繁体字）でそのままお問い合わせいただけます。",
  keywords: [
    "日本 不動産 海外業者 提携",
    "日本 不动产 中介 合作",
    "日本 房产 中介 牌照",
    "宅建業 免許 海外",
    "非居住者 売主 源泉徴収",
    "重要事項説明 中国語",
  ],
  tags: ["中華圏", "業者間協業", "宅建業法", "非居住者", "海外パートナー"],
} as const;

const AUTHOR = {
  name: "浦松 丈二",
  title: "代表取締役・宅地建物取引士（四葉不動産株式会社）",
} as const;

/** 評価を集約するハブ（ja本文に必須の内部リンク） */
const REQUIRED_HUB_LINKS = ["/kaigai-owner", "/global/chinese"];

/** 本セット外へ張る既存コラムslug（サイトマップで実在確認済み 2026-08-14） */
const KNOWN_EXISTING_COLUMN_SLUGS = new Set([
  "takken-menkyo-bangou-shoukai",
  "hikyojusha-fudosan-shutoku-gaitameho-houkoku",
  "hikyojusha-hantei-hikiwatashi-bi",
]);

/** 全言語共通の禁止語（一体提供＋⑤固有＝報酬分配・紹介料に触れない） */
const FORBIDDEN_WORDS = [
  "ワンストップ",
  "一括対応",
  "一体で",
  "一気通貫",
  "one-stop",
  "一站式",
  "紹介料",
  "介紹費",
  "介绍费",
  "referral fee",
  "報酬分配",
  "报酬分配",
  "報酬の分配",
];

function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

function parseFaq(content: string, label: string): Faq[] {
  const m = content.match(/## よくある質問\n([\s\S]*?)(?=\n## |$)/);
  if (!m) throw new Error(`${label}: 「## よくある質問」節が見つかりません`);
  const faqs: Faq[] = [];
  const re = /\*\*Q\.\s*([\s\S]*?)\*\*\n(A\.\s*[\s\S]*?)(?=\n\*\*Q\.|\s*$)/g;
  let q: RegExpExecArray | null;
  while ((q = re.exec(m[1])) !== null) {
    faqs.push({
      question: toPlainText(q[1]),
      answer: toPlainText(q[2].replace(/^A\.\s*/, "")),
    });
  }
  if (faqs.length === 0) throw new Error(`${label}: FAQを1件もパースできません`);
  return faqs;
}

/** frontmatter（---…---）を {meta, body} に分ける */
function parseFrontmatter(raw: string, label: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${label}: frontmatterが見つかりません`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").trim();
  }
  for (const key of ["title", "excerpt", "category"]) {
    if (!meta[key]) throw new Error(`${label}: frontmatterに ${key} がありません`);
  }
  return { meta, body: m[2].trim() };
}

function readTranslation(locale: "zh" | "zh-tw" | "en"): Translation {
  const p = resolve(process.cwd(), "scripts", "realestate-columns", locale, `07-${SLUG}.md`);
  const { meta, body } = parseFrontmatter(readFileSync(p, "utf-8"), `${locale}/07-${SLUG}.md`);
  return { title: meta.title, excerpt: meta.excerpt, category: meta.category, content: body };
}

function buildColumn(): SeedColumn {
  const jaPath = resolve(process.cwd(), "scripts", "realestate-columns", `07-${SLUG}.md`);
  const content = readFileSync(jaPath, "utf-8").trim();
  return {
    business: "realestate",
    slug: SLUG,
    title: META.title,
    date: DATE,
    category: META.category,
    excerpt: META.excerpt,
    content,
    status: "published",
    author: { ...AUTHOR },
    keywords: [...META.keywords],
    tags: [...META.tags],
    locales: [], // 空配列＝全言語（translations 3言語が揃っている前提）
    faq: parseFaq(content, "ja"),
    translations: {
      en: readTranslation("en"),
      "zh-tw": readTranslation("zh-tw"),
      zh: readTranslation("zh"),
    },
  };
}

function verify(c: SeedColumn): string[] {
  const notes: string[] = [];

  // ja本文
  if (!c.content.startsWith("**結論（先に要点）**：")) {
    notes.push("NG: ja が「**結論（先に要点）**：」で始まっていない");
  }
  if (c.faq.length !== 4) notes.push(`WARN: FAQが${c.faq.length}件（想定4件）`);
  if (c.content.length < 2000) notes.push(`WARN: ja本文が短い（${c.content.length}字）`);
  for (const hub of REQUIRED_HUB_LINKS) {
    if (!c.content.includes(`](${hub})`)) notes.push(`NG: ja に ${hub} リンクなし`);
  }
  const links = [...c.content.matchAll(/\]\(\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
  for (const l of links) {
    if (l !== c.slug && !KNOWN_EXISTING_COLUMN_SLUGS.has(l)) notes.push(`NG: ja → 不明slug ${l}`);
  }
  if (!c.content.includes("独立した事業体")) notes.push("NG: ja に分離受任の明示なし");
  if (!c.content.includes("## この記事の出典（一次情報）")) notes.push("NG: ja に出典節なし");
  if (!c.content.includes("一般的な情報提供")) notes.push("NG: ja に判断留保なし");
  if (c.content.includes("中国総局長として中国や台湾") || c.content.includes("記者歴34年")) {
    notes.push("NG: ja の執筆者経歴に禁止表現あり");
  }

  // 全言語共通
  const texts: Array<[string, string]> = [
    ["ja", c.content + c.excerpt],
    ["en", c.translations.en.content + c.translations.en.excerpt],
    ["zh-tw", c.translations["zh-tw"].content + c.translations["zh-tw"].excerpt],
    ["zh", c.translations.zh.content + c.translations.zh.excerpt],
  ];
  for (const [loc, text] of texts) {
    for (const w of FORBIDDEN_WORDS) {
      if (text.toLowerCase().includes(w.toLowerCase())) notes.push(`NG: ${loc} に禁止語「${w}」あり`);
    }
  }

  // 分離受任の明示（言語別の判定語）
  if (!c.translations.zh.content.includes("独立的事业体")) notes.push("NG: zh に分離受任の明示なし");
  if (!c.translations["zh-tw"].content.includes("獨立的事業體")) notes.push("NG: zh-tw に分離受任の明示なし");
  if (!c.translations.en.content.toLowerCase().includes("independent businesses")) {
    notes.push("NG: en に分離受任の明示なし");
  }

  // 簡体字は条項号に「款」を使わない
  if (/第[0-9０-９一二三四五六七八九十]+款/.test(c.translations.zh.content)) {
    notes.push("NG: zh の条項号に「款」あり");
  }

  // 翻訳の内部リンクは絶対URL（ロケール接頭辞なし・#243と同じ規律）
  for (const loc of ["en", "zh-tw", "zh"] as const) {
    if (/\]\(\/(?!\/)/.test(c.translations[loc].content)) {
      notes.push(`NG: ${loc} に相対パスの内部リンクあり（絶対URLに揃える）`);
    }
  }

  // ブランド名の表記（既存seedに一致させる）
  if (!c.translations.zh.content.includes("四叶不动产株式会社")) notes.push("WARN: zh のブランド表記を確認");
  if (!c.translations["zh-tw"].content.includes("四葉不動產株式會社")) notes.push("WARN: zh-tw のブランド表記を確認");

  return notes;
}

async function main() {
  const emitTs = process.argv.includes("--emit-ts");
  if (process.argv.includes("--write")) {
    console.error("--write は用意していません。本番投入は /admin/columns/seed-realestate-p3 を正とします。");
    process.exit(1);
  }
  const col = buildColumn();
  const notes = verify(col);

  if (emitTs) {
    if (notes.some((n) => n.startsWith("NG"))) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(process.cwd(), "src/lib/data/realestate-columns-p3-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-realestate-columns-p3.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/realestate-columns/07-chuka-fudosan-pro-kyodo-torihiki.md（ja）＋{zh,zh-tw,en}/07-*.md（翻訳）。\n// 修正はmd側→再生成で行う。用途＝/admin/columns/seed-realestate-p3 からの管理者セッション経由upsert。\n\nexport type RealestateSeedColumnP3 = {\n  business: "realestate";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n  translations: {\n    en: { title: string; excerpt: string; content: string; category?: string };\n    "zh-tw": { title: string; excerpt: string; content: string; category?: string };\n    zh: { title: string; excerpt: string; content: string; category?: string };\n  };\n};\n\nexport const REALESTATE_COLUMNS_P3_SEED: RealestateSeedColumnP3[] = `;
    writeFileSync(out, header + JSON.stringify([col], null, 2) + ";\n");
    console.log(`emit-ts → ${out}（1本・4言語）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "不動産コラム第3弾（1本・4言語＝プロット⑤）。石井弁護士確認済（2026-08-14）。投入は /admin/columns/seed-realestate-p3。",
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    article: {
      ...col,
      content: `${col.content.slice(0, 200)}…（全${col.content.length}字）`,
      translations: Object.fromEntries(
        Object.entries(col.translations).map(([k, v]) => [
          k,
          { ...v, content: `${v.content.slice(0, 150)}…（全${v.content.length}字）` },
        ]),
      ),
    },
  };
  const out = resolve(process.cwd(), "scripts", "realestate-columns-p3.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}`);
  console.log(preview.verification.join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
