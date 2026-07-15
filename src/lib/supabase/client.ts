"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * ブラウザ用 Supabase クライアント（Auth専用）のシングルトン。
 * DBアクセスはPrisma一本（設計書§3）のため、ここでは認証にしか使わない。
 */
let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
