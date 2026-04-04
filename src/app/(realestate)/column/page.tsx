import { buildPageMetadata } from "@/lib/seo";
import { getLatestColumns } from "@/lib/columns";
import ColumnListPageContent from "./ColumnListPageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "コラム",
  description: "四葉不動産のコラム。外国人の住まい探し、賃貸・売買の豆知識、文京区の地域情報など、不動産にまつわるお役立ち情報をお届けします。",
  path: "/column",
});

export default function ColumnListPage() {
  const columns = getLatestColumns(20);

  return <ColumnListPageContent columns={columns} />;
}
