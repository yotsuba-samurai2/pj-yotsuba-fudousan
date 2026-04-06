import { getLatestLegalColumns } from "@/lib/columns";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import LegalColumnListContent from "./LegalColumnListContent";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "コラム",
  description: "補助金・助成金の最新情報、ビザ申請のポイント、会社設立の手順など。元新聞記者の行政書士がわかりやすく解説するお役立ちコラム。",
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
