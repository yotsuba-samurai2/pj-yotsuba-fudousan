/**
 * 問い合わせメールの宛先・差出人と HTML エスケープ（/api/contact と /api/inquiries の共通の正本）。
 * サーバー側でだけ使う。
 */
export const NOTIFY_TO = "uramatsujoji@luck428.com";
export const FROM_EMAIL = "noreply@samurai.co.jp";

export function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br />");
}
