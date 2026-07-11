import { JsonLd } from "./JsonLd";
import {
  BUSINESS_HOURS,
  BUSINESS_SEO,
  LEGAL_MEMBER_OF,
  LEGAL_SAME_AS,
  PERSON_ID,
  REALESTATE_MEMBER_OF,
  REALESTATE_SAME_AS,
  SHARED_ORG_INFO,
  SITE_URL,
} from "@/lib/seo";

export function OrganizationJsonLd({ businessKey }: { businessKey: string }) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz) return null;

  const isRealEstate = businessKey === "realestate";

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": biz.schemaType,
        "@id": `${biz.url}/#organization`,
        name: biz.legalName,
        alternateName: biz.name,
        url: biz.url,
        // アセットはルート配信のみ（実測2026-07-11：/legal/yotsuba/*.png=404、/yotsuba/*.png=200）
        // ＝結合ベースはbiz.urlでなくSITE_URL（realestateは出力同一）。logo=正方形ロゴ／image=OG優先で分離（P2仕様）
        logo: `${SITE_URL}${biz.squareLogo ?? biz.ogImage}`,
        image: `${SITE_URL}${biz.ogImage || biz.squareLogo || ""}`,
        description: biz.description,
        telephone: SHARED_ORG_INFO.telephone,
        priceRange: "¥¥",
        foundingDate: SHARED_ORG_INFO.foundingDate,
        ...(isRealEstate
          ? {
              slogan: "元新聞記者×行政書士がつくる、東京都文京区の不動産屋",
              sameAs: REALESTATE_SAME_AS,
              memberOf: REALESTATE_MEMBER_OF,
            }
          : {
              sameAs: LEGAL_SAME_AS,
              memberOf: LEGAL_MEMBER_OF,
            }),
        address: {
          "@type": "PostalAddress",
          postalCode: SHARED_ORG_INFO.postalCode,
          addressRegion: SHARED_ORG_INFO.addressRegion,
          addressLocality: SHARED_ORG_INFO.addressLocality,
          streetAddress: SHARED_ORG_INFO.streetAddress,
          addressCountry: SHARED_ORG_INFO.addressCountry,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SHARED_ORG_INFO.geo.latitude,
          longitude: SHARED_ORG_INFO.geo.longitude,
        },
        // GBP直リンク優先（P2仕様）。labor＝gbpUrl無し→geoからの自動生成へフォールバック
        hasMap:
          biz.gbpUrl ??
          `https://www.google.com/maps/search/?api=1&query=${SHARED_ORG_INFO.geo.latitude},${SHARED_ORG_INFO.geo.longitude}`,
        openingHoursSpecification: (
          BUSINESS_HOURS[businessKey] ?? BUSINESS_HOURS.realestate
        ).specs.map((s) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: s.dayOfWeek,
          opens: s.opens,
          closes: s.closes,
        })),
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: SHARED_ORG_INFO.telephone,
            contactType: "customer service",
            areaServed: "JP",
            availableLanguage: ["Japanese", "English", "Chinese"],
          },
        ],
        // parentOrganization（「四葉パートナーズ」）は削除（2026-07-10浦松確認＝登記実体ではない。
        // 各事業は別事業体・独立受任＝親子関係を構造化データで主張しない。関係はfounder共通@idで表現）
        founder: {
          "@type": "Person",
          "@id": PERSON_ID,
          name: SHARED_ORG_INFO.representative,
        },
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: SHARED_ORG_INFO.geo.latitude,
            longitude: SHARED_ORG_INFO.geo.longitude,
          },
          geoRadius: "50000",
        },
        knowsLanguage: ["ja", "en", "zh-Hant", "zh-Hans"],
        ...(isRealEstate
          ? {
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "賃貸仲介" },
                },
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "売買仲介" },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "相続不動産コンサルティング",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "外国人向け住居サポート（日本語・英語・中国語繁体字・中国語簡体字対応）",
                  },
                },
              ],
            }
          : {}),
      }}
    />
  );
}
