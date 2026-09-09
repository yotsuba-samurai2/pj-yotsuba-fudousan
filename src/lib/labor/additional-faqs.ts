import type { LangCode } from "@/config/languages";
import type { FaqItem } from "@/components/shared/Faq";
import { LABOR_ANCILLARY_FEES } from "./ancillary-fees";

type AdditionalCopy = { consultation: string; consultationAnswer: string; rules: string; rulesAnswer: string; benefits: string; benefitsAnswer: string; assistance: string; assistanceAnswer: string; register: string; registerAnswer: string; disputes: string; disputesAnswer: string; audit: string; auditAnswer: string; pension: string; pensionAnswer: string; area: string; areaAnswer: string };
const COPY: Record<LangCode, AdditionalCopy> = {
  ja: {
    consultation:"相談料はかかりますか？",consultationAnswer:"初めてのご相談は60分まで無料です。顧問契約に至らない場合の2回目以降は、料金表の相談料を申し受けます。契約後の日常的な労務相談は月額に含まれます。",
    rules:"法改正のたびに、規程の直しに費用がかかりますか？",rulesAnswer:"当事務所が作成した規程については、法改正に伴う該当条文の改定と届出を顧問料に含めて承ります。回数の制限はありません。会社の都合による改定は「就業規則 変更」の料金を申し受けます。",
    benefits:"処遇改善加算は、社会保険労務士と行政書士のどちらに頼むのですか？",benefitsAnswer:"就業規則・賃金規程・キャリアパス要件などの賃金制度設計と賃金改善額の算定は当事務所へ。指定権者に提出する計画書・実績報告等の書類作成は四葉行政書士事務所へご案内します。それぞれ別契約・別請求で、紹介料の授受はありません。",
    assistance:"助成金と補助金はどちらに頼めばいい？",assistanceAnswer:"雇用関係の助成金は当事務所（社会保険労務士）、事業の補助金は四葉行政書士事務所（行政書士・別事業体）です。ご事情を伺い、適切な資格者をご案内します。",
    register:"会社の登記も直してもらえますか？",registerAnswer:"法人登記の変更は当事務所では取り扱わず、司法書士へご案内します。事業所の所在地・名称・代表者が変わった場合の労働社会保険の届出は、当事務所で承ります。",
    disputes:"離職理由でもめています。対応してもらえますか？",disputesAnswer:"離職票の作成と提出代行は承ります。ただし離職理由をめぐる争いなど、紛争性が生じた事案は弁護士へご案内します。",
    audit:"育成就労の外部監査人も引き受けてもらえますか？",auditAnswer:"ご相談いただけます。独立性の確保のため、外部監査人をお引き受けした監理支援機関の関係先とは労務顧問契約を結びません。既存顧問先が加入する機関の外部監査人もお引き受けしません。行政書士事務所で受ける場合も同じ扱いです。許可申請書類は行政書士事務所へ別途ご案内します。",
    pension:"障害年金の相談に顧問契約は必要ですか？",pensionAnswer:"必要ありません。ご本人・ご家族から直接お受けします。料金と実費は料金表でご案内しています。",
    area:"文京区以外も対応していますか？",areaAnswer:"文京区・茗荷谷を中心に対応します。エリア外については個別にご相談ください。",
  },
  en: {
    consultation:"Is there a consultation fee?",consultationAnswer:"The first consultation is free for up to 60 minutes. If no advisory contract follows, subsequent consultations are charged at the rate on our fee page. Routine labor consultations after contracting are included in the monthly fee.",
    rules:"Do legal changes require additional fees to update work rules?",rulesAnswer:"For rules prepared by our office, updates and filings for affected clauses following legal changes are included in the advisory fee, without a limit on frequency. Changes requested for the company's own reasons are charged at the work-rule amendment rate.",
    benefits:"Who handles the treatment-improvement addition: a labor consultant or an administrative scrivener?",benefitsAnswer:"Our labor office handles wage-system design, work rules, career-path requirements and wage-improvement calculations. Documents submitted to the designated authority, including plans and performance reports, are referred to 四葉行政書士事務所. Contracts and invoices are separate, with no referral fees.",
    assistance:"Who handles employment subsidies and business grants?",assistanceAnswer:"Our labor office handles employment-related subsidies. Business grants are referred to 四葉行政書士事務所, a separate administrative scrivener practice. We review your situation and guide you to the appropriate professional.",
    register:"Can you change company registrations?",registerAnswer:"Corporate registration changes are referred to a judicial scrivener. Our office can handle labor and social insurance notifications when a workplace's address, name or representative changes.",
    disputes:"Can you help with a dispute about the reason for leaving a job?",disputesAnswer:"We can prepare and submit separation documents. Matters that develop into a dispute are referred to a lawyer.",
    audit:"Can you serve as an external auditor for Employment for Skill Development?",auditAnswer:"Please consult us. To preserve independence, we do not enter labor advisory contracts with parties associated with an organization for which we serve as external auditor, or audit an organization joined by an existing advisory client. The same policy applies to the administrative scrivener office. Licensing documents are referred separately to that office.",
    pension:"Do disability pension consultations require an advisory contract?",pensionAnswer:"No. Individuals and families can engage us directly. Fees and expenses are listed on our fee page.",
    area:"Do you work outside Bunkyo City?",areaAnswer:"Our main service area is Bunkyo City and Myogadani. Please consult us individually about other areas.",
  },
  "zh-tw": {
    consultation:"諮詢需要付費嗎？",consultationAnswer:"首次諮詢60分鐘內免費。若未簽訂顧問契約，第2次起按費用表收取諮詢費。簽約後的一般勞務諮詢包含於月費。",
    rules:"法令修訂時，修改規程要另外收費嗎？",rulesAnswer:"本事務所製作的規程，因法令修訂所需的相關條文修訂及申報包含於顧問費，不限次數。因公司自身需要而修改，按就業規則變更費用收費。",
    benefits:"處遇改善加算應找社會保險勞務士還是行政書士？",benefitsAnswer:"就業規則、薪資規程、職涯發展要件等薪資制度設計及改善額計算，由本事務所負責。向指定機關提交的計畫書、實績報告等，轉介四葉行政書士事務所。分別簽約、請款，不收取或支付介紹費。",
    assistance:"助成金與補助金分別找誰？",assistanceAnswer:"雇用相關助成金由本事務所的社會保險勞務士承辦，事業補助金由另一事業體四葉行政書士事務所承辦。了解情況後提供適當專業人士的指引。",
    register:"可以協助變更公司登記嗎？",registerAnswer:"法人登記變更轉介司法書士。事業所地址、名稱或代表變更時的勞動社會保險申報，由本事務所承辦。",
    disputes:"對離職原因有爭議，可以協助嗎？",disputesAnswer:"可辦理離職票製作及提交。有離職原因等爭議時，轉介律師。",
    audit:"可以擔任育成就勞的外部監查人嗎？",auditAnswer:"歡迎諮詢。為確保獨立性，不與本事務所擔任外部監查人之機關的關係單位簽訂勞務顧問契約，也不擔任既有顧問客戶所加入機關的外部監查人。行政書士事務所受任時亦同。許可申請文件另行轉介行政書士事務所。",
    pension:"障害年金諮詢需要顧問契約嗎？",pensionAnswer:"不需要。本人或家屬可直接委託。費用及實費請見費用表。",
    area:"文京區以外也能委託嗎？",areaAnswer:"以文京區、茗荷谷為主要服務地區。其他地區請個別諮詢。",
  },
  zh: {
    consultation:"咨询需要付费吗？",consultationAnswer:"首次咨询60分钟内免费。若未签订顾问合同，第2次起按费用表收取咨询费。签约后的一般劳务咨询包含于月费。",
    rules:"法令修订时，修改规程要另外收费吗？",rulesAnswer:"本事务所制作的规程，因法令修订所需的相关条文修订及申报包含于顾问费，不限次数。因公司自身需要而修改，按就业规则变更费用收费。",
    benefits:"处遇改善加算应找社会保险劳务士还是行政书士？",benefitsAnswer:"就业规则、工资规程、职业发展要件等工资制度设计及改善额计算，由本事务所负责。向指定机关提交的计划书、实绩报告等，转介四葉行政書士事務所。分别签约、请款，不收取或支付介绍费。",
    assistance:"助成金与补助金分别找谁？",assistanceAnswer:"雇用相关助成金由本事务所的社会保险劳务士承办，事业补助金由另一事业体四葉行政書士事務所承办。了解情况后提供适当专业人士的指引。",
    register:"可以协助变更公司登记吗？",registerAnswer:"法人登记变更转介司法书士。事业所地址、名称或代表变更时的劳动社会保险申报，由本事务所承办。",
    disputes:"对离职原因有争议，可以协助吗？",disputesAnswer:"可办理离职票制作及提交。有离职原因等争议时，转介律师。",
    audit:"可以担任育成就劳的外部监查人吗？",auditAnswer:"欢迎咨询。为确保独立性，不与本事务所担任外部监查人之机关的关系单位签订劳务顾问合同，也不担任既有顾问客户所加入机关的外部监查人。行政书士事务所受任时亦同。许可申请文件另行转介行政书士事务所。",
    pension:"障害年金咨询需要顾问合同吗？",pensionAnswer:"不需要。本人或家属可直接委托。费用及实费请见费用表。",
    area:"文京区以外也能委托吗？",areaAnswer:"以文京区、茗荷谷为主要服务地区。其他地区请个别咨询。",
  },
};
export function getAdditionalLaborFaqs(locale: LangCode): FaqItem[] {
  const c = COPY[locale];
  const fees = LABOR_ANCILLARY_FEES[locale].sections;
  const consultationRows = fees[0].rows.map(r => `${r.name}: ${r.price} (${r.unit})`).join(" / ");
  const pensionRows = fees[fees.length-1].rows.map(r => `${r.name}: ${r.price}`).join(" / ");
  return [
    {q:c.consultation,a:c.consultationAnswer+" "+consultationRows},
    {q:c.rules,a:c.rulesAnswer},{q:c.benefits,a:c.benefitsAnswer},{q:c.assistance,a:c.assistanceAnswer},
    {q:c.register,a:c.registerAnswer},{q:c.disputes,a:c.disputesAnswer},{q:c.audit,a:c.auditAnswer},
    {q:c.pension,a:c.pensionAnswer+" "+pensionRows},{q:c.area,a:c.areaAnswer},
  ];
}
