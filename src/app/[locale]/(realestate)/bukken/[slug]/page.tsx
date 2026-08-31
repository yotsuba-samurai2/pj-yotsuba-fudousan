import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublicPropertyBySlug,
  getAllPublishedPropertiesAllLocales,
  getLocalizedProperty,
  isPropertyLocaleAllowed,
} from "@/lib/properties";
import {
  buildRequiredDisplayRows,
  formatPriceYen,
  CATEGORY_LABELS,
  DEAL_TYPE_LABELS,
  GH_USE_NOTE,
} from "@/lib/property-shared";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { RealEstateListingJsonLd } from "@/components/seo/RealEstateListingJsonLd";
import { PropertyLegalBlock } from "@/components/bukken/PropertyLegalBlock";
import ColumnBody from "@/components/column/ColumnBody";
import type { LangCode } from "@/config/languages";

/**
 * 物件詳細（/bukken/[slug]）。
 * - published: 必要表示事項（規約別表のインターネット広告列）＋広告主ブロックを自動表示
 * - closed: 200で「募集終了」表示＋noindex。価格・必要表示・JSON-LD Offerは出さない
 *   （おとり広告の構造的回避＝委任プロンプト確定仕様）
 * - draft: 404
 */

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const properties = await getAllPublishedPropertiesAllLocales();
  return properties.map((p) => ({ slug: p.slug }));
}

/** meta description用の要約（markdown記号と改行を落として120字） */
function summarize(text: string): string {
  return text
    .replace(/[#*_`>\-|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const base = await getPublicPropertyBySlug(slug);
  if (!base) return {};
  const locale: LangCode = await getRequestLocale();
  if (!isPropertyLocaleAllowed(base, locale)) return {};
  const p = getLocalizedProperty(base, locale);
  const isClosed = p.status === "closed";
  return buildPageMetadata({
    businessKey: "realestate",
    title: isClosed ? `【募集終了】${p.title}` : p.title,
    description: summarize(p.description),
    path: `/bukken/${p.slug}`,
    ...(p.images[0] ? { image: p.images[0].url } : {}),
    locale,
    noindex: isClosed,
    availableLocales: base.locales,
  });
}

function ClosedNotice({ locale }: { locale: LangCode }) {
  return (
    <div className="mt-6 rounded-xl border border-border bg-surface p-6">
      <p className="text-sm font-semibold text-ink">
        この物件は募集を終了しました。
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        類似の物件をお探しの場合は、ご希望の条件をお聞かせください。
        非公開の情報を含めてお探しします。
      </p>
      <p className="mt-3 text-sm">
        <Link href={addLocalePrefix("/bukken", locale)} className="text-primary underline">
          ご紹介中の物件一覧へ
        </Link>
      </p>
    </div>
  );
}

export default async function BukkenDetailPage({ params }: Props) {
  const { slug } = await params;
  const base = await getPublicPropertyBySlug(slug);
  if (!base) notFound();

  const locale: LangCode = await getRequestLocale();
  if (!isPropertyLocaleAllowed(base, locale)) notFound();
  const p = getLocalizedProperty(base, locale);
  const isClosed = p.status === "closed";
  const hero = p.images[0];
  const rows = buildRequiredDisplayRows(p);

  return (
    <>
      <RealEstateListingJsonLd property={p} locale={locale} />
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "取扱物件", href: "/bukken" },
          { name: p.title, href: `/bukken/${p.slug}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        {hero && !isClosed && (
          // 画像はSupabase Storageの絶対URL＝next/image未設定のため素のimg（コラムと同方式）
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero.url}
            alt={hero.alt}
            width={1600}
            height={900}
            className="mt-3 w-full rounded-2xl object-cover"
            fetchPriority="high"
          />
        )}

        <header className="pt-4">
          <p className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="rounded-full bg-primary-tint px-2.5 py-0.5 font-medium text-primary">
              {CATEGORY_LABELS[p.category]}
            </span>
            <span className="rounded-full bg-surface-dim px-2.5 py-0.5 font-medium text-text-muted">
              {DEAL_TYPE_LABELS[p.dealType]}
            </span>
            {isClosed && (
              <span className="rounded-full bg-surface-dim px-2.5 py-0.5 font-medium text-text-muted">
                募集終了
              </span>
            )}
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">
            {p.title}
          </h1>
          {!isClosed && (
            <p className="mt-2 text-2xl font-semibold text-primary">
              {formatPriceYen(p.priceYen)}
              {p.priceNote && (
                <span className="ml-2 text-xs font-normal text-text-muted">（{p.priceNote}）</span>
              )}
            </p>
          )}
        </header>

        {isClosed ? (
          <ClosedNotice locale={locale} />
        ) : (
          <>
            {/* 必要表示事項（規約別表のインターネット広告列＝原本目視2026-09-01） */}
            <section aria-label="物件概要" className="mt-6 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-b border-border last:border-b-0">
                      <th className="w-36 bg-surface-dim px-4 py-2.5 text-left text-xs font-medium text-text-muted">
                        {row.label}
                      </th>
                      <td className="px-4 py-2.5 text-text">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {p.category === "gh" && (
              <p className="mt-4 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-text-muted">
                {GH_USE_NOTE}
              </p>
            )}

            <section className="mt-8">
              <ColumnBody content={p.description} />
            </section>

            {p.images.length > 1 && (
              <section aria-label="物件写真" className="mt-8 grid grid-cols-2 gap-3">
                {p.images.slice(1).map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.url}
                    src={img.url}
                    alt={img.alt}
                    width={800}
                    height={600}
                    className="w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                ))}
              </section>
            )}

            <PropertyLegalBlock property={p} />
          </>
        )}
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand
          businessKey="realestate"
          variant={p.category === "gh" ? "property-gh" : "property"}
        />
      </div>
    </>
  );
}
