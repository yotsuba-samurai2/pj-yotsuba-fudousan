import Image from "next/image";
// /labor（型F・社労士トップ・開業版）＝原稿_社労士 #1
// JSON-LD＝layoutの OrganizationJsonLd（ProfessionalService）＋WebSiteJsonLd が出力済み＝重複出力しない。
// 登録番号は 2026-09-01 の登録証到着後に出す（正本 sr-registration.ts）。
// 2026-09-01 多言語化（第1波）：COPY: Record<LangCode,…>＋getRequestLocale。
//   ・キャッチ「人の手続きを、事業の力に。」は各言語で意訳（直訳しない）。
//   ・一体提供を示唆する語（ワンストップ／一站式／one-stop 等）は全言語で不使用（第6条）。
//   ・「どの事務所が、何を担いますか？」の節は分離受任の明示（別の契約で）を4言語とも維持。
//   ・国数表記（4カ国等）は不使用。「中国や台湾、タイに駐在」と国名で書く。
import { LaborPlanPricing, LaborPlanPriceSummary, LaborPlanResponsibility, LaborPlanResponsibilities } from "@/components/labor/LaborPlanPricing";
import { LaborSetupComparison } from "@/components/labor/LaborSetupComparison";
import { LABOR_SERVICE_COPY, getLaborPlanFaqs } from "@/lib/labor/service-copy";
import { LABOR_PLAN_COPY } from "@/lib/labor/plan-copy";
import { Faq } from "@/components/shared/Faq";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { CtaBand } from "@/components/shared/CtaBand";
import type { LangCode } from "@/config/languages";
import { srRegParen } from "@/lib/shared/sr-registration";

type Service = { href: string; label: string; sub: string };
type Copy = {
  heroAlt: string;
  whenH2: string;
  whenItems: { strong: string; rest: string }[];
  whenColumnPre: string;
  whenColumnLink: string;
  whenColumnPost: string;
  services: Service[];
  repName: string;
  repBody1: string;
  repBody2: string;
  repProfile: string;
  rolesH2: string;
  rolesBody: string;
  rolesLink1: string;
  rolesLink2: string;
  rolesNote: string;
  notH2: string;
  notItems: { strong: string; rest: string }[];
  feeH2: string;
  feeLink1: string;
  feeLink2: string;
  feeSeparate: string;
  disclaimer: string;
  navFee: string;
  navFlow: string;
  navFaq: string;
  navAbout: string;
};

const JA: Copy = {
  "heroAlt": "四葉社会保険労務士事務所のイメージ（文京区の事務所）",
  "whenH2": "こんなときに、ご相談ください",
  "whenItems": [
    {
      "strong": "給与計算を毎月の運用まで",
      "rest": " — 従業員がLINE打刻を行い、会社側が確認・修正・確定。freeeの給与計算結果を四葉が確認し、会社側が最終承認します。"
    },
    {
      "strong": "業務委託でお願いしている方が、実は雇用ではないかと気になっている",
      "rest": "——契約書ではなく実態で判断されます。放っておくと遡って求められます"
    },
    {
      "strong": "パートやアルバイトを雇うが、社会保険に入るのかが分からない",
      "rest": "——週の所定労働時間が分かれ目です"
    },
    {
      "strong": "家族を社員にする",
      "rest": "——同居しているか、取締役にするか、助成金を考えているか。入社の日より前に決めることがあります"
    },
    {
      "strong": "年金を受け取りながら働く方を雇う",
      "rest": "——賃金の決め方で、年金が止まる額が変わります"
    },
    {
      "strong": "中国など海外へ社員を出している",
      "rest": "——出張か派遣かで、労災の扱いがまったく違います"
    },
    {
      "strong": "会社をたたむ",
      "rest": "——社会保険と労働保険にも、登記より先に来る期限があります"
    }
  ],
  "whenColumnPre": "→ ",
  "whenColumnLink": "労務のコラム",
  "whenColumnPost": " に、それぞれの答えを書いています。",
  "services": [
    {
      "href": "/labor/services/shogu-kaizen",
      "label": "処遇改善加算のサポート",
      "sub": "採用・シフト・給与・社会保険・処遇改善など、開設後の人事労務を支援します。人事部丸投げプランの月額に含む範囲と、就業規則・処遇改善等の個別業務を分けてご案内します。"
    },
    {
      "href": "/labor/services/kaigo-roumu",
      "label": "介護・障害福祉の労務管理",
      "sub": "人員配置基準と日々の手続き"
    },
    {
      "href": "/labor/services/joseikin",
      "label": "雇用関係助成金の申請",
      "sub": "キャリアアップ助成金ほか"
    },
    {
      "href": "/labor/services/gaikokujin-koyo",
      "label": "外国人雇用（介護・育成就労）の労務",
      "sub": "経営者との基本相談、給与・社会保険の説明、入社時の基本説明は月額内です。その他の外国語はAI・翻訳支援を活用した基本案内に対応します。専門翻訳・長時間通訳は別料金です。"
    },
    {
      "href": "/labor/services/gaibu-kansanin",
      "label": "外部監査で見られる労務",
      "sub": "育成就労・監理支援機関向け"
    }
  ],
  "repName": "浦松 丈二（うらまつ・じょうじ）",
  "repBody1": "元毎日新聞中国総局長（記者歴34年）。社会保険労務士",
  "repBody2": "・行政書士（登録番号 第25087022号）・宅地建物取引士。制度と現場のあいだにある「複雑さ」を整理して伝える——記者の仕事を、労務に活かします。",
  "repProfile": "プロフィール：",
  "rolesH2": "どの事務所が、何を担いますか？",
  "rolesBody": "障害福祉事業の立ち上げには、物件・指定申請・労務の3つが必要になります。物件は四葉不動産株式会社、指定申請の書類作成は四葉行政書士事務所、労務は当事務所が、それぞれ別の契約で受任します。必要な部分だけをご依頼いただけますし、他の部分を他社にご依頼いただいても差し支えありません。",
  "rolesLink1": "グループホームに使える物件探し（四葉不動産）",
  "rolesLink2": "障害福祉サービスの指定申請（四葉行政書士事務所）",
  "rolesNote": "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。",
  "notH2": "当事務所が取り扱わないことは何ですか？",
  "notItems": [
    {
      "strong": "税務の申告・税務代理・税務相談",
      "rest": "（税理士の業務）——取り扱っておりません。ご希望があれば税理士をご紹介します（紹介料の授受はありません）"
    },
    {
      "strong": "登記",
      "rest": "（司法書士の業務）——取り扱っておりません。ご希望があれば司法書士をご紹介します（同上）"
    },
    {
      "strong": "紛争性のある事案の代理・法律相談",
      "rest": "（弁護士の業務）——取り扱っておりません。ご希望があれば弁護士をご紹介します（同上）"
    },
    {
      "strong": "在留資格の申請取次",
      "rest": "（行政書士の業務）——四葉行政書士事務所が別の契約で承ります"
    },
    {
      "strong": "不動産の媒介・賃貸管理",
      "rest": "（宅地建物取引業）——四葉不動産株式会社が別の契約で承ります"
    }
  ],
  "feeH2": "料金はどう決まりますか？",
  "feeLink1": "報酬額表（全項目）",
  "feeLink2": "進め方（AIをどこまで使うか）",
  "feeSeparate": "※四葉不動産株式会社・四葉行政書士事務所の料金とは別建てです。合算したご請求や、複数の事務所へご依頼いただいたことによるお値引きはありません。",
  "disclaimer": "本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。",
  "navFee": "料金",
  "navFlow": "受任の流れ",
  "navFaq": "よくある質問",
  "navAbout": "事務所概要"
};

const EN: Copy = {
  "heroAlt": "四葉社会保険労務士事務所 (office in Bunkyo City, Tokyo)",
  "whenH2": "Talk to us when…",
  "whenItems": [
    {
      "strong": "A clear monthly payroll workflow",
      "rest": " — Employees clock in through LINE. Your company reviews, corrects and finalizes attendance. We review the payroll calculated in freee, and your company gives final approval."
    },
    {
      "strong": "You wonder whether a contractor is actually an employee",
      "rest": " — the law looks at the actual working relationship, not the contract; left alone, it can be claimed retroactively"
    },
    {
      "strong": "You are hiring part-timers and are unsure about social-insurance enrollment",
      "rest": " — weekly contracted hours are the dividing line"
    },
    {
      "strong": "You are bringing a family member into the company",
      "rest": " — living together or not, director or employee, subsidies or not: some decisions must come before the start date"
    },
    {
      "strong": "You employ someone who is drawing a pension",
      "rest": " — how you set wages changes how much pension is suspended"
    },
    {
      "strong": "You post employees to China or elsewhere overseas",
      "rest": " — business trip or transfer makes a complete difference to workers' compensation"
    },
    {
      "strong": "You are closing the company",
      "rest": " — social and labor insurance have deadlines that come before the registration"
    }
  ],
  "whenColumnPre": "→ Our ",
  "whenColumnLink": "labor columns",
  "whenColumnPost": " answer each of these.",
  "services": [
    {
      "href": "/labor/services/shogu-kaizen",
      "label": "Treatment-improvement addition support",
      "sub": "Support for hiring, shifts, payroll, social insurance and wage improvement after opening. We distinguish the monthly HR plan from separately commissioned work such as work rules and wage-improvement design."
    },
    {
      "href": "/labor/services/kaigo-roumu",
      "label": "Labor management for care & disability welfare",
      "sub": "Staffing standards and day-to-day procedures"
    },
    {
      "href": "/labor/services/joseikin",
      "label": "Employment-related subsidy applications",
      "sub": "Career-Up Subsidy and more"
    },
    {
      "href": "/labor/services/gaikokujin-koyo",
      "label": "Employing foreign nationals (care / Employment for Skill Development)",
      "sub": "Basic management consultations, payroll and social insurance explanations, and onboarding explanations in Chinese are included. Basic guidance in other languages uses AI and translation assistance. Specialist translation and extended interpreting carry separate fees."
    },
    {
      "href": "/labor/services/gaibu-kansanin",
      "label": "Labor points reviewed in external audits",
      "sub": "For supervising support organizations"
    }
  ],
  "repName": "Joji Uramatsu",
  "repBody1": "Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist). Certified Social Insurance and Labor Consultant",
  "repBody2": "; Administrative Scrivener (Reg. No. 25087022); Licensed Real Estate Transaction Specialist. Sorting out the complexity between the system and the workplace — a journalist's craft, applied to labor.",
  "repProfile": "Profiles: ",
  "rolesH2": "Which office handles what?",
  "rolesBody": "Launching a disability-welfare business takes three things: premises, the designation application, and labor. Premises are handled by Yotsuba Real Estate Co., Ltd.; preparation of designation-application documents by 四葉行政書士事務所; labor by this office — each under a separate contract. You may engage only the part you need, and you are free to place the other parts elsewhere.",
  "rolesLink1": "Finding premises usable as a group home (Yotsuba Real Estate)",
  "rolesLink2": "Designation applications for disability-welfare services (四葉行政書士事務所)",
  "rolesNote": "* Yotsuba Real Estate Co., Ltd., 四葉行政書士事務所, and 四葉社会保険労務士事務所 are independent business entities and accept engagements separately (no referral fees are paid or received).",
  "notH2": "What does this office not handle?",
  "notItems": [
    {
      "strong": "Tax filing, tax representation, and tax consultation",
      "rest": " (work of licensed tax accountants) — not handled. We can refer you to a tax accountant (no referral fees)"
    },
    {
      "strong": "Registration",
      "rest": " (work of judicial scriveners) — not handled. We can refer you to a judicial scrivener (same as above)"
    },
    {
      "strong": "Representation in disputes and legal consultation",
      "rest": " (work of attorneys) — not handled. We can refer you to an attorney (same as above)"
    },
    {
      "strong": "Residence-status application services",
      "rest": " (work of administrative scriveners) — handled by 四葉行政書士事務所 under a separate contract"
    },
    {
      "strong": "Real-estate brokerage and rental management",
      "rest": " (licensed real-estate business) — handled by Yotsuba Real Estate Co., Ltd. under a separate contract"
    }
  ],
  "feeH2": "How are fees decided?",
  "feeLink1": "Fee table (all items)",
  "feeLink2": "How we work (how far we use AI)",
  "feeSeparate": "* Fees are separate from those of Yotsuba Real Estate Co., Ltd. and 四葉行政書士事務所. There is no combined billing, and no discount for engaging more than one office.",
  "disclaimer": "This page is general information. Individual cases are advised after review by the licensed consultant.",
  "navFee": "Fees",
  "navFlow": "How we work",
  "navFaq": "FAQ",
  "navAbout": "About"
};

const ZH_TW: Copy = {
  "heroAlt": "四葉社會保險勞務士事務所（東京都文京區）",
  "whenH2": "這些時候，歡迎諮詢",
  "whenItems": [
    {
      "strong": "明確的每月薪資流程",
      "rest": " — 員工以LINE打卡，公司確認、修正並確定出勤。四葉確認freee計算的薪資內容，由公司最終核准。"
    },
    {
      "strong": "以業務委託合作的人，擔心實際上是否屬於僱用",
      "rest": "——依實際狀態而非契約書判斷。放著不管，可能被追溯請求"
    },
    {
      "strong": "要僱用兼職人員，不確定是否要加入社會保險",
      "rest": "——每週約定工時是分界線"
    },
    {
      "strong": "要讓家人成為員工",
      "rest": "——是否同住、是否任董事、是否考慮助成金。有些事必須在入職日之前決定"
    },
    {
      "strong": "要僱用領取年金同時工作的人",
      "rest": "——薪資的訂法，會改變年金被停發的金額"
    },
    {
      "strong": "有員工派駐中國等海外",
      "rest": "——出差還是派遣，勞災的處理完全不同"
    },
    {
      "strong": "要結束公司",
      "rest": "——社會保險與勞動保險，有比登記更早到來的期限"
    }
  ],
  "whenColumnPre": "→ ",
  "whenColumnLink": "勞務專欄",
  "whenColumnPost": " 中寫有各問題的答案。",
  "services": [
    {
      "href": "/labor/services/shogu-kaizen",
      "label": "處遇改善加算的支援",
      "sub": "支援開設後的招聘、排班、薪資、社會保險及處遇改善。人事部方案月費涵蓋的工作，與就業規則、處遇改善設計等個別業務，會分別說明。"
    },
    {
      "href": "/labor/services/kaigo-roumu",
      "label": "介護・障害福祉的勞務管理",
      "sub": "人員配置基準與日常手續"
    },
    {
      "href": "/labor/services/joseikin",
      "label": "僱用相關助成金的申請",
      "sub": "career up助成金等"
    },
    {
      "href": "/labor/services/gaikokujin-koyo",
      "label": "外國人僱用（介護・育成就勞）的勞務",
      "sub": "經營者基本諮詢、薪資與社會保險說明、入職基本說明均包含於月費。其他外語透過AI及翻譯支援提供基本指引。專業翻譯與長時間口譯另行收費。"
    },
    {
      "href": "/labor/services/gaibu-kansanin",
      "label": "外部監查會查核的勞務",
      "sub": "面向育成就勞・監理支援機關"
    }
  ],
  "repName": "浦松 丈二",
  "repBody1": "曾任每日新聞中國總局長（記者資歷34年）。社會保險勞務士",
  "repBody2": "・行政書士（登錄號 第25087022號）・宅地建物取引士。整理制度與現場之間的「複雜」並傳達——把記者的本領，用在勞務上。",
  "repProfile": "簡介：",
  "rolesH2": "哪個事務所負責什麼？",
  "rolesBody": "開辦障害福祉事業需要三件事：物件、指定申請、勞務。物件由四葉不動產株式會社、指定申請文件的製作由四葉行政書士事務所、勞務由本事務所，各自以另行簽訂的契約承接。您可以只委託需要的部分，其他部分委託其他公司也沒有問題。",
  "rolesLink1": "尋找可用於團體家屋的物件（四葉不動產）",
  "rolesLink2": "障害福祉服務的指定申請（四葉行政書士事務所）",
  "rolesNote": "※四葉不動產株式會社・四葉行政書士事務所・四葉社會保險勞務士事務所為各自獨立的事業體，分別承接委託（不收取、也不支付介紹費）。",
  "notH2": "本事務所不承辦什麼？",
  "notItems": [
    {
      "strong": "稅務申報・稅務代理・稅務諮詢",
      "rest": "（稅理士的業務）——不承辦。如有需要，為您介紹稅理士（不收取介紹費）"
    },
    {
      "strong": "登記",
      "rest": "（司法書士的業務）——不承辦。如有需要，為您介紹司法書士（同上）"
    },
    {
      "strong": "具紛爭性案件的代理・法律諮詢",
      "rest": "（律師的業務）——不承辦。如有需要，為您介紹律師（同上）"
    },
    {
      "strong": "在留資格的申請取次",
      "rest": "（行政書士的業務）——由四葉行政書士事務所另行簽約承接"
    },
    {
      "strong": "不動產的仲介・租賃管理",
      "rest": "（宅地建物取引業）——由四葉不動產株式會社另行簽約承接"
    }
  ],
  "feeH2": "費用是怎麼決定的？",
  "feeLink1": "報酬額表（全項目）",
  "feeLink2": "進行方式（AI用到哪裡）",
  "feeSeparate": "※與四葉不動產株式會社・四葉行政書士事務所的費用各自獨立。不會合併請款，也沒有因委託多個事務所而來的折扣。",
  "disclaimer": "本頁為一般性資訊。個別案件將經有資格者確認後為您說明。",
  "navFee": "費用",
  "navFlow": "受任流程",
  "navFaq": "常見問題",
  "navAbout": "事務所概要"
};

const ZH: Copy = {
  "heroAlt": "四葉社会保険労務士事務所（东京都文京区）",
  "whenH2": "这些时候，欢迎咨询",
  "whenItems": [
    {
      "strong": "明确的每月工资流程",
      "rest": " — 员工以LINE打卡，公司确认、修正并确定出勤。四叶确认freee计算的工资内容，由公司最终批准。"
    },
    {
      "strong": "以业务委托合作的人，担心实际上是否属于雇用",
      "rest": "——按实际状态而非合同书判断。放着不管，可能被追溯请求"
    },
    {
      "strong": "要雇用兼职人员，不确定是否要加入社会保险",
      "rest": "——每周约定工时是分界线"
    },
    {
      "strong": "要让家人成为员工",
      "rest": "——是否同住、是否任董事、是否考虑助成金。有些事必须在入职日之前决定"
    },
    {
      "strong": "要雇用领取年金同时工作的人",
      "rest": "——工资的定法，会改变年金被停发的金额"
    },
    {
      "strong": "有员工派驻中国等海外",
      "rest": "——出差还是派遣，劳灾的处理完全不同"
    },
    {
      "strong": "要结束公司",
      "rest": "——社会保险与劳动保险，有比登记更早到来的期限"
    }
  ],
  "whenColumnPre": "→ ",
  "whenColumnLink": "劳务专栏",
  "whenColumnPost": " 中写有各问题的答案。",
  "services": [
    {
      "href": "/labor/services/shogu-kaizen",
      "label": "处遇改善加算的支援",
      "sub": "支持开设后的招聘、排班、工资、社会保险及处遇改善。人事部方案月费涵盖的工作，与就业规则、处遇改善设计等个别业务，会分别说明。"
    },
    {
      "href": "/labor/services/kaigo-roumu",
      "label": "介护・残障福祉的劳务管理",
      "sub": "人员配置基准与日常手续"
    },
    {
      "href": "/labor/services/joseikin",
      "label": "雇用相关助成金的申请",
      "sub": "career up助成金等"
    },
    {
      "href": "/labor/services/gaikokujin-koyo",
      "label": "外国人雇用（介护・育成就劳）的劳务",
      "sub": "经营者基本咨询、工资与社会保险说明、入职基本说明均包含于月费。其他外语通过AI及翻译支持提供基本指引。专业翻译与长时间口译另行收费。"
    },
    {
      "href": "/labor/services/gaibu-kansanin",
      "label": "外部监查会查核的劳务",
      "sub": "面向育成就劳・监理支援机关"
    }
  ],
  "repName": "浦松 丈二",
  "repBody1": "曾任每日新闻中国总局长（记者经历34年）。社会保险劳务士",
  "repBody2": "・行政书士（登录号 第25087022号）・宅地建物取引士。整理制度与现场之间的「复杂」并传达——把记者的本领，用在劳务上。",
  "repProfile": "简介：",
  "rolesH2": "哪个事务所负责什么？",
  "rolesBody": "开办残障福祉事业需要三件事：物件、指定申请、劳务。物件由四葉不動産株式会社、指定申请文件的制作由四葉行政書士事務所、劳务由本事务所，各自以分别签订的合同承接。您可以只委托需要的部分，其他部分委托其他公司也没有问题。",
  "rolesLink1": "寻找可用于团体家屋的物件（四葉不動産）",
  "rolesLink2": "残障福祉服务的指定申请（四葉行政書士事務所）",
  "rolesNote": "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所为各自独立的事业体，分别承接委托（不收取、也不支付介绍费）。",
  "notH2": "本事务所不承办什么？",
  "notItems": [
    {
      "strong": "税务申报・税务代理・税务咨询",
      "rest": "（税理士的业务）——不承办。如有需要，为您介绍税理士（不收取介绍费）"
    },
    {
      "strong": "登记",
      "rest": "（司法书士的业务）——不承办。如有需要，为您介绍司法书士（同上）"
    },
    {
      "strong": "具纠纷性案件的代理・法律咨询",
      "rest": "（律师的业务）——不承办。如有需要，为您介绍律师（同上）"
    },
    {
      "strong": "在留资格的申请取次",
      "rest": "（行政书士的业务）——由四葉行政書士事務所另行签约承接"
    },
    {
      "strong": "不动产的中介・租赁管理",
      "rest": "（宅地建物取引业）——由四葉不動産株式会社另行签约承接"
    }
  ],
  "feeH2": "费用是怎么决定的？",
  "feeLink1": "报酬额表（全项目）",
  "feeLink2": "进行方式（AI用到哪里）",
  "feeSeparate": "※与四葉不動産株式会社・四葉行政書士事務所的费用各自独立。不会合并请款，也没有因委托多个事务所而来的折扣。",
  "disclaimer": "本页为一般性信息。个别案件将经有资格者确认后为您说明。",
  "navFee": "费用",
  "navFlow": "受任流程",
  "navFaq": "常见问题",
  "navAbout": "事务所概要"
};

const COPY: Record<LangCode, Copy> = { ja: JA, en: EN, "zh-tw": ZH_TW, zh: ZH };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = LABOR_SERVICE_COPY[locale];
  return buildPageMetadata({
    businessKey: "labor",
    title: c.title,
    description: c.intro,
    path: "/labor",
    keywords: ["社労士 文京区", "人事部丸投げ", "外国人雇用", "中国語 社労士", "freee 社労士", "グループホーム 社労士", "障害福祉 社労士"],
    locale,
    absoluteTitle: true,
  });
}

export default async function LaborTopPage() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  const v = LABOR_SERVICE_COPY[locale];
  return (
    <>
      {/* 主訴求と会社側の責任を近接表示 */}
      <section className="relative">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-b-3xl sm:mt-4 sm:rounded-3xl">
          <Image
            src="/hero/labor-top-16x9.webp"
            alt={c.heroAlt}
            width={1600}
            height={900}
            className="h-[52vw] max-h-[440px] w-full object-cover sm:h-auto"
            sizes="(min-width: 1152px) 1152px, 100vw"
            loading="eager"
            fetchPriority="high"
          />
          <div className="md:absolute md:inset-0 md:flex md:items-center">
            <div className="bg-surface p-5 md:m-8 md:max-w-xl md:rounded-2xl md:bg-white/30 md:p-7 md:backdrop-blur-sm">
              <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">{v.hero}</h1>
              <p className="mt-3 text-sm leading-relaxed text-text sm:text-base">
                <strong>{v.sub}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        <div className="mt-4"><LaborPlanResponsibility locale={locale} /></div>
        <section className="mt-8 space-y-4 rounded-2xl border-l-4 border-primary bg-primary-tint p-5">
          <h2 className="font-serif text-xl font-semibold text-ink">{LABOR_PLAN_COPY[locale].name}</h2>
          <p className="leading-relaxed text-text">{v.intro}</p>
          <LaborPlanPriceSummary locale={locale} emphasizePayroll />
          <LaborSetupComparison locale={locale} headingLevel="h3" />
          <LaborPlanResponsibilities locale={locale} />
          <div className="flex flex-wrap gap-3">
            <Link href={addLocalePrefix("/labor/ryokin", locale)} className="rounded-lg bg-primary px-4 py-3 text-white">{v.viewPlan}</Link>
            <Link href={addLocalePrefix("/labor/contact", locale)} className="rounded-lg border border-primary px-4 py-3 text-primary">{v.consult}</Link>
          </div>
        </section>
        <section className="mt-10 rounded-2xl border border-border p-5">
          <p className="text-sm font-medium text-primary">{v.industryLabel}</p>
          <h2 className="mt-2 font-serif text-xl font-semibold text-ink">{v.foreignHighlightTitle}</h2>
          <p className="mt-3 font-semibold text-primary">{v.chineseTitle}</p>
          <p className="mt-3 leading-relaxed text-text">{v.foreignHighlightBody}</p>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-ink">{v.visaContractNotice}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-primary">
            <Link className="underline" href={addLocalePrefix("/labor/services/gaikokujin-koyo", locale)}>{v.foreignLink}</Link>
            <Link className="underline" href={addLocalePrefix("/legal/services/visa", locale)}>{v.visaLink}</Link>
          </div>
        </section>
        <section className="mt-10 rounded-2xl border border-border p-5">
          <p className="text-sm font-medium text-primary">{v.industryLabel}</p>
          <h2 className="mt-2 font-serif text-xl font-semibold text-ink">{v.ghTitle}</h2>
          <p className="mt-3 leading-relaxed text-text">{v.ghBody}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-primary">
            <Link className="underline" href={addLocalePrefix("/labor/services/kaigo-roumu", locale)}>{v.ghLink}</Link>
            <Link className="underline" href={addLocalePrefix("/legal/services/shogai-fukushi", locale)}>{v.ghLegalLink}</Link>
          </div>
        </section>
        <section className="mt-10 space-y-3">
          <h2 className="font-serif text-xl font-semibold text-ink">freee + LINE</h2>
          <p className="leading-relaxed text-text">{LABOR_PLAN_COPY[locale].system}</p>
          <p className="leading-relaxed text-text">{v.ai}</p>
        </section>
        {[{title:v.payrollTitle,body:v.payroll},{title:v.socialTitle,body:v.social},{title:v.chineseTitle,body:v.chineseBody},{title:v.recruitmentTitle,body:v.recruitmentBoundary}].map(s => <section key={s.title} className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">{s.title}</h2>
          <p className="mt-3 leading-relaxed text-text">{s.body}</p>
        </section>) }

        {/* こんなときにご相談ください */}
        <section className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-ink">{c.whenH2}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            {c.whenItems.map((w) => (
              <li key={w.strong}>
                <strong>{w.strong}</strong>
                {w.rest}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            {c.whenColumnPre}
            <Link href={addLocalePrefix("/labor/column", locale)} className="text-primary underline">
              {c.whenColumnLink}
            </Link>
            {c.whenColumnPost}
          </p>
        </section>

        {/* 取扱業務カード */}
        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          {c.services.map((s) => (
            <Link
              key={s.href}
              href={addLocalePrefix(s.href, locale)}
              className="block rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm"
            >
              <div className="font-serif text-lg font-semibold text-ink">{s.label}</div>
              <div className="mt-1 text-sm text-text-muted">{s.sub}</div>
            </Link>
          ))}
        </section>

        {/* 代表紹介（E-E-A-T・登録番号＝sr-registration.ts） */}
        <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row">
          <Image
            src="/staff/uramatsu.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={160}
            height={213}
            sizes="(min-width: 640px) 160px, 128px"
            className="w-32 flex-shrink-0 rounded-xl object-cover sm:w-40"
          />
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink">{c.repName}</h2>
            <p className="mt-3 leading-relaxed text-text">{v.qualification}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">
              {c.repBody1}
              {srRegParen(locale)}
              {c.repBody2}
            </p>
            <p className="mt-2 text-xs">
              {c.repProfile}
              <a
                href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                士業ドットコム
              </a>
              ／
              <a
                href="https://www.wikidata.org/wiki/Q139738129"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                Wikidata
              </a>
            </p>
          </div>
        </section>

        {/* 3つの事務所の役割分担（分離受任の明示） */}
        <section className="mt-10 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">{c.rolesH2}</h2>
          <p className="mt-2 text-sm leading-relaxed text-text">{c.rolesBody}</p>
          <p className="mt-2 text-sm">
            →{" "}
            <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">
              {c.rolesLink1}
            </Link>
            ／
            <Link href={addLocalePrefix("/legal/services/shogai-fukushi", locale)} className="text-primary underline">
              {c.rolesLink2}
            </Link>
          </p>
          <p className="mt-2 text-xs text-text-muted">{c.rolesNote}</p>
        </section>

        {/* 対応できないこと（分離受任・「ご紹介します」の形） */}
        <section className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-ink">{c.notH2}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            {c.notItems.map((n) => (
              <li key={n.strong}>
                <strong>{n.strong}</strong>
                {n.rest}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10"><LaborPlanPricing locale={locale} /></div>
        <p className="mt-4"><Link className="text-primary underline" href={addLocalePrefix("/labor/ryokin",locale)}>{c.feeLink1}</Link></p>
        <div className="mt-10"><Faq bare items={getLaborPlanFaqs(locale).slice(0,4)} heading={v.faq} ariaLabel={v.faq} /></div>

        <p className="mt-10 text-xs leading-relaxed text-text-muted">{c.disclaimer}</p>

        {/* 導線 */}
        <nav aria-label="サイト内導線" className="mt-10 flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary">
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="underline">{c.navFee}</Link>
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="underline">{c.navFlow}</Link>
          <Link href={addLocalePrefix("/labor/faq", locale)} className="underline">{c.navFaq}</Link>
          <Link href={addLocalePrefix("/labor/about", locale)} className="underline">{c.navAbout}</Link>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
