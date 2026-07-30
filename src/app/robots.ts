import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /labor はここに書かない（存在の露出防止＝手順書G-3）。/style-guide はnoindexメタで制御
        //
        // 2026-07-30：`/_next/static/media/` を追加（浦松承認）。
        // GSCの「クロール済み - インデックス未登録」332本のうち **311本（94%）が .woff2 フォント**
        // だった。フォントURLは `?dpl=<デプロイID>` 付きで配信されるため、デプロイのたびに
        // 同一フォントが別URLとして再発見され、無限に積み上がる。
        // 一方で実ページ側は10本が「検出 - インデックス未登録／前回のクロール＝該当なし」＝
        // 一度もクロールされていない（内部リンク・sitemap・canonical・hreflangはいずれも正常と実測確認済み）。
        // フォントがクロール予算を圧迫しているという因果は**未検証**だが、止める副作用がないため実施する。
        //
        // 安全性：JS/CSSは `/_next/static/chunks/` 配下にあり、`/_next/static/media/` は woff2 のみ
        // （/legal/nagare の実HTMLで media 参照440件すべてが woff2・js/css は0件と確認）。
        // したがってGooglebotのレンダリングには影響しない。
        disallow: ["/thanks", "/api/", "/admin/", "/_next/static/media/"],
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
