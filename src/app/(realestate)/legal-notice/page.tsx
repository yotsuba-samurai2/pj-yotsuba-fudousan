import type { Metadata } from "next";
import type { LangCode } from "@/config/languages";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LegalNoticePageClient } from "./LegalNoticePageClient";

// パンくず（表示＋JSON-LD）のロケール別ラベル（翻訳チェック§H・2026-07-20）。
// 「宅建業法に基づく表記」の中文はサイト内「宅地建物交易」表記に統一。
const BREADCRUMB: Record<LangCode, { home: string; current: string }> = {
  ja: { home: "ホーム", current: "宅建業法に基づく表記" },
  en: { home: "Home", current: "Notation Based on the Building Lots and Buildings Transaction Business Act" },
  "zh-tw": { home: "首頁", current: "依宅地建物交易業法之標示" },
  zh: { home: "首页", current: "依宅地建物交易业法之标示" },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    // title：Bing Webmaster Tools「タイトルが短すぎる」対応（2026-07-25）＝実際の掲載項目
    // （免許番号・専任の宅地建物取引士）だけを足して最終表示30〜40字に（報酬額等は本ページ非掲載＝書かない）。
    // 社名はレイアウトのtitleテンプレート（%s | 四葉不動産）が付与＝ここでは書かない（重複防止）。
    title: "宅建業法に基づく表記｜免許番号・専任の宅地建物取引士",
    description: "四葉不動産株式会社の宅地建物取引業免許番号、事務所所在地、代表者情報、取引態様、所属団体、保証協会など、宅地建物取引業法第50条に基づく法定開示事項を掲載しています。安心してお取引いただくための情報です。",
    path: "/legal-notice",
    locale,
  });
}

export default async function LegalNoticePage() {
  const locale = await getRequestLocale();
  const bc = BREADCRUMB[locale] ?? BREADCRUMB.ja;
  return (
    <div>
      <BreadcrumbJsonLd businessKey="realestate" locale={locale} items={[
        { name: bc.home, href: "/" },
        { name: bc.current, href: "/legal-notice" },
      ]} />
      <LegalNoticePageClient />
    </div>
  );
}
