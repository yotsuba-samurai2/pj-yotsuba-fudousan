import { buildPageMetadata } from "@/lib/seo";
import { TermsPageClient } from "./TermsPageClient";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "利用規約 | 四葉パートナーズ",
  description: "四葉パートナーズの利用規約。",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div>
      <TermsPageClient />
    </div>
  );
}
