import { JsonLd } from "./JsonLd";
import { canonicalUrl, BUSINESS_SEO } from "@/lib/seo";
import type { Column } from "@/lib/columns";

export function BlogPostingJsonLd({
  businessKey,
  column,
  authorName = "浦松 丈二",
  authorTitle = "代表",
}: {
  businessKey: string;
  column: Column;
  authorName?: string;
  authorTitle?: string;
}) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz) return null;

  const url = canonicalUrl(businessKey, `${biz.columnBasePath}/${column.slug}`);
  const imageUrl = column.ogImage
    ? `${biz.url}${column.ogImage}`
    : `${biz.url}${biz.ogImage}`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: column.title,
        description: column.excerpt,
        datePublished: column.date,
        dateModified: column.modifiedDate ?? column.date,
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 512,
          height: 512,
        },
        author: {
          "@type": "Person",
          name: authorName,
          jobTitle: `${biz.name} ${authorTitle}`,
        },
        publisher: { "@id": `${biz.url}/#organization` },
        mainEntityOfPage: url,
        articleSection: column.category,
        inLanguage: "ja",
        wordCount: column.content.length,
        ...(column.keywords?.length ? { keywords: column.keywords.join(", ") } : {}),
      }}
    />
  );
}
