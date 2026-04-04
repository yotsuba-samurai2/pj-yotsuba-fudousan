import { buildPageMetadata } from "@/lib/seo";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LaborPageContent } from "./PageContent";

export const metadata = buildPageMetadata({
  businessKey: "labor",
  title: "四葉社会保険労務士法人",
  description: "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉パートナーズの社労士法人が、企業の人事・労務をトータルサポートします。",
  path: "/labor",
});

export default function LaborPage() {
  return (
    <div>
      <FAQJsonLd items={[
        { question: "社労士に依頼するメリットは何ですか？", answer: "社会保険・労働保険の手続き、就業規則の作成・見直し、助成金の申請など、人事・労務の専門業務を正確に代行します。経営者の負担を軽減し、法令遵守を確保します。" },
        { question: "外国人従業員の雇用に関する相談もできますか？", answer: "はい、外国人従業員の社会保険手続きや労務管理に対応しています。グループの行政書士事務所（在留資格）・不動産（社宅探し）と連携し、採用から定着までワンストップで支援します。" },
        { question: "助成金の申請もサポートしてもらえますか？", answer: "はい、キャリアアップ助成金、両立支援等助成金など、企業が活用できる各種助成金の申請をサポートしています。行政書士事務所と連携し、補助金もカバーします。" },
      ]} />
      <BreadcrumbJsonLd businessKey="labor" items={[
        { name: "ホーム", href: "/labor" },
        { name: "サービス", href: "/labor" },
      ]} />
      <LaborPageContent />
    </div>
  );
}
