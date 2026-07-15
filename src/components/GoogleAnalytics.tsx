import Script from "next/script";

/**
 * GA4 計測タグ（gtag.js）。
 * NEXT_PUBLIC_GA_ID（例: G-DKFGP8LKNJ）が設定されている環境でのみ出力する。
 * Vercelでは Production 環境変数にのみ設定し、プレビューのアクセスが
 * 計測データを汚さない運用とする。SPA遷移のpage_viewはGA4の拡張計測
 * （ページの変更に基づく履歴イベント）で自動収集される。
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
