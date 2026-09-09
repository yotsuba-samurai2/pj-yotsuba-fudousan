import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CtaBand } from "@/components/shared/CtaBand";
import { LaborAboutPageContent } from "./PageContent";
import type { Metadata } from "next";
import type { LangCode } from "@/config/languages";
import { getRequestLocale } from "@/lib/getRequestLocale";

const COPY: Record<LangCode, { title: string; description: string; home: string }> = {
  ja: {
    title: "事務所概要",
    description: "企業の人事・労務課題に寄り添う社労士事務所。中国や台湾、タイでの駐在経験を持つ代表のプロフィールと、四葉社会保険労務士事務所の理念をご紹介します。",
    home: "ホーム",
  },
  en: {
    title: "About Us",
    description: "Learn about Yotsuba's approach to HR and labor support and our representative, who has worked in China, Taiwan and Thailand.",
    home: "Home",
  },
  "zh-tw": {
    title: "事務所概況",
    description: "介紹四葉社會保險勞務士事務所的人事與勞務支援理念，以及曾駐在中國、台灣與泰國的代表簡介。",
    home: "首頁",
  },
  zh: {
    title: "事务所概况",
    description: "介绍四葉社会保险劳务士事务所的人事与劳务支持理念，以及曾驻在中国、台湾与泰国的代表简介。",
    home: "首页",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return buildPageMetadata({
    businessKey: "labor",
    title: copy.title,
    description: copy.description,
    path: "/labor/about",
    locale,
  });
}

export default async function LaborAboutPage() {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return (
    <div>
      <BreadcrumbJsonLd businessKey="labor" locale={locale} items={[
        { name: copy.home, href: "/labor" },
        { name: copy.title, href: "/labor/about" },
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
