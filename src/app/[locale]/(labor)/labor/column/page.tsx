import { generateColumnMetadata, renderColumnList } from "./ColumnListPage";

export async function generateMetadata() {
  return generateColumnMetadata(1);
}

export default async function Page() {
  return renderColumnList(1);
}
