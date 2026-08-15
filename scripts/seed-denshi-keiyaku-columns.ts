/**
 * 電子契約×遠方×委任状コラム（1本）投入スクリプト
 *
 * 対象＝luck428.com /legal/column（business=legal）。
 * 原稿＝scripts/legal-columns/01-denshi-keiyaku-enpo-inin-kami.md（法令・公的資料は実装時にWebで一次確認済み。
 * 電子署名法2条1項1号・2号／3条＝e-Gov法令検索、登記の電子証明書の範囲・代理申請の署名要件＝法務省
 * 登記・供託オンライン申請システムのページとFAQ。いずれも2026-08-15参照）。
 *
 * カニバリ回避＝サイトマップ照合済み（2026-08-15）：電子契約・委任状の既存コラム・固定ページなし。
 * taiwan-inkan-shomei-isan-bunkatsu（海外での印鑑証明の代替手段）とは役割分担・相互リンク。
 *
 * seed-office-columns.ts / seed-realestate-columns-p2.ts と同型：dry-run既定 → preview JSON、
 * --emit-ts で admin 投入ページ用の seed データを生成。本番投入は
 * /admin/columns/seed-denshi-keiyaku の管理者セッション経由を正とする（本番環境変数がSensitive設定のため）。
 *
 * 使い方:
 *   npx tsx scripts/seed-denshi-keiyaku-columns.ts            # dry-run（scripts/denshi-keiyaku-columns.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-denshi-keiyaku-columns.ts --emit-ts  # src/lib/data/denshi-keiyaku-columns-seed.ts を生成
 *
 * 設計メモ:
 *   - FAQ は本文md「## よくある質問」から自動パース。faq.answer は JSON-LD 向けに平文化。
 *   - upsert キー＝ @@unique([business, slug])。再実行しても重複しない。
 *   - locales: ["ja"]＝日本語のみ公開（多言語展開は別タスク）。
 *   - 表示コンプライアンス＝shigyo-compliance-gate / luck428-column-seo v2.9 準拠：
 *     禁止語（ワンストップ・一括対応・一体で・一気通貫）不使用／分離受任の明示（「独立した事業体」）／
 *     可否の断定なし／登記=司法書士・税務=税理士・紛争性のあるもの=弁護士を明記・紹介料を受け取らない旨を明記／
 *     執筆者経歴に「記者歴34年」「中国総局長として中国や台湾」等の禁止表現を使わない／
 *     Adobeは利用の事実記載のみ（認定・優劣・成果の断定をしない）。
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

const DATE = "2026-08-15";

/** 各記事が評価を集約すべきハブ（本文に必須の内部リンク）。verify() で機械検査する */
const REQUIRED_HUB_LINKS: Record<string, string[]> = {
  "denshi-keiyaku-enpo-inin-kami": ["/legal/services/inheritance", "/legal/nagare", "/legal/ryokin"],
};

/** 本セット外へ張る既存コラムslug（サイトマップで実在確認済み 2026-08-15） */
const KNOWN_EXISTING_LEGAL_SLUGS = new Set(["taiwan-inkan-shomei-isan-bunkatsu"]);

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
    file: "01-denshi-keiyaku-enpo-inin-kami.md",
    slug: "denshi-keiyaku-enpo-inin-kami",
    title: "電子契約はどこまで使えるか──遠方の方との契約は当日、法務局に出す委任状は紙が多い",
    category: "手続きの進め方（行政書士の実務から）",
    excerpt:
      "行政書士への依頼の契約は、電子契約なら来所も郵送も不要で、遠方や海外にお住まいでも当日結べます。一方、登記のオンライン申請に使う委任状は、委任者本人の電子証明書による署名が必要とされ、クラウド型の電子契約サービスでは足りません（法務省・2026年8月15日参照）。遺産分割協議書も相続登記に使う場合は実印・印鑑証明書が実務上必要です。当事務所が利用するAdobeの電子契約と、紙が必要な書類の仕分け方を整理しました。",
    keywords: [
      "電子契約 委任状 使える",
      "行政書士 依頼 遠方 来所不要",
      "電子署名 相続登記 委任状",
      "遺産分割協議書 電子署名",
      "Adobe Acrobat Sign 行政書士",
      "電子契約 法的効力",
    ],
    tags: ["電子契約", "委任状", "相続", "遠方", "電子署名法"],
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

    // 執筆者経歴の禁止表現（luck428-column-seo v2.9 第9条）
    if (c.content.includes("中国総局長として中国や台湾") || c.content.includes("記者歴34年")) {
      notes.push(`NG: ${c.slug} の執筆者経歴に禁止表現あり`);
    }

    // Adobeの表現規律：認定・公認・優劣断定の語を使っていないか
    for (const w of ["認定パートナー", "公認", "安全です", "最も安全"]) {
      if (c.content.includes(w)) notes.push(`NG: ${c.slug} にAdobe表現規律違反の疑いのある語「${w}」あり`);
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
  if (process.argv.includes("--write")) {
    console.error(
      "--write は用意していません。本番投入は /admin/columns/seed-denshi-keiyaku（管理者セッション経由）を正とします。",
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
    const out = resolve(process.cwd(), "src/lib/data/denshi-keiyaku-columns-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-denshi-keiyaku-columns.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/legal-columns/01-denshi-keiyaku-enpo-inin-kami.md。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-denshi-keiyaku からの管理者セッション経由バルクupsert（seed-office と同型）。\n\nexport type DenshiKeiyakuSeedColumn = {\n  business: "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const DENSHI_KEIYAKU_COLUMNS_SEED: DenshiKeiyakuSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "電子契約×遠方×委任状コラム（1本）。原稿md（scripts/legal-columns/01-denshi-keiyaku-enpo-inin-kami.md）から生成。投入は /admin/columns/seed-denshi-keiyaku。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
    })),
  };
  const out = resolve(process.cwd(), "scripts", "denshi-keiyaku-columns.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}`);
  console.log(preview.verification.join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
