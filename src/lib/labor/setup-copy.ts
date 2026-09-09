import type { LangCode } from "@/config/languages";

type SetupCopy = {
  heading: string;
  standardTitle: string;
  standardCondition: string;
  standardItems: readonly string[];
  migrationTitle: string;
  migrationCondition: string;
  migrationItems: readonly string[];
  quoteNote: string;
  comparisonTitle: string;
  freeeSupport: string;
  comparison: string;
  freeeLink: string;
};

export const FREEE_SUPPORT_URL = "https://www.freee.co.jp/accounting/smb/support/";

export const LABOR_SETUP_COPY: Record<LangCode, SetupCopy> = {
  ja: {
    heading: "初期導入は、状況に合わせて2つの区分から",
    standardTitle: "標準導入",
    standardCondition: "新規導入・既存データの移行なし・標準的な給与と勤怠の場合。",
    standardItems: ["freee基本設定（権限・社会保険情報を含む）", "従業員登録", "通常の手当・通勤費の設定", "LINE打刻の設定", "初回給与計算・基本操作説明"],
    migrationTitle: "運用設計・移行あり",
    migrationCondition: "既存データの移行や、複雑な手当・勤務形態・承認フローなどがある場合。",
    migrationItems: ["標準導入の内容", "既存データの移行", "給与体系・手当控除・勤務形態の設定", "承認フローを含む運用フロー設計", "初回給与テスト・計算"],
    quoteNote: "作業前に内容を確認し、月額料金・初期導入費・別料金の業務をまとめて書面でお見積りします。",
    comparisonTitle: "freeeへの直接依頼とも比較できます",
    freeeSupport: "freeeにも有償の導入・活用支援があり、業務フロー整理、初期設定・データ移行、担当者トレーニングなどを直接相談できます。対象製品・支援範囲・費用はfreeeへご確認ください。",
    comparison: "四葉では初期設定だけで終わらせず、その後も給与計算・通常手続・日常の労務相談まで一貫して支援します。freeeへの直接依頼を含め、内容と費用を比べたうえでお選びください。",
    freeeLink: "freee公式の導入・活用支援を見る",
  },
  en: {
    heading: "Two setup options to suit your current operations",
    standardTitle: "Standard setup",
    standardCondition: "For a new implementation without data migration, using standard payroll and attendance arrangements.",
    standardItems: ["Basic freee configuration, including permissions and social insurance information", "Employee registration", "Standard allowances and commuting expenses", "LINE clock-in setup", "First payroll calculation and basic operation guidance"],
    migrationTitle: "Workflow design and migration",
    migrationCondition: "For existing data migration or complex allowances, work patterns or approval workflows.",
    migrationItems: ["Standard setup services", "Existing data migration", "Pay structure, allowances, deductions and work-pattern configuration", "Operating and approval workflow design", "Initial payroll testing and calculation"],
    quoteNote: "Before work begins, we confirm the scope and provide a written quote showing monthly fees, setup fees and separately charged services together.",
    comparisonTitle: "You can also compare support directly from freee",
    freeeSupport: "freee offers paid implementation and usage support, including workflow planning, initial setup and data migration, and staff training. Contact freee directly to confirm eligible products, scope and fees.",
    comparison: "Yotsuba supports you beyond initial setup, continuing with payroll, routine procedures and day-to-day labor advice. Compare the scope and costs, including support directly from freee, before choosing.",
    freeeLink: "View freee's official implementation and usage support (Japanese)",
  },
  "zh-tw": {
    heading: "依目前狀況選擇兩種初期導入方式",
    standardTitle: "標準導入",
    standardCondition: "適用於全新導入、無既有資料移轉，且薪資與出勤制度屬於標準設定的情況。",
    standardItems: ["freee基本設定（含權限與社會保險資料）", "員工登錄", "一般津貼與通勤費設定", "LINE打卡設定", "首次薪資計算與基本操作說明"],
    migrationTitle: "流程設計・資料移轉",
    migrationCondition: "適用於既有資料移轉，或津貼、工作型態、核准流程較複雜的情況。",
    migrationItems: ["標準導入的內容", "既有資料移轉", "薪資制度、津貼、扣除項目與工作型態設定", "含核准流程的作業流程設計", "首次薪資測試與計算"],
    quoteNote: "開始作業前先確認工作內容，並以書面一併列出月費、初期導入費與另行收費的業務。",
    comparisonTitle: "也可比較直接向freee委託支援的方案",
    freeeSupport: "freee亦提供付費導入與使用支援，可直接洽詢作業流程整理、初期設定、資料移轉、承辦人員訓練等。適用產品、支援範圍與費用請向freee確認。",
    comparison: "四葉不只協助初期設定，後續也持續支援薪資計算、一般手續與日常勞務諮詢。請一併考慮直接委託freee的選項，比較內容與費用後再選擇。",
    freeeLink: "查看freee官方導入與使用支援（日文）",
  },
  zh: {
    heading: "按目前情况选择两种初期导入方式",
    standardTitle: "标准导入",
    standardCondition: "适用于全新导入、无既有数据迁移，且工资与出勤制度属于标准设置的情况。",
    standardItems: ["freee基本设置（含权限与社会保险资料）", "员工登记", "一般津贴与通勤费设置", "LINE打卡设置", "首次工资计算与基本操作说明"],
    migrationTitle: "流程设计・数据迁移",
    migrationCondition: "适用于既有数据迁移，或津贴、工作形式、审批流程较复杂的情况。",
    migrationItems: ["标准导入的内容", "既有数据迁移", "工资制度、津贴、扣除项目与工作形式设置", "含审批流程的工作流程设计", "首次工资测试与计算"],
    quoteNote: "开始工作前先确认工作内容，并以书面一并列出月费、初期导入费与另行收费的业务。",
    comparisonTitle: "也可比较直接向freee委托支持的方案",
    freeeSupport: "freee也提供付费导入与使用支持，可直接咨询工作流程整理、初期设置、数据迁移、经办人员培训等。适用产品、支持范围与费用请向freee确认。",
    comparison: "四叶不仅协助初期设置，后续也持续支持工资计算、一般手续与日常劳务咨询。请一并考虑直接委托freee的选项，比较内容与费用后再选择。",
    freeeLink: "查看freee官方导入与使用支持（日文）",
  },
};
