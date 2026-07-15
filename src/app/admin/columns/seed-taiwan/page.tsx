"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertColumnBySlug } from "@/lib/admin-api";
import { TAIWAN_COLUMNS_SEED } from "@/lib/data/taiwan-columns-seed";

type ItemResult = {
  slug: string;
  title: string;
  status: "pending" | "done" | "error";
  action?: "created" | "updated";
  message?: string;
};

/**
 * 台湾コンテンツ9本のバルクupsert投入（キックオフ タスク2）。
 *
 * scripts/seed-taiwan-columns.ts のdry-runパース結果を焼き込んだ
 * src/lib/data/taiwan-columns-seed.ts を、ブラウザの管理者セッション経由で
 * slug基準の冪等upsertで投入する（サービスアカウント不要・何度実行しても重複しない）。
 * status は常に "draft"（出し分け実装後にpublished化する）。
 */
export default function SeedTaiwanPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ItemResult[]>(
    TAIWAN_COLUMNS_SEED.map((a) => ({
      slug: a.slug,
      title: a.title,
      status: "pending",
    })),
  );
  const router = useRouter();

  const handleRun = async () => {
    setRunning(true);
    for (let i = 0; i < TAIWAN_COLUMNS_SEED.length; i++) {
      const article = TAIWAN_COLUMNS_SEED[i];
      try {
        const { action } = await upsertColumnBySlug(
          article.business,
          article.slug,
          article,
        );
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "done", action } : r,
          ),
        );
      } catch (err) {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? { ...r, status: "error", message: String(err) }
              : r,
          ),
        );
      }
    }
    setRunning(false);
  };

  const allDone = results.every((r) => r.status !== "pending");
  const hasError = results.some((r) => r.status === "error");

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">台湾コンテンツ9本 バルク投入</h1>
      <p className="mb-4 text-sm text-text-muted">
        business=realestate／locale=zh-tw／status=draft でupsert投入します（slug基準・冪等）。
        再実行しても重複しません。
      </p>

      <div className="max-w-2xl rounded-xl border border-border bg-surface p-6">
        <ul className="space-y-2">
          {results.map((r, i) => (
            <li
              key={r.slug}
              className="flex items-center justify-between gap-3 rounded-lg bg-surface-dim px-3 py-2 text-xs"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-text">
                  #{i + 1} {r.slug}
                </p>
                <p className="truncate text-text-muted">{r.title}</p>
              </div>
              <span
                className={
                  r.status === "done"
                    ? "shrink-0 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700"
                    : r.status === "error"
                      ? "shrink-0 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-600"
                      : "shrink-0 rounded-full bg-yellow-100 px-2 py-0.5 font-medium text-yellow-700"
                }
              >
                {r.status === "done"
                  ? r.action === "created"
                    ? "新規作成"
                    : "更新"
                  : r.status === "error"
                    ? "エラー"
                    : "未実行"}
              </span>
            </li>
          ))}
        </ul>

        {results.some((r) => r.status === "error") && (
          <div className="mt-4 space-y-1 text-xs text-red-600">
            {results
              .filter((r) => r.status === "error")
              .map((r) => (
                <p key={r.slug}>
                  {r.slug}: {r.message}
                </p>
              ))}
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleRun}
            disabled={running}
            className="relative overflow-hidden rounded-lg px-5 py-2 text-sm font-semibold text-text disabled:opacity-50"
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-lg gradient-btn"
              aria-hidden="true"
            />
            <span className="relative">
              {running
                ? "投入中..."
                : allDone && !hasError
                  ? "再実行"
                  : "9本を投入する"}
            </span>
          </button>
          {allDone && !hasError && !running && (
            <button
              onClick={() => router.push("/admin/columns")}
              className="rounded-lg border border-border bg-surface px-5 py-2 text-sm font-medium text-text hover:bg-surface-dim"
            >
              コラム一覧へ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
