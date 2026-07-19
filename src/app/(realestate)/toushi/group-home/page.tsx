// /toushi/group-home（型A・バリューチェーンの入口）＝原稿_不動産 #3
// クロスリンク＝C3（→/legal/services/shogai-fukushi）がpathで自動表示。
// ※賃料水準・稼働率等の数値断定はしない（景表法・ページ割v2）。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=access/page.tsx）。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳（團體家屋・障礙福祉・文京區）／zh=大陸表記（团体家屋・残障福祉）。
// 訳語は/legal/services/shogai-fukushi・HomePageContentの既訳と統一（共同生活援助=shared-living support／指定基準=designation standards）。
// JSON-LD Service name・keywords＝ja固定（構造不変）。
// 2026-07-19 C-1（日本語版のみ）：H1・メタ・本文を5セクション構成（指定基準／契約前の確認／賃貸契約の注意点／
//   役割分担／空き家転用）に大幅拡充。回答ブロック差し替え・FAQ 5問＋新規1問（東京都の事前相談）。
//   en/zh-tw/zh はB-4時点の2セクション構成のまま（監修後に追従）。
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";
import type { LangCode } from "@/config/languages";

// ─── C-1（2026-07-19浦松検収済み・日本語版のみ）─────────────────────────
// 冒頭の回答ブロック（H1直下）。浦松指定の確定文言＝一字一句変更しないこと（B-4版から差し替え）。
// 7.43㎡＝B-3と同じ事実アンカー（自治体・事業類型により異なる旨は本文注記・FAQ側で担保）。
// 2026-07-19 C-2検収での修正：独占業務は「作成」（行政書士法1条の2・19条）＝「作成・提出は独占業務」とまとめて書かない。
const JA_ANSWER_BLOCK =
  "障害者グループホーム（共同生活援助）の物件は、障害者総合支援法や建築基準法・消防法の要件（立地・用途地域・居室7.43㎡以上・消防設備など）を契約前に確認することが重要です。四葉不動産株式会社が物件の紹介・仲介を担当し、指定申請書類の作成は行政書士の独占業務にあたるため、書類の作成・提出は併設の四葉行政書士事務所が別契約で受任します。物件と許認可を別々の事業体が担当することで、それぞれの専門性と適法性を確保します。文京区を含む東京都内に対応します。";

// FAQPage＝faqJa（B-3の5問＋C-1新規1問）を参照（文字列コピー禁止＝表記ゆれ防止）
const JA_FAQ_QUESTIONS = [
  "グループホーム向けの物件はどう探せばいいですか？",
  "立地（用途地域）の基準はありますか？",
  "居室面積の基準はありますか？",
  "物件の契約前に確認すべき点は何ですか？",
  "指定申請の書類は誰に頼めますか？",
  "東京都の事前相談はいつ行えばいい？",
];

// C-1本文の各項目に必ず付ける注記（タスク指定文言）
const JA_KIJUN_NOTE = "※自治体・類型により異なる場合があります。最新の要件は指定権者にご確認ください。";

type GroupHomeCopy = {
  metaTitle: string;
  metaDesc: string;
  crumbHome: string;
  crumbToushi: string;
  crumbCurrent: string;
  heroAlt: string;
  h1: string;
  lead: ReactNode;
  /** en/zh-tw/zh の旧2セクション構成（jaはC-1で5セクション構成に移行＝ページ側で直接描画するため未使用） */
  s1H2?: string;
  s1Note?: string;
  s1Items?: ReactNode[];
  s2H2?: string;
  s2Body?: ReactNode;
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
    // C-1：タイトルはタスク指定の完全表記（absoluteTitle: true でテンプレート非適用）
    metaTitle: "障害者グループホームの物件を探す｜指定基準を見据えた物件選び | 四葉不動産",
    metaDesc:
      "障害者グループホーム（共同生活援助）に使える物件の探し方を解説。立地・用途地域・居室面積（原則7.43㎡以上）・消防設備など、指定基準を見据えた契約前の確認ポイントと賃貸契約の注意点。物件の紹介・仲介は四葉不動産株式会社、指定申請は併設の四葉行政書士事務所が別契約で受任します。",
    crumbHome: "ホーム",
    crumbToushi: "投資用・事業用不動産",
    crumbCurrent: "グループホーム物件",
    heroAlt: "グループホームに使える物件のイメージ（住宅街の一軒家）",
    h1: "障害者グループホームに使える物件の探し方",
    lead: (
      <p>
        グループホームに使う物件は、<strong>「借りてから考える」と失敗しがちです</strong>。契約した後に基準を満たさないことが判明すると、開設の遅れや想定外の改修費の負担につながるためです。このページでは、<strong>指定基準を見据えた物件の探し方</strong>と、契約前に確認しておきたいポイントを解説します。
      </p>
    ),
    internalLinks: [
      // C-2（2026-07-19）：/toushi/shitei-shinsei との相互リンク
      { href: "/toushi/shitei-shinsei", label: "指定申請と物件の関係" },
      { href: "/ryokin", label: "料金のご案内" },
      { href: "/legal", label: "四葉行政書士事務所" },
      { href: "/faq#group-home", label: "よくある質問（グループホーム・障害福祉）" },
      { href: "/contact", label: "お問い合わせ" },
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
        With a property for a group home (shared-living support), <strong>“lease first, think later” leads to failure</strong>. Provider designation has standards for location, structure, floor area, fire-safety equipment, and more, and there are real cases where it turns out, only after the contract is signed, that designation cannot be obtained for that property. Yotsuba Real Estate Co., Ltd. helps with your property search starting from <strong>pre-contract checks with the designation standards in view</strong>. The designation application itself is handled by our affiliated business 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office), engaged under a separate contract. Having the property and the permit handled by separate business entities secures both the expertise and the legal compliance of each.
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
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time Licensed Real Estate Transaction Specialist (宅地建物取引士); Gyoseishoshi (Administrative Scrivener). Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
  },
  "zh-tw": {
    metaTitle: "尋找可作團體家屋的物件｜四葉不動産",
    metaDesc:
      "四葉不動産株式会社為您提案可用於開設團體家屋（共同生活援助）的物件。從著眼指定基準（地點・結構・面積・消防）的簽約前確認，到放眼開設後營運的物件選擇。物件由四葉不動産株式会社、手續由四葉行政書士事務所，各自另行簽訂契約承辦。",
    crumbHome: "首頁",
    crumbToushi: "投資用・事業用不動產",
    crumbCurrent: "團體家屋物件",
    heroAlt: "可作團體家屋的物件示意圖（住宅區的獨棟住宅）",
    h1: "尋找可作團體家屋的物件",
    lead: (
      <p>
        用於團體家屋（共同生活援助）的物件，<strong>「先租下來再想」很容易失敗</strong>。事業者指定對地點、結構、面積、消防設備等訂有基準，實務上確實發生過簽約後才發現「這個物件無法取得指定」的案例。四葉不動産株式会社從<strong>著眼指定基準的簽約前確認</strong>開始，協助您尋找物件。指定申請本身由關係企業四葉行政書士事務所對應，<strong>物件與申請由不同事業體分別負責</strong>，各自另行簽訂契約承辦。
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
      "四葉不動産株式会社为您提案可用于开设团体家屋（共同生活援助）的物件。从着眼指定基准（地点・结构・面积・消防）的签约前确认，到放眼开设后运营的物件选择。物件由四葉不動産株式会社、手续由四葉行政书士事务所，各自另行签订合同承办。",
    crumbHome: "首页",
    crumbToushi: "投资用・事业用不动产",
    crumbCurrent: "团体家屋物件",
    heroAlt: "可作团体家屋的物件示意图（住宅区的独栋住宅）",
    h1: "寻找可作团体家屋的物件",
    lead: (
      <p>
        用于团体家屋（共同生活援助）的物件，<strong>“先租下来再想”很容易失败</strong>。事业者指定对地点、结构、面积、消防设备等定有基准，实务中确实发生过签约后才发现“该物件无法取得指定”的案例。四葉不動産株式会社从<strong>着眼指定基准的签约前确认</strong>开始，协助您寻找物件。指定申请本身由关联企业四葉行政書士事務所对应，<strong>物件与申请由不同事业体分别负责</strong>，各自另行签订合同承办。
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
  const isJa = locale === "ja";

  return (
    <RealestateServicePage
      path="/toushi/group-home"
      answerBlock={isJa ? JA_ANSWER_BLOCK : undefined}
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
      {isJa ? (
        <>
          {/* ─── C-1 本文5セクション（2026-07-19浦松検収済み草稿・日本語版のみ） ─── */}
          {/* §1 指定基準と物件条件。根拠＝指定障害福祉サービス基準省令（平18厚労省令171号）の共同生活援助設備基準
              （立地・居室7.43㎡・共用設備）／建築基準法の用途規制／消防法施行令別表第一(6)項。
              条文番号・数値詳細は本文に出さず、各項目にJA_KIJUN_NOTEを必ず付ける（タスク指定） */}
          <div>
            <ReH2>指定基準と物件条件</ReH2>
            <p className="mt-3 leading-relaxed text-text">
              障害者グループホーム（共同生活援助）として物件を使うには、障害者総合支援法に基づく指定基準と、建築基準法・消防法の要件を満たす必要があります。代表的な確認項目は次のとおりです。
            </p>
            <ul className="mt-3 space-y-4 text-sm leading-relaxed text-text">
              <li>
                <strong>立地・用途地域</strong>：共同生活住居は、利用者の家族や地域住民との交流の機会が確保される地域にあることが求められ、入所施設や病院の敷地内は適当でないとされています。また、建築基準法では用途地域ごとに建てられる建物の用途が定められており、既存の建物をグループホームに使う場合は用途変更の手続きが必要になることがあります。
                <span className="mt-1 block text-xs text-text-muted">{JA_KIJUN_NOTE}</span>
              </li>
              <li>
                <strong>居室面積</strong>：居室の定員は原則1人、面積は収納設備等を除き原則7.43㎡以上とされています。
                <span className="mt-1 block text-xs text-text-muted">{JA_KIJUN_NOTE}</span>
              </li>
              <li>
                <strong>共用設備</strong>：共同生活住居ごとに、居間・食堂・浴室・トイレ・洗面設備など、日常生活に必要な設備を備えることとされています。
                <span className="mt-1 block text-xs text-text-muted">{JA_KIJUN_NOTE}</span>
              </li>
              <li>
                <strong>消防設備</strong>：消防法上、グループホームは福祉施設として扱われ、消火器・自動火災報知設備・誘導灯などの設置が必要になる場合があります。スプリンクラー設備の要否を含め、必要な設備は入居者の状況や建物の規模・構造により異なり、設置工事の要否は開設費用に直結します。
                <span className="mt-1 block text-xs text-text-muted">※自治体・類型により異なる場合があります。最新の要件は指定権者・消防署にご確認ください。</span>
              </li>
            </ul>
          </div>

          {/* §2 契約前の確認。事前相談の重要性＝指定基準の存在から導かれる実務上の注意（B-3 FAQと同趣旨・義務とは断定しない） */}
          <div>
            <ReH2>契約前の確認 ― 指定権者への事前相談</ReH2>
            <p className="mt-3 leading-relaxed text-text">
              指定を受けるには、物件が基準を満たしていることが前提になります。候補物件が決まったら、賃貸借契約や売買契約を結ぶ前の段階で、指定権者への事前相談を行うことが重要です。
            </p>
            <p className="mt-3 leading-relaxed text-text">
              要件を満たさない物件を先に契約してしまうと、想定外の改修費がかかる、改修しても要件を満たせず指定を受けられない、といったリスクがあります。契約後にできることは限られるため、「物件の確保」と「基準の確認」は並行して進めることをお勧めします。当社は契約前の確認事項の整理をお手伝いし、指定申請に関するご相談は併設の四葉行政書士事務所（別契約）と連携して進めます。
            </p>
          </div>

          {/* §3 賃貸契約の注意点。根拠＝民法の用法遵守義務（616条準用594条1項）・無断転貸の制限（612条）・原状回復（621条）＝条文番号は本文に出さない */}
          <div>
            <ReH2>賃貸契約の注意点</ReH2>
            <ul className="mt-3 space-y-4 text-sm leading-relaxed text-text">
              <li>
                <strong>貸主の用途承諾</strong>：住宅として貸し出されている建物をグループホームとして使うには、貸主の承諾が必要です。賃借人には契約や建物の性質に従った使い方をする義務があり、無断で事業用途に転用するとトラブルの原因になります。承諾は口頭ではなく、契約書や覚書で残しておくことが大切です。
              </li>
              <li>
                <strong>転貸・転用の制限</strong>：運営事業者が借りた物件を利用者に住まわせる形態など、事業の組み方によっては転貸に関わる整理が必要になる場合があります。賃借権の無断譲渡・無断転貸は契約解除の原因になり得るため、事業スキームを貸主に説明し、契約書上の位置づけを明確にしておきましょう。
              </li>
              <li>
                <strong>原状回復の取り決め</strong>：消防設備の設置や間仕切りの変更など、開設にあたって改修を行う場合は、退去時にどこまで元に戻すのかを契約時に取り決めておくことが重要です。取り決めがないまま改修を進めると、退去時の負担が想定を超えることがあります。
              </li>
            </ul>
          </div>

          {/* §4 役割分担（表）。分離受任・紹介料なし＝CannotHandleの浦松確定文言と同一趣旨。社労士の未開業注記は必須。表スタイル＝access/page.tsxに準拠 */}
          <div>
            <ReH2>役割分担</ReH2>
            <p className="mt-3 leading-relaxed text-text">
              物件と許認可・労務は、それぞれ独立した事業体・専門家が別契約で担当します。
            </p>
            <table className="mt-4 w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">業務</th>
                  <th className="border border-border px-3 py-2">担当</th>
                </tr>
              </thead>
              <tbody className="text-text">
                <tr>
                  <td className="border border-border px-3 py-2">物件の紹介・仲介（宅地建物取引業）</td>
                  <td className="border border-border px-3 py-2">四葉不動産株式会社</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">指定申請書類の作成・提出（作成は行政書士の独占業務・別契約）</td>
                  <td className="border border-border px-3 py-2">併設の四葉行政書士事務所</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">労務・人員配置のご相談</td>
                  <td className="border border-border px-3 py-2">四葉社会保険労務士事務所（2026年9月開業予定・現時点では未開業）</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">不動産登記</td>
                  <td className="border border-border px-3 py-2">提携司法書士をご紹介</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">税務（税務申告等）</td>
                  <td className="border border-border px-3 py-2">提携税理士をご紹介</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-text-muted">
              各事業体・専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。
            </p>
          </div>

          {/* §5 空き家の転用可能性。B-3 FAQ「相続した空き家をグループホームに使えますか？」と同一趣旨・同一の留保 */}
          <div>
            <ReH2>空き家の転用可能性</ReH2>
            <p className="mt-3 leading-relaxed text-text">
              相続した空き家を、グループホームとして活用できる場合があります。住宅街の一戸建てという立地・形状は共同生活援助の住まいと親和性があり、空き家の管理負担を活用に変える選択肢の一つです。ただし、用途地域・居室面積・消防設備など指定基準に関わる確認が必要で、基準は自治体・事業類型により異なります。相続した物件の活用をご検討の場合も、契約や改修の前の段階でご相談ください。
            </p>
            {/* C-4（2026-07-19）で有効化＝/souzoku/akiya との相互リンク */}
            <p className="mt-2 text-sm">
              <Link href="/souzoku/akiya" className="text-primary underline">相続した空き家の活用</Link>
            </p>
          </div>
        </>
      ) : (
        <>
          {/* en/zh-tw/zh＝B-4時点の2セクション構成を維持（C-1は日本語版のみ・監修後に追従） */}
          <div>
            <ReH2>{c.s1H2}</ReH2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.s1Note}</p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-text">
              {c.s1Items?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <ReH2>{c.s2H2}</ReH2>
            <p className="mt-3 leading-relaxed text-text">{c.s2Body}</p>
          </div>
        </>
      )}

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
