// /services（コンサルティング型サービス）＝原稿ドラフト_不動産サービス_コンサルティング型_v0.1（浦松承認済み・ヒーロー=A案）全面改稿（2026-07-10）
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=(legal)/legal/page.tsx）。en/zh-tw/zh=監修前ドラフト（2026-07-10）。
// 図解01対比図・02_3領域・03フロー（図解案_不動産サービス）をHTML/inline SVGで再現＝図中テキストもCOPY供給（4言語自動切替）。
// 訳語はトップ（HomePageContent）pillars のタグ訳（承継するには？/物件を探すには？/日本で暮らすには？等）と完全一致。繁体=台湾定訳（繼承/團體家屋/文京區/不動產）。
// 旧ServicesPageContent.tsxはimport解除のみ（ファイルは温存）。旧ページのFAQPage/Service JSON-LDは廃止＝BreadcrumbListはBreadcrumb部品経由のみ出力。
// 表現規程：対比は「普通の不動産業者」（一般論との対比のみ・特定他社言及なし）・実績数字なし・隣接士業（2026年9月開業予定側）の用語は全ロケール不使用。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import type { LangCode } from "@/config/languages";
import { SERVICE_NAV_CATEGORIES, resolveNavLabel, isNavLinkVisible } from "@/config/services-nav"; // 4カードの子ページチップは単一ソースを参照（メガメニュー・フッターと同じ定義）

type DiffRow = { label: string; value: string };
type FieldCard = { tag: string; title: string; body: string; linkLabel: string };
type FlowStep = { title: string; note?: string; body: string };

type ServicesCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  h1: string;
  heroSub: string;
  diff: {
    heading: string;
    p1: React.ReactNode;
    p2: string;
    diagramLead: React.ReactNode;
    cardA: { title: string; rows: DiffRow[] };
    cardB: { title: string; rows: DiffRow[] };
    note: string;
  };
  fields: { heading: string; items: [FieldCard, FieldCard, FieldCard, FieldCard] };
  flow: { heading: string; lead: string; steps: [FlowStep, FlowStep, FlowStep] };
  pricing: { heading: string; body: string };
  group: { heading: string; body: string; note: string };
};

// 図解の英字キッカー＝デザイン要素（全ロケール共通）
const KICKERS = {
  hero: "SERVICES",
  diff: "DIFFERENCE",
  fields: "4 FIELDS",
  flow: "HOW IT WORKS",
} as const;

// 4領域の遷移先（全ロケール共通・href不変）。設計書§カテゴリ設計と同じ並び＝①相続②GH開設③投資・事業用④外国人
// SERVICE_NAV_CATEGORIES（config/services-nav.ts）と同じ並び・同じhrefにすること（チップ生成でインデックス対応させるため）
const FIELD_HREFS: [string, string, string, string] = ["/souzoku", "/group-home", "/toushi", "/global"];

const COPY: Record<LangCode, ServicesCopy> = {
  ja: {
    metaTitle: "サービス｜仲介の前に「材料」を届ける不動産コンサルティング",
    metaDesc:
      "四葉不動産株式会社のサービス案内。物件の売り込みではなく、売るべきか・買うべきか・動くべきかの判断材料をそろえる、文京区・小日向のコンサルティング型不動産会社です。相続不動産・事業用/投資用・外国人の住まいの3領域を、診断→選択肢→実行の3ステップで。初回のご相談・診断は無料です。",
    breadcrumbHome: "ホーム",
    breadcrumbCurrent: "サービス",
    h1: "売る前に、考える。借りる前に、確かめる。",
    heroSub: "物件を売り込むのではなく、判断の材料をそろえる。文京区・小日向の不動産コンサルティング。",
    diff: {
      heading: "普通の不動産業者と、何が違うのか",
      p1: (
        <>
          一般的な不動産会社の仕事は、物件を「仲介」することです。だから、会話は物件から始まります。わたしたちの仕事は、そのひとつ手前から始まります。——
          <strong>その物件を、本当に売るべきか。買うべきか。そもそも動くべきか。</strong>
        </>
      ),
      p2: "四葉不動産は、元毎日新聞中国総局長（記者歴34年）の宅地建物取引士が代表を務める、コンサルティング型の不動産会社です。記者の仕事は、事実を集め、裏を取り、分かる言葉で伝えること。この方法を不動産に持ち込みました。",
      diagramLead: (
        <>
          仲介の前に、<b className="text-primary">材料</b>を届ける。——判断するのは、あなたです。
        </>
      ),
      cardA: {
        title: "一般的な不動産会社",
        rows: [
          { label: "会話の起点", value: "物件（在庫）から" },
          { label: "提案のかたち", value: "「この物件どうですか」" },
          { label: "ゴール", value: "成約" },
          { label: "情報", value: "良い面が中心" },
        ],
      },
      cardB: {
        title: "四葉不動産のコンサルティング",
        rows: [
          { label: "会話の起点", value: "あなたの事情から" },
          { label: "提案のかたち", value: "選択肢＋根拠を書面で" },
          { label: "ゴール", value: "納得（動かない結論も選択肢）" },
          { label: "情報", value: "裏取りした事実を、良し悪しごと" },
        ],
      },
      // 【要確認】相談無料の範囲＝現行運用（/faqの媒介を伴わないコンサル料金）と一致するか（原稿§1注記の浦松確認待ち）
      note: "※「動かない（売らない・買わない）」が最善なら、そのままお伝えします。仲介手数料は成約時のみ・初回のご相談は無料です。",
    },
    fields: {
      heading: "四葉のコンサルティング4領域",
      items: [
        {
          tag: "承継するには？",
          title: "相続不動産コンサルティング",
          body: "親から受け継ぐ家・土地は、「管理・活用・売却」の3つの出口から逆算して考えます。相続登記の期限（2024年4月義務化・原則3年）を起点に、税理士・司法書士・行政書士と連携して段取りを1枚に整理。感情と勘定が絡む承継を、事実で解きほぐします。",
          linkLabel: "→ 完全ガイドへ",
        },
        {
          tag: "グループホームを開くには？",
          title: "グループホーム開設コンサルティング",
          body: "共同生活援助（障害者グループホーム）の開設は、「物件」と「指定申請」が同時に動きます。指定基準（立地・構造・面積・消防）を見据えた物件の紹介・仲介は四葉不動産が、指定申請書類の作成・提出は行政書士の独占業務のため併設の四葉行政書士事務所が別契約で担当します。",
          linkLabel: "→ 完全ガイドへ",
        },
        {
          tag: "物件を探すには？",
          title: "事業用・投資用の逆算提案",
          body: "民泊・飲食店・会社設立、社宅や収益物件は、「事業の目的」から逆算しないと失敗します。業種ごとの許認可要件（消防・用途地域など）を契約前に確認するのが鉄則。物件探しは四葉不動産、指定申請・許認可は提携の行政書士（別契約）が担当し、開業から運営までを見通した物件選びをご提案します。",
          linkLabel: "→ 投資・事業用へ",
        },
        {
          tag: "日本で暮らすには？",
          title: "外国人の住まいコンサルティング",
          body: "審査・保証・言語の壁を、日本語・英語・中国語（繁体字・簡体字）で伴走します。お部屋探しだけでなく、必要書類の収集や翻訳のサポートまで。在留資格まわりはグループの行政書士事務所と連携できるので、「住まい」と「手続き」を別々に走り回る必要がありません。",
          linkLabel: "→ 多言語のお部屋探しへ",
        },
      ],
    },
    flow: {
      heading: "進め方——診断 → 選択肢 → 実行",
      lead: "急かしません。初回のご相談は無料です。",
      steps: [
        {
          title: "診断",
          note: "（初回無料）",
          body: "まずLINKA（AIコンシェルジュ）またはLINEで一言。状況を伺い、論点を整理します。",
        },
        {
          title: "選択肢の提示",
          body: "裏取りした事実に基づき、複数の選択肢と根拠を書面でお渡しします。急かしません。",
        },
        {
          title: "実行",
          body: "進める場合のみ、仲介・契約・引渡しまで代表が直接伴走します。",
        },
      ],
    },
    pricing: {
      heading: "料金の考え方",
      // 【要確認】料金詳細は/accessの料金表と整合させる（原稿§4の浦松確認待ち）
      body: "初回のご相談・診断は無料。2回目以降で、媒介を伴わないご相談（媒介以外の関連業務）は、事前のご同意のうえ30分5,500円（税込）で承ります。売買・賃貸の媒介に関するご相談は、仲介手数料の範囲で承ります。実行段階の費用（仲介手数料等・法定上限内）を含め、見積りは着手前に書面で明示し、書面にない費用は請求しません。",
    },
    group: {
      heading: "士業グループとの連携",
      body: "不動産の判断には、法務や許認可が絡みます。四葉グループには行政書士事務所（障害福祉指定申請・在留資格・相続書類・補助金）が併設されており、これらの手続きは同事務所が別契約で受任します。",
      note: "※四葉不動産株式会社と四葉行政書士事務所は、別事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。",
    },
  },
  en: {
    metaTitle: "Services | Real Estate Consulting That Delivers the Facts Before the Deal",
    metaDesc:
      "Services of Yotsuba Real Estate Co., Ltd., a consulting-style real estate company in Kohinata, Bunkyo, Tokyo. Instead of pushing properties, we prepare the material you need to decide whether to sell, buy, or move at all. Three fields—inherited property, business & investment use, and housing for international residents—in three steps: diagnosis, options, execution. Your first consultation and diagnosis are free.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Services",
    h1: "Think before you sell. Check before you rent.",
    heroSub:
      "We don't push properties—we prepare the material for your decision. Real estate consulting in Kohinata, Bunkyo, Tokyo.",
    diff: {
      heading: "What makes us different from an ordinary real estate agency?",
      p1: (
        <>
          The job of a typical real estate company is to broker properties—so the conversation starts with a property. Our work starts one step before that:{" "}
          <strong>should that property really be sold? Bought? Should you make a move at all?</strong>
        </>
      ),
      p2: "Yotsuba Real Estate is a consulting-style real estate company whose representative is a Licensed Real Estate Transaction Specialist and former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist). A journalist's job is to gather facts, verify them, and convey them in plain language. We brought that method into real estate.",
      diagramLead: (
        <>
          Before any brokerage, we deliver the <b className="text-primary">material</b>—the one who decides is you.
        </>
      ),
      cardA: {
        title: "A typical real estate company",
        rows: [
          { label: "Where the conversation starts", value: "With a property (inventory)" },
          { label: "Shape of the proposal", value: "“How about this property?”" },
          { label: "The goal", value: "Closing the deal" },
          { label: "Information", value: "Mostly the good side" },
        ],
      },
      cardB: {
        title: "Yotsuba Real Estate's consulting",
        rows: [
          { label: "Where the conversation starts", value: "With your situation" },
          { label: "Shape of the proposal", value: "Options + grounds, in writing" },
          { label: "The goal", value: "Conviction (not moving is an option, too)" },
          { label: "Information", value: "Verified facts, good and bad alike" },
        ],
      },
      note: "Note: If “not moving (not selling, not buying)” is the best answer, that is exactly what we will tell you. Brokerage fees arise only when a deal closes; your first consultation is free.",
    },
    fields: {
      heading: "Yotsuba's four consulting fields",
      items: [
        {
          tag: "Inheriting a property?",
          title: "Inherited-Property Consulting",
          body: "For a house or land inherited from your parents, we work backward from the three exits: managing, utilizing, or selling. Starting from the inheritance-registration deadline (mandatory since April 2024; three years in principle), we coordinate with tax accountants, judicial scriveners, and gyoseishoshi (administrative scriveners) to lay out the whole sequence on a single sheet—untangling a succession where feelings and finances intertwine, with facts.",
          linkLabel: "→ The complete guide",
        },
        {
          tag: "Opening a group home?",
          title: "Group Home Opening Consulting",
          body: "Opening a group home for people with disabilities (kyodo seikatsu enjo / shared-living support) means the property and the designation application move at the same time. Yotsuba Real Estate handles the property brokerage with the designation criteria (location, structure, floor area, fire safety) in mind, while Yotsuba Gyoseishoshi Office—since preparing and filing designation documents is a gyoseishoshi's exclusive practice—takes on that work under a separate engagement.",
          linkLabel: "→ The complete guide",
        },
        {
          tag: "Looking for a property?",
          title: "Working-Backward Proposals for Business & Investment Use",
          body: "Minpaku, restaurants, company setups, company housing, and income properties fail unless you work backward from the purpose of the business. Checking the licensing requirements for each industry (fire safety, zoning, and more) before signing is the golden rule. Yotsuba Real Estate handles the property search, while designation applications and licensing are handled by our partner gyoseishoshi (administrative scrivener) under a separate engagement—together proposing properties with the full view from opening to operation.",
          linkLabel: "→ Investment & business use",
        },
        {
          tag: "Living in Japan?",
          title: "Housing Consulting for International Residents",
          body: "We walk with you through screening, guarantors, and the language barrier—in Japanese, English, Traditional Chinese, and Simplified Chinese. Beyond room hunting, we also help you gather and translate the documents you need. For residence-status matters we can coordinate with our group's gyoseishoshi office, so you don't have to run around separately for “housing” and “paperwork.”",
          linkLabel: "→ Multilingual room hunting",
        },
      ],
    },
    flow: {
      heading: "How we proceed: Diagnosis → Options → Execution",
      lead: "No rushing. Your first consultation is free.",
      steps: [
        {
          title: "Diagnosis",
          note: "(first session free)",
          body: "Start with a single line via LINKA (our AI concierge) or LINE. We listen to your situation and sort out the issues.",
        },
        {
          title: "Options presented",
          body: "Based on verified facts, we hand you multiple options with their grounds, in writing. We won't rush you.",
        },
        {
          title: "Execution",
          body: "Only if you decide to proceed, our representative personally walks with you through brokerage, contract, and handover.",
        },
      ],
    },
    pricing: {
      heading: "How fees work",
      body: "Your first consultation and diagnosis are free; from the second session onward, consultations that do not involve brokerage (i.e., related work other than brokerage) are ¥5,500 (tax incl.) per 30 minutes, only with your prior consent. Consultations relating to a sale or lease we broker are covered by the brokerage commission. Costs arise at the execution stage (brokerage fees, etc., within the statutory limits). Estimates are set out in writing before we begin, and we never bill anything that is not in writing.",
    },
    group: {
      heading: "Working with our professional group",
      body: "Real estate decisions involve legal matters and licensing. The Yotsuba group includes an adjoining gyoseishoshi office (disability-welfare service designation, residence status, inheritance paperwork, subsidy applications), which takes on those procedures under a separate engagement.",
      note: "Yotsuba Real Estate Co., Ltd. and Yotsuba Gyoseishoshi Office accept engagements independently as separate business entities (no referral fees are exchanged).",
    },
  },
  "zh-tw": {
    metaTitle: "服務｜在仲介之前，先送上「材料」的不動產顧問",
    metaDesc:
      "四葉不動産株式会社的服務介紹。不是推銷物件，而是備齊「該賣・該買・該不該行動」的判斷材料——位於文京區・小日向的顧問型不動產公司。繼承不動產・事業用/投資用・外國人居住三大領域，以診斷→選項→執行三步驟進行。初次諮詢・診斷免費。",
    breadcrumbHome: "首頁",
    breadcrumbCurrent: "服務",
    h1: "出售之前，先思考。承租之前，先確認。",
    heroSub: "不是推銷物件，而是備齊判斷的材料。文京區・小日向的不動產顧問服務。",
    diff: {
      heading: "與一般不動產業者，有什麼不同",
      p1: (
        <>
          一般不動產公司的工作，是「仲介」物件，所以對話從物件開始。我們的工作，從再前面一步開始。——
          <strong>那個物件，真的該賣嗎？該買嗎？究竟該不該行動？</strong>
        </>
      ),
      p2: "四葉不動産是一家顧問型不動產公司，由曾任每日新聞中國總局長（記者資歷34年）的宅地建物取引士擔任代表。記者的工作，是蒐集事實、查證屬實、用聽得懂的語言傳達。我們把這套方法帶進了不動產。",
      diagramLead: (
        <>
          在仲介之前，先送上<b className="text-primary">材料</b>。——做判斷的，是您。
        </>
      ),
      cardA: {
        title: "一般的不動產公司",
        rows: [
          { label: "對話的起點", value: "從物件（庫存）開始" },
          { label: "提案的形式", value: "「這個物件如何？」" },
          { label: "目標", value: "成交" },
          { label: "資訊", value: "以優點為主" },
        ],
      },
      cardB: {
        title: "四葉不動産的顧問服務",
        rows: [
          { label: "對話的起點", value: "從您的狀況開始" },
          { label: "提案的形式", value: "選項＋根據，以書面提供" },
          { label: "目標", value: "信服（「不行動」也是選項）" },
          { label: "資訊", value: "查證過的事實，優缺點並陳" },
        ],
      },
      note: "※若「不行動（不賣・不買）」才是最佳解，我們會如實告訴您。仲介手續費僅於成交時發生；初次諮詢免費。",
    },
    fields: {
      heading: "四葉的顧問服務4領域",
      items: [
        {
          tag: "如何繼承不動產？",
          title: "繼承不動產顧問",
          body: "從父母繼承的房屋・土地，我們從「管理・活用・出售」三種出路反向推算來思考。以繼承登記的期限（2024年4月起義務化・原則3年）為起點，與稅理士・司法書士・行政書士合作，把流程整理成一張表——用事實，解開情感與金錢交纏的繼承課題。",
          linkLabel: "→ 前往完整指南",
        },
        {
          tag: "想開設團體家屋？",
          title: "團體家屋開設顧問",
          body: "身心障礙者團體家屋（共同生活援助）的開設，「物件」與「指定申請」是同時進行的。四葉不動産負責以指定基準（立地・結構・面積・消防）為前提的物件仲介；指定申請文件的製作・提出屬於行政書士的獨占業務，由附設的四葉行政書士事務所另行簽約承接。",
          linkLabel: "→ 前往完整指南",
        },
        {
          tag: "如何尋找物件？",
          title: "事業用・投資用的反向推算提案",
          body: "民宿、餐飲店、公司設立，以及員工宿舍、收益物件，若不從「事業目的」反向推算，就容易失敗。依業種確認許認可要件（消防・用途地域等）並在簽約前完成，是鐵則。物件的尋找由四葉不動産負責，指定申請・許認可則由合作的行政書士（另行簽約）負責，共同為您提案能看清從開設到營運全程的物件選擇。",
          linkLabel: "→ 前往投資・事業用",
        },
        {
          tag: "如何在日本生活？",
          title: "外國人的居住顧問",
          body: "審查、保證、語言的門檻，我們以日文・英文・中文（繁體・簡體）陪伴您跨過。不只找房，也協助蒐集所需文件與翻譯。在留資格相關事務可與集團的行政書士事務所合作，您不必為「居住」與「手續」分頭奔走。",
          linkLabel: "→ 前往多語言找房",
        },
      ],
    },
    flow: {
      heading: "進行方式——診斷 → 選項 → 執行",
      lead: "我們不催促。初次諮詢免費。",
      steps: [
        {
          title: "診斷",
          note: "（初次免費）",
          body: "先透過LINKA（AI禮賓）或LINE說一句話。我們了解您的狀況，整理出論點。",
        },
        {
          title: "提示選項",
          body: "基於查證過的事實，以書面提供多個選項與根據。我們不催促。",
        },
        {
          title: "執行",
          body: "只有在您決定進行時，代表才會親自陪同，直到仲介・簽約・交屋完成。",
        },
      ],
    },
    pricing: {
      heading: "費用的思考方式",
      body: "初次諮詢・診斷免費。第2次起，不涉及仲介之諮詢（仲介以外的相關業務），經事先同意後以每30分鐘5,500日圓（含稅）承接。與本公司承辦之買賣・租賃仲介相關的諮詢，包含於仲介手續費範圍內。費用另在執行階段（仲介手續費等・法定上限內）發生。估價在著手前以書面明示，書面上沒有的費用，我們不會請款。",
    },
    group: {
      heading: "與士業集團的合作",
      body: "不動產的判斷，往往牽涉法務與許認可。四葉集團設有行政書士事務所（障礙福祉指定申請・在留資格・繼承文件・補助金），相關手續由該事務所另行簽約受任。",
      note: "※四葉不動産株式会社與四葉行政書士事務所為不同事業體，各自獨立受理委任（不收受介紹費等）。",
    },
  },
  zh: {
    metaTitle: "服务｜在中介之前，先送上“材料”的不动产顾问",
    metaDesc:
      "四葉不動産株式会社的服务介绍。不是推销物件，而是备齐“该卖・该买・该不该行动”的判断材料——位于文京区・小日向的顾问型不动产公司。继承不动产・事业用/投资用・外国人居住三大领域，以诊断→选项→执行三步骤进行。初次咨询・诊断免费。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "服务",
    h1: "出售之前，先思考。承租之前，先确认。",
    heroSub: "不是推销物件，而是备齐判断的材料。文京区・小日向的不动产顾问服务。",
    diff: {
      heading: "与一般不动产业者，有什么不同",
      p1: (
        <>
          一般不动产公司的工作，是“中介”物件，所以对话从物件开始。我们的工作，从再往前一步开始。——
          <strong>那个物件，真的该卖吗？该买吗？究竟该不该行动？</strong>
        </>
      ),
      p2: "四葉不動産是一家顾问型不动产公司，由曾任每日新闻中国总局长（记者经历34年）的宅地建物取引士担任代表。记者的工作，是收集事实、核实查证、用听得懂的语言传达。我们把这套方法带进了不动产。",
      diagramLead: (
        <>
          在中介之前，先送上<b className="text-primary">材料</b>。——做判断的，是您。
        </>
      ),
      cardA: {
        title: "一般的不动产公司",
        rows: [
          { label: "对话的起点", value: "从物件（库存）开始" },
          { label: "提案的形式", value: "“这个物件怎么样？”" },
          { label: "目标", value: "成交" },
          { label: "信息", value: "以优点为主" },
        ],
      },
      cardB: {
        title: "四葉不動産的顾问服务",
        rows: [
          { label: "对话的起点", value: "从您的情况开始" },
          { label: "提案的形式", value: "选项＋根据，以书面提供" },
          { label: "目标", value: "信服（“不行动”也是选项）" },
          { label: "信息", value: "核实过的事实，优缺点并陈" },
        ],
      },
      note: "※若“不行动（不卖・不买）”才是最佳解，我们会如实告诉您。中介手续费仅在成交时发生；初次咨询免费。",
    },
    fields: {
      heading: "四葉的顾问服务4领域",
      items: [
        {
          tag: "如何继承不动产？",
          title: "继承不动产顾问",
          body: "从父母继承的房屋・土地，我们从「管理・活用・出售」三种出路反向推算来思考。以继承登记的期限（2024年4月起义务化・原则3年）为起点，与税理士・司法书士・行政书士合作，把流程整理成一张表——用事实，解开情感与金钱交织的继承课题。",
          linkLabel: "→ 前往完整指南",
        },
        {
          tag: "想开设团体家屋？",
          title: "团体家屋开设顾问",
          body: "残障人士团体家屋（共同生活援助）的开设，「物件」与「指定申请」是同时推进的。四葉不動産负责以指定基准（选址・结构・面积・消防）为前提的物件中介；指定申请文件的制作・提交属于行政书士的独占业务，由附设的四葉行政書士事務所另行签约承接。",
          linkLabel: "→ 前往完整指南",
        },
        {
          tag: "如何寻找房源？",
          title: "事业用・投资用的反向推算提案",
          body: "民宿、餐饮店、公司设立，以及员工宿舍、收益物件，若不从「事业目的」反向推算，就容易失败。按业种确认许可要件（消防・用途地域等）并在签约前完成，是铁则。物件的寻找由四葉不動産负责，指定申请・许认可则由合作的行政书士（另行签约）负责，共同为您提案能看清从开设到运营全程的物件选择。",
          linkLabel: "→ 前往投资・事业用",
        },
        {
          tag: "如何在日本生活？",
          title: "外国人的居住顾问",
          body: "审查、担保、语言的门槛，我们以日语・英语・中文（繁体・简体）陪伴您跨过。不只找房，也协助收集所需文件与翻译。在留资格相关事务可与集团的行政书士事务所合作，您不必为「居住」与「手续」分头奔走。",
          linkLabel: "→ 前往多语言找房",
        },
      ],
    },
    flow: {
      heading: "进行方式——诊断 → 选项 → 执行",
      lead: "我们不催促。初次咨询免费。",
      steps: [
        {
          title: "诊断",
          note: "（初次免费）",
          body: "先通过LINKA（AI礼宾）或LINE说一句话。我们了解您的情况，整理出论点。",
        },
        {
          title: "提示选项",
          body: "基于核实过的事实，以书面提供多个选项与根据。我们不催促。",
        },
        {
          title: "执行",
          body: "只有在您决定推进时，代表才会亲自陪同，直到中介・签约・交房完成。",
        },
      ],
    },
    pricing: {
      heading: "费用的思考方式",
      body: "初次咨询・诊断免费。第2次起，不涉及中介之咨询（中介以外的相关业务），经事先同意后以每30分钟5,500日元（含税）承接。与本公司承办之买卖・租赁中介相关的咨询，包含在中介手续费范围内。费用另在执行阶段（中介手续费等・法定上限内）发生。估价在着手前以书面明示，书面上没有的费用一概不收取。",
    },
    group: {
      heading: "与士业集团的合作",
      body: "不动产的判断，往往涉及法务与许认可。四葉集团设有行政书士事务所（残障福祉指定申请・在留资格・继承文件・补助金），相关手续由该事务所另行签约受任。",
      note: "※四葉不動産株式会社与四葉行政書士事務所为不同事业体，各自独立受理委托（不收受介绍费等）。",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/services",
    locale,
  });
}

// 図解共通の英字キッカー＋見出し
function SectionHead({ kicker, heading }: { kicker: string; heading: string }) {
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.25em] text-primary">{kicker}</p>
      <h2 className="mt-2 font-serif text-2xl font-bold leading-snug text-ink sm:text-3xl">{heading}</h2>
    </div>
  );
}

// 図解03の矢印（md未満は縦向き）
function FlowArrow() {
  return (
    <div className="flex shrink-0 items-center justify-center py-1 md:px-1 md:py-0" aria-hidden="true">
      <svg viewBox="0 0 70 70" className="h-8 w-8 rotate-90 text-primary md:rotate-0">
        <path
          d="M15 35h32M33 21l16 14-16 14"
          stroke="currentColor"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// 図解02のアイコン4種（家＝相続／家＋人2人＝グループホーム開設／ビル＋虫めがね＝事業用・投資用／地球＝多言語）
const FIELD_ICONS: React.ReactNode[] = [
  <svg key="souzoku" viewBox="0 0 100 100" className="mx-auto h-20 w-20 text-primary sm:h-24 sm:w-24" aria-hidden="true">
    <path d="M50 16 20 42v40h60V42z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
    <path d="M38 82V58h24v24" fill="none" stroke="currentColor" strokeWidth="5" />
    <path d="M50 4v10M28 22l-8-8M72 22l8-8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  </svg>,
  <svg key="group-home" viewBox="0 0 100 100" className="mx-auto h-20 w-20 text-primary sm:h-24 sm:w-24" aria-hidden="true">
    <path d="M50 14 18 40v46h64V40z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
    <circle cx="38" cy="58" r="7" fill="none" stroke="currentColor" strokeWidth="5" />
    <path d="M26 82v-6c0-7 5-12 12-12s12 5 12 12v6" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <circle cx="66" cy="58" r="7" fill="none" stroke="currentColor" strokeWidth="5" />
    <path d="M54 82v-6c0-7 5-12 12-12s12 5 12 12v6" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  </svg>,
  <svg key="toushi" viewBox="0 0 100 100" className="mx-auto h-20 w-20 text-primary sm:h-24 sm:w-24" aria-hidden="true">
    <rect x="18" y="30" width="26" height="52" fill="none" stroke="currentColor" strokeWidth="5" />
    <rect x="52" y="14" width="30" height="68" fill="none" stroke="currentColor" strokeWidth="5" />
    <path d="M26 42h10M26 56h10M60 26h14M60 40h14M60 54h14" stroke="currentColor" strokeWidth="4" />
    <circle cx="76" cy="74" r="14" fill="var(--color-surface, #fff)" stroke="currentColor" strokeWidth="5" />
    <path d="M86 84l10 10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>,
  <svg key="global" viewBox="0 0 100 100" className="mx-auto h-20 w-20 text-primary sm:h-24 sm:w-24" aria-hidden="true">
    <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="5" />
    <ellipse cx="50" cy="50" rx="15" ry="34" fill="none" stroke="currentColor" strokeWidth="4" />
    <path d="M18 40h64M18 60h64" stroke="currentColor" strokeWidth="4" />
  </svg>,
];

export default async function ServicesPage() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;

  return (
    <>
      <Breadcrumb items={[{ name: c.breadcrumbHome, href: "/" }, { name: c.breadcrumbCurrent }]} />

      {/* ヒーロー（原稿§コンセプトコピー・A案） */}
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:pb-14 sm:pt-10">
        <p className="text-xs font-bold tracking-[0.25em] text-primary">{KICKERS.hero}</p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-snug text-ink sm:text-4xl">{c.h1}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">{c.heroSub}</p>
      </section>

      <main className="mx-auto max-w-5xl px-4">
        {/* §1 普通の不動産業者と、何が違うのか（対比＝図解01再現：カード2枚組＋矢印） */}
        <section aria-label="difference">
          <SectionHead kicker={KICKERS.diff} heading={c.diff.heading} />
          <p className="mt-4 text-sm leading-[1.9] text-text sm:text-base">{c.diff.p1}</p>
          <p className="mt-3 text-sm leading-[1.9] text-text sm:text-base">{c.diff.p2}</p>

          <figure className="mt-8">
            <figcaption className="text-center text-sm font-medium text-ink sm:text-base">
              {c.diff.diagramLead}
            </figcaption>
            <div className="mt-5 flex flex-col items-stretch md:flex-row md:items-center">
              {/* 左＝一般的な不動産会社 */}
              <div className="flex-1 rounded-3xl border border-border bg-surface p-6">
                <div className="text-base font-bold text-text-muted sm:text-lg">{c.diff.cardA.title}</div>
                <dl className="mt-4 space-y-3">
                  {c.diff.cardA.rows.map((r) => (
                    <div key={r.label}>
                      <dt className="text-xs text-text-muted">{r.label}</dt>
                      <dd className="mt-0.5 text-sm font-bold leading-relaxed text-ink">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {/* 中央矢印（md未満は縦向き・カードに重ねる） */}
              <div className="z-10 -my-3 flex items-center justify-center md:-mx-4 md:my-0" aria-hidden="true">
                <svg viewBox="0 0 120 120" className="h-12 w-12 rotate-90 text-primary md:rotate-0">
                  <circle cx="60" cy="60" r="56" fill="currentColor" />
                  <path
                    d="M35 60h40M60 40l22 20-22 20"
                    stroke="#fff"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* 右＝四葉不動産のコンサルティング（強調枠） */}
              <div className="flex-1 rounded-3xl border-2 border-primary bg-surface p-6 shadow-[0_8px_24px_rgba(7,145,58,0.12)]">
                <div className="text-base font-bold text-primary sm:text-lg">{c.diff.cardB.title}</div>
                <dl className="mt-4 space-y-3">
                  {c.diff.cardB.rows.map((r) => (
                    <div key={r.label}>
                      <dt className="text-xs text-text-muted">{r.label}</dt>
                      <dd className="mt-0.5 text-sm font-bold leading-relaxed text-primary">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </figure>
          <p className="mt-4 text-xs leading-relaxed text-text-muted">{c.diff.note}</p>
        </section>

        {/* §2 四葉のコンサルティング4領域（図解02再現：アイコンSVG＋問いかけチップ＝トップpillarsタグと同一訳語）
            各カードの子ページチップは config/services-nav.ts（SERVICE_NAV_CATEGORIES）を単一ソースとして参照。
            ハブページと同一hrefの子（＝「総合ガイド」）はカード本体のCTAと重複するためチップから除外する。 */}
        <section aria-label="four consulting fields" className="mt-14">
          <SectionHead kicker={KICKERS.fields} heading={c.fields.heading} />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {c.fields.items.map((f, i) => {
              const chipLinks = (SERVICE_NAV_CATEGORIES[i]?.children ?? []).filter(
                (child) => child.href !== FIELD_HREFS[i] && isNavLinkVisible(child, locale),
              );
              return (
                <div
                  key={FIELD_HREFS[i]}
                  className="flex flex-col rounded-3xl border border-border bg-surface p-6 transition-shadow hover:shadow-md"
                >
                  <Link href={addLocalePrefix(FIELD_HREFS[i], locale)} className="flex flex-1 flex-col">
                    {FIELD_ICONS[i]}
                    <span className="mx-auto mt-4 inline-block rounded-full bg-primary-tint px-3 py-1 text-xs font-bold text-primary-dark">
                      {f.tag}
                    </span>
                    <h3 className="mt-3 text-center font-serif text-lg font-bold leading-snug text-ink">{f.title}</h3>
                    <p className="mt-3 text-sm leading-[1.9] text-text-muted">{f.body}</p>
                    <span className="mt-auto pt-4 text-sm font-medium text-primary">{f.linkLabel}</span>
                  </Link>
                  {chipLinks.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                      {chipLinks.map((child) => (
                        <Link
                          key={child.href}
                          href={addLocalePrefix(child.href, locale)}
                          className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {resolveNavLabel(child.label, locale)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* §3 進め方（図解03再現：番号円＋矢印SVG・md未満は縦積み） */}
        <section aria-label="how it works" className="mt-14">
          <SectionHead kicker={KICKERS.flow} heading={c.flow.heading} />
          <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">{c.flow.lead}</p>
          <div className="mt-6 flex flex-col items-stretch md:flex-row md:items-stretch">
            {c.flow.steps.map((s, i) => (
              <div key={s.title} className="contents">
                {i > 0 && <FlowArrow />}
                <div
                  className={`flex-1 rounded-3xl bg-surface p-6 ${
                    i === 1 ? "border-2 border-primary" : "border border-border"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-bold text-ink">
                    {s.title}
                    {s.note && <span className="ml-1 text-sm font-bold text-primary">{s.note}</span>}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.9] text-text-muted">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* §4 料金の考え方 */}
        <section aria-label="pricing policy" className="mt-14">
          <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">{c.pricing.heading}</h2>
          <p className="mt-4 rounded-2xl border border-border bg-surface p-5 text-sm leading-[1.9] text-text sm:text-base">
            {c.pricing.body}
          </p>
        </section>

        {/* §5 士業グループとの連携（独立受任注記＝原稿どおり） */}
        <section aria-label="professional group" className="mt-14">
          <h2 className="font-serif text-2xl font-bold text-ink sm:text-3xl">{c.group.heading}</h2>
          <p className="mt-4 text-sm leading-[1.9] text-text sm:text-base">{c.group.body}</p>
          <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.group.note}</p>
        </section>

        {/* §6 CTA＝共通CtaBand（見出し既定値が原稿§6と同文。ja固定＝フェーズI後半の翻訳キー対応まで既知の残課題） */}
        <div className="mt-10 pb-6">
          <CtaBand businessKey="realestate" />
        </div>
      </main>
    </>
  );
}
