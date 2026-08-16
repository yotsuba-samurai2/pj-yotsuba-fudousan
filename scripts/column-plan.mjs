/**
 * npm run column:plan
 *
 * 手動モデルレビューゲート方式（PHASE 1）。
 * デフォルトモデル（DeepSeek V4 Pro）で企画候補を生成し、
 * PLAN_REVIEW_INPUT.md を書き出して停止する。モデル自動切替はしない。
 */

import { existsSync, readFileSync, copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { runCodexDefault, resolveCodexBin } from "./column-routing.mjs";

const REPO = process.cwd();
const REVIEW_DIR = resolve(REPO, "scripts", "labor-columns", "review-work");
const ARCHIVE_DIR = resolve(REVIEW_DIR, "archive");
const TEMPLATE = resolve(REVIEW_DIR, "PLAN_REVIEW_INPUT.template.md");
const PLAN_INPUT = resolve(REVIEW_DIR, "PLAN_REVIEW_INPUT.md");

function timestamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function buildPrompt() {
  const template = readFileSync(TEMPLATE, "utf-8");
  return `あなたは社労士コラムの企画担当です。以下の作業を行ってください。

【1. ルールを読む】
AGENTS.md / CLAUDE.md および shigyo-compliance-gate 等のコンプライアンス規程を遵守してください。

【2. リポジトリを調査する】
- scripts/labor-columns/ の既存記事（タイトル・slug・カテゴリ・内容）
- scripts/seed-labor-columns.ts の ARTICLES（既存記事とのカニバリ確認）
- 社労士サービスページ、既存FAQ、内部リンク
- 検索意図、時事性（2026年8月時点）、法改正、サービスとの接続
- SEO / AIO / LLMO、問い合わせ寄与、コンプライアンス

【3. 企画候補を5〜10本生成する】
各企画に最低限、企画番号 / 仮タイトル / 想定読者 / primary keyword / secondary keywords /
search intent / 今書く理由 / 時事性 / 既存記事との差別化 / 関連記事 / 関連サービス /
SEO期待度 / AIO・LLMO期待度 / 問い合わせ寄与 / カニバリリスク / 法令確認事項 を含める。

【4. PLAN_REVIEW_INPUT.md を生成する】
以下のテンプレートに従い、scripts/labor-columns/review-work/PLAN_REVIEW_INPUT.md に書き出してください。
既存の PLAN_REVIEW_INPUT.md がある場合は、まず archive/${timestamp()}-PLAN_REVIEW_INPUT.md へ退避してください。

---テンプレート---
${template}

【5. 停止条件】
本文執筆・翻訳・seed・実装には進まない。PLAN_REVIEW_INPUT.md 生成後に停止してください。`;
}

async function main() {
  console.log(`[column:plan] codex = ${resolveCodexBin()}（デフォルトモデル）\n`);

  // 既存の PLAN_REVIEW_INPUT.md を archive へ退避
  if (existsSync(PLAN_INPUT)) {
    mkdirSync(ARCHIVE_DIR, { recursive: true });
    const dst = resolve(ARCHIVE_DIR, `${timestamp()}-PLAN_REVIEW_INPUT.md`);
    copyFileSync(PLAN_INPUT, dst);
    console.log(`[column:plan] 既存の PLAN_REVIEW_INPUT.md を ${dst} へ退避しました`);
  }

  console.log("[column:plan] 企画候補を生成中…\n");
  await runCodexDefault(buildPrompt());

  console.log("\n[column:plan] 完了。");
  console.log("PLAN_REVIEW_INPUT.md を Sol または Fable 5 へ渡してください。");
  console.log("レビュー結果は scripts/labor-columns/review-work/PLAN_REVIEW_OUTPUT.md に保存してください。");
}

main().catch((e) => {
  console.error("\n[column:plan] 失敗:", e.message || e);
  process.exit(1);
});
