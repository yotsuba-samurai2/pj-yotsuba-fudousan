"use client";

import { useState } from "react";
import { getColumns, updateColumn, type FirestoreColumn } from "@/lib/admin-api";
import { patchColumnBrand, CORRECT_BRAND, type BrandMatch } from "@/lib/data/column-brand-name-patches";

/**
 * コラム社名表記の一括是正（翻訳チェック §J9・2026-07-20）。
 * 「四叶房产股份公司」等（四[叶葉]房[产產]股份(有限)?公司）→ 登記名「四葉不動産株式会社」。
 * 全コラムの title/excerpt/content/author/translations を全ロケール横断で走査。
 * まず「スキャン（dry-run）」で該当記事と before/after を確認 → 問題なければ「適用（保存）」。
 * ※翻訳辞書（/admin/translations）ではなくコラム（Prisma）側。DB書き込みは適用時のみ。
 */

type Hit = {
  id: string;
  slug: string;
  business: string;
  status: string;
  jaTitle: string;
  matches: BrandMatch[];
  patchedFields: Record<string, unknown>;
};

export default function FixColumnBrandNamePage() {
  const [running, setRunning] = useState(false);
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = async (): Promise<Hit[]> => {
    const cols = (await getColumns()) as FirestoreColumn[];
    const found: Hit[] = [];
    for (const col of cols) {
      const { patchedFields, matches } = patchColumnBrand(col as unknown as Record<string, unknown>);
      if (matches.length > 0) {
        found.push({
          id: col.id,
          slug: col.slug,
          business: col.business,
          status: col.status,
          jaTitle: col.title,
          matches,
          patchedFields,
        });
      }
    }
    return found;
  };

  const runScan = async () => {
    setRunning(true);
    setError(null);
    setApplied(false);
    try {
      setHits(await scan());
    } catch (e) {
      setError(String(e));
    }
    setRunning(false);
  };

  const runApply = async () => {
    setRunning(true);
    setError(null);
    try {
      const found = await scan();
      for (const h of found) {
        await updateColumn(h.id, h.patchedFields as Partial<FirestoreColumn>);
      }
      // 再スキャンで残存確認
      setHits(await scan());
      setApplied(true);
    } catch (e) {
      setError(String(e));
    }
    setRunning(false);
  };

  const total = hits?.reduce((n, h) => n + h.matches.length, 0) ?? 0;

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">コラム社名 表記是正（§J9）</h1>
      <p className="mb-3 max-w-2xl text-sm text-text-muted">
        全コラム（全ロケール・title/excerpt/content/author/translations）を走査し、
        <span className="mx-1 font-mono">四[叶葉]房[产產]股份(有限)?公司</span>
        を登記名<span className="mx-1 font-mono">{CORRECT_BRAND}</span>へ是正します。
        まず<strong>スキャン</strong>で該当記事を確認し、問題なければ<strong>適用</strong>してください。
        翻訳辞書ではなくコラム（Prisma）側です。
      </p>

      <div className="flex gap-3">
        <button
          onClick={runScan}
          disabled={running}
          className="rounded-lg border border-border px-5 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          {running ? "実行中..." : "スキャン（dry-run）"}
        </button>
        <button
          onClick={runApply}
          disabled={running || hits === null || total === 0 || applied}
          className="relative overflow-hidden rounded-lg px-5 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
          <span className="relative">{applied ? "適用済み" : "適用（保存）"}</span>
        </button>
      </div>

      {error && <p className="mt-4 max-w-3xl rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      {hits !== null && (
        <div className="mt-6 max-w-3xl">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-base font-bold">
              {applied ? "適用結果" : "スキャン結果"}：該当 {hits.length} 記事 / 一致 {total} 箇所
            </h2>
            {applied && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                保存済み
              </span>
            )}
          </div>

          {total === 0 ? (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
              該当する社名表記は見つかりませんでした（既に是正済み、または存在しません）。
            </p>
          ) : (
            <ul className="space-y-3">
              {hits.map((h) => (
                <li key={h.id} className="rounded-lg bg-surface-dim px-3 py-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-ink">{h.jaTitle}</span>
                    <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary">
                      {h.business}/{h.status}
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono text-text-muted">
                    id: {h.id} / slug: {h.slug}
                  </div>
                  <div className="mt-1 space-y-1">
                    {h.matches.map((m, i) => (
                      <div key={i} className="rounded bg-surface px-2 py-1">
                        <div className="font-mono text-text-muted">{m.path}</div>
                        <div className="text-red-600">− {m.before}</div>
                        <div className="text-green-700">＋ {m.after}</div>
                      </div>
                    ))}
                  </div>
                  <a
                    href={`/admin/columns/${h.id}/edit`}
                    className="mt-1 inline-block text-primary underline"
                  >
                    この記事を編集で開く
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
