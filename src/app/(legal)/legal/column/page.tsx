import { getLatestLegalColumns } from "@/lib/columns";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import LegalColumnListContent from "./LegalColumnListContent";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "コラム",
  description: "四葉行政書士事務所のコラム。補助金・助成金、ビザ申請、会社設立など、法務にまつわるお役立ち情報をお届けします。",
  path: "/legal/column",
});

export default function LegalColumnListPage() {
  const columns = getLatestLegalColumns(20);
  return (
    <div>
      <BreadcrumbJsonLd businessKey="legal" items={[
        { name: "ホーム", href: "/legal" },
        { name: "コラム", href: "/legal/column" },
      ]} />
      <LegalColumnListContent columns={columns} />
    </div>
  );
}
