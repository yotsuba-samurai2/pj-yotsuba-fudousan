"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, ExternalLink, AlertTriangle, CircleCheck } from "lucide-react";
import {
  getBukkenList,
  updateBukken,
  deleteBukken,
  getAccessToken,
} from "@/lib/admin-api";
import {
  isStaleListing,
  daysSince,
  formatPriceYen,
  STATUS_LABELS,
  CATEGORY_LABELS,
  DEAL_TYPE_LABELS,
  STALE_WARNING_DAYS,
  type AdminProperty,
  type PropertyStatus,
} from "@/lib/property-shared";

const statusColors: Record<PropertyStatus, string> = {
  draft: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-600",
};

const statuses = ["all", "draft", "published", "closed"] as const;

async function revalidateBukken(slug: string) {
  try {
    const token = await getAccessToken();
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        paths: ["/bukken", `/bukken/${slug}`, "/sitemap.xml"],
      }),
    });
  } catch (err) {
    console.error("Revalidation failed:", err);
  }
}

export default function BukkenListPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBukkenList(
        statusFilter === "all" ? undefined : (statusFilter as PropertyStatus),
      );
      setProperties(data);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setError("物件の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  /** 成約処理（ワンクリック）：closed へ更新→即時 revalidate で一覧・sitemapから消す */
  const handleClose = async (p: AdminProperty) => {
    if (!window.confirm(`「${p.title}」を成約（募集終了）にしますか？\n一覧・サイトマップから即時に外れ、詳細は「募集終了」表示になります。`)) {
      return;
    }
    setBusy(p.id);
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      await updateBukken(p.id, { status: "closed", infoUpdatedAt: todayStr });
      await revalidateBukken(p.slug);
      setProperties((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, status: "closed" } : x)),
      );
    } catch (err) {
      console.error("Failed to close:", err);
      alert("成約処理に失敗しました");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (p: AdminProperty) => {
    if (!window.confirm(`下書き「${p.title}」を削除しますか？（元に戻せません）`)) return;
    setBusy(p.id);
    try {
      await deleteBukken(p.id);
      setProperties((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) {
      console.error("Failed to delete:", err);
      alert(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setBusy(null);
    }
  };

  const now = new Date();
  const stale = properties.filter((p) => isStaleListing(p, now));

  return (
    <div className="p-6">
      {/* 鮮度警告（おとり広告の構造的回避：情報更新日から7日超の公開物件） */}
      {stale.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <AlertTriangle size={16} />
            情報更新日から{STALE_WARNING_DAYS}日を超えた公開物件があります（内容を確認し、更新または成約処理をしてください）
          </p>
          <ul className="mt-2 space-y-1 text-xs text-amber-900">
            {stale.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/bukken/${p.id}/edit`} className="underline">
                  {p.title}
                </Link>
                （更新日 {p.infoUpdatedAt}・{daysSince(p.infoUpdatedAt, now)}日経過）
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg bg-surface-dim p-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-surface text-text shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {s === "all" ? "全ステータス" : STATUS_LABELS[s as PropertyStatus]}
            </button>
          ))}
        </div>
        <Link
          href="/admin/bukken/new"
          className="relative ml-auto overflow-hidden rounded-lg px-5 py-2 text-sm font-semibold text-text transition-all duration-200"
        >
          <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
          <span className="relative">新規登録</span>
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <p className="mb-3 text-xs text-text-muted">
        {loading ? " " : `${properties.length}件の物件`}
      </p>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-dim">
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">ステータス</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">更新日</th>
              <th className="px-4 py-3 text-xs font-medium text-text-muted">物件名</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">種別</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">カテゴリ</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">価格</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-text-muted">
                  物件がありません
                </td>
              </tr>
            ) : (
              properties.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b border-border last:border-b-0 transition-colors hover:bg-surface-dim/50 ${
                    p.status === "closed" ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusColors[p.status]}`}>
                      {STATUS_LABELS[p.status]}
                    </span>
                    {isStaleListing(p, now) && (
                      <span className="ml-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        要更新
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-text-muted">
                    {p.infoUpdatedAt}
                  </td>
                  <td className="max-w-sm px-4 py-3">
                    <p className="truncate text-sm font-medium text-text">{p.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-text-muted">/bukken/{p.slug}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-text-muted">
                    {DEAL_TYPE_LABELS[p.dealType]}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-text-muted">
                    {CATEGORY_LABELS[p.category]}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-text-muted">
                    {formatPriceYen(p.priceYen)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/bukken/${p.id}/edit`}
                        className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-dim hover:text-primary"
                        title="編集"
                      >
                        <Pencil size={14} />
                      </Link>
                      <a
                        href={`/bukken/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-dim hover:text-primary"
                        title="プレビュー"
                      >
                        <ExternalLink size={14} />
                      </a>
                      {p.status === "published" && (
                        <button
                          onClick={() => handleClose(p)}
                          disabled={busy === p.id}
                          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-medium text-text-muted transition-colors hover:bg-surface-dim hover:text-primary disabled:opacity-50"
                          title="成約（募集終了）にする"
                        >
                          <CircleCheck size={12} />
                          成約
                        </button>
                      )}
                      {p.status === "draft" && (
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={busy === p.id}
                          className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                          title="削除（下書きのみ）"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
