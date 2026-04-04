import { getLatestLaborColumns } from "@/lib/columns";

import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LaborColumnListPageContent } from "./PageContent";

export const metadata = buildPageMetadata({
  businessKey: "labor",
  title: "コラム",
  description: "四葉社会保険労務士法人のコラム。社会保険、助成金、労務管理など、人事・労務にまつわるお役立ち情報をお届けします。",
  path: "/labor/column",
});

export default function LaborColumnListPage() {
  const columns = getLatestLaborColumns(20);
  return (
    <div>
      <BreadcrumbJsonLd businessKey="labor" items={[
        { name: "ホーム", href: "/labor" },
        { name: "コラム", href: "/labor/column" },
      ]} />
      <LaborColumnListPageContent columns={columns} />
    </div>
  );
}
