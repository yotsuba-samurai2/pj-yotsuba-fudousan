"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, ExternalLink, Globe } from "lucide-react";
import {
  getColumns,
  updateColumn,
  type FirestoreColumn,
  type ColumnStatus,
} from "@/lib/firestore/columns";

const businessLabels: Record<string, string> = {
  realestate: "不動産",
  legal: "行政書士",
  labor: "社労士",
};

const businessColors: Record<string, string> = {
  realestate: "bg-primary/10 text-primary",
  legal: "bg-accent/20 text-accent-dark",
  labor: "bg-secondary/20 text-text",
};

const statusLabels: Record<ColumnStatus, string> = {
  draft: "下書き",
  published: "公開",
  deleted: "削除",
};

const statusColors: Record<ColumnStatus, string> = {
  draft: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  deleted: "bg-red-100 text-red-500",
};

const previewPaths: Record<string, (slug: string) => string> = {
  realestate: (slug) => `/column/${slug}`,
  legal: (slug) => `/legal/column/${slug}`,
  labor: (slug) => `/labor/column/${slug}`,
};

const businesses = ["all", "realestate", "legal", "labor"] as const;
const statuses = ["all", "draft", "published", "deleted"] as const;

const langKeys = ["en", "zh-tw", "zh"] as const;

function hasTranslation(col: FirestoreColumn, lang: string): boolean {
  const t =
    col.translations?.[
      lang as keyof NonNullable<FirestoreColumn["translations"]>
    ];
  return !!t?.title;
}

export default function ColumnsListPage() {
  const [columns, setColumns] = useState<FirestoreColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchColumns = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getColumns(
        filter === "all" ? undefined : filter,
        statusFilter === "all" ? undefined : (statusFilter as ColumnStatus),
      );
      setColumns(data);
    } catch (err) {
      console.error("Failed to fetch columns:", err);
      setError("コラムの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColumns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, statusFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`「${title}」を削除ステータスに変更しますか？`)) return;
    setDeleting(id);
    try {
      await updateColumn(id, { status: "deleted" });
      setColumns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "deleted" } : c)),
      );
    } catch (err) {
      console.error("Failed to soft-delete:", err);
      alert("削除に失敗しました");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6">
      {/* Filter tabs + New */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg bg-surface-dim p-1">
          {businesses.map((b) => (
            <button
              key={b}
              onClick={() => setFilter(b)}
              className={`relative overflow-hidden rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                filter === b ? "text-text" : "text-text-muted hover:text-text"
              }`}
            >
              {filter === b && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-md gradient-btn"
                  aria-hidden="true"
                />
              )}
              <span className="relative">
                {b === "all" ? "すべて" : businessLabels[b]}
              </span>
            </button>
          ))}
        </div>
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
              {s === "all" ? "全ステータス" : statusLabels[s as ColumnStatus]}
            </button>
          ))}
        </div>
        <Link
          href="/admin/columns/new"
          className="relative ml-auto overflow-hidden rounded-lg px-5 py-2 text-sm font-semibold text-text transition-all duration-200"
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-lg gradient-btn"
            aria-hidden="true"
          />
          <span className="relative">新規作成</span>
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Count */}
      <p className="mb-3 text-xs text-text-muted">
        {loading ? "\u00A0" : `${columns.length}件のコラム`}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-dim">
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">
                ステータス
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">
                日付
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">
                事業
              </th>
              <th className="px-4 py-3 text-xs font-medium text-text-muted">
                タイトル
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">
                カテゴリ
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">
                <Globe size={14} className="-mt-0.5 mr-1 inline" />
                翻訳
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-medium text-text-muted">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </td>
              </tr>
            ) : columns.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm text-text-muted"
                >
                  コラムがありません
                </td>
              </tr>
            ) : (
              columns.map((col) => {
                const colStatus = col.status ?? "draft";
                return (
                  <tr
                    key={col.id}
                    className={`border-b border-border last:border-b-0 transition-colors hover:bg-surface-dim/50 ${
                      colStatus === "deleted" ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusColors[colStatus]}`}
                      >
                        {statusLabels[colStatus]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-text-muted">
                      {col.date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                          businessColors[col.business] ??
                          "bg-surface-dim text-text-muted"
                        }`}
                      >
                        {businessLabels[col.business] ?? col.business}
                      </span>
                    </td>
                    <td className="max-w-sm px-4 py-3">
                      <p className="truncate text-sm font-medium text-text">
                        {col.title}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-text-muted">
                        /{col.slug}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-text-muted">
                      {col.category}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {langKeys.map((lang) => (
                          <span
                            key={lang}
                            className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              hasTranslation(col, lang)
                                ? "bg-primary/10 text-primary"
                                : "bg-surface-dim text-text-muted/40"
                            }`}
                          >
                            {lang === "zh-tw"
                              ? "繁"
                              : lang === "zh"
                                ? "简"
                                : lang}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/columns/${col.id}/edit`}
                          className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-dim hover:text-primary"
                          title="編集"
                        >
                          <Pencil size={14} />
                        </Link>
                        <a
                          href={previewPaths[col.business]?.(col.slug) ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-dim hover:text-primary"
                          title="プレビュー"
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => handleDelete(col.id, col.title)}
                          disabled={deleting === col.id}
                          className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                          title="削除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
