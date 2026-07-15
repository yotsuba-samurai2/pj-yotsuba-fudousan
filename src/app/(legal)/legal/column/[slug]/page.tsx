import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getLegalColumnBySlug, getLegalColumns, getLocalizedColumn, getAllLegalSlugs, isLocaleAllowed } from "@/lib/columns";
import { buildPageMetadata } from "@/lib/seo";
import { LOCALE_COOKIE, DEFAULT_LOCALE, isValidLocale } from "@/lib/locale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SpeakableJsonLd } from "@/components/seo/SpeakableJsonLd";

import LegalColumnDetailContent from "./LegalColumnDetailContent";
import type { Metadata } from "next";
import type { LangCode } from "@/config/languages";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllLegalSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const base = await getLegalColumnBySlug(slug);
  if (!base) return {};
  const cookieStore = await cookies();
  const lc = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: LangCode = lc && isValidLocale(lc) ? lc : DEFAULT_LOCALE;
  if (!isLocaleAllowed(base, locale)) return {};
  const col = getLocalizedColumn(base, locale);
  return buildPageMetadata({
    businessKey: "legal",
    title: col.title,
    description: col.excerpt,
    path: `/legal/column/${col.slug}`,
    keywords: col.keywords,
    type: "article",
    publishedTime: col.date,
    modifiedTime: col.modifiedDate ?? col.date,
    section: col.category,
    locale,
    // hreflang を公開ロケールのみに限定（未公開ロケールの404 URLをGoogleに広告しない）。
    availableLocales: base.locales,
  });
}

export default async function LegalColumnDetailPage({ params }: Props) {
  const { slug } = await params;
  const base = await getLegalColumnBySlug(slug);
  if (!base) notFound();

  const cookieStore = await cookies();
  const lc = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: LangCode = lc && isValidLocale(lc) ? lc : DEFAULT_LOCALE;
  if (!isLocaleAllowed(base, locale)) notFound();
  const col = getLocalizedColumn(base, locale);

  const allLegalColumns = await getLegalColumns(locale);
  const sorted = [...allLegalColumns].sort((a, b) => b.date.localeCompare(a.date));
  const idx = sorted.findIndex((c) => c.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;

  return (
    <div>
      <BlogPostingJsonLd businessKey="legal" column={col} locale={locale} />
      <BreadcrumbJsonLd businessKey="legal" items={[
        { name: "ホーム", href: "/legal" },
        { name: "コラム", href: "/legal/column" },
        { name: col.title, href: `/legal/column/${col.slug}` },
      ]} />
      {col.faq && col.faq.length > 0 && <FAQJsonLd items={col.faq} />}
      <SpeakableJsonLd businessKey="legal" path={`/legal/column/${col.slug}`} headline={col.title} summary={col.excerpt} />
      <LegalColumnDetailContent column={col} prev={prev} next={next} />
    </div>
  );
}
