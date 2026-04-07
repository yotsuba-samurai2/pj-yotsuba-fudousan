import { buildPageMetadata } from "@/lib/seo";
import AboutPageContent from "./AboutPageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "会社概要",
  description: "元新聞記者が5カ国での在住経験を活かして立ち上げた、東京・文京区の不動産屋。行政書士・社労士との連携と日英中タイベトナム5言語対応で、住まい探しから契約・法務・相続までワンストップで対応。四葉不動産の理念とバックグラウンドをご紹介します。",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
