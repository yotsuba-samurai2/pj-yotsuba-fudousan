import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { LegalNoticePageClient } from "./LegalNoticePageClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "宅建業法に基づく表記",
    description: "四葉不動産株式会社の宅地建物取引業免許番号、事務所所在地、代表者情報、取引態様、所属団体、保証協会など、宅地建物取引業法第50条に基づく法定開示事項を掲載しています。安心してお取引いただくための情報です。",
    path: "/legal-notice",
    locale,
  });
}

export default function LegalNoticePage() {
  return (
    <div>
      <BreadcrumbJsonLd businessKey="realestate" items={[
        { name: "ホーム", href: "/" },
        { name: "宅建業法に基づく表記", href: "/legal-notice" },
      ]} />
      <LegalNoticePageClient />
    </div>
  );
}
