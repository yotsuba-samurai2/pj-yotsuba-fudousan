import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ColumnCollectionJsonLd } from "@/components/seo/ColumnCollectionJsonLd";
import { CtaBand } from "@/components/shared/CtaBand";
import { getColumnPage, getColumnPageLocales, columnPagePath } from "@/lib/columns";
import { notFound } from "next/navigation";
import { LaborColumnListPageContent } from "./PageContent";


const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  ja: {
    title: "コラム",
    description:
      "社会保険手続きの実務、使える助成金情報、就業規則のポイントなど。企業の人事・労務担当者に役立つ実践コラム。",
  },
  en: {
    title: "Column",
    description:
      "Practical social-insurance procedures, useful grant information, key points on work rules, and more—a practical column for corporate HR and labor staff.",
  },
  "zh-tw": {
    title: "專欄",
    description:
      "社會保險手續實務、可運用的補助金資訊、就業規則要點等。為企業人事・勞務負責人提供的實用專欄。",
  },
  zh: {
    title: "专栏",
    description:
      "社会保险手续实务、可运用的补助金资讯、就业规则要点等。为企业人事・劳务负责人提供的实用专栏。",
  },
};

export async function generateColumnMetadata(page: number): Promise<Metadata> {
  const locale = await getRequestLocale();
  const m = META_BY_LOCALE[locale] ?? META_BY_LOCALE.ja;
  const availableLocales = await getColumnPageLocales("labor", page);
  if (!availableLocales.includes(locale)) notFound();
  return buildPageMetadata({
    availableLocales,
    businessKey: "labor",
    title: page === 1 ? m.title : `${m.title} | ${page}`,
    description: m.description,
    path: columnPagePath("/labor/column", page),
    locale,
  });
}

/**
 * 2026-09-03：コラム一覧をサーバー取得に変更。
 * 旧実装は PageContent がクライアントで取得しており、初期HTMLに記事リンクが
 * 1本も無かった（クローラーから一覧が空に見え、コラムが内部リンクで発見されない）。
 * 不動産・行政書士の一覧と同じく、ここで取得して props で渡す。
 * 一覧は20件ずつSQLでページ分割し、古い記事にもリンクで到達できる。
 */
export async function renderColumnList(page: number) {
  const locale = await getRequestLocale();
  const result = await getColumnPage("labor", locale, page);
  if (page > result.totalPages) notFound();
  const { columns } = result;
  const m = META_BY_LOCALE[locale] ?? META_BY_LOCALE.ja;

  return (
    <div>
      <BreadcrumbJsonLd businessKey="labor" items={[
        { name: "ホーム", href: "/labor" },
        { name: "コラム", href: "/labor/column" },
      ]} />
      {columns.length > 0 && (
        <ColumnCollectionJsonLd
          businessKey="labor"
          columns={columns}
          page={page}
          pageSize={result.pageSize}
          total={result.total}
          name={m.title}
          description={m.description}
          locale={locale}
        />
      )}
      <LaborColumnListPageContent columns={columns} page={page} total={result.total} totalPages={result.totalPages} />
      {/* ★2026-08-13 追加：CTA帯（LINE・お問い合わせ・電話）。
          3レーンとも column/[slug]・column・about だけ CtaBand が無く、
          PCでLINEへの導線が出ていなかった。contact / thanks には入れない。 */}
      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </div>
  );
}
