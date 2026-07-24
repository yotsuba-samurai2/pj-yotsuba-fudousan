import type { MetadataRoute } from "next";

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
    // 2026-07-25：/legal/sitemap.xml は実在しないルート（404）だったため広告を停止。
    // legal配下は本体 sitemap.xml に統合済み（sitemap.ts参照）。laborはSR_LAUNCHEDまで露出しない方針も維持。
    sitemap: ["https://luck428.com/sitemap.xml"],
  };
}
