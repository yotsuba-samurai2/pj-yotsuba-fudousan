"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "./AdminLayout";

/**
 * Switches between the full admin layout (with sidebar + auth guard)
 * and a plain passthrough for the login page.
 */
export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page should NOT be wrapped in AdminLayout/AuthGuard
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
