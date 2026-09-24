import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { INQUIRY_RETENTION_DAYS } from "@/lib/shared/inquiry-intake";
import { generateReceiptNo } from "./receipt";

/**
 * 受付の保存層（inquiries）。個人情報を含むので、呼び出し側は画面・ログに中身を出さないこと。
 * 保存に成功した時点で受付成功。通知・自動返信の結果は markNotification で後から記録する。
 */
export type NewInquiry = {
  idempotencyKey: string;
  business: string;
  category: string;
  locale: string;
  sourcePath: string;
  payload: Record<string, unknown>;
  consentShare: "none" | "granted";
  autoReplyStatus: "pending" | "skipped";
};
export type NotificationStatus = { notifyStatus: "sent" | "failed"; autoReplyStatus?: "sent" | "failed" | "skipped" };

const DAY_MS = 86_400_000;
const isUniqueViolation = (e: unknown) => e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

export function findInquiryByKey(idempotencyKey: string) {
  return prisma.inquiry.findUnique({ where: { idempotencyKey }, select: { id: true, receiptNo: true } });
}

/**
 * 受付を1件保存する。同じ idempotencyKey がすでにあれば、その受付を duplicate として返す（保存・送信をやり直さない）。
 * 受付番号が偶然重なった場合は作り直す。
 */
export async function createInquiry(data: NewInquiry, now = new Date()): Promise<{ inquiry: { id: string; receiptNo: string }; duplicate: boolean }> {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const inquiry = await prisma.inquiry.create({
        data: {
          receiptNo: generateReceiptNo(now),
          idempotencyKey: data.idempotencyKey,
          business: data.business,
          category: data.category,
          locale: data.locale,
          sourcePath: data.sourcePath,
          payload: data.payload as Prisma.InputJsonValue,
          consentShare: data.consentShare,
          notifyStatus: "pending",
          autoReplyStatus: data.autoReplyStatus,
        },
        select: { id: true, receiptNo: true },
      });
      return { inquiry, duplicate: false };
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      // 同時に同じ送信が来た場合は、先に保存された受付を返す。そうでなければ受付番号の重なりなので作り直す。
      const existing = await findInquiryByKey(data.idempotencyKey);
      if (existing) return { inquiry: existing, duplicate: true };
    }
  }
  throw new Error("receipt number could not be allocated");
}

export async function markNotification(id: string, status: NotificationStatus) {
  await prisma.inquiry.update({ where: { id }, data: status });
}

export function retentionCutoff(now = new Date()) {
  return new Date(now.getTime() - INQUIRY_RETENTION_DAYS * DAY_MS);
}

/** 保存期間（1年）を過ぎた受付を削除する。受付の保存時と管理画面の一覧表示時に呼ぶ。 */
export async function purgeExpiredInquiries(now = new Date()) {
  const result = await prisma.inquiry.deleteMany({ where: { createdAt: { lt: retentionCutoff(now) } } });
  return result.count;
}

export function listInquiries(take = 200) {
  return prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take,
    select: { id: true, receiptNo: true, category: true, createdAt: true, notifyStatus: true, autoReplyStatus: true, consentShare: true, payload: true },
  });
}

export function getInquiry(id: string) {
  return prisma.inquiry.findUnique({ where: { id } });
}
