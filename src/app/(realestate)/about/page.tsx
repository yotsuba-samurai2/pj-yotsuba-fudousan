import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { ProfilePageJsonLd } from "@/components/seo/ProfilePageJsonLd";
import AboutPageContent from "./AboutPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    // B2：社名はレイアウトのtitleテンプレート（%s | 四葉不動産）が付与＝ここでは書かない（重複防止）
    title: "会社概要",
    description:
      "元新聞記者として中国や台湾、タイで取材経験を積んだ代表・浦松丈二が、多言語（日本語・英語・中国語繁体字・中国語簡体字）で住まい探しから契約まで対応する四葉不動産。相続書類・許認可は併設の四葉行政書士事務所が別契約で受任します。会社概要と代表の経歴、理念をご紹介します。",
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
