import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import LegalColumnListContent from "./LegalColumnListContent";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "コラム",
  description: "補助金・助成金の最新情報と採択のコツ、ビザ・在留資格申請のポイント、会社設立の手順、各種許認可の実務まで。元新聞記者としての取材経験と現場の視点を活かし、四葉行政書士事務所がわかりやすく解説するお役立ちコラムです。",
  path: "/legal/column",
});

export default function LegalColumnListPage() {
  return (
    <div>
      <BreadcrumbJsonLd businessKey="legal" items={[
        { name: "ホーム", href: "/legal" },
        { name: "コラム", href: "/legal/column" },
      ]} />
      <LegalColumnListContent />
    </div>
  );
}
