export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPropertyBySlug, getLocalizedProperty, isPropertyLocaleAllowed } from "@/lib/properties";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { localizedImageAlt, propertyUi } from "@/lib/property-i18n";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PropertyPhotoGallery } from "@/components/bukken/PropertyPhotoGallery";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return []; }

async function getPhotoPage(slug: string) {
  const base = await getPublicPropertyBySlug(slug);
  if (!base) notFound();
  const locale = await getRequestLocale();
  if (!isPropertyLocaleAllowed(base, locale)) notFound();
  return { base, locale, property: getLocalizedProperty(base, locale) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { base, locale, property } = await getPhotoPage(slug);
  const metadata = buildPageMetadata({ businessKey: "realestate", title: `${property.title} | ${propertyUi(locale).photosHeading}`, description: property.title, path: `/bukken/${slug}`, locale, availableLocales: base.locales });
  return { ...metadata, robots: { index: false, follow: true } };
}

export default async function PropertyPhotosPage({ params }: Props) {
  const { slug } = await params;
  const { locale, property } = await getPhotoPage(slug);
  const ui = propertyUi(locale);
  const detailPath = `/bukken/${property.slug}`;
  const back = { ja: "物件詳細に戻る", en: "Back to property details", "zh-tw": "返回物件詳情", zh: "返回房源详情" }[locale];
  return (
    <>
      <Breadcrumb items={[{ name: ui.home, href: "/" }, { name: ui.listing, href: "/bukken" }, { name: property.title, href: detailPath }, { name: ui.photosHeading, href: `${detailPath}/photos` }]} />
      <main className="mx-auto max-w-5xl px-4 pb-16">
        <Link href={addLocalePrefix(detailPath, locale)} className="mb-6 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">{back}</Link>
        <h1 className="font-serif text-2xl font-semibold leading-relaxed text-ink">{property.title}</h1>
        <h2 className="mb-5 mt-3 text-base text-text-muted">{ui.photosHeading} ({property.images.length})</h2>
        <PropertyPhotoGallery images={property.images.map((image) => ({ url: image.url, alt: localizedImageAlt(image, property.title, locale) }))} locale={locale} />
        <Link href={addLocalePrefix(detailPath, locale)} className="mt-10 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">{back}</Link>
      </main>
    </>
  );
}
