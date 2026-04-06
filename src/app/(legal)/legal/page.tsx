/* TODO: 社労士法人化後に復活（統合トップページ）
import UnifiedTopContent from "./UnifiedTopContent";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "四葉パートナーズ 士業部門 | 行政書士×社労士",
  description:
    "行政書士と社労士がワンストップで連携。補助金・ビザ・会社設立から社会保険・労務管理まで、元新聞記者の代表がまとめてサポートします。",
  path: "/legal",
});
*/

import { buildPageMetadata } from "@/lib/seo";
import { ServiceJsonLd } from "@/components/seo/ServiceJsonLd";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import LegalPageContent from "./LegalPageContent";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "四葉行政書士事務所",
  description:
    "元記者が書く「通る申請書」で補助金採択率UP。ビザ申請・会社設立・許認可もワンストップ。不動産と連携し、事業開始を総合支援します。",
  path: "/legal",
});

export default function LegalPage() {
  return (
    <div>
      <FAQJsonLd
        items={[
          {
            question: "行政書士に依頼するメリットは何ですか？",
            answer:
              "許認可申請や届出書類の作成・提出を正確に代行します。要件の見落としや書類不備を防ぎ、スムーズな手続きを実現します。",
          },
          {
            question: "補助金・助成金の申請もサポートしてもらえますか？",
            answer:
              "はい、事業計画書の作成から申請手続きまでワンストップでサポートしています。元新聞記者の文章力を活かした説得力のある計画書を作成します。",
          },
          {
            question: "外国人のビザ申請も対応していますか？",
            answer:
              "はい、在留資格の新規取得・変更・更新に対応しています。グループの不動産会社と連携して住居探しもまとめてサポートします。",
          },
        ]}
      />
      <ServiceJsonLd
        businessKey="legal"
        services={[
          {
            name: "補助金・助成金申請",
            description:
              "事業計画書の作成から申請手続きまでワンストップでサポートします。",
          },
          {
            name: "ビザ・在留資格申請",
            description:
              "在留資格の新規取得・変更・更新を代行します。",
          },
          {
            name: "会社設立",
            description:
              "定款作成から設立届出まで、会社設立手続きをトータルサポートします。",
          },
          {
            name: "各種許認可申請",
            description:
              "建設業許可、宅建業免許など各種許認可の申請を代行します。",
          },
        ]}
      />
      <HowToJsonLd
        name="補助金申請の流れ"
        description="四葉行政書士事務所での補助金申請手続きの流れをご紹介します。"
        steps={[
          {
            name: "無料相談・ヒアリング",
            text: "お電話またはお問い合わせフォームからご連絡ください。事業内容に合った補助金をご提案します。",
          },
          {
            name: "事業計画書の作成",
            text: "採択率を高めるための事業計画書を作成します。元新聞記者の文章力で説得力のある計画書に仕上げます。",
          },
          {
            name: "申請書類の提出",
            text: "必要書類を揃え、電子申請または窓口にて提出します。",
          },
          {
            name: "採択・交付決定",
            text: "審査結果の確認、交付決定後の手続きをサポートします。",
          },
        ]}
      />
      <LegalPageContent />
    </div>
  );
}
