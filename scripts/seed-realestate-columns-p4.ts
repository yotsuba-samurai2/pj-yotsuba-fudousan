/**
 * 不動産コラム 第4弾（1本・4言語）投入スクリプト
 *
 * 対象＝luck428.com /column（business=realestate）。コラム草稿_mokuzo-chintai-mansion-zeroemi-hojokin
 * （2026-08-15・浦松草稿）に基づく「賃貸マンションを木造で建てる」。
 *
 * 一次確認の記録（2026-08-15）：
 *   - クール・ネット東京「令和8年度 東京ゼロエミ住宅普及促進事業」ページを直接取得。
 *     助成額（集合A200/B130/C30万円・戸建A240/B160/C40万円）／対象=床面積計2,000㎡未満／
 *     集合は全戸C以上・戸ごと適用／申請者=建築主／受付=R8.4.1〜R9.3.31・原則電子申請／
 *     太陽光3.6kWまで12〜13万円/kW／蓄電池10万円/kWh上限120万円・R8.10.1以降の設計確認審査申請は
 *     SII令和8年度登録済製品のみ（9/30までの申請完了分を除く）／不動産取得税減免（最大全額）——すべて頁面と一致
 *   - 国税庁・確定申告書等作成コーナー「耐用年数（建物）」を直接取得。木造・住宅用22年／RC・住宅用47年を確認
 *   - 見学写真のEXIF＝2026-08-01撮影（iPhone）。本文の時期表記は「2026年8月」に確定。
 *     掲載写真は public/assets/images/column-mokuzo-chintai-kengaku-202608.jpg
 *     （ナンバープレート・人物にぼかし加工済み、EXIF（GPS含む）除去済み、1600×1200）
 *
 * カニバリ回避：サイトマップ照合済み（2026-08-15）。slug衝突なし・「minpaku/zeroemi/mokuzo」系の
 * 既存記事なし。/toushi（ハブ）と /legal/services/subsidy（行政書士側の主力）へ評価を集約。
 *
 * 翻訳＝scripts/realestate-columns/{zh,zh-tw,en}/08-*.md（frontmatter＝title/excerpt/category。
 * 訳語は#243の規律：条項号=繁「第◯條」簡「第◯条」・「款」不可／法令名・制度名は日本語漢字のまま初出に訳注／
 * zh=四叶不动产株式会社・zh-tw=四葉不動產株式會社／翻訳内リンクはロケール接頭辞なしの絶対URL）。
 *
 * 使い方:
 *   npx tsx scripts/seed-realestate-columns-p4.ts            # dry-run（scripts/realestate-columns-p4.preview.json）
 *   npx tsx scripts/seed-realestate-columns-p4.ts --emit-ts  # src/lib/data/realestate-columns-p4-seed.ts を生成
 *
 * 本番投入は /admin/columns/seed-realestate-p4（管理者セッション経由・冪等upsert）を正とする。
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
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

const SLUG = "mokuzo-chintai-mansion-zeroemi-hojokin";
const DATE = "2026-08-15";
const IMAGE_PATH = "/assets/images/column-mokuzo-chintai-kengaku-202608.jpg";

const META = {
  title: "賃貸マンションを木造で建てる──3階建ては可能か、都の助成金はいくらか",
  category: "投資・事業用不動産",
  excerpt:
    "賃貸マンションは木造でも3階建てを建てられます。東京都の東京ゼロエミ住宅の助成は集合住宅で最大200万円/戸、10戸なら約2,000万円になる計算です。木三共の考え方、RC造との比較（法定耐用年数22年/47年）、令和8年度の助成額・要件・受付期間、大田区蒲田で見学した木造3階建て・10戸の賃貸住宅の所感をまとめました。都内で土地活用・賃貸経営を考えている土地オーナー・投資家の方に向けた記事です。",
  keywords: [
    "賃貸マンション 木造 3階建て",
    "木三共 賃貸",
    "東京ゼロエミ住宅 助成金 集合住宅",
    "東京ゼロエミ住宅 200万円",
    "木造 アパート 耐用年数 22年",
    "土地活用 木造 賃貸",
  ],
  tags: ["土地活用", "木造", "賃貸経営", "東京ゼロエミ住宅", "補助金・助成金"],
} as const;

const AUTHOR = {
  name: "浦松 丈二",
  title: "代表取締役・宅地建物取引士（四葉不動産株式会社）",
} as const;

/** 評価を集約するハブ（ja本文に必須の内部リンク） */
const REQUIRED_HUB_LINKS = ["/toushi", "/legal/services/subsidy"];

/** 本セット外へ張る既存コラムslug（サイトマップで実在確認済み 2026-08-15） */
const KNOWN_EXISTING_COLUMN_SLUGS = new Set(["yosekiritsu-hosei-tochine"]);

/** 表示コンプライアンス上の禁止語（事業体をまたぐ一体提供の示唆） */
const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "一気通貫", "one-stop", "一站式"];

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

function readTranslation(locale: "zh" | "zh-tw" | "en"): Translation {
  const p = resolve(process.cwd(), "scripts", "realestate-columns", locale, `08-${SLUG}.md`);
  const { meta, body } = parseFrontmatter(readFileSync(p, "utf-8"), `${locale}/08-${SLUG}.md`);
  return { title: meta.title, excerpt: meta.excerpt, category: meta.category, content: body };
}

function buildColumn(): SeedColumn {
  const jaPath = resolve(process.cwd(), "scripts", "realestate-columns", `08-${SLUG}.md`);
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

  // 掲載写真：本文の参照と実ファイルの存在
  if (!c.content.includes(`](${IMAGE_PATH})`)) notes.push("NG: ja に見学写真の参照なし");
  if (!existsSync(resolve(process.cwd(), "public", IMAGE_PATH.replace(/^\//, "")))) {
    notes.push(`NG: 画像ファイルが存在しない（public${IMAGE_PATH}）`);
  }

  // 金額・採択の約束をしない（機械検査できる範囲）
  if (/必ず(採択|交付|もらえ)/.test(c.content)) notes.push("NG: ja に採択・交付の断定あり");

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

  if (!c.translations.zh.content.includes("独立的事业体")) notes.push("NG: zh に分離受任の明示なし");
  if (!c.translations["zh-tw"].content.includes("獨立的事業體")) notes.push("NG: zh-tw に分離受任の明示なし");
  if (!c.translations.en.content.toLowerCase().includes("independent business")) {
    notes.push("NG: en に分離受任の明示なし");
  }

  if (/第[0-9０-９一二三四五六七八九十]+款/.test(c.translations.zh.content)) {
    notes.push("NG: zh の条項号に「款」あり");
  }

  for (const loc of ["en", "zh-tw", "zh"] as const) {
    if (/\]\(\/(?!\/)/.test(c.translations[loc].content)) {
      notes.push(`NG: ${loc} に相対パスの内部リンクあり（絶対URLに揃える）`);
    }
  }

  if (!c.translations.zh.content.includes("四叶不动产株式会社")) notes.push("WARN: zh のブランド表記を確認");
  if (!c.translations["zh-tw"].content.includes("四葉不動產株式會社")) notes.push("WARN: zh-tw のブランド表記を確認");

  return notes;
}

async function main() {
  const emitTs = process.argv.includes("--emit-ts");
  if (process.argv.includes("--write")) {
    console.error("--write は用意していません。本番投入は /admin/columns/seed-realestate-p4 を正とします。");
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
    const out = resolve(process.cwd(), "src/lib/data/realestate-columns-p4-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-realestate-columns-p4.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/realestate-columns/08-mokuzo-chintai-mansion-zeroemi-hojokin.md（ja）＋{zh,zh-tw,en}/08-*.md（翻訳）。\n// 修正はmd側→再生成で行う。用途＝/admin/columns/seed-realestate-p4 からの管理者セッション経由upsert。\n\nexport type RealestateSeedColumnP4 = {\n  business: "realestate";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n  translations: {\n    en: { title: string; excerpt: string; content: string; category?: string };\n    "zh-tw": { title: string; excerpt: string; content: string; category?: string };\n    zh: { title: string; excerpt: string; content: string; category?: string };\n  };\n};\n\nexport const REALESTATE_COLUMNS_P4_SEED: RealestateSeedColumnP4[] = `;
    writeFileSync(out, header + JSON.stringify([col], null, 2) + ";\n");
    console.log(`emit-ts → ${out}（1本・4言語）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "不動産コラム第4弾（1本・4言語＝木造賃貸×東京ゼロエミ）。投入は /admin/columns/seed-realestate-p4。",
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
  const out = resolve(process.cwd(), "scripts", "realestate-columns-p4.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}`);
  console.log(preview.verification.join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
