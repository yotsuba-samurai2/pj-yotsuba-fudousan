/**
 * 定点#24「空き家 障害者グループホーム 転用 できるか」対策の投入スクリプト（2本）
 *
 * 対象＝設問語「転用」に正面から答える2本組。既存ページの強化であり、新規ページは作らない
 * （luck428-column-seo 第2条＝着手前にサイトマップで既存を洗う。両ページともサイトマップに実在）。
 *
 *   1. realestate / kodate-akiya-group-home-ni-kasu   ＝ 貸す側（大家・所有者）が何を判断するか
 *   2. legal      / group-home-kenchikukijunho-youto-henko ＝ 手続きが要るかどうか
 *
 * 役割分担は luck428-column-seo 第3条に従い、2本を相互リンクで結ぶ（本スクリプトの verify() が機械検査）。
 *
 * 【本スクリプトを分けた理由】
 *   1本目はリポジトリのシードに存在せず（管理画面から直接作成）、コード側に本文が無かった。
 *   改稿前の現行値は scripts/backup/column-kodate-akiya-group-home-ni-kasu-2026-08-05.json に退避済み。
 *   既存の seed-realestate-columns.ts / seed-gh-columns-p2.ts に相乗りすると、投入ページを押した際に
 *   無関係な他コラム（realestate 3本・GH-P2 5本）まで一括上書きされる。本タスクで触れる2本だけを
 *   upsert する専用ページに分離し、巻き添え更新を避ける（seed-gh-p2/p3/p3b と同じ増分パターン）。
 *
 * 【メタデータの扱い】
 *   upsert は未指定フィールドを触らないが、渡したフィールドはDB値を上書きする。
 *   そのため title / excerpt / date / category / tags は退避した現行値をそのまま転記している。
 *   意図した変更は次の2点のみ：
 *     - author の全角カッコ重複「専任宅建士（（東京）…）」を「専任宅建士＜（東京）…＞」に修正（浦松承認）
 *     - keywords に設問語2件を追加（既存10件は保持）
 *
 * 使い方:
 *   npx tsx scripts/seed-akiya-gh-tenyo.ts            # dry-run（preview JSON を出力・DB接続なし）
 *   npx tsx scripts/seed-akiya-gh-tenyo.ts --emit-ts  # src/lib/data/akiya-gh-tenyo-seed.ts を生成
 *   npx tsx scripts/seed-akiya-gh-tenyo.ts --write    # DATABASE_URL/DIRECT_URL を設定して直接upsert
 *
 * 本番反映は、本番環境変数がSensitive設定で env pull できないため
 * /admin/columns/seed-akiya-gh-tenyo からの管理者セッション経由投入を正とする。
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";

type Faq = { question: string; answer: string };

type SeedColumn = {
  business: "realestate" | "legal";
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

/** 表示コンプライアンス上の禁止語（本2本に固有名詞での例外は存在しない） */
const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "一気通貫", "one-stop"];

/** 相互リンクの必須ペア（どちらか一方が欠けたら NG） */
const CROSS_LINKS: Record<string, string> = {
  "kodate-akiya-group-home-ni-kasu": "/legal/column/group-home-kenchikukijunho-youto-henko",
  "group-home-kenchikukijunho-youto-henko": "/column/kodate-akiya-group-home-ni-kasu",
};

/** 設問語（定点#24）。本文に最低1回は出ること */
const REQUIRED_TERMS: Record<string, string[]> = {
  "kodate-akiya-group-home-ni-kasu": ["転用", "寄宿舎", "用途地域"],
  "group-home-kenchikukijunho-youto-henko": ["転用", "寄宿舎"],
};

const ARTICLES: Array<Omit<SeedColumn, "content" | "faq"> & { dir: string; file: string }> = [
  {
    dir: "akiya-gh-columns",
    file: "kodate-akiya-group-home-ni-kasu.md",
    business: "realestate",
    slug: "kodate-akiya-group-home-ni-kasu",
    // ↓ title / excerpt / date / category / tags は退避した現行DB値をそのまま転記（変更しない）
    title:
      "戸建て・空き家を「グループホームに貸す」という選択──大家さんが最初に知りたいこと",
    date: "2026-07-25",
    category: "グループホーム",
    excerpt:
      "「福祉施設に貸すなんて、考えたこともなかった」──空き家になった戸建てのオーナーにグループホーム（障害者の共同生活援助）への賃貸をご提案すると、たいてい最初はそう言われます。けれど仕組みを知ると、事業者への一括賃貸で長期安定、地域に必要とされる使い方だと分かって、表情が変わる。建物は傷まないか、近隣は大丈夫か、途中で撤退されないか──大家さんの3大不安への答えと、契約書で必ず決めておくべきこと、向いている建物の条件を、文京区の宅建士が貸主の目線で整理しました。",
    status: "published",
    author: {
      name: "浦松 丈二",
      // 現行値の全角カッコ重複「（（東京）…）」を外側＜＞に修正（2026-08-05 浦松承認）
      title:
        "四葉不動産株式会社 代表取締役・専任宅建士＜（東京）第293544号＞／行政書士／元毎日新聞中国総局長（記者歴34年）",
    },
    keywords: [
      "グループホーム 貸す",
      "戸建て グループホーム 賃貸",
      "空き家 グループホーム 活用",
      "障害者グループホーム 大家",
      "グループホーム 一括借り上げ",
      "グループホーム 賃貸借契約 注意点",
      "原状回復 消防設備",
      "相続 実家 活用",
      "文京区 不動産",
      "茗荷谷",
      // ↓ 定点#24 の設問語（追加分）
      "空き家 グループホーム 転用",
      "グループホーム 寄宿舎 用途変更",
    ],
    tags: ["グループホーム", "空き家活用", "相続", "事業用不動産"],
    locales: ["ja"],
  },
  {
    dir: "gh-columns",
    file: "06-youto-henko.md",
    business: "legal",
    slug: "group-home-kenchikukijunho-youto-henko",
    // ↓ すべて gh-columns-seed-p2.ts の現行値どおり（相互リンク追記以外は変更しない）
    title: "グループホーム開設と建築基準法｜用途変更確認申請の要否",
    date: "2026-07-24",
    category: "グループホーム開設",
    excerpt:
      "既存の建物をグループホームに転用する場合、建築基準法上の「用途変更」の手続きが必要になることがあります。確認申請が必要になる面積の基準と、申請が不要でも押さえておくべき点を整理します。",
    status: "published",
    author: {
      name: "浦松 丈二",
      title: "行政書士・宅地建物取引士（四葉行政書士事務所／四葉不動産株式会社）",
    },
    keywords: [
      "グループホーム 用途変更",
      "建築基準法 確認申請",
      "用途変更 200平米",
      "グループホーム 既存建物 転用",
      "寄宿舎 用途変更",
      "グループホーム 建築基準法",
    ],
    tags: ["グループホーム", "建築基準法", "用途変更", "確認申請", "既存建物"],
    locales: ["ja"],
  },
];

/** Markdownリンク・強調を平文化（FAQ JSON-LD用。本文には適用しない） */
function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

/**
 * 「## よくある質問」節から **Q. …** / A. … の組をパースする。
 * 本2本は見出し（「よくある質問」/「よくある質問（FAQ）」）とQ-A間の空行の有無が揃っていないため、
 * どちらの書式も受けられるようにしている。
 */
function parseFaq(content: string, file: string): Faq[] {
  const m = content.match(/## よくある質問(?:（FAQ）)?\n([\s\S]*?)(?=\n## |$)/);
  if (!m) throw new Error(`${file}: 「## よくある質問」節が見つかりません`);
  const faqs: Faq[] = [];
  const re = /\*\*Q\.\s*([\s\S]*?)\*\*\s*\n+\s*(A\.\s*[\s\S]*?)(?=\n\s*\*\*Q\.|\s*$)/g;
  let q: RegExpExecArray | null;
  while ((q = re.exec(m[1])) !== null) {
    faqs.push({
      question: toPlainText(q[1]),
      answer: toPlainText(q[2].replace(/^A\.\s*/, "")),
    });
  }
  if (faqs.length === 0) throw new Error(`${file}: FAQを1件もパースできません`);
  return faqs;
}

function buildColumns(): SeedColumn[] {
  return ARTICLES.map((a) => {
    const { dir, file, ...meta } = a;
    const content = readFileSync(resolve(__dirname, dir, file), "utf-8").trim();
    return { ...meta, content, faq: parseFaq(content, file) };
  });
}

function verify(cols: SeedColumn[]): string[] {
  const notes: string[] = [];

  for (const c of cols) {
    // 第7条1＝冒頭の直答ブロック（既存シードと同型の機械検査）
    if (!c.content.startsWith("**結論（先に要点）**：")) {
      notes.push(`NG: ${c.slug} が「**結論（先に要点）**：」で始まっていない`);
    }

    // 定点#24の設問語
    for (const t of REQUIRED_TERMS[c.slug] ?? []) {
      if (!c.content.includes(t)) notes.push(`NG: ${c.slug} に設問語「${t}」がない`);
    }

    // 第7条3＝数値・費用は表で示す
    if (!/^\|/m.test(c.content)) notes.push(`NG: ${c.slug} に表が1つもない`);

    // 相互リンク（役割分担の明示とセット）
    const need = CROSS_LINKS[c.slug];
    if (need && !c.content.includes(need)) {
      notes.push(`NG: ${c.slug} に相互リンク ${need} がない`);
    }
    if (!c.content.includes("役割")) {
      notes.push(`WARN: ${c.slug} に役割分担の明示が見当たらない`);
    }

    // 表示コンプライアンス：禁止語（第9条／shigyo-compliance-gate 第2条の2）
    for (const w of FORBIDDEN_WORDS) {
      if (c.content.includes(w)) notes.push(`NG: ${c.slug} に禁止語「${w}」あり`);
    }

    // 独占業務の範囲（lessons 2026-07-19 C-2）＝「作成・提出は独占業務」と書かない
    if (/作成・提出[^。]{0,40}独占業務/.test(c.content)) {
      notes.push(`NG: ${c.slug} に「作成・提出＝独占業務」の誤表現あり`);
    }

    // 出典・判断留保（第7条4／shigyo-compliance-gate 第1条・第4条）
    if (!/## この記事の(出典|根拠)/.test(c.content)) {
      notes.push(`NG: ${c.slug} に出典節なし`);
    }
    if (!c.content.includes("一般的な情報提供")) {
      notes.push(`NG: ${c.slug} に判断留保の記載なし`);
    }
    // 個別物件の可否を断定しないための送り先
    if (!/建築士/.test(c.content)) {
      notes.push(`NG: ${c.slug} に建築士・特定行政庁への留保がない`);
    }

    if (c.faq.length < 3) notes.push(`WARN: ${c.slug} のFAQが${c.faq.length}件と少ない`);
  }
  return notes;
}

async function main() {
  const write = process.argv.includes("--write");
  const emitTs = process.argv.includes("--emit-ts");
  const cols = buildColumns();
  const notes = verify(cols);
  const hasNg = notes.some((n) => n.startsWith("NG"));

  if (emitTs) {
    if (hasNg) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(__dirname, "../src/lib/data/akiya-gh-tenyo-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-akiya-gh-tenyo.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/akiya-gh-columns/*.md および scripts/gh-columns/06-youto-henko.md。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-akiya-gh-tenyo からの管理者セッション経由upsert（定点#24対策の2本のみ）。\n\nexport type AkiyaGhTenyoSeedColumn = {\n  business: "realestate" | "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n};\n\nexport const AKIYA_GH_TENYO_SEED: AkiyaGhTenyoSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    note: "定点#24 空き家×GH転用。原稿mdから生成。--write でupsert。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
    })),
  };
  writeFileSync(
    resolve(__dirname, "akiya-gh-tenyo.preview.json"),
    JSON.stringify(preview, null, 2),
  );
  console.log(`preview → scripts/akiya-gh-tenyo.preview.json（${cols.length}本）`);
  for (const n of notes) console.log("  " + n);
  if (hasNg) {
    console.error("NGがあるため中断します。");
    process.exit(1);
  }
  if (!write) {
    console.log("dry-run 完了。本番投入は /admin/columns/seed-akiya-gh-tenyo から行ってください。");
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
