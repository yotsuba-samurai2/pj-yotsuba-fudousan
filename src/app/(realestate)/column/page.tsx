import { buildPageMetadata } from "@/lib/seo";
import ColumnListPageContent from "./ColumnListPageContent";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "コラム | 不動産・暮らし・相続のお役立ち情報",
  description:
    "東京の部屋探しのコツ、敷金・礼金の仕組み、契約書の読み方、暮らし情報、相続不動産の基礎知識まで。元新聞記者としての取材経験と行政書士の専門知識を活かし、四葉不動産が実体験を交えてわかりやすく解説するお役立ちコラムです。",
  path: "/column",
  keywords: [
    "不動産 コラム",
    "部屋探し コツ",
    "敷金 礼金",
    "不動産契約書 読み方",
    "相続不動産 基礎知識",
  ],
});

export default function ColumnListPage() {
  return <ColumnListPageContent />;
}
