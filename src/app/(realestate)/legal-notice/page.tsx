import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LegalNoticePageClient } from "./LegalNoticePageClient";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "宅建業法に基づく表記 | 四葉不動産",
  description: "四葉不動産株式会社の宅地建物取引業法に基づく表記。",
  path: "/legal-notice",
});

export default function LegalNoticePage() {
  return (
    <div>
      <BreadcrumbJsonLd businessKey="realestate" items={[
        { name: "ホーム", href: "/" },
        { name: "宅建業法に基づく表記", href: "/legal-notice" },
      ]} />
      <LegalNoticePageClient />
    </div>
  );
}
