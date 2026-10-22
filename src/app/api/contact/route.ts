import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { contactSchema } from "@/lib/inquiries/contact-schema";
import { contactCategory } from "@/lib/inquiries/contact";
import { findContactReceipt } from "@/lib/inquiries/contact-store";
import { createInquiry, markNotification, purgeExpiredInquiries } from "@/lib/inquiries/store";
import { sendAutoReply, sendOfficeNotification, type MailInquiry } from "@/lib/inquiries/mail";
import { rateLimit } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 24_000;
const NO_STORE = { "Cache-Control": "no-store" };
const GENERIC_ERROR = "送信に失敗しました。しばらく経ってからお試しください。";
const envelopeSchema = z.object({
  idempotencyKey: z.uuid().optional(),
  locale: z.enum(["ja", "en", "zh-tw", "zh"]).default("ja"),
  sourcePath: z.string().max(500).default("/contact"),
});
const fail = (status: number, error = GENERIC_ERROR) => NextResponse.json({ error }, { status, headers: NO_STORE });
const ok = (receiptNo: string) => NextResponse.json({ ok: true, receiptNo }, { headers: NO_STORE });

/** Read a bounded body even when content-length is absent. */
async function readBody(req: NextRequest) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) throw new RangeError();
  const reader = req.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new RangeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

function cleanPath(value: string) {
  const path = value.split(/[?#]/)[0];
  return path.startsWith("/") && !path.startsWith("//") && !/[\\\s]/.test(path) ? path.slice(0, 200) : "/contact";
}

export async function POST(req: NextRequest) {
  if (!rateLimit(req, 5, 10 * 60_000).success) return fail(429, "短い時間に送信が続いています。時間をおいて再度お試しください。");
  let body: unknown;
  try { body = await readBody(req); }
  catch (e) { return fail(e instanceof RangeError ? 413 : 400); }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400, headers: NO_STORE });
  const envelope = envelopeSchema.safeParse(body);
  if (!envelope.success) return fail(400);
  const fields = parsed.data;
  const def = contactCategory(fields.business);
  // Legacy clients without a key remain accepted; only updated clients have transport-retry deduplication.
  const key = `contact/v1/${envelope.data.idempotencyKey ?? randomUUID()}`;
  const sourcePath = cleanPath(envelope.data.sourcePath);
  const digest = createHash("sha256").update(JSON.stringify({ fields, locale: envelope.data.locale, sourcePath })).digest("hex");
  const replay = async () => {
    const existing = await findContactReceipt(key);
    return existing ? existing.digest === digest ? ok(existing.receiptNo) : fail(409, "入力内容が変わりました。内容を確認してもう一度送信してください。") : null;
  };

  let saved: Awaited<ReturnType<typeof createInquiry>>;
  try {
    const existing = await replay();
    if (existing) return existing;
    saved = await createInquiry({
      idempotencyKey: key, business: fields.business, category: `contact-${fields.business}`,
      locale: envelope.data.locale, sourcePath, payload: { ...fields, _contactDigest: digest },
      consentShare: "none", autoReplyStatus: fields.email ? "pending" : "skipped",
    });
    if (saved.duplicate) return await replay() ?? fail(503);
  } catch {
    // An uncertain DB outcome is not reported as success. Retrying the same key reconciles it.
    console.error("Contact save unconfirmed");
    return fail(503);
  }

  // Everything below is post-save: exceptions must not turn an accepted inquiry into a retry request.
  try {
    const mail: MailInquiry = {
      receiptNo: saved.inquiry.receiptNo, idempotencyKey: key,
      businessLabel: def.businessLabel, categoryLabel: def.label,
      name: fields.name, email: fields.email, phone: fields.phone, rows: def.rows(fields),
    };
    const [notification, reply] = await Promise.allSettled([sendOfficeNotification(mail), sendAutoReply(mail)]);
    const notifyStatus = notification.status === "fulfilled" ? notification.value : "failed";
    const autoReplyStatus = reply.status === "fulfilled" ? reply.value : "failed";
    if (notifyStatus === "failed") console.error("Contact notification unconfirmed", saved.inquiry.receiptNo);
    if (autoReplyStatus === "failed") console.error("Contact auto reply unconfirmed", saved.inquiry.receiptNo);
    try { await markNotification(saved.inquiry.id, { notifyStatus, autoReplyStatus }); }
    catch { console.error("Contact notification status unconfirmed", saved.inquiry.receiptNo); }
  } catch { console.error("Contact post-save notification unconfirmed", saved.inquiry.receiptNo); }
  // Existing one-year retention; maintenance failure never hides a newly saved receipt.
  try { await purgeExpiredInquiries(); }
  catch { console.error("Contact retention cleanup unconfirmed"); }
  return ok(saved.inquiry.receiptNo);
}
