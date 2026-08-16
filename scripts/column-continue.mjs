/**
 * npm run column:continue
 *
 * STATUS: APPROVED になってから実行する。
 * V4（執筆・修正・翻訳）→ Sol（編集長レビュー）→ V4（反映）→ seed → 検証 → git diff →
 * STATUS: COMPLETED で停止する。
 *
 * 安全ルール：git commit / push / PR / merge / 本番deploy / DB --write は自動実行しない。
 * 本番DB投入と本番deployは人間が行う。
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { runCodex, MODELS, resolveCodexBin } from "./column-routing.mjs";

const REPO = process.cwd();
const COLUMN_BRIEF = resolve(REPO, "COLUMN_BRIEF.md");
const EDITOR_TEMPLATE = resolve(REPO, "scripts", "labor-columns", "templates", "sol-editor-review.md");

function readColumnBrief() {
  return readFileSync(COLUMN_BRIEF, "utf-8");
}

function getStatus(text) {
  const m = text.match(/^STATUS:\s*(\S+)/m);
  return m ? m[1] : "";
}

function getSelectedPlan(text) {
  const m = text.match(/^SELECTED_PLAN:\s*(\S+)/m);
  return m ? m[1] : "";
}

function getUserMemo(text) {
  const m = text.match(/^USER_MEMO:([\s\S]*?)(?=^---$|^## )/m);
  return m ? m[1].trim() : "";
}

function getSolPlanReview(text) {
  const m = text.match(/^## SOL RECOMMENDED PLANS([\s\S]*?)(?=^## |\z)/m);
  return m ? m[1].trim() : "";
}

/** scripts/labor-columns/ 直下の日本語原稿（NN-*.md）を一覧化 */
function listJaArticles() {
  const dir = resolve(REPO, "scripts", "labor-columns");
  return readdirSync(dir).filter((f) => /^\d+-.*\.md$/.test(f)).sort();
}

function buildDraftPrompt(memo, planReview, selectedPlan) {
  return `あなたは社労士コラムの制作担当です。以下の「選択企画」と「USER_MEMO（人間の編集意図）」に従い、
社労士コラムの日本語本文を執筆してください。

【選択企画（SELECTED_PLAN=${selectedPlan}）と編集方針】
${planReview || "（企画レビューはありません）"}

【USER_MEMO（最優先。ただし法令・一次資料・コンプライアンスよりは下位）】
${memo || "（なし）"}

【執筆ルール（CLAUDE.md §5 / AGENTS.md を厳守）】
- H1 は本文に入れない。冒頭は「**結論（先に要点）**：」から始める
- H2 は原則疑問文（「この記事の根拠」「よくある質問」を除く）
- FAQ は4問。末尾に「## この記事の根拠」を入れる
- 判断留保（「個別の判断は資格者が行います」等）と著者リンク [浦松丈二](/about/uramatsu) を入れる
- 既存記事の文体に合わせる。AI特有の冗長表現・「徹底解説します」等の定型文は使わない
- 記事番号は scripts/labor-columns/ の既存最大番号＋1。slug は既存と重複させない
- 受任主体（社会保険労務士／行政書士／宅建／不動産／税理士）を混同しない
- 本文2000字以上、/labor/ 配下への内部リンク最低1本、「ワンストップ」「一括対応」等の禁止語を使わない

【ファクトチェック】
法令・数字・施行日は厚生労働省・日本年金機構・e-Gov 等の一次情報で必ず確認し、
成立済み／施行予定／検討中を混同しない。裏取りできない事項は「未検証」と明記する。

【出力】
Markdown 形式で、ファイル scripts/labor-columns/NN-slug.md に日本語本文を書いてください。
この時点では翻訳・seed は行いません。`;
}

function buildEditorPrompt(memo, planReview, draft) {
  const template = readFileSync(EDITOR_TEMPLATE, "utf-8");
  return `あなたは社労士コラムの編集長（品質保証担当）です。以下の日本語完成原稿をレビューしてください。
原稿の書き直し・再掲は禁止です。

【USER_MEMO（人間の編集意図）】
${memo || "（なし）"}

【企画段階の編集方針】
${planReview || "（なし）"}

【日本語完成原稿】
${draft}

【レビュー形式】
${template}`;
}

function buildRevisePrompt(memo, editorReview) {
  return `あなたは社労士コラムの制作担当です。以下の編集長レビューを反映し、記事を完成させてください。

【USER_MEMO（勝手に意図を変えない）】
${memo || "（なし）"}

【編集長レビュー】
${editorReview}

【作業内容】
1. SOL_EDITOR_REVIEW の CRITICAL / IMPORTANT / FACT_CHECK を原則修正する。
   OPTIONAL は文章品質を改善する場合のみ採用する。
   Sol の指摘と一次資料が矛盾する場合は一次資料を優先する。全文を書き直さず必要箇所だけ修正する。
2. 日本語版確定後、English / 台湾華語（繁体字） / 中国語簡体字 を生成する。
   - 翻訳は frontmatter（title/excerpt/category/faqHeading/keywords/tags）付き
   - 内部リンクはロケール前置（/en/labor/...、/zh-tw/labor/...、/zh/labor/...）
   - 事務所名は全言語で日本語表記のまま（四葉社会保険労務士事務所）
   - faqHeading: en=Frequently asked questions / zh-tw=常見問題 / zh=常见问题
   - zh-tw/zh の条項号は「款」を使わず「項/项」を使う
3. scripts/seed-labor-columns.ts の ARTICLES 末尾に登録する（slug/title/category/excerpt/keywords/tags）。
4. dry-run: node --import tsx scripts/seed-labor-columns.ts → 「OK: 全チェック通過」を確認する。
5. emit: node --import tsx scripts/seed-labor-columns.ts --emit-ts で labor-columns-seed.ts を生成する。

【安全ルール】
git commit / push / PR / merge / 本番deploy / DB --write は行わない。`;
}

function runShell(cmd) {
  const r = spawnSync("sh", ["-lc", cmd], { cwd: REPO, stdio: "inherit" });
  return r.status;
}

async function main() {
  console.log(`[column:continue] codex = ${resolveCodexBin()}`);
  console.log(`[column:continue] ${MODELS.v4.label} で執筆 → ${MODELS.sol.label} でレビュー → V4 で反映\n`);

  const brief = readColumnBrief();
  const status = getStatus(brief);
  const selectedPlan = getSelectedPlan(brief);
  if (status !== "APPROVED" || !selectedPlan) {
    console.error("[column:continue] STATUS=APPROVED かつ SELECTED_PLAN が記入されている必要があります");
    process.exit(1);
  }

  const memo = getUserMemo(brief);
  const planReview = getSolPlanReview(brief);

  // 1) V4 執筆
  console.log("[1/4] V4 が一次情報調査＋日本語本文を執筆中…\n");
  const beforeDraft = new Set(listJaArticles());
  await runCodex("v4", buildDraftPrompt(memo, planReview, selectedPlan));
  const newDraft = listJaArticles().filter((f) => !beforeDraft.has(f)).sort().at(-1);
  if (!newDraft) {
    throw new Error("V4 が日本語原稿を生成していません（scripts/labor-columns/NN-*.md が増えていません）");
  }
  const draft = readFileSync(resolve(REPO, "scripts", "labor-columns", newDraft), "utf-8");
  console.log(`    生成: scripts/labor-columns/${newDraft}\n`);

  // 2) Sol 編集長レビュー
  console.log("\n[2/4] Sol が編集長レビュー中…\n");
  const editorReview = await runCodex("sol", buildEditorPrompt(memo, planReview, draft));

  // 3) V4 修正＋翻訳＋seed
  console.log("\n[3/4] V4 が修正・翻訳・seed登録を実行中…\n");
  await runCodex("v4", buildRevisePrompt(memo, editorReview));

  // 4) 検証（機械的ゲート）
  console.log("\n[4/4] 検証を実行中…\n");
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
      console.error(`[column:continue] 検証に失敗しました: ${c}`);
      process.exit(1);
    }
  }

  // git diff（表示のみ。commit はしない）
  console.log("\n--- git diff --stat ---");
  runShell("git diff --stat");

  // STATUS: COMPLETED へ
  const updated = brief.replace(/^STATUS:\s*\S+/m, "STATUS: COMPLETED");
  writeFileSync(COLUMN_BRIEF, updated);
  console.log("\n[column:continue] 完了（STATUS: COMPLETED）");
  console.log("本番DB投入（/admin/columns/seed-labor）と本番deployは、人間が行ってください。");
  console.log("git commit / push / PR / merge は自動実行していません。");
}

main().catch((e) => {
  console.error("\n[column:continue] 失敗:", e.message || e);
  process.exit(1);
});
