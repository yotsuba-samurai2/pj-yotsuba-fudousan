import type { LangCode } from "@/config/languages";

/** V10 service copy; fees remain in labor/pricing.ts. */
type GhServiceCopy = {
  sector: string;
  stagesTitle: string;
  beforeTitle: string;
  before: string;
  afterTitle: string;
  after: string;
  separate: string;
  qualification: string;
  planIntro: string;
  routine: string;
  excluded: string;
  setupDetail: string;
  bandReason: string;
  recruitment: string;
  judgment: string;
  planLink: string;
  flowLink: string;
  careLink: string;
  treatmentLink: string;
  foreignLink: string;
  designationLink: string;
  sourceHeading: string;
};

export const GH_SERVICE_COPY: Record<LangCode, GhServiceCopy> = {
  ja: {
    sector: "重点業種：障害福祉・グループホーム",
    stagesTitle: "開設前と開設後で、依頼先を分けてご案内します",
    beforeTitle: "開設前の許認可・指定申請：行政書士",
    before: "四葉行政書士事務所が、開設に向けた要件整理、法人設立書類、許認可・指定申請、行政提出書類を支援します。指定後の加算届・変更届も行政書士業務としてご案内します。",
    afterTitle: "開設後の人事労務：社会保険労務士",
    after: "四葉社会保険労務士事務所が、人事部丸投げプランで給与計算・通常の社会保険手続・日常の労務相談・採用条件の相談を支援します。就業規則や処遇改善の賃金設計は、内容を確認して別途ご案内します。",
    separate: "許認可・指定申請や処遇改善の行政提出書類は行政書士業務、給与・社会保険・労務や処遇改善の賃金設計は社会保険労務士業務として、それぞれ別契約・別料金で受任します。各事務所が直接契約・請求し、事務所間で紹介料の授受はありません。",
    qualification: "代表社会保険労務士は申請取次行政書士でもあります。開設前の申請から開設後の運用までを見通し、業務ごとに契約範囲を整理します。",
    planIntro: "障害福祉・グループホームは四葉の重点業種です。採用・シフト・給与・社会保険・処遇改善などの負担に対し、主商品である人事部丸投げプランで開設後の人事労務を支援します。",
    routine: "月額には毎月の給与計算、給与明細、社会保険料率等の反映、通常の労務相談と、資格取得・喪失、被扶養者変更、月額変更届、賞与支払届、算定基礎届、労働保険年度更新を含みます。外国人雇用の基本相談と中国語での基本説明も対象です。",
    excluded: "勤怠集計・打刻修正・打刻漏れ確認・残業集計・有休残数管理は月額に含みません。新規適用・保険成立・雇用保険設置、新設法人初期労務、年末調整、本格RPO、専門翻訳・長時間通訳、紛争性案件、大量入退社、過去給与修正も月額の対象外です。必要な対応と費用は別途確認します。",
    setupDetail: "初期導入では、共通料金表に示す7項目に加え、権限設定と基本操作説明も行います。社会保険情報の設定は、新規適用申請の代行とは別です。",
    bandReason: "従業員数の増加に伴い、給与計算、手続、freee利用枠、問い合わせ対応等の業務量が増えるため、人数帯ごとの定額制としています。",
    recruitment: "月額内の採用支援は、求人票・採用条件・給与条件の相談と、雇用契約・労働条件通知書のレビューです。採用計画や求人票の新規作成・改稿、採用フロー設計、定期ミーティング、条件設計資料の作成は採用労務サポートのオプション、本格RPOは別見積りです。",
    judgment: "本ページは一般的な情報提供です。個別の適用・対応範囲・法的判断は、面談と資料確認のうえ資格者が確認します。",
    planLink: "人事部丸投げプランの料金・対象範囲", flowLink: "ご相談から契約までの流れ", careLink: "介護・障害福祉の人事労務", treatmentLink: "処遇改善加算の賃金設計サポート", foreignLink: "外国人雇用の労務", designationLink: "開設・許認可・指定申請の支援", sourceHeading: "制度を確認する一次資料",
  },
  en: {
    sector: "Focus industry: disability welfare and group homes",
    stagesTitle: "Separate support before opening and after operations begin",
    beforeTitle: "Before opening: licensing and designation with an administrative scrivener",
    before: "四葉行政書士事務所 supports opening requirements, incorporation documents, licensing and designation applications, and documents filed with authorities. Add-on and change notifications after designation are also handled as administrative scrivener work.",
    afterTitle: "After opening: HR with a social insurance and labor consultant",
    after: "四葉社会保険労務士事務所 provides payroll, routine insurance procedures, day-to-day labor advice and hiring-terms consultations through its Outsourced HR Department Service. Work rules and wage-system design for treatment-improvement add-ons are discussed separately after the scope is checked.",
    separate: "Licensing, designation applications and treatment-improvement documents for authorities are administrative scrivener work; payroll, insurance, labor matters and treatment-improvement wage design are social insurance and labor consultant work. Each office contracts and invoices clients directly under separate contracts and fees. No referral fees are exchanged.",
    qualification: "Our representative social insurance and labor consultant is also an administrative scrivener authorized to act as an immigration application intermediary. We consider both opening applications and ongoing operations, with a separate scope for each engagement.",
    planIntro: "Disability welfare and group homes are a focus industry for Yotsuba. Our main Outsourced HR Department Service supports HR after opening, including the connected issues of hiring, shifts, payroll, insurance and treatment improvement.",
    routine: "The monthly fee covers payroll, payslips, insurance-rate updates, routine labor advice, and routine enrollment and termination, dependent changes, monthly remuneration changes, bonus reports, annual remuneration reports and annual labor insurance renewal. Basic foreign-employment consultations and basic explanations in Chinese are also included.",
    excluded: "Attendance aggregation, clock-in corrections, missing-punch checks, overtime aggregation and paid-leave balance management are excluded. Initial insurance registrations, establishment of labor or employment insurance, initial labor work for a new company, year-end tax adjustment, full RPO, specialist translation, extended interpreting, disputes, bulk hiring or departures and corrections to past payroll are also outside the monthly scope. Any additional work and fees are confirmed separately.",
    setupDetail: "Initial setup includes access permissions and basic operating guidance in addition to the seven items in the common fee table. Setting up insurance information is separate from applying for initial insurance registration.",
    bandReason: "Fees use headcount bands because payroll, procedures, freee capacity and inquiry workload increase with the number of employees.",
    recruitment: "Monthly hiring support covers advice on job postings, hiring and pay terms, plus review of employment contracts and notices of working conditions. Creating hiring plans, drafting or rewriting postings, designing hiring workflows, regular meetings and preparing terms-design documents are optional hiring and labor support. Full RPO requires a separate quote.",
    judgment: "This page provides general information. A qualified professional confirms individual applicability, scope and legal matters after consultation and document review.",
    planLink: "Outsourced HR fees and scope", flowLink: "From consultation to contract", careLink: "HR for care and disability-welfare providers", treatmentLink: "Wage design for treatment-improvement add-ons", foreignLink: "Labor support for foreign employees", designationLink: "Opening, licensing and designation support", sourceHeading: "Official sources for the system",
  },
  "zh-tw": {
    sector: "重點業種：障礙福祉・團體家屋",
    stagesTitle: "依開設前與開設後的工作，分別安排委託",
    beforeTitle: "開設前的許可・指定申請：行政書士",
    before: "四葉行政書士事務所協助整理開設要件、法人設立文件、許可與指定申請，以及向行政機關提交的文件。指定後的加算申報與變更申報，也以行政書士業務辦理。",
    afterTitle: "開設後的人事勞務：社會保險勞務士",
    after: "四葉社会保険労務士事務所以人事部全包方案，支援薪資計算、一般社會保險手續、日常勞務諮詢與招聘條件諮詢。就業規則及處遇改善的薪資制度設計，確認內容後另行說明。",
    separate: "許可、指定申請及處遇改善的行政提交文件屬行政書士業務；薪資、社會保險、勞務及處遇改善的薪資制度設計屬社會保險勞務士業務，各自另行簽約、另行收費。各事務所直接與客戶簽約及請款，事務所間不收付介紹費。",
    qualification: "代表社會保險勞務士亦為申請取次行政書士。我們兼顧開設前的申請與開設後的營運，並依業務整理各自的契約範圍。",
    planIntro: "障礙福祉與團體家屋是四葉的重點業種。針對招聘、排班、薪資、社會保險與處遇改善等負擔，以主力服務人事部全包方案支援開設後的人事勞務。",
    routine: "月費包含每月薪資計算、薪資明細、社會保險費率更新、一般勞務諮詢，以及資格取得與喪失、被扶養者變更、月額變更申報、獎金支付申報、算定基礎申報、勞動保險年度更新等一般手續。亦包含外國人雇用基本諮詢與中文基本說明。",
    excluded: "月費不含出勤彙整、打卡修正、漏打卡確認、加班彙整及有薪假餘額管理。新規適用、勞動保險成立、雇用保險設置、新設法人的初期勞務、年末調整、完整RPO、專業翻譯、長時間口譯、爭議案件、大量入離職及過往薪資修正，亦不在月費範圍內。所需支援與費用另行確認。",
    setupDetail: "初期導入除共通報價表所列7項外，亦包含權限設定與基本操作說明。社會保險資料設定與新規適用申請代辦是不同工作。",
    bandReason: "隨員工人數增加，薪資計算、手續、freee使用額度與諮詢工作量也會增加，因此採人數級距的定額月費。",
    recruitment: "月費內的招聘支援限職缺、招聘條件、薪資條件的諮詢，以及雇用契約與勞動條件通知書的審閱。招聘計畫、職缺新寫或改寫、招聘流程設計、定期會議及條件設計資料製作，屬招聘勞務支援加購項目；完整RPO另行報價。",
    judgment: "本頁提供一般性資訊。個別適用、承辦範圍與法律判斷，由具資格者於面談及確認資料後進行。",
    planLink: "人事部全包方案的費用與範圍", flowLink: "從諮詢到簽約的流程", careLink: "照護・障礙福祉的人事勞務", treatmentLink: "處遇改善加算的薪資設計支援", foreignLink: "外國人雇用的勞務", designationLink: "開設・許可・指定申請支援", sourceHeading: "制度確認的官方資料",
  },
  zh: {
    sector: "重点行业：残障福祉・团体家屋",
    stagesTitle: "按开设前与开设后的工作，分别安排委托",
    beforeTitle: "开设前的许可・指定申请：行政书士",
    before: "四葉行政書士事務所协助整理开设要件、法人设立文件、许可与指定申请，以及向行政机关提交的文件。指定后的加算申报与变更申报，也以行政书士业务办理。",
    afterTitle: "开设后的人事劳务：社会保险劳务士",
    after: "四葉社会保険労務士事務所以人事部全包方案，支持工资计算、一般社会保险手续、日常劳务咨询与招聘条件咨询。就业规则及处遇改善的工资制度设计，确认内容后另行说明。",
    separate: "许可、指定申请及处遇改善的行政提交文件属行政书士业务；工资、社会保险、劳务及处遇改善的工资制度设计属社会保险劳务士业务，各自另行签约、另行收费。各事务所直接与客户签约及收款，事务所间不收付介绍费。",
    qualification: "代表社会保险劳务士亦为申请取次行政书士。我们兼顾开设前的申请与开设后的运营，并按业务整理各自的合同范围。",
    planIntro: "残障福祉与团体家屋是四葉的重点行业。针对招聘、排班、工资、社会保险与处遇改善等负担，以主力服务人事部全包方案支持开设后的人事劳务。",
    routine: "月费包含每月工资计算、工资明细、社会保险费率更新、一般劳务咨询，以及资格取得与丧失、被扶养者变更、月额变更申报、奖金支付申报、算定基础申报、劳动保险年度更新等一般手续。亦包含外国人雇用基本咨询与中文基本说明。",
    excluded: "月费不含出勤汇总、打卡修正、漏打卡确认、加班汇总及带薪假余额管理。新规适用、劳动保险成立、雇用保险设置、新设法人的初期劳务、年末调整、完整RPO、专业翻译、长时间口译、争议案件、大量入离职及以往工资修正，也不在月费范围内。所需支持与费用另行确认。",
    setupDetail: "初期导入除共通报价表所列7项外，亦包含权限设置与基本操作说明。社会保险资料设置与新规适用申请代办是不同工作。",
    bandReason: "随员工人数增加，工资计算、手续、freee使用额度与咨询工作量也会增加，因此按人数区间收取固定月费。",
    recruitment: "月费内的招聘支持限职位、招聘条件、工资条件的咨询，以及雇用合同与劳动条件通知书的审阅。招聘计划、职位新写或改写、招聘流程设计、定期会议及条件设计资料制作，属招聘劳务支持加购项目；完整RPO另行报价。",
    judgment: "本页提供一般性信息。个别适用、承办范围与法律判断，由具资格者于面谈及确认资料后进行。",
    planLink: "人事部全包方案的费用与范围", flowLink: "从咨询到签约的流程", careLink: "护理・残障福祉的人事劳务", treatmentLink: "处遇改善加算的工资设计支持", foreignLink: "外国人雇用的劳务", designationLink: "开设・许可・指定申请支持", sourceHeading: "制度确认的官方资料",
  },
};
