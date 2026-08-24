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
        alternateName: ["luck428.com", "四葉不動産", "四葉行政書士事務所"],
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
