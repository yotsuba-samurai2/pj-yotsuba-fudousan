import { JsonLd } from "./JsonLd";
import { BUSINESS_SEO } from "@/lib/seo";

export function WebSiteJsonLd({ businessKey }: { businessKey: string }) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: biz.name,
        url: biz.url,
        publisher: { "@id": `${biz.url}/#organization` },
        inLanguage: "ja",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${biz.url}/column?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
