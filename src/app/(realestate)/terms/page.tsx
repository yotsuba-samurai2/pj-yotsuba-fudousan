import { buildPageMetadata } from "@/lib/seo";
import { TermsPageClient } from "./TermsPageClient";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "利用規約 | 四葉パートナーズ",
  description: "四葉パートナーズのウェブサイト利用規約。サービス利用条件、免責事項、知的財産権などの重要事項を掲載しています。",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div>
      <TermsPageClient />
    </div>
  );
}
