import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ContactPageClient } from "./ContactPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "お問い合わせ | 四葉不動産（初回相談無料）",
    description:
      "住まい探し・契約・相続不動産・ビザまで、不動産と行政書士がワンストップで対応。多言語（日本語・英語・中国語）対応、電話・お問い合わせフォーム・オンライン予約から受付。初回相談は無料、四葉不動産までお気軽にどうぞ。",
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

export default function ContactPage() {
  return (
    <div>
      <BreadcrumbJsonLd businessKey="realestate" items={[
        { name: "ホーム", href: "/" },
        { name: "お問い合わせ", href: "/contact" },
      ]} />
      <ContactPageClient />
    </div>
  );
}
