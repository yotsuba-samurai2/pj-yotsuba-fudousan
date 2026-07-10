// ★参考ページ（型A）＝ /legal/services/subsidy　※原稿_行政書士 #5・共通シェル使用
// 配置＝src/app/(legal)/legal/services/subsidy/page.tsx。
// フェーズI多言語化（2026-07-10）＝COPY: Record<LangCode,…>＋getRequestLocale方式（手本=/legal/page.tsx）。
// en/zh-tw/zh=監修前ドラフト（フェーズI・2026-07-10）。
// 【業際】全ロケールで「補助金」のみを扱う表現に統一（2026-07-10改稿・対比表現を撤去）。他士業領域の金銭支援用語は字も直訳も出さない（訳語は en=subsidy／zh-tw=補助金／zh=补助金 に固定）。
// クロスリンク C11(→/labor/services/joseikin) は SR_LAUNCHED=false の間 getCrossLinks が返さない＝非表示。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { LegalServicePage, H2 } from "@/components/shared/LegalServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import type { LangCode } from "@/config/languages";

type SubsidyCopy = {
  metaTitle: string;
  metaDesc: string;
  crumbLabel: string;
  heroAlt: string;
  h1: string;
  lead: React.ReactNode;
  internalLinks: { href: string; label: string }[];
  aboutH2: string;
  tableColHeader: string;
  tableRows: { label: string; value: React.ReactNode }[];
  aboutNote: React.ReactNode;
  feesH2: string;
  feeLinkLabel: string;
  flowLinkLabel: string;
};

const COPY: Record<LangCode, SubsidyCopy> = {
  ja: {
    metaTitle: "補助金申請サポート｜四葉行政書士事務所",
    metaDesc:
      "補助金の事業計画作成・申請を、文京区の四葉行政書士事務所が支援します。元新聞記者の行政書士が、採択のカギとなる「伝わる事業計画書」を作成。当事務所の取扱は、事業計画の審査を伴う補助金の申請です。",
    crumbLabel: "補助金申請サポート",
    heroAlt: "補助金申請のイメージ（事業計画書と成長）",
    h1: "補助金申請サポート",
    lead: (
      <>
        補助金の申請サポート——事業計画の整理と申請書類の作成——は、<strong>行政書士に依頼できます</strong>。四葉行政書士事務所の強みは、<strong>採択のカギを握る「伝わる事業計画書」</strong>です。代表の浦松 丈二は元毎日新聞の記者として34年、事業や人の物語を第三者に伝える文章を書いてきました。審査員に伝わる計画書づくりに、この技術をそのまま使います。
      </>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任の流れ" },
      { href: "/legal/services/company", label: "会社設立・各種許認可" },
    ],
    aboutH2: "補助金とはどのような制度ですか？",
    tableColHeader: "補助金",
    tableRows: [
      { label: "所管", value: "主に経済産業省系" },
      { label: "性質", value: "事業計画の審査があり、採択・不採択が分かれる" },
      {
        label: "依頼先",
        value: (
          <>
            <strong>行政書士</strong>（四葉行政書士事務所が対応）
          </>
        ),
      },
    ],
    aboutNote: (
      <>
        四葉行政書士事務所は現在、<strong>補助金</strong>の申請サポートに対応しています。取扱範囲は、事業計画の審査を経て採択・不採択が決まるタイプの補助金です。
      </>
    ),
    feesH2: "費用・受任の流れ",
    feeLinkLabel: "補助金申請サポートの報酬額（報酬額表）",
    flowLinkLabel: "ご相談から完了までの受任の流れ",
  },
  en: {
    metaTitle: "Subsidy Application Support｜四葉行政書士事務所",
    metaDesc:
      "四葉行政書士事務所 in Bunkyo, Tokyo supports subsidy applications, from preparing the business plan to filing. A former newspaper reporter turned gyoseishoshi (administrative scrivener) drafts the persuasive business plan that holds the key to selection. Our practice covers subsidy applications screened on a business plan.",
    crumbLabel: "Subsidy Application Support",
    heroAlt: "Illustration of a subsidy application (business plan and growth)",
    h1: "Subsidy Application Support",
    lead: (
      <>
        Subsidy application support—organizing the business plan and preparing the application documents—<strong>is work you can entrust to a gyoseishoshi (administrative scrivener)</strong>. The strength of 四葉行政書士事務所 (Yotsuba Gyoseishoshi Jimusho) is <strong>a “business plan that gets its message across”—the key to selection</strong>. Our representative, 浦松 丈二 (Joji Uramatsu), spent 34 years as a Mainichi Shimbun reporter, writing to convey the stories of businesses and people to third parties. That same craft goes straight into building plans that speak to the reviewers.
      </>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "Fees" },
      { href: "/legal/nagare", label: "How Engagement Works" },
      { href: "/legal/services/company", label: "Company Formation & Licensing" },
    ],
    aboutH2: "What kind of program is a subsidy?",
    tableColHeader: "Subsidy",
    tableRows: [
      { label: "Administered by", value: "Mainly programs under the Ministry of Economy, Trade and Industry" },
      { label: "How it works", value: "The business plan is screened, and applications are either selected or not" },
      {
        label: "Who to engage",
        value: (
          <>
            <strong>A gyoseishoshi (administrative scrivener)</strong>—handled by 四葉行政書士事務所
          </>
        ),
      },
    ],
    aboutNote: (
      <>
        四葉行政書士事務所 currently provides <strong>subsidy</strong> application support. Our practice covers subsidies whose selection is decided through screening of a business plan.
      </>
    ),
    feesH2: "Fees & How Engagement Works",
    feeLinkLabel: "Fees for subsidy application support (fee schedule)",
    flowLinkLabel: "How engagement works, from consultation to completion",
  },
  "zh-tw": {
    metaTitle: "補助金申請支援｜四葉行政書士事務所",
    metaDesc:
      "位於文京區的四葉行政書士事務所，支援補助金的事業計畫書製作與申請。曾任新聞記者的行政書士，為您撰寫左右獲選與否的「能打動人的事業計畫書」。本事務所的服務範圍，為須經事業計畫審查的補助金申請。",
    crumbLabel: "補助金申請支援",
    heroAlt: "補助金申請意象（事業計畫書與成長）",
    h1: "補助金申請支援",
    lead: (
      <>
        補助金的申請支援——事業計畫的整理與申請文件的製作——<strong>可以委託行政書士辦理</strong>。四葉行政書士事務所的強項，是<strong>掌握獲選關鍵的「能打動人的事業計畫書」</strong>。代表浦松 丈二曾任每日新聞記者34年，持續撰寫將事業與人物的故事傳達給第三方的文章。這項功夫，如今原封不動地投入於製作能打動審查委員的計畫書。
      </>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/services/company", label: "公司設立・各類許可" },
    ],
    aboutH2: "補助金是什麼樣的制度？",
    tableColHeader: "補助金",
    tableRows: [
      { label: "主管機關", value: "主要為經濟產業省系統" },
      { label: "性質", value: "須經事業計畫審查，分為獲選與未獲選" },
      {
        label: "委託對象",
        value: (
          <>
            <strong>行政書士</strong>（由四葉行政書士事務所受理）
          </>
        ),
      },
    ],
    aboutNote: (
      <>
        四葉行政書士事務所目前受理<strong>補助金</strong>的申請支援。服務範圍為須經事業計畫審查、由審查結果決定獲選與否的補助金。
      </>
    ),
    feesH2: "費用・受任流程",
    feeLinkLabel: "補助金申請支援的報酬額（報酬額表）",
    flowLinkLabel: "從諮詢到完成的受任流程",
  },
  zh: {
    metaTitle: "补助金申请支援｜四葉行政書士事務所",
    metaDesc:
      "位于文京区的四葉行政書士事務所，支援补助金的事业计划书制作与申请。曾任新闻记者的行政书士，为您撰写左右能否获选的“能打动人的事业计划书”。本事务所的服务范围，为须经事业计划审查的补助金申请。",
    crumbLabel: "补助金申请支援",
    heroAlt: "补助金申请意象（事业计划书与成长）",
    h1: "补助金申请支援",
    lead: (
      <>
        补助金的申请支援——事业计划的整理与申请文件的制作——<strong>可以委托行政书士办理</strong>。四葉行政書士事務所的强项，是<strong>掌握获选关键的“能打动人的事业计划书”</strong>。代表浦松 丈二曾任每日新闻记者34年，持续撰写把事业与人物的故事传达给第三方的文章。这项功夫，如今原封不动地投入于制作能打动评审委员的计划书。
      </>
    ),
    internalLinks: [
      { href: "/legal/ryokin", label: "报酬额表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/services/company", label: "公司设立・各类许可" },
    ],
    aboutH2: "补助金是什么样的制度？",
    tableColHeader: "补助金",
    tableRows: [
      { label: "主管机关", value: "主要为经济产业省系统" },
      { label: "性质", value: "须经事业计划审查，分为获选与未获选" },
      {
        label: "委托对象",
        value: (
          <>
            <strong>行政书士</strong>（由四葉行政書士事務所受理）
          </>
        ),
      },
    ],
    aboutNote: (
      <>
        四葉行政書士事務所目前受理<strong>补助金</strong>的申请支援。服务范围为须经事业计划审查、由审查结果决定能否获选的补助金。
      </>
    ),
    feesH2: "费用・受任流程",
    feeLinkLabel: "补助金申请支援的报酬额（报酬额表）",
    flowLinkLabel: "从咨询到完成的受任流程",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/legal/services/subsidy",
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return (
    <LegalServicePage
      slug="subsidy"
      crumbLabel={c.crumbLabel}
      serviceName="補助金の事業計画作成・申請支援"
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={
        <p>
          {c.lead}
          <Placeholder reason="石井弁護士＝補助金の取扱範囲・業際表現" />
        </p>
      }
      internalLinks={c.internalLinks}
    >
      <div>
        <H2>{c.aboutH2}</H2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2"></th>
                <th className="border border-border px-3 py-2">{c.tableColHeader}</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {c.tableRows.map((r) => (
                <tr key={r.label}>
                  <th className="border border-border px-3 py-2 text-left">{r.label}</th>
                  <td className="border border-border px-3 py-2">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 leading-relaxed text-text">{c.aboutNote}</p>
      </div>

      <div>
        <H2>{c.feesH2}</H2>
        <p className="mt-2 text-sm">
          → <Link href="/legal/ryokin" className="text-primary underline">{c.feeLinkLabel}</Link>
          <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
        </p>
        <p className="mt-1 text-sm">
          → <Link href="/legal/nagare" className="text-primary underline">{c.flowLinkLabel}</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </div>
    </LegalServicePage>
  );
}
