import type { Metadata } from "next";
import type { LangCode } from "@/config/languages";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { ProfilePageJsonLd } from "@/components/seo/ProfilePageJsonLd";
import AboutPageContent from "./AboutPageContent";

// メタ（title/description）のロケール別文言（翻訳チェック§I・2026-07-20）。
// 本文はja版のまま（多言語本文化は後続）。description はjaの逐語訳。
// 士業の分担は「別契約で受任／另行簽約承辦」に統一（#90 一体提供是正に準拠）。
// B2：社名はレイアウトのtitleテンプレート（%s | 四葉不動産）が付与＝titleに社名は書かない。
const META: Record<LangCode, { title: string; description: string }> = {
  ja: {
    title: "会社概要",
    description:
      "元新聞記者として中国や台湾、タイで取材経験を積んだ代表・浦松丈二が、多言語（日本語・英語・中国語繁体字・中国語簡体字）で住まい探しから契約まで対応する四葉不動産。相続書類・許認可は併設の四葉行政書士事務所が別契約で受任します。会社概要と代表の経歴、理念をご紹介します。",
  },
  en: {
    title: "Company Profile",
    description:
      "Yotsuba Real Estate, led by Representative Joji Uramatsu — a former newspaper journalist with reporting experience in China, Taiwan, and Thailand — supports you from house-hunting to contract in multiple languages (Japanese, English, Traditional Chinese, and Simplified Chinese). Inheritance documents and licensing/permits are handled under a separate contract by the affiliated Yotsuba Gyoseishoshi (Administrative Scrivener) Office. Here we introduce our company profile and the representative's background and philosophy.",
  },
  "zh-tw": {
    title: "公司簡介",
    description:
      "四葉不動産由曾任報社記者、於中國、台灣、泰國累積採訪經驗的代表浦松丈二領軍，以多語言（日語・英語・中文繁體・中文簡體）從找房到簽約全程對應。繼承文件・許認可由併設的四葉行政書士事務所另行簽約承辦。在此介紹公司簡介與代表的經歷・理念。",
  },
  zh: {
    title: "公司简介",
    description:
      "四葉不動産由曾任报社记者、于中国、台湾、泰国积累采访经验的代表浦松丈二领军，以多语言（日语・英语・中文繁体・中文简体）从找房到签约全程对应。继承文件・许认可由并设的四葉行政书士事务所另行签约承办。在此介绍公司简介与代表的经历・理念。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const m = META[locale] ?? META.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    title: m.title,
    description: m.description,
    path: "/about",
    keywords: [
      "四葉不動産 会社概要",
      "浦松丈二",
      "元新聞記者 不動産",
      "行政書士 連携 不動産",
    ],
    locale,
  });
}

export default function AboutPage() {
  return (
    <>
      <ProfilePageJsonLd />
      <AboutPageContent />
    </>
  );
}
