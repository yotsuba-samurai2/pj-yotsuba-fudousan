import type { Metadata } from "next";
import { TenantLayoutShell } from "@/components/layout/TenantLayout";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";

export const metadata: Metadata = {
  title: {
    default: "四葉行政書士事務所 | 補助金・助成金・ビザ申請",
    template: "%s | 四葉行政書士事務所",
  },
  description:
    "補助金・助成金申請、在留資格・ビザ申請、会社設立、各種許認可。四葉パートナーズの行政書士事務所が法務手続きをワンストップでサポートします。",
  alternates: { canonical: "https://yotsuba-legal.com" },
  openGraph: {
    title: "四葉行政書士事務所 | 補助金・助成金・ビザ申請",
    description:
      "補助金・助成金申請、在留資格・ビザ申請、会社設立、各種許認可。四葉パートナーズの行政書士事務所が法務手続きをワンストップでサポートします。",
    url: "https://yotsuba-legal.com",
    siteName: "四葉行政書士事務所",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/yotsuba/legal-square.png", width: 512, height: 512, alt: "四葉行政書士事務所" }],
  },
  twitter: {
    card: "summary",
    title: "四葉行政書士事務所 | 補助金・助成金・ビザ申請",
    description:
      "補助金・助成金申請、在留資格・ビザ申請、会社設立、各種許認可。四葉パートナーズの行政書士事務所が法務手続きをワンストップでサポートします。",
    images: ["/yotsuba/legal-square.png"],
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantLayoutShell businessKey="legal">
      <OrganizationJsonLd businessKey="legal" />
      <WebSiteJsonLd businessKey="legal" />
      {children}
    </TenantLayoutShell>
  );
}
