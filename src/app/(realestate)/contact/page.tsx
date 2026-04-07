import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ContactPageClient } from "./ContactPageClient";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "お問い合わせ",
  description: "住まい探し・契約・相続不動産・ビザ・労務まで、不動産と行政書士・社労士がワンストップで対応。日英中タイベトナム5言語対応、電話・お問い合わせフォーム・オンライン予約から受付。初回相談は無料、文京区の四葉不動産までお気軽にどうぞ。",
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
