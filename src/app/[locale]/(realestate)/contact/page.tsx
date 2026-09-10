import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ContactPageClient } from "./ContactPageClient";
import { CONTACT_LABELS, CONTACT_METADATA } from "@/lib/shared/contact-page-copy";

// パンくず（表示＋JSON-LD）のロケール別ラベル（翻訳チェック§H・2026-07-20）。
// お問い合わせ＝サイト内定訳（聯絡我們／联系我们）に統一。
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    // B2：社名はレイアウトのtitleテンプレート（%s | 四葉不動産）が付与＝ここでは書かない（重複防止）
    ...CONTACT_METADATA.realestate[locale],
    path: "/contact",
    locale,
  });
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const bc = CONTACT_LABELS[locale];
  return (
    <div>
      <BreadcrumbJsonLd businessKey="realestate" locale={locale} items={[
        { name: bc.home, href: "/" },
        { name: bc.title, href: "/contact" },
      ]} />
      <ContactPageClient />
    </div>
  );
}
