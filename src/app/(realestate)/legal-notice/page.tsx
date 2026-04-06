import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LegalNoticePageClient } from "./LegalNoticePageClient";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "宅建業法に基づく表記",
  description: "四葉不動産株式会社の宅建業免許番号・事務所所在地・代表者情報など、宅地建物取引業法に基づく法定開示事項を掲載しています。",
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
