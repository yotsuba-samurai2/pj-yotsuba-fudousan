// RealEstateListingJsonLd — 物件詳細の構造化データ（組み立ては src/lib/property-jsonld.ts の純関数）。
// 入力は必ず PublicProperty（toPublicProperty のホワイトリスト経由）＝internal の混入経路を断つ。
// 募集終了・期限超過の物件はページ自体が404のため、ここに到達しない。
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, BCP47_BY_LOCALE, canonicalUrl } from "@/lib/seo";
import type { PublicProperty } from "@/lib/property-shared";
import { buildRealEstateListingJsonLd } from "@/lib/property-jsonld";
import type { LangCode } from "@/config/languages";

/** ルート相対はSITE_URLで絶対化し、絶対URL（Supabase等）はそのまま使う（二重連結バグの回避） */
function toAbsoluteImageUrl(url: string): string {
  return url.startsWith("/") ? `${SITE_URL}${url}` : url;
}

export function RealEstateListingJsonLd({ property, locale }: { property: PublicProperty; locale: LangCode }) {
  const data = buildRealEstateListingJsonLd(property, locale, {
    url: canonicalUrl("realestate", `/bukken/${property.slug}`, locale),
    siteUrl: SITE_URL,
    inLanguage: BCP47_BY_LOCALE[locale],
    images: property.images.map((img) => toAbsoluteImageUrl(img.url)),
  });
  return <JsonLd data={data} />;
}
