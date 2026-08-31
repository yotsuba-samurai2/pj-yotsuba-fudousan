// /labor/services/gaibu-kansanin（型A）＝2026-08-11 新規。設計＝61_外部監査人_導線設計.md
//
// 【役割分担】luck428-column-seo 第2条・第6条。**主語で分ける。**
//   ・/legal/services/ikuseishuro-gaibu-kansa（2026-08-06 新設・定点#26/#27の主力）
//       ＝「誰に依頼できるか」「要件は何か」「いつから始まるか」＝**探している側**
//   ・本ページ ＝「監査では何を見られるか」「何を備えておけばよいか」＝**備える側**
//     要件・誰に依頼できるかは書かない。legal 側へ発リンクして評価を集約する（第6条5）
//
// 【なぜ両方あるか】施行規則第47条第2項第2号は弁護士・社会保険労務士・行政書士を列挙しており、
//   浦松はいずれの資格でも就任できる。四葉行政書士事務所・四葉社会保険労務士事務所の
//   どちらでもお受けできるため、両方に窓口を置く。契約は事務所ごとに別々。
//
// 【法令の裏取り】2026-08-06 に /legal 側で e-Gov法令API v2・出入国在留管理庁により確認済みの値を使う。
//   ・育成就労法＝**平成28年法律第89号**（技能実習法を令和6年法律第60号が改正し題名を差し替えたもの）
//   ・法第25条第1項第5号＝外部監査の措置が許可の基準（技能実習法のイ／ロ選択制が単一号になった）
//   ・施行規則＝令和7年法務省・厚生労働省令第4号（技能実習法施行規則の全部改正）第47条ほか
//   ・施行日＝令和9年4月1日（令和7年政令第340号）
//   ・**施行日前の許可申請の受付開始時期は未公表**（令和6年法律第60号 附則第5条第3項）
// 2026-09-01 多言語化（第2波）：COPY: Record<LangCode,…>。監理支援機関向け＝日本語読者が主だが、
//   受入企業の外国人担当者・海外本社が読む場面を想定して4言語化。
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
  leadParts: [string, string, string, string, string];
  internalLinks: { href: string; label: string }[];
  crossLinkLead: string;
  s1H2: string;
  s1Lead1: string;
  s1Strong: string;
  s1Lead2: string;
  s1Items: { strong: string; rest: string }[];
  s1Note: string;
  s2H2: string;
  s2Lead1: string;
  s2Strong: string;
  s2Lead2: string;
  t1Head: [string, string, string];
  t1Rows: [string, string, string][];
  s3H2: string;
  s3Body1: string;
  s3Strong: string;
  s3Body2: string;
  s4H2: string;
  s4P1a: string;
  s4Strong1: string;
  s4P1b: string;
  s4P2a: string;
  s4Strong2: string;
  s4P2b: string;
  s4LinkPre: string;
  s4LinkStrong: string;
  s4LinkMid: string;
  s4Link: string;
  s4Note: string;
  s5H2: string;
  s5P1a: string;
  s5Strong1: string;
  s5P1b: string;
  s5Strong2: string;
  s5Items: [string, string, string];
  s5Item3Strong: string;
  s5P2: string;
  s6H2: string;
  s6Strong: string;
  s6Body: string;
  s6Link: string;
  s7H2: string;
  s7Items: string[];
  s7Note1a: string;
  s7Note1Strong: string;
  s7Note2: string;
};

const JA: Copy = {
  metaTitle: "外部監査で見られる労務｜四葉社会保険労務士事務所",
  metaDescription:
    "育成就労の外部監査では、労働時間・賃金・安全衛生・住環境といった労働関係法令の遵守状況が確認されます。監理支援機関と受入企業が何を備えておけばよいかを、社会保険労務士の立場から整理しました。外部監査人の就任もお受けします。文京区小日向・茗荷谷駅徒歩5分。",
  crumbLabel: "外部監査で見られる労務",
  serviceName: "育成就労の外部監査に備える労務整備・外部監査人の受託",
  heroAlt: "外部監査で見られる労務のイメージ（賃金台帳と勤怠記録の確認）",
  h1: "外部監査で見られる労務",
  leadParts: [
    "育成就労の外部監査で確認されるのは、",
    "労働関係法令が守られているか",
    "です。労働時間・賃金・安全衛生・住環境といった、",
    "労務そのもの",
    "が対象になります。監理支援機関と受入企業が何を備えておけばよいかを、社会保険労務士の立場から整理しました。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "外部監査人の料金" },
    { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介護・育成就労）の労務" },
    { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
  ],
  crossLinkLead: "外部監査人の要件と依頼先については、四葉行政書士事務所のページで整理しています。",
  s1H2: "外部監査では、何を見られるのですか？",
  s1Lead1: "外部監査人が確認するのは、監理支援機関の",
  s1Strong: "監理・監査の業務が適正に行われているか",
  s1Lead2: "です。その監理・監査が向き合っているのは、受入企業における労働関係法令の遵守状況にほかなりません。したがって、実際に問われるのは次のような労務です。",
  s1Items: [
    { strong: "労働時間", rest: "——記録の方法、時間外・休日労働の上限、36協定の内容と実態の一致" },
    { strong: "賃金", rest: "——最低賃金、割増賃金の計算、控除の根拠、賃金台帳の記載" },
    { strong: "安全衛生", rest: "——健康診断、教育、作業環境" },
    { strong: "住環境", rest: "——宿舎の状況、費用の徴収額と実費との関係" },
    { strong: "受入れの条件", rest: "——雇用契約の内容が、日本人と同等以上になっているか" },
  ],
  s1Note: "※確認の対象となる書類の範囲は、出入国在留管理庁「育成就労制度運用要領」第5章に示されています。制度は施行前で、下位の告示や運用の細目がこれから示される部分があります（未検証）。",
  s2H2: "備えるとしたら、どこから手をつけますか？",
  s2Lead1: "監査の場で困るのは、",
  s2Strong: "制度を知らないことより、記録が残っていないこと",
  s2Lead2: "です。順序としては次のようになります。",
  t1Head: ["順", "やること", "なぜ先か"],
  t1Rows: [
    ["1", "勤怠の記録方法をそろえる", "賃金の計算も36協定の管理も、ここが元になります"],
    ["2", "賃金台帳と雇用契約の内容を突き合わせる", "控除の根拠が契約に書かれていないと説明できません"],
    ["3", "就業規則と実態を合わせる", "規則にない運用は、監査で必ず理由を聞かれます"],
    ["4", "宿舎の費用と実費の関係を整理する", "住環境は育成就労で重く見られる項目です"],
  ],
  s3H2: "言葉が通じないところは、どうしますか？",
  s3Body1: "監査では、育成就労外国人本人からの聞き取りが行われます。通訳を介すると、労働時間や賃金の説明が正確に伝わらないことがあります。当事務所の代表は元毎日新聞中国総局長で、",
  s3Strong: "中国語（繁体字・簡体字）と英語に対応",
  s3Body2: "します。外部の通訳を挟まずに確認できます。",
  s4H2: "外部監査人は、行政書士と社会保険労務士のどちらに頼めますか？",
  s4P1a: "施行規則は、外部監査人になれる者として",
  s4Strong1: "弁護士・社会保険労務士・行政書士",
  s4P1b: "（およびそれぞれの法人）と、育成就労に関する知見を有する者を挙げています。",
  s4P2a: "四葉では、",
  s4Strong2: "四葉行政書士事務所と四葉社会保険労務士事務所のどちらでもお受けできます",
  s4P2b: "。ご契約は事務所ごとに別々になりますので、すでにいずれかとお取引がある場合は、そちらに合わせていただけます。",
  s4LinkPre: "外部監査人の",
  s4LinkStrong: "要件",
  s4LinkMid: "（講習の修了、独立性、欠格事由、氏名の公表への同意）と、依頼先の選び方は次のページで整理しています。 → ",
  s4Link: "育成就労の外部監査人（四葉行政書士事務所）",
  s4Note: "※四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。",
  s5H2: "顧問先の会社が受け入れている場合はどうなりますか？",
  s5P1a: "",
  s5Strong1: "その監理支援機関の外部監査人はお受けしません。",
  s5P1b: "外部監査人には、監理支援機関やその関係先から独立していることが求められます。当事務所は要件の確認にとどめず、",
  s5Strong2: "方針として次のとおり切り分けています",
  s5Items: [
    "外部監査人をお引き受けした監理支援機関の関係先（傘下の受入企業）とは、労務の顧問契約を結びません",
    "既存の顧問先が加入している監理支援機関の外部監査人は、お引き受けしません",
    "この切り分けは、行政書士事務所・社会保険労務士事務所のどちらで受けた場合にも適用します",
  ],
  s5Item3Strong: "この切り分けは、行政書士事務所・社会保険労務士事務所のどちらで受けた場合にも適用します",
  s5P2: "外から確認する立場と、内側で相談に応じる立場を、同じ人が兼ねないためです。事務所を分けても同じ人である以上、扱いは変えません。ご相談の際に、まず関係の有無を確認させてください。",
  s6H2: "費用はいくらですか？",
  s6Strong: "お見積り",
  s6Body: "です。事業所の数、実地確認への同行の有無によって作業量が変わるためです。お問い合わせの際に、事業所数と受入れの規模をお知らせください。",
  s6Link: "報酬額表",
  s7H2: "このページの根拠",
  s7Items: [
    "外国人の育成就労の適正な実施及び育成就労外国人の保護に関する法律（平成28年法律第89号）第25条第1項第5号／施行日 令和9年4月1日／最終改正 令和6年法律第60号。本法は2024年に新たに制定されたものではなく、外国人の技能実習の適正な実施及び技能実習生の保護に関する法律を令和6年法律第60号が改正して題名を改めたものです",
    "同法施行規則（令和7年法務省・厚生労働省令第4号・公布 令和7年9月30日）第47条／施行日 令和9年4月1日／最終改正 令和8年法務省・厚生労働省令第3号。第2項第2号に弁護士・社会保険労務士・行政書士の明文があります",
    "外部監査の方法・確認対象書類＝出入国在留管理庁「育成就労制度運用要領」第5章（令和8年8月5日更新版・2026年8月6日確認）",
    "労働時間・賃金・安全衛生の根拠＝労働基準法（昭和22年法律第49号）、労働安全衛生法（昭和47年法律第57号）、最低賃金法（昭和34年法律第137号）",
  ],
  s7Note1a: "※法令の条番号は、四葉行政書士事務所のページで2026年8月6日に一次資料により確認したものを引用しています。",
  s7Note1Strong: "確認対象書類の具体的な範囲、監査の頻度、施行日前の許可申請の受付開始時期は、いずれも本ページ作成時点で確定していません（未検証）。",
  s7Note2: "本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。",
};

const EN: Copy = {
  metaTitle: "Labor points reviewed in external audits｜四葉社会保険労務士事務所",
  metaDescription:
    "External audits under Employment for Skill Development check compliance with labor laws — working hours, wages, safety and health, and housing. What supervising support organizations and host companies should have in place, from the standpoint of a Certified Social Insurance and Labor Consultant. We also accept appointment as external auditor. Kohinata, Bunkyo City, Tokyo.",
  crumbLabel: "Labor in external audits",
  serviceName: "Labor preparation for Employment for Skill Development external audits; external auditor engagements",
  heroAlt: "Labor points in external audits (checking wage ledgers and attendance records)",
  h1: "Labor points reviewed in external audits",
  leadParts: [
    "What external audits under Employment for Skill Development examine is ",
    "whether labor laws are being observed",
    ". The subject matter is ",
    "labor itself",
    " — working hours, wages, safety and health, housing. Here is what supervising support organizations and host companies should have in place, from a labor consultant's standpoint.",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "External-auditor fees" },
    { href: "/labor/services/gaikokujin-koyo", label: "Employing foreign nationals" },
    { href: "/labor/nagare", label: "From consultation to contract" },
  ],
  crossLinkLead: "The requirements for external auditors and whom to engage are covered on the 四葉行政書士事務所 page.",
  s1H2: "What does an external audit look at?",
  s1Lead1: "What the external auditor verifies is whether the supervising support organization's ",
  s1Strong: "supervision and audit work is being carried out properly",
  s1Lead2:
    ". And what that supervision faces is nothing other than the host company's compliance with labor laws. So what is actually examined is labor matters like these:",
  s1Items: [
    { strong: "Working hours", rest: " — how records are kept, overtime and holiday-work limits, and whether the Article 36 agreement matches reality" },
    { strong: "Wages", rest: " — minimum wage, premium-pay calculation, grounds for deductions, wage-ledger entries" },
    { strong: "Safety and health", rest: " — health checkups, training, the working environment" },
    { strong: "Housing", rest: " — dormitory conditions, and how charges collected relate to actual costs" },
    { strong: "Terms of acceptance", rest: " — whether the employment contract is equal to or better than that of Japanese workers" },
  ],
  s1Note:
    "* The scope of documents subject to review is set out in Chapter 5 of the Immigration Services Agency's operational guidelines for the system. The system is pre-enforcement, and some subordinate notices and operational details are still to come (unverified).",
  s2H2: "If you are preparing, where do you start?",
  s2Lead1: "What causes trouble at an audit is ",
  s2Strong: "not ignorance of the system but the absence of records",
  s2Lead2: ". The order is as follows.",
  t1Head: ["Step", "What to do", "Why first"],
  t1Rows: [
    ["1", "Standardize how attendance is recorded", "Wage calculation and Article 36 management both build on this"],
    ["2", "Cross-check the wage ledger against the employment contracts", "Deductions cannot be explained unless their grounds are in the contract"],
    ["3", "Align the work rules with actual practice", "Practices not in the rules will always be questioned"],
    ["4", "Sort out dormitory charges versus actual costs", "Housing is weighted heavily under this system"],
  ],
  s3H2: "What about language barriers?",
  s3Body1:
    "Audits include interviews with the foreign workers themselves. Through an interpreter, explanations of hours and wages can lose precision. This office's representative, a former China General Bureau Chief of the Mainichi Shimbun, works in ",
  s3Strong: "Chinese (traditional and simplified) and English",
  s3Body2: ", so verification can be done without an outside interpreter.",
  s4H2: "Can the external auditor be an administrative scrivener or a labor consultant?",
  s4P1a: "The ordinance lists, as persons eligible to serve as external auditor, ",
  s4Strong1: "attorneys, Certified Social Insurance and Labor Consultants, and administrative scriveners",
  s4P1b: " (and their professional corporations), plus persons with expertise in the system.",
  s4P2a: "At Yotsuba, ",
  s4Strong2: "either 四葉行政書士事務所 or 四葉社会保険労務士事務所 can take the engagement",
  s4P2b: ". Contracts are separate per office, so if you already deal with one of them, you can keep to that office.",
  s4LinkPre: "The external auditor's ",
  s4LinkStrong: "requirements",
  s4LinkMid: " (completing the training, independence, disqualification grounds, consent to publication of name) and how to choose whom to engage are covered here: → ",
  s4Link: "External auditors under Employment for Skill Development (四葉行政書士事務所)",
  s4Note: "* 四葉行政書士事務所 and 四葉社会保険労務士事務所 are independent business entities and accept engagements separately (no referral fees are paid or received).",
  s5H2: "What if a company we advise is a host company?",
  s5P1a: "",
  s5Strong1: "We will not serve as external auditor for that supervising support organization.",
  s5P1b: " External auditors must be independent of the organization and its related parties. We go beyond checking the formal requirements and ",
  s5Strong2: "draw the line as a matter of policy",
  s5Items: [
    "We do not enter labor advisory contracts with related parties (member host companies) of an organization whose external auditor we serve as",
    "We do not serve as external auditor for an organization that an existing advisory client belongs to",
    "This separation applies whichever office — administrative scrivener or labor consultant — takes the engagement",
  ],
  s5Item3Strong: "This separation applies whichever office — administrative scrivener or labor consultant — takes the engagement",
  s5P2:
    "The one who verifies from outside and the one who advises from inside should not be the same person. Splitting the offices does not change that it is the same person, so the treatment stays the same. Please let us first confirm whether any such relationship exists.",
  s6H2: "How much does it cost?",
  s6Strong: "Individually quoted",
  s6Body: ". The workload depends on the number of workplaces and whether we accompany on-site checks. When you contact us, please tell us the number of workplaces and the scale of acceptance.",
  s6Link: "Fee table",
  s7H2: "Sources for this page",
  s7Items: [
    "Act on Proper Implementation of Employment for Skill Development and Protection of Foreign Workers (Act No. 89 of 2016), Article 25, Paragraph 1, Item 5; effective April 1, 2027 (Reiwa 9); last amended by Act No. 60 of 2024. The Act was not newly enacted in 2024 — it is the Technical Intern Training Act as amended and retitled by Act No. 60 of 2024",
    "Its ordinance (Ministry of Justice / MHLW Ordinance No. 4 of 2025, promulgated September 30, 2025), Article 47; effective April 1, 2027; last amended by Ordinance No. 3 of 2026. Paragraph 2, Item 2 expressly lists attorneys, labor consultants, and administrative scriveners",
    "Audit method and documents reviewed = Immigration Services Agency operational guidelines, Chapter 5 (updated August 5, 2026; checked August 6, 2026)",
    "Working hours, wages, safety = Labor Standards Act (Act No. 49 of 1947); Industrial Safety and Health Act (Act No. 57 of 1972); Minimum Wage Act (Act No. 137 of 1959)",
  ],
  s7Note1a: "* Article numbers are cited from primary sources checked on the 四葉行政書士事務所 page on August 6, 2026. ",
  s7Note1Strong: "The specific scope of documents reviewed, audit frequency, and when pre-enforcement license applications open are all undetermined as of writing (unverified).",
  s7Note2: "This page is general information. Individual cases are advised after review by the licensed consultant.",
};

const ZH_TW: Copy = {
  metaTitle: "外部監查會查核的勞務｜四葉社會保險勞務士事務所",
  metaDescription:
    "育成就勞的外部監查，確認勞動時間・薪資・安全衛生・住居環境等勞動法令的遵守狀況。監理支援機關與受入企業應備妥什麼，從社會保險勞務士的立場整理。也承接外部監查人的就任。東京都文京區小日向・茗荷谷站步行5分鐘。",
  crumbLabel: "外部監查會查核的勞務",
  serviceName: "因應育成就勞外部監查的勞務整備・外部監查人受託",
  heroAlt: "外部監查會查核的勞務（薪資台帳與出勤紀錄的確認）",
  h1: "外部監查會查核的勞務",
  leadParts: [
    "育成就勞的外部監查確認的是",
    "勞動法令是否被遵守",
    "。勞動時間・薪資・安全衛生・住居環境等",
    "勞務本身",
    "是查核對象。監理支援機關與受入企業應備妥什麼，從社會保險勞務士的立場整理如下。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "外部監查人的費用" },
    { href: "/labor/services/gaikokujin-koyo", label: "外國人僱用（介護・育成就勞）的勞務" },
    { href: "/labor/nagare", label: "從諮詢到簽約的流程" },
  ],
  crossLinkLead: "外部監查人的要件與委託對象，在四葉行政書士事務所的頁面整理。",
  s1H2: "外部監查，會查核什麼？",
  s1Lead1: "外部監查人確認的，是監理支援機關的",
  s1Strong: "監理・監查業務是否適正執行",
  s1Lead2: "。而該監理・監查所面對的，正是受入企業的勞動法令遵守狀況。因此，實際被檢視的是以下這些勞務。",
  s1Items: [
    { strong: "勞動時間", rest: "——記錄方法、加班・假日勞動的上限、36協定內容與實態的一致" },
    { strong: "薪資", rest: "——最低薪資、加給薪資的計算、扣除的依據、薪資台帳的記載" },
    { strong: "安全衛生", rest: "——健康檢查、教育訓練、作業環境" },
    { strong: "住居環境", rest: "——宿舍狀況、費用徵收額與實際費用的關係" },
    { strong: "受入條件", rest: "——僱用契約內容是否與日本人同等以上" },
  ],
  s1Note: "※查核對象文件的範圍，載於出入國在留管理廳「育成就勞制度運用要領」第5章。制度尚未施行，部分下位告示與運用細節仍待公布（未驗證）。",
  s2H2: "若要準備，從哪裡著手？",
  s2Lead1: "監查現場的困境，",
  s2Strong: "與其說是不了解制度，不如說是沒有留下記錄",
  s2Lead2: "。順序如下。",
  t1Head: ["順", "要做的事", "為何優先"],
  t1Rows: [
    ["1", "統一出勤記錄的方法", "薪資計算與36協定的管理，都以此為基礎"],
    ["2", "將薪資台帳與僱用契約內容比對", "扣除的依據若未寫進契約，便無法說明"],
    ["3", "使工作規則與實態一致", "規則裡沒有的做法，監查時必定被問理由"],
    ["4", "整理宿舍費用與實際費用的關係", "住居環境在育成就勞中被重點檢視"],
  ],
  s3H2: "語言不通的部分，怎麼辦？",
  s3Body1: "監查會對育成就勞外國人本人進行訪談。經過口譯，勞動時間與薪資的說明可能無法準確傳達。本事務所代表曾任每日新聞中國總局長，",
  s3Strong: "對應中文（繁體字・簡體字）與英語",
  s3Body2: "，可不經外部口譯直接確認。",
  s4H2: "外部監查人，可以委託行政書士還是社會保險勞務士？",
  s4P1a: "施行規則列舉可擔任外部監查人者為",
  s4Strong1: "律師・社會保險勞務士・行政書士",
  s4P1b: "（及各自的法人），以及具備育成就勞相關知識經驗者。",
  s4P2a: "在四葉，",
  s4Strong2: "四葉行政書士事務所與四葉社會保險勞務士事務所皆可承接",
  s4P2b: "。契約依事務所分別簽訂，若您已與其中一方有往來，可配合該事務所。",
  s4LinkPre: "外部監查人的",
  s4LinkStrong: "要件",
  s4LinkMid: "（講習修了、獨立性、欠格事由、同意公布姓名）與委託對象的選法，在以下頁面整理。 → ",
  s4Link: "育成就勞的外部監查人（四葉行政書士事務所）",
  s4Note: "※四葉行政書士事務所・四葉社會保險勞務士事務所為各自獨立的事業體，分別承接委託（不收取、也不支付介紹費）。",
  s5H2: "若顧問客戶的公司是受入企業，會如何？",
  s5P1a: "",
  s5Strong1: "該監理支援機關的外部監查人，不承接。",
  s5P1b: "外部監查人須獨立於監理支援機關及其關係單位。本事務所不止於確認要件，",
  s5Strong2: "並以方針做出如下切分",
  s5Items: [
    "與本事務所擔任外部監查人之監理支援機關的關係單位（旗下受入企業），不簽訂勞務顧問契約",
    "既有顧問客戶所加入之監理支援機關的外部監查人，不承接",
    "此切分於行政書士事務所・社會保險勞務士事務所任一方承接時均適用",
  ],
  s5Item3Strong: "此切分於行政書士事務所・社會保險勞務士事務所任一方承接時均適用",
  s5P2: "因為從外部確認的立場，與在內部提供諮詢的立場，不應由同一人兼任。即使事務所分開，仍是同一個人，處理方式不變。諮詢時請先讓我們確認有無此類關係。",
  s6H2: "費用是多少？",
  s6Strong: "個別報價",
  s6Body: "。因事業所數量、是否同行實地確認，作業量會不同。聯絡時請告知事業所數與受入規模。",
  s6Link: "報酬額表",
  s7H2: "本頁的依據",
  s7Items: [
    "外國人育成就勞的適正實施及育成就勞外國人保護相關法律（平成28年法律第89號）第25條第1項第5號／施行日 令和9年4月1日／最終修正 令和6年法律第60號。本法並非2024年新制定，而是令和6年法律第60號修正技能實習法並改題而成",
    "同法施行規則（令和7年法務省・厚生勞動省令第4號・公布 令和7年9月30日）第47條／施行日 令和9年4月1日／最終修正 令和8年法務省・厚生勞動省令第3號。第2項第2號明文列舉律師・社會保險勞務士・行政書士",
    "外部監查的方法・查核對象文件＝出入國在留管理廳「育成就勞制度運用要領」第5章（令和8年8月5日更新版・2026年8月6日確認）",
    "勞動時間・薪資・安全衛生的依據＝勞動基準法（昭和22年法律第49號）、勞動安全衛生法（昭和47年法律第57號）、最低薪資法（昭和34年法律第137號）",
  ],
  s7Note1a: "※法令條號引用自四葉行政書士事務所頁面於2026年8月6日經一次資料確認的內容。",
  s7Note1Strong: "查核對象文件的具體範圍、監查頻率、施行日前許可申請的受理開始時期，本頁製作時點均未確定（未驗證）。",
  s7Note2: "本頁為一般性資訊。個別案件將經有資格者確認後為您說明。",
};

const ZH: Copy = {
  metaTitle: "外部监查会查核的劳务｜四葉社会保険労務士事務所",
  metaDescription:
    "育成就劳的外部监查，确认劳动时间・工资・安全卫生・住居环境等劳动法令的遵守状况。监理支援机关与接收企业应备妥什么，从社会保险劳务士的立场整理。也承接外部监查人的就任。东京都文京区小日向・茗荷谷站步行5分钟。",
  crumbLabel: "外部监查会查核的劳务",
  serviceName: "应对育成就劳外部监查的劳务整备・外部监查人受托",
  heroAlt: "外部监查会查核的劳务（工资台账与考勤记录的确认）",
  h1: "外部监查会查核的劳务",
  leadParts: [
    "育成就劳的外部监查确认的是",
    "劳动法令是否被遵守",
    "。劳动时间・工资・安全卫生・住居环境等",
    "劳务本身",
    "是查核对象。监理支援机关与接收企业应备妥什么，从社会保险劳务士的立场整理如下。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "外部监查人的费用" },
    { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介护・育成就劳）的劳务" },
    { href: "/labor/nagare", label: "从咨询到签约的流程" },
  ],
  crossLinkLead: "外部监查人的要件与委托对象，在四葉行政書士事務所的页面整理。",
  s1H2: "外部监查，会查核什么？",
  s1Lead1: "外部监查人确认的，是监理支援机关的",
  s1Strong: "监理・监查业务是否适正执行",
  s1Lead2: "。而该监理・监查所面对的，正是接收企业的劳动法令遵守状况。因此，实际被检视的是以下这些劳务。",
  s1Items: [
    { strong: "劳动时间", rest: "——记录方法、加班・假日劳动的上限、36协定内容与实态的一致" },
    { strong: "工资", rest: "——最低工资、加班费的计算、扣除的依据、工资台账的记载" },
    { strong: "安全卫生", rest: "——健康检查、教育培训、作业环境" },
    { strong: "住居环境", rest: "——宿舍状况、费用征收额与实际费用的关系" },
    { strong: "接收条件", rest: "——雇用合同内容是否与日本人同等以上" },
  ],
  s1Note: "※查核对象文件的范围，载于出入国在留管理厅「育成就劳制度运用要领」第5章。制度尚未施行，部分下位告示与运用细节仍待公布（未验证）。",
  s2H2: "若要准备，从哪里着手？",
  s2Lead1: "监查现场的困境，",
  s2Strong: "与其说是不了解制度，不如说是没有留下记录",
  s2Lead2: "。顺序如下。",
  t1Head: ["顺", "要做的事", "为何优先"],
  t1Rows: [
    ["1", "统一考勤记录的方法", "工资计算与36协定的管理，都以此为基础"],
    ["2", "将工资台账与雇用合同内容比对", "扣除的依据若未写进合同，便无法说明"],
    ["3", "使就业规则与实态一致", "规则里没有的做法，监查时必定被问理由"],
    ["4", "整理宿舍费用与实际费用的关系", "住居环境在育成就劳中被重点检视"],
  ],
  s3H2: "语言不通的部分，怎么办？",
  s3Body1: "监查会对育成就劳外国人本人进行访谈。经过口译，劳动时间与工资的说明可能无法准确传达。本事务所代表曾任每日新闻中国总局长，",
  s3Strong: "对应中文（繁体字・简体字）与英语",
  s3Body2: "，可不经外部口译直接确认。",
  s4H2: "外部监查人，可以委托行政书士还是社会保险劳务士？",
  s4P1a: "施行规则列举可担任外部监查人者为",
  s4Strong1: "律师・社会保险劳务士・行政书士",
  s4P1b: "（及各自的法人），以及具备育成就劳相关知识经验者。",
  s4P2a: "在四葉，",
  s4Strong2: "四葉行政書士事務所与四葉社会保険労務士事務所均可承接",
  s4P2b: "。合同按事务所分别签订，若您已与其中一方有往来，可配合该事务所。",
  s4LinkPre: "外部监查人的",
  s4LinkStrong: "要件",
  s4LinkMid: "（讲习修了、独立性、欠格事由、同意公布姓名）与委托对象的选法，在以下页面整理。 → ",
  s4Link: "育成就劳的外部监查人（四葉行政書士事務所）",
  s4Note: "※四葉行政書士事務所・四葉社会保険労務士事務所为各自独立的事业体，分别承接委托（不收取、也不支付介绍费）。",
  s5H2: "若顾问客户的公司是接收企业，会如何？",
  s5P1a: "",
  s5Strong1: "该监理支援机关的外部监查人，不承接。",
  s5P1b: "外部监查人须独立于监理支援机关及其关系单位。本事务所不止于确认要件，",
  s5Strong2: "并以方针做出如下切分",
  s5Items: [
    "与本事务所担任外部监查人之监理支援机关的关系单位（旗下接收企业），不签订劳务顾问合同",
    "既有顾问客户所加入之监理支援机关的外部监查人，不承接",
    "此切分于行政书士事务所・社会保险劳务士事务所任一方承接时均适用",
  ],
  s5Item3Strong: "此切分于行政书士事务所・社会保险劳务士事务所任一方承接时均适用",
  s5P2: "因为从外部确认的立场，与在内部提供咨询的立场，不应由同一人兼任。即使事务所分开，仍是同一个人，处理方式不变。咨询时请先让我们确认有无此类关系。",
  s6H2: "费用是多少？",
  s6Strong: "个别报价",
  s6Body: "。因事业所数量、是否同行实地确认，作业量会不同。联系时请告知事业所数与接收规模。",
  s6Link: "报酬额表",
  s7H2: "本页的依据",
  s7Items: [
    "外国人育成就劳的适正实施及育成就劳外国人保护相关法律（平成28年法律第89号）第25条第1项第5号／施行日 令和9年4月1日／最终修订 令和6年法律第60号。本法并非2024年新制定，而是令和6年法律第60号修订技能实习法并改题而成",
    "同法施行规则（令和7年法务省・厚生劳动省令第4号・公布 令和7年9月30日）第47条／施行日 令和9年4月1日／最终修订 令和8年法务省・厚生劳动省令第3号。第2项第2号明文列举律师・社会保险劳务士・行政书士",
    "外部监查的方法・查核对象文件＝出入国在留管理厅「育成就劳制度运用要领」第5章（令和8年8月5日更新版・2026年8月6日确认）",
    "劳动时间・工资・安全卫生的依据＝劳动基准法（昭和22年法律第49号）、劳动安全卫生法（昭和47年法律第57号）、最低工资法（昭和34年法律第137号）",
  ],
  s7Note1a: "※法令条号引用自四葉行政書士事務所页面于2026年8月6日经一次资料确认的内容。",
  s7Note1Strong: "查核对象文件的具体范围、监查频率、施行日前许可申请的受理开始时期，本页制作时点均未确定（未验证）。",
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
    path: "/labor/services/gaibu-kansanin",
    keywords: ["育成就労 外部監査 何を見られる", "監理支援機関 労務 備え", "外部監査 賃金台帳"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return (
    <LaborServicePage
      slug="gaibu-kansanin"
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
        </p>
      }
      internalLinks={c.internalLinks}
      crossLinkLead={c.crossLinkLead}
    >
      <div>
        <LaborH2>{c.s1H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s1Lead1}
          <strong>{c.s1Strong}</strong>
          {c.s1Lead2}
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-text">
          {c.s1Items.map((it) => (
            <li key={it.strong}>
              <strong>{it.strong}</strong>
              {it.rest}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">{c.s1Note}</p>
      </div>

      <div>
        <LaborH2>{c.s2H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s2Lead1}
          <strong>{c.s2Strong}</strong>
          {c.s2Lead2}
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
                <tr key={r[0]}>
                  <th className="border border-border px-3 py-2 text-left font-medium text-ink">{r[0]}</th>
                  <td className="border border-border px-3 py-2 text-text">{r[1]}</td>
                  <td className="border border-border px-3 py-2 text-text">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <LaborH2>{c.s3H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s3Body1}
          <strong>{c.s3Strong}</strong>
          {c.s3Body2}
        </p>
      </div>

      <div>
        <LaborH2>{c.s4H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s4P1a}
          <strong>{c.s4Strong1}</strong>
          {c.s4P1b}
        </p>
        <p className="mt-3 leading-relaxed text-text">
          {c.s4P2a}
          <strong>{c.s4Strong2}</strong>
          {c.s4P2b}
        </p>
        <p className="mt-2 text-sm">
          {c.s4LinkPre}
          <strong>{c.s4LinkStrong}</strong>
          {c.s4LinkMid}
          <Link href={addLocalePrefix("/legal/services/ikuseishuro-gaibu-kansa", locale)} className="text-primary underline">
            {c.s4Link}
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
          <strong>{c.s5Strong2}</strong>。
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>{c.s5Items[0]}</li>
          <li>{c.s5Items[1]}</li>
          <li>
            <strong>{c.s5Item3Strong}</strong>
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">{c.s5P2}</p>
      </div>

      <div>
        <LaborH2>{c.s6H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>{c.s6Strong}</strong>
          {c.s6Body}
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            {c.s6Link}
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
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          {c.s7Note1a}
          <strong>{c.s7Note1Strong}</strong>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.s7Note2}</p>
      </div>
    </LaborServicePage>
  );
}
