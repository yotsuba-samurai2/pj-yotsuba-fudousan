import type { LangCode } from "@/config/languages";

export type OfficeInfoRow = { label: string; value: string };

/** Approved standalone scope, shared by the office-info patch and live rendering. */
export const LABOR_OFFICE_ENGAGEMENT: Record<LangCode, OfficeInfoRow> = {
  ja: {
    label: "受任の前提",
    value: "入退社などの手続きや給与計算は、顧問契約なしでもご依頼いただけます。必要な業務と費用を確認し、着手前にお見積もりします。継続的な労務相談を含む顧問契約もお選びいただけます。障害年金（個人のお客さま）と外部監査人（監理支援機関のお客さま）も、顧問契約を前提としません。",
  },
  en: {
    label: "Terms of engagement",
    value: "Employee joining and leaving procedures and payroll-only work are available without an advisory retainer. We confirm the work required and provide a quote before starting. You can also choose an advisory contract that includes ongoing labour advice. Disability pension claims (for individuals) and external auditor appointments (for supervising support organisations) do not require a retainer agreement either.",
  },
  "zh-tw": {
    label: "受任前提",
    value: "入離職等手續或薪資計算可單獨委託，無須簽訂顧問契約。確認所需業務與費用後，在開始作業前提供報價。亦可選擇包含持續勞務諮詢的顧問契約。障礙年金（個人客戶）與外部稽核人員（監理支援機關的客戶）也不以顧問契約為前提。",
  },
  zh: {
    label: "受任前提",
    value: "入离职等手续或工资计算可单独委托，无需签订顾问合同。确认所需业务与费用后，在开始作业前提供报价。亦可选择包含持续劳务咨询的顾问合同。残障年金（个人客户）与外部审计人员（监理支援机构的客户）也不以顾问合同为前提。",
  },
};

const ENGAGEMENT_LABELS = new Set(Object.values(LABOR_OFFICE_ENGAGEMENT).map(row => row.label));

/** Align only the policy row, without replacing DB-managed contact/office information. */
export function withLaborOfficeEngagement(locale: LangCode, rows: OfficeInfoRow[]): OfficeInfoRow[] {
  const current = LABOR_OFFICE_ENGAGEMENT[locale];
  let found = false;
  const aligned = rows.map(row => {
    // Also recognise Japanese fallback rows in a non-Japanese dictionary.
    if (!ENGAGEMENT_LABELS.has(row.label)) return row;
    found = true;
    return { ...current };
  });
  return found ? aligned : [...aligned, { ...current }];
}
