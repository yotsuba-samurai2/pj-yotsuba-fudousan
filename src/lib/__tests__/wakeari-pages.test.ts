// 売りにくい土地・建物の出口相談（/wakeari 配下・2026-09-23）の番人。
// 企画書 v1.0／Cowork 実装指示書 v2.0 の完成条件（第5章の型・第6章の JSON-LD・第7章の内部リンク・第8章の禁止語と必須語）を機械で固定する。
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { LangCode } from "@/config/languages";
import {
  WAKEARI_ANSWER,
  WAKEARI_ANSWER_RESERVATION,
  WAKEARI_CHECKLIST,
  WAKEARI_CHECKLIST_RESERVATION,
  WAKEARI_COLUMN_SLUGS,
  WAKEARI_FAQ,
  WAKEARI_HUB_BY_COLUMN_SLUG,
  WAKEARI_LLMS_COLUMNS,
  WAKEARI_PAGES,
  WAKEARI_PROVIDER_SENTENCE,
  WAKEARI_ROLE_ROWS,
  WAKEARI_SEPARATION_NOTE,
  WAKEARI_TYPE_KEYS,
  type WakeariPageKey,
} from "@/lib/wakeari";
import { CATEGORY_ORDER_BY_BUSINESS, EXTRA_CATEGORY_LABELS } from "@/lib/shared/contact-intake";
import { SERVICE_NAV_CATEGORIES } from "@/config/services-nav";

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), "utf8");
const KEYS = Object.keys(WAKEARI_PAGES) as WakeariPageKey[];
const PAGE_DIRS: Record<WakeariPageKey, string> = {
  hub: "src/app/[locale]/(realestate)/wakeari",
  "saikenchiku-fuka": "src/app/[locale]/(realestate)/wakeari/saikenchiku-fuka",
  kyoyu: "src/app/[locale]/(realestate)/wakeari/kyoyu",
  "shakuchi-sokochi": "src/app/[locale]/(realestate)/wakeari/shakuchi-sokochi",
  kyosho: "src/app/[locale]/(realestate)/wakeari/kyosho",
};
const pageSource = (key: WakeariPageKey) => read(`${PAGE_DIRS[key]}/page.tsx`);

/** 指示書 v2.0 第8章の禁止語（Step 5 の grep と同じ）。コメントも含めてファイル全体を見る */
const FORBIDDEN =
  /ワンストップ|一括サポート|一気通貫|まとめて解決|街の不動産屋|記者歴34年|中国総局長として|駐在|高価買取|最高値|必ず売れ|業界No|お困りではありませんか|最短[0-9０-９]+日|最大[0-9０-９]+億/;

const WAKEARI_FILES = [
  "src/lib/wakeari.ts",
  "src/components/wakeari/WakeariRoleTable.tsx",
  "src/components/wakeari/WakeariSources.tsx",
  "src/components/wakeari/WakeariExitChecklist.tsx",
  "src/components/wakeari/WakeariColumnHubLink.tsx",
  ...KEYS.map((k) => `${PAGE_DIRS[k]}/page.tsx`),
];

describe("固定文言（指示書 v2.0 5-2・5-5）", () => {
  it("事業者主語の一文・分離受任の一文・留保文が一字も変わっていない", () => {
    expect(WAKEARI_PROVIDER_SENTENCE).toBe(
      "四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304号）は、文京区小日向を拠点に、再建築不可・共有・借地・狭小地の土地・建物について、役所調査と出口の比較、売却の媒介を行っています。買取をご希望の場合は、提携する買取業者を買主とする媒介の形で、複数の提示を並べてお示しします。",
    );
    expect(WAKEARI_SEPARATION_NOTE).toBe(
      "四葉不動産株式会社と四葉行政書士事務所は、それぞれ独立した事業体として業務を受任し、別々にご契約いただきます。登記は司法書士、税務は税理士、紛争は弁護士へ、それぞれ直接ご依頼いただく形をご案内します。当社は紹介料を受け取りません。",
    );
    expect(WAKEARI_ANSWER_RESERVATION).toBe(
      "可否や価格の判断は、現地と役所の調査を経て、資格者（建築士・特定行政庁・司法書士・税理士・弁護士）が確認します。共有物分割請求や地主との紛争など、紛争性のある手続は弁護士へご案内します。",
    );
    expect(WAKEARI_CHECKLIST_RESERVATION).toBe(
      "この診断は一般的な情報の整理であり、個別の判断ではありません。可否や価格は、現地と役所の調査を経て、資格者が確認します。",
    );
  });

  it("分離受任の判定語（seed バリデータと同じ）が共通部品経由で5枚すべてに入る", () => {
    expect(WAKEARI_SEPARATION_NOTE).toContain("独立した事業体");
    expect(WAKEARI_SEPARATION_NOTE).toContain("別々にご契約");
    const roleTable = read("src/components/wakeari/WakeariRoleTable.tsx");
    expect(roleTable).toContain("WAKEARI_SEPARATION_NOTE");
    expect(roleTable).toContain("WAKEARI_PROVIDER_SENTENCE");
    expect(roleTable).toContain('className="wakeari-who"');
    for (const key of KEYS) expect(pageSource(key), key).toContain("<WakeariRoleTable />");
  });

  it("直答ブロックは5枚とも固定文言で、買取は「提携する買取業者を買主とする媒介」に統一。「当社が買主となる」は書かない", () => {
    for (const key of KEYS) {
      const a = WAKEARI_ANSWER[key];
      expect(a.length, key).toBeGreaterThanOrEqual(80);
      expect(a.length, key).toBeLessThanOrEqual(160);
      expect(pageSource(key), key).toContain(`WAKEARI_ANSWER${key === "hub" ? ".hub" : key === "kyoyu" || key === "kyosho" ? `.${key}` : `["${key}"]`}`);
    }
    expect(WAKEARI_ANSWER.hub).toContain("提携する買取業者を買主とする媒介");
    for (const f of WAKEARI_FILES) {
      expect(read(f), f).not.toMatch(/当社(自身)?が買主/);
    }
  });

  it("役割表は指示書 5-4 の7行で、買取は「提携する買取業者（当社は媒介）」", () => {
    expect(WAKEARI_ROLE_ROWS).toHaveLength(7);
    expect(WAKEARI_ROLE_ROWS.map((r) => r.what)).toEqual([
      "売却の媒介、買い手探し、価格の根拠の説明",
      "買取",
      "遺産分割協議書、相続関係説明図などの書類作成",
      "相続登記、持分移転登記、表題登記",
      "譲渡所得、相続税",
      "共有物分割請求、借地非訟、地主・共有者との紛争",
      "43条2項の認定・許可、建築の可否、擁壁の安全性",
    ]);
    expect(WAKEARI_ROLE_ROWS[1].who).toBe("提携する買取業者（当社は媒介）");
  });
});

describe("FAQ（指示書 5-3・同一配列から描画と FAQPage を生成）", () => {
  it("ハブ10問・種類別8問。設問は重複せず、回答は一般論＋判断留保の長さ", () => {
    expect(WAKEARI_FAQ.hub).toHaveLength(10);
    for (const key of WAKEARI_TYPE_KEYS) expect(WAKEARI_FAQ[key], key).toHaveLength(8);
    for (const key of KEYS) {
      const qs = WAKEARI_FAQ[key].map((f) => f.q);
      expect(new Set(qs).size, key).toBe(qs.length);
      for (const f of WAKEARI_FAQ[key]) {
        expect(f.a.length, `${key}: ${f.q}`).toBeGreaterThanOrEqual(100);
        expect(f.a.length, `${key}: ${f.q}`).toBeLessThanOrEqual(260);
      }
    }
  });

  it("設問は指示書 5-3 の固定文（先頭と末尾）", () => {
    expect(WAKEARI_FAQ.hub[0].q).toBe("「売りにくい土地・建物」とは、具体的にどんな物件ですか。");
    expect(WAKEARI_FAQ.hub[9].q).toBe("相談から売却までは、どんな順番で進みますか。");
    for (const key of WAKEARI_TYPE_KEYS) {
      expect(WAKEARI_FAQ[key][7].q, key).toBe("相談すると、何を調べて、何を報告してもらえますか。");
    }
    expect(WAKEARI_FAQ.kyoyu[6].q).toBe("共有者どうしの話し合いを、当社が代わりに行えますか。");
    expect(WAKEARI_FAQ["shakuchi-sokochi"][1].q).toBe("承諾料の相場や交渉は、誰が行いますか。");
  });

  it("交渉・代理は行わない／「どちらが向いていますか」は結論を書かない（回答の規律）", () => {
    expect(WAKEARI_FAQ.kyoyu[6].a).toContain("当社は代理・交渉を行いません");
    expect(WAKEARI_FAQ["shakuchi-sokochi"][1].a).toContain("当社は代理・交渉を行いません");
    for (const key of ["saikenchiku-fuka", "kyosho"] as const) {
      const f = WAKEARI_FAQ[key].find((x) => x.q === "買取と媒介では、どちらが向いていますか。")!;
      expect(f.a).toContain("判断軸");
      expect(f.a).toContain("結論はお客様が決めます");
    }
  });

  it("各ページは自分の FAQ 配列を Faq（withJsonLd）に渡す＝本文と FAQPage が同一文言", () => {
    for (const key of KEYS) {
      const src = pageSource(key);
      const ref = key === "hub" ? "WAKEARI_FAQ.hub" : key === "kyoyu" || key === "kyosho" ? `WAKEARI_FAQ.${key}` : `WAKEARI_FAQ["${key}"]`;
      expect(src, key).toContain(`items={${ref}}`);
      expect(src, key).toContain("withJsonLd");
    }
  });
});

describe("出口チェックリスト（指示書 5-5）", () => {
  it("6問・すべて「分からない」を選べる・結果は送り先つき", () => {
    expect(WAKEARI_CHECKLIST).toHaveLength(6);
    for (const q of WAKEARI_CHECKLIST) {
      expect(q.options.some((o) => o.label === "分からない"), q.question).toBe(true);
    }
    const pages = new Set(WAKEARI_CHECKLIST.flatMap((q) => q.options.map((o) => o.page)).filter(Boolean));
    expect([...pages].sort()).toEqual([...WAKEARI_TYPE_KEYS].sort());
    const links = WAKEARI_CHECKLIST.flatMap((q) => q.options.map((o) => o.link?.href)).filter(Boolean);
    expect(links).toEqual(["/column/souzoku-mitouki-tatemono-hyodai-touki-baikyaku"]);
  });

  it("client component は送信・保存・外部通信を持たず、留保文と /contact?intent=wakeari を常時出す", () => {
    const src = read("src/components/wakeari/WakeariExitChecklist.tsx");
    expect(src.startsWith('"use client"')).toBe(true);
    expect(src).not.toMatch(/fetch\(|localStorage|sessionStorage|<form/);
    expect(src).toContain("WAKEARI_CHECKLIST_RESERVATION");
    expect(src).toContain("WAKEARI_CONTACT_HREF");
    expect(src).not.toMatch(/@\/lib\/shared\/office"/);
  });
});

describe("JSON-LD（指示書 6-1）", () => {
  it("Speakable は .wakeari-answer と .wakeari-who、dateModified つき。直答ブロックに class を付ける", () => {
    for (const key of KEYS) {
      const src = pageSource(key);
      expect(src, key).toContain('cssSelector={[".wakeari-answer", ".wakeari-who"]}');
      expect(src, key).toContain("dateModified={WAKEARI_LAST_UPDATED_ISO}");
      expect(src, key).toContain('<span className="wakeari-answer">');
      expect(src, key).toContain("serviceType={PAGE.serviceType}");
      expect(src, key).toContain("serviceOffer={WAKEARI_SERVICE_OFFER}");
    }
  });

  it("ハブは ItemList と種類別 Service 4件を出す", () => {
    const src = pageSource("hub");
    expect(src).toContain('"@type": "ItemList"');
    expect(src).toContain("<JsonLd data={ITEM_LIST_JSON_LD} />");
    expect(src).toContain("<JsonLd data={SERVICES_JSON_LD} />");
    expect(src).toContain('provider: { "@id": `${SITE_URL}/#organization` }');
  });

  it("knowsAbout に5件を追加し、sameAs はラベル完全一致の旗竿地だけ", () => {
    const src = read("src/components/seo/OrganizationJsonLd.tsx");
    for (const name of ["再建築不可", "共有持分", "借地権", "狭小地", "旗竿地"]) expect(src).toContain(`name: "${name}"`);
    expect(src).toContain("https://www.wikidata.org/wiki/Q109361716");
    expect(src).not.toContain("Q2630687\"");
    expect(src).not.toContain("Q1939539\"");
  });
});

describe("収載・導線（指示書 6-3〜6-5・第7章）", () => {
  it("sitemap は5ルートを ja のみ・lastmod つきで収載する", () => {
    const sitemap = read("src/app/sitemap.ts");
    for (const key of KEYS) {
      const p = WAKEARI_PAGES[key].path;
      expect(sitemap, p).toMatch(new RegExp(`\\{ path: "${p.replace(/\//g, "\\/")}",[^}]*locales: \\["ja"\\][^}]*lastModified: WAKEARI_LAST_UPDATED_ISO`));
    }
  });

  it("llms.txt に受け皿5枚と主要コラム6本の節がある", () => {
    const llms = read("src/app/llms.txt/route.ts");
    expect(llms).toContain("## 売りにくい土地・建物の出口相談（四葉不動産株式会社）");
    for (const key of KEYS) expect(llms, key).toContain(`https://luck428.com${WAKEARI_PAGES[key].path} — `);
    expect(llms).toContain("WAKEARI_LLMS_COLUMNS");
    expect(WAKEARI_LLMS_COLUMNS).toHaveLength(6);
    expect(llms).toContain("提携する買取業者を買主とする媒介");
  });

  it("問い合わせフォームに wakeari（akiya の次）と、通知メールの表示名がある", () => {
    expect(EXTRA_CATEGORY_LABELS.wakeari.ja).toBe("売りにくい土地・建物（再建築不可・共有・借地・狭小地）");
    const order = CATEGORY_ORDER_BY_BUSINESS.realestate;
    expect(order[order.indexOf("akiya") + 1]).toBe("wakeari");
    expect(read("src/app/api/contact/route.ts")).toContain('wakeari: "売りにくい土地・建物（再建築不可・共有・借地・狭小地）"');
    for (const key of KEYS) expect(pageSource(key), key).toContain("ctaIntent={WAKEARI_CONTACT_INTENT}");
  });

  it("グローバルナビ（サービス）・フッター・既存ページから相対パスで到達できる", () => {
    const souzokuCat = SERVICE_NAV_CATEGORIES.find((c) => c.id === "souzoku")!;
    const nav = souzokuCat.children.find((c) => c.href === "/wakeari")!;
    expect(nav.locales).toEqual(["ja"]);
    expect(read("src/components/layout/TenantLayout.tsx")).toContain('href: "/wakeari", key: "wakeari"');
    const souzoku = read("src/app/[locale]/(realestate)/souzoku/SouzokuPageContent.tsx");
    expect(souzoku).toContain('href: "/wakeari"');
    expect(souzoku).toContain('href: "/wakeari/kyoyu"');
    expect(souzoku).toContain('href: "/wakeari/shakuchi-sokochi"');
    for (const f of [
      "src/app/[locale]/(realestate)/souzoku/akiya/page.tsx",
      "src/app/[locale]/(realestate)/souzoku/akiya/koishikawa/page.tsx",
    ]) {
      expect(read(f), f).toContain('href: "/wakeari/saikenchiku-fuka"');
      expect(read(f), f).toContain('href: "/wakeari/kyosho"');
    }
    expect(read("src/app/[locale]/(realestate)/toushi/page.tsx")).toContain('href: "/wakeari"');
    expect(read("src/app/[locale]/(realestate)/ryokin/page.tsx")).toContain('href="/wakeari"');
    for (const f of WAKEARI_FILES) expect(read(f), f).not.toMatch(/href="https:\/\/luck428\.com/);
  });

  it("コラム → 受け皿の対応表は27本（既存19＋Phase 2 の8）で、slug はリポジトリの seed 生成物に実在する", () => {
    const slugs = Object.values(WAKEARI_COLUMN_SLUGS).flat();
    // 2026-09-23：既存19本。2026-09-24：Phase 2 の8本（seed-realestate-columns-daily.ts の 77〜84）を追加。
    expect(slugs).toHaveLength(27);
    expect(new Set(slugs).size).toBe(27);
    const dataDir = path.join(ROOT, "src/lib/data");
    const seeds = fs
      .readdirSync(dataDir)
      .filter((f) => f.endsWith("-seed.ts"))
      .map((f) => fs.readFileSync(path.join(dataDir, f), "utf8"))
      .join("\n");
    // seed 生成物は `slug: "x"`（TS）と `"slug": "x"`（JSON 風）の両方の書式がある。
    // DB_ONLY＝管理画面から直接作られリポジトリに seed が無い記事（本番 /column/<slug> の 200 を 2026-09-23 に実測）。
    const DB_ONLY = new Set(["jikka-kyoudai-kyouyuu-meigi"]);
    for (const slug of slugs) {
      if (DB_ONLY.has(slug)) continue;
      expect(seeds, slug).toMatch(new RegExp(`"?slug"?:\\s*"${slug}"`));
    }
    expect(WAKEARI_HUB_BY_COLUMN_SLUG["souzoku-kyoyu-fudosan-uru-doui"].path).toBe("/wakeari/kyoyu");
    expect(WAKEARI_HUB_BY_COLUMN_SLUG["kaitori-chukai-tedori-hikaku"].path).toBe("/wakeari");
    expect(WAKEARI_HUB_BY_COLUMN_SLUG["saikenchiku-fuka-43jo-2ko-nintei-kyoka-dare-ga"].path).toBe("/wakeari/saikenchiku-fuka");
    expect(WAKEARI_HUB_BY_COLUMN_SLUG["kyosho-tochi-15tsubo-uru-ikasu-bunkyo"].path).toBe("/wakeari/kyosho");
    const detail = read("src/app/[locale]/(realestate)/column/[slug]/ColumnDetailContent.tsx");
    expect(detail).toContain("<WakeariColumnHubLink slug={wakeariHubSlug} />");
    expect(read("src/app/[locale]/(realestate)/column/[slug]/page.tsx")).toContain('wakeariHubSlug={locale === "ja" ? slug : undefined}');
  });
});

describe("表現規律（指示書 第8章）", () => {
  it("禁止語が wakeari 関連ファイルに無い（コメント含む）", () => {
    for (const f of WAKEARI_FILES) {
      const m = read(f).match(FORBIDDEN);
      expect(m, `${f}: ${m?.[0]}`).toBeNull();
    }
  });

  it("「紹介料」は「紹介料を受け取りません」の形でしか使わない", () => {
    for (const f of WAKEARI_FILES) {
      const src = read(f);
      const hits = [...src.matchAll(/紹介料/g)].length;
      const ok = [...src.matchAll(/紹介料を受け取りません/g)].length;
      expect(hits, f).toBe(ok);
    }
  });
});

/** 実行検査：ja 先行公開＝canonical は ja、hreflang は ja と x-default だけ（sitemap-static-locales.test.ts と同じ型） */
const state = vi.hoisted(() => ({ locale: "ja" as LangCode }));
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: async () => state.locale }));
vi.mock("@/components/shared/CtaBand", () => ({ CtaBand: () => null }));
vi.mock("@/lib/columns", () => ({ getColumns: async () => [], getLocalizedColumn: (c: unknown) => c }));

describe("メタデータ（ja 先行公開）", () => {
  it.each(KEYS)("%s：canonical は ja、hreflang は ja と x-default", async (key) => {
    for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
      state.locale = locale;
      vi.resetModules();
      const mod = await import(/* @vite-ignore */ `@/app/[locale]/(realestate)${WAKEARI_PAGES[key].path}/page`);
      const md = await mod.generateMetadata();
      expect(md.alternates?.canonical, `${key}/${locale}`).toBe(`https://luck428.com${WAKEARI_PAGES[key].path}`);
      expect(Object.keys(md.alternates?.languages ?? {}).sort()).toEqual(["ja", "x-default"]);
      expect(md.title).toEqual({ absolute: WAKEARI_PAGES[key].title });
    }
  });
});
