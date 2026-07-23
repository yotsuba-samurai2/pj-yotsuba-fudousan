"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertColumnBySlug } from "@/lib/admin-api";
import { GH_COLUMNS_SEED_P2 } from "@/lib/data/gh-columns-seed-p2";

type ItemResult = {
  slug: string;
  title: string;
  status: "pending" | "done" | "error";
  action?: "created" | "updated";
  message?: string;
};

/**
 * GHコラムクラスタP2（B物件系★5本）のバルクupsert投入。
 *
 * scripts/gh-columns/{03,04,06,07,08}-*.md（浦松検収済み 2026-07-24）から
 * `npx tsx scripts/seed-gh-columns-p2.ts --emit-ts` で焼き込んだ
 * src/lib/data/gh-columns-seed-p2.ts を、ブラウザの管理者セッション経由で
 * slug基準の冪等upsertで投入する（seed-gh（P1）と同型・再実行しても重複しない）。
 * status="published"（検収済みのため公開状態で投入。business=legal / locales=["ja"]）。
 */
export default function SeedGhP2Page() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ItemResult[]>(
    GH_COLUMNS_SEED_P2.map((a) => ({
      slug: a.slug,
      title: a.title,
      status: "pending",
    })),
  );
  const router = useRouter();

  const handleRun = async () => {
    setRunning(true);
    for (let i = 0; i < GH_COLUMNS_SEED_P2.length; i++) {
      const article = GH_COLUMNS_SEED_P2[i];
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
      <h1 className="mb-1 text-lg font-bold">GH開設コラムP2（B物件系★5本）バルク投入</h1>
      <p className="mb-4 text-sm text-text-muted">
        business=legal／locales=[&quot;ja&quot;]／status=published でupsert投入します（slug基準・冪等）。
        再実行しても重複しません。原稿の正本＝scripts/gh-columns/*.md（検収済み）。
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
            {running ? "投入中…" : allDone && !hasError ? "再実行（冪等）" : "5本を投入する"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/columns")}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            コラム一覧へ
          </button>
        </div>
      </div>
    </div>
  );
}
