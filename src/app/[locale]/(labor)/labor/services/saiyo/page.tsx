// /labor/services/saiyo（型A）＝募集・採用の労務
// 2026-08-14 新設。料金表 /labor/ryokin の2列から導出（luck428-column-seo 第7条）：
//   やる＝「募集・採用コンサルタント」（一式・お見積り）
//   やらない＝「求職者の紹介・あっせん、応募者の面接代行、求人媒体の運用代行」→「取り扱っておりません」
// ★境界の根拠＝職業安定法第4条第1項（職業紹介の定義）・第30条第1項（有料職業紹介は厚生労働大臣の許可）。
//   2026-08-14 に e-Gov 法令検索API（法令ID 322AC0000000141）で条文を直接確認済み。
// クロスリンク＝C15（→/legal/services/visa・/shataku）がpathで自動（launchFlag=SR_LAUNCHED）。
// 2026-09-01 多言語化（第2波）：COPY: Record<LangCode,…>。
//   条文の定義引用（第4条第1項）は日本語原文を正とし、訳文は内容の紹介として書く。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";
import type { LangCode } from "@/config/languages";

type Copy = {
  metaTitle: string;
  metaDescription: string;
  crumbLabel: string;
  serviceName: string;
  heroAlt: string;
  h1: string;
  leadParts: [string, string, string, string, string, string];
  internalLinks: { href: string; label: string }[];
  crossLinkLead: string;
  s1H2: string;
  s1Strong: string;
  s1Rest: string;
  t1Head: [string, string];
  t1Rows: { name: string; val: string; strong?: boolean }[];
  s1FeeLink: string;
  s2H2: string;
  s2P1a: string;
  s2Quote: string;
  s2P1b: string;
  s2P1c: string;
  s2P1d: string;
  s2P2a: string;
  s2Strong1: string;
  s2P2b: string;
  s2Strong2: string;
  s2P2c: string;
  s2Strong3: string;
  s2P2d: string;
  s3H2: string;
  s3P1a: string;
  s3Strong1: string;
  s3P1b: string;
  s3Strong2: string;
  s3P1c: string;
  s3P2a: string;
  s3Strong3: string;
  s3P2b: string;
  s3Note: string;
  s4H2: string;
  s4Lead1: string;
  s4Strong: string;
  s4Lead2: string;
  t2Head: [string, string, string];
  t2Rows: [string, string, string][];
  s4Link1: string;
  s4Link2: string;
  s4Note: string;
  s5H2: string;
  s5P1a: string;
  s5Strong1: string;
  s5P1b: string;
  s5Strong2: string;
  s5P2a: string;
  s5Strong3: string;
  s5P2b: string;
  s5Strong4: string;
  s5Note: string;
  s6H2: string;
  s6P1a: string;
  s6Strong1: string;
  s6P1b: string;
  s6P2a: string;
  s6Strong2: string;
  s6P2b: string;
  s6P3a: string;
  s6Strong3: string;
  s6P3b: string;
  s6Link1: string;
  s6Link2: string;
  s6Link3: string;
  s7H2: string;
  s7Items: string[];
  s7Note1: string;
  s7Note2: string;
};

const JA: Copy = {
  metaTitle: "募集・採用の労務｜四葉社会保険労務士事務所",
  metaDescription:
    "求人票の労働条件の明示、選考から内定までの書面、入社時の手続き、採用に絡む助成金を、文京区の四葉社会保険労務士事務所が承ります。求職者の紹介・あっせんは取り扱っておりません。留学生や外国人の採用では、在留資格の申請を四葉行政書士事務所が別契約で受任します。",
  crumbLabel: "募集・採用の労務",
  serviceName: "募集・採用の労務サポート",
  heroAlt: "募集・採用の労務のイメージ（面接の場面）",
  h1: "募集・採用の労務",
  leadParts: [
    "求人票に書く",
    "労働条件の明示",
    "、選考から内定までの書面、入社時の手続き、採用に絡む助成金——ここは社会保険労務士の領域です。一方、",
    "求職者の紹介・あっせんは取り扱っておりません。",
    "有料の職業紹介は、厚生労働大臣の許可を受けた事業者でなければ行えないためです。",
    "どこまでをお引き受けし、どこからをおつなぎするかを、このページに書きます。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "募集・採用の料金" },
    { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
    { href: "/labor/services/joseikin", label: "雇用関係助成金の申請" },
    { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介護・育成就労）の労務" },
  ],
  crossLinkLead: "在留資格の申請は四葉行政書士事務所、住まいの手配は四葉不動産株式会社、採用後の労務は当事務所が、それぞれ別の契約で受任します。",
  s1H2: "採用のどこからどこまでを、お願いできますか？",
  s1Strong: "「人を決める」ところは扱いません。「決めたあと」と「決める前の条件づくり」を扱います。",
  s1Rest: "料金表の区分をそのまま表にしました。",
  t1Head: ["内容", "四葉の取り扱い"],
  t1Rows: [
    { name: "求人票・募集要項の労働条件の整理", val: "承ります" },
    { name: "労働条件通知書・雇用契約書の作成", val: "承ります" },
    { name: "内定通知書・誓約書の整備、試用期間の設計", val: "承ります" },
    { name: "入社時の社会保険・雇用保険の手続き", val: "承ります" },
    { name: "採用に絡む雇用関係助成金", val: "承ります（顧問先限定）" },
    { name: "求職者の紹介・あっせん", val: "取り扱っておりません", strong: true },
    { name: "応募者の面接代行", val: "取り扱っておりません", strong: true },
    { name: "求人媒体の運用代行", val: "取り扱っておりません", strong: true },
  ],
  s1FeeLink: "報酬額表（募集・採用コンサルタントは一式・お見積り）",
  s2H2: "なぜ「紹介」だけ、お願いできないのですか？",
  s2P1a: "許可が要る事業だからです。職業安定法は「職業紹介」を",
  s2Quote: "「求人及び求職の申込みを受け、求人者と求職者との間における雇用関係の成立をあつせんすること」",
  s2P1b: "と定めており（同法第4条第1項）、これを有料で行うには",
  s2P1c: "厚生労働大臣の許可",
  s2P1d: "が必要です（同法第30条第1項）。",
  s2P2a: "当事務所はこの許可を受けていません。したがって、",
  s2Strong1: "「良い人を探してきてほしい」というご依頼にはお応えできません。",
  s2P2b: "人材紹介会社や求人媒体は、この許可や届出のうえで事業をしています。",
  s2Strong2: "役割が違うので、比べるものではありません。",
  s2P2c: "当事務所がお引き受けするのは、",
  s2Strong3: "採用した人との関係を、書面と手続きで整えるところ",
  s2P2d: "です。",
  s3H2: "求人票には、何を書かなければなりませんか？",
  s3P1a: "募集の段階で、",
  s3Strong1: "従事すべき業務の内容、賃金、労働時間その他の労働条件",
  s3P1b: "を明示する義務があります（職業安定法第5条の3第1項）。これは",
  s3Strong2: "入社時の労働条件の明示（労働基準法第15条）とは別の義務",
  s3P1c: "です。「求人票は広告だから、細かいことは面接で」という運用は、この2つを1つだと思っているところから起きます。",
  s3P2a: "そして",
  s3Strong3: "求人票と実際の労働条件がずれると、あとで説明を求められます。",
  s3P2b: "入社してすぐの離職は、この食い違いから始まることが少なくありません。求人票を出す前に一度見せていただくのが、いちばん手戻りの少ない頼み方です。",
  s3Note: "※職業安定法施行規則で定める明示事項の詳細、および令和4年の改正で追加された事項は、本ページ作成時点で個別に一次確認していません（未検証）。実際の記載事項は面談のうえご案内します。",
  s4H2: "外国人を採用するときは、誰に何を頼みますか？",
  s4Lead1: "",
  s4Strong: "入口（在留資格）＝行政書士、採用後（労務・社会保険）＝社会保険労務士、住まい＝宅地建物取引業者",
  s4Lead2: "です。ひとりを迎えるだけでも、担当する資格が3つに分かれます。",
  t2Head: ["やること", "担当する資格", "四葉の取り扱い"],
  t2Rows: [
    ["在留資格の変更・認定の申請", "行政書士（申請取次）", "四葉行政書士事務所が別契約で受任"],
    ["労働条件通知書・雇用契約書", "社会保険労務士", "当事務所が承ります"],
    ["外国人雇用状況の届出", "社会保険労務士", "当事務所が承ります"],
    ["社宅・住まいの手配", "宅地建物取引業者", "四葉不動産株式会社が別契約で受任"],
  ],
  s4Link1: "外国人社員を海外から迎えるとき（四葉行政書士事務所）",
  s4Link2: "借り上げ社宅の導入（四葉不動産）",
  s4Note: "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします。契約・請求・お振込先も分かれます（紹介料等の授受はありません）。必要な部分だけをご依頼いただけます。",
  s5H2: "留学生を4月1日入社にできますか？",
  s5P1a: "",
  s5Strong1: "在留資格の変更が許可されるまでは、働いてもらえません。",
  s5P1b: "内定を出しただけでは足りず、「留学」から就労できる在留資格への変更が必要です。申請から許可までに時間がかかるため、",
  s5Strong2: "入社日に間に合わないことがあります。",
  s5P2a: "当事務所がお引き受けするのは、",
  s5Strong3: "許可が下りるまでの労務の設計",
  s5P2b: "です。内定通知書に何を書いておくか、入社日をいつに置くか、許可が遅れたときに待機期間をどう扱うか——ここは労働契約の問題です。",
  s5Strong4: "在留資格の該当性を判断するのは出入国在留管理庁で、申請は四葉行政書士事務所（別契約）が承ります。",
  s5Note: "※変更許可申請の受付開始時期と標準処理期間は、本ページ作成時点で個別に一次確認していません（未検証）。日程は出入国在留管理庁の公表資料をもとに、面談のうえご案内します。",
  s6H2: "四葉社会保険労務士事務所は、何ができますか？",
  s6P1a: "",
  s6Strong1: "採用の「前」と「後」を、書面と手続きで支えます。",
  s6P1b: "前は求人票の労働条件と募集要項の整理、後は労働条件通知書・雇用契約書・内定通知書の作成と、入社時の社会保険・雇用保険の手続きです。採用に絡む雇用関係助成金は、顧問契約をいただいている場合にお引き受けします。",
  s6P2a: "代表は",
  s6Strong2: "中国語と英語に対応",
  s6P2b: "します。外国人を採用する場面では、労働条件を本人に説明するところまでを、外部の翻訳会社を挟まずに行えます。元新聞記者として中国総局長を務め、中国や台湾、タイに駐在しました。",
  s6P3a: "",
  s6Strong3: "ご相談は初回・2回目以降とも無料です。",
  s6P3b: "「求人票を出す前に見てほしい」「内定を出す前に条件を固めたい」という段階でお声がけください。出したあとに直すより、出す前に決めておくほうが早く済みます。",
  s6Link1: "報酬額表",
  s6Link2: "ご相談から契約までの流れ",
  s6Link3: "お問い合わせ",
  s7H2: "このページの根拠",
  s7Items: [
    "職業紹介の定義＝職業安定法（昭和22年法律第141号）第4条第1項。「求人及び求職の申込みを受け、求人者と求職者との間における雇用関係の成立をあつせんすること」",
    "有料の職業紹介事業の許可＝同法第30条第1項",
    "募集の際の労働条件等の明示＝同法第5条の3第1項",
    "労働契約の締結に際しての労働条件の明示＝労働基準法（昭和22年法律第49号）第15条、同施行規則第5条",
    "外国人雇用状況の届出＝労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律（昭和41年法律第132号）第28条第1項",
  ],
  s7Note1: "※職業安定法の各条文は、2026年8月14日に e-Gov 法令検索で確認しました。職業安定法施行規則の明示事項、労働基準法施行規則第5条の最終改正、在留資格変更許可申請の標準処理期間は、本ページ作成時点で個別に一次確認していません（未検証）。",
  s7Note2: "本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。",
};

const EN: Copy = {
  metaTitle: "Recruitment & hiring labor matters｜四葉社会保険労務士事務所",
  metaDescription:
    "Stating working conditions on job postings, documents from screening to offer, procedures on joining, and hiring-related subsidies — handled by 四葉社会保険労務士事務所 in Bunkyo City, Tokyo. We do not introduce or place job seekers. When hiring international students or foreign nationals, residence-status applications are handled by 四葉行政書士事務所 under a separate contract.",
  crumbLabel: "Recruitment & hiring",
  serviceName: "Labor support for recruitment and hiring",
  heroAlt: "Recruitment and hiring labor matters (an interview scene)",
  h1: "Recruitment & hiring: labor matters",
  leadParts: [
    "The ",
    "working conditions stated on job postings",
    ", the documents from screening to offer, the procedures on joining, and hiring-related subsidies — this is Certified Social Insurance and Labor Consultant territory. On the other hand, ",
    "we do not introduce or place job seekers.",
    " Fee-charging employment placement may be conducted only by businesses licensed by the Minister of Health, Labour and Welfare.",
    " This page sets out what we take on and where we refer you onward.",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "Fees for recruitment & hiring" },
    { href: "/labor/nagare", label: "From consultation to contract" },
    { href: "/labor/services/joseikin", label: "Employment-related subsidy applications" },
    { href: "/labor/services/gaikokujin-koyo", label: "Employing foreign nationals" },
  ],
  crossLinkLead:
    "Residence-status applications are handled by 四葉行政書士事務所, housing by Yotsuba Real Estate Co., Ltd., and post-hiring labor by this office — each under a separate contract.",
  s1H2: "Which parts of hiring can we ask you to handle?",
  s1Strong: "We do not handle choosing the person. We handle what comes after the decision — and the condition-setting before it.",
  s1Rest: " The table mirrors the categories in our fee table.",
  t1Head: ["Item", "Handled at Yotsuba"],
  t1Rows: [
    { name: "Organizing working conditions for job postings and recruitment guidelines", val: "yes" },
    { name: "Drafting working-condition notices and employment contracts", val: "yes" },
    { name: "Offer letters, pledges, and probation design", val: "yes" },
    { name: "Social/employment insurance procedures on joining", val: "yes" },
    { name: "Hiring-related employment subsidies", val: "yes (advisory clients only)" },
    { name: "Introducing or placing job seekers", val: "not handled", strong: true },
    { name: "Interviewing applicants on your behalf", val: "not handled", strong: true },
    { name: "Running job-advertising accounts on your behalf", val: "not handled", strong: true },
  ],
  s1FeeLink: "Fee table (recruitment consulting is quoted per engagement)",
  s2H2: "Why can't we ask you for introductions?",
  s2P1a: "Because it is a licensed business. The Employment Security Act (日本語：職業安定法) defines employment placement as ",
  s2Quote: "receiving offers of jobs and applications for jobs, and arranging the establishment of an employment relationship between the job offerer and the job seeker",
  s2P1b: " (Article 4, Paragraph 1), and doing this for a fee requires a ",
  s2P1c: "license from the Minister of Health, Labour and Welfare",
  s2P1d: " (Article 30, Paragraph 1).",
  s2P2a: "This office does not hold that license. Therefore ",
  s2Strong1: "we cannot take on requests to \"go find us good people\".",
  s2P2b: " Staffing agencies and job boards operate on those licenses and notifications. ",
  s2Strong2: "The roles are different, so it is not a comparison.",
  s2P2c: " What this office takes on is ",
  s2Strong3: "putting your relationship with the person you hired in order, in documents and procedures",
  s2P2d: ".",
  s3H2: "What must a job posting state?",
  s3P1a: "At the recruiting stage there is a duty to state ",
  s3Strong1: "the work to be performed, wages, working hours, and other working conditions",
  s3P1b: " (Employment Security Act, Article 5-3, Paragraph 1). This is ",
  s3Strong2: "a separate duty from stating working conditions at the time of hiring (Labor Standards Act, Article 15)",
  s3P1c: ". The practice of \"the posting is just an ad; details at the interview\" comes from treating these two as one.",
  s3P2a: "And ",
  s3Strong3: "if the posting and the actual conditions diverge, you will be asked to explain later.",
  s3P2b: " Early resignations often start from this mismatch. Showing us the posting before it goes out is the engagement with the least rework.",
  s3Note:
    "* The detailed items required by the ordinance under the Employment Security Act, and the items added by the 2022 amendment, have not been individually verified as of writing (unverified). Actual requirements are advised at the consultation.",
  s4H2: "When hiring a foreign national, who do you ask for what?",
  s4Lead1: "",
  s4Strong: "Entrance (residence status) = administrative scrivener; after hiring (labor & social insurance) = Certified Social Insurance and Labor Consultant; housing = licensed real-estate business",
  s4Lead2: ". Welcoming even one person involves three different qualifications.",
  t2Head: ["Task", "Responsible qualification", "Handled at Yotsuba by"],
  t2Rows: [
    ["Residence-status change / certification application", "Administrative scrivener (application agent)", "四葉行政書士事務所, under a separate contract"],
    ["Working-condition notice & employment contract", "Certified Social Insurance and Labor Consultant", "this office"],
    ["Notification of employment status of foreign nationals", "Certified Social Insurance and Labor Consultant", "this office"],
    ["Company housing arrangements", "Licensed real-estate business", "Yotsuba Real Estate Co., Ltd., under a separate contract"],
  ],
  s4Link1: "Bringing an employee from overseas (四葉行政書士事務所)",
  s4Link2: "Company housing (Yotsuba Real Estate)",
  s4Note:
    "* Yotsuba Real Estate Co., Ltd., 四葉行政書士事務所, and 四葉社会保険労務士事務所 are independent business entities and accept engagements separately. Contracts, invoices, and payment accounts are separate (no referral fees). You may engage only the part you need.",
  s5H2: "Can an international student start on April 1?",
  s5P1a: "",
  s5Strong1: "They cannot work until the change of residence status is granted.",
  s5P1b: " An offer alone is not enough; a change from \"Student\" to a work-eligible status is required. Because the application takes time, ",
  s5Strong2: "it can miss the start date.",
  s5P2a: "What this office takes on is ",
  s5Strong3: "designing the labor side until the permission comes through",
  s5P2b: " — what to write in the offer letter, where to set the start date, and how to treat the waiting period if permission is delayed. These are employment-contract questions. ",
  s5Strong4: "Eligibility for the residence status is judged by the Immigration Services Agency, and the application is handled by 四葉行政書士事務所 (separate contract).",
  s5Note:
    "* The application window and standard processing period have not been individually verified as of writing (unverified). Schedules are advised at the consultation based on the Immigration Services Agency's published materials.",
  s6H2: "What can 四葉社会保険労務士事務所 do?",
  s6P1a: "",
  s6Strong1: "We support the \"before\" and \"after\" of hiring, in documents and procedures.",
  s6P1b:
    " Before: organizing working conditions for postings and recruitment guidelines. After: drafting working-condition notices, employment contracts, and offer letters, plus insurance procedures on joining. Hiring-related subsidies are taken on for advisory clients.",
  s6P2a: "The representative works in ",
  s6Strong2: "Chinese and English",
  s6P2b:
    ". When hiring foreign nationals, we can explain the working conditions to the person directly, without an outside translation agency. As a journalist he served as China General Bureau Chief, stationed in China, Taiwan, and Thailand.",
  s6P3a: "",
  s6Strong3: "Consultations are free, both the first time and after.",
  s6P3b:
    " Come to us at the stage of \"look at this posting before it goes out\" or \"pin down the conditions before we make the offer\". Deciding before you publish is faster than fixing after.",
  s6Link1: "Fee table",
  s6Link2: "From consultation to contract",
  s6Link3: "Contact",
  s7H2: "Sources for this page",
  s7Items: [
    "Definition of employment placement = Employment Security Act (Act No. 141 of 1947), Article 4, Paragraph 1",
    "License for fee-charging employment placement = Article 30, Paragraph 1 of the same Act",
    "Statement of working conditions when recruiting = Article 5-3, Paragraph 1 of the same Act",
    "Statement of working conditions on concluding an employment contract = Labor Standards Act (Act No. 49 of 1947), Article 15; Article 5 of its ordinance",
    "Notification of employment status of foreign nationals = Act on Comprehensive Promotion of Labor Policies (Act No. 132 of 1966), Article 28, Paragraph 1",
  ],
  s7Note1:
    "* The provisions of the Employment Security Act were checked on e-Gov on August 14, 2026. The ordinance's required items, the latest amendment of Article 5 of the Labor Standards Act ordinance, and standard processing periods for status-change applications have not been individually verified (unverified).",
  s7Note2: "This page is general information. Individual cases are advised after review by the licensed consultant.",
};

const ZH_TW: Copy = {
  metaTitle: "招募・錄用的勞務｜四葉社會保險勞務士事務所",
  metaDescription:
    "徵才條件的明示、從甄選到內定的書面、入職時的手續、與錄用相關的助成金，由東京都文京區的四葉社會保險勞務士事務所承辦。不承辦求職者的介紹・斡旋。錄用留學生或外國人時，在留資格的申請由四葉行政書士事務所另行簽約承接。",
  crumbLabel: "招募・錄用的勞務",
  serviceName: "招募・錄用的勞務支援",
  heroAlt: "招募・錄用的勞務（面試場景）",
  h1: "招募・錄用的勞務",
  leadParts: [
    "徵才啟事上的",
    "勞動條件明示",
    "、從甄選到內定的書面、入職時的手續、與錄用相關的助成金——這些是社會保險勞務士的領域。另一方面，",
    "求職者的介紹・斡旋不承辦。",
    "收費的職業介紹，只有取得厚生勞動大臣許可的業者才能進行。",
    "本頁寫明承接到哪裡、從哪裡開始為您轉介。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "招募・錄用的費用" },
    { href: "/labor/nagare", label: "從諮詢到簽約的流程" },
    { href: "/labor/services/joseikin", label: "僱用相關助成金的申請" },
    { href: "/labor/services/gaikokujin-koyo", label: "外國人僱用（介護・育成就勞）的勞務" },
  ],
  crossLinkLead: "在留資格的申請由四葉行政書士事務所、住居的安排由四葉不動產株式會社、錄用後的勞務由本事務所，各自以另行簽訂的契約承接。",
  s1H2: "錄用的哪些部分，可以委託？",
  s1Strong: "「決定用誰」的部分不承辦。承辦的是「決定之後」與「決定之前的條件設計」。",
  s1Rest: "以下按費用表的分類列表。",
  t1Head: ["內容", "四葉的承辦"],
  t1Rows: [
    { name: "徵才啟事・招募要項的勞動條件整理", val: "承辦" },
    { name: "勞動條件通知書・僱用契約書的製作", val: "承辦" },
    { name: "內定通知書・誓約書的整備、試用期的設計", val: "承辦" },
    { name: "入職時的社會保險・僱用保險手續", val: "承辦" },
    { name: "與錄用相關的僱用助成金", val: "承辦（限顧問客戶）" },
    { name: "求職者的介紹・斡旋", val: "不承辦", strong: true },
    { name: "代辦應徵者面試", val: "不承辦", strong: true },
    { name: "求才媒體的營運代行", val: "不承辦", strong: true },
  ],
  s1FeeLink: "報酬額表（招募・錄用顧問為一式・個別報價）",
  s2H2: "為什麼只有「介紹」不能委託？",
  s2P1a: "因為那是需要許可的事業。職業安定法（日本語：職業安定法）將「職業紹介」定義為",
  s2Quote: "「接受求才與求職的申請，斡旋求才者與求職者之間成立僱用關係」",
  s2P1b: "（同法第4條第1項），收費進行需要",
  s2P1c: "厚生勞動大臣的許可",
  s2P1d: "（同法第30條第1項）。",
  s2P2a: "本事務所未取得此許可。因此，",
  s2Strong1: "「幫我們找好人才」的委託無法承接。",
  s2P2b: "人才介紹公司與求才媒體，是在取得許可或申報後經營事業。",
  s2Strong2: "角色不同，並非比較的對象。",
  s2P2c: "本事務所承接的，是",
  s2Strong3: "以書面與手續，整理與錄用者之間的關係",
  s2P2d: "。",
  s3H2: "徵才啟事上，必須寫什麼？",
  s3P1a: "在招募階段，有義務明示",
  s3Strong1: "應從事的業務內容、薪資、勞動時間及其他勞動條件",
  s3P1b: "（職業安定法第5條之3第1項）。這與",
  s3Strong2: "入職時的勞動條件明示（勞動基準法第15條）是不同的義務",
  s3P1c: "。「徵才啟事只是廣告，細節面試再談」的做法，正是把這兩者當成同一件事的結果。",
  s3P2a: "而且",
  s3Strong3: "徵才啟事與實際勞動條件不一致時，之後會被要求說明。",
  s3P2b: "入職後很快離職，往往從這個落差開始。發布徵才啟事前先給我們看一次，是最少返工的委託方式。",
  s3Note: "※職業安定法施行規則的明示事項細節、以及令和4年修正新增的事項，本頁製作時點未逐一經一次資料確認（未驗證）。實際記載事項將於面談時說明。",
  s4H2: "錄用外國人時，找誰辦什麼？",
  s4Lead1: "",
  s4Strong: "入口（在留資格）＝行政書士，錄用後（勞務・社會保險）＝社會保險勞務士，住居＝宅地建物取引業者",
  s4Lead2: "。即使只迎接一個人，負責的資格也分為3種。",
  t2Head: ["要做的事", "負責的資格", "四葉的承辦"],
  t2Rows: [
    ["在留資格的變更・認定申請", "行政書士（申請取次）", "四葉行政書士事務所另行簽約承接"],
    ["勞動條件通知書・僱用契約書", "社會保險勞務士", "本事務所承辦"],
    ["外國人僱用狀況申報", "社會保險勞務士", "本事務所承辦"],
    ["員工宿舍・住居的安排", "宅地建物取引業者", "四葉不動產株式會社另行簽約承接"],
  ],
  s4Link1: "從海外迎接外國員工時（四葉行政書士事務所）",
  s4Link2: "員工宿舍的導入（四葉不動產）",
  s4Note: "※四葉不動產株式會社・四葉行政書士事務所・四葉社會保險勞務士事務所為各自獨立的事業體，分別承接委託。契約・請款・匯款帳戶也分開（不收取、也不支付介紹費）。您可以只委託需要的部分。",
  s5H2: "留學生可以4月1日入職嗎？",
  s5P1a: "",
  s5Strong1: "在留資格變更獲得許可之前，不能開始工作。",
  s5P1b: "只發內定還不夠，需要從「留學」變更為可工作的在留資格。從申請到許可需要時間，",
  s5Strong2: "有可能趕不上入職日。",
  s5P2a: "本事務所承接的，是",
  s5Strong3: "許可下來之前的勞務設計",
  s5P2b: "：內定通知書要寫什麼、入職日訂在何時、許可延遲時待機期間如何處理——這些是勞動契約的問題。",
  s5Strong4: "判斷在留資格該當性的是出入國在留管理廳，申請由四葉行政書士事務所（另行簽約）承接。",
  s5Note: "※變更許可申請的受理開始時期與標準處理期間，本頁製作時點未逐一經一次資料確認（未驗證）。日程將依出入國在留管理廳的公開資料，於面談時說明。",
  s6H2: "四葉社會保險勞務士事務所，能做什麼？",
  s6P1a: "",
  s6Strong1: "以書面與手續，支援錄用的「前」與「後」。",
  s6P1b: "前是徵才啟事的勞動條件與招募要項的整理，後是勞動條件通知書・僱用契約書・內定通知書的製作，以及入職時的社會保險・僱用保險手續。與錄用相關的僱用助成金，在有顧問契約的情況下承接。",
  s6P2a: "代表對應",
  s6Strong2: "中文與英語",
  s6P2b: "。在錄用外國人的場合，包含向本人說明勞動條件在內，都不經外部翻譯公司。曾任新聞記者、擔任中國總局長，派駐中國、台灣、泰國。",
  s6P3a: "",
  s6Strong3: "諮詢首次與第2次起都免費。",
  s6P3b: "「發布徵才啟事前想請你看看」「發內定前想把條件定下來」的階段就請聯絡我們。發布後再改，不如發布前先定，來得更快。",
  s6Link1: "報酬額表",
  s6Link2: "從諮詢到簽約的流程",
  s6Link3: "聯絡我們",
  s7H2: "本頁的依據",
  s7Items: [
    "職業紹介的定義＝職業安定法（昭和22年法律第141號）第4條第1項",
    "收費職業介紹事業的許可＝同法第30條第1項",
    "招募時勞動條件等的明示＝同法第5條之3第1項",
    "締結勞動契約時的勞動條件明示＝勞動基準法（昭和22年法律第49號）第15條、同施行規則第5條",
    "外國人僱用狀況申報＝勞動施策綜合推進法（昭和41年法律第132號）第28條第1項",
  ],
  s7Note1: "※職業安定法各條文於2026年8月14日經 e-Gov 法令檢索確認。施行規則的明示事項、勞動基準法施行規則第5條的最終修正、在留資格變更許可申請的標準處理期間，本頁製作時點未逐一確認（未驗證）。",
  s7Note2: "本頁為一般性資訊。個別案件將經有資格者確認後為您說明。",
};

const ZH: Copy = {
  metaTitle: "招聘・录用的劳务｜四葉社会保険労務士事務所",
  metaDescription:
    "招聘条件的明示、从甄选到内定的书面、入职时的手续、与录用相关的助成金，由东京都文京区的四葉社会保険労務士事務所承办。不承办求职者的介绍・斡旋。录用留学生或外国人时，在留资格的申请由四葉行政書士事務所分别签约承接。",
  crumbLabel: "招聘・录用的劳务",
  serviceName: "招聘・录用的劳务支援",
  heroAlt: "招聘・录用的劳务（面试场景）",
  h1: "招聘・录用的劳务",
  leadParts: [
    "招聘启事上的",
    "劳动条件明示",
    "、从甄选到内定的书面、入职时的手续、与录用相关的助成金——这些是社会保险劳务士的领域。另一方面，",
    "求职者的介绍・斡旋不承办。",
    "收费的职业介绍，只有取得厚生劳动大臣许可的业者才能进行。",
    "本页写明承接到哪里、从哪里开始为您介绍。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "招聘・录用的费用" },
    { href: "/labor/nagare", label: "从咨询到签约的流程" },
    { href: "/labor/services/joseikin", label: "雇用相关助成金的申请" },
    { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介护・育成就劳）的劳务" },
  ],
  crossLinkLead: "在留资格的申请由四葉行政書士事務所、住居的安排由四葉不動産株式会社、录用后的劳务由本事务所，各自以分别签订的合同承接。",
  s1H2: "录用的哪些部分，可以委托？",
  s1Strong: "「决定用谁」的部分不承办。承办的是「决定之后」与「决定之前的条件设计」。",
  s1Rest: "以下按费用表的分类列表。",
  t1Head: ["内容", "四葉的承办"],
  t1Rows: [
    { name: "招聘启事・招募要项的劳动条件整理", val: "承办" },
    { name: "劳动条件通知书・雇用合同的制作", val: "承办" },
    { name: "内定通知书・誓约书的整备、试用期的设计", val: "承办" },
    { name: "入职时的社会保险・雇用保险手续", val: "承办" },
    { name: "与录用相关的雇用助成金", val: "承办（限顾问客户）" },
    { name: "求职者的介绍・斡旋", val: "不承办", strong: true },
    { name: "代办应聘者面试", val: "不承办", strong: true },
    { name: "招聘媒体的运营代行", val: "不承办", strong: true },
  ],
  s1FeeLink: "报酬额表（招聘・录用顾问为一式・个别报价）",
  s2H2: "为什么只有「介绍」不能委托？",
  s2P1a: "因为那是需要许可的事业。职业安定法（日本語：職業安定法）将「职业介绍」定义为",
  s2Quote: "「接受求才与求职的申请，斡旋求才者与求职者之间成立雇用关系」",
  s2P1b: "（同法第4条第1项），收费进行需要",
  s2P1c: "厚生劳动大臣的许可",
  s2P1d: "（同法第30条第1项）。",
  s2P2a: "本事务所未取得此许可。因此，",
  s2Strong1: "「帮我们找好人才」的委托无法承接。",
  s2P2b: "人才介绍公司与招聘媒体，是在取得许可或申报后经营事业。",
  s2Strong2: "角色不同，并非比较的对象。",
  s2P2c: "本事务所承接的，是",
  s2Strong3: "以书面与手续，整理与录用者之间的关系",
  s2P2d: "。",
  s3H2: "招聘启事上，必须写什么？",
  s3P1a: "在招募阶段，有义务明示",
  s3Strong1: "应从事的业务内容、工资、劳动时间及其他劳动条件",
  s3P1b: "（职业安定法第5条之3第1项）。这与",
  s3Strong2: "入职时的劳动条件明示（劳动基准法第15条）是不同的义务",
  s3P1c: "。「招聘启事只是广告，细节面试再谈」的做法，正是把这两者当成同一件事的结果。",
  s3P2a: "而且",
  s3Strong3: "招聘启事与实际劳动条件不一致时，之后会被要求说明。",
  s3P2b: "入职后很快离职，往往从这个落差开始。发布招聘启事前先给我们看一次，是最少返工的委托方式。",
  s3Note: "※职业安定法施行规则的明示事项细节、以及令和4年修订新增的事项，本页制作时点未逐一经一次资料确认（未验证）。实际记载事项将于面谈时说明。",
  s4H2: "录用外国人时，找谁办什么？",
  s4Lead1: "",
  s4Strong: "入口（在留资格）＝行政书士，录用后（劳务・社会保险）＝社会保险劳务士，住居＝宅地建物取引业者",
  s4Lead2: "。即使只迎接一个人，负责的资格也分为3种。",
  t2Head: ["要做的事", "负责的资格", "四葉的承办"],
  t2Rows: [
    ["在留资格的变更・认定申请", "行政书士（申请取次）", "四葉行政書士事務所分别签约承接"],
    ["劳动条件通知书・雇用合同", "社会保险劳务士", "本事务所承办"],
    ["外国人雇用状况申报", "社会保险劳务士", "本事务所承办"],
    ["员工宿舍・住居的安排", "宅地建物取引业者", "四葉不動産株式会社分别签约承接"],
  ],
  s4Link1: "从海外迎接外国员工时（四葉行政書士事務所）",
  s4Link2: "员工宿舍的导入（四葉不動産）",
  s4Note: "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所为各自独立的事业体，分别承接委托。合同・请款・汇款账户也分开（不收取、也不支付介绍费）。您可以只委托需要的部分。",
  s5H2: "留学生可以4月1日入职吗？",
  s5P1a: "",
  s5Strong1: "在留资格变更获得许可之前，不能开始工作。",
  s5P1b: "只发内定还不够，需要从「留学」变更为可工作的在留资格。从申请到许可需要时间，",
  s5Strong2: "有可能赶不上入职日。",
  s5P2a: "本事务所承接的，是",
  s5Strong3: "许可下来之前的劳务设计",
  s5P2b: "：内定通知书要写什么、入职日定在何时、许可延迟时待机期间如何处理——这些是劳动合同的问题。",
  s5Strong4: "判断在留资格该当性的是出入国在留管理厅，申请由四葉行政書士事務所（分别签约）承接。",
  s5Note: "※变更许可申请的受理开始时期与标准处理期间，本页制作时点未逐一经一次资料确认（未验证）。日程将按出入国在留管理厅的公开资料，于面谈时说明。",
  s6H2: "四葉社会保険労務士事務所，能做什么？",
  s6P1a: "",
  s6Strong1: "以书面与手续，支援录用的「前」与「后」。",
  s6P1b: "前是招聘启事的劳动条件与招募要项的整理，后是劳动条件通知书・雇用合同・内定通知书的制作，以及入职时的社会保险・雇用保险手续。与录用相关的雇用助成金，在有顾问合同的情况下承接。",
  s6P2a: "代表对应",
  s6Strong2: "中文与英语",
  s6P2b: "。在录用外国人的场合，包括向本人说明劳动条件在内，都不经外部翻译公司。曾任新闻记者、担任中国总局长，派驻中国、台湾、泰国。",
  s6P3a: "",
  s6Strong3: "咨询首次与第2次起都免费。",
  s6P3b: "「发布招聘启事前想请你看看」「发内定前想把条件定下来」的阶段就请联系我们。发布后再改，不如发布前先定，来得更快。",
  s6Link1: "报酬额表",
  s6Link2: "从咨询到签约的流程",
  s6Link3: "联系我们",
  s7H2: "本页的依据",
  s7Items: [
    "职业介绍的定义＝职业安定法（昭和22年法律第141号）第4条第1项",
    "收费职业介绍事业的许可＝同法第30条第1项",
    "招募时劳动条件等的明示＝同法第5条之3第1项",
    "缔结劳动合同时的劳动条件明示＝劳动基准法（昭和22年法律第49号）第15条、同施行规则第5条",
    "外国人雇用状况申报＝劳动施策综合推进法（昭和41年法律第132号）第28条第1项",
  ],
  s7Note1: "※职业安定法各条文于2026年8月14日经 e-Gov 法令检索确认。施行规则的明示事项、劳动基准法施行规则第5条的最终修订、在留资格变更许可申请的标准处理期间，本页制作时点未逐一确认（未验证）。",
  s7Note2: "本页为一般性信息。个别案件将经有资格者确认后为您说明。",
};

const COPY: Record<LangCode, Copy> = { ja: JA, en: EN, "zh-tw": ZH_TW, zh: ZH };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return buildPageMetadata({
    businessKey: "labor",
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/labor/services/saiyo",
    keywords: ["募集 採用 社労士", "求人票 労働条件 明示", "留学生 採用 入社日"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return (
    <LaborServicePage
      slug="saiyo"
      crumbLabel={c.crumbLabel}
      serviceName={c.serviceName}
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={
        <p>
          {c.leadParts[0]}
          <strong>{c.leadParts[1]}</strong>
          {c.leadParts[2]}
          <strong>{c.leadParts[3]}</strong>
          {c.leadParts[4]}
          {c.leadParts[5]}
        </p>
      }
      internalLinks={c.internalLinks}
      crossLinkLead={c.crossLinkLead}
    >
      <div>
        <LaborH2>{c.s1H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>{c.s1Strong}</strong>
          {c.s1Rest}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {c.t1Head.map((h) => (
                  <th key={h} className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.t1Rows.map((r) => (
                <tr key={r.name}>
                  <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                    {r.strong ? <strong>{r.name}</strong> : r.name}
                  </th>
                  <td className="border border-border px-3 py-2 text-text">
                    {r.strong ? <strong>{r.val}</strong> : r.val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            {c.s1FeeLink}
          </Link>
        </p>
      </div>

      <div>
        <LaborH2>{c.s2H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s2P1a}
          <strong>{c.s2Quote}</strong>
          {c.s2P1b}
          <strong>{c.s2P1c}</strong>
          {c.s2P1d}
        </p>
        <p className="mt-3 leading-relaxed text-text">
          {c.s2P2a}
          <strong>{c.s2Strong1}</strong>
          {c.s2P2b}
          <strong>{c.s2Strong2}</strong>
          {c.s2P2c}
          <strong>{c.s2Strong3}</strong>
          {c.s2P2d}
        </p>
      </div>

      <div>
        <LaborH2>{c.s3H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s3P1a}
          <strong>{c.s3Strong1}</strong>
          {c.s3P1b}
          <strong>{c.s3Strong2}</strong>
          {c.s3P1c}
        </p>
        <p className="mt-3 leading-relaxed text-text">
          {c.s3P2a}
          <strong>{c.s3Strong3}</strong>
          {c.s3P2b}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.s3Note}</p>
      </div>

      <div>
        <LaborH2>{c.s4H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s4Lead1}
          <strong>{c.s4Strong}</strong>
          {c.s4Lead2}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {c.t2Head.map((h) => (
                  <th key={h} className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.t2Rows.map((r) => (
                <tr key={r[0]}>
                  <th className="border border-border px-3 py-2 text-left font-medium text-ink">{r[0]}</th>
                  <td className="border border-border px-3 py-2 text-text">{r[1]}</td>
                  <td className="border border-border px-3 py-2 text-text">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/services/gaikokujin-shain", locale)} className="text-primary underline">
            {c.s4Link1}
          </Link>
          ／
          <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">
            {c.s4Link2}
          </Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">{c.s4Note}</p>
      </div>

      <div>
        <LaborH2>{c.s5H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s5P1a}
          <strong>{c.s5Strong1}</strong>
          {c.s5P1b}
          <strong>{c.s5Strong2}</strong>
        </p>
        <p className="mt-3 leading-relaxed text-text">
          {c.s5P2a}
          <strong>{c.s5Strong3}</strong>
          {c.s5P2b}
          <strong>{c.s5Strong4}</strong>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.s5Note}</p>
      </div>

      <div>
        <LaborH2>{c.s6H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s6P1a}
          <strong>{c.s6Strong1}</strong>
          {c.s6P1b}
        </p>
        <p className="mt-3 leading-relaxed text-text">
          {c.s6P2a}
          <strong>{c.s6Strong2}</strong>
          {c.s6P2b}
        </p>
        <p className="mt-3 leading-relaxed text-text">
          {c.s6P3a}
          <strong>{c.s6Strong3}</strong>
          {c.s6P3b}
        </p>
        <p className="mt-3 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            {c.s6Link1}
          </Link>
          ／
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
            {c.s6Link2}
          </Link>
          ／
          <Link href={addLocalePrefix("/labor/contact", locale)} className="text-primary underline">
            {c.s6Link3}
          </Link>
        </p>
      </div>

      <div>
        <LaborH2>{c.s7H2}</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
          {c.s7Items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.s7Note1}</p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.s7Note2}</p>
      </div>
    </LaborServicePage>
  );
}
