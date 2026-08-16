/**
 * 社労士コラム V4 Pro × GPT-5.6 Sol 自動編集ワークフロー — モデルルーティング共通部
 *
 * モデル名・provider は推測せず、実測した値（2026-08-16 時点の ~/.codex/config.toml /
 * models.json / models_cache.json から確認）をこの1箇所に集約する。
 *   - DeepSeek V4 Pro（制作担当）: model=deepseek-v4-pro / provider=deepseek
 *   - GPT-5.6 Sol（編集長・品質保証）: model=gpt-5.6-sol / provider=openai
 *
 * グローバル設定（~/.codex/config.toml）は変更しない。provider は実行時に
 * `codex exec --model <id> -c model_provider=<provider>` で一時的に上書きする。
 */

import { spawn, execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

/** 実測したモデルID・provider（ここだけを正とする） */
export const MODELS = {
  v4: { id: "deepseek-v4-pro", provider: "deepseek", label: "DeepSeek V4 Pro（制作担当）" },
  sol: { id: "gpt-5.6-sol", provider: "openai", label: "GPT-5.6 Sol（編集長・品質保証）" },
};

/** macOS Keychain に保存した DeepSeek APIキーの参照先（値は書かない・ログにも出さない） */
const DEEPSEEK_KEYCHAIN_SERVICE = process.env.DEEPSEEK_KEYCHAIN_SERVICE || "com.yotsuba.codex.deepseek";
const DEEPSEEK_KEYCHAIN_ACCOUNT = process.env.DEEPSEEK_KEYCHAIN_ACCOUNT || "deepseek-api-key";

/**
 * DeepSeek APIキーを取得する。環境変数 DEEPSEEK_API_KEY を優先し、
 * 無ければ macOS Keychain から `security find-generic-password -w` で取得する。
 * @returns {string|null} 値は呼び出し元が env にのみ渡し、ログには出さない。
 */
function getDeepSeekApiKey() {
  if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY;
  try {
    const key = execFileSync(
      "security",
      ["find-generic-password", "-a", DEEPSEEK_KEYCHAIN_ACCOUNT, "-s", DEEPSEEK_KEYCHAIN_SERVICE, "-w"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return key || null;
  } catch {
    return null;
  }
}

/**
 * codex CLI バイナリを解決する。
 * Homebrew の `codex` は native バイナリ欠落で ENOENT になることがあるため、
 * デスクトップアプリ同梱の codex を優先し、最後に PATH の `codex` にフォールバックする。
 */
export function resolveCodexBin() {
  const candidates = [
    process.env.CODEX_CLI_PATH,
    "/Applications/ChatGPT.app/Contents/Resources/codex",
    "codex",
  ].filter(Boolean);

  for (const c of candidates) {
    if (c === "codex") return c; // PATH 任せ
    if (existsSync(c)) return c;
  }
  return "codex";
}

/**
 * `codex exec --model <id> -c model_provider=<provider>` を非対話で起動し、
 * プロンプトを stdin から渡して標準出力を返す。
 *
 * @param {keyof typeof MODELS} modelKey v4 | sol
 * @param {string} prompt エージェントへの指示
 * @param {{ cwd?: string, env?: Record<string,string>, stream?: boolean }} [opts]
 * @returns {Promise<string>} エージェントの最終メッセージ（--output-last-message で回収）
 */
export function runCodex(modelKey, prompt, opts = {}) {
  const m = MODELS[modelKey];
  const bin = resolveCodexBin();
  // 最終メッセージだけを確実に回収する（stdout は実況を含むため）
  const lastMsgFile = join(tmpdir(), `codex-column-${m.id}-${randomBytes(6).toString("hex")}.txt`);
  const args = [
    "exec",
    "--model", m.id,
    "-c", `model_provider=${m.provider}`,
    "--ephemeral",
    "--skip-git-repo-check",
    "--output-last-message", lastMsgFile,
  ];

  // 子プロセスの env。DeepSeek 実行時のみキーを注入し、ログには出さない。
  const childEnv = { ...process.env, ...(opts.env || {}) };
  if (modelKey === "v4") {
    const key = getDeepSeekApiKey();
    if (key) childEnv.DEEPSEEK_API_KEY = key;
  }

  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      cwd: opts.cwd || process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
      env: childEnv,
    });

    let out = "";
    let err = "";
    child.stdout.on("data", (d) => {
      out += d;
      if (opts.stream !== false) process.stdout.write(d);
    });
    child.stderr.on("data", (d) => {
      err += d;
      if (opts.stream !== false) process.stderr.write(d);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      let last = "";
      try {
        last = readFileSync(lastMsgFile, "utf-8");
      } catch {
        last = out;
      } finally {
        rmSync(lastMsgFile, { force: true });
      }
      if (code === 0) resolve(last || out);
      else reject(new Error(`codex exec (${m.id}) exited with code ${code}\n${err}`));
    });

    child.stdin.on("error", () => {}); // EPIPE は無視（プロンプト読取後に閉じられることがある）
    child.stdin.end(prompt);
  });
}

/**
 * デフォルトモデル（config.toml の model）で `codex exec` を非対話起動する。
 * 手動モデルレビューゲート方式で使用する。`--model` によるモデル切替は行わない。
 *
 * @param {string} prompt エージェントへの指示
 * @param {{ cwd?: string, env?: Record<string,string>, stream?: boolean }} [opts]
 * @returns {Promise<string>} エージェントの最終メッセージ
 */
export function runCodexDefault(prompt, opts = {}) {
  const bin = resolveCodexBin();
  const lastMsgFile = join(tmpdir(), `codex-column-default-${randomBytes(6).toString("hex")}.txt`);
  const args = [
    "exec",
    "--ephemeral",
    "--skip-git-repo-check",
    "--output-last-message", lastMsgFile,
  ];

  const childEnv = { ...process.env, ...(opts.env || {}) };
  const key = getDeepSeekApiKey();
  if (key) childEnv.DEEPSEEK_API_KEY = key;

  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      cwd: opts.cwd || process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
      env: childEnv,
    });

    let out = "";
    let err = "";
    child.stdout.on("data", (d) => {
      out += d;
      if (opts.stream !== false) process.stdout.write(d);
    });
    child.stderr.on("data", (d) => {
      err += d;
      if (opts.stream !== false) process.stderr.write(d);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      let last = "";
      try {
        last = readFileSync(lastMsgFile, "utf-8");
      } catch {
        last = out;
      } finally {
        rmSync(lastMsgFile, { force: true });
      }
      if (code === 0) resolve(last || out);
      else reject(new Error(`codex exec exited with code ${code}\n${err}`));
    });

    child.stdin.on("error", () => {});
    child.stdin.end(prompt);
  });
}

/** 実行ファイルパスをログ表示する（デバッグ用） */
export function describeModels() {
  return Object.entries(MODELS)
    .map(([k, v]) => `${k}: ${v.label} / model=${v.id} / provider=${v.provider}`)
    .join("\n");
}
