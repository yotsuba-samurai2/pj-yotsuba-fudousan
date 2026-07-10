// ★参考ページ（型A）＝ /legal/services/company　※原稿_行政書士 #4・共通シェル使用
// 配置＝src/app/(legal)/legal/services/company/page.tsx。クロスリンクはこのページには定義なし（getCrossLinksが空を返す）。
// フェーズI多言語化＝COPY: Record<LangCode,…>＋getRequestLocale方式（手本=/legal page.tsx）。
// en/zh-tw/zh=監修前ドラフト（フェーズI・2026-07-10）。固有名詞（四葉行政書士事務所・浦松丈二・登録番号）は全ロケール同一表記。
// serviceName＝JSON-LD Service name（非可視）のためja固定。Placeholder＝内部メモのためja固定・全ロケール共通位置。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { LegalServicePage, H2 } from "@/components/shared/LegalServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import type { LangCode } from "@/config/languages";

type CompanyCopy = {
  metaTitle: string;
  metaDesc: string;
  crumbLabel: string;
  heroAlt: string;
  h1: string;
  lead: React.ReactNode; // <strong>入り本文（Placeholderは構造側で共通挿入）
  internalLinks: { href: string; label: string }[];
  s1Heading: string;
  s1Body: string;
  s1Note: string; // 末尾「→」まで含む（直後にリンク）
  s1NoteLinkLabel: string;
  s2Heading: string;
  s2Body: React.ReactNode;
  s2LinkLabel: string;
  s3Heading: string;
  s3Link1Label: string;
  s3Link2Label: string;
};

const COPY: Record<LangCode, CompanyCopy> = {
  ja: {
    metaTitle: "会社設立・各種許認可｜四葉行政書士事務所",
    metaDesc:
      "株式会社・合同会社の設立書類、建設業・宅建業・古物・飲食などの許認可申請を、文京区の四葉行政書士事務所が支援します。定款作成から許認可まで一体で対応。外国人の経営管理ビザと会社設立の同時進行にも中国語・英語で対応します。",
    crumbLabel: "会社設立・各種許認可",
    heroAlt: "会社設立・許認可のイメージ（オフィスと設立書類）",
    h1: "会社設立・各種許認可",
    lead: (
      <>
        会社設立の書類作成（定款等）と各種許認可の申請は、<strong>行政書士に依頼できます</strong>。四葉行政書士事務所は、株式会社・合同会社の設立書類の作成と、事業に必要な許認可申請を扱います。<strong>登記申請は司法書士の領域</strong>のため、連携しておつなぎします。
      </>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任の流れ" },
      { href: "/legal/services/visa", label: "在留資格・ビザ申請" },
      { href: "/legal/services/shogai-fukushi", label: "障害福祉サービスの指定申請" },
    ],
    s1Heading: "どんな許認可に対応していますか？",
    s1Body: "事業に必要な許認可はご相談ください。",
    s1Note: "障害福祉サービスの事業者指定は、専用ページで詳しく解説しています →",
    s1NoteLinkLabel: "障害福祉サービスの指定申請",
    s2Heading: "外国人の会社設立・経営管理ビザにも対応できますか？",
    s2Body: (
      <>
        できます。外国人の方が日本で起業する場合、<strong>会社設立と「経営・管理」の在留資格は一体</strong>で進みます。四葉行政書士事務所は両方を扱えるため、順序と要件を整理して同時進行できます。中国語・英語での相談にも対応します。
      </>
    ),
    s2LinkLabel: "在留資格・ビザ申請の業務内容",
    s3Heading: "費用・受任の流れ",
    s3Link1Label: "会社設立・許認可の報酬額（報酬額表）",
    s3Link2Label: "ご相談から完了までの受任の流れ",
  },
  en: {
    metaTitle: "Company Formation & Licensing｜四葉行政書士事務所",
    metaDesc:
      "Incorporation documents for kabushiki kaisha (K.K.) and godo kaisha (LLC), plus license applications for construction, real estate brokerage, secondhand-goods dealing, food service and more—supported by 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office) in Bunkyo, Tokyo. Integrated support from drafting the articles of incorporation through licensing. Foreign founders can pursue company formation and the business manager visa in parallel, with consultations in Chinese and English.",
    crumbLabel: "Company Formation & Licensing",
    heroAlt: "Company formation and licensing—an office and incorporation documents",
    h1: "Company Formation & Licensing",
    lead: (
      <>
        Preparing company formation documents (such as the articles of incorporation) and filing license applications are <strong>work you can entrust to a gyoseishoshi (administrative scrivener)</strong>. 四葉行政書士事務所 prepares incorporation documents for kabushiki kaisha (K.K.) and godo kaisha (LLC) companies and handles the license applications your business needs. <strong>Filing the registration itself is the domain of the shiho-shoshi (judicial scrivener)</strong>, so we coordinate with one to connect you.
      </>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "Fees" },
      { href: "/legal/nagare", label: "How Engagement Works" },
      { href: "/legal/services/visa", label: "Visa & Residence Status" },
      { href: "/legal/services/shogai-fukushi", label: "Disability-Welfare Service Designation" },
    ],
    s1Heading: "What licenses and permits do you handle?",
    s1Body: "Please consult us about any license or permit your business requires.",
    s1Note: "Designation as a disability-welfare service provider is explained in detail on its own page →",
    s1NoteLinkLabel: "Disability-Welfare Service Designation",
    s2Heading: "Do you also help foreign nationals with company formation and the business manager visa?",
    s2Body: (
      <>
        Yes. When a foreign national starts a business in Japan, <strong>company formation and the &ldquo;Business Manager&rdquo; residence status move forward as one</strong>. Because 四葉行政書士事務所 handles both, we can sort out the sequence and requirements and run them in parallel. Consultations are available in Chinese and English.
      </>
    ),
    s2LinkLabel: "Details of our visa & residence status services",
    s3Heading: "Fees & How Engagement Works",
    s3Link1Label: "Fees for company formation & licensing (fee schedule)",
    s3Link2Label: "From first consultation to completion—how engagement works",
  },
  "zh-tw": {
    metaTitle: "公司設立・各類許可｜四葉行政書士事務所",
    metaDesc:
      "株式會社・合同會社的設立文件，以及建設業、宅建業（不動產交易）、古物商、餐飲等許可申請，由東京文京區的四葉行政書士事務所提供協助。從章程（定款）製作到取得許可，一貫對應。外國人的經營管理簽證與公司設立同步進行，亦可以中文・英文諮詢。",
    crumbLabel: "公司設立・各類許可",
    heroAlt: "公司設立・許可申請的示意圖（辦公室與設立文件）",
    h1: "公司設立・各類許可",
    lead: (
      <>
        公司設立文件（章程等）的製作與各類許可的申請，<strong>可以委託行政書士辦理</strong>。四葉行政書士事務所承辦株式會社・合同會社的設立文件製作，以及事業所需的各類許可申請。<strong>登記申請屬於司法書士的執業範圍</strong>，我們會與合作的司法書士協同，為您銜接。
      </>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/services/visa", label: "在留資格（簽證）申請" },
      { href: "/legal/services/shogai-fukushi", label: "障礙福祉服務指定申請" },
    ],
    s1Heading: "可以受理哪些許可申請？",
    s1Body: "事業所需的各類許可，歡迎與我們洽詢。",
    s1Note: "障礙福祉服務的事業者指定，另設專頁詳細說明 →",
    s1NoteLinkLabel: "障礙福祉服務指定申請",
    s2Heading: "也能協助外國人辦理公司設立與經營管理簽證嗎？",
    s2Body: (
      <>
        可以。外國人在日本創業時，<strong>公司設立與「經營・管理」在留資格是一體</strong>推進的。四葉行政書士事務所兩者皆可承辦，因此能整理先後順序與要件、同步進行。亦提供中文・英文諮詢。
      </>
    ),
    s2LinkLabel: "在留資格（簽證）申請的業務內容",
    s3Heading: "費用・受任流程",
    s3Link1Label: "公司設立・許可申請的報酬額（報酬額表）",
    s3Link2Label: "從諮詢到完成的受任流程",
  },
  zh: {
    metaTitle: "公司设立・各类许可｜四葉行政書士事務所",
    metaDesc:
      "株式会社・合同会社的设立文件，以及建设业、宅建业（不动产交易）、古物商、餐饮等许可申请，由东京文京区的四葉行政書士事務所提供协助。从章程（定款）制作到取得许可，一贯对应。外国人的经营管理签证与公司设立同步进行，亦可以中文・英文咨询。",
    crumbLabel: "公司设立・各类许可",
    heroAlt: "公司设立・许可申请的示意图（办公室与设立文件）",
    h1: "公司设立・各类许可",
    lead: (
      <>
        公司设立文件（章程等）的制作与各类许可的申请，<strong>可以委托行政书士办理</strong>。四葉行政書士事務所承办株式会社・合同会社的设立文件制作，以及事业所需的各类许可申请。<strong>登记申请属于司法书士的执业范围</strong>，我们会与合作的司法书士协同，为您衔接。
      </>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "报酬额表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/services/visa", label: "在留资格（签证）申请" },
      { href: "/legal/services/shogai-fukushi", label: "残障福祉服务指定申请" },
    ],
    s1Heading: "可以受理哪些许可申请？",
    s1Body: "事业所需的各类许可，欢迎向我们咨询。",
    s1Note: "残障福祉服务的事业者指定，另设专页详细说明 →",
    s1NoteLinkLabel: "残障福祉服务指定申请",
    s2Heading: "也能协助外国人办理公司设立与经营管理签证吗？",
    s2Body: (
      <>
        可以。外国人在日本创业时，<strong>公司设立与“经营・管理”在留资格是一体</strong>推进的。四葉行政書士事務所两者皆可承办，因此能梳理先后顺序与要件、同步进行。亦提供中文・英文咨询。
      </>
    ),
    s2LinkLabel: "在留资格（签证）申请的业务内容",
    s3Heading: "费用・受任流程",
    s3Link1Label: "公司设立・许可申请的报酬额（报酬额表）",
    s3Link2Label: "从咨询到完成的受任流程",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/legal/services/company",
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return (
    <LegalServicePage
      slug="company"
      crumbLabel={c.crumbLabel}
      serviceName="会社設立書類の作成・各種許認可申請の支援"
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={
        <p>
          {c.lead}
          <Placeholder reason="浦松＝対応する許認可種別の確定／石井弁護士＝業際表現" />
        </p>
      }
      governmentService
      internalLinks={c.internalLinks}
    >
      <div>
        <H2>{c.s1Heading}</H2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s1Body}
          <Placeholder reason="浦松＝対応許認可の確定（建設業・宅建業・古物・飲食・産廃 等）。確定までは「事業に必要な許認可はご相談ください」の一般表現で公開" />
        </p>
        <p className="mt-2 text-sm">
          {c.s1Note}{" "}
          <Link href="/legal/services/shogai-fukushi" className="text-primary underline">{c.s1NoteLinkLabel}</Link>
        </p>
      </div>

      <div>
        <H2>{c.s2Heading}</H2>
        <p className="mt-3 leading-relaxed text-text">{c.s2Body}</p>
        <p className="mt-2 text-sm">
          → <Link href="/legal/services/visa" className="text-primary underline">{c.s2LinkLabel}</Link>
        </p>
      </div>

      <div>
        <H2>{c.s3Heading}</H2>
        <p className="mt-2 text-sm">
          → <Link href="/legal/ryokin" className="text-primary underline">{c.s3Link1Label}</Link>
          <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
        </p>
        <p className="mt-1 text-sm">
          → <Link href="/legal/nagare" className="text-primary underline">{c.s3Link2Label}</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </div>
    </LegalServicePage>
  );
}
