"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertColumnBySlug } from "@/lib/admin-api";
import { GH_COLUMNS_P4_SEED } from "@/lib/data/gh-columns-seed-p4";

type ItemResult = {
  slug: string;
  title: string;
  status: "pending" | "done" | "error";
  action?: "created" | "updated";
  message?: string;
};

/**
 * グループホーム・コラム P4（1本）のupsert投入。
 *
 * 東京都で障害者グループホームを開設するときの費用と補助金（ja）。
 * business=legal。令和7年度309,000円・3/4は前年参考、令和8年度額は未確認のため現年度額として
 * 記載しない。slug基準の冪等upsert。再実行しても重複しない。
 */
export default function SeedGhP4Page() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ItemResult[]>(
    GH_COLUMNS_P4_SEED.map((a) => ({
      slug: a.slug,
      title: a.title,
      status: "pending",
    })),
  );
  const router = useRouter();

  const handleRun = async () => {
    setRunning(true);
    for (let i = 0; i < GH_COLUMNS_P4_SEED.length; i++) {
      const article = GH_COLUMNS_P4_SEED[i];
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
            idx === i ? { ...r, status: "error", message: String(err) } : r,
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
      <h1 className="mb-1 text-lg font-bold">グループホーム・コラム P4（1本）投入</h1>
      <p className="mb-4 text-sm text-text-muted">
        東京都のGH開設費用・補助金（2026-08-18）。business=legal／locales=[&quot;ja&quot;]／status=published。
        令和8年度の金額・補助率は未確認のため、令和7年度は前年参考としてのみ記載します。
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
            {running ? "投入中…" : allDone && !hasError ? "再実行（冪等）" : "1本を投入する"}
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
