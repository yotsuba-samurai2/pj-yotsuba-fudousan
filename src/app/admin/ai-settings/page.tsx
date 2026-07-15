"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getAiModel,
  setAiModel,
  getAccessToken,
  DEFAULT_AI_MODEL,
} from "@/lib/admin-api";

type ModelOption = {
  id: string;
  display_name: string;
};

export default function AiSettingsPage() {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selected, setSelected] = useState<string>(DEFAULT_AI_MODEL);
  const [initialModel, setInitialModel] = useState<string>(DEFAULT_AI_MODEL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const current = await getAiModel();
      setSelected(current);
      setInitialModel(current);

      const token = await getAccessToken();
      const res = await fetch("/api/admin/ai-models", {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "モデル一覧の取得に失敗しました");
      }
      const data = (await res.json()) as { models: ModelOption[] };
      setModels(data.models);
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSave = async () => {
    const token = await getAccessToken();
    if (!token) {
      setError("認証されていません");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await setAiModel(selected);
      setInitialModel(selected);
      setMessage("保存しました");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const dirty = selected !== initialModel;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-2xl p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-text">AIモデル管理</h1>
          <p className="mt-1 text-sm text-text-muted">
            コラムの翻訳・SEO生成に使用するClaudeモデルを選択します。
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-text-muted">読み込み中...</p>
        ) : (
          <div className="space-y-4 rounded-lg border border-border bg-surface p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                使用モデル
              </label>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={saving}
              >
                {models.length === 0 && (
                  <option value={selected}>{selected}</option>
                )}
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.display_name} ({m.id})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-text-muted">
                デフォルト: {DEFAULT_AI_MODEL}
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            {message && (
              <p className="text-sm text-green-600">{message}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={loadAll}
                disabled={saving}
                className="rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:bg-surface-dim disabled:opacity-50"
              >
                再読み込み
              </button>
              <button
                onClick={handleSave}
                disabled={!dirty || saving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
