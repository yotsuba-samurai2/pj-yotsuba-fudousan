import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const h = vi.hoisted(() => ({ send: vi.fn(), create: vi.fn(), find: vi.fn(), mark: vi.fn(), purge: vi.fn(), rate: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send: h.send }; } }));
vi.mock("@/lib/inquiries/store", () => ({ createInquiry: h.create, markNotification: h.mark, purgeExpiredInquiries: h.purge }));
vi.mock("@/lib/inquiries/contact-store", () => ({ findContactReceipt: h.find }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: h.rate }));
import { POST } from "@/app/api/contact/route";

const key = "8f0e7a2c-1b2d-4c3e-9f4a-5b6c7d8e9f01";
const sample = { name: "PRIVATE-NAME", email: "private@example.invalid", phone: "", category: "other", source: "ai", message: "PRIVATE-MESSAGE", business: "realestate", idempotencyKey: key, locale: "en", sourcePath: "/en/contact?email=secret#private" };
const request = (body: unknown = sample) => new NextRequest("http://localhost/api/contact", { method: "POST", body: JSON.stringify(body) });
let rows: Map<string, { digest: string; receiptNo: string }>;
beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  rows = new Map();
  h.find.mockImplementation(async key => rows.get(key) ?? null);
  h.create.mockImplementation(async data => {
    const duplicate = rows.has(data.idempotencyKey);
    if (!duplicate) rows.set(data.idempotencyKey, { digest: data.payload._contactDigest, receiptNo: "Y261023-7K3F" });
    return { inquiry: { id: "INTERNAL-ID", receiptNo: "Y261023-7K3F" }, duplicate };
  });
  h.rate.mockReturnValue({ success: true });
  h.send.mockResolvedValue({ data: { id: "MAIL-ID" }, error: null });
  h.mark.mockResolvedValue(undefined); h.purge.mockResolvedValue(0);
});
afterEach(() => vi.restoreAllMocks());

describe("durable contact receipts", () => {
  it("saves before sending; returns only the saved receipt, and strips URL query/hash and unapproved fields", async () => {
    const response = await POST(request({ ...sample, consentShare: "granted", secretExtra: "excluded" }));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.json()).toEqual({ ok: true, receiptNo: "Y261023-7K3F" });
    expect(h.create.mock.invocationCallOrder[0]).toBeLessThan(h.send.mock.invocationCallOrder[0]);
    expect(h.create.mock.calls[0][0]).toMatchObject({ idempotencyKey: `contact/v1/${key}`, business: "realestate", category: "contact-realestate", locale: "en", sourcePath: "/en/contact", consentShare: "none" });
    expect(h.create.mock.calls[0][0].payload).not.toHaveProperty("secretExtra");
    expect(h.create.mock.calls[0][0].payload).not.toHaveProperty("idempotencyKey");
    expect(h.mark).toHaveBeenCalledWith("INTERNAL-ID", { notifyStatus: "sent", autoReplyStatus: "sent" });
  });
  it("does not report an unsuccessful save or send any mail", async () => {
    h.create.mockRejectedValueOnce(new Error(sample.message));
    const response = await POST(request());
    expect(response.status).toBe(503); expect(h.send).not.toHaveBeenCalled();
    expect(JSON.stringify([await response.json(), vi.mocked(console.error).mock.calls])).not.toContain(sample.message);
  });
  it("reconciles a save whose acknowledgement was lost without duplicate mail or insertion", async () => {
    h.create.mockImplementationOnce(async data => {
      rows.set(data.idempotencyKey, { digest: data.payload._contactDigest, receiptNo: "Y261023-7K3F" });
      throw new Error("acknowledgement lost");
    });
    expect((await POST(request())).status).toBe(503);
    const retry = await POST(request());
    expect(await retry.json()).toEqual({ ok: true, receiptNo: "Y261023-7K3F" });
    expect(h.create).toHaveBeenCalledTimes(1); expect(h.send).not.toHaveBeenCalled();
  });
  it("replays the same receipt, rejecting a changed payload under the same key", async () => {
    await POST(request());
    expect((await POST(request())).status).toBe(200);
    expect((await POST(request({ ...sample, message: "changed" }))).status).toBe(409);
    expect(h.create).toHaveBeenCalledTimes(1); expect(h.send).toHaveBeenCalledTimes(2);
  });
  it("handles concurrent requests through the unique-key winner only", async () => {
    const responses = await Promise.all([POST(request()), POST(request())]);
    expect(responses.map(r => r.status)).toEqual([200, 200]);
    expect(rows.size).toBe(1); expect(h.send).toHaveBeenCalledTimes(2);
  });
  it.each(["returned", "thrown", "missing-id"])("keeps saved receipts successful for %s email failure", async mode => {
    if (mode === "thrown") h.send.mockRejectedValue(new Error(sample.message));
    else h.send.mockResolvedValue({ data: null, error: mode === "returned" ? { message: sample.message } : null });
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(h.mark).toHaveBeenCalledWith("INTERNAL-ID", { notifyStatus: "failed", autoReplyStatus: "failed" });
    expect(JSON.stringify([await response.json(), vi.mocked(console.error).mock.calls])).not.toContain(sample.message);
  });
  it("does not lose acceptance when recording notification status or maintenance fails", async () => {
    h.mark.mockRejectedValue(new Error(sample.message)); h.purge.mockRejectedValue(new Error(sample.message));
    expect((await POST(request())).status).toBe(200);
    expect(rows.size).toBe(1);
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain(sample.message);
  });
  it("accepts phone-only owner inquiries without a reply or replyTo", async () => {
    expect((await POST(request({ ...sample, category: "gh-owner", email: "", phone: "03-0000-0000" }))).status).toBe(200);
    expect(h.send).toHaveBeenCalledTimes(1); expect(h.send.mock.calls[0][0]).not.toHaveProperty("replyTo");
    expect(h.mark).toHaveBeenCalledWith("INTERNAL-ID", { notifyStatus: "sent", autoReplyStatus: "skipped" });
  });
  it("supports legacy clients without pretending their retries are deduplicated", async () => {
    const legacy = { ...sample, idempotencyKey: undefined };
    expect((await POST(request(legacy))).status).toBe(200);
    expect((await POST(request(legacy))).status).toBe(200);
    expect(rows.size).toBe(2);
  });
  it.each([{ business: "attacker" }, { category: "__proto__" }, { idempotencyKey: "invalid" }, { name: " " }, { email: "" }, { locale: "invalid" }])("rejects invalid envelope/fields %j before persistence", async change => {
    expect((await POST(request({ ...sample, ...change }))).status).toBe(400);
    expect(h.create).not.toHaveBeenCalled(); expect(h.send).not.toHaveBeenCalled();
  });
  it("rejects malformed, oversized, and rate-limited requests before persistence", async () => {
    expect((await POST(new NextRequest("http://localhost/api/contact", { method: "POST", body: "{" }))).status).toBe(400);
    expect((await POST(request({ ...sample, message: "あ".repeat(9000) }))).status).toBe(413);
    h.rate.mockReturnValue({ success: false });
    expect((await POST(request())).status).toBe(429);
    expect(h.create).not.toHaveBeenCalled(); expect(h.send).not.toHaveBeenCalled();
  });
});
