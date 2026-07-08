"use client";

import { useEffect, useState } from "react";
import { getColumns, updateColumn, type FirestoreColumn } from "@/lib/firestore/columns";

/**
 * 台湾繁体字9本の公開化（台湾コンテンツ_admin投入指示書_v1.md／四葉サイト_多言語コンテンツ
 * 出し分け設計_v0.2.md §5-1「完成条件」の最終ステップ）。
 *
 * status: draft → published のみを書き込む（locales は変更しない）。
 *
 * 実行順序厳守:
 *   1. /admin/columns/backfill-locales を先に実行し、既存publishedのlocalesが埋まったことを確認
 *   2. locale出し分けコードをmainマージ・本番デプロイ
 *   3. ja/en一覧が不変であることを検証
 *   4. そのあとで、このページを実行する
 * 逆順（このページを先に実行）で行うと、locale出し分けコードが本番に無い間、
 * 台湾9本（zh-tw限定コンテンツ）がja/en一覧にも混ざって表示されてしまう。
 */

const TAIWAN_SLUGS = [
  "taiwan-souzoku-japan-fudosan",
  "taiwan-souzoku-baikyaku",
  "taiwan-souzoku-kanri-katsuyo",
  "taiwan-jin-souzoku-tetsuzuki",
  "taiwan-souzoku-guide",
  "taiwan-tokyo-fudosan-toshi",
  "bunkyo-shueki-bukken",
  "taiwan-tetsuzuki-onestop",
  "taiwan",
];

type Row = {
  id: string;
  slug: string;
  status: string;
  locales?: string[];
  localesOk: boolean;
  result?: "applied" | "error";
  detail?: string;
};

export default function PublishTaiwanPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const all = await getColumns("realestate");
      const found = TAIWAN_SLUGS.map((slug) => {
        const c = all.find((col) => col.slug === slug) as FirestoreColumn | undefined;
        if (!c) {
          return { id: "", slug, status: "(未発見)", locales: undefined, localesOk: false };
        }
        return {
          id: c.id,
          slug: c.slug,
          status: c.status,
          locales: c.locales,
          localesOk: !!c.locales && c.locales.length === 1 && c.locales[0] === "zh-tw",
        };
      });
      setRows(found);
      setLoading(false);
    })();
  }, []);

  const targets = rows.filter((r) => r.id && r.status !== "published" && r.localesOk);
  const blocked = rows.filter((r) => r.id && r.status !== "published" && !r.localesOk);

  const run = async () => {
    setRunning(true);
    for (const row of targets) {
      try {
        await updateColumn(row.id, { status: "published" });
        setRows((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, result: "applied", status: "published" } : r)),
        );
      } catch (e) {
        setRows((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, result: "error", detail: String(e) } : r)),
        );
      }
    }
    setRunning(false);
    setDone(true);
  };

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">台湾9本 公開化</h1>
      <p className="mb-2 max-w-2xl text-sm text-text-muted">
        status を draft → published に切り替えます（locales は変更しません）。
      </p>
      <p className="mb-6 max-w-2xl rounded-lg bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
        ⚠️ locale出し分けコードが本番デプロイ済み・ja/en一覧が不変であることを確認してから実行してください。
        先にこのページを実行すると、台湾9本がja/en一覧にも混ざって表示されます。
      </p>

      {loading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : (
        <>
          {blocked.length > 0 && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700">
              locales が [zh-tw] になっていないため対象外（先に backfill-locales を実行してください）:{" "}
              {blocked.map((r) => r.slug).join(", ")}
            </div>
          )}

          <div className="mb-4 overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-dim">
                  <th className="px-3 py-2 font-medium text-text-muted">slug</th>
                  <th className="px-3 py-2 font-medium text-text-muted">status</th>
                  <th className="px-3 py-2 font-medium text-text-muted">locales</th>
                  <th className="px-3 py-2 font-medium text-text-muted">結果</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.slug} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2 font-mono">{r.slug}</td>
                    <td className="px-3 py-2">{r.status}</td>
                    <td className="px-3 py-2 text-text-muted">
                      {r.locales ? `[${r.locales.join(", ")}]` : "(未設定)"}
                    </td>
                    <td className="px-3 py-2">
                      {r.result === "applied" && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">
                          公開化
                        </span>
                      )}
                      {r.result === "error" && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-600">
                          エラー: {r.detail}
                        </span>
                      )}
                      {!r.result && r.status === "published" && (
                        <span className="text-text-muted/50">既に公開済み</span>
                      )}
                      {!r.result && r.status !== "published" && !r.localesOk && (
                        <span className="text-red-500">対象外</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mb-4 text-sm text-text-muted">対象: {targets.length}件 / 全{rows.length}件</p>

          <button
            onClick={run}
            disabled={running || done || targets.length === 0}
            className="relative overflow-hidden rounded-lg px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
          >
            <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
            <span className="relative">
              {running ? "適用中..." : done ? "完了" : `${targets.length}件を公開する`}
            </span>
          </button>
        </>
      )}
    </div>
  );
}
