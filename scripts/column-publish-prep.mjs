/**
 * npm run column:publish-prep
 *
 * 手動モデルレビューゲート方式（PHASE 3）。
 * ARTICLE_REVIEW_OUTPUT.md を読み、デフォルトモデル（DeepSeek V4 Pro）で修正・翻訳・seed を実行し、
 * 検証 → build → git diff で停止する。commit / push / deploy / DB write はしない。
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { runCodexDefault, resolveCodexBin } from "./column-routing.mjs";

const REPO = process.cwd();
const REVIEW_DIR = resolve(REPO, "scripts", "labor-columns", "review-work");
const ARTICLE_OUTPUT = resolve(REVIEW_DIR, "ARTICLE_REVIEW_OUTPUT.md");
const COLUMN_BRIEF = resolve(REPO, "COLUMN_BRIEF.md");

function buildPrompt(articleReview, columnBrief) {
  return `あなたは社労士コラムの執筆担当です。以下の作業を行ってください。

【1. ルールを読む】
AGENTS.md / CLAUDE.md および shigyo-compliance-gate 等のコンプライアンス規程を遵守してください。

【2. レビュー結果を読む】
ARTICLE_REVIEW_OUTPUT.md を読み、一次資料と照合してください。
CRITICAL / IMPORTANT / FACT_CHECK を原則修正し、OPTIONAL は必要に応じて採用し、
USER_MEMO（COLUMN_BRIEF.md）の意図を壊さないでください。全文を書き直さず必要箇所だけ修正してください。

【3. 多言語翻訳】
日本語原稿確定後、English / 台湾華語（繁体字） / 中国語簡体字 を生成してください。
- 翻訳は frontmatter（title/excerpt/category/faqHeading/keywords/tags）付き
- 内部リンクはロケール前置（/en/labor/...、/zh-tw/labor/...、/zh/labor/...）
- 事務所名は全言語で日本語表記のまま（四葉社会保険労務士事務所）
- faqHeading: en=Frequently asked questions / zh-tw=常見問題 / zh=常见问题
- zh-tw/zh の条項号は「款」を使わず「項/项」を使う

【4. seed登録】
scripts/seed-labor-columns.ts の ARTICLES 末尾に登録してください（slug/title/category/excerpt/keywords/tags）。

【5. 検証】
以下を実行してください。
- node --import tsx scripts/seed-labor-columns.ts（「OK: 全チェック通過」を確認）
- node --import tsx scripts/seed-labor-columns.ts --emit-ts（labor-columns-seed.ts 生成）

【6. 安全ルール】
git commit / push / PR / merge / 本番deploy / DB --write は行わない。

【参考：編集意図】
${columnBrief}

【参考：原稿レビュー】
${articleReview}`;
}

function runShell(cmd) {
  const r = spawnSync("sh", ["-lc", cmd], { cwd: REPO, stdio: "inherit" });
  return r.status;
}

async function main() {
  console.log(`[column:publish-prep] codex = ${resolveCodexBin()}（デフォルトモデル）\n`);

  if (!existsSync(ARTICLE_OUTPUT)) {
    console.error("[column:publish-prep] ARTICLE_REVIEW_OUTPUT.md が存在しません。先に column:draft と人間レビューを完了してください。");
    process.exit(1);
  }

  const articleReview = readFileSync(ARTICLE_OUTPUT, "utf-8");
  const columnBrief = existsSync(COLUMN_BRIEF) ? readFileSync(COLUMN_BRIEF, "utf-8") : "";

  console.log("[column:publish-prep] レビュー反映・翻訳・seed を実行中…\n");
  await runCodexDefault(buildPrompt(articleReview, columnBrief));

  console.log("\n[column:publish-prep] 検証を実行中…\n");
  const checks = [
    "node --import tsx scripts/seed-labor-columns.ts",
    "npx tsc --noEmit",
    "npx eslint scripts/seed-labor-columns.ts src/lib/data/labor-columns-seed.ts",
    "npx vitest run",
  ];
  for (const c of checks) {
    console.log(`$ ${c}`);
    const code = runShell(c);
    if (code !== 0) {
      console.error(`[column:publish-prep] 検証に失敗しました: ${c}`);
      process.exit(1);
    }
  }

  console.log("\n--- git diff --stat ---");
  runShell("git diff --stat");

  console.log("\n[column:publish-prep] 完了（ここで停止）。");
  console.log("commit / push / PR / merge / 本番deploy / DB write は行っていません。");
}

main().catch((e) => {
  console.error("\n[column:publish-prep] 失敗:", e.message || e);
  process.exit(1);
});
