"use client";

import { useState } from "react";
import { SR_OFFICE_NAME } from "@/lib/shared/sr-name";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthGuard from "./AuthGuard";
import {
  LayoutDashboard,
  FileText,
  Languages,
  Sparkles,
  LogOut,
  Menu,
  ExternalLink,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

const navItems = [
  {
    href: "/admin",
    label: "ダッシュボード",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/admin/columns", label: "コラム管理", icon: FileText },
  { href: "/admin/translations", label: "翻訳管理", icon: Languages },
  { href: "/admin/ai-settings", label: "AIモデル管理", icon: Sparkles },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-surface-dim">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-surface border-r border-border transition-all duration-200 lg:static lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } ${collapsed ? "lg:w-16" : "lg:w-60"} w-60`}
        >
          {/* Logo area */}
          <div className="flex h-14 items-center justify-center border-b border-border px-3">
            <Link href="/admin" className="flex items-center overflow-hidden">
              <div className="flex shrink-0 items-center gap-3">
                <Image
                  src="/yotsuba/realestate-square.png"
                  alt="四葉不動産"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full"
                />
                <Image
                  src="/yotsuba/legal-square.png"
                  alt="四葉行政書士事務所"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full"
                />
                <Image
                  src="/yotsuba/labor-square.png"
                  alt={SR_OFFICE_NAME}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full"
                />
              </div>
            </Link>
          </div>
          <div className="h-px gradient-line" />

          {/* Nav */}
          <nav className="flex-1 space-y-0.5 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={`relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    collapsed ? "justify-center" : ""
                  } ${
                    active
                      ? "text-text"
                      : "text-text-muted hover:bg-surface-dim hover:text-text"
                  }`}
                >
                  {active && (
                    <span
                      className="pointer-events-none absolute inset-0 rounded-lg gradient-btn"
                      aria-hidden="true"
                    />
                  )}
                  <Icon
                    size={16}
                    className={`relative shrink-0 ${active ? "text-text" : "text-text-muted"}`}
                  />
                  {!collapsed && (
                    <span
                      className={`relative ${active ? "font-semibold" : ""}`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-2 space-y-0.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title={collapsed ? "サイトを表示" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-text-muted transition-colors hover:bg-surface-dim hover:text-text ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <ExternalLink size={14} className="shrink-0" />
              {!collapsed && <span>サイトを表示</span>}
            </a>
            <button
              onClick={handleSignOut}
              title={collapsed ? "サインアウト" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-text-muted transition-colors hover:bg-surface-dim hover:text-red-500 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <LogOut size={14} className="shrink-0" />
              {!collapsed && <span>サインアウト</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header className="flex h-14 items-center gap-2 border-b border-border bg-surface px-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-text-muted hover:bg-surface-dim lg:hidden"
            >
              <Menu size={18} />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden rounded-lg p-2 text-text-muted hover:bg-surface-dim lg:flex"
              title={collapsed ? "サイドバーを展開" : "サイドバーを折りたたむ"}
            >
              {collapsed ? (
                <PanelLeft size={16} />
              ) : (
                <PanelLeftClose size={16} />
              )}
            </button>
            <p className="text-sm font-medium text-text">
              {navItems.find((item) => isActive(item.href, item.exact))
                ?.label ?? ""}
            </p>
          </header>
          <div className="h-px gradient-line" />

          <main className="flex-1 overflow-y-auto bg-surface-dim">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
