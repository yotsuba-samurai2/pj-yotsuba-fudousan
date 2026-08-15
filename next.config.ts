import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // GSC「見つかりませんでした(404)」対策の 301（Googleが保持する旧URL→現行URL）。
  // 正規のロケール構造は「/{locale}/legal/...」（locale先頭）。旧構造「/legal/{locale}/...」を恒久移転する。
  // ※locale セグメントは (en|zh-tw|zh) に限定＝ ja 素パス（/legal/about 等の現行ページ）には一致しない。
  //   zh-tw は zh より前に置く（最長一致でセグメント全体を取るため）。
  async redirects() {
    return [
      // statusCode: 301 を明示（permanent:true は 308 になるため。GSCレポート整合と互換性優先で 301 を使う）
      {
        source: "/legal/:locale(en|zh-tw|zh)/:path*",
        destination: "/:locale/legal/:path*",
        statusCode: 301,
      },
      {
        source: "/legal/:locale(en|zh-tw|zh)",
        destination: "/:locale/legal",
        statusCode: 301,
      },
      // 旧WordプレスのEN版トップ相当 → 現行EN版トップへ（リンク評価を温存）
      {
        source: "/en/home-en",
        destination: "/en",
        statusCode: 301,
      },
      // 社宅ページの統一（指示書10C・2026-07-29）。社宅は投資用でも事業用でもなく福利厚生のため
      // /toushi 配下から外し、主力の /shataku へ恒久統合する。4ロケールとも実在するため全て張る。
      {
        source: "/toushi/shataku",
        destination: "/shataku",
        statusCode: 301,
      },
      {
        source: "/:locale(en|zh-tw|zh)/toushi/shataku",
        destination: "/:locale/shataku",
        statusCode: 301,
      },
      // GSC 404対策（2026-08-15）: 台湾シリーズのコラム9本は zh-tw 版のみ実在する
      // （src/lib/data/taiwan-columns-seed.ts）。Googleが保持する ja素パス・en・zh の
      // ロケール違いURLを、実在する zh-tw の同一記事へ恒久移転してリンク評価を温存する。
      // ※スラッグは完全一致の列挙。ja に実在する /column/taiwan-inkan-shomei-isan-bunkatsu
      //   等には一致しない。将来 ja/en/zh 版を公開する場合は該当スラッグをここから外すこと。
      {
        source:
          "/column/:slug(taiwan|taiwan-souzoku-japan-fudosan|taiwan-souzoku-baikyaku|taiwan-souzoku-kanri-katsuyo|taiwan-jin-souzoku-tetsuzuki|taiwan-souzoku-guide|taiwan-tokyo-fudosan-toshi|bunkyo-shueki-bukken|taiwan-tetsuzuki-onestop)",
        destination: "/zh-tw/column/:slug",
        statusCode: 301,
      },
      {
        source:
          "/:locale(en|zh)/column/:slug(taiwan|taiwan-souzoku-japan-fudosan|taiwan-souzoku-baikyaku|taiwan-souzoku-kanri-katsuyo|taiwan-jin-souzoku-tetsuzuki|taiwan-souzoku-guide|taiwan-tokyo-fudosan-toshi|bunkyo-shueki-bukken|taiwan-tetsuzuki-onestop)",
        destination: "/zh-tw/column/:slug",
        statusCode: 301,
      },
      // ゴミURL「/&」（GSCが2026/05に検出）。samurai-app と同じ作法でトップへ逃がす。
      {
        source: "/&",
        destination: "/",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
