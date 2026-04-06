import { buildPageMetadata } from "@/lib/seo";
import HomePageContent from "./HomePageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "四葉不動産",
  description:
    "元新聞記者×行政書士の東京の不動産屋。日英中タイベトナム5言語対応で、住まい探しから法務までワンストップでサポートします。",
  path: "/",
});

export default function HomePage() {
  return <HomePageContent />;
}
