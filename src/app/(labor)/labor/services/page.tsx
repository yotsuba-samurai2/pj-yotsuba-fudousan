import { buildPageMetadata } from "@/lib/seo";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ServiceJsonLd } from "@/components/seo/ServiceJsonLd";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { LaborPageContent } from "../PageContent";

export const metadata = buildPageMetadata({
  businessKey: "labor",
  title: "サービス",
  description:
    "社会保険手続き・労務管理をトータルサポート。助成金の申請代行、就業規則の整備、労使トラブル予防まで。行政書士・不動産と連携し企業の人事・労務を一括支援。",
  path: "/labor/services",
});

export default function LaborServicesPage() {
  return (
    <div>
      <FAQJsonLd
        items={[
          {
            question: "社労士に依頼するメリットは何ですか？",
            answer:
              "社会保険・労働保険の手続き、就業規則の作成・見直し、助成金の申請など、人事・労務の専門業務を正確に代行します。経営者の負担を軽減し、法令遵守を確保します。",
          },
          {
            question: "外国人従業員の雇用に関する相談もできますか？",
            answer:
              "はい、外国人従業員の社会保険手続きや労務管理に対応しています。グループの行政書士事務所（在留資格）・不動産（社宅探し）と連携し、採用から定着までワンストップで支援します。",
          },
          {
            question: "助成金の申請もサポートしてもらえますか？",
            answer:
              "はい、キャリアアップ助成金、両立支援等助成金など、企業が活用できる各種助成金の申請をサポートしています。行政書士事務所と連携し、補助金もカバーします。",
          },
        ]}
      />
      <BreadcrumbJsonLd
        businessKey="labor"
        items={[
          { name: "ホーム", href: "/labor" },
          { name: "サービス", href: "/labor/services" },
        ]}
      />
      <ServiceJsonLd
        businessKey="labor"
        services={[
          {
            name: "社会保険手続き",
            description:
              "健康保険・厚生年金の資格取得届、算定基礎届など社会保険関連の手続きを代行します。",
          },
          {
            name: "労働保険手続き",
            description:
              "雇用保険・労災保険の成立届、年度更新など労働保険関連の手続きを代行します。",
          },
          {
            name: "就業規則作成",
            description:
              "会社の実態に合った就業規則の作成・見直しを行い、労使トラブルを未然に防ぎます。",
          },
          {
            name: "助成金申請",
            description:
              "キャリアアップ助成金、両立支援等助成金など企業が活用できる各種助成金の申請をサポートします。",
          },
        ]}
      />
      <HowToJsonLd
        name="助成金申請の流れ"
        description="四葉社会保険労務士事務所での助成金申請手続きの流れをご紹介します。"
        steps={[
          {
            name: "無料相談・ヒアリング",
            text: "お電話またはお問い合わせフォームからご連絡ください。企業の状況に合った助成金をご提案します。",
          },
          {
            name: "計画書の作成・届出",
            text: "助成金の種類に応じた計画書を作成し、管轄のハローワークまたは労働局へ届出します。",
          },
          {
            name: "取り組みの実施",
            text: "計画書に基づいて必要な取り組み（研修、制度導入等）を実施します。実施内容の記録もサポートします。",
          },
          {
            name: "支給申請",
            text: "取り組み完了後、必要書類を揃えて支給申請を行います。",
          },
          {
            name: "助成金の受給",
            text: "審査完了後、助成金が企業の口座に振り込まれます。",
          },
        ]}
      />
      <LaborPageContent />
    </div>
  );
}
