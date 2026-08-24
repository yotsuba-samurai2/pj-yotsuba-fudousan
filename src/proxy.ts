import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy（旧 middleware）: ロケール検出 → app/[locale]/ 内部ルートへのリライト
 *
 * 外部URL規約は不変（ja=素パス・/en・/zh-tw・/zh）。ファイルシステム上の実ルートは
 * app/[locale]/... のため、全公開リクエストを /<locale>/<path> へリライトする
 * （SEO監査2026-08-24 P0-1: locale を URL＝静的ルートアドレスに乗せ、公開ページを
 * ISRキャッシュ可能にする根本対応。旧構成の x-locale ヘッダー伝搬は headers() 参照で
 * 全ページを動的化していた）。
 *
 * 1. ロケールプレフィックスの検出・ストリップ (/en/services → services, locale=en)
 * 2. ホスト名ベースのテナントプレフィックス (luck428gyosei.com/about → /legal/about)
 * 3. /<locale> を先頭に付けて内部ルートへ (→ /en/legal/about)
 *
 * /ja/... への直アクセスは素パスへ301（正規URLの重複を作らない）。
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
    pathname.startsWith("/facilitator") || // [locale]外のルート（内部ツール）
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

// ── Cookie sync ──

/**
 * ロケールCookieの同期（SEO監査2026-08-24 P0-1）。
 *
 * Cookieは「既存Cookieの値がURLロケールとズレたときだけ」set（素のリンクで /zh-tw→/ に
 * 戻った際の同期）。Cookie未所持の初回訪問には付与しない＝クローラー（Cookieを送らない）と
 * 初回アクセスに set-cookie が出ない（set-cookie付きレスポンスはCDNキャッシュ不可のため）。
 * 実ブラウザの初回Cookie付与は LanguageContext のクライアント側 effect が担う。
 * キャッシュヘッダーはISR（app/[locale]/layout.tsx の revalidate）がルート側で設定する。
 */
function withLocaleCookieSync(
  request: NextRequest,
  response: NextResponse,
  locale: string,
): NextResponse {
  const current = request.cookies.get(LOCALE_COOKIE)?.value;

  if (current !== undefined && current !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
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

  // スキップ（静的ファイル、API、管理画面、[locale]外ルート）
  if (shouldSkip(pathname)) return NextResponse.next();

  // ja の正規URLは素パス。内部ルート /ja/... への直アクセスは素パスへ恒久移転して
  // 正規URLの重複を作らない（statusCode 301＝next.config.ts の redirects と同じ作法）
  if (pathname === "/ja" || pathname.startsWith("/ja/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 301);
  }

  // Step 1: ロケール検出・ストリップ
  const { locale, stripped } = detectAndStripLocale(pathname);

  // Step 2: テナント検出（共有ページは全テナント共通のためプレフィックスを付けない）
  const host = request.headers.get("host") || "";
  const tenantPrefix = getTenantPrefix(host);

  let basePath = stripped;
  if (
    tenantPrefix &&
    !stripped.startsWith(tenantPrefix) &&
    !isSharedPath(stripped)
  ) {
    basePath = `${tenantPrefix}${stripped}`;
  }

  // Step 3: app/[locale]/ の内部ルートへ（ja 素パス含め常にロケールを先頭に付ける。
  // これにより /xyz 等の非ロケール接頭辞は /ja/xyz → 404 になり、[locale] が
  // 任意文字列にマッチすることはない）
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${basePath === "/" ? "" : basePath}`;

  return withLocaleCookieSync(request, NextResponse.rewrite(url), locale);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
