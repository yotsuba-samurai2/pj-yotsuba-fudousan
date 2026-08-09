"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getColumns, upsertColumnBySlug } from "@/lib/admin-api";
import type { ColumnStatus } from "@/lib/admin-api";
import { LEAVING_JAPAN_COLUMNS_SEED } from "@/lib/data/leaving-japan-columns-seed";

type ItemResult = {
  slug: string;
  title: string;
  status: "pending" | "done" | "error";
  action?: "created" | "updated";
  message?: string;
};

/**
 * 離日売却クラスタ 9月分コラム7本のバルクupsert投入。
 *
 * 原稿は各コラムの「管理画面入力ガイド」（2026-08-09 Claude作成）。
 * すべて status="draft" で入り、浦松が事実確認・加筆・署名のうえ
 * 管理画面から個別に「公開」へ切り替える。**このページは公開までは行わない。**
 *
 * status の扱いは seed-taiwan と同じ事故防止措置を踏襲する。
 * 投入前に既存コラムを取得し、既に存在する slug については既存の status を
 * そのまま引き継ぐ（新規作成のときだけ seed 定数の "draft" を使う）。
 * これにより本文の修正を何度でも安全に再投入できる。
 */
export default function SeedLeavingJapanPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ItemResult[]>(
    LEAVING_JAPAN_COLUMNS_SEED.map((a) => ({
      slug: a.slug,
      title: a.title,
      status: "pending",
    })),
  );
  const router = useRouter();

  const handleRun = async () => {
    setRunning(true);

    let existingStatusBySlug: Record<string, ColumnStatus>;
    try {
      const existing = await getColumns("realestate");
      existingStatusBySlug = Object.fromEntries(
        existing.map((c) => [c.slug, c.status]),
      );
    } catch (err) {
      setResults((prev) =>
        prev.map((r) => ({
          ...r,
          status: "error",
          message: `既存コラムの取得に失敗したため中止しました（公開中の記事をdraftに戻さないため）: ${String(err)}`,
        })),
      );
      setRunning(false);
      return;
    }

    for (let i = 0; i < LEAVING_JAPAN_COLUMNS_SEED.length; i++) {
      const seeded = LEAVING_JAPAN_COLUMNS_SEED[i];
      const keptStatus = existingStatusBySlug[seeded.slug];
      const article = keptStatus ? { ...seeded, status: keptStatus } : seeded;
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
    router.refresh();
  };

  const done = results.filter((r) => r.status === "done").length;
  const errors = results.filter((r) => r.status === "error").length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">
        離日売却クラスタ 9月分コラム7本の投入
      </h1>

      <div className="mt-4 space-y-2 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm">
        <p>
          <strong>すべて「下書き」で投入します。</strong>
          公開はこのページでは行いません。投入後、管理画面のコラム一覧から1本ずつ内容を確認し、
          浦松の事実確認・加筆・署名を経てから公開へ切り替えてください。
        </p>
        <p>
          slug が既にある記事は
          <strong>既存の公開状態をそのまま引き継ぎます</strong>
          （公開中の記事が下書きに戻ることはありません）。何度実行しても重複しません。
        </p>
        <p className="text-amber-900">
          公開前に決着が必要な事項が2件あります。
          <strong>
            おつなぎ先の税理士が納税管理人の就任を引き受けるか
          </strong>
          （C2・C4・C1・C3が前提にしています）。
          <strong>B1・A4+D2・C1の企画差し替えの承認</strong>
          （いずれも特集との重複を避けるためテーマを変えています）。
        </p>
      </div>

      <button
        type="button"
        onClick={handleRun}
        disabled={running}
        className="mt-6 rounded-md bg-primary px-5 py-2.5 text-white disabled:opacity-50"
      >
        {running ? "投入中…" : "7本を下書きで投入する"}
      </button>

      <p className="mt-3 text-sm text-muted-foreground">
        完了 {done} / {results.length}
        {errors > 0 ? ` ・ エラー ${errors}` : ""}
      </p>

      <ul className="mt-6 space-y-3">
        {results.map((r) => (
          <li key={r.slug} className="rounded-md border p-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {r.slug}
                </p>
              </div>
              <span className="shrink-0 text-xs">
                {r.status === "pending" && "未実行"}
                {r.status === "done" &&
                  (r.action === "created" ? "新規作成" : "更新")}
                {r.status === "error" && "エラー"}
              </span>
            </div>
            {r.message && (
              <p className="mt-2 text-xs text-red-600">{r.message}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
