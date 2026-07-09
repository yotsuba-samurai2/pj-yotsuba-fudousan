import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import LegalColumnListContent from "./LegalColumnListContent";

export const dynamic = "force-dynamic";

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  ja: {
    title: "コラム",
    description:
      "補助金・助成金の最新情報と採択のコツ、ビザ・在留資格申請のポイント、会社設立の手順、各種許認可の実務まで。元新聞記者としての取材経験と現場の視点を活かし、四葉行政書士事務所がわかりやすく解説するお役立ちコラムです。",
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const m = META_BY_LOCALE[locale] ?? META_BY_LOCALE.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: m.title,
    description: m.description,
    path: "/legal/column",
    locale,
  });
}

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
