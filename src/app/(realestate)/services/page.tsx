import { buildPageMetadata } from "@/lib/seo";
import ServicesPageContent from "./ServicesPageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "サービス",
  description: "賃貸・売買・管理・多言語サポート。四葉不動産のサービス一覧です。",
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesPageContent />;
}
