// ペット横断 指示書 版2.0 第11章：受付（個人情報）の閲覧は受付先メールの所有者だけ・保存期間1年
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { AuthError, verifyAdminRequest, verifyInquiryOwner } from "@/lib/api-auth";
import { GET, POST } from "@/app/api/admin/inquiries/route";
import { sendOfficeNotification } from "@/lib/inquiries/mail";
import { getInquiry, listInquiries, markNotification, purgeExpiredInquiries } from "@/lib/inquiries/store";
import { renter } from "./pet-intake-fixtures";

const h = vi.hoisted(() => ({ user: null as null | Record<string, unknown> }));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ auth: { getUser: async () => (h.user ? { data: { user: h.user }, error: null } : { data: { user: null }, error: { message: "bad" } }) } }),
}));
vi.mock("@/lib/inquiries/store", () => ({ getInquiry: vi.fn(), listInquiries: vi.fn(), markNotification: vi.fn(), purgeExpiredInquiries: vi.fn() }));
vi.mock("@/lib/inquiries/mail", () => ({ sendOfficeNotification: vi.fn() }));

const OWNER = { id: "u-owner", email: "uramatsujoji@luck428.com", email_confirmed_at: "2026-01-01T00:00:00Z" };
const req = (url = "https://test.invalid/api/admin/inquiries", init: { method?: string; body?: string } = {}) =>
  new NextRequest(url, { ...init, headers: { Authorization: "Bearer token" } });
const row = {
  id: "inq-1", receiptNo: "Y260924-7K3F", idempotencyKey: "8f0e7a2c-1b2d-4c3e-9f4a-5b6c7d8e9f01", business: "realestate",
  category: "pet-housing-renter", locale: "ja", sourcePath: "/pet-housing", payload: renter, consentShare: "none",
  notifyStatus: "failed", autoReplyStatus: "sent", createdAt: new Date("2026-09-24T00:00:00Z"),
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.test.invalid";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";
  h.user = OWNER;
  vi.mocked(purgeExpiredInquiries).mockResolvedValue(0);
  vi.mocked(listInquiries).mockResolvedValue([row] as never);
  vi.mocked(getInquiry).mockResolvedValue(row as never);
  vi.mocked(sendOfficeNotification).mockResolvedValue("sent");
  vi.mocked(markNotification).mockResolvedValue(undefined);
});

describe("閲覧者の限定", () => {
  it("受付先メールの所有者（確認済み）だけが通る", async () => {
    await expect(verifyInquiryOwner(req())).resolves.toMatchObject({ uid: "u-owner" });
  });

  it.each([
    ["別のメールアドレスの管理者", { ...OWNER, email: "staff@luck428.com" }],
    ["メールアドレスの確認が済んでいない", { ...OWNER, email_confirmed_at: null }],
    ["メールアドレスが無い", { ...OWNER, email: undefined }],
  ])("%s は 403", async (_, user) => {
    h.user = user;
    await expect(verifyInquiryOwner(req())).rejects.toMatchObject({ status: 403 });
    const res = await GET(req());
    expect(res.status).toBe(403);
    expect(listInquiries).not.toHaveBeenCalled();
    expect(purgeExpiredInquiries).not.toHaveBeenCalled();
  });

  it("未ログイン・無効なトークンは 401", async () => {
    h.user = null;
    await expect(verifyInquiryOwner(req())).rejects.toBeInstanceOf(AuthError);
    expect((await GET(new NextRequest("https://test.invalid/api/admin/inquiries"))).status).toBe(401);
  });

  it("既存の管理API用の認証（verifyAdminRequest）の挙動は変えない", async () => {
    h.user = { ...OWNER, email: "staff@luck428.com" };
    await expect(verifyAdminRequest(req())).resolves.toEqual({ uid: "u-owner", email: "staff@luck428.com" });
  });
});

describe("一覧・詳細・再送", () => {
  it("一覧を開くたびに保存期間を過ぎた受付を削除し、キャッシュさせない", async () => {
    const res = await GET(req());
    expect(res.status).toBe(200);
    expect(purgeExpiredInquiries).toHaveBeenCalledTimes(1);
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect((await res.json()).items[0]).toMatchObject({ receiptNo: "Y260924-7K3F", name: renter.name, notifyStatus: "failed" });
  });

  it("詳細は項目を表示用の日本語で返す", async () => {
    const json = await (await GET(req("https://test.invalid/api/admin/inquiries?id=inq-1"))).json();
    expect(json.rows.find((r: { label: string }) => r.label === "動物の種類").value).toBe("猫");
    expect(json.categoryLabel).toContain("借り手");
  });

  it("通知の再送は、受付時とは別のキーで送り、結果を記録する", async () => {
    const res = await POST(req("https://test.invalid/api/admin/inquiries", { method: "POST", body: JSON.stringify({ action: "resend-notification", id: "inq-1" }) }));
    expect(res.status).toBe(200);
    expect(vi.mocked(sendOfficeNotification).mock.calls[0][1]).toBeGreaterThan(0);
    expect(markNotification).toHaveBeenCalledWith("inq-1", { notifyStatus: "sent" });
  });

  it("所有者以外は再送もできない", async () => {
    h.user = { ...OWNER, email: "staff@luck428.com" };
    const res = await POST(req("https://test.invalid/api/admin/inquiries", { method: "POST", body: JSON.stringify({ action: "resend-notification", id: "inq-1" }) }));
    expect(res.status).toBe(403);
    expect(sendOfficeNotification).not.toHaveBeenCalled();
  });
});
