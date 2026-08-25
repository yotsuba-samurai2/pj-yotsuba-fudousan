"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertColumnBySlug, getAccessToken } from "@/lib/admin-api";
import { SOUZOKU_LEGAL_COLUMNS_SEED } from "@/lib/data/souzoku-legal-columns-seed";

/**
 * 投入後に静的生成ページを再検証する。
 *
 * legalコラム詳細は generateStaticParams による静的生成のため、DBへupsertしても
 * 本番のルートキャッシュが古いままで新規slugが404になる（2026-08-25に発生。
 * それまでは chore コミットでの再デプロイで回避していた）。
 * 単体保存（admin/columns/new・[id]/edit）と同じ /api/admin/revalidate に、
 * 投入した全slugをまとめて投げて解消する。
 */
async function revalidateSeeded(slugs: string[]) {
  try {
    const token = await getAccessToken();
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        paths: [
          "/legal/column",
          "/legal/sitemap.xml",
          ...slugs.map((slug) => `/legal/column/${slug}`),
        ],
      }),
    });
  } catch (err) {
    console.error("Revalidation failed:", err);
  }
}

type ItemResult = {
  slug: string;
  title: string;
  status: "pending" | "done" | "error";
  action?: "created" | "updated";
  message?: string;
};

/**
 * 相続コラム（行政書士）シリーズのupsert投入。
 *
 * scripts/legal-columns/NN-*.md から
 * `npx tsx scripts/seed-souzoku-legal-columns.ts --emit-ts` で焼き込んだ
 * src/lib/data/souzoku-legal-columns-seed.ts を、ブラウザの管理者セッション経由で
 * slug基準の冪等upsertで投入する（seed-denshi-keiyaku と同型・再実行しても重複しない）。
 * status="published"（検収済みのため公開状態で投入。business=legal / locales=["ja"]）。
 */
export default function SeedSouzokuLegalPage() {
  const [running, setRunning] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [revalidated, setRevalidated] = useState(false);
  const [results, setResults] = useState<ItemResult[]>(
    SOUZOKU_LEGAL_COLUMNS_SEED.map((a) => ({
      slug: a.slug,
      title: a.title,
      status: "pending",
    })),
  );
  const router = useRouter();

  const handleRun = async () => {
    setRunning(true);
    const succeeded: string[] = [];
    for (let i = 0; i < SOUZOKU_LEGAL_COLUMNS_SEED.length; i++) {
      const article = SOUZOKU_LEGAL_COLUMNS_SEED[i];
      try {
        const { action } = await upsertColumnBySlug(
          article.business,
          article.slug,
          article,
        );
        succeeded.push(article.slug);
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "done", action } : r,
          ),
        );
      } catch (err) {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "error", message: String(err) } : r,
          ),
        );
      }
    }
    if (succeeded.length > 0) {
      setRevalidating(true);
      await revalidateSeeded(succeeded);
      setRevalidating(false);
      setRevalidated(true);
    }
    setRunning(false);
  };

  const allDone = results.every((r) => r.status !== "pending");
  const hasError = results.some((r) => r.status === "error");

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">相続コラム（行政書士）投入</h1>
      <p className="mb-4 text-sm text-text-muted">
        business=legal／locales=[&quot;ja&quot;,&quot;en&quot;,&quot;zh-tw&quot;,&quot;zh&quot;]／status=published でupsert投入します（slug基準・冪等）。
        再実行しても重複しません。原稿の正本＝scripts/legal-columns/NN-*.md。
      </p>

      <div className="max-w-2xl rounded-xl border border-border bg-surface p-6">
        <ul className="space-y-2">
          {results.map((r) => (
            <li
              key={r.slug}
              className="flex items-center justify-between gap-3 rounded-lg bg-surface-dim px-3 py-2 text-xs"
            >
              <span className="min-w-0 flex-1 truncate">{r.title}</span>
              <span className="shrink-0 font-mono">
                {r.status === "pending" && "…"}
                {r.status === "done" && `✓ ${r.action ?? "done"}`}
                {r.status === "error" && "✗ error"}
              </span>
            </li>
          ))}
        </ul>

        {hasError && (
          <ul className="mt-3 space-y-1 text-xs text-red-600">
            {results
              .filter((r) => r.status === "error")
              .map((r) => (
                <li key={r.slug}>
                  {r.slug}: {r.message}
                </li>
              ))}
          </ul>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {revalidating ? "再検証中…" : running ? "投入中…" : allDone && !hasError ? "再実行（冪等）" : "1本を投入する"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/columns")}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            コラム一覧へ
          </button>
        </div>

        {revalidated && (
          <p className="mt-3 text-xs text-text-muted">
            投入後に静的生成ページの再検証を実行しました（一覧・詳細・サイトマップ）。
            反映まで数十秒かかることがあります。
          </p>
        )}
      </div>
    </div>
  );
}
