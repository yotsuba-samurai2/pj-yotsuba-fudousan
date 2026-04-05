import { notFound } from "next/navigation";
import { getLegalColumnBySlug, legalColumns, getAllLegalSlugs } from "@/lib/columns";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";

import LegalColumnDetailContent from "./LegalColumnDetailContent";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllLegalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = getLegalColumnBySlug(slug);
  if (!col) return {};
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
  });
}

export default async function LegalColumnDetailPage({ params }: Props) {
  const { slug } = await params;
  const col = getLegalColumnBySlug(slug);
  if (!col) notFound();

  const sorted = [...legalColumns].sort((a, b) => b.date.localeCompare(a.date));
  const idx = sorted.findIndex((c) => c.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;

  return (
    <div>
      <BlogPostingJsonLd businessKey="legal" column={col} authorName="浦松 丈二" authorTitle="代表行政書士" />
      <BreadcrumbJsonLd businessKey="legal" items={[
        { name: "ホーム", href: "/legal" },
        { name: "コラム", href: "/legal/column" },
        { name: col.title, href: `/legal/column/${col.slug}` },
      ]} />
      {col.faq && col.faq.length > 0 && <FAQJsonLd items={col.faq} />}
      <LegalColumnDetailContent column={col} prev={prev} next={next} />
    </div>
  );
}
