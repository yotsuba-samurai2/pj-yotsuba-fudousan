"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { upsertColumnBySlug } from "@/lib/admin-api";
import type { ColumnInput } from "@/lib/column-shared";

/**
 * seed投入画面の共通ランナー。
 *
 * 不動産（seed-realestate-daily）・行政書士（seed-souzoku-legal）・
 * 社労士（seed-labor）の3画面が同じ挙動をしていたため、ここに1本化した。
 * 投入は従来どおり slug基準の冪等upsert（upsertColumnBySlug）で、
 * 再実行しても重複しない。
 *
 * 追記型のseedは日々1〜3本ずつ増えるため、毎回の投入で全件を
 * upsertすると件数に比例してリクエストが増える（2026-09時点で
 * 不動産56・行政書士71・社労士110＝計237件）。既定の投入範囲を
 * 「最新日の記事のみ」に絞り、過去記事を直したときだけ「全件」に
 * 切り替えて使う。日付は各記事の `date`（seedに焼き込まれた公開日）。
 */

type RunStatus = "pending" | "done" | "error";

type ItemResult = {
  status: RunStatus;
  action?: "created" | "updated";
  message?: string;
};

type Scope = "latest" | "all";

type Props = {
  /** 画面見出し。件数は内部で付けないので、必要なら呼び出し側で含める */
  heading: string;
  /** 見出し下の説明文 */
  description: ReactNode;
  /** 投入対象のseed配列（追記型・日付昇順でなくてもよい） */
  articles: ColumnInput[];
};

/** seed内で最も新しい date（文字列比較。dateはYYYY-MM-DD固定） */
function latestDateOf(articles: ColumnInput[]): string | null {
  return articles.reduce<string | null>(
    (max, a) => (max === null || a.date > max ? a.date : max),
    null,
  );
}

export default function SeedColumnsRunner({
  heading,
  description,
  articles,
}: Props) {
  const router = useRouter();
  const [scope, setScope] = useState<Scope>("latest");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<string, ItemResult>>({});

  const latestDate = useMemo(() => latestDateOf(articles), [articles]);

  const latestCount = useMemo(
    () => articles.filter((a) => a.date === latestDate).length,
    [articles, latestDate],
  );

  const targets = useMemo(
    () =>
      scope === "latest"
        ? articles.filter((a) => a.date === latestDate)
        : articles,
    [articles, latestDate, scope],
  );

  /** 範囲を切り替えたら結果表示をリセットする（前の範囲の✓を残さない） */
  const changeScope = (next: Scope) => {
    if (running || next === scope) return;
    setScope(next);
    setResults({});
  };

  const handleRun = async () => {
    setRunning(true);
    setResults({});
    for (const article of targets) {
      try {
        const { action } = await upsertColumnBySlug(
          article.business,
          article.slug,
          article,
        );
        setResults((prev) => ({
          ...prev,
          [article.slug]: { status: "done", action },
        }));
      } catch (err) {
        setResults((prev) => ({
          ...prev,
          [article.slug]: { status: "error", message: String(err) },
        }));
      }
    }
    setRunning(false);
  };

  const isEmpty = targets.length === 0;
  const finished = targets.filter((a) => results[a.slug]).length;
  const allDone = !isEmpty && finished === targets.length;
  const errors = targets
    .map((a) => ({ slug: a.slug, result: results[a.slug] }))
    .filter((r) => r.result?.status === "error");
  const hasError = errors.length > 0;

  const scopeButton = (value: Scope, label: string) => (
    <button
      type="button"
      onClick={() => changeScope(value)}
      disabled={running}
      aria-pressed={scope === value}
      className={
        scope === value
          ? "rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
          : "rounded-lg border border-border px-3 py-1.5 text-xs disabled:opacity-50"
      }
    >
      {label}
    </button>
  );

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">{heading}</h1>
      <p className="mb-4 text-sm text-text-muted">{description}</p>

      <div className="max-w-2xl rounded-xl border border-border bg-surface p-6">
        {articles.length === 0 ? (
          <p className="text-sm text-text-muted">
            投入できる記事がありません。
            <code className="mx-1">--emit-ts</code>
            でseedを生成したか確認してください。
          </p>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-text-muted">投入範囲</span>
              {scopeButton(
                "latest",
                `最新日のみ（${latestDate ?? "-"}／${latestCount}本）`,
              )}
              {scopeButton("all", `全件（${articles.length}本）`)}
            </div>

            <p className="mb-3 text-xs text-text-muted">
              slug基準の冪等upsertなので、どちらを選んでも重複はしません。
              過去の記事を直したときは「全件」を選んでください。
            </p>

            <ul className="space-y-2">
              {targets.map((a) => {
                const r = results[a.slug];
                return (
                  <li
                    key={a.slug}
                    className="flex items-center justify-between gap-3 rounded-lg bg-surface-dim px-3 py-2 text-xs"
                  >
                    <span className="min-w-0 flex-1 truncate">{a.title}</span>
                    <span className="shrink-0 font-mono">
                      {!r && "…"}
                      {r?.status === "done" && `✓ ${r.action ?? "done"}`}
                      {r?.status === "error" && "✗ error"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {hasError && (
          <ul className="mt-3 space-y-1 text-xs text-red-600">
            {errors.map((r) => (
              <li key={r.slug}>
                {r.slug}: {r.result?.message}
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
              ? `投入中…（${finished}/${targets.length}）`
              : allDone && !hasError
                ? "再実行（冪等）"
                : `${targets.length}本を投入する`}
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
