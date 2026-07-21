import type { Metadata } from "next";
import type { LangCode } from "@/config/languages";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ContactPageClient } from "./ContactPageClient";

// パンくず（表示＋JSON-LD）のロケール別ラベル（翻訳チェック§H・2026-07-20）。
// お問い合わせ＝サイト内定訳（聯絡我們／联系我们）に統一。
const BREADCRUMB: Record<LangCode, { home: string; current: string }> = {
  ja: { home: "ホーム", current: "お問い合わせ" },
  en: { home: "Home", current: "Contact" },
  "zh-tw": { home: "首頁", current: "聯絡我們" },
  zh: { home: "首页", current: "联系我们" },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    // B2：社名はレイアウトのtitleテンプレート（%s | 四葉不動産）が付与＝ここでは書かない（重複防止）
    title: "お問い合わせ（初回相談無料）",
    description:
      "住まい探し・契約・相続不動産のご相談に四葉不動産が対応。ビザ・相続書類は併設の四葉行政書士事務所が別契約で受任します。多言語（日本語・英語・中国語繁体字・中国語簡体字）対応、電話・お問い合わせフォームから受付。初回相談は無料、四葉不動産までお気軽にどうぞ。",
    path: "/contact",
    keywords: [
      "不動産 相談",
      "不動産屋 問い合わせ",
      "初回相談 無料 不動産",
      "多言語 不動産 東京",
      "四葉不動産 連絡先",
    ],
    locale,
  });
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const bc = BREADCRUMB[locale] ?? BREADCRUMB.ja;
  return (
    <div>
      <BreadcrumbJsonLd businessKey="realestate" locale={locale} items={[
        { name: bc.home, href: "/" },
        { name: bc.current, href: "/contact" },
      ]} />
      <ContactPageClient />
    </div>
  );
}
