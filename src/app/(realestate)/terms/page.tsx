import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { TermsPageClient } from "./TermsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "利用規約",
    description: "四葉パートナーズが運営するウェブサイトの利用規約。サービス利用条件、禁止事項、免責事項、知的財産権の取り扱い、準拠法、規約変更に関する事項など、ご利用にあたっての重要事項を明記しています。ご利用前に必ずご確認ください。",
    path: "/terms",
    locale,
  });
}

export default function TermsPage() {
  return (
    <div>
      <TermsPageClient />
    </div>
  );
}
