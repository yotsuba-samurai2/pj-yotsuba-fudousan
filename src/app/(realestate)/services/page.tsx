import { buildPageMetadata } from "@/lib/seo";
import ServicesPageContent from "./ServicesPageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "サービス",
  description: "賃貸・売買・管理から相続不動産、オーナー向けコンサルティングまで、東京の不動産取引をワンストップで対応。日本語・英語・中国語・タイ語・ベトナム語の5言語対応、契約書類は行政書士が監修。文京区を拠点に四葉不動産がお届けするサービス一覧です。",
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesPageContent />;
}
