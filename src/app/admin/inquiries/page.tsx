"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { getAccessToken } from "@/lib/admin-api";
import { INQUIRY_RETENTION_LABEL_JA } from "@/lib/shared/inquiry-intake";

/**
 * 受付の一覧・詳細（閲覧は受付先メールの所有者だけ。権限の判定はサーバー側の API が行う）。
 * 個人情報を表示するので、画面の内容を他のツールへ貼り付けない。
 */
type Item = {
  id: string; receiptNo: string; categoryLabel: string; createdAt: string; name: string;
  notifyStatus: string; autoReplyStatus: string; consentShare: string;
};
type Detail = Item & {
  locale: string; sourcePath: string; email: string; phone: string; rows: { label: string; value: string }[];
};

const STATUS: Record<string, string> = { sent: "送信済み", failed: "失敗", pending: "未送信", skipped: "送信なし（メール未入力）" };
const jst = (iso: string) => new Date(iso).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(path, { ...init, cache: "no-store", headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "処理に失敗しました");
  return data as T;
}

export default function InquiriesAdmin() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const data = await call<{ items: Item[]; purged: number }>("/api/admin/inquiries");
      setItems(data.items);
      if (data.purged) setNotice(`保存期間（${INQUIRY_RETENTION_LABEL_JA}）を過ぎた受付を ${data.purged} 件削除しました。`);
    } catch (e) { setError(e instanceof Error ? e.message : "読み込みに失敗しました"); }
    finally { setBusy(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function open(id: string) {
    setBusy(true); setError("");
    try { setDetail(await call<Detail>(`/api/admin/inquiries?id=${encodeURIComponent(id)}`)); }
    catch (e) { setError(e instanceof Error ? e.message : "読み込みに失敗しました"); }
    finally { setBusy(false); }
  }

  async function resend(id: string) {
    setBusy(true); setError(""); setNotice("");
    try {
      await call("/api/admin/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "resend-notification", id }) });
      setNotice("通知を再送しました。");
      await load();
      await open(id);
    } catch (e) { setError(e instanceof Error ? e.message : "再送に失敗しました"); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">受付</h1>
        <p className="mt-2 text-sm text-gray-600">
          フォームから保存された受付です。閲覧できるのは受付先メールの所有者だけです。受付から{INQUIRY_RETENTION_LABEL_JA}を過ぎたものは自動で削除します。
          通知メールの送信に失敗した受付は「失敗」と表示され、詳細から再送できます。
        </p>
      </div>
      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr><th className="p-2">受付日時</th><th className="p-2">受付番号</th><th className="p-2">種類</th><th className="p-2">お名前</th><th className="p-2">通知</th><th className="p-2">自動返信</th><th className="p-2">共有の同意</th></tr>
          </thead>
          <tbody>
            {items?.map(item => (
              <tr key={item.id} className={`cursor-pointer border-t hover:bg-gray-50 ${item.notifyStatus === "failed" ? "bg-red-50" : ""}`} onClick={() => open(item.id)}>
                <td className="p-2 whitespace-nowrap">{jst(item.createdAt)}</td>
                <td className="p-2 font-mono">{item.receiptNo}</td>
                <td className="p-2">{item.categoryLabel}</td>
                <td className="p-2">{item.name}</td>
                <td className={`p-2 ${item.notifyStatus === "failed" ? "font-bold text-red-700" : ""}`}>{STATUS[item.notifyStatus] ?? item.notifyStatus}</td>
                <td className="p-2">{STATUS[item.autoReplyStatus] ?? item.autoReplyStatus}</td>
                <td className="p-2">{item.consentShare === "granted" ? "あり" : "なし"}</td>
              </tr>
            ))}
            {items?.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-gray-500">受付はありません</td></tr>}
          </tbody>
        </table>
      </div>
      {detail && (
        <section className="rounded border bg-white p-4" aria-label="受付の詳細">
          <h2 className="text-lg font-bold">{detail.receiptNo}（{detail.categoryLabel}）</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[12rem_1fr]">
            <dt className="text-gray-500">受付日時</dt><dd>{jst(detail.createdAt)}</dd>
            <dt className="text-gray-500">お名前（受付名）</dt><dd>{detail.name}</dd>
            <dt className="text-gray-500">メール</dt><dd>{detail.email || "未入力"}</dd>
            <dt className="text-gray-500">電話</dt><dd>{detail.phone || "未入力"}</dd>
            {detail.rows.map(r => <Fragment key={r.label}><dt className="text-gray-500">{r.label}</dt><dd className="whitespace-pre-wrap">{r.value}</dd></Fragment>)}
            <dt className="text-gray-500">流入ページ</dt><dd>{detail.sourcePath}（{detail.locale}）</dd>
            <dt className="text-gray-500">通知／自動返信</dt><dd>{STATUS[detail.notifyStatus] ?? detail.notifyStatus}／{STATUS[detail.autoReplyStatus] ?? detail.autoReplyStatus}</dd>
          </dl>
          {detail.notifyStatus !== "sent" && (
            <button type="button" disabled={busy} onClick={() => resend(detail.id)} className="mt-4 rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              通知メールを再送する
            </button>
          )}
        </section>
      )}
    </div>
  );
}
