"use client";

import { useState } from "react";
import { getColumns, getColumnById, updateColumn } from "@/lib/admin-api";
import type { AdminColumn } from "@/lib/column-shared";
import { FAMILY_COLUMN_UPDATE } from "@/lib/data/columns-reviewed-update-20261108";
import { applyReviewedUpdate, checkReviewedUpdate, type ReviewedUpdateCheck } from "@/lib/columns-reviewed-update";

type Row = ReviewedUpdateCheck & { id?: string; current?: AdminColumn; selected: boolean };
const businessPaths = { realestate: "/column", legal: "/legal/column", labor: "/labor/column" };
const stateLabels = { ready: "訂正可能", unchanged: "訂正済み", blocked: "停止" };

export default function ReviewedFamilyColumnUpdatePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function inspect() {
    setBusy(true); setError(""); setNotice("");
    try {
      const columns = await getColumns();
      const next = await Promise.all(FAMILY_COLUMN_UPDATE.map(async target => {
        const matches = columns.filter(column => column.business === target.business && column.slug === target.slug);
        if (matches.length !== 1) return { state: "blocked" as const, reason: "対象記事がないか、重複しています。", selected: false };
        const current = matches[0];
        const check = await checkReviewedUpdate(current, target);
        return { ...check, id: current.id, current, selected: check.state === "ready" };
      }));
      setRows(next);
      setNotice("読み取り確認が完了しました。差分とレビュー済み原稿を確認してから訂正を保存してください。");
    } catch (err) { setError(err instanceof Error ? err.message : "確認に失敗しました。"); }
    finally { setBusy(false); }
  }

  async function save() {
    setBusy(true); setError(""); setNotice("");
    let saved = 0;
    try {
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (!row.selected || row.state !== "ready" || !row.id) continue;
        const result = await applyReviewedUpdate(row.id, FAMILY_COLUMN_UPDATE[index], {
          get: getColumnById, update: updateColumn,
        });
        setRows(previous => previous.map((item, itemIndex) => itemIndex === index
          ? { ...item, ...result, selected: false } : item));
        if (result.state === "blocked") throw new Error(`${FAMILY_COLUMN_UPDATE[index].slug}: ${result.reason}`);
        if (result.updated) saved++;
      }
      setNotice(`${saved}本の訂正を保存しました。公開ページの本文を確認してください。`);
    } catch (err) {
      setError(`${saved}本まで処理済み。残りは停止しました。${err instanceof Error ? err.message : "保存に失敗しました。"} 一覧を再取得してください。`);
    } finally { setBusy(false); }
  }

  const selected = rows.filter(row => row.selected && row.state === "ready").length;
  return <main className="mx-auto max-w-6xl space-y-6 p-6">
    <h1 className="text-2xl font-bold">2026年11月8日 家族滞在コラムの訂正</h1>
    <p>公開済みの家族滞在コラム1本だけを、日本語・英語・繁体字・簡体字のレビュー済み原稿へ更新します。FAQも訂正し、本文の更新日を記録します。</p>
    <p>他の記事、公開状態・公開日・公開言語は変更しません。変更前の本文が一致しない場合や、保存直前に別の更新があった場合は停止します。</p>
    <div className="flex flex-wrap gap-4">
      <button type="button" disabled={busy} onClick={inspect} className="rounded border px-4 py-2 disabled:opacity-50">対象1本を読み取り確認</button>
      <button type="button" disabled={busy || !selected} onClick={save} className="rounded bg-emerald-700 px-4 py-2 text-white disabled:opacity-50">選択した{selected}本の訂正を保存</button>
    </div>
    {notice && <p role="status" className="whitespace-pre-wrap text-emerald-800">{notice}</p>}
    {error && <p role="alert" className="whitespace-pre-wrap text-red-700">{error}</p>}
    {FAMILY_COLUMN_UPDATE.map((target, index) => {
      const row = rows[index];
      return <section key={`${target.business}:${target.slug}`} className="space-y-3 rounded border p-4">
        <h2 className="font-semibold">{index + 1}. {target.revised.title}</h2>
        <p className="text-sm">{target.notice}</p>
        <a href={`${businessPaths[target.business]}/${target.slug}`} target="_blank" rel="noreferrer" className="text-sm underline">公開中の記事を確認</a>
        {row && <div className="space-y-2">
          <p>{stateLabels[row.state]}：{row.reason}</p>
          <label className="flex gap-2"><input type="checkbox" disabled={busy || row.state !== "ready"}
            checked={row.selected} onChange={event => setRows(previous => previous.map((item, itemIndex) => itemIndex === index
              ? { ...item, selected: event.target.checked } : item))} />この訂正を保存する</label>
        </div>}
        {(["ja", "en", "zh-tw", "zh"] as const).map(locale => {
          const before = locale === "ja" ? row?.current ?? target.original : row?.current?.translations?.[locale] ?? target.original.translations?.[locale];
          const after = locale === "ja" ? target.revised : target.revised.translations?.[locale];
          return <details key={locale}><summary className="cursor-pointer">{locale} 変更前／確認稿</summary>
            <div className="grid gap-4 py-3 md:grid-cols-2">
              <div><h3 className="font-semibold">変更前</h3><pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words text-sm">{JSON.stringify(before, null, 2)}</pre></div>
              <div><h3 className="font-semibold">確認稿</h3><pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words text-sm">{JSON.stringify(after, null, 2)}</pre></div>
            </div>
          </details>;
        })}
      </section>;
    })}
  </main>;
}
