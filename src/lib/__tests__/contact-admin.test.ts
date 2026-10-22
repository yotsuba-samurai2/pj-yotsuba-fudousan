import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const h = vi.hoisted(() => ({ user: null as null | Record<string, unknown>, get: vi.fn(), mark: vi.fn(), send: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth: { getUser: async () => ({ data: { user: h.user }, error: null }) } }) }));
vi.mock("@/lib/inquiries/store", () => ({ getInquiry: h.get, markNotification: h.mark, listInquiries: vi.fn(), purgeExpiredInquiries: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send: h.send }; } }));
import { GET, POST } from "@/app/api/admin/inquiries/route";
const row = {
  id: "inquiry-test", receiptNo: "Y261023-7K3F", category: "contact-realestate", business: "realestate",
  idempotencyKey: "contact/v1/8f0e7a2c-1b2d-4c3e-9f4a-5b6c7d8e9f01", locale: "ja", sourcePath: "/contact",
  consentShare: "none", notifyStatus: "pending", autoReplyStatus: "failed", createdAt: new Date(),
  payload: { name: "Test", email: "local@example.invalid", phone: "", message: "CONSULTATION", category: "bukken", source: "ai", business: "realestate", _contactDigest: "INTERNAL-DIGEST" },
};
const request = (method = "GET") => new NextRequest("http://localhost/api/admin/inquiries?id=inquiry-test", {
  method, headers: { Authorization: "Bearer test-only" },
  ...(method === "POST" ? { body: JSON.stringify({ action: "resend-notification", id: row.id }) } : {}),
});
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.invalid"); vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-only");
  h.user = { id: "owner", email: "uramatsujoji@luck428.com", email_confirmed_at: "2026-01-01T00:00:00Z" };
  h.get.mockResolvedValue(row); h.mark.mockResolvedValue(undefined); h.send.mockResolvedValue({ data: { id: "mail-test" }, error: null });
});
afterEach(() => vi.unstubAllEnvs());
describe("saved general contact in the existing owner-only inbox", () => {
  it("shows the receipt and consultation with labels, excluding internal digest", async () => {
    const response = await GET(request());
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.receiptNo).toBe(row.receiptNo);
    expect(data.rows).toContainEqual({ label: "お問い合わせ内容", value: "CONSULTATION" });
    expect(JSON.stringify(data)).not.toContain("INTERNAL-DIGEST");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
  it("supports explicit notification recovery without exposing the digest in mail", async () => {
    const response = await POST(request("POST"));
    expect(response.status).toBe(200);
    expect(h.send.mock.calls[0][0].html).toContain("CONSULTATION");
    expect(h.send.mock.calls[0][0].html).not.toContain("INTERNAL-DIGEST");
    expect(h.mark).toHaveBeenCalledWith(row.id, { notifyStatus: "sent" });
  });
  it("forbids another confirmed user from reading or sending", async () => {
    h.user = { ...h.user, email: "another@example.invalid" };
    expect((await GET(request())).status).toBe(403);
    expect((await POST(request("POST"))).status).toBe(403);
    expect(h.get).not.toHaveBeenCalled(); expect(h.send).not.toHaveBeenCalled();
  });
});
