/**
 * 不動産コラム 第6弾（1本）投入スクリプト
 *
 * 対象＝luck428.com /column（business=realestate）。
 *   - 11 taiwan-kigyo-nihon-kyoten-office-sumai：
 *     台湾企業の日本拠点づくり×オフィス・住まいの実務（ja/en/zh-tw/zh 4言語）
 *
 * 一次確認（2026-08-20）：
 *   - 宅地建物取引業法（昭和27年法律第176号）第3条＝免許、第35条＝見出し「重要事項の説明等」。
 *     説明の主体は業者ではなく「宅地建物取引士をして」説明させる構造（e-Gov法令検索で条文確認）。
 *   - 在留資格「経営・管理」の上陸基準省令等の改正＝令和7年10月16日施行（出入国在留管理庁）。
 *     ※本記事は不動産側の論点に限定し、要件の中身は /global 側の役割とする（カニバリ回避）。
 *     ※事業計画書の「経営に関する専門的な知識を有する者」の具体的資格名は省令の列挙ではなく
 *       ISAガイドラインの注記（「施行日時点においては」の限定付き）。本記事では扱わない。
 *   - Tokyo Hub：2024年9月18日開設（アジア初の海外拠点として発表・PR TIMES 2024-09-20）。
 *     現所在地＝港区芝大門1-3-4 GRAN FIRST 7階（公式サイト）。延べ200社支援・20社進出＝
 *     国家発展委員会2026-05-18発表（フォーカス台湾日本語版 2026-05-19）。
 *     移転前後の面積・倍率は公表資料が確認できないため記載しない。
 *     開館時間・電話番号・最寄り駅・収容人数も公式サイトに記載がないため書かない。
 *
 * カニバリ回避：
 *   - 07（中華圏の不動産会社向け・共同取引）＝主語が「不動産会社」。本稿は主語が「日本に来る企業」。
 *   - /office（会社設立とオフィス選び）・/shataku（借り上げ社宅）＝主力ページ。本稿は解説記事として送出。
 *   - /global（在留資格）＝勝ちページ。本稿は深追いせず送出のみ。
 *
 * 使い方:
 *   npx tsx scripts/seed-realestate-columns-p6.ts            # dry-run（scripts/realestate-columns-p6.preview.json）
 *   npx tsx scripts/seed-realestate-columns-p6.ts --emit-ts  # src/lib/data/realestate-columns-p6-seed.ts を生成
 *
 * 本番投入は /admin/columns/seed-realestate-p6（管理者セッション経由・冪等upsert）を正とする。
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
  translations?: { en?: Translation; "zh-tw"?: Translation; zh?: Translation };
};

const AUTHOR = {
  name: "浦松 丈二",
  title: "代表取締役・宅地建物取引士（四葉不動産株式会社）",
} as const;

const DATE = "2026-08-20";
const CATEGORY = "投資・事業用不動産";

const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "一気通貫", "one-stop", "一站式"];

/** バッチ外だがサイトに実在する /column スラッグ（内部リンク検証の許可リスト）。 */
const EXISTING_COLUMN_SLUGS = new Set(["chuka-fudosan-pro-kyodo-torihiki"]);

type ArticleSpec = {
  file: string;
  slug: string;
  title: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
  locales: string[];
  localesWithTranslations?: Array<"zh" | "zh-tw" | "en">;
  hubLinks: string[];
};

const ARTICLES: ArticleSpec[] = [
  {
    file: "11-taiwan-kigyo-nihon-kyoten-office-sumai.md",
    slug: "taiwan-kigyo-nihon-kyoten-office-sumai",
    title:
      "台湾企業が日本に拠点を構えるとき、オフィスと住まいで何が起きるか──外国法人名義の審査と順番",
    excerpt:
      "日本での拠点づくりで時間がかかるのは、物件を探している期間ではありません。外国法人名義の賃貸審査で見られる点、オフィスと代表者の住まいの順番、借り上げ社宅の考え方を、宅地建物取引士・行政書士が整理します。",
    keywords: [
      "台湾企業 日本進出 オフィス",
      "外国法人 名義 賃貸 契約",
      "外国法人 オフィス 借りる 日本",
      "台湾 企業 日本 拠点 住まい",
      "外国人 代表者 賃貸 審査",
    ],
    tags: ["台湾", "外国法人", "オフィス", "社宅", "多言語対応"],
    locales: ["ja", "en", "zh-tw", "zh"],
    localesWithTranslations: ["en", "zh-tw", "zh"],
    hubLinks: ["/office", "/shataku", "/global"],
  },
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

function readTranslation(spec: ArticleSpec, locale: "zh" | "zh-tw" | "en"): Translation {
  const p = resolve(process.cwd(), "scripts", "realestate-columns", locale, spec.file);
  const { meta, body } = parseFrontmatter(readFileSync(p, "utf-8"), `${locale}/${spec.file}`);
  return { title: meta.title, excerpt: meta.excerpt, category: meta.category, content: body };
}

function buildColumn(spec: ArticleSpec): SeedColumn {
  const jaPath = resolve(process.cwd(), "scripts", "realestate-columns", spec.file);
  const content = readFileSync(jaPath, "utf-8").trim();
  const translations: SeedColumn["translations"] = {};
  if (spec.localesWithTranslations?.includes("en")) translations.en = readTranslation(spec, "en");
  if (spec.localesWithTranslations?.includes("zh-tw")) translations["zh-tw"] = readTranslation(spec, "zh-tw");
  if (spec.localesWithTranslations?.includes("zh")) translations.zh = readTranslation(spec, "zh");
  return {
    business: "realestate",
    slug: spec.slug,
    title: spec.title,
    date: DATE,
    category: CATEGORY,
    excerpt: spec.excerpt,
    content,
    status: "published",
    author: { ...AUTHOR },
    keywords: [...spec.keywords],
    tags: [...spec.tags],
    locales: [...spec.locales],
    faq: parseFaq(content, spec.file),
    translations: Object.keys(translations).length ? translations : undefined,
  };
}

function verify(cols: SeedColumn[], specs: ArticleSpec[]): string[] {
  const notes: string[] = [];
  const batchSlugs = new Set(cols.map((c) => c.slug));

  cols.forEach((c, i) => {
    const spec = specs[i];
    if (!c.content.startsWith("**結論（先に要点）**：")) {
      notes.push(`NG: ${spec.slug} が「**結論（先に要点）**：」で始まっていない`);
    }
    if (c.faq.length < 4) notes.push(`WARN: ${spec.slug} のFAQが${c.faq.length}件`);
    if (c.content.length < 1500) notes.push(`WARN: ${spec.slug} の本文が短い（${c.content.length}字）`);
    for (const hub of spec.hubLinks) {
      if (!c.content.includes(`](${hub})`)) notes.push(`NG: ${spec.slug} に ${hub} リンクなし`);
    }
    const links = [...c.content.matchAll(/\]\(\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of links) {
      if (l !== c.slug && !batchSlugs.has(l) && !EXISTING_COLUMN_SLUGS.has(l)) {
        notes.push(`NG: ${spec.slug} → 不明slug ${l}`);
      }
    }
    if (!c.content.includes("## この記事の出典（一次情報）")) notes.push(`NG: ${spec.slug} に出典節なし`);
    if (!c.content.includes("一般的な情報提供")) notes.push(`NG: ${spec.slug} に判断留保なし`);
    // 分離受任の明示（3事業体にまたがるため必須）
    if (!/それぞれ直接ご契約|独立した事業体|別々にご契約/.test(c.content)) {
      notes.push(`NG: ${spec.slug} に分離受任の明示なし`);
    }
    if (!/紹介料/.test(c.content)) notes.push(`NG: ${spec.slug} に紹介料の扱いの記載なし`);
    // 社労士は2026年9月開業予定。開業前に社労士としての業務・立場を書かない
    if (/社会保険労務士/.test(c.content) && !/開業予定/.test(c.content)) {
      notes.push(`NG: ${spec.slug} の社労士表記に「開業予定」の但し書きなし`);
    }
    if (/助成金/.test(c.content)) notes.push(`NG: ${spec.slug} に「助成金」（社労士領域・開業前）あり`);

    if (c.translations) {
      for (const loc of ["en", "zh", "zh-tw"] as const) {
        const t = c.translations[loc];
        if (!t) continue;
        if (/\]\(\/(?!\/)/.test(t.content)) notes.push(`NG: ${spec.slug}/${loc} に相対パスの内部リンクあり`);
        if (!t.content.startsWith("**")) notes.push(`WARN: ${spec.slug}/${loc} が直答ブロックで始まっていない`);
      }
      if (c.translations.zh && !c.translations.zh.content.includes("四叶不动产株式会社")) {
        notes.push(`WARN: ${spec.slug}/zh のブランド表記を確認`);
      }
      if (c.translations["zh-tw"] && !c.translations["zh-tw"].content.includes("四葉不動產株式會社")) {
        notes.push(`WARN: ${spec.slug}/zh-tw のブランド表記を確認`);
      }
      if (c.translations.en && !c.translations.en.content.includes("Yotsuba Real Estate Co., Ltd.")) {
        notes.push(`WARN: ${spec.slug}/en のブランド表記を確認`);
      }
    }
  });

  const texts: Array<[string, string]> = [];
  for (const c of cols) {
    texts.push([c.slug, c.content + c.excerpt]);
    if (c.translations) {
      for (const loc of ["en", "zh", "zh-tw"] as const) {
        const t = c.translations[loc];
        if (t) texts.push([`${c.slug}/${loc}`, t.content + t.excerpt]);
      }
    }
  }
  for (const [label, text] of texts) {
    for (const w of FORBIDDEN_WORDS) {
      if (text.toLowerCase().includes(w.toLowerCase())) notes.push(`NG: ${label} に禁止語「${w}」あり`);
    }
  }

  return notes;
}

function main() {
  const emitTs = process.argv.includes("--emit-ts");
  if (process.argv.includes("--write")) {
    console.error("--write は用意していません。本番投入は /admin/columns/seed-realestate-p6 を正とします。");
    process.exit(1);
  }
  const cols = ARTICLES.map(buildColumn);
  const notes = verify(cols, ARTICLES);

  if (emitTs) {
    if (notes.some((n) => n.startsWith("NG"))) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(process.cwd(), "src/lib/data/realestate-columns-p6-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-realestate-columns-p6.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/realestate-columns/11-taiwan-kigyo-nihon-kyoten-office-sumai.md（ja）＋{en,zh,zh-tw}/11-*.md（翻訳）。\n// 修正はmd側→再生成で行う。用途＝/admin/columns/seed-realestate-p6 からの管理者セッション経由upsert。\n\nexport type RealestateSeedColumnP6 = {\n  business: "realestate";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n  translations?: {\n    en?: { title: string; excerpt: string; content: string; category?: string };\n    "zh-tw"?: { title: string; excerpt: string; content: string; category?: string };\n    zh?: { title: string; excerpt: string; content: string; category?: string };\n  };\n};\n\nexport const REALESTATE_COLUMNS_P6_SEED: RealestateSeedColumnP6[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    if (notes.length) console.log(notes.join("\n"));
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "不動産コラム第6弾（1本＝台湾企業の日本拠点づくり×オフィス・住まい／4言語）。投入は /admin/columns/seed-realestate-p6。",
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      slug: c.slug,
      title: c.title,
      locales: c.locales,
      faq: c.faq.length,
      contentChars: c.content.length,
      translationChars: c.translations
        ? Object.fromEntries(
            Object.entries(c.translations).map(([k, v]) => [k, v ? v.content.length : 0]),
          )
        : undefined,
    })),
  };
  const out = resolve(process.cwd(), "scripts", "realestate-columns-p6.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}`);
  console.log(preview.verification.join("\n"));
}

main();
