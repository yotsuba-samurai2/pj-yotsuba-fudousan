import { buildPageMetadata } from "@/lib/seo";
import ServicesPageContent from "./ServicesPageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "サービス",
  description: "日本語・英語・中国語・タイ語・ベトナム語の5言語対応。行政書士のいる不動産屋だから、賃貸・売買・管理に加え契約や法務の相談もワンストップで対応します。",
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesPageContent />;
}
