"use client";

import { useState } from "react";
import Link from "next/link";
import { getAccessToken } from "@/lib/admin-api";
import { InheritanceCorrectionPreview } from "@/components/admin/InheritanceCorrectionPreview";
import { INHERITANCE_CORRECTION_API, type CorrectionInput, type CorrectionPreview } from "@/lib/inheritance-correction-types";

async function correctionRequest(method: "GET" | "PATCH", input?: CorrectionInput) {
  const token = await getAccessToken();
  if (!token) throw new Error("管理者アカウントでログインしてください。");
  const response = await fetch(INHERITANCE_CORRECTION_API, {
    method, cache: "no-store",
    headers: { Authorization: "Bearer " + token, ...(input ? { "Content-Type": "application/json" } : {}) },
    ...(input ? { body: JSON.stringify(input) } : {}),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error ?? "処理結果を取得できません。先に読み取り確認してください。");
  return result;
}

export default function ReviewedInheritanceCorrectionPage() {
  const [rows, setRows] = useState<CorrectionPreview[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function inspect() {
    setBusy(true); setRows([]); setChecked({}); setNotice(""); setError("");
    try {
      const result = await correctionRequest("GET") as { rows: CorrectionPreview[] };
      setRows(result.rows);
      setNotice("読み取り確認が終わりました。まだ保存していません。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "記事の取得に失敗しました。");
    } finally { setBusy(false); }
  }

  async function apply(row: CorrectionPreview) {
    if (row.state !== "ready" || !row.confirmation || !checked[row.slug]) return;
    setBusy(true); setNotice(""); setError("");
    try {
      const result = await correctionRequest("PATCH", row.confirmation) as { outcome: "saved" | "unchanged" };
      const outcome = result.outcome === "saved" ? "訂正を保存しました。公開画面をご確認ください。" : "訂正済みでした。書き込みませんでした。";
      setNotice(row.title + "：" + outcome);
      setRows(previous => previous.map(item => item.slug === row.slug && item.business === row.business
        ? { ...item, state: "unchanged", reason: outcome, changes: [], confirmation: undefined } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "訂正に失敗しました。");
      // Another write or a refresh-only failure is possible. Discard the stale preview instead of retrying.
      setRows([]);
    } finally { setChecked({}); setBusy(false); }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-6">
      <Link href="/admin/columns" className="text-sm underline">コラム管理に戻る</Link>
      <h1 className="text-2xl font-bold">国際相続コラム5本の訂正</h1>
      <p>公開済みの対象記事に限り、確認稿と異なる本文・要約・FAQだけを更新します。公開日・URL・公開言語・公開状態は変更しません。</p>
      <p className="text-sm">読み取り確認の後、差分を開いて確認し、1本ずつ保存してください。現行原稿または確認後の版が異なるときは保存しません。</p>
      <button type="button" disabled={busy} onClick={inspect} className="rounded border px-4 py-2 disabled:opacity-50">対象5本を読み取り確認</button>
      {notice && <p role="status">{notice}</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {rows.map(row => (
        <section key={row.business + ":" + row.slug} className="space-y-3 rounded border p-4">
          <h2 className="font-semibold">{row.title}</h2>
          <p className="text-sm">{row.locales.join(" / ")} ／ {row.date}</p>
          <InheritanceCorrectionPreview row={row} />
          {row.state === "ready" && (
            <div className="flex flex-wrap gap-3">
              <label><input type="checkbox" disabled={busy} checked={Boolean(checked[row.slug])}
                onChange={event => setChecked(previous => ({ ...previous, [row.slug]: event.target.checked }))} /> この1本の確認稿を確認しました</label>
              <button type="button" disabled={busy || !checked[row.slug]} onClick={() => apply(row)}
                className="rounded bg-primary px-3 py-2 text-white disabled:opacity-50">この1本を訂正して保存</button>
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
