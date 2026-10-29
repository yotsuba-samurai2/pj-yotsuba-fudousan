// フッターの提携バナー（いい相続・カスタマープラス）の表示条件を固定する（2026-10-29）。
// どちらも「legal テナント／ja／パスが /legal トップ本体」の3条件すべてで出し、
// それ以外（他テナント・他ロケール・legal 配下の下層ページ）には出さない。
// フッターは共通部品なので、条件が外れると legal 配下の全ページや他事業体のフッターに
// 外部サイトへの出口が出てしまう（業法分離・浦松指示 2026-08-07／2026-10-29）。
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { LangCode } from "@/config/languages";

const state = vi.hoisted(() => ({ locale: "ja" as LangCode, pathname: "/legal" }));
vi.mock("@/contexts/LanguageContext", () => ({ useLanguage: () => ({ locale: state.locale }) }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
vi.mock("@/components/shared/MobileStickyBar", () => ({ MobileStickyBar: () => null }));
vi.mock("@/components/shared/LinkaFab", () => ({ LinkaFab: () => null }));

const CUSTOMER_PLUS_HREF = 'href="https://www.ginza-plus.net/others/ng-registration/"';
const CUSTOMER_PLUS_IMG = "https://www.hitodeki.com/campaign/img/200_147_cplus202205.png";
const I_SOZOKU_HREF = 'href="https://www.i-sozoku.com/detail/oid1000790/"';

describe("footer partner banners (いい相続・カスタマープラス)", () => {
  let Layout: typeof import("@/components/layout/TenantLayout").TenantLayoutShell;
  let Provider: typeof import("@/contexts/TranslationContext").TranslationProvider;
  let prepare: typeof import("@/lib/client-translations").prepareClientTranslations;
  beforeAll(async () => {
    vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED", "true");
    vi.resetModules();
    Layout = (await import("@/components/layout/TenantLayout")).TenantLayoutShell;
    Provider = (await import("@/contexts/TranslationContext")).TranslationProvider;
    prepare = (await import("@/lib/client-translations")).prepareClientTranslations;
  });
  afterAll(() => vi.unstubAllEnvs());

  async function renderFooter(businessKey: "realestate" | "legal" | "labor", locale: LangCode, pathname: string) {
    state.locale = locale;
    state.pathname = pathname;
    const initialData = await prepare(locale, async () => ({}), true);
    const html = renderToStaticMarkup(
      createElement(Provider, {
        initialData,
        children: createElement(Layout, { businessKey, columnLocales: {}, children: null }),
      }),
    );
    return html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? "";
  }

  it("/legal トップ（ja）にだけ両方のバナーが出る", async () => {
    const footer = await renderFooter("legal", "ja", "/legal");
    expect(footer).toContain(I_SOZOKU_HREF);
    expect(footer).toContain(CUSTOMER_PLUS_HREF);
    expect(footer).toContain(CUSTOMER_PLUS_IMG);
    expect(footer).toContain("業務提携先：株式会社カスタマープラス");
    // 外部リンクの属性：別タブ・noopener のみ（nofollow／noreferrer は付けない＝相互リンクの趣旨）
    const anchor = footer.match(/<a[^>]*ginza-plus\.net[^>]*>/)?.[0] ?? "";
    expect(anchor).toContain('target="_blank"');
    expect(anchor).toContain('rel="noopener"');
    expect(anchor).not.toContain("nofollow");
    expect(anchor).not.toContain("noreferrer");
    // 画像は実寸を宣言（レイアウトシフト防止）
    const img = footer.match(/<img[^>]*cplus202205[^>]*>/)?.[0] ?? "";
    expect(img).toContain('width="200"');
    expect(img).toContain('height="191"');
    expect(img).toContain('loading="lazy"');
  });

  it.each([
    ["legal の下層ページ", "legal", "ja", "/legal/services/subsidy"],
    ["legal の英語トップ", "legal", "en", "/legal"],
    ["legal の繁体字トップ", "legal", "zh-tw", "/legal"],
    ["不動産トップ", "realestate", "ja", "/"],
    ["社労士トップ", "labor", "ja", "/labor"],
  ] as const)("%s には出ない", async (_label, businessKey, locale, pathname) => {
    const footer = await renderFooter(businessKey, locale, pathname);
    expect(footer).not.toContain("ginza-plus.net");
    expect(footer).not.toContain("hitodeki.com");
    expect(footer).not.toContain("i-sozoku.com/detail");
  });
});
