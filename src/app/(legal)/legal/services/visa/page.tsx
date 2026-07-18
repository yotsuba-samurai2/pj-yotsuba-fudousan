// ★参考ページ（型A）＝ /legal/services/visa　※原稿_行政書士 #2・共通シェル LegalServicePage 使用
// 配置＝src/app/(legal)/legal/services/visa/page.tsx
// フェーズI多言語化（2026-07-10）：COPY: Record<LangCode,…>＋getRequestLocale方式（手本=/legal page.tsx）。
// en/zh-tw/zh=監修前ドラフト（フェーズI・2026-07-10）。
// 固有名詞（四葉行政書士事務所・浦松丈二・四葉不動産株式会社）＝全ロケール同一表記。
// serviceName（JSON-LD Service name）・href・画像パス＝変更しない。Placeholder reason＝内部メモ（本番非表示）のためja固定。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { LegalServicePage, H2 } from "@/components/shared/LegalServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import type { LangCode } from "@/config/languages";

type VisaCopy = {
  metaTitle: string;
  metaDesc: string;
  crumbLabel: string;
  heroAlt: string;
  h1: string;
  lead: React.ReactNode;
  internalLinks: { href: string; label: string }[];
  sections: (locale: LangCode) => React.ReactNode;
};

const COPY: Record<LangCode, VisaCopy> = {
  ja: {
    metaTitle: "在留資格・ビザ申請の取次｜四葉行政書士事務所",
    metaDesc:
      "在留資格の認定・変更・更新、永住・帰化のご相談を、文京区の四葉行政書士事務所が支援します。中国語・英語対応。元新聞記者で中国や台湾、タイでの駐在経験を持つ行政書士が、外国人の在留手続きを言葉と制度の両面からお手伝いします。",
    crumbLabel: "在留資格・ビザ申請",
    heroAlt: "在留資格・ビザ申請のイメージ（パスポートと地球儀）",
    h1: "在留資格・ビザ申請",
    lead: (
      <p>
        在留資格（ビザ）の認定・変更・更新の手続きは、<strong>申請取次行政書士に依頼できます</strong>。四葉行政書士事務所は、就労・経営管理・家族滞在などの在留資格申請と、永住・帰化のご相談に対応します。代表の浦松 丈二は<strong>中国や台湾、タイでの駐在経験</strong>を持ち、<strong>日本語・英語・中国語（繁体字・簡体字）</strong>で相談できます。
        <Placeholder reason="浦松＝申請取次の届出有無・対応する在留資格種別の確定" />
      </p>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任の流れ" },
      { href: "/legal/services/company", label: "会社設立・各種許認可" },
    ],
    sections: (locale) => (
      <>
        <div>
          <H2>どんな在留資格に対応していますか？</H2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            四葉行政書士事務所が扱う主な在留資格は次のとおりです。
            <Placeholder reason="浦松＝対応種別の確定" />
          </p>
          <ul className="mt-2 space-y-1 text-sm text-text">
            <li>就労系：技術・人文知識・国際業務、経営・管理、特定技能 ほか</li>
            <li>身分系：日本人の配偶者等、永住者 ほか</li>
            <li>家族滞在・留学 ほか</li>
            <li>
              <strong>経営・管理</strong>：会社設立と一体で進められます →{" "}
              <Link href={addLocalePrefix("/legal/services/company", locale)} className="text-primary underline">会社設立と経営管理ビザ</Link>
            </li>
            <li>
              育成就労（2027年4月施行）への対応は、制度の施行にあわせてご案内します
              <Placeholder reason="浦松＝育成就労対応の範囲" />
            </li>
          </ul>
        </div>

        <div>
          <H2>中国語・英語での相談はできますか？</H2>
          <p className="mt-3 leading-relaxed text-text">
            できます。代表の浦松 丈二は元毎日新聞中国総局長で、日本語・英語・中国語（繁体字・簡体字）で相談に対応します。在留手続きは、言語と制度の両方でつまずきやすい分野です。四葉行政書士事務所は、<strong>母語での相談</strong>と<strong>制度の整理</strong>の両面からお手伝いします。
          </p>
        </div>

        <div>
          <H2>住まいや会社設立も一緒に相談できますか？</H2>
          <p className="mt-3 leading-relaxed text-text">
            できます。経営・管理の在留資格は会社設立と一体で進むため、<strong>設立書類と在留資格申請を一体で</strong>扱えます。また、来日する従業員やご家族の<strong>住まい（社宅・賃貸）</strong>は、関連事業の四葉不動産株式会社が多言語で対応します →{" "}
            <Link href={addLocalePrefix("/toushi/shataku", locale)} className="text-primary underline">社宅・法人賃貸のサポート</Link>／
            <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">外国人・多言語のお部屋探し</Link>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            ※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
          </p>
        </div>

        <div>
          <H2>費用・受任の流れ</H2>
          <p className="mt-2 text-sm">
            → <Link href={addLocalePrefix("/legal/ryokin", locale)} className="text-primary underline">在留資格・ビザ申請の報酬額（報酬額表）</Link>
            <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
          </p>
          <p className="mt-1 text-sm">
            → <Link href={addLocalePrefix("/legal/nagare", locale)} className="text-primary underline">ご相談から完了までの受任の流れ</Link>
            <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
          </p>
        </div>
      </>
    ),
  },
  en: {
    metaTitle: "Visa & Residence Status Applications｜四葉行政書士事務所",
    metaDesc:
      "Support for Certificate of Eligibility applications, changes and renewals of residence status, and consultations on permanent residency and naturalization, from 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office) in Bunkyo, Tokyo. Chinese and English available. A gyoseishoshi (administrative scrivener) and former newspaper journalist who has lived in four countries supports foreign residents with both the language and the system.",
    crumbLabel: "Visa & Residence Status",
    heroAlt: "Visa and residence status applications (passport and globe)",
    h1: "Visa & Residence Status Applications",
    lead: (
      <p>
        Applications for a Certificate of Eligibility and for changes and renewals of residence status <strong>can be entrusted to a certified application agent</strong> — a gyoseishoshi (administrative scrivener) authorized to submit immigration applications on your behalf. 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office) handles residence status applications such as work-related statuses, Business Manager, and Dependent, along with consultations on permanent residency and naturalization. Our representative, 浦松 丈二 (Joji Uramatsu), <strong>has lived in four countries</strong> and offers consultations in <strong>Japanese, English, Traditional Chinese, and Simplified Chinese</strong>.
        <Placeholder reason="浦松＝申請取次の届出有無・対応する在留資格種別の確定" />
      </p>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "Fees" },
      { href: "/legal/nagare", label: "How Engagement Works" },
      { href: "/legal/services/company", label: "Company Formation & Licensing" },
    ],
    sections: (locale) => (
      <>
        <div>
          <H2>Which residence statuses do you handle?</H2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            The main residence statuses handled by 四葉行政書士事務所 are as follows.
            <Placeholder reason="浦松＝対応種別の確定" />
          </p>
          <ul className="mt-2 space-y-1 text-sm text-text">
            <li>Work-related: Engineer / Specialist in Humanities / International Services, Business Manager, Specified Skilled Worker, and more</li>
            <li>Status-based: Spouse or Child of Japanese National, Permanent Resident, and more</li>
            <li>Dependent, Student, and more</li>
            <li>
              <strong>Business Manager</strong>: can be handled together with company formation →{" "}
              <Link href={addLocalePrefix("/legal/services/company", locale)} className="text-primary underline">Company Formation & the Business Manager Visa</Link>
            </li>
            <li>
              Support for the new Employment for Skill Development (ikusei shuro) system, effective April 2027, will be announced as the system comes into force
              <Placeholder reason="浦松＝育成就労対応の範囲" />
            </li>
          </ul>
        </div>

        <div>
          <H2>Can I consult in Chinese or English?</H2>
          <p className="mt-3 leading-relaxed text-text">
            Yes. Our representative, 浦松 丈二 (Joji Uramatsu), formerly China General Bureau Chief of the Mainichi Shimbun, handles consultations in Japanese, English, Traditional Chinese, and Simplified Chinese. Residence procedures are a field where people stumble over both the language and the system. 四葉行政書士事務所 supports you on both fronts: <strong>consultation in your own language</strong> and <strong>a clear map of the procedures</strong>.
          </p>
        </div>

        <div>
          <H2>Can we also discuss housing or company formation together?</H2>
          <p className="mt-3 leading-relaxed text-text">
            Yes. Because the Business Manager residence status moves in step with company formation, we can handle <strong>incorporation documents and the residence status application as one package</strong>. And for the <strong>housing (company housing or rentals)</strong> of arriving employees and their families, our affiliated business 四葉不動産株式会社 (Yotsuba Real Estate) provides multilingual support →{" "}
            <Link href={addLocalePrefix("/toushi/shataku", locale)} className="text-primary underline">Company Housing & Corporate Lease Support</Link>／
            <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">Multilingual Home Search for Foreign Residents</Link>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            ※四葉不動産株式会社 (Yotsuba Real Estate) and 四葉行政書士事務所 are separate, independent businesses, and each accepts engagements independently (no referral fees are exchanged).
          </p>
        </div>

        <div>
          <H2>Fees & How Engagement Works</H2>
          <p className="mt-2 text-sm">
            → <Link href={addLocalePrefix("/legal/ryokin", locale)} className="text-primary underline">Fees for Visa & Residence Status Applications (Fee Schedule)</Link>
            <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
          </p>
          <p className="mt-1 text-sm">
            → <Link href={addLocalePrefix("/legal/nagare", locale)} className="text-primary underline">How Engagement Works, from Consultation to Completion</Link>
            <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
          </p>
        </div>
      </>
    ),
  },
  "zh-tw": {
    metaTitle: "在留資格（簽證）申請取次｜四葉行政書士事務所",
    metaDesc:
      "在留資格（簽證）的認定・變更・更新，以及永住・歸化的諮詢，由東京都文京區的四葉行政書士事務所協助。提供中文・英文服務。曾任新聞記者、擁有海外4國居住經驗的行政書士，從語言與制度兩方面協助外國人的在留手續。",
    crumbLabel: "在留資格（簽證）申請",
    heroAlt: "在留資格（簽證）申請的示意圖（護照與地球儀）",
    h1: "在留資格（簽證）申請",
    lead: (
      <p>
        在留資格（簽證）的認定・變更・更新手續，<strong>可以委託申請取次行政書士辦理</strong>。四葉行政書士事務所受理工作、經營管理、家族滯在等在留資格申請，並提供永住・歸化的諮詢。代表浦松 丈二<strong>擁有海外4國的居住經驗</strong>，可用<strong>日文・英文・中文（繁體・簡體）</strong>諮詢。
        <Placeholder reason="浦松＝申請取次の届出有無・対応する在留資格種別の確定" />
      </p>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/services/company", label: "公司設立・各類許可" },
    ],
    sections: (locale) => (
      <>
        <div>
          <H2>受理哪些在留資格（簽證）？</H2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            四葉行政書士事務所受理的主要在留資格如下。
            <Placeholder reason="浦松＝対応種別の確定" />
          </p>
          <ul className="mt-2 space-y-1 text-sm text-text">
            <li>工作類：技術・人文知識・國際業務、經營・管理、特定技能等</li>
            <li>身分類：日本人配偶者等、永住者等</li>
            <li>家族滯在・留學等</li>
            <li>
              <strong>經營・管理</strong>：可與公司設立一併辦理 →{" "}
              <Link href={addLocalePrefix("/legal/services/company", locale)} className="text-primary underline">公司設立與經營管理簽證</Link>
            </li>
            <li>
              「育成就勞」制度（2027年4月施行）的相關服務，將配合制度施行陸續公告
              <Placeholder reason="浦松＝育成就労対応の範囲" />
            </li>
          </ul>
        </div>

        <div>
          <H2>可以用中文或英文諮詢嗎？</H2>
          <p className="mt-3 leading-relaxed text-text">
            可以。代表浦松 丈二曾任每日新聞中國總局長，能以日文・英文・中文（繁體・簡體）對應諮詢。在留手續是語言與制度兩方面都容易卡關的領域。四葉行政書士事務所從<strong>母語諮詢</strong>與<strong>制度梳理</strong>兩方面協助您。
          </p>
        </div>

        <div>
          <H2>住居或公司設立也可以一併諮詢嗎？</H2>
          <p className="mt-3 leading-relaxed text-text">
            可以。經營・管理的在留資格與公司設立一體推進，因此<strong>設立文件與在留資格申請可一併辦理</strong>。此外，來日工作的員工與家人的<strong>住居（公司宿舍・租屋）</strong>，由關聯事業四葉不動産株式会社以多語言對應 →{" "}
            <Link href={addLocalePrefix("/toushi/shataku", locale)} className="text-primary underline">公司宿舍・法人租賃支援</Link>／
            <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">外國人・多語言找房</Link>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            ※四葉不動産株式会社與四葉行政書士事務所為各自獨立的事業體，分別獨立受理委託（不收受介紹費等）。
          </p>
        </div>

        <div>
          <H2>費用・受任流程</H2>
          <p className="mt-2 text-sm">
            → <Link href={addLocalePrefix("/legal/ryokin", locale)} className="text-primary underline">在留資格（簽證）申請的報酬額（報酬額表）</Link>
            <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
          </p>
          <p className="mt-1 text-sm">
            → <Link href={addLocalePrefix("/legal/nagare", locale)} className="text-primary underline">從諮詢到完成的受任流程</Link>
            <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
          </p>
        </div>
      </>
    ),
  },
  zh: {
    metaTitle: "在留资格（签证）申请取次｜四葉行政書士事務所",
    metaDesc:
      "在留资格（签证）的认定・变更・更新，以及永住・归化的咨询，由东京都文京区的四葉行政書士事務所协助。提供中文・英文服务。曾任新闻记者、拥有海外4国居住经验的行政书士，从语言与制度两方面协助外国人的在留手续。",
    crumbLabel: "在留资格（签证）申请",
    heroAlt: "在留资格（签证）申请的示意图（护照与地球仪）",
    h1: "在留资格（签证）申请",
    lead: (
      <p>
        在留资格（签证）的认定・变更・更新手续，<strong>可以委托申请取次行政书士办理</strong>。四葉行政書士事務所受理工作、经营管理、家族滞在等在留资格申请，并提供永住・归化的咨询。代表浦松 丈二<strong>拥有海外4国的居住经验</strong>，可用<strong>日语・英语・中文（繁体・简体）</strong>咨询。
        <Placeholder reason="浦松＝申請取次の届出有無・対応する在留資格種別の確定" />
      </p>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "报酬额表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/services/company", label: "公司设立・各类许可" },
    ],
    sections: (locale) => (
      <>
        <div>
          <H2>受理哪些在留资格（签证）？</H2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            四葉行政書士事務所受理的主要在留资格如下。
            <Placeholder reason="浦松＝対応種別の確定" />
          </p>
          <ul className="mt-2 space-y-1 text-sm text-text">
            <li>工作类：技术・人文知识・国际业务、经营・管理、特定技能等</li>
            <li>身份类：日本人配偶者等、永住者等</li>
            <li>家族滞在・留学等</li>
            <li>
              <strong>经营・管理</strong>：可与公司设立一并办理 →{" "}
              <Link href={addLocalePrefix("/legal/services/company", locale)} className="text-primary underline">公司设立与经营管理签证</Link>
            </li>
            <li>
              “育成就劳”制度（2027年4月施行）的相关服务，将配合制度施行陆续公告
              <Placeholder reason="浦松＝育成就労対応の範囲" />
            </li>
          </ul>
        </div>

        <div>
          <H2>可以用中文或英文咨询吗？</H2>
          <p className="mt-3 leading-relaxed text-text">
            可以。代表浦松 丈二曾任每日新闻中国总局长，能以日语・英语・中文（繁体・简体）对应咨询。在留手续是语言与制度两方面都容易遇到困难的领域。四葉行政書士事務所从<strong>母语咨询</strong>与<strong>制度梳理</strong>两方面协助您。
          </p>
        </div>

        <div>
          <H2>住房或公司设立也可以一并咨询吗？</H2>
          <p className="mt-3 leading-relaxed text-text">
            可以。经营・管理的在留资格与公司设立一体推进，因此<strong>设立文件与在留资格申请可一并办理</strong>。此外，来日工作的员工与家人的<strong>住房（公司宿舍・租房）</strong>，由关联事业四葉不動産株式会社以多语言对应 →{" "}
            <Link href={addLocalePrefix("/toushi/shataku", locale)} className="text-primary underline">公司宿舍・法人租赁支援</Link>／
            <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">外国人・多语言找房</Link>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            ※四葉不動産株式会社与四葉行政書士事務所为各自独立的事业体，分别独立受理委托（不收受介绍费等）。
          </p>
        </div>

        <div>
          <H2>费用・受任流程</H2>
          <p className="mt-2 text-sm">
            → <Link href={addLocalePrefix("/legal/ryokin", locale)} className="text-primary underline">在留资格（签证）申请的报酬额（报酬额表）</Link>
            <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
          </p>
          <p className="mt-1 text-sm">
            → <Link href={addLocalePrefix("/legal/nagare", locale)} className="text-primary underline">从咨询到完成的受任流程</Link>
            <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
          </p>
        </div>
      </>
    ),
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/legal/services/visa",
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return (
    <LegalServicePage
      slug="visa"
      crumbLabel={c.crumbLabel}
      serviceName="在留資格・ビザ申請の取次・支援"
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={c.lead}
      governmentService
      internalLinks={c.internalLinks}
    >
      {c.sections(locale)}
    </LegalServicePage>
  );
}
