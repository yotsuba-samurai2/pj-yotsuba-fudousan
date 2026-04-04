import { JsonLd } from "./JsonLd";
import { BUSINESS_SEO, SHARED_ORG_INFO } from "@/lib/seo";

export function OrganizationJsonLd({ businessKey }: { businessKey: string }) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": biz.schemaType,
        "@id": `${biz.url}/#organization`,
        name: biz.legalName,
        url: biz.url,
        logo: `${biz.url}${biz.ogImage}`,
        image: `${biz.url}${biz.ogImage}`,
        telephone: SHARED_ORG_INFO.telephone,
        foundingDate: SHARED_ORG_INFO.foundingDate,
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
        parentOrganization: {
          "@type": "Organization",
          name: SHARED_ORG_INFO.name,
          url: "https://yotsuba-fudousan.com",
        },
        knowsLanguage: ["ja", "en", "zh-Hant", "zh-Hans", "th"],
      }}
    />
  );
}
