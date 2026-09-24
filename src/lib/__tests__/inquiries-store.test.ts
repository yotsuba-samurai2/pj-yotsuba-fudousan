// ペット横断 指示書 版2.0 第12章・受入テスト T19：重複保存の防止・受付番号・保存期間
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createInquiry, purgeExpiredInquiries, retentionCutoff } from "@/lib/inquiries/store";
import { generateReceiptNo, RECEIPT_NO_PATTERN } from "@/lib/inquiries/receipt";

vi.mock("@/lib/prisma", () => ({ prisma: { inquiry: { create: vi.fn(), findUnique: vi.fn(), deleteMany: vi.fn(), update: vi.fn() } } }));

const inquiry = vi.mocked(prisma.inquiry);
const p2002 = () => new Prisma.PrismaClientKnownRequestError("unique", { code: "P2002", clientVersion: "test" });
const data = {
  idempotencyKey: "8f0e7a2c-1b2d-4c3e-9f4a-5b6c7d8e9f01", business: "realestate", category: "pet-housing-renter", locale: "ja",
  sourcePath: "/pet-housing", payload: { name: "試験" }, consentShare: "none" as const, autoReplyStatus: "skipped" as const,
};

beforeEach(() => {
  vi.clearAllMocks();
  inquiry.create.mockResolvedValue({ id: "inq-1", receiptNo: "Y260924-AAAA" } as never);
  inquiry.findUnique.mockResolvedValue(null);
  inquiry.deleteMany.mockResolvedValue({ count: 0 });
});

describe("受付番号", () => {
  it("日本時間の日付と、読み違えにくい4文字", () => {
    const no = generateReceiptNo(new Date("2026-09-24T16:00:00Z"), () => 0);
    expect(no).toBe("Y260925-2222"); // 16:00Z は日本時間の翌日 01:00
    for (let i = 0; i < 50; i++) expect(generateReceiptNo()).toMatch(RECEIPT_NO_PATTERN);
  });
});

describe("保存（T19）", () => {
  it("通知の状態は pending で保存し、事業者・同意・自動返信の有無をそのまま記録する", async () => {
    await expect(createInquiry(data)).resolves.toEqual({ inquiry: { id: "inq-1", receiptNo: "Y260924-AAAA" }, duplicate: false });
    expect(inquiry.create.mock.calls[0][0].data).toMatchObject({ business: "realestate", consentShare: "none", notifyStatus: "pending", autoReplyStatus: "skipped" });
  });

  it("同じ送信が同時に来て一意制約に当たったら、先に保存された受付を返す（重複保存しない）", async () => {
    inquiry.create.mockRejectedValueOnce(p2002());
    inquiry.findUnique.mockResolvedValueOnce({ id: "inq-0", receiptNo: "Y260924-BBBB" } as never);
    await expect(createInquiry(data)).resolves.toEqual({ inquiry: { id: "inq-0", receiptNo: "Y260924-BBBB" }, duplicate: true });
    expect(inquiry.create).toHaveBeenCalledTimes(1);
  });

  it("受付番号が偶然重なっただけなら、番号を作り直して保存する", async () => {
    inquiry.create.mockRejectedValueOnce(p2002());
    await expect(createInquiry(data)).resolves.toMatchObject({ duplicate: false });
    expect(inquiry.create).toHaveBeenCalledTimes(2);
  });

  it("一意制約以外の失敗は隠さない（呼び出し側が失敗として返す）", async () => {
    inquiry.create.mockRejectedValueOnce(new Prisma.PrismaClientKnownRequestError("missing", { code: "P2021", clientVersion: "test" }));
    await expect(createInquiry(data)).rejects.toThrow();
  });
});

describe("保存期間（1年）", () => {
  it("受付から365日を過ぎた行だけを削除する", async () => {
    const now = new Date("2026-09-24T00:00:00Z");
    await purgeExpiredInquiries(now);
    const where = inquiry.deleteMany.mock.calls[0][0]!.where as { createdAt: { lt: Date } };
    expect(where.createdAt.lt.toISOString()).toBe("2025-09-24T00:00:00.000Z");
    expect(retentionCutoff(now).getTime()).toBe(now.getTime() - 365 * 86_400_000);
  });
});
