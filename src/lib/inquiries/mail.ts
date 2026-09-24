import { Resend } from "resend";
import { escapeHtml, FROM_EMAIL, NOTIFY_TO } from "@/lib/contact-mail";
import { OFFICE } from "@/lib/shared/office-public";
import { INQUIRY_RETENTION_LABEL_JA } from "@/lib/shared/inquiry-intake";

/**
 * 受付の通知メール（事務所宛）と自動返信。
 * Resend は送信の失敗を例外ではなく戻り値の error で返すので、それを確かめる（無視すると失敗が「成功」になる）。
 * 同じ受付の再送で二重に届かないよう、Resend の idempotencyKey を付ける。
 */
export type MailInquiry = {
  receiptNo: string;
  idempotencyKey: string;
  businessLabel: string;
  categoryLabel: string;
  name: string;
  email: string;
  phone: string;
  rows: { label: string; value: string }[];
};
export type SendResult = "sent" | "failed";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

async function send(payload: Parameters<Resend["emails"]["send"]>[0], idempotencyKey: string): Promise<SendResult> {
  try {
    const { error } = await getResend().emails.send(payload, { idempotencyKey });
    return error ? "failed" : "sent";
  } catch {
    return "failed";
  }
}

const row = (label: string, value: string) =>
  `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;width:170px;vertical-align:top;">${escapeHtml(label)}</td>` +
  `<td style="padding:8px 0;border-bottom:1px solid #e5e7eb;line-height:1.7;">${escapeHtml(value)}</td></tr>`;

function layout(title: string, body: string, businessLabel: string) {
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Helvetica Neue',Arial,'Hiragino Sans',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="padding:24px 32px;border-bottom:1px solid #e5e7eb;"><h1 style="margin:0;color:#1f2937;font-size:18px;">${escapeHtml(title)}</h1></td></tr>
<tr><td style="padding:24px 32px;font-size:14px;color:#1f2937;">${body}</td></tr>
<tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#6b7280;">
<p style="margin:0 0 4px;font-size:13px;color:#374151;font-weight:600;">${escapeHtml(businessLabel)}</p>
〒112-0006 東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３<br />TEL: ${OFFICE.tel}</td></tr>
</table></td></tr></table></body></html>`;
}

/** 事務所宛の通知。受付番号・種類・連絡先・入力内容・他事業者への共有の同意の有無を載せる。 */
export function officeNotificationHtml(i: MailInquiry) {
  const body = `<p style="margin:0 0 16px;">受付番号 <strong>${escapeHtml(i.receiptNo)}</strong>／${escapeHtml(i.categoryLabel)}</p>
<table width="100%" cellpadding="0" cellspacing="0">${row("お名前（受付名）", i.name)}${row("メールアドレス", i.email || "未入力（電話でご連絡ください）")}${row("電話番号", i.phone || "未入力")}${i.rows.map(r => row(r.label, r.value)).join("")}</table>
<p style="margin:16px 0 0;font-size:12px;color:#6b7280;">受付の保存期間は${INQUIRY_RETENTION_LABEL_JA}です。管理画面の「受付」から確認できます。</p>`;
  return layout("新しい受付", body, i.businessLabel);
}

/** 自動返信。入力内容は繰り返さず、受付番号と今後の流れだけを伝える。 */
export function autoReplyHtml(i: MailInquiry) {
  const body = `<p style="margin:0 0 16px;line-height:1.8;">${escapeHtml(i.name)} 様</p>
<p style="margin:0 0 16px;line-height:1.8;">このたびはご相談をお寄せいただき、ありがとうございます。次の受付番号でお預かりしました。</p>
<table width="100%" cellpadding="0" cellspacing="0">${row("受付番号", i.receiptNo)}${row("ご相談の種類", i.categoryLabel)}</table>
<p style="margin:16px 0 0;line-height:1.8;">担当者から、ご入力の連絡先へ順次ご連絡します。お問い合わせの際は受付番号をお知らせください。</p>
<p style="margin:16px 0 0;font-size:12px;color:#6b7280;line-height:1.7;">ご入力内容は、ご相談への対応のために保存し、受付から${INQUIRY_RETENTION_LABEL_JA}で削除します。<br />
※ このメールは受付の確認として自動送信しています。お心当たりのない場合は、お手数ですが破棄してください。</p>`;
  return layout("ご相談を受け付けました", body, i.businessLabel);
}

/** attempt は管理画面からの再送の回数（0＝受付時）。回数ごとに idempotencyKey を変えて、再送が届くようにする。 */
export function sendOfficeNotification(i: MailInquiry, attempt = 0): Promise<SendResult> {
  return send({
    from: `${i.businessLabel} <${FROM_EMAIL}>`,
    to: NOTIFY_TO,
    subject: `【受付 ${i.receiptNo}】${i.categoryLabel} - ${i.name}様`,
    ...(i.email ? { replyTo: i.email } : {}),
    html: officeNotificationHtml(i),
  }, `inquiry-notify/${i.idempotencyKey}${attempt ? `/${attempt}` : ""}`);
}

export async function sendAutoReply(i: MailInquiry): Promise<SendResult | "skipped"> {
  if (!i.email) return "skipped";
  return send({
    from: `${i.businessLabel} <${FROM_EMAIL}>`,
    to: i.email,
    subject: `【${i.businessLabel}】ご相談を受け付けました（受付番号 ${i.receiptNo}）`,
    html: autoReplyHtml(i),
  }, `inquiry-reply/${i.idempotencyKey}`);
}
