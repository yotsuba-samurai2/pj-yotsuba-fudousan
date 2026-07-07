/**
 * 台湾コンテンツ9本 → columns 構造パーサ（seed / dry-run）
 *
 * キックオフ タスク2「③台湾9本投入」用。
 * 原稿md（四葉基幹CRM/コンテンツ原稿_台湾*.md）と「台湾コンテンツ_admin投入指示書_v1.md」§2を
 * 突き合わせ、各記事を columns スキーマ（src/lib/firestore/columns.ts の FirestoreColumn）へパースする。
 *
 * 使い方:
 *   npx tsx scripts/seed-taiwan-columns.ts            # dry-run（プレビューJSON出力のみ・Firestore不使用）
 *   npx tsx scripts/seed-taiwan-columns.ts --write     # 本番投入（今日は未実装＝意図的にブロック。明日リセット後に実装）
 *
 * 出力: scripts/taiwan-columns.preview.json
 *
 * 設計メモ:
 *   - 本スクリプトはパース＋検証＋プレビュー出力のみ。firebase を import しないため、
 *     誤って本番Firestoreへ接続する事故は構造的に起きない（4段ゲート／既存資産を壊さない）。
 *   - 投入shapeは ColumnForm/FirestoreColumn に合わせて base=繁体字 かつ translations["zh-tw"] にも複製。
 *     （locale=zh-tw の記事を、locale出し分け実装前でも zh-tw ルートで確実に表示させるための保守的な選択。
 *      明日の出し分け実装時に base を日本語概要へ差し替える等の再設計が可能。判断は投入前に要確認。）
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

// ── 型（src/lib/firestore/columns.ts の FirestoreColumn に整合。依存を持たせないため再掲）──

type Faq = { question: string; answer: string };
type Author = { name: string; title: string };

type CrossLink = {
  to: string; // リンク先slug（9本のいずれか）
  label: string; // 指示書§2の記載どおりのラベル
  markdown: string; // 本文末に追記するMarkdown（指示書§2から逐語）
};

type ArticleKind = "column" | "hub" | "entrance";

type ArticleConfig = {
  order: number;
  file: string;
  slug: string; // 指示書 §1 の table で定義された正の slug（期待値）
  kind: ArticleKind;
  category: string; // メタに想定カテゴリが無い場合のフォールバック
  tags: string[]; // 想定カテゴリ（クラスタ）由来の分類タグ。原稿本文からの創作ではない
  crossLinks: CrossLink[]; // 指示書§2で投入時に追記するリンク
  implementationNotes: string[]; // §2のうちリンクでない実装note（例: 絵文字→線画アイコン）
};

const AUTHOR: Author = { name: "浦松 丈二", title: "代表取締役" };

const GUIDE_BACKLINK: CrossLink = {
  to: "taiwan-souzoku-guide",
  label: "回到完整指南：台灣人繼承日本不動產完整指南",
  markdown:
    "回到完整指南：[台灣人繼承日本不動產完整指南](/zh-tw/column/taiwan-souzoku-guide)",
};

// 指示書 §1 の投入順・slug、§2 の相互リンクを 1 箇所に集約（＝突き合わせの期待値）
const ARTICLES: ArticleConfig[] = [
  {
    order: 1,
    file: "コンテンツ原稿_台湾相続コラム_v1.md",
    slug: "taiwan-souzoku-japan-fudosan",
    kind: "column",
    category: "相続不動産",
    tags: ["台湾", "相続"],
    crossLinks: [GUIDE_BACKLINK],
    implementationNotes: [],
  },
  {
    order: 2,
    file: "コンテンツ原稿_台湾相続コラム_v2_売却.md",
    slug: "taiwan-souzoku-baikyaku",
    kind: "column",
    category: "相続不動産",
    tags: ["台湾", "相続", "売却"],
    crossLinks: [GUIDE_BACKLINK],
    implementationNotes: [],
  },
  {
    order: 3,
    file: "コンテンツ原稿_台湾相続コラム_v3_管理活用.md",
    slug: "taiwan-souzoku-kanri-katsuyo",
    kind: "column",
    category: "相続不動産",
    tags: ["台湾", "相続", "管理活用"],
    crossLinks: [GUIDE_BACKLINK],
    implementationNotes: [],
  },
  {
    order: 4,
    file: "コンテンツ原稿_台湾相続コラム_v4_被相続人台湾人.md",
    slug: "taiwan-jin-souzoku-tetsuzuki",
    kind: "column",
    category: "相続不動産",
    tags: ["台湾", "相続", "渉外手続き"],
    crossLinks: [GUIDE_BACKLINK],
    implementationNotes: [],
  },
  {
    order: 5,
    file: "コンテンツ原稿_台湾相続_特集ハブ_繁体字_v1.md",
    slug: "taiwan-souzoku-guide",
    kind: "hub",
    category: "相続不動産",
    tags: ["台湾", "相続", "特集ハブ"],
    crossLinks: [
      {
        to: "taiwan-jin-souzoku-tetsuzuki",
        label: "④渉外手続き篇",
        markdown:
          "④渉外手續篇：[被繼承人是台灣人時的涉外手續](/zh-tw/column/taiwan-jin-souzoku-tetsuzuki)",
      },
      {
        to: "taiwan-tetsuzuki-onestop",
        label: "⑤手続きワンストップ篇",
        markdown:
          "⑤單一窗口篇：[稅金與手續的單一窗口支援](/zh-tw/column/taiwan-tetsuzuki-onestop)",
      },
    ],
    implementationNotes: [],
  },
  {
    order: 6,
    file: "コンテンツ原稿_台湾投資コラム_東京不動産_繁体字_v1.md",
    slug: "taiwan-tokyo-fudosan-toshi",
    kind: "column",
    category: "投資不動産",
    tags: ["台湾", "投資"],
    crossLinks: [
      {
        to: "bunkyo-shueki-bukken",
        label: "地區篇：文京區收益物件的看點",
        markdown:
          "地區篇：[文京區收益物件的看點](/zh-tw/column/bunkyo-shueki-bukken)",
      },
    ],
    implementationNotes: [],
  },
  {
    order: 7,
    file: "コンテンツ原稿_台湾投資コラム_文京区収益物件_繁体字_v1.md",
    slug: "bunkyo-shueki-bukken",
    kind: "column",
    category: "投資不動産",
    tags: ["台湾", "投資", "文京区"],
    crossLinks: [],
    implementationNotes: [],
  },
  {
    order: 8,
    file: "コンテンツ原稿_台湾_手続きワンストップコラム_繁体字_v1.md",
    slug: "taiwan-tetsuzuki-onestop",
    kind: "column",
    category: "相続不動産",
    tags: ["台湾", "相続", "手続き"],
    crossLinks: [
      {
        to: "taiwan-jin-souzoku-tetsuzuki",
        label: "→渉外手続き",
        markdown:
          "涉外手續篇：[被繼承人是台灣人時的涉外手續](/zh-tw/column/taiwan-jin-souzoku-tetsuzuki)",
      },
      {
        to: "taiwan-souzoku-japan-fudosan",
        label: "→相続総論",
        markdown:
          "繼承總論篇：[台灣人繼承日本不動產：從哪裡開始](/zh-tw/column/taiwan-souzoku-japan-fudosan)",
      },
      {
        to: "taiwan-tokyo-fudosan-toshi",
        label: "→投資総論",
        markdown:
          "投資總論篇：[台灣人看東京不動產投資](/zh-tw/column/taiwan-tokyo-fudosan-toshi)",
      },
    ],
    implementationNotes: [],
  },
  {
    order: 9,
    file: "コンテンツ原稿_台湾向け入口ページ_繁体字_v1.md",
    slug: "taiwan",
    kind: "entrance",
    category: "台湾／入口",
    tags: ["台湾", "入口"],
    crossLinks: [],
    implementationNotes: [
      "指示書§2-5: 絵文字カード（📘📗等）→線画アイコンに置換（書類・建物／家系図／グラフ・NT$等）。仮実装では絵文字のままでも可。",
      "slug `taiwan` は仮。想定URL `/zh-tw/taiwan`（column配下ではない可能性）。多言語出し分け設計に従い投入前に最終決定。",
    ],
  },
];

// ── Markdown セクション抽出ヘルパー ──

type Heading = { level: number; title: string; idx: number };

function scan(md: string): { lines: string[]; headings: Heading[] } {
  const lines = md.split(/\r?\n/);
  const headings: Heading[] = [];
  lines.forEach((ln, idx) => {
    const m = /^(#{1,6})\s+(.*)$/.exec(ln);
    if (m) headings.push({ level: m[1].length, title: m[2].trim(), idx });
  });
  return { lines, headings };
}

/** predicate に最初に一致する見出しの本文（同レベル以下の次見出しまで）を返す */
function bodyOf(md: string, predicate: (h: Heading) => boolean): string | null {
  const { lines, headings } = scan(md);
  const i = headings.findIndex(predicate);
  if (i < 0) return null;
  const { level, idx } = headings[i];
  let end = lines.length;
  for (let j = i + 1; j < headings.length; j++) {
    if (headings[j].level <= level) {
      end = headings[j].idx;
      break;
    }
  }
  return lines.slice(idx + 1, end).join("\n").trim();
}

function titleIncludes(...needles: string[]) {
  return (h: Heading) => needles.some((n) => h.title.includes(n));
}

/** メタ情報ブロックから `- **key**: value` を辞書化 */
function parseMeta(md: string): Record<string, string> {
  const block = bodyOf(md, titleIncludes("メタ情報")) ?? "";
  const map: Record<string, string> = {};
  for (const line of block.split(/\r?\n/)) {
    const m = /^\s*-\s*\*\*(.+?)\*\*\s*[:：]\s*(.*)$/.exec(line);
    if (m) map[m[1].trim()] = m[2].trim();
  }
  return map;
}

function metaValue(meta: Record<string, string>, keyNeedle: string): string | null {
  const key = Object.keys(meta).find((k) => k.includes(keyNeedle));
  return key ? meta[key] : null;
}

function stripBackticks(s: string | null): string | null {
  return s ? s.replace(/`/g, "").trim() : s;
}

/** 「結論」段落の最初の実テキスト段落を excerpt として取り出す */
function firstParagraph(text: string | null): string | null {
  if (!text) return null;
  const para = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.startsWith("#"));
  return para.length ? para[0] : null;
}

/** 繁体字FAQセクション本文を Q/A 配列へ */
function parseFaq(section: string | null): Faq[] {
  if (!section) return [];
  const faqs: Faq[] = [];
  // **Q1. ...** を境に分割
  const parts = section.split(/(?=\*\*Q\d)/);
  for (const part of parts) {
    const m = /^\*\*Q\d+[.．、:：]?\s*(.+?)\*\*\s*([\s\S]*)$/.exec(part.trim());
    if (!m) continue;
    const question = m[1].trim();
    const answer = m[2]
      .split(/\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && l !== "---")
      .join("\n")
      .trim();
    if (question) faqs.push({ question, answer });
  }
  return faqs;
}

// ── 本文（繁体字）の構成（記事タイプ別）──

function buildBody(md: string, kind: ArticleKind): { body: string; sources: string | null; cta: string | null } {
  // 根拠は level3「本文の根拠…」限定（level2「根拠欄＋CTA」への誤マッチを防ぐ）
  const sources = bodyOf(md, (h) => h.level === 3 && /(根拠|根據|依據)/.test(h.title));
  // CTAは「根拠欄＋CTA」を除外（column/hub=### CTA・level3／entrance=## 5. CTA・level2 の両対応）
  const cta = bodyOf(md, (h) => /CTA/.test(h.title) && !h.title.includes("根拠"));

  if (kind === "column") {
    const honbun = bodyOf(md, (h) => h.level === 3 && /^本文$/.test(h.title)) ?? "";
    // 深掘り補論（例: v1の 3-B）があれば本文に続けて取り込む
    const extra = bodyOf(md, (h) => h.level === 2 && /(補論|深掘)/.test(h.title)) ?? "";
    return { body: [honbun, extra].filter(Boolean).join("\n\n").trim(), sources, cta };
  }

  if (kind === "hub") {
    const overview = bodyOf(md, (h) => h.level === 3 && /(全体像|全體像)/.test(h.title)) ?? "";
    const detail = bodyOf(md, (h) => h.level === 3 && /詳細/.test(h.title)) ?? "";
    return { body: [overview, detail].filter(Boolean).join("\n\n").trim(), sources, cta };
  }

  // entrance: キャッチ(H1)＋サブコピー＋2つの入口＋四葉の価値 を本文とする
  // 注: needle "入口"/"価値" は level2 セクション見出し限定にする（level1 文書タイトル「台湾向け入口」への誤マッチを防ぐ）
  const cat = bodyOf(md, (h) => h.level === 3 && h.title.includes("キャッチ")) ?? "";
  const sub = bodyOf(md, (h) => h.level === 3 && h.title.includes("サブコピー")) ?? "";
  const gates = bodyOf(md, (h) => h.level === 2 && h.title.includes("入口")) ?? "";
  const value = bodyOf(md, (h) => h.level === 2 && h.title.includes("価値")) ?? "";
  return { body: [cat, sub, gates, value].filter(Boolean).join("\n\n").trim(), sources, cta };
}

// ── 1記事のパース ──

type ParsedArticle = {
  order: number;
  kind: ArticleKind;
  sourceFile: string;
  found: boolean;
  slug: string; // 期待slug（指示書）
  parsedSlug: string | null; // 原稿メタの提案slug
  slugOk: boolean;
  locale: string;
  business: string;
  title: string | null; // 繁体字
  titleJa: string | null;
  category: string;
  date: string;
  excerpt: string | null; // 結論
  body: string;
  sources: string | null;
  cta: string | null;
  faq: Faq[];
  author: Author;
  keywords: string[];
  tags: string[];
  crossLinks: CrossLink[];
  implementationNotes: string[];
  bodyLinksFound: string[]; // 本文中に既出の /zh-tw/column/<slug>
  warnings: string[];
  firestoreDoc: Record<string, unknown>;
};

function parseArticle(cfg: ArticleConfig, sourceDir: string): ParsedArticle {
  const path = resolve(sourceDir, cfg.file);
  const warnings: string[] = [];

  if (!existsSync(path)) {
    return {
      order: cfg.order,
      kind: cfg.kind,
      sourceFile: cfg.file,
      found: false,
      slug: cfg.slug,
      parsedSlug: null,
      slugOk: false,
      locale: "zh-tw",
      business: "realestate",
      title: null,
      titleJa: null,
      category: cfg.category,
      date: "2026-07-07",
      excerpt: null,
      body: "",
      sources: null,
      cta: null,
      faq: [],
      author: AUTHOR,
      keywords: [],
      tags: cfg.tags,
      crossLinks: cfg.crossLinks,
      implementationNotes: cfg.implementationNotes,
      bodyLinksFound: [],
      warnings: [`原稿ファイルが見つかりません: ${path}`],
      firestoreDoc: {},
    };
  }

  const md = readFileSync(path, "utf-8");
  const meta = parseMeta(md);

  const parsedSlug = stripBackticks(metaValue(meta, "提案slug"));
  const title = metaValue(meta, "想定タイトル（繁体字）");
  const titleJa = metaValue(meta, "想定タイトル（日本語）");
  const categoryRaw = metaValue(meta, "想定カテゴリ");
  const businessLine = metaValue(meta, "business") ?? "";
  const business = (/([a-z]+)/.exec(businessLine)?.[1] ?? "realestate").trim();
  const locale = (/locale\*\*\s*[:：]?\s*([a-z-]+)/i.exec(md)?.[1] ?? "zh-tw").trim();
  const created = metaValue(meta, "作成") ?? "";
  const date = /(\d{4}-\d{2}-\d{2})/.exec(created)?.[1] ?? "2026-07-07";

  // 結論/リード/サブコピーは level3 見出し限定（level2「結論ブロック＋本文」への誤マッチを防ぐ）
  const excerpt =
    firstParagraph(bodyOf(md, (h) => h.level === 3 && h.title.includes("結論"))) ??
    firstParagraph(bodyOf(md, (h) => h.level === 3 && h.title.includes("リード"))) ??
    firstParagraph(bodyOf(md, (h) => h.level === 3 && h.title.includes("サブコピー")));

  const { body, sources, cta } = buildBody(md, cfg.kind);
  const faqSection = bodyOf(md, (h) => h.level === 2 && /FAQ/.test(h.title));
  const faq = parseFaq(faqSection);

  // 検証: slug 一致
  const slugOk = parsedSlug === cfg.slug;
  if (!slugOk) {
    warnings.push(
      `slug不一致: 原稿メタ=「${parsedSlug ?? "(取得不可)"}」 vs 指示書=「${cfg.slug}」`,
    );
  }
  if (!title) warnings.push("想定タイトル（繁体字）を抽出できませんでした");
  if (!excerpt) warnings.push("結論/リード（excerpt）を抽出できませんでした");
  if (!body) warnings.push("本文（body）を抽出できませんでした");
  if (faq.length === 0) warnings.push("FAQを抽出できませんでした");
  // keywords は原稿に明示が無いため空。SEOキーワードは投入時に手動設定（創作しない）
  warnings.push("keywords: 原稿に明示なし → 空配列（投入時に手動設定 or 別途生成）");

  // 本文中に既出の相互リンク（/zh-tw/column/<slug>）を収集（整合チェック用）
  const bodyLinksFound = Array.from(
    md.matchAll(/\/zh-tw\/column\/([a-z0-9-]+)/g),
    (m) => m[1],
  ).filter((v, i, a) => a.indexOf(v) === i);

  // 投入時に本文末へ追記する相互リンク（指示書§2 逐語）を content へ反映
  const crossLinkMd = cfg.crossLinks.map((c) => c.markdown).join("\n\n");
  const contentParts = [body];
  if (sources) contentParts.push(`### 本文的依據（法令・出處）\n\n${sources}`);
  if (crossLinkMd) contentParts.push(crossLinkMd);
  const content = contentParts.filter(Boolean).join("\n\n").trim();

  // FirestoreColumn 相当（base=繁体字 かつ translations["zh-tw"] にも複製）
  const localized = {
    title: title ?? "",
    excerpt: excerpt ?? "",
    content,
    category: categoryRaw ?? cfg.category,
    keywords: [] as string[],
    tags: cfg.tags,
    author: AUTHOR,
    faq,
  };
  const firestoreDoc: Record<string, unknown> = {
    business,
    slug: cfg.slug,
    status: "draft",
    locale, // 注: 現行 FirestoreColumn 型には無いフィールド。出し分け実装の布石として付与
    title: localized.title,
    date,
    category: localized.category,
    excerpt: localized.excerpt,
    content: localized.content,
    author: AUTHOR,
    keywords: [],
    tags: cfg.tags,
    faq,
    translations: { "zh-tw": localized },
  };

  return {
    order: cfg.order,
    kind: cfg.kind,
    sourceFile: cfg.file,
    found: true,
    slug: cfg.slug,
    parsedSlug,
    slugOk,
    locale,
    business,
    title,
    titleJa,
    category: categoryRaw ?? cfg.category,
    date,
    excerpt,
    body,
    sources,
    cta,
    faq,
    author: AUTHOR,
    keywords: [],
    tags: cfg.tags,
    crossLinks: cfg.crossLinks,
    implementationNotes: cfg.implementationNotes,
    bodyLinksFound,
    warnings,
    firestoreDoc,
  };
}

// ── メイン ──

function main(): void {
  const write = process.argv.includes("--write");
  if (write) {
    console.error(
      "❌ --write は今日は無効です。本番Firestore投入は明日リセット後に実装/実行します（キックオフ タスク2 の指示）。",
    );
    process.exit(1);
  }

  // scripts/ の 2つ上 = 四葉基幹CRM（原稿mdの置き場）
  const sourceDir = resolve(__dirname, "..", "..");
  const knownSlugs = new Set(ARTICLES.map((a) => a.slug));

  const articles = ARTICLES.map((cfg) => parseArticle(cfg, sourceDir));

  // 相互リンクの解決チェック（リンク先slugが9本の集合内にあるか）
  const crossLinkChecks = articles.flatMap((a) =>
    a.crossLinks.map((c) => ({
      from: a.slug,
      to: c.to,
      resolvesInSet: knownSlugs.has(c.to),
    })),
  );

  // 本文中の既出リンクが9本集合内か（範囲外を警告）
  const orphanBodyLinks = articles.flatMap((a) =>
    a.bodyLinksFound
      .filter((s) => !knownSlugs.has(s))
      .map((s) => ({ from: a.slug, orphan: s })),
  );

  const verification = {
    articleCount: articles.length,
    allFound: articles.every((a) => a.found),
    slugMatch: articles.map((a) => ({
      order: a.order,
      expected: a.slug,
      parsed: a.parsedSlug,
      ok: a.slugOk,
    })),
    allSlugsMatch: articles.every((a) => a.slugOk),
    crossLinkChecks,
    allCrossLinksResolve: crossLinkChecks.every((c) => c.resolvesInSet),
    orphanBodyLinks,
    parseComplete: articles.map((a) => ({
      order: a.order,
      slug: a.slug,
      title: Boolean(a.title),
      excerpt: Boolean(a.excerpt),
      body: a.body.length > 0,
      faqCount: a.faq.length,
    })),
  };

  const output = {
    generatedAt: new Date().toISOString(),
    note: "dry-run。Firestoreには書き込んでいません。base=繁体字 かつ translations['zh-tw'] へ複製する保守的shape。",
    sourceDir,
    articleCount: articles.length,
    verification,
    articles,
  };

  const outPath = resolve(__dirname, "taiwan-columns.preview.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

  // ── コンソールサマリー ──
  console.log("─".repeat(60));
  console.log("台湾9本 seed パース（dry-run）");
  console.log("─".repeat(60));
  console.log(`原稿ディレクトリ: ${sourceDir}`);
  console.log(`プレビュー出力  : ${outPath}\n`);

  console.log("① 全ファイル検出:", verification.allFound ? "✅" : "❌");
  console.log("② slug 指示書一致:", verification.allSlugsMatch ? "✅ 9/9" : "❌");
  for (const s of verification.slugMatch) {
    const mark = s.ok ? "✅" : "❌";
    console.log(`   ${mark} #${s.order} ${s.expected}${s.ok ? "" : `  (原稿: ${s.parsed})`}`);
  }
  console.log("③ 相互リンク解決:", verification.allCrossLinksResolve ? "✅" : "❌");
  for (const c of crossLinkChecks) {
    console.log(`   ${c.resolvesInSet ? "✅" : "❌"} ${c.from} → ${c.to}`);
  }
  if (orphanBodyLinks.length) {
    console.log("⚠️ 本文中の範囲外リンク:");
    for (const o of orphanBodyLinks) console.log(`   - ${o.from} → ${o.orphan}`);
  } else {
    console.log("④ 本文中リンクの範囲外: なし ✅");
  }
  console.log("\n⑤ パース完全性:");
  for (const p of verification.parseComplete) {
    const ok = p.title && p.excerpt && p.body && p.faqCount > 0;
    console.log(
      `   ${ok ? "✅" : "⚠️"} #${p.order} ${p.slug}  title:${p.title ? "○" : "×"} excerpt:${p.excerpt ? "○" : "×"} body:${p.body ? "○" : "×"} faq:${p.faqCount}`,
    );
  }
  console.log("\n完了。--write は明日リセット後に実装/実行します。");
}

main();
