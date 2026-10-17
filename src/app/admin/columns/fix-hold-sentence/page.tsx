"use client";

import { useState } from "react";
import { getColumns, updateColumn, type FirestoreColumn } from "@/lib/admin-api";
import { patchColumnHoldSentence, type HoldSentenceMatch } from "@/lib/data/column-hold-sentence-patches";

/**
 * コラム本文の「公開は資格者確認待ちとして保留します」の削除（2026-10-17）。
 * 2026-10-17に「今すぐ公開」で公開した35本のうち18本（2026-10-11〜10-16付）に、この一文と訳文が残っていた。
 * 原稿とseedは同日に修正済み。この画面は公開済みのDB側を直す。
 * 全コラム（content と translations の全ロケール）を走査し、まず「スキャン」で該当箇所を確認してから「適用」する。
 * 適用は記事ごとに更新日時を添えて保存するため、スキャンのあとに手で直した記事は上書きせず、エラーとして表示する。
 */

type Hit = {
  id: string;
  slug: string;
  business: string;
  status: string;
  jaTitle: string;
  updatedAt?: string;
  matches: HoldSentenceMatch[];
  patchedFields: Record<string, unknown>;
};

export default function FixColumnHoldSentencePage() {
  const [running, setRunning] = useState(false);
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = async (): Promise<Hit[]> => {
    const cols = (await getColumns()) as FirestoreColumn[];
    const found: Hit[] = [];
    for (const col of cols) {
      const { patchedFields, matches } = patchColumnHoldSentence(col as unknown as Record<string, unknown>);
      if (matches.length > 0) {
        found.push({
          id: col.id,
          slug: col.slug,
          business: col.business,
          status: col.status,
          jaTitle: col.title,
          updatedAt: col.updatedAt,
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
    const failures: string[] = [];
    try {
      const found = await scan();
      for (const h of found) {
        try {
          await updateColumn(h.id, h.patchedFields as Partial<FirestoreColumn>, h.updatedAt);
        } catch (e) {
          failures.push(`${h.business}:${h.slug}：${String(e)}`);
        }
      }
      // 再スキャンで残りを確認
      setHits(await scan());
      setApplied(true);
      if (failures.length) setError(`保存できなかった記事があります（再読み込みしてやり直してください）\n${failures.join("\n")}`);
    } catch (e) {
      setError(String(e));
    }
    setRunning(false);
  };

  const total = hits?.reduce((n, h) => n + h.matches.length, 0) ?? 0;

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">「公開は資格者確認待ちとして保留します」の削除</h1>
      <p className="mb-3 max-w-2xl text-sm text-text-muted">
        全コラム（日本語と英語・繁体字・簡体字の訳）を走査し、本文に残った保留の一文を取り除きます。
        文の途中にあるものは、保留の部分だけを外して前後をつなぎます。
        まず<strong>スキャン</strong>で該当箇所を確認し、問題なければ<strong>適用</strong>してください。
        2026-10-17時点の見込みは18記事・72箇所です。
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

      {error && (
        <p className="mt-4 max-w-3xl whitespace-pre-line rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}

      {hits !== null && (
        <div className="mt-6 max-w-3xl">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-base font-bold">
              {applied ? "適用後の再スキャン" : "スキャン結果"}：該当 {hits.length} 記事 / {total} 箇所
            </h2>
            {applied && total === 0 && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                すべて削除済み
              </span>
            )}
          </div>

          {total === 0 ? (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
              該当する一文は見つかりませんでした（削除済み、または存在しません）。
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
                        <div className="text-red-600">− {m.removed}</div>
                        <div className="text-green-700">＋ {m.replacement || "（削除）"}</div>
                      </div>
                    ))}
                  </div>
                  <a href={`/admin/columns/${h.id}/edit`} className="mt-1 inline-block text-primary underline">
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
