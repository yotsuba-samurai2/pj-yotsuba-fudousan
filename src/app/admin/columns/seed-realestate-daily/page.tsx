"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertColumnBySlug, getAccessToken } from "@/lib/admin-api";
import { REALESTATE_COLUMNS_DAILY_SEED } from "@/lib/data/realestate-columns-daily-seed";

/**
 * 投入後に一覧・サイトマップ・各詳細ページを再検証する。
 *
 * 単体保存（admin/columns/new・[id]/edit）と seed-souzoku-legal（#302）は
 * /api/admin/revalidate を呼んでいるが、このページは呼んでいなかった。
 * 新規slugの404は [locale]/layout.tsx の dynamicParams を外して解消したが、
 * 既存slugの更新は最大1時間（layout の revalidate=3600）古いままになるため、
 * 投入した全slugをまとめて投げて即時反映させる。
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
          "/column",
          "/sitemap.xml",
          ...slugs.map((slug) => `/column/${slug}`),
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
 * 不動産コラム（追記型）のupsert投入。
 *
 * business=realestate。原稿は scripts/realestate-columns/NN-<slug>.md、
 * 登録は scripts/seed-realestate-columns-daily.ts の ARTICLES への追記、
 * 生成物は src/lib/data/realestate-columns-daily-seed.ts。
 * slug基準の冪等upsert。再実行しても重複しない。
 *
 * このページは固定。記事が増えても新しい管理画面ページを作らない
 * （枝番方式＝seed-realestate-p2 …… p6 をここで止めている）。
 */
export default function SeedRealestateDailyPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ItemResult[]>(
    REALESTATE_COLUMNS_DAILY_SEED.map((a) => ({
      slug: a.slug,
      title: a.title,
      status: "pending",
    })),
  );
  const router = useRouter();

  const handleRun = async () => {
    setRunning(true);
    const succeeded: string[] = [];
    for (let i = 0; i < REALESTATE_COLUMNS_DAILY_SEED.length; i++) {
      const article = REALESTATE_COLUMNS_DAILY_SEED[i];
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
      await revalidateSeeded(succeeded);
    }
    setRunning(false);
  };

  const isEmpty = results.length === 0;
  const allDone = !isEmpty && results.every((r) => r.status !== "pending");
  const hasError = results.some((r) => r.status === "error");

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">不動産コラム投入（追記型）</h1>
      <p className="mb-4 text-sm text-text-muted">
        business=realestate／status=published。
        <code className="mx-1">scripts/seed-realestate-columns-daily.ts</code>
        の ARTICLES に登録し
        <code className="mx-1">--emit-ts</code>
        で生成した記事を投入します。記事が増えてもこのページは固定です。
      </p>

      <div className="max-w-2xl rounded-xl border border-border bg-surface p-6">
        {isEmpty ? (
          <p className="text-sm text-text-muted">
            投入できる記事がありません。
            <code className="mx-1">
              npx tsx scripts/seed-realestate-columns-daily.ts --emit-ts
            </code>
            を実行したか確認してください。
          </p>
        ) : (
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
        )}

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
            disabled={running || isEmpty}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {running
              ? "投入中…"
              : allDone && !hasError
                ? "再実行（冪等）"
                : `${results.length}本を投入する`}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/columns")}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            一覧へ戻る
          </button>
        </div>
      </div>
    </div>
  );
}
