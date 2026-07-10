import type { MetadataRoute } from "next";
import { BUSINESS_URLS } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /labor はここに書かない（存在の露出防止＝手順書G-3）。/style-guide はnoindexメタで制御
        disallow: ["/thanks", "/api/", "/admin/"],
      },
      {
        // Bytespider（ByteDance系クローラ）は拒否（手順書G-3）
        userAgent: "Bytespider",
        disallow: "/",
      },
    ],
    // labor は SR_LAUNCHED=true まで BUSINESS_URLS に含まれない＝labor向けsitemapは生成されない
    sitemap: Object.values(BUSINESS_URLS).map((url) => `${url}/sitemap.xml`),
  };
}
