import { notFound, permanentRedirect } from "next/navigation";
import { parseColumnPage } from "@/lib/columns";
import { addLocalePrefix } from "@/lib/locale";
import type { LangCode } from "@/config/languages";
import { generateColumnMetadata, renderColumnList } from "../../ColumnListPage";

// 既存ISRを継承。追加記事でページ数が増えた場合もオンデマンド生成する。
export const dynamicParams = true;
export function generateStaticParams() { return []; }

type Props = { params: Promise<{ locale: LangCode; page: string }> };

async function pageNumber(params: Props["params"]) {
  const { page: value, locale } = await params;
  const page = parseColumnPage(value);
  if (page === undefined) notFound();
  if (page === 1) permanentRedirect(addLocalePrefix("/column", locale));
  return page;
}

export async function generateMetadata({ params }: Props) {
  return generateColumnMetadata(await pageNumber(params));
}

export default async function Page({ params }: Props) {
  return renderColumnList(await pageNumber(params));
}
