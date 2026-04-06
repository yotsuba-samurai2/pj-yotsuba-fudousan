import type { Metadata } from "next";
import { TenantLayoutShell } from "@/components/layout/TenantLayout";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";

export const metadata: Metadata = {
  title: {
    default: "四葉不動産 | ことば、業界の壁を超えて、あなたの家を。",
    template: "%s | 四葉不動産",
  },
  description:
    "元新聞記者×行政書士の東京の不動産屋。日・英・中・タイ・ベトナム語の5言語対応と専門家ネットワークで、住まい探しから法務までワンストップでサポートします。",
  alternates: { canonical: "https://yotsuba-fudousan.com" },
  openGraph: {
    title: "四葉不動産 | ことば、業界の壁を超えて、あなたの家を。",
    description:
      "元新聞記者×行政書士の東京の不動産屋。日・英・中・タイ・ベトナム語の5言語対応と専門家ネットワークで、住まい探しから法務までワンストップでサポートします。",
    url: "https://yotsuba-fudousan.com",
    siteName: "四葉不動産",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/yotsuba/realestate-square.png", width: 512, height: 512, alt: "四葉不動産" }],
  },
  twitter: {
    card: "summary",
    title: "四葉不動産 | ことば、業界の壁を超えて、あなたの家を。",
    description:
      "元新聞記者×行政書士の東京の不動産屋。日・英・中・タイ・ベトナム語の5言語対応と専門家ネットワークで、住まい探しから法務までワンストップでサポートします。",
    images: ["/yotsuba/realestate-square.png"],
  },
};

export default function RealEstateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantLayoutShell businessKey="realestate">
      <OrganizationJsonLd businessKey="realestate" />
      <WebSiteJsonLd businessKey="realestate" />
      {children}
    </TenantLayoutShell>
  );
}
