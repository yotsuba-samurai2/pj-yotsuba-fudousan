import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * 受付（inquiries・個人情報）を閲覧できるのは、この受付先メールの所有者だけ（浦松判断 2026-09-24）。
 * 通知の宛先（contact-mail.ts の NOTIFY_TO）とは役割が違うので、別の定数にしている。
 */
export const INQUIRY_OWNER_EMAIL = "uramatsujoji@luck428.com";

/**
 * 管理APIを使える利用者のメールアドレス（小文字で比較）。
 * 受付先メールの所有者は常に含める。追加するときは Vercel の環境変数 ADMIN_EMAILS に
 * カンマ区切りで入れる（例: `a@luck428.com,b@luck428.com`）。
 *
 * 背景（安全性調査 2026-10-22）：Supabase Auth はメールでの新規登録を受け付けており、
 * 以前の verifyAdminRequest は「ログイン済みか」しか見ていなかった。そのため第三者が
 * 自分のメールで登録すれば、コラム・物件・AI設定・画像の管理APIを呼べる状態だった。
 * 新規登録の停止（Supabase ダッシュボード側）とあわせて、APIでも利用者を限定する。
 */
export function adminEmails(): Set<string> {
  const extra = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return new Set([INQUIRY_OWNER_EMAIL, ...extra]);
}

/**
 * 管理API用の認証。ログインしていることに加えて、次の2つを満たす場合だけ通す。
 * - Supabase の利用者情報のメールが adminEmails() に含まれる
 * - そのメールアドレスの確認が済んでいる（email_confirmed_at がある）
 * 戻り値のシグネチャは移行前の実装から不変（既存APIルートは無改修で動く）。
 */
export async function verifyAdminRequest(req: NextRequest) {
  const user = await verifiedUser(req);
  const email = user.email?.toLowerCase();
  if (!email || !adminEmails().has(email) || !user.email_confirmed_at) {
    throw new AuthError("管理画面を利用する権限がありません", 403);
  }
  return {
    uid: user.id,
    email: user.email ?? undefined,
  };
}

/**
 * 受付の閲覧・再送用の認証。ログインしていることに加えて、次の2つを満たす場合だけ通す。
 * - Supabase の利用者情報のメールが INQUIRY_OWNER_EMAIL と一致する
 * - そのメールアドレスの確認が済んでいる（email_confirmed_at がある）＝アドレスの所有を確認済み
 * 既存の管理APIが使う verifyAdminRequest の挙動は変えない。
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
