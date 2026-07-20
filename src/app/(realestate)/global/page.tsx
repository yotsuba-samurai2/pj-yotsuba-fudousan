// /global（型A・横断レイヤー）＝原稿_不動産 #5 →【統合ピラー格上げ】外国人の住まい×在留資格 完全ガイド
// クロスリンク＝C6（→/legal/services/visa）がpathで自動表示。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/access・/toushi/shataku・/souzoku）。既存の RealestateServicePage シェルを維持し、
//   ピラー本文（3つの壁・入口・住まい×在留の連動・当事者対応・その後の暮らし・現場の実感・チェックリスト・FAQ・関連クラスタ）を children として増築。
// en/zh-tw/zh=監修前ドラフト。既存の物件探し導線（s1〜s3・lead・answerBlock・internalLinks・crossLinks）は不変。
//   ピラー増築分の en/zh-tw/zh＝監修前ドラフト（2026-07-18）。繁体=台湾定訳（找房・簽證・保證公司・經營管理簽證・繼承）／zh=大陸表記。
// 在留資格＝visaページ既訳と統一：residence status (visa)／在留資格（簽證）／在留资格（签证）。
// 対応言語表記＝D2確定（2026-07-10）「日本語・英語・中国語（繁体字・簡体字）」系。jaの既存表示文言は一字一句不変。
// keywords＝ja固定（統合ピラー8語に更新：物件×在留資格の横断クラスタを反映）。
// FAQ＝faqItems を FAQJsonLd と <details> 表示の単一ソースに（souzoku/group-home 同型・ロケールごとに一致）。ページ内 FAQPage は1つのみ。
// gaikokujin-koyo（外国人雇用・労務）は sitemap 未掲載＝公開状態が不確実のため本文リンクせず、社労士2026年9月開業前として言及に留める。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { getColumns, getLocalizedColumn, filterColumnsByTheme } from "@/lib/columns";
import type { LangCode } from "@/config/languages";

// ─── B-4（2026-07-19浦松検収済み・日本語版のみ）─────────────────────────
// 冒頭の回答ブロック（H1直下・165字）。対応言語＝D2確定「日本語・英語・中国語（繁体字・簡体字）」を必須記載。
// 代表の駐在歴は既存leadに記載済みのため重複させない（国数表記は一切使わない）。
const JA_ANSWER_BLOCK =
  "日本で家を探す外国人の方を、四葉不動産株式会社が日本語・英語・中国語（繁体字・簡体字）でサポートします。文京区・茗荷谷を中心に、在留資格の確認や保証会社の利用など日本特有の手続きを整理し、入居審査から契約、重要事項説明の補足まで母語でご案内します。在留資格そのものの申請書類の作成は、併設の四葉行政書士事務所が別契約で受任します。";

type Wall = { title: string; body: string };
type Target = { title: string; body: string };
type FaqItem = { question: string; answer: string };
type RelatedPage = { href: string; label: string; description: string; external?: boolean };

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
  // ── ピラー増築分 ──
  wallsHeading: string;
  wallsLead: string;
  walls: Wall[];
  wallsClosing: string;
  targetsHeading: string;
  targets: Target[];
  setHeading: string;
  setBody: string[];
  nativeHeading: string;
  nativeBody: string[];
  journeyHeading: string;
  journeyBody: string[];
  fieldHeading: string;
  fieldBody: string[];
  fieldNote: string;
  checklistHeading: string;
  checklistLead: string;
  checklistItems: string[];
  faqHeading: string;
  faqItems: FaqItem[];
  relatedPagesHeading: string;
  relatedPages: RelatedPage[];
  generalNote: string;
  // ──
  relatedAria: string;
  relatedHeading: string;
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
};

const COPY: Record<LangCode, GlobalCopy> = {
  ja: {
    metaTitle: "東京で外国人が部屋を借りるなら｜住まいと在留資格をまとめて相談できる完全ガイド｜四葉不動産",
    metaDesc:
      "外国人の東京での部屋探しは、物件だけでなく在留資格・保証・言語の壁が同時に立ちはだかります。四葉は宅地建物取引業と行政書士（申請取次）の両方を持ち、代表が中国語（繁体字・簡体字）・英語で直接対応。お部屋探しから在留資格・会社設立・相続まで、一つの窓口でサポートします。文京区小日向・茗荷谷駅徒歩5分。",
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
      // C-3（2026-07-19）：中国語圏特化ハブ（ja先行公開のため ja のみリンク。多言語版はC-6で追加）
      { href: "/global/chinese", label: "中国語対応｜相続・売却・お部屋探し" },
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
        住まいの手続きは四葉不動産が、<strong>在留資格・会社設立の手続き</strong>は関連事業の四葉行政書士事務所が対応します。それぞれ別契約で受任します。ご相談の入口は共通です。
      </>
    ),
    s3H2: "繁体字（台湾・中華圏）のコンテンツはありますか？",
    s3Body: (locale) => (
      <>
        あります。台湾・中華圏の方向けの繁体字コラム（相続・投資・手続き）を公開しています。ページ右上の言語スイッチャーから繁體中文をお選びください →{" "}
        <Link href={addLocalePrefix("/column", locale)} className="text-primary underline">コラム一覧</Link>
      </>
    ),
    wallsHeading: "外国人の部屋探しに立ちはだかる3つの壁",
    wallsLead:
      "物件そのもの以外に、外国人の部屋探しには「在留資格」「保証・審査」「言語」という3つの壁が同時に立ちはだかります。多くの物件サイトはお部屋を見せてくれますが、この3つを一つの窓口でまとめて扱えるところは多くありません。",
    walls: [
      {
        title: "在留資格の壁",
        body:
          "契約や更新の場面では、在留資格の種類や在留期間が必ず問われます。住まいと在留は本来セットで見るべきもので、片方だけを進めると、あとで条件が合わずにやり直しになることがあります。",
      },
      {
        title: "保証・審査の壁",
        body:
          "保証会社の審査、緊急連絡先、勤務先や収入の説明——外国籍というだけで審査が通りにくく感じる場面があります。四葉は、審査で問われる点を先に整理し、貸主・保証会社への説明まで一緒に準備します。",
      },
      {
        title: "言語の壁",
        body:
          "重要事項説明や契約書は専門用語のかたまりです。母語で理解しないまま署名してしまうのは危険です。四葉は日本語・英語・中国語（繁体字・簡体字）で、内容を確認しながら進めます。",
      },
    ],
    wallsClosing:
      "物件ポータルサイトは、言語対応や物件情報までは踏み込めても、在留資格そのものの手続きは扱えません。有資格者（行政書士・申請取次）でなければ受任できないからです。四葉は、物件（宅地建物取引業）と在留資格（併設の四葉行政書士事務所）の両方を持ち、この3つを一つの窓口で見られます。",
    targetsHeading: "こんな方の入口になります",
    targets: [
      {
        title: "日本で働く・留学する方",
        body:
          "就労・留学の在留資格での住まい探しと、更新・変更などの在留手続きの入口を、母語でご案内します。",
      },
      {
        title: "外国人経営者・起業家の方",
        body:
          "住まいに加えて、経営管理ビザ・会社設立・事業用オフィスまで。事業実態のあるオフィスは在留資格の要件に直結します。",
      },
      {
        title: "外国人社員を受け入れる企業",
        body:
          "来日する社員・駐在員の住まい（社宅・法人賃貸）と、在留手続きの前提整理をまとめてご相談いただけます。",
      },
      {
        title: "台湾・中華圏から不動産を検討する方",
        body:
          "日本の不動産の購入・相続・投資のご相談に、繁体字で対応します。台湾側の窓口とも連携できます。",
      },
    ],
    setHeading: "住まいと在留資格は、なぜセットで見るべきか",
    setBody: [
      "在留資格の種類や在留期間によって、借りられる物件・契約条件・保証の通りやすさが変わります。住まいだけ、在留だけを別々に進めると、この連動が抜け落ちます。",
      "とくに経営管理の在留資格では、「事業実態のあるオフィス」が要件です。バーチャルオフィスや住所貸しだけでは足りない場合があり、物件選びがそのまま在留の可否に直結します。だからこそ、物件と在留資格を同じ窓口で見る意味があります。",
      "引っ越しや住所変更は、在留カードの住居地の届出など在留手続きにも関わります。窓口が分かれていると、この手続きが後手に回りがちです。",
    ],
    nativeHeading: "中国語・英語での、当事者としての対応",
    nativeBody: [
      "代表の浦松 丈二は、元毎日新聞中国総局長です。台湾師範大学で学び、中華圏に長く駐在して、中国語（繁体字・簡体字）で折衝してきた「当事者」です。",
      "台湾華語と大陸表現の違いにも配慮します。翻訳者を介さないから、契約や在留のニュアンスまで正確に伝わります。",
    ],
    journeyHeading: "お部屋探しから、その後の暮らしまで",
    journeyBody: [
      "四葉が伴走する範囲は、お部屋探しだけではありません。住まい → 在留資格 → 会社設立・経営管理ビザ → 将来の相続不動産まで、同じ窓口で続けてご相談いただけます。",
      "「日本に住む」の入口から、その後の人生の手続きまで。必要に応じて、併設の四葉行政書士事務所や提携する専門家と連携してお手伝いします（それぞれ別契約で、紹介料等の授受はありません）。",
      "企業の外国人雇用にともなう労務や助成金は、専門分野が分かれます。社会保険労務士業務は代表の開業（2026年9月予定）前のため、現時点では連携する専門家を一般的にご案内する形になります。",
    ],
    fieldHeading: "現場の実感——外国人対応も、丁寧な対話が最短ルート",
    fieldBody: [
      "保証会社・管理会社・入管は、それぞれ運用が微妙に違います。母語で相手の懐に入り、事情を一つずつ確認していく——記者として現場を歩いてきた姿勢が、ここで効きます。",
      "重要な確認は、メールだけでなく電話や対面でも行います。文化や制度の前提が違う相手ほど、顔の見える対話が誤解を防ぎます。急がば回れで、丁寧な対話がいちばんの近道になります。",
    ],
    fieldNote:
      "※個別の対応はご相談者の状況により異なります。実際にあった審査・在留の具体例は、順次このページでご紹介していきます。",
    checklistHeading: "お問い合わせ前のチェックリスト",
    checklistLead:
      "次の点をわかる範囲で教えていただけると、初回のご相談がスムーズです（不明な点は一緒に整理します）。",
    checklistItems: [
      "現在の在留資格の種類と、在留期間（満了日）",
      "希望エリア・入居時期・おおよその予算",
      "勤務先・学校・収入など、審査で説明が必要になりそうな事情",
      "緊急連絡先や、日本国内の連絡役になれる方の有無",
      "起業をお考えの場合は、事業内容と、オフィスの要否",
      "使いたい言語（日本語／英語／中国語 繁体字・簡体字）",
    ],
    faqHeading: "よくある質問",
    faqItems: [
      {
        question: "在留資格が「留学」でも部屋を借りられますか？",
        answer:
          "借りられます。留学の在留資格でも賃貸契約は可能で、多くの方が入居しています。ただし、保証会社の審査では在留期間や緊急連絡先、収入・仕送りの状況などが確認されます。四葉不動産は、審査で問われる点を先に整理し、貸主・保証会社への説明まで日本語・英語・中国語でサポートします。",
      },
      {
        question: "保証人がいなくても大丈夫ですか？",
        answer:
          "多くの場合、保証会社の利用で対応できます。日本では、個人の連帯保証人に代えて保証会社を使う契約が一般的です。緊急連絡先の準備など、外国籍の方がつまずきやすい点を先に整理し、審査が通りやすくなるよう一緒に準備します。",
      },
      {
        question: "契約書や重要事項説明を中国語・英語で説明してもらえますか？",
        answer:
          "対応します。ご契約前の重要事項説明の際に、英語・中国語（繁体字・簡体字）で内容を補足しながら進めます。専門用語が多い場面こそ、母語での確認が安心につながります。内容を十分にご理解いただいたうえで契約に進んでいただけます。",
      },
      {
        question: "経営管理ビザを取りたいのですが、オフィス探しも相談できますか？",
        answer:
          "できます。経営管理の在留資格は「事業実態のあるオフィス」が要件で、バーチャルオフィスや住所貸しだけでは足りない場合があります。四葉不動産が要件を見据えたオフィス・住まいの物件探しを、併設の四葉行政書士事務所が会社設立と在留資格申請を、それぞれ別契約で担当します。ご相談の入口は共通です。",
      },
      {
        question: "台湾から日本の不動産を買いたいのですが、対応できますか？",
        answer:
          "対応します。日本の不動産の購入・売却・相続・投資のご相談を、中国語（繁体字・簡体字）で承ります。海外在住の方はオンラインでのご相談に対応し、現地の確認は当社が行います。必要な書類や手続きはご状況（在住国・在留状況など）により異なるため、個別に確認しながら進めます。",
      },
      {
        question: "引っ越したら在留の手続きも必要ですか？",
        answer:
          "住居地が変わった場合、在留カードの住居地の届出など、在留に関わる手続きが必要になることがあります。住まいの変更と在留手続きは連動するため、窓口が一つだと抜け漏れを防げます。具体的な手続きは、併設の四葉行政書士事務所が別契約でご案内し、最新の取り扱いは入管・自治体の窓口でもご確認ください。",
      },
    ],
    relatedPagesHeading: "関連ページ・あわせてご覧ください",
    relatedPages: [
      {
        href: "/global/chinese",
        label: "中国語対応｜相続・売却・お部屋探し",
        description: "繁体字・簡体字での不動産サポートの詳細。台湾・中華圏の方向けの窓口です。",
      },
      {
        href: "/legal/services/visa",
        label: "在留資格・ビザ申請",
        description: "認定・変更・更新、永住・帰化のご相談。併設の四葉行政書士事務所（申請取次）が対応します。",
      },
      {
        href: "/legal/services/company",
        label: "会社設立・経営管理ビザ",
        description: "外国人の起業・会社設立と、経営管理の在留資格を一体で進めるご相談。",
      },
      {
        href: "/souzoku",
        label: "相続した不動産のこと",
        description: "日本で不動産を相続したときの、管理・活用・売却の完全ガイド。中国語でもご相談いただけます。",
      },
      {
        href: "https://taiwan.luck428.com",
        label: "台湾クロスボーダー（外部サイト）",
        description: "台湾から日本の不動産を検討する方向けの窓口。",
        external: true,
      },
    ],
    generalNote:
      "※本ページの制度・手続きに関する記載は、2026年7月時点の一般的な情報です。個別のご事情や最新の取り扱いは、入管・自治体・各窓口でご確認ください。在留資格そのものの申請書類の作成・手続きは、併設の四葉行政書士事務所が別契約で受任します（当社とは独立した事業体で、紹介料等の授受はありません）。",
    relatedAria: "関連リンク",
    relatedHeading: "このページの関連リンク",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
  },
  en: {
    metaTitle:
      "Renting an Apartment in Tokyo as a Foreign Resident | Home + Residence Status in One Place | 四葉不動産 (Yotsuba Real Estate)",
    metaDesc:
      "For foreign residents, house hunting in Tokyo means facing not just the property but three walls at once — residence status, guarantor screening, and language. Yotsuba holds both a real estate brokerage license and gyoseishoshi (administrative scrivener) practice, and our representative responds directly in Traditional Chinese, Simplified Chinese, and English. From your home search to residence status, company formation, and inheritance, we support you through one window. In Kohinata, Bunkyo — a 5-minute walk from Myogadani Station.",
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
        Housing procedures are handled by Yotsuba Real Estate, and <strong>residence status (visa) and company formation procedures</strong> by our affiliated business, Yotsuba Gyoseishoshi Office. Each is engaged under a separate contract. Your first inquiry can start in one place.
      </>
    ),
    s3H2: "Do you have content in Traditional Chinese (Taiwan / Chinese-speaking regions)?",
    s3Body: (locale) => (
      <>
        Yes. We publish columns in Traditional Chinese for readers in Taiwan and Chinese-speaking regions (inheritance, investment, and procedures). Please choose 繁體中文 from the language switcher at the top right of the page →{" "}
        <Link href={addLocalePrefix("/column", locale)} className="text-primary underline">Column list</Link>
      </>
    ),
    wallsHeading: "Three walls that stand in the way of a foreign resident's home search",
    wallsLead:
      "Beyond the property itself, a foreign resident's home search faces three walls at once — residence status, guarantor screening, and language. Many property sites will show you rooms, but few can handle all three at a single window.",
    walls: [
      {
        title: "The residence status wall",
        body:
          "At the contract and renewal stages, the type of residence status (visa) and the period of stay are always asked about. Housing and residence status are meant to be looked at together; proceeding with only one can mean redoing things later when the conditions do not line up.",
      },
      {
        title: "The guarantor / screening wall",
        body:
          "Guarantor-company screening, emergency contacts, explanations of your employer and income — there are moments where being a foreign national alone makes screening feel harder to pass. Yotsuba sorts out in advance what the screening will ask, and prepares the explanations to landlords and guarantor companies with you.",
      },
      {
        title: "The language wall",
        body:
          "The explanation of important matters (juyo jiko setsumei) and the contract are dense with technical terms. Signing without understanding them in your own language is risky. Yotsuba goes through the content with you in Japanese, English, Traditional Chinese, and Simplified Chinese.",
      },
    ],
    wallsClosing:
      "Property portal sites can go as far as language support and listings, but they cannot handle the residence status procedure itself — only a qualified professional (a gyoseishoshi certified as an application agent) can take that on. Yotsuba holds both the property side (real estate brokerage) and the residence-status side (our affiliated Yotsuba Gyoseishoshi Office), so all three walls can be seen at one window.",
    targetsHeading: "This can be your starting point if you are…",
    targets: [
      {
        title: "Working or studying in Japan",
        body:
          "We guide you in your own language, both for finding a home under a work or student residence status and for the entry point to residence procedures such as renewals and changes.",
      },
      {
        title: "A foreign business owner or entrepreneur",
        body:
          "Beyond housing: the Business Manager visa, company formation, and a business office. An office with genuine business substance is directly tied to the residence-status requirements.",
      },
      {
        title: "A company welcoming foreign employees",
        body:
          "You can consult us together about housing for arriving employees and expatriates (company housing / corporate leasing) and about organizing the groundwork for their residence procedures.",
      },
      {
        title: "Considering Japanese real estate from Taiwan / Chinese-speaking regions",
        body:
          "We handle consultations on purchasing, inheriting, and investing in Japanese real estate in Traditional Chinese, and can coordinate with a contact on the Taiwan side.",
      },
    ],
    setHeading: "Why housing and residence status should be looked at together",
    setBody: [
      "The type of residence status and the period of stay change which properties you can rent, the contract conditions, and how easily the guarantor screening passes. Proceeding with housing alone, or residence status alone, lets this linkage slip through the cracks.",
      "For the Business Manager residence status in particular, an office with genuine business substance is a requirement. A virtual office or a mere registered address may not be enough, so the choice of property is directly tied to whether the residence status is granted. That is exactly why it makes sense to look at property and residence status at the same window.",
      "Moving and changing your address also affect residence procedures, such as reporting your place of residence for your residence card. When the windows are separate, this procedure tends to fall behind.",
    ],
    nativeHeading: "Chinese and English support, as someone who has been there",
    nativeBody: [
      "Our representative, Joji Uramatsu, is the former China General Bureau Chief of the Mainichi Shimbun. He studied at National Taiwan Normal University and was stationed in Chinese-speaking regions for years, negotiating in Chinese (Traditional and Simplified) — as someone who has been there himself.",
      "We are also mindful of the differences between Taiwanese Mandarin and Mainland usage. Because there is no interpreter in between, even the nuances of the contract and of residence matters come across accurately.",
    ],
    journeyHeading: "From your home search to the life that follows",
    journeyBody: [
      "What Yotsuba walks with you through is not only the home search. From housing → residence status → company formation and the Business Manager visa → future inherited real estate, you can keep consulting the same window.",
      "From the entry point of 'living in Japan' to the procedures for the rest of your life. Where needed, we help in coordination with our affiliated Yotsuba Gyoseishoshi Office and partner professionals (each under a separate contract, with no referral fees exchanged).",
      "Labor matters and subsidies related to a company's employment of foreign staff fall into a separate specialty. Because licensed social insurance and labor consultant (shakai hoken romushi) work is before our representative's office opening (scheduled for September 2026), for now we introduce partner professionals in general terms.",
    ],
    fieldHeading: "What the field teaches — even here, careful dialogue is the shortest route",
    fieldBody: [
      "Guarantor companies, management companies, and the Immigration Bureau each operate a little differently. Getting close to the other side in their own language and checking each circumstance one by one — the stance of a reporter who has walked the field pays off here.",
      "Important confirmations are done not only by email but also by phone and in person. The more the cultural and institutional assumptions differ, the more face-to-face dialogue prevents misunderstanding. More haste, less speed: careful dialogue is the surest shortcut.",
    ],
    fieldNote:
      "Note: Individual handling differs depending on your situation. Concrete examples of actual screening and residence cases will be added to this page over time.",
    checklistHeading: "A checklist before you get in touch",
    checklistLead:
      "Telling us the following as far as you know makes the first consultation smoother (we will sort out anything unclear together).",
    checklistItems: [
      "Your current type of residence status and its period of stay (expiry date)",
      "Preferred area, move-in timing, and a rough budget",
      "Circumstances that may need explaining in screening — employer, school, income, and so on",
      "Whether you have an emergency contact or someone in Japan who can act as a point of contact",
      "If you are considering starting a business: the nature of the business and whether an office is needed",
      "The language you would like to use (Japanese / English / Traditional or Simplified Chinese)",
    ],
    faqHeading: "Frequently asked questions",
    faqItems: [
      {
        question: "Can I rent an apartment even if my residence status is 'Student'?",
        answer:
          "Yes, you can. A lease is possible on a Student residence status, and many people do move in. That said, guarantor-company screening checks things like your period of stay, emergency contacts, and your income or remittance situation. Yotsuba Real Estate sorts out in advance what the screening will ask, and supports you through the explanations to landlords and guarantor companies in Japanese, English, and Chinese.",
      },
      {
        question: "Is it all right if I don't have a guarantor?",
        answer:
          "In most cases, this can be handled by using a guarantor company. In Japan, contracts that use a guarantor company in place of an individual joint guarantor are common. We sort out in advance the points where foreign nationals tend to stumble, such as preparing an emergency contact, and prepare with you so the screening is more likely to pass.",
      },
      {
        question: "Can you explain the contract and the important-matters explanation in Chinese or English?",
        answer:
          "Yes. At the important-matters explanation (juyo jiko setsumei) before signing, we proceed while supplementing the content in English and Chinese (Traditional and Simplified). It is precisely in scenes full of technical terms that confirming in your own language brings peace of mind. You can move to signing only after you fully understand the content.",
      },
      {
        question: "I want to get a Business Manager visa — can I also consult about finding an office?",
        answer:
          "Yes. The Business Manager residence status requires an office with genuine business substance, and a virtual office or a mere registered address may not be enough. Yotsuba Real Estate handles the search for an office and home that anticipate the requirements, while our affiliated Yotsuba Gyoseishoshi Office handles company formation and the residence-status application — each under a separate contract. Your first inquiry can start in one place.",
      },
      {
        question: "I'd like to buy real estate in Japan from Taiwan — can you help?",
        answer:
          "Yes. We handle consultations on purchasing, selling, inheriting, and investing in Japanese real estate in Chinese (Traditional and Simplified). For those living overseas, we support online consultations, and we carry out the on-site checks ourselves. Because the necessary documents and procedures differ depending on your situation (country of residence, residence status, and so on), we proceed while confirming each point individually.",
      },
      {
        question: "If I move, do I also need residence procedures?",
        answer:
          "When your place of residence changes, residence-related procedures such as reporting the new address on your residence card may be required. Because a change of home and residence procedures are linked, a single window helps prevent things from slipping through. The specific procedures are guided by our affiliated Yotsuba Gyoseishoshi Office under a separate contract, and the latest handling should also be confirmed at the Immigration Bureau or your local government office.",
      },
    ],
    relatedPagesHeading: "Related pages you may also want to see",
    relatedPages: [
      {
        href: "/legal/services/visa",
        label: "Visa & Residence Status Applications",
        description:
          "Certification, change, and renewal, plus permanent residency and naturalization. Handled by our affiliated Yotsuba Gyoseishoshi Office (application agent).",
      },
      {
        href: "/legal/services/company",
        label: "Company Formation & the Business Manager Visa",
        description:
          "Consultations that move foreign entrepreneurship and company formation together with the Business Manager residence status.",
      },
      {
        href: "/souzoku",
        label: "About inherited real estate",
        description:
          "A complete guide to managing, utilizing, or selling when you inherit real estate in Japan. Available in Chinese too.",
      },
      {
        href: "https://taiwan.luck428.com",
        label: "Taiwan cross-border (external site)",
        description: "A window for those considering Japanese real estate from Taiwan.",
        external: true,
      },
    ],
    generalNote:
      "Note: The descriptions of systems and procedures on this page are general information as of July 2026. Please confirm individual circumstances and the latest handling at the Immigration Bureau, your local government, or the relevant window. Preparation of the residence-status application documents and the procedures themselves are engaged by our affiliated Yotsuba Gyoseishoshi Office under a separate contract (a separate, independent business, with no referral fees exchanged).",
    relatedAria: "Related links",
    relatedHeading: "Related links on this page",
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time Licensed Real Estate Transaction Specialist (宅地建物取引士); Gyoseishoshi (Administrative Scrivener). Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
  },
  "zh-tw": {
    metaTitle: "外國人在東京租房｜住居與在留資格一次諮詢的完全指南｜四葉不動産",
    metaDesc:
      "外國人在東京找房，面對的不只是物件，還有在留資格（簽證）・保證・語言3道牆同時擋在面前。四葉同時擁有宅地建物取引業與行政書士（申請取次），代表能以中文（繁體・簡體）・英文直接對應。從找房到在留資格・公司設立・繼承，於同一窗口為您支援。文京區小日向・距茗荷谷站步行5分鐘。",
    crumbHome: "首頁",
    crumbCurrent: "外國人・多語言找房",
    serviceName: "外國人・多語言找房服務",
    heroAlt: "外國人・多語言找房的示意圖（來自不同國家的住戶）",
    h1: "外國人・多語言找房",
    lead: (
      <p>
        外國人在日本找房，<strong>由四葉不動産株式会社以母語提供支援</strong>。對應語言為日語・英語・中文（繁體・簡體）。從入住審查・保證公司・簽約到入住後的手續，一項一項與您一起進行。代表浦松 丈二曾任每日新聞中國總局長、曾派駐中國、台灣、泰國，有過「在國外找房的一方」的親身經驗。所以，我們明白您會擔心什麼。
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
        住居相關手續由四葉不動産對應，<strong>在留資格（簽證）・公司設立的手續</strong>則由關聯事業・四葉行政書士事務所對應。各自另行簽訂契約承辦。諮詢的入口是共同的。
      </>
    ),
    s3H2: "有繁體字（台灣・中華圈）的內容嗎？",
    s3Body: (locale) => (
      <>
        有的。我們公開面向台灣・中華圈讀者的繁體字專欄（繼承・投資・手續）。請從頁面右上方的語言切換選單選擇繁體中文 →{" "}
        <Link href={addLocalePrefix("/column", locale)} className="text-primary underline">專欄一覽</Link>
      </>
    ),
    wallsHeading: "擋在外國人找房前的3道牆",
    wallsLead:
      "除了物件本身，外國人找房還會同時面對「在留資格（簽證）」「保證・審查」「語言」這3道牆。許多物件網站能為您介紹房子，但能在同一窗口一併處理這3項的地方並不多。",
    walls: [
      {
        title: "在留資格（簽證）之牆",
        body:
          "在簽約與更新的場合，一定會被詢問在留資格（簽證）的種類與在留期間。住居與在留本應成套來看，若只推進其中一項，之後可能因條件不合而必須重來。",
      },
      {
        title: "保證・審查之牆",
        body:
          "保證公司的審查、緊急聯絡人、工作單位與收入的說明——僅因為是外國籍，就會有審查感覺較難通過的場合。四葉會先整理審查會問到的重點，並連同向房東・保證公司的說明一起與您準備。",
      },
      {
        title: "語言之牆",
        body:
          "重要事項說明與契約書是專業用語的集合體。在未以母語理解的情況下就簽名，是有風險的。四葉會以日語・英語・中文（繁體・簡體），一邊確認內容一邊與您進行。",
      },
    ],
    wallsClosing:
      "物件入口網站即使能做到語言對應與物件資訊，也無法處理在留資格（簽證）本身的手續——因為那必須由具資格者（行政書士・申請取次）才能承辦。四葉同時擁有物件端（宅地建物取引業）與在留資格端（併設的四葉行政書士事務所），能在同一窗口看見這3道牆。",
    targetsHeading: "這些情況都能作為您的入口",
    targets: [
      {
        title: "在日本工作・留學的人",
        body:
          "以工作・留學的在留資格找房，以及更新・變更等在留手續的入口，皆以母語為您說明。",
      },
      {
        title: "外國人經營者・創業者",
        body:
          "除了住居，還包含經營管理簽證・公司設立・事業用辦公室。具事業實態的辦公室與在留資格的要件直接相關。",
      },
      {
        title: "接納外國員工的企業",
        body:
          "來日員工・駐在員的住居（員工宿舍・法人租賃），以及在留手續的前提整理，都能一併諮詢。",
      },
      {
        title: "從台灣・中華圈考慮日本不動產的人",
        body:
          "日本不動產的購買・繼承・投資諮詢，以繁體中文對應。也能與台灣端的窗口聯手。",
      },
    ],
    setHeading: "住居與在留資格，為何應該成套來看",
    setBody: [
      "在留資格的種類與在留期間，會改變能租的物件・簽約條件・保證是否容易通過。若把住居、在留分開各自推進，這種連動就會被漏掉。",
      "尤其是經營管理的在留資格，以「具事業實態的辦公室」為要件。僅有虛擬辦公室或掛址可能不足，物件的選擇會直接關係到在留能否核准。正因如此，於同一窗口同時看物件與在留資格才有意義。",
      "搬家與地址變更，也牽涉到在留卡的居住地申報等在留手續。窗口分開時，這道手續往往會慢半拍。",
    ],
    nativeHeading: "以中文・英文，作為當事人的對應",
    nativeBody: [
      "代表浦松 丈二曾任每日新聞中國總局長。曾於台灣師範大學求學、長年旅居中華圈，是以中文（繁體・簡體）折衝過的「當事人」。",
      "也會顧及台灣華語與大陸表達的差異。因為不透過翻譯者，契約與在留的細微語感都能正確傳達。",
    ],
    journeyHeading: "從找房，到之後的生活",
    journeyBody: [
      "四葉陪伴的範圍不只是找房。住居 → 在留資格 → 公司設立・經營管理簽證 → 未來的繼承不動產，都能在同一窗口持續諮詢。",
      "從「在日本生活」的入口，到之後人生的手續。必要時，將與併設的四葉行政書士事務所及合作的專業人士聯手協助（各自另行簽約，不收受介紹費等）。",
      "企業因僱用外國人而衍生的勞務與補助金，屬於不同的專業領域。社會保險勞務士業務在代表開業（預定2026年9月）之前，現階段將以一般性介紹合作專業人士的方式對應。",
    ],
    fieldHeading: "現場的體會——外國人對應，細緻的對話也是最短路徑",
    fieldBody: [
      "保證公司・管理公司・入管，各自的運作都略有不同。以母語走進對方的立場、一項一項確認情況——身為走過現場的記者所培養的姿態，在這裡發揮作用。",
      "重要的確認，不只用電子郵件，也會透過電話與當面進行。文化與制度前提越是不同的對象，看得見臉的對話越能防止誤解。欲速則不達，細緻的對話才是最可靠的捷徑。",
    ],
    fieldNote:
      "※個別對應會因諮詢者的狀況而異。實際發生過的審查・在留具體案例，將於本頁陸續介紹。",
    checklistHeading: "諮詢前的檢查清單",
    checklistLead:
      "若能在您了解的範圍內告訴我們以下事項，初次諮詢會更順利（不清楚的部分我們會一起整理）。",
    checklistItems: [
      "目前的在留資格（簽證）種類，與在留期間（到期日）",
      "希望的區域・入住時期・大致的預算",
      "工作單位・學校・收入等，審查時可能需要說明的情況",
      "是否有緊急聯絡人、或能在日本國內擔任聯絡角色的人",
      "若考慮創業，事業內容與是否需要辦公室",
      "想使用的語言（日語／英語／中文 繁體・簡體）",
    ],
    faqHeading: "常見問題",
    faqItems: [
      {
        question: "在留資格（簽證）是「留學」也能租到房子嗎？",
        answer:
          "可以租到。以留學的在留資格也能簽訂租賃契約，許多人都順利入住。不過，保證公司的審查會確認在留期間、緊急聯絡人，以及收入・匯款等情況。四葉不動産會先整理審查會問到的重點，並以日語・英語・中文，連同向房東・保證公司的說明一起提供支援。",
      },
      {
        question: "沒有保證人也沒關係嗎？",
        answer:
          "多數情況下，可透過使用保證公司來對應。在日本，以保證公司代替個人連帶保證人的契約十分普遍。我們會先整理外國籍者容易卡關的重點（例如準備緊急聯絡人），並與您一起準備，讓審查更容易通過。",
      },
      {
        question: "契約書與重要事項說明，可以用中文・英文說明嗎？",
        answer:
          "可以。在簽約前的重要事項說明時，我們會以英語・中文（繁體・簡體）補充內容並與您一起進行。正是在專業用語繁多的場合，以母語確認才更令人安心。在您充分理解內容之後，才進入簽約。",
      },
      {
        question: "我想取得經營管理簽證，也能諮詢找辦公室嗎？",
        answer:
          "可以。經營管理的在留資格以「具事業實態的辦公室」為要件，僅有虛擬辦公室或掛址可能不足。由四葉不動産負責預先納入要件的辦公室・住居物件尋找，由併設的四葉行政書士事務所負責公司設立與在留資格申請，各自另行簽約。諮詢的入口是共同的。",
      },
      {
        question: "我想從台灣購買日本的不動產，能對應嗎？",
        answer:
          "能對應。日本不動產的購買・出售・繼承・投資諮詢，皆以中文（繁體・簡體）承辦。旅居海外者可透過線上諮詢，現場確認由本公司進行。所需文件與手續會因您的狀況（居住國・在留狀況等）而異，因此會一邊個別確認一邊進行。",
      },
      {
        question: "搬家後也需要辦理在留手續嗎？",
        answer:
          "居住地變更時，可能需要辦理在留卡的居住地申報等與在留相關的手續。由於住居的變更與在留手續相互連動，窗口統一為一個能防止疏漏。具體手續由併設的四葉行政書士事務所另行簽約為您說明，最新的處理方式也請向入管・自治體的窗口確認。",
      },
    ],
    relatedPagesHeading: "相關頁面・建議一併閱覽",
    relatedPages: [
      {
        href: "/global/chinese",
        label: "中文對應｜繼承・出售・找房",
        description: "以繁體・簡體提供不動產支援的詳細內容。是為台灣・中華圈讀者設置的窗口。",
      },
      {
        href: "/legal/services/visa",
        label: "在留資格（簽證）申請",
        description: "認定・變更・更新，以及永住・歸化的諮詢。由併設的四葉行政書士事務所（申請取次）對應。",
      },
      {
        href: "/legal/services/company",
        label: "公司設立・經營管理簽證",
        description: "將外國人創業・公司設立與經營管理的在留資格一體推進的諮詢。",
      },
      {
        href: "/souzoku",
        label: "關於繼承的不動產",
        description: "在日本繼承不動產時，管理・活用・出售的完全指南。也可用中文諮詢。",
      },
      {
        href: "https://taiwan.luck428.com",
        label: "台灣跨境（外部網站）",
        description: "為從台灣考慮日本不動產的人設置的窗口。",
        external: true,
      },
    ],
    generalNote:
      "※本頁關於制度・手續的記載，為2026年7月時點的一般性資訊。個別情況與最新處理方式，請向入管・自治體・各窗口確認。在留資格（簽證）本身的申請文件製作與手續，由併設的四葉行政書士事務所另行簽約承辦（與本公司為各自獨立的事業體，不收受介紹費等）。",
    relatedAria: "相關連結",
    relatedHeading: "本頁相關連結",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士。行政書士。曾任每日新聞中國總局長（記者資歷34年）・曾派駐中國、台灣、泰國。已通過社會保險勞務士考試（預定2026年9月開業）。",
  },
  zh: {
    metaTitle: "外国人在东京租房｜住房与在留资格一次咨询的完全指南｜四葉不動産",
    metaDesc:
      "外国人在东京找房，面对的不只是房源，还有在留资格（签证）・保证・语言3道墙同时挡在面前。四葉同时拥有宅地建物取引业与行政书士（申请取次），代表能以中文（繁体・简体）・英文直接对应。从找房到在留资格・公司设立・继承，在同一窗口为您支援。文京区小日向・距茗荷谷站步行5分钟。",
    crumbHome: "首页",
    crumbCurrent: "外国人・多语言找房",
    serviceName: "外国人・多语言找房服务",
    heroAlt: "外国人・多语言找房的示意图（来自不同国家的住户）",
    h1: "外国人・多语言找房",
    lead: (
      <p>
        外国人在日本找房，<strong>由四葉不動産株式会社以母语提供支持</strong>。对应语言为日语・英语・中文（繁体・简体）。从入住审查・保证公司・签约到入住后的手续，一项一项与您一起进行。代表浦松 丈二曾任每日新闻中国总局长、曾派驻中国、台湾、泰国，有过“在国外找房的一方”的亲身经历。所以，我们明白您会担心什么。
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
        住房相关手续由四葉不動産办理，<strong>在留资格（签证）・公司设立的手续</strong>则由关联事业・四葉行政書士事務所办理。各自另行签订合同承办。咨询的入口是共同的。
      </>
    ),
    s3H2: "有繁体字（台湾・中华圈）的内容吗？",
    s3Body: (locale) => (
      <>
        有的。我们公开面向台湾・中华圈读者的繁体字专栏（继承・投资・手续）。请从页面右上方的语言切换菜单选择繁體中文 →{" "}
        <Link href={addLocalePrefix("/column", locale)} className="text-primary underline">专栏一览</Link>
      </>
    ),
    wallsHeading: "挡在外国人找房前的3道墙",
    wallsLead:
      "除了房源本身，外国人找房还会同时面对“在留资格（签证）”“保证・审查”“语言”这3道墙。许多房产网站能为您介绍房子，但能在同一窗口一并处理这3项的地方并不多。",
    walls: [
      {
        title: "在留资格（签证）之墙",
        body:
          "在签约与更新的场合，一定会被询问在留资格（签证）的种类与在留期间。住房与在留本应成套来看，若只推进其中一项，之后可能因条件不合而必须重来。",
      },
      {
        title: "保证・审查之墙",
        body:
          "保证公司的审查、紧急联系人、工作单位与收入的说明——仅因为是外国籍，就会有审查感觉较难通过的场合。四葉会先整理审查会问到的重点，并连同向房东・保证公司的说明一起与您准备。",
      },
      {
        title: "语言之墙",
        body:
          "重要事项说明与合同书是专业用语的集合体。在未以母语理解的情况下就签名，是有风险的。四葉会以日语・英语・中文（繁体・简体），一边确认内容一边与您进行。",
      },
    ],
    wallsClosing:
      "房产门户网站即使能做到语言对应与房源信息，也无法处理在留资格（签证）本身的手续——因为那必须由具资格者（行政书士・申请取次）才能承办。四葉同时拥有房源端（宅地建物取引业）与在留资格端（併设的四葉行政書士事務所），能在同一窗口看见这3道墙。",
    targetsHeading: "这些情况都能作为您的入口",
    targets: [
      {
        title: "在日本工作・留学的人",
        body:
          "以工作・留学的在留资格找房，以及更新・变更等在留手续的入口，均以母语为您说明。",
      },
      {
        title: "外国人经营者・创业者",
        body:
          "除了住房，还包含经营管理签证・公司设立・事业用办公室。具事业实态的办公室与在留资格的要件直接相关。",
      },
      {
        title: "接纳外国员工的企业",
        body:
          "来日员工・驻在员的住房（员工宿舍・企业租赁），以及在留手续的前提梳理，都能一并咨询。",
      },
      {
        title: "从台湾・中华圈考虑日本不动产的人",
        body:
          "日本不动产的购买・继承・投资咨询，以繁体中文对应。也能与台湾端的窗口协作。",
      },
    ],
    setHeading: "住房与在留资格，为何应该成套来看",
    setBody: [
      "在留资格的种类与在留期间，会改变能租的房源・签约条件・保证是否容易通过。若把住房、在留分开各自推进，这种连动就会被漏掉。",
      "尤其是经营管理的在留资格，以“具事业实态的办公室”为要件。仅有虚拟办公室或挂靠地址可能不足，房源的选择会直接关系到在留能否获批。正因如此，在同一窗口同时看房源与在留资格才有意义。",
      "搬家与地址变更，也牵涉到在留卡的居住地申报等在留手续。窗口分开时，这道手续往往会慢半拍。",
    ],
    nativeHeading: "以中文・英文，作为当事人的对应",
    nativeBody: [
      "代表浦松 丈二曾任每日新闻中国总局长。曾于台湾师范大学求学、长年旅居中华圈，是以中文（繁体・简体）折冲过的“当事人”。",
      "也会顾及台湾华语与大陆表达的差异。因为不通过翻译者，合同与在留的细微语感都能准确传达。",
    ],
    journeyHeading: "从找房，到之后的生活",
    journeyBody: [
      "四葉陪伴的范围不只是找房。住房 → 在留资格 → 公司设立・经营管理签证 → 未来的继承不动产，都能在同一窗口持续咨询。",
      "从“在日本生活”的入口，到之后人生的手续。必要时，将与併设的四葉行政書士事務所及合作的专业人士协作提供协助（各自另行签约，不收受介绍费等）。",
      "企业因雇用外国人而产生的劳务与补助金，属于不同的专业领域。社会保险劳务士业务在代表开业（预定2026年9月）之前，现阶段将以一般性介绍合作专业人士的方式对应。",
    ],
    fieldHeading: "现场的体会——外国人对应，细致的对话也是最短路径",
    fieldBody: [
      "保证公司・管理公司・入管，各自的运作都略有不同。以母语走进对方的立场、一项一项确认情况——身为走过现场的记者所培养的姿态，在这里发挥作用。",
      "重要的确认，不只用电子邮件，也会通过电话与当面进行。文化与制度前提越是不同的对象，看得见脸的对话越能防止误解。欲速则不达，细致的对话才是最可靠的捷径。",
    ],
    fieldNote:
      "※个别对应会因咨询者的状况而异。实际发生过的审查・在留具体案例，将于本页陆续介绍。",
    checklistHeading: "咨询前的检查清单",
    checklistLead:
      "若能在您了解的范围内告诉我们以下事项，初次咨询会更顺利（不清楚的部分我们会一起梳理）。",
    checklistItems: [
      "目前的在留资格（签证）种类，与在留期间（到期日）",
      "希望的区域・入住时期・大致的预算",
      "工作单位・学校・收入等，审查时可能需要说明的情况",
      "是否有紧急联系人、或能在日本国内担任联络角色的人",
      "若考虑创业，事业内容与是否需要办公室",
      "想使用的语言（日语／英语／中文 繁体・简体）",
    ],
    faqHeading: "常见问题",
    faqItems: [
      {
        question: "在留资格（签证）是“留学”也能租到房子吗？",
        answer:
          "可以租到。以留学的在留资格也能签订租赁合同，许多人都顺利入住。不过，保证公司的审查会确认在留期间、紧急联系人，以及收入・汇款等情况。四葉不動産会先整理审查会问到的重点，并以日语・英语・中文，连同向房东・保证公司的说明一起提供支持。",
      },
      {
        question: "没有保证人也没关系吗？",
        answer:
          "多数情况下，可通过使用保证公司来对应。在日本，以保证公司代替个人连带保证人的合同十分普遍。我们会先梳理外国籍者容易卡关的重点（例如准备紧急联系人），并与您一起准备，让审查更容易通过。",
      },
      {
        question: "合同书与重要事项说明，可以用中文・英文说明吗？",
        answer:
          "可以。在签约前的重要事项说明时，我们会以英语・中文（繁体・简体）补充内容并与您一起进行。正是在专业用语繁多的场合，以母语确认才更令人安心。在您充分理解内容之后，才进入签约。",
      },
      {
        question: "我想取得经营管理签证，也能咨询找办公室吗？",
        answer:
          "可以。经营管理的在留资格以“具事业实态的办公室”为要件，仅有虚拟办公室或挂靠地址可能不足。由四葉不動産负责预先纳入要件的办公室・住房房源寻找，由併设的四葉行政書士事務所负责公司设立与在留资格申请，各自另行签约。咨询的入口是共同的。",
      },
      {
        question: "我想从台湾购买日本的不动产，能对应吗？",
        answer:
          "能对应。日本不动产的购买・出售・继承・投资咨询，均以中文（繁体・简体）承办。旅居海外者可通过线上咨询，现场确认由本公司进行。所需文件与手续会因您的状况（居住国・在留状况等）而异，因此会一边个别确认一边进行。",
      },
      {
        question: "搬家后也需要办理在留手续吗？",
        answer:
          "居住地变更时，可能需要办理在留卡的居住地申报等与在留相关的手续。由于住房的变更与在留手续相互连动，窗口统一为一个能防止疏漏。具体手续由併设的四葉行政書士事務所另行签约为您说明，最新的处理方式也请向入管・自治体的窗口确认。",
      },
    ],
    relatedPagesHeading: "相关页面・建议一并浏览",
    relatedPages: [
      {
        href: "/global/chinese",
        label: "中文对应｜继承・出售・找房",
        description: "以繁体・简体提供不动产支持的详细内容。是为台湾・中华圈读者设置的窗口。",
      },
      {
        href: "/legal/services/visa",
        label: "在留资格（签证）申请",
        description: "认定・变更・更新，以及永住・归化的咨询。由併设的四葉行政書士事務所（申请取次）对应。",
      },
      {
        href: "/legal/services/company",
        label: "公司设立・经营管理签证",
        description: "将外国人创业・公司设立与经营管理的在留资格一体推进的咨询。",
      },
      {
        href: "/souzoku",
        label: "关于继承的不动产",
        description: "在日本继承不动产时，管理・活用・出售的完全指南。也可用中文咨询。",
      },
      {
        href: "https://taiwan.luck428.com",
        label: "台湾跨境（外部网站）",
        description: "为从台湾考虑日本不动产的人设置的窗口。",
        external: true,
      },
    ],
    generalNote:
      "※本页关于制度・手续的记载，为2026年7月时点的一般性信息。个别情况与最新处理方式，请向入管・自治体・各窗口确认。在留资格（签证）本身的申请文件制作与手续，由併设的四葉行政書士事務所另行签约承办（与本公司为各自独立的事业体，不收受介绍费等）。",
    relatedAria: "相关链接",
    relatedHeading: "本页相关链接",
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
    path: "/global",
    // keywords＝ja固定（統合ピラー：物件×在留資格の横断クラスタを反映）
    keywords: [
      "外国人 部屋探し 東京",
      "外国人 賃貸 在留資格",
      "中国語 対応 不動産",
      "外国人 保証人 部屋",
      "経営管理ビザ 住居",
      "外国人 起業 東京",
      "台湾 日本 不動産",
      "外国人 相続 不動産",
    ],
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
      {/* ─── 既存の物件探し導線（回答ファースト Q&A・不変） ─── */}
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

      {/* ─── ピラー増築：3つの壁（独自性の核） ─── */}
      <div>
        <ReH2>{c.wallsHeading}</ReH2>
        <p className="mt-3 leading-relaxed text-text">{c.wallsLead}</p>
        <div className="mt-4 space-y-3">
          {c.walls.map((w) => (
            <div key={w.title} className="rounded-xl border border-border bg-surface p-4">
              <h3 className="text-sm font-bold text-ink">{w.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">{w.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 leading-relaxed text-text">{c.wallsClosing}</p>
      </div>

      {/* ─── ターゲット別の入口 ─── */}
      <div>
        <ReH2>{c.targetsHeading}</ReH2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {c.targets.map((t) => (
            <div key={t.title} className="rounded-xl border border-border bg-surface p-4">
              <h3 className="text-sm font-bold text-ink">{t.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 住まいと在留資格をセットで見る理由 ─── */}
      <div>
        <ReH2>{c.setHeading}</ReH2>
        <div className="mt-3 space-y-3">
          {c.setBody.map((p) => (
            <p key={p} className="leading-relaxed text-text">{p}</p>
          ))}
        </div>
      </div>

      {/* ─── 中国語・英語での当事者対応 ─── */}
      <div>
        <ReH2>{c.nativeHeading}</ReH2>
        <div className="mt-3 space-y-3">
          {c.nativeBody.map((p) => (
            <p key={p} className="leading-relaxed text-text">{p}</p>
          ))}
        </div>
      </div>

      {/* ─── お部屋探しからその後の暮らしまで ─── */}
      <div>
        <ReH2>{c.journeyHeading}</ReH2>
        <div className="mt-3 space-y-3">
          {c.journeyBody.map((p) => (
            <p key={p} className="leading-relaxed text-text">{p}</p>
          ))}
        </div>
      </div>

      {/* ─── 現場の実感 ─── */}
      <div>
        <ReH2>{c.fieldHeading}</ReH2>
        <div className="mt-3 space-y-3">
          {c.fieldBody.map((p) => (
            <p key={p} className="leading-relaxed text-text">{p}</p>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.fieldNote}</p>
      </div>

      {/* ─── お問い合わせ前のチェックリスト ─── */}
      <div>
        <ReH2>{c.checklistHeading}</ReH2>
        <p className="mt-3 leading-relaxed text-text">{c.checklistLead}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-text-muted">
          {c.checklistItems.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      </div>

      {/* ─── FAQ（faqItems を FAQJsonLd と <details> 表示の単一ソースに・ページ内 FAQPage は1つのみ） ─── */}
      <div>
        <FAQJsonLd items={c.faqItems} />
        <p className="font-serif text-xl font-semibold text-ink">{c.faqHeading}</p>
        <div className="mt-4 space-y-3">
          {c.faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-border bg-surface p-4"
            >
              <summary className="cursor-pointer list-none">
                <h2 className="inline font-serif text-base font-semibold text-ink">
                  {item.question}
                </h2>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ─── 関連ページ（トピッククラスタ） ─── */}
      <div>
        <ReH2>{c.relatedPagesHeading}</ReH2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {c.relatedPages.map((link) => {
            const href = link.external ? link.href : addLocalePrefix(link.href, locale);
            const inner = (
              <>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-ink">
                  {link.label}
                  <ArrowRight size={14} />
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-text-muted">
                  {link.description}
                </span>
              </>
            );
            return link.external ? (
              <a
                key={link.href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:text-primary"
              >
                {inner}
              </a>
            ) : (
              <Link
                key={link.href}
                href={href}
                className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:text-primary"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── 一般情報・分離受任の注記 ─── */}
      <p className="text-xs leading-relaxed text-text-muted">{c.generalNote}</p>

      {/* ─── 当社が対応できないこと（B-4・日本語版のみ・お問い合わせ導線の手前） ─── */}
      {isJa && <CannotHandle bare />}
    </RealestateServicePage>
  );
}
