import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

/**
 * Supabase Auth のアクセストークンを service role クライアントで検証する。
 * 確認済みメールがサーバー設定の許可リストにある利用者だけを通す。
 * ADMIN_OPERATOR_EMAILS未設定・不正は閉じる。公開前に承認済み管理者を設定すること。
 */
export async function verifyAdminRequest(req: NextRequest): Promise<{ uid: string; email: string | undefined }> {
  const user = await verifiedUser(req);
  const operators = (process.env.ADMIN_OPERATOR_EMAILS ?? "").split(",").map(v => v.trim().toLowerCase());
  if (operators.some(v => !z.string().email().safeParse(v).success)) {
    throw new AuthError("管理者の許可設定が不足しています", 503);
  }
  if (!user.email || !user.email_confirmed_at || !operators.includes(user.email.toLowerCase())) {
    throw new AuthError("管理操作を行う権限がありません", 403);
  }
  return {
    uid: user.id,
    email: user.email ?? undefined,
  };
}

/**
 * 受付（inquiries・個人情報）を閲覧できるのは、この受付先メールの所有者だけ（浦松判断 2026-09-24）。
 * 通知の宛先（contact-mail.ts の NOTIFY_TO）とは役割が違うので、別の定数にしている。
 */
export const INQUIRY_OWNER_EMAIL = "uramatsujoji@luck428.com";

/**
 * 受付の閲覧・再送用の認証。ログインしていることに加えて、次の2つを満たす場合だけ通す。
 * - Supabase の利用者情報のメールが INQUIRY_OWNER_EMAIL と一致する
 * - そのメールアドレスの確認が済んでいる（email_confirmed_at がある）＝アドレスの所有を確認済み
 * 一般管理者の許可リストとは独立し、受付の閲覧権限を広げない。
 */
export async function verifyInquiryOwner(req: NextRequest) {
  const user = await verifiedUser(req);
  if (user.email?.toLowerCase() !== INQUIRY_OWNER_EMAIL || !user.email_confirmed_at) {
    throw new AuthError("受付を閲覧する権限がありません", 403);
  }
  return { uid: user.id, email: user.email };
}

async function verifiedUser(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AuthError("認証トークンがありません", 401);
  }

  const token = authHeader.slice(7);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new AuthError("認証サーバーの設定が不足しています", 500);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    throw new AuthError("無効な認証トークンです", 401);
  }
  return data.user;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}
