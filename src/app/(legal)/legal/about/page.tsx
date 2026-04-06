import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import LegalAboutPageContent from "./LegalAboutPageContent";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "会社概要",
  description: "5カ国で暮らした元新聞記者が行政書士に。記者経験で培った取材力と文章力を武器に、補助金・ビザ・会社設立を支援する事務所の理念と代表紹介。",
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
