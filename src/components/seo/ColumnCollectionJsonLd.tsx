// ColumnCollectionJsonLd — コラム一覧ページの CollectionPage + 入れ子 ItemList。
// 既存の per-script + #id 参照方式（BlogPostingJsonLd 等）に合わせる。
// WebSite ノードには @id が無いため isPartOf はインライン、publisher は既存 #organization を @id 参照。
import { JsonLd } from "./JsonLd";
import { canonicalUrl, BUSINESS_SEO } from "@/lib/seo";
import type { Column } from "@/lib/columns";
import type { LangCode } from "@/config/languages";

export function ColumnCollectionJsonLd({
  businessKey,
  columns,
  name,
  description,
  locale = "ja",
}: {
  businessKey: string;
  /** 現在ロケールで公開・並び替え済みのコラム配列 */
  columns: Column[];
  name: string;
  description: string;
  locale?: LangCode;
}) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz) return null;

  const listUrl = canonicalUrl(businessKey, biz.columnBasePath, locale);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${listUrl}#webpage`,
        url: listUrl,
        name,
        description,
        inLanguage: locale,
        isPartOf: {
          "@type": "WebSite",
          name: biz.name,
          url: biz.url,
        },
        publisher: { "@id": `${biz.url}/#organization` },
        mainEntity: {
          "@type": "ItemList",
          "@id": `${listUrl}#itemlist`,
          numberOfItems: columns.length,
          itemListElement: columns.map((col, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: canonicalUrl(
              businessKey,
              `${biz.columnBasePath}/${col.slug}`,
              locale,
            ),
            name: col.title,
          })),
        },
      }}
    />
  );
}
