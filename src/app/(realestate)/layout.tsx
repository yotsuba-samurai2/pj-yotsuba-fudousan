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
    "5言語対応の不動産屋。元新聞記者・海外赴任経験者の代表が、外国人の住まい探しを経験者の視点でサポートします。賃貸・売買・管理のご相談はお気軽にどうぞ。",
  alternates: { canonical: "https://yotsuba-fudousan.com" },
  openGraph: {
    title: "四葉不動産 | ことば、業界の壁を超えて、あなたの家を。",
    description:
      "5言語対応の不動産屋。元新聞記者・海外赴任経験者の代表が、外国人の住まい探しを経験者の視点でサポートします。",
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
      "5言語対応の不動産屋。元新聞記者・海外赴任経験者の代表が、外国人の住まい探しを経験者の視点でサポートします。",
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
