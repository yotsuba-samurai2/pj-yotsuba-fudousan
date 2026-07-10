// /legal/about（事務所概要）＝フェーズI多言語化（2026-07-10）
// 本文＝LegalAboutPageContent（全文t()＝Firestore翻訳済み）＝触らない。ここはメタ＋パンくずのみCOPY化。
// メタtitleは全ロケール「事務所概要」相当（realestateの/aboutは「会社概要」のまま＝別事業体）。
// 業際：メタから社労士側の用語を除去（「補助金」のみ使用）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import LegalAboutPageContent from "./LegalAboutPageContent";
import type { LangCode } from "@/config/languages";

const COPY: Record<LangCode, { title: string; desc: string; home: string }> = {
  ja: {
    title: "事務所概要",
    desc: "4カ国で暮らした元新聞記者が、取材で培った情報収集力と文章力を活かして行政書士に。補助金申請、ビザ、会社設立、許認可までワンストップで対応。文京区の四葉行政書士事務所の理念とバックグラウンドをご紹介します。",
    home: "ホーム",
  },
  en: {
    title: "About the Office",
    desc: "A former newspaper journalist who lived in four countries, now a gyoseishoshi lawyer putting 34 years of reporting and writing to work. One-stop support for subsidy applications, visas, company formation, and licensing. Learn about the philosophy and background of Yotsuba Gyoseishoshi Office in Bunkyo, Tokyo.",
    home: "Home",
  },
  "zh-tw": {
    title: "事務所簡介",
    desc: "曾旅居4個國家的前新聞記者，將採訪培養的資訊蒐集力與文字力投入行政書士工作。補助金申請、簽證、公司設立、許認可，一站式對應。為您介紹東京文京區・四葉行政書士事務所的理念與背景。",
    home: "首頁",
  },
  zh: {
    title: "事务所简介",
    desc: "曾旅居4个国家的前新闻记者，将采访培养的信息收集力与文字力投入行政书士工作。补助金申请、签证、公司设立、许认可，一站式对应。为您介绍东京文京区・四葉行政書士事務所的理念与背景。",
    home: "首页",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.title,
    description: c.desc,
    path: "/legal/about",
    locale,
  });
}

export default async function LegalAboutPage() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return (
    <div>
      <BreadcrumbJsonLd businessKey="legal" items={[
        { name: c.home, href: "/legal" },
        { name: c.title, href: "/legal/about" },
      ]} />
      <LegalAboutPageContent />
    </div>
  );
}
