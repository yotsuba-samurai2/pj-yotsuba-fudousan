// /toushi/group-home（型A・バリューチェーンの入口）＝原稿_不動産 #3
// クロスリンク＝C3（→/legal/services/shogai-fukushi）がpathで自動表示。
// ※賃料水準・稼働率等の数値断定はしない（景表法・ページ割v2）。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=access/page.tsx）。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳（團體家屋・障礙福祉・文京區）／zh=大陸表記（团体家屋・残障福祉）。
// 訳語は/legal/services/shogai-fukushi・HomePageContentの既訳と統一（共同生活援助=shared-living support／指定基準=designation standards）。
// JSON-LD Service name・keywords・Placeholder＝ja固定（構造不変）。ja表示文言は従来と一字一句同一。
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import type { LangCode } from "@/config/languages";

type GroupHomeCopy = {
  metaTitle: string;
  metaDesc: string;
  crumbHome: string;
  crumbToushi: string;
  crumbCurrent: string;
  heroAlt: string;
  h1: string;
  lead: ReactNode;
  s1H2: string;
  s1Note: string;
  s1Items: ReactNode[];
  s2H2: string;
  s2Body: ReactNode;
  internalLinks: { href: string; label: string }[];
  crossLinkLead: string;
  relatedAria: string;
  relatedHeading: string;
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
};

const COPY: Record<LangCode, GroupHomeCopy> = {
  ja: {
    metaTitle: "グループホームに使える物件探し｜四葉不動産",
    metaDesc:
      "グループホーム（共同生活援助）の開設に使える物件を、四葉不動産株式会社がご提案します。指定基準（立地・構造・面積・消防）を見据えた契約前の確認から、開設後を見据えた物件選びまで。文京区の窓口で、物件と手続きをまとめて相談できます。",
    crumbHome: "ホーム",
    crumbToushi: "投資用・事業用不動産",
    crumbCurrent: "グループホーム物件",
    heroAlt: "グループホームに使える物件のイメージ（住宅街の一軒家）",
    h1: "グループホームに使える物件探し",
    lead: (
      <p>
        グループホーム（共同生活援助）に使う物件は、<strong>「借りてから考える」と失敗します</strong>。事業者指定には立地・構造・面積・消防設備などの基準があり、契約後に「この物件では指定が取れない」と判明する事例が実際にあるからです。四葉不動産株式会社は、<strong>指定基準を見据えた契約前の確認</strong>から物件探しをお手伝いします。指定申請そのものは関連事業の四葉行政書士事務所が対応するため、<strong>物件と申請を一つの窓口で</strong>相談できます。
      </p>
    ),
    s1H2: "グループホームの物件は、何に気をつければいいですか？",
    s1Note: "契約前に確認すべき代表的なポイントです。個別の適合判断は自治体・専門家への確認が必要です。",
    s1Items: [
      <><strong>立地・用途地域</strong>：その場所で福祉事業が営めるか、近隣環境はどうか</>,
      <><strong>構造・面積</strong>：居室の広さ・数、共用部分の要件、バリアフリー</>,
      <><strong>消防・建築</strong>：消防設備の要否、建築基準への適合</>,
      <><strong>貸主の理解</strong>：用途（福祉事業）への承諾——ここで止まる案件は少なくありません</>,
    ],
    s2H2: "物件探しから開設までは、どう進みますか？",
    s2Body: (
      <>
        <strong>①物件のご相談（四葉不動産）→ ②指定基準との突き合わせ → ③指定申請（四葉行政書士事務所・別事業体）→ ④開設</strong>。物件と申請を並行で進めることで、「借りたのに開設できない」を避けられます。
      </>
    ),
    internalLinks: [
      { href: "/toushi", label: "投資用・事業用不動産トップ" },
      { href: "/access", label: "アクセス・料金" },
    ],
    crossLinkLead: "指定申請の要件・流れは、関連事業の四葉行政書士事務所のページで詳しく解説しています。",
    relatedAria: "関連リンク",
    relatedHeading: "このページの関連リンク",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
  },
  en: {
    metaTitle: "Finding a Property for a Group Home | 四葉不動産株式会社 (Yotsuba Real Estate)",
    metaDesc:
      "Yotsuba Real Estate Co., Ltd. proposes properties usable for opening a group home (shared-living support). From pre-contract checks with the designation standards (location, structure, floor area, fire safety) in view, to property selection that looks ahead to operation after opening. At our Bunkyo desk, you can consult about the property and the procedures together.",
    crumbHome: "Home",
    crumbToushi: "Investment & Business-Use Real Estate",
    crumbCurrent: "Group Home Properties",
    heroAlt: "A property usable as a group home—a detached house in a residential neighborhood",
    h1: "Finding a Property for a Group Home",
    lead: (
      <p>
        With a property for a group home (shared-living support), <strong>“lease first, think later” leads to failure</strong>. Provider designation has standards for location, structure, floor area, fire-safety equipment, and more, and there are real cases where it turns out, only after the contract is signed, that designation cannot be obtained for that property. Yotsuba Real Estate Co., Ltd. helps with your property search starting from <strong>pre-contract checks with the designation standards in view</strong>. The designation application itself is handled by our affiliated business 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office), so you can consult about <strong>the property and the application at one desk</strong>.
      </p>
    ),
    s1H2: "What should I watch out for in a property for a group home?",
    s1Note:
      "These are typical points to check before signing a contract. Whether a specific property complies must be confirmed with the municipality and specialists.",
    s1Items: [
      <><strong>Location / zoning</strong>: whether a welfare business can operate at that location, and what the surrounding neighborhood is like</>,
      <><strong>Structure / floor area</strong>: the size and number of resident rooms, requirements for common areas, barrier-free access</>,
      <><strong>Fire safety / building code</strong>: whether fire-safety equipment is required, and compliance with building standards</>,
      <><strong>The landlord’s understanding</strong>: consent to the intended use (a welfare business)—quite a few cases stall right here</>,
    ],
    s2H2: "How does it proceed, from property search to opening?",
    s2Body: (
      <>
        <strong>(1) Property consultation (Yotsuba Real Estate) → (2) checking the property against the designation standards → (3) designation application (Yotsuba Gyoseishoshi Office, a separate business entity) → (4) opening</strong>. By moving the property and the application forward in parallel, you avoid “leased, but cannot open.”
      </>
    ),
    internalLinks: [
      { href: "/toushi", label: "Investment & Business-Use Real Estate (Top)" },
      { href: "/access", label: "Access & Fees" },
    ],
    crossLinkLead:
      "The requirements and flow of the designation application are explained in detail on the pages of our affiliated business, 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office).",
    relatedAria: "Related links",
    relatedHeading: "Related links on this page",
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time licensed real estate broker; gyoseishoshi lawyer. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
  },
  "zh-tw": {
    metaTitle: "尋找可作團體家屋的物件｜四葉不動産",
    metaDesc:
      "四葉不動産株式会社為您提案可用於開設團體家屋（共同生活援助）的物件。從著眼指定基準（地點・結構・面積・消防）的簽約前確認，到放眼開設後營運的物件選擇。在文京區的窗口，物件與手續可一併諮詢。",
    crumbHome: "首頁",
    crumbToushi: "投資用・事業用不動產",
    crumbCurrent: "團體家屋物件",
    heroAlt: "可作團體家屋的物件示意圖（住宅區的獨棟住宅）",
    h1: "尋找可作團體家屋的物件",
    lead: (
      <p>
        用於團體家屋（共同生活援助）的物件，<strong>「先租下來再想」很容易失敗</strong>。事業者指定對地點、結構、面積、消防設備等訂有基準，實務上確實發生過簽約後才發現「這個物件無法取得指定」的案例。四葉不動産株式会社從<strong>著眼指定基準的簽約前確認</strong>開始，協助您尋找物件。指定申請本身由關係企業四葉行政書士事務所對應，因此<strong>物件與申請可在同一窗口</strong>諮詢。
      </p>
    ),
    s1H2: "團體家屋的物件，該注意些什麼？",
    s1Note: "以下是簽約前應確認的代表性要點。個別物件是否符合基準，仍需向自治體・專家確認。",
    s1Items: [
      <><strong>地點・用途地域</strong>：該地點能否經營福祉事業、周邊環境如何</>,
      <><strong>結構・面積</strong>：居室的大小・數量、共用部分的要件、無障礙</>,
      <><strong>消防・建築</strong>：是否需要消防設備、是否符合建築基準</>,
      <><strong>房東的理解</strong>：對用途（福祉事業）的同意——在這一關停下的案件並不少</>,
    ],
    s2H2: "從尋找物件到開設，流程如何進行？",
    s2Body: (
      <>
        <strong>①物件諮詢（四葉不動産）→ ②與指定基準的比對 → ③指定申請（四葉行政書士事務所・另一事業體）→ ④開設</strong>。物件與申請並行推進，可避免「租下來了卻無法開設」。
      </>
    ),
    internalLinks: [
      { href: "/toushi", label: "投資用・事業用不動產（總覽）" },
      { href: "/access", label: "交通與費用" },
    ],
    crossLinkLead: "指定申請的要件與流程，在關係企業四葉行政書士事務所的頁面有詳細解說。",
    relatedAria: "相關連結",
    relatedHeading: "本頁相關連結",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士。行政書士。曾任每日新聞中國總局長（記者資歷34年）・旅居海外4國。已通過社會保險勞務士考試（預定2026年9月開業）。",
  },
  zh: {
    metaTitle: "寻找可作团体家屋的物件｜四葉不動産",
    metaDesc:
      "四葉不動産株式会社为您提案可用于开设团体家屋（共同生活援助）的物件。从着眼指定基准（地点・结构・面积・消防）的签约前确认，到放眼开设后运营的物件选择。在文京区的窗口，物件与手续可一并咨询。",
    crumbHome: "首页",
    crumbToushi: "投资用・事业用不动产",
    crumbCurrent: "团体家屋物件",
    heroAlt: "可作团体家屋的物件示意图（住宅区的独栋住宅）",
    h1: "寻找可作团体家屋的物件",
    lead: (
      <p>
        用于团体家屋（共同生活援助）的物件，<strong>“先租下来再想”很容易失败</strong>。事业者指定对地点、结构、面积、消防设备等定有基准，实务中确实发生过签约后才发现“该物件无法取得指定”的案例。四葉不動産株式会社从<strong>着眼指定基准的签约前确认</strong>开始，协助您寻找物件。指定申请本身由关联企业四葉行政書士事務所对应，因此<strong>物件与申请可在同一窗口</strong>咨询。
      </p>
    ),
    s1H2: "团体家屋的物件，该注意些什么？",
    s1Note: "以下是签约前应确认的代表性要点。个别物件是否符合基准，仍需向自治体・专家确认。",
    s1Items: [
      <><strong>地点・用途地域</strong>：该地点能否经营福祉事业、周边环境如何</>,
      <><strong>结构・面积</strong>：居室的大小・数量、共用部分的要件、无障碍</>,
      <><strong>消防・建筑</strong>：是否需要消防设备、是否符合建筑基准</>,
      <><strong>房东的理解</strong>：对用途（福祉事业）的同意——在这一关停下的案件并不少</>,
    ],
    s2H2: "从寻找物件到开设，流程如何进行？",
    s2Body: (
      <>
        <strong>①物件咨询（四葉不動産）→ ②与指定基准的比对 → ③指定申请（四葉行政書士事務所・另一事业体）→ ④开设</strong>。物件与申请并行推进，可避免“租下来了却无法开设”。
      </>
    ),
    internalLinks: [
      { href: "/toushi", label: "投资用・事业用不动产（总览）" },
      { href: "/access", label: "交通与费用" },
    ],
    crossLinkLead: "指定申请的要件与流程，在关联企业四葉行政書士事務所的页面有详细解说。",
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
    path: "/toushi/group-home",
    keywords: ["グループホーム 物件 探し方", "共同生活援助 物件 基準", "障害福祉 物件"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;

  return (
    <RealestateServicePage
      path="/toushi/group-home"
      crumbs={[
        { name: c.crumbHome, href: "/" },
        { name: c.crumbToushi, href: "/toushi" },
        { name: c.crumbCurrent },
      ]}
      serviceName="グループホーム（共同生活援助）向け物件の仲介・提案"
      heroSrc="/hero/realestate-group-home-16x9.webp"
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
        <ReH2>{c.s1H2}</ReH2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.s1Note}</p>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed text-text">
          {c.s1Items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <Placeholder reason="浦松＝実務上のチェックポイントの追加・オーナー向け（GH向け賃貸という出口）の記載可否" />
      </div>

      <div>
        <ReH2>{c.s2H2}</ReH2>
        <p className="mt-3 leading-relaxed text-text">{c.s2Body}</p>
      </div>
    </RealestateServicePage>
  );
}
