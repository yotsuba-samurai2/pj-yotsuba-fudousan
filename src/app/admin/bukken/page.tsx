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
  formatPropertyPrice,
  STATUS_LABELS,
  CATEGORY_LABELS,
  DEAL_TYPE_LABELS,
  STALE_WARNING_DAYS,
  type AdminProperty,
  type PropertyStatus,
} from "@/lib/property-shared";

import { propertyMaintenanceQueue, type MaintenanceReason } from "@/lib/property-sync/maintenance-queue";

const maintenanceLabels: Record<MaintenanceReason, string> = {
  availability_due: "募集状況の確認期限",
  update_due: "次回更新予定日",
  stale: `情報更新から${STALE_WARNING_DAYS}日超`,
};
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
  const [maintenanceOnly, setMaintenanceOnly] = useState(false);

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

  /** closedへ保存し依存ページの再生成を要求。公開反映は別途確認する。 */
  const handleClose = async (p: AdminProperty) => {
    if (!window.confirm(`「${p.title}」を成約（募集終了）にしますか？\n保存後、一覧・関連ページ・サイトマップの更新を要求します。公開画面への反映は別途ご確認ください。`)) {
      return;
    }
    setBusy(p.id);
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      await updateBukken(p.id, { status: "closed", infoUpdatedAt: todayStr }, p.updatedAt);
      await revalidateBukken(p.slug);
      setProperties((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, status: "closed" } : x)),
      );
    } catch (err) {
      console.error("Failed to close:", err);
      // A failed cache refresh can follow a successful save. Keep that message and reread
      // the saved state on failures (including CAS/network uncertainty), never resend here.
      alert(err instanceof Error ? err.message : "成約処理に失敗しました");
      await fetchProperties();
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

  const maintenance = propertyMaintenanceQueue(properties, new Date());
  const maintenanceById = new Map(maintenance.map((item) => [item.id, item]));
  const propertiesById = new Map(properties.map((property) => [property.id, property]));
  const displayed = maintenanceOnly
    ? maintenance.flatMap(({ id }) => {
        const item = propertiesById.get(id);
        return item ? [item] : [];
      })
    : properties;

  return (
    <div className="p-6">
      {!loading && !error && (statusFilter === "all" || statusFilter === "published") && (
        <section aria-label="掲載の再確認" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <AlertTriangle size={16} aria-hidden="true" />
            掲載の再確認：{maintenance.length}件
          </p>
          <p className="mt-2 text-xs text-amber-900">
            期限の到来は募集終了を意味しません。最新の募集状況・広告可否を確認し、終了を確認したものだけ公開を止めます。
            賃貸の再確認・新着取込・確認済みの公開停止は
            <Link href="/admin/bukken/import" className="underline">賃貸取込・掲載確認</Link>
            へ。ATBB側の掲載状態は別に照合してください。
          </p>
          <button type="button" aria-pressed={maintenanceOnly}
            onClick={() => setMaintenanceOnly((value) => !value)}
            className="mt-3 rounded border border-amber-500 px-3 py-1.5 text-xs font-semibold text-amber-900">
            要確認の物件だけ表示
          </button>
        </section>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/admin/bukken/school-rentals" className="rounded border px-3 py-2 text-sm text-primary">学区別の募集一覧</Link>
        <Link href="/admin/bukken/rental-survey" className="rounded border px-3 py-2 text-sm text-primary">ペット調査</Link>
        <div className="flex gap-1 rounded-lg bg-surface-dim p-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setMaintenanceOnly(false); setStatusFilter(s); }}
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
        <Link href="/admin/bukken/import" className="ml-auto rounded-lg border border-border px-4 py-2 text-sm text-primary">賃貸取込・掲載確認</Link>
        <Link
          href="/admin/bukken/new"
          className="relative overflow-hidden rounded-lg px-5 py-2 text-sm font-semibold text-text transition-all duration-200"
        >
          <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
          <span className="relative">新規登録</span>
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <p className="mb-3 text-xs text-text-muted">
        {loading ? " " : `${displayed.length}件の物件`}
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
            ) : displayed.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-text-muted">
                  {maintenanceOnly ? "再確認を要する物件はありません" : "物件がありません"}
                </td>
              </tr>
            ) : (
              displayed.map((p) => (
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
                    {maintenanceById.get(p.id)?.reasons.map((reason) => (
                      <span key={reason} className="ml-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        {maintenanceLabels[reason]}
                      </span>
                    ))}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-text-muted">
                    <div>{p.infoUpdatedAt}</div>
                    <div>次回 {p.nextUpdateAt}</div>
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
                    {formatPropertyPrice(p)}
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
