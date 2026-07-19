// /global（型A・横断レイヤー）＝原稿_不動産 #5
// クロスリンク＝C6（→/legal/services/visa）がpathで自動表示。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/access・/toushi/shataku）。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳（找房・簽證・繼承・專欄）／zh=大陸表記。
// 在留資格＝visaページ既訳と統一：residence status (visa)／在留資格（簽證）／在留资格（签证）。
// 対応言語表記＝D2確定（2026-07-10）「日本語・英語・中国語（繁体字・簡体字）」系。jaの表示文言は一字一句不変。
// keywords＝ja固定。href・画像src・className・JSON-LD構造・Breadcrumb/CtaBand構造は不変。
// 署名・関連リンク見出し＝RealestateServicePageの上書きprops（relatedAria等・既定=ja）で対応。
// s3の繁體中文（言語スイッチャーのラベル）は全ロケールで繁体字のまま＝意図的。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";
import { getColumns, getLocalizedColumn, filterColumnsByTheme } from "@/lib/columns";
import type { LangCode } from "@/config/languages";

// ─── B-4（2026-07-19浦松検収済み・日本語版のみ）─────────────────────────
// 冒頭の回答ブロック（H1直下・165字）。対応言語＝D2確定「日本語・英語・中国語（繁体字・簡体字）」を必須記載。
// 代表の駐在歴は既存leadに記載済みのため重複させない（国数表記は一切使わない）。
const JA_ANSWER_BLOCK =
  "日本で家を探す外国人の方を、四葉不動産株式会社が日本語・英語・中国語（繁体字・簡体字）でサポートします。文京区・茗荷谷を中心に、在留資格の確認や保証会社の利用など日本特有の手続きを整理し、入居審査から契約、重要事項説明の補足まで母語でご案内します。在留資格そのものの申請書類の作成は、併設の四葉行政書士事務所が別契約で受任します。";

// FAQPage＝B-3の40問から外国人・中国語対応分野の5問を参照（文字列コピー禁止＝表記ゆれ防止）
const JA_FAQ_QUESTIONS = [
  "外国人でも日本で部屋を借りられますか？",
  "中国語で不動産の相談ができますか？",
  "繁体字と簡体字の両方に対応していますか？",
  "在留資格（ビザ）の相談もできますか？",
  "重要事項説明を外国語でサポートしてもらえますか？",
];

type GlobalCopy = {
  metaTitle: string;
  metaDesc: string;
  crumbHome: string;
  crumbCurrent: string;
  serviceName: string;
  heroAlt: string;
  h1: string;
  lead: React.ReactNode;
  internalLinks: { href: string; label: string }[];
  crossLinkLead: string;
  s1H2: string;
  s1Body: React.ReactNode;
  s2H2: string;
  s2Body: React.ReactNode;
  s3H2: string;
  s3Body: (locale: LangCode) => React.ReactNode;
  relatedAria: string;
  relatedHeading: string;
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
};

const COPY: Record<LangCode, GlobalCopy> = {
  ja: {
    metaTitle: "外国人の日本での家探し｜多言語対応の四葉不動産",
    metaDesc:
      "日本での家探しを、四葉不動産株式会社が母語でサポートします。入居審査・契約・暮らしの手続きまで、日本語・英語・中国語（繁体字・簡体字）で対応。元毎日新聞中国総局長として中国や台湾、タイに駐在した代表が、言葉と制度の両面から外国人のお部屋探しを支えます。",
    crumbHome: "ホーム",
    crumbCurrent: "外国人・多言語のお部屋探し",
    serviceName: "外国人・多言語のお部屋探しサポート",
    heroAlt: "外国人・多言語のお部屋探しのイメージ（多国籍の入居者）",
    h1: "外国人・多言語のお部屋探し",
    lead: (
      <p>
        外国人の方の日本での家探しは、<strong>四葉不動産株式会社が母語でサポートします</strong>。対応言語は日本語・英語・中国語（繁体字・簡体字）。入居審査・保証会社・契約・入居後の手続きまで、一つずつ一緒に進めます。代表の浦松 丈二は元毎日新聞中国総局長として中国や台湾、タイに駐在し、「外国で家を探す側」の経験があります。だから、何が不安かがわかります。
      </p>
    ),
    internalLinks: [
      { href: "/toushi/shataku", label: "社宅・法人賃貸" },
      { href: "/access", label: "アクセス・料金" },
    ],
    crossLinkLead: "在留資格・会社設立の手続きは、関連事業の四葉行政書士事務所が対応します。",
    s1H2: "外国人でも日本で部屋を借りられますか？",
    s1Body: (
      <>
        借りられます。ただし、在留資格の種類・言語・保証会社・緊急連絡先など、日本特有の確認事項があり、ここでつまずく方が多いのも事実です。四葉不動産は、<strong>審査に必要な準備を先に整理</strong>し、貸主・保証会社への説明も含めてサポートします。
      </>
    ),
    s2H2: "在留資格や会社設立も相談できますか？",
    s2Body: (
      <>
        住まいの手続きは四葉不動産が、<strong>在留資格・会社設立の手続き</strong>は関連事業の四葉行政書士事務所が対応します。日本での生活と事業の入口を、同じ窓口で相談できます。
      </>
    ),
    s3H2: "繁体字（台湾・中華圏）のコンテンツはありますか？",
    s3Body: (locale) => (
      <>
        あります。台湾・中華圏の方向けの繁体字コラム（相続・投資・手続き）を公開しています。ページ右上の言語スイッチャーから繁體中文をお選びください →{" "}
        <Link href={addLocalePrefix("/column", locale)} className="text-primary underline">コラム一覧</Link>
      </>
    ),
    relatedAria: "関連リンク",
    relatedHeading: "このページの関連リンク",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
  },
  en: {
    metaTitle: "House Hunting in Japan for Foreign Residents | 四葉不動産 (Yotsuba Real Estate), Multilingual Support",
    metaDesc:
      "Yotsuba Real Estate Co., Ltd. supports your house hunting in Japan in your own language. From tenant screening and the contract to the paperwork of daily life, we assist you in Japanese, English, Traditional Chinese, and Simplified Chinese. Our representative — a former China General Bureau Chief of the Mainichi Shimbun who was stationed in China, Taiwan, and Thailand — supports room hunting for foreign residents on both the language and the system side.",
    crumbHome: "Home",
    crumbCurrent: "Multilingual Room Hunting for Foreign Residents",
    serviceName: "Multilingual Room-Hunting Support",
    heroAlt: "Multilingual room hunting for foreign residents (tenants of many nationalities)",
    h1: "Multilingual Room Hunting for Foreign Residents",
    lead: (
      <p>
        For foreign residents, house hunting in Japan is <strong>supported by Yotsuba Real Estate Co., Ltd. in your own language</strong>. We assist you in Japanese, English, Traditional Chinese, and Simplified Chinese. Tenant screening, guarantor companies, the contract, and the procedures after moving in — we go through them together, one by one. Our representative, Joji Uramatsu, was stationed in China, Taiwan, and Thailand as the former China General Bureau Chief of the Mainichi Shimbun, and has himself been the one searching for a home in a foreign country. That is why we understand what worries you.
      </p>
    ),
    internalLinks: [
      { href: "/toushi/shataku", label: "Company Housing & Corporate Leasing" },
      { href: "/access", label: "Access & Fees" },
    ],
    crossLinkLead:
      "Residence status (visa) and company formation procedures are handled by our affiliated business, Yotsuba Gyoseishoshi Office.",
    s1H2: "Can foreign nationals rent an apartment in Japan?",
    s1Body: (
      <>
        Yes, you can. That said, Japan has its own points to check — the type of residence status (visa), language, guarantor companies, emergency contacts — and it is true that many people stumble here. Yotsuba Real Estate <strong>sorts out in advance what the screening will require</strong>, and supports you through the explanations to landlords and guarantor companies.
      </>
    ),
    s2H2: "Can I also consult about residence status (visa) or company formation?",
    s2Body: (
      <>
        Housing procedures are handled by Yotsuba Real Estate, and <strong>residence status (visa) and company formation procedures</strong> by our affiliated business, Yotsuba Gyoseishoshi Office. Life in Japan and the doorway to your business — both can be discussed at a single point of contact.
      </>
    ),
    s3H2: "Do you have content in Traditional Chinese (Taiwan / Chinese-speaking regions)?",
    s3Body: (locale) => (
      <>
        Yes. We publish columns in Traditional Chinese for readers in Taiwan and Chinese-speaking regions (inheritance, investment, and procedures). Please choose 繁體中文 from the language switcher at the top right of the page →{" "}
        <Link href={addLocalePrefix("/column", locale)} className="text-primary underline">Column list</Link>
      </>
    ),
    relatedAria: "Related links",
    relatedHeading: "Related links on this page",
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time licensed real estate broker; gyoseishoshi lawyer. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
  },
  "zh-tw": {
    metaTitle: "外國人在日本找房｜多語言支援的四葉不動産",
    metaDesc:
      "在日本找房，由四葉不動産株式会社以您的母語提供支援。從入住審查・簽約到生活相關手續，以日語・英語・中文（繁體・簡體）對應。代表曾任每日新聞中國總局長、旅居海外4國，從語言與制度兩方面支持外國人找房。",
    crumbHome: "首頁",
    crumbCurrent: "外國人・多語言找房",
    serviceName: "外國人・多語言找房服務",
    heroAlt: "外國人・多語言找房的示意圖（來自不同國家的住戶）",
    h1: "外國人・多語言找房",
    lead: (
      <p>
        外國人在日本找房，<strong>由四葉不動産株式会社以母語提供支援</strong>。對應語言為日語・英語・中文（繁體・簡體）。從入住審查・保證公司・簽約到入住後的手續，一項一項與您一起進行。代表浦松 丈二曾任每日新聞中國總局長、旅居海外4國，有過「在國外找房的一方」的親身經驗。所以，我們明白您會擔心什麼。
      </p>
    ),
    internalLinks: [
      { href: "/toushi/shataku", label: "員工宿舍・法人租賃" },
      { href: "/access", label: "交通與費用" },
    ],
    crossLinkLead: "在留資格（簽證）・公司設立的手續，由關聯事業・四葉行政書士事務所對應。",
    s1H2: "外國人也能在日本租到房子嗎？",
    s1Body: (
      <>
        可以租到。不過，在留資格（簽證）的種類・語言・保證公司・緊急聯絡人等，日本有其特有的確認事項，許多人在這一步遇到困難也是事實。四葉不動産會<strong>先整理審查所需的準備</strong>，並連同向房東・保證公司的說明一併提供支援。
      </>
    ),
    s2H2: "也能諮詢在留資格（簽證）或公司設立嗎？",
    s2Body: (
      <>
        住居相關手續由四葉不動産對應，<strong>在留資格（簽證）・公司設立的手續</strong>則由關聯事業・四葉行政書士事務所對應。在日本的生活與事業的入口，都能在同一窗口諮詢。
      </>
    ),
    s3H2: "有繁體字（台灣・中華圈）的內容嗎？",
    s3Body: (locale) => (
      <>
        有的。我們公開面向台灣・中華圈讀者的繁體字專欄（繼承・投資・手續）。請從頁面右上方的語言切換選單選擇繁體中文 →{" "}
        <Link href={addLocalePrefix("/column", locale)} className="text-primary underline">專欄一覽</Link>
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
    metaTitle: "外国人在日本找房｜多语言支持的四葉不動産",
    metaDesc:
      "在日本找房，由四葉不動産株式会社以您的母语提供支持。从入住审查・签约到生活相关手续，以日语・英语・中文（繁体・简体）对应。代表曾任每日新闻中国总局长、旅居海外4国，从语言与制度两方面支持外国人找房。",
    crumbHome: "首页",
    crumbCurrent: "外国人・多语言找房",
    serviceName: "外国人・多语言找房服务",
    heroAlt: "外国人・多语言找房的示意图（来自不同国家的住户）",
    h1: "外国人・多语言找房",
    lead: (
      <p>
        外国人在日本找房，<strong>由四葉不動産株式会社以母语提供支持</strong>。对应语言为日语・英语・中文（繁体・简体）。从入住审查・保证公司・签约到入住后的手续，一项一项与您一起进行。代表浦松 丈二曾任每日新闻中国总局长、旅居海外4国，有过“在国外找房的一方”的亲身经历。所以，我们明白您会担心什么。
      </p>
    ),
    internalLinks: [
      { href: "/toushi/shataku", label: "员工宿舍・企业租赁" },
      { href: "/access", label: "交通与费用" },
    ],
    crossLinkLead: "在留资格（签证）・公司设立的手续，由关联事业・四葉行政書士事務所办理。",
    s1H2: "外国人也能在日本租到房子吗？",
    s1Body: (
      <>
        可以租到。不过，在留资格（签证）的种类・语言・保证公司・紧急联系人等，日本有其特有的确认事项，许多人在这一步遇到困难也是事实。四葉不動産会<strong>先整理审查所需的准备</strong>，并连同向房东・保证公司的说明一并提供支持。
      </>
    ),
    s2H2: "也能咨询在留资格（签证）或公司设立吗？",
    s2Body: (
      <>
        住房相关手续由四葉不動産办理，<strong>在留资格（签证）・公司设立的手续</strong>则由关联事业・四葉行政書士事務所办理。在日本的生活与事业的入口，都可在同一窗口咨询。
      </>
    ),
    s3H2: "有繁体字（台湾・中华圈）的内容吗？",
    s3Body: (locale) => (
      <>
        有的。我们公开面向台湾・中华圈读者的繁体字专栏（继承・投资・手续）。请从页面右上方的语言切换菜单选择繁體中文 →{" "}
        <Link href={addLocalePrefix("/column", locale)} className="text-primary underline">专栏一览</Link>
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
    path: "/global",
    keywords: ["外国人 賃貸 東京", "外国人 部屋 借りられない", "中国語 不動産 東京"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  const relatedColumns = filterColumnsByTheme(
    (await getColumns(locale)).map((col) => getLocalizedColumn(col, locale)),
    "global",
  );

  const isJa = locale === "ja";

  return (
    <RealestateServicePage
      path="/global"
      answerBlock={isJa ? JA_ANSWER_BLOCK : undefined}
      relatedColumns={relatedColumns}
      crumbs={[{ name: c.crumbHome, href: "/" }, { name: c.crumbCurrent }]}
      serviceName={c.serviceName}
      heroSrc="/hero/realestate-global-16x9.webp"
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
        <p className="mt-3 leading-relaxed text-text">{c.s1Body}</p>
      </div>

      <div>
        <ReH2>{c.s2H2}</ReH2>
        <p className="mt-3 leading-relaxed text-text">{c.s2Body}</p>
      </div>

      <div>
        <ReH2>{c.s3H2}</ReH2>
        <p className="mt-3 text-sm leading-relaxed text-text">{c.s3Body(locale)}</p>
      </div>

      {isJa && (
        <>
          {/* FAQPage JSON-LD＝B-4の例外（浦松承認）。設問はB-3の40問を参照＝サイト内で文言一致 */}
          <Faq items={pickFaqJa(JA_FAQ_QUESTIONS)} heading="よくある質問" withJsonLd bare openFirst={false} />
          <CannotHandle bare />
        </>
      )}
    </RealestateServicePage>
  );
}
