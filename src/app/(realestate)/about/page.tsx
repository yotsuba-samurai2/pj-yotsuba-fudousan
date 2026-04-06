import { buildPageMetadata } from "@/lib/seo";
import AboutPageContent from "./AboutPageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "会社概要",
  description: "5カ国で暮らした元新聞記者が創業した東京の不動産屋。5言語対応と行政書士・社労士との連携で住まい探しから法務までサポートする四葉不動産の理念と代表プロフィール。",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
