import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ContactPageClient } from "./ContactPageClient";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "お問い合わせ | 四葉パートナーズ",
  description: "四葉パートナーズへのお問い合わせ。不動産・行政書士・社労士、どんなご相談でもお気軽にどうぞ。",
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
