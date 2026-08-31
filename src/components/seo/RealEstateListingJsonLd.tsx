// RealEstateListingJsonLd — 物件詳細の構造化データ。
// @type=RealEstateListing（schema.org一次確認2026-09-01：WebPageのサブタイプ・datePosted所持。
// Googleのリッチリザルト対応一覧に不動産リスティング用タイプは無い＝目的はエンティティ明確化）。
// availability は出力しない（2026-09-01浦松修正指示5）。
// closed（募集終了）では offers を出さない＝古い価格を再配布しない。
// 入力は必ず PublicProperty（toPublicProperty のホワイトリスト経由）＝internal の混入経路を断つ。
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, BCP47_BY_LOCALE, canonicalUrl } from "@/lib/seo";
import { walkMinutes, type PublicProperty } from "@/lib/property-shared";
import type { LangCode } from "@/config/languages";

/** ルート相対はSITE_URLで絶対化し、絶対URL（Supabase等）はそのまま使う（二重連結バグの回避） */
function toAbsoluteImageUrl(url: string): string {
  return url.startsWith("/") ? `${SITE_URL}${url}` : url;
}

export function RealEstateListingJsonLd({
  property,
  locale,
}: {
  property: PublicProperty;
  locale: LangCode;
}) {
  const url = canonicalUrl("realestate", `/bukken/${property.slug}`, locale);
  const images = property.images.map((img) => toAbsoluteImageUrl(img.url));

  // 土地・事業用建物には schema.org に適合する Accommodation 系タイプが無いため
  // mainEntity は住宅系のみ（未検証の型を使わない＝診断書D承認どおり）
  const mainEntity =
    property.dealType === "house"
      ? { "@type": "House", name: property.title }
      : property.dealType === "condo"
        ? { "@type": "Apartment", name: property.title }
        : undefined;

  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    url,
    name: property.title,
    inLanguage: BCP47_BY_LOCALE[locale],
    ...(property.publishedAt ? { datePosted: property.publishedAt } : {}),
    dateModified: property.infoUpdatedAt,
    ...(images.length > 0 ? { image: images } : {}),
    ...(property.access.length > 0
      ? {
          description: `${property.locationText}／${property.access
            .map((a) => `${a.line}${a.station}駅 徒歩${walkMinutes(a.distanceM)}分`)
            .join("・")}`,
        }
      : { description: property.locationText }),
    ...(mainEntity ? { mainEntity } : {}),
    ...(property.status === "published"
      ? {
          offers: {
            "@type": "Offer",
            price: property.priceYen,
            priceCurrency: "JPY",
            offeredBy: { "@id": `${SITE_URL}/#organization` },
          },
        }
      : {}),
  };

  return <JsonLd data={data} />;
}
