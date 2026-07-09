import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LaborAboutPageContent } from "./PageContent";

export const metadata = buildPageMetadata({
  businessKey: "labor",
  title: "事務所概要",
  description: "企業の人事・労務課題に寄り添う社労士事務所。4カ国在住経験を持つ代表のプロフィールと、四葉社会保険労務士事務所の理念をご紹介します。",
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
