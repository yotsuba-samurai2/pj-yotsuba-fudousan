import { notFound } from "next/navigation";
import { getColumnBySlug, columns, getAllSlugs } from "@/lib/columns";
import { buildPageMetadata } from "@/lib/seo";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SpeakableJsonLd } from "@/components/seo/SpeakableJsonLd";

import type { Metadata } from "next";
import ColumnDetailContent from "./ColumnDetailContent";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = getColumnBySlug(slug);
  if (!col) return {};
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
  });
}

export default async function ColumnDetailPage({ params }: Props) {
  const { slug } = await params;
  const col = getColumnBySlug(slug);
  if (!col) notFound();

  // Find prev/next
  const sorted = [...columns].sort((a, b) => b.date.localeCompare(a.date));
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
