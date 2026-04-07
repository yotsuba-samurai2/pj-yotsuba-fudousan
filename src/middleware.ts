import { NextRequest, NextResponse } from "next/server";

/**
 * ミドルウェア: ロケール検出 → テナントリライト
 *
 * 1. ロケールプレフィックスの検出・ストリップ (/en/services → /services, locale=en)
 * 2. ホスト名ベースのテナントリライト (luck428gyosei.com/about → /legal/about)
 */

// ── Locale ──

const NON_DEFAULT_LOCALES = ["en", "zh-tw", "zh"];
const LOCALE_COOKIE = "yotsuba-locale";

function detectAndStripLocale(pathname: string): {
  locale: string;
  stripped: string;
} {
  for (const loc of NON_DEFAULT_LOCALES) {
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) {
      const stripped = pathname.slice(loc.length + 1) || "/";
      return { locale: loc, stripped };
    }
  }
  return { locale: "ja", stripped: pathname };
}

// ── Tenant ──

type TenantConfig = {
  pathPrefix: string;
  domains: string[];
  subdomains: string[];
};

const tenants: TenantConfig[] = [
  {
    pathPrefix: "/legal",
    domains: ["luck428gyosei.com", "www.luck428gyosei.com"],
    subdomains: ["legal"],
  },
  // TODO: 社労士法人化後に復活
  // {
  //   pathPrefix: "/labor",
  //   domains: ["yotsuba-labor.com", "www.yotsuba-labor.com"],
  //   subdomains: ["labor"],
  // },
];

function getTenantPrefix(host: string): string | null {
  const hostname = host.split(":")[0];

  for (const tenant of tenants) {
    if (tenant.domains.includes(hostname)) return tenant.pathPrefix;
  }

  const sub = hostname.split(".")[0];
  for (const tenant of tenants) {
    if (tenant.subdomains.includes(sub)) return tenant.pathPrefix;
  }

  return null;
}

// ── Skip patterns ──

function shouldSkip(pathname: string): boolean {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".")
  ) {
    return true;
  }
  return false;
}

const sharedPaths = ["/privacy-policy", "/terms", "/legal-notice"];

function isSharedPath(pathname: string): boolean {
  return sharedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

// ── Middleware ──

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // スキップ（静的ファイル、API、管理画面）
  if (shouldSkip(pathname)) return NextResponse.next();

  // Step 1: ロケール検出・ストリップ
  const { locale, stripped } = detectAndStripLocale(pathname);

  // Step 2: テナント検出
  const host = request.headers.get("host") || "";
  const tenantPrefix = getTenantPrefix(host);

  // リライト先パスを決定
  let rewritePath = stripped;

  if (
    tenantPrefix &&
    !stripped.startsWith(tenantPrefix) &&
    !isSharedPath(stripped)
  ) {
    rewritePath = `${tenantPrefix}${stripped}`;
  }

  // ロケールプレフィックスがあった場合、またはCookie設定が必要な場合
  const needsRewrite = rewritePath !== pathname;

  if (needsRewrite || locale !== "ja") {
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;

    const response = needsRewrite
      ? NextResponse.rewrite(url)
      : NextResponse.next();

    // ロケール情報をCookieとヘッダーで伝搬
    response.headers.set("x-locale", locale);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    return response;
  }

  // テナントリライトのみ必要な場合
  if (
    tenantPrefix &&
    !stripped.startsWith(tenantPrefix) &&
    !isSharedPath(stripped)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `${tenantPrefix}${stripped}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
