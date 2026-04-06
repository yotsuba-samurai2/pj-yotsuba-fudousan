import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LaborColumnListPageContent } from "./PageContent";

export const metadata = buildPageMetadata({
  businessKey: "labor",
  title: "コラム",
  description: "社会保険手続きの実務、使える助成金情報、就業規則のポイントなど。企業の人事・労務担当者に役立つ実践コラム。",
  path: "/labor/column",
});

export default function LaborColumnListPage() {
  return (
    <div>
      <BreadcrumbJsonLd businessKey="labor" items={[
        { name: "ホーム", href: "/labor" },
        { name: "コラム", href: "/labor/column" },
      ]} />
      <LaborColumnListPageContent />
    </div>
  );
}
