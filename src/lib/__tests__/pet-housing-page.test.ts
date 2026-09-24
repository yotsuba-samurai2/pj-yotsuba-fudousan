// ペット横断 指示書 版2.0 第10・13・15〜17章・受入テスト T12・T18・T27：/pet-housing と掲載先（公開フラグの on／off 両方）
import { cloneElement, createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LangCode } from "@/config/languages";
import type { PublicSurveySummary } from "@/lib/rental-survey/summary";

const state = vi.hoisted(() => ({ locale: "ja" as LangCode, summary: { state: "hidden" } as PublicSurveySummary }));
const survey = vi.hoisted(() => ({ getPublicSurveySummary: vi.fn(async () => state.summary) }));
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => state.locale }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/pet-housing",
}));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ host: "luck428.com" }) }));
// CtaBand は本体を描かず、受け取った contactHref だけを残す（最後のCTAがページ内のフォームへ向くことの検査用）
vi.mock("@/components/shared/CtaBand", () => ({
  CtaBand: (p: { contactHref?: string }) => createElement("div", { "data-cta-contact": p.contactHref ?? "" }),
}));
vi.mock("@/components/bukken/CurrentPropertyListings", () => ({ CurrentPropertyListings: () => null }));
vi.mock("@/lib/rental-survey/store", () => survey);
vi.mock("@/lib/columns", () => ({
  getAllColumnsAllLocales: async () => [],
  getAllLegalColumnsAllLocales: async () => [],
  getAllLaborColumnsAllLocales: async () => [],
}));
vi.mock("@/lib/properties", () => ({ getAllPublishedPropertiesAllLocales: async () => [] }));

const PAGE = "@/app/[locale]/(realestate)/pet-housing/page";
const URL_JA = "https://luck428.com/pet-housing";

/** 公開フラグを切り替えてから読み直す（NEXT_PUBLIC_ はビルド時に埋め込まれるため、モジュールの読み込み時に決まる） */
async function withFlag<T>(published: boolean, load: () => Promise<T>): Promise<T> {
  vi.stubEnv("NEXT_PUBLIC_PET_HOUSING_PUBLISHED", published ? "true" : "false");
  vi.resetModules();
  return load();
}
const loadPage = (published = true) => withFlag(published, () => import(/* @vite-ignore */ PAGE));

/** 非同期のサーバー部品（シェル・パンくず）を解決してから静的描画する（gh-owner-page.test.ts と同じ型） */
async function resolveServerComponents(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) return Promise.all(node.map(resolveServerComponents));
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<{ children?: ReactNode }>;
  if (typeof element.type === "function" && element.type.constructor.name === "AsyncFunction") {
    const Component = element.type as (props: unknown) => Promise<ReactNode>;
    return resolveServerComponents(await Component(element.props));
  }
  if (element.props.children === undefined) return element;
  return cloneElement(element, {}, await resolveServerComponents(element.props.children));
}
async function renderPage(): Promise<string> {
  const { default: Page } = await loadPage(true);
  return renderToStaticMarkup(await resolveServerComponents(await Page()));
}
function jsonLdBlocks(html: string): Record<string, unknown>[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]) as Record<string, unknown>);
}
/** タグを除いた可視テキスト（JSON-LD の中身は除く） */
const visibleText = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, "");

// 入居・飼育を約束する語（指示書 第13章）、煽り（第10章）、一体提供（shigyo-compliance-gate 第2条の2）、経歴の定型句（luck428-column-seo 第9条）
const BANNED =
  /必ず|保証|リスクゼロ|確実に|提携|ワンストップ|一気通貫|一括対応|シームレス|水面下|未公開物件|満室|高利回り|記者歴|駐在|街の不動産屋|業界No|お困りではありませんか|平均2倍/;

beforeEach(() => {
  state.locale = "ja";
  state.summary = { state: "hidden" };
  survey.getPublicSurveySummary.mockClear();
});
afterEach(() => vi.unstubAllEnvs());

describe("/pet-housing（公開フラグ on・日本語）", () => {
  it("入口は借り手と大家を分け、指示書 第10章の順に節があり、フォームと最後のCTAがページ内で完結する", async () => {
    const html = await renderPage();
    const text = visibleText(html);
    expect(html).toContain("多頭飼い・大型犬と暮らせる住まい探し——借りたい・買いたい方と、貸したい大家さんの相談窓口");
    expect(html).toMatch(/class="pet-housing-answer">四葉不動産は、猫3匹以上の多頭飼いや大型犬と暮らせる住まい探し/);
    // FV の入口（借り手／大家）→ 理由と対応範囲 → 借り手向け → 流れ → 大家向け → 論点 → 手順 → FAQ → フォーム → 会社 → 根拠
    const order = [
      "多頭飼いできる家を探す",
      "ペット飼育者に貸せるか相談する",
      "なぜ見つかりにくいのですか",
      "対応範囲（誰が何をするか）",
      "借りたい・買いたい方のために、四葉は何をしますか",
      "借り手と大家さんのあいだで、四葉は何をつなぎますか",
      "大家さん：ペット飼育者に貸すか決める前でも、相談できますか",
      "契約の前に何を決めておきますか",
      "相談してから契約まで、どんな手順で進みますか",
      "よくある質問",
      'id="renter-form"',
      'id="owner-form"',
      "四葉不動産株式会社について",
      "この記事の根拠",
    ];
    const positions = order.map((s) => html.indexOf(s));
    positions.forEach((p, i) => expect(p, order[i]).toBeGreaterThan(-1));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(html).toContain('href="#renter-form"');
    expect(html).toContain('href="#owner-form"');
    expect(html).toContain('id="pet-forms"');
    expect(html).toContain('data-cta-contact="#pet-forms"');
    expect(text).toContain("まだペット可にすると決めていなくても構いません");
    expect(text).toContain("最終更新：2026年9月24日");
    expect(text).toContain("宅地建物取引業 東京都知事(1)第113304号");
  });

  it("分離受任・紹介料なし・判断の留保を明示し、入居や飼育を約束する語を使わない", async () => {
    const text = visibleText(await renderPage());
    expect(text).toContain("独立した事業体");
    expect(text).toContain("別々にご契約");
    expect(text).toContain("当社は紹介料を受け取りません");
    expect(text).toContain("本ページは一般的な情報提供であり、個別の法的判断は資格者による確認を要します");
    expect(text).toContain("当社が入居や飼育をお約束することはできません");
    // 「ペット相談」を複数飼育可・大型犬可と読ませない（指示書 第6章の区別）
    expect(text).toContain("「ペット相談」は、複数の動物や大型犬を認めるという意味ではない");
    // 自動の新着配信は運用していない（第12章）
    expect(text).toContain("新着の物件を自動でお送りする仕組みはなく");
    expect(text).not.toMatch(BANNED);
  });

  it("リンクは相対パスだけで、未公開の渡航手続LPや翻訳の無いURLへはリンクしない（T18）", async () => {
    const html = await renderPage();
    const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThan(5);
    expect(hrefs.filter((h) => h.startsWith("https://luck428.com"))).toEqual([]);
    expect(hrefs.some((h) => h.includes("pet-travel"))).toBe(false);
    expect(hrefs.some((h) => /^\/(en|zh-tw|zh)(\/|$)/.test(h))).toBe(false);
    for (const href of ["/column/chintaishaku-keiyakusho-doko-wo-yomu", "/ryokin", "/about/uramatsu", "/gakku"]) expect(hrefs).toContain(href);
  });

  it("JSON-LD：FAQPage（表示と同文）・WebPage（dateModified＝可視の最終更新）・Service・BreadcrumbList", async () => {
    const html = await renderPage();
    const text = visibleText(html);
    const blocks = jsonLdBlocks(html);
    const types = blocks.flatMap((b) => ((b["@graph"] as Record<string, unknown>[] | undefined) ?? [b]).map((g) => g["@type"]));
    expect(types).toEqual(expect.arrayContaining(["FAQPage", "WebPage", "Service", "BreadcrumbList"]));

    const faq = blocks.find((b) => b["@type"] === "FAQPage") as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(faq.mainEntity).toHaveLength(10);
    for (const q of faq.mainEntity) {
      expect(text).toContain(q.name);
      expect(text).toContain(q.acceptedAnswer.text);
      expect(q.acceptedAnswer.text).not.toMatch(BANNED);
    }

    const { PET_HOUSING_LAST_UPDATED_ISO, PET_HOUSING_LAST_UPDATED_JA } = await import("@/lib/pet-housing");
    const [y, m, d] = PET_HOUSING_LAST_UPDATED_ISO.split("-").map(Number);
    expect(PET_HOUSING_LAST_UPDATED_JA).toBe(`${y}年${m}月${d}日`);
    const webpage = blocks.find((b) => b["@type"] === "WebPage") as {
      "@id": string; dateModified: string; inLanguage: string; speakable: { cssSelector: string[] };
    };
    expect(webpage["@id"]).toBe(`${URL_JA}#webpage`);
    expect(webpage.dateModified).toBe(PET_HOUSING_LAST_UPDATED_ISO);
    expect(webpage.inLanguage).toBe("ja");
    for (const selector of webpage.speakable.cssSelector) expect(html).toContain(`class="${selector.slice(1)}`);

    const service = blocks.flatMap((b) => (b["@graph"] as Record<string, unknown>[] | undefined) ?? []).find((g) => g["@type"] === "Service") as {
      "@id": string; url: string; provider: { "@id": string }; areaServed: string; offers: { description: string; price?: unknown };
    };
    expect(service["@id"]).toBe(`${URL_JA}#service`);
    expect(service.url).toBe(URL_JA);
    expect(service.provider["@id"]).toBe("https://luck428.com/#organization");
    expect(service.areaServed).toBe("東京都文京区を中心とする東京23区");
    expect(service.offers.description).toContain("無料");
    expect(service.offers.price).toBeUndefined();

    const crumbs = blocks.find((b) => b["@type"] === "BreadcrumbList") as { itemListElement: { name: string }[] };
    expect(crumbs.itemListElement.map((c) => c.name)).toEqual(["ホーム", "サービス", "多頭飼い・大型犬の住まい探し"]);
  });

  it("metadata：canonical は日本語版、hreflang は ja と x-default だけ（翻訳の無い言語を出さない）", async () => {
    const { generateMetadata } = await loadPage(true);
    const md = await generateMetadata();
    expect(md.alternates?.canonical).toBe(URL_JA);
    expect(Object.keys(md.alternates?.languages ?? {}).sort()).toEqual(["ja", "x-default"]);
    expect(md.title).toMatchObject({ absolute: expect.stringContaining("多頭飼い・大型犬と暮らせる住まい探し") });
  });

  it("調査の件数枠：既定（公開の許可なし）では何も出さない（T12）", async () => {
    const html = await renderPage();
    expect(survey.getPublicSurveySummary).toHaveBeenCalledWith("bunkyo-rent-pet", "ja");
    expect(html).not.toContain("今回の調査で確認した対象物件");
  });

  it("調査の件数枠：公開用の集計が shown のときだけ、条件と注記つきで出す（配線の確認）", async () => {
    state.summary = {
      state: "shown", conditionsKey: "bunkyo-rent-pet-v1",
      observedFrom: "2026-09-01T00:00:00+09:00", observedTo: "2026-09-07T00:00:00+09:00", finalizedAt: "2026-09-08T09:00:00+09:00",
      sourceKind: "multiple", attribution: null, x: 12, breakdown: null,
    };
    const text = visibleText(await renderPage());
    expect(text).toContain("今回の調査で確認した対象物件");
    expect(text).toContain("2頭以上の飼育が可・相談可");
    expect(text).toContain("無条件の入居を保証するものではありません");
  });
});

describe("公開前・翻訳の無い言語は 404（T18）", () => {
  it.each(["en", "zh-tw", "zh"] as const)("フラグ on でも %s は、metadata と本文の両方で 404", async (locale) => {
    state.locale = locale;
    const page = await loadPage(true);
    await expect(page.generateMetadata()).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(page.default()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("フラグ off では日本語も、metadata と本文の両方で 404（本番DBへの受付テーブル作成前に公開しない）", async () => {
    const page = await loadPage(false);
    await expect(page.generateMetadata()).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(page.default()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(survey.getPublicSurveySummary).not.toHaveBeenCalled();
  });
});

describe.each([true, false])("掲載先（公開フラグ %s）", (published) => {
  it("メニュー：on のときだけ /pet-housing を出し、ja 以外では出さない", async () => {
    const { SERVICE_NAV_UTILITY_LINKS, isNavLinkVisible } = await withFlag(published, () => import("@/config/services-nav"));
    const link = SERVICE_NAV_UTILITY_LINKS.find((l) => l.href === "/pet-housing");
    if (!published) return expect(link).toBeUndefined();
    expect(link?.locales).toEqual(["ja"]);
    expect(link?.label.ja).toBe("多頭飼い・大型犬の住まい探し");
    for (const locale of ["en", "zh-tw", "zh"] as const) expect(isNavLinkVisible(link!, locale)).toBe(false);
  });

  it("sitemap：on のときだけ日本語URLを1件（lastmod＝最終更新）。他言語URL・他言語の hreflang は出さない", async () => {
    const { default: sitemap } = await withFlag(published, () => import("@/app/sitemap"));
    const entries = (await sitemap()).filter((e) => new URL(e.url).pathname.endsWith("/pet-housing"));
    if (!published) return expect(entries).toEqual([]);
    expect(entries).toHaveLength(1);
    expect(entries[0].url).toBe(URL_JA);
    expect(entries[0].lastModified).toBe("2026-09-24");
    expect(entries[0].alternates?.languages).toEqual({ ja: URL_JA });
  });

  it("/services：on かつ日本語のときだけ、4領域の下に1行の案内を出す", async () => {
    const render = async (locale: LangCode) => {
      state.locale = locale;
      const { default: Services } = await withFlag(published, () => import("@/app/[locale]/(realestate)/services/page"));
      return renderToStaticMarkup(await resolveServerComponents(await Services()));
    };
    const ja = await render("ja");
    expect(ja.includes('href="/pet-housing"')).toBe(published);
    expect(ja.includes("猫3匹以上の多頭飼育や大型犬と暮らせる住まい探しをサポートします。")).toBe(published);
    expect(await render("en")).not.toContain("pet-housing");
  });

  it("llms.txt：on のときだけ事業の一覧に1行を出す（約束しない・別事業体の注記つき）", async () => {
    const { GET } = await withFlag(published, () => import("@/app/llms.txt/route"));
    const body = await (await GET()).text();
    expect(body.includes("https://luck428.com/pet-housing")).toBe(published);
    if (published) expect(body).toMatch(/入居・飼育は約束しない。犬・猫の日本入国の手続の相談は四葉行政書士事務所が独立した事業体として別契約で受ける/);
    // 前後の空行を崩さない（off のときは変更前と同じ本文）
    expect(body).toMatch(published ? /group-home\/ooya\n- \*\*多頭飼い[^\n]*\/pet-housing\n\n免許：/ : /group-home\/ooya\n\n免許：/);
  });
});

describe("言語切替（T18）", () => {
  it("/pet-housing は日本語だけを切替先にする（404の翻訳URLを出さない）。ほかの固定ページは従来どおり", async () => {
    const { getColumnSwitchLocales } = await import("@/lib/column-language-links");
    const { SUPPORTED_LOCALES } = await import("@/lib/locale");
    for (const path of ["/pet-housing", "/ja/pet-housing", "/pet-housing/", "/en/pet-housing"]) {
      expect(getColumnSwitchLocales(path, {}, "ja"), path).toEqual(["ja"]);
    }
    expect(getColumnSwitchLocales("/group-home/ooya", {}, "ja")).toEqual(SUPPORTED_LOCALES);
    expect(getColumnSwitchLocales("/services", {}, "ja")).toEqual(SUPPORTED_LOCALES);
  });
});
