import { JsonLd } from "./JsonLd";
import { canonicalUrl, BUSINESS_SEO, PERSON_ID, SHARED_ORG_INFO } from "@/lib/seo";

/**
 * 静的なピラーページ（コラム記事ではない、/souzoku のような常設ページ）向けの
 * 軽量な Article JSON-LD。
 *
 * コラム記事本体には既存の `BlogPostingJsonLd`（`Column`型に依存）を使うこと。
 * こちらは `Column` 型を要求しない代わりに、author/日付などコラム固有の項目を持たない。
 *
 * NOTE(Fable引き継ぎ): 現状は page.tsx の metadata と同じ title/description を
 * そのまま渡すプレースホルダ配線。本文確定後に実際の見出し・要約・画像に差し替えること。
 */
export function ArticleJsonLd({
  businessKey,
  title,
  description,
  path,
  image,
  datePublished,
  dateModified,
}: {
  businessKey: string;
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz) return null;

  const url = canonicalUrl(businessKey, path);
  const imageUrl = image ? `${biz.url}${image}` : `${biz.url}${biz.ogImage}`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        headline: title,
        description,
        image: {
          "@type": "ImageObject",
          url: imageUrl,
        },
        author: {
          "@type": "Person",
          "@id": PERSON_ID,
          name: SHARED_ORG_INFO.representative,
          url: "https://luck428.com/about",
        },
        publisher: { "@id": `${biz.url}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
      }}
    />
  );
}
