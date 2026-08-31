// /labor/services/gaikokujin-koyo（型A）＝原稿_社労士 #5
// クロスリンク＝C14（→/legal/services/visa・/shataku）がpathで自動（launchFlag=SR_LAUNCHED）。
// 2026-09-01 多言語化（第2波）：COPY: Record<LangCode,…>。中国語圏の読者が最有力のページ。
//   ・法令名は「（日本語：…）」注記（zh系）／英名＋原名（en）の慣行。
//   ・分離受任の明示（別の契約・另行簽約・separate contract）を4言語とも維持。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import type { LangCode } from "@/config/languages";

type Copy = {
  metaTitle: string;
  metaDescription: string;
  crumbLabel: string;
  serviceName: string;
  heroAlt: string;
  h1: string;
  leadParts: [string, string, string, string, string, string, string];
  internalLinks: { href: string; label: string }[];
  crossLinkLead: string;
  s1H2: string;
  s1Strong: string;
  s1Rest: string;
  s1Link1: string;
  s1Link2: string;
  s1Link3: string;
  s1Note: string;
  s2H2: string;
  s2Lead1: string;
  s2LeadStrong: string;
  s2Lead2: string;
  tableHead: [string, string, string, string];
  tableRows: [string, string, string, string][];
  s2Note: string;
  s3H2: string;
  s3Parts: [string, string, string, string];
  s4H2: string;
  s4Body1: string;
  s4Strong: string;
  s4Body2: string;
  s4Note: string;
  s5H2: string;
  s5Body1a: string;
  s5Strong1: string;
  s5Body1b: string;
  s5Body2: string;
  s5Note: string;
  s6H2: string;
  s6Items: string[];
  s6Note1: string;
  s6Note2: string;
};

const JA: Copy = {
  metaTitle: "外国人雇用の労務｜四葉社会保険労務士事務所",
  metaDescription:
    "外国人（介護・育成就労）の雇用に伴う労務・社会保険手続きを、文京区の四葉社会保険労務士事務所が承ります。日本語・英語・中国語（繁体字・簡体字）に対応。2027年4月施行の育成就労制度への受入準備も。在留資格の申請書類は四葉行政書士事務所が別契約で受任します。",
  crumbLabel: "外国人雇用（介護・育成就労）の労務",
  serviceName: "外国人雇用（介護・育成就労）の労務・社会保険サポート",
  heroAlt: "外国人雇用の労務のイメージ（多国籍の介護スタッフ）",
  h1: "外国人雇用（介護・育成就労）の労務",
  leadParts: [
    "外国人——とくに介護分野・育成就労——の雇用に伴う",
    "労務・社会保険手続き",
    "は、社会保険労務士に依頼できます。四葉社会保険労務士事務所は、雇用契約・社会保険・労働条件の説明を",
    "日本語・英語・中国語（繁体字・簡体字）",
    "で支援できるのが特長です。",
    "2027年4月施行の育成就労制度",
    "への受入準備にも対応します。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "外国人雇用の労務の料金" },
    { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
    { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
  ],
  crossLinkLead: "在留資格の申請は四葉行政書士事務所、住まいの手配は四葉不動産株式会社、雇用後の労務は当事務所が、それぞれ別の契約で受任します。",
  s1H2: "在留資格と労務は、どう分担するのですか？",
  s1Strong: "入口（在留資格の申請）＝行政書士、入社後（労務・社会保険）＝社会保険労務士",
  s1Rest:
    "です。四葉では、在留資格の申請書類を四葉行政書士事務所が、雇用後の労務を当事務所が承ります。住まいの手配は四葉不動産株式会社が多言語で対応します。3事務所はそれぞれ別の契約で受任し、料金・請求も分かれます。必要な部分だけをご依頼いただけます。",
  s1Link1: "在留資格・ビザ申請（四葉行政書士事務所）",
  s1Link2: "海外から社員を迎えるときの手順（四葉行政書士事務所）",
  s1Link3: "借り上げ社宅の導入（四葉不動産）",
  s1Note: "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。",
  s2H2: "入管への届出と労働局への届出は、別のものですか？",
  s2Lead1: "別のものです。",
  s2LeadStrong: "提出先も、期限も、担当する資格も分かれます。",
  s2Lead2: "どちらか一方を出せば足りるというものではありません。",
  tableHead: ["手続き", "提出先", "担当する資格", "四葉の取り扱い"],
  tableRows: [
    ["在留資格の申請・変更・更新", "出入国在留管理庁", "行政書士（申請取次）", "四葉行政書士事務所が別契約で受任"],
    ["外国人雇用状況の届出", "ハローワーク（公共職業安定所）", "社会保険労務士", "当事務所が承ります"],
    ["雇用保険の資格取得届", "ハローワーク", "社会保険労務士", "当事務所が承ります"],
    ["健康保険・厚生年金の資格取得届", "年金事務所", "社会保険労務士", "当事務所が承ります"],
  ],
  s2Note: "※各届出の期限日数は、本ページ作成時点で個別に一次確認していません（未検証）。実際の期限は面談のうえご案内します。",
  s3H2: "在留資格の申請と社会保険の届出は、同じ人に頼めますか？",
  s3Parts: [
    "資格が違うため、同じ契約にまとめることはできません。在留資格の申請取次は行政書士、労働・社会保険の手続きは社会保険労務士の業務です。四葉では前者を四葉行政書士事務所が、後者を当事務所が、",
    "それぞれ別の契約で",
    "受任します。契約書・請求書・お振込先も分かれます。必要な部分だけをご依頼いただけますし、他の部分を他社にご依頼いただいても差し支えありません。",
    "",
  ],
  s4H2: "技能実習・特定技能の外国人にも、社会保険は適用されますか？",
  s4Body1: "社会保険の適用は、在留資格の種類ではなく",
  s4Strong: "働き方（勤務時間・日数）と事業所の要件",
  s4Body2: "で判断されるのが一般的な取り扱いです。国籍や在留資格を理由に適用が除外される仕組みにはなっていません。",
  s4Note:
    "ただし、母国の社会保障制度との二重加入を調整する社会保障協定が結ばれている国の方については、取り扱いが異なる場合があります。協定の締結国と適用の条件は個別の確認が必要です（未検証）。",
  s5H2: "外国人社員の就業規則は、多言語にする必要がありますか？",
  s5Body1a: "法令上、就業規則を外国語に翻訳することが義務づけられているわけではありません。ただし就業規則は",
  s5Strong1: "周知して初めて効力を持つ",
  s5Body1b: "とされており（労働基準法第106条第1項）、内容を理解できない言語でのみ掲示している状態は、周知として十分かどうかが問われる場面があります。",
  s5Body2: "当事務所は、日本語・英語・中国語（繁体字・簡体字）で内容をご説明できます。代表が中国語と英語に対応するため、外部の翻訳会社を挟みません。",
  s5Note: "翻訳・翻訳証明は行政書士や社会保険労務士の独占業務ではありません。公的機関へ提出する書類の翻訳が必要な場合は、内容に応じて別途ご相談ください。",
  s6H2: "このページの根拠",
  s6Items: [
    "外国人雇用状況の届出＝労働施策総合推進法（昭和41年法律第132号）",
    "就業規則の周知＝労働基準法（昭和22年法律第49号）第106条第1項",
    "社会保険の適用＝健康保険法（大正11年法律第70号）、厚生年金保険法（昭和29年法律第115号）",
    "雇用保険の届出＝雇用保険法（昭和49年法律第116号）",
    "育成就労制度＝2027年4月施行予定",
  ],
  s6Note1: "※各法令の最終改正日、届出の期限日数、社会保障協定の締結国は、本ページ作成時点で個別に一次確認していません（未検証）。",
  s6Note2: "本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。",
};

const EN: Copy = {
  metaTitle: "Labor for employing foreign nationals｜四葉社会保険労務士事務所",
  metaDescription:
    "Labor and social-insurance procedures for employing foreign nationals (care work and Employment for Skill Development), handled by 四葉社会保険労務士事務所 in Bunkyo City, Tokyo — in Japanese, English, and Chinese (traditional and simplified). We also support preparation for the Employment for Skill Development system starting April 2027. Residence-status application documents are handled by 四葉行政書士事務所 under a separate contract.",
  crumbLabel: "Employing foreign nationals (care / Employment for Skill Development)",
  serviceName: "Labor & social-insurance support for employing foreign nationals",
  heroAlt: "Employing foreign nationals (multinational care staff)",
  h1: "Employing foreign nationals: labor matters (care / Employment for Skill Development)",
  leadParts: [
    "The ",
    "labor and social-insurance procedures",
    " that come with employing foreign nationals — especially in care work and Employment for Skill Development — can be entrusted to a Certified Social Insurance and Labor Consultant. The strength of 四葉社会保険労務士事務所 is that we can explain employment contracts, social insurance, and working conditions in ",
    "Japanese, English, and Chinese (traditional and simplified)",
    ". ",
    "We also support preparation for the Employment for Skill Development system taking effect in April 2027",
    ".",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "Fees for foreign-employment labor matters" },
    { href: "/labor/nagare", label: "From consultation to contract" },
    { href: "/labor/services/kaigo-roumu", label: "Labor management for care & disability welfare" },
  ],
  crossLinkLead:
    "Residence-status applications are handled by 四葉行政書士事務所, housing by Yotsuba Real Estate Co., Ltd., and post-hiring labor by this office — each under a separate contract.",
  s1H2: "How are residence status and labor divided?",
  s1Strong: "The entrance (residence-status application) = administrative scrivener; after joining (labor and social insurance) = Certified Social Insurance and Labor Consultant",
  s1Rest:
    ". At Yotsuba, residence-status application documents are prepared by 四葉行政書士事務所 and post-hiring labor is handled by this office. Housing is arranged by Yotsuba Real Estate Co., Ltd. with multilingual support. The three offices accept engagements under separate contracts, with separate fees and billing. You may engage only the part you need.",
  s1Link1: "Residence status & visa applications (四葉行政書士事務所)",
  s1Link2: "Bringing an employee from overseas (四葉行政書士事務所)",
  s1Link3: "Company housing (Yotsuba Real Estate)",
  s1Note:
    "* Yotsuba Real Estate Co., Ltd., 四葉行政書士事務所, and 四葉社会保険労務士事務所 are independent business entities and accept engagements separately (no referral fees are paid or received).",
  s2H2: "Are immigration filings and labor filings different things?",
  s2Lead1: "Yes. ",
  s2LeadStrong: "The destinations, deadlines, and responsible qualifications are all different.",
  s2Lead2: " Filing one does not cover the other.",
  tableHead: ["Procedure", "Filed with", "Responsible qualification", "Handled at Yotsuba by"],
  tableRows: [
    ["Residence-status application, change, renewal", "Immigration Services Agency", "Administrative scrivener (application agent)", "四葉行政書士事務所, under a separate contract"],
    ["Notification of employment status of foreign nationals", "Hello Work (public employment office)", "Certified Social Insurance and Labor Consultant", "this office"],
    ["Employment-insurance enrollment report", "Hello Work", "Certified Social Insurance and Labor Consultant", "this office"],
    ["Health-insurance / pension enrollment report", "Pension office", "Certified Social Insurance and Labor Consultant", "this office"],
  ],
  s2Note: "* Deadlines for each filing have not been individually verified as of writing (unverified). Actual deadlines are advised at the consultation.",
  s3H2: "Can the residence-status application and the insurance filings be asked of the same person?",
  s3Parts: [
    "Because the qualifications differ, they cannot be combined into one contract. Residence-status application services are the work of administrative scriveners; labor and social-insurance procedures are the work of Certified Social Insurance and Labor Consultants. At Yotsuba, the former is handled by 四葉行政書士事務所 and the latter by this office, ",
    "each under a separate contract",
    ". Contracts, invoices, and payment accounts are separate. You may engage only the part you need, and you are free to place the other part elsewhere.",
    "",
  ],
  s4H2: "Does social insurance apply to technical-intern and specified-skilled workers too?",
  s4Body1: "As a general rule, social-insurance coverage is judged not by the type of residence status but by ",
  s4Strong: "how the person works (hours and days) and the workplace's coverage requirements",
  s4Body2: ". There is no mechanism excluding coverage on the grounds of nationality or residence status.",
  s4Note:
    "However, for nationals of countries that have a social-security agreement with Japan coordinating double coverage, the treatment may differ. The agreement countries and conditions require case-by-case confirmation (unverified).",
  s5H2: "Do work rules need to be multilingual for foreign employees?",
  s5Body1a: "The law does not require work rules to be translated into foreign languages. However, work rules ",
  s5Strong1: "take effect only when made known to employees",
  s5Body1b:
    " (Labor Standards Act, Article 106, Paragraph 1), and posting them only in a language employees cannot understand can raise the question of whether that counts as sufficient notification.",
  s5Body2:
    "This office can explain the content in Japanese, English, and Chinese (traditional and simplified). Because the representative works in Chinese and English, no outside translation agency is involved.",
  s5Note:
    "Translation and translation certification are not the exclusive work of administrative scriveners or labor consultants. If you need documents translated for submission to public agencies, please consult us separately.",
  s6H2: "Sources for this page",
  s6Items: [
    "Notification of employment status of foreign nationals = Act on Comprehensive Promotion of Labor Policies (Act No. 132 of 1966)",
    "Notification of work rules = Labor Standards Act (Act No. 49 of 1947), Article 106, Paragraph 1",
    "Social-insurance coverage = Health Insurance Act (Act No. 70 of 1922); Employees' Pension Insurance Act (Act No. 115 of 1954)",
    "Employment-insurance filings = Employment Insurance Act (Act No. 116 of 1974)",
    "Employment for Skill Development system = scheduled to take effect April 2027",
  ],
  s6Note1:
    "* The latest amendment dates of each act, filing deadlines, and social-security agreement countries have not been individually verified as of writing (unverified).",
  s6Note2: "This page is general information. Individual cases are advised after review by the licensed consultant.",
};

const ZH_TW: Copy = {
  metaTitle: "外國人僱用的勞務｜四葉社會保險勞務士事務所",
  metaDescription:
    "外國人（介護・育成就勞）僱用相關的勞務・社會保險手續，由東京都文京區的四葉社會保險勞務士事務所承辦。對應日語・英語・中文（繁體字・簡體字）。也支援2027年4月施行的育成就勞制度受入準備。在留資格申請文件由四葉行政書士事務所另行簽約承接。",
  crumbLabel: "外國人僱用（介護・育成就勞）的勞務",
  serviceName: "外國人僱用（介護・育成就勞）的勞務・社會保險支援",
  heroAlt: "外國人僱用的勞務（多國籍介護人員）",
  h1: "外國人僱用（介護・育成就勞）的勞務",
  leadParts: [
    "僱用外國人——尤其是介護領域・育成就勞——所伴隨的",
    "勞務・社會保險手續",
    "，可以委託社會保險勞務士。四葉社會保險勞務士事務所的特長，是能以",
    "日語・英語・中文（繁體字・簡體字）",
    "說明僱用契約・社會保險・勞動條件。",
    "2027年4月施行的育成就勞制度",
    "的受入準備也可對應。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "外國人僱用勞務的費用" },
    { href: "/labor/nagare", label: "從諮詢到簽約的流程" },
    { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉的勞務管理" },
  ],
  crossLinkLead: "在留資格的申請由四葉行政書士事務所、住居的安排由四葉不動產株式會社、僱用後的勞務由本事務所，各自以另行簽訂的契約承接。",
  s1H2: "在留資格與勞務，如何分工？",
  s1Strong: "入口（在留資格申請）＝行政書士，入職後（勞務・社會保險）＝社會保險勞務士",
  s1Rest:
    "。在四葉，在留資格申請文件由四葉行政書士事務所、僱用後的勞務由本事務所承辦。住居的安排由四葉不動產株式會社以多語言對應。3個事務所各自以另行簽訂的契約承接，費用・請款也分開。您可以只委託需要的部分。",
  s1Link1: "在留資格・簽證申請（四葉行政書士事務所）",
  s1Link2: "從海外迎接員工的步驟（四葉行政書士事務所）",
  s1Link3: "員工宿舍的導入（四葉不動產）",
  s1Note: "※四葉不動產株式會社・四葉行政書士事務所・四葉社會保險勞務士事務所為各自獨立的事業體，分別承接委託（不收取、也不支付介紹費）。",
  s2H2: "向入管的申報與向勞動局的申報，是不同的嗎？",
  s2Lead1: "是不同的。",
  s2LeadStrong: "提交機關、期限、負責的資格都不同。",
  s2Lead2: "並非提交其中一方即可。",
  tableHead: ["手續", "提交機關", "負責的資格", "四葉的承辦"],
  tableRows: [
    ["在留資格的申請・變更・更新", "出入國在留管理廳", "行政書士（申請取次）", "四葉行政書士事務所另行簽約承接"],
    ["外國人僱用狀況申報", "Hello Work（公共職業安定所）", "社會保險勞務士", "本事務所承辦"],
    ["僱用保險 資格取得届", "Hello Work", "社會保險勞務士", "本事務所承辦"],
    ["健康保險・厚生年金 資格取得届", "年金事務所", "社會保險勞務士", "本事務所承辦"],
  ],
  s2Note: "※各申報的期限天數，本頁製作時點未逐一經一次資料確認（未驗證）。實際期限將於面談時說明。",
  s3H2: "在留資格申請與社會保險申報，可以委託同一個人嗎？",
  s3Parts: [
    "因為資格不同，無法合併為同一份契約。在留資格的申請取次是行政書士、勞動・社會保險手續是社會保險勞務士的業務。在四葉，前者由四葉行政書士事務所、後者由本事務所，",
    "各自以另行簽訂的契約",
    "承接。契約書・請款單・匯款帳戶也分開。您可以只委託需要的部分，其他部分委託其他公司也沒有問題。",
    "",
  ],
  s4H2: "技能實習・特定技能的外國人，也適用社會保險嗎？",
  s4Body1: "社會保險的適用，一般而言不是依在留資格的種類，而是依",
  s4Strong: "工作方式（勤務時間・天數）與事業所的要件",
  s4Body2: "判斷。並沒有因國籍或在留資格而排除適用的機制。",
  s4Note: "但是，與日本簽有調整雙重加入之社會保障協定的國家的人，處理可能不同。協定締約國與適用條件需個別確認（未驗證）。",
  s5H2: "外國員工的工作規則，需要做成多語言嗎？",
  s5Body1a: "法令上並未義務化將工作規則翻譯為外語。不過工作規則",
  s5Strong1: "須周知才生效",
  s5Body1b: "（勞動基準法〔日本語：労働基準法〕第106條第1項），只以員工無法理解的語言公告的狀態，可能被質疑是否構成充分的周知。",
  s5Body2: "本事務所能以日語・英語・中文（繁體字・簡體字）說明內容。因代表對應中文與英語，不經外部翻譯公司。",
  s5Note: "翻譯・翻譯證明並非行政書士或社會保險勞務士的獨占業務。若需要翻譯提交給公家機關的文件，請依內容另行諮詢。",
  s6H2: "本頁的依據",
  s6Items: [
    "外國人僱用狀況申報＝勞動施策綜合推進法（日本語：労働施策総合推進法／昭和41年法律第132號）",
    "工作規則的周知＝勞動基準法（昭和22年法律第49號）第106條第1項",
    "社會保險的適用＝健康保險法（大正11年法律第70號）、厚生年金保險法（昭和29年法律第115號）",
    "僱用保險的申報＝僱用保險法（昭和49年法律第116號）",
    "育成就勞制度＝預定2027年4月施行",
  ],
  s6Note1: "※各法令的最終修正日、申報期限天數、社會保障協定締約國，本頁製作時點未逐一經一次資料確認（未驗證）。",
  s6Note2: "本頁為一般性資訊。個別案件將經有資格者確認後為您說明。",
};

const ZH: Copy = {
  metaTitle: "外国人雇用的劳务｜四葉社会保険労務士事務所",
  metaDescription:
    "外国人（介护・育成就劳）雇用相关的劳务・社会保险手续，由东京都文京区的四葉社会保険労務士事務所承办。对应日语・英语・中文（繁体字・简体字）。也支援2027年4月施行的育成就劳制度接收准备。在留资格申请文件由四葉行政書士事務所分别签约承接。",
  crumbLabel: "外国人雇用（介护・育成就劳）的劳务",
  serviceName: "外国人雇用（介护・育成就劳）的劳务・社会保险支援",
  heroAlt: "外国人雇用的劳务（多国籍介护人员）",
  h1: "外国人雇用（介护・育成就劳）的劳务",
  leadParts: [
    "雇用外国人——尤其是介护领域・育成就劳——所伴随的",
    "劳务・社会保险手续",
    "，可以委托社会保险劳务士。四葉社会保険労務士事務所的特长，是能以",
    "日语・英语・中文（繁体字・简体字）",
    "说明雇用合同・社会保险・劳动条件。",
    "2027年4月施行的育成就劳制度",
    "的接收准备也可对应。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "外国人雇用劳务的费用" },
    { href: "/labor/nagare", label: "从咨询到签约的流程" },
    { href: "/labor/services/kaigo-roumu", label: "介护・残障福祉的劳务管理" },
  ],
  crossLinkLead: "在留资格的申请由四葉行政書士事務所、住居的安排由四葉不動産株式会社、雇用后的劳务由本事务所，各自以分别签订的合同承接。",
  s1H2: "在留资格与劳务，如何分工？",
  s1Strong: "入口（在留资格申请）＝行政书士，入职后（劳务・社会保险）＝社会保险劳务士",
  s1Rest:
    "。在四葉，在留资格申请文件由四葉行政書士事務所、雇用后的劳务由本事务所承办。住居的安排由四葉不動産株式会社以多语言对应。3个事务所各自以分别签订的合同承接，费用・请款也分开。您可以只委托需要的部分。",
  s1Link1: "在留资格・签证申请（四葉行政書士事務所）",
  s1Link2: "从海外迎接员工的步骤（四葉行政書士事務所）",
  s1Link3: "员工宿舍的导入（四葉不動産）",
  s1Note: "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所为各自独立的事业体，分别承接委托（不收取、也不支付介绍费）。",
  s2H2: "向入管的申报与向劳动局的申报，是不同的吗？",
  s2Lead1: "是不同的。",
  s2LeadStrong: "提交机关、期限、负责的资格都不同。",
  s2Lead2: "并非提交其中一方即可。",
  tableHead: ["手续", "提交机关", "负责的资格", "四葉的承办"],
  tableRows: [
    ["在留资格的申请・变更・更新", "出入国在留管理厅", "行政书士（申请取次）", "四葉行政書士事務所分别签约承接"],
    ["外国人雇用状况申报", "Hello Work（公共职业安定所）", "社会保险劳务士", "本事务所承办"],
    ["雇用保险 资格取得届", "Hello Work", "社会保险劳务士", "本事务所承办"],
    ["健康保险・厚生年金 资格取得届", "年金事务所", "社会保险劳务士", "本事务所承办"],
  ],
  s2Note: "※各申报的期限天数，本页制作时点未逐一经一次资料确认（未验证）。实际期限将于面谈时说明。",
  s3H2: "在留资格申请与社会保险申报，可以委托同一个人吗？",
  s3Parts: [
    "因为资格不同，无法合并为同一份合同。在留资格的申请取次是行政书士、劳动・社会保险手续是社会保险劳务士的业务。在四葉，前者由四葉行政書士事務所、后者由本事务所，",
    "各自以分别签订的合同",
    "承接。合同・请款单・汇款账户也分开。您可以只委托需要的部分，其他部分委托其他公司也没有问题。",
    "",
  ],
  s4H2: "技能实习・特定技能的外国人，也适用社会保险吗？",
  s4Body1: "社会保险的适用，一般而言不是按在留资格的种类，而是按",
  s4Strong: "工作方式（勤务时间・天数）与事业所的要件",
  s4Body2: "判断。并没有因国籍或在留资格而排除适用的机制。",
  s4Note: "但是，与日本签有调整双重加入之社会保障协定的国家的人，处理可能不同。协定缔约国与适用条件需个别确认（未验证）。",
  s5H2: "外国员工的就业规则，需要做成多语言吗？",
  s5Body1a: "法令上并未义务化将就业规则翻译为外语。不过就业规则",
  s5Strong1: "须周知才生效",
  s5Body1b: "（劳动基准法〔日本語：労働基準法〕第106条第1项），只以员工无法理解的语言公告的状态，可能被质疑是否构成充分的周知。",
  s5Body2: "本事务所能以日语・英语・中文（繁体字・简体字）说明内容。因代表对应中文与英语，不经外部翻译公司。",
  s5Note: "翻译・翻译证明并非行政书士或社会保险劳务士的独占业务。若需要翻译提交给公家机关的文件，请按内容另行咨询。",
  s6H2: "本页的依据",
  s6Items: [
    "外国人雇用状况申报＝劳动施策综合推进法（日本語：労働施策総合推進法／昭和41年法律第132号）",
    "就业规则的周知＝劳动基准法（昭和22年法律第49号）第106条第1项",
    "社会保险的适用＝健康保险法（大正11年法律第70号）、厚生年金保险法（昭和29年法律第115号）",
    "雇用保险的申报＝雇用保险法（昭和49年法律第116号）",
    "育成就劳制度＝预定2027年4月施行",
  ],
  s6Note1: "※各法令的最终修订日、申报期限天数、社会保障协定缔约国，本页制作时点未逐一经一次资料确认（未验证）。",
  s6Note2: "本页为一般性信息。个别案件将经有资格者确认后为您说明。",
};

const COPY: Record<LangCode, Copy> = { ja: JA, en: EN, "zh-tw": ZH_TW, zh: ZH };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return buildPageMetadata({
    businessKey: "labor",
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/labor/services/gaikokujin-koyo",
    keywords: ["外国人 雇用 社労士", "育成就労 受入 準備", "介護 外国人材 労務"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return (
    <LaborServicePage
      slug="gaikokujin-koyo"
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
          <strong>{c.leadParts[5]}</strong>
          {c.leadParts[6]}
          <Placeholder reason="浦松＝育成就労対応の範囲" />
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
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/services/visa", locale)} className="text-primary underline">
            {c.s1Link1}
          </Link>
          ／
          <Link href={addLocalePrefix("/legal/services/gaikokujin-shain", locale)} className="text-primary underline">
            {c.s1Link2}
          </Link>
          ／
          <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">
            {c.s1Link3}
          </Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">{c.s1Note}</p>
      </div>

      <div>
        <LaborH2>{c.s2H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s2Lead1}
          <strong>{c.s2LeadStrong}</strong>
          {c.s2Lead2}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {c.tableHead.map((h) => (
                  <th key={h} className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.tableRows.map((r) => (
                <tr key={r[0]}>
                  <th className="border border-border px-3 py-2 text-left font-medium text-ink">{r[0]}</th>
                  <td className="border border-border px-3 py-2 text-text">{r[1]}</td>
                  <td className="border border-border px-3 py-2 text-text">{r[2]}</td>
                  <td className="border border-border px-3 py-2 text-text">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.s2Note}</p>
      </div>

      <div>
        <LaborH2>{c.s3H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s3Parts[0]}
          <strong>{c.s3Parts[1]}</strong>
          {c.s3Parts[2]}
        </p>
      </div>

      <div>
        <LaborH2>{c.s4H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s4Body1}
          <strong>{c.s4Strong}</strong>
          {c.s4Body2}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.s4Note}</p>
      </div>

      <div>
        <LaborH2>{c.s5H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s5Body1a}
          <strong>{c.s5Strong1}</strong>
          {c.s5Body1b}
        </p>
        <p className="mt-3 leading-relaxed text-text">{c.s5Body2}</p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.s5Note}</p>
      </div>

      <div>
        <LaborH2>{c.s6H2}</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
          {c.s6Items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.s6Note1}</p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.s6Note2}</p>
      </div>
    </LaborServicePage>
  );
}
