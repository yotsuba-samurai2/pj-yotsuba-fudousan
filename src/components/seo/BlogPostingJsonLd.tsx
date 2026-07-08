import { JsonLd } from "./JsonLd";
import { canonicalUrl, BUSINESS_SEO, PERSON_ID, SHARED_ORG_INFO } from "@/lib/seo";
import type { Column } from "@/lib/columns";
import type { LangCode } from "@/config/languages";

export function BlogPostingJsonLd({
  businessKey,
  column,
  authorName,
  authorTitle,
  locale = "ja",
}: {
  businessKey: string;
  column: Column;
  authorName?: string;
  authorTitle?: string;
  locale?: LangCode;
}) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz) return null;

  const url = canonicalUrl(businessKey, `${biz.columnBasePath}/${column.slug}`);
  const imageUrl = column.ogImage
    ? `${biz.url}${column.ogImage}`
    : `${biz.url}${biz.ogImage}`;

  // 優先順位: 明示 props > column.author > フォールバック
  const resolvedAuthorName =
    authorName ?? column.author?.name ?? "浦松 丈二";
  const resolvedAuthorTitle =
    authorTitle ?? column.author?.title ?? "代表";

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${url}#article`,
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
        // 浦松本人の記事は共通Personノード（/aboutのProfilePageで定義）を@id参照。
        // ローカライズ済み記事はスペース無し表記（例: zh-twの「浦松丈二」）のためスペースを無視して照合。
        // 別名義の寄稿はインラインPersonのまま（@idを誤って共有しない）
        author:
          resolvedAuthorName.replace(/[\s　]/g, "") ===
          SHARED_ORG_INFO.representative.replace(/[\s　]/g, "")
            ? {
                "@type": "Person",
                "@id": PERSON_ID,
                name: resolvedAuthorName,
                url: "https://luck428.com/about",
              }
            : {
                "@type": "Person",
                name: resolvedAuthorName,
                jobTitle: `${biz.name} ${resolvedAuthorTitle}`,
              },
        publisher: { "@id": `${biz.url}/#organization` },
        isPartOf: {
          "@type": "Blog",
          "@id": `${biz.url}${biz.columnBasePath}#blog`,
          name: `${biz.name} コラム`,
          url: `${biz.url}${biz.columnBasePath}`,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        articleSection: column.category,
        inLanguage: locale,
        wordCount: column.content.length,
        ...(column.keywords?.length ? { keywords: column.keywords.join(", ") } : {}),
      }}
    />
  );
}
