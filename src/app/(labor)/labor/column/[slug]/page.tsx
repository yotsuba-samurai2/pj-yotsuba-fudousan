import { notFound } from "next/navigation";
import { getLaborColumnBySlug, laborColumns, getAllLaborSlugs } from "@/lib/columns";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";

import { LaborColumnDetailPageContent } from "./PageContent";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllLaborSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = getLaborColumnBySlug(slug);
  if (!col) return {};
  return buildPageMetadata({
    businessKey: "labor",
    title: col.title,
    description: col.excerpt,
    path: `/labor/column/${col.slug}`,
    keywords: col.keywords,
    type: "article",
    publishedTime: col.date,
    modifiedTime: col.modifiedDate ?? col.date,
    section: col.category,
  });
}

export default async function LaborColumnDetailPage({ params }: Props) {
  const { slug } = await params;
  const col = getLaborColumnBySlug(slug);
  if (!col) notFound();

  const sorted = [...laborColumns].sort((a, b) => b.date.localeCompare(a.date));
  const idx = sorted.findIndex((c) => c.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;

  return (
    <div>
      <BlogPostingJsonLd businessKey="labor" column={col} authorName="浦松 丈二" authorTitle="社会保険労務士" />
      <BreadcrumbJsonLd businessKey="labor" items={[
        { name: "ホーム", href: "/labor" },
        { name: "コラム", href: "/labor/column" },
        { name: col.title, href: `/labor/column/${col.slug}` },
      ]} />
      {col.faq && col.faq.length > 0 && <FAQJsonLd items={col.faq} />}
      <LaborColumnDetailPageContent col={col} prev={prev} next={next} />
    </div>
  );
}
