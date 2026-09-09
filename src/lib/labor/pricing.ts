import type { LangCode } from "@/config/languages";

/** V10 fee source. All amounts are JPY including tax; setup is separate. */
export const LABOR_PRICING = {
  currency: "JPY",
  taxIncluded: true,
  bands: [
    { min: 1, max: 3, monthly: 33000 },
    { min: 4, max: 5, monthly: 44000 },
    { min: 6, max: 10, monthly: 55000 },
  ],
  additionalRecipientFee: 2200,
  individualQuoteFrom: 31,
  initialSetupFrom: 88000,
  recruitmentSupportFrom: 22000,
} as const;

/** null means individual quotation, never a zero-yen or estimated public fee. */
export function getLaborMonthlyFee(payrollRecipients: number): number | null {
  if (!Number.isSafeInteger(payrollRecipients) || payrollRecipients < 1) {
    throw new RangeError("Payroll recipient count must be a positive safe integer.");
  }
  if (payrollRecipients >= LABOR_PRICING.individualQuoteFrom) return null;
  const band = LABOR_PRICING.bands.find(({ max }) => payrollRecipients <= max);
  if (band) return band.monthly;
  const lastBand = LABOR_PRICING.bands[LABOR_PRICING.bands.length - 1];
  return lastBand.monthly + (payrollRecipients - lastBand.max) * LABOR_PRICING.additionalRecipientFee;
}

export function formatLaborYen(amount: number, locale: LangCode): string {
  const value = amount.toLocaleString("en-US");
  return locale === "en" ? `¥${value}` : `${value}${locale === "ja" ? "円" : locale === "zh-tw" ? "日圓" : "日元"}`;
}
