"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getColumns, upsertColumnBySlug } from "@/lib/admin-api";
import type { FirestoreColumn } from "@/lib/admin-api";
import { TAIWAN_LEGAL_COLUMNS_SEED } from "@/lib/data/taiwan-legal-columns-seed";

type ItemResult = {
  slug: string;
  title: string;
  status: "pending" | "done" | "error";
  action?: "created" | "updated";
  message?: string;
};

/**
 * 台湾×相続コラム2本のバルクupsert投入（2026-08-07 新設）。
 *
 * 原稿の正本＝scripts/taiwan-legal-columns/*.md → src/lib/data/taiwan-legal-columns-seed.ts。
 *
 * 【この投入が触らないもの】seed 定数に該当キーを持たせていないため既存値がそのまま残る
 *   （src/lib/db/columns.ts の toUpdateInput が `if ("キー" in data)` で判定するため）
 *   ・faq・tags・ogImage（modifiedDate は本文が変わる場合のみ自動で更新）
 *
 * 第1号の翻訳は現行の言語別キーワード・タグ・著者等を残し、seed の本文等だけを更新する。
 *
 * 【status】既存の記事は現在の公開状態を引き継ぐ。新規作成のときだけ seed の値を使う。
 *   2026-08-06 の seed-taiwan で「再投入すると公開中の記事が draft に戻る」問題があり
 *   PR#179 で是正した。同じ設計を最初から入れてある。
 */
export default function SeedTaiwanLegalPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ItemResult[]>(
    TAIWAN_LEGAL_COLUMNS_SEED.map((a) => ({
      slug: a.slug,
      title: a.title,
      status: "pending",
    })),
  );
  const router = useRouter();

  const handleRun = async (onlySlug?: string) => {
    setRunning(true);

    let existingBySlug: Map<string, FirestoreColumn>;
    try {
      const existing = await getColumns("legal");
      existingBySlug = new Map(existing.map((c) => [c.slug, c]));
    } catch (err) {
      setResults((prev) =>
        prev.map((r) => ({
          ...r,
          status: onlySlug && r.slug !== onlySlug ? r.status : "error",
          message: `既存コラムの取得に失敗したため中止しました（公開中の記事の状態を保てないため）: ${String(err)}`,
        })),
      );
      setRunning(false);
      return;
    }

    for (let i = 0; i < TAIWAN_LEGAL_COLUMNS_SEED.length; i++) {
      const seeded = TAIWAN_LEGAL_COLUMNS_SEED[i];
      if (onlySlug && onlySlug !== seeded.slug) continue;
      const existing = existingBySlug.get(seeded.slug);
      const article = existing ? { ...seeded, status: existing.status } : seeded;
      if (seeded.slug === "taiwan-koseki-jokoseki-shutoku" && existing && seeded.translations) {
        const translations = { ...existing.translations };
        for (const locale of ["en", "zh-tw", "zh"] as const) {
          const translated = seeded.translations[locale];
          if (translated) {
            translations[locale] = { ...translations[locale], ...translated };
          }
        }
        article.translations = translations;
      }
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
      <h1 className="mb-1 text-lg font-bold">
        台湾×相続コラム2本（4言語）バルク投入
      </h1>
      <p className="mb-4 text-sm text-text-muted">
        business=legal で upsert 投入します（slug基準・冪等）。再実行しても重複しません。
        原稿の正本＝<code>scripts/taiwan-legal-columns/*.md</code>。
        <strong>既に存在するslugは現在の公開状態（status）をそのまま引き継ぎます。</strong>
      </p>
      <p className="mb-4 max-w-2xl rounded-lg bg-surface-dim p-3 text-xs text-text">
        この投入が更新するのは<strong>日本語の本文・タイトル・抜粋・キーワード・著者・公開言語</strong>です。
        <strong>両記事とも en・繁體・简体の翻訳も更新します。日本語FAQ、タグ、OG画像は触りません</strong>
        （既存の値が残ります）。
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

        {hasError && (
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
            onClick={() => handleRun()}
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
                  ? "再実行（冪等）"
                  : "2本を投入する"}
            </span>
          </button>
          <button
            onClick={() => handleRun("taiwan-koseki-jokoseki-shutoku")}
            disabled={running}
            className="rounded-lg border border-border bg-surface px-5 py-2 text-sm font-medium text-text hover:bg-surface-dim disabled:opacity-50"
          >
            除戸謄本の記事だけ投入（4言語）
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
