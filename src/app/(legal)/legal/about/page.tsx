import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import LegalAboutPageContent from "./LegalAboutPageContent";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "会社概要",
  description: "5カ国で暮らした元新聞記者が、取材で培った情報収集力と文章力を活かして行政書士に。補助金・助成金、ビザ、会社設立、許認可までワンストップで対応。文京区の四葉行政書士事務所の理念とバックグラウンドをご紹介します。",
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
