// /souzoku/nagare（型D・HowTo）＝原稿_不動産 #6
// JSON-LD＝HowTo（既存部品）＋BreadcrumbList（Breadcrumb部品）＋author=Person(@id参照)。
// 不動産の相談料＝2026-07-11浦松確定（改訂版・全不動産ページ共通）：初回のご相談は無料／媒介に関する相談は
// 仲介手数料の範囲／媒介を伴わないコンサル（媒介以外の関連業務）のみ、2回目以降に別合意で原則30分5,500円（税込）。
// 根拠＝国交省 解釈・運用の考え方（媒介以外の関連業務は明確区分・事前設定・別合意で受領）。石井弁護士の最終確認を通すこと。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/access／/legal/nagare）。HowTo JSON-LDは画面表示と同一のロケール済みsteps配列から生成（ja出力は従来と同一）。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳（繼承・不動產）／zh=大陸表記。金額・法的意味は全ロケール不変。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { Placeholder } from "@/components/shared/Placeholder";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import type { LangCode } from "@/config/languages";

type NagareStep = { name: string; text: string };

type SouzokuNagareCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbParent: string;
  breadcrumbCurrent: string;
  howtoName: string;
  howtoDesc: string;
  h1: string;
  lead: React.ReactNode;
  startH2: string;
  startBody: React.ReactNode;
  stepsH2: string;
  steps: NagareStep[];
  expertsH2: string;
  expertsBody: React.ReactNode;
  guideLinkLabel: string;
  inheritanceLinkLabel: string;
  independenceNote: string;
  relatedAria: string;
  relatedHeading: string;
  relatedLinks: { href: string; label: string }[];
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
};

const COPY: Record<LangCode, SouzokuNagareCopy> = {
  ja: {
    metaTitle: "相続した不動産の相談から売却・活用までの流れ｜四葉不動産",
    metaDesc:
      "相続した不動産をどう進めるか——四葉不動産株式会社が、ご相談から現状の整理、査定、管理・活用・売却の方針決定、契約・引渡しまでの流れをご説明します。文京区・茗荷谷の地元で、元新聞記者の宅建士がLINE・電話・オンラインで最初の一歩からお手伝いします。",
    breadcrumbHome: "ホーム",
    breadcrumbParent: "文京区で不動産を相続したら",
    breadcrumbCurrent: "相談〜解決の流れ",
    howtoName: "相続した不動産の相談から解決までの流れ",
    howtoDesc: "四葉不動産株式会社での、相続不動産のご相談から管理・活用・売却の実行までの流れです。",
    h1: "相続した不動産の相談から売却・活用までの流れ",
    lead: (
      <>
        相続した不動産の相談は、<strong>「まず現状を話す」ところから始められます。</strong>{" "}
        四葉不動産株式会社は、ご相談→現状ヒアリング→査定→方針（管理・活用・売却）の整理→ご提案→契約→引渡し、という流れでお手伝いします。相続登記や相続税など不動産会社の業務外の手続きは、司法書士・税理士等の専門家と連携しながら進めます。
      </>
    ),
    startH2: "相続した不動産の相談は、何から始めますか？",
    startBody: (
      <>
        まずはLINEか電話で「相続した家をどうしたらいい？」の一言からで大丈夫です。四葉不動産株式会社は、状況を伺い、次の一歩を一緒に整理します。<strong>初回のご相談は無料</strong>です。当社に売却・活用（媒介）をご依頼いただく前提のご相談は、仲介手数料の範囲で承ります。媒介を伴わない不動産コンサルティング（他社物件のセカンドオピニオン、資産全体の活用・保有方針の助言など＝媒介以外の関連業務）をご希望の場合は、2回目以降、別途の合意のうえ原則30分5,500円（税込）で承ります（オンライン可）。
      </>
    ),
    stepsH2: "相談から解決までの流れは、どうなりますか？（6ステップ）",
    steps: [
      {
        name: "ご相談（無料）",
        text: "LINE・電話・オンライン。「何から手をつけるか分からない」段階で構いません。",
      },
      {
        name: "現状のヒアリング",
        text: "物件の場所・種類、相続の状況、相続登記の有無などを伺います。",
      },
      {
        name: "査定・現状整理",
        text: "物件を確認し、管理・活用・売却それぞれの見通しを整理します。",
      },
      {
        name: "方針のご提案",
        text: "「管理」「活用（賃貸等）」「売却」の3つの出口から、ご希望に合う方向をご提案します。",
      },
      {
        name: "ご契約",
        text: "売却なら媒介契約、賃貸・管理なら管理委託契約を、内容をご説明のうえ締結します。",
      },
      {
        name: "実行・引渡し",
        text: "販売活動や入居者募集、引渡し・精算まで対応します。",
      },
    ],
    expertsH2: "相続登記や相続税は、四葉不動産が手続きしますか？",
    expertsBody: (
      <>
        四葉不動産株式会社は、不動産の相談・売買・賃貸・管理を扱います。<strong>相続登記は司法書士、相続税は税理士</strong>の領域のため、これらは提携する専門家と連携して進めます。相続に関する書類作成・許認可は、関連事業の四葉行政書士事務所（別事業体）が対応できます。
      </>
    ),
    guideLinkLabel: "文京区で不動産を相続したら——完全ガイド",
    inheritanceLinkLabel: "相続・遺言の手続き（四葉行政書士事務所）",
    independenceNote:
      "※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。",
    relatedAria: "関連リンク",
    relatedHeading: "このページの関連リンク",
    relatedLinks: [
      { href: "/souzoku", label: "文京区で不動産を相続したら" },
      { href: "/access", label: "アクセス・料金" },
    ],
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
  },
  en: {
    metaTitle: "Inherited Real Estate: From Consultation to Sale or Utilization | 四葉不動産株式会社 (Yotsuba Real Estate)",
    metaDesc:
      "How to move forward with inherited real estate — Yotsuba Real Estate Co., Ltd. explains the process from your first consultation through organizing the current situation, appraisal, deciding on a policy of management, utilization, or sale, to contract and handover. From our local base in Myogadani, Bunkyo-ku, a former newspaper reporter and Licensed Real Estate Transaction Specialist helps you take the first step via LINE, phone, or online.",
    breadcrumbHome: "Home",
    breadcrumbParent: "Inheriting Property in Bunkyo",
    breadcrumbCurrent: "From Consultation to Resolution",
    howtoName: "Inherited Real Estate: The Process from Consultation to Resolution",
    howtoDesc:
      "The process at Yotsuba Real Estate Co., Ltd., from your first consultation about inherited real estate to carrying out management, utilization, or sale.",
    h1: "Inherited Real Estate: The Process from Consultation to Sale or Utilization",
    lead: (
      <>
        A consultation about inherited real estate can begin <strong>simply by telling us where things stand.</strong>{" "}
        Yotsuba Real Estate Co., Ltd. assists you through the following flow: consultation → hearing on the current situation → appraisal → organizing the policy (management, utilization, or sale) → proposal → contract → handover. Procedures outside a real estate company&apos;s scope, such as inheritance registration and inheritance tax, proceed in coordination with judicial scriveners, licensed tax accountants, and other professionals.
      </>
    ),
    startH2: "Where do I start with a consultation about inherited real estate?",
    startBody: (
      <>
        A single message via LINE or a phone call — &quot;What should I do with the house I inherited?&quot; — is enough to begin. Yotsuba Real Estate Co., Ltd. listens to your situation and organizes the next step together with you. <strong>Your first consultation is free.</strong> Consultations premised on entrusting us with the sale or utilization (brokerage) are covered by the brokerage commission. If you would like real estate consulting not involving brokerage (a second opinion on a property handled by another company, advice on utilizing or holding your overall assets, and the like — i.e., related work other than brokerage), we provide it from the second session onward under a separate agreement, in principle at ¥5,500 (tax incl.) per 30 minutes (online sessions available).
      </>
    ),
    stepsH2: "What does the process from consultation to resolution look like? (6 steps)",
    steps: [
      {
        name: "Consultation (Free)",
        text: "Via LINE, phone, or online. It is fine to start at the stage of “I don't know where to begin.”",
      },
      {
        name: "Hearing on the Current Situation",
        text: "We ask about the property's location and type, the status of the inheritance, and whether inheritance registration has been completed.",
      },
      {
        name: "Appraisal & Organizing the Situation",
        text: "We check the property and lay out the outlook for each option: management, utilization, and sale.",
      },
      {
        name: "Policy Proposal",
        text: "From the three exits of “management,” “utilization (leasing, etc.),” and “sale,” we propose the direction that fits your wishes.",
      },
      {
        name: "Agreement",
        text: "For a sale, a brokerage agreement; for leasing or management, a management entrustment agreement — concluded after we explain the terms.",
      },
      {
        name: "Execution & Handover",
        text: "We handle sales activities or tenant recruitment, through to handover and settlement.",
      },
    ],
    expertsH2: "Does Yotsuba Real Estate handle inheritance registration and inheritance tax?",
    expertsBody: (
      <>
        Yotsuba Real Estate Co., Ltd. handles real estate consultation, sales, leasing, and management. <strong>Inheritance registration is the domain of judicial scriveners, and inheritance tax that of licensed tax accountants</strong>, so these matters proceed in coordination with our partner professionals. Document preparation and permits related to inheritance can be handled by our affiliated business, Yotsuba Gyoseishoshi Office (a separate business entity).
      </>
    ),
    guideLinkLabel: "Inheriting Property in Bunkyo: The Complete Guide",
    inheritanceLinkLabel: "Inheritance & Will Procedures (Yotsuba Gyoseishoshi Office)",
    independenceNote:
      "Note: Yotsuba Real Estate Co., Ltd. and Yotsuba Gyoseishoshi Office accept engagements independently as separate business entities (no referral fees are exchanged).",
    relatedAria: "Related links",
    relatedHeading: "Related links on this page",
    relatedLinks: [
      { href: "/souzoku", label: "Inheriting Property in Bunkyo" },
      { href: "/access", label: "Access & Fees" },
    ],
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time Licensed Real Estate Transaction Specialist (宅地建物取引士); Gyoseishoshi (Administrative Scrivener). Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
  },
  "zh-tw": {
    metaTitle: "繼承的不動產：從諮詢到出售・活用的流程｜四葉不動産",
    metaDesc:
      "繼承的不動產該如何進行——四葉不動産株式会社為您說明從諮詢、現況整理、估價，到決定管理・活用・出售方針、簽約・交屋的流程。深耕文京區・茗荷谷在地，由曾任新聞記者的宅地建物取引士透過LINE・電話・線上，從第一步開始協助您。",
    breadcrumbHome: "首頁",
    breadcrumbParent: "在文京區繼承不動產",
    breadcrumbCurrent: "諮詢〜解決的流程",
    howtoName: "繼承的不動產從諮詢到解決的流程",
    howtoDesc: "四葉不動産株式会社從繼承不動產的諮詢，到管理・活用・出售之執行為止的流程。",
    h1: "繼承的不動產：從諮詢到出售・活用的流程",
    lead: (
      <>
        繼承不動產的諮詢，<strong>可以從「先談談現況」開始。</strong>
        四葉不動産株式会社依照：諮詢→現況訪談→估價→整理方針（管理・活用・出售）→提案→簽約→交屋的流程協助您。繼承登記、遺產稅等不動產公司業務範圍外的手續，將與司法書士・稅理士等專家合作進行。
      </>
    ),
    startH2: "繼承不動產的諮詢，該從什麼開始？",
    startBody: (
      <>
        先透過LINE或電話說一句「繼承的房子該怎麼辦？」就可以了。四葉不動産株式会社會了解您的狀況，和您一起整理下一步。<strong>初次諮詢免費</strong>。以委託本公司出售・活用（仲介）為前提的諮詢，包含於仲介手續費範圍內。如需不含仲介的不動產顧問諮詢（其他公司物件的第二意見、整體資產的活用・持有方針建議等＝仲介以外的相關業務），自第2次起，經另行合意後原則上以每30分鐘5,500日圓（含稅）承接（可線上進行）。
      </>
    ),
    stepsH2: "從諮詢到解決的流程是怎樣的？（6步驟）",
    steps: [
      {
        name: "諮詢（免費）",
        text: "LINE・電話・線上。在「不知道從何著手」的階段也沒關係。",
      },
      {
        name: "現況訪談",
        text: "了解物件的位置・類型、繼承的狀況、是否已辦理繼承登記等。",
      },
      {
        name: "估價・現況整理",
        text: "確認物件，整理管理・活用・出售各自的展望。",
      },
      {
        name: "方針提案",
        text: "從「管理」「活用（出租等）」「出售」三種出路中，提案符合您期望的方向。",
      },
      {
        name: "簽約",
        text: "出售則為媒介契約（仲介契約）、出租・管理則為管理委託契約，於說明內容後締結。",
      },
      {
        name: "執行・交屋",
        text: "對應銷售活動或招募房客，直到交屋・結算。",
      },
    ],
    expertsH2: "繼承登記或遺產稅，由四葉不動產辦理嗎？",
    expertsBody: (
      <>
        四葉不動産株式会社經營不動產的諮詢・買賣・租賃・管理。<strong>繼承登記屬司法書士、遺產稅屬稅理士</strong>的領域，這些將與合作的專家協同進行。繼承相關的文件製作・許認可，可由關聯事業四葉行政書士事務所（不同事業體）對應。
      </>
    ),
    guideLinkLabel: "在文京區繼承了不動產之後——完全指南",
    inheritanceLinkLabel: "繼承・遺囑的手續（四葉行政書士事務所）",
    independenceNote:
      "※四葉不動産株式会社與四葉行政書士事務所為不同事業體，各自獨立受理委任（不收受介紹費等）。",
    relatedAria: "相關連結",
    relatedHeading: "本頁相關連結",
    relatedLinks: [
      { href: "/souzoku", label: "在文京區繼承不動產" },
      { href: "/access", label: "交通與費用" },
    ],
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士。行政書士。曾任每日新聞中國總局長（記者資歷34年）・曾派駐中國、台灣、泰國。已通過社會保險勞務士考試（預定2026年9月開業）。",
  },
  zh: {
    metaTitle: "继承的不动产：从咨询到出售・活用的流程｜四葉不動産",
    metaDesc:
      "继承的不动产该如何推进——四葉不動産株式会社为您介绍从咨询、现状梳理、估价，到确定管理・活用・出售方针、签约・交房的流程。扎根文京区・茗荷谷本地，由曾任新闻记者的宅地建物取引士通过LINE・电话・在线，从第一步开始协助您。",
    breadcrumbHome: "首页",
    breadcrumbParent: "在文京区继承不动产",
    breadcrumbCurrent: "咨询〜解决的流程",
    howtoName: "继承的不动产从咨询到解决的流程",
    howtoDesc: "四葉不動産株式会社从继承不动产的咨询，到管理・活用・出售之执行为止的流程。",
    h1: "继承的不动产：从咨询到出售・活用的流程",
    lead: (
      <>
        继承不动产的咨询，<strong>可以从“先谈谈现状”开始。</strong>
        四葉不動産株式会社按照：咨询→现状访谈→估价→梳理方针（管理・活用・出售）→提案→签约→交房的流程协助您。继承登记、遗产税等不动产公司业务范围外的手续，将与司法书士・税理士等专家合作推进。
      </>
    ),
    startH2: "继承不动产的咨询，该从什么开始？",
    startBody: (
      <>
        先通过LINE或电话说一句“继承的房子该怎么办？”就可以了。四葉不動産株式会社会了解您的状况，和您一起梳理下一步。<strong>初次咨询免费</strong>。以委托本公司出售・活用（中介）为前提的咨询，包含在中介手续费范围内。如需不含中介的不动产顾问咨询（其他公司物件的第二意见、整体资产的活用・持有方针建议等＝中介以外的相关业务），自第2次起，经另行约定后原则上以每30分钟5,500日元（含税）承接（可在线进行）。
      </>
    ),
    stepsH2: "从咨询到解决的流程是怎样的？（6个步骤）",
    steps: [
      {
        name: "咨询（免费）",
        text: "LINE・电话・在线。在“不知道从何着手”的阶段也没关系。",
      },
      {
        name: "现状访谈",
        text: "了解物件的位置・类型、继承的状况、是否已办理继承登记等。",
      },
      {
        name: "估价・现状梳理",
        text: "确认物件，梳理管理・活用・出售各自的前景。",
      },
      {
        name: "方针提案",
        text: "从“管理”“活用（租赁等）”“出售”三种出路中，提案符合您期望的方向。",
      },
      {
        name: "签约",
        text: "出售则为媒介合同（中介合同）、租赁・管理则为管理委托合同，在说明内容后签订。",
      },
      {
        name: "执行・交房",
        text: "对应销售活动或招募租客，直至交房・结算。",
      },
    ],
    expertsH2: "继承登记或遗产税，由四葉不動産办理吗？",
    expertsBody: (
      <>
        四葉不動産株式会社经营不动产的咨询・买卖・租赁・管理。<strong>继承登记属司法书士、遗产税属税理士</strong>的领域，这些将与合作的专家协同推进。继承相关的文件制作・许认可，可由关联事业四葉行政书士事务所（不同事业体）对应。
      </>
    ),
    guideLinkLabel: "在文京区继承了不动产之后——完全指南",
    inheritanceLinkLabel: "继承・遗嘱的手续（四葉行政书士事务所）",
    independenceNote:
      "※四葉不動産株式会社与四葉行政书士事务所为不同事业体，各自独立受理委托（不收受介绍费等）。",
    relatedAria: "相关链接",
    relatedHeading: "本页相关链接",
    relatedLinks: [
      { href: "/souzoku", label: "在文京区继承不动产" },
      { href: "/access", label: "交通与费用" },
    ],
    authorAlt: "四葉不動産株式会社 代表取缔役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取缔役・专任宅地建物取引士。行政书士。曾任每日新闻中国总局长（记者经历34年）・曾派驻中国、台湾、泰国。已通过社会保险劳务士考试（预定2026年9月开业）。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/souzoku/nagare",
    keywords: ["相続 不動産 相談 流れ", "相続した家 売却 手順", "文京区 相続 不動産 相談"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return (
    <>
      <HowToJsonLd
        name={c.howtoName}
        description={c.howtoDesc}
        steps={c.steps}
      />
      <Breadcrumb
        items={[
          { name: c.breadcrumbHome, href: "/" },
          { name: c.breadcrumbParent, href: "/souzoku" },
          { name: c.breadcrumbCurrent },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            {c.h1}
          </h1>
          <p className="mt-4 leading-relaxed text-text">
            {c.lead}
          </p>
        </header>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">
            {c.startH2}
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            {c.startBody}
            <Placeholder reason="石井弁護士＝宅建業法上の相談料の切り分け（A案の最終確認）" />
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">
            {c.stepsH2}
          </h2>
          <ol className="mt-4 space-y-4">
            {c.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <div className="font-medium text-ink">{s.name}</div>
                  <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{s.text}</p>
                  {i === 1 && <Placeholder reason="浦松＝ヒアリングで確認する項目" />}
                  {i === 2 && <Placeholder reason="浦松＝査定の範囲・費用の有無" />}
                  {i === 5 && <Placeholder reason="浦松＝標準的な所要期間" />}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">
            {c.expertsH2}
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            {c.expertsBody}
          </p>
          <p className="mt-2 text-sm">
            →{" "}
            <Link href={addLocalePrefix("/souzoku", locale)} className="text-primary underline">
              {c.guideLinkLabel}
            </Link>
            ／
            <Link href={addLocalePrefix("/legal/services/inheritance", locale)} className="text-primary underline">
              {c.inheritanceLinkLabel}
            </Link>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {c.independenceNote}
          </p>
        </section>

        <nav aria-label={c.relatedAria} className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="font-medium text-ink">{c.relatedHeading}</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            {c.relatedLinks.map((l) => (
              <li key={l.href}>
                <Link href={addLocalePrefix(l.href, locale)} className="underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 署名（E-E-A-T・原稿_不動産サイト共通） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt={c.authorAlt}
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>{c.authorLabel}</strong> {c.authorBio}
          </p>
        </aside>
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}
