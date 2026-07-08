import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import ServicesPageContent from "./ServicesPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "サービス | 賃貸・売買・相続・外国人住居サポート",
    description:
      "賃貸・売買・管理から相続不動産、オーナー向けコンサルティングまで、東京の不動産取引をワンストップで対応。多言語（日本語・英語・中国語）対応、契約書類は行政書士が監修。四葉不動産のサービス一覧です。",
    path: "/services",
    keywords: [
      "東京 賃貸",
      "東京 売買",
      "不動産管理",
      "相続不動産 コンサル",
      "外国人 賃貸 東京",
      "オーナー 物件管理",
    ],
    locale,
  });
}

export default function ServicesPage() {
  return <ServicesPageContent />;
}
