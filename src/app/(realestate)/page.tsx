import { buildPageMetadata } from "@/lib/seo";
import HomePageContent from "./HomePageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "四葉不動産 | 東京都文京区にある元新聞記者×行政書士の不動産屋",
  description:
    "元新聞記者が5カ国での在住経験を活かして立ち上げた、東京都文京区にある不動産屋。賃貸・売買・管理から相続不動産、外国人向け住居サポートまで、多言語（日本語・英語・中国語）対応と専門家ネットワークで住まい探しから契約・法務までワンストップ対応。初回相談は無料、お気軽にどうぞ。",
  path: "/",
  absoluteTitle: true,
  keywords: [
    "東京 不動産",
    "東京 賃貸",
    "東京 売買",
    "多言語 不動産 日本語 英語 中国語",
    "外国人 賃貸 東京",
    "相続不動産",
    "行政書士 不動産",
    "四葉不動産",
  ],
});

export default function HomePage() {
  return <HomePageContent />;
}
