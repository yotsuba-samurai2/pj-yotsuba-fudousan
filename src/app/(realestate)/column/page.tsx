import { buildPageMetadata } from "@/lib/seo";
import { getLatestColumns } from "@/lib/columns";
import ColumnListPageContent from "./ColumnListPageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "コラム",
  description: "日本での部屋探しのコツ、敷金・礼金の仕組み、文京区の暮らし情報など。5カ国在住経験のある元新聞記者が実体験をもとにわかりやすく解説します。",
  path: "/column",
});

export default function ColumnListPage() {
  const columns = getLatestColumns(20);

  return <ColumnListPageContent columns={columns} />;
}
