import { JsonLd } from "./JsonLd";
import { BUSINESS_SEO, SHARED_ORG_INFO } from "@/lib/seo";

export type ServiceItem = {
  name: string;
  description: string;
};

export function ServiceJsonLd({
  businessKey,
  services,
}: {
  businessKey: string;
  services: ServiceItem[];
}) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz || services.length === 0) return null;

  return (
    <>
      {services.map((service, i) => (
        <JsonLd
          key={i}
          data={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            description: service.description,
            provider: { "@id": `${biz.url}/#organization` },
            areaServed: {
              "@type": "AdministrativeArea",
              name: SHARED_ORG_INFO.addressRegion,
            },
            availableLanguage: ["ja", "en", "zh-Hant", "zh-Hans"],
          }}
        />
      ))}
    </>
  );
}
