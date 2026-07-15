"use client";

import { useEffect, useState } from "react";
import { getColumns, updateColumn, type FirestoreColumn } from "@/lib/admin-api";
import type { LangCode } from "@/config/languages";

/**
 * columns.locales 後埋め（四葉サイト_多言語コンテンツ出し分け設計_v0.2.md Part1・移行手順）。
 *
 * 既に locales が設定済みのコラムはスキップ（冪等）。書き込むのは locales フィールドのみ。
 * status は一切変更しない（台湾9本の公開化は /admin/columns/publish-taiwan で別途行う）。
 *
 * 実行順序厳守: このページを実行して既存published3件のlocalesが埋まったことを確認してから、
 * locale出し分けコードをmainマージ・本番デプロイすること（逆順だと既存publishedがja/en一覧から消える）。
 */

const TAIWAN_SLUGS = new Set([
  "taiwan-souzoku-japan-fudosan",
  "taiwan-souzoku-baikyaku",
  "taiwan-souzoku-kanri-katsuyo",
  "taiwan-jin-souzoku-tetsuzuki",
  "taiwan-souzoku-guide",
  "taiwan-tokyo-fudosan-toshi",
  "bunkyo-shueki-bukken",
  "taiwan-tetsuzuki-onestop",
  "taiwan",
]);

function computeDefaultLocales(col: FirestoreColumn): LangCode[] {
  if (col.business === "realestate" && TAIWAN_SLUGS.has(col.slug)) {
    return ["zh-tw"];
  }
  const transLangs = col.translations ? (Object.keys(col.translations) as LangCode[]) : [];
  return Array.from(new Set<LangCode>(["ja", ...transLangs]));
}

type Row = {
  id: string;
  business: string;
  status: string;
  slug: string;
  current?: LangCode[];
  proposed: LangCode[];
  needsUpdate: boolean;
  result?: "applied" | "error";
  detail?: string;
};

export default function BackfillLocalesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const all = await getColumns();
      const computed = all.map((c) => {
        const proposed = computeDefaultLocales(c);
        return {
          id: c.id,
          business: c.business,
          status: c.status,
          slug: c.slug,
          current: c.locales,
          proposed,
          needsUpdate: !c.locales,
        };
      });
      setRows(computed);
      setLoading(false);
    })();
  }, []);

  const targets = rows.filter((r) => r.needsUpdate);

  const run = async () => {
    setRunning(true);
    for (const row of targets) {
      try {
        await updateColumn(row.id, { locales: row.proposed });
        setRows((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, result: "applied" } : r)),
        );
      } catch (e) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === row.id ? { ...r, result: "error", detail: String(e) } : r,
          ),
        );
      }
    }
    setRunning(false);
    setDone(true);
  };

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">columns.locales 後埋め</h1>
      <p className="mb-6 max-w-2xl text-sm text-text-muted">
        locales が未設定のコラムに初期値を設定します（既に設定済みのコラムはスキップ・冪等）。
        書き込むのは locales フィールドのみ。status は変更しません。
      </p>

      {loading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : (
        <>
          <div className="mb-4 overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-dim">
                  <th className="px-3 py-2 font-medium text-text-muted">business</th>
                  <th className="px-3 py-2 font-medium text-text-muted">status</th>
                  <th className="px-3 py-2 font-medium text-text-muted">slug</th>
                  <th className="px-3 py-2 font-medium text-text-muted">現状 locales</th>
                  <th className="px-3 py-2 font-medium text-text-muted">→ 提案 locales</th>
                  <th className="px-3 py-2 font-medium text-text-muted">結果</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2">{r.business}</td>
                    <td className="px-3 py-2">{r.status}</td>
                    <td className="px-3 py-2 font-mono">{r.slug}</td>
                    <td className="px-3 py-2 text-text-muted">
                      {r.current ? `[${r.current.join(", ")}]` : "(未設定)"}
                    </td>
                    <td className="px-3 py-2 font-medium text-text">
                      {r.needsUpdate ? `[${r.proposed.join(", ")}]` : "―（変更なし）"}
                    </td>
                    <td className="px-3 py-2">
                      {r.result === "applied" && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">
                          適用
                        </span>
                      )}
                      {r.result === "error" && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-600">
                          エラー: {r.detail}
                        </span>
                      )}
                      {!r.result && !r.needsUpdate && (
                        <span className="text-text-muted/50">スキップ</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mb-4 text-sm text-text-muted">
            対象: {targets.length}件（未設定分のみ書き込み） / 全{rows.length}件
          </p>

          <button
            onClick={run}
            disabled={running || done || targets.length === 0}
            className="relative overflow-hidden rounded-lg px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
          >
            <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
            <span className="relative">
              {running ? "適用中..." : done ? "完了" : `${targets.length}件に適用する`}
            </span>
          </button>
        </>
      )}
    </div>
  );
}
