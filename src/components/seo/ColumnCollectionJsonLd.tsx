// ColumnCollectionJsonLd — コラム一覧ページの CollectionPage + 入れ子 ItemList。
// 既存の per-script + #id 参照方式（BlogPostingJsonLd 等）に合わせる。
// isPartOf＝ホスト共通WebSite（四葉グループ・WEBSITE_ID）をインライン、publisher は既存 #organization を @id 参照。
import { JsonLd } from "./JsonLd";
import { WEBSITE_ID } from "./WebSiteJsonLd";
import { canonicalUrl, BUSINESS_SEO, SITE_URL } from "@/lib/seo";
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
        // サイト名はホスト単位＝「四葉グループ」1ノードに統一（SEO監査2026-08-24 P1-1）。
        // 事業体別のWebSite名をここで主張しない。@id・name は WebSiteJsonLd と同一
        // （legal配下ページ単体でもノードが解決できるようインラインで出力）
        isPartOf: {
          "@type": "WebSite",
          "@id": WEBSITE_ID,
          name: "四葉グループ",
          url: SITE_URL,
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
