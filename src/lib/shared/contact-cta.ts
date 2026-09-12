import type { LangCode } from "@/config/languages";
import { addLocalePrefix, stripLocalePrefix } from "@/lib/locale";
import { CONTACT_HREF, type BusinessKey } from "@/lib/shared/office-public";

export type ContactCtaPlacement = "sticky" | "mid_article";
export type ContactCtaAction = "line" | "phone" | "contact";

/** query/hashを計測へ送らず、内部/jaプレフィックスも除く。 */
export function contactBasePath(pathname: string | null): string | null {
  if (!pathname?.startsWith("/") || pathname.startsWith("//")) return null;
  const path = stripLocalePrefix(pathname.split(/[?#]/, 1)[0]);
  return path.replace(/\/+$/, "") || "/";
}

function matchesRoute(path: string, route: string): boolean {
  return path === route || path.startsWith(`${route}/`);
}

const EXCLUDED_ROUTES = [
  "/line", "/contact", "/legal/contact", "/labor/contact",
  "/thanks", "/legal/thanks", "/labor/thanks", "/thank-you",
  "/admin", "/api", "/auth", "/login", "/logout", "/reset-password",
  "/preview", "/booking", "/reserve", "/privacy-policy", "/terms", "/_next",
];

export function contactBusinessFromPath(pathname: string | null): BusinessKey | null {
  const path = contactBasePath(pathname);
  if (path === null || EXCLUDED_ROUTES.some((route) => matchesRoute(path, route))) return null;
  if (matchesRoute(path, "/legal")) return "legal";
  if (matchesRoute(path, "/labor")) return "labor";
  return "realestate";
}

/** 管理画面プレビュー・コラム一覧には中間CTAを出さない。 */
export function columnBusinessFromPath(pathname: string | null): BusinessKey | null {
  const path = contactBasePath(pathname);
  if (!path) return null;
  const match = /^\/(?:(legal|labor)\/)?column\/([^/]+)$/.exec(path);
  if (!match || match[2] === "page") return null;
  return (match[1] as "legal" | "labor" | undefined) ?? "realestate";
}

export function shouldShowContactCta(pathname: string | null, businessKey: BusinessKey): boolean {
  return contactBusinessFromPath(pathname) === businessKey;
}

/** LocaleLinkに渡すURLは接頭辞なし。LINEは既存の/line中継を必ず維持。 */
export function contactCtaHrefs(businessKey: BusinessKey) {
  return { line: "/line", contact: CONTACT_HREF[businessKey] };
}

export function contactEventName(placement: ContactCtaPlacement, action: ContactCtaAction): string {
  return `${placement}_${action}_click`;
}

export function contactEventParams(
  businessKey: BusinessKey,
  locale: LangCode,
  pathname: string | null,
  placement: ContactCtaPlacement,
): Record<string, string> {
  const basePath = contactBasePath(pathname);
  return {
    site_type: businessKey,
    language: locale,
    location: placement,
    // 公開パスのみ。window.location.href / search / hash / 入力内容は禁止。
    page_path: basePath ? addLocalePrefix(basePath, locale) : "",
    content_category: columnBusinessFromPath(pathname) ? "column" : "general",
  };
}
