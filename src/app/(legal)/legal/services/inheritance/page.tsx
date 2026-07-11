// ★参考ページ（型A）＝ /legal/services/inheritance　※原稿_行政書士 #3・共通シェル使用
// 配置＝src/app/(legal)/legal/services/inheritance/page.tsx。クロスリンク＝C1(→/souzoku)がpathで自動表示。
// フェーズI多言語化（2026-07-10）：方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/legal/page.tsx）。
// en/zh-tw/zh＝監修前ドラフト（フェーズI・2026-07-10）。serviceName＝JSON-LD用のためja固定（変更しない）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { LegalServicePage, H2 } from "@/components/shared/LegalServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import type { LangCode } from "@/config/languages";

type InheritanceCopy = {
  metaTitle: string;
  metaDesc: string;
  crumbLabel: string;
  heroAlt: string;
  h1: string;
  lead: React.ReactNode;
  scopeHeading: string;
  scopeIntro: string;
  scopeItems: string[];
  scopeNote: string;
  fudosanHeading: string;
  fudosanBody: React.ReactNode;
  souzokuGuideLabel: string;
  independenceNote: string;
  registrationNote: string;
  feesFlowHeading: string;
  ryokinLinkLabel: string;
  nagareLinkLabel: string;
  internalLinks: { href: string; label: string }[];
};

const COPY: Record<LangCode, InheritanceCopy> = {
  ja: {
    metaTitle: "相続・遺言の書類作成｜四葉行政書士事務所",
    metaDesc:
      "遺産分割協議書・遺言書の作成、戸籍等の相続関係書類の収集を、文京区の四葉行政書士事務所が支援します。相続した不動産の管理・活用・売却は関連事業の四葉不動産と連携。登記・税務は専門家におつなぎし、相続の全体を整理してお手伝いします。",
    crumbLabel: "相続・遺言・信託",
    heroAlt: "相続の手続きのイメージ（家系図・和風家屋・書類）",
    h1: "相続・遺言・信託",
    lead: (
      <>
        相続に伴う書類の作成——遺産分割協議書、遺言書の起案、戸籍等の収集——は、<strong>行政書士に依頼できます</strong>。四葉行政書士事務所は相続関係書類の作成・収集を担い、<strong>相続した不動産の「売る・貸す・持ち続ける」は関連事業の四葉不動産株式会社</strong>が対応します。相続登記は司法書士、相続税の申告は税理士の領域であり、それぞれ連携する専門家におつなぎします。
      </>
    ),
    scopeHeading: "行政書士は相続で何をしてくれますか？",
    scopeIntro: "四葉行政書士事務所が対応する相続業務は次のとおりです。",
    scopeItems: [
      "遺産分割協議書の作成",
      "遺言書（自筆証書・公正証書）の起案サポート",
      "相続関係説明図の作成・戸籍等必要書類の収集",
    ],
    scopeNote: "（相続登記＝司法書士／相続税申告＝税理士／争いがある場合＝弁護士、へ連携しておつなぎします）",
    fudosanHeading: "相続した不動産も相談できますか？",
    fudosanBody: (
      <>
        できます。相続した不動産の管理・活用・売却は、関連事業の<strong>四葉不動産株式会社</strong>（宅地建物取引業）が扱います。<strong>書類（行政書士）と不動産（宅建業）を同じ窓口で相談できる</strong>のが四葉の特長です。相続不動産の進め方は、四葉不動産の完全ガイドにまとまっています。
      </>
    ),
    souzokuGuideLabel: "文京区で不動産を相続したら——管理・活用・売却の完全ガイド（四葉不動産）",
    independenceNote:
      "※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。",
    registrationNote:
      "なお、相続登記は2024年4月1日から申請が義務化されています（不動産登記法第76条の2第1項・原則3年以内。2024年3月31日以前の相続分は2027年3月31日まで）。期限の観点でも、早めの着手をおすすめします。",
    feesFlowHeading: "費用・受任の流れ",
    ryokinLinkLabel: "相続関連書類作成の報酬額（報酬額表）",
    nagareLinkLabel: "ご相談から完了までの受任の流れ",
    internalLinks: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任の流れ" },
      { href: "/legal/faq", label: "よくある質問" },
    ],
  },
  en: {
    metaTitle: "Inheritance & Will Document Preparation｜四葉行政書士事務所",
    metaDesc:
      "四葉行政書士事務所 (Yotsuba Gyoseishoshi Office) in Bunkyo, Tokyo supports you with preparing estate-division agreements and wills and collecting family registers and other inheritance-related documents. Managing, using, or selling inherited real estate is handled with our affiliated company, Yotsuba Real Estate. We refer registration and tax matters to partner specialists and help you organize the inheritance as a whole.",
    crumbLabel: "Inheritance, Wills & Trusts",
    heroAlt: "Imagery of inheritance procedures: a family tree, a traditional Japanese house, and documents",
    h1: "Inheritance, Wills & Trusts",
    lead: (
      <>
        The paperwork that inheritance requires—estate-division agreements, draft wills, and collecting family registers—<strong>can be entrusted to a gyoseishoshi (administrative scrivener)</strong>. 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office) prepares and collects inheritance-related documents, while <strong>selling, leasing, or keeping inherited real estate is handled by our affiliated company, 四葉不動産株式会社 (Yotsuba Real Estate Co., Ltd.)</strong>. Inheritance registration is the domain of judicial scriveners and inheritance-tax filing that of licensed tax accountants; we connect you with our partner professionals in each field.
      </>
    ),
    scopeHeading: "What can a gyoseishoshi do in an inheritance?",
    scopeIntro: "The inheritance services our office handles are as follows.",
    scopeItems: [
      "Preparing estate-division agreements",
      "Support in drafting wills (holographic and notarized)",
      "Preparing diagrams of heirs and collecting family registers and other required documents",
    ],
    scopeNote:
      "(Inheritance registration: judicial scrivener / inheritance-tax filing: licensed tax accountant / disputes: attorney—we connect you with our partner professionals.)",
    fudosanHeading: "Can you also help with inherited real estate?",
    fudosanBody: (
      <>
        Yes. Managing, using, or selling inherited real estate is handled by our affiliated company, <strong>四葉不動産株式会社 (Yotsuba Real Estate Co., Ltd.)</strong>, a licensed real estate brokerage. <strong>Being able to discuss the paperwork (gyoseishoshi) and the property (real estate brokerage) at a single point of contact</strong> is what sets Yotsuba apart. Yotsuba Real Estate's complete guide walks you through what to do with inherited property.
      </>
    ),
    souzokuGuideLabel:
      "Inherited real estate in Bunkyo: the complete guide to managing, using, and selling (Yotsuba Real Estate)",
    independenceNote:
      "Note: 四葉不動産株式会社 and 四葉行政書士事務所 are separate businesses, and each accepts engagements independently (no referral fees are exchanged).",
    registrationNote:
      "Please note that applying for inheritance registration has been mandatory since April 1, 2024 (Article 76-2, Paragraph 1 of the Real Property Registration Act; within three years in principle, and by March 31, 2027 for inheritances that occurred on or before March 31, 2024). The deadlines are one more reason to start early.",
    feesFlowHeading: "Fees & How Engagement Works",
    ryokinLinkLabel: "Fees for preparing inheritance-related documents (fee schedule)",
    nagareLinkLabel: "How engagement works, from consultation to completion",
    internalLinks: [
      { href: "/legal/ryokin", label: "Fees" },
      { href: "/legal/nagare", label: "How Engagement Works" },
      { href: "/legal/faq", label: "FAQ" },
    ],
  },
  "zh-tw": {
    metaTitle: "繼承・遺囑文件製作｜四葉行政書士事務所",
    metaDesc:
      "遺產分割協議書・遺囑的製作、戶籍等繼承相關文件的蒐集，由文京區的四葉行政書士事務所為您協助。繼承不動產的管理・活用・出售，與關聯事業四葉不動產合作對應。登記・稅務將為您轉介專家，協助整理繼承的整體事務。",
    crumbLabel: "繼承・遺囑・信託",
    heroAlt: "繼承手續的意象（家系圖・日式家屋・文件）",
    h1: "繼承・遺囑・信託",
    lead: (
      <>
        繼承相關文件的製作——遺產分割協議書、遺囑的起草、戶籍等文件的蒐集——<strong>可以委託行政書士辦理</strong>。四葉行政書士事務所負責繼承相關文件的製作與蒐集，<strong>繼承的不動產「出售・出租・持有」則由關聯事業四葉不動産株式会社</strong>對應。繼承登記屬司法書士、遺產稅申報屬稅理士的領域，將分別為您轉介合作的專家。
      </>
    ),
    scopeHeading: "行政書士在繼承方面能提供什麼協助？",
    scopeIntro: "四葉行政書士事務所對應的繼承業務如下。",
    scopeItems: [
      "遺產分割協議書的製作",
      "遺囑（自書遺囑・公證遺囑）的起草支援",
      "繼承關係說明圖的製作・戶籍等必要文件的蒐集",
    ],
    scopeNote: "（繼承登記＝司法書士／遺產稅申報＝稅理士／有爭議時＝律師，將為您轉介合作專家）",
    fudosanHeading: "繼承的不動產也可以諮詢嗎？",
    fudosanBody: (
      <>
        可以。繼承不動產的管理・活用・出售，由關聯事業<strong>四葉不動産株式会社</strong>（宅地建物取引業）負責。<strong>文件（行政書士）與不動產（宅建業）可在同一窗口諮詢</strong>，是四葉的特色。繼承不動產的進行方式，已整理於四葉不動產的完全指南。
      </>
    ),
    souzokuGuideLabel: "在文京區繼承了不動產之後——管理・活用・出售完全指南（四葉不動產）",
    independenceNote:
      "※四葉不動産株式会社與四葉行政書士事務所為各自獨立的事業體，分別獨立受理委託（不收受介紹費等）。",
    registrationNote:
      "此外，繼承登記自2024年4月1日起已成為申請義務（不動產登記法第76條之2第1項・原則上3年以內。2024年3月31日以前發生的繼承，期限至2027年3月31日）。就期限而言，也建議及早著手。",
    feesFlowHeading: "費用・受任流程",
    ryokinLinkLabel: "繼承相關文件製作的報酬額（報酬額表）",
    nagareLinkLabel: "從諮詢到完成的受任流程",
    internalLinks: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/faq", label: "常見問題" },
    ],
  },
  zh: {
    metaTitle: "继承・遗嘱文件制作｜四葉行政書士事務所",
    metaDesc:
      "遗产分割协议书・遗嘱的制作、户籍等继承相关文件的收集，由文京区的四葉行政書士事務所为您协助。继承不动产的管理・活用・出售，与关联事业四葉不動産合作对应。登记・税务将为您对接专家，协助梳理继承的整体事务。",
    crumbLabel: "继承・遗嘱・信托",
    heroAlt: "继承手续的意象（家系图・日式家屋・文件）",
    h1: "继承・遗嘱・信托",
    lead: (
      <>
        继承相关文件的制作——遗产分割协议书、遗嘱的起草、户籍等文件的收集——<strong>可以委托行政书士办理</strong>。四葉行政書士事務所负责继承相关文件的制作与收集，<strong>继承的不动产“出售・出租・持有”则由关联事业四葉不動産株式会社</strong>对应。继承登记属司法书士、遗产税申报属税理士的领域，将分别为您对接合作的专家。
      </>
    ),
    scopeHeading: "行政书士在继承方面能提供哪些协助？",
    scopeIntro: "四葉行政書士事務所对应的继承业务如下。",
    scopeItems: [
      "遗产分割协议书的制作",
      "遗嘱（自书遗嘱・公证遗嘱）的起草支援",
      "继承关系说明图的制作・户籍等必要文件的收集",
    ],
    scopeNote: "（继承登记＝司法书士／遗产税申报＝税理士／有争议时＝律师，将为您对接合作专家）",
    fudosanHeading: "继承的不动产也可以咨询吗？",
    fudosanBody: (
      <>
        可以。继承不动产的管理・活用・出售，由关联事业<strong>四葉不動産株式会社</strong>（宅地建物取引業）负责。<strong>文件（行政书士）与不动产（宅建业）可在同一窗口咨询</strong>，是四葉的特色。继承不动产的推进方式，已整理在四葉不動産的完全指南中。
      </>
    ),
    souzokuGuideLabel: "在文京区继承了不动产之后——管理・活用・出售完全指南（四葉不動産）",
    independenceNote:
      "※四葉不動産株式会社与四葉行政書士事務所为各自独立的事业体，分别独立受理委托（不收受介绍费等）。",
    registrationNote:
      "此外，继承登记自2024年4月1日起已成为申请义务（不动产登记法第76条之2第1项・原则上3年以内。2024年3月31日以前发生的继承，期限至2027年3月31日）。从期限的角度，也建议尽早着手。",
    feesFlowHeading: "费用・受任流程",
    ryokinLinkLabel: "继承相关文件制作的报酬额（报酬额表）",
    nagareLinkLabel: "从咨询到完成的受任流程",
    internalLinks: [
      { href: "/legal/ryokin", label: "报酬额表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/faq", label: "常见问题" },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/legal/services/inheritance",
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return (
    <LegalServicePage
      slug="inheritance"
      crumbLabel={c.crumbLabel}
      serviceName="相続関係書類の作成・収集の支援"
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={
        <p>
          {c.lead}
          <Placeholder reason="石井弁護士＝業際表現の最終確認" />
        </p>
      }
      internalLinks={c.internalLinks}
    >
      <div>
        <H2>{c.scopeHeading}</H2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          {c.scopeIntro}
          <Placeholder reason="浦松＝対応範囲の確定" />
        </p>
        <ul className="mt-2 space-y-1 text-sm text-text">
          {c.scopeItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li className="text-text-muted">{c.scopeNote}</li>
        </ul>
      </div>

      <div>
        <H2>{c.fudosanHeading}</H2>
        <p className="mt-3 leading-relaxed text-text">{c.fudosanBody}</p>
        <p className="mt-2 text-sm">
          → <Link href={addLocalePrefix("/souzoku", locale)} className="text-primary underline">{c.souzokuGuideLabel}</Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">{c.independenceNote}</p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.registrationNote}</p>
      </div>

      <div>
        <H2>{c.feesFlowHeading}</H2>
        <p className="mt-2 text-sm">
          → <Link href={addLocalePrefix("/legal/ryokin", locale)} className="text-primary underline">{c.ryokinLinkLabel}</Link>
          <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
        </p>
        <p className="mt-1 text-sm">
          → <Link href={addLocalePrefix("/legal/nagare", locale)} className="text-primary underline">{c.nagareLinkLabel}</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </div>
    </LegalServicePage>
  );
}
