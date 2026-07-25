/**
 * IndexNow 送信ユーティリティ（Bing Webmaster Tools 推奨事項「IndexNow が採用されていません」対応）。
 *
 * IndexNow は Bing・Yandex 等が共同運用する即時インデックス通知プロトコル。
 * ChatGPT検索・Copilot 等は Bing インデックスを参照するため、公開・更新の反映を早める効果がある。
 * （Google は IndexNow 非対応＝従来どおり GSC／サイトマップ運用を継続）
 *
 * 所有証明：`public/<KEY>.txt`（本文＝キー文字列）が
 * `https://luck428.com/<KEY>.txt` で配信されることで検証される（キーは公開仕様）。
 *
 * 設計方針：
 * - 例外を投げない。呼び出し元（コラム公開時の revalidate 等）の処理を IndexNow の失敗で止めない。
 * - 本番以外（プレビュー・ローカル）では実際に送信しない＝誤通知を構造的に防ぐ。
 * - env は呼び出し時に読む（モジュール読込時にキャッシュしない）＝テスト・実行環境で挙動が一致する。
 */

/** IndexNow の host パラメータ（1ホスト運用。legal/labor も luck428.com 配下のため1ホストで網羅） */
export const INDEXNOW_HOST = "luck428.com";

const ORIGIN = `https://${INDEXNOW_HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** サイトマップURL（手動一括送信のデフォルト入力） */
export const SITEMAP_URL = `${ORIGIN}/sitemap.xml`;

/** env `INDEXNOW_KEY` 未設定時のフォールバック（`public/<KEY>.txt` と必ず一致させる） */
const DEFAULT_KEY = "c0df92f43cee44448c33623a32a68d6c";

/** IndexNow 仕様上の1リクエスト最大URL件数 */
const MAX_URLS_PER_REQUEST = 10_000;

/** 送信タイムアウト（公開処理を待たせない） */
const TIMEOUT_MS = 5_000;

/** サイトマップ取得タイムアウト（数百件規模のXML取得を想定） */
const SITEMAP_TIMEOUT_MS = 10_000;

export type IndexNowResult = {
  /** 送信が受理された（または送信不要だった）か。失敗しても例外は投げずここで表現する */
  ok: boolean;
  /** IndexNow エンドポイントのHTTPステータス（送信した場合のみ） */
  status?: number;
  /** 送信しなかった理由（"non-production" | "no-eligible-urls"） */
  skipped?: string;
  /** 実際に送信した（受理された）URL件数 */
  submitted?: number;
};

function resolveKey(): string {
  return process.env.INDEXNOW_KEY?.trim() || DEFAULT_KEY;
}

/**
 * 実送信するのは本番のみ。
 * Vercel 上は VERCEL_ENV（production / preview / development）で判定し、
 * VERCEL_ENV が無い環境（自前サーバー等）は NODE_ENV=production を本番とみなす。
 */
export function isIndexNowEnabled(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv) return vercelEnv === "production";
  return process.env.NODE_ENV === "production";
}

/**
 * 送信対象URLを正規化する。
 * - 相対パスは luck428.com 配下の絶対URLに解決する
 * - luck428.com 以外／https以外は除外する（IndexNowは host 一致が必須）
 * - フラグメントを除去し、重複を排除する
 */
export function normalizeUrls(urls: readonly string[]): string[] {
  const normalized = new Set<string>();
  for (const raw of urls) {
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;
    let parsed: URL;
    try {
      // 第2引数のbaseにより "/column/foo" 等の相対パスが絶対化される。
      // "https://example.com/x" や "//example.com/x" は絶対URLとして解決されるため、次のhost判定で除外される。
      parsed = new URL(trimmed, ORIGIN);
    } catch {
      continue;
    }
    if (parsed.protocol !== "https:") continue;
    if (parsed.host !== INDEXNOW_HOST) continue;
    parsed.hash = "";
    normalized.add(parsed.toString());
  }
  return [...normalized];
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * IndexNow へURLを通知する。**例外は投げない**（失敗は戻り値 ok:false で表現）。
 */
export async function submitToIndexNow(urls: readonly string[]): Promise<IndexNowResult> {
  const urlList = normalizeUrls(urls);
  if (urlList.length === 0) {
    return { ok: true, submitted: 0, skipped: "no-eligible-urls" };
  }
  if (!isIndexNowEnabled()) {
    return { ok: true, submitted: 0, skipped: "non-production" };
  }

  const key = resolveKey();
  const keyLocation = `${ORIGIN}/${key}.txt`;
  let submitted = 0;
  let status: number | undefined;

  for (const batch of chunk(urlList, MAX_URLS_PER_REQUEST)) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: INDEXNOW_HOST, key, keyLocation, urlList: batch }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      status = res.status;
      // 200=受理 / 202=受理（キー検証は非同期）。それ以外は失敗扱い
      if (res.status !== 200 && res.status !== 202) {
        console.warn(`[indexnow] 送信失敗: status=${res.status} count=${batch.length}`);
        return { ok: false, status: res.status, submitted };
      }
      submitted += batch.length;
    } catch (err) {
      console.warn("[indexnow] 送信できませんでした:", err);
      return { ok: false, status, submitted };
    }
  }

  return { ok: true, status, submitted };
}

/**
 * sitemap.xml から `<loc>` を抽出する（既存ページの一括通知用）。
 * ホスト絞り込みと重複除去は submitToIndexNow 側の正規化に委ねる。
 * 取得失敗時は例外を投げる（呼び出し元＝管理APIが原因を返せるようにする）。
 */
export async function fetchSitemapUrls(sitemapUrl: string = SITEMAP_URL): Promise<string[]> {
  const res = await fetch(sitemapUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(SITEMAP_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`sitemap取得失敗: ${sitemapUrl} (${res.status})`);
  }
  const xml = await res.text();
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}
