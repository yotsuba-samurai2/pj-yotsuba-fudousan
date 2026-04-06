import { buildPageMetadata } from "@/lib/seo";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ServiceJsonLd } from "@/components/seo/ServiceJsonLd";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import LegalPageContent from "../LegalPageContent";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "四葉行政書士事務所 | サービス一覧",
  description: "元記者が書く「通る申請書」で補助金採択率UP。ビザ申請・会社設立・許認可もワンストップ。不動産・社労士と連携し、事業の立ち上げから運営までを総合支援します。",
  path: "/legal/services",
});

export default function LegalServicesPage() {
  return (
    <div>
      <FAQJsonLd items={[
        { question: "行政書士に補助金申請を頼むメリットは？", answer: "元新聞記者の文章力を活かした説得力のある申請書を作成します。事業計画の「伝え方」が採択のカギとなる補助金申請では、記者経験が大きな強みになります。" },
        { question: "外国人のビザ申請にも対応していますか？", answer: "はい、就労ビザ、経営・管理ビザ、配偶者ビザなど各種在留資格の取得・更新・変更に対応しています。5言語対応で外国人ご本人との直接やり取りも可能です。" },
        { question: "不動産と法務をまとめて相談できますか？", answer: "はい、四葉パートナーズグループでは不動産（四葉不動産）と行政書士事務所が連携し、事務所の賃貸契約と会社設立手続きなどをワンストップで対応できます。" },
      ]} />
      <BreadcrumbJsonLd businessKey="legal" items={[
        { name: "ホーム", href: "/legal" },
        { name: "サービス", href: "/legal/services" },
      ]} />
      <ServiceJsonLd businessKey="legal" services={[
        { name: "補助金・助成金申請", description: "事業再構築補助金、小規模事業者持続化補助金など各種補助金の申請書作成をサポートします。" },
        { name: "在留資格・ビザ申請", description: "就労ビザ、経営管理ビザ、配偶者ビザなど各種在留資格の取得・更新・変更に対応します。" },
        { name: "会社設立", description: "株式会社・合同会社の設立手続きを定款作成から登記申請まで一括サポートします。" },
        { name: "各種許認可申請", description: "建設業許可、飲食店営業許可など事業に必要な許認可の取得を代行します。" },
      ]} />
      <HowToJsonLd
        name="ビザ申請の流れ"
        description="四葉行政書士事務所でのビザ（在留資格）申請手続きの流れをご紹介します。"
        steps={[
          { name: "無料相談", text: "お電話またはお問い合わせフォームからご連絡ください。現在の在留状況やご希望をヒアリングします。" },
          { name: "必要書類の準備", text: "申請に必要な書類リストをお渡しし、収集をサポートします。当事務所で取得可能な書類は代行取得します。" },
          { name: "申請書類の作成", text: "ヒアリング内容と収集書類をもとに、入管への申請書類一式を作成します。" },
          { name: "入国管理局への申請", text: "作成した書類を入国管理局に提出します。追加書類の対応も当事務所が行います。" },
          { name: "結果通知・在留カード受領", text: "審査結果を受け取り、許可された場合は在留カードの受領手続きまでサポートします。" },
        ]}
      />
      <LegalPageContent />
    </div>
  );
}
