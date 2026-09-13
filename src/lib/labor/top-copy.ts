import type { LangCode } from "@/config/languages";

type TopCopy = {
  headline: [string, string]; lead: string; office: string;
  consult: string; pricing: string; workflow: string; portraitAlt: string;
  representative: string; name: string; methods: string; noRetainer: string; nav: string;
  services: { title: string; body: string; link: string; service: "procedure" | "payroll_only" | "advisory" }[];
};

export const LABOR_TOP_COPY: Record<LangCode, TopCopy> = {
  ja: {
    headline: ["仕事が楽しい。", "そんな職場に"],
    lead: "入退社の手続きや給与計算のご依頼から、採用、労務相談まで。現場のニーズに応じて、一緒に整えていきます。",
    office: "四葉社会保険労務士事務所", consult: "まずは相談してみる", pricing: "料金を見る", workflow: "問い合わせ・受任の流れを見る",
    portraitAlt: "四葉社会保険労務士事務所 代表 浦松丈二",
    representative: "代表社会保険労務士", name: "浦松丈二", methods: "必要なところから、ご依頼いただけます。", noRetainer: "顧問契約がなくても、手続き・給与計算をご依頼いただけます。", nav: "サイト内のご案内",
    services: [
      { title: "手続きだけ頼みたい", body: "入退社、社会保険・労働保険の手続きなど、必要な手続きをスポットで。", link: "手続きについて相談する", service: "procedure" },
      { title: "給与計算を任せたい", body: "毎月の給与計算を、会社の運用に合わせて。", link: "給与計算について相談する", service: "payroll_only" },
      { title: "顧問として相談したい", body: "日々の労務相談や、制度づくりを継続して。提供範囲と別料金の業務は、着手前にご案内します。", link: "顧問の範囲・料金を見る", service: "advisory" },
    ],
  },
  en: {
    headline: ["“I enjoy my work.”", "Let’s build a workplace like that."],
    lead: "From onboarding and offboarding procedures and payroll to recruitment and labor advice. We work with you to make improvements that meet your workplace’s day-to-day needs.",
    office: "四葉社会保険労務士事務所", consult: "Talk with us", pricing: "View fees", workflow: "See the inquiry and engagement process",
    portraitAlt: "Joji Uramatsu, representative of 四葉社会保険労務士事務所",
    representative: "Principal Social Insurance and Labor Consultant", name: "Joji Uramatsu", methods: "Start with the support you need.", noRetainer: "Procedures and payroll can be requested without an advisory contract.", nav: "Explore our services",
    services: [
      { title: "Help with procedures", body: "Request individual joining, leaving, social insurance or labor insurance procedures as needed.", link: "Ask about procedures", service: "procedure" },
      { title: "Payroll support", body: "Monthly payroll arranged around the way your company works.", link: "Ask about payroll", service: "payroll_only" },
      { title: "Ongoing labor advice", body: "Continuing support with everyday labor matters and workplace systems. Included work and separately charged services are explained before work begins.", link: "View advisory scope and fees", service: "advisory" },
    ],
  },
  "zh-tw": {
    headline: ["工作，是件快樂的事。", "一起打造這樣的職場。"],
    lead: "從入離職手續、薪資計算委託，到招募、勞務諮詢。我們依現場的實際需求，與您一起調整完善。",
    office: "四葉社会保険労務士事務所", consult: "先與我們聊聊", pricing: "查看費用", workflow: "查看諮詢與委託流程",
    portraitAlt: "四葉社会保険労務士事務所代表 浦松丈二", representative: "代表社會保險勞務士", name: "浦松丈二", methods: "從需要的部分開始委託。", noRetainer: "不簽顧問合約，也可委託手續或薪資計算。", nav: "站內導覽",
    services: [
      { title: "只想委託手續", body: "入離職、社會保險、勞動保險等，依需要委託個別手續。", link: "諮詢手續委託", service: "procedure" },
      { title: "想委託薪資計算", body: "依照公司的運作方式，處理每月薪資計算。", link: "諮詢薪資計算", service: "payroll_only" },
      { title: "希望獲得顧問支援", body: "持續支援日常勞務諮詢與制度建置。服務範圍及另計費用的業務，均於著手前說明。", link: "查看顧問範圍與費用", service: "advisory" },
    ],
  },
  zh: {
    headline: ["工作，是件快乐的事。", "一起打造这样的职场。"],
    lead: "从入离职手续、工资计算委托，到招聘、劳务咨询。我们根据现场的实际需求，与您一起调整完善。",
    office: "四葉社会保険労務士事務所", consult: "先与我们聊聊", pricing: "查看费用", workflow: "查看咨询与委托流程",
    portraitAlt: "四葉社会保険労務士事務所代表 浦松丈二", representative: "代表社会保险劳务士", name: "浦松丈二", methods: "从需要的部分开始委托。", noRetainer: "不签顾问合同，也可委托手续或工资计算。", nav: "站内导航",
    services: [
      { title: "只想委托手续", body: "入离职、社会保险、劳动保险等，按需要委托单项手续。", link: "咨询手续委托", service: "procedure" },
      { title: "想委托工资计算", body: "按照公司的运作方式，处理每月工资计算。", link: "咨询工资计算", service: "payroll_only" },
      { title: "希望获得顾问支持", body: "持续支持日常劳务咨询与制度建设。服务范围及另计费用的业务，均于着手前说明。", link: "查看顾问范围与费用", service: "advisory" },
    ],
  },
};
