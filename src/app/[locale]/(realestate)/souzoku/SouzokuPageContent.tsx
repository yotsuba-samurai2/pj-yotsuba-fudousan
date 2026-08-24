import Image from "next/image";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { Building2, TrendingUp, KeyRound, ArrowRight, MessageCircle } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { LineLink } from "@/components/shared/LineLink";
import { SHARED_ORG_INFO } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { getColumns, getLocalizedColumn, filterColumnsByTheme } from "@/lib/columns";
import { RelatedColumnsSection } from "@/components/column/RelatedColumnsSection";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { pickFaqJa } from "@/data/faqJa";
import type { LangCode } from "@/config/languages";

/**
 * /souzoku 本文（相続不動産ピラー「文京区で不動産を相続したら」）
 *
 * 実装メモ:
 * - 静的実装（useTranslation()・Firestore呼び出しなし）。
 *   方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=access/page.tsx）。server componentのまま。
 * - en/zh-tw/zh=監修前ドラフト（2026-07-11）。jaの表示文言は従来と一字一句同一。
 *   繁体=台湾定訳（繼承・遺囑・不動產・文京區・遺產稅＝(legal)/legal/services/inheritance 既訳準拠）／zh=大陸表記。
 *   法令名は既訳にならい字体変換（不動産登記法→不動產登記法等）、法務省資料名・路線価図等の資料名は日本語原題のまま。
 * - FAQは疑問文H2＋<details>アコーディオン（JS不要・SSGでも全文がDOMに載る）。
 *   faqItems（COPY[locale].faqItems）は FAQJsonLd と表示の両方で使う単一ソース＝ロケールごとに一致を維持。
 * - JSON-LDは既存3種（Article・FAQPage・Breadcrumb）のみ＝新規出力しない。構造・日付は不変、文字列のみロケール別。
 * - 他士業をサイト前面で宣伝しない: 相続手続き・登記・税務は「提携する専門家
 *   （行政書士・司法書士・税理士等）」と一般化し、特定の事務所名は出さない。
 * - 具体的な法的判断・税額計算は書かない（最終判断は有資格者）。
 *   法令は条文番号＋項＋号・施行日を併記。最終改正日など裏取り不能は「未検証」。
 */

type ExitCardId = "management" | "utilization" | "sale";
type ExitCard = { id: ExitCardId; title: string; description: string };
type FaqItem = { question: string; answer: string };

/**
 * 2026-08-05（定点#3 対策。設問文の正本は
 * 四葉基幹CRM/定点33項目_測定用クエリ表_v1.md の #3＝豊島区・文京区・相続した不動産・売却・相談・行政書士）
 *
 * 担当する事業者の事実表。「だれが・どの免許/登録を持ち・どの範囲を担うか」を
 * 三人称の事実として書き出すためのもの。自社語り（「私たちは〜します」）ではなく、
 * 第三者がそのまま書き写せる形にする＝AI回答の本文に事業者名が出るのはこの形のときである。
 *
 * 表現の制約（shigyo-compliance-gate／luck428-column-seo 第9条）:
 * - 事業体をまたいで一括で受任する形を連想させる語は書かない（禁止語の一覧は
 *   shigyo-compliance-gate／CLAUDE.md 側が正本）。設問文にその種の語が含まれていても、
 *   ページ本文には入れない。使ってよいのは「一つの窓口」「同じ窓口」「伴走」まで
 *   （2026-07-29 石井弁護士確認済）。
 * - 四葉不動産株式会社（宅建業）と四葉行政書士事務所は独立した別の事業体であり、
 *   「それぞれ別の契約としてお受けします」の形で書く（分離受任・紹介料の授受なし）。
 * - 登記の申請代理は司法書士、税務は税理士へ送る留保を必ず残す（CannotHandle と整合）。
 */
type ProviderRow = { entity: string; license: string; scope: string };

type InternalLink = { href: string; label: string; description: string };
type SouzokuCopy = {
  articleTitle: string;
  articleDesc: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  heroLabel: string;
  h1Top: string;
  h1Sub: string;
  heroLead: string;
  // 2026-08-05（定点#3対策）：担当する事業者ブロック
  providerLabel: string;
  providerHeading: string;
  providerLead: string;
  providerColEntity: string;
  providerColLicense: string;
  providerColScope: string;
  providerRows: ProviderRow[];
  providerNote: string;
  faqLabel: string;
  faqHeading: string;
  faqItems: FaqItem[];
  exitLabel: string;
  exitHeading: string;
  exitLead: string;
  exitCards: ExitCard[];
  internalHeading: string;
  internalLinks: InternalLink[];
  sourcesHeading: string;
  sources: string[];
  sourcesNote: string;
  repBio: string;
  repRole: string;
  ctaHeading: string;
  ctaLead: string;
  ctaLine: string;
  ctaContact: string;
  ctaLineNote: string;
};

// アイコンは構造（不変）＝COPY外でidに紐付け
const EXIT_ICONS: Record<ExitCardId, typeof Building2> = {
  management: Building2,
  utilization: TrendingUp,
  sale: KeyRound,
};

// 2026-07-19 B-4：ja の相続FAQは B-3 の40問（@/data/faqJa・相続不動産8問）に統一する。
// 従来の独自9問は設問が重複しつつ文言が異なり表記ゆれの原因だったため廃止（浦松承認）。
// FAQJsonLd の {question, answer} へ写像するだけで、文面は faqJa 側の単一ソースが正。
const JA_FAQ_ITEMS: FaqItem[] = pickFaqJa([
  "文京区で不動産を相続したら、何から始めればいいですか？",
  "相続登記の期限はありますか？",
  "相続した不動産は、管理・活用・売却のどれを選べばいいですか？",
  // 2026-07-22：隣接区（豊島区等）の商圏明示（定点#3対応・faqJa側に新設）
  "豊島区など、文京区に隣接する区の相続不動産も相談できますか？",
  // 2026-07-22：台湾越境相続（定点#19対応・/souzoku/taiwan への導線）
  "台湾に相続人がいる（台湾籍の方が相続する）場合も、日本語で相談できますか？",
  "借地権付きの実家を相続したら、どうすればいいですか？",
  "共有名義で相続した不動産はどう扱えばいいですか？",
  "売却にはどのくらいの期間がかかりますか？",
  "遺産分割協議書などの相続手続きは、誰が担当しますか？",
  "税理士や司法書士も紹介してもらえますか？",
]).map((it) => ({ question: it.q, answer: it.a }));

const COPY: Record<LangCode, SouzokuCopy> = {
  ja: {
    articleTitle: "文京区で不動産を相続したら——管理・活用・売却、3つの出口の選び方",
    articleDesc:
      "文京区で不動産を相続したときの進め方を一つに整理した完全ガイド。相続登記の義務化（2024年4月1日施行・原則3年以内、過去の相続分は2027年3月31日まで）への備えから、管理・活用・売却という3つの出口の選び方まで、文京区小日向の四葉不動産が解説します。",
    breadcrumbHome: "ホーム",
    breadcrumbCurrent: "相続不動産",
    heroLabel: "相続不動産",
    h1Top: "文京区で不動産を相続したら。",
    h1Sub: "出口は「管理・活用・売却」の3つです",
    // B-4：冒頭の回答ブロック（浦松確定文言・165字）。従来のheroLeadは同趣旨のため置換（追加ではない）。
    heroLead:
      "文京区で不動産を相続したら、まず相続登記の期限（2024年4月から義務化・原則3年以内）を確認します。次に、その不動産を『管理・活用・売却』のどの出口に導くかを、税負担や家族の状況から検討します。四葉不動産株式会社が物件の査定・売却・活用を担当し、遺産分割協議書の作成など法務手続きは併設の四葉行政書士事務所が別契約で受任します。",
    providerLabel: "担当する事業者",
    providerHeading:
      "豊島区・文京区の相続不動産を担当する事業者と、それぞれの担当範囲",
    providerLead:
      "四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304号）と四葉行政書士事務所（行政書士 登録番号第25087022号）は、東京都文京区小日向（茗荷谷駅から徒歩約5分）に併設された別々の事業体で、いずれも浦松丈二が代表を務めます。浦松は宅地建物取引士（東京）第293544号と行政書士の両方の登録を持ち、豊島区（大塚・巣鴨・駒込・池袋など）と文京区で相続した不動産について、査定と売却の媒介は四葉不動産株式会社が、遺産分割協議書の作成など相続手続きの書類は四葉行政書士事務所が、それぞれ別の契約としてお受けします。",
    providerColEntity: "依頼先",
    providerColLicense: "免許・登録",
    providerColScope: "このページの相談で担当する範囲",
    providerRows: [
      {
        entity: "四葉不動産株式会社",
        license:
          "宅地建物取引業 東京都知事(1)第113304号／代表取締役・専任の宅地建物取引士 浦松丈二（東京）第293544号",
        scope:
          "豊島区（大塚・巣鴨・駒込・池袋など）・文京区と、新宿区・台東区・北区・千代田区の相続した不動産の査定、売却の媒介、賃貸活用・管理のご提案",
      },
      {
        entity: "四葉行政書士事務所",
        license: "行政書士 登録番号第25087022号／代表行政書士 浦松丈二",
        scope:
          "遺産分割協議書の作成など、相続手続きの書類作成。四葉不動産株式会社とは別の契約としてお受けします",
      },
      {
        entity: "司法書士",
        license: "——（当社では取り扱いません）",
        scope:
          "法務局への相続登記の申請代理。当社は行えないため、司法書士におつなぎします",
      },
      {
        entity: "税理士",
        license: "——（当社では取り扱いません）",
        scope:
          "相続税の申告と税額の計算。当社は行えないため、税理士におつなぎします",
      },
    ],
    providerNote:
      "四葉不動産株式会社と四葉行政書士事務所は独立した別の事業体です。ご依頼はそれぞれの事業者へ直接いただき、契約も別々になります。事業者の間で紹介料等の授受はありません。本ページは一般的な情報提供であり、個別の法的判断・税額計算を行うものではありません。免許番号・登録番号は本ページ作成時点の記載です（各登録機関の公表情報との最新時点での突き合わせは未検証）。",
    faqLabel: "FAQ",
    faqHeading: "文京区の相続不動産、よくある疑問",
    faqItems: JA_FAQ_ITEMS,
    exitLabel: "3つの選択肢",
    exitHeading: "相続した不動産の3つの出口——管理・活用・売却",
    exitLead:
      "どれか一つに今すぐ決める必要はありません。3つを並べて比較し、ご家族の事情に合う出口を選ぶところからお手伝いします。",
    exitCards: [
      {
        id: "management",
        title: "管理",
        description:
          "すぐに売る・貸すと決められないときの選択肢が「維持・管理」です。空き家を放置すると建物の傷みが進み、管理が不十分な場合は空家法にもとづく指導等の対象になる可能性もあります。文京区の地元会社として、資産価値を保ちながら次の一手を考えるための管理の方法をご提案します。",
      },
      {
        id: "utilization",
        title: "活用",
        description:
          "駅や学校に近い文京区の不動産は、賃貸化などの活用で収益源に変わる可能性があります。リフォームの要否や想定賃料、かかる費用と手間を含めて「貸した場合」の収支を試算し、売却した場合と数字で比べながら、ご家族に合う活かし方を一緒に検討します。",
      },
      {
        id: "sale",
        title: "売却",
        description:
          "住む予定がない、維持費や税負担が重い、相続人の間で分けたい——そんなときの現実的な出口が売却です。文京区に加えて豊島区（大塚・巣鴨・駒込・池袋など）の相場もふまえた査定から、売却に伴う手続きの段取りまで、提携する専門家（行政書士・司法書士・税理士等）と連携して進めます。「文京区の実家と豊島区の貸家」のように物件が区をまたぐ相続も、あわせて査定します。相続した一棟アパート・ビルなど収益不動産の売却もご相談ください。",
      },
    ],
    internalHeading: "あわせてご覧いただきたいページ",
    internalLinks: [
      {
        // タスクC-4（2026-07-19）：相続空き家ページ新設に伴い追加（ja先行公開のためjaのみ）
        href: "/souzoku/akiya",
        label: "文京区の空き家、どうする？",
        description:
          "相続した空き家の放置リスクと、売却・賃貸活用・管理という3つの出口の選び方を解説しています。",
      },
      {
        // 2026-07-25：中国語相続ハブ（定点#7・/souzoku/chinese）新設に伴い追加（ja先行公開のためjaのみ）
        href: "/souzoku/chinese",
        label: "中国語で相談できる不動産相続",
        description:
          "在日中国人の方の相続や、中国大陸・台湾に相続人がいる相続の書類・手続き・売却を、中国語（繁体字・簡体字）対応で解説しています。",
      },
      {
        href: "/services",
        label: "サービス一覧",
        description:
          "相続した不動産の管理・活用・売却など、四葉不動産がお手伝いできることの全体像はこちら。",
      },
      {
        href: "/about",
        label: "会社概要",
        description:
          "文京区小日向の地元会社としての会社情報と、代表・浦松 丈二のプロフィールをご紹介しています。",
      },
      {
        href: "/column",
        label: "コラム",
        description:
          "相続登記・空き家・売却のタイミングなど、相続不動産にまつわる疑問を記事で解説しています。",
      },
      {
        href: "/contact",
        label: "お問い合わせ",
        description:
          "相続した不動産のご相談・査定のご依頼はこちらから。所在地・営業時間もご案内しています。",
      },
    ],
    sourcesHeading: "根拠・出典",
    sources: [
      "不動産登記法（平成16年法律第123号）第76条の2第1項——相続による所有権取得を知った日から3年以内の相続登記申請義務。令和3年法律第24号による改正で新設、2024年（令和6年）4月1日施行。",
      "不動産登記法第164条第1項——正当な理由なく申請を怠った場合、10万円以下の過料。",
      "施行日（2024年4月1日）より前に相続した未登記不動産の申請期限は2027年（令和9年）3月31日まで（改正法附則の経過措置。出典：法務省「相続登記の申請義務化について」）。",
      "民法第915条第1項——相続の承認・放棄の熟慮期間（自己のために相続の開始があったことを知った時から3か月以内）。",
      "民法第907条第1項——共同相続人による遺産分割協議。",
      "相続税法第27条第1項——相続税の申告期限（相続の開始があったことを知った日の翌日から10か月以内）。",
      "空家等対策の推進に関する特別措置法（平成26年法律第127号）——「管理不全空家等」に対する指導・勧告等は令和5年法律第50号による改正で導入、2023年（令和5年）12月13日施行（出典：国土交通省）。",
      "国税庁「路線価図・評価倍率表」（相続税評価の基礎資料）。",
    ],
    sourcesNote:
      "※各法令の最終改正日は本ページ作成時点で個別に裏取りしていません（未検証）。本ページは一般的な情報の提供を目的とするもので、個別の法的判断・税額計算を行うものではありません。最終的な判断は有資格者（提携する専門家）にご確認ください。",
    repBio:
      "元毎日新聞記者として国内外の現場を歩き、中国総局長を務めたのち、地元・文京区小日向で四葉不動産を営んでいます。相続した不動産のご相談は、不動産・手続き・ご家族の事情が絡み合った「整理」から始まります。取材で培った、聞いて・整理して・分かりやすく伝える力と、宅地建物取引士・行政書士としての知識を土台に、最初の一歩から出口まで伴走します。手続きが必要な場面では、提携する専門家と連携してお手伝いします。",
    repRole: "代表",
    ctaHeading: "まずはお気軽にご相談ください",
    ctaLead:
      "相続した不動産のこと、「これ、どうしたらいい？」の一言からで構いません。文京区小日向の事務所（茗荷谷駅から徒歩約5分・10:00〜18:00・火・水休）でも、オンラインでもご相談いただけます。",
    ctaLine: "代表のLINEで相談する",
    ctaContact: "お問い合わせ",
    ctaLineNote:
      "LINEは代表・浦松 丈二の個人アカウントに直接つながります。「この物件、どう？」の一言からお気軽にどうぞ。",
  },
  en: {
    articleTitle:
      "Inheriting Property in Bunkyo: How to Choose among the Three Exits—Manage, Utilize, or Sell",
    articleDesc:
      "A complete guide that brings together how to proceed when you inherit real estate in Bunkyo, Tokyo. From preparing for the mandatory inheritance registration (in force April 1, 2024; within three years in principle, and by March 31, 2027 for past inheritances) to choosing among the three exits of managing, utilizing, or selling, explained by Yotsuba Real Estate in Kohinata, Bunkyo.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Inherited Real Estate",
    heroLabel: "Inherited Real Estate",
    h1Top: "If you inherit real estate in Bunkyo, Tokyo.",
    h1Sub: "There are three exits: manage, utilize, or sell",
    heroLead:
      "If you inherit real estate in Bunkyo, first check the deadline for inheritance registration—applications have been mandatory since April 2024, within three years in principle. Then choose your exit from the three options: manage, utilize, or sell. Follow this order and you will not get lost. Yotsuba Real Estate walks with you from the very first step.",
    providerLabel: "Who handles this",
    providerHeading:
      "The businesses that handle inherited real estate in Toshima-ku and Bunkyo-ku, and what each one covers",
    providerLead:
      "Yotsuba Real Estate Co., Ltd. (real estate brokerage license, Governor of Tokyo (1) No. 113304) and Yotsuba Gyoseishoshi (Administrative Scrivener) Office (gyoseishoshi registration No. 25087022) are two separate businesses located together in Kohinata, Bunkyo-ku, Tokyo (about a 5-minute walk from Myogadani Station), and Joji Uramatsu serves as the representative of both. He holds registrations both as a Licensed Real Estate Transaction Specialist (Tokyo, No. 293544) and as a gyoseishoshi. For real estate inherited in Toshima-ku (Otsuka, Sugamo, Komagome, Ikebukuro and other areas) and Bunkyo-ku, the appraisal and the brokerage of the sale are handled by Yotsuba Real Estate Co., Ltd., while documents for inheritance procedures such as the estate division agreement are handled by Yotsuba Gyoseishoshi Office—each under a separate contract.",
    providerColEntity: "Whom you engage",
    providerColLicense: "License / registration",
    providerColScope: "What they cover for the matters on this page",
    providerRows: [
      {
        entity: "Yotsuba Real Estate Co., Ltd.",
        license:
          "Real estate brokerage, Governor of Tokyo (1) No. 113304 / Representative Director and full-time Licensed Real Estate Transaction Specialist Joji Uramatsu (Tokyo) No. 293544",
        scope:
          "Appraisal, brokerage of the sale, and proposals for rental use and management of real estate inherited in Toshima-ku (Otsuka, Sugamo, Komagome, Ikebukuro and other areas), Bunkyo-ku, Shinjuku-ku, Taito-ku, Kita-ku, and Chiyoda-ku",
      },
      {
        entity: "Yotsuba Gyoseishoshi (Administrative Scrivener) Office",
        license:
          "Gyoseishoshi registration No. 25087022 / Representative gyoseishoshi Joji Uramatsu",
        scope:
          "Preparation of documents for inheritance procedures, such as the estate division agreement. Engaged under a contract separate from Yotsuba Real Estate Co., Ltd.",
      },
      {
        entity: "Judicial scrivener (shiho-shoshi)",
        license: "——(not handled by us)",
        scope:
          "Filing the inheritance registration with the Legal Affairs Bureau on your behalf. We cannot do this, so we will connect you with a judicial scrivener",
      },
      {
        entity: "Licensed tax accountant (zeirishi)",
        license: "——(not handled by us)",
        scope:
          "Inheritance tax filing and the calculation of tax due. We cannot do this, so we will connect you with a licensed tax accountant",
      },
    ],
    providerNote:
      "Yotsuba Real Estate Co., Ltd. and Yotsuba Gyoseishoshi Office are independent, separate businesses. You engage each of them directly, and the contracts are separate. No referral fee is paid or received between them. This page provides general information and does not make individual legal judgments or calculate tax amounts. The license and registration numbers are as stated at the time this page was prepared (a check against the latest published information of each registering authority is unverified).",
    faqLabel: "FAQ",
    faqHeading: "Inherited real estate in Bunkyo: frequently asked questions",
    faqItems: [
      {
        question: "I inherited real estate in Bunkyo. What should I start with?",
        answer:
          "The typical sequence is: (1) check whether there is a will; (2) identify the heirs and the estate; (3) hold the estate division discussion; (4) complete the inheritance registration; and (5) decide on the policy—manage, utilize, or sell. Because there is a three-month deliberation period for accepting or renouncing an inheritance (Article 915, Paragraph 1 of the Civil Code), it is reassuring to organize the overall picture early. Where formal procedures are required, we guide you in coordination with our partner professionals.",
      },
      {
        question: "Is there a deadline for inheritance registration?",
        answer:
          "Yes. Applying for inheritance registration became mandatory on April 1, 2024, and an application is required within three years in principle from the day you learned of the acquisition of the real estate (Article 76-2, Paragraph 1 of the Real Property Registration Act). Unregistered real estate inherited before that date is also covered, with a grace deadline of March 31, 2027. Failing to apply without justifiable grounds may be subject to an administrative fine of up to 100,000 yen (Article 164, Paragraph 1 of the same Act).",
      },
      {
        question: "What happens if I leave the inherited family home vacant?",
        answer:
          "The building deteriorates and ages, and holding costs such as fixed asset tax continue to accrue every year. A vacant house that is not adequately managed may become subject to guidance, recommendations, and other measures by the municipality under the Act on Special Measures concerning Vacant Houses, and once a recommendation is issued, the residential-land special measure for fixed asset tax may be lifted. Even if you 'can't decide yet,' we recommend at least putting a management arrangement in place early.",
      },
      {
        question: "Which is better, selling or renting out (utilizing)?",
        answer:
          "There is no one-size-fits-all answer. The best choice depends on the location, the building's age, whether repairs are needed, your need for a lump sum, the tax burden, and your family's wishes. At Yotsuba Real Estate, we compare 'if you sell' and 'if you rent' side by side in numbers, and then choose together an exit your family can agree on.",
      },
      {
        question: "How do I find out the value of inherited real estate?",
        answer:
          "Useful benchmarks include the rosenka roadside land values published by the National Tax Agency (the basis for inheritance tax valuation) and the officially announced land prices. However, the price a property actually sells for (the actual market price) usually differs from these. We handle individual appraisals that reflect actual transactions within Bunkyo—please request one via our contact page.",
      },
      {
        question: "Can real estate inherited under joint ownership still be sold?",
        answer:
          "Yes, it can be sold with the consent of all co-owners. Selling only your own share is also possible, but in practice buyers are limited and the price tends to be unfavorable. Where the estate division discussion (Article 907, Paragraph 1 of the Civil Code) needs to be sorted out, we coordinate with our partner professionals to guide you through the process.",
      },
      {
        question:
          "Can I also consult you about inheritance tax filing and registration procedures, all in one place?",
        answer:
          "Yes. What Yotsuba Real Estate itself handles is the management, utilization, and sale of the real estate. Registration, tax matters, and inheritance procedures are each carried out in coordination with our partner professionals (gyoseishoshi (administrative scriveners), judicial scriveners, licensed tax accountants, and others). Note that when an inheritance tax return is required, the deadline is within ten months from the day following the day you learned of the commencement of the inheritance (Article 27, Paragraph 1 of the Inheritance Tax Act).",
      },
      {
        question: "I live far away and can't go see the family home in Bunkyo. Can you handle that?",
        answer:
          "Yes, we can. As a local company with an office in Kohinata, Bunkyo, we can check the property on site and report back to you, and handle the arrangements for management or sale in a way that does not require you to come in person. We are also happy to communicate by phone, email, or online.",
      },
      {
        question: "Does a consultation cost anything? What are your business hours?",
        answer:
          "Consultations are free. Our office is at 文京区小日向４丁目２－５ 小日向安田ビル ２０３ (Kohinata Yasuda Bldg. #203, 4-2-5 Kohinata, Bunkyo-ku), about a 5-minute walk from Myogadani Station, and business hours are 10:00–18:00 (closed Tuesdays and Wednesdays). If you formally engage us for a sale or for management, we always disclose the fees clearly before any procedures begin.",
      },
    ],
    exitLabel: "Three options",
    exitHeading: "Three exits for inherited real estate: manage, utilize, or sell",
    exitLead:
      "You do not have to settle on one right now. We start by laying the three options side by side and helping you choose the exit that fits your family's circumstances.",
    exitCards: [
      {
        id: "management",
        title: "Management",
        description:
          "When you cannot yet decide to sell or rent, 'maintain and manage' is an option. If a vacant house is left unattended, the building deteriorates, and inadequately managed properties may become subject to guidance and other measures under the Vacant Houses Act. As a local company in Bunkyo, we propose management approaches that preserve the asset's value while you consider your next move.",
      },
      {
        id: "utilization",
        title: "Utilization",
        description:
          "Real estate in Bunkyo, close to stations and schools, has the potential to become a source of income through rental and other uses. We run the numbers on 'if you rent'—including whether renovation is needed, the expected rent, and the costs and effort involved—and compare them with 'if you sell,' exploring together the way of use that suits your family.",
      },
      {
        id: "sale",
        title: "Sale",
        description:
          "No plans to live there, heavy maintenance costs and tax burden, or heirs who want to divide the proceeds—in such cases, selling is the realistic exit. From an appraisal that reflects market conditions in Bunkyo-ku and also in Toshima-ku (Otsuka, Sugamo, Komagome, Ikebukuro and other areas), to organizing the procedures involved in a sale, we move forward in coordination with our partner professionals (gyoseishoshi (administrative scriveners), judicial scriveners, licensed tax accountants, and others). Where an inheritance spans wards—for example a family home in Bunkyo-ku and a rented house in Toshima-ku—we appraise them together. We also welcome consultations on selling inherited income properties such as whole apartment buildings and office buildings.",
      },
    ],
    internalHeading: "Pages you may also want to see",
    internalLinks: [
      {
        href: "/services",
        label: "Our Services",
        description:
          "See the full picture of what Yotsuba Real Estate can help with, including managing, utilizing, and selling inherited real estate.",
      },
      {
        href: "/about",
        label: "About Us",
        description:
          "Company information as a local firm in Kohinata, Bunkyo, and a profile of our representative, Joji Uramatsu.",
      },
      {
        href: "/column",
        label: "Column",
        description:
          "Articles answering common questions about inherited real estate, such as inheritance registration, vacant houses, and the timing of a sale.",
      },
      {
        href: "/contact",
        label: "Contact",
        description:
          "Consult us about inherited real estate or request an appraisal here. Our address and business hours are also listed.",
      },
    ],
    sourcesHeading: "Legal Basis & Sources",
    sources: [
      "Real Property Registration Act (Act No. 123 of 2004), Article 76-2, Paragraph 1—the obligation to apply for inheritance registration within three years from the day one learns of the acquisition of ownership by inheritance. Newly established by the amendment under Act No. 24 of 2021; in force from April 1, 2024.",
      "Real Property Registration Act, Article 164, Paragraph 1—an administrative fine of up to 100,000 yen for failing to apply without justifiable grounds.",
      "For unregistered real estate inherited before the effective date (April 1, 2024), the application deadline is March 31, 2027 (transitional measures in the supplementary provisions of the amending act; source: Ministry of Justice, '相続登記の申請義務化について').",
      "Civil Code, Article 915, Paragraph 1—the deliberation period for accepting or renouncing an inheritance (within three months from the time one learns that an inheritance has commenced for oneself).",
      "Civil Code, Article 907, Paragraph 1—division of the estate by discussion among the co-heirs.",
      "Inheritance Tax Act, Article 27, Paragraph 1—the filing deadline for inheritance tax (within ten months from the day following the day one learns that the inheritance has commenced).",
      "Act on Special Measures concerning the Promotion of Measures against Vacant Houses (Act No. 127 of 2014)—guidance, recommendations, and other measures against 'inadequately managed vacant houses' were introduced by the amendment under Act No. 50 of 2023, in force from December 13, 2023 (source: Ministry of Land, Infrastructure, Transport and Tourism).",
      "National Tax Agency, '路線価図・評価倍率表' (rosenka maps and evaluation multiplier tables; basic materials for inheritance tax valuation).",
    ],
    sourcesNote:
      "Note: The dates of the latest amendments to each law have not been individually verified as of the time this page was prepared (unverified). This page is intended to provide general information and does not make individual legal judgments or tax calculations. Please confirm final decisions with qualified professionals (our partner professionals).",
    repBio:
      "After walking the field in Japan and abroad as a reporter for the Mainichi Shimbun and serving as its China General Bureau Chief, I now run Yotsuba Real Estate in my home neighborhood of Kohinata, Bunkyo. Consultations about inherited real estate begin with 'untangling' the property, the procedures, and the family circumstances intertwined in it. Building on the listening, organizing, and plain-spoken communication skills honed through reporting, and on my knowledge as a Licensed Real Estate Transaction Specialist and Gyoseishoshi (Administrative Scrivener), I walk with you from the first step to the exit. Where formal procedures are needed, we help in coordination with our partner professionals.",
    repRole: "Representative",
    ctaHeading: "Feel free to consult us first",
    ctaLead:
      "About your inherited real estate, a single line like 'What should I do with this?' is a perfectly fine place to start. You can consult us at our office in Kohinata, Bunkyo (about a 5-minute walk from Myogadani Station; 10:00–18:00; closed Tuesdays and Wednesdays) or online.",
    ctaLine: "Consult via the representative's LINE",
    ctaContact: "Contact",
    ctaLineNote:
      "The LINE button connects you directly to the personal account of our representative, Joji Uramatsu. Feel free to start with a single line like 'What do you think of this property?'",
  },
  "zh-tw": {
    articleTitle: "在文京區繼承不動產——管理・活用・出售，3種出口的選法",
    articleDesc:
      "把在文京區繼承不動產後的進行方式整理為一的完全指南。從因應繼承登記的義務化（2024年4月1日施行・原則3年以內，過去的繼承部分至2027年3月31日），到管理・活用・出售3種出口的選法，由文京區小日向的四葉不動産為您解說。",
    breadcrumbHome: "首頁",
    breadcrumbCurrent: "繼承不動產",
    heroLabel: "繼承不動產",
    h1Top: "在文京區繼承了不動產。",
    h1Sub: "出口有「管理・活用・出售」3種",
    heroLead:
      "在文京區繼承不動產後，請先確認繼承登記的期限——自2024年4月起申請已義務化，原則上須在3年以內辦理。接著再從管理・活用・出售3種出口中做選擇。依照這個順序進行就不會迷惘。四葉不動産從最初的一步開始陪伴您。",
    providerLabel: "承辦的事業體",
    providerHeading: "承辦豐島區・文京區繼承不動產的事業體，以及各自的承辦範圍",
    providerLead:
      "四葉不動産株式会社（宅地建物交易業〔日本語：宅地建物取引業〕 東京都知事(1)第113304號）與四葉行政書士事務所（行政書士 登錄號碼第25087022號），是設於東京都文京區小日向（距茗荷谷站步行約5分鐘）、併設於同一處的兩個獨立事業體，均由浦松丈二擔任代表。浦松同時具備宅地建物交易士（日本語：宅地建物取引士／東京）第293544號與行政書士的登錄。豐島區（大塚・巢鴨・駒込・池袋等）與文京區的繼承不動產，估價與買賣仲介由四葉不動産株式会社承辦，遺產分割協議書等繼承手續的文件製作由四葉行政書士事務所承辦，各自以另行簽訂的契約受理。",
    providerColEntity: "委託對象",
    providerColLicense: "免許・登錄",
    providerColScope: "在本頁的諮詢中承辦的範圍",
    providerRows: [
      {
        entity: "四葉不動産株式会社",
        license:
          "宅地建物交易業〔日本語：宅地建物取引業〕 東京都知事(1)第113304號／代表取締役・專任宅地建物交易士 浦松丈二（東京）第293544號",
        scope:
          "豐島區（大塚・巢鴨・駒込・池袋等）・文京區，以及新宿區・台東區・北區・千代田區的繼承不動產之估價、買賣仲介、租賃活用與管理的提案",
      },
      {
        entity: "四葉行政書士事務所",
        license: "行政書士 登錄號碼第25087022號／代表行政書士 浦松丈二",
        scope:
          "遺產分割協議書的製作等，繼承手續的文件製作。與四葉不動産株式会社另行簽訂契約受理",
      },
      {
        entity: "司法書士〔日本的登記申請代理專業資格〕",
        license: "——（本公司不承辦）",
        scope:
          "向法務局申請繼承登記的代理。本公司無法辦理，將為您引介司法書士",
      },
      {
        entity: "稅理士〔日本的稅務專業資格〕",
        license: "——（本公司不承辦）",
        scope: "遺產稅的申報與稅額計算。本公司無法辦理，將為您引介稅理士",
      },
    ],
    providerNote:
      "四葉不動産株式会社與四葉行政書士事務所是獨立的不同事業體。委託請分別直接向各事業體提出，契約亦分別簽訂。事業體之間不會收受介紹費。本頁以提供一般資訊為目的，不進行個別的法律判斷・稅額計算。免許號碼・登錄號碼為本頁製作時點的記載（與各登錄機關最新公開資訊的核對未經查證）。",
    faqLabel: "FAQ",
    faqHeading: "文京區的繼承不動產，常見疑問",
    faqItems: [
      {
        question: "在文京區繼承了不動產，該從什麼開始？",
        answer:
          "一般的流程是：①確認有無遺囑、②確定繼承人與繼承財產、③遺產分割協議、④繼承登記、⑤決定管理・活用・出售的方針。由於繼承的承認・拋棄設有3個月的熟慮期間（民法第915條第1項），建議及早整理整體樣貌較為安心。需要辦理手續的場合，將與合作的專業人士聯手為您說明。",
      },
      {
        question: "繼承登記有期限嗎？",
        answer:
          "有。自2024年4月1日起繼承登記的申請已義務化，原則上須自知悉取得不動產之日起3年以內申請（不動產登記法第76條之2第1項）。在此之前繼承而尚未登記的不動產也屬對象，寬限期限為2027年3月31日。無正當理由而怠於申請，可能成為10萬日圓以下過料（行政罰鍰）的對象（同法第164條第1項）。",
      },
      {
        question: "繼承的老家一直空置不管，會怎麼樣？",
        answer:
          "除了建物的損傷與老化會持續惡化外，固定資產稅等維持費用也會逐年產生。管理不周的空屋，依空家等對策特別措置法可能成為市區町村指導・勸告等的對象；一旦受到勸告，固定資產稅的住宅用地特例可能被解除。即使「還無法決定」，也建議及早建立管理的體制。",
      },
      {
        question: "出售與出租（活用），哪個划算？",
        answer:
          "無法一概而論。最適解會因立地・屋齡・是否需要修繕、對整筆資金的需求、稅負、家人的想法而不同。四葉不動産會以數字比較「出售的情況」與「出租的情況」雙方，再與您一起選出全家人都能接受的出口。",
      },
      {
        question: "繼承的不動產，其價值要怎麼查？",
        answer:
          "可作為參考的，是國稅廳公布的路線價（遺產稅評價的基礎）與公示地價。不過實際能成交的價格（實勢價格）通常與這些數字不同。反映文京區內交易行情的個別估價由本公司承接，請透過聯絡我們提出委託。",
      },
      {
        question: "以共有名義繼承的不動產也能出售嗎？",
        answer:
          "只要共有人全體同意即可出售。僅出售自己的持分也有可能，但實際上買方有限、價格面也容易吃虧。若需要整理遺產分割協議（民法第907條第1項），將與合作的專業人士聯手為您說明進行方式。",
      },
      {
        question: "遺產稅的申報與登記手續，也可以一併諮詢嗎？",
        answer:
          "可以。四葉不動産負責的是不動產的管理・活用・出售；登記・稅務・繼承手續，則分別與合作的專業人士（行政書士・司法書士・稅理士等）聯手進行。另外，若需要申報遺產稅，期限為自知悉繼承開始之日的翌日起10個月以內（相續稅法第27條第1項）。",
      },
      {
        question: "住在遠方，無法親自去看文京區的老家。可以協助嗎？",
        answer:
          "可以。作為在文京區小日向設有事務所的在地公司，從現場狀況的確認與回報，到管理・出售的安排，都能以不需您親自前來的方式協助。也可透過電話・電子郵件・線上方式聯繫。",
      },
      {
        question: "諮詢需要費用嗎？營業時間是什麼時候？",
        answer:
          "諮詢免費。事務所位於文京区小日向４丁目２－５ 小日向安田ビル ２０３（距茗荷谷站步行約5分鐘），營業時間為10:00〜18:00（週二・週三公休）。若正式委託出售或管理，相關費用必定在辦理手續前明確告知。",
      },
    ],
    exitLabel: "3種選擇",
    exitHeading: "繼承不動產的3種出口——管理・活用・出售",
    exitLead:
      "不必現在立刻選定其中一種。我們先把3種選項並列比較，從協助您選出符合家人情況的出口開始。",
    exitCards: [
      {
        id: "management",
        title: "管理",
        description:
          "「維持・管理」是還無法立刻決定出售或出租時的選項。空屋若放置不管，建物的損傷會持續惡化；管理不周時，也可能成為依空家法進行指導等的對象。作為文京區的在地公司，我們將提案能一邊保持資產價值、一邊思考下一步的管理方法。",
      },
      {
        id: "utilization",
        title: "活用",
        description:
          "文京區的不動產鄰近車站與學校，透過出租等活用方式，有機會轉變為收益來源。我們會將是否需要整修、預估租金、所需費用與心力都納入，試算「出租的情況」的收支，並與出售的情況以數字比較，和您一起研究適合家人的活用方式。",
      },
      {
        id: "sale",
        title: "出售",
        description:
          "沒有居住的打算、維持費與稅負沉重、想在繼承人之間分配——這些時候，出售就是務實的出口。從依文京區以及豐島區（大塚・巢鴨・駒込・池袋等）行情的估價，到出售相關手續的安排，皆與合作的專業人士（行政書士・司法書士・稅理士等）聯手進行。像是「文京區的老家與豐島區的出租房」這種物件橫跨不同區的繼承，也會一併估價。繼承而來的整棟公寓・大樓等收益不動產的出售，也歡迎洽詢。",
      },
    ],
    internalHeading: "建議一併閱覽的頁面",
    internalLinks: [
      {
        href: "/services",
        label: "服務一覽",
        description:
          "繼承不動產的管理・活用・出售等，四葉不動産能協助的全貌請見此處。",
      },
      {
        href: "/about",
        label: "公司簡介",
        description:
          "介紹作為文京區小日向在地公司的公司資訊，以及代表・浦松 丈二的簡歷。",
      },
      {
        href: "/column",
        label: "專欄",
        description:
          "以文章解說繼承登記・空屋・出售時機等，與繼承不動產有關的疑問。",
      },
      {
        href: "/contact",
        label: "聯絡我們",
        description:
          "繼承不動產的諮詢・估價委託請由此。也載有所在地與營業時間的資訊。",
      },
    ],
    sourcesHeading: "依據・出處",
    sources: [
      "不動產登記法（平成16年法律第123號）第76條之2第1項——自知悉因繼承取得所有權之日起3年以內申請繼承登記的義務。由令和3年法律第24號修正新設，2024年（令和6年）4月1日施行。",
      "不動產登記法第164條第1項——無正當理由怠於申請時，處10萬日圓以下之過料（行政罰鍰）。",
      "於施行日（2024年4月1日）之前繼承且尚未登記的不動產，其申請期限至2027年（令和9年）3月31日（修正法附則的過渡措施。出處：法務省「相続登記の申請義務化について」）。",
      "民法第915條第1項——繼承的承認・拋棄之熟慮期間（自知悉繼承已為自己開始之時起3個月以內）。",
      "民法第907條第1項——共同繼承人間的遺產分割協議。",
      "相續稅法第27條第1項——遺產稅的申報期限（自知悉繼承開始之日的翌日起10個月以內）。",
      "空家等對策之推進相關特別措置法（平成26年法律第127號）——對「管理不全空家等」的指導・勸告等，由令和5年法律第50號修正導入，2023年（令和5年）12月13日施行（出處：國土交通省）。",
      "國稅廳「路線価図・評価倍率表」（遺產稅評價的基礎資料）。",
    ],
    sourcesNote:
      "※各法令的最終修正日期，於本頁製作時點未逐一查證（未經查證）。本頁以提供一般資訊為目的，不進行個別的法律判斷・稅額計算。最終判斷請向具資格的專業人士（合作的專業人士）確認。",
    repBio:
      "曾以每日新聞記者的身分走訪國內外現場，並擔任中國總局長，之後在家鄉・文京區小日向經營四葉不動産。繼承不動產的諮詢，往往從整理不動產・手續・家人情況相互交織的狀態開始。以採訪培養出的傾聽・整理・淺白傳達的能力，加上宅地建物取引士・行政書士的知識為基礎，從最初的一步到出口陪伴您。需要辦理手續的場合，將與合作的專業人士聯手協助。",
    repRole: "代表",
    ctaHeading: "歡迎先輕鬆諮詢",
    ctaLead:
      "關於繼承的不動產，從一句「這該怎麼辦？」開始就可以。歡迎至文京區小日向的事務所（距茗荷谷站步行約5分鐘・10:00〜18:00・週二・週三公休）洽詢，也可線上諮詢。",
    ctaLine: "透過代表的LINE諮詢",
    ctaContact: "聯絡我們",
    ctaLineNote:
      "LINE將直接連到代表・浦松 丈二的個人帳號。從一句「這個物件如何？」開始，歡迎隨時聯繫。",
  },
  zh: {
    articleTitle: "在文京区继承不动产——管理・活用・出售，3种出口的选法",
    articleDesc:
      "把在文京区继承不动产后的推进方式整理为一的完全指南。从应对继承登记的义务化（2024年4月1日施行・原则3年以内，过去的继承部分至2027年3月31日），到管理・活用・出售3种出口的选法，由文京区小日向的四葉不動産为您解说。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "继承不动产",
    heroLabel: "继承不动产",
    h1Top: "在文京区继承了不动产。",
    h1Sub: "出口有“管理・活用・出售”3种",
    heroLead:
      "在文京区继承不动产后，请先确认继承登记的期限——自2024年4月起申请已义务化，原则上须在3年以内办理。然后再从管理・活用・出售3种出口中进行选择。按照这个顺序推进就不会迷茫。四葉不動産从最初的一步开始陪伴您。",
    providerLabel: "承办的事业体",
    providerHeading: "承办丰岛区・文京区继承不动产的事业体，以及各自的承办范围",
    providerLead:
      "四葉不動産株式会社（宅地建物交易业〔日本語：宅地建物取引業〕 东京都知事(1)第113304号）与四葉行政書士事務所（行政书士 登录号码第25087022号），是设于东京都文京区小日向（距茗荷谷站步行约5分钟）、并设于同一处的两个独立事业体，均由浦松丈二担任代表。浦松同时具备宅地建物交易士（日本語：宅地建物取引士／东京）第293544号与行政书士的登录。丰岛区（大塚・巢鸭・驹込・池袋等）与文京区的继承不动产，估价与买卖中介由四葉不動産株式会社承办，遗产分割协议书等继承手续的文件制作由四葉行政書士事務所承办，各自以另行签订的合同受理。",
    providerColEntity: "委托对象",
    providerColLicense: "免许・登录",
    providerColScope: "在本页的咨询中承办的范围",
    providerRows: [
      {
        entity: "四葉不動産株式会社",
        license:
          "宅地建物交易业〔日本語：宅地建物取引業〕 东京都知事(1)第113304号／代表取締役・专任宅地建物交易士 浦松丈二（东京）第293544号",
        scope:
          "丰岛区（大塚・巢鸭・驹込・池袋等）・文京区，以及新宿区・台东区・北区・千代田区的继承不动产之估价、买卖中介、租赁活用与管理的提案",
      },
      {
        entity: "四葉行政書士事務所",
        license: "行政书士 登录号码第25087022号／代表行政书士 浦松丈二",
        scope:
          "遗产分割协议书的制作等，继承手续的文件制作。与四葉不動産株式会社另行签订合同受理",
      },
      {
        entity: "司法书士〔日本的登记申请代理专业资格〕",
        license: "——（本公司不承办）",
        scope: "向法务局申请继承登记的代理。本公司无法办理，将为您引介司法书士",
      },
      {
        entity: "税理士〔日本的税务专业资格〕",
        license: "——（本公司不承办）",
        scope: "遗产税的申报与税额计算。本公司无法办理，将为您引介税理士",
      },
    ],
    providerNote:
      "四葉不動産株式会社与四葉行政書士事務所是独立的不同事业体。委托请分别直接向各事业体提出，合同也分别签订。事业体之间不会收受介绍费。本页以提供一般信息为目的，不进行个别的法律判断・税额计算。免许号码・登录号码为本页制作时点的记载（与各登录机关最新公开信息的核对未经核实）。",
    faqLabel: "FAQ",
    faqHeading: "文京区的继承不动产，常见疑问",
    faqItems: [
      {
        question: "在文京区继承了不动产，该从什么开始？",
        answer:
          "一般的流程是：①确认有无遗嘱、②确定继承人与继承财产、③遗产分割协议、④继承登记、⑤决定管理・活用・出售的方针。由于继承的接受・放弃设有3个月的熟虑期间（民法第915条第1项），建议尽早梳理整体情况更为安心。需要办理手续时，将与合作的专业人士协作为您提供指引。",
      },
      {
        question: "继承登记有期限吗？",
        answer:
          "有。自2024年4月1日起继承登记的申请已义务化，原则上须自知悉取得不动产之日起3年以内申请（不动产登记法第76条之2第1项）。在此之前继承而尚未登记的不动产同样属于对象，宽限期限为2027年3月31日。无正当理由怠于申请的，可能被处10万日元以下的过料（行政罚款）（同法第164条第1项）。",
      },
      {
        question: "继承的老家一直空置不管，会怎么样？",
        answer:
          "除了建筑物的损伤与老化会不断加剧外，固定资产税等维持费用也会每年持续发生。管理不善的空置房屋，依据空家等对策特别措置法可能成为市区町村指导・劝告等的对象；一旦受到劝告，固定资产税的住宅用地特例可能被解除。即使“还无法决定”，也建议尽早建立管理体制。",
      },
      {
        question: "出售与出租（活用），哪个划算？",
        answer:
          "无法一概而论。最优解会因地段・楼龄・是否需要修缮、对整笔资金的需求、税负、家人的想法而不同。四葉不動産会用数字比较“出售的情况”与“出租的情况”双方，再与您一起选出全家人都能接受的出口。",
      },
      {
        question: "继承的不动产，其价值要怎么查？",
        answer:
          "可以参考的，是国税厅公布的路线价（遗产税评估的基础）与公示地价。不过实际能成交的价格（实际成交价格）通常与这些数字不同。反映文京区内交易行情的个别估价由本公司承接，请通过联系我们提出委托。",
      },
      {
        question: "以共有名义继承的不动产也能出售吗？",
        answer:
          "只要共有人全体同意即可出售。仅出售自己的份额也有可能，但实际上买方有限、价格方面也容易吃亏。若需要整理遗产分割协议（民法第907条第1项），将与合作的专业人士协作为您说明推进方式。",
      },
      {
        question: "遗产税的申报与登记手续，也可以一并咨询吗？",
        answer:
          "可以。四葉不動産负责的是不动产的管理・活用・出售；登记・税务・继承手续，则分别与合作的专业人士（行政书士・司法书士・税理士等）协作推进。另外，若需要申报遗产税，期限为自知悉继承开始之日的翌日起10个月以内（相续税法第27条第1项）。",
      },
      {
        question: "住在远方，无法亲自去看文京区的老家。可以协助吗？",
        answer:
          "可以。作为在文京区小日向设有事务所的本地公司，从现场状况的确认与汇报，到管理・出售的安排，都能以无需您亲自前来的方式协助。也可通过电话・电子邮件・在线方式沟通。",
      },
      {
        question: "咨询需要费用吗？营业时间是什么时候？",
        answer:
          "咨询免费。事务所位于文京区小日向４丁目２－５ 小日向安田ビル ２０３（距茗荷谷站步行约5分钟），营业时间为10:00〜18:00（周二・周三休息）。若正式委托出售或管理，相关费用必定在办理手续前明确告知。",
      },
    ],
    exitLabel: "3种选择",
    exitHeading: "继承不动产的3种出口——管理・活用・出售",
    exitLead:
      "不必现在立刻选定其中一种。我们先把3种选项并列比较，从协助您选出符合家人情况的出口开始。",
    exitCards: [
      {
        id: "management",
        title: "管理",
        description:
          "“维持・管理”是还无法立刻决定出售或出租时的选项。空置房屋若放置不管，建筑物的损伤会不断加剧；管理不善时，也可能成为依据空家法进行指导等的对象。作为文京区的本地公司，我们将为您提案在保持资产价值的同时思考下一步的管理方法。",
      },
      {
        id: "utilization",
        title: "活用",
        description:
          "文京区的不动产邻近车站与学校，通过出租等活用方式，有机会转变为收益来源。我们会把是否需要装修、预估租金、所需费用与精力都纳入，试算“出租的情况”的收支，并与出售的情况用数字比较，和您一起研究适合家人的活用方式。",
      },
      {
        id: "sale",
        title: "出售",
        description:
          "没有居住的打算、维持费与税负沉重、想在继承人之间分配——这些时候，出售就是务实的出口。从依据文京区以及丰岛区（大塚・巢鸭・驹込・池袋等）行情的估价，到出售相关手续的安排，均与合作的专业人士（行政书士・司法书士・税理士等）协作推进。像是“文京区的老家与丰岛区的出租房”这种物件横跨不同区的继承，也会一并估价。继承而来的整栋公寓・大楼等收益不动产的出售，也欢迎咨询。",
      },
    ],
    internalHeading: "建议一并浏览的页面",
    internalLinks: [
      {
        href: "/services",
        label: "服务一览",
        description:
          "继承不动产的管理・活用・出售等，四葉不動産能协助的全貌请见此处。",
      },
      {
        href: "/about",
        label: "公司简介",
        description:
          "介绍作为文京区小日向本地公司的公司信息，以及代表・浦松 丈二的简历。",
      },
      {
        href: "/column",
        label: "专栏",
        description:
          "以文章解说继承登记・空置房屋・出售时机等，与继承不动产有关的疑问。",
      },
      {
        href: "/contact",
        label: "联系我们",
        description:
          "继承不动产的咨询・估价委托请由此。也载有所在地与营业时间的信息。",
      },
    ],
    sourcesHeading: "依据・出处",
    sources: [
      "不动产登记法（平成16年法律第123号）第76条之2第1项——自知悉因继承取得所有权之日起3年以内申请继承登记的义务。由令和3年法律第24号修正新设，2024年（令和6年）4月1日施行。",
      "不动产登记法第164条第1项——无正当理由怠于申请的，处10万日元以下的过料（行政罚款）。",
      "于施行日（2024年4月1日）之前继承且尚未登记的不动产，其申请期限至2027年（令和9年）3月31日（修正法附则的过渡措施。出处：法务省《相続登記の申請義務化について》）。",
      "民法第915条第1项——继承的接受・放弃之熟虑期间（自知悉继承已为自己开始之时起3个月以内）。",
      "民法第907条第1项——共同继承人间的遗产分割协议。",
      "相续税法第27条第1项——遗产税的申报期限（自知悉继承开始之日的翌日起10个月以内）。",
      "空家等对策之推进相关特别措置法（平成26年法律第127号）——对“管理不全空家等”的指导・劝告等，由令和5年法律第50号修正引入，2023年（令和5年）12月13日施行（出处：国土交通省）。",
      "国税厅《路線価図・評価倍率表》（遗产税评估的基础资料）。",
    ],
    sourcesNote:
      "※各法令的最终修正日期，在本页制作时点未逐一核实（未经核实）。本页以提供一般信息为目的，不进行个别的法律判断・税额计算。最终判断请向具备资格的专业人士（合作的专业人士）确认。",
    repBio:
      "曾以每日新闻记者的身份走访国内外现场，并担任中国总局长，之后在家乡・文京区小日向经营四葉不動産。继承不动产的咨询，往往从整理不动产・手续・家人情况相互交织的状态开始。以采访培养出的倾听・梳理・浅显传达的能力，加上宅地建物取引士・行政书士的知识为基础，从最初的一步到出口陪伴您。需要办理手续时，将与合作的专业人士协作提供协助。",
    repRole: "代表",
    ctaHeading: "欢迎先轻松咨询",
    ctaLead:
      "关于继承的不动产，从一句“这该怎么办？”开始就可以。欢迎到文京区小日向的事务所（距茗荷谷站步行约5分钟・10:00〜18:00・周二・周三休息）咨询，也可在线咨询。",
    ctaLine: "通过代表的LINE咨询",
    ctaContact: "联系我们",
    ctaLineNote:
      "LINE将直接连接到代表・浦松 丈二的个人账号。从一句“这个物件怎么样？”开始，欢迎随时联系。",
  },
};

export default async function SouzokuPageContent() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;

  // 相続テーマの関連コラム（内部リンク）。該当が無ければ節ごと非表示。
  const relatedColumns = filterColumnsByTheme(
    (await getColumns(locale)).map((col) => getLocalizedColumn(col, locale)),
    "souzoku",
  );

  return (
    <div>
      {/* ─── JSON-LD ─── */}
      <ArticleJsonLd
        businessKey="realestate"
        title={c.articleTitle}
        description={c.articleDesc}
        path="/souzoku"
        datePublished="2026-07-07"
        dateModified="2026-07-07"
      />
      <FAQJsonLd items={c.faqItems} />
      <BreadcrumbJsonLd
        businessKey="realestate"
        items={[
          { name: c.breadcrumbHome, href: "/" },
          { name: c.breadcrumbCurrent, href: "/souzoku" },
        ]}
      />

      {/* ─── Hero／結論ブロック ─── */}
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div
          className="pointer-events-none absolute inset-0 bg-green-gradient"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
            {c.heroLabel}
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
            {c.h1Top}
            <span className="mt-3 block text-xl sm:text-2xl md:text-3xl">
              {c.h1Sub}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
            {c.heroLead}
          </p>
        </div>
      </section>

      {/* ─── 担当する事業者（2026-08-05・定点#3対策） ───
          型B（引用〇・名指し×）の打ち手。ページは引用されているのに
          AI回答の本文に事業者名が出ないため、「だれが・どの免許/登録を持ち・
          どの範囲を担うか」を三人称の事実として、そのまま書き写せる形で置く。
          事業体をまたいで一手に引き受ける形を連想させる語は使わない（改善ループ規程 第4条）。 */}
      <section className="border-b border-border py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
            {c.providerLabel}
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            {c.providerHeading}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-text-muted sm:text-base">
            {c.providerLead}
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-dim">
                  <th className="border border-border px-3 py-2 text-left font-bold">
                    {c.providerColEntity}
                  </th>
                  <th className="border border-border px-3 py-2 text-left font-bold">
                    {c.providerColLicense}
                  </th>
                  <th className="border border-border px-3 py-2 text-left font-bold">
                    {c.providerColScope}
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.providerRows.map((row) => (
                  <tr key={row.entity}>
                    <td className="border border-border px-3 py-2 align-top font-bold">
                      {row.entity}
                    </td>
                    <td className="border border-border px-3 py-2 align-top leading-relaxed text-text-muted">
                      {row.license}
                    </td>
                    <td className="border border-border px-3 py-2 align-top leading-relaxed text-text-muted">
                      {row.scope}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-text-muted">
            {c.providerNote}
          </p>
        </div>
      </section>

      {/* ─── H2疑問文FAQ（一問一答） ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              {c.faqLabel}
            </p>
            {/* AIO設計上、各質問文をH2にするため、セクション見出しは装飾テキスト（p）に留める */}
            <p className="mt-3 text-2xl font-bold sm:text-3xl">
              {c.faqHeading}
            </p>
          </div>
          <div className="mt-10 space-y-4 sm:mt-14">
            {c.faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-border bg-surface p-4 sm:p-6"
              >
                <summary className="cursor-pointer list-none">
                  <h2 className="inline text-base font-bold leading-relaxed sm:text-lg">
                    {item.question}
                  </h2>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3つの出口カード（管理・活用・売却） ─── */}
      <section className="bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              {c.exitLabel}
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {c.exitHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
              {c.exitLead}
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6">
            {c.exitCards.map((card) => {
              const Icon = EXIT_ICONS[card.id];
              return (
                <div
                  key={card.id}
                  id={card.id}
                  className="gradient-border rounded-xl bg-surface p-5 sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 内部リンク束 ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            {c.internalHeading}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {c.internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="gradient-border block rounded-xl bg-surface p-5 transition-colors hover:text-primary"
              >
                <span className="inline-flex items-center gap-1 text-sm font-bold">
                  {link.label}
                  <ArrowRight size={14} />
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-text-muted">
                  {link.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 根拠欄 ─── */}
      <section className="border-t border-border py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold">{c.sourcesHeading}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
            {c.sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-text-muted">
            {c.sourcesNote}
          </p>
        </div>
      </section>

      {/* ─── 代表者カード ─── */}
      <section className="bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="gradient-border overflow-hidden rounded-2xl bg-surface p-5 sm:p-8 md:p-12">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <div className="h-40 w-32 shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src="/uramatsu.png"
                  alt={SHARED_ORG_INFO.representative}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm leading-[1.9] text-text-muted">
                  {c.repBio}
                </p>
                <div className="mt-6">
                  <p className="text-base font-bold">
                    {SHARED_ORG_INFO.representative}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">{c.repRole}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 関連コラム ─── */}
      <RelatedColumnsSection columns={relatedColumns} locale={locale} />

      {/* ─── 当社が対応できないこと（B-4・お問い合わせ導線の手前・全ロケール） ───
          2026-08-09：日本語版のみのゲートを外した（2026-07-19 浦松指示の反映漏れ）。 */}
      <div className="pb-14 sm:pb-20 md:pb-28">
        <CannotHandle locale={locale} />
      </div>

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-green-gradient py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            {c.ctaHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            {c.ctaLead}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LineLink
              location="page_cta"
              page="souzoku"
              className="gradient-line inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
            >
              <MessageCircle size={16} />
              {c.ctaLine}
            </LineLink>
            {/* 2026-07-27：?intent=souzoku ＝フォームの相談内容に
                「相続した不動産のこと（貸す・売る・活用する）」をプリセットする。
                このページはAIモード#2で筆頭引用を取れている最大の入口なので、
                着地後に「その他」を選ばせない。LocaleLinkがロケール接頭辞を付与し、
                クエリはそのまま保持される（addLocalePrefixは前方に付けるだけ）。 */}
            <Link
              href="/contact?intent=souzoku"
              className="cta-gradient-outline inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold transition-all duration-200 hover:brightness-110"
            >
              {c.ctaContact}
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-xs leading-relaxed text-text-muted">
            {c.ctaLineNote}
          </p>
        </div>
      </section>
    </div>
  );
}
