import { buildPageMetadata } from "@/lib/seo";
import AboutPageContent from "./AboutPageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "会社概要 | 四葉不動産",
  description:
    "元新聞記者として5カ国で取材経験を積んだ代表・浦松丈二が行政書士・社労士と連携し、多言語（日本語・英語・中国語）で住まい探しから契約・法務・相続までワンストップで対応する四葉不動産。会社概要と代表の経歴、理念をご紹介します。",
  path: "/about",
  keywords: [
    "四葉不動産 会社概要",
    "浦松丈二",
    "元新聞記者 不動産",
    "行政書士 連携 不動産",
  ],
});

export default function AboutPage() {
  return <AboutPageContent />;
}
