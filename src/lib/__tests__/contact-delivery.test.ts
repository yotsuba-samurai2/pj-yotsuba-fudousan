import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));
vi.mock("@/lib/prisma", () => ({ prisma: { inquiry: {
  findUnique: vi.fn().mockResolvedValue(null),
  create: vi.fn().mockResolvedValue({ id: "test-only", receiptNo: "Y261023-7K3F" }),
  update: vi.fn().mockResolvedValue({}),
  deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
} } }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: () => ({ success: true }) }));
import { POST } from "@/app/api/contact/route";

const sample = { name: "Test", email: "test@example.invalid", category: "other", message: "Private test message", business: "realestate" };
const request = () => new NextRequest("http://localhost/api/contact", { method: "POST", body: JSON.stringify(sample) });
beforeEach(() => {
  send.mockReset().mockResolvedValue({ data: { id: "test-id" }, error: null });
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("contact delivery failures (no real mail)", () => {
  it.each([
    { data: null, error: { message: sample.message } },
    { data: null, error: null },
    { data: {}, error: null },
  ])("keeps a saved receipt when office notification is unconfirmed", async result => {
    send.mockResolvedValueOnce(result);
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(2);
    expect(JSON.stringify([await response.json(), vi.mocked(console.error).mock.calls])).not.toContain(sample.message);
  });
  it("does not log exception contents", async () => {
    send.mockRejectedValueOnce(new Error(sample.message));
    expect((await POST(request())).status).toBe(200);
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain(sample.message);
  });
  it.each(["returned", "thrown"])("keeps an accepted office notification successful after %s reply failure", async mode => {
    send.mockResolvedValueOnce({ data: { id: "office-id" }, error: null });
    if (mode === "returned") send.mockResolvedValueOnce({ data: null, error: { message: sample.message } });
    else send.mockRejectedValueOnce(new Error(sample.message));
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, receiptNo: "Y261023-7K3F" });
    expect(send).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith("Contact auto reply unconfirmed", "Y261023-7K3F");
  });
});
