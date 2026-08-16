/**
 * npm run column:draft
 *
 * 手動モデルレビューゲート方式（PHASE 2）。
 * PLAN_REVIEW_OUTPUT.md と COLUMN_BRIEF.md を読み、デフォルトモデル（DeepSeek V4 Pro）で
 * 日本語原稿を執筆し、ARTICLE_REVIEW_INPUT.md を書き出して停止する。モデル自動切替はしない。
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runCodexDefault, resolveCodexBin } from "./column-routing.mjs";

const REPO = process.cwd();
const REVIEW_DIR = resolve(REPO, "scripts", "labor-columns", "review-work");
const PLAN_OUTPUT = resolve(REVIEW_DIR, "PLAN_REVIEW_OUTPUT.md");
const TEMPLATE = resolve(REVIEW_DIR, "ARTICLE_REVIEW_INPUT.template.md");
const ARTICLE_INPUT = resolve(REVIEW_DIR, "ARTICLE_REVIEW_INPUT.md");
const COLUMN_BRIEF = resolve(REPO, "COLUMN_BRIEF.md");

function buildPrompt(planReview, columnBrief) {
  const template = readFileSync(TEMPLATE, "utf-8");
  return `あなたは社労士コラムの執筆担当です。以下の作業を行ってください。

【1. ルールを読む】
AGENTS.md / CLAUDE.md および shigyo-compliance-gate 等のコンプライアンス規程を遵守してください。
特に CLAUDE.md §5 の原稿形式（H1なし・「**結論（先に要点）**：」開始・H2は疑問文・FAQ4問・
「この記事の根拠」・判断留保・著者リンク）を厳守してください。

【2. 選択企画とレビューを読む】
COLUMN_BRIEF.md（SELECTED_PLAN / USER_MEMO）と PLAN_REVIEW_OUTPUT.md を最優先で読んでください。

【3. 日本語原稿を執筆する】
一次資料調査（厚生労働省・e-Gov等を優先）→ 構成 → 日本語本文 → SEO / AIO / LLMO → FAQ4問 → 内部リンク → 判断留保 まで完成させる。
記事番号は scripts/labor-columns/ の既存最大番号+1。slug は既存と重複させない。
日本語原稿を scripts/labor-columns/NN-slug.md に書き出してください。

【4. ARTICLE_REVIEW_INPUT.md を生成する】
以下のテンプレートに従い、scripts/labor-columns/review-work/ARTICLE_REVIEW_INPUT.md に書き出してください。

---テンプレート---
${template}

【5. 停止条件】
多言語翻訳・seed・emit・build・実装には進まない。ARTICLE_REVIEW_INPUT.md 生成後に停止してください。

【参考：選択企画と編集意図】
${columnBrief}

【参考：企画レビュー】
${planReview}`;
}

async function main() {
  console.log(`[column:draft] codex = ${resolveCodexBin()}（デフォルトモデル）\n`);

  if (!existsSync(PLAN_OUTPUT)) {
    console.error("[column:draft] PLAN_REVIEW_OUTPUT.md が存在しません。先に column:plan と人間レビューを完了してください。");
    process.exit(1);
  }

  const planReview = readFileSync(PLAN_OUTPUT, "utf-8");
  const columnBrief = existsSync(COLUMN_BRIEF) ? readFileSync(COLUMN_BRIEF, "utf-8") : "";

  console.log("[column:draft] 日本語原稿を執筆中…\n");
  await runCodexDefault(buildPrompt(planReview, columnBrief));

  console.log("\n[column:draft] 完了。");
  console.log("ARTICLE_REVIEW_INPUT.md を Sol または Fable 5 へ渡してください。");
  console.log("レビュー結果は scripts/labor-columns/review-work/ARTICLE_REVIEW_OUTPUT.md に保存してください。");
}

main().catch((e) => {
  console.error("\n[column:draft] 失敗:", e.message || e);
  process.exit(1);
});
