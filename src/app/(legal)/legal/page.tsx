import { buildPageMetadata } from "@/lib/seo";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import LegalPageContent from "./LegalPageContent";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "四葉行政書士事務所",
  description: "補助金・助成金申請、在留資格・ビザ申請、会社設立、各種許認可。四葉パートナーズの行政書士事務所が、法務手続きをワンストップでサポートします。",
  path: "/legal",
});

export default function LegalPage() {
  return (
    <div>
      <FAQJsonLd items={[
        { question: "行政書士に補助金申請を頼むメリットは？", answer: "元新聞記者の文章力を活かした説得力のある申請書を作成します。事業計画の「伝え方」が採択のカギとなる補助金申請では、記者経験が大きな強みになります。" },
        { question: "外国人のビザ申請にも対応していますか？", answer: "はい、就労ビザ、経営・管理ビザ、配偶者ビザなど各種在留資格の取得・更新・変更に対応しています。5言語対応で外国人ご本人との直接やり取りも可能です。" },
        { question: "不動産と法務をまとめて相談できますか？", answer: "はい、四葉パートナーズグループでは不動産（四葉不動産）と行政書士事務所が連携し、事務所の賃貸契約と会社設立手続きなどをワンストップで対応できます。" },
      ]} />
      <BreadcrumbJsonLd businessKey="legal" items={[
        { name: "ホーム", href: "/legal" },
        { name: "サービス", href: "/legal" },
      ]} />
      <LegalPageContent />
    </div>
  );
}
