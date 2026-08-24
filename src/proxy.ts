import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy（旧 middleware）: ロケール検出 → テナントリライト
 *
 * 1. ロケールプレフィックスの検出・ストリップ (/en/services → /services, locale=en)
 * 2. ホスト名ベースのテナントリライト (luck428gyosei.com/about → /legal/about)
 *
 * 2026-07-12：Next.js 16.2 で `middleware` ファイル規約が非推奨になったため
 * `src/middleware.ts` → `src/proxy.ts` へ改名（公式移行＝ファイル名と関数名のみ変更。
 * https://nextjs.org/docs/messages/middleware-to-proxy ）。**ロジックは一切変更していない**。
 * ※本ファイルはロケール判定（x-locale ヘッダー）とテナント振り分けの根幹。
 *   「URLが言語の正」＝接頭辞なしパスは ja とみなしCookieも ja に同期する（末尾コメント参照）。
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
  // TODO: 社労士開業（2026年9月）後に復活
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

// ── Gone (410) ──

// 恒久的に廃止した旧URL（旧WordPress由来）。404のままより 410 Gone の方がGSCからの除外が速い。
// 完全一致のみ（末尾スラッシュは正規化して判定）＝ロケール/テナント判定には一切干渉しない。
const GONE_PATHS = new Set(["/en/comments/feed", "/test1"]);

function isGone(pathname: string): boolean {
  const p =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return GONE_PATHS.has(p);
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

// ── Cookie / Cache ──

/**
 * 公開ページのCDNキャッシュ方針（SEO監査2026-08-24 P0-1）。
 * 本文はURLだけで決まる（locale判定はURL→x-localeリクエストヘッダー経由・Cookie非依存）ため、
 * URL単位のキャッシュは安全。認証・個人化ルート（/api・/admin）は shouldSkip で本関数まで来ない。
 */
const PUBLIC_CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

/**
 * ロケールCookieの同期とキャッシュヘッダー付与（SEO監査2026-08-24 P0-1）。
 *
 * 旧実装は全レスポンスで set-cookie していたが、set-cookie 付きレスポンスは
 * Vercel CDN にキャッシュされず、全公開ページが no-store / 毎回MISSになっていた。
 * - Cookieは「既存Cookieの値がURLロケールとズレたときだけ」set（素のリンクで /zh-tw→/ に
 *   戻った際の同期）。Cookie未所持の初回訪問には付与しない＝クローラー（Cookieを送らない）と
 *   初回アクセスに set-cookie が出ない。実ブラウザの初回Cookie付与は
 *   LanguageContext のクライアント側 effect が担う。
 * - set-cookie が不要なGET/HEADにのみ s-maxage を付与（Cookie設定時はキャッシュさせない）
 */
function withLocaleCookieAndCache(
  request: NextRequest,
  response: NextResponse,
  locale: string,
): NextResponse {
  const current = request.cookies.get(LOCALE_COOKIE)?.value;
  const needsCookie = current !== undefined && current !== locale;

  if (needsCookie) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  } else if (request.method === "GET" || request.method === "HEAD") {
    response.headers.set("Cache-Control", PUBLIC_CACHE_CONTROL);
  }

  return response;
}

// ── Proxy ──

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 恒久廃止URL（旧WordPress）は 410 Gone（ロケール/テナント判定より前に確定させる）
  if (isGone(pathname)) {
    return new NextResponse("Gone", { status: 410 });
  }

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

  // Server Component の headers() から同一リクエスト内で確実にlocaleを読めるよう、
  // レスポンス側（Cookie/ヘッダー）に加えリクエストヘッダーにも転送する
  // （Cookieはブラウザの次回リクエストからしか反映されず、初回アクセス・クローラーでは読めないため）
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  const requestInit = { request: { headers: requestHeaders } };

  if (needsRewrite || locale !== "ja") {
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;

    const response = needsRewrite
      ? NextResponse.rewrite(url, requestInit)
      : NextResponse.next(requestInit);

    // ロケール情報をヘッダーで伝搬（Cookieは値が変わるときだけ＝withLocaleCookieAndCache）
    response.headers.set("x-locale", locale);
    return withLocaleCookieAndCache(request, response, locale);
  }

  // テナントリライトのみ必要な場合
  if (
    tenantPrefix &&
    !stripped.startsWith(tenantPrefix) &&
    !isSharedPath(stripped)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `${tenantPrefix}${stripped}`;
    return withLocaleCookieAndCache(
      request,
      NextResponse.rewrite(url, requestInit),
      locale,
    );
  }

  // ja・リライトなし。Cookieの同期（URLが言語の正）は値がズレたときだけ行う：
  // 素のリンクで /zh-tw/... → /... に戻った際、古いCookieが残ると
  // クライアント側の言語状態がURLとズレるため（一致していれば set-cookie 不要）。
  return withLocaleCookieAndCache(
    request,
    NextResponse.next(requestInit),
    locale,
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
