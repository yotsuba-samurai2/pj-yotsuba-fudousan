/** Per-form, memory-only key. Do not persist contact contents or keys in browser storage/analytics. */
export function createContactSubmission() {
  let previous = "";
  let key = "";
  return async (fields: Record<string, unknown>): Promise<Response> => {
    const content = JSON.stringify(fields);
    if (content !== previous || !key) {
      key = crypto.randomUUID();
      previous = content;
    }
    return fetch("/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, idempotencyKey: key }),
    });
  };
}

export const CONTACT_RECEIPT_PATTERN = /^Y\d{6}-[2-9A-HJ-NP-Z]{4}$/;
export function isContactReceipt(value: unknown): value is { ok: true; receiptNo: string } {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  return result.ok === true && typeof result.receiptNo === "string" && CONTACT_RECEIPT_PATTERN.test(result.receiptNo);
}

const RECEIPT_KEY = "yotsuba:contact-receipt:v1";
/** Only an opaque receipt, business, and time; never fields. No query string/analytics transfer. */
export function rememberContactReceipt(receiptNo: string, business: string) {
  if (!CONTACT_RECEIPT_PATTERN.test(receiptNo)) return;
  try { sessionStorage.setItem(RECEIPT_KEY, JSON.stringify({ receiptNo, business, at: Date.now() })); }
  catch { /* Storage may be disabled; the saved inquiry is unaffected. */ }
}
export function readContactReceipt(business: string): string | null {
  try {
    const data = JSON.parse(sessionStorage.getItem(RECEIPT_KEY) ?? "null");
    if (data && data.business === business && typeof data.receiptNo === "string" && CONTACT_RECEIPT_PATTERN.test(data.receiptNo)
      && typeof data.at === "number" && Date.now() - data.at >= 0 && Date.now() - data.at < 10 * 60_000) return data.receiptNo;
  } catch { /* No receipt is shown for malformed or unavailable storage. */ }
  return null;
}

export const CONTACT_RECEIPT_COPY = {
  ja: { label: "受付番号", notice: "入力内容はご相談への対応のために保存し、受付から1年で削除します。" },
  en: { label: "Reference number", notice: "We store your inquiry to respond to it and delete it one year after receipt." },
  "zh-tw": { label: "受理編號", notice: "您填寫的資料僅用於回覆諮詢，將於受理一年後刪除。" },
  zh: { label: "受理编号", notice: "您填写的资料仅用于回复咨询，将于受理一年后删除。" },
};
