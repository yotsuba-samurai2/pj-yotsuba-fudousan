"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Languages, ArrowRight } from "lucide-react";
import { getColumns, type FirestoreColumn } from "@/lib/admin-api";

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-text-muted">{title}</p>
          <p className="h-8 text-2xl font-bold leading-8 tracking-tight text-text">{value}</p>
          <p className="h-4 text-xs text-text-muted">{subtitle ?? "\u00A0"}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon size={20} className="text-primary" />
        </div>
      </div>
    </div>
  );
}

const BUSINESS_LABELS: Record<string, string> = {
  realestate: "不動産",
  legal: "行政書士",
  labor: "社労士",
};

export default function AdminDashboard() {
  const [columns, setColumns] = useState<FirestoreColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getColumns()
      .then(setColumns)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recentColumns = [...columns]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const businessCounts = {
    realestate: columns.filter((c) => c.business === "realestate").length,
    legal: columns.filter((c) => c.business === "legal").length,
    labor: columns.filter((c) => c.business === "labor").length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="コラム総数"
          value={loading ? "-" : columns.length}
          icon={FileText}
        />
        <KpiCard
          title="不動産"
          value={loading ? "-" : businessCounts.realestate}
          subtitle="コラム記事"
          icon={FileText}
        />
        <KpiCard
          title="行政書士"
          value={loading ? "-" : businessCounts.legal}
          subtitle="コラム記事"
          icon={FileText}
        />
        <KpiCard
          title="社労士"
          value={loading ? "-" : businessCounts.labor}
          subtitle="コラム記事"
          icon={FileText}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Recent Columns */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold text-text">最近のコラム</h2>
              <Link
                href="/admin/columns"
                className="flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-primary"
              >
                すべて表示 <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {loading ? (
                <div className="px-5 py-8 text-center text-sm text-text-muted">
                  読み込み中...
                </div>
              ) : recentColumns.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-text-muted">
                  コラム記事がありません
                </div>
              ) : (
                recentColumns.map((col) => (
                  <div key={col.id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate text-sm font-medium text-text">{col.title}</p>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span>{col.date}</span>
                        <span className="text-border">|</span>
                        <span>{col.category}</span>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {BUSINESS_LABELS[col.business] ?? col.business}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Links */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold text-text">クイックアクション</h2>
            </div>
            <div className="p-4 space-y-2">
              <Link
                href="/admin/columns/new"
                className="relative overflow-hidden flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-text transition-all"
              >
                <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
                <FileText size={14} className="relative" />
                <span className="relative">コラムを作成</span>
              </Link>
              <Link
                href="/admin/translations"
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-dim"
              >
                <Languages size={14} />
                翻訳を編集
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold text-text">対応言語</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: "ja", label: "日本語" },
                  { code: "en", label: "English" },
                  { code: "zh-tw", label: "繁體中文" },
                  { code: "zh", label: "简体中文" },
                ].map((lang) => (
                  <div
                    key={lang.code}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-center"
                  >
                    <p className="text-xs font-bold text-text">{lang.code}</p>
                    <p className="text-[10px] text-text-muted">{lang.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
