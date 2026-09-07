import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { getColumnPage, getColumnPageLocales, columnPagePath } from "@/lib/columns";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ColumnCollectionJsonLd } from "@/components/seo/ColumnCollectionJsonLd";
import { CtaBand } from "@/components/shared/CtaBand";
import LegalColumnListContent from "./LegalColumnListContent";


const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  ja: {
    title: "コラム",
    description:
      "補助金の最新情報と採択のコツ、ビザ・在留資格申請のポイント、会社設立の手順、各種許認可の実務まで。元新聞記者としての取材経験と現場の視点を活かし、四葉行政書士事務所がわかりやすく解説するお役立ちコラムです。",
  },
  en: {
    title: "Column",
    description:
      "Latest info and approval tips on subsidies and grants, key points for visa and residence applications, company-formation steps, and the practicalities of various permits—explained clearly by Yotsuba Administrative Scrivener Office, drawing on a former journalist's reporting experience.",
  },
  "zh-tw": {
    title: "專欄",
    description:
      "補助金・補助款的最新資訊與獲選訣竅、簽證・在留資格申請要點、公司設立步驟，到各類許可認證的實務。四葉行政書士事務所以前新聞記者的採訪經驗，淺顯易懂地解說。",
  },
  zh: {
    title: "专栏",
    description:
      "补助金・补助款的最新资讯与获选窍门、签证・在留资格申请要点、公司设立步骤，到各类许可认证的实务。四叶行政书士事务所以前新闻记者的采访经验，通俗易懂地讲解。",
  },
};

export async function generateColumnMetadata(page: number): Promise<Metadata> {
  const locale = await getRequestLocale();
  const m = META_BY_LOCALE[locale] ?? META_BY_LOCALE.ja;
  const availableLocales = await getColumnPageLocales("legal", page);
  if (!availableLocales.includes(locale)) notFound();
  return buildPageMetadata({
    availableLocales,
    businessKey: "legal",
    title: page === 1 ? m.title : `${m.title} | ${page}`,
    description: m.description,
    path: columnPagePath("/legal/column", page),
    locale,
  });
}

export async function renderColumnList(page: number) {
  const locale = await getRequestLocale();
  const result = await getColumnPage("legal", locale, page);
  if (page > result.totalPages) notFound();
  const { columns } = result;
  const m = META_BY_LOCALE[locale] ?? META_BY_LOCALE.ja;

  return (
    <div>
      <BreadcrumbJsonLd businessKey="legal" items={[
        { name: "ホーム", href: "/legal" },
        { name: "コラム", href: "/legal/column" },
      ]} />
      {columns.length > 0 && (
        <ColumnCollectionJsonLd
          businessKey="legal"
          columns={columns}
          page={page}
          pageSize={result.pageSize}
          total={result.total}
          name={m.title}
          description={m.description}
          locale={locale}
        />
      )}
      <LegalColumnListContent columns={columns} page={page} total={result.total} totalPages={result.totalPages} />
      {/* ★2026-08-13 追加：CTA帯（LINE・お問い合わせ・電話）。
          3レーンとも column/[slug]・column・about だけ CtaBand が無く、
          PCでLINEへの導線が出ていなかった。contact / thanks には入れない。 */}
      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </div>
  );
}
