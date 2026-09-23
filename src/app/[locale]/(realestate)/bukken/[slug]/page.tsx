// Availability expiry must be evaluated on each request, even if the worker is offline.
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublicPropertyBySlug,
  getLocalizedProperty,
  isPropertyLocaleAllowed,
} from "@/lib/properties";
import {
  buildLocalizedDisplayRows,
  formatPropertyPriceL,
  localizedImageAlt,
  localizeFixedValue,
  propertyUi,
  sectionOrder,
  usageNote,
} from "@/lib/property-i18n";
import { relatedLinksFor } from "@/config/property-related-links";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { RealEstateListingJsonLd } from "@/components/seo/RealEstateListingJsonLd";
import { PropertyLegalBlock } from "@/components/bukken/PropertyLegalBlock";
import { PropertyViewingCta } from "@/components/bukken/PropertyViewingCta";
import { PropertyQa } from "@/components/bukken/PropertyQa";
import ColumnBody from "@/components/column/ColumnBody";
import { propertyPhotoNotes } from "@/lib/property-photo-notes";
import { PropertyPhotoGallery } from "@/components/bukken/PropertyPhotoGallery";
import { PropertyImage } from "@/components/bukken/PropertyImage";
import { PropertyVideos } from "@/components/bukken/PropertyVideos";
import { PropertySchoolDistrict } from "@/components/gakku/RentalSchoolDistrict";
import type { LangCode } from "@/config/languages";

/**
 * 物件詳細（/bukken/[slug]）。
 * - 公開判定（isPubliclyVisible）を満たす物件：必要表示事項（規約別表のインターネット広告列）を
 *   H2区分つきの概要表で表示し、広告主ブロックを自動表示する。
 * - closed（募集終了）・draft・確認期限超過・未知のslug・非公開ロケール：notFound()＝実HTTP 404。
 *   「募集終了」の200ページは返さない（価格・Offer・画像を公開面に残さない）。
 */

type Props = { params: Promise<{ slug: string }> };

// Property data changes independently of code deploys. Keep detail pages on-demand so
// Vercel does not enumerate and pre-render every published property on each deployment.
export function generateStaticParams() {
  return [];
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
  if (!base) notFound();
  const locale: LangCode = await getRequestLocale();
  if (!isPropertyLocaleAllowed(base, locale)) notFound();
  const p = getLocalizedProperty(base, locale);
  return buildPageMetadata({
    businessKey: "realestate",
    title: p.title,
    description: summarize(p.description),
    path: `/bukken/${p.slug}`,
    ...(p.images[0] ? { image: p.images[0].url } : {}),
    locale,
    availableLocales: base.locales,
  });
}

export default async function BukkenDetailPage({ params }: Props) {
  const { slug } = await params;
  const base = await getPublicPropertyBySlug(slug);
  if (!base) notFound();

  const locale: LangCode = await getRequestLocale();
  if (!isPropertyLocaleAllowed(base, locale)) notFound();
  const p = getLocalizedProperty(base, locale);
  const ui = propertyUi(locale);
  const hero = p.images[0];
  const rows = buildLocalizedDisplayRows(p, locale);
  const note = usageNote(p, locale);
  const related = relatedLinksFor(p, locale);
  const priceNote = p.priceNote
    ? locale === "ja"
      ? p.priceNote
      : p.translations?.[locale as "en" | "zh-tw" | "zh"]?.priceNote ?? localizeFixedValue(p.priceNote, locale) ?? p.priceNote
    : undefined;

  return (
    <>
      <RealEstateListingJsonLd property={p} locale={locale} />
      <Breadcrumb
        items={[
          { name: ui.home, href: "/" },
          { name: ui.listing, href: "/bukken" },
          { name: p.title, href: `/bukken/${p.slug}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        {hero && (
          // 2026-09-23：自社Storageの写真は next/image で縮小配信（PropertyImage が許可外URLを素の img に戻す）
          <PropertyImage
            src={hero.url}
            alt={localizedImageAlt(hero, p.title, locale)}
            width={1600}
            height={900}
            className="mt-3 w-full rounded-2xl object-cover"
            sizes="(min-width: 768px) 736px, calc(100vw - 32px)"
            loading="eager"
            fetchPriority="high"
          />
        )}

        <header className="pt-4">
          <p className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="rounded-full bg-primary-tint px-2.5 py-0.5 font-medium text-primary">
              {ui.category[p.category]}
            </span>
            <span className="rounded-full bg-surface-dim px-2.5 py-0.5 font-medium text-text-muted">
              {ui.dealType[p.dealType]}
            </span>
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">{p.title}</h1>
          <p className="mt-2 text-2xl font-semibold text-primary">
            {formatPropertyPriceL(p, locale)}
            {priceNote && <span className="ml-2 text-xs font-normal text-text-muted">（{priceNote}）</span>}
          </p>
        </header>

        <PropertySchoolDistrict property={base} locale={locale} />

        {/* 必要表示事項（規約別表のインターネット広告列＝原本目視2026-09-01）。行は落とさず区分だけ付ける */}
        {sectionOrder(p.dealType).map((sec) => {
          const secRows = rows.filter((r) => r.section === sec);
          if (secRows.length === 0) return null;
          return (
            <section key={sec} className="mt-8">
              <h2 className="font-serif text-xl font-semibold text-ink">{ui.sections[sec]}</h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {secRows.map((row) => (
                      <tr key={row.key} className="border-b border-border last:border-b-0">
                        <th className="w-36 bg-surface-dim px-4 py-2.5 text-left text-xs font-medium text-text-muted">
                          {row.label}
                        </th>
                        {/* 訳が未整備の自由記述は日本語原文を表示（必要表示事項を落とさない） */}
                        <td className="px-4 py-2.5 text-text" {...(row.untranslated ? { lang: "ja" } : {})}>
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        {(note || p.category === "gh") && (
          <div className="mt-4 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-text-muted">
            {note && <p>{note}</p>}
            {p.category === "gh" && <p className={note ? "mt-2" : ""}>{ui.ghNote}</p>}
          </div>
        )}

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">{ui.descriptionHeading}</h2>
          <div className="mt-3">
            <ColumnBody content={p.description} />
          </div>
        </section>

        <PropertyVideos description={p.description} locale={locale} />

        {p.images.length > 0 && (
          <section className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-ink">{ui.photosHeading}</h2>
            <div className="mt-3">
              <PropertyPhotoGallery
                images={p.images.map((img) => ({ url: img.url, alt: localizedImageAlt(img, p.title, locale) }))}
                locale={locale}
                previewLimit={6}
                photoNotes={propertyPhotoNotes(p.description)}
                allPhotosHref={addLocalePrefix(`/bukken/${p.slug}/photos`, locale)}
              />
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-semibold text-ink">{ui.relatedHeading}</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={addLocalePrefix(r.path, locale)} className="text-primary underline">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <PropertyLegalBlock property={p} locale={locale} />
        <PropertyQa property={p} locale={locale} />
        <PropertyViewingCta propertyTitle={p.title} propertyUrl={addLocalePrefix(`/bukken/${p.slug}`, locale)} locale={locale} />
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="realestate" variant={p.category === "gh" ? "property-gh" : "property"} />
      </div>
    </>
  );
}
