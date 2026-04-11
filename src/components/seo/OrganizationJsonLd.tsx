import { JsonLd } from "./JsonLd";
import { BUSINESS_SEO, SHARED_ORG_INFO } from "@/lib/seo";

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
        logo: `${biz.url}${biz.ogImage}`,
        image: `${biz.url}${biz.ogImage}`,
        description: biz.description,
        telephone: SHARED_ORG_INFO.telephone,
        foundingDate: SHARED_ORG_INFO.foundingDate,
        ...(isRealEstate
          ? {
              slogan: "元新聞記者×行政書士がつくる、東京都文京区の不動産屋",
            }
          : {}),
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
        hasMap: `https://www.google.com/maps/search/?api=1&query=${SHARED_ORG_INFO.geo.latitude},${SHARED_ORG_INFO.geo.longitude}`,
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: SHARED_ORG_INFO.telephone,
            contactType: "customer service",
            areaServed: "JP",
            availableLanguage: ["Japanese", "English", "Chinese"],
          },
        ],
        parentOrganization: {
          "@type": "Organization",
          name: SHARED_ORG_INFO.name,
          url: "https://luck428.com",
        },
        founder: {
          "@type": "Person",
          name: SHARED_ORG_INFO.representative,
          jobTitle: "代表取締役",
          description:
            "元新聞記者として5カ国で取材経験を積んだ後、行政書士資格を取得。国際的な視点と法務知識を活かし、外国人居住者や相続不動産の案件に強みを持つ。",
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
                    name: "外国人向け住居サポート（日本語・英語・中国語対応）",
                  },
                },
              ],
            }
          : {}),
      }}
    />
  );
}
