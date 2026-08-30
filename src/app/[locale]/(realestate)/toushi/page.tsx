// /toushi（型A・柱Bピラー）＝原稿_不動産 #2
// クロスリンク＝C3（→/legal/services/shogai-fukushi）がpathで自動表示（独立受任注記付き）。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/access page.tsx）。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳（不動產・繼承・團體家屋・文京區）／zh=大陸表記。
// serviceName（JSON-LD Service name）・href・画像パス・Placeholder reason＝ja固定。金額・率＝全ロケール不変。
import type { Metadata } from "next";
import { buildPageMetadata, BCP47_BY_LOCALE } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";
import { getColumns, getLocalizedColumn, filterColumnsByTheme } from "@/lib/columns";
import type { LangCode } from "@/config/languages";

// ─── B-4（2026-07-19浦松検収済み・日本語版のみ）─────────────────────────
// 冒頭の回答ブロック（H1直下・168字）＝誰に・何を・どの地域で・誰が担当・分離受任を1段落に収める。
// 「収益物件」は本ページの3本柱の一つとして既出（対応範囲はPlaceholder＝浦松確認待ち）。
const JA_ANSWER_BLOCK =
  "文京区で投資用・事業用の不動産をお探しなら、まず物件そのものではなく事業の目的から要件を整理します。グループホーム向け物件、社宅・法人賃貸、収益物件のいずれも、用途に合うかどうかで判断が変わるためです。四葉不動産株式会社が物件の調査・提案・仲介を担当し、事業者指定や許認可の申請書類の作成は併設の四葉行政書士事務所が別契約で受任します。";

// FAQPage＝B-3の40問から投資・事業用に関連する4問を参照（文字列コピー禁止＝表記ゆれ防止）
const JA_FAQ_QUESTIONS = [
  "社宅用の物件を探してもらえますか？",
  "事業用物件の許認可（飲食・古物など）も相談できますか？",
  "グループホーム向けの物件はどう探せばいいですか？",
  "物件探しと指定申請の担当はどう分かれますか？",
];

type ToushiCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  heroAlt: string;
  h1: string;
  /** 冒頭の回答ブロック（H1直下・§D 2026-07-20で全ロケール化） */
  answerBlock: string;
  lead: React.ReactNode;
  internalLinks: { href: string; label: string }[];
  crossLinkLead: string;
  relatedAria: string;
  relatedHeading: string;
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
  sections: (locale: LangCode) => React.ReactNode;
  /** FAQ（§C 2026-07-20で全ロケール化）。見出し・aria・設問。 */
  faqHeading: string;
  faqAria: string;
  /** en/zh-tw/zh のみ。ja は pickFaqJa を使う（faqJa 参照＝サイト内で文言一致）。 */
  faq?: FaqItem[];
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
    answerBlock: JA_ANSWER_BLOCK,
    lead: (
      <p>
        四葉不動産株式会社は、<strong>投資用・事業用の不動産</strong>を扱います。中心は3つ——<strong>グループホーム（障害福祉事業所）に使える物件</strong>、<strong>社宅・法人賃貸</strong>、<strong>収益物件</strong>です。共通するのは「物件そのもの」ではなく<strong>事業の目的から逆算して選ぶ</strong>こと。用途に合わない物件は、安くても高い買い物になります。四葉不動産は、目的・要件・収支の順に整理してご提案します。
      </p>
    ),
    internalLinks: [
      { href: "/toushi/group-home", label: "グループホーム物件" },
      { href: "/column/yosekiritsu-hosei-tochine", label: "土地値と容積率の考え方" },
      { href: "/shataku", label: "借り上げ社宅の導入" },
      // 2026-07-24：定点#15強化（内部リンク補強）。ja本文のみ追加＝/officeはja先行公開のため他ロケールは対象外。
      { href: "/office", label: "会社設立とオフィス開設の完全ガイド" },
      // 2026-07-27：定点#32（非居住者オーナー）強化。ja本文のみ追加＝/kaigai-ownerはja先行公開のため他ロケールは対象外。
      { href: "/kaigai-owner", label: "非居住者オーナーの賃貸・管理" },
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
    faqHeading: "よくある質問",
    faqAria: "よくあるご質問",
    sections: (locale) => (
      <>
        <div>
          <ReH2>どんな投資・事業用不動産を扱っていますか？</ReH2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            <li>
              <strong>グループホーム・障害福祉事業所向け物件</strong>——指定基準を見据えた物件選び →{" "}
              <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">グループホームに使える物件探し</Link>
            </li>
            {/* 10C：社宅は福利厚生にあたるため /toushi 配下から外し /shataku に統一した。
                項目が消えたように見えないよう、位置づけを1文で明示する（指示書10C STEP 7） */}
            <li>
              <strong>社宅・法人賃貸</strong>——外国人従業員の住居手配も多言語で →{" "}
              <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">借り上げ社宅の導入ガイド</Link>
              <span className="mt-1 block text-xs text-text-muted">
                従業員の住まいとして社宅を導入する場合は、借り上げ社宅の導入ガイドをご覧ください（社宅は福利厚生にあたるため、事業用不動産とは別のページにまとめています）。
              </span>
            </li>
            <li>
              <strong>収益物件（区分・一棟）</strong>——区分・一棟いずれも。エリアは東京都内、価格帯はご相談ください
            </li>
            <li>
              <strong>対応エリア</strong>——媒介は文京区とその周辺。投資用・収益物件は東京都内
            </li>
          </ul>
        </div>

        <div>
          <ReH2>業種ごとに、物件で先に確認することは何ですか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            業種によって、物件で先に効く条件が違います。用途地域で決まるもの、面積や構造設備の基準で決まるもの、前面道路や消防で決まるもの。内装が終わってから基準に足りないと分かると、やり直しになります。<strong>契約前に確認できることを、業種ごとに整理しています。</strong>
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            <li>
              <strong>介護事業所</strong>——用途地域と消防法、大家さんの誤解 →{" "}
              <Link href={addLocalePrefix("/column/kaigo-jigyousho-bukken-youto-chiiki", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>グループホーム・障害福祉事業所</strong>——指定基準を見据えた物件選び →{" "}
              <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>放課後等デイサービス</strong>——用途地域・1階・面積・採光 →{" "}
              <Link href={addLocalePrefix("/column/houkago-day-bukken-youto-chiiki-1kai", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>小規模保育事業</strong>——用途地域と面積 →{" "}
              <Link href={addLocalePrefix("/column/hoiku-shoukibo-bukken-youto-chiiki", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>サービス付き高齢者向け住宅</strong>——各戸25㎡・バリアフリーの登録基準 →{" "}
              <Link href={addLocalePrefix("/column/sakoju-bukken-youken-toroku", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>クリニック</strong>——用途地域・用途変更・開設届の順番 →{" "}
              <Link href={addLocalePrefix("/column/clinic-bukken-youto-chiiki-kaisetsu-todokede", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>鍼灸院・整骨院</strong>——施術室6.6㎡・待合室3.3㎡と開設届 →{" "}
              <Link href={addLocalePrefix("/column/shinkyu-seikotsuin-bukken-youto-hokenjo-todokede", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>調剤薬局</strong>——面積・調剤室・清潔区域 →{" "}
              <Link href={addLocalePrefix("/column/yakkyoku-bukken-youken-kozo-setsubi", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>美容室・理容所</strong>——保健所の構造設備基準 →{" "}
              <Link href={addLocalePrefix("/column/biyoshitsu-riyojo-bukken-hokenjo-todokede", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>トリミング・ペットショップ</strong>——第一種動物取扱業の飼養施設 →{" "}
              <Link href={addLocalePrefix("/column/doubutsu-toriatsukai-bukken-youken", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>運送業</strong>——営業所・車庫・前面道路 →{" "}
              <Link href={addLocalePrefix("/column/unsou-eigyosho-shako-bukken-yoken", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>民泊</strong>——条例の区域・管理規約・消防設備 →{" "}
              <Link href={addLocalePrefix("/column/minpaku-bukken-joken-kakunin", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>飲食店の居抜き</strong>——契約前に保健所へ →{" "}
              <Link href={addLocalePrefix("/column/inuki-bukken-keiyakumae-hokenjo", locale)} className="text-primary underline">くわしく</Link>
            </li>
            <li>
              <strong>会社設立・オフィス</strong>——事務所要件と許認可の関係 →{" "}
              <Link href={addLocalePrefix("/office", locale)} className="text-primary underline">くわしく</Link>
            </li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            物件の調査・媒介および売買・賃貸借契約は四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304号）が、届出・許認可など官公署に提出する書類の作成は四葉行政書士事務所が承ります。この2つはそれぞれ独立した事業体で、別々にご契約いただきます。当社・当事務所は紹介料・送客手数料を受け取ることも支払うこともありません。可否の最終確認は、所管の行政庁・保健所・消防署の窓口で行います。
          </p>
        </div>

        <div>
          <ReH2>なぜ四葉不動産に相談するのですか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            理由は「隣」にあります。グループホームの開設には物件のほかに<strong>事業者指定の申請</strong>が、外国人従業員の受け入れには<strong>在留資格</strong>が必要です。四葉不動産の関連事業には、これらを扱う四葉行政書士事務所があるため、<strong>物件確保からその後の手続きまでを見据えた相談</strong>ができます。物件は四葉不動産株式会社が、指定申請などの手続きは四葉行政書士事務所が、それぞれ別契約で受任します。ご相談の入口は共通です。
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
    answerBlock:
      "If you are looking for investment or business-use real estate in Bunkyo, we begin not from the property itself but from the purpose of your business, and organize the requirements from there. Whether it is a property for a group home, company housing and corporate leasing, or an income property, the right choice changes depending on whether it fits the intended use. Yotsuba Real Estate Co., Ltd. handles the investigation, proposal, and brokerage of the property, while the preparation of application documents for service-provider designation and other permits and licenses is undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office).",
    lead: (
      <p>
        Yotsuba Real Estate Co., Ltd. handles <strong>real estate for investment and business use</strong>. Our focus is threefold: <strong>properties usable for group homes (disability-welfare facilities)</strong>, <strong>company housing & corporate leasing</strong>, and <strong>income properties</strong>. What they have in common is that we <strong>select by working backward from the purpose of the business</strong>—not from the property itself. A property that does not fit its intended use is an expensive purchase, however cheap it may be. Yotsuba Real Estate sorts things out in the order of purpose, requirements, and income and expenses before making a proposal.
      </p>
    ),
    internalLinks: [
      { href: "/toushi/group-home", label: "Group-Home Properties" },
      { href: "/column/yosekiritsu-hosei-tochine", label: "Land Value and Floor Area Ratio" },
      { href: "/shataku", label: "Company Housing & Corporate Leasing" },
      { href: "/access", label: "Access & Fees" },
    ],
    crossLinkLead:
      "Opening a group home requires an application for service-provider designation in addition to the property. Designation applications are handled by our affiliated business, 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office).",
    relatedAria: "Related links",
    relatedHeading: "Related links on this page",
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time Licensed Real Estate Transaction Specialist (宅地建物取引士); Gyoseishoshi (Administrative Scrivener). Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
    faqHeading: "Frequently Asked Questions",
    faqAria: "Frequently asked questions",
    faq: [
      {
        q: "Can you find a property for company housing?",
        a: "Yes. Yotsuba Real Estate Co., Ltd. handles company-housing arrangements and corporate leasing for businesses and facilities. We ask about your budget, area, and move-in timing, and support you, including advice on the type of contract.",
      },
      {
        q: "Can I also consult about permits and licenses for business-use properties (restaurants, secondhand goods, etc.)?",
        a: "Yotsuba Real Estate Co., Ltd. takes care of finding the property. The preparation and submission of application documents to public offices, such as business permits, is undertaken under a separate contract by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office) (an independent business entity; no referral fees are exchanged). Because a property's conditions can affect permits and licenses, we recommend consulting us early.",
      },
      {
        q: "How should I look for a property for a group home?",
        a: "Yotsuba Real Estate Co., Ltd. supports the search for properties used for group homes (communal-living support) and the like. Unlike an ordinary home search, it must proceed alongside checks tied to the designation standards—use, location, fire safety, and so on—so it goes more smoothly if you consult us from the business-planning stage. We proceed while confirming matters with specialists such as a Gyoseishoshi (Administrative Scrivener).",
      },
      {
        q: "How are the roles for finding a property and for the designation application divided?",
        a: "Finding and brokering the property is undertaken by Yotsuba Real Estate Co., Ltd., a licensed real estate broker, and the preparation and submission of documents for the designation application by the affiliated 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office)—each under a separate contract. The two are independent business entities, with separate contracts and separate fees. With the division of roles made clear, we coordinate on the checks that are needed.",
      },
    ],
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
              <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">Company Housing & Corporate Lease Support</Link>
            </li>
            <li>
              <strong>Income properties (condominium units & whole buildings)</strong>—both units and whole buildings, within Tokyo. Price range: please ask
            </li>
            <li>
              <strong>Service area</strong>—brokerage in Bunkyo City and the surrounding area; investment and income properties throughout Tokyo
            </li>
          </ul>
        </div>

        <div>
          <ReH2>What should you check first about a property, by type of business?</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            The condition that bites first differs by the type of business. Some are settled by the use district, some by floor area and structural-equipment standards, some by the road frontage or by fire safety. Finding out after the interior work is done that the standards are not met means doing it over. <strong>We have set out, by type of business, what can be checked before you sign.</strong>
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            <li>
              <strong>Group homes & disability-welfare facilities</strong>—property selection with the designation standards in view →{" "}
              <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>After-school day services</strong>—use district, ground floor, floor area, daylighting →{" "}
              <Link href={addLocalePrefix("/column/houkago-day-bukken-youto-chiiki-1kai", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>Small-scale childcare</strong>—use district and floor area →{" "}
              <Link href={addLocalePrefix("/column/hoiku-shoukibo-bukken-youto-chiiki", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>Housing with services for the elderly</strong>—25 m2 per unit and the barrier-free registration standards →{" "}
              <Link href={addLocalePrefix("/column/sakoju-bukken-youken-toroku", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>Clinics</strong>—use district, change of use, and the order of the opening notification →{" "}
              <Link href={addLocalePrefix("/column/clinic-bukken-youto-chiiki-kaisetsu-todokede", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>Acupuncture & judo-therapy clinics</strong>—a 6.6 m2 treatment room, a 3.3 m2 waiting room, and the notification →{" "}
              <Link href={addLocalePrefix("/column/shinkyu-seikotsuin-bukken-youto-hokenjo-todokede", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>Dispensing pharmacies</strong>—floor area, dispensing room, clean zone →{" "}
              <Link href={addLocalePrefix("/column/yakkyoku-bukken-youken-kozo-setsubi", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>Hair & barber salons</strong>—the structural-equipment standards set by the public health center →{" "}
              <Link href={addLocalePrefix("/column/biyoshitsu-riyojo-bukken-hokenjo-todokede", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>Grooming & pet shops</strong>—housing facilities under a Class 1 animal-handling business →{" "}
              <Link href={addLocalePrefix("/column/doubutsu-toriatsukai-bukken-youken", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>Trucking</strong>—the business office, the garage, and the road frontage →{" "}
              <Link href={addLocalePrefix("/column/unsou-eigyosho-shako-bukken-yoken", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>Restaurants in a second-hand fit-out</strong>—go to the public health center before you sign →{" "}
              <Link href={addLocalePrefix("/column/inuki-bukken-keiyakumae-hokenjo", locale)} className="text-primary underline">Read more</Link>
            </li>
            <li>
              <strong>Company formation & offices</strong>—office requirements and how they relate to permits →{" "}
              <Link href={addLocalePrefix("/office", locale)} className="text-primary underline">Read more</Link>
            </li>
          </ul>
          <p className="mt-2 text-xs text-text-muted">Only articles published in this language are listed here.</p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Investigating and brokering the property, and the sale or lease contract, are undertaken by 四葉不動産株式会社 (Real Estate Broker License, Governor of Tokyo (1) No. 113304). The preparation of documents submitted to public offices is undertaken by 四葉行政書士事務所. The two are independent business entities and are engaged under separate contracts. Neither receives or pays referral fees. Final confirmation is made at the counter of the competent administrative agency, public health center, or fire department.
          </p>
        </div>

        <div>
          <ReH2>Why consult Yotsuba Real Estate?</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            The reason is right next door. Opening a group home requires, in addition to the property, an <strong>application for service-provider designation</strong>; accepting international employees requires <strong>residence status</strong>. Yotsuba Real Estate&apos;s affiliated businesses include 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office), which handles both—so you can <strong>consult with the whole path in view, from securing the property to the procedures that follow</strong>. The property is handled by Yotsuba Real Estate Co., Ltd. and the designation application by Yotsuba Gyoseishoshi Office, each engaged under a separate contract. Your first inquiry can start in one place.
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
    answerBlock:
      "在文京區尋找投資用・事業用不動產時，我們不從物件本身、而是從事業目的著手整理要件。無論是團體家屋用物件、員工宿舍・法人租賃，還是收益物件，都會因是否符合用途而使判斷不同。物件的調查・提案・仲介由四葉不動産株式会社負責，事業者指定及許認可的申請文件製作，則由併設的四葉行政書士事務所另行簽訂契約承辦。",
    lead: (
      <p>
        四葉不動産株式会社經手<strong>投資用・事業用不動產</strong>。核心為三類——<strong>可用於團體家屋（障礙福祉事業所）的物件</strong>、<strong>員工宿舍・法人租賃</strong>、<strong>收益物件</strong>。三者的共通點，不在「物件本身」，而是<strong>從事業目的反向推算來選擇</strong>。不合用途的物件，再便宜也是昂貴的買賣。四葉不動産依目的・要件・收支的順序整理後為您提案。
      </p>
    ),
    internalLinks: [
      { href: "/toushi/group-home", label: "團體家屋物件" },
      { href: "/column/yosekiritsu-hosei-tochine", label: "土地價格與容積率的關係" },
      { href: "/shataku", label: "員工宿舍・法人租賃" },
      { href: "/access", label: "交通與費用" },
    ],
    crossLinkLead:
      "開設團體家屋，除了物件之外，還需要事業者指定的申請。指定申請由關聯事業的四葉行政書士事務所承辦。",
    relatedAria: "相關連結",
    relatedHeading: "本頁相關連結",
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士。行政書士。曾任每日新聞中國總局長（記者資歷34年）・曾派駐中國、台灣、泰國。已通過社會保險勞務士考試（預定2026年9月開業）。",
    faqHeading: "常見問題",
    faqAria: "常見問題",
    faq: [
      {
        q: "可以幫忙尋找員工宿舍用的物件嗎？",
        a: "可以。四葉不動産株式会社對應企業・設施的員工宿舍安排與法人租賃。我們會詢問您的預算・區域・入住時期，並連同契約形式的諮詢一併提供支援。",
      },
      {
        q: "事業用物件的許認可（餐飲・舊物等）也能諮詢嗎？",
        a: "物件的尋找由四葉不動産株式会社承接。營業許可等向官署提交的申請文件製作・提出，由併設的四葉行政書士事務所另行簽訂契約承辦（獨立事業體・不收受介紹費等）。由於物件的條件有時會影響許認可，建議及早諮詢。",
      },
      {
        q: "團體家屋用的物件該怎麼找？",
        a: "四葉不動産株式会社會協助尋找團體家屋（共同生活援助）等用途的物件。與一般找房不同，需要一邊確認用途・地點・消防等與指定基準相關的事項一邊進行，因此從事業計畫階段就開始諮詢會更順利。我們會與行政書士等專家一同確認後推進。",
      },
      {
        q: "物件的尋找與指定申請的負責如何分工？",
        a: "物件的尋找・仲介由身為宅建業者的四葉不動産株式会社承接，指定申請的文件製作・提出則由併設的四葉行政書士事務所承接，各自另行簽訂契約。兩者為獨立事業體，契約與費用皆各自分開。在明確分工的前提下，必要的確認會相互協同進行。",
      },
    ],
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
              <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">員工宿舍・法人租賃支援</Link>
            </li>
            <li>
              <strong>收益物件（區分・整棟）</strong>——區分・整棟皆可承辦。區域為東京都內，價格帶請洽詢
            </li>
            <li>
              <strong>服務區域</strong>——仲介為文京區及其周邊。投資用・收益物件為東京都內
            </li>
          </ul>
        </div>

        <div>
          <ReH2>依業種不同，物件要先確認什麼？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            依業種不同，物件上最先生效的條件也不同。有的由用途地域決定，有的由面積與構造設備基準決定，有的則取決於前面道路或消防。裝潢完成後才發現不符基準，就得重來。<strong>我們依業種整理了簽約前可以確認的事項。</strong>
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            <li>
              <strong>團體家屋・障礙福祉事業所</strong>——著眼指定基準的物件選擇 →{" "}
              <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>放課後兒童日間服務</strong>——用途地域・1樓・面積・採光 →{" "}
              <Link href={addLocalePrefix("/column/houkago-day-bukken-youto-chiiki-1kai", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>小規模保育事業</strong>——用途地域與面積 →{" "}
              <Link href={addLocalePrefix("/column/hoiku-shoukibo-bukken-youto-chiiki", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>附服務高齡者住宅</strong>——每戶25㎡・無障礙的登錄基準 →{" "}
              <Link href={addLocalePrefix("/column/sakoju-bukken-youken-toroku", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>診所</strong>——用途地域・用途變更・開設申報的順序 →{" "}
              <Link href={addLocalePrefix("/column/clinic-bukken-youto-chiiki-kaisetsu-todokede", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>針灸院・整骨院</strong>——施術室6.6㎡・候診室3.3㎡與開設申報 →{" "}
              <Link href={addLocalePrefix("/column/shinkyu-seikotsuin-bukken-youto-hokenjo-todokede", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>調劑藥局</strong>——面積・調劑室・清潔區域 →{" "}
              <Link href={addLocalePrefix("/column/yakkyoku-bukken-youken-kozo-setsubi", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>美容院・理容所</strong>——保健所的構造設備基準 →{" "}
              <Link href={addLocalePrefix("/column/biyoshitsu-riyojo-bukken-hokenjo-todokede", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>寵物美容・寵物店</strong>——第一種動物取扱業的飼養設施 →{" "}
              <Link href={addLocalePrefix("/column/doubutsu-toriatsukai-bukken-youken", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>運送業</strong>——營業所・車庫・前面道路 →{" "}
              <Link href={addLocalePrefix("/column/unsou-eigyosho-shako-bukken-yoken", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>餐飲店的居抜物件</strong>——簽約前先洽保健所 →{" "}
              <Link href={addLocalePrefix("/column/inuki-bukken-keiyakumae-hokenjo", locale)} className="text-primary underline">詳細</Link>
            </li>
            <li>
              <strong>公司設立・辦公室</strong>——事務所要件與許認可的關係 →{" "}
              <Link href={addLocalePrefix("/office", locale)} className="text-primary underline">詳細</Link>
            </li>
          </ul>
          <p className="mt-2 text-xs text-text-muted">此處僅列出以本語言公開的文章。</p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            物件的調查・仲介以及買賣・租賃契約，由四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304號）承辦；申報・許認可等提交行政機關的文件製作，由四葉行政書士事務所承辦。這兩者是各自獨立的事業體，請分別簽訂契約。本公司・本事務所不收取也不支付介紹費。可否的最終確認，請至主管的行政廳・保健所・消防署窗口辦理。
          </p>
        </div>

        <div>
          <ReH2>為什麼要諮詢四葉不動産？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            理由就在「隔壁」。開設團體家屋，除了物件之外還需要<strong>事業者指定的申請</strong>；接納外籍員工則需要<strong>在留資格</strong>。四葉不動産的關聯事業中，設有承辦這些業務的四葉行政書士事務所，因此<strong>從取得物件到之後的手續，都能預先規劃後諮詢</strong>。物件由四葉不動産株式会社、指定申請等手續由四葉行政書士事務所，各自另行簽訂契約承辦。諮詢的入口是共同的。
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
    answerBlock:
      "在文京区寻找投资用・事业用不动产时，我们不从物件本身、而是从事业目的着手整理要件。无论是团体家屋用物件、员工宿舍・法人租赁，还是收益物件，都会因是否符合用途而使判断不同。物件的调查・提案・中介由四葉不動産株式会社负责，事业者指定及许认可的申请文件制作，则由并设的四葉行政书士事务所另行签订合同承办。",
    lead: (
      <p>
        四葉不動産株式会社经手<strong>投资用・事业用不动产</strong>。核心为三类——<strong>可用于团体家屋（残障福祉事业所）的物件</strong>、<strong>员工宿舍・法人租赁</strong>、<strong>收益物件</strong>。三者的共通点，不在“物件本身”，而是<strong>从事业目的反向推算来选择</strong>。不合用途的物件，再便宜也是昂贵的买卖。四葉不動産按目的・要件・收支的顺序整理后为您提案。
      </p>
    ),
    internalLinks: [
      { href: "/toushi/group-home", label: "团体家屋物件" },
      { href: "/column/yosekiritsu-hosei-tochine", label: "土地价格与容积率的关系" },
      { href: "/shataku", label: "员工宿舍・法人租赁" },
      { href: "/access", label: "交通与费用" },
    ],
    crossLinkLead:
      "开设团体家屋，除了物件之外，还需要事业者指定的申请。指定申请由关联事业的四葉行政書士事務所承办。",
    relatedAria: "相关链接",
    relatedHeading: "本页相关链接",
    authorAlt: "四葉不動産株式会社 代表取缔役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取缔役・专任宅地建物取引士。行政书士。曾任每日新闻中国总局长（记者经历34年）・曾派驻中国、台湾、泰国。已通过社会保险劳务士考试（预定2026年9月开业）。",
    faqHeading: "常见问题",
    faqAria: "常见问题",
    faq: [
      {
        q: "可以帮忙寻找员工宿舍用的物件吗？",
        a: "可以。四葉不動産株式会社对应企业・设施的员工宿舍安排与法人租赁。我们会询问您的预算・区域・入住时期，并连同合同形式的咨询一并提供支援。",
      },
      {
        q: "事业用物件的许认可（餐饮・旧物等）也能咨询吗？",
        a: "物件的寻找由四葉不動産株式会社承接。营业许可等向官署提交的申请文件制作・提出，由并设的四葉行政书士事务所另行签订合同承办（独立事业体・不收受介绍费等）。由于物件的条件有时会影响许认可，建议及早咨询。",
      },
      {
        q: "团体家屋用的物件该怎么找？",
        a: "四葉不動産株式会社会协助寻找团体家屋（共同生活援助）等用途的物件。与一般找房不同，需要一边确认用途・地点・消防等与指定基准相关的事项一边进行，因此从事业计划阶段就开始咨询会更顺利。我们会与行政书士等专家一同确认后推进。",
      },
      {
        q: "物件的寻找与指定申请的负责如何分工？",
        a: "物件的寻找・中介由身为宅建业者的四葉不動産株式会社承接，指定申请的文件制作・提出则由并设的四葉行政书士事务所承接，各自另行签订合同。两者为独立事业体，合同与费用皆各自分开。在明确分工的前提下，必要的确认会相互协同进行。",
      },
    ],
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
              <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">员工宿舍・法人租赁支援</Link>
            </li>
            <li>
              <strong>收益物件（区分・整栋）</strong>——区分・整栋皆可承办。区域为东京都内，价格带请洽询
            </li>
            <li>
              <strong>服务区域</strong>——中介为文京区及周边。投资用・收益物件为东京都内
            </li>
          </ul>
        </div>

        <div>
          <ReH2>依业种不同，物件要先确认什么？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            依业种不同，物件上最先生效的条件也不同。有的由用途地域决定，有的由面积与构造设备基准决定，有的则取决于前面道路或消防。装修完成后才发现不符基准，就得重来。<strong>我们依业种整理了签约前可以确认的事项。</strong>
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            <li>
              <strong>团体家屋・残障福祉事业所</strong>——着眼指定基准的物件选择 →{" "}
              <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>放学后儿童日间服务</strong>——用途地域・1层・面积・采光 →{" "}
              <Link href={addLocalePrefix("/column/houkago-day-bukken-youto-chiiki-1kai", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>小规模保育事业</strong>——用途地域与面积 →{" "}
              <Link href={addLocalePrefix("/column/hoiku-shoukibo-bukken-youto-chiiki", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>附服务高龄者住宅</strong>——每户25㎡・无障碍的登录基准 →{" "}
              <Link href={addLocalePrefix("/column/sakoju-bukken-youken-toroku", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>诊所</strong>——用途地域・用途变更・开设申报的顺序 →{" "}
              <Link href={addLocalePrefix("/column/clinic-bukken-youto-chiiki-kaisetsu-todokede", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>针灸院・整骨院</strong>——施术室6.6㎡・候诊室3.3㎡与开设申报 →{" "}
              <Link href={addLocalePrefix("/column/shinkyu-seikotsuin-bukken-youto-hokenjo-todokede", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>调剂药局</strong>——面积・调剂室・清洁区域 →{" "}
              <Link href={addLocalePrefix("/column/yakkyoku-bukken-youken-kozo-setsubi", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>美容院・理容所</strong>——保健所的构造设备基准 →{" "}
              <Link href={addLocalePrefix("/column/biyoshitsu-riyojo-bukken-hokenjo-todokede", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>宠物美容・宠物店</strong>——第一种动物取扱业的饲养设施 →{" "}
              <Link href={addLocalePrefix("/column/doubutsu-toriatsukai-bukken-youken", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>运输业</strong>——营业所・车库・前面道路 →{" "}
              <Link href={addLocalePrefix("/column/unsou-eigyosho-shako-bukken-yoken", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>餐饮店的居抜物件</strong>——签约前先洽保健所 →{" "}
              <Link href={addLocalePrefix("/column/inuki-bukken-keiyakumae-hokenjo", locale)} className="text-primary underline">详情</Link>
            </li>
            <li>
              <strong>公司设立・办公室</strong>——事务所要件与许认可的关系 →{" "}
              <Link href={addLocalePrefix("/office", locale)} className="text-primary underline">详情</Link>
            </li>
          </ul>
          <p className="mt-2 text-xs text-text-muted">此处仅列出以本语言公开的文章。</p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            物件的调查・中介以及买卖・租赁合同，由四葉不動産株式会社（宅地建物取引业 东京都知事(1)第113304号）承办；申报・许认可等提交行政机关的文件制作，由四葉行政书士事务所承办。这两者是各自独立的事业体，请分别签订合同。本公司・本事务所不收取也不支付介绍费。可否的最终确认，请至主管的行政厅・保健所・消防署窗口办理。
          </p>
        </div>

        <div>
          <ReH2>为什么要咨询四葉不動産？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            理由就在“隔壁”。开设团体家屋，除了物件之外还需要<strong>事业者指定的申请</strong>；接纳外籍员工则需要<strong>在留资格</strong>。四葉不動産的关联事业中，设有承办这些业务的四葉行政書士事務所，因此<strong>从取得物件到之后的手续，都能预先规划后咨询</strong>。物件由四葉不動産株式会社、指定申请等手续由四葉行政书士事务所，各自另行签订合同承办。咨询的入口是共同的。
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
      answerBlock={c.answerBlock}
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
      ctaVariant="property"
    >
      {c.sections(locale)}
      {/* FAQPage JSON-LD＝B-4の例外（浦松承認）。ja設問はB-3の40問を参照＝サイト内で文言一致。
          §C（2026-07-20）：en/zh-tw/zh も c.faq を渡して全ロケール表示。inLanguage は hreflang と同一。 */}
      <Faq
        items={c.faq ?? pickFaqJa(JA_FAQ_QUESTIONS)}
        heading={c.faqHeading}
        ariaLabel={c.faqAria}
        withJsonLd
        inLanguage={BCP47_BY_LOCALE[locale]}
        bare
        openFirst={false}
      />
      <CannotHandle bare locale={locale} />
    </RealestateServicePage>
  );
}
