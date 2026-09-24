import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { AuthError, verifyInquiryOwner } from "@/lib/api-auth";
import { inquiryCategory } from "@/lib/inquiries/categories";
import { sendOfficeNotification } from "@/lib/inquiries/mail";
import { getInquiry, listInquiries, markNotification, purgeExpiredInquiries } from "@/lib/inquiries/store";

/**
 * 受付の管理API。閲覧・再送できるのは受付先メールの所有者だけ（verifyInquiryOwner）。
 * 一覧を開くたびに保存期間（1年）を過ぎた受付を削除する。応答はキャッシュさせない。
 * ログには個人情報・Error の本文を出さない。
 */
const NO_STORE = { "Cache-Control": "private, no-store" };
const fail = (status: number, error: string) => NextResponse.json({ error }, { status, headers: NO_STORE });

function errorResponse(e: unknown) {
  if (e instanceof AuthError) return fail(e.status, e.message);
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") return fail(503, "受付の保存先が未作成です（マイグレーション未適用）");
  console.error("Inquiry admin failed", e instanceof Prisma.PrismaClientKnownRequestError ? e.code : e instanceof Error ? e.name : "unknown");
  return fail(500, "受付の処理に失敗しました");
}

type Payload = Record<string, unknown> & { name?: string; email?: string; phone?: string };
const str = (v: unknown) => (typeof v === "string" ? v : "");

/** 保存時に検証済みの内容を、表示用の「項目：値」にする。定義が変わって読めない場合は生の値を並べる。 */
function detailRows(category: string, payload: Payload) {
  const def = inquiryCategory(category);
  const parsed = def?.schema.safeParse(payload);
  if (def && parsed?.success) return def.rows(parsed.data);
  return Object.entries(payload).filter(([k]) => !["name", "email", "phone"].includes(k)).map(([label, value]) => ({ label, value: String(value) }));
}

export async function GET(req: NextRequest) {
  try {
    await verifyInquiryOwner(req);
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const row = await getInquiry(id);
      if (!row) return fail(404, "受付が見つかりません（保存期間を過ぎて削除された可能性があります）");
      const payload = row.payload as Payload;
      return NextResponse.json({
        id: row.id, receiptNo: row.receiptNo, category: row.category, categoryLabel: inquiryCategory(row.category)?.label ?? row.category,
        createdAt: row.createdAt, locale: row.locale, sourcePath: row.sourcePath, consentShare: row.consentShare,
        notifyStatus: row.notifyStatus, autoReplyStatus: row.autoReplyStatus,
        name: str(payload.name), email: str(payload.email), phone: str(payload.phone), rows: detailRows(row.category, payload),
      }, { headers: NO_STORE });
    }
    const purged = await purgeExpiredInquiries();
    const rows = await listInquiries();
    return NextResponse.json({
      purged,
      items: rows.map(r => ({
        id: r.id, receiptNo: r.receiptNo, categoryLabel: inquiryCategory(r.category)?.label ?? r.category, createdAt: r.createdAt,
        name: str((r.payload as Payload).name), notifyStatus: r.notifyStatus, autoReplyStatus: r.autoReplyStatus, consentShare: r.consentShare,
      })),
    }, { headers: NO_STORE });
  } catch (e) { return errorResponse(e); }
}

/** 事務所宛の通知の再送（通知に失敗した受付を、管理画面から送り直す）。 */
export async function POST(req: NextRequest) {
  try {
    await verifyInquiryOwner(req);
    let body: { action?: unknown; id?: unknown };
    try { body = await req.json(); } catch { return fail(400, "JSONを確認してください"); }
    if (body.action !== "resend-notification" || typeof body.id !== "string") return fail(400, "action と id を指定してください");
    const row = await getInquiry(body.id);
    if (!row) return fail(404, "受付が見つかりません");
    const def = inquiryCategory(row.category);
    if (!def) return fail(400, "この受付の種類は再送に対応していません");
    const payload = row.payload as Payload;
    const status = await sendOfficeNotification({
      receiptNo: row.receiptNo, idempotencyKey: row.idempotencyKey, businessLabel: def.businessLabel, categoryLabel: def.label,
      name: str(payload.name), email: str(payload.email), phone: str(payload.phone), rows: detailRows(row.category, payload),
    }, Date.now());
    await markNotification(row.id, { notifyStatus: status });
    return NextResponse.json({ notifyStatus: status }, { status: status === "sent" ? 200 : 502, headers: NO_STORE });
  } catch (e) { return errorResponse(e); }
}
