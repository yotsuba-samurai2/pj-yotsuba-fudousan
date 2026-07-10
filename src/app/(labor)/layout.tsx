import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TenantLayoutShell } from "@/components/layout/TenantLayout";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { BUSINESS_SEO } from "@/lib/seo";

// 社労士は開業（2026年9月・浦松指示 2026-07-07）まで全非表示。
// SR_LAUNCHED=false（既定）＝全ルート404・noindex。ローカル検証時のみ NEXT_PUBLIC_SR_LAUNCHED=true で表示。
// 開業日（フェーズJ）: Vercel環境変数 NEXT_PUBLIC_SR_LAUNCHED=true → 再デプロイのみで公開。
const SR_LAUNCHED = process.env.NEXT_PUBLIC_SR_LAUNCHED === "true";

export async function generateMetadata(): Promise<Metadata> {
  if (!SR_LAUNCHED) {
    return { robots: { index: false, follow: false } };
  }
  const biz = BUSINESS_SEO.labor;
  return {
    metadataBase: new URL("https://luck428.com"),
    title: { default: biz.name, template: `%s｜${biz.name}` },
    description: biz.description,
    alternates: { canonical: biz.url },
    openGraph: {
      title: biz.name,
      description: biz.description,
      url: biz.url,
      siteName: biz.name,
      locale: "ja_JP",
      type: "website",
    },
  };
}

export default function LaborLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!SR_LAUNCHED) {
    notFound();
  }

  return (
    <TenantLayoutShell businessKey="labor">
      <OrganizationJsonLd businessKey="labor" />
      <WebSiteJsonLd businessKey="labor" />
      {children}
    </TenantLayoutShell>
  );
}
