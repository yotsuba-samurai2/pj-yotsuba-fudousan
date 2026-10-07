import { createHash, timingSafeEqual } from "node:crypto";

/**
 * 自動処理（GitHub Actions など）から呼ぶAPIの認証。人のログイン（Supabase）を使わない経路用。
 *
 * 合言葉は Vercel の環境変数と GitHub の Secrets に同じ値を入れる。
 * 最低32文字（`openssl rand -hex 32` なら64文字）。短い値は設定ミスとして拒否する。
 */
export const CRON_SECRET_MIN_LENGTH = 32;

/**
 * `Authorization: Bearer <合言葉>` を確かめる。
 * - 合言葉が未設定・短すぎるときは常に拒否する（設定漏れで誰でも呼べる状態を作らない）
 * - 長さの違いで比較時間が変わらないよう、両方を SHA-256 にしてから timingSafeEqual で比べる
 */
export function isAuthorizedBearer(
  authorization: string | null,
  secret: string | undefined,
): boolean {
  if (!secret || secret.length < CRON_SECRET_MIN_LENGTH) return false;
  if (!authorization?.startsWith("Bearer ")) return false;
  const given = createHash("sha256").update(authorization.slice("Bearer ".length)).digest();
  const expected = createHash("sha256").update(secret).digest();
  return timingSafeEqual(given, expected);
}
