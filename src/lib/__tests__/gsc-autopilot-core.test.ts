import { describe, expect, it } from "vitest";
import {
  daysSince,
  manualRequestCandidates,
  mergeStatus,
  parseSitemap,
  pickUrlsToInspect,
  selectJaColumnUrls,
  toUrlStatus,
  type UrlStatus,
} from "@/lib/gsc/autopilot-core";

/**
 * Search Console の自動確認の判定（2026-10-08〜）。
 * 手で送るのは「公開から数日たっても登録されていない日本語コラム」だけ、という絞り込みを固定する。
 */

const NOW = new Date("2026-10-08T03:40:00Z"); // 12:40 JST

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url>
<loc>https://luck428.com/labor/column/new-one</loc>
<xhtml:link rel="alternate" hreflang="en" href="https://luck428.com/en/labor/column/new-one" />
<lastmod>2026-10-07</lastmod>
</url>
<url><loc>https://luck428.com/en/labor/column/new-one</loc><lastmod>2026-10-07</lastmod></url>
<url><loc>https://luck428.com/column/r-old</loc><lastmod>2026-09-23</lastmod></url>
<url><loc>https://luck428.com/legal/column/l-ancient</loc><lastmod>2026-06-01</lastmod></url>
<url><loc>https://luck428.com/legal/column</loc><lastmod>2026-10-07</lastmod></url>
<url><loc>https://luck428.com/bukken/rent-1</loc><lastmod>2026-10-07</lastmod></url>
<url><loc>https://luck428.com/column/no-lastmod</loc></url>
<url><loc>https://luck428.com/column/a&amp;b</loc><lastmod>2026-10-01</lastmod></url>
</urlset>`;

describe("サイトマップから対象URLを選ぶ", () => {
  it("日本語のコラム詳細だけを、期間内・新しい順で選ぶ", () => {
    const entries = parseSitemap(XML);
    expect(entries).toHaveLength(8);
    const picked = selectJaColumnUrls(entries, { now: NOW, windowDays: 45 });
    expect(picked.map((e) => e.loc)).toEqual([
      "https://luck428.com/labor/column/new-one",
      "https://luck428.com/column/a&b",
      "https://luck428.com/column/r-old",
    ]);
  });

  it("公開からの日数はJSTの日付で数える", () => {
    expect(daysSince("2026-10-07", NOW)).toBe(1);
    expect(daysSince("2026-10-08", NOW)).toBe(0);
    expect(daysSince(undefined, NOW)).toBeNull();
    expect(daysSince("2026-10-07T00:00:00Z", NOW)).toBeNull();
  });
});

describe("今回確かめるURL", () => {
  const status = (verdict: string, checkedAt?: string): UrlStatus => ({
    verdict,
    firstSeenAt: "2026-10-01T00:00:00Z",
    ...(checkedAt ? { checkedAt } : {}),
  });

  it("未確認 → 未登録（古い確認から）→ 登録済みで古いもの の順に、上限まで", () => {
    const candidates = ["a", "b", "c", "d", "e"].map((s) => ({ loc: `https://luck428.com/column/${s}` }));
    const u = (s: string) => `https://luck428.com/column/${s}`;
    const prev = {
      [u("b")]: status("NEUTRAL", "2026-10-07T03:40:00Z"),
      [u("c")]: status("PASS", "2026-09-30T03:40:00Z"),
      [u("d")]: status("PASS", "2026-10-06T03:40:00Z"),
      [u("e")]: status("NEUTRAL", "2026-10-05T03:40:00Z"),
    };
    expect(pickUrlsToInspect(candidates, prev, { now: NOW, recheckDays: 7, max: 10 })).toEqual([
      u("a"),
      u("e"),
      u("b"),
      u("c"),
    ]);
    expect(pickUrlsToInspect(candidates, prev, { now: NOW, recheckDays: 7, max: 2 })).toEqual([u("a"), u("e")]);
  });
});

describe("結果の取り込みと、手で送る候補", () => {
  it("応答から必要な項目だけを取り、期間外のURLは捨てる", () => {
    const res = toUrlStatus(
      { verdict: "NEUTRAL", coverageState: "Discovered - currently not indexed", sitemap: ["x"], referringUrls: [] },
      { lastmod: "2026-10-01", firstSeenAt: "2026-10-02T03:40:00Z", checkedAt: NOW.toISOString() },
    );
    expect(res).toEqual({
      verdict: "NEUTRAL",
      coverageState: "Discovered - currently not indexed",
      lastmod: "2026-10-01",
      firstSeenAt: "2026-10-02T03:40:00Z",
      checkedAt: NOW.toISOString(),
    });
    const merged = mergeStatus(
      { "https://luck428.com/column/gone": res },
      { "https://luck428.com/column/a": res },
      [{ loc: "https://luck428.com/column/a", lastmod: "2026-10-01" }, { loc: "https://luck428.com/column/new" }],
      { now: NOW, windowDays: 45 },
    );
    expect(Object.keys(merged.urls)).toEqual(["https://luck428.com/column/a", "https://luck428.com/column/new"]);
    expect(merged.urls["https://luck428.com/column/new"].verdict).toBe("UNCHECKED");
  });

  it("公開から3日以上たって登録されていないものだけを、古い順に出す", () => {
    const s = (verdict: string, lastmod: string): UrlStatus => ({
      verdict,
      lastmod,
      firstSeenAt: "2026-10-01T00:00:00Z",
      checkedAt: NOW.toISOString(),
    });
    const file = mergeStatus(
      {},
      {
        "https://luck428.com/column/fresh": s("NEUTRAL", "2026-10-07"),
        "https://luck428.com/column/old": s("NEUTRAL", "2026-09-23"),
        "https://luck428.com/column/indexed": s("PASS", "2026-09-23"),
        "https://luck428.com/column/err": s("ERROR", "2026-09-23"),
        "https://luck428.com/column/mid": s("FAIL", "2026-10-05"),
      },
      [
        "fresh",
        "old",
        "indexed",
        "err",
        "mid",
      ].map((x) => ({ loc: `https://luck428.com/column/${x}` })),
      { now: NOW, windowDays: 45 },
    );
    expect(manualRequestCandidates(file, { now: NOW, minAgeDays: 3 }).map((c) => c.url)).toEqual([
      "https://luck428.com/column/old",
      "https://luck428.com/column/mid",
    ]);
  });
});
