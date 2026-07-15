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
    ];
  },
};

export default nextConfig;
