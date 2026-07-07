import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TenantLayoutShell } from "@/components/layout/TenantLayout";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";

// 社労士は法人化（2026-09開業予定）まで全非表示（浦松指示 2026-07-07）。
// 復元: この layout ファイルを元の内容（generateMetadata・TenantLayoutShell描画）に戻すだけでよい。
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LaborLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  notFound();

  return (
    <TenantLayoutShell businessKey="labor">
      <OrganizationJsonLd businessKey="labor" />
      <WebSiteJsonLd businessKey="labor" />
      {children}
    </TenantLayoutShell>
  );
}
