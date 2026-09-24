// ペット横断 指示書 版2.0 第11・12章・受入テスト T19〜T22・T26：受付API
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { POST } from "@/app/api/inquiries/route";
import { sendAutoReply, sendOfficeNotification } from "@/lib/inquiries/mail";
import { createInquiry, findInquiryByKey, markNotification, purgeExpiredInquiries } from "@/lib/inquiries/store";
import { rateLimit } from "@/lib/rate-limit";
import { owner, renter } from "./pet-intake-fixtures";

vi.mock("@/lib/inquiries/store", () => ({
  createInquiry: vi.fn(), findInquiryByKey: vi.fn(), markNotification: vi.fn(), purgeExpiredInquiries: vi.fn(),
}));
vi.mock("@/lib/inquiries/mail", () => ({ sendOfficeNotification: vi.fn(), sendAutoReply: vi.fn() }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: vi.fn() }));

const KEY = "8f0e7a2c-1b2d-4c3e-9f4a-5b6c7d8e9f01";
const body = (over: Record<string, unknown> = {}) => ({
  category: "pet-housing-renter", idempotencyKey: KEY, locale: "ja", sourcePath: "/pet-housing?utm_source=x#form", fields: renter, ...over,
});
const post = (value: unknown, headers: Record<string, string> = {}) =>
  POST(new NextRequest("https://test.invalid/api/inquiries", { method: "POST", body: JSON.stringify(value), headers }));
const store = [createInquiry, findInquiryByKey, markNotification, purgeExpiredInquiries];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(rateLimit).mockReturnValue({ success: true, remaining: 4 });
  vi.mocked(findInquiryByKey).mockResolvedValue(null);
  vi.mocked(purgeExpiredInquiries).mockResolvedValue(0);
  vi.mocked(createInquiry).mockResolvedValue({ inquiry: { id: "inq-1", receiptNo: "Y260924-7K3F" }, duplicate: false });
  vi.mocked(markNotification).mockResolvedValue(undefined);
  vi.mocked(sendOfficeNotification).mockResolvedValue("sent");
  vi.mocked(sendAutoReply).mockResolvedValue("sent");
});

describe("入口", () => {
  it("正しい送信は保存してから通知し、受付番号を返す", async () => {
    const res = await post(body());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ receiptNo: "Y260924-7K3F" });
    expect(vi.mocked(createInquiry).mock.invocationCallOrder[0]).toBeLessThan(vi.mocked(sendOfficeNotification).mock.invocationCallOrder[0]);
    expect(markNotification).toHaveBeenCalledWith("inq-1", { notifyStatus: "sent", autoReplyStatus: "sent" });
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("事業者は画面の値ではなく受付の種類からサーバーが決める。流入ページはクエリを落として保存する", async () => {
    await post(body());
    expect(vi.mocked(createInquiry).mock.calls[0][0]).toMatchObject({ business: "realestate", category: "pet-housing-renter", sourcePath: "/pet-housing" });
    expect((await post(body({ business: "legal" }))).status).toBe(400); // 未知の項目は拒否
  });

  it.each([
    ["未知の受付の種類", body({ category: "pet-travel" })],
    ["idempotencyKey の形式違い", body({ idempotencyKey: "abc" })],
    ["隠し欄に値がある（迷惑投稿）", body({ hp_field: "http://spam.example" })],
  ])("%s は保存しない（400）", async (_, value) => {
    expect((await post(value)).status).toBe(400);
    for (const fn of store) expect(fn).not.toHaveBeenCalled();
  });

  it("項目の誤りは、フォームが対応付けられる形（項目名ごと）で返す", async () => {
    const res = await post(body({ fields: { ...renter, email: "", phone: "" } }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors.email[0]).toContain("メールアドレスまたは電話番号");
    expect(createInquiry).not.toHaveBeenCalled();
  });

  it("回数制限を超えたら 429 で保存しない", async () => {
    vi.mocked(rateLimit).mockReturnValue({ success: false, remaining: 0 });
    expect((await post(body())).status).toBe(429);
    expect(createInquiry).not.toHaveBeenCalled();
  });

  it("大きすぎる本文は読む前に拒否する", async () => {
    expect((await post(body(), { "content-length": "50000" })).status).toBe(413);
  });
});

describe("重複と失敗（T19・T20）", () => {
  it("同じ idempotencyKey の再送は、保存も通知もやり直さずに同じ受付番号を返す", async () => {
    vi.mocked(findInquiryByKey).mockResolvedValue({ id: "inq-1", receiptNo: "Y260924-7K3F" });
    expect(await (await post(body())).json()).toEqual({ receiptNo: "Y260924-7K3F" });
    expect(createInquiry).not.toHaveBeenCalled();
    expect(sendOfficeNotification).not.toHaveBeenCalled();
  });

  it("同時の二重送信で保存側が重複を返したら、通知を送らない", async () => {
    vi.mocked(createInquiry).mockResolvedValue({ inquiry: { id: "inq-1", receiptNo: "Y260924-7K3F" }, duplicate: true });
    expect((await post(body())).status).toBe(200);
    expect(sendOfficeNotification).not.toHaveBeenCalled();
  });

  it("保存に失敗したら成功を返さず、通知も送らない", async () => {
    vi.mocked(createInquiry).mockRejectedValue(new Error("db down"));
    const res = await post(body());
    expect(res.status).toBe(500);
    expect(await res.json()).not.toHaveProperty("receiptNo");
    expect(sendOfficeNotification).not.toHaveBeenCalled();
  });

  it("保存先が未作成（本番の migration 未適用）なら 503", async () => {
    vi.mocked(findInquiryByKey).mockRejectedValue(new Prisma.PrismaClientKnownRequestError("missing", { code: "P2021", clientVersion: "test" }));
    expect((await post(body())).status).toBe(503);
  });

  it("通知・自動返信が失敗しても、保存済みの受付は成功として返し、失敗を記録する（再送させない）", async () => {
    vi.mocked(sendOfficeNotification).mockResolvedValue("failed");
    vi.mocked(sendAutoReply).mockResolvedValue("failed");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post(body());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ receiptNo: "Y260924-7K3F" });
    expect(markNotification).toHaveBeenCalledWith("inq-1", { notifyStatus: "failed", autoReplyStatus: "failed" });
    spy.mockRestore();
  });

  it("古い受付の削除に失敗しても、受付そのものは続ける", async () => {
    vi.mocked(purgeExpiredInquiries).mockRejectedValue(new Error("timeout"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await post(body())).status).toBe(200);
    spy.mockRestore();
  });
});

describe("同意と個人情報（T22・T26）", () => {
  it("他事業者への共有は、同意が無ければ none、同意があれば granted として保存する", async () => {
    await post(body());
    expect(vi.mocked(createInquiry).mock.calls[0][0].consentShare).toBe("none");
    await post(body({ idempotencyKey: "9f0e7a2c-1b2d-4c3e-9f4a-5b6c7d8e9f02", fields: { ...renter, consentShare: true } }));
    expect(vi.mocked(createInquiry).mock.calls[1][0].consentShare).toBe("granted");
  });

  it("大家フォームは共有の同意欄を持たず、常に none", async () => {
    await post(body({ category: "pet-housing-owner", fields: owner }));
    expect(vi.mocked(createInquiry).mock.calls[0][0]).toMatchObject({ category: "pet-housing-owner", consentShare: "none", autoReplyStatus: "skipped" });
  });

  it("失敗時のログに入力内容や Error の本文を出さない", async () => {
    vi.mocked(createInquiry).mockRejectedValue(new Error(`insert failed: ${renter.name} ${renter.email}`));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await post(body());
    const logged = spy.mock.calls.flat();
    expect(logged.every(arg => typeof arg === "string")).toBe(true);
    expect(logged.join(" ")).not.toContain(renter.email);
    spy.mockRestore();
  });
});
