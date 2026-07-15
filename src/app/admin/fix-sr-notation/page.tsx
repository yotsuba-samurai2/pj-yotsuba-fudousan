"use client";

import { useState } from "react";
import {
  getTranslations,
  saveTranslations,
  getColumns,
  updateColumn,
  type FirestoreColumn,
} from "@/lib/admin-api";
import {
  SR_TRANSLATION_PATCHES,
  SR_COLUMN_PATCHES,
} from "@/lib/data/sr-notation-patches";
import type { LangCode } from "@/config/languages";

/**
 * 社労士「試験合格」表記・5カ国是正の一括適用
 * （社労士_試験合格表記_実装指示_v1 §4「fix-page方式」）。
 *
 * - 翻訳データ: パッチのfrom値と現在値を照合してから書き換え（不一致はスキップ）
 * - コラム2記事: find文字列の出現数が生成時と一致する場合のみ置換
 * 適用前にバックアップ取得済み（columns/translations全件 2026-07-08）。
 */

const locales: LangCode[] = ["ja", "en", "zh-tw", "zh"];

type Result = { label: string; status: "applied" | "skipped" | "error"; detail?: string };

function getNested(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((a, k) => {
    if (a && typeof a === "object") return (a as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}
function setNested(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

export default function FixSrNotationPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const run = async () => {
    setRunning(true);
    const out: Result[] = [];

    // ── 翻訳データ（locale単位で照合→保存） ──
    for (const loc of locales) {
      const patches = SR_TRANSLATION_PATCHES[loc] ?? [];
      if (!patches.length) continue;
      try {
        const data = (await getTranslations(loc)) ?? {};
        const working = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
        let applied = 0;
        for (const p of patches) {
          const cur = getNested(working, p.path);
          if (p.from === null) {
            if (cur === undefined) { setNested(working, p.path, p.to); applied++; }
            else if (cur === p.to) { /* 既適用 */ }
            else out.push({ label: `${loc}:${p.path}`, status: "skipped", detail: "新規キーだが既存値あり" });
            continue;
          }
          if (cur === p.to) continue; // 既適用
          if (cur !== p.from) {
            out.push({ label: `${loc}:${p.path}`, status: "skipped", detail: "現在値が想定と不一致" });
            continue;
          }
          setNested(working, p.path, p.to);
          applied++;
        }
        await saveTranslations(loc, working);
        out.push({ label: `translations/${loc}`, status: "applied", detail: `${applied}/${patches.length}件適用` });
      } catch (e) {
        out.push({ label: `translations/${loc}`, status: "error", detail: String(e) });
      }
    }

    // ── コラム（find出現数を照合→dot-pathでフィールド更新） ──
    for (const col of SR_COLUMN_PATCHES) {
      try {
        const all = await getColumns();
        const current = all.find((c) => c.id === col.id) as unknown as Record<string, unknown> | undefined;
        if (!current) {
          out.push({ label: `columns/${col.slug}`, status: "skipped", detail: "doc未発見" });
          continue;
        }
        const updates: Record<string, string> = {};
        let applied = 0;
        for (const p of col.patches) {
          const base = updates[p.path] ?? (getNested(current, p.path) as string | undefined);
          if (typeof base !== "string") {
            out.push({ label: `${col.slug}:${p.path}`, status: "skipped", detail: "文字列でない" });
            continue;
          }
          const count = base.split(p.find).length - 1;
          if (count === 0 && base.includes(p.replace)) continue; // 既適用
          if (count !== p.count) {
            out.push({ label: `${col.slug}:${p.path}`, status: "skipped", detail: `出現数不一致(実際${count}/想定${p.count})` });
            continue;
          }
          updates[p.path] = base.split(p.find).join(p.replace);
          applied++;
        }
        if (Object.keys(updates).length) {
          // 旧updateDoc(dot-path)相当: リーフを差し替えた上で、影響のある
          // トップレベルフィールドのみを送る（他フィールドは巻き込まない）
          const working = JSON.parse(JSON.stringify(current)) as Record<string, unknown>;
          for (const [path, value] of Object.entries(updates)) {
            setNested(working, path, value);
          }
          const payload: Record<string, unknown> = {};
          for (const key of new Set(Object.keys(updates).map((x) => x.split(".")[0]))) {
            payload[key] = working[key];
          }
          await updateColumn(col.id, payload as Partial<FirestoreColumn>);
        }
        out.push({ label: `columns/${col.slug}`, status: "applied", detail: `${applied}/${col.patches.length}件適用` });
      } catch (e) {
        out.push({ label: `columns/${col.slug}`, status: "error", detail: String(e) });
      }
    }

    setResults(out);
    setRunning(false);
  };

  const total =
    Object.values(SR_TRANSLATION_PATCHES).flat().length +
    SR_COLUMN_PATCHES.reduce((a, c) => a + c.patches.length, 0);

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">
        社労士「試験合格」表記・5カ国是正 一括適用
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-text-muted">
        翻訳データ4言語＋コラム2記事の計{total}
        件を、現在値と照合してから書き換えます（不一致は自動スキップ）。
        標準文言:「社会保険労務士試験合格（2026年9月開業予定）」
      </p>

      <button
        onClick={run}
        disabled={running}
        className="relative overflow-hidden rounded-lg px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
      >
        <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
        <span className="relative">{running ? "適用中..." : "一括適用"}</span>
      </button>

      {results.length > 0 && (
        <ul className="mt-6 max-w-3xl space-y-2">
          {results.map((r, i) => (
            <li key={i} className="rounded-lg bg-surface-dim px-3 py-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-text-muted">{r.label}</span>
                <span
                  className={
                    r.status === "applied"
                      ? "shrink-0 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700"
                      : r.status === "skipped"
                        ? "shrink-0 rounded-full bg-yellow-100 px-2 py-0.5 font-medium text-yellow-700"
                        : "shrink-0 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-600"
                  }
                >
                  {r.status === "applied" ? "適用" : r.status === "skipped" ? "スキップ" : "エラー"}
                </span>
              </div>
              {r.detail && <p className="mt-1 text-text-muted">{r.detail}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
