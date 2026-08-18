/**
 * 不動産コラム 第5弾（2本）投入スクリプト
 *
 * 対象＝luck428.com /column（business=realestate）。AI可視性定点 #29 と #33 の対策記事。
 *   - 09 kaigai-kyoju-fudosan-kanri-chinese：海外居住オーナーの管理×中国語対応（ja/zh/zh-tw 3言語）
 *   - 10 hikyojusha-yachin-gensen-2042：非居住者家賃の20.42%源泉徴収（jaのみ）
 *
 * 一次確認（2026-08-18）：
 *   - 20.42%＝所得税20%＋復興特別所得税0.42%（20%×1.021）。国税庁 No.2880 / No.1926 で確認。
 *     源泉徴収不要＝個人が自己又は親族の居住用に土地・家屋等を借りる場合（No.2880）。
 *     国内支払＝翌月10日、一定の国外支払＝翌月末日（No.2880）。
 *   - 納税管理人＝法人でも個人でも可（No.1923）。税務相談・申告書作成・税務代理＝税理士（No.1923/1926）。
 *   - 国交省「外国人の民間賃貸住宅入居円滑化ガイドライン」は14言語（中国語含む）で
 *     重要事項説明書・賃貸住宅標準契約書・定期賃貸住宅標準契約書等の見本を掲載（2026-08-18確認）。
 *
 * カニバリ回避：#29は管理の任せ方＋中国語対応（/kaigai-owner のピラーへ送出）、#33は
 * 20.42%源泉徴収のみの深掘り（#29へ送出）。売却時の源泉は既存売却コラムの役割。
 *
 * 使い方:
 *   npx tsx scripts/seed-realestate-columns-p5.ts            # dry-run（scripts/realestate-columns-p5.preview.json）
 *   npx tsx scripts/seed-realestate-columns-p5.ts --emit-ts  # src/lib/data/realestate-columns-p5-seed.ts を生成
 *
 * 本番投入は /admin/columns/seed-realestate-p5（管理者セッション経由・冪等upsert）を正とする。
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

const DATE = "2026-08-18";
const CATEGORY = "投資・事業用不動産";

const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "一気通貫", "one-stop", "一站式"];

type ArticleSpec = {
  file: string;
  slug: string;
  title: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
  locales: string[];
  localesWithTranslations?: Array<"zh" | "zh-tw">;
  hubLinks: string[];
};

const ARTICLES: ArticleSpec[] = [
  {
    file: "09-kaigai-kyoju-fudosan-kanri-chinese.md",
    slug: "kaigai-kyoju-fudosan-kanri-chinese",
    title: "海外に住んだまま日本の不動産を管理する方法──管理委託・中国語対応・納税管理人",
    excerpt:
      "海外に住みながら日本の不動産を所有・賃貸する場合、管理の任せ方には自主管理・集金代行・管理委託があります。中国語での相談・現況報告、納税管理人と税理士の違いを整理します。",
    keywords: [
      "海外居住 日本の不動産 管理",
      "海外 不動産 管理 中国語対応",
      "日本の不動産 海外オーナー 管理委託",
      "海外居住 不動産 納税管理人",
      "中国語 不動産管理 日本",
    ],
    tags: ["海外不動産", "賃貸管理", "中国語対応", "納税管理人", "非居住者"],
    locales: ["ja", "zh", "zh-tw"],
    localesWithTranslations: ["zh", "zh-tw"],
    hubLinks: ["/kaigai-owner"],
  },
  {
    file: "10-hikyojusha-yachin-gensen-2042.md",
    slug: "hikyojusha-yachin-gensen-2042",
    title: "非居住者オーナーの家賃から20.42%の源泉徴収が不要になるケース──借主・用途・納付期限の整理",
    excerpt:
      "非居住者等への日本国内不動産の賃料は原則20.42%源泉徴収。個人が自己・親族の居住用に借りる場合は不要です。借主・用途・納付期限（翌月10日／国外支払翌月末日）を整理します。",
    keywords: [
      "非居住者 家賃 源泉徴収",
      "非居住者 源泉徴収 20.42",
      "海外オーナー 家賃 源泉徴収 不要",
      "不動産 賃料 源泉徴収 20.42",
      "源泉徴収 不要 個人 居住用",
    ],
    tags: ["非居住者", "源泉徴収", "賃貸経営", "海外不動産", "確定申告"],
    locales: ["ja"],
    hubLinks: ["/kaigai-owner"],
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

function readTranslation(spec: ArticleSpec, locale: "zh" | "zh-tw"): Translation {
  const p = resolve(process.cwd(), "scripts", "realestate-columns", locale, spec.file);
  const { meta, body } = parseFrontmatter(readFileSync(p, "utf-8"), `${locale}/${spec.file}`);
  return { title: meta.title, excerpt: meta.excerpt, category: meta.category, content: body };
}

function buildColumn(spec: ArticleSpec): SeedColumn {
  const jaPath = resolve(process.cwd(), "scripts", "realestate-columns", spec.file);
  const content = readFileSync(jaPath, "utf-8").trim();
  const translations: SeedColumn["translations"] = {};
  if (spec.localesWithTranslations?.includes("zh")) translations.zh = readTranslation(spec, "zh");
  if (spec.localesWithTranslations?.includes("zh-tw")) translations["zh-tw"] = readTranslation(spec, "zh-tw");
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
      if (l !== c.slug && !batchSlugs.has(l)) notes.push(`NG: ${spec.slug} → 不明slug ${l}`);
    }
    if (!c.content.includes("## この記事の出典（一次情報）")) notes.push(`NG: ${spec.slug} に出典節なし`);
    if (!c.content.includes("一般的な情報提供")) notes.push(`NG: ${spec.slug} に判断留保なし`);

    if (c.translations) {
      for (const loc of ["zh", "zh-tw"] as const) {
        const t = c.translations[loc];
        if (!t) continue;
        if (/\]\(\/(?!\/)/.test(t.content)) notes.push(`NG: ${spec.slug}/${loc} に相対パスの内部リンクあり`);
      }
      if (c.translations.zh && !c.translations.zh.content.includes("四叶不动产株式会社")) {
        notes.push(`WARN: ${spec.slug}/zh のブランド表記を確認`);
      }
      if (c.translations["zh-tw"] && !c.translations["zh-tw"].content.includes("四葉不動產株式會社")) {
        notes.push(`WARN: ${spec.slug}/zh-tw のブランド表記を確認`);
      }
    }
  });

  const texts: Array<[string, string]> = [];
  for (const c of cols) {
    texts.push([c.slug, c.content + c.excerpt]);
    if (c.translations) {
      for (const loc of ["zh", "zh-tw"] as const) {
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
    console.error("--write は用意していません。本番投入は /admin/columns/seed-realestate-p5 を正とします。");
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
    const out = resolve(process.cwd(), "src/lib/data/realestate-columns-p5-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-realestate-columns-p5.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/realestate-columns/09〜10（ja）＋zh/zh-tw/09-*.md（翻訳）。\n// 修正はmd側→再生成で行う。用途＝/admin/columns/seed-realestate-p5 からの管理者セッション経由upsert。\n\nexport type RealestateSeedColumnP5 = {\n  business: "realestate";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n  translations?: {\n    en?: { title: string; excerpt: string; content: string; category?: string };\n    "zh-tw"?: { title: string; excerpt: string; content: string; category?: string };\n    zh?: { title: string; excerpt: string; content: string; category?: string };\n  };\n};\n\nexport const REALESTATE_COLUMNS_P5_SEED: RealestateSeedColumnP5[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "不動産コラム第5弾（2本＝#29海外居住管理×中国語対応／#33非居住者家賃20.42%源泉）。投入は /admin/columns/seed-realestate-p5。",
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      slug: c.slug,
      title: c.title,
      locales: c.locales,
      faq: c.faq.length,
      contentChars: c.content.length,
    })),
  };
  const out = resolve(process.cwd(), "scripts", "realestate-columns-p5.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}`);
  console.log(preview.verification.join("\n"));
}

main();
