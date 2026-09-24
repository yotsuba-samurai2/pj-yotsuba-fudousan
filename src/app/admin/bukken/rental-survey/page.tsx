"use client";
// ペット調査の取込画面（ペット横断 指示書 版2.0 第4〜9章・2026-09-24 浦松指示「ペット調査はやってください」）。
// 学区の募集一覧（/admin/bukken/school-rentals）とは別の保存先・API で、学区のデータには触れない。
// 流れ：現状の表示 → バッチ（1媒体・1回の取得）の投入（登録前チェック→保存）→ 3媒体そろったら確定（確定前チェック→確認→確定）。
// ペット条件は媒体の原文どおりに分類されたものを、浦松が根拠の原文で確認してから確定する（AI の判定だけで「可」を確定しない）。
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAccessToken } from "@/lib/admin-api";
import { MAX_SURVEY_BODY_BYTES, surveyBatchSchema, type SurveyBatch } from "@/lib/rental-survey/batch";
import { pickFinalizationBatches, summarizeBatch, type BatchMeta } from "@/lib/rental-survey/review";
import { currentSurveyScope } from "@/lib/rental-survey/scope";

const SCOPE = currentSurveyScope("bunkyo-rent-pet")!;
const SCOPE_PARAMS = { scopeId: SCOPE.scopeId, scopeVersion: SCOPE.version };
const API = "/api/admin/rental-survey";
const PROVIDER_LABELS: Record<string, string> = { reins: "REINS（同席時のみ）", atbb: "ATBB", itandi: "ITANJI", eslife: "いい生活" };

type StoredBatchMeta = BatchMeta & { failureReason: string | null; expectedCount: number | null; recordCount: number; allPagesChecked: boolean };
type FinalizationMeta = {
  id: string; sequence: number; observedFrom: string; observedTo: string; createdAt: string; rolledBackFrom: string | null;
  x?: number; targetBreakdown?: { multiplePets: number; largeDog: number };
  excludedUnits?: Record<string, number>; excludedObservations?: Record<string, number>; invalid?: boolean;
};
type Status = {
  permissions: { provider: string; store: boolean; aggregate: boolean }[];
  batches: StoredBatchMeta[];
  finalizations: FinalizationMeta[];
};
type Summary = { x: number; targetBreakdown: { multiplePets: number; largeDog: number }; excludedUnits: Record<string, number>; excludedObservations: Record<string, number> };

const day = (iso: string) => new Date(iso).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
const EXCLUDED_LABELS: Record<string, string> = {
  "out-of-area": "対象地域外", "unresolved-identity": "号室不足などで同一性が未確定", conflict: "媒体間で条件が食い違う",
  "closed-or-applied": "募集終了・申込あり", "status-unconfirmed": "募集状態が未確認", "not-target": "ペット条件が対象外",
};

async function call(method: "GET" | "POST", body?: unknown) {
  const token = await getAccessToken();
  const res = await fetch(method === "GET" ? `${API}?scopeId=${SCOPE.scopeId}&scopeVersion=${SCOPE.version}` : API, {
    method, cache: "no-store",
    headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "処理に失敗しました");
  return data;
}

function SummaryView({ s }: { s: Summary }) {
  return (
    <div className="rounded border p-3 text-sm">
      <p className="font-semibold">重複を除いた確認件数（X）：{s.x}件</p>
      <p>内訳（重複あり・足して総数にしない）：複数飼育 可・相談 {s.targetBreakdown.multiplePets}件／大型犬 可・相談 {s.targetBreakdown.largeDog}件</p>
      <p className="mt-1 text-text-muted">
        除外：{Object.entries({ ...s.excludedObservations, ...s.excludedUnits }).map(([k, n]) => `${EXCLUDED_LABELS[k] ?? k} ${n}件`).join("／")}
      </p>
    </div>
  );
}

export default function RentalSurveyAdmin() {
  const [status, setStatus] = useState<Status | null>(null);
  const [batch, setBatch] = useState<SurveyBatch | null>(null);
  const [batchChecked, setBatchChecked] = useState(false);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [finalizePreview, setFinalizePreview] = useState<Summary | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [rollbackPreview, setRollbackPreview] = useState<{ targetId: string; summary: Summary } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true); setError("");
    try { setStatus(await call("GET")); } catch (e) { setError(e instanceof Error ? e.message : "読み込みに失敗しました"); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const review = useMemo(() => (batch ? summarizeBatch(batch) : null), [batch]);
  const latestSequence = status?.finalizations.reduce((max, f) => Math.max(max, f.sequence), 0) ?? 0;
  const pick = useMemo(() => (status ? pickFinalizationBatches(status.batches, SCOPE) : null), [status]);
  const verifiedByProvider = (provider: string) => status?.batches.filter(b => b.provider === provider && b.status === "verified") ?? [];
  const chosenIds = SCOPE.providers.map(p => selected[p] ?? pick?.batchIds.find(id => status?.batches.find(b => b.id === id)?.provider === p)).filter((id): id is string => !!id);

  async function run(fn: () => Promise<void>) {
    setBusy(true); setError(""); setMessage("");
    try { await fn(); } catch (e) { setError(e instanceof Error ? e.message : "処理に失敗しました"); }
    finally { setBusy(false); }
  }

  async function onFile(file: File | undefined) {
    setBatch(null); setBatchChecked(false); setError(""); setMessage("");
    if (!file) return;
    try {
      if (file.size > MAX_SURVEY_BODY_BYTES) throw new Error("ファイルが大きすぎます（5MBまで）");
      const parsed = surveyBatchSchema.safeParse(JSON.parse(await file.text()));
      if (!parsed.success) throw new Error(parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(" / "));
      setBatch(parsed.data);
    } catch (e) { setError(e instanceof Error ? e.message : "JSONを確認してください"); }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <Link href="/admin/bukken" className="text-primary underline">物件管理へ戻る</Link>
      <h1 className="text-2xl font-bold">ペット調査（文京区・居住用賃貸・多頭飼育／大型犬）</h1>
      <div className="space-y-2 rounded border bg-surface-dim p-4 text-sm leading-relaxed">
        <p>対象は、媒体の原文で「2頭以上の飼育 可・相談可」または「大型犬 可・相談可」を確認できた住戸です（和集合・1住戸1件）。「ペット相談」だけの記載は対象にしません。学区の募集一覧とは別の保存先で、学区のデータには触れません。</p>
        <p>ペット条件は原文どおりに分類し、確定の前に根拠の原文を確認してください。AI の判定だけで「可」を確定しません。</p>
        <p>確定した件数は、媒体名を出さない当社の独自集計として /pet-housing に表示されます（公開フラグが有効な場合）。この画面から個別物件を自動公開しません。住戸ごとに広告可・募集状況・学区・ファミリー向け適合を確認できた物件だけを、別の確認済み一覧から掲載します。</p>
        <p>確定には、3媒体（REINS・ITANJI・いい生活）の完全な取得（verified）が観測期間7日以内にそろう必要があります（版2・2026-09-25。ATBBは週次検索から除外）。REINS は浦松が同席したときだけ操作します。</p>
      </div>

      {error && <p role="alert" className="text-red-700">{error}</p>}
      {message && <p role="status" className="text-green-800">{message}</p>}

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">現在の状態</h2>
          <button className="rounded border px-3 py-2 text-sm disabled:opacity-40" disabled={busy} onClick={() => void load()}>再読み込み</button>
        </div>
        {status && <>
          <table className="w-full border-collapse text-sm">
            <thead><tr className="text-left"><th className="border px-2 py-1">媒体</th><th className="border px-2 py-1">内部保存・加工</th><th className="border px-2 py-1">集計公表</th></tr></thead>
            <tbody>{status.permissions.map(p => (
              <tr key={p.provider}><td className="border px-2 py-1">{PROVIDER_LABELS[p.provider] ?? p.provider}</td><td className="border px-2 py-1">{p.store ? "記載あり" : "なし"}</td><td className="border px-2 py-1">{p.aggregate ? "記載あり" : "なし"}</td></tr>
            ))}</tbody>
          </table>
          <details open>
            <summary className="font-semibold">保存済みのバッチ（新しい順・最大50件）</summary>
            {status.batches.length === 0 ? <p className="text-sm">まだありません。</p> : (
              <ul className="mt-2 space-y-1 text-sm">{status.batches.map(b => (
                <li key={b.id}>{day(b.createdAt)} 保存／{PROVIDER_LABELS[b.provider] ?? b.provider}／{b.status}／観測 {day(b.observedFrom)}〜{day(b.observedTo)}／検索総数 {b.expectedCount ?? "—"}件・取得 {b.recordCount}件{b.failureReason ? `／理由：${b.failureReason}` : ""}</li>
              ))}</ul>
            )}
          </details>
        </>}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">バッチの投入（1媒体・1回の取得）</h2>
        <label className="block text-sm">調査データ（JSON・5MBまで）
          <input type="file" accept=".json,application/json" disabled={busy} className="mt-2 block" onChange={e => void onFile(e.target.files?.[0])} />
        </label>
        {review && batch && <>
          <div className="rounded border p-3 text-sm">
            <p className="font-semibold">{PROVIDER_LABELS[review.provider] ?? review.provider}／{review.status}／観測 {day(batch.observedFrom)}〜{day(batch.observedTo)}</p>
            <p>検索総数 {review.expectedCount ?? "—"}件・取得 {review.recordCount}件</p>
            <p>対象（和集合）{review.counts.target}件：複数飼育 可・相談 {review.counts.multiplePets}件（うち猫3頭以上と明記 {review.counts.catsThreeOrMore}件）／大型犬 可・相談 {review.counts.largeDog}件</p>
            <p>対象のうち募集終了・申込あり・状態不明（確定時に除外）：{review.counts.targetNotActive}件</p>
            <p className="text-text-muted">対象外：頭数未確認（「ペット相談」など）{review.counts.unconfirmedCount}件／1頭限定 {review.counts.singleOnly}件／不可 {review.counts.notAllowed}件</p>
          </div>
          <details>
            <summary className="font-semibold">対象の住戸と根拠の原文（{review.targets.length}件）</summary>
            <ul className="mt-2 space-y-2 text-sm">{review.targets.map(t => (
              <li key={t.sourceId} className="rounded border p-2">
                {t.building} {t.unit}（{t.sourceId}）／複数飼育：{t.multi}／大型犬：{t.largeDog}／上限：猫 {t.limits.cats ?? "—"}・犬 {t.limits.dogs ?? "—"}・合計 {t.limits.total ?? "—"}
                <br />原文：{t.petQuote}{t.conditions ? `／条件：${t.conditions}` : ""}／募集 {t.availability}・申込 {t.application}
              </li>
            ))}</ul>
          </details>
          <div className="flex flex-wrap gap-3">
            <button className="rounded border px-4 py-3 disabled:opacity-40" disabled={busy} onClick={() => void run(async () => {
              const r = await call("POST", { action: "save-batch", dryRun: true, ...SCOPE_PARAMS, batch });
              setBatchChecked(true); setMessage(`登録前チェックOK：${PROVIDER_LABELS[r.provider] ?? r.provider}／${r.status}／${r.recordCount}件`);
            })}>登録前チェック</button>
            <button className="rounded bg-primary px-4 py-3 text-white disabled:opacity-40" disabled={busy || !batchChecked} onClick={() => void run(async () => {
              const r = await call("POST", { action: "save-batch", dryRun: false, ...SCOPE_PARAMS, batch });
              setBatch(null); setBatchChecked(false); setMessage(`保存しました（${r.id}）`); await load();
            })}>保存</button>
          </div>
        </>}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">確定（3媒体がそろった週）</h2>
        {status && pick && <>
          <ul className="space-y-1 text-sm">{SCOPE.providers.map(p => {
            const options = verifiedByProvider(p);
            return (
              <li key={p}>
                {PROVIDER_LABELS[p] ?? p}：{options.length === 0 ? "完全な取得のバッチがありません" : (
                  <select className="rounded border px-2 py-1" value={chosenIds.find(id => options.some(o => o.id === id)) ?? ""}
                    onChange={e => { setSelected(s => ({ ...s, [p]: e.target.value })); setFinalizePreview(null); setReviewed(false); }}>
                    {options.map(o => <option key={o.id} value={o.id}>{day(o.createdAt)} 保存（観測 {day(o.observedFrom)}〜{day(o.observedTo)}・{o.recordCount}件）</option>)}
                  </select>
                )}
              </li>
            );
          })}</ul>
          {pick.missing.length > 0 && <p className="text-sm text-amber-800">不足している媒体：{pick.missing.map(p => PROVIDER_LABELS[p] ?? p).join("・")}。この週は確定できません。</p>}
          {pick.windowDays !== null && !pick.withinWindow && <p className="text-sm text-amber-800">観測期間の幅が{SCOPE.maxWindowDays}日を超えています（{pick.windowDays.toFixed(1)}日）。</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded border px-4 py-3 disabled:opacity-40" disabled={busy || chosenIds.length !== SCOPE.providers.length} onClick={() => void run(async () => {
              setFinalizePreview(await call("POST", { action: "finalize", dryRun: true, ...SCOPE_PARAMS, batchIds: chosenIds, expectedSequence: latestSequence }));
              setReviewed(false);
            })}>確定前チェック</button>
          </div>
          {finalizePreview && <>
            <SummaryView s={finalizePreview} />
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} className="mt-1" />
              <span>各バッチの対象の住戸について、ペット条件の分類を根拠の原文で確認した</span>
            </label>
            <button className="rounded bg-primary px-4 py-3 text-white disabled:opacity-40" disabled={busy || !reviewed} onClick={() => void run(async () => {
              const r = await call("POST", { action: "finalize", dryRun: false, ...SCOPE_PARAMS, batchIds: chosenIds, expectedSequence: latestSequence });
              setFinalizePreview(null); setReviewed(false); setMessage(`確定しました（確定番号 ${r.sequence}・${r.x}件）`); await load();
            })}>確定</button>
          </>}
        </>}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">確定の履歴・巻き戻し</h2>
        {status && (status.finalizations.length === 0 ? <p className="text-sm">まだ確定はありません。</p> : (
          <ul className="space-y-2 text-sm">{status.finalizations.map(f => (
            <li key={f.id} className="rounded border p-2">
              確定番号 {f.sequence}（{day(f.createdAt)}）／観測 {day(f.observedFrom)}〜{day(f.observedTo)}／{f.invalid ? "内容を確認できません" : `X ${f.x}件`}{f.rolledBackFrom ? "／巻き戻しによる確定" : ""}
              {f.sequence !== latestSequence && (
                <button className="ml-3 rounded border px-2 py-1 disabled:opacity-40" disabled={busy} onClick={() => void run(async () => {
                  const s = await call("POST", { action: "rollback", dryRun: true, ...SCOPE_PARAMS, targetId: f.id, expectedSequence: latestSequence });
                  setRollbackPreview({ targetId: f.id, summary: s });
                })}>この確定に戻す（確認）</button>
              )}
            </li>
          ))}</ul>
        ))}
        {rollbackPreview && <>
          <SummaryView s={rollbackPreview.summary} />
          <button className="rounded bg-primary px-4 py-3 text-white disabled:opacity-40" disabled={busy} onClick={() => void run(async () => {
            const r = await call("POST", { action: "rollback", dryRun: false, ...SCOPE_PARAMS, targetId: rollbackPreview.targetId, expectedSequence: latestSequence });
            setRollbackPreview(null); setMessage(`巻き戻しました（確定番号 ${r.sequence}）`); await load();
          })}>巻き戻す</button>
        </>}
      </section>
    </div>
  );
}
