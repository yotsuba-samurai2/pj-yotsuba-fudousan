import { buildPageMetadata } from "@/lib/seo";
import ColumnListPageContent from "./ColumnListPageContent";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "コラム",
  description: "東京の部屋探しのコツ、敷金・礼金の仕組み、契約書の読み方、文京区の暮らし情報、相続不動産の基礎知識まで。元新聞記者としての取材経験と行政書士の専門知識を活かし、四葉不動産が実体験を交えてわかりやすく解説するお役立ちコラムです。",
  path: "/column",
});

export default function ColumnListPage() {
  return <ColumnListPageContent />;
}
