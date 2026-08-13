import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CtaBand } from "@/components/shared/CtaBand";
import { LaborAboutPageContent } from "./PageContent";

export const metadata = buildPageMetadata({
  businessKey: "labor",
  title: "事務所概要",
  description: "企業の人事・労務課題に寄り添う社労士事務所。中国や台湾、タイでの駐在経験を持つ代表のプロフィールと、四葉社会保険労務士事務所の理念をご紹介します。",
  path: "/labor/about",
});

export default function LaborAboutPage() {
  return (
    <div>
      <BreadcrumbJsonLd businessKey="labor" items={[
        { name: "ホーム", href: "/labor" },
        { name: "事務所概要", href: "/labor/about" },
      ]} />
      <LaborAboutPageContent />
      {/* ★2026-08-13 追加：CTA帯（LINE・お問い合わせ・電話）。
          3レーンとも column/[slug]・column・about だけ CtaBand が無く、
          PCでLINEへの導線が出ていなかった。contact / thanks には入れない。 */}
      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </div>
  );
}
