import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LaborAboutPageContent } from "./PageContent";

export const metadata = buildPageMetadata({
  businessKey: "labor",
  title: "事務所概要",
  description: "四葉社会保険労務士法人（設立準備中）の事務所概要・代表紹介。",
  path: "/labor/about",
});

export default function LaborAboutPage() {
  return (
    <div>
      <BreadcrumbJsonLd businessKey="labor" items={[
        { name: "ホーム", href: "/labor" },
        { name: "事務所概要", href: "/labor/about" },
      ]} />
      <LaborAboutPageContent />
    </div>
  );
}
