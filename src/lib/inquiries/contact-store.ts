import "server-only";
import { prisma } from "@/lib/prisma";

/** Server-only replay check. Never return payload or digest to the caller or logs. */
export async function findContactReceipt(idempotencyKey: string) {
  const row = await prisma.inquiry.findUnique({
    where: { idempotencyKey }, select: { receiptNo: true, payload: true },
  });
  if (!row) return null;
  const payload = row.payload as Record<string, unknown> | null;
  return { receiptNo: row.receiptNo, digest: payload?._contactDigest };
}
