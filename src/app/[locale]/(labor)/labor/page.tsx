// /labor（型F・社労士トップ・開業版）＝原稿_社労士 #1
// JSON-LD＝layoutの OrganizationJsonLd（ProfessionalService）＋WebSiteJsonLd が出力済み＝重複出力しない。
// 登録番号は 2026-09-01 の登録証到着後に出す（正本 sr-registration.ts）。
// 2026-09-01 多言語化（第1波）：COPY: Record<LangCode,…>＋getRequestLocale。
//   ・キャッチ「人の手続きを、事業の力に。」は各言語で意訳（直訳しない）。
//   ・一体提供を示唆する語（ワンストップ／一站式／one-stop 等）は全言語で不使用（第6条）。
//   ・「どの事務所が、何を担いますか？」の節は分離受任の明示（別の契約で）を4言語とも維持。
//   ・国数表記（4カ国等）は不使用。「中国や台湾、タイに駐在」と国名で書く。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { CtaBand } from "@/components/shared/CtaBand";
import type { LangCode } from "@/config/languages";
import { srRegParen } from "@/lib/shared/sr-registration";

type Service = { href: string; label: string; sub: string };
type PriceRow = [string, string, string];
type Copy = {
  metaTitle: string;
  metaDescription: string;
  heroAlt: string;
  h1: string;
  leadStrong: string;
  leadRest: string;
  answerStrong: string;
  answerRest: string;
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
  feeLead1Strong: string;
  feeLead1Rest: string;
  feeTableHead: [string, string, string];
  feeRows: PriceRow[];
  feeDiscountStrong: string;
  feeDiscountRest: string;
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
  metaTitle: "四葉社会保険労務士事務所｜文京区・障害福祉に強い社労士",
  metaDescription:
    "東京都文京区小日向・茗荷谷駅徒歩5分の四葉社会保険労務士事務所。顧問料は労務相談の対価で回数無制限。給与計算をfreeeで自社処理（内製）する体制づくりの支援も顧問料に含みます。障害福祉・介護の労務、処遇改善加算、雇用関係助成金、外国人雇用に対応。元新聞記者の社労士がお手伝いします。",
  heroAlt: "四葉社会保険労務士事務所のイメージ（文京区の事務所）",
  h1: "四葉社会保険労務士事務所",
  leadStrong: "東京都文京区小日向の社会保険労務士事務所です。",
  leadRest:
    "人の手続きを、事業の力に。——顧問料だけで、労務のご相談は回数無制限。給与計算をfreeeで自社処理（内製）する体制づくりの支援も顧問料に含みます。障害福祉・介護の労務、処遇改善加算、助成金、外国人雇用に、元新聞記者の社労士が対応します。",
  answerStrong: "顧問料は、労務のご相談に対する対価です。",
  answerRest:
    "ご相談は回数・時間の制限なく承ります。給与計算は、当事務所への代行のほか、freeeで自社処理（内製）に切り替える体制づくりの支援を顧問料に含めて承ります。手続きは顧問先と同じデータを見ながら進め、料金は着手前に書面でお出しします。",
  whenH2: "こんなときに、ご相談ください",
  whenItems: [
    { strong: "給与計算を外注しているが、freeeを入れて自社で回したい", rest: "——設定の設計と毎月の判断を、顧問料の範囲で支援します" },
    { strong: "業務委託でお願いしている方が、実は雇用ではないかと気になっている", rest: "——契約書ではなく実態で判断されます。放っておくと遡って求められます" },
    { strong: "パートやアルバイトを雇うが、社会保険に入るのかが分からない", rest: "——週の所定労働時間が分かれ目です" },
    { strong: "家族を社員にする", rest: "——同居しているか、取締役にするか、助成金を考えているか。入社の日より前に決めることがあります" },
    { strong: "年金を受け取りながら働く方を雇う", rest: "——賃金の決め方で、年金が止まる額が変わります" },
    { strong: "中国など海外へ社員を出している", rest: "——出張か派遣かで、労災の扱いがまったく違います" },
    { strong: "会社をたたむ", rest: "——社会保険と労働保険にも、登記より先に来る期限があります" },
  ],
  whenColumnPre: "→ ",
  whenColumnLink: "労務のコラム",
  whenColumnPost: " に、それぞれの答えを書いています。",
  services: [
    { href: "/labor/services/shogu-kaizen", label: "処遇改善加算のサポート", sub: "賃金規程の整備から計画・実績報告まで" },
    { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理", sub: "人員配置基準と日々の手続き" },
    { href: "/labor/services/joseikin", label: "雇用関係助成金の申請", sub: "キャリアアップ助成金ほか" },
    { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介護・育成就労）の労務", sub: "多言語対応" },
    { href: "/labor/services/gaibu-kansanin", label: "外部監査で見られる労務", sub: "育成就労・監理支援機関向け" },
  ],
  repName: "浦松 丈二（うらまつ・じょうじ）",
  repBody1: "元毎日新聞中国総局長（記者歴34年）。社会保険労務士",
  repBody2:
    "・行政書士（登録番号 第25087022号）・宅地建物取引士。制度と現場のあいだにある「複雑さ」を整理して伝える——記者の仕事を、労務に活かします。",
  repProfile: "プロフィール：",
  rolesH2: "どの事務所が、何を担いますか？",
  rolesBody:
    "障害福祉事業の立ち上げには、物件・指定申請・労務の3つが必要になります。物件は四葉不動産株式会社、指定申請の書類作成は四葉行政書士事務所、労務は当事務所が、それぞれ別の契約で受任します。必要な部分だけをご依頼いただけますし、他の部分を他社にご依頼いただいても差し支えありません。",
  rolesLink1: "グループホームに使える物件探し（四葉不動産）",
  rolesLink2: "障害福祉サービスの指定申請（四葉行政書士事務所）",
  rolesNote:
    "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。",
  notH2: "当事務所が取り扱わないことは何ですか？",
  notItems: [
    { strong: "税務の申告・税務代理・税務相談", rest: "（税理士の業務）——取り扱っておりません。ご希望があれば税理士をご紹介します（紹介料の授受はありません）" },
    { strong: "登記", rest: "（司法書士の業務）——取り扱っておりません。ご希望があれば司法書士をご紹介します（同上）" },
    { strong: "紛争性のある事案の代理・法律相談", rest: "（弁護士の業務）——取り扱っておりません。ご希望があれば弁護士をご紹介します（同上）" },
    { strong: "在留資格の申請取次", rest: "（行政書士の業務）——四葉行政書士事務所が別の契約で承ります" },
    { strong: "不動産の媒介・賃貸管理", rest: "（宅地建物取引業）——四葉不動産株式会社が別の契約で承ります" },
  ],
  feeH2: "料金はどう決まりますか？",
  feeLead1Strong: "顧問料は労務のご相談に対する対価で、手続は届出ごとに都度申し受けます。",
  feeLead1Rest:
    "単価はすべて報酬額表に掲載しています。含まないものと、その場合のおつなぎ先も同じ表に書いています。お見積りは着手前に書面でお出しし、作業を始めてから金額が決まることはありません。",
  feeTableHead: ["主な料金（税込）", "単位", "金額"],
  feeRows: [
    ["顧問（ご相談）", "月額", "22,000円〜"],
    ["給与計算（代行）", "1名／月", "1,100円"],
    ["freeeでの内製（自社計算）への切替支援", "—", "顧問料に含む"],
    ["社会保険・雇用保険 資格取得届", "1名", "各 2,750円"],
    ["就業規則 新規作成", "一式", "88,000〜220,000円"],
    ["助成金 申請代行（顧問先限定）", "一式", "着手金なし ＋ 成功報酬20%"],
    ["障害年金 裁定請求（新規）", "1件", "着手金30,000円 ＋ 年金3ヶ月分"],
  ],
  feeDiscountStrong: "2026年8月、手続きの料金をおおむね3割引き下げました。",
  feeDiscountRest:
    "freee人事労務と生成AIの活用で、手続きの作業は軽くなります。そのぶんをお返しする趣旨です。ただしAIで安くなるのは作業であって、責任ではありません。判断は社会保険労務士が行います。給与計算を当事務所に頼まず、freeeで内製する体制づくりを顧問契約の範囲で支援する形も選べます。",
  feeLink1: "報酬額表（全項目）",
  feeLink2: "進め方（AIをどこまで使うか）",
  feeSeparate:
    "※四葉不動産株式会社・四葉行政書士事務所の料金とは別建てです。合算したご請求や、複数の事務所へご依頼いただいたことによるお値引きはありません。",
  disclaimer: "本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。",
  navFee: "料金",
  navFlow: "受任の流れ",
  navFaq: "よくある質問",
  navAbout: "事務所概要",
};

const EN: Copy = {
  metaTitle: "四葉社会保険労務士事務所 | Sharoushi in Bunkyo, Tokyo — labor & social insurance",
  metaDescription:
    "四葉社会保険労務士事務所, a Certified Social Insurance and Labor Consultant office in Kohinata, Bunkyo City, Tokyo (5 min from Myogadani Sta.). The advisory fee covers unlimited labor consultations, including support for bringing payroll in-house on freee. Labor for disability-welfare and nursing-care providers, the treatment-improvement addition, employment subsidies, and employing foreign nationals — handled by a consultant who spent 34 years as a newspaper journalist.",
  heroAlt: "四葉社会保険労務士事務所 (office in Bunkyo City, Tokyo)",
  h1: "四葉社会保険労務士事務所",
  leadStrong: "A Certified Social Insurance and Labor Consultant (Sharoushi) office in Kohinata, Bunkyo City, Tokyo.",
  leadRest:
    " Turning people's paperwork into business strength. The advisory fee alone covers unlimited labor consultations, including support for running payroll in-house on freee. Labor for disability-welfare and nursing-care providers, the treatment-improvement addition, subsidies, and employing foreign nationals — handled by a former newspaper journalist turned consultant.",
  answerStrong: "The advisory (komon) fee is consideration for labor consultations.",
  answerRest:
    " Consultations are unlimited in frequency and time. For payroll, you can have this office run it, or have us help you bring it in-house on freee — that support is included in the advisory fee. Procedures are worked on from the same data as the client, and fees are quoted in writing before we start.",
  whenH2: "Talk to us when…",
  whenItems: [
    { strong: "You outsource payroll but want to run it in-house on freee", rest: " — we support the setup design and the monthly judgment calls within the advisory fee" },
    { strong: "You wonder whether a contractor is actually an employee", rest: " — the law looks at the actual working relationship, not the contract; left alone, it can be claimed retroactively" },
    { strong: "You are hiring part-timers and are unsure about social-insurance enrollment", rest: " — weekly contracted hours are the dividing line" },
    { strong: "You are bringing a family member into the company", rest: " — living together or not, director or employee, subsidies or not: some decisions must come before the start date" },
    { strong: "You employ someone who is drawing a pension", rest: " — how you set wages changes how much pension is suspended" },
    { strong: "You post employees to China or elsewhere overseas", rest: " — business trip or transfer makes a complete difference to workers' compensation" },
    { strong: "You are closing the company", rest: " — social and labor insurance have deadlines that come before the registration" },
  ],
  whenColumnPre: "→ Our ",
  whenColumnLink: "labor columns",
  whenColumnPost: " answer each of these.",
  services: [
    { href: "/labor/services/shogu-kaizen", label: "Treatment-improvement addition support", sub: "From wage rules to plans and reports" },
    { href: "/labor/services/kaigo-roumu", label: "Labor management for care & disability welfare", sub: "Staffing standards and day-to-day procedures" },
    { href: "/labor/services/joseikin", label: "Employment-related subsidy applications", sub: "Career-Up Subsidy and more" },
    { href: "/labor/services/gaikokujin-koyo", label: "Employing foreign nationals (care / Employment for Skill Development)", sub: "Multilingual support" },
    { href: "/labor/services/gaibu-kansanin", label: "Labor points reviewed in external audits", sub: "For supervising support organizations" },
  ],
  repName: "Joji Uramatsu",
  repBody1: "Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist). Certified Social Insurance and Labor Consultant",
  repBody2:
    "; Administrative Scrivener (Reg. No. 25087022); Licensed Real Estate Transaction Specialist. Sorting out the complexity between the system and the workplace — a journalist's craft, applied to labor.",
  repProfile: "Profiles: ",
  rolesH2: "Which office handles what?",
  rolesBody:
    "Launching a disability-welfare business takes three things: premises, the designation application, and labor. Premises are handled by Yotsuba Real Estate Co., Ltd.; preparation of designation-application documents by 四葉行政書士事務所; labor by this office — each under a separate contract. You may engage only the part you need, and you are free to place the other parts elsewhere.",
  rolesLink1: "Finding premises usable as a group home (Yotsuba Real Estate)",
  rolesLink2: "Designation applications for disability-welfare services (四葉行政書士事務所)",
  rolesNote:
    "* Yotsuba Real Estate Co., Ltd., 四葉行政書士事務所, and 四葉社会保険労務士事務所 are independent business entities and accept engagements separately (no referral fees are paid or received).",
  notH2: "What does this office not handle?",
  notItems: [
    { strong: "Tax filing, tax representation, and tax consultation", rest: " (work of licensed tax accountants) — not handled. We can refer you to a tax accountant (no referral fees)" },
    { strong: "Registration", rest: " (work of judicial scriveners) — not handled. We can refer you to a judicial scrivener (same as above)" },
    { strong: "Representation in disputes and legal consultation", rest: " (work of attorneys) — not handled. We can refer you to an attorney (same as above)" },
    { strong: "Residence-status application services", rest: " (work of administrative scriveners) — handled by 四葉行政書士事務所 under a separate contract" },
    { strong: "Real-estate brokerage and rental management", rest: " (licensed real-estate business) — handled by Yotsuba Real Estate Co., Ltd. under a separate contract" },
  ],
  feeH2: "How are fees decided?",
  feeLead1Strong: "The advisory fee is consideration for consultations; procedures are charged per filing.",
  feeLead1Rest:
    " Every unit price is published in the fee table, together with what is not included and whom we refer you to in those cases. Quotes are given in writing before we start — the amount is never decided after the work has begun.",
  feeTableHead: ["Main fees (tax incl.)", "Unit", "Amount"],
  feeRows: [
    ["Advisory (consultations)", "per month", "from ¥22,000"],
    ["Payroll (outsourced to us)", "per person / month", "¥1,100"],
    ["Support for bringing payroll in-house on freee", "—", "included in the advisory fee"],
    ["Social/employment insurance enrollment report", "per person", "¥2,750 each"],
    ["Work rules, new drafting", "package", "¥88,000–220,000"],
    ["Subsidy application (advisory clients only)", "package", "no upfront fee + 20% success fee"],
    ["Disability pension claim (new)", "per case", "¥30,000 upfront + 3 months of pension"],
  ],
  feeDiscountStrong: "In August 2026 we lowered procedure fees by roughly 30%.",
  feeDiscountRest:
    " With freee人事労務 and generative AI, the work of procedures gets lighter, and we pass that on. What AI makes cheaper is the work, not the responsibility — judgment stays with the consultant. You can also choose not to outsource payroll at all and have us support bringing it in-house on freee, within the advisory contract.",
  feeLink1: "Fee table (all items)",
  feeLink2: "How we work (how far we use AI)",
  feeSeparate:
    "* Fees are separate from those of Yotsuba Real Estate Co., Ltd. and 四葉行政書士事務所. There is no combined billing, and no discount for engaging more than one office.",
  disclaimer: "This page is general information. Individual cases are advised after review by the licensed consultant.",
  navFee: "Fees",
  navFlow: "How we work",
  navFaq: "FAQ",
  navAbout: "About",
};

const ZH_TW: Copy = {
  metaTitle: "四葉社會保險勞務士事務所｜東京文京區・擅長障害福祉的社勞士",
  metaDescription:
    "位於東京都文京區小日向、茗荷谷站步行5分鐘的四葉社會保險勞務士事務所。顧問費是勞務諮詢的對價，諮詢不限次數；把薪資計算改為在freee上自行處理（內製）的體制建立支援，也包含在顧問費內。對應障害福祉・介護的勞務、處遇改善加算、僱用相關助成金、外國人僱用。由曾任新聞記者的社會保險勞務士協助您。",
  heroAlt: "四葉社會保險勞務士事務所（東京都文京區）",
  h1: "四葉社會保險勞務士事務所",
  leadStrong: "位於東京都文京區小日向的社會保險勞務士事務所。",
  leadRest:
    "把人的手續，化為事業的力量。——只需顧問費，勞務諮詢不限次數；把薪資計算改為在freee上自行處理（內製）的體制建立支援，也包含在顧問費內。障害福祉・介護的勞務、處遇改善加算、助成金、外國人僱用，由曾任新聞記者的社勞士對應。中文可。",
  answerStrong: "顧問費是勞務諮詢的對價。",
  answerRest:
    "諮詢不限次數與時間。薪資計算可委託本事務所代行，或選擇由我們支援您在freee上改為自行計算（內製）——後者包含在顧問費內。手續與顧問客戶看著同一份資料推進，費用在著手前以書面提出。",
  whenH2: "這些時候，歡迎諮詢",
  whenItems: [
    { strong: "薪資計算目前外包，想導入freee改為自己處理", rest: "——設定的設計與每月的判斷，在顧問費範圍內支援" },
    { strong: "以業務委託合作的人，擔心實際上是否屬於僱用", rest: "——依實際狀態而非契約書判斷。放著不管，可能被追溯請求" },
    { strong: "要僱用兼職人員，不確定是否要加入社會保險", rest: "——每週約定工時是分界線" },
    { strong: "要讓家人成為員工", rest: "——是否同住、是否任董事、是否考慮助成金。有些事必須在入職日之前決定" },
    { strong: "要僱用領取年金同時工作的人", rest: "——薪資的訂法，會改變年金被停發的金額" },
    { strong: "有員工派駐中國等海外", rest: "——出差還是派遣，勞災的處理完全不同" },
    { strong: "要結束公司", rest: "——社會保險與勞動保險，有比登記更早到來的期限" },
  ],
  whenColumnPre: "→ ",
  whenColumnLink: "勞務專欄",
  whenColumnPost: " 中寫有各問題的答案。",
  services: [
    { href: "/labor/services/shogu-kaizen", label: "處遇改善加算的支援", sub: "從薪資規程整備到計畫・實績報告" },
    { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉的勞務管理", sub: "人員配置基準與日常手續" },
    { href: "/labor/services/joseikin", label: "僱用相關助成金的申請", sub: "career up助成金等" },
    { href: "/labor/services/gaikokujin-koyo", label: "外國人僱用（介護・育成就勞）的勞務", sub: "多語言對應" },
    { href: "/labor/services/gaibu-kansanin", label: "外部監查會查核的勞務", sub: "面向育成就勞・監理支援機關" },
  ],
  repName: "浦松 丈二",
  repBody1: "曾任每日新聞中國總局長（記者資歷34年）。社會保險勞務士",
  repBody2:
    "・行政書士（登錄號 第25087022號）・宅地建物取引士。整理制度與現場之間的「複雜」並傳達——把記者的本領，用在勞務上。",
  repProfile: "簡介：",
  rolesH2: "哪個事務所負責什麼？",
  rolesBody:
    "開辦障害福祉事業需要三件事：物件、指定申請、勞務。物件由四葉不動產株式會社、指定申請文件的製作由四葉行政書士事務所、勞務由本事務所，各自以另行簽訂的契約承接。您可以只委託需要的部分，其他部分委託其他公司也沒有問題。",
  rolesLink1: "尋找可用於團體家屋的物件（四葉不動產）",
  rolesLink2: "障害福祉服務的指定申請（四葉行政書士事務所）",
  rolesNote:
    "※四葉不動產株式會社・四葉行政書士事務所・四葉社會保險勞務士事務所為各自獨立的事業體，分別承接委託（不收取、也不支付介紹費）。",
  notH2: "本事務所不承辦什麼？",
  notItems: [
    { strong: "稅務申報・稅務代理・稅務諮詢", rest: "（稅理士的業務）——不承辦。如有需要，為您介紹稅理士（不收取介紹費）" },
    { strong: "登記", rest: "（司法書士的業務）——不承辦。如有需要，為您介紹司法書士（同上）" },
    { strong: "具紛爭性案件的代理・法律諮詢", rest: "（律師的業務）——不承辦。如有需要，為您介紹律師（同上）" },
    { strong: "在留資格的申請取次", rest: "（行政書士的業務）——由四葉行政書士事務所另行簽約承接" },
    { strong: "不動產的仲介・租賃管理", rest: "（宅地建物取引業）——由四葉不動產株式會社另行簽約承接" },
  ],
  feeH2: "費用是怎麼決定的？",
  feeLead1Strong: "顧問費是勞務諮詢的對價，手續按申報件數每次另計。",
  feeLead1Rest:
    "單價全數刊載於報酬額表。不包含的項目與該情況下的轉介對象，也寫在同一張表上。報價在著手前以書面提出，不會有開始作業後才決定金額的情況。",
  feeTableHead: ["主要費用（含稅）", "單位", "金額"],
  feeRows: [
    ["顧問（諮詢）", "月額", "22,000日圓起"],
    ["薪資計算（代行）", "每人／月", "1,100日圓"],
    ["改為在freee上自行計算（內製）的支援", "—", "包含在顧問費內"],
    ["社會保險・僱用保險 資格取得届", "每人", "各 2,750日圓"],
    ["工作規則 新規製作", "一式", "88,000〜220,000日圓"],
    ["助成金申請代行（限顧問客戶）", "一式", "無著手金 ＋ 成功報酬20%"],
    ["障害年金 裁定請求（新規）", "1件", "著手金30,000日圓 ＋ 年金3個月分"],
  ],
  feeDiscountStrong: "2026年8月，手續費用整體調降約3成。",
  feeDiscountRest:
    "藉由freee人事労務與生成式AI，手續的作業變輕，因此回饋給客戶。但AI能降低的是作業，不是責任。判斷由社會保險勞務士進行。也可選擇不把薪資計算委託本事務所，而在顧問契約的範圍內接受freee內製體制的建立支援。",
  feeLink1: "報酬額表（全項目）",
  feeLink2: "進行方式（AI用到哪裡）",
  feeSeparate:
    "※與四葉不動產株式會社・四葉行政書士事務所的費用各自獨立。不會合併請款，也沒有因委託多個事務所而來的折扣。",
  disclaimer: "本頁為一般性資訊。個別案件將經有資格者確認後為您說明。",
  navFee: "費用",
  navFlow: "受任流程",
  navFaq: "常見問題",
  navAbout: "事務所概要",
};

const ZH: Copy = {
  metaTitle: "四葉社会保険労務士事務所｜东京文京区・擅长残障福祉的社劳士",
  metaDescription:
    "位于东京都文京区小日向、茗荷谷站步行5分钟的四葉社会保険労務士事務所。顾问费是劳务咨询的对价，咨询不限次数；把工资计算改为在freee上自行处理（内制）的体制建立支援，也包含在顾问费内。对应残障福祉・介护的劳务、处遇改善加算、雇用相关助成金、外国人雇用。由曾任新闻记者的社会保险劳务士协助您。",
  heroAlt: "四葉社会保険労務士事務所（东京都文京区）",
  h1: "四葉社会保険労務士事務所",
  leadStrong: "位于东京都文京区小日向的社会保险劳务士事务所。",
  leadRest:
    "把人的手续，化为事业的力量。——只需顾问费，劳务咨询不限次数；把工资计算改为在freee上自行处理（内制）的体制建立支援，也包含在顾问费内。残障福祉・介护的劳务、处遇改善加算、助成金、外国人雇用，由曾任新闻记者的社劳士对应。中文可。",
  answerStrong: "顾问费是劳务咨询的对价。",
  answerRest:
    "咨询不限次数与时间。工资计算可委托本事务所代行，或选择由我们支援您在freee上改为自行计算（内制）——后者包含在顾问费内。手续与顾问客户看着同一份数据推进，费用在着手前以书面提出。",
  whenH2: "这些时候，欢迎咨询",
  whenItems: [
    { strong: "工资计算目前外包，想导入freee改为自己处理", rest: "——设定的设计与每月的判断，在顾问费范围内支援" },
    { strong: "以业务委托合作的人，担心实际上是否属于雇用", rest: "——按实际状态而非合同书判断。放着不管，可能被追溯请求" },
    { strong: "要雇用兼职人员，不确定是否要加入社会保险", rest: "——每周约定工时是分界线" },
    { strong: "要让家人成为员工", rest: "——是否同住、是否任董事、是否考虑助成金。有些事必须在入职日之前决定" },
    { strong: "要雇用领取年金同时工作的人", rest: "——工资的定法，会改变年金被停发的金额" },
    { strong: "有员工派驻中国等海外", rest: "——出差还是派遣，劳灾的处理完全不同" },
    { strong: "要结束公司", rest: "——社会保险与劳动保险，有比登记更早到来的期限" },
  ],
  whenColumnPre: "→ ",
  whenColumnLink: "劳务专栏",
  whenColumnPost: " 中写有各问题的答案。",
  services: [
    { href: "/labor/services/shogu-kaizen", label: "处遇改善加算的支援", sub: "从工资规程整备到计划・实绩报告" },
    { href: "/labor/services/kaigo-roumu", label: "介护・残障福祉的劳务管理", sub: "人员配置基准与日常手续" },
    { href: "/labor/services/joseikin", label: "雇用相关助成金的申请", sub: "career up助成金等" },
    { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介护・育成就劳）的劳务", sub: "多语言对应" },
    { href: "/labor/services/gaibu-kansanin", label: "外部监查会查核的劳务", sub: "面向育成就劳・监理支援机关" },
  ],
  repName: "浦松 丈二",
  repBody1: "曾任每日新闻中国总局长（记者经历34年）。社会保险劳务士",
  repBody2:
    "・行政书士（登录号 第25087022号）・宅地建物取引士。整理制度与现场之间的「复杂」并传达——把记者的本领，用在劳务上。",
  repProfile: "简介：",
  rolesH2: "哪个事务所负责什么？",
  rolesBody:
    "开办残障福祉事业需要三件事：物件、指定申请、劳务。物件由四葉不動産株式会社、指定申请文件的制作由四葉行政書士事務所、劳务由本事务所，各自以分别签订的合同承接。您可以只委托需要的部分，其他部分委托其他公司也没有问题。",
  rolesLink1: "寻找可用于团体家屋的物件（四葉不動産）",
  rolesLink2: "残障福祉服务的指定申请（四葉行政書士事務所）",
  rolesNote:
    "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所为各自独立的事业体，分别承接委托（不收取、也不支付介绍费）。",
  notH2: "本事务所不承办什么？",
  notItems: [
    { strong: "税务申报・税务代理・税务咨询", rest: "（税理士的业务）——不承办。如有需要，为您介绍税理士（不收取介绍费）" },
    { strong: "登记", rest: "（司法书士的业务）——不承办。如有需要，为您介绍司法书士（同上）" },
    { strong: "具纠纷性案件的代理・法律咨询", rest: "（律师的业务）——不承办。如有需要，为您介绍律师（同上）" },
    { strong: "在留资格的申请取次", rest: "（行政书士的业务）——由四葉行政書士事務所另行签约承接" },
    { strong: "不动产的中介・租赁管理", rest: "（宅地建物取引业）——由四葉不動産株式会社另行签约承接" },
  ],
  feeH2: "费用是怎么决定的？",
  feeLead1Strong: "顾问费是劳务咨询的对价，手续按申报件数每次另计。",
  feeLead1Rest:
    "单价全部刊载于报酬额表。不包含的项目与该情况下的介绍对象，也写在同一张表上。报价在着手前以书面提出，不会有开始作业后才决定金额的情况。",
  feeTableHead: ["主要费用（含税）", "单位", "金额"],
  feeRows: [
    ["顾问（咨询）", "月额", "22,000日元起"],
    ["工资计算（代行）", "每人／月", "1,100日元"],
    ["改为在freee上自行计算（内制）的支援", "—", "包含在顾问费内"],
    ["社会保险・雇用保险 资格取得届", "每人", "各 2,750日元"],
    ["就业规则 新规制作", "一式", "88,000〜220,000日元"],
    ["助成金申请代行（限顾问客户）", "一式", "无着手金 ＋ 成功报酬20%"],
    ["障害年金 裁定请求（新规）", "1件", "着手金30,000日元 ＋ 年金3个月分"],
  ],
  feeDiscountStrong: "2026年8月，手续费用整体下调约3成。",
  feeDiscountRest:
    "借助freee人事労務与生成式AI，手续的作业变轻，因此回馈给客户。但AI能降低的是作业，不是责任。判断由社会保险劳务士进行。也可选择不把工资计算委托本事务所，而在顾问合同的范围内接受freee内制体制的建立支援。",
  feeLink1: "报酬额表（全项目）",
  feeLink2: "进行方式（AI用到哪里）",
  feeSeparate:
    "※与四葉不動産株式会社・四葉行政書士事務所的费用各自独立。不会合并请款，也没有因委托多个事务所而来的折扣。",
  disclaimer: "本页为一般性信息。个别案件将经有资格者确认后为您说明。",
  navFee: "费用",
  navFlow: "受任流程",
  navFaq: "常见问题",
  navAbout: "事务所概要",
};

const COPY: Record<LangCode, Copy> = { ja: JA, en: EN, "zh-tw": ZH_TW, zh: ZH };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return buildPageMetadata({
    businessKey: "labor",
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/labor",
    keywords: ["社労士 文京区", "障害福祉 社労士", "介護 事業所 労務"],
    locale,
    absoluteTitle: true,
  });
}

export default async function LaborTopPage() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return (
    <>
      {/* ヒーロー（H1＝事務所名のみ） */}
      <section className="relative">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-b-3xl sm:mt-4 sm:rounded-3xl">
          <img
            src="/hero/labor-top-16x9.webp"
            alt={c.heroAlt}
            width={1600}
            height={900}
            className="h-[52vw] max-h-[440px] w-full object-cover sm:h-auto"
            fetchPriority="high"
          />
          <div className="md:absolute md:inset-0 md:flex md:items-center">
            <div className="bg-surface p-5 md:m-8 md:max-w-xl md:rounded-2xl md:bg-white/30 md:p-7 md:backdrop-blur-sm">
              <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">{c.h1}</h1>
              <p className="mt-3 text-sm leading-relaxed text-text sm:text-base">
                <strong>{c.leadStrong}</strong>
                {c.leadRest}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4">
        {/* 直答ブロック（luck428-column-seo 第7条1） */}
        <section className="mt-8 rounded-2xl border-l-4 border-primary bg-primary-tint p-5">
          <p className="leading-relaxed text-text">
            <strong>{c.answerStrong}</strong>
            {c.answerRest}
          </p>
        </section>

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
          <img
            src="/staff/uramatsu.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={160}
            height={213}
            className="w-32 flex-shrink-0 rounded-xl object-cover sm:w-40"
          />
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink">{c.repName}</h2>
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

        {/* 料金 */}
        <section className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-ink">{c.feeH2}</h2>
          <p className="mt-3 text-sm leading-relaxed text-text">
            <strong>{c.feeLead1Strong}</strong>
            {c.feeLead1Rest}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">{c.feeTableHead[0]}</th>
                  <th className="border border-border px-3 py-2 w-24">{c.feeTableHead[1]}</th>
                  <th className="border border-border px-3 py-2 w-40 text-right">{c.feeTableHead[2]}</th>
                </tr>
              </thead>
              <tbody className="text-text-muted">
                {c.feeRows.map(([a, b, d]) => (
                  <tr key={a}>
                    <td className="border border-border px-3 py-2">{a}</td>
                    <td className="border border-border px-3 py-2">{b}</td>
                    <td className="border border-border px-3 py-2 text-right">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text">
            <strong>{c.feeDiscountStrong}</strong>
            {c.feeDiscountRest}
          </p>
          <p className="mt-3 text-sm">
            →{" "}
            <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
              {c.feeLink1}
            </Link>
            ／{" "}
            <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
              {c.feeLink2}
            </Link>
          </p>
          <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.feeSeparate}</p>
        </section>

        <p className="mt-10 text-xs leading-relaxed text-text-muted">{c.disclaimer}</p>

        {/* 導線 */}
        <nav aria-label="サイト内導線" className="mt-10 flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary">
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="underline">{c.navFee}</Link>
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="underline">{c.navFlow}</Link>
          <Link href={addLocalePrefix("/labor/faq", locale)} className="underline">{c.navFaq}</Link>
          <Link href={addLocalePrefix("/labor/about", locale)} className="underline">{c.navAbout}</Link>
        </nav>
      </main>

      <div className="mx-auto max-w-5xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
