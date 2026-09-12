import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));
import { POST } from "@/app/api/contact/route";

const sample = { name: "Local Test", email: "local-test@example.invalid", phone: "", category: "labor", source: "ai", message: "Local regression test" };
const request = (body: object) => new NextRequest("http://localhost/api/contact", { method: "POST", body: JSON.stringify(body) });

describe("contact routing (all email delivery mocked)", () => {
  beforeEach(() => { send.mockReset(); send.mockResolvedValue({ data: { id: "test-only" }, error: null }); });
  it.each([
    ["realestate", "bukken", "四葉不動産", "物件を探してほしい（希望条件）"],
    ["legal", "visa", "四葉行政書士事務所", "ビザ・在留資格"],
    ["labor", "labor", "四葉社会保険労務士事務所", "社会保険・労務"],
  ])("preserves recipients and data for %s", async (business, category, label, categoryLabel) => {
    const response = await POST(request({ ...sample, business, category }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(2);
    const [notification] = send.mock.calls[0];
    const [reply] = send.mock.calls[1];
    expect(notification).toMatchObject({ to: "uramatsujoji@luck428.com", from: `${label} <noreply@samurai.co.jp>`, replyTo: sample.email });
    expect(notification.html).toContain(categoryLabel);
    expect(notification.html).toContain("ChatGPT・Claude などのAIに聞いて");
    expect(notification.html).toContain(sample.message);
    expect(reply.to).toBe(sample.email);
    expect(reply.subject).toContain(label);
  });
  it("rejects an empty category without contacting the email provider", async () => {
    const response = await POST(request({ ...sample, category: "", business: "labor" }));
    expect(response.status).toBe(400);
    expect((await response.json()).errors.category).toBeTruthy();
    expect(send).not.toHaveBeenCalled();
  });
  it("returns a failure when the provider throws", async () => {
    send.mockRejectedValueOnce(new Error("mock unavailable"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await POST(request({ ...sample, business: "labor" }));
      expect(response.status).toBe(500);
      expect(await response.json()).toHaveProperty("error");
      expect(send).toHaveBeenCalledTimes(1);
    } finally { log.mockRestore(); }
  });
});
