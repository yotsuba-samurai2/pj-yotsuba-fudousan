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
    "元新聞記者の文章力×法務の専門知識。補助金採択率を高める申請書作成、ビザ取得、会社設立をワンストップ対応。不動産・社労士とも連携する四葉行政書士事務所。",
  alternates: { canonical: "https://yotsuba-legal.com" },
  openGraph: {
    title: "四葉行政書士事務所 | 補助金・助成金・ビザ申請",
    description:
      "元新聞記者の文章力×法務の専門知識。補助金採択率を高める申請書作成、ビザ取得、会社設立をワンストップ対応。不動産・社労士とも連携する四葉行政書士事務所。",
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
      "元新聞記者の文章力×法務の専門知識。補助金採択率を高める申請書作成、ビザ取得、会社設立をワンストップ対応。不動産・社労士とも連携する四葉行政書士事務所。",
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
