// /souzoku/akiya（相続空き家の売却・活用・管理）＝タスクC-4（2026-07-19）＋C-6-2 中国語版（2026-07-19）
// 方式＝RealestateServicePage（手本=/toushi/shitei-shinsei C-2）。多言語は locale 別 COPY マップ
//   （手本=/global/chinese C-6-1）。ja / zh-tw / zh の3ロケール公開＝availableLocales と sitemap の locales を一致させる。
//   en 版は未作成のため COPY に持たず ja へフォールバックする（存在しないロケールURLは広告しない）。
// 表示コンプライアンス（宅建業法・分離受任）：業務一体提供を示唆する語（ワンストップ／one-stop／一站式／
//   一條龍 等）は全ロケールで使用禁止。可とするのは属性の事実と分離受任の明示のみ。
// 翻訳の原則（C-6-2・C-6-1と同一）：日本語版にない事実・数値を訳で追加しない。構成・6セクション・FAQ5問は
//   日本語版と同一。法令名・税制名は「中国語訳（日本語：〇〇）」形式で原名を併記し、日本の制度であることが
//   伝わる訳し方にする（中国・台湾の類似制度と混同されないため）。
//   「別契約で受任します」の訳は zh-tw=「另行簽訂契約承辦」／zh=「另行签订合同承办」に全箇所統一（C-6-1で浦松承認）。
//   資格名の役割説明も C-6-1 の既訳に統一＝税理士「日本的稅務專業資格」／司法書士「日本的登記申請代理專業資格」。
// 税制・空家法の記述は制度の存在の紹介に留め、断定しない（2026-07-19浦松検収済み草稿）：
//   ・空家法リスク＝「〜になる場合があります」＋「指定・課税の詳細は文京区および税理士にご確認ください」注記必須
//     （中国語版も条件付き表現を厳密に維持＝断定・誇張に振らない）
//   ・3,000万円特別控除＝存在の紹介のみ。要件の詳細列挙・適用可否の断定はしない（税理士へ誘導）
//   ・恐怖を煽る表現は使わない（制度の事実として淡々と記述）
//   ・「税理士にご確認ください」「文京区にご確認ください」の専門家誘導は全ロケール・全箇所で維持する
// FAQPage JSON-LD＝ja は faqJa（B-3の空き家分野5問）を参照（文字列コピー禁止＝表記ゆれ防止）。
//   zh-tw/zh の FAQ 文言は faqJa の対象外（faqJa.ts 冒頭の方針どおり）＝本ファイルの COPY 側に持つ。
//   inLanguage は BCP47_BY_LOCALE（hreflang と同一マッピング）を渡す。
// ヒーロー画像＝akiya専用画像が未制作のため realestate-group-home-16x9.webp（住宅街の一戸建て）を再利用。
import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { LangCode } from "@/config/languages";
import Link from "next/link";
import { buildPageMetadata, BCP47_BY_LOCALE } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";

/** 本ページを公開するロケール（hreflang・sitemap と一致させる） */
const PAGE_LOCALES: LangCode[] = ["ja", "zh-tw", "zh"];

// FAQPage（ja）＝faqJa（B-3の空き家分野5問）を参照
const JA_FAQ_QUESTIONS = [
  "空き家を放置するとどうなりますか？",
  "相続した空き家の売却で「3,000万円特別控除」は使えますか？",
  "遠方に住んでいても空き家を売却できますか？",
  "再建築不可の物件でも売れますか？",
  "相続した空き家をグループホームに使えますか？",
];

type TitleBody = { title: string; body: string };

type Copy = {
  meta: { title: string; description: string; keywords: string[] };
  /** 冒頭の回答ブロック（H1直下）。ja は浦松指定の確定文言＝一字一句変更しないこと（2026-07-19検収） */
  answerBlock: string;
  crumbs: { home: string; souzoku: string; current: string };
  serviceName: string;
  heroAlt: string;
  h1: string;
  /** リード文。strong で囲む2箇所を分割して保持する */
  lead: { pre: string; strong1: string; mid: string; strong2: string; post: string };
  internalLinks: { href: string; label: string; noLocalePrefix?: boolean }[];
  crossLinkLead: string;
  relatedAria: string;
  relatedHeading: string;
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
  /** §1 放置のリスク。note＝専門家・自治体への誘導（全ロケール必須） */
  s1: { h2: string; p1: string; p2: string; note: string };
  /** §2 3つの出口。axes＝判断軸4つ／exits＝出口3つ */
  s2: { h2: string; p: string; axes: TitleBody[]; exits: TitleBody[]; closing: string };
  s3: { h2: string; p1: string; p2: string };
  s4: { h2: string; p1: string; p2: string };
  s5: { h2: string; p1: string; p2: string; linkLabel: string };
  s6: {
    h2: string;
    p: string;
    steps: TitleBody[];
    closingPre: string;
    closingLink: string;
    closingPost: string;
  };
  faqHeading: string;
  faqAria: string;
  /** zh-tw/zh のみ。ja は pickFaqJa を使う（faqJa 参照＝サイト内で文言一致） */
  faq?: FaqItem[];
};

const COPY: Partial<Record<LangCode, Copy>> = {
  ja: {
    meta: {
      title: "文京区の空き家を売却・活用したい｜相続空き家の対処法 | 四葉不動産",
      description:
        "相続した空き家を放置し、勧告を受けて特定空家等・管理不全空家等に指定されると、住宅用地特例が外れ、土地の固定資産税額が最大6倍になることがあります。文京区小日向の四葉不動産株式会社が、空き家の売却・賃貸活用・管理を提案します。再建築不可や借地権付きなど条件の難しい物件、遠方・海外からのご相談にも対応します。",
      keywords: [
        "文京区 空き家 売却",
        "相続 空き家 どうする",
        "空き家 放置 固定資産税",
        "空き家 3000万円特別控除",
        "再建築不可 売却",
        "空き家 遠方 売却",
      ],
    },
    answerBlock:
      "相続した空き家を放置し、勧告を受けて特定空家等・管理不全空家等に指定されると、住宅用地特例が外れ、土地の固定資産税額が最大6倍になることがあります。四葉不動産株式会社は、文京区の空き家について売却・賃貸活用・管理を提案します。再建築不可や借地権付きなど条件の難しい物件にも対応します。相続登記など法務手続きに関わる書類作成は併設の四葉行政書士事務所が別契約で受任します。遠方にお住まいでも、オンラインと郵送で売却を進められます。",
    crumbs: { home: "ホーム", souzoku: "相続不動産", current: "空き家" },
    serviceName: "文京区の相続空き家の売却・賃貸活用・管理の提案",
    heroAlt: "文京区の住宅街の一戸建て（空き家のイメージ）",
    h1: "文京区の空き家、どうする？——売却・活用・管理",
    lead: {
      pre: "相続した実家が空き家のまま——そんなご相談が増えています。このページでは、空き家を放置した場合の",
      strong1: "制度上のリスク",
      mid: "と、",
      strong2: "売却・賃貸活用・管理という3つの出口",
      post: "の選び方、遠方にお住まいの方の進め方を解説します。",
    },
    internalLinks: [
      { href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" },
      { href: "/souzoku/nagare", label: "売却までの流れ" },
      { href: "/toushi/group-home", label: "グループホームに使える物件探し" },
      { href: "/global/chinese", label: "華人・中国語圏のお客様へ" },
      { href: "/ryokin", label: "料金のご案内" },
      { href: "/contact", label: "お問い合わせ" },
    ],
    crossLinkLead:
      "相続登記など法務手続きに関わる書類作成は、併設の四葉行政書士事務所が別契約で受任します。",
    relatedAria: "関連リンク",
    relatedHeading: "このページの関連リンク",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
    s1: {
      h2: "空き家を放置した場合の制度上のリスク",
      p1: "空き家の管理が不十分な状態が続くと、空家等対策の推進に関する特別措置法（空家法）に基づき、市区町村による指導・勧告等の対象になることがあります。勧告を受けて「特定空家等」または「管理不全空家等」に指定されると、固定資産税の住宅用地特例——小規模住宅用地（200㎡以下の部分）は課税標準が6分の1になる措置——の対象から除外され、土地の固定資産税額が最大6倍になる場合があります。",
      p2: "これは罰則ではなく、住宅が建つ土地への軽減措置が適用されなくなるという税制上の仕組みです。建物の老朽化や近隣への影響が進む前に、管理・活用・売却のいずれかへ動き始めることが、負担を抑える現実的な備えになります。",
      note: "※指定・課税の詳細は文京区および税理士にご確認ください。",
    },
    s2: {
      h2: "3つの出口——売却・賃貸活用・管理",
      p: "空き家の出口は、大きく「売却」「賃貸活用」「管理」の3つです。どれか一つに今すぐ決める必要はありません。次の4つの判断軸で並べて比較するところから始めます。",
      axes: [
        {
          title: "立地",
          body: "駅からの距離や周辺環境により、売りやすさ・貸しやすさは大きく変わります。文京区の相場をふまえて査定します。",
        },
        {
          title: "建物の状態",
          body: "そのまま貸せるのか、修繕やリフォームが必要か。かかる費用は「売る場合」「貸す場合」の収支に直結します。",
        },
        {
          title: "ご家族の意向",
          body: "将来住む可能性があるか、思い入れのある実家か、相続人の間で現金化して分けたいか。",
        },
        {
          title: "税負担",
          body: "保有し続ける場合の固定資産税等と、売却した場合の譲渡所得課税。具体的な税額の判断は税理士にご確認ください。",
        },
      ],
      exits: [
        {
          title: "売却",
          body: "住む予定がなく、維持費や税負担が重いときの現実的な出口です。文京区の相場をふまえた査定から進めます。",
        },
        {
          title: "賃貸活用",
          body: "立地の良い物件を収益源に変える選択肢です。「貸した場合」の収支を試算し、売却した場合と数字で比べます。",
        },
        {
          title: "管理",
          body: "すぐに決められないときに、資産価値を保ちながら次の一手を考えるための選択肢です。",
        },
      ],
      closing: "四葉不動産株式会社は、3つを比較する材料づくりからお手伝いします。",
    },
    s3: {
      h2: "相続空き家の「3,000万円特別控除」という制度",
      p1: "相続した空き家を売却したとき、譲渡所得から最大3,000万円を控除できる特例（被相続人の居住用財産（空き家）に係る譲渡所得の特別控除）が設けられています。相続空き家の売却を検討する際に、知っておきたい制度の一つです。",
      p2: "ただし、適用には建物・期間・売却条件などの要件があり、使えるかどうかの判断は税務の専門領域です。適用要件の判断は税理士にご確認ください。当社は提携税理士のご紹介と、売却そのもののサポートを承ります。",
    },
    s4: {
      h2: "条件の難しい空き家もご相談ください",
      p1: "「再建築不可と言われた」「借地権付きで売れるか分からない」「共有名義で話が進まない」——条件の難しい空き家も、あきらめる前にご相談ください。",
      p2: "再建築の可否や活用の選択肢は、接道の状況や隣地との関係など個別の事情により異なるため、まず現状の確認から始めます。借地権付きの物件は地主の方との関係整理が、共有名義の物件は共有者間の合意形成が、それぞれ進め方の鍵になります。売却の可否や条件をお約束するものではありませんが、条件が難しい物件こそ、進め方のご提案が価値を持ちます。",
    },
    s5: {
      h2: "グループホーム等への転用という選択肢",
      p1: "相続した空き家が障害者グループホーム（共同生活援助）の指定基準を満たせば、福祉の住まいとして活用できる場合があります。住宅街の一戸建てという立地・形状は共同生活援助の住まいと親和性があり、空き家の管理負担を活用に変える選択肢の一つです。",
      p2: "ただし、用途地域・居室面積・消防設備など障害福祉サービスの指定基準に関わる確認が必要で、基準は自治体・事業類型により異なります。改修や契約の前の段階でご相談ください。",
      linkLabel: "グループホームに使える物件探し",
    },
    s6: {
      h2: "遠方にお住まいでも——オンラインと郵送で進める売却",
      p: "相続した空き家が文京区にあり、ご自身は遠方や海外にお住まい——そうしたケースでも、売却は進められます。おおまかな流れは次のとおりです。",
      steps: [
        {
          title: "オンライン相談",
          body: "ご相談はオンラインや電話・LINEで進められます。現地の確認は当社が対応します。",
        },
        {
          title: "郵送での書類手続き",
          body: "契約や手続きに必要な書類は郵送でやり取りできます。必要書類やお立ち会いの要否は個別の事情により異なりますので、状況を伺ったうえでご案内します。",
        },
        {
          title: "売却",
          body: "査定から引き渡しまで、文京区の地元会社として伴走します。",
        },
      ],
      closingPre:
        "相続登記など法務手続きに関わる書類作成は、併設の四葉行政書士事務所が別契約で受任します。登記申請の代理は司法書士の業務のため、提携司法書士をご紹介します。海外在住の方のご相談にも対応しています。中国語圏にお住まいの方は、",
      closingLink: "華人・中国語圏のお客様向けのご案内",
      closingPost: "もご覧ください。",
    },
    faqHeading: "よくある質問",
    faqAria: "よくあるご質問",
  },

  en: {
    meta: {
      title:
        "Selling or Using a Vacant House in Bunkyo | How to Handle an Inherited Vacant House | 四葉不動産 (Yotsuba Real Estate)",
      description:
        "If an inherited vacant house is left unattended and, after receiving a recommendation, is designated as a Specified Vacant House or a Poorly Managed Vacant House, the residential land special exception is removed and the land's fixed asset tax can become up to six times higher. Yotsuba Real Estate Co., Ltd., located in Kohinata, Bunkyo, proposes the sale, rental use, or management of vacant houses. We also handle properties with difficult conditions, such as those that cannot be rebuilt or that come with leasehold rights, and consultations from those living far away or overseas.",
      keywords: [
        "Bunkyo vacant house sale",
        "inherited vacant house what to do",
        "vacant house fixed asset tax",
        "vacant house 30 million yen special deduction",
        "non-rebuildable property sale",
        "selling a vacant house from afar",
      ],
    },
    answerBlock:
      "If an inherited vacant house is left unattended and, after receiving a recommendation, is designated as a Specified Vacant House or a Poorly Managed Vacant House, the residential land special exception is removed and the land's fixed asset tax can become up to six times higher. 四葉不動産株式会社 (Yotsuba Real Estate Co., Ltd.) proposes the sale, rental use, or management of vacant houses in Bunkyo. We also handle properties with difficult conditions, such as those that cannot be rebuilt or that come with leasehold rights. The preparation of documents involved in legal procedures such as inheritance registration is undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office). Even if you live far away, you can proceed with the sale online and by mail.",
    crumbs: { home: "Home", souzoku: "Inherited Real Estate", current: "Vacant Houses" },
    serviceName:
      "Proposals for the sale, rental use, and management of inherited vacant houses in Bunkyo",
    heroAlt: "A detached house in a residential neighborhood of Bunkyo (image of a vacant house)",
    h1: "A Vacant House in Bunkyo—What Now? Sale, Use, and Management",
    lead: {
      pre: "An inherited family home left standing empty—consultations like this are increasing. This page explains the ",
      strong1: "risks under the system",
      mid: " of leaving a vacant house unattended, ",
      strong2: "how to choose among the three exits of sale, rental use, and management",
      post: ", and how those living far away can proceed.",
    },
    internalLinks: [
      { href: "/souzoku", label: "Inheriting Real Estate in Bunkyo | Complete Guide" },
      { href: "/souzoku/nagare", label: "The Process Up to Sale" },
      { href: "/toushi/group-home", label: "Finding a Property Usable for a Group Home" },
      { href: "/global/chinese", label: "For Chinese-Speaking Customers" },
      { href: "/ryokin", label: "Fee Information" },
      { href: "/contact", label: "Contact Us" },
    ],
    crossLinkLead:
      "The preparation of documents involved in legal procedures such as inheritance registration is undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office).",
    relatedAria: "Related links",
    relatedHeading: "Related links on this page",
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time Licensed Real Estate Transaction Specialist (宅地建物取引士); Gyoseishoshi (Administrative Scrivener). Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
    s1: {
      h2: "Risks Under the System When a Vacant House Is Left Unattended",
      p1: "If a vacant house continues to be inadequately managed, it may become subject to guidance or a recommendation from the municipality under the Act on Special Measures concerning the Promotion of Countermeasures against Vacant Houses (空家等対策の推進に関する特別措置法; the 'Vacant Houses Act'). If, after receiving a recommendation, it is designated as a 'Specified Vacant House' (特定空家等) or a 'Poorly Managed Vacant House' (管理不全空家等), it is excluded from the fixed asset tax residential land special exception—the measure under which small-scale residential land (the portion of 200㎡ or less) has its taxable base reduced to one-sixth—and the land's fixed asset tax can become up to six times higher.",
      p2: "This is not a penalty; it is a tax mechanism whereby the reduction measure applied to land on which a home stands ceases to apply. Beginning to move toward one of management, use, or sale—before the building deteriorates or the impact on the neighborhood grows—is a realistic preparation for keeping the burden down.",
      note: "*Please confirm the details of designation and taxation with Bunkyo City and a Tax Accountant (税理士).",
    },
    s2: {
      h2: "Three Exits—Sale, Rental Use, and Management",
      p: "There are broadly three exits for a vacant house: 'sale,' 'rental use,' and 'management.' You do not need to decide on one of them right away. We begin by lining them up and comparing them along the following four criteria.",
      axes: [
        {
          title: "Location",
          body: "How easy a property is to sell or rent varies greatly depending on the distance from the station and the surrounding environment. We appraise it taking the Bunkyo market into account.",
        },
        {
          title: "Condition of the building",
          body: "Can it be rented as is, or does it need repairs or renovation? The costs involved directly affect the income and expenses for both 'selling' and 'renting.'",
        },
        {
          title: "The family's wishes",
          body: "Whether there is a possibility of living there in the future, whether it is a family home with sentimental value, or whether the heirs wish to convert it to cash and divide it.",
        },
        {
          title: "Tax burden",
          body: "The fixed asset tax and the like if you continue to hold it, versus the capital gains taxation if you sell. For a judgment on specific tax amounts, please consult a Tax Accountant (税理士).",
        },
      ],
      exits: [
        {
          title: "Sale",
          body: "A realistic exit when there is no plan to live there and the upkeep costs and tax burden are heavy. We start from an appraisal that takes the Bunkyo market into account.",
        },
        {
          title: "Rental use",
          body: "An option that turns a well-located property into a source of income. We estimate the income and expenses 'if rented' and compare them in figures with the case of selling.",
        },
        {
          title: "Management",
          body: "An option for when you cannot decide right away, letting you consider your next move while preserving the asset's value.",
        },
      ],
      closing:
        "Yotsuba Real Estate Co., Ltd. helps from the very step of preparing the materials to compare the three.",
    },
    s3: {
      h2: "The 'Special Deduction of Up to 30 Million Yen' for Inherited Vacant Houses",
      p1: "When you sell an inherited vacant house, there is a special provision (the special deduction for capital gains on a residence (vacant house) of the decedent, 被相続人の居住用財産（空き家）に係る譲渡所得の特別控除) that allows up to 30 million yen to be deducted from the capital gains. It is one of the systems worth knowing about when considering the sale of an inherited vacant house.",
      p2: "However, its application is subject to requirements concerning the building, the time period, the conditions of sale, and so on, and judging whether it can be used is the specialized domain of tax matters. For a judgment on the eligibility requirements, please consult a Tax Accountant (税理士). We provide referrals to partner Tax Accountants and support for the sale itself.",
    },
    s4: {
      h2: "Please Also Consult Us About Vacant Houses with Difficult Conditions",
      p1: "'I was told it cannot be rebuilt,' 'It comes with leasehold rights, and I'm not sure whether it can be sold,' 'It's under joint ownership, and things aren't moving forward'—even for a vacant house with difficult conditions, please consult us before giving up.",
      p2: "Whether rebuilding is possible and what options exist for use differ according to individual circumstances, such as the road-frontage situation and the relationship with adjacent land, so we begin by checking the current state. For a property with leasehold rights, sorting out the relationship with the landowner is key to how to proceed; for a jointly owned property, reaching agreement among the co-owners is. While we do not promise whether a sale is possible or on what terms, it is precisely for properties with difficult conditions that a proposal on how to proceed holds value.",
    },
    s5: {
      h2: "The Option of Conversion to a Group Home and the Like",
      p1: "If an inherited vacant house meets the designation standards for a disability group home (communal-living support, 障害者グループホーム（共同生活援助）), it may in some cases be used as a welfare residence. The location and form of a detached house in a residential neighborhood have an affinity with a communal-living-support residence, making this one option for turning the management burden of a vacant house into active use.",
      p2: "However, checks related to the designation standards for disability-welfare services are required—such as the zoning district, the floor area of the rooms, and fire-safety equipment—and the standards differ by municipality and type of business. Please consult us at the stage before any renovation or contract.",
      linkLabel: "Finding a Property Usable for a Group Home",
    },
    s6: {
      h2: "Even If You Live Far Away—A Sale Conducted Online and by Mail",
      p: "The inherited vacant house is in Bunkyo, while you live far away or overseas—even in such cases, the sale can proceed. The general flow is as follows.",
      steps: [
        {
          title: "Online consultation",
          body: "Consultations can proceed online or by phone or LINE. We handle the on-site checks.",
        },
        {
          title: "Document procedures by mail",
          body: "The documents needed for the contract and procedures can be exchanged by mail. Because the required documents and whether your attendance is needed differ according to individual circumstances, we will explain after hearing about your situation.",
        },
        {
          title: "Sale",
          body: "From appraisal to handover, we accompany you as a local company in Bunkyo.",
        },
      ],
      closingPre:
        "The preparation of documents involved in legal procedures such as inheritance registration is undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office). Because acting as an agent for a registration application is the work of a Judicial Scrivener (司法書士), we refer you to a partner Judicial Scrivener. We also handle consultations from those living overseas. If you live in a Chinese-speaking region, please also see ",
      closingLink: "the information for Chinese-speaking customers",
      closingPost: ".",
    },
    faqHeading: "Frequently Asked Questions",
    faqAria: "Frequently asked questions",
    faq: [
      {
        q: "What happens if a vacant house is left unattended?",
        a: "In addition to deterioration and a worsening impact on the neighborhood, the tax burden can also increase. If it receives a recommendation and is designated as a 'Specified Vacant House' (特定空家等) or a 'Poorly Managed Vacant House' (管理不全空家等), it is excluded from the residential land special exception, and the land's fixed asset tax can become up to six times higher. The details of how this is applied in practice differ by municipality, so we suggest considering management, use, or sale early.",
        links: [{ href: "/en/souzoku", label: "Consulting about inherited real estate, including vacant houses" }],
      },
      {
        q: "Can the 'Special Deduction of Up to 30 Million Yen' be used when selling an inherited vacant house?",
        a: "There is a system providing a special deduction of up to 30 million yen for the capital gains on an inherited vacant house. However, its application is subject to requirements, and judging whether it can be used is the specialized domain of tax matters, so please consult a Tax Accountant (税理士). We provide referrals to partner Tax Accountants and support for the sale itself.",
        links: [{ href: "/en/souzoku", label: "Consulting about the sale of inherited real estate" }],
      },
      {
        q: "Can I sell a vacant house even if I live far away?",
        a: "Yes. Consultations can proceed online or by phone or LINE, and we handle the on-site checks. The documents needed for the procedures and whether your attendance is required differ according to individual circumstances, so we will explain after hearing about your situation. We also handle consultations from those living overseas.",
        links: [{ href: "/en/souzoku/nagare", label: "The process up to sale" }],
      },
      {
        q: "Can a property that cannot be rebuilt still be sold?",
        a: "It may be possible to sell it. Whether rebuilding is possible and what options exist for use differ according to individual circumstances, such as the road-frontage situation and the relationship with adjacent land, so we begin by checking the current state. It is precisely for properties with difficult conditions that a proposal on how to proceed holds value, so please consult us before giving up.",
        links: [{ href: "/en/souzoku", label: "Consulting about inherited real estate" }],
      },
      {
        q: "Can an inherited vacant house be used for a group home?",
        a: "It may be one of the options for use. However, checks related to the designation standards for disability-welfare services are required—such as the zoning district, the floor area of the rooms, and fire-safety equipment—and the standards differ by municipality and type of business. We take on consultations about using a property on the premise of confirming the standards.",
        links: [{ href: "/en/toushi/group-home", label: "Finding a property usable for a group home" }],
      },
    ],
  },

  "zh-tw": {
    meta: {
      title: "文京區的空屋想出售・活用｜繼承空屋的因應方式 | 四葉不動産",
      description:
        "繼承的空屋若放置不管，一旦接獲勸告並被指定為「特定空屋等」（日本語：特定空家等）或「管理不全空屋等」（日本語：管理不全空家等），將被排除於住宅用地特例之外，土地的固定資產稅額有可能最多增加至6倍。位於文京區小日向的四葉不動産株式会社，為您提出空屋的出售・出租活用・管理方案。再建築不可、附借地權等條件困難的物件，以及來自遠方・海外的諮詢均可對應。",
      keywords: [
        "文京區 空屋 出售",
        "日本 繼承 空屋",
        "日本 空屋 固定資產稅",
        "繼承空屋 3000萬 特別扣除",
        "再建築不可 出售",
        "人在海外 日本空屋 出售",
      ],
    },
    answerBlock:
      "繼承的空屋若放置不管，一旦接獲勸告並被指定為「特定空屋等」（日本語：特定空家等）或「管理不全空屋等」（日本語：管理不全空家等），將被排除於住宅用地特例（日本語：住宅用地特例）之外，土地的固定資產稅額有可能最多增加至6倍。四葉不動産株式会社針對文京區的空屋，提出出售・出租活用・管理的方案。再建築不可、附借地權等條件困難的物件亦可對應。繼承登記（日本語：相続登記）等法務手續相關的文件製作，由併設的四葉行政書士事務所（日本的法律文件製作專業資格，負責官方文件的製作與申請支援）另行簽訂契約承辦。即使您住在遠方，也能透過線上與郵寄的方式推進出售。",
    crumbs: { home: "首頁", souzoku: "繼承不動產", current: "空屋" },
    serviceName: "文京區繼承空屋的出售・出租活用・管理方案",
    heroAlt: "文京區住宅區的獨棟住宅（空屋的示意圖）",
    h1: "文京區的空屋，該怎麼辦？——出售・活用・管理",
    lead: {
      pre: "繼承的老家一直空著——這樣的諮詢正在增加。本頁將說明空屋放置不管時的",
      strong1: "制度上的風險",
      mid: "、",
      strong2: "出售・出租活用・管理這三個出口",
      post: "的選擇方式，以及住在遠方時的進行方式。",
    },
    internalLinks: [
      { href: "/souzoku", label: "在文京區繼承不動產｜完整指南" },
      { href: "/souzoku/nagare", label: "到出售為止的流程" },
      { href: "/toushi/group-home", label: "尋找可作為團體家屋使用的物件" },
      { href: "/global/chinese", label: "給華人・中文圈客戶的說明" },
      // C-6-3 で /zh-tw/ryokin を公開＝繁体字版へリンクする（日本語版固定と「（日文）」注記を解除）。
      { href: "/ryokin", label: "費用說明" },
      { href: "/contact", label: "聯絡我們" },
    ],
    crossLinkLead:
      "繼承登記（日本語：相続登記）等法務手續相關的文件製作，由併設的四葉行政書士事務所另行簽訂契約承辦。",
    relatedAria: "相關連結",
    relatedHeading: "本頁的相關連結",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役（負責人）・專任宅地建物交易士（日本語：宅地建物取引士）。行政書士。前每日新聞中國總局長（記者資歷34年）。曾派駐中國、台灣與泰國。社會保險勞務士考試合格（預計2026年9月開業）。",
    s1: {
      h2: "空屋放置不管時，制度上的風險",
      p1: "空屋的管理若持續處於不充分的狀態，依據日本的「空屋等對策推進特別措置法」（日本語：空家等対策の推進に関する特別措置法／簡稱「空家法」），有可能成為市區町村指導・勸告等的對象。一旦接獲勸告並被指定為「特定空屋等」（日本語：特定空家等）或「管理不全空屋等」（日本語：管理不全空家等），就會被排除於固定資產稅（日本語：固定資産税＝日本每年對土地・建物課徵的持有稅）之住宅用地特例——小規模住宅用地（200㎡以下的部分）課稅標準為六分之一的措施——的適用對象之外，土地的固定資產稅額有可能最多增加至6倍。",
      p2: "這並非罰則，而是「建有住宅的土地」所適用的減輕措施不再適用，屬於稅制上的機制。在建物老朽化或對鄰近的影響擴大之前，往管理・活用・出售其中一個方向開始行動，是抑制負擔的現實準備。",
      note: "※指定與課稅的詳細內容，請向文京區公所及稅理士（日本的稅務專業資格）確認。",
    },
    s2: {
      h2: "三個出口——出售・出租活用・管理",
      p: "空屋的出口大致分為「出售」「出租活用」「管理」三種。不需要現在就立刻決定其中之一。先從以下四個判斷軸並列比較開始。",
      axes: [
        {
          title: "地點",
          body: "距離車站的遠近與周邊環境，會大幅影響好不好賣、好不好出租。我們會參考文京區的行情進行估價。",
        },
        {
          title: "建物的狀態",
          body: "是可以直接出租，還是需要修繕或翻新。所需費用會直接影響「出售時」與「出租時」的收支。",
        },
        {
          title: "家人的意向",
          body: "將來是否有可能入住、是否為有情感的老家、繼承人之間是否希望變現後分配。",
        },
        {
          title: "稅務負擔",
          body: "持續持有時的固定資產稅等，以及出售時的讓渡所得課稅。具體稅額的判斷請向稅理士（日本的稅務專業資格）確認。",
        },
      ],
      exits: [
        {
          title: "出售",
          body: "在沒有入住打算、維持費與稅務負擔沉重時，是現實的出口。從參考文京區行情的估價開始進行。",
        },
        {
          title: "出租活用",
          body: "將地點良好的物件轉為收益來源的選項。試算「出租時」的收支，以數字與出售時作比較。",
        },
        {
          title: "管理",
          body: "在無法立刻決定時，一邊維持資產價值、一邊思考下一步的選項。",
        },
      ],
      closing: "四葉不動産株式会社會從製作比較這三者的材料開始協助您。",
    },
    s3: {
      h2: "繼承空屋的「3,000萬日圓特別扣除」這項制度",
      p1: "出售繼承而來的空屋時，設有可從讓渡所得中最多扣除3,000萬日圓的特例（日本語：被相続人の居住用財産（空き家）に係る譲渡所得の特別控除）。這是在考慮出售繼承空屋時，值得先了解的日本制度之一。",
      p2: "不過，適用上有建物、期間、出售條件等要件，能否使用的判斷屬於稅務的專門領域。適用要件的判斷請向稅理士（日本的稅務專業資格）確認。本公司承接合作稅理士的介紹，以及出售本身的支援。",
    },
    s4: {
      h2: "條件困難的空屋也歡迎諮詢",
      p1: "「被告知再建築不可」「附有借地權，不知道能不能賣」「因為是共有名義，事情談不下去」——條件困難的空屋，在放棄之前請先諮詢。",
      p2: "能否再建築以及活用的選項，會因面臨道路的狀況、與鄰地的關係等個別情事而有所不同，因此先從確認現狀開始。附借地權的物件，與地主之間關係的整理是關鍵；共有名義的物件，則是共有人之間的合意形成是進行的關鍵。雖然本公司無法保證出售的可否或條件，但正因為是條件困難的物件，關於進行方式的提案才更有價值。",
    },
    s5: {
      h2: "轉用為團體家屋等的選項",
      p1: "繼承的空屋若符合身心障礙者團體家屋（共同生活援助／日本語：障害者グループホーム（共同生活援助））的指定基準，有可能作為福祉的居所加以活用。住宅區的獨棟住宅這樣的地點與形狀，與共同生活援助的居所具有親和性，是將空屋的管理負擔轉為活用的選項之一。",
      p2: "不過，需要確認用途地域、居室面積、消防設備等與身心障礙福祉服務指定基準相關的事項，且基準會因自治體與事業類型而有所不同。請在改修或簽約之前的階段諮詢。",
      linkLabel: "尋找可作為團體家屋使用的物件",
    },
    s6: {
      h2: "即使住在遠方——透過線上與郵寄進行的出售",
      p: "繼承的空屋位於文京區，而自己住在遠方或海外——這樣的情況也能推進出售。大致的流程如下。",
      steps: [
        {
          title: "線上諮詢",
          body: "諮詢可透過線上或電話・LINE進行。當地的確認由本公司對應。",
        },
        {
          title: "以郵寄進行的文件手續",
          body: "契約與手續所需的文件可透過郵寄往來。所需文件以及是否需要親自到場，會因個別情事而有所不同，我們會在了解您的狀況後再為您說明。",
        },
        {
          title: "出售",
          body: "從估價到交屋，作為文京區的在地公司全程陪伴。",
        },
      ],
      closingPre:
        "繼承登記（日本語：相続登記）等法務手續相關的文件製作，由併設的四葉行政書士事務所另行簽訂契約承辦。登記申請的代理屬於司法書士（日本的登記申請代理專業資格）的業務，因此本公司會為您介紹合作的司法書士。我們也接受居住海外者的諮詢。居住於中文圈的客戶，也請參閱",
      closingLink: "給華人・中文圈客戶的說明",
      closingPost: "。",
    },
    faqHeading: "常見問題",
    faqAria: "常見問題",
    faq: [
      {
        q: "空屋放置不管會發生什麼事？",
        a: "除了老朽化與對鄰近的影響加劇之外，稅務負擔也可能加重。若接獲勸告並被指定為「特定空屋等」（日本語：特定空家等）或「管理不全空屋等」（日本語：管理不全空家等），將被排除於住宅用地特例的適用對象之外，土地的固定資產稅額有可能最多增加至6倍。實際運用的細節會因自治體而有所不同，建議及早考慮管理・活用・出售。",
        links: [{ href: "/zh-tw/souzoku", label: "包含空屋在內的繼承不動產諮詢" }],
      },
      {
        q: "繼承的空屋出售時，可以使用「3,000萬日圓特別扣除」嗎？",
        a: "針對繼承空屋的讓渡所得，設有3,000萬日圓特別扣除的制度。不過適用上有要件，能否使用的判斷屬於稅務的專門領域，請向稅理士（日本的稅務專業資格）確認。本公司承接合作稅理士的介紹，以及出售本身的支援。",
        links: [{ href: "/zh-tw/souzoku", label: "繼承不動產的出售諮詢" }],
      },
      {
        q: "住在遠方也能出售空屋嗎？",
        a: "可以。諮詢可透過線上或電話・LINE進行，當地的確認由本公司對應。手續所需的文件以及是否需要親自到場，會因個別情事而有所不同，我們會在了解您的狀況後再為您說明。也接受居住海外者的諮詢。",
        links: [{ href: "/zh-tw/souzoku/nagare", label: "到出售為止的流程" }],
      },
      {
        q: "再建築不可的物件也賣得掉嗎？",
        a: "有可能出售。能否再建築以及活用的選項，會因面臨道路的狀況、與鄰地的關係等個別情事而有所不同，因此先從確認現狀開始。正因為是條件困難的物件，關於進行方式的提案才更有價值，請在放棄之前先諮詢。",
        links: [{ href: "/zh-tw/souzoku", label: "繼承不動產的諮詢" }],
      },
      {
        q: "繼承的空屋可以作為團體家屋使用嗎？",
        a: "有可能成為活用的選項之一。不過，需要確認用途地域、居室面積、消防設備等與身心障礙福祉服務指定基準相關的事項，且基準會因自治體與事業類型而有所不同。本公司承接以基準確認為前提的物件活用諮詢。",
        links: [{ href: "/zh-tw/toushi/group-home", label: "尋找可作為團體家屋使用的物件" }],
      },
    ],
  },

  zh: {
    meta: {
      title: "文京区的空屋想出售・活用｜继承空屋的应对方式 | 四葉不動産",
      description:
        "继承的空屋若放置不管，一旦接获劝告并被指定为“特定空屋等”（日本語：特定空家等）或“管理不全空屋等”（日本語：管理不全空家等），将被排除于住宅用地特例之外，土地的固定资产税额有可能最多增加至6倍。位于文京区小日向的四葉不動産株式会社，为您提出空屋的出售・出租活用・管理方案。再建筑不可、附借地权等条件困难的房屋，以及来自远方・海外的咨询均可对应。",
      keywords: [
        "文京区 空屋 出售",
        "日本 继承 空置房屋",
        "日本 空屋 固定资产税",
        "继承空屋 3000万 特别扣除",
        "再建筑不可 出售",
        "人在海外 日本空屋 出售",
      ],
    },
    answerBlock:
      "继承的空屋（空置房屋）若放置不管，一旦接获劝告并被指定为“特定空屋等”（日本語：特定空家等）或“管理不全空屋等”（日本語：管理不全空家等），将被排除于住宅用地特例（日本語：住宅用地特例）之外，土地的固定资产税额有可能最多增加至6倍。四葉不動産株式会社针对文京区的空屋，提出出售・出租活用・管理的方案。再建筑不可、附借地权等条件困难的房屋亦可对应。继承登记（日本語：相続登記）等法务手续相关的文件制作，由并设的四葉行政书士事务所（日本的法律文件制作专业资格，负责官方文件的制作与申请支援）另行签订合同承办。即使您住在远方，也能通过线上与邮寄的方式推进出售。",
    crumbs: { home: "首页", souzoku: "继承不动产", current: "空屋" },
    serviceName: "文京区继承空屋的出售・出租活用・管理方案",
    heroAlt: "文京区住宅区的独栋住宅（空屋的示意图）",
    h1: "文京区的空屋，该怎么办？——出售・活用・管理",
    lead: {
      pre: "继承的老家一直空着——这样的咨询正在增加。本页将说明空屋放置不管时的",
      strong1: "制度上的风险",
      mid: "、",
      strong2: "出售・出租活用・管理这三个出口",
      post: "的选择方式，以及住在远方时的推进方式。",
    },
    internalLinks: [
      { href: "/souzoku", label: "在文京区继承不动产｜完整指南" },
      { href: "/souzoku/nagare", label: "到出售为止的流程" },
      { href: "/toushi/group-home", label: "寻找可作为团体家屋使用的房屋" },
      { href: "/global/chinese", label: "给华人・中文圈客户的说明" },
      // C-6-3 で /zh/ryokin を公開＝簡体字版へリンクする（日本語版固定と「（日文）」注記を解除）。
      { href: "/ryokin", label: "费用说明" },
      { href: "/contact", label: "联系我们" },
    ],
    crossLinkLead:
      "继承登记（日本語：相続登記）等法务手续相关的文件制作，由并设的四葉行政书士事务所另行签订合同承办。",
    relatedAria: "相关链接",
    relatedHeading: "本页的相关链接",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役（负责人）・专任宅地建物交易士（日本語：宅地建物取引士）。行政书士。前每日新闻中国总局长（记者资历34年）。曾派驻中国、台湾与泰国。社会保险劳务士考试合格（预计2026年9月开业）。",
    s1: {
      h2: "空屋放置不管时，制度上的风险",
      p1: "空屋的管理若持续处于不充分的状态，依据日本的“空屋等对策推进特别措置法”（日本語：空家等対策の推進に関する特別措置法／简称“空家法”），有可能成为市区町村指导・劝告等的对象。一旦接获劝告并被指定为“特定空屋等”（日本語：特定空家等）或“管理不全空屋等”（日本語：管理不全空家等），就会被排除于固定资产税（日本語：固定資産税＝日本每年对土地・建筑物征收的持有税）之住宅用地特例——小规模住宅用地（200㎡以下的部分）课税标准为六分之一的措施——的适用对象之外，土地的固定资产税额有可能最多增加至6倍。",
      p2: "这并非罚则，而是“建有住宅的土地”所适用的减轻措施不再适用，属于税制上的机制。在建筑物老朽化或对邻近的影响扩大之前，往管理・活用・出售其中一个方向开始行动，是抑制负担的现实准备。",
      note: "※指定与课税的详细内容，请向文京区政府及税理士（日本的税务专业资格）确认。",
    },
    s2: {
      h2: "三个出口——出售・出租活用・管理",
      p: "空屋的出口大致分为“出售”“出租活用”“管理”三种。不需要现在就立刻决定其中之一。先从以下四个判断轴并列比较开始。",
      axes: [
        {
          title: "地点",
          body: "距离车站的远近与周边环境，会大幅影响好不好卖、好不好出租。我们会参考文京区的行情进行估价。",
        },
        {
          title: "建筑物的状态",
          body: "是可以直接出租，还是需要修缮或翻新。所需费用会直接影响“出售时”与“出租时”的收支。",
        },
        {
          title: "家人的意向",
          body: "将来是否有可能入住、是否为有情感的老家、继承人之间是否希望变现后分配。",
        },
        {
          title: "税务负担",
          body: "持续持有时的固定资产税等，以及出售时的转让所得课税。具体税额的判断请向税理士（日本的税务专业资格）确认。",
        },
      ],
      exits: [
        {
          title: "出售",
          body: "在没有入住打算、维持费与税务负担沉重时，是现实的出口。从参考文京区行情的估价开始进行。",
        },
        {
          title: "出租活用",
          body: "将地点良好的房屋转为收益来源的选项。试算“出租时”的收支，以数字与出售时作比较。",
        },
        {
          title: "管理",
          body: "在无法立刻决定时，一边维持资产价值、一边思考下一步的选项。",
        },
      ],
      closing: "四葉不動産株式会社会从制作比较这三者的材料开始协助您。",
    },
    s3: {
      h2: "继承空屋的“3,000万日元特别扣除”这项制度",
      p1: "出售继承而来的空屋时，设有可从转让所得中最多扣除3,000万日元的特例（日本語：被相続人の居住用財産（空き家）に係る譲渡所得の特別控除）。这是在考虑出售继承空屋时，值得先了解的日本制度之一。",
      p2: "不过，适用上有建筑物、期间、出售条件等要件，能否使用的判断属于税务的专门领域。适用要件的判断请向税理士（日本的税务专业资格）确认。本公司承接合作税理士的介绍，以及出售本身的支援。",
    },
    s4: {
      h2: "条件困难的空屋也欢迎咨询",
      p1: "“被告知再建筑不可”“附有借地权，不知道能不能卖”“因为是共有名义，事情谈不下去”——条件困难的空屋，在放弃之前请先咨询。",
      p2: "能否再建筑以及活用的选项，会因面临道路的状况、与邻地的关系等个别情事而有所不同，因此先从确认现状开始。附借地权的房屋，与地主之间关系的整理是关键；共有名义的房屋，则是共有人之间的合意形成是推进的关键。虽然本公司无法保证出售的可否或条件，但正因为是条件困难的房屋，关于推进方式的提案才更有价值。",
    },
    s5: {
      h2: "转用为团体家屋等的选项",
      p1: "继承的空屋若符合残障人士团体家屋（共同生活援助／日本語：障害者グループホーム（共同生活援助））的指定标准，有可能作为福祉的居所加以活用。住宅区的独栋住宅这样的地点与形状，与共同生活援助的居所具有亲和性，是将空屋的管理负担转为活用的选项之一。",
      p2: "不过，需要确认用途地域、居室面积、消防设备等与残障福祉服务指定标准相关的事项，且标准会因自治体与事业类型而有所不同。请在改修或签约之前的阶段咨询。",
      linkLabel: "寻找可作为团体家屋使用的房屋",
    },
    s6: {
      h2: "即使住在远方——通过线上与邮寄进行的出售",
      p: "继承的空屋位于文京区，而自己住在远方或海外——这样的情况也能推进出售。大致的流程如下。",
      steps: [
        {
          title: "线上咨询",
          body: "咨询可通过线上或电话・LINE进行。当地的确认由本公司对应。",
        },
        {
          title: "以邮寄进行的文件手续",
          body: "合同与手续所需的文件可通过邮寄往来。所需文件以及是否需要亲自到场，会因个别情事而有所不同，我们会在了解您的状况后再为您说明。",
        },
        {
          title: "出售",
          body: "从估价到交房，作为文京区的本地公司全程陪伴。",
        },
      ],
      closingPre:
        "继承登记（日本語：相続登記）等法务手续相关的文件制作，由并设的四葉行政书士事务所另行签订合同承办。登记申请的代理属于司法书士（日本的登记申请代理专业资格）的业务，因此本公司会为您介绍合作的司法书士。我们也接受居住海外者的咨询。居住于中文圈的客户，也请参阅",
      closingLink: "给华人・中文圈客户的说明",
      closingPost: "。",
    },
    faqHeading: "常见问题",
    faqAria: "常见问题",
    faq: [
      {
        q: "空屋放置不管会发生什么事？",
        a: "除了老朽化与对邻近的影响加剧之外，税务负担也可能加重。若接获劝告并被指定为“特定空屋等”（日本語：特定空家等）或“管理不全空屋等”（日本語：管理不全空家等），将被排除于住宅用地特例的适用对象之外，土地的固定资产税额有可能最多增加至6倍。实际运用的细节会因自治体而有所不同，建议及早考虑管理・活用・出售。",
        links: [{ href: "/zh/souzoku", label: "包含空屋在内的继承不动产咨询" }],
      },
      {
        q: "继承的空屋出售时，可以使用“3,000万日元特别扣除”吗？",
        a: "针对继承空屋的转让所得，设有3,000万日元特别扣除的制度。不过适用上有要件，能否使用的判断属于税务的专门领域，请向税理士（日本的税务专业资格）确认。本公司承接合作税理士的介绍，以及出售本身的支援。",
        links: [{ href: "/zh/souzoku", label: "继承不动产的出售咨询" }],
      },
      {
        q: "住在远方也能出售空屋吗？",
        a: "可以。咨询可通过线上或电话・LINE进行，当地的确认由本公司对应。手续所需的文件以及是否需要亲自到场，会因个别情事而有所不同，我们会在了解您的状况后再为您说明。也接受居住海外者的咨询。",
        links: [{ href: "/zh/souzoku/nagare", label: "到出售为止的流程" }],
      },
      {
        q: "再建筑不可的房屋也卖得掉吗？",
        a: "有可能出售。能否再建筑以及活用的选项，会因面临道路的状况、与邻地的关系等个别情事而有所不同，因此先从确认现状开始。正因为是条件困难的房屋，关于推进方式的提案才更有价值，请在放弃之前先咨询。",
        links: [{ href: "/zh/souzoku", label: "继承不动产的咨询" }],
      },
      {
        q: "继承的空屋可以作为团体家屋使用吗？",
        a: "有可能成为活用的选项之一。不过，需要确认用途地域、居室面积、消防设备等与残障福祉服务指定标准相关的事项，且标准会因自治体与事业类型而有所不同。本公司承接以标准确认为前提的房屋活用咨询。",
        links: [{ href: "/zh/toushi/group-home", label: "寻找可作为团体家屋使用的房屋" }],
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
    path: "/souzoku/akiya",
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
  // 2026-07-21：faqJa 側のakiya設問リンクは本ページ（/souzoku/akiya）を指すよう更新済み（/faq からの内部リンク強化のため）。
  // 本ページ自身がその設問を表示する際は自己参照リンクになるため、当ページ分のみ除外する（q/aの文言・JSON-LDには影響しない＝linksは表示のみ）。
  const rawFaqItems: FaqItem[] = c.faq ?? pickFaqJa(JA_FAQ_QUESTIONS);
  const faqItems: FaqItem[] = rawFaqItems.map((item) => ({
    ...item,
    links: item.links?.filter((l) => l.href !== "/souzoku/akiya"),
  }));

  return (
    <RealestateServicePage
      path="/souzoku/akiya"
      answerBlock={c.answerBlock}
      crumbs={[
        { name: c.crumbs.home, href: "/" },
        { name: c.crumbs.souzoku, href: "/souzoku" },
        { name: c.crumbs.current },
      ]}
      serviceName={c.serviceName}
      heroSrc="/hero/realestate-group-home-16x9.webp"
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={
        <p>
          {c.lead.pre}
          <strong>{c.lead.strong1}</strong>
          {c.lead.mid}
          <strong>{c.lead.strong2}</strong>
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
      {/* ─── C-4 本文6セクション（2026-07-19浦松検収済み）／C-6-2で多言語化 ─── */}
      {/* §1 放置のリスク。根拠＝空家等対策の推進に関する特別措置法（平成26年法律第127号）。
          管理不全空家等への勧告＝令和5年法律第50号改正で導入・2023年12月13日施行（出典：国土交通省）。
          住宅用地特例からの除外＝地方税法349条の3の2（小規模住宅用地＝課税標準1/6も同条）。
          「最大6倍」＝1/6特例が外れた場合の理論上の上限＝「〜になる場合があります」に留める
          （中国語版も「有可能最多增加至6倍」＝条件付きを維持し、断定・誇張に振らない）。
          注記「指定・課税の詳細は文京区および税理士にご確認ください」は全ロケールで必須（タスク指定） */}
      <Section h2={c.s1.h2}>
        <P>{c.s1.p1}</P>
        <P>{c.s1.p2}</P>
        <p className="mt-3 text-xs text-text-muted">{c.s1.note}</p>
      </Section>

      {/* §2 出口の選択。判断軸4つ＋3つの出口＝/souzoku「3つの出口」と整合。制度事実の記述なし */}
      <Section h2={c.s2.h2}>
        <P>{c.s2.p}</P>
        <ul className="mt-4 space-y-3">
          {c.s2.axes.map((axis) => (
            <li
              key={axis.title}
              className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text"
            >
              <strong className="text-ink">{axis.title}</strong>
              <span className="mt-1 block">{axis.body}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {c.s2.exits.map((exit) => (
            <div
              key={exit.title}
              className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text"
            >
              <strong className="text-ink">{exit.title}</strong>
              <span className="mt-1 block">{exit.body}</span>
            </div>
          ))}
        </div>
        <P>{c.s2.closing}</P>
      </Section>

      {/* §3 3,000万円特別控除。根拠＝租税特別措置法35条3項（国税庁タックスアンサーNo.3306）。
          存在の紹介のみ＝要件の詳細（耐震・建築年・譲渡対価・適用期限等）は列挙しない（タスク指定）。
          留保水準＝faqJa「相続した空き家の売却で『3,000万円特別控除』は使えますか？」と同一。
          中国語版は日本の制度であることを明示（「日本制度之一」）＝中台の類似制度と混同されないため */}
      <Section h2={c.s3.h2}>
        <P>{c.s3.p1}</P>
        <P>{c.s3.p2}</P>
      </Section>

      {/* §4 条件の難しい物件。結果保証なし＝「売却の可否や条件をお約束するものではありませんが」を明示
          （中国語版も「無法保證出售的可否或條件」を維持） */}
      <Section h2={c.s4.h2}>
        <P>{c.s4.p1}</P>
        <P>{c.s4.p2}</P>
      </Section>

      {/* §5 グループホーム転用。group-homeページ§5（C-1）・faqJa「相続した空き家をグループホームに
          使えますか？」と同一趣旨・同一の留保。基準の具体値（7.43㎡等）はここに書かない（group-homeに委ねる）。
          リンク先 /toushi/group-home は zh-tw/zh 版が存在する（COPY保有）ため、ロケール接頭辞つきでリンクする
          （2026-07-19 浦松判断＝「（日本語ページ）」注記は付けない） */}
      <Section h2={c.s5.h2}>
        <P>{c.s5.p1}</P>
        <P>{c.s5.p2}</P>
        <p className="mt-2 text-sm">
          <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">
            {c.s5.linkLabel}
          </Link>
        </p>
      </Section>

      {/* §6 遠隔売却の流れ。分離受任の明示＝行政書士（別契約受任）・司法書士（提携紹介）。
          文言＝faqJa「遠方に住んでいても空き家を売却できますか？」と整合。
          リンク先 /global/chinese は C-6-1 で zh-tw/zh 版を公開＝ロケール接頭辞つきでリンクする。
          ※本ページの中国語版は C-6-1 とセット（またはその後）でのみ公開すること＝先行マージ禁止 */}
      <Section h2={c.s6.h2}>
        <P>{c.s6.p}</P>
        <ol className="mt-4 space-y-3">
          {c.s6.steps.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text"
            >
              <span
                aria-hidden
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-tint font-medium text-primary"
              >
                {i + 1}
              </span>
              <span>
                <strong className="text-ink">{step.title}</strong>
                <span className="mt-1 block">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <P>
          {c.s6.closingPre}
          <Link href={addLocalePrefix("/global/chinese", locale)} className="text-primary underline">
            {c.s6.closingLink}
          </Link>
          {c.s6.closingPost}
        </P>
      </Section>

      {/* 対応できないこと＝B-4共通コンポーネント（浦松確定文言・一字一句変更なし）。
          2026-07-19 C-6-2（浦松指示）：中国語版でも本表示を出す＝業際・分離受任・紹介料授受なし・
          社労士2026年9月開業予定の注記は中国語圏読者にこそ必要なコンプライアンス表示
          （CannotHandle.tsx 冒頭の方針と一致）。訳は同ファイルの確定訳をそのまま使う。 */}
      <CannotHandle bare locale={locale} />

      {/* FAQPage JSON-LD。ja の設問は faqJa 参照＝サイト内で文言一致。
          inLanguage は hreflang と同一マッピング（BCP47_BY_LOCALE） */}
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
