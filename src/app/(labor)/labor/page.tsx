import { buildPageMetadata } from "@/lib/seo";
import UnifiedTopContent from "@/app/(legal)/legal/UnifiedTopContent";

export const metadata = buildPageMetadata({
  businessKey: "labor",
  title: "四葉パートナーズ 士業部門",
  description:
    "行政書士×社労士のワンストップ士業事務所。元新聞記者の代表が、補助金・ビザ・会社設立から社会保険・労務管理まで、まとめてサポートします。",
  path: "/labor",
});

export default function LaborPage() {
  return <UnifiedTopContent />;
}
