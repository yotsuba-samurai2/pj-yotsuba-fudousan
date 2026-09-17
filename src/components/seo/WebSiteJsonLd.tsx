import { JsonLd } from "./JsonLd";
import { SITE_URL } from "@/lib/seo";

/** ホスト共通のWebSiteノード@id。isPartOf等からの参照はこの@idを使う */
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * WebSite ノード（サイト名）— ホスト全体で1つ（SEO監査2026-08-24 P1-1）。
 *
 * Googleのサイト名はドメイン／サブドメイン単位でしか認識されず、サブディレクトリ
 * （/legal・/labor）に別サイト名を設定することはできない。旧実装は realestate／legal／labor の
 * 3つのWebSiteノードを別名で出力しており、Googleの仕様と整合しなかった。
 * ホスト全体のサイト名を「四葉グループ」に統一し、事業体名は各Organization
 * （RealEstateAgent／LegalService）とページtitle・H1側で表現する。
 * 出力箇所＝(realestate)/layout.tsx のみ（legal・laborのlayoutからは出力しない）。
 * https://developers.google.com/search/docs/appearance/site-names
 */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: "四葉グループ",
        // 2026-09-17 浦松決定：サイト名は「四葉グループ」に一本化。
        // 旧 alternateName に「四葉不動産」「四葉行政書士事務所」を並べていたところ、Googleは第1希望
        // （四葉グループ）の根拠不足と判断して代替名の「四葉行政書士事務所」を採用し、不動産トップや
        // 社労士ページまで行政書士名で表示されていた（2026-09-16 実測）。公式仕様＝第1希望が選ばれない
        // ときは alternateName を優先検討するため、事業体名を別名から外し、英語表記とドメインのみ残す
        // （ドメインは最後の保険・全小文字）。あわせてトップの og:site_name と title も「四葉グループ」で揃える。
        // https://developers.google.com/search/docs/appearance/site-names
        alternateName: ["Yotsuba Group", "luck428.com"],
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "ja",
        sameAs: [
          "https://www.samurai.co.jp/samurai/reserve/yotubahudousan",
          "https://www.samurai.co.jp/samurai/reserve/uramatsu-joji",
        ],
      }}
    />
  );
}
