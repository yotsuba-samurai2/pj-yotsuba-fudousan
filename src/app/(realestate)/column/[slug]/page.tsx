import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getColumnBySlug, getColumns, getLocalizedColumn, getAllSlugs, isLocaleAllowed, pickRelatedColumns } from "@/lib/columns";
import { buildPageMetadata } from "@/lib/seo";
import { LOCALE_COOKIE, DEFAULT_LOCALE, isValidLocale } from "@/lib/locale";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SpeakableJsonLd } from "@/components/seo/SpeakableJsonLd";

import type { Metadata } from "next";
import type { LangCode } from "@/config/languages";
import ColumnDetailContent from "./ColumnDetailContent";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const base = await getColumnBySlug(slug);
  if (!base) return {};
  const cookieStore = await cookies();
  const lc = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: LangCode = lc && isValidLocale(lc) ? lc : DEFAULT_LOCALE;
  if (!isLocaleAllowed(base, locale)) return {};
  const col = getLocalizedColumn(base, locale);
  return buildPageMetadata({
    businessKey: "realestate",
    title: col.title,
    description: col.excerpt,
    path: `/column/${col.slug}`,
    keywords: col.keywords,
    type: "article",
    publishedTime: col.date,
    modifiedTime: col.modifiedDate ?? col.date,
    section: col.category,
    locale,
  });
}

export default async function ColumnDetailPage({ params }: Props) {
  const { slug } = await params;
  const base = await getColumnBySlug(slug);
  if (!base) notFound();

  const cookieStore = await cookies();
  const lc = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: LangCode = lc && isValidLocale(lc) ? lc : DEFAULT_LOCALE;
  if (!isLocaleAllowed(base, locale)) notFound();
  const col = getLocalizedColumn(base, locale);

  // Find prev/next
  const allColumns = await getColumns(locale);
  const sorted = [...allColumns].sort((a, b) => b.date.localeCompare(a.date));
  const idx = sorted.findIndex((c) => c.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;

  // Related columns（同一ロケール・タグ一致→カテゴリ一致→新着、自身除外、最大3）。
  // 照合は同一ロケール空間で行うため localize 済み配列で比較する。
  const localizedAll = allColumns.map((c) => getLocalizedColumn(c, locale));
  const related = pickRelatedColumns(localizedAll, {
    excludeSlug: slug,
    category: col.category,
    tags: col.tags,
    limit: 3,
  });

  return (
    <div>
      <BlogPostingJsonLd businessKey="realestate" column={col} locale={locale} />
      <BreadcrumbJsonLd businessKey="realestate" items={[
        { name: "ホーム", href: "/" },
        { name: "コラム", href: "/column" },
        { name: col.title, href: `/column/${col.slug}` },
      ]} />
      {col.faq && col.faq.length > 0 && <FAQJsonLd items={col.faq} />}
      <SpeakableJsonLd businessKey="realestate" path={`/column/${col.slug}`} headline={col.title} summary={col.excerpt} />
      <ColumnDetailContent col={col} prev={prev} next={next} related={related} />
    </div>
  );
}
