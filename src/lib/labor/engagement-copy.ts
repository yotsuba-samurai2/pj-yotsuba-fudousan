import { LABOR_SETUP_COPY } from "@/lib/labor/setup-copy";
import type { LangCode } from "@/config/languages";

export type EngagementCopy = {
  title: string; description: string; tagline: string; hero: string; lead: string;
  procedureCta: string; payrollCta: string; advisoryCta: string; consultationNote: string;
  procedureTitle: string; procedureBody: string; payrollTitle: string; payrollBody: string; quoted: string;
  workflowTitle: string; workflowBody: string; steps: { title: string; body: string }[]; procedureWorkflow: string;
  faqs: { q: string; a: string }[];
};

const JA: EngagementCopy = {
  consultationNote: "初回相談（60分）無料",
  title: "入退社の手続き・給与計算｜顧問契約なしでも対応｜文京区の四葉社会保険労務士事務所",
  description: "文京区の四葉社会保険労務士事務所。入退社の手続きや毎月の給与計算を、顧問契約なしでもご依頼いただけます。freee人事労務と共有フォルダで資料のやり取りもスムーズに。",
  tagline: "小さな会社にも、人事部を", hero: "入退社の手続きも、毎月の給与計算も。必要な業務から頼めます。",
  lead: "「入社1名の手続きだけ」「給与計算を毎月お願いしたい」「労務相談まで含めて任せたい」。四葉社会保険労務士事務所では、顧問契約なしのご依頼から、給与・手続き・相談を含む継続サポートまで、会社に合った頼み方を選べます。必要な業務と費用を、着手前にお見積もりします。",
  procedureCta: "入退社の手続きを相談する", payrollCta: "給与計算だけを相談する", advisoryCta: "顧問の内容・料金を見る",
  procedureTitle: "入社・退社1名の手続きから、顧問契約なしで。",
  procedureBody: "すでに社会保険・雇用保険に加入している会社の、入社・退社に伴う手続きや扶養家族の変更も、必要な業務だけご依頼いただけます。会社の新規加入から相談することもできます。対象人数、届出の種類、資料の準備状況を確認してお見積もりします。",
  payrollTitle: "給与計算だけの継続依頼も承ります。",
  payrollBody: "顧問契約を結ばず、毎月の給与計算だけを任せることもできます。人数、締日・支払日、給与体系、勤怠データの受け渡し方法などを確認し、初期費用と毎月の費用をご案内します。保険の手続きや継続的な労務相談を含める場合は、依頼範囲を分けてお見積もりします。",
  quoted: "個別見積もり",
  workflowTitle: "freeeと共有フォルダで、毎月のやり取りを簡単に。",
  workflowBody: "給与計算を継続してご依頼いただく場合は、freee人事労務で従業員情報・勤怠・給与を管理します。必要書類や手続きの控えは、関係者だけがアクセスできる共有フォルダで整理。何を提出したか、何が不足しているか、どこまで進んでいるかを分かりやすくし、資料の送り直しや探す手間を減らします。",
  steps: [{ title: "会社が情報をそろえる", body: "入退社情報や必要書類を共有し、勤怠を確認・確定。" }, { title: "四葉が計算・手続きを進める", body: "資料の内容を確認し、依頼範囲に応じた給与計算・書類作成・提出。" }, { title: "会社が最終承認し、控えを受け取る", body: "給与計算結果は会社が最終承認。手続きの控えや完了状況を共有。" }],
  procedureWorkflow: "手続きだけのご依頼でも、必要書類と控えの受け渡し方法を事前にご案内します。",
  faqs: [
    { q: "顧問契約なしで、入退社の手続きだけ頼めますか？", a: "はい。入社・退社1名の手続きや扶養家族の変更など、必要な業務だけご依頼いただけます。会社の新規加入からのご相談も可能です。状況と必要書類を確認してお見積もりします。" },
    { q: "給与計算だけを毎月お願いできますか？", a: "はい。顧問契約なしで給与計算のみを継続してご依頼いただけます。人数や給与体系、勤怠の受け渡し方法を確認し、初期費用と月額をご案内します。保険手続きや継続的な労務相談を追加する場合は別途お見積もりします。" },
    { q: "freeeの初期設定は無料ですか？", a: `標準導入は55,000円（税込）です。${LABOR_SETUP_COPY.ja.standardWaiverNote} 運用設計・データ移行を伴う場合は88,000円〜（税込）です。給与計算単独の導入条件・費用は別途お見積もりします。` },
    { q: "会社側では何を行いますか？", a: "必要な従業員情報・変更情報の提供、勤怠の確認・確定、給与計算結果の最終承認をお願いします。四葉は依頼範囲に応じて計算・内容確認・手続きを担当します。" },
  ],
};

const EN: EngagementCopy = {
  consultationNote: "Free initial consultation (up to 60 minutes)",
  title: "Onboarding, offboarding & payroll without a retainer | Bunkyo, Tokyo | 四葉社会保険労務士事務所",
  description: "Commission employee insurance filings or monthly payroll without an advisory retainer. Work efficiently with freee HR and access-controlled shared folders.",
  tagline: "An HR department for small businesses, too", hero: "Employee filings and monthly payroll. Start with the work you need.",
  lead: "A filing for one new employee, monthly payroll, or ongoing labor advice: 四葉社会保険労務士事務所 offers standalone engagements and ongoing support covering payroll, filings and advice. Choose the scope that suits your company. We quote the work and fees before starting.",
  procedureCta: "Discuss employee filings", payrollCta: "Discuss payroll only", advisoryCta: "Compare advisory scope & fees",
  procedureTitle: "Filings for even one employee, without an advisory retainer.",
  procedureBody: "Businesses already enrolled in social and employment insurance can commission onboarding, offboarding or dependent-change filings as needed. We also handle initial business enrollment. We quote after checking the number of people, filing types and available documents.",
  payrollTitle: "Monthly payroll can be commissioned on its own.",
  payrollBody: "You can outsource monthly payroll without an advisory retainer. We confirm headcount, cutoff and payment dates, pay arrangements and attendance-data handover, then quote initial and monthly fees. Insurance filings and ongoing labor advice are quoted as a separate scope if required.",
  quoted: "Individual quotation",
  workflowTitle: "Simpler monthly exchanges with freee and shared folders.",
  workflowBody: "For ongoing payroll engagements, freee HR manages employee, attendance and payroll data. Necessary documents and filing copies are organized in shared folders accessible only to authorized people. Clear submission, missing-document and progress information helps reduce repeated sending and searching.",
  steps: [{ title: "Your company prepares the information", body: "Share staffing changes and documents, then review and finalize attendance." }, { title: "We calculate and process", body: "We check the documents, calculate payroll and prepare and submit filings within the agreed scope." }, { title: "Your company approves and receives copies", body: "Your company gives final payroll approval. We share filing copies and completion status." }],
  procedureWorkflow: "For filings-only engagements, we also explain how to exchange required documents and copies before starting.",
  faqs: [
    { q: "Can I commission employee filings without an advisory retainer?", a: "Yes. You can commission filings for one employee joining or leaving, dependent changes, or initial company insurance enrollment. We check the circumstances and required documents before quoting." },
    { q: "Can I commission only monthly payroll?", a: "Yes. Ongoing payroll-only work is available without an advisory retainer. We confirm headcount, pay arrangements and attendance-data handover, then quote initial and monthly fees. Insurance filings or ongoing labor advice are quoted separately if added." },
    { q: "Is freee setup free?", a: `Standard setup is ¥55,000 including tax. ${LABOR_SETUP_COPY.en.standardWaiverNote} Setup with workflow design or data migration starts at ¥88,000 including tax. Payroll-only setup conditions and fees are quoted separately.` },
    { q: "What does our company need to do?", a: "Provide employee information and changes, review and finalize attendance, and give final payroll approval. We calculate, check and handle filings within the agreed scope." },
  ],
};

const ZH_TW: EngagementCopy = {
  consultationNote: "首次諮詢（60分鐘內）免費",
  title: "入離職手續・薪資計算｜無須顧問契約｜文京區・四葉社会保険労務士事務所",
  description: "四葉社会保険労務士事務所位於文京區，無須顧問契約即可委託入離職手續或每月薪資計算。運用freee人事勞務及權限管理的共享資料夾簡化資料交接。",
  tagline: "讓小公司也有人事部", hero: "入離職手續、每月薪資計算，從您需要的業務開始委託。",
  lead: "「只辦1名員工的入職手續」「每月委託薪資計算」「連同勞務諮詢一起交給專家」。四葉社会保険労務士事務所提供無須顧問契約的單項委託，也提供包含薪資、手續與諮詢的持續支援。依公司需要選擇範圍，開始工作前提供報價。",
  procedureCta: "諮詢入離職手續", payrollCta: "諮詢薪資計算單項委託", advisoryCta: "查看顧問內容與費用",
  procedureTitle: "從1名員工的入離職手續起，無須顧問契約。",
  procedureBody: "已加入社會保險及雇用保險的公司，也可單獨委託入離職、被扶養家屬變更等必要手續。公司首次加入保險亦可諮詢。確認對象人數、申報種類與資料準備情況後報價。",
  payrollTitle: "也接受僅委託每月薪資計算。",
  payrollBody: "無須簽訂顧問契約，即可持續委託每月薪資計算。確認人數、結算日與發薪日、薪資制度、出勤資料交接方式後，說明初期及每月費用。若需加入保險手續或持續勞務諮詢，將分別列明範圍並報價。",
  quoted: "個別報價",
  workflowTitle: "運用freee與共享資料夾，簡化每月資料往來。",
  workflowBody: "持續委託薪資計算時，以freee人事勞務管理員工、出勤與薪資資料。必要文件與申報副本整理於僅限獲授權人員存取的共享資料夾。清楚掌握已交資料、缺件與進度，減少重複寄送與尋找資料的時間。",
  steps: [{ title: "公司備妥資料", body: "分享入離職資訊與必要文件，確認並確定出勤資料。" }, { title: "四葉計算與辦理手續", body: "確認文件內容，依委託範圍計算薪資、製作並提交文件。" }, { title: "公司最終核准並收取副本", body: "薪資結果由公司最終核准，分享手續副本與完成狀態。" }],
  procedureWorkflow: "僅委託手續時，也會事前說明必要文件與副本的交接方式。",
  faqs: [
    { q: "無須顧問契約，也能只委託入離職手續嗎？", a: "可以。1名員工的入離職、被扶養家屬變更等，均可依需要委託。公司首次加入保險亦可諮詢，確認情況與所需文件後報價。" },
    { q: "可以只委託每月薪資計算嗎？", a: "可以。無須顧問契約即可持續委託薪資計算。確認人數、薪資制度與出勤資料交接方式後，提供初期及月費報價。另加保險手續或持續勞務諮詢時，另行報價。" },
    { q: "freee初期設定免費嗎？", a: `標準導入55,000日圓（含稅）。${LABOR_SETUP_COPY["zh-tw"].standardWaiverNote} 涉及流程設計或資料遷移時為88,000日圓起（含稅）。薪資計算單項委託的導入條件與費用另行報價。` },
    { q: "公司需要負責哪些工作？", a: "請提供必要的員工資訊與異動，確認並確定出勤資料，最終核准薪資計算結果。四葉依委託範圍負責計算、內容確認與手續。" },
  ],
};

const ZH: EngagementCopy = {
  consultationNote: "首次咨询（60分钟内）免费",
  title: "入离职手续・工资计算｜无需顾问合同｜文京区・四葉社会保険労務士事務所",
  description: "四葉社会保険労務士事務所位于文京区，无需顾问合同即可委托入离职手续或每月工资计算。运用freee人事劳务及权限管理的共享文件夹简化资料交接。",
  tagline: "让小公司也有人事部", hero: "入离职手续、每月工资计算，从您需要的业务开始委托。",
  lead: "“只办1名员工的入职手续”“每月委托工资计算”“连同劳务咨询一起交给专家”。四葉社会保険労務士事務所提供无需顾问合同的单项委托，也提供包含工资、手续与咨询的持续支持。依公司需要选择范围，开始工作前提供报价。",
  procedureCta: "咨询入离职手续", payrollCta: "咨询工资计算单项委托", advisoryCta: "查看顾问内容与费用",
  procedureTitle: "从1名员工的入离职手续起，无需顾问合同。",
  procedureBody: "已加入社会保险及雇用保险的公司，也可单独委托入离职、被扶养家属变更等必要手续。公司首次加入保险亦可咨询。确认对象人数、申报种类与资料准备情况后报价。",
  payrollTitle: "也接受仅委托每月工资计算。",
  payrollBody: "无需签订顾问合同，即可持续委托每月工资计算。确认人数、结算日与发薪日、工资制度、出勤资料交接方式后，说明初期及每月费用。若需加入保险手续或持续劳务咨询，将分别列明范围并报价。",
  quoted: "个别报价",
  workflowTitle: "运用freee与共享文件夹，简化每月资料往来。",
  workflowBody: "持续委托工资计算时，以freee人事劳务管理员工、出勤与工资资料。必要文件与申报副本整理于仅限获授权人员访问的共享文件夹。清楚掌握已交资料、缺件与进度，减少重复寄送与寻找资料的时间。",
  steps: [{ title: "公司备妥资料", body: "分享入离职信息与必要文件，确认并确定出勤资料。" }, { title: "四叶计算与办理手续", body: "确认文件内容，依委托范围计算工资、制作并提交文件。" }, { title: "公司最终批准并收取副本", body: "工资结果由公司最终批准，分享手续副本与完成状态。" }],
  procedureWorkflow: "仅委托手续时，也会事前说明必要文件与副本的交接方式。",
  faqs: [
    { q: "无需顾问合同，也能只委托入离职手续吗？", a: "可以。1名员工的入离职、被扶养家属变更等，均可依需要委托。公司首次加入保险亦可咨询，确认情况与所需文件后报价。" },
    { q: "可以只委托每月工资计算吗？", a: "可以。无需顾问合同即可持续委托工资计算。确认人数、工资制度与出勤资料交接方式后，提供初期及月费报价。另加保险手续或持续劳务咨询时，另行报价。" },
    { q: "freee初期设置免费吗？", a: `标准导入55,000日元（含税）。${LABOR_SETUP_COPY.zh.standardWaiverNote} 涉及流程设计或数据迁移时为88,000日元起（含税）。工资计算单项委托的导入条件与费用另行报价。` },
    { q: "公司需要负责哪些工作？", a: "请提供必要的员工信息与变动，确认并确定出勤资料，最终批准工资计算结果。四叶依委托范围负责计算、内容确认与手续。" },
  ],
};

export const LABOR_ENGAGEMENT_COPY: Record<LangCode, EngagementCopy> = { ja: JA, en: EN, "zh-tw": ZH_TW, zh: ZH };
