import { JsonLd } from "./JsonLd";
import { canonicalUrl, BUSINESS_SEO } from "@/lib/seo";

export function SpeakableJsonLd({
  businessKey,
  path,
  headline,
  summary,
}: {
  businessKey: string;
  path: string;
  headline: string;
  summary: string;
}) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz) return null;

  const url = canonicalUrl(businessKey, path);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: headline,
        url,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".article-headline", ".article-summary"],
        },
      }}
    />
  );
}
