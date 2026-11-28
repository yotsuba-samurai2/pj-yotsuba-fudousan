"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { RentalImport } from "@/lib/rental-import/validation";
import { DIRECT_RENTAL_SEARCH_AREA_LABEL } from "@/lib/rental-import/direct-search-area";

import { acknowledgeReadback, applyWithReceipt, batchAssets, operatorReceipts, inspectReceipt, intentDigest, isReady, runReviewedBatch, summaryReport, type BatchResult as Result } from "@/lib/rental-import/batch-review";
const LABELS: Record<string, string> = { ready: "登録条件を確認済み", "ready-close": "掲載終了を確認済み・反映すると公開停止", held: "確認待ち", created: "登録済み", updated: "更新済み", closed: "募集終了に変更済み", unchanged: "変更なし", readback_required: "送信結果が不明・再送せず読戻し", saved_refresh_pending: "物件データは保存済み・公開ページの更新要求は失敗", saved_readback_required: "物件データは保存済み・送信記録の再確認が必要", previously_saved: "同じ入力の保存履歴あり・再送せず", already_reviewed: "読戻し済み・同じ入力は再送しません", confirmed_not_saved:"未保存を担当者が確認・同じ入力は再送しません" };

export default function RentalImportPage() {
  const [operator,setOperator] = useState<string|null>(null);
  useEffect(()=>{
    const {data:{subscription}} = getSupabaseClient().auth.onAuthStateChange((_event,session)=>setOperator(session?.user.id ?? null));
    return ()=>subscription.unsubscribe();
  },[]);
  return operator ? <RentalImportBatch key={operator} operator={operator} /> : <p role="status" className="p-6">管理者セッションを確認しています。</p>;
}
type Observation = "managed"|"canonical"|"not_observed";
function RentalImportBatch({operator}:{operator:string}) {
  const active = useRef(true);
  useEffect(()=>{active.current=true; return ()=>{active.current=false;};},[]);
  const [records, setRecords] = useState<unknown[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"draft" | "published">("draft");
  const [operation, setOperation] = useState<"new" | "maintenance" | "close">("new");
  const [results, setResults] = useState<Result[]>([]);
  const [watchData, setWatchData] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const running = useRef(false);
  const fileVersion = useRef(0);
  const [assetInputKey, setAssetInputKey] = useState(0);
  const [observed, setObserved] = useState<Map<string,Observation>>(new Map());
  const [lastRun, setLastRun] = useState<{startedAt:string; stage:"check"|"apply"} | null>(null);
  const reset = () => { setResults([]); setError(""); setWatchData(""); setObserved(new Map()); setLastRun(null); };
  async function token() {
    const {data:{session}} = await getSupabaseClient().auth.getSession();
    if (!active.current || !session || session.user.id !== operator) throw new Error("再ログインし、同じ操作者で登録前チェックから再開してください。");
    return session.access_token;
  }
  function post(body: Record<string, unknown> | FormData, access: string) {
    if (!active.current) throw new Error("操作者が変わったため処理を停止しました。");
    const form = body instanceof FormData;
    return fetch("/api/admin/bukken/import", { method: "POST", signal:AbortSignal.timeout(form ? 120_000 : 45_000), headers: { Authorization: `Bearer ${access}`, ...(!form ? { "Content-Type": "application/json" } : {}) }, body: form ? body : JSON.stringify(body) });
  }
  async function request(body: Record<string, unknown> | FormData) {
    const response = await post(body, await token());
    const value = await response.json();
    if (!response.ok) throw new Error(typeof value?.error === "string" ? value.error : "処理に失敗しました");
    return value;
  }
  function storage() {
    try { return operatorReceipts(window.sessionStorage,operator); }
    catch { throw new Error("このタブの送信記録を利用できないため、安全のため送信しません。"); }
  }
  async function run(write: boolean) {
    if (running.current || (write && !results.some(isReady))) return;
    running.current = true;
    const approved = write ? [...results] : undefined;
    const assets = batchAssets(files);
    setBusy(true); setError(""); setResults([]); setObserved(new Map());
    setLastRun({startedAt:new Date().toISOString(),stage:write ? "apply" : "check"});
    try {
      await runReviewedBatch({
        records, approved, onProgress:setResults,
        check:async (record) => {
          const checked: Result = await request({record, mode, maintenance:operation === "maintenance", action:operation === "close" ? "check-close" : "check"});
          // Server preflight remains authoritative. A local checkpoint can only inhibit a write.
          if (!checked.slug) return checked;
          const saved = storage();
          // An unresolved prior send blocks even when the operator has not reselected any photos.
          const uncertain = inspectReceipt(saved, checked.slug, await intentDigest(record, mode, operation));
          if (uncertain) return {...uncertain, reasons:[...(uncertain.reasons ?? []), ...(checked.reasons ?? [])]};
          const closing = checked.action === "ready-close" || operation === "close";
          try {
            const exact = inspectReceipt(saved, checked.slug, await assets.signature(record,mode,operation,closing));
            return exact ? {...exact, reasons:[...(exact.reasons ?? []), ...(checked.reasons ?? [])]} : checked;
          } catch(e) {
            return isReady(checked) ? {action:"held", slug:checked.slug, reasons:[e instanceof Error ? e.message : "画像を照合できませんでした。"]} : checked;
          }
        },
        apply:async (original,checked) => {
          const record = structuredClone(original);
          const maintenance = operation === "maintenance";
          const closing = checked.action === "ready-close" || operation === "close";
          if (!closing) {
            const p = (record as RentalImport).property;
            const pending = p.images.filter(i => i.url.startsWith("asset:"));
            // Never inherit a new batch's similarly named asset or silently use the first of two files.
            const uploaded = new Map<string, string>();
            for (const image of pending) {
              if (uploaded.has(image.url)) continue;
              const form = new FormData(); form.set("file", assets.file(image.url)); form.set("record", JSON.stringify(record)); form.set("mode", mode); form.set("maintenance", String(maintenance));
              const result = await request(form); uploaded.set(image.url, result.url);
            }
            for (const image of p.images) image.url = uploaded.get(image.url) ?? image.url;
          }
          const access = await token();
          const payload = {record, mode, maintenance, action:operation === "close" ? "close" : "apply"};
          return applyWithReceipt({store:storage(), slug:checked.slug!, intent:await assets.signature(original, mode, operation, closing), closing, send: async () => {
            const response = await post(payload, access);
            return {ok:response.ok, status:response.status, body:await response.json()};
          }});
        },
      });
    } finally { running.current = false; setBusy(false); }
  }
  async function readInventory() {
    if (running.current) return;
    running.current = true; setBusy(true); setError(""); setWatchData(""); setObserved(new Map());
    try {
      const res = await fetch("/api/admin/bukken/import", {cache:"no-store", signal:AbortSignal.timeout(45_000), headers:{Authorization:`Bearer ${await token()}`}});
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.listings)) throw new Error("監視対象を取得できませんでした");
      setWatchData(JSON.stringify(data,null,2));
      // Presence is not proof of this request's completion. Never unlock just because a GET returned.
      const slugs = new Set(data.listings.map((v:{slug?:string}) => v.slug));
      const unresolved = results.filter(r=>r.slug && r.receiptIntent);
      const matches = new Map<string,Observation>();
      for (const r of unresolved) if (slugs.has(r.slug)) matches.set(r.slug+":"+r.receiptIntent,"managed");
      if (unresolved.some(r=>!slugs.has(r.slug))) {
        // The managed export is a subset. Read the canonical inventory too; no negative result certifies a failed write.
        const response = await fetch("/api/admin/bukken",{cache:"no-store",signal:AbortSignal.timeout(45_000),headers:{Authorization:`Bearer ${await token()}`}});
        const inventory = await response.json();
        if (!response.ok || !Array.isArray(inventory.properties) || inventory.properties.some((p:unknown)=>!p || typeof p !== "object" || !("slug" in p) || typeof p.slug !== "string"))
          throw new Error("正本の全件一覧を照合できません。未登録とは判定しません。");
        const all = new Set(inventory.properties.map((p:{slug:string})=>p.slug));
        for (const r of unresolved) if (!slugs.has(r.slug)) matches.set(r.slug+":"+r.receiptIntent, all.has(r.slug) ? "canonical" : "not_observed");
      }
      setObserved(matches);
    } catch(err) { setError(err instanceof Error ? err.message : "監視対象を取得できませんでした"); }
    finally { running.current=false; setBusy(false); }
  }
  function recordReadback(row:number, result:Result) {
    const {slug,receiptIntent}=result;
    if (!slug || !receiptIntent) return;
    const finding = observed.get(slug+":"+receiptIntent);
    if (!finding || (finding==="not_observed" && result.action!=="readback_required")) return;
    const absent = finding==="not_observed";
    if (!window.confirm(absent
      ? "2つの一覧に見当たらないだけでは未保存の証明ではありません。元の送信処理が終了し、管理記録等を別途照合して未保存を特定できましたか？ 確証がなければキャンセルしてください。元の入力は再送せず、新しい根拠で再チェックします。"
      : "正本の同一住戸・保存内容と必要な公開画面を照合して、元の処理結果を特定できましたか？ 不明ならキャンセルしてください。元の入力は再送しません。")) return;
    if (!acknowledgeReadback(storage(),slug,receiptIntent,absent ? "confirmed_not_saved" : "reconciled")) { setError("送信記録が一致しません。もう一度読み戻してください。"); return; }
    setResults(prev=>prev.map((r,i)=>i===row ? {action:absent ? "confirmed_not_saved" : "already_reviewed",slug} : r));
  }
  function downloadReport() {
    if (!lastRun) return;
    if (running.current) return;
    const report=summaryReport({...lastRun,mode,operation,total:records.length,results});
    const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:"application/json"}));
    const a=document.createElement("a"); a.href=url; a.download="yotsuba-rental-"+lastRun.startedAt.replace(/[:.]/g,"-")+"-"+lastRun.stage+".json";
    a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link href="/admin/bukken" className="text-sm text-primary underline">物件管理へ戻る</Link>
      <h1 className="mt-5 text-2xl font-semibold">賃貸物件の取込・掲載確認</h1>
      <p className="mt-2 text-sm text-text-muted">四葉サイトの直接検索（ITANDI BB・いい生活Square）の対象は、東京都の{DIRECT_RENTAL_SEARCH_AREA_LABEL}です。文京区の学区別掲載は文京区内に限ります。</p>
      <p className="mt-2 text-sm text-text-muted">最新の募集状況と広告掲載の許可を確認して登録します。当社報酬の額や確認記録は掲載条件にしません。東京建物不動産販売のメールに同一号室の広告掲載可が明示されていればREINS確認を省略し、それ以外は同じ物件のどこか1か所で広告可を確認します。画像は、今回の掲載先で素材の利用条件を確認できたものだけを選択してください。賃料・諸条件はITANDIの記載、ペットは確認できた中で多い条件を採用します。既に登録済みの同一号室は重複登録を止め、更新時だけ「公開済み物件の再確認」を使います。</p>
      <section className="mt-5 rounded-lg border border-border p-4">
        <h2 className="font-semibold">公開後の監視対象</h2>
        <button disabled={busy} className="mt-2 rounded border border-border px-3 py-2 text-sm disabled:opacity-40" onClick={readInventory}>監視対象を取得</button>
        {watchData && <label className="mt-3 block text-sm">再確認用データ<textarea aria-label="再確認用データ" readOnly value={watchData} rows={12} className="mt-2 block w-full rounded border border-border p-2 font-mono text-xs" /></label>}
      </section>
      <div className="mt-6 space-y-5 rounded-xl border border-border bg-surface p-5">
        <label className="block text-sm font-medium">確認データ（JSON）
          <input aria-label="確認データ（JSON）" type="file" accept=".json,application/json" disabled={busy} className="mt-2 block w-full text-sm" onChange={async (e) => {
            const latest = ++fileVersion.current; reset(); setRecords([]); setFiles([]); setAssetInputKey(k=>k+1);
            const file = e.target.files?.[0]; if (!file) return;
            try { if (file.size > 2_000_000) throw new Error("2MB以下のデータを選択してください"); const data = JSON.parse(await file.text()); if (!Array.isArray(data) || data.length < 1 || data.length > 50) throw new Error("1〜50件の物件配列を選択してください"); if (latest === fileVersion.current) setRecords(data); }
            catch (err) { if (latest === fileVersion.current) setError(err instanceof Error ? err.message : "データを読み込めませんでした"); }
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
            <input key={assetInputKey} aria-label="写真・間取り" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy} className="mt-2 block w-full text-sm" onChange={(e) => { setFiles(Array.from(e.target.files ?? [])); reset(); }} />
          </label>
        </>}
        <p className="text-sm text-text-muted">読み込み：{records.length}件 ／ 画像：{files.length}点</p>
        <div className="flex flex-wrap gap-3">
          <button disabled={busy || !records.length} onClick={() => run(false)} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">登録前チェック</button>
          <button disabled={busy || !results.some(isReady)} onClick={() => run(true)} className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-40">{busy ? "処理中…" : operation === "close" ? "確認済みの物件を募集終了にする" : "確認結果を反映する（登録・公開停止）"}</button>
        </div>
      </div>
      {lastRun && <div className="mt-4 text-sm">
        <button type="button" disabled={busy} onClick={downloadReport} className="rounded border px-3 py-2">今回の処理記録を保存（社内用JSON）</button>
        <p className="mt-2 text-text-muted">保存済みは四葉の管理データの状態です。公開表示・ATBBは別途確認してください。応答不明の住戸は再送せず、他の通過分を進めます。</p>
      </div>}
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <div aria-live="polite" className="mt-5 space-y-3">
        {results.map((r, i) => <div key={i} className="rounded-lg border border-border p-4 text-sm"><p className="font-semibold">{i + 1}. {LABELS[r.action] ?? r.action}</p>{r.slug && <p className="mt-1 text-text-muted">{r.slug}</p>}
        {r.receiptIntent && <div className="mt-2">
          <p>「監視対象を取得」で最新一覧を読み戻し、必要な公開画面と突き合わせてください。確認できなければこの住戸だけ保留します。</p>
          {observed.get(r.slug+":"+r.receiptIntent)==="canonical" && <p>取込監視リストにありません。<Link className="underline" href="/admin/bukken" target="_blank">物件管理の正本</Link>で保存内容を確認してください。</p>}
          {observed.get(r.slug+":"+r.receiptIntent)==="not_observed" && <p>監視リスト・全件一覧とも未観測です。これだけで未保存とは断定できません。</p>}
          <button type="button" disabled={busy || !observed.has(r.slug+":"+r.receiptIntent) || (observed.get(r.slug+":"+r.receiptIntent)==="not_observed" && r.action!=="readback_required")} className="mt-1 rounded border px-2 py-1 disabled:opacity-50" onClick={()=>recordReadback(i,r)}>{observed.get(r.slug+":"+r.receiptIntent)==="not_observed" ? "別の正本で未保存を特定した場合のみ記録" : "一致を確認して記録（再送しない）"}</button>
        </div>}{r.reasons?.map((reason, j) => <p key={j} className="mt-1">{reason}</p>)}</div>)}
      </div>
      <p className="mt-5 text-xs text-text-muted">募集情報は毎回再確認します。掲載終了は履歴を残して公開を停止します。確認日時は再確認の目安で、時間の経過だけでは非公開になりません。</p>
    </div>
  );
}
