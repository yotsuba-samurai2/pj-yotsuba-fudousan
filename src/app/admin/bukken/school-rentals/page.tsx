"use client";
import Link from "next/link";
import { useState } from "react";
import { getAccessToken } from "@/lib/admin-api";
import type { RentalFeed } from "@/lib/school-rental-feed";

type Preview = {
  expectedUpdatedAt: string | null;
  summaries: { id: string; building: string; unit: string; schoolSlug: string | null }[];
  excluded: { provider: string; sourceId: string; reason: string }[];
  adCandidates: { provider: string; sourceId: string; building: string; unit: string; adStatus: string; adQuote: string }[];
  saved?: boolean;
};
export default function SchoolRentalAdmin() {
  const [feed, setFeed] = useState<RentalFeed | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function loadSaved() {
    setBusy(true); setError(""); setFeed(null);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/admin/bukken/school-rentals", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreview({ ...data, expectedUpdatedAt: null, saved: true });
    } catch (e) { setError(e instanceof Error ? e.message : "読み込みに失敗しました"); }
    finally { setBusy(false); }
  }
  async function submit(action: "preview" | "save") {
    setBusy(true); setError("");
    try {
      const token = await getAccessToken();
      const response = await fetch("/api/admin/bukken/school-rentals", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action, feed, expectedUpdatedAt: preview?.expectedUpdatedAt }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setPreview(data);
    } catch (e) { setError(e instanceof Error ? e.message : "処理に失敗しました"); }
    finally { setBusy(false); }
  }
  return <div className="mx-auto max-w-5xl space-y-6 p-6">
    <Link href="/admin/bukken" className="text-primary underline">物件管理へ戻る</Link>
    <h1 className="text-2xl font-bold">学区別の募集一覧</h1>
    <p>文京区・賃料17万5,000円以上・48㎡以上・広告可を一覧掲載します。要連絡、申込あり、募集終了、同じ号室、既存登録を除外。ADは一般公開しません。ITANJI・いい生活・ATBBは申込なしの確認根拠が必要です。</p>
    <p>取得元ごとに全ページを確認したJSONを選択してください。その取得元の前回一覧を置き換え、今回含まれない物件は一覧から外します。毎週日曜日と水曜日に募集情報を更新します。経過時間だけで自動非表示にはしません。ログイン失敗・取得途中のデータは投入しないでください。</p>
    <label className="block">確認データ（JSON）<input type="file" accept=".json,application/json" disabled={busy} className="mt-2 block" onChange={async e => {
      setFeed(null); setPreview(null); setError("");
      try { const file = e.target.files?.[0]; if (file) { if (file.size > 3000000) throw new Error("ファイルが大きすぎます"); setFeed(JSON.parse(await file.text())); } }
      catch (e) { setError(e instanceof Error ? e.message : "JSONを確認してください"); }
    }} /></label>
    <div className="flex flex-wrap gap-3">
      <button className="rounded border px-4 py-3 disabled:opacity-40" disabled={busy} onClick={loadSaved}>保存済み一覧・AD候補を表示</button>
      <button className="rounded border px-4 py-3 disabled:opacity-40" disabled={!feed || busy} onClick={() => submit("preview")}>登録前チェック</button>
      <button className="rounded bg-primary px-4 py-3 text-white disabled:opacity-40" disabled={!feed || !preview || busy || preview.saved} onClick={() => submit("save")}>学区別一覧に反映</button>
    </div>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {preview && <>
      <p role="status">{preview.saved ? "保存結果（比較一覧）：" : "反映後の比較一覧（予定）："}全取得元の登録 {preview.summaries.length + preview.excluded.length}件 ＝ 比較一覧 {preview.summaries.length}件 ＋ 除外 {preview.excluded.length}件</p>
      {feed && <p>今回の入力：{feed.provider}／検索総登録数 {feed.expectedCount}件／取得 {feed.records.length}件</p>}
      <p className="text-sm text-text-muted">比較一覧は全取得元をまとめ、条件外・同一号室・既存登録を除いた件数です。今回の新規追加数ではありません。学校ページの「募集中」は、比較一覧とその言語で表示できる写真付き公開物件の合計です。写真の枚数、他言語ページ、AD候補を物件件数に加算しません。</p>
      <Link href="/gakku/rentals" target="_blank" rel="noopener" className="text-primary underline">公開一覧を確認 ↗</Link>
      <h2 className="text-xl font-bold">AD付きの個別掲載候補（社内専用）</h2>
      <p>比較一覧の内数：{preview.adCandidates.length}件</p>
      <p>「相談」は確約されたADではありません。個別登録前に条件と募集を再確認し、通常の物件取込で写真・必須情報を揃えます。</p>
      <ul className="space-y-2">{preview.adCandidates.map(r => <li key={`${r.provider}:${r.sourceId}`} className="rounded border p-3">{r.building} {r.unit}／{r.provider}／{r.adQuote}（{r.adStatus === "consult" ? "要相談" : "確認済み"}）</li>)}</ul>
      <details><summary>除外理由</summary><ul>{preview.excluded.map(r => <li key={`${r.provider}:${r.sourceId}`}>{r.provider} {r.sourceId}：{r.reason}</li>)}</ul></details>
      <details><summary>{preview.saved ? "比較一覧の物件" : "掲載予定物件"}</summary><ul>{preview.summaries.map(r => <li key={r.id}>{r.building} {r.unit}：{r.schoolSlug ?? "学区要確認"}</li>)}</ul></details>
    </>}
  </div>;
}
