import { describe, expect, it, vi } from "vitest";
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
import { MINPAKU_LISTINGS, hasCurrentListingPrice } from "../shared/minpaku-listings";
import { minpakuPurchaseMessage } from "../shared/minpaku-purchase";

describe("purchase inquiry content", () => {
  it("keeps multiple requested regions, undecided budget and questions in the consultation content", () => {
    const content = minpakuPurchaseMessage({ regions: ["北海道", "沖縄"], budget: "未定", purpose: "自己利用との併用" }, "利用できる期間を知りたい");
    expect(content).toContain("希望地域：北海道・沖縄");
    expect(content).toContain("予算：未定");
    expect(content).toContain("利用目的：自己利用との併用");
    expect(content).toContain("利用できる期間を知りたい");
  });
});

describe("source price validity", () => {
  it("hides rounded price figures after the source validity ends in Japan", () => {
    const listing = MINPAKU_LISTINGS.find((entry) => entry.id === "chitose")!;
    expect(hasCurrentListingPrice(listing, new Date("2026-10-31T14:59:59.999Z"))).toBe(true);
    expect(hasCurrentListingPrice(listing, new Date("2026-10-31T15:00:00.000Z"))).toBe(false);
  });
  it("keeps unavailable prices out of the public summary", () => {
    const sapporo = MINPAKU_LISTINGS.find((entry) => entry.id === "sapporo")!;
    expect(sapporo.price).toBeNull();
    expect(hasCurrentListingPrice(sapporo, new Date("2026-10-16T00:00:00+09:00"))).toBe(false);
  });
});


describe("purchase inquiry API contract (all email delivery mocked)", () => {
  it("accepts the existing sale category and retains purchase preferences in the notification", async () => {
    send.mockResolvedValue({ data: { id: "test-only" }, error: null });
    const message = minpakuPurchaseMessage({ regions: ["北海道", "沖縄"], budget: "未定", purpose: "自己利用との併用" }, "利用できる期間を知りたい");
    const request = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Local Test", email: "local-test@example.invalid", phone: "", category: "sale", source: "", message, business: "realestate" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, receiptNo: "Y261023-7K3F" });
    expect(send).toHaveBeenCalledTimes(2);
    const notification = send.mock.calls[0][0];
    expect(notification.from).toContain("四葉不動産");
    expect(notification.html).toContain("希望地域：北海道・沖縄");
    expect(notification.html).toContain("予算：未定");
    expect(notification.html).toContain("自己利用との併用");
    expect(notification.html).toContain("利用できる期間を知りたい");
  });
});
