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
import { LEGAL_TOP_V10_COPY } from "@/lib/legal/top-copy";
import { SR_LAUNCHED } from "@/lib/shared/office";

type VisaCopy = {
  metaTitle: string;
  crumbLabel: string;
  heroAlt: string;
  h1: string;
  internalLinks: { href: string; label: string }[];
  sections: (locale: LangCode) => React.ReactNode;
};

const COPY: Record<LangCode, VisaCopy> = {
  ja: {
    metaTitle: "在留資格・ビザ申請の取次｜四葉行政書士事務所",
    crumbLabel: "在留資格・ビザ申請",
    heroAlt: "在留資格・ビザ申請のイメージ（パスポートと地球儀）",
    h1: "在留資格・ビザ申請",
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
              育成就労（2027年4月施行）のうち、監理支援機関に求められる外部監査については
              <Link href="/legal/services/ikuseishuro-gaibu-kansa" className="text-primary underline">育成就労の外部監査人</Link>
              をご覧ください
            </li>
          </ul>
        </div>

        <div><H2>{LEGAL_TOP_V10_COPY[locale].chineseTitle}</H2><p className="mt-3 leading-relaxed text-text">{LEGAL_TOP_V10_COPY[locale].chinese}</p></div>

        <div>
          <H2>住まいや会社設立も一緒に相談できますか？</H2>
          <p className="mt-3 leading-relaxed text-text">
            できます。経営・管理の在留資格は会社設立と一体で進むため、<strong>設立書類と在留資格申請を一体で</strong>扱えます。また、来日する従業員やご家族の<strong>住まい（社宅・賃貸）</strong>は、関連事業の四葉不動産株式会社が多言語で対応します →{" "}
            <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">借り上げ社宅の導入ガイド</Link>／
            <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">外国人・多言語のお部屋探し</Link>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            ※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
          </p>
        </div>

        <div>
          <H2>会社が海外から社員を呼ぶ場合も、このページですか？</H2>
          <p className="mt-3 leading-relaxed text-text">
            このページは<strong>申請するご本人</strong>向けです。会社として海外にいる社員を迎える場合は、企業の側にも<strong>期限のある手続き</strong>（在留資格認定証明書の交付申請、入国後14日以内の住居地の届出など）があります。人事・総務のご担当者向けに、着任日から逆算した進め方と帯同するご家族の扱いを別のページにまとめています →{" "}
            <Link href={addLocalePrefix("/legal/services/gaikokujin-shain", locale)} className="text-primary underline">外国人社員を海外から迎えるとき——企業が押さえる手続きと期限</Link>
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
    crumbLabel: "Visa & Residence Status",
    heroAlt: "Visa and residence status applications (passport and globe)",
    h1: "Visa & Residence Status Applications",
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
              For the external audit required of supervising support organisations under the new Employment for Skill Development (ikusei shuro) system, effective April 2027, see{" "}
              <Link href="/legal/services/ikuseishuro-gaibu-kansa" className="text-primary underline">External auditors under the Employment for Skill Development system</Link>
              {" "}(Japanese)
            </li>
          </ul>
        </div>

        <div><H2>{LEGAL_TOP_V10_COPY[locale].chineseTitle}</H2><p className="mt-3 leading-relaxed text-text">{LEGAL_TOP_V10_COPY[locale].chinese}</p></div>

        <div>
          <H2>Can we also discuss housing or company formation together?</H2>
          <p className="mt-3 leading-relaxed text-text">
            Yes. Because the Business Manager residence status moves in step with company formation, we can handle <strong>incorporation documents and the residence status application as one package</strong>. And for the <strong>housing (company housing or rentals)</strong> of arriving employees and their families, our affiliated business 四葉不動産株式会社 (Yotsuba Real Estate) provides multilingual support →{" "}
            <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">Company Housing & Corporate Lease Support</Link>／
            <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">Multilingual Home Search for Foreign Residents</Link>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            ※四葉不動産株式会社 (Yotsuba Real Estate) and 四葉行政書士事務所 are separate, independent businesses, and each accepts engagements independently (no referral fees are exchanged).
          </p>
        </div>

        <div>
          <H2>Is this also the right page if our company is bringing an employee from overseas?</H2>
          <p className="mt-3 leading-relaxed text-text">
            This page is written for <strong>the applicant</strong>. When a company brings in an employee from abroad, the employer has its own <strong>deadline-bound steps</strong>—applying for the certificate of eligibility, filing the residence address within 14 days of arrival, and so on. For HR and admin teams, we set out the countdown from the start date and how accompanying family members are treated on a separate page →{" "}
            <Link href={addLocalePrefix("/legal/services/gaikokujin-shain", locale)} className="text-primary underline">Bringing employees from overseas — the steps and deadlines companies need to track</Link>
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
    crumbLabel: "在留資格（簽證）申請",
    heroAlt: "在留資格（簽證）申請的示意圖（護照與地球儀）",
    h1: "在留資格（簽證）申請",
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
              「育成就勞」制度（2027年4月施行）中，監理支援機關所需的外部稽核，請參閱{" "}
              <Link href="/legal/services/ikuseishuro-gaibu-kansa" className="text-primary underline">育成就勞的外部稽核人員</Link>
              （日文頁面）
            </li>
          </ul>
        </div>

        <div><H2>{LEGAL_TOP_V10_COPY[locale].chineseTitle}</H2><p className="mt-3 leading-relaxed text-text">{LEGAL_TOP_V10_COPY[locale].chinese}</p></div>

        <div>
          <H2>住居或公司設立也可以一併諮詢嗎？</H2>
          <p className="mt-3 leading-relaxed text-text">
            可以。經營・管理的在留資格與公司設立一體推進，因此<strong>設立文件與在留資格申請可一併辦理</strong>。此外，來日工作的員工與家人的<strong>住居（公司宿舍・租屋）</strong>，由關聯事業四葉不動産株式会社以多語言對應 →{" "}
            <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">公司宿舍・法人租賃支援</Link>／
            <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">外國人・多語言找房</Link>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            ※四葉不動産株式会社與四葉行政書士事務所為各自獨立的事業體，分別獨立受理委託（不收受介紹費等）。
          </p>
        </div>

        <div>
          <H2>公司從海外聘請員工時，也是看這一頁嗎？</H2>
          <p className="mt-3 leading-relaxed text-text">
            這一頁是寫給<strong>申請本人</strong>看的。公司從海外迎接員工時，企業方也有<strong>附期限的手續</strong>（在留資格認定證明書的交付申請、入境後14日內的居住地申報等）。我們在另一頁，為人事・總務的承辦人整理了從到任日往回推算的進行方式，以及帶同家屬的處理 →{" "}
            <Link href={addLocalePrefix("/legal/services/gaikokujin-shain", locale)} className="text-primary underline">從海外迎接外籍員工時——企業須掌握的手續與期限</Link>
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
    crumbLabel: "在留资格（签证）申请",
    heroAlt: "在留资格（签证）申请的示意图（护照与地球仪）",
    h1: "在留资格（签证）申请",
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
              “育成就劳”制度（2027年4月施行）中，监理支援机构所需的外部审计，请参阅{" "}
              <Link href="/legal/services/ikuseishuro-gaibu-kansa" className="text-primary underline">育成就劳的外部审计人员</Link>
              （日文页面）
            </li>
          </ul>
        </div>

        <div><H2>{LEGAL_TOP_V10_COPY[locale].chineseTitle}</H2><p className="mt-3 leading-relaxed text-text">{LEGAL_TOP_V10_COPY[locale].chinese}</p></div>

        <div>
          <H2>住房或公司设立也可以一并咨询吗？</H2>
          <p className="mt-3 leading-relaxed text-text">
            可以。经营・管理的在留资格与公司设立一体推进，因此<strong>设立文件与在留资格申请可一并办理</strong>。此外，来日工作的员工与家人的<strong>住房（公司宿舍・租房）</strong>，由关联事业四葉不動産株式会社以多语言对应 →{" "}
            <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">公司宿舍・法人租赁支援</Link>／
            <Link href={addLocalePrefix("/global", locale)} className="text-primary underline">外国人・多语言找房</Link>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            ※四葉不動産株式会社与四葉行政書士事務所为各自独立的事业体，分别独立受理委托（不收受介绍费等）。
          </p>
        </div>

        <div>
          <H2>公司从海外聘请员工时，也是看这一页吗？</H2>
          <p className="mt-3 leading-relaxed text-text">
            这一页是写给<strong>申请本人</strong>看的。公司从海外迎接员工时，企业方也有<strong>附期限的手续</strong>（在留资格认定证明书的交付申请、入境后14日内的居住地申报等）。我们在另一页，为人事・总务的承办人整理了从到任日倒推的进行方式，以及带同家属的处理 →{" "}
            <Link href={addLocalePrefix("/legal/services/gaikokujin-shain", locale)} className="text-primary underline">从海外迎接外籍员工时——企业须掌握的手续与期限</Link>
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
    description: LEGAL_TOP_V10_COPY[locale].visa + " " + LEGAL_TOP_V10_COPY[locale].chineseShort,
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
      ctaIntent="visa"
      serviceName="在留資格・ビザ申請の取次・支援"
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={<div className="space-y-3">
        <p>{LEGAL_TOP_V10_COPY[locale].visa}</p>
        <p>{LEGAL_TOP_V10_COPY[locale].chineseShort}</p>
        {SR_LAUNCHED && <p>{LEGAL_TOP_V10_COPY[locale].dual}</p>}
        <p>{LEGAL_TOP_V10_COPY[locale].consistency}</p>
      </div>}
      internalLinks={c.internalLinks}
    >
      {c.sections(locale)}
      <div>
        <H2>{LEGAL_TOP_V10_COPY[locale].laborTitle}</H2>
        <p className="mt-3 leading-relaxed text-text">{SR_LAUNCHED ? LEGAL_TOP_V10_COPY[locale].labor : LEGAL_TOP_V10_COPY[locale].unavailable}</p>
      </div>
    </LegalServicePage>
  );
}
