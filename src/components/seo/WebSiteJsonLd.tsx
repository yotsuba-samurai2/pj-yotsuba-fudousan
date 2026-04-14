import { JsonLd } from "./JsonLd";
import { BUSINESS_SEO } from "@/lib/seo";

const WEBSITE_SAME_AS: Record<string, string[]> = {
  realestate: [
    "https://www.samurai.co.jp/samurai/reserve/yotubahudousan",
    "https://luck428.com/legal",
  ],
  legal: [
    "https://www.samurai.co.jp/samurai/reserve/uramatsu-joji",
    "https://luck428.com",
  ],
};

export function WebSiteJsonLd({ businessKey }: { businessKey: string }) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz) return null;

  const sameAs = WEBSITE_SAME_AS[businessKey];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: biz.name,
        url: biz.url,
        publisher: { "@id": `${biz.url}/#organization` },
        inLanguage: "ja",
        ...(sameAs ? { sameAs } : {}),
      }}
    />
  );
}
