import { cloneElement, createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/**
 * /group-home/ooya（グループホーム向け物件・大家募集ページ）の番人（2026-09-24 新設）。
 *
 * 守るもの：
 *   1. 指示書 v1.0 の完成条件＝直答ブロック（.gh-owner-answer）・「誰に相談」節（.gh-owner-who）・専用フォーム（#form）・
 *      CTA③のお問い合わせボタンがページ内フォームへ向くこと。
 *   2. FAQPage の設問・回答が表示と同一配列から出ていること（10問・文言一致）。
 *   3. JSON-LD に WebPage（dateModified＝可視の最終更新日）・Service（#service・serviceType）・BreadcrumbList・FAQPage が揃うこと。
 *   4. 分離受任の判定語と紹介料不受領の一文があり、禁止語（一体提供・誇大・煽り・経歴の定型句）が本文に無いこと。
 *   5. ja のみ公開＝canonical は ja、hreflang は ja と x-default だけ（sitemap-static-locales.test.ts と同じ前提）。
 */
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => "ja" }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
// CtaBand は本体を描かず、受け取った contactHref だけを残す（CTA③が #form に向くことの検査用）
vi.mock("@/components/shared/CtaBand", () => ({
  CtaBand: (p: { contactHref?: string }) => createElement("div", { "data-cta-contact": p.contactHref ?? "" }),
}));

import Page, { generateMetadata } from "@/app/[locale]/(realestate)/group-home/ooya/page";

/** 非同期のサーバー部品（シェル・パンくず）を解決してから静的描画する（gh-v10-pages.test.ts と同じ型） */
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

async function render(): Promise<string> {
  return renderToStaticMarkup(await resolveServerComponents(await Page()));
}

function jsonLdBlocks(html: string): Record<string, unknown>[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]) as Record<string, unknown>,
  );
}

const BANNED =
  /ワンストップ|一括サポート|一気通貫|まとめて解決|シームレス|街の不動産屋|記者歴34年|中国総局長として|駐在|高収益|高利回り|必ず借り|必ず貸せ|長期安定|安定収入|満室保証|最短[0-9０-９]+日|業界No|お困りではありませんか|助成金診断/;

describe("/group-home/ooya 大家募集ページ", () => {
  it("12要素の骨格（直答・誰に相談・専用フォーム・CTA③→#form）と分離受任の明示がある", async () => {
    const html = await render();
    expect(html).toContain("戸建て・空き家・アパートを、グループホーム向けに貸しませんか——物件をお持ちの大家さんの相談窓口");
    expect(html).toMatch(/class="gh-owner-answer">四葉不動産は、障害福祉グループホーム（共同生活援助）/);
    expect(html).toContain('class="gh-owner-who"');
    expect(html).toContain('id="form"');
    expect(html).toContain('data-cta-contact="#form"');
    expect(html).toContain("独立した事業体");
    expect(html).toContain("別々にご契約");
    expect(html).toContain("当社は紹介料を受け取りません");
    expect(html).toContain("最終更新：2026年9月24日");
    // 深掘り先・お客様の声・執筆者は相対パス
    for (const href of [
      "/column/kodate-akiya-group-home-ni-kasu",
      "/legal/column/group-home-shobo-setsubi-sprinkler",
      "/voices#realestate-2",
      "/voices#realestate-6",
      "/about/uramatsu",
      "/contact?intent=gh-owner",
    ]) {
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).not.toMatch(/href="https:\/\/luck428\.com/);
  });

  it("禁止語を含まず、宅建業法第34条の2（売買・交換の媒介契約書面）を引用しない", async () => {
    const html = await render();
    expect(html).not.toMatch(BANNED);
    expect(html).not.toContain("第34条の2");
    // 「区分4以上」は政令本文に無い（総務省令に委任）ため書かない
    expect(html).not.toMatch(/区分[4４]以上/);
  });

  it("JSON-LD：FAQPage（10問・表示と同文）／WebPage（dateModified・speakable）／Service（#service）／BreadcrumbList", async () => {
    const html = await render();
    const blocks = jsonLdBlocks(html);
    const types = blocks.flatMap((b) => {
      const graph = b["@graph"] as Record<string, unknown>[] | undefined;
      return graph ? graph.map((g) => g["@type"]) : [b["@type"]];
    });
    expect(types).toEqual(expect.arrayContaining(["FAQPage", "WebPage", "Service", "BreadcrumbList"]));

    const faq = blocks.find((b) => b["@type"] === "FAQPage") as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(faq.mainEntity).toHaveLength(10);
    expect(faq.mainEntity[0].name).toBe("グループホームに貸す場合、通常の賃貸と何が違いますか。");
    expect(faq.mainEntity[9].name).toBe("相談や物件の登録に費用はかかりますか。");
    for (const q of faq.mainEntity) {
      expect(html).toContain(q.name);
      expect(html).toContain(q.acceptedAnswer.text);
    }

    const webpage = blocks.find((b) => b["@type"] === "WebPage") as {
      "@id": string;
      dateModified: string;
      inLanguage: string;
      speakable: { cssSelector: string[] };
      publisher: { "@id": string };
    };
    expect(webpage["@id"]).toBe("https://luck428.com/group-home/ooya#webpage");
    expect(webpage.dateModified).toBe("2026-09-24");
    expect(webpage.inLanguage).toBe("ja");
    expect(webpage.speakable.cssSelector).toEqual([".gh-owner-answer", ".gh-owner-who"]);
    expect(webpage.publisher["@id"]).toBe("https://luck428.com/#organization");

    const service = blocks
      .flatMap((b) => (b["@graph"] as Record<string, unknown>[] | undefined) ?? [])
      .find((g) => g["@type"] === "Service") as {
      "@id": string;
      serviceType: string;
      areaServed: string;
      provider: { "@id": string };
      offers: { "@type": string; description: string; price?: string };
      url: string;
    };
    expect(service["@id"]).toBe("https://luck428.com/group-home/ooya#service");
    expect(service.url).toBe("https://luck428.com/group-home/ooya");
    expect(service.provider["@id"]).toBe("https://luck428.com/#organization");
    expect(service.areaServed).toBe("東京都文京区を中心とする東京23区");
    expect(service.serviceType).toContain("貸主側の媒介");
    // Offer は既存の makesOffer と同じく価格を書かない（相談無料は description で示す）
    expect(service.offers["@type"]).toBe("Offer");
    expect(service.offers.description).toContain("無料");
    expect(service.offers.price).toBeUndefined();

    const crumbs = blocks.find((b) => b["@type"] === "BreadcrumbList") as { itemListElement: { name: string }[] };
    expect(crumbs.itemListElement.map((c) => c.name)).toEqual(["ホーム", "グループホーム開設", "大家募集"]);
  });

  it("ja のみ公開：canonical は ja・hreflang は ja と x-default だけ・title は固定文言", async () => {
    const md = await generateMetadata();
    expect(md.alternates?.canonical).toBe("https://luck428.com/group-home/ooya");
    expect(Object.keys(md.alternates?.languages ?? {}).sort()).toEqual(["ja", "x-default"]);
    expect(md.title).toEqual({
      absolute:
        "グループホーム向けに貸したい大家さんへ｜戸建て・空き家・アパートの物件募集（文京区・東京23区） | 四葉不動産",
    });
    expect(typeof md.description).toBe("string");
    expect((md.description as string).length).toBeGreaterThanOrEqual(110);
    expect((md.description as string).length).toBeLessThanOrEqual(125);
  });
});
