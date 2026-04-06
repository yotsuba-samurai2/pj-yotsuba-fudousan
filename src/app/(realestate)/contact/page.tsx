import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ContactPageClient } from "./ContactPageClient";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "お問い合わせ | 四葉パートナーズ",
  description: "住まい探し・ビザ・労務まで、不動産・行政書士・社労士がワンストップで回答。5言語対応、電話・フォーム・オンライン予約で気軽に相談できます。",
  path: "/contact",
});

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
