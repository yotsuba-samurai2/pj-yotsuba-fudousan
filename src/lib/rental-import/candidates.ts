/** Mail content is untrusted data. Extract evidence; never execute links/instructions. */
export type MailInput = { id: string; receivedAt: string; subject: string; text: string; senderDomain?: string };
export type AdEvidence = { months: number | null; quote: string; ambiguous: boolean };

export function normalizeText(text: string): string {
  return text.normalize("NFKC").replace(/[\u200b-\u200d\ufeff]/g, "");
}

export function extractAdEvidence(text: string): AdEvidence[] {
  const s = normalizeText(text);
  const pattern = /(?:\bAD|広告(?:料|費)|業務委託料)\s*[:：=はが]?\s*(?:賃料(?:の)?\s*)?(\d+(?:\.\d+)?)\s*(か月|ヶ月|ケ月|カ月|箇月|月分?|%|パーセント)?/gi;
  return [...s.matchAll(pattern)].map((m) => {
    const unit = m[2];
    const months = !unit ? null : /%|パーセント/.test(unit) ? Number(m[1]) / 100 : Number(m[1]);
    const context = s.slice(Math.max(0, m.index! - 18), m.index! + m[0].length + 35);
    const ambiguous = !unit || /最大|上限|まで|以上|以下|[〜～~]|条件|限定|場合|増額|追加|プラス|アップ|\+|終了|変更|撤回|減額/.test(context);
    return { months, quote: m[0], ambiguous };
  });
}

/** 直接検索の掲載条件：仲介手数料（賃料×1.1）＋ADの合計がこの額以上。 */
export const INCOME_THRESHOLD_YEN = 800_000;
export type AdYenEvidence = { yen: number | null; quote: string; ambiguous: boolean };

/** 月数・%・万円・円のAD表記を円に換算する（万円表記は賃料で割らずそのまま採用）。 */
export function extractAdYen(text: string, rentYen: number): AdYenEvidence[] {
  const s = normalizeText(text).replace(/,/g, "");
  const pattern = /(?:\bAD|広告(?:料|費)|業務委託料)\s*[:：=はが]?\s*(?:賃料(?:の)?\s*)?(\d+(?:\.\d+)?)\s*(か月|ヶ月|ケ月|カ月|箇月|月分?|%|パーセント|万円|円)?/gi;
  return [...s.matchAll(pattern)].map((m) => {
    const n = Number(m[1]), unit = m[2];
    const yen = !unit ? null : unit === "万円" ? n * 10000 : unit === "円" ? n : /%|パーセント/.test(unit) ? (n / 100) * rentYen : n * rentYen;
    const context = s.slice(Math.max(0, m.index! - 18), m.index! + m[0].length + 35);
    const ambiguous = !unit || /最大|上限|まで|迄|以上|以下|[〜～~]|条件|限定|場合|増額|追加|プラス|アップ|\+|終了|変更|撤回|減額|相談/.test(context);
    return { yen: yen === null ? null : Math.round(yen), quote: m[0], ambiguous };
  });
}

/** 仲介手数料（賃料×1.1）＋AD。ADが確定できなければ null。「ADなし」は0円として扱う。 */
export function brokerIncomeYen(quote: string, rentYen: number): number | null {
  const s = normalizeText(quote);
  const fee = Math.round(rentYen * 1.1);
  const ads = extractAdYen(s, rentYen);
  if (!ads.length) return /(?:\bAD|広告(?:料|費))\s*[:：]?\s*(?:なし|無し?)/i.test(s) ? fee : null;
  const values = [...new Set(ads.map((a) => a.yen))];
  if (ads.some((a) => a.ambiguous || a.yen === null) || values.length !== 1) return null;
  return fee + values[0]!;
}

/** One calendar month, same JST time; clamp end-of-month (March 31 -> February 28). */
export function monthWindowStart(now: Date): Date {
  const jst = new Date(now.getTime() + 9 * 3600_000);
  const year = jst.getUTCFullYear(), month = jst.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return new Date(Date.UTC(year, month - 1, Math.min(jst.getUTCDate(), lastDay), jst.getUTCHours(), jst.getUTCMinutes(), jst.getUTCSeconds(), jst.getUTCMilliseconds()) - 9 * 3600_000);
}

export function isRecentMail(receivedAt: string, now: Date): boolean {
  const t = Date.parse(receivedAt);
  return Number.isFinite(t) && t >= monthWindowStart(now).getTime() && t <= now.getTime();
}

export function selectMailCandidates(mails: MailInput[], now: Date) {
  return [...new Map(mails.map((m) => [m.id, m])).values()].filter((m) => isRecentMail(m.receivedAt, now)).map((m) => {
    const evidence = extractAdEvidence(`${m.subject}\n${m.text}`);
    const amounts = [...new Set(evidence.map((e) => e.months).filter((v): v is number => v !== null))];
    const needsReview = evidence.some((e) => e.ambiguous) || amounts.length !== 1;
    return { messageId: m.id, receivedAt: m.receivedAt, subject: m.subject, senderDomain: m.senderDomain, evidence,
      decision: evidence.some((e) => e.months !== null && e.months >= 2)
        ? needsReview ? "review" as const : "candidate" as const
        : evidence.some((e) => e.months === null) ? "review" as const : "excluded" as const };
  });
}
