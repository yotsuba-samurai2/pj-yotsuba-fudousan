// /global/chinese（型A・中国語圏特化ハブ）＝タスクC-3（2026-07-19）＋C-6-1 中国語版（2026-07-19）
// 方式＝RealestateServicePage（手本=/toushi/shitei-shinsei C-2）。多言語は locale 別 COPY マップ
//   （手本=HomePageContent）。ja / zh-tw / zh の3ロケール公開＝availableLocales と sitemap の locales を一致させる。
//   en 版は未作成のため COPY に持たず ja へフォールバックする（存在しないロケールURLは広告しない）。
// 表示コンプライアンス（宅建業法・分離受任）：業務一体提供を示唆する語（ワンストップ／one-stop／一站式／
//   一條龍 等）は全ロケールで使用禁止。可とするのは属性の事実と分離受任の明示のみ。
// 翻訳の原則（C-6-1・浦松承認）：日本語版にない事実・数値を訳で追加しない。構成・セクション・FAQは日本語版と同一。
//   法令名は「中国語訳（日本語：〇〇法）」形式で原名を併記。資格名・事業体名は原語（四葉不動産株式会社／
//   四葉行政書士事務所）を維持し、初出時に役割の簡潔な説明を添える。
//   「別契約で受任します」の訳は zh-tw=「另行簽訂契約承辦」／zh=「另行签订合同承办」に全箇所統一（浦松承認）。
//   台湾・大陸への言及は中立表現とし、繁体字版・簡体字版で内容に差をつけない。
// 準拠法（§2）＝法の適用に関する通則法36条「相続は、被相続人の本国法による」の一般的枠組みの紹介に留める。
//   法的結論（「結果として日本法で進む」等）は書かない。「実際の適用は事案により異なり…専門家にご相談ください」
//   の注記は必須（2026-07-19浦松検収）＝中国語版でも維持する。
// 代表の駐在歴＝「中国総局長として中国や台湾、タイに駐在しました」で固定（国数表記は全ロケールで使用禁止）。
// FAQPage JSON-LD＝ja は faqJa（B-3既存2問＋C-3新規2問）を参照（文字列コピー禁止＝表記ゆれ防止）。
//   zh-tw/zh の FAQ 文言は faqJa の対象外（faqJa.ts 冒頭の方針どおり）＝本ファイルの COPY 側に持つ。
//   inLanguage は BCP47_BY_LOCALE（hreflang と同一マッピング）を渡す。
import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { LangCode } from "@/config/languages";
import Link from "next/link";
import { buildPageMetadata, BCP47_BY_LOCALE } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";

/** 本ページを公開するロケール（hreflang・sitemap と一致させる） */
const PAGE_LOCALES: LangCode[] = ["ja", "zh-tw", "zh"];

// FAQPage（ja）＝faqJa（B-3既存2問＋C-3新規2問）を参照
const JA_FAQ_QUESTIONS = [
  "中国語で相続不動産の相談ができますか？",
  "繁体字と簡体字の両方に対応していますか？",
  "海外在住のまま日本の不動産を売却できますか？",
  "相続登記まで頼めますか？",
];

type Copy = {
  meta: { title: string; description: string; keywords: string[] };
  /** 冒頭の回答ブロック（H1直下）。ja は浦松指定の確定文言＝一字一句変更しないこと（2026-07-19検収） */
  answerBlock: string;
  crumbs: { home: string; global: string; current: string };
  serviceName: string;
  heroAlt: string;
  h1: string;
  /** リード文。strong で囲む部分を lead2 に分割 */
  lead: { pre: string; strong: string; post: string };
  internalLinks: { href: string; label: string; noLocalePrefix?: boolean }[];
  crossLinkLead: string;
  relatedAria: string;
  relatedHeading: string;
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
  s1: { h2: string; p1: string; p2: string };
  s2: { h2: string; p1: string; p2: string; p3pre: string; p3strong: string; p3post: string };
  s3: { h2: string; p1: string; p2: string; p3pre: string; p3link: string; p3post: string };
  s4: { h2: string; p1: string; p2: string };
  s5: {
    h2: string;
    p: string;
    thTask: string;
    thOwner: string;
    roles: { task: string; owner: string }[];
    note: string;
  };
  faqHeading: string;
  faqAria: string;
  /** zh-tw/zh のみ。ja は pickFaqJa を使う（faqJa 参照＝サイト内で文言一致） */
  faq?: FaqItem[];
};

const COPY: Partial<Record<LangCode, Copy>> = {
  ja: {
    meta: {
      title: "中国語で相談できる不動産・相続｜繁体字・簡体字対応 | 四葉不動産",
      description:
        "日本の不動産の相続・売却・お部屋探しを、中国語（繁体字・簡体字）でご相談いただけます。物件の査定・売却は四葉不動産株式会社が担当し、戸籍・公証書類の翻訳など相続関係書類の準備は併設の四葉行政書士事務所が別契約で受任します。海外在住の相続人のオンライン相談にも対応します。",
      keywords: ["中国語 不動産 相談", "在日中国人 相続 不動産", "中国語 不動産 売却 東京"],
    },
    answerBlock:
      "四葉不動産株式会社は、中国語（繁体字・簡体字）で日本の不動産の相続・売却・お部屋探しに対応します。物件の査定・売却は四葉不動産が担当し、相続登記に関わる書類の準備や翻訳などの法務手続きは併設の四葉行政書士事務所が別契約で受任します。海外にお住まいの相続人でも、オンラインで相談を始められます。台湾・大陸のいずれの書類にも対応します。",
    crumbs: { home: "ホーム", global: "外国人・多言語のお部屋探し", current: "中国語対応" },
    serviceName: "中国語（繁体字・簡体字）での不動産相続・売却・お部屋探しサポート",
    heroAlt: "中国語対応の不動産相談のイメージ（多国籍の相談者）",
    h1: "中国語対応｜相続・売却・お部屋探し",
    lead: {
      pre: "在日中国人・台湾出身の方とそのご家族の、日本の不動産に関するご相談を",
      strong: "中国語（繁体字・簡体字）で承ります",
      post:
        "。相続した不動産の売却から、海外在住のままのご相談、現地書類の翻訳・準備まで、担当する専門家を分けながら一つずつ進めます。",
    },
    internalLinks: [
      { href: "/global", label: "外国人・多言語のお部屋探し" },
      { href: "/souzoku", label: "相続不動産の相談" },
      {
        href: "/column/overseas-owners-guide-japan-real-estate-sale",
        label: "海外オーナーのための日本不動産売却ガイド",
      },
      { href: "/ryokin", label: "料金のご案内" },
      { href: "/legal", label: "四葉行政書士事務所" },
      { href: "/contact", label: "お問い合わせ" },
    ],
    crossLinkLead:
      "相続関係書類の作成・翻訳や在留資格の手続きは、関連事業の四葉行政書士事務所が別契約で受任します。",
    relatedAria: "関連リンク",
    relatedHeading: "このページの関連リンク",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
    s1: {
      h2: "中国語で相談できること — 相続・売却・お部屋探し",
      p1: "四葉不動産株式会社は、日本の不動産に関する相続のご相談、売却（査定を含む）、賃貸のお部屋探しを、中国語で承ります。繁体字・簡体字のどちらにも対応しており、台湾・香港の方には繁体字で、中国大陸の方には簡体字でご案内できます。",
      p2: "代表の浦松丈二は元毎日新聞記者で、中国総局長として中国や台湾、タイに駐在しました。言葉だけでなく、中華圏と日本の制度や商習慣の違いを踏まえてご相談いただけます。もちろん日本語・英語でのご相談も可能です。",
    },
    s2: {
      h2: "在日中国人の相続は、どの国の法律によりますか？",
      p1: "日本に住む中国籍・台湾出身の方が亡くなった場合、相続の手続きを進める前に「どの国・地域の法律を基準にするか（準拠法）」の整理が必要になります。",
      p2: "日本の「法の適用に関する通則法」は、相続について「被相続人の本国法による」という枠組みを定めています（同法第36条）。つまり、亡くなった方の国籍がどこにあるかが出発点となり、日本国内の不動産であっても、日本法だけを見て手続きが完結するとは限りません。",
      p3pre:
        "ただし、実際にどの法律がどのように適用されるかは、国籍の認定、本国法の内容、反致の有無など、事案ごとに検討すべき点が多くあります。",
      p3strong:
        "実際の適用は事案により異なり、法的判断を要するため、個別の状況については専門家にご相談ください。",
      p3post:
        "当社は不動産の面からご相談を承り、相続関係の書類作成は併設の四葉行政書士事務所が別契約で受任します。",
    },
    s3: {
      h2: "海外に住んだまま、相談・売却を進められますか？",
      p1: "進められます。ご相談はオンライン（ビデオ通話）でお受けでき、現地の物件確認は当社が行います。必要な書類のやり取りは郵送で進められるため、来日を前提とせずにご相談を始められます。",
      p2: "ただし、海外在住の相続人が日本の不動産を売却する場合、署名証明（サイン証明）や在留証明など、現地の在外公館や公証機関で取得する書類が必要になることがあります。こうした書類の準備には時間がかかる場合がありますので、売却をお考えの段階で、早めにご相談いただくことをお勧めします。必要な書類はご状況（在住国・在留状況など）により異なりますので、個別に確認しながら進めます。",
      p3pre: "海外在住のまま進める売却の流れは、コラム",
      p3link: "「海外オーナーのための日本不動産売却ガイド」",
      p3post: "で詳しく解説しています。",
    },
    s4: {
      h2: "中国・台湾の戸籍や公証書類の翻訳・準備",
      p1: "中華圏の相続手続きでは、中国大陸の戸口簿や公証処の公証書、台湾の戸籍謄本や除戸謄本など、現地の書類を日本の手続きで使える形に整える作業が必要になります。",
      p2: "こうした外国語書類の翻訳と、相続関係を証明する書類の作成支援は、併設の四葉行政書士事務所が別契約で受任します（当社とは独立した事業体で、紹介料等の授受はありません）。台湾・大陸のいずれの書類にも対応します。不動産のご相談とあわせて、窓口をご案内できます。",
    },
    s5: {
      h2: "どの手続きを、誰が担当しますか",
      p: "物件・書類・登記・税務は、それぞれ独立した事業体・専門家が別契約で担当します。",
      thTask: "業務",
      thOwner: "担当",
      roles: [
        { task: "物件の査定・売却・賃貸（宅地建物取引業）", owner: "四葉不動産株式会社" },
        { task: "相続関係書類の作成・翻訳", owner: "四葉行政書士事務所（別契約で受任）" },
        { task: "相続登記の申請", owner: "提携司法書士をご紹介" },
        { task: "相続税などの税務申告", owner: "提携税理士をご紹介" },
      ],
      note: "それぞれの専門家とは分離受任・個別契約です。ご相談の入口はどこからでも構いません。状況を伺ったうえで、必要な窓口をご案内します。",
    },
    faqHeading: "よくある質問",
    faqAria: "よくあるご質問",
  },

  en: {
    meta: {
      title:
        "Japanese Real Estate & Inheritance You Can Consult About in Chinese | Traditional & Simplified Chinese Support | 四葉不動産 (Yotsuba Real Estate)",
      description:
        "You can consult about the inheritance, sale, and rental search of real estate in Japan in Chinese (Traditional and Simplified). The appraisal and sale of the property are handled by 四葉不動産株式会社 (Yotsuba Real Estate Co., Ltd.), while the preparation of inheritance-related documents—such as the translation of family-register and notarized documents—is undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office). We also support online consultations for heirs living overseas.",
      keywords: [
        "Japanese real estate Chinese consultation",
        "Chinese residents in Japan inheritance real estate",
        "Tokyo real estate sale Chinese",
      ],
    },
    answerBlock:
      "四葉不動産株式会社 (Yotsuba Real Estate Co., Ltd.) handles the inheritance, sale, and rental search of real estate in Japan in Chinese (Traditional and Simplified). The appraisal and sale of the property are handled by Yotsuba Real Estate, while legal procedures such as the preparation and translation of documents related to inheritance registration are undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office) (a Japanese profession qualified in the preparation of legal documents, responsible for preparing official documents and supporting their applications). Even heirs living overseas can begin a consultation online. We can handle documents from both Taiwan and the mainland.",
    crumbs: {
      home: "Home",
      global: "Multilingual Room Hunting for Foreign Residents",
      current: "Chinese Language Support",
    },
    serviceName:
      "Support for Real Estate Inheritance, Sale, and Room Hunting in Chinese (Traditional and Simplified)",
    heroAlt: "Chinese-language real estate consultation (clients of many nationalities)",
    h1: "Chinese Language Support | Inheritance, Sale, and Room Hunting",
    lead: {
      pre: "We take on consultations about real estate in Japan from Chinese residents of Japan, people from Taiwan, and their families, ",
      strong: "provided in Chinese (Traditional and Simplified)",
      post:
        ". From the sale of inherited real estate, to consultations while you remain overseas, to the translation and preparation of local documents, we proceed one step at a time, dividing the work among the specialists in charge.",
    },
    internalLinks: [
      { href: "/global", label: "Multilingual Room Hunting for Foreign Residents" },
      { href: "/souzoku", label: "Consulting About Inherited Real Estate" },
      // The column's availability in an English locale depends on Column.locales (DB) and cannot be
      // confirmed without a production DB connection, so we link to the Japanese version with no prefix.
      {
        href: "/column/overseas-owners-guide-japan-real-estate-sale",
        label: "A Guide to Selling Japanese Real Estate for Overseas Owners (in Japanese)",
        noLocalePrefix: true,
      },
      // /ryokin is published in ja first (sitemap locales:["ja"]); no en version exists, so link to the Japanese page.
      { href: "/ryokin", label: "Fee Information" },
      { href: "/legal", label: "四葉行政書士事務所 (Yotsuba Gyoseishoshi Office)" },
      { href: "/contact", label: "Contact" },
    ],
    crossLinkLead:
      "The preparation and translation of inheritance-related documents, as well as residence status (visa) procedures, are undertaken under a separate contract by our affiliated business, 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office).",
    relatedAria: "Related links",
    relatedHeading: "Related links on this page",
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time Licensed Real Estate Transaction Specialist (宅地建物取引士); Gyoseishoshi (Administrative Scrivener). Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
    s1: {
      h2: "What you can consult about in Chinese — inheritance, sale, and room hunting",
      p1: "四葉不動産株式会社 (Yotsuba Real Estate Co., Ltd.) handles consultations on the inheritance of real estate in Japan, sales (including appraisal), and rental room hunting, in Chinese. We support both Traditional and Simplified Chinese: for clients in Taiwan and Hong Kong we can assist in Traditional Chinese, and for clients in mainland China in Simplified Chinese.",
      p2: "Our representative, Joji Uramatsu, is a former Mainichi Shimbun journalist who was stationed in China, Taiwan, and Thailand as China General Bureau Chief. Beyond language, you can consult with us on the basis of the differences in systems and business customs between the Chinese-speaking world and Japan. Consultations in Japanese and English are of course also available.",
    },
    s2: {
      h2: "Which country's law governs the inheritance of Chinese residents of Japan?",
      p1: "When a person of Chinese nationality or from Taiwan who lives in Japan passes away, before proceeding with inheritance procedures it becomes necessary to sort out 'which country's or region's law serves as the basis (the governing law).'",
      p2: "Japan's Act on General Rules for Application of Laws (法の適用に関する通則法) sets, for inheritance, the framework that it 'shall be governed by the national law of the decedent' (Article 36 of the same Act). In other words, where the deceased person's nationality lies becomes the starting point, and even for real estate located within Japan, the procedure does not necessarily conclude by looking at Japanese law alone.",
      p3pre:
        "That said, exactly which law applies and how involves many points to be examined case by case—such as the determination of nationality, the content of the national law, and whether renvoi applies.",
      p3strong:
        "Because the actual application differs from case to case and requires a legal judgment, please consult a specialist about your individual circumstances.",
      p3post:
        "Our company takes on consultations from the real estate side, while the preparation of inheritance-related documents is undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office).",
    },
    s3: {
      h2: "Can I proceed with the consultation and sale while living overseas?",
      p1: "Yes, you can. Consultations can be held online (by video call), and we handle the on-site confirmation of the property. Because the exchange of the necessary documents can be done by mail, you can begin a consultation without assuming a visit to Japan.",
      p2: "However, when an heir living overseas sells real estate in Japan, documents obtained from a local overseas mission or notary authority—such as a signature certificate or a certificate of residence—may sometimes be required. Preparing such documents can take time, so we recommend consulting us early, at the stage when you are considering a sale. The documents required differ depending on your situation (your country of residence, residency status, and so on), so we proceed while confirming them individually.",
      p3pre: "For the flow of a sale conducted while living overseas, the column",
      p3link: "'A Guide to Selling Japanese Real Estate for Overseas Owners' (in Japanese)",
      p3post: " explains it in detail.",
    },
    s4: {
      h2: "Translation and preparation of family-register and notarized documents from China and Taiwan",
      p1: "In inheritance procedures involving the Chinese-speaking world, it becomes necessary to put local documents—such as a mainland Chinese household register (hukou) or a notarial certificate from a notary office, or a Taiwanese family-register transcript or a removed-household register transcript—into a form usable in Japanese procedures.",
      p2: "The translation of such foreign-language documents and support with the preparation of documents proving inheritance relationships are undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office) (an independent business entity from our company, with no referral fees exchanged). We can handle documents from both Taiwan and the mainland. Together with your real estate consultation, we can direct you to the appropriate contact.",
    },
    s5: {
      h2: "Which procedure is handled by whom",
      p: "The property, documents, registration, and tax matters are each handled by independent business entities and specialists under separate contracts.",
      thTask: "Task",
      thOwner: "Handled by",
      roles: [
        {
          task: "Appraisal, sale, and leasing of the property (real estate brokerage business, 宅地建物取引業)",
          owner: "四葉不動産株式会社 (Yotsuba Real Estate Co., Ltd.)",
        },
        {
          task: "Preparation and translation of inheritance-related documents",
          owner: "四葉行政書士事務所 (Yotsuba Gyoseishoshi Office) (undertaken under a separate contract)",
        },
        {
          task: "Application for inheritance registration",
          owner: "Referral to a partner Judicial Scrivener (司法書士)",
        },
        {
          task: "Tax filings such as inheritance tax",
          owner: "Referral to a partner Tax Accountant (税理士)",
        },
      ],
      note: "With each specialist the engagement is separate, under an individual contract. Your inquiry can start from any entry point. After hearing your circumstances, we will direct you to the contact you need.",
    },
    faqHeading: "Frequently asked questions",
    faqAria: "Frequently asked questions",
    faq: [
      {
        q: "Can I consult about inherited real estate in Chinese?",
        a: "Yes. Consultations on the inheritance and sale of real estate in Japan can all be conducted in Chinese (Traditional and Simplified). Our representative, Joji Uramatsu, is a former Mainichi Shimbun journalist who was stationed in China, Taiwan, and Thailand as China General Bureau Chief. The preparation and translation of documents relating to inheritance are undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office).",
        links: [
          {
            href: "/en/global/chinese",
            label: "Chinese Language Support | Inheritance, Sale, and Room Hunting",
          },
        ],
      },
      {
        q: "Do you support both Traditional and Simplified Chinese?",
        a: "Yes, both are supported. Clients in Taiwan and Hong Kong can inquire in Traditional Chinese and clients in mainland China in Simplified Chinese, and this website also has Traditional and Simplified Chinese pages. We also provide our service while taking cultural-background differences into account.",
        links: [{ href: "/en/global", label: "Multilingual Room Hunting for Foreign Residents" }],
      },
      {
        q: "Can I sell real estate in Japan while living overseas?",
        a: "You are welcome to consult us. We support online consultations, and the on-site confirmation is carried out by our company. The necessary documents and procedures differ depending on your situation (your country of residence, residency status, and so on), so we proceed while confirming them item by item.",
        links: [{ href: "/en/global", label: "Multilingual Support for Foreign Residents" }],
      },
      {
        q: "Can I also entrust the inheritance registration together?",
        a: "Acting as an agent for the application for inheritance registration is the work of a Judicial Scrivener (司法書士), so our company will refer you to a partner Judicial Scrivener and proceed in coordination with them. The preparation and translation of the documents needed for registration, such as family registers, are undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office). The appraisal and sale of the property are handled by 四葉不動産株式会社 (Yotsuba Real Estate Co., Ltd.).",
        links: [
          {
            href: "/en/global/chinese",
            label: "Chinese Language Support | Inheritance, Sale, and Room Hunting",
          },
        ],
      },
    ],
  },

  "zh-tw": {
    meta: {
      title: "中文諮詢的日本不動產與繼承｜繁體字・簡體字對應 | 四葉不動産",
      description:
        "日本不動產的繼承、出售與租屋，均可使用中文（繁體字・簡體字）諮詢。物件的估價與出售由四葉不動産株式会社負責；戶籍・公證文件的翻譯等繼承相關文件的準備，則由併設的四葉行政書士事務所另行簽訂契約承辦。亦可對應居住海外之繼承人的線上諮詢。",
      keywords: ["日本不動產 中文諮詢", "在日華人 繼承 不動產", "東京 不動產 出售 中文"],
    },
    answerBlock:
      "四葉不動産株式会社以中文（繁體字・簡體字）承接日本不動產的繼承、出售與租屋諮詢。物件的估價與出售由四葉不動産負責；繼承登記相關文件的準備與翻譯等法務手續，則由併設的四葉行政書士事務所（日本的法律文件製作專業資格，負責官方文件的製作與申請支援）另行簽訂契約承辦。即使是居住在海外的繼承人，也可以透過線上方式開始諮詢。台灣與大陸的文件均可處理。",
    crumbs: { home: "首頁", global: "外國人・多語言租屋", current: "中文對應" },
    serviceName: "以中文（繁體字・簡體字）提供的不動產繼承・出售・租屋支援",
    heroAlt: "中文對應之不動產諮詢的示意圖（多國籍的諮詢者）",
    h1: "中文對應｜繼承・出售・租屋",
    lead: {
      pre: "我們承接在日華人、台灣出身人士及其家屬有關日本不動產的各項諮詢，",
      strong: "並以中文（繁體字・簡體字）提供服務",
      post:
        "。從繼承不動產的出售、人在海外時的諮詢，到當地文件的翻譯與準備，我們會區分各項業務的負責專家，逐步協助您完成。",
    },
    internalLinks: [
      { href: "/global", label: "外國人・多語言租屋" },
      { href: "/souzoku", label: "繼承不動產的諮詢" },
      // 当該コラムの zh-tw 公開状況は Column.locales（DB）依存で本番DB非接続のため確認できない。
      // リンク先に当該言語版がない場合は日本語版へリンクする方針に従い、接頭辞なしで固定する。
      {
        href: "/column/overseas-owners-guide-japan-real-estate-sale",
        label: "為海外屋主準備的日本不動產出售指南（日文）",
        noLocalePrefix: true,
      },
      // /ryokin は ja 先行公開（sitemap の locales:["ja"]）＝zh-tw 版が存在しないため日本語版へリンク。
      { href: "/ryokin", label: "費用說明" },
      { href: "/legal", label: "四葉行政書士事務所" },
      { href: "/contact", label: "聯絡我們" },
    ],
    crossLinkLead:
      "繼承相關文件的製作・翻譯，以及在留資格的相關手續，由關係事業四葉行政書士事務所另行簽訂契約承辦。",
    relatedAria: "相關連結",
    relatedHeading: "本頁的相關連結",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役（負責人）・專任宅地建物交易士（日本語：宅地建物取引士）。行政書士。前每日新聞中國總局長（記者資歷34年）。曾派駐中國、台灣與泰國。社會保險勞務士考試合格（預計2026年9月開業）。",
    s1: {
      h2: "中文可諮詢的範圍 — 繼承・出售・租屋",
      p1: "四葉不動産株式会社以中文承接日本不動產的繼承諮詢、出售（含估價）以及租屋需求。繁體字與簡體字皆可對應，台灣、香港的客戶可使用繁體字，中國大陸的客戶可使用簡體字洽詢。",
      p2: "負責人浦松丈二為前每日新聞記者，曾以中國總局長的身分派駐中國、台灣與泰國。除了語言之外，也能在理解華人圈與日本在制度、商業慣例上差異的基礎上提供諮詢。當然，也可以使用日文或英文洽詢。",
    },
    s2: {
      h2: "在日華人的繼承，依據哪一國的法律？",
      p1: "居住在日本的中國籍、台灣出身人士過世時，在推進繼承手續之前，需要先釐清「以哪一個國家或地區的法律為基準（準據法）」。",
      p2: "日本的「關於法律適用之通則法（日本語：法の適用に関する通則法）」就繼承訂有「依被繼承人之本國法」的框架（同法第36條）。也就是說，過世者的國籍所在為出發點，即使是位於日本國內的不動產，也未必僅依日本法即可完成全部手續。",
      p3pre:
        "不過，實際上哪一部法律會如何適用，涉及國籍的認定、本國法的內容、有無反致等，每一個案件都有許多需要個別檢討之處。",
      p3strong: "實際的適用因個案而異，且需要法律上的判斷，個別狀況請向專家諮詢。",
      p3post:
        "本公司從不動產的角度承接諮詢，繼承相關文件的製作則由併設的四葉行政書士事務所另行簽訂契約承辦。",
    },
    s3: {
      h2: "人在海外，也可以進行諮詢與出售嗎？",
      p1: "可以。諮詢可透過線上（視訊通話）進行，當地的物件確認由本公司執行。必要文件的往來可以郵寄方式處理，因此不必以親自赴日為前提，即可開始諮詢。",
      p2: "不過，居住海外的繼承人要出售日本的不動產時，有時會需要簽名證明，或在留證明（日本語：在留証明）等須在當地的駐外館處或公證機關取得的文件。這類文件的準備有時相當耗時，因此若您考慮出售，建議及早諮詢。所需文件會因您的狀況（居住國、居留狀況等）而有所不同，我們會逐項確認後再往下進行。",
      p3pre: "關於人在海外時的出售流程，請參閱專欄",
      p3link: "〈為海外屋主準備的日本不動產出售指南〉",
      p3post: "（日文），其中有更詳細的說明。",
    },
    s4: {
      h2: "中國、台灣的戶籍與公證文件之翻譯與準備",
      p1: "在華人圈的繼承手續中，常需要將中國大陸的戶口簿、公證處的公證書，或台灣的戶籍謄本、除戶謄本等當地文件，整理成可用於日本手續的形式。",
      p2: "這類外文文件的翻譯，以及證明繼承關係之文件的製作支援，由併設的四葉行政書士事務所另行簽訂契約承辦（為與本公司各自獨立的事業體，雙方並無介紹費等費用往來）。台灣與大陸的文件均可處理。可在諮詢不動產的同時，為您說明相關的洽詢窗口。",
    },
    s5: {
      h2: "各項手續分別由誰負責",
      p: "物件、文件、登記、稅務，分別由各自獨立的事業體與專家另行簽訂契約負責。",
      thTask: "業務",
      thOwner: "負責",
      roles: [
        {
          task: "物件的估價・出售・租賃（宅地建物交易業〔日本語：宅地建物取引業〕）",
          owner: "四葉不動産株式会社",
        },
        { task: "繼承關係文件的製作・翻譯", owner: "四葉行政書士事務所（另行簽訂契約承辦）" },
        { task: "繼承登記的申請", owner: "介紹合作的司法書士（日本的登記申請代理專業資格）" },
        { task: "遺產稅等稅務申報", owner: "介紹合作的稅理士（日本的稅務專業資格）" },
      ],
      note: "與各專家均為分離受任・個別簽約。諮詢的入口從任何一處開始都可以。我們會在了解您的狀況後，為您說明所需的窗口。",
    },
    faqHeading: "常見問題",
    faqAria: "常見問題",
    faq: [
      {
        q: "可以用中文諮詢繼承不動產嗎？",
        a: "可以。日本不動產的繼承與出售諮詢，均可使用中文（繁體字・簡體字）洽詢。負責人浦松丈二為前每日新聞記者，曾以中國總局長的身分派駐中國、台灣與泰國。繼承關係文件的製作與翻譯，由併設的四葉行政書士事務所另行簽訂契約承辦。",
        links: [{ href: "/zh-tw/global/chinese", label: "中文對應｜繼承・出售・租屋" }],
      },
      {
        q: "繁體字與簡體字都有對應嗎？",
        a: "都有對應。台灣、香港的客戶可使用繁體字，中國大陸的客戶可使用簡體字洽詢，本網站亦設有繁體字與簡體字的頁面。我們也會將文化背景上的差異納入考量後提供服務。",
        links: [{ href: "/zh-tw/global", label: "外國人・多語言租屋" }],
      },
      {
        q: "可以在居住海外的狀態下出售日本的不動產嗎？",
        a: "歡迎諮詢。我們可對應線上諮詢，當地的確認由本公司執行。必要的文件與手續會因您的狀況（居住國、居留狀況等）而有所不同，我們會逐項確認後再往下進行。",
        links: [{ href: "/zh-tw/global", label: "外國人・多語言支援" }],
      },
      {
        q: "可以連繼承登記一起委託嗎？",
        a: "繼承登記的申請代理屬於司法書士的業務，因此本公司會為您介紹合作的司法書士，並與其協同推進。登記所需的戶籍等文件之準備與翻譯，由併設的四葉行政書士事務所另行簽訂契約承辦。物件的估價與出售由四葉不動産株式会社承接。",
        links: [{ href: "/zh-tw/global/chinese", label: "中文對應｜繼承・出售・租屋" }],
      },
    ],
  },

  zh: {
    meta: {
      title: "中文咨询的日本不动产与继承｜繁体字・简体字对应 | 四葉不動産",
      description:
        "日本不动产的继承、出售与租房，均可使用中文（繁体字・简体字）咨询。房屋的估价与出售由四葉不動産株式会社负责；户籍・公证文件的翻译等继承相关文件的准备，则由并设的四葉行政书士事务所另行签订合同承办。亦可对应居住海外之继承人的线上咨询。",
      keywords: ["日本不动产 中文咨询", "在日华人 继承 不动产", "东京 不动产 出售 中文"],
    },
    answerBlock:
      "四葉不動産株式会社以中文（繁体字・简体字）承接日本不动产的继承、出售与租房咨询。不动产的估价与出售由四葉不動産负责；继承登记相关文件的准备与翻译等法务手续，则由并设的四葉行政书士事务所（日本的法律文件制作专业资格，负责官方文件的制作与申请支援）另行签订合同承办。即使是居住在海外的继承人，也可以通过线上方式开始咨询。台湾与大陆的文件均可处理。",
    crumbs: { home: "首页", global: "外国人・多语言租房", current: "中文对应" },
    serviceName: "以中文（繁体字・简体字）提供的不动产继承・出售・租房支援",
    heroAlt: "中文对应之不动产咨询的示意图（多国籍的咨询者）",
    h1: "中文对应｜继承・出售・租房",
    lead: {
      pre: "我们承接在日华人、台湾出身人士及其家属有关日本不动产的各项咨询，",
      strong: "并以中文（繁体字・简体字）提供服务",
      post:
        "。从继承不动产的出售、人在海外时的咨询，到当地文件的翻译与准备，我们会区分各项业务的负责专家，逐步协助您完成。",
    },
    internalLinks: [
      { href: "/global", label: "外国人・多语言租房" },
      { href: "/souzoku", label: "继承不动产的咨询" },
      // zh-tw 版と同じ理由（Column.locales はDB管理・本番DB非接続）で日本語版へ固定リンクする。
      {
        href: "/column/overseas-owners-guide-japan-real-estate-sale",
        label: "为海外业主准备的日本不动产出售指南（日文）",
        noLocalePrefix: true,
      },
      // /ryokin は ja 先行公開（sitemap の locales:["ja"]）＝zh 版が存在しないため日本語版へリンク。
      { href: "/ryokin", label: "费用说明" },
      { href: "/legal", label: "四葉行政书士事务所" },
      { href: "/contact", label: "联系我们" },
    ],
    crossLinkLead:
      "继承相关文件的制作・翻译，以及在留资格的相关手续，由关系事业四葉行政书士事务所另行签订合同承办。",
    relatedAria: "相关链接",
    relatedHeading: "本页的相关链接",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役（负责人）・专任宅地建物交易士（日本語：宅地建物取引士）。行政书士。前每日新闻中国总局长（记者资历34年）。曾派驻中国、台湾与泰国。社会保险劳务士考试合格（预计2026年9月开业）。",
    s1: {
      h2: "中文可咨询的范围 — 继承・出售・租房",
      p1: "四葉不動産株式会社以中文承接日本不动产的继承咨询、出售（含估价）以及租房需求。繁体字与简体字皆可对应，台湾、香港的客户可使用繁体字，中国大陆的客户可使用简体字洽询。",
      p2: "负责人浦松丈二为前每日新闻记者，曾以中国总局长的身分派驻中国、台湾与泰国。除了语言之外，也能在理解华人圈与日本在制度、商业惯例上差异的基础上提供咨询。当然，也可以使用日文或英文洽询。",
    },
    s2: {
      h2: "在日华人的继承，依据哪一国的法律？",
      p1: "居住在日本的中国籍、台湾出身人士过世时，在推进继承手续之前，需要先厘清「以哪一个国家或地区的法律为基准（准据法）」。",
      p2: "日本的「关于法律适用之通则法（日本語：法の適用に関する通則法）」就继承订有「依被继承人之本国法」的框架（同法第36条）。也就是说，过世者的国籍所在为出发点，即使是位于日本国内的不动产，也未必仅依日本法即可完成全部手续。",
      p3pre:
        "不过，实际上哪一部法律会如何适用，涉及国籍的认定、本国法的内容、有无反致等，每一个案件都有许多需要个别检讨之处。",
      p3strong: "实际的适用因个案而异，且需要法律上的判断，个别状况请向专家咨询。",
      p3post:
        "本公司从不动产的角度承接咨询，继承相关文件的制作则由并设的四葉行政书士事务所另行签订合同承办。",
    },
    s3: {
      h2: "人在海外，也可以进行咨询与出售吗？",
      p1: "可以。咨询可通过线上（视频通话）进行，当地的房屋确认由本公司执行。必要文件的往来可以邮寄方式处理，因此不必以亲自赴日为前提，即可开始咨询。",
      p2: "不过，居住海外的继承人要出售日本的不动产时，有时会需要签名证明，或在留证明（日本語：在留証明）等须在当地的驻外机构或公证机构取得的文件。这类文件的准备有时相当耗时，因此若您考虑出售，建议及早咨询。所需文件会因您的状况（居住国、居留状况等）而有所不同，我们会逐项确认后再往下进行。",
      p3pre: "关于人在海外时的出售流程，请参阅专栏",
      p3link: "〈为海外业主准备的日本不动产出售指南〉",
      p3post: "（日文），其中有更详细的说明。",
    },
    s4: {
      h2: "中国、台湾的户籍与公证文件之翻译与准备",
      p1: "在华人圈的继承手续中，常需要将中国大陆的户口簿、公证处的公证书，或台湾的户籍誊本、除户誊本等当地文件，整理成可用于日本手续的形式。",
      p2: "这类外文文件的翻译，以及证明继承关系之文件的制作支援，由并设的四葉行政书士事务所另行签订合同承办（为与本公司各自独立的事业体，双方并无介绍费等费用往来）。台湾与大陆的文件均可处理。可在咨询不动产的同时，为您说明相关的洽询窗口。",
    },
    s5: {
      h2: "各项手续分别由谁负责",
      p: "不动产、文件、登记、税务，分别由各自独立的事业体与专家另行签订合同负责。",
      thTask: "业务",
      thOwner: "负责",
      roles: [
        {
          task: "不动产的估价・出售・租赁（宅地建物交易业〔日本語：宅地建物取引業〕）",
          owner: "四葉不動産株式会社",
        },
        { task: "继承关系文件的制作・翻译", owner: "四葉行政书士事务所（另行签订合同承办）" },
        { task: "继承登记的申请", owner: "介绍合作的司法书士（日本的登记申请代理专业资格）" },
        { task: "遗产税等税务申报", owner: "介绍合作的税理士（日本的税务专业资格）" },
      ],
      note: "与各专家均为分离受任・个别签约。咨询的入口从任何一处开始都可以。我们会在了解您的状况后，为您说明所需的窗口。",
    },
    faqHeading: "常见问题",
    faqAria: "常见问题",
    faq: [
      {
        q: "可以用中文咨询继承不动产吗？",
        a: "可以。日本不动产的继承与出售咨询，均可使用中文（繁体字・简体字）洽询。负责人浦松丈二为前每日新闻记者，曾以中国总局长的身分派驻中国、台湾与泰国。继承关系文件的制作与翻译，由并设的四葉行政书士事务所另行签订合同承办。",
        links: [{ href: "/zh/global/chinese", label: "中文对应｜继承・出售・租房" }],
      },
      {
        q: "繁体字与简体字都有对应吗？",
        a: "都有对应。台湾、香港的客户可使用繁体字，中国大陆的客户可使用简体字洽询，本网站亦设有繁体字与简体字的页面。我们也会将文化背景上的差异纳入考量后提供服务。",
        links: [{ href: "/zh/global", label: "外国人・多语言租房" }],
      },
      {
        q: "可以在居住海外的状态下出售日本的不动产吗？",
        a: "欢迎咨询。我们可对应线上咨询，当地的确认由本公司执行。必要的文件与手续会因您的状况（居住国、居留状况等）而有所不同，我们会逐项确认后再往下进行。",
        links: [{ href: "/zh/global", label: "外国人・多语言支援" }],
      },
      {
        q: "可以连继承登记一起委托吗？",
        a: "继承登记的申请代理属于司法书士的业务，因此本公司会为您介绍合作的司法书士，并与其协同推进。登记所需的户籍等文件之准备与翻译，由并设的四葉行政书士事务所另行签订合同承办。不动产的估价与出售由四葉不動産株式会社承接。",
        links: [{ href: "/zh/global/chinese", label: "中文对应｜继承・出售・租房" }],
      },
    ],
  },
};

/** COPY 未定義ロケール（en）は ja にフォールバックする */
function pickCopy(locale: LangCode): Copy {
  return COPY[locale] ?? (COPY.ja as Copy);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = pickCopy(locale);
  return buildPageMetadata({
    businessKey: "realestate",
    title: c.meta.title,
    description: c.meta.description,
    path: "/global/chinese",
    keywords: c.meta.keywords,
    locale,
    absoluteTitle: true,
    availableLocales: PAGE_LOCALES,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = pickCopy(locale);
  // ja は faqJa 参照（文字列コピー禁止＝表記ゆれ防止）。zh-tw/zh は COPY 側（faqJa の対象外）。
  const faqItems: FaqItem[] = c.faq ?? pickFaqJa(JA_FAQ_QUESTIONS);

  return (
    <RealestateServicePage
      path="/global/chinese"
      answerBlock={c.answerBlock}
      crumbs={[
        { name: c.crumbs.home, href: "/" },
        { name: c.crumbs.global, href: "/global" },
        { name: c.crumbs.current },
      ]}
      serviceName={c.serviceName}
      heroSrc="/hero/realestate-global-16x9.webp"
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={
        <p>
          {c.lead.pre}
          <strong>{c.lead.strong}</strong>
          {c.lead.post}
        </p>
      }
      internalLinks={c.internalLinks}
      crossLinkLead={c.crossLinkLead}
      relatedAria={c.relatedAria}
      relatedHeading={c.relatedHeading}
      authorAlt={c.authorAlt}
      authorLabel={c.authorLabel}
      authorBio={c.authorBio}
    >
      {/* ─── C-3 本文5セクション（2026-07-19浦松検収済み）／C-6-1で多言語化 ─── */}
      {/* §1 対応範囲。駐在歴＝共通ルール8の固定文言（国名を具体列挙・国数表記は使わない） */}
      <Section h2={c.s1.h2}>
        <P>{c.s1.p1}</P>
        <P>{c.s1.p2}</P>
      </Section>

      {/* §2 準拠法の概説。根拠＝法の適用に関する通則法（平成18年法律第78号）36条。一般的枠組みの紹介のみ・
          法的結論は書かない。「専門家にご相談ください」注記は必須（浦松検収・全ロケールで維持） */}
      <Section h2={c.s2.h2}>
        <P>{c.s2.p1}</P>
        <P>{c.s2.p2}</P>
        <P>
          {c.s2.p3pre}
          <strong>{c.s2.p3strong}</strong>
          {c.s2.p3post}
        </P>
      </Section>

      {/* §3 遠隔手続き。署名証明・在留証明＝一般的な必要書類の例示（断定しない「必要になることがあります」） */}
      <Section h2={c.s3.h2}>
        <P>{c.s3.p1}</P>
        <P>{c.s3.p2}</P>
        <P>
          {c.s3.p3pre}
          {/* コラムは Column.locales（DB）依存で当該言語版の有無を確認できないため、
              全ロケールで日本語版URL（接頭辞なし）へリンクする＝リンク切れ・空ページを作らない。 */}
          <Link
            href="/column/overseas-owners-guide-japan-real-estate-sale"
            className="text-primary underline"
          >
            {c.s3.p3link}
          </Link>
          {c.s3.p3post}
        </P>
      </Section>

      {/* §4 書類の翻訳・準備＝四葉行政書士事務所の別契約受任（独立事業体・紹介料授受なし＝B-3 FAQと同一表現） */}
      <Section h2={c.s4.h2}>
        <P>{c.s4.p1}</P>
        <P>{c.s4.p2}</P>
      </Section>

      {/* §5 担当の分担表（構成・スタイル＝shitei-shinsei §4に準拠） */}
      <Section h2={c.s5.h2}>
        <P>{c.s5.p}</P>
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary-tint text-left">
              <th className="border border-border px-3 py-2">{c.s5.thTask}</th>
              <th className="border border-border px-3 py-2">{c.s5.thOwner}</th>
            </tr>
          </thead>
          <tbody className="text-text">
            {c.s5.roles.map((r) => (
              <tr key={r.task}>
                <td className="border border-border px-3 py-2">{r.task}</td>
                <td className="border border-border px-3 py-2">{r.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-text-muted">{c.s5.note}</p>
      </Section>

      {/* 対応できないこと＝B-4共通コンポーネント（浦松確定文言・一字一句変更なし）。
          2026-07-19 C-6-2（浦松指示・C-6-1の非表示方針を変更）：中国語版でも本表示を出す＝業際・
          分離受任・紹介料授受なし・社労士2026年9月開業予定の注記は中国語圏読者にこそ必要な
          コンプライアンス表示。訳は CannotHandle.tsx の確定訳をそのまま使う。 */}
      <CannotHandle bare locale={locale} />

      {/* FAQPage JSON-LD＝B-4の例外（浦松承認）。inLanguage は hreflang と同一マッピング */}
      <Faq
        items={faqItems}
        heading={c.faqHeading}
        ariaLabel={c.faqAria}
        withJsonLd
        inLanguage={BCP47_BY_LOCALE[locale]}
        bare
        openFirst={false}
      />
    </RealestateServicePage>
  );
}

function Section({ h2, children }: { h2: string; children: ReactNode }) {
  return (
    <div>
      <ReH2>{h2}</ReH2>
      {children}
    </div>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 leading-relaxed text-text">{children}</p>;
}
