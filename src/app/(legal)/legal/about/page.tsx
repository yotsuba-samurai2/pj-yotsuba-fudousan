import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import LegalAboutPageContent from "./LegalAboutPageContent";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "会社概要",
  description: "四葉行政書士事務所の会社概要・代表紹介。文京区小日向の行政書士事務所です。",
  path: "/legal/about",
});

export default function LegalAboutPage() {
  return (
    <div>
      <BreadcrumbJsonLd businessKey="legal" items={[
        { name: "ホーム", href: "/legal" },
        { name: "事務所概要", href: "/legal/about" },
      ]} />
      <LegalAboutPageContent />
    </div>
  );
}
