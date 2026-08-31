import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedProperties, getLocalizedProperty } from "@/lib/properties";
import {
  formatPriceYen,
  formatAccess,
  CATEGORY_LABELS,
  DEAL_TYPE_LABELS,
  TRADE_MODE_LABELS,
  type PropertyCategory,
  type PublicProperty,
} from "@/lib/property-shared";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import type { LangCode } from "@/config/languages";

/**
 * 物件紹介の一覧（/bukken）。公開（published）物件のみを表示し、
 * 物件が存在するカテゴリの見出しだけを出す（空タブ・空見出しを出さない）。
 * ページネーションなし（初期掲載3〜5件のシンプル構成＝委任プロンプト確定仕様）。
 */

// ja先行公開（sitemap.ts の STATIC_REALESTATE と必ず一致させる）
const PAGE_LOCALES: LangCode[] = ["ja"];

// カテゴリの表示順（勝ち筋優先）
const CATEGORY_ORDER: PropertyCategory[] = ["gh", "jigyo", "souzoku", "toushi", "other"];

const COPY: Record<LangCode, { title: string; description: string; h1: string; lead: string; empty: string }> = {
  ja: {
    title: "取扱物件のご紹介",
    description:
      "四葉不動産株式会社（東京都文京区・宅地建物取引業 東京都知事(1)第113304号）の取扱物件一覧。障害福祉グループホーム向け・事業用店舗・相続売却・投資用の売買物件をご紹介します。",
    h1: "取扱物件のご紹介",
    lead: "現在ご紹介できる売買物件の一覧です。掲載していない物件のご相談・物件探しのご依頼も承ります。",
    empty: "現在ご紹介中の物件はありません。ご希望の条件をお聞かせいただければ、お探しします。",
  },
  en: {
    title: "Property Listings",
    description: "Properties for sale handled by Yotsuba Real Estate (Bunkyo-ku, Tokyo).",
    h1: "Property Listings",
    lead: "Properties currently available for sale.",
    empty: "No listings are available at the moment. Tell us what you are looking for and we will search for you.",
  },
  "zh-tw": {
    title: "物件介紹",
    description: "四葉不動產株式會社（東京都文京區）的出售物件一覽。",
    h1: "物件介紹",
    lead: "目前可介紹的出售物件一覽。",
    empty: "目前沒有刊登中的物件。歡迎告訴我們您的需求，我們將為您尋找。",
  },
  zh: {
    title: "物件介绍",
    description: "四叶不动产株式会社（东京都文京区）的出售物件一览。",
    h1: "物件介绍",
    lead: "目前可介绍的出售物件一览。",
    empty: "目前没有刊登中的物件。欢迎告诉我们您的需求，我们将为您寻找。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    title: c.title,
    description: c.description,
    path: "/bukken",
    locale,
    availableLocales: PAGE_LOCALES,
  });
}

function PropertyCard({ p, locale }: { p: PublicProperty; locale: LangCode }) {
  const hero = p.images[0];
  return (
    <Link
      href={addLocalePrefix(`/bukken/${p.slug}`, locale)}
      className="flex gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
    >
      {hero ? (
        // 画像はSupabase Storageの絶対URL＝next/image未設定のため素のimg（コラムと同方式）
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hero.url}
          alt={hero.alt}
          width={160}
          height={120}
          className="h-24 w-32 flex-shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-24 w-32 flex-shrink-0 items-center justify-center rounded-lg bg-surface-dim text-xs text-text-muted">
          No Image
        </div>
      )}
      <div className="min-w-0">
        <p className="flex flex-wrap gap-1 text-[10px]">
          <span className="rounded-full bg-primary-tint px-2 py-0.5 font-medium text-primary">
            {DEAL_TYPE_LABELS[p.dealType]}
          </span>
          <span className="rounded-full bg-surface-dim px-2 py-0.5 font-medium text-text-muted">
            {TRADE_MODE_LABELS[p.tradeMode]}
          </span>
        </p>
        <h3 className="mt-1 truncate text-sm font-semibold text-ink">{p.title}</h3>
        <p className="mt-1 text-sm font-semibold text-primary">{formatPriceYen(p.priceYen)}</p>
        <p className="mt-0.5 truncate text-xs text-text-muted">{p.locationText}</p>
        {p.access[0] && (
          <p className="truncate text-xs text-text-muted">{formatAccess(p.access[0])}</p>
        )}
      </div>
    </Link>
  );
}

export default async function BukkenListPage() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  const properties = (await getPublishedProperties(locale)).map((p) =>
    getLocalizedProperty(p, locale),
  );

  return (
    <>
      <Breadcrumb items={[{ name: "ホーム", href: "/" }, { name: c.h1 }]} />
      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-4">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          <p className="mt-4 leading-relaxed text-text">{c.lead}</p>
        </header>

        {properties.length === 0 ? (
          <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-sm text-text-muted">
            {c.empty}
          </p>
        ) : (
          <div className="mt-8 space-y-10">
            {CATEGORY_ORDER.filter((cat) =>
              properties.some((p) => p.category === cat),
            ).map((cat) => (
              <section key={cat}>
                <h2 className="font-serif text-xl font-semibold text-ink">
                  {CATEGORY_LABELS[cat]}
                </h2>
                <div className="mt-3 space-y-3">
                  {properties
                    .filter((p) => p.category === cat)
                    .map((p) => (
                      <PropertyCard key={p.slug} p={p} locale={locale} />
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="realestate" variant="property" />
      </div>
    </>
  );
}
