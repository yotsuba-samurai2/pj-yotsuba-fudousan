"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getColumns, upsertColumnBySlug } from "@/lib/admin-api";
import type { ColumnStatus } from "@/lib/admin-api";
import { HIKYOJUSHA_GAITAMEHO_COLUMN } from "@/lib/data/hikyojusha-gaitameho-column-seed";

type ItemResult = {
  slug: string;
  title: string;
  status: "pending" | "done" | "error";
  action?: "created" | "updated";
  message?: string;
};

/**
 * 新規コラム「非居住者が東京の不動産を買ったら、20日以内に外為法の報告」の投入。
 *
 * status="draft" で入り、浦松が確認のうえ管理画面から「公開」へ切り替える。
 * このページは公開までは行わない。
 * 既存slugがある場合は既存statusを引き継ぐ（seed-leaving-japan と同じ事故防止措置）。
 *
 * 【前提】投入の前に /admin/columns/fix-gaitameho-corrections を実行し、
 *   既存コラム overseas-owners-guide-japan-real-estate-sale の外為法の誤り
 *   （Q7の免除・Q11の罰則）を是正しておくこと。順番を逆にすると、
 *   公開中の2本が矛盾した記述のまま並ぶ期間ができる。
 */
export default function SeedHikyojushaGaitamehoPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ItemResult[]>(
    HIKYOJUSHA_GAITAMEHO_COLUMN.map((a) => ({
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

    for (let i = 0; i < HIKYOJUSHA_GAITAMEHO_COLUMN.length; i++) {
      const seeded = HIKYOJUSHA_GAITAMEHO_COLUMN[i];
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
        非居住者の外為法報告コラムの投入（1本）
      </h1>

      <div className="mt-4 space-y-2 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm">
        <p>
          <strong>下書きで投入します。</strong>
          公開はこのページでは行いません。投入後、管理画面のコラム一覧から内容を確認し、
          浦松の確認を経てから公開へ切り替えてください。
        </p>
        <p>
          <strong>先に /admin/columns/fix-gaitameho-corrections を実行してください。</strong>
          既存コラム overseas-owners-guide-japan-real-estate-sale のQ7・Q11に外為法の誤りがあり、
          先に直しておかないと、公開中の2本が矛盾したまま並ぶ期間ができます。
        </p>
        <p>
          slug が既にある場合は
          <strong>既存の公開状態をそのまま引き継ぎます</strong>
          （公開中の記事が下書きに戻ることはありません）。何度実行しても重複しません。
        </p>
        <p className="text-amber-900">
          <strong>日本語・繁体字・英語・簡体字の4言語で入ります。</strong>
          翻訳は機械変換ではなく、繁体字と簡体字を別々に書き分けています
          （条項号は繁「第◯條第◯項第◯號」／簡「第◯条第◯项第◯号」で統一。「款」は使っていません）。
          公開へ切り替えるときは <code>date</code> を実際の公開日へ直してください
          （記事の表示日付と sitemap の <code>lastmod</code> の両方に効きます）。
        </p>
      </div>

      <button
        type="button"
        onClick={handleRun}
        disabled={running}
        className="mt-6 rounded-md bg-primary px-5 py-2.5 text-white disabled:opacity-50"
      >
        {running
          ? "投入中…"
          : `${HIKYOJUSHA_GAITAMEHO_COLUMN.length}本を投入する（新規は下書き）`}
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
