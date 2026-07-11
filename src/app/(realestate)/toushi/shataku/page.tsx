// /toushi/shataku（型A）＝原稿_不動産 #4
// クロスリンク＝C6（→/legal/services/visa）がpathで自動表示。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/access・HomePageContent.tsx）。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳／zh=大陸表記。
// 社宅の訳語＝既訳（HomePageContent・services）に統一：en=company housing／zh-tw=員工宿舍／zh=员工宿舍（要監修）。
// 署名・関連リンク見出しはRealestateServicePageの上書きprops（ja既定）で多言語化。訳文はaccessの既訳と同一。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import type { LangCode } from "@/config/languages";

type ShatakuCopy = {
  metaTitle: string;
  metaDesc: string;
  crumbHome: string;
  crumbToushi: string;
  crumbCurrent: string;
  serviceName: string;
  heroAlt: string;
  h1: string;
  lead: React.ReactNode;
  internalLinks: { href: string; label: string }[];
  crossLinkLead: string;
  qaH2: string;
  qaBody: (locale: LangCode) => React.ReactNode;
  relatedAria: string;
  relatedHeading: string;
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
};

const COPY: Record<LangCode, ShatakuCopy> = {
  ja: {
    metaTitle: "社宅・法人賃貸のサポート｜四葉不動産",
    metaDesc:
      "法人向けの社宅・法人契約の賃貸を、四葉不動産株式会社がサポートします。外国人従業員の住居手配は日本語・英語・中国語（繁体字・簡体字）で対応。従業員の受け入れに必要な在留資格の手続きとあわせて、住まいの確保を一つの窓口で相談できます。",
    crumbHome: "ホーム",
    crumbToushi: "投資用・事業用不動産",
    crumbCurrent: "社宅・法人賃貸",
    serviceName: "社宅・法人賃貸のサポート",
    heroAlt: "社宅・法人賃貸のイメージ（オフィス街の集合住宅）",
    h1: "社宅・法人賃貸のサポート",
    lead: (
      <p>
        四葉不動産株式会社は、<strong>法人向けの社宅・法人契約の賃貸</strong>をサポートします。特長は、<strong>外国人従業員の住居手配を日本語・英語・中国語（繁体字・簡体字）で</strong>支援できること。入居審査・保証・生活ルールの説明など、外国人の入居でつまずきやすい点を、言葉の壁ごと引き受けます。
      </p>
    ),
    internalLinks: [
      { href: "/toushi", label: "投資用・事業用不動産トップ" },
      { href: "/global", label: "外国人・多言語のお部屋探し" },
      { href: "/access", label: "アクセス・料金" },
    ],
    crossLinkLead: "外国人材の受け入れに必要な在留資格の手続きは、関連事業の四葉行政書士事務所が対応します。",
    qaH2: "外国人従業員の社宅も対応できますか？",
    qaBody: (locale) => (
      <>
        できます。言語・保証会社・入居審査——外国人の住居手配で問題になりやすい3点を、四葉不動産が整理してサポートします。従業員個人のお部屋探しは{" "}
        <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">外国人・多言語のお部屋探し</Link>{" "}
        をご覧ください。受け入れに必要な<strong>在留資格の手続き</strong>は、関連事業の四葉行政書士事務所が対応します。
      </>
    ),
    relatedAria: "関連リンク",
    relatedHeading: "このページの関連リンク",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）・海外4カ国在住経験。社会保険労務士試験合格（2026年9月開業予定）。",
  },
  en: {
    metaTitle: "Company Housing & Corporate Leasing Support | 四葉不動産 (Yotsuba Real Estate)",
    metaDesc:
      "Yotsuba Real Estate Co., Ltd. supports company housing and corporate-lease rentals for businesses. Housing arrangements for international employees are handled in Japanese, English, Traditional Chinese, and Simplified Chinese. Together with the residence-status procedures required to bring employees on board, you can arrange housing through a single point of contact.",
    crumbHome: "Home",
    crumbToushi: "Investment & Business-Use Real Estate",
    crumbCurrent: "Company Housing & Corporate Leasing",
    serviceName: "Company Housing & Corporate Leasing Support",
    heroAlt: "Company housing and corporate leasing (apartment buildings in an office district)",
    h1: "Company Housing & Corporate Leasing Support",
    lead: (
      <p>
        Yotsuba Real Estate Co., Ltd. supports <strong>company housing and corporate-lease rentals for businesses</strong>. What sets us apart: we can <strong>arrange housing for international employees in Japanese, English, Traditional Chinese, and Simplified Chinese</strong>. Tenant screening, guarantors, explaining house rules—we take on the points where international tenants tend to stumble, language barrier and all.
      </p>
    ),
    internalLinks: [
      { href: "/toushi", label: "Investment & Business-Use Real Estate (Top)" },
      { href: "/global", label: "Multilingual Room-Hunting Support" },
      { href: "/access", label: "Access & Fees" },
    ],
    crossLinkLead:
      "The residence-status procedures required to bring in international talent are handled by our affiliated business, Yotsuba Gyoseishoshi Office.",
    qaH2: "Can you handle company housing for international employees?",
    qaBody: (locale) => (
      <>
        Yes. Language, guarantor companies, tenant screening—Yotsuba Real Estate sorts out and supports the three points that most often become issues when arranging housing for international residents. For an individual employee's room hunting, see{" "}
        <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">Multilingual Room-Hunting Support</Link>
        . The <strong>residence-status procedures</strong> required to bring employees on board are handled by our affiliated business, Yotsuba Gyoseishoshi Office.
      </>
    ),
    relatedAria: "Related links",
    relatedHeading: "Related links on this page",
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time licensed real estate broker; gyoseishoshi lawyer. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), with experience living in four countries. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
  },
  "zh-tw": {
    metaTitle: "員工宿舍・法人租賃支援｜四葉不動産",
    metaDesc:
      "四葉不動産株式会社為法人企業提供員工宿舍・法人契約租賃的支援。外國員工的住居安排以日文・英文・中文（繁體・簡體）對應。連同聘僱外國員工所需的在留資格手續，住居的安排可在同一窗口一併諮詢。",
    crumbHome: "首頁",
    crumbToushi: "投資用・事業用不動產",
    crumbCurrent: "員工宿舍・法人租賃",
    serviceName: "員工宿舍・法人租賃支援",
    heroAlt: "員工宿舍・法人租賃的示意圖（辦公商圈的集合住宅）",
    h1: "員工宿舍・法人租賃支援",
    lead: (
      <p>
        四葉不動産株式会社支援<strong>法人企業的員工宿舍・法人契約租賃</strong>。我們的特長，是能<strong>以日文・英文・中文（繁體・簡體）安排外國員工的住居</strong>。入住審查・保證・生活規範的說明——外國人入住時容易卡關的環節，我們連同語言的門檻一併承擔。
      </p>
    ),
    internalLinks: [
      { href: "/toushi", label: "投資用・事業用不動產（總覽）" },
      { href: "/global", label: "外國人・多語言找房服務" },
      { href: "/access", label: "交通與費用" },
    ],
    crossLinkLead: "聘僱外國人才所需的在留資格手續，由關聯事業・四葉行政書士事務所對應。",
    qaH2: "外國員工的員工宿舍，也能協助安排嗎？",
    qaBody: (locale) => (
      <>
        可以。語言・保證公司・入住審查——外國人住居安排中容易出問題的3點，由四葉不動産為您整理並支援。員工個人的找房，請參閱{" "}
        <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">外國人・多語言找房服務</Link>
        。聘僱所需的<strong>在留資格手續</strong>，由關聯事業・四葉行政書士事務所對應。
      </>
    ),
    relatedAria: "相關連結",
    relatedHeading: "本頁相關連結",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士。行政書士。曾任每日新聞中國總局長（記者資歷34年）・旅居海外4國。已通過社會保險勞務士考試（預定2026年9月開業）。",
  },
  zh: {
    metaTitle: "员工宿舍・企业租赁支持｜四葉不動産",
    metaDesc:
      "四葉不動産株式会社为企业提供员工宿舍・以公司名义签约租赁的支持。外国员工的住房安排以日语・英语・中文（繁体・简体）对应。连同聘用外国员工所需的在留资格手续，住房的落实可在同一窗口一并咨询。",
    crumbHome: "首页",
    crumbToushi: "投资用・事业用不动产",
    crumbCurrent: "员工宿舍・企业租赁",
    serviceName: "员工宿舍・企业租赁支持",
    heroAlt: "员工宿舍・企业租赁的示意图（办公区的集合住宅）",
    h1: "员工宿舍・企业租赁支持",
    lead: (
      <p>
        四葉不動産株式会社支持<strong>面向企业的员工宿舍・以公司名义签约的租赁</strong>。我们的特长，是能<strong>以日语・英语・中文（繁体・简体）安排外国员工的住房</strong>。入住审查・担保・生活规范的说明——外国人入住时容易受阻的环节，我们连同语言的门槛一并承担。
      </p>
    ),
    internalLinks: [
      { href: "/toushi", label: "投资用・事业用不动产（总览）" },
      { href: "/global", label: "外国人・多语言找房服务" },
      { href: "/access", label: "交通与费用" },
    ],
    crossLinkLead: "聘用外国人才所需的在留资格手续，由关联事业・四葉行政書士事務所办理。",
    qaH2: "外国员工的员工宿舍，也能协助安排吗？",
    qaBody: (locale) => (
      <>
        可以。语言・担保公司・入住审查——外国人住房安排中容易出问题的3点，由四葉不動産为您整理并支持。员工个人的找房，请参阅{" "}
        <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">外国人・多语言找房服务</Link>
        。聘用所需的<strong>在留资格手续</strong>，由关联事业・四葉行政書士事務所办理。
      </>
    ),
    relatedAria: "相关链接",
    relatedHeading: "本页相关链接",
    authorAlt: "四葉不動産株式会社 代表取缔役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取缔役・专任宅地建物取引士。行政书士。曾任每日新闻中国总局长（记者经历34年）・旅居海外4国。已通过社会保险劳务士考试（预定2026年9月开业）。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/toushi/shataku",
    keywords: ["社宅 法人契約 賃貸", "外国人 従業員 住居 手配"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;

  return (
    <RealestateServicePage
      path="/toushi/shataku"
      crumbs={[
        { name: c.crumbHome, href: "/" },
        { name: c.crumbToushi, href: "/toushi" },
        { name: c.crumbCurrent },
      ]}
      serviceName={c.serviceName}
      heroSrc="/hero/realestate-shataku-16x9.webp"
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={c.lead}
      internalLinks={c.internalLinks}
      crossLinkLead={c.crossLinkLead}
      relatedAria={c.relatedAria}
      relatedHeading={c.relatedHeading}
      authorAlt={c.authorAlt}
      authorLabel={c.authorLabel}
      authorBio={c.authorBio}
    >
      <div>
        <ReH2>{c.qaH2}</ReH2>
        <p className="mt-3 leading-relaxed text-text">{c.qaBody(locale)}</p>
        <Placeholder reason="浦松＝社宅・法人賃貸の対応範囲・実績（確定分のみ）" />
      </div>
    </RealestateServicePage>
  );
}
