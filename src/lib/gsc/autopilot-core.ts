/**
 * Search Console の自動確認（scripts/gsc-autopilot.ts）の判定部分。I/O を持たない純粋関数だけを置く。
 *
 * 目的（2026-10-08〜）：
 * - インデックス登録のリクエストは、Googleが一般の記事向けのAPIを出していないため自動化できない
 *   （Indexing API は求人とライブ配信のページ専用）。そこで、手で送る本数を必要な分だけに減らす
 * - 毎日、直近のコラム（日本語ページ）の登録状況を URL検査API で確かめ、
 *   公開から数日たっても登録されていないものだけを、朝の納品タスクが浦松さんに渡す
 *
 * URL検査APIの上限は1サイトあたり 1日2,000件・1分600件（2026-10-08確認）。
 * 1回の確認は数百件以内に抑え、登録済みのURLは毎日は見直さない。
 */

export type SitemapEntry = { loc: string; lastmod?: string };

/** 日本語のコラム詳細URL（不動産 /column・行政書士 /legal/column・社労士 /labor/column） */
export const JA_COLUMN_URL = /^https:\/\/luck428\.com\/(?:(?:legal|labor)\/)?column\/[^/?#]+$/;

export type UrlStatus = {
  /** PASS（登録済み）・NEUTRAL（除外）・FAIL（エラー）・VERDICT_UNSPECIFIED・ERROR（確認できず） */
  verdict: string;
  coverageState?: string;
  indexingState?: string;
  pageFetchState?: string;
  robotsTxtState?: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
  /** サイトマップの lastmod（YYYY-MM-DD）。公開からの日数の目安に使う */
  lastmod?: string;
  /** この仕組みが初めてこのURLを見た日時 */
  firstSeenAt: string;
  /** 最後に確認した日時 */
  checkedAt?: string;
  /** 確認に失敗したときの理由 */
  error?: string;
};

export type StatusFile = {
  version: 1;
  generatedAt: string;
  siteUrl?: string;
  windowDays: number;
  urls: Record<string, UrlStatus>;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function unescapeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

export function parseSitemap(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
    const loc = block.match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1];
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/)?.[1];
    entries.push({ loc: unescapeXml(loc), ...(lastmod ? { lastmod: lastmod.slice(0, 10) } : {}) });
  }
  return entries;
}

/** lastmod（YYYY-MM-DD）から今日までの日数。lastmod が無いときは null */
export function daysSince(lastmod: string | undefined, now: Date): number | null {
  if (!lastmod || !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) return null;
  const t = Date.parse(`${lastmod}T00:00:00+09:00`);
  return Number.isNaN(t) ? null : Math.floor((now.getTime() - t) / DAY_MS);
}

/** 直近 windowDays 日以内に公開・更新された日本語コラムのURL（新しい順） */
export function selectJaColumnUrls(
  entries: readonly SitemapEntry[],
  opts: { now: Date; windowDays: number },
): SitemapEntry[] {
  const seen = new Set<string>();
  return entries
    .filter((e) => {
      if (!JA_COLUMN_URL.test(e.loc) || seen.has(e.loc)) return false;
      seen.add(e.loc);
      const age = daysSince(e.lastmod, opts.now);
      return age !== null && age <= opts.windowDays;
    })
    .sort((a, b) => (b.lastmod ?? "").localeCompare(a.lastmod ?? "") || a.loc.localeCompare(b.loc));
}

/**
 * 今回確かめるURLを選ぶ。
 * 1. まだ一度も確かめていないURL（新しい順）
 * 2. 登録されていないURL（前回の確認が古い順）＝毎回見直す
 * 3. 登録済みでも recheckDays 日以上見ていないURL（前回の確認が古い順）
 * 合計 max 件まで。
 */
export function pickUrlsToInspect(
  candidates: readonly SitemapEntry[],
  prev: Readonly<Record<string, UrlStatus>>,
  opts: { now: Date; recheckDays: number; max: number },
): string[] {
  const fresh: string[] = [];
  const notIndexed: { url: string; at: string }[] = [];
  const stale: { url: string; at: string }[] = [];
  for (const { loc } of candidates) {
    const p = prev[loc];
    if (!p?.checkedAt) {
      fresh.push(loc);
    } else if (p.verdict !== "PASS") {
      notIndexed.push({ url: loc, at: p.checkedAt });
    } else if (opts.now.getTime() - Date.parse(p.checkedAt) >= opts.recheckDays * DAY_MS) {
      stale.push({ url: loc, at: p.checkedAt });
    }
  }
  const byOldest = (a: { at: string }, b: { at: string }) => a.at.localeCompare(b.at);
  return [
    ...fresh,
    ...notIndexed.sort(byOldest).map((x) => x.url),
    ...stale.sort(byOldest).map((x) => x.url),
  ].slice(0, opts.max);
}

/** URL検査APIの応答（inspectionResult.indexStatusResult）から必要な項目だけを取り出す */
export function toUrlStatus(
  indexStatusResult: Record<string, unknown> | undefined,
  base: { lastmod?: string; firstSeenAt: string; checkedAt: string },
): UrlStatus {
  const r = indexStatusResult ?? {};
  const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string) : undefined);
  const status: UrlStatus = { verdict: str("verdict") ?? "VERDICT_UNSPECIFIED", ...base };
  for (const key of [
    "coverageState",
    "indexingState",
    "pageFetchState",
    "robotsTxtState",
    "lastCrawlTime",
    "googleCanonical",
  ] as const) {
    const v = str(key);
    if (v) status[key] = v;
  }
  return status;
}

/**
 * 今回の結果を前回の状態に重ねる。対象期間（candidates）から外れたURLは捨てる（ファイルを肥大させない）。
 * 今回確かめなかったURLは前回の結果を残し、lastmod だけ最新にする。
 */
export function mergeStatus(
  prev: Readonly<Record<string, UrlStatus>>,
  results: Readonly<Record<string, UrlStatus>>,
  candidates: readonly SitemapEntry[],
  meta: { now: Date; siteUrl?: string; windowDays: number },
): StatusFile {
  const urls: Record<string, UrlStatus> = {};
  for (const { loc, lastmod } of candidates) {
    const latest = results[loc] ?? prev[loc];
    urls[loc] = latest
      ? { ...latest, ...(lastmod ? { lastmod } : {}) }
      : { verdict: "UNCHECKED", firstSeenAt: meta.now.toISOString(), ...(lastmod ? { lastmod } : {}) };
  }
  return {
    version: 1,
    generatedAt: meta.now.toISOString(),
    ...(meta.siteUrl ? { siteUrl: meta.siteUrl } : {}),
    windowDays: meta.windowDays,
    urls,
  };
}

export type ManualRequestCandidate = {
  url: string;
  lastmod?: string;
  days: number | null;
  verdict: string;
  coverageState?: string;
};

/**
 * 手でインデックス登録をリクエストする候補：公開（lastmod）から minAgeDays 日以上たっても
 * 登録されていない（PASS でない）URL。確認できなかったURL（ERROR・UNCHECKED）は含めない。古い順。
 */
export function manualRequestCandidates(
  status: StatusFile,
  opts: { now: Date; minAgeDays: number },
): ManualRequestCandidate[] {
  return Object.entries(status.urls)
    .filter(([, s]) => s.verdict !== "PASS" && s.verdict !== "ERROR" && s.verdict !== "UNCHECKED")
    .map(([url, s]) => ({
      url,
      lastmod: s.lastmod,
      days: daysSince(s.lastmod, opts.now),
      verdict: s.verdict,
      coverageState: s.coverageState,
    }))
    .filter((c) => c.days !== null && c.days >= opts.minAgeDays)
    .sort((a, b) => (a.lastmod ?? "").localeCompare(b.lastmod ?? "") || a.url.localeCompare(b.url));
}

export function countByVerdict(status: StatusFile): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of Object.values(status.urls)) counts[s.verdict] = (counts[s.verdict] ?? 0) + 1;
  return counts;
}
