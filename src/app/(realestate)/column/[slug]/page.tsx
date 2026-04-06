import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getColumnBySlug, getColumns, getLocalizedColumn, getAllSlugs } from "@/lib/columns";
import { buildPageMetadata } from "@/lib/seo";
import { LOCALE_COOKIE, DEFAULT_LOCALE, isValidLocale } from "@/lib/locale";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SpeakableJsonLd } from "@/components/seo/SpeakableJsonLd";

import type { Metadata } from "next";
import type { LangCode } from "@/config/languages";
import ColumnDetailContent from "./ColumnDetailContent";

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
  const col = await getColumnBySlug(slug);
  if (!col) notFound();

  // Find prev/next
  const allColumns = await getColumns();
  const sorted = [...allColumns].sort((a, b) => b.date.localeCompare(a.date));
  const idx = sorted.findIndex((c) => c.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;

  return (
    <div>
      <BlogPostingJsonLd businessKey="realestate" column={col} authorName="浦松 丈二" authorTitle="代表取締役" />
      <BreadcrumbJsonLd businessKey="realestate" items={[
        { name: "ホーム", href: "/" },
        { name: "コラム", href: "/column" },
        { name: col.title, href: `/column/${col.slug}` },
      ]} />
      {col.faq && col.faq.length > 0 && <FAQJsonLd items={col.faq} />}
      <SpeakableJsonLd businessKey="realestate" path={`/column/${col.slug}`} headline={col.title} summary={col.excerpt} />
      <ColumnDetailContent col={col} prev={prev} next={next} />
    </div>
  );
}
