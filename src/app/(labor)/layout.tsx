import type { Metadata } from "next";
import { TenantLayoutShell } from "@/components/layout/TenantLayout";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";

export const metadata: Metadata = {
  title: {
    default: "四葉社会保険労務士法人 | 社会保険・労務・助成金",
    template: "%s | 四葉社会保険労務士法人",
  },
  description:
    "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉パートナーズの社労士法人が企業の人事・労務をトータルサポートします。",
  alternates: { canonical: "https://yotsuba-labor.com" },
  openGraph: {
    title: "四葉社会保険労務士法人 | 社会保険・労務・助成金",
    description:
      "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉パートナーズの社労士法人が企業の人事・労務をトータルサポートします。",
    url: "https://yotsuba-labor.com",
    siteName: "四葉社会保険労務士法人",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/yotsuba/labor-square.png", width: 512, height: 512, alt: "四葉社会保険労務士法人" }],
  },
  twitter: {
    card: "summary",
    title: "四葉社会保険労務士法人 | 社会保険・労務・助成金",
    description:
      "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉パートナーズの社労士法人が企業の人事・労務をトータルサポートします。",
    images: ["/yotsuba/labor-square.png"],
  },
};

export default function LaborLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantLayoutShell businessKey="labor">
      <OrganizationJsonLd businessKey="labor" />
      <WebSiteJsonLd businessKey="labor" />
      {children}
    </TenantLayoutShell>
  );
}
