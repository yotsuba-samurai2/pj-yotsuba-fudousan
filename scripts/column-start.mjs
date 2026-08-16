/**
 * npm run column:start
 *
 * V4（DeepSeek V4 Pro）で企画生成 → Sol（GPT-5.6 Sol）で編集長レビュー →
 * COLUMN_BRIEF.md を更新して STATUS: WAITING_FOR_USER で停止する。
 *
 * 人間が介入するのは、この後の「企画選択＋USER_MEMO」の1回だけ。
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runCodex, MODELS, resolveCodexBin } from "./column-routing.mjs";

const REPO = process.cwd();
const COLUMN_BRIEF = resolve(REPO, "COLUMN_BRIEF.md");
const SEED = resolve(REPO, "scripts", "seed-labor-columns.ts");
const PLAN_TEMPLATE = resolve(REPO, "scripts", "labor-columns", "templates", "sol-plan-review.md");

function readColumnBrief() {
  return readFileSync(COLUMN_BRIEF, "utf-8");
}

function getStatus(text) {
  const m = text.match(/^STATUS:\s*(\S+)/m);
  return m ? m[1] : "";
}

/** seed-labor-columns.ts から既存記事の title / slug / category を抜き出す */
function extractExistingArticles() {
  const raw = readFileSync(SEED, "utf-8");
  const out = [];
  const re = /\{\s*file:\s*"[^"]+",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    out.push({ slug: m[1], title: m[2], category: m[3] });
  }
  return out;
}

function buildV4PlanPrompt() {
  return `あなたは社労士コラムの企画担当です。このリポジトリ（四葉社会保険労務士事務所サイト）を調査し、
社労士コラムの新規企画候補を 5〜10 案 生成してください。

【必ず調査すること】
- scripts/labor-columns/ の既存記事（タイトル・slug・カテゴリ・内容）
- scripts/seed-labor-columns.ts の ARTICLES（既存記事とのカニバリ確認）
- src/app/(labor)/labor/services/ の社労士サービスページ
- 既存FAQ・既存カテゴリ・内部リンク

【重視すること】
- 既存記事とのカニバリを最優先で避ける
- 単なる検索流入だけでなく「四葉社会保険労務士事務所に相談する理由が自然に生まれるテーマ」を高く評価
- 営業色の強い企画にはしない
- 時事性（2026年8月時点）を考慮

【一次情報優先】
Web調査が必要なテーマは、厚生労働省・日本年金機構・e-Gov・都道府県労働局・ハローワーク等の一次情報を優先。

【コンプライアンス（最優先）】
shigyo-compliance-gate / CLAUDE.md / AGENTS.md のルールをすべて遵守。
法令・数字・施行日は一次情報で裏取りし、裏取りできないものは「未検証」と明記。

【各企画に含める項目】
企画番号 / 仮タイトル / 想定読者 / 検索意図 / primary keyword / secondary keywords /
記事を書く理由 / 既存記事との差別化 / 関連する既存記事 / 関連サービス / 想定内部リンク /
法改正・最新情報確認の必要性 / SEO期待度★1〜5 / AIO・LLMO期待度★1〜5 / 問い合わせ寄与★1〜5 /
カニバリリスク / 法令確認の必要性

出力は Markdown で、各企画を「### 企画N：タイトル」の見出しで区切ってください。`;
}

function buildSolPlanPrompt(v4Output, existingArticles) {
  const existing = existingArticles
    .map((a) => `- ${a.title}（${a.category}）slug=${a.slug}`)
    .join("\n");
  const template = readFileSync(PLAN_TEMPLATE, "utf-8");

  return `あなたは社労士コラムの編集長（品質保証担当）です。以下に DeepSeek V4 Pro が生成した企画候補を渡します。
有望な約3案に絞り、編集指示を付けてレビューしてください。

【入力1：V4 の企画候補】
${v4Output}

【入力2：既存記事（タイトル・カテゴリ・slug）】
${existing}

【評価・出力形式のルール】
${template}

なお、リポジトリ全体を再調査せず、上記の入力だけに基づいて評価してください。`;
}

function writeRecommendedPlans(brief, solOutput) {
  const marker = "## SOL RECOMMENDED PLANS";
  // 既存の SOL RECOMMENDED PLANS 節を除去してから末尾に追記する
  const without = brief.split(new RegExp(`^${marker}[\\s\\S]*?(?=^## |\\z)`, "m")).join(marker + "\n\n");
  let next = without;
  if (!next.includes(marker)) {
    next = next.trimEnd() + "\n\n" + marker + "\n\n" + solOutput.trim() + "\n";
  } else {
    next = next.replace(marker + "\n\n", marker + "\n\n" + solOutput.trim() + "\n\n");
  }
  return next.replace(/^STATUS:\s*\S+/m, "STATUS: WAITING_FOR_USER");
}

async function main() {
  console.log(`[column:start] codex = ${resolveCodexBin()}`);
  console.log(`[column:start] ${MODELS.v4.label} で企画生成 → ${MODELS.sol.label} で編集長レビュー\n`);

  let brief = readColumnBrief();
  const status = getStatus(brief);
  if (status !== "NEW" && status !== "WAITING_FOR_USER" && status !== "") {
    // 前回 COMPLETED 等で終了済みの場合は、過去ログ・記事本文を壊さず STATUS だけ NEW に戻して続行する
    brief = brief.replace(/^STATUS:\s*\S+/m, "STATUS: NEW");
    console.log(`[column:start] 前回 STATUS=${status} を NEW にリセットして続行します（過去ログ・記事本文は保持）`);
  }

  // フェーズ1A：V4 企画生成
  console.log("[1/3] V4 が企画候補を生成中…\n");
  const v4Output = await runCodex("v4", buildV4PlanPrompt());

  // フェーズ1B：Sol 編集長レビュー
  console.log("\n[2/3] Sol が編集長レビュー中…\n");
  const existing = extractExistingArticles();
  const solOutput = await runCodex("sol", buildSolPlanPrompt(v4Output, existing));

  // COLUMN_BRIEF.md 更新
  const updated = writeRecommendedPlans(brief, solOutput);
  writeFileSync(COLUMN_BRIEF, updated);
  console.log("\n[3/3] COLUMN_BRIEF.md を更新しました（STATUS: WAITING_FOR_USER）\n");
  console.log("企画候補が SOL RECOMMENDED PLANS に記載されました。");
  console.log("人間は SELECTED_PLAN と USER_MEMO を記入し、STATUS を APPROVED にしてください。");
}

main().catch((e) => {
  console.error("\n[column:start] 失敗:", e.message || e);
  process.exit(1);
});
