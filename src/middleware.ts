import { NextRequest, NextResponse } from "next/server";

/**
 * ホスト名ベースのマルチテナントルーティング
 *
 * 各ドメインからのリクエストを内部パスにリライトする。
 * - yotsuba-fudousan.com  /about → /about（そのまま）
 * - yotsuba-legal.com     /about → /legal/about
 * - yotsuba-labor.com     /about → /labor/about
 *
 * 開発時: legal.localhost:3003/about → /legal/about
 */

type TenantConfig = {
  pathPrefix: string;
  domains: string[];
  subdomains: string[];
};

const tenants: TenantConfig[] = [
  {
    pathPrefix: "/legal",
    domains: ["yotsuba-legal.com", "www.yotsuba-legal.com"],
    subdomains: ["legal"],
  },
  {
    pathPrefix: "/labor",
    domains: ["yotsuba-labor.com", "www.yotsuba-labor.com"],
    subdomains: ["labor"],
  },
  // realestate はデフォルト（リライト不要）
];

function getTenantPrefix(host: string): string | null {
  const hostname = host.split(":")[0];

  for (const tenant of tenants) {
    if (tenant.domains.includes(hostname)) return tenant.pathPrefix;
  }

  // localhost開発用: legal.localhost → /legal
  const sub = hostname.split(".")[0];
  for (const tenant of tenants) {
    if (tenant.subdomains.includes(sub)) return tenant.pathPrefix;
  }

  return null; // デフォルト（不動産）: リライトなし
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const prefix = getTenantPrefix(host);

  if (!prefix) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // 既にプレフィクスが付いている場合はリライト不要
  if (pathname.startsWith(prefix)) return NextResponse.next();

  // 静的ファイル・API・_next はスキップ
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 共通ページはリライトしない（全テナント共通）
  const sharedPaths = ["/privacy-policy", "/terms", "/legal-notice"];
  if (sharedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // /about → /legal/about にリライト
  const url = request.nextUrl.clone();
  url.pathname = `${prefix}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
