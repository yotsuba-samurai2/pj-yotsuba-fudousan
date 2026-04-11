import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  getLaborColumnBySlug,
  getLaborColumns,
  getLocalizedColumn,
  getAllLaborSlugs,
} from "@/lib/columns";
import { buildPageMetadata } from "@/lib/seo";
import { LOCALE_COOKIE, DEFAULT_LOCALE, isValidLocale } from "@/lib/locale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SpeakableJsonLd } from "@/components/seo/SpeakableJsonLd";

import { LaborColumnDetailPageContent } from "./PageContent";
import type { Metadata } from "next";
import type { LangCode } from "@/config/languages";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllLaborSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const base = await getLaborColumnBySlug(slug);
  if (!base) return {};
  const cookieStore = await cookies();
  const lc = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: LangCode = lc && isValidLocale(lc) ? lc : DEFAULT_LOCALE;
  const col = getLocalizedColumn(base, locale);
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
    locale,
  });
}

export default async function LaborColumnDetailPage({ params }: Props) {
  const { slug } = await params;
  const base = await getLaborColumnBySlug(slug);
  if (!base) notFound();

  const cookieStore = await cookies();
  const lc = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: LangCode = lc && isValidLocale(lc) ? lc : DEFAULT_LOCALE;
  const col = getLocalizedColumn(base, locale);

  const allLaborColumns = await getLaborColumns();
  const sorted = [...allLaborColumns].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const idx = sorted.findIndex((c) => c.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;

  return (
    <div>
      <BlogPostingJsonLd businessKey="labor" column={col} locale={locale} />
      <BreadcrumbJsonLd
        businessKey="labor"
        items={[
          { name: "ホーム", href: "/labor" },
          { name: "コラム", href: "/labor/column" },
          { name: col.title, href: `/labor/column/${col.slug}` },
        ]}
      />
      {col.faq && col.faq.length > 0 && <FAQJsonLd items={col.faq} />}
      <SpeakableJsonLd
        businessKey="labor"
        path={`/labor/column/${col.slug}`}
        headline={col.title}
        summary={col.excerpt}
      />
      <LaborColumnDetailPageContent col={col} prev={prev} next={next} />
    </div>
  );
}
