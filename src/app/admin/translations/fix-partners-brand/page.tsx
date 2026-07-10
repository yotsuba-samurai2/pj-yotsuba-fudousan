"use client";

import { useMemo, useState } from "react";
import {
  getTranslations,
  saveTranslations,
} from "@/lib/firestore/translations";
import {
  PATCH_GROUPS,
  type PatchGroupId,
} from "@/lib/data/partners-brand-patches";
import type { LangCode } from "@/config/languages";

/**
 * 「四葉パートナーズ」表示層除去（翻訳データ）一括修正。
 *
 * 棚卸し正本: 四葉基幹CRM/Firestore翻訳棚卸し_四葉パートナーズ除去_v1.md
 * ルール: src/lib/data/partners-brand-patches.ts
 *
 * 動作: グループ（総称ブランド / 法務文書 / FAQ / labor）を選び、
 *  ①「プレビュー」で本番現在値から from→to を算出して表示（保存しない）
 *  ②「適用」でロケール単位に書き換えて保存（現在値が対象外/置換済なら自動スキップ）
 * saveTranslations はドキュメント全体上書き。適用前に現行JSONの退避を推奨。
 */

const locales: { code: LangCode; label: string }[] = [
  { code: "ja", label: "ja" },
  { code: "en", label: "en" },
  { code: "zh-tw", label: "zh-tw" },
  { code: "zh", label: "zh" },
];

type Row = {
  group: PatchGroupId;
  path: string;
  from: string;
  to: string;
  status: "preview" | "applied" | "skipped" | "error";
  detail?: string;
};

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const k of keys) {
    if (current && typeof current === "object" && k in (current as object)) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }
  return current;
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const clone = JSON.parse(JSON.stringify(obj));
  const keys = path.split(".");
  let current: Record<string, unknown> = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

/** 有効グループについて、現在の翻訳データから {path, from, to} を算出（to===from は除外） */
function computeRows(
  data: Record<string, unknown>,
  locale: LangCode,
  enabled: Set<PatchGroupId>,
): Row[] {
  const rows: Row[] = [];
  for (const g of PATCH_GROUPS) {
    if (!enabled.has(g.id)) continue;
    for (const key of g.keys) {
      const from = getNestedValue(data, key);
      if (typeof from !== "string") continue;
      const to = g.override ? g.override[locale] : g.replace ? g.replace(from) : from;
      if (to === from) continue;
      rows.push({ group: g.id, path: key, from, to, status: "preview" });
    }
  }
  return rows;
}

export default function FixPartnersBrandPage() {
  const [enabled, setEnabled] = useState<Set<PatchGroupId>>(
    new Set(PATCH_GROUPS.filter((g) => g.defaultOn).map((g) => g.id)),
  );
  const [running, setRunning] = useState<LangCode | "all" | null>(null);
  const [rows, setRows] = useState<Record<string, Row[]>>({});

  const toggle = (id: PatchGroupId) =>
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const totalPreview = useMemo(
    () => Object.values(rows).reduce((n, r) => n + r.length, 0),
    [rows],
  );

  const handlePreview = async (locale: LangCode) => {
    setRunning(locale);
    const data = (await getTranslations(locale)) ?? {};
    setRows((prev) => ({ ...prev, [locale]: computeRows(data, locale, enabled) }));
    setRunning(null);
  };

  const handlePreviewAll = async () => {
    setRunning("all");
    const next: Record<string, Row[]> = {};
    for (const l of locales) {
      const data = (await getTranslations(l.code)) ?? {};
      next[l.code] = computeRows(data, l.code, enabled);
    }
    setRows(next);
    setRunning(null);
  };

  const handleApply = async (locale: LangCode) => {
    setRunning(locale);
    const data = (await getTranslations(locale)) ?? {};
    let working = data;
    const applied: Row[] = [];
    for (const row of computeRows(data, locale, enabled)) {
      // 現在値を再照合（computeRows は現在値から算出しているので from は必ず一致するが、安全のため）
      const cur = getNestedValue(working, row.path);
      if (cur !== row.from) {
        applied.push({ ...row, status: "skipped", detail: `現在値不一致: ${JSON.stringify(cur)}` });
        continue;
      }
      working = setNestedValue(working, row.path, row.to);
      applied.push({ ...row, status: "applied" });
    }
    try {
      if (applied.some((r) => r.status === "applied")) {
        await saveTranslations(locale, working);
      }
    } catch (err) {
      setRows((prev) => ({
        ...prev,
        [locale]: applied.map((r) =>
          r.status === "applied" ? { ...r, status: "error", detail: String(err) } : r,
        ),
      }));
      setRunning(null);
      return;
    }
    setRows((prev) => ({ ...prev, [locale]: applied }));
    setRunning(null);
  };

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">「四葉パートナーズ」表示層除去（翻訳データ）</h1>
      <p className="mb-4 max-w-3xl text-sm text-text-muted">
        グループを選び、まず「プレビュー」で本番現在値から from→to を確認してから「適用」してください。
        現在値が対象外/既に置換済みの項目は自動スキップします。保存はロケール単位で1回（全体上書き）。
        <strong className="text-red-600">適用前に現行JSONの退避を推奨。</strong>
      </p>

      {/* グループ選択 */}
      <div className="mb-6 max-w-3xl space-y-2 rounded-xl border border-border bg-surface p-4">
        {PATCH_GROUPS.map((g) => (
          <label key={g.id} className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={enabled.has(g.id)}
              onChange={() => toggle(g.id)}
              className="mt-1"
            />
            <span>
              <span className="font-semibold">{g.label}</span>
              <span className="ml-2 text-xs text-text-muted">{g.note}</span>
            </span>
          </label>
        ))}
        <div className="pt-2">
          <button
            onClick={handlePreviewAll}
            disabled={running !== null}
            className="rounded-lg border border-border px-4 py-1.5 text-sm font-semibold disabled:opacity-50"
          >
            {running === "all" ? "プレビュー中..." : "全ロケール プレビュー"}
          </button>
          {totalPreview > 0 && (
            <span className="ml-3 text-xs text-text-muted">対象 {totalPreview} 件</span>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {locales.map((l) => (
          <div key={l.code} className="max-w-4xl rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold">
                {l.label}
                {rows[l.code] && (
                  <span className="ml-2 text-xs text-text-muted">{rows[l.code].length} 件</span>
                )}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePreview(l.code)}
                  disabled={running !== null}
                  className="rounded-lg border border-border px-4 py-1.5 text-sm font-semibold disabled:opacity-50"
                >
                  プレビュー
                </button>
                <button
                  onClick={() => handleApply(l.code)}
                  disabled={running !== null}
                  className="relative overflow-hidden rounded-lg px-5 py-1.5 text-sm font-semibold text-text disabled:opacity-50"
                >
                  <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
                  <span className="relative">{running === l.code ? "処理中..." : "適用"}</span>
                </button>
              </div>
            </div>

            <ul className="space-y-2">
              {(rows[l.code] ?? []).map((r) => (
                <li key={r.path} className="rounded-lg bg-surface-dim px-3 py-2 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-text-muted">
                      <span className="mr-2 rounded bg-surface px-1.5 py-0.5">{r.group}</span>
                      {r.path}
                    </span>
                    <span
                      className={
                        r.status === "applied"
                          ? "shrink-0 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700"
                          : r.status === "skipped"
                            ? "shrink-0 rounded-full bg-yellow-100 px-2 py-0.5 font-medium text-yellow-700"
                            : r.status === "error"
                              ? "shrink-0 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-600"
                              : "shrink-0 rounded-full bg-surface px-2 py-0.5 font-medium text-text-muted"
                      }
                    >
                      {r.status === "applied"
                        ? "適用済み"
                        : r.status === "skipped"
                          ? "スキップ"
                          : r.status === "error"
                            ? "エラー"
                            : "プレビュー"}
                    </span>
                  </div>
                  <p className="mt-1 text-text-muted line-through">{r.from}</p>
                  <p className="mt-0.5 text-text">→ {r.to}</p>
                  {r.detail && <p className="mt-1 text-red-600">{r.detail}</p>}
                </li>
              ))}
              {rows[l.code] && rows[l.code].length === 0 && (
                <li className="text-xs text-text-muted">対象なし（既に置換済み、またはグループ未選択）</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
