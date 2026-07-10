"use client";

import { useState } from "react";
import {
  getTranslations,
  saveTranslations,
} from "@/lib/firestore/translations";
import { BRAND_LANGS_PATCHES } from "@/lib/data/translation-patches-brand-langs";
import type { LangCode } from "@/config/languages";

/**
 * 緊急修正E1/E3：Firestore翻訳のブランド統一＋言語数統一（2026-07-10 浦松承認）
 * - E1: 「四葉パートナーズ」→「四葉グループ」（en=「YOTSUBA GROUP」）。labor.*残存5キー×4ロケール
 * - E3: 「5言語」系→「4言語対応（日本語・英語・中国語繁体字・中国語簡体字）」統一（D2決定）。
 *   旧5言語列挙（台湾華語・タイ語等）も4言語列挙へ
 *
 * fix-josei-mentions と同方式：事前算出パッチ（translation-patches-brand-langs.ts）を
 * 適用直前に実際のFirestore値と照合してから書き換え。現在値が一致しない項目は
 * 安全のためスキップ（他の変更を巻き込まない）。保存はロケール単位で1回。
 * 退避＝_backup/20260710_translations/（適用前の全4ロケール実値＝fromの生成元）。
 */

const locales: { code: LangCode; label: string }[] = [
  { code: "ja", label: "ja" },
  { code: "en", label: "en" },
  { code: "zh-tw", label: "zh-tw" },
  { code: "zh", label: "zh" },
];

type FieldResult = {
  path: string;
  to: string;
  status: "pending" | "applied" | "skipped" | "error";
  detail?: string;
};

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
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

export default function FixBrandAndLangsPage() {
  const [running, setRunning] = useState<LangCode | null>(null);
  const [results, setResults] = useState<Record<string, FieldResult[]>>(
    Object.fromEntries(
      locales.map((l) => [
        l.code,
        BRAND_LANGS_PATCHES[l.code].map((p) => ({
          path: p.path,
          to: p.to,
          status: "pending" as const,
        })),
      ]),
    ),
  );

  const handleApply = async (locale: LangCode) => {
    setRunning(locale);
    const patches = BRAND_LANGS_PATCHES[locale];
    const data = (await getTranslations(locale)) ?? {};
    let working = data;
    const nextResults: FieldResult[] = [];

    for (const patch of patches) {
      const currentValue = getNestedValue(working, patch.path);
      if (currentValue !== patch.from) {
        nextResults.push({
          path: patch.path,
          to: patch.to,
          status: "skipped",
          detail: `現在値が想定と不一致のためスキップ: ${JSON.stringify(currentValue)}`,
        });
        continue;
      }
      working = setNestedValue(working, patch.path, patch.to);
      nextResults.push({ path: patch.path, to: patch.to, status: "applied" });
    }

    try {
      await saveTranslations(locale, working);
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [locale]: nextResults.map((r) =>
          r.status === "applied"
            ? { ...r, status: "error", detail: String(err) }
            : r,
        ),
      }));
      setRunning(null);
      return;
    }

    setResults((prev) => ({ ...prev, [locale]: nextResults }));
    setRunning(null);
  };

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">
        緊急修正E1/E3：「四葉パートナーズ」→「四葉グループ」＋言語数の4言語統一
      </h1>
      <p className="mb-6 text-sm text-text-muted">
        ロケールごとに「適用」を押すと、下記の項目を現在値と照合してから書き換えます。
        現在値が想定と違う項目は自動的にスキップされます（保存はロケール単位で1回）。
        対象はlabor.*のブランド残存キーと、5言語系表現の4言語統一（D2決定）です。
      </p>

      <div className="space-y-8">
        {locales.map((l) => (
          <div
            key={l.code}
            className="max-w-4xl rounded-xl border border-border bg-surface p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold">{l.label}</h2>
              <button
                onClick={() => handleApply(l.code)}
                disabled={
                  running !== null || BRAND_LANGS_PATCHES[l.code].length === 0
                }
                className="relative overflow-hidden rounded-lg px-5 py-1.5 text-sm font-semibold text-text disabled:opacity-50"
              >
                <span
                  className="pointer-events-none absolute inset-0 rounded-lg gradient-btn"
                  aria-hidden="true"
                />
                <span className="relative">
                  {running === l.code ? "適用中..." : "適用"}
                </span>
              </button>
            </div>

            <ul className="space-y-2">
              {results[l.code].map((r) => (
                <li
                  key={r.path}
                  className="rounded-lg bg-surface-dim px-3 py-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-text-muted">{r.path}</span>
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
                            : "未実行"}
                    </span>
                  </div>
                  <p className="mt-1 text-text">→ {r.to}</p>
                  {r.detail && <p className="mt-1 text-red-600">{r.detail}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
