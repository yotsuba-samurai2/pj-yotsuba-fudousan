import { buildPageMetadata } from "@/lib/seo";
import HomePageContent from "./HomePageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "四葉不動産 | 元新聞記者×行政書士の東京の不動産屋",
  description:
    "元新聞記者が5カ国での在住経験を活かして立ち上げた、東京・文京区の不動産屋。賃貸・売買・管理から相続不動産まで、日英中タイベトナム5言語対応と専門家ネットワークで住まい探しから契約・法務までワンストップ対応。初回相談は無料、お気軽にどうぞ。",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomePageContent />;
}
