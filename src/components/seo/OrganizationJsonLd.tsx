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
        legalName: biz.legalName,
        // 同名他社との識別：別名（配列）・法人番号（taxID）・公的識別子（identifier）
        alternateName: biz.alternateNames ?? biz.name,
        ...(biz.taxID ? { taxID: biz.taxID } : {}),
        ...(biz.identifiers
          ? {
              identifier: biz.identifiers.map((i) => ({
                "@type": "PropertyValue",
                propertyID: i.propertyID,
                value: i.value,
              })),
            }
          : {}),
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
          // 社会保険労務士は登録未了（2026年9月開業予定）のため出力しない
          hasCredential: [
            {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "国家資格",
              name: "宅地建物取引士",
              identifier: "登録番号（東京）第293544号",
              recognizedBy: {
                "@type": "GovernmentOrganization",
                name: "東京都",
              },
            },
            {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "国家資格",
              name: "行政書士",
              identifier: "登録番号 第25087022号",
              recognizedBy: {
                "@type": "Organization",
                name: "日本行政書士会連合会",
              },
            },
          ],
          sameAs: [
            "https://www.wikidata.org/wiki/Q139738129",
            "https://orcid.org/0009-0007-0460-3473",
            "https://www.samurai.co.jp/samurai/reserve/uramatsu-joji",
          ],
          knowsAbout: [
            {
              "@type": "Thing",
              name: "相続",
              sameAs: "https://www.wikidata.org/wiki/Q200303",
            },
            {
              "@type": "Thing",
              name: "不動産",
              sameAs: "https://www.wikidata.org/wiki/Q684740",
            },
            {
              "@type": "Thing",
              name: "障害者福祉",
              sameAs: "https://www.wikidata.org/wiki/Q11658995",
            },
            {
              "@type": "Thing",
              name: "児童発達支援",
              sameAs: "https://www.wikidata.org/wiki/Q120340950",
            },
            {
              "@type": "Thing",
              name: "放課後等デイサービス",
              sameAs: "https://www.wikidata.org/wiki/Q11499003",
            },
            {
              "@type": "Thing",
              name: "人的資源管理",
              sameAs: "https://www.wikidata.org/wiki/Q1056396",
            },
            {
              "@type": "Thing",
              name: "人工知能",
              sameAs: "https://www.wikidata.org/wiki/Q11660",
            },
          ],
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