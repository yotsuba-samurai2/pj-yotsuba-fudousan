/**
 * Search Console の自動処理（.github/workflows/columns-autopublish.yml が正午の自動公開のあとに呼ぶ）。
 *
 *   npx tsx scripts/gsc-autopilot.ts --prev prev.json --out status.json --summary summary.md [--publish publish.json]
 *
 * 1. サイトマップを Search Console に送り直す（sitemaps.submit）
 * 2. 直近 GSC_WINDOW_DAYS 日の日本語コラムの登録状況を URL検査API で確かめる
 * 3. 結果を status.json（次回の入力・朝の納品タスクが読む）と summary.md（人が読む）に書く
 *
 * 環境変数：
 * - GSC_SERVICE_ACCOUNT_JSON：サービスアカウントの鍵（JSON）。**無ければ 1・2 を飛ばし、summary に未設定と書く**
 * - GSC_SITE_URL：Search Console のプロパティ。既定 `sc-domain:luck428.com`（URLプレフィックスなら `https://luck428.com/`）
 * - GSC_WINDOW_DAYS（既定45）・GSC_RECHECK_DAYS（既定7）・GSC_MAX_INSPECTIONS（既定150）・GSC_MIN_AGE_DAYS（既定3）
 *
 * インデックス登録のリクエストそのものは、Googleが一般の記事向けのAPIを出していないため行わない
 * （Indexing API は求人とライブ配信のページ専用。記事に使うとアクセスを取り消されることがある）。
 * 判定の中身は src/lib/gsc/autopilot-core.ts。
 */
import { createSign } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import {
  countByVerdict,
  manualRequestCandidates,
  mergeStatus,
  parseSitemap,
  pickUrlsToInspect,
  selectJaColumnUrls,
  toUrlStatus,
  type StatusFile,
  type UrlStatus,
} from "../src/lib/gsc/autopilot-core";

const SITE = "https://luck428.com";
const SITEMAP_URL = `${SITE}/sitemap.xml`;
const SCOPE = "https://www.googleapis.com/auth/webmasters";

type ServiceAccount = { client_email: string; private_key: string; token_uri?: string };

type PublishResult = {
  published?: { title: string; path: string; business: string }[];
  held?: { title: string; path: string }[];
  errors?: { key: string; message: string }[];
  blocked?: string;
  refreshError?: string;
  skipped?: string;
  error?: string;
};

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function intEnv(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

function readJson<T>(path: string | undefined, fallback: T): T {
  if (!path || !existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

const base64url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

/** サービスアカウントの鍵で署名したJWTを、アクセストークンに交換する（Google OAuth 2.0 のサーバー間フロー） */
async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const tokenUri = sa.token_uri ?? "https://oauth2.googleapis.com/token";
  const iat = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: tokenUri, iat, exp: iat + 3600 }));
  const signature = base64url(createSign("RSA-SHA256").update(`${header}.${claims}`).sign(sa.private_key));
  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`アクセストークンを取得できません（${res.status}）：${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("アクセストークンが応答に含まれていません");
  return json.access_token;
}

async function submitSitemap(token: string, siteUrl: string): Promise<void> {
  const url =
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}` +
    `/sitemaps/${encodeURIComponent(SITEMAP_URL)}`;
  const res = await fetch(url, { method: "PUT", headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`サイトマップの送信に失敗（${res.status}）：${(await res.text()).slice(0, 300)}`);
}

async function inspect(token: string, siteUrl: string, inspectionUrl: string): Promise<Record<string, unknown>> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ inspectionUrl, siteUrl, languageCode: "ja" }),
    });
    if (res.ok) {
      const json = (await res.json()) as { inspectionResult?: { indexStatusResult?: Record<string, unknown> } };
      return json.inspectionResult?.indexStatusResult ?? {};
    }
    // 429（毎分の上限）だけは待って1回やり直す。それ以外は即失敗
    if (res.status === 429 && attempt < 2) {
      await new Promise((r) => setTimeout(r, 30_000));
      continue;
    }
    throw new Error(`URL検査に失敗（${res.status}）：${(await res.text()).slice(0, 200)}`);
  }
}

function renderSummary(args: {
  now: Date;
  status: StatusFile;
  publish: PublishResult;
  gscNote: string[];
  inspected: number;
  minAgeDays: number;
}): string {
  const { now, status, publish, gscNote, inspected, minAgeDays } = args;
  const jst = now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  const lines: string[] = [`# コラムの自動公開とSearch Consoleの確認（${jst}）`, ""];

  lines.push("## 正午の自動公開", "");
  if (publish.skipped) lines.push(`- 実行していません（${publish.skipped}）`);
  else if (publish.error) lines.push(`- 失敗：${publish.error}`);
  else {
    if (publish.blocked) lines.push(`- **止めました**：${publish.blocked}`);
    const published = publish.published ?? [];
    lines.push(`- 公開した記事：${published.length}本`);
    for (const p of published) lines.push(`  - ${SITE}${p.path}　${p.title}`);
    const held = publish.held ?? [];
    if (held.length > 0) {
      lines.push(`- 保留中（自動公開していない）：${held.length}本`);
      for (const h of held) lines.push(`  - ${h.title}`);
    }
    for (const e of publish.errors ?? []) lines.push(`- 失敗：${e.key}：${e.message}`);
    if (publish.refreshError) lines.push(`- 公開ページの更新に失敗：${publish.refreshError}`);
  }

  lines.push("", "## Search Console", "");
  for (const note of gscNote) lines.push(`- ${note}`);
  const counts = countByVerdict(status);
  const total = Object.keys(status.urls).length;
  lines.push(
    `- 確認の対象：直近${status.windowDays}日の日本語コラム ${total}本（今回確かめたのは${inspected}本）`,
    `- 登録済み（PASS）${counts.PASS ?? 0}本・除外（NEUTRAL）${counts.NEUTRAL ?? 0}本・エラー（FAIL）${counts.FAIL ?? 0}本・未確認 ${(counts.UNCHECKED ?? 0) + (counts.ERROR ?? 0)}本`,
  );

  const manual = manualRequestCandidates(status, { now, minAgeDays });
  lines.push("", `## 手でリクエストする候補（公開から${minAgeDays}日以上たって未登録）`, "");
  if (manual.length === 0) lines.push("- ありません");
  for (const m of manual) {
    lines.push(`- ${m.url}（${m.lastmod ?? "日付不明"}・${m.days ?? "?"}日・${m.coverageState ?? m.verdict}）`);
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const now = new Date();
  const outPath = arg("out") ?? "status.json";
  const summaryPath = arg("summary") ?? "summary.md";
  const prev = readJson<StatusFile | Record<string, never>>(arg("prev"), {});
  const prevUrls: Record<string, UrlStatus> = "urls" in prev && prev.urls ? prev.urls : {};
  const publish = readJson<PublishResult>(arg("publish"), { skipped: "自動公開の結果がありません" });

  const windowDays = intEnv("GSC_WINDOW_DAYS", 45);
  const recheckDays = intEnv("GSC_RECHECK_DAYS", 7);
  const maxInspections = intEnv("GSC_MAX_INSPECTIONS", 150);
  const minAgeDays = intEnv("GSC_MIN_AGE_DAYS", 3);
  const siteUrl = process.env.GSC_SITE_URL || "sc-domain:luck428.com";

  const gscNote: string[] = [];
  const results: Record<string, UrlStatus> = {};
  let failed = false;
  let inspected = 0;

  let candidates: ReturnType<typeof selectJaColumnUrls> | null = null;
  try {
    const sitemapRes = await fetch(`${SITEMAP_URL}?r=${now.getTime()}`, { headers: { "cache-control": "no-cache" } });
    if (!sitemapRes.ok) throw new Error(`HTTP ${sitemapRes.status}`);
    candidates = selectJaColumnUrls(parseSitemap(await sitemapRes.text()), { now, windowDays });
  } catch (err) {
    failed = true;
    gscNote.push(`サイトマップを取得できません（${err instanceof Error ? err.message : String(err)}）。前回の結果をそのまま残しました`);
  }

  const rawKey = process.env.GSC_SERVICE_ACCOUNT_JSON;
  let token: string | undefined;
  if (!rawKey) {
    gscNote.push("GSC_SERVICE_ACCOUNT_JSON が未設定のため、サイトマップの送信と登録状況の確認を飛ばしました");
  } else if (candidates) {
    try {
      token = await getAccessToken(JSON.parse(rawKey) as ServiceAccount);
    } catch (err) {
      failed = true;
      gscNote.push(`Search Console に接続できません：${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (token && candidates) {
    try {
      await submitSitemap(token, siteUrl);
      gscNote.push(`サイトマップを送り直しました（${SITEMAP_URL}）`);
    } catch (err) {
      failed = true;
      gscNote.push(`サイトマップの送信に失敗：${err instanceof Error ? err.message : String(err)}`);
    }
    const targets = pickUrlsToInspect(candidates, prevUrls, { now, recheckDays, max: maxInspections });
    const lastmodOf = new Map(candidates.map((c) => [c.loc, c.lastmod]));
    let errors = 0;
    for (const url of targets) {
      const lastmod = lastmodOf.get(url);
      const base = {
        ...(lastmod ? { lastmod } : {}),
        firstSeenAt: prevUrls[url]?.firstSeenAt ?? now.toISOString(),
        checkedAt: new Date().toISOString(),
      };
      try {
        results[url] = toUrlStatus(await inspect(token, siteUrl, url), base);
        inspected++;
      } catch (err) {
        errors++;
        // 確認できなかったときは、前回の結果があればそれを残す（ERROR で上書きしない）
        if (!prevUrls[url]) {
          results[url] = { verdict: "ERROR", ...base, error: err instanceof Error ? err.message : String(err) };
        }
        console.error(`inspect ${url}:`, err);
      }
      await new Promise((r) => setTimeout(r, 200)); // 1分600件の上限に十分な余裕
    }
    if (targets.length > 0 && errors === targets.length) {
      failed = true;
      gscNote.push(`URL検査が${errors}本すべて失敗しました（プロパティ ${siteUrl} の権限・指定を確認）`);
    } else if (errors > 0) {
      gscNote.push(`URL検査に失敗したURLが${errors}本あります（次回やり直します）`);
    }
  }

  const status: StatusFile = candidates
    ? mergeStatus(prevUrls, results, candidates, { now, siteUrl, windowDays })
    : { version: 1, generatedAt: now.toISOString(), siteUrl, windowDays, urls: prevUrls };
  writeFileSync(outPath, `${JSON.stringify(status, null, 2)}\n`);
  writeFileSync(summaryPath, renderSummary({ now, status, publish, gscNote, inspected, minAgeDays }));
  console.log(readFileSync(summaryPath, "utf8"));
  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
