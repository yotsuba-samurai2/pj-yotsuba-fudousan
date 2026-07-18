// /toushi（型A・柱Bピラー）＝原稿_不動産 #2
// クロスリンク＝C3（→/legal/services/shogai-fukushi）がpathで自動表示（独立受任注記付き）。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/access page.tsx）。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳（不動產・繼承・團體家屋・文京區）／zh=大陸表記。
// serviceName（JSON-LD Service name）・href・画像パス・Placeholder reason＝ja固定。金額・率＝全ロケール不変。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import { getColumns, getLocalizedColumn, filterColumnsByTheme } from "@/lib/columns";
import type { LangCode } from "@/config/languages";

type ToushiCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  heroAlt: string;
  h1: string;
  lead: React.ReactNode;
  internalLinks: { href: string; label: string }[];
  crossLinkLead: string;
  relatedAria: string;
  relatedHeading: string;
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
  sections: (locale: LangCode) => React.ReactNode;
};

const COPY: Record<LangCode, ToushiCopy> = {
  ja: {
    metaTitle: "投資用・事業用不動産｜文京区の四葉不動産",
    metaDesc:
      "四葉不動産株式会社が、投資用・事業用の不動産を扱います。グループホーム・障害福祉事業所に使える物件、社宅・法人賃貸、収益物件を、事業の目的から逆算してご提案。物件確保からその後の手続きまで見据えて相談できるのが特長です。",
    breadcrumbHome: "ホーム",
    breadcrumbCurrent: "投資用・事業用不動産",
    heroAlt: "投資用・事業用不動産のイメージ（一棟収益物件）",
    h1: "投資用・事業用不動産",
    lead: (
      <p>
        四葉不動産株式会社は、<strong>投資用・事業用の不動産</strong>を扱います。中心は3つ——<strong>グループホーム（障害福祉事業所）に使える物件</strong>、<strong>社宅・法人賃貸</strong>、<strong>収益物件</strong>です。共通するのは「物件そのもの」ではなく<strong>事業の目的から逆算して選ぶ</strong>こと。用途に合わない物件は、安くても高い買い物になります。四葉不動産は、目的・要件・収支の順に整理してご提案します。
      </p>
    ),
    internalLinks: [
      { href: "/toushi/group-home", label: "グループホーム物件" },
      { href: "/toushi/shataku", label: "社宅・法人賃貸" },
      { href: "/access", label: "アクセス・料金" },
    ],
    crossLinkLead:
      "グループホームの開設には、物件のほかに事業者指定の申請が必要です。指定申請は関連事業の四葉行政書士事務所が扱います。",
    relatedAria: "関連リンク",
    relatedHeading: "このページの関連リンク",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
    sections: (locale) => (
      <>
        <div>
          <ReH2>どんな投資・事業用不動産を扱っていますか？</ReH2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            <li>
              <strong>グループホーム・障害福祉事業所向け物件</strong>——指定基準を見据えた物件選び →{" "}
              <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">グループホームに使える物件探し</Link>
            </li>
            <li>
              <strong>社宅・法人賃貸</strong>——外国人従業員の住居手配も多言語で →{" "}
              <Link href={addLocalePrefix("/toushi/shataku", locale)} className="text-primary underline">社宅・法人賃貸のサポート</Link>
            </li>
            <li>
              <strong>収益物件（区分・一棟）</strong>
              <Placeholder reason="浦松＝収益物件の対応範囲" />
            </li>
            <li>
              対応エリア
              <Placeholder reason="浦松＝対応エリアの確定" />
            </li>
          </ul>
        </div>

        <div>
          <ReH2>なぜ四葉不動産に相談するのですか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            理由は「隣」にあります。グループホームの開設には物件のほかに<strong>事業者指定の申請</strong>が、外国人従業員の受け入れには<strong>在留資格</strong>が必要です。四葉不動産の関連事業には、これらを扱う四葉行政書士事務所があるため、<strong>物件確保からその後の手続きまでを見据えた相談</strong>が一つの窓口でできます。
          </p>
        </div>

        <div>
          <ReH2>費用について</ReH2>
          <p className="mt-3 text-sm leading-relaxed text-text">
            売買・賃貸の仲介手数料は、宅地建物取引業法の定めの範囲によります（一般情報）。詳細は{" "}
            <Link href={addLocalePrefix("/access", locale)} className="text-primary underline">アクセス・料金</Link> へ。
            <Placeholder reason="Notion＝料金の掲載範囲" />
          </p>
        </div>
      </>
    ),
  },
  en: {
    metaTitle: "Investment & Business-Use Real Estate | 四葉不動産 (Yotsuba Real Estate), Bunkyo, Tokyo",
    metaDesc:
      "Yotsuba Real Estate Co., Ltd. handles real estate for investment and business use. Properties usable for group homes and disability-welfare facilities, company housing & corporate leasing, and income properties—proposed by working backward from the purpose of your business. What sets us apart: you can consult with the whole path in view, from securing the property to the procedures that follow.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Investment & Business-Use Real Estate",
    heroAlt: "Investment and business-use real estate (a whole-building income property)",
    h1: "Investment & Business-Use Real Estate",
    lead: (
      <p>
        Yotsuba Real Estate Co., Ltd. handles <strong>real estate for investment and business use</strong>. Our focus is threefold: <strong>properties usable for group homes (disability-welfare facilities)</strong>, <strong>company housing & corporate leasing</strong>, and <strong>income properties</strong>. What they have in common is that we <strong>select by working backward from the purpose of the business</strong>—not from the property itself. A property that does not fit its intended use is an expensive purchase, however cheap it may be. Yotsuba Real Estate sorts things out in the order of purpose, requirements, and income and expenses before making a proposal.
      </p>
    ),
    internalLinks: [
      { href: "/toushi/group-home", label: "Group-Home Properties" },
      { href: "/toushi/shataku", label: "Company Housing & Corporate Leasing" },
      { href: "/access", label: "Access & Fees" },
    ],
    crossLinkLead:
      "Opening a group home requires an application for service-provider designation in addition to the property. Designation applications are handled by our affiliated business, 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office).",
    relatedAria: "Related links",
    relatedHeading: "Related links on this page",
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time licensed real estate broker; gyoseishoshi lawyer. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), with experience living in four countries. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
    sections: (locale) => (
      <>
        <div>
          <ReH2>What kinds of investment and business-use real estate do you handle?</ReH2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            <li>
              <strong>Properties for group homes and disability-welfare facilities</strong>—property selection with the designation standards in view →{" "}
              <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">Finding a property for a group home</Link>
            </li>
            <li>
              <strong>Company housing & corporate leasing</strong>—housing arrangements for international employees, supported in multiple languages →{" "}
              <Link href={addLocalePrefix("/toushi/shataku", locale)} className="text-primary underline">Company Housing & Corporate Lease Support</Link>
            </li>
            <li>
              <strong>Income properties (condominium units & whole buildings)</strong>
              <Placeholder reason="浦松＝収益物件の対応範囲" />
            </li>
            <li>
              Service area
              <Placeholder reason="浦松＝対応エリアの確定" />
            </li>
          </ul>
        </div>

        <div>
          <ReH2>Why consult Yotsuba Real Estate?</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            The reason is right next door. Opening a group home requires, in addition to the property, an <strong>application for service-provider designation</strong>; accepting international employees requires <strong>residence status</strong>. Yotsuba Real Estate&apos;s affiliated businesses include 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office), which handles both—so you can <strong>consult through a single point of contact, with the whole path in view from securing the property to the procedures that follow</strong>.
          </p>
        </div>

        <div>
          <ReH2>About fees</ReH2>
          <p className="mt-3 text-sm leading-relaxed text-text">
            Brokerage commissions for sales and leasing are within the range prescribed by the Real Estate Brokerage Act (宅地建物取引業法) (general information). For details, see{" "}
            <Link href={addLocalePrefix("/access", locale)} className="text-primary underline">Access &amp; Fees</Link>.
            <Placeholder reason="Notion＝料金の掲載範囲" />
          </p>
        </div>
      </>
    ),
  },
  "zh-tw": {
    metaTitle: "投資用・事業用不動產｜文京區的四葉不動産",
    metaDesc:
      "四葉不動産株式会社經手投資用・事業用不動產。可用於團體家屋・障礙福祉事業所的物件、員工宿舍・法人租賃、收益物件，從事業目的反向推算為您提案。特長是從取得物件到之後的手續，都能預先規劃、一併諮詢。",
    breadcrumbHome: "首頁",
    breadcrumbCurrent: "投資用・事業用不動產",
    heroAlt: "投資用・事業用不動產示意圖（整棟收益物件）",
    h1: "投資用・事業用不動產",
    lead: (
      <p>
        四葉不動産株式会社經手<strong>投資用・事業用不動產</strong>。核心為三類——<strong>可用於團體家屋（障礙福祉事業所）的物件</strong>、<strong>員工宿舍・法人租賃</strong>、<strong>收益物件</strong>。三者的共通點，不在「物件本身」，而是<strong>從事業目的反向推算來選擇</strong>。不合用途的物件，再便宜也是昂貴的買賣。四葉不動産依目的・要件・收支的順序整理後為您提案。
      </p>
    ),
    internalLinks: [
      { href: "/toushi/group-home", label: "團體家屋物件" },
      { href: "/toushi/shataku", label: "員工宿舍・法人租賃" },
      { href: "/access", label: "交通與費用" },
    ],
    crossLinkLead:
      "開設團體家屋，除了物件之外，還需要事業者指定的申請。指定申請由關聯事業的四葉行政書士事務所承辦。",
    relatedAria: "相關連結",
    relatedHeading: "本頁相關連結",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士。行政書士。曾任每日新聞中國總局長（記者資歷34年）・旅居海外4國。已通過社會保險勞務士考試（預定2026年9月開業）。",
    sections: (locale) => (
      <>
        <div>
          <ReH2>經手哪些投資・事業用不動產？</ReH2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            <li>
              <strong>團體家屋・障礙福祉事業所用物件</strong>——著眼指定基準的物件選擇 →{" "}
              <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">尋找可作團體家屋的物件</Link>
            </li>
            <li>
              <strong>員工宿舍・法人租賃</strong>——外籍員工的住居安排也提供多語言服務 →{" "}
              <Link href={addLocalePrefix("/toushi/shataku", locale)} className="text-primary underline">員工宿舍・法人租賃支援</Link>
            </li>
            <li>
              <strong>收益物件（區分・整棟）</strong>
              <Placeholder reason="浦松＝収益物件の対応範囲" />
            </li>
            <li>
              服務區域
              <Placeholder reason="浦松＝対応エリアの確定" />
            </li>
          </ul>
        </div>

        <div>
          <ReH2>為什麼要諮詢四葉不動産？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            理由就在「隔壁」。開設團體家屋，除了物件之外還需要<strong>事業者指定的申請</strong>；接納外籍員工則需要<strong>在留資格</strong>。四葉不動産的關聯事業中，設有承辦這些業務的四葉行政書士事務所，因此<strong>從取得物件到之後的手續，都能預先規劃、在同一個窗口諮詢</strong>。
          </p>
        </div>

        <div>
          <ReH2>關於費用</ReH2>
          <p className="mt-3 text-sm leading-relaxed text-text">
            買賣・租賃的仲介手續費，依宅地建物取引業法所定之範圍（一般資訊）。詳情請見{" "}
            <Link href={addLocalePrefix("/access", locale)} className="text-primary underline">交通與費用</Link>。
            <Placeholder reason="Notion＝料金の掲載範囲" />
          </p>
        </div>
      </>
    ),
  },
  zh: {
    metaTitle: "投资用・事业用不动产｜文京区的四葉不動産",
    metaDesc:
      "四葉不動産株式会社经手投资用・事业用不动产。可用于团体家屋・残障福祉事业所的物件、员工宿舍・法人租赁、收益物件，从事业目的反向推算为您提案。特长是从取得物件到之后的手续，都能预先规划、一并咨询。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "投资用・事业用不动产",
    heroAlt: "投资用・事业用不动产示意图（整栋收益物件）",
    h1: "投资用・事业用不动产",
    lead: (
      <p>
        四葉不動産株式会社经手<strong>投资用・事业用不动产</strong>。核心为三类——<strong>可用于团体家屋（残障福祉事业所）的物件</strong>、<strong>员工宿舍・法人租赁</strong>、<strong>收益物件</strong>。三者的共通点，不在“物件本身”，而是<strong>从事业目的反向推算来选择</strong>。不合用途的物件，再便宜也是昂贵的买卖。四葉不動産按目的・要件・收支的顺序整理后为您提案。
      </p>
    ),
    internalLinks: [
      { href: "/toushi/group-home", label: "团体家屋物件" },
      { href: "/toushi/shataku", label: "员工宿舍・法人租赁" },
      { href: "/access", label: "交通与费用" },
    ],
    crossLinkLead:
      "开设团体家屋，除了物件之外，还需要事业者指定的申请。指定申请由关联事业的四葉行政書士事務所承办。",
    relatedAria: "相关链接",
    relatedHeading: "本页相关链接",
    authorAlt: "四葉不動産株式会社 代表取缔役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取缔役・专任宅地建物取引士。行政书士。曾任每日新闻中国总局长（记者经历34年）・旅居海外4国。已通过社会保险劳务士考试（预定2026年9月开业）。",
    sections: (locale) => (
      <>
        <div>
          <ReH2>经手哪些投资・事业用不动产？</ReH2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            <li>
              <strong>团体家屋・残障福祉事业所用物件</strong>——着眼指定基准的物件选择 →{" "}
              <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">寻找可作团体家屋的物件</Link>
            </li>
            <li>
              <strong>员工宿舍・法人租赁</strong>——外籍员工的住房安排也提供多语言服务 →{" "}
              <Link href={addLocalePrefix("/toushi/shataku", locale)} className="text-primary underline">员工宿舍・法人租赁支援</Link>
            </li>
            <li>
              <strong>收益物件（区分・整栋）</strong>
              <Placeholder reason="浦松＝収益物件の対応範囲" />
            </li>
            <li>
              服务区域
              <Placeholder reason="浦松＝対応エリアの確定" />
            </li>
          </ul>
        </div>

        <div>
          <ReH2>为什么要咨询四葉不動産？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            理由就在“隔壁”。开设团体家屋，除了物件之外还需要<strong>事业者指定的申请</strong>；接纳外籍员工则需要<strong>在留资格</strong>。四葉不動産的关联事业中，设有承办这些业务的四葉行政書士事務所，因此<strong>从取得物件到之后的手续，都能预先规划、在同一个窗口咨询</strong>。
          </p>
        </div>

        <div>
          <ReH2>关于费用</ReH2>
          <p className="mt-3 text-sm leading-relaxed text-text">
            买卖・租赁的中介手续费，依日本《宅地建物取引业法》所定范围（一般信息）。详情请见{" "}
            <Link href={addLocalePrefix("/access", locale)} className="text-primary underline">交通与费用</Link>。
            <Placeholder reason="Notion＝料金の掲載範囲" />
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
    businessKey: "realestate",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/toushi",
    keywords: ["事業用 不動産 文京区", "グループホーム 物件", "収益物件 東京"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  const relatedColumns = filterColumnsByTheme(
    (await getColumns(locale)).map((col) => getLocalizedColumn(col, locale)),
    "toushi",
  );

  return (
    <RealestateServicePage
      path="/toushi"
      relatedColumns={relatedColumns}
      crumbs={[{ name: c.breadcrumbHome, href: "/" }, { name: c.breadcrumbCurrent }]}
      serviceName="投資用・事業用不動産の仲介・提案"
      heroSrc="/hero/realestate-toushi-16x9.webp"
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
      {c.sections(locale)}
    </RealestateServicePage>
  );
}
