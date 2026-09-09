import type { LangCode } from "@/config/languages";
import { LABOR_PLAN_COPY } from "./plan-copy";
import { LABOR_PRICING, formatLaborYen } from "./pricing";

type Copy = {
  hero: string; sub: string; title: string; intro: string;
  home: string; fees: string; faq: string; flow: string; viewPlan: string; consult: string;
  foreignTitle: string; foreignBody: string; foreignLink: string; visaLink: string;
  industryLabel: string; ghTitle: string; ghBody: string; ghLink: string; ghLegalLink: string;
  qualification: string; chineseTitle: string; chineseBody: string;
  includedTitle: string; included: string[]; excludedTitle: string; excluded: string[];
  recruitmentTitle: string; recruitment: string; recruitmentBoundary: string;
  payrollTitle: string; payroll: string; socialTitle: string; social: string;
  aiTitle: string; ai: string; setupDetail: string;
  steps: { name: string; text: string }[];
  questions: [string, string, string, string, string, string, string, string, string];
  quote: string; units: string; disclaimer: string;
};
export const LABOR_SERVICE_COPY: Record<LangCode, Copy> = {
  ja: {
    hero: "人事部を、丸ごと外注。",
    sub: "給与計算、社会保険手続、労務相談、採用、外国人雇用までまとめて対応。",
    title: "人事部丸投げ・外国人雇用・障害福祉に強い社労士｜四葉社会保険労務士事務所",
    intro: "給与計算・通常手続・労務相談をまとめて任せられる外部人事部サービスです。freee人事労務・LINE打刻を使い、会社側と役割を分けて毎月の人事労務を支援します。",
    home: "ホーム", fees: "料金", faq: "よくある質問", flow: "導入と毎月の進め方", viewPlan: "人事部丸投げプランを見る", consult: "無料相談を予約する",
    foreignTitle: "外国人雇用企業の人事労務をサポート",
    foreignBody: "採用条件の相談から、入社後の給与・社会保険・労務まで。代表は申請取次行政書士でもあり、在留資格と雇用条件の整合性を見通してご案内します。在留資格申請は行政書士業務として別契約です。",
    foreignLink: "外国人雇用を相談する", visaLink: "在留資格・申請取次について（行政書士）",
    industryLabel: "重点業種・得意業種", ghTitle: "障害福祉・グループホームの人事労務にも強い",
    ghBody: "採用・シフト・給与・社会保険・処遇改善など、開設後の人事労務を支援します。人事部丸投げプランの月額に含む範囲と、就業規則・処遇改善等の個別業務を分けてご案内します。",
    ghLink: "障害福祉・GHの人事労務", ghLegalLink: "開設・許認可について（行政書士）",
    qualification: "代表社会保険労務士は、申請取次行政書士でもあります。外国人雇用について、在留資格から入社後の給与・社会保険・労務まで一連の流れを見通してご相談いただけます。",
    chineseTitle: "中国語で直接ご相談いただけます", chineseBody: "経営者との基本相談、給与・社会保険の説明、入社時の基本説明は月額内です。その他の外国語はAI・翻訳支援を活用した基本案内に対応します。専門翻訳・長時間通訳は別料金です。",
    includedTitle: "月額に含まれるもの",
    included: ["freee人事労務スタンダード・LINE打刻・Web給与明細", "毎月の給与計算・給与明細・社会保険料率等の反映", "通常の労務相談・従業員対応相談", "資格取得・資格喪失・被扶養者変更", "月額変更届・賞与支払届・算定基礎届・労働保険年度更新", "外国人雇用の基本相談・社保雇保確認・採用後労務", "中国語での基本相談・給与社保説明・入社時基本説明", "求人票・採用条件・給与条件の相談、雇用契約・労働条件通知書のレビュー"],
    excludedTitle: "月額に含まれないもの",
    excluded: ["freee会計・その他のfreee製品", "社会保険新規適用・労働保険成立・雇用保険適用事業所設置・新設法人初期労務", "勤怠集計・打刻修正・打刻漏れ確認・残業集計・有休残数管理", "年末調整・在留資格申請", "本格採用RPO・専門翻訳・長時間通訳", "紛争性案件・大量入退社・過去給与修正"],
    recruitmentTitle: "採用労務サポート", recruitment: "採用計画作成、求人票の新規作成・改稿、採用フロー設計、定期ミーティング、条件設計資料作成を行います。",
    recruitmentBoundary: "月額内は相談・助言・レビュー。作成・運用はオプションです。本格RPOは別見積りとし、対応範囲を事前に確認します。求職者の紹介・あっせんは行いません。",
    payrollTitle: "給与計算を毎月の運用まで", payroll: "従業員がLINE打刻を行い、会社側が確認・修正・確定。freeeの給与計算結果を四葉が確認し、会社側が最終承認します。",
    socialTitle: "通常手続と日常の労務相談", social: "資格取得・喪失、被扶養者変更、月額変更、賞与支払、算定基礎、年度更新を月額に含めます。新規適用は別料金です。",
    aiTitle: "freee・LINEとAIの活用", ai: "freee人事労務とAIを活用して定型確認や情報整理を効率化し、最終的な確認・判断は社会保険労務士が行います。",
    setupDetail: "権限設定と基本操作説明も含みます。移行や複雑な給与体系など、作業範囲に応じて事前にお見積りします。新規適用の申請は初期設定に含まれません。",
    steps: [
      { name: "ご相談", text: "給与計算対象人数、現状の勤怠運用、給与体系、外国人雇用、業種を伺います。" },
      { name: "業務範囲とお見積り", text: "月額・初期導入費・別料金の業務を同時に書面でご案内します。会社側で行う作業も確認します。" },
      { name: "ご契約", text: "含む業務・含まない業務・会社側の責任を明記します。在留資格申請などは資格業務ごとに別契約です。" },
      { name: "初期導入・運用設計", text: "freee・LINE打刻・給与体系・従業員・社会保険情報・権限を設定し、初回給与テストと基本操作説明、運用フロー設計を行います。" },
      { name: "毎月の給与・通常手続", text: "従業員がLINE打刻し、会社側が勤怠を確認・修正・確定。freeeの給与計算内容を四葉が確認します。" },
      { name: "会社側の最終承認・報告", text: "給与計算結果を会社側が最終承認し、確認結果を共有します。人事変更情報は会社側からご提供いただきます。" },
    ],
    questions: ["人事部丸投げプランには何が含まれますか？", "料金は人数によってどう変わりますか？", "初期費用は何にかかりますか？", "勤怠確認や給与の承認も任せられますか？", "freee会計も含まれますか？", "採用はどこまで含まれますか？", "中国語・その他の外国語に対応していますか？", "在留資格申請や年末調整も月額内ですか？", "グループホーム・障害福祉事業者も依頼できますか？"],
    quote: "31名以上、新規適用、年末調整、本格RPO、賞与3回目以降などの料金・範囲は個別にご案内します。", units: "人数は給与計算対象人数です。1〜10名は人数帯、11〜30名は10名超1名ごとの加算で計算します。", disclaimer: "本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。",
  },
  en: {
    hero: "Outsource your HR department.", sub: "Payroll, social insurance, labor advice, hiring and foreign-employment support in one HR service.",
    title: "Outsourced HR, foreign employment & disability welfare | 四葉社会保険労務士事務所",
    intro: "An external HR service covering payroll, routine procedures and labor advice. We use freee HR and LINE clock-in, with clearly defined responsibilities for your company and our office.",
    home: "Home", fees: "Fees", faq: "Frequently asked questions", flow: "Setup and monthly workflow", viewPlan: "View the HR plan", consult: "Book a free consultation",
    foreignTitle: "HR support for companies employing foreign nationals", foreignBody: "From advice on hiring terms to payroll, social insurance and labor matters after joining. Our representative is also an administrative scrivener authorized for immigration application intermediation. Residence status applications require a separate administrative scrivener contract.", foreignLink: "Discuss foreign employment", visaLink: "Residence status applications (administrative scrivener)",
    industryLabel: "Industries we specialize in", ghTitle: "HR expertise for disability welfare and group homes", ghBody: "Support for hiring, shifts, payroll, social insurance and wage improvement after opening. We distinguish the monthly HR plan from separately commissioned work such as work rules and wage-improvement design.", ghLink: "Disability-welfare and group-home HR", ghLegalLink: "Opening and licensing (administrative scrivener)",
    qualification: "Our representative labor consultant is also an administrative scrivener authorized for immigration application intermediation, helping you consider residence status together with payroll, social insurance and labor matters after hiring.",
    chineseTitle: "Consult directly in Chinese", chineseBody: "Basic management consultations, payroll and social insurance explanations, and onboarding explanations in Chinese are included. Basic guidance in other languages uses AI and translation assistance. Specialist translation and extended interpreting carry separate fees.",
    includedTitle: "Included in the monthly fee", included: ["freee HR Standard, LINE clock-in and online payslips", "Monthly payroll, payslips and social insurance rate updates", "Routine labor and employee-response consultations", "Insurance enrollment, loss of eligibility and dependent changes", "Monthly remuneration changes, bonus payment reports, annual remuneration assessment and annual labor insurance renewal", "Basic foreign-employment consultations, insurance checks and post-hire labor matters", "Basic Chinese consultations and payroll, insurance and onboarding explanations", "Advice on job postings, hiring and pay terms; reviews of employment contracts and working-condition notices"],
    excludedTitle: "Excluded from the monthly fee", excluded: ["freee Accounting and other freee products", "Initial social, labor and employment insurance registration and initial labor setup for a new company", "Attendance aggregation, time-entry corrections, missed-entry checks, overtime aggregation and paid-leave balance management", "Year-end tax adjustment and residence status applications", "Full recruitment process outsourcing, specialist translation and extended interpreting", "Disputes, large-scale staff entries/exits and corrections to past payroll"],
    recruitmentTitle: "Recruitment and labor support", recruitment: "Recruitment plans, new or revised job postings, hiring workflow design, regular meetings and employment-terms design documents.", recruitmentBoundary: "The monthly plan covers advice and reviews. Creation and operation are optional services. Full RPO requires a separate quote and advance agreement on scope; job placement or referral is not included.",
    payrollTitle: "A clear monthly payroll workflow", payroll: "Employees clock in through LINE. Your company reviews, corrects and finalizes attendance. We review the payroll calculated in freee, and your company gives final approval.",
    socialTitle: "Routine procedures and day-to-day labor advice", social: "Insurance enrollment and departure, dependent changes, remuneration changes, bonus reports and annual insurance procedures are included. Initial registration is separately charged.",
    aiTitle: "Using freee, LINE and AI", ai: "freee HR and AI help streamline routine checks and information organization. Final professional checks and judgments are made by the labor consultant.", setupDetail: "Permission settings and basic operation guidance are included. Migration and complex pay structures are quoted in advance according to scope. Initial insurance registration applications are not part of system setup.",
    steps: [
      {name:"Consultation",text:"We ask about payroll headcount, attendance processes, pay structure, foreign employment and your industry."},
      {name:"Scope and quotation",text:"Monthly fees, initial setup and separate services are quoted together in writing. Your company's responsibilities are also confirmed."},
      {name:"Contract",text:"Included and excluded work and company responsibilities are recorded. Residence status applications require a separate contract for the relevant profession."},
      {name:"Initial setup and workflow design",text:"We configure freee, LINE clock-in, pay structure, employees, insurance information and permissions, then run the initial payroll test and explain the workflow."},
      {name:"Monthly payroll and routine procedures",text:"Employees clock in through LINE; your company checks, corrects and finalizes attendance. We review payroll calculated in freee."},
      {name:"Company approval and reporting",text:"Your company gives final approval of payroll results. We share the review results, and your company provides personnel changes."},
    ],
    questions:["What does the HR plan include?","How does the fee change with headcount?","What is the initial setup fee for?","Can you approve attendance and payroll for us?","Is freee Accounting included?","How much recruitment work is included?","Do you support Chinese and other languages?","Are residence applications and year-end tax adjustment included?","Can group homes and disability-welfare providers use the service?"],
    quote:"Fees and scope for 31 or more recipients, initial registration, year-end tax adjustment, full RPO and third or subsequent bonuses are discussed individually.",units:"Headcount means payroll recipients. Bands apply to 1–10; each recipient above 10 adds to the fee up to 30.",disclaimer:"This page provides general information. Individual matters are reviewed by a qualified professional.",
  },
  "zh-tw": {
    hero:"把人事部交給外部專業團隊。",sub:"薪資計算、社會保險手續、勞務諮詢、招聘與外國人雇用，一併支援。",title:"人事部外包・外國人雇用・障害福祉｜四葉社会保険労務士事務所",
    intro:"整合薪資計算、一般手續與勞務諮詢的外部人事部服務。透過freee人事勞務與LINE打卡，明確區分公司與事務所的責任，支援每月的人事作業。",
    home:"首頁",fees:"費用",faq:"常見問題",flow:"導入與每月作業流程",viewPlan:"查看人事部全包方案",consult:"預約免費諮詢",
    foreignTitle:"支援雇用外國人的企業",foreignBody:"從招聘條件諮詢到入職後的薪資、社會保險與勞務。代表亦為可辦理申請取次的行政書士，綜合考量在留資格與雇用條件。在留資格申請以行政書士業務另行簽約。",foreignLink:"諮詢外國人雇用",visaLink:"在留資格・申請取次（行政書士）",
    industryLabel:"重點業種・專長領域",ghTitle:"擅長障害福祉與團體家屋的人事勞務",ghBody:"支援開設後的招聘、排班、薪資、社會保險及處遇改善。人事部方案月費涵蓋的工作，與就業規則、處遇改善設計等個別業務，會分別說明。",ghLink:"障害福祉・團體家屋的人事勞務",ghLegalLink:"開設・許可申請（行政書士）",
    qualification:"代表社會保險勞務士亦為可辦理申請取次的行政書士，可從在留資格到入職後的薪資、社會保險與勞務，綜觀流程提供諮詢。",
    chineseTitle:"可直接以中文諮詢",chineseBody:"經營者基本諮詢、薪資與社會保險說明、入職基本說明均包含於月費。其他外語透過AI及翻譯支援提供基本指引。專業翻譯與長時間口譯另行收費。",
    includedTitle:"月費包含的內容",included:["freee人事勞務Standard、LINE打卡、網路薪資明細","每月薪資計算、薪資明細、社會保險費率等更新","一般勞務與員工應對諮詢","資格取得、資格喪失、被扶養者變更","月額變更屆、獎金支付屆、算定基礎屆、勞動保險年度更新","外國人雇用基本諮詢、社保雇保確認、入職後勞務","中文基本諮詢、薪資社保說明、入職基本說明","職缺、招聘條件、薪資條件的諮詢；雇用契約及勞動條件通知書審閱"],
    excludedTitle:"月費不包含的內容",excluded:["freee會計及其他freee產品","社會保險新規適用、勞動保險成立、雇用保險設置、新設法人初期勞務","出勤彙整、打卡修正、漏打卡確認、加班彙整、有薪假餘額管理","年末調整、在留資格申請","完整招聘RPO、專業翻譯、長時間口譯","爭議案件、大量入離職、過去薪資修正"],
    recruitmentTitle:"招聘勞務支援",recruitment:"招聘計畫、職缺內容新製與改寫、招聘流程設計、定期會議、雇用條件設計資料製作。",recruitmentBoundary:"月費內為諮詢、建議與審閱；製作及營運為加購項目。完整RPO另行報價，事前確認範圍，不包含求職者介紹或仲介。",
    payrollTitle:"明確的每月薪資流程",payroll:"員工以LINE打卡，公司確認、修正並確定出勤。四葉確認freee計算的薪資內容，由公司最終核准。",socialTitle:"一般手續與日常勞務諮詢",social:"資格取得與喪失、被扶養者變更、月額變更、獎金支付、算定基礎、年度更新均包含於月費。新規適用另行收費。",
    aiTitle:"運用freee、LINE與AI",ai:"運用freee人事勞務與AI提高例行確認及資訊整理的效率，最終的專業確認與判斷由社會保險勞務士負責。",setupDetail:"亦包含權限設定及基本操作說明。資料移轉或複雜薪資制度等依工作範圍事前報價。新規適用申請不包含於系統設定。",
    steps:[{name:"諮詢",text:"了解薪資計算人數、出勤運作、薪資制度、外國人雇用與業種。"},{name:"範圍與報價",text:"同時以書面說明月費、初期費用與另計業務，確認公司負責的工作。"},{name:"簽約",text:"明定包含及不包含的工作與公司責任。在留資格申請等依資格業務另行簽約。"},{name:"初期導入與流程設計",text:"設定freee、LINE打卡、薪資制度、員工、社保資料與權限，進行首次薪資測試、基本操作說明及流程設計。"},{name:"每月薪資與一般手續",text:"員工以LINE打卡，公司確認、修正並確定出勤，四葉確認freee的薪資計算內容。"},{name:"公司核准與報告",text:"由公司最終核准薪資結果，分享確認結果，人事異動資訊由公司提供。"}],
    questions:["人事部全包方案包含什麼？","費用如何依人數計算？","初期費用用於哪些工作？","可以代為確定出勤與核准薪資嗎？","freee會計也包含嗎？","招聘支援包含到哪裡？","支援中文及其他外語嗎？","在留資格申請與年末調整也在月費內嗎？","團體家屋與障害福祉業者也能委託嗎？"],
    quote:"31人以上、新規適用、年末調整、完整RPO、第3次起的獎金等，其費用與範圍個別說明。",units:"人數指薪資計算對象。1至10人按人數區間計費，11至30人按超過10人的每1人加收。",disclaimer:"本頁提供一般資訊。個別案件須由具資格的專業人士確認。",
  },
  zh: {
    hero:"把人事部交给外部专业团队。",sub:"工资计算、社会保险手续、劳务咨询、招聘与外国人雇用，一并支持。",title:"人事部外包・外国人雇用・障害福祉｜四葉社会保険労務士事務所",
    intro:"整合工资计算、一般手续与劳务咨询的外部人事部服务。通过freee人事劳务与LINE打卡，明确区分公司与事务所的责任，支持每月的人事工作。",
    home:"首页",fees:"费用",faq:"常见问题",flow:"导入与每月工作流程",viewPlan:"查看人事部全包方案",consult:"预约免费咨询",
    foreignTitle:"支持雇用外国人的企业",foreignBody:"从招聘条件咨询到入职后的工资、社会保险与劳务。代表亦为可办理申请取次的行政书士，综合考虑在留资格与雇用条件。在留资格申请以行政书士业务另行签约。",foreignLink:"咨询外国人雇用",visaLink:"在留资格・申请取次（行政书士）",
    industryLabel:"重点行业・擅长领域",ghTitle:"擅长障害福祉与团体家屋的人事劳务",ghBody:"支持开设后的招聘、排班、工资、社会保险及处遇改善。人事部方案月费涵盖的工作，与就业规则、处遇改善设计等个别业务，会分别说明。",ghLink:"障害福祉・团体家屋的人事劳务",ghLegalLink:"开设・许可申请（行政书士）",
    qualification:"代表社会保险劳务士亦为可办理申请取次的行政书士，可从在留资格到入职后的工资、社会保险与劳务，综观流程提供咨询。",
    chineseTitle:"可直接用中文咨询",chineseBody:"经营者基本咨询、工资与社会保险说明、入职基本说明均包含于月费。其他外语通过AI及翻译支持提供基本指引。专业翻译与长时间口译另行收费。",
    includedTitle:"月费包含的内容",included:["freee人事劳务Standard、LINE打卡、网络工资明细","每月工资计算、工资明细、社会保险费率等更新","一般劳务与员工应对咨询","资格取得、资格丧失、被抚养者变更","月额变更届、奖金支付届、算定基础届、劳动保险年度更新","外国人雇用基本咨询、社保雇保确认、入职后劳务","中文基本咨询、工资社保说明、入职基本说明","职位、招聘条件、工资条件的咨询；雇用合同及劳动条件通知书审阅"],
    excludedTitle:"月费不包含的内容",excluded:["freee会计及其他freee产品","社会保险新规适用、劳动保险成立、雇用保险设置、新设法人初期劳务","出勤汇总、打卡修正、漏打卡确认、加班汇总、带薪假余额管理","年末调整、在留资格申请","完整招聘RPO、专业翻译、长时间口译","争议案件、大量入离职、过去工资修正"],
    recruitmentTitle:"招聘劳务支持",recruitment:"招聘计划、职位内容新建与改写、招聘流程设计、定期会议、雇用条件设计资料制作。",recruitmentBoundary:"月费内为咨询、建议与审阅；制作及运营为加购项目。完整RPO另行报价，事前确认范围，不包含求职者介绍或中介。",
    payrollTitle:"明确的每月工资流程",payroll:"员工以LINE打卡，公司确认、修正并确定出勤。四叶确认freee计算的工资内容，由公司最终批准。",socialTitle:"一般手续与日常劳务咨询",social:"资格取得与丧失、被抚养者变更、月额变更、奖金支付、算定基础、年度更新均包含于月费。新规适用另行收费。",
    aiTitle:"运用freee、LINE与AI",ai:"运用freee人事劳务与AI提高例行确认及信息整理的效率，最终的专业确认与判断由社会保险劳务士负责。",setupDetail:"亦包含权限设置及基本操作说明。资料迁移或复杂工资制度等依工作范围事前报价。新规适用申请不包含于系统设置。",
    steps:[{name:"咨询",text:"了解工资计算人数、出勤运作、工资制度、外国人雇用与行业。"},{name:"范围与报价",text:"同时以书面说明月费、初期费用与另计业务，确认公司负责的工作。"},{name:"签约",text:"明确包含及不包含的工作与公司责任。在留资格申请等按资格业务另行签约。"},{name:"初期导入与流程设计",text:"设置freee、LINE打卡、工资制度、员工、社保资料与权限，进行首次工资测试、基本操作说明及流程设计。"},{name:"每月工资与一般手续",text:"员工以LINE打卡，公司确认、修正并确定出勤，四叶确认freee的工资计算内容。"},{name:"公司批准与报告",text:"由公司最终批准工资结果，分享确认结果，人事变动信息由公司提供。"}],
    questions:["人事部全包方案包含什么？","费用如何按人数计算？","初期费用用于哪些工作？","可以代为确定出勤与批准工资吗？","freee会计也包含吗？","招聘支持包含到哪里？","支持中文及其他外语吗？","在留资格申请与年末调整也在月费内吗？","团体家屋与障害福祉业者也能委托吗？"],
    quote:"31人以上、新规适用、年末调整、完整RPO、第3次起的奖金等，其费用与范围个别说明。",units:"人数指工资计算对象。1至10人按人数区间计费，11至30人按超过10人的每1人加收。",disclaimer:"本页提供一般信息。个别案件须由具资格的专业人士确认。",
  },
};

export function getLaborPlanFaqs(locale: LangCode) {
  const c = LABOR_SERVICE_COPY[locale];
  const p = LABOR_PLAN_COPY[locale];
  const money = (amount: number) => formatLaborYen(amount, locale);
  const bands = LABOR_PRICING.bands.map(b => `${b.min}–${b.max}: ${money(b.monthly)}`).join(" / ");
  const answers = [c.included.join(" / "), `${bands} (${p.monthly}, ${p.tax}). ${p.additional(10, money(LABOR_PRICING.additionalRecipientFee))}. ${c.quote}`, `${p.setup}: ${locale === "en" ? p.from : ""}${money(LABOR_PRICING.initialSetupFrom)}${locale === "en" ? "" : p.from} (${p.tax}). ${p.setupItems.join(" / ")}. ${c.setupDetail}`, p.responsibility + " " + c.payroll, p.system, c.recruitmentBoundary, c.chineseBody, p.separate, c.ghBody];
  return c.questions.map((q, i) => ({ q, a: answers[i] }));
}
