"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { PropertyRecoverySession } from "@/lib/property-recovery-session";

const labels = { pending: "未処理", running: "結果の照合が必要", acknowledged: "受領確認済み", not_required: "対象変更なし", blocked: "保留・確認が必要" };
export default function PropertyPublicationRecovery({ session }: { session: PropertyRecoverySession }) {
  const state = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);
  // Opening/reopening a panel only reads state; it never resumes an effect automatically.
  useEffect(() => { void session.inspect(); }, [session, state.selected]);
  const busy = state.phase === "busy", ready = state.phase === "ready", summary = state.summary;
  return <section aria-label="保存後の公開処理" className="my-4 rounded border p-4">
    <h2>保存後の公開処理</h2>
    <p role="status" aria-live="polite">{state.message || "物件の保存後に、ページ更新と通知の状態を確認します。"}</p>
    {state.capacityReached && <p>受付番号が50件に達しています。状態を照合し、完了または保留が確定した番号を整理すると、新しい保存を続けられます。</p>}
    {state.refs.length > 0 && <>
      <label>受付番号<select aria-label="受付番号" value={state.selected ?? ""} disabled={busy} onChange={e => session.select(e.target.value)}>
        {state.refs.map(ref => <option key={ref.requestId} value={ref.requestId}>{ref.requestId}</option>)}
      </select></label>
      <button type="button" disabled={busy} onClick={() => { void session.inspect(); }}>状態を照合</button>
      {state.heldReceipt && <button type="button" disabled={!ready || busy} onClick={() => { session.forgetConfirmedHeld(); }}>保留が確定した受付番号を一覧から外す</button>}
      {summary && <>
        <p>ページ更新：{labels[summary.cache.status]} ／ 検索エンジン通知：{labels[summary.notification.status]}</p>
        {(["cache", "notification"] as const).map(kind => {
          const stage = summary[kind], actionable = ["pending", "running"].includes(stage.status);
          return actionable && <button type="button" key={kind} disabled={!ready || busy || kind === "notification" && summary.cache.status !== "acknowledged"}
            onClick={() => { void session.resume(kind); }}>{kind === "cache" ? "ページ更新" : "通知"}{stage.status === "running" ? "の結果を照合" : "を再開"}</button>;
        })}
        {summary.cache.status === "acknowledged" && ["acknowledged", "not_required"].includes(summary.notification.status) &&
          <button type="button" disabled={!ready || busy} onClick={() => { session.forgetCompleted(); }}>完了した受付番号を一覧から外す</button>}
      </>}
      <p className="text-sm">物件の再保存は行いません。処理の受領と公開画面への反映は別に確認します。</p>
    </>}
  </section>;
}
