/**
 * next/image で最適化してよい外部画像の置き場所。
 *
 * next.config.ts の images.remotePatterns と、描画側の判定（isOptimizableImageUrl）が
 * 同じ定義を参照する。ずれると next/image が未許可ホストで例外を投げ、ページごと落ちる。
 *
 * 2026-09-23：物件一覧のサムネイル（160×120）に元写真（最大3.8MB）をそのまま
 * 読み込んでおり、/bukken が1回で約9.9MBになっていた（Lighthouse モバイル実測）。
 *
 * 自社の Supabase Storage の公開バケットだけに絞る。`*.supabase.co` のような広い指定は、
 * 第三者が /_next/image 経由で他人の画像を変換させられる（＝当社の変換枠を消費する）ため避ける。
 * この相対 import だけで完結させる（next.config.ts から読むため @/ エイリアスを使わない）。
 */
const DEFAULT_SUPABASE_URL = "https://lxsnklqwysakhnmvdivh.supabase.co";

function supabaseHost(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  try {
    return new URL(raw).hostname;
  } catch {
    return new URL(DEFAULT_SUPABASE_URL).hostname;
  }
}

export const SUPABASE_PUBLIC_PATH = "/storage/v1/object/public/";

export const OPTIMIZABLE_IMAGE_HOSTS: readonly string[] = [supabaseHost()];

/** remotePatterns 用（next.config.ts から参照） */
export const OPTIMIZABLE_REMOTE_PATTERNS = OPTIMIZABLE_IMAGE_HOSTS.map((hostname) => ({
  protocol: "https" as const,
  hostname,
  pathname: `${SUPABASE_PUBLIC_PATH}**`,
}));

/** この URL を next/image に渡してよいか（remotePatterns と同じ条件） */
export function isOptimizableImageUrl(url: string): boolean {
  if (url.startsWith("/")) return !url.startsWith("//");
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      OPTIMIZABLE_IMAGE_HOSTS.includes(u.hostname) &&
      u.pathname.startsWith(SUPABASE_PUBLIC_PATH)
    );
  } catch {
    return false;
  }
}
