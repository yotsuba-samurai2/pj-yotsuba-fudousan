import Script from "next/script";
import { AUTOMATION_UA_PATTERN } from "@/lib/ga-bot-guard";

/**
 * GA4 計測タグ（gtag.js）。
 * NEXT_PUBLIC_GA_ID（例: G-DKFGP8LKNJ）が設定されている環境でのみ出力する。
 * Vercelでは Production 環境変数にのみ設定し、プレビューのアクセスが
 * 計測データを汚さない運用とする。SPA遷移のpage_viewはGA4の拡張計測
 * （ページの変更に基づく履歴イベント）で自動収集される。
 *
 * 2026-09-18 自動化トラフィックのガード（src/lib/ga-bot-guard.ts が判定の正本）：
 * 従来は <Script src=gtag.js> を無条件に出していたため、JavaScript を実行するクローラーも
 * 全員「ユーザー」として計上されていた（Singapore 958ユーザー・平均エンゲージメント0秒 等）。
 * gtag.js の読み込み自体をブラウザ側の判定の後ろへ移し、navigator.webdriver か既知の
 * 自動化UAに該当する場合は gtag.js を読み込まない（dataLayer も作らない＝gaEvent は no-op）。
 * 人のブラウザでの挙動は従来と同じ（gtag('js') → gtag('config')）。
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;
  // 正規表現はテンプレート文字列に source として埋め込む（テストで改行・バッククォート不在を保証）
  const uaPattern = AUTOMATION_UA_PATTERN.source;
  return (
    <Script id="ga4-init" strategy="afterInteractive">
      {`
        (function () {
          try {
            var ua = (navigator.userAgent || "");
            if (navigator.webdriver === true) return;
            if (!ua) return;
            if (new RegExp(${JSON.stringify(uaPattern)}, "i").test(ua)) return;
          } catch (e) { /* 判定に失敗しても計測は続ける */ }
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}');
          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://www.googletagmanager.com/gtag/js?id=${gaId}';
          document.head.appendChild(s);
        })();
      `}
    </Script>
  );
}
