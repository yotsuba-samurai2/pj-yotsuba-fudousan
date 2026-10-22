import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONTACT_RECEIPT_COPY, createContactSubmission, isContactReceipt, readContactReceipt, rememberContactReceipt } from "@/lib/shared/contact-submission";

const body = { name: "PRIVATE", email: "private@example.invalid", message: "PRIVATE-MESSAGE", business: "realestate" };
const receiptNo = "Y261023-7K3F";
const fetcher = vi.fn();
let storage: Map<string, string>;
beforeEach(() => {
  fetcher.mockReset().mockResolvedValue(new Response(JSON.stringify({ ok: true, receiptNo })));
  vi.stubGlobal("fetch", fetcher);
  storage = new Map();
  vi.stubGlobal("sessionStorage", { setItem: (k: string, v: string) => storage.set(k, v), getItem: (k: string) => storage.get(k) ?? null });
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); });
const sent = (index: number) => JSON.parse(fetcher.mock.calls[index][1].body);

describe("client retries and saved receipt validation", () => {
  it("keeps the same key after a lost response and duplicate submit; changes it for new content", async () => {
    fetcher.mockRejectedValueOnce(new Error("connection lost"));
    const submit = createContactSubmission();
    await expect(submit(body)).rejects.toThrow();
    await submit(body); await submit(body); await submit({ ...body, message: "new" });
    expect(sent(0).idempotencyKey).toBe(sent(1).idempotencyKey);
    expect(sent(1).idempotencyKey).toBe(sent(2).idempotencyKey);
    expect(sent(2).idempotencyKey).not.toBe(sent(3).idempotencyKey);
    expect(storage.size).toBe(0);
  });
  it("uses independent keys for independent forms", async () => {
    await createContactSubmission()(body); await createContactSubmission()(body);
    expect(sent(0).idempotencyKey).not.toBe(sent(1).idempotencyKey);
  });
  it.each([null, {}, { ok: true }, { ok: false, receiptNo }, { ok: true, receiptNo: body.message }])("rejects an unconfirmed success response %j", value => {
    expect(isContactReceipt(value)).toBe(false);
  });
  it("accepts only the receipt-shaped successful response", () => expect(isContactReceipt({ ok: true, receiptNo })).toBe(true));
  it("transfers only an opaque receipt to the matching business for ten minutes", () => {
    vi.useFakeTimers();
    rememberContactReceipt(receiptNo, "realestate");
    expect(readContactReceipt("realestate")).toBe(receiptNo);
    expect(readContactReceipt("legal")).toBeNull();
    const data = JSON.parse([...storage.values()][0]);
    expect(Object.keys(data).sort()).toEqual(["at", "business", "receiptNo"]);
    expect(JSON.stringify(data)).not.toContain("PRIVATE");
    vi.advanceTimersByTime(10 * 60_000);
    expect(readContactReceipt("realestate")).toBeNull();
  });
  it("does not break acceptance when browser storage is unavailable", () => {
    vi.stubGlobal("sessionStorage", { setItem: () => { throw new Error(); }, getItem: () => { throw new Error(); } });
    expect(() => rememberContactReceipt(receiptNo, "realestate")).not.toThrow();
    expect(readContactReceipt("realestate")).toBeNull();
  });
  it("provides a receipt label and retention notice in all four locales", () => {
    expect(Object.keys(CONTACT_RECEIPT_COPY).sort()).toEqual(["en", "ja", "zh", "zh-tw"]);
    for (const copy of Object.values(CONTACT_RECEIPT_COPY)) { expect(copy.label).toBeTruthy(); expect(copy.notice).toBeTruthy(); }
  });
});
