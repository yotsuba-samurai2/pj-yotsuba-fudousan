"use client";

/**
 * admin画面用のAPIクライアント（旧: クライアントからFirestore直書き）。
 * Supabaseセッションの access_token を Bearer に付けて /api/admin/* を呼ぶ。
 * 関数名・呼び味は旧 src/lib/firestore/* と同一に保つ。
 */

import { getSupabaseClient } from "@/lib/supabase/client";
import type { LangCode } from "@/config/languages";
import type {
  AdminColumn,
  ColumnInput,
  ColumnStatus,
  ColumnTranslation,
  FirestoreColumn,
} from "@/lib/column-shared";

import { DEFAULT_AI_MODEL } from "@/lib/shared/ai";

export { DEFAULT_AI_MODEL };
export type { AdminColumn, ColumnInput, ColumnStatus, ColumnTranslation, FirestoreColumn };

/** 現在のSupabaseセッションのアクセストークン（未ログインなら null） */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await getSupabaseClient().auth.getSession();
  return data.session?.access_token ?? null;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `APIエラー (${res.status})`);
  }
  return (await res.json()) as T;
}

// ── Columns ──

/** 全コラム取得（ビジネス別、ステータス別） */
export async function getColumns(
  business?: string,
  status?: ColumnStatus,
): Promise<FirestoreColumn[]> {
  const params = new URLSearchParams();
  if (business) params.set("business", business);
  if (status) params.set("status", status);
  const qs = params.toString();
  const { columns } = await apiFetch<{ columns: FirestoreColumn[] }>(
    `/api/admin/columns${qs ? `?${qs}` : ""}`,
  );
  return columns;
}

/** ID でコラム取得 */
export async function getColumnById(id: string): Promise<FirestoreColumn | null> {
  const res = await fetch(`/api/admin/columns/${encodeURIComponent(id)}`, {
    headers: await authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `APIエラー (${res.status})`);
  }
  const { column } = (await res.json()) as { column: FirestoreColumn };
  return column;
}

/** コラム作成 */
export async function createColumn(data: ColumnInput): Promise<string> {
  const { id } = await apiFetch<{ id: string }>("/api/admin/columns", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return id;
}

/** コラム更新 */
export async function updateColumn(
  id: string,
  data: Partial<FirestoreColumn>,
): Promise<void> {
  await apiFetch(`/api/admin/columns/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/** コラム削除 */
export async function deleteColumn(id: string): Promise<void> {
  await apiFetch(`/api/admin/columns/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

/** slug基準の冪等upsert（(business, slug) のDBユニーク制約で保証） */
export async function upsertColumnBySlug(
  business: FirestoreColumn["business"],
  slug: string,
  data: ColumnInput,
): Promise<{ id: string; action: "created" | "updated" }> {
  return apiFetch<{ id: string; action: "created" | "updated" }>(
    "/api/admin/columns?upsert=1",
    {
      method: "POST",
      body: JSON.stringify({ ...data, business, slug }),
    },
  );
}

// ── Translations ──

/** UI翻訳データを取得 */
export async function getTranslations(
  locale: LangCode,
): Promise<Record<string, unknown> | null> {
  const { data } = await apiFetch<{ data: Record<string, unknown> | null }>(
    `/api/admin/translations?locale=${encodeURIComponent(locale)}`,
  );
  return data;
}

/** UI翻訳データを保存（ロケール全体を丸ごと上書き） */
export async function saveTranslations(
  locale: LangCode,
  data: Record<string, unknown>,
): Promise<void> {
  await apiFetch("/api/admin/translations", {
    method: "PUT",
    body: JSON.stringify({ locale, data }),
  });
}

// ── AI settings ──

/** 現在のAIモデルを取得。未設定・エラー時はデフォルト。 */
export async function getAiModel(): Promise<string> {
  try {
    const { model } = await apiFetch<{ model: string }>("/api/admin/ai-settings");
    return model || DEFAULT_AI_MODEL;
  } catch (err) {
    console.error("Failed to load AI model:", err);
    return DEFAULT_AI_MODEL;
  }
}

/** モデルを保存（updatedBy はサーバー側で検証済みユーザーのuidを記録） */
export async function setAiModel(model: string): Promise<void> {
  await apiFetch("/api/admin/ai-settings", {
    method: "PUT",
    body: JSON.stringify({ model }),
  });
}

// ── Upload ──

/** 画像をSupabase Storageへアップロードし公開URLを返す */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: await authHeaders(), // Content-Typeはブラウザが boundary 付きで自動設定
    body: formData,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `アップロードに失敗しました (${res.status})`);
  }
  const { url } = (await res.json()) as { url: string };
  return url;
}
