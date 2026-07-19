// /access（型C系・アクセス・料金）＝原稿_不動産 #7
// JSON-LD＝Organization(@id=/#organization)はlayoutが出力済み＝重複出力しない。geoは出力しない（URL構造設計v1 §8-5）。
// PriceSpecification＝確定値のみの規則：本表は法定上限・範囲（3〜5%）・石井確認中（相談料）のため出力なし。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=HomePageContent.tsx／services/page.tsx）。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳（文京區・茗荷谷站・繼承・不動產）／zh=大陸表記。
// 相談料＝2026-07-19浦松指示（タスクB-1）：jaは「初回無料／2回目以降の扱いはご相談内容により異なります」に統一し
// 30分5,500円（税込）の具体額を撤去（新設 /ryokin と同一基準）。あわせて ja のタイトル・H1・パンくずを
// 「アクセス・料金」→「アクセス」に変更。en/zh-tw/zh は旧文言（5,500円あり）のまま＝多言語展開の後続ステップで追随させること。
// （旧: 2026-07-11確定文言＝媒介外関連業務のみ事前同意のうえ30分5,500円。国交省 解釈・運用の考え方が根拠）
// ※宅建業法上の相談料の切り分けは石井弁護士の最終確認を通すこと（下部Placeholder参照）。
// 住所は全ロケール日本語表記維持（enのみ英字補記）。金額・率・TELは全ロケール不変。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { Placeholder } from "@/components/shared/Placeholder";
import { MAP_URL } from "@/lib/shared/office-public";
import type { LangCode } from "@/config/languages";

type AccessRow = { k: string; v: string };
type FeeRow = { item: string; fee: string; note: string };
type AccessCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  h1: string;
  intro: React.ReactNode;
  accessRows: AccessRow[];
  mapLink: string;
  feeH2: string;
  feeIntro: React.ReactNode;
  feeHead: { item: string; fee: string; note: string };
  feeRows: FeeRow[];
  feeNote: string;
  consultH2: string;
  consultBody: string;
  relatedAria: string;
  relatedHeading: string;
  relatedLinks: { href: string; label: string }[];
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
};

const COPY: Record<LangCode, AccessCopy> = {
  ja: {
    metaTitle: "アクセス｜茗荷谷駅徒歩5分の四葉不動産株式会社",
    metaDesc:
      "四葉不動産株式会社（東京都文京区小日向・東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分）へのアクセスと料金のご案内です。売買仲介・賃貸仲介の手数料は宅地建物取引業法の法定上限、賃貸管理は月額賃料の3〜5%。初回のご相談は無料・オンライン対応。TEL 03-6161-9428。",
    breadcrumbHome: "ホーム",
    breadcrumbCurrent: "アクセス",
    h1: "アクセス",
    intro: (
      <>
        四葉不動産株式会社は、<strong>東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３</strong>にあります。東京メトロ丸ノ内線「茗荷谷」駅から徒歩5分。TEL 03-6161-9428。営業時間は10:00〜18:00（定休：火・水）。ご来店前にLINEか電話でご連絡いただくとスムーズです。
      </>
    ),
    accessRows: [
      { k: "住所", v: "東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３" },
      { k: "最寄駅", v: "東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分" },
      { k: "TEL", v: "03-6161-9428" },
      { k: "営業時間", v: "10:00〜18:00" },
      { k: "定休日", v: "火・水" },
    ],
    mapLink: "Googleマップで見る",
    feeH2: "料金はいくらですか？",
    feeIntro: (
      <>
        四葉不動産株式会社の主な料金は次のとおりです。売買・賃貸の仲介手数料は<strong>宅地建物取引業法の法定上限</strong>の範囲で、管理料は物件・管理内容に応じて個別にお見積りします。
      </>
    ),
    feeHead: { item: "項目", fee: "料金", note: "根拠・備考" },
    feeRows: [
      {
        item: "売買仲介 手数料",
        fee: "法定上限：（売買価格×3%＋6万円）＋消費税 ※売買価格200万円以下・200〜400万円は別料率／2024年改正で800万円以下は33万円＋税を上限に設定可",
        note: "宅建業法46条・国交省告示",
      },
      {
        item: "賃貸仲介 手数料",
        fee: "法定上限：賃料1ヶ月分＋消費税（居住用は原則貸主・借主で折半）",
        note: "宅建業法",
      },
      {
        item: "賃貸管理料",
        fee: "月額賃料の3〜5%（物件・管理内容に応じて個別見積り）",
        note: "当社基準",
      },
      {
        item: "相談料",
        fee: "初回のご相談は無料です。2回目以降の扱いは、ご相談内容により異なります。",
        note: "具体的な扱いはご相談時にご案内します",
      },
    ],
    feeNote: "※売買価格に応じた具体的な手数料額は、物件ごとに算出してご提示します。",
    consultH2: "相談は無料ですか？オンラインでもできますか？",
    consultBody:
      "初回のご相談・診断は無料です。2回目以降の扱いは、ご相談内容により異なります。オンラインにも対応します。まずはLINEか電話で一言からどうぞ。",
    relatedAria: "関連リンク",
    relatedHeading: "このページの関連リンク",
    relatedLinks: [
      { href: "/toushi", label: "投資用・事業用不動産" },
      { href: "/souzoku", label: "文京区で不動産を相続したら" },
      { href: "/global", label: "外国人・多言語のお部屋探し" },
    ],
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
  },
  en: {
    metaTitle: "Access & Fees | 四葉不動産株式会社 (Yotsuba Real Estate), 5 min from Myogadani Sta.",
    metaDesc:
      "Access and fees of Yotsuba Real Estate Co., Ltd. (Kohinata, Bunkyo-ku, Tokyo; 5 min walk from Myogadani Sta. on the Tokyo Metro Marunouchi Line). Brokerage commissions for sales and leasing are within the statutory maximum (cap) under the Real Estate Brokerage Act; rental management is 3–5% of monthly rent. Your first consultation is free; online sessions available. TEL 03-6161-9428.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Access & Fees",
    h1: "Access & Fees",
    intro: (
      <>
        Yotsuba Real Estate Co., Ltd. is located at{" "}
        <strong>東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３</strong> (Kohinata Yasuda Bldg. #203, 4-2-5 Kohinata, Bunkyo-ku, Tokyo), a 5-minute walk from Myogadani Station on the Tokyo Metro Marunouchi Line. TEL 03-6161-9428. Hours: 10:00–18:00 (closed Tuesdays and Wednesdays). Contacting us via LINE or phone before visiting makes things smoother.
      </>
    ),
    accessRows: [
      {
        k: "Address",
        v: "東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３（Kohinata Yasuda Bldg. #203, 4-2-5 Kohinata, Bunkyo-ku, Tokyo）",
      },
      { k: "Nearest station", v: "5 min walk from Myogadani Sta. (Tokyo Metro Marunouchi Line)" },
      { k: "TEL", v: "03-6161-9428" },
      { k: "Hours", v: "10:00–18:00" },
      { k: "Closed", v: "Tuesdays & Wednesdays" },
    ],
    mapLink: "View on Google Maps",
    feeH2: "How much are the fees?",
    feeIntro: (
      <>
        The main fees of Yotsuba Real Estate Co., Ltd. are as follows. Brokerage commissions for sales and leasing stay within the{" "}
        <strong>statutory maximum (cap) under the Real Estate Brokerage Act (宅地建物取引業法)</strong>, and management fees are quoted individually based on the property and the scope of management.
      </>
    ),
    feeHead: { item: "Item", fee: "Fee", note: "Basis / Notes" },
    feeRows: [
      {
        item: "Sales brokerage commission",
        fee: "Statutory maximum (cap): (sale price × 3% + ¥60,000) + consumption tax. Different rates apply to sale prices of ¥2 million or less and ¥2–4 million; under the 2024 revision, a cap of ¥330,000 + tax may be set for properties of ¥8 million or less.",
        note: "Art. 46 of the Real Estate Brokerage Act (宅地建物取引業法) / MLIT public notice",
      },
      {
        item: "Leasing brokerage commission",
        fee: "Statutory maximum (cap): one month's rent + consumption tax (for residential leases, in principle split between landlord and tenant)",
        note: "Real Estate Brokerage Act (宅地建物取引業法)",
      },
      {
        item: "Rental management fee",
        fee: "3–5% of monthly rent (individually quoted based on the property and the scope of management)",
        note: "Our company's standard",
      },
      {
        item: "Consultation fee",
        fee: "Your first consultation is free. From the second session onward, consultations that do not involve brokerage (i.e., related work other than brokerage) are, in principle, ¥5,500 (tax incl.) per 30 minutes, only with your prior consent; online sessions available. Consultations relating to a sale or lease we broker are covered by the brokerage commission.",
        note: "Related services other than brokerage are charged only when clearly separated, set in advance, and separately agreed (MLIT interpretive guidelines)",
      },
    ],
    feeNote: "Note: The specific commission amount based on the sale price is calculated and presented for each property.",
    consultH2: "Is the consultation free? Can it be done online?",
    consultBody:
      "Your first consultation and diagnosis are free. From the second session onward, consultations that do not involve brokerage (a second opinion on a property handled by another company, advice on utilizing or holding your overall assets, and the like — i.e., related work other than brokerage) are, in principle, ¥5,500 (tax incl.) per 30 minutes, only with your prior consent, and online sessions are also available. Consultations relating to a sale or lease we broker are covered by the brokerage commission. Feel free to start with a single line via LINE or phone.",
    relatedAria: "Related links",
    relatedHeading: "Related links on this page",
    relatedLinks: [
      { href: "/toushi", label: "Investment & Business-Use Real Estate" },
      { href: "/souzoku", label: "Inheriting Property in Bunkyo" },
      { href: "/global", label: "Multilingual Room-Hunting Support" },
    ],
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time Licensed Real Estate Transaction Specialist (宅地建物取引士); Gyoseishoshi (Administrative Scrivener). Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
  },
  "zh-tw": {
    metaTitle: "交通與費用｜茗荷谷站步行5分的四葉不動産株式会社",
    metaDesc:
      "四葉不動産株式会社（東京都文京區小日向・東京Metro丸之內線「茗荷谷」站 步行5分）的交通與費用介紹。買賣仲介・租賃仲介的手續費為宅地建物取引業法的法定上限，租賃管理為月租金的3〜5%。初次諮詢免費・可線上進行。TEL 03-6161-9428。",
    breadcrumbHome: "首頁",
    breadcrumbCurrent: "交通與費用",
    h1: "交通與費用",
    intro: (
      <>
        四葉不動産株式会社位於<strong>東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３</strong>。距東京Metro丸之內線「茗荷谷」站步行5分。TEL 03-6161-9428。營業時間10:00〜18:00（週二・週三公休）。來店前先以LINE或電話聯繫，安排會更順暢。
      </>
    ),
    accessRows: [
      { k: "地址", v: "東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３" },
      { k: "最近車站", v: "東京Metro丸之內線「茗荷谷」站 步行5分" },
      { k: "電話", v: "03-6161-9428" },
      { k: "營業時間", v: "10:00〜18:00" },
      { k: "公休日", v: "週二・週三" },
    ],
    mapLink: "在Google地圖上查看",
    feeH2: "費用是多少？",
    feeIntro: (
      <>
        四葉不動産株式会社的主要費用如下。買賣・租賃的仲介手續費在<strong>宅地建物取引業法的法定上限</strong>範圍內，管理費依物件・管理內容個別估價。
      </>
    ),
    feeHead: { item: "項目", fee: "費用", note: "依據・備註" },
    feeRows: [
      {
        item: "買賣仲介手續費",
        fee: "法定上限：（買賣價格×3%＋6萬日圓）＋消費稅 ※買賣價格200萬日圓以下・200〜400萬日圓適用其他費率／依2024年修正，800萬日圓以下可設定33萬日圓＋稅為上限",
        note: "宅地建物取引業法第46條・國土交通省告示",
      },
      {
        item: "租賃仲介手續費",
        fee: "法定上限：1個月租金＋消費稅（居住用原則上由出租人・承租人折半負擔）",
        note: "宅地建物取引業法",
      },
      {
        item: "租賃管理費",
        fee: "月租金的3〜5%（依物件・管理內容個別估價）",
        note: "本公司基準",
      },
      {
        item: "諮詢費",
        fee: "初次諮詢免費／第2次起，不涉及仲介之諮詢（仲介以外的相關業務），經事先同意後原則上每30分鐘5,500日圓（含稅）・可線上進行。與本公司承辦之買賣・租賃仲介相關的諮詢，包含於仲介手續費範圍內。",
        note: "仲介以外的相關業務，以明確區分・事前設定・另行合意為前提收取（國土交通省 解釋・運用之考量）",
      },
    ],
    feeNote: "※依買賣價格計算的具體手續費金額，將按各物件個別試算後提示。",
    consultH2: "諮詢是免費的嗎？可以線上進行嗎？",
    consultBody:
      "初次諮詢・診斷免費。第2次起，不涉及仲介之諮詢（其他公司物件的第二意見、整體資產的活用・持有方針建議等＝仲介以外的相關業務），經事先同意後原則上以每30分鐘5,500日圓（含稅）承接，也可線上進行。與本公司承辦之買賣・租賃仲介相關的諮詢，包含於仲介手續費範圍內。歡迎先透過LINE或電話說一句話。",
    relatedAria: "相關連結",
    relatedHeading: "本頁相關連結",
    relatedLinks: [
      { href: "/toushi", label: "投資用・事業用不動產" },
      { href: "/souzoku", label: "在文京區繼承不動產" },
      { href: "/global", label: "外國人・多語言找房服務" },
    ],
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士。行政書士。曾任每日新聞中國總局長（記者資歷34年）・旅居海外4國。已通過社會保險勞務士考試（預定2026年9月開業）。",
  },
  zh: {
    metaTitle: "交通与费用｜茗荷谷站步行5分的四葉不動産株式会社",
    metaDesc:
      "四葉不動産株式会社（东京都文京区小日向・东京Metro丸之内线“茗荷谷”站 步行5分）的交通与费用介绍。买卖中介・租赁中介的手续费为日本《宅地建物取引业法》的法定上限，租赁管理为月租金的3〜5%。初次咨询免费・可在线进行。电话 03-6161-9428。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "交通与费用",
    h1: "交通与费用",
    intro: (
      <>
        四葉不動産株式会社位于<strong>東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３</strong>。距东京Metro丸之内线“茗荷谷”站步行5分。电话 03-6161-9428。营业时间10:00〜18:00（周二・周三休息）。来店前先通过LINE或电话联系，安排会更顺畅。
      </>
    ),
    accessRows: [
      { k: "地址", v: "東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３" },
      { k: "最近车站", v: "东京Metro丸之内线“茗荷谷”站 步行5分" },
      { k: "电话", v: "03-6161-9428" },
      { k: "营业时间", v: "10:00〜18:00" },
      { k: "休息日", v: "周二・周三" },
    ],
    mapLink: "在Google地图上查看",
    feeH2: "费用是多少？",
    feeIntro: (
      <>
        四葉不動産株式会社的主要费用如下。买卖・租赁的中介手续费在<strong>日本《宅地建物取引业法》的法定上限</strong>范围内，管理费根据物件・管理内容个别报价。
      </>
    ),
    feeHead: { item: "项目", fee: "费用", note: "依据・备注" },
    feeRows: [
      {
        item: "买卖中介手续费",
        fee: "法定上限：（买卖价格×3%＋6万日元）＋消费税 ※买卖价格200万日元以下・200〜400万日元适用其他费率／根据2024年修订，800万日元以下可设定33万日元＋税为上限",
        note: "《宅地建物取引业法》第46条・国土交通省告示",
      },
      {
        item: "租赁中介手续费",
        fee: "法定上限：1个月租金＋消费税（居住用原则上由出租方・承租方各承担一半）",
        note: "《宅地建物取引业法》",
      },
      {
        item: "租赁管理费",
        fee: "月租金的3〜5%（根据物件・管理内容个别报价）",
        note: "本公司标准",
      },
      {
        item: "咨询费",
        fee: "初次咨询免费／第2次起，不涉及中介之咨询（中介以外的相关业务），经事先同意后原则上每30分钟5,500日元（含税）・可在线进行。与本公司承办之买卖・租赁中介相关的咨询，包含在中介手续费范围内。",
        note: "中介以外的相关业务，以明确区分・事前设定・另行约定为前提收取（国土交通省 解释与运用指引）",
      },
    ],
    feeNote: "※根据买卖价格计算的具体手续费金额，将按每个物件单独测算后提示。",
    consultH2: "咨询是免费的吗？可以在线进行吗？",
    consultBody:
      "初次咨询・诊断免费。第2次起，不涉及中介之咨询（其他公司物件的第二意见、整体资产的活用・持有方针建议等＝中介以外的相关业务），经事先同意后原则上以每30分钟5,500日元（含税）承接，也可在线进行。与本公司承办之买卖・租赁中介相关的咨询，包含在中介手续费范围内。欢迎先通过LINE或电话说一句话。",
    relatedAria: "相关链接",
    relatedHeading: "本页相关链接",
    relatedLinks: [
      { href: "/toushi", label: "投资用・事业用不动产" },
      { href: "/souzoku", label: "在文京区继承不动产" },
      { href: "/global", label: "外国人・多语言找房服务" },
    ],
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
    path: "/access",
    keywords: ["四葉不動産 アクセス", "文京区 不動産 仲介手数料", "茗荷谷 不動産会社 料金"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;

  return (
    <>
      <Breadcrumb items={[{ name: c.breadcrumbHome, href: "/" }, { name: c.breadcrumbCurrent }]} />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          <p className="mt-4 leading-relaxed text-text">{c.intro}</p>
        </header>

        <section className="mt-6">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {c.accessRows.map((r) => (
                <tr key={r.k}>
                  <th className="w-28 border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    {r.k}
                  </th>
                  <td className="border border-border px-3 py-2 text-text">{r.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs">
            <a href={MAP_URL.realestate} target="_blank" rel="noreferrer" className="text-primary underline">
              {c.mapLink}
            </a>
            <Placeholder reason="浦松＝地図/緯度経度(geo出力可否)・来店予約/駐車場" />
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">{c.feeH2}</h2>
          <p className="mt-3 leading-relaxed text-text">{c.feeIntro}</p>
          {/* PC＝表 */}
          <table className="mt-4 hidden w-full border-collapse text-sm sm:table">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">{c.feeHead.item}</th>
                <th className="border border-border px-3 py-2">{c.feeHead.fee}</th>
                <th className="border border-border px-3 py-2">{c.feeHead.note}</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {c.feeRows.map((r) => (
                <tr key={r.item}>
                  <td className="border border-border px-3 py-2 whitespace-nowrap text-text">{r.item}</td>
                  <td className="border border-border px-3 py-2">{r.fee}</td>
                  <td className="border border-border px-3 py-2">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* SP＝カード */}
          <ul className="mt-4 space-y-2 sm:hidden">
            {c.feeRows.map((r) => (
              <li key={r.item} className="rounded-lg border border-border bg-surface p-3 text-sm">
                <div className="font-medium text-ink">{r.item}</div>
                <p className="mt-1 text-text-muted">{r.fee}</p>
                <p className="mt-1 text-xs text-text-muted">{r.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-text-muted">{c.feeNote}</p>
          <Placeholder reason="石井弁護士＝宅建業法上の相談料の切り分け（A案の最終確認）／Notion＝料金の掲載範囲" />
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">{c.consultH2}</h2>
          <p className="mt-3 leading-relaxed text-text">{c.consultBody}</p>
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
