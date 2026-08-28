"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertColumnBySlug, getAccessToken } from "@/lib/admin-api";
import { LABOR_COLUMNS_SEED } from "@/lib/data/labor-columns-seed";

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
          "/labor/column",
          "/sitemap.xml",
          ...slugs.map((slug) => `/labor/column/${slug}`),
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
 * 労務コラムのバルクupsert投入。
 *
 * scripts/labor-columns/*.md（日本語原稿）と en/ zh-tw/ zh/ の翻訳から
 * `npm run column:emit`（= npx tsx scripts/seed-labor-columns.ts --emit-ts）で焼き込んだ
 * src/lib/data/labor-columns-seed.ts を、ブラウザの管理者セッション経由で
 * slug基準の冪等upsertで投入する（seed-gh と同型・再実行しても重複しない）。
 * status="published" / business=labor。locales は4言語が揃っていれば [] ＝全言語公開、
 * 揃っていなければ ["ja"]（seed-labor-columns.ts 側で判定）。
 *
 * 件数は LABOR_COLUMNS_SEED.length に追随させ、画面に固定値を書かない
 * （4本時代の「（4本）」が52本になっても残っていたため）。
 */
export default function SeedLaborPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ItemResult[]>(
    LABOR_COLUMNS_SEED.map((a) => ({
      slug: a.slug,
      title: a.title,
      status: "pending",
    })),
  );
  const router = useRouter();

  const handleRun = async () => {
    setRunning(true);
    const succeeded: string[] = [];
    for (let i = 0; i < LABOR_COLUMNS_SEED.length; i++) {
      const article = LABOR_COLUMNS_SEED[i];
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

  const allDone = results.every((r) => r.status !== "pending");
  const hasError = results.some((r) => r.status === "error");

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">
        労務コラム（{LABOR_COLUMNS_SEED.length}本）バルク投入
      </h1>
      <p className="mb-4 text-sm text-text-muted">
        business=labor／status=published でupsert投入します（slug基準・冪等）。再実行しても重複しません。
        locales は4言語が揃っていれば []（＝全言語公開）、揃っていなければ [&quot;ja&quot;] で入ります。
        原稿の正本＝scripts/labor-columns/*.md。
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
            {running
              ? "投入中…"
              : allDone && !hasError
                ? "再実行（冪等）"
                : `${LABOR_COLUMNS_SEED.length}本を投入する`}
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
