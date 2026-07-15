import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Auth のアクセストークンを service role クライアントで検証する。
 * シグネチャは移行前の実装から不変（既存APIルートは無改修で動く）。
 */
export async function verifyAdminRequest(req: NextRequest) {
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

  return {
    uid: data.user.id,
    email: data.user.email ?? undefined,
  };
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
