// ペット横断 指示書 版2.0 第12章・受入テスト T20：通知・自動返信の失敗を「成功」にしない
import { beforeEach, describe, expect, it, vi } from "vitest";
import { autoReplyHtml, officeNotificationHtml, sendAutoReply, sendOfficeNotification, type MailInquiry } from "@/lib/inquiries/mail";

const send = vi.fn();
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));

const mail: MailInquiry = {
  receiptNo: "Y260924-7K3F", idempotencyKey: "8f0e7a2c-1b2d-4c3e-9f4a-5b6c7d8e9f01", businessLabel: "四葉不動産株式会社",
  categoryLabel: "ペットと暮らす住まい探し（借り手・買い手）", name: "試験 太郎", email: "renter@example.com", phone: "",
  rows: [{ label: "希望エリア", value: "文京区<script>alert(1)</script>" }, { label: "その他", value: "SECRET-NOTE" }],
};

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: "email-1" }, error: null });
});

describe("送信結果の判定", () => {
  it("Resend が error を返したら failed（例外にならない失敗も見逃さない）", async () => {
    send.mockResolvedValue({ data: null, error: { name: "rate_limit_exceeded", message: "Too many requests" } });
    await expect(sendOfficeNotification(mail)).resolves.toBe("failed");
  });

  it("送信が例外になっても failed を返す（受付は失敗にしない）", async () => {
    send.mockRejectedValue(new Error("network"));
    await expect(sendOfficeNotification(mail)).resolves.toBe("failed");
    await expect(sendAutoReply(mail)).resolves.toBe("failed");
  });

  it("成功なら sent。メールが無ければ自動返信は送らない", async () => {
    await expect(sendOfficeNotification(mail)).resolves.toBe("sent");
    await expect(sendAutoReply({ ...mail, email: "" })).resolves.toBe("skipped");
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("二重に届かないよう idempotencyKey を付け、管理画面からの再送は別のキーにする", async () => {
    await sendOfficeNotification(mail);
    await sendOfficeNotification(mail, 1);
    await sendAutoReply(mail);
    expect(send.mock.calls.map(c => c[1].idempotencyKey)).toEqual([
      `inquiry-notify/${mail.idempotencyKey}`, `inquiry-notify/${mail.idempotencyKey}/1`, `inquiry-reply/${mail.idempotencyKey}`,
    ]);
  });

  it("事務所宛は受付番号を件名に入れ、返信先を相談者にする", async () => {
    await sendOfficeNotification(mail);
    const [payload] = send.mock.calls[0];
    expect(payload.to).toBe("uramatsujoji@luck428.com");
    expect(payload.subject).toContain("Y260924-7K3F");
    expect(payload.replyTo).toBe("renter@example.com");
  });
});

describe("本文", () => {
  it("入力値は HTML としてエスケープする", () => {
    const html = officeNotificationHtml(mail);
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("自動返信は入力内容を繰り返さず、受付番号と保存期間だけを伝える", () => {
    const html = autoReplyHtml(mail);
    expect(html).toContain("Y260924-7K3F");
    expect(html).toContain("受付から1年で削除します");
    expect(html).not.toContain("SECRET-NOTE");
    expect(html).not.toContain("文京区&lt;script");
  });
});
