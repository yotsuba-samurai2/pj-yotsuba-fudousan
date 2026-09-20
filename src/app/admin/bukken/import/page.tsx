"use client";

import { useState } from "react";
import Link from "next/link";
import { getAccessToken } from "@/lib/admin-api";
import type { RentalImport } from "@/lib/rental-import/validation";

type Result = { action: string; slug?: string; reasons?: string[]; error?: string };
const LABELS: Record<string, string> = { ready: "登録条件を確認済み", "ready-close": "掲載終了を確認済み・反映すると公開停止", held: "確認待ち", created: "登録済み", updated: "更新済み", closed: "募集終了に変更済み", unchanged: "変更なし" };

export default function RentalImportPage() {
  const [records, setRecords] = useState<unknown[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"draft" | "published">("draft");
  const [operation, setOperation] = useState<"new" | "maintenance" | "close">("new");
  const [results, setResults] = useState<Result[]>([]);
  const [watchData, setWatchData] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const reset = () => { setResults([]); setError(""); };
  async function request(body: Record<string, unknown> | FormData) {
    const token = await getAccessToken();
    if (!token) throw new Error("再ログインしてください");
    const form = body instanceof FormData;
    const response = await fetch("/api/admin/bukken/import", { method: "POST", headers: { Authorization: `Bearer ${token}`, ...(!form ? { "Content-Type": "application/json" } : {}) }, body: form ? body : JSON.stringify(body) });
    const value = await response.json();
    if (!response.ok) throw new Error(value.error ?? "処理に失敗しました");
    return value;
  }
  async function run(write: boolean) {
    setBusy(true); setError(""); setResults([]);
    const output: Result[] = [];
    try {
      for (const original of records) {
        try {
          const record = structuredClone(original);
          const options = { record, mode, maintenance: operation === "maintenance" };
          const checked: Result = await request({ ...options, action: operation === "close" ? "check-close" : "check" });
          if (!write || !["ready", "ready-close"].includes(checked.action)) { output.push(checked); setResults([...output]); continue; }
          if (checked.action === "ready-close") {
            output.push(await request({ ...options, action: "apply" })); setResults([...output]); continue;
          }
          if (operation === "close") {
            output.push(await request({ ...options, action: "close" })); setResults([...output]); continue;
          }
          // Server validation has succeeded. Resolve every local image before uploading any.
          const p = (record as RentalImport).property;
          const pending = p.images.filter((i) => i.url.startsWith("asset:"));
          if (pending.some((i) => !files.some((f) => f.name === i.url.slice(6)))) throw new Error("取込データに対応する写真・間取りファイルを選択してください");
          const uploaded = new Map<string, string>();
          for (const image of pending) {
            const file = files.find((f) => f.name === image.url.slice(6))!;
            const form = new FormData(); form.set("file", file); form.set("record", JSON.stringify(record)); form.set("mode", mode); form.set("maintenance", String(operation === "maintenance"));
            const result = await request(form); uploaded.set(image.url, result.url);
          }
          for (const image of p.images) image.url = uploaded.get(image.url) ?? image.url;
          output.push(await request({ ...options, record, action: "apply" }));
        } catch (err) { output.push({ action: "held", reasons: [err instanceof Error ? err.message : "処理に失敗しました"] }); }
        setResults([...output]);
      }
    } finally { setBusy(false); }
  }
  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link href="/admin/bukken" className="text-sm text-primary underline">物件管理へ戻る</Link>
      <h1 className="mt-5 text-2xl font-semibold">賃貸物件の取込・掲載確認</h1>
      <p className="mt-2 text-sm text-text-muted">メールのAD条件と最新の募集状況を確認して登録します。同じ物件のどこか1か所に広告可があれば掲載可、画像は包括許可、賃料・諸条件はITANDIとREINSの高い方・厳しい方、ペットはこの2サイトの多い頭数を採用します。SUUMO・アットホーム・HOME’Sは掲載件数だけを確認します。</p>
      <section className="mt-5 rounded-lg border border-border p-4">
        <h2 className="font-semibold">公開後の監視対象</h2>
        <button disabled={busy} className="mt-2 rounded border border-border px-3 py-2 text-sm disabled:opacity-40" onClick={async () => {
          setBusy(true); setError("");
          try { const token = await getAccessToken(); if (!token) throw new Error("再ログインしてください"); const res = await fetch("/api/admin/bukken/import", { headers: { Authorization: `Bearer ${token}` } }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setWatchData(JSON.stringify(data, null, 2)); }
          catch (err) { setError(err instanceof Error ? err.message : "監視対象を取得できませんでした"); }
          finally { setBusy(false); }
        }}>監視対象を取得</button>
        {watchData && <label className="mt-3 block text-sm">再確認用データ<textarea aria-label="再確認用データ" readOnly value={watchData} rows={12} className="mt-2 block w-full rounded border border-border p-2 font-mono text-xs" /></label>}
      </section>
      <div className="mt-6 space-y-5 rounded-xl border border-border bg-surface p-5">
        <label className="block text-sm font-medium">確認データ（JSON）
          <input aria-label="確認データ（JSON）" type="file" accept=".json,application/json" disabled={busy} className="mt-2 block w-full text-sm" onChange={async (e) => {
            reset(); setRecords([]);
            const file = e.target.files?.[0]; if (!file) return;
            try { if (file.size > 2_000_000) throw new Error("2MB以下のデータを選択してください"); const data = JSON.parse(await file.text()); if (!Array.isArray(data) || data.length < 1 || data.length > 50) throw new Error("1〜50件の物件配列を選択してください"); setRecords(data); }
            catch (err) { setError(err instanceof Error ? err.message : "データを読み込めませんでした"); }
          }} />
        </label>
        <label className="block text-sm font-medium">処理
          <select aria-label="処理" value={operation} disabled={busy} onChange={(e) => { setOperation(e.target.value as typeof operation); reset(); }} className="mt-2 block w-full rounded border border-border p-2">
            <option value="new">新しい候補の登録</option><option value="maintenance">公開済み物件の再確認</option><option value="close">掲載終了・募集終了</option>
          </select>
        </label>
        {operation !== "close" && <>
          <label className="block text-sm font-medium">登録後の状態
            <select aria-label="登録後の状態" value={mode} disabled={busy} onChange={(e) => { setMode(e.target.value as typeof mode); reset(); }} className="mt-2 block w-full rounded border border-border p-2">
              <option value="draft">下書き</option><option value="published">条件を満たす物件を公開</option>
            </select>
          </label>
          <label className="block text-sm font-medium">写真・間取り（JPEG / PNG / WebP）
            <input aria-label="写真・間取り" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy} className="mt-2 block w-full text-sm" onChange={(e) => { setFiles(Array.from(e.target.files ?? [])); reset(); }} />
          </label>
        </>}
        <p className="text-sm text-text-muted">読み込み：{records.length}件 ／ 画像：{files.length}点</p>
        <div className="flex flex-wrap gap-3">
          <button disabled={busy || !records.length} onClick={() => run(false)} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">登録前チェック</button>
          <button disabled={busy || !results.some((r) => ["ready", "ready-close"].includes(r.action))} onClick={() => run(true)} className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-40">{busy ? "処理中…" : operation === "close" ? "確認済みの物件を募集終了にする" : "確認結果を反映する（登録・公開停止）"}</button>
        </div>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <div aria-live="polite" className="mt-5 space-y-3">
        {results.map((r, i) => <div key={i} className="rounded-lg border border-border p-4 text-sm"><p className="font-semibold">{i + 1}. {LABELS[r.action] ?? r.action}</p>{r.slug && <p className="mt-1 text-text-muted">{r.slug}</p>}{r.reasons?.map((reason, j) => <p key={j} className="mt-1">{reason}</p>)}</div>)}
      </div>
      <p className="mt-5 text-xs text-text-muted">募集情報は毎回再確認します。掲載終了は履歴を残して公開を停止し、確認から26時間を過ぎた物件も公開対象から外れます。</p>
    </div>
  );
}
