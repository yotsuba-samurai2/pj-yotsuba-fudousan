import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { inquiryCategory } from "@/lib/inquiries/categories";
import { sendAutoReply, sendOfficeNotification, type MailInquiry } from "@/lib/inquiries/mail";
import { createInquiry, findInquiryByKey, markNotification, purgeExpiredInquiries } from "@/lib/inquiries/store";
import { isValidLocale } from "@/lib/locale";
import { rateLimit } from "@/lib/rate-limit";
import { HONEYPOT_FIELD } from "@/lib/shared/inquiry-intake";

/**
 * 受付API（まずペット住宅の借り手・大家フォーム）。ペット横断 指示書 版2.0 第11・12章。
 * - 保存に成功した時点で受付成功（受付番号を返す）。保存に失敗したら成功を返さない。
 * - 通知・自動返信の失敗は記録するだけで、受付は成功のまま（利用者に再送させない）。
 * - 同じ idempotencyKey の再送は、保存・送信をやり直さずに同じ受付番号を返す。
 * - 事業者は画面の値ではなく、受付の種類からサーバーが決める。
 * - ログには入力内容・Error の本文を出さない（コードと種類だけ）。
 */
const MAX_BODY_CHARS = 20_000;
const NO_STORE = { "Cache-Control": "no-store" };
const GENERIC_ERROR = "送信できませんでした。時間をおいて再度お試しいただくか、お電話・LINEでご連絡ください。";

const envelopeSchema = z.object({
  category: z.string().max(40),
  idempotencyKey: z.uuid(),
  locale: z.string().max(10),
  sourcePath: z.string().max(300),
  [HONEYPOT_FIELD]: z.string().max(500).optional(),
  fields: z.record(z.string(), z.unknown()),
}).strict();

const fail = (status: number, error: string) => NextResponse.json({ error }, { status, headers: NO_STORE });
const ok = (receiptNo: string) => NextResponse.json({ receiptNo }, { headers: NO_STORE });

function logFailure(stage: string, e: unknown) {
  console.error(`Inquiry ${stage} failed`, e instanceof Prisma.PrismaClientKnownRequestError ? e.code : e instanceof Error ? e.name : "unknown");
}

/** 流入ページはクエリ・ハッシュを落としたパスだけを保存する（URL に個人情報が入っても残さない）。 */
function cleanPath(path: string) {
  const bare = path.split(/[?#]/)[0];
  return bare.startsWith("/") && !bare.startsWith("//") ? bare.slice(0, 200) : "/";
}

export async function POST(req: NextRequest) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_CHARS) return fail(413, "入力内容が長すぎます。");
  if (!rateLimit(req, 5, 10 * 60_000).success)
    return fail(429, "短い時間に送信が続いたため、受け付けを一時停止しています。しばらくしてからお試しいただくか、お電話・LINEでご連絡ください。");
  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_CHARS) return fail(413, "入力内容が長すぎます。");
    body = JSON.parse(raw);
  } catch {
    return fail(400, GENERIC_ERROR);
  }
  const envelope = envelopeSchema.safeParse(body);
  if (!envelope.success) return fail(400, GENERIC_ERROR);
  const def = inquiryCategory(envelope.data.category);
  // 隠し欄に値がある送信は受け付けない（人には見えない欄。理由は返さない）。
  if (!def || envelope.data[HONEYPOT_FIELD]) return fail(400, GENERIC_ERROR);
  const parsed = def.schema.safeParse(envelope.data.fields);
  if (!parsed.success) return NextResponse.json({ errors: z.flattenError(parsed.error).fieldErrors }, { status: 400, headers: NO_STORE });
  const fields = parsed.data as Record<string, unknown> & { name: string; email: string; phone: string };
  const idempotencyKey = envelope.data.idempotencyKey;

  try {
    const existing = await findInquiryByKey(idempotencyKey);
    if (existing) return ok(existing.receiptNo);
    await purgeExpiredInquiries().catch(e => logFailure("purge", e));
    const { inquiry, duplicate } = await createInquiry({
      idempotencyKey,
      business: def.business,
      category: envelope.data.category,
      locale: isValidLocale(envelope.data.locale) ? envelope.data.locale : "ja",
      sourcePath: cleanPath(envelope.data.sourcePath),
      payload: fields,
      consentShare: def.consentShare(fields),
      autoReplyStatus: fields.email ? "pending" : "skipped",
    });
    if (duplicate) return ok(inquiry.receiptNo);

    const mail: MailInquiry = {
      receiptNo: inquiry.receiptNo, idempotencyKey, businessLabel: def.businessLabel, categoryLabel: def.label,
      name: fields.name, email: fields.email, phone: fields.phone, rows: def.rows(fields),
    };
    const [notifyStatus, autoReplyStatus] = await Promise.all([sendOfficeNotification(mail), sendAutoReply(mail)]);
    if (notifyStatus === "failed") console.error("Inquiry notification failed", inquiry.receiptNo);
    await markNotification(inquiry.id, { notifyStatus, autoReplyStatus }).catch(e => logFailure("status update", e));
    return ok(inquiry.receiptNo);
  } catch (e) {
    logFailure("save", e);
    // テーブル未作成（本番の migration 未適用）も、保存できていないので失敗として返す。
    return fail(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021" ? 503 : 500, GENERIC_ERROR);
  }
}
