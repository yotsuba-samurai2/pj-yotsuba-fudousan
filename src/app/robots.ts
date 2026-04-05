import type { MetadataRoute } from "next";
import { BUSINESS_URLS } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/thanks", "/api/", "/admin/"],
      },
    ],
    sitemap: Object.values(BUSINESS_URLS).map((url) => `${url}/sitemap.xml`),
  };
}
