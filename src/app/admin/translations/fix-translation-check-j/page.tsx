"use client";

import { useState } from "react";
import { getTranslations, saveTranslations } from "@/lib/admin-api";
import {
  applyJPatchesToLocale,
  J_PATCHES,
  type JChange,
} from "@/lib/data/translation-check-j-patches";
import type { LangCode } from "@/config/languages";

/**
 * 翻訳チェック §J（DB翻訳値）一括是正（2026-07-20 浦松の翻訳チェック結果）。
 * - J5（繁 資質→資格／證照）・J6（繁 定休日→公休日）・J7（簡 東→东）を
 *   ロケール限定＋キーパス・アンカー限定の部分文字列置換で是正（冪等）。
 * - まず「プレビュー（dry-run）」で変更点を確認 → 問題なければ「適用（保存）」。
 * - J4（英 legalNotice.items の "Chief"）は自動置換せず現行値を表示（管理エディタで手修正）。
 * - J9（コラム記事の社名）は翻訳辞書外＝本ルートの対象外。
 */

// パッチ対象ロケール（重複排除）
const TARGET_LOCALES = Array.from(new Set(J_PATCHES.map((p) => p.locale))) as LangCode[];

type LocalePreview = { locale: LangCode; changes: JChange[]; error?: string };

export default function FixTranslationCheckJPage() {
  const [running, setRunning] = useState(false);
  const [preview, setPreview] = useState<LocalePreview[] | null>(null);
  const [applied, setApplied] = useState(false);

  const runPreview = async () => {
    setRunning(true);
    setApplied(false);
    const rows: LocalePreview[] = [];
    for (const loc of TARGET_LOCALES) {
      try {
        const data = (await getTranslations(loc)) ?? {};
        const { changes } = applyJPatchesToLocale(loc, data);
        rows.push({ locale: loc, changes });
      } catch (e) {
        rows.push({ locale: loc, changes: [], error: String(e) });
      }
    }
    setPreview(rows);
    setRunning(false);
  };

  const runApply = async () => {
    setRunning(true);
    const rows: LocalePreview[] = [];
    for (const loc of TARGET_LOCALES) {
      try {
        const data = (await getTranslations(loc)) ?? {};
        const { tree, changes } = applyJPatchesToLocale(loc, data);
        if (changes.length > 0) await saveTranslations(loc, tree);
        rows.push({ locale: loc, changes });
      } catch (e) {
        rows.push({ locale: loc, changes: [], error: String(e) });
      }
    }
    setPreview(rows);
    setApplied(true);
    setRunning(false);
  };

  const totalChanges = preview?.reduce((n, r) => n + r.changes.length, 0) ?? 0;

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">翻訳チェック §J（DB値）一括是正</h1>
      <p className="mb-3 max-w-2xl text-sm text-text-muted">
        DB翻訳値の §J 項目を是正します（ロケール限定・キーパス限定の部分文字列置換＝冪等）。
        まず<strong>プレビュー</strong>で変更点を確認し、問題なければ<strong>適用</strong>してください。
        対象：{Array.from(new Set(J_PATCHES.map((p) => p.id.replace(/-.*/, "")))).join("・")}。
        J4 は「Chief …」を含む legalNotice の値全体を確定値へ置換します（whole）。J9（コラム社名）は
        翻訳辞書外＝対象外（/admin/columns で手修正）。
      </p>

      <div className="flex gap-3">
        <button
          onClick={runPreview}
          disabled={running}
          className="rounded-lg border border-border px-5 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          {running ? "実行中..." : "プレビュー（dry-run）"}
        </button>
        <button
          onClick={runApply}
          disabled={running || preview === null || totalChanges === 0 || applied}
          className="relative overflow-hidden rounded-lg px-5 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
          <span className="relative">{applied ? "適用済み" : "適用（保存）"}</span>
        </button>
      </div>

      {preview !== null && (
        <div className="mt-6 max-w-3xl">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-base font-bold">
              {applied ? "適用結果" : "プレビュー"}：変更 {totalChanges} 件
            </h2>
            {applied && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                保存済み
              </span>
            )}
          </div>

          {totalChanges === 0 ? (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
              対象の誤り表記は見つかりませんでした（既に是正済み、または該当なし）。
            </p>
          ) : (
            <ul className="space-y-2">
              {preview.flatMap((r) =>
                r.error
                  ? [
                      <li key={`${r.locale}-err`} className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                        <span className="font-mono">translations/{r.locale}</span>：{r.error}
                      </li>,
                    ]
                  : r.changes.map((c, i) => (
                      <li key={`${r.locale}-${i}`} className="rounded-lg bg-surface-dim px-3 py-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-text-muted">{c.path}</span>
                          <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
                            {c.patchId}
                          </span>
                        </div>
                        <div className="mt-1 space-y-0.5">
                          <div className="text-red-600">− {c.before}</div>
                          <div className="text-green-700">＋ {c.after}</div>
                        </div>
                      </li>
                    )),
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
