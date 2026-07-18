"use client";

import { useState } from "react";
import {
  getTranslations,
  saveTranslations,
  getColumns,
} from "@/lib/admin-api";
import {
  COMPLIANCE_TRANSLATION_PATCHES,
  COMPLIANCE_VALUE_PATCHES,
  COMPLIANCE_SCAN_TERMS,
} from "@/lib/data/compliance-patches";
import type { LangCode } from "@/config/languages";

/**
 * 表示コンプライアンス是正の一括適用（2026-07-19 浦松指示）。
 * - 翻訳データ：パッチのfrom値と現在値を照合してから書き換え（不一致はスキップ）
 *   ＝fix-sr-notation と同方式。同一キーに複数from候補あり（適用順の不確実性対策）。
 * - 適用後スキャン：翻訳4言語＋全コラムを禁止語リストで走査し、残存箇所を報告
 *   （レポートのみ・自動書き換えはしない。コラム本文等は編集判断が必要なため）。
 */

const locales: LangCode[] = ["ja", "en", "zh-tw", "zh"];

type Result = { label: string; status: "applied" | "skipped" | "error"; detail?: string };
type ScanHit = { where: string; term: string; excerpt: string };

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

/** 値ツリーを再帰走査し、値パッチ（完全一致）を適用。適用件数を返す */
function applyValuePatches(node: unknown, prefix: string, log: (path: string) => void): unknown {
  if (typeof node === "string") {
    const hit = COMPLIANCE_VALUE_PATCHES.find((p) => p.from === node);
    if (hit) {
      log(prefix);
      return hit.to;
    }
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((v, i) => applyValuePatches(v, `${prefix}.${i}`, log));
  }
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = applyValuePatches(v, `${prefix}.${k}`, log);
    return out;
  }
  return node;
}

/** 値ツリーを再帰走査して禁止語を含む文字列リーフを列挙 */
function scanTree(node: unknown, prefix: string, out: ScanHit[]) {
  if (typeof node === "string") {
    for (const term of COMPLIANCE_SCAN_TERMS) {
      const i = node.indexOf(term);
      if (i >= 0) {
        out.push({
          where: prefix,
          term,
          excerpt: node.slice(Math.max(0, i - 20), i + term.length + 20),
        });
      }
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => scanTree(v, `${prefix}.${i}`, out));
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) scanTree(v, `${prefix}.${k}`, out);
  }
}

export default function FixCompliancePage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [scanHits, setScanHits] = useState<ScanHit[] | null>(null);

  const run = async () => {
    setRunning(true);
    const out: Result[] = [];
    const hits: ScanHit[] = [];

    // ── 翻訳データ（locale単位で照合→保存→スキャン） ──
    for (const loc of locales) {
      const patches = COMPLIANCE_TRANSLATION_PATCHES[loc] ?? [];
      try {
        const data = (await getTranslations(loc)) ?? {};
        let working = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
        let applied = 0;
        for (const p of patches) {
          const cur = getNested(working, p.path);
          if (cur === p.to) continue; // 既適用（複数from候補の残りもここで消化）
          if (cur !== p.from) {
            out.push({ label: `${loc}:${p.path}`, status: "skipped", detail: "現在値が想定と不一致" });
            continue;
          }
          setNested(working, p.path, p.to);
          applied++;
        }
        // 値ベースパッチ（パス非依存・完全一致）＝パス特定できないキーの是正
        let valueApplied = 0;
        working = applyValuePatches(working, `translations/${loc}`, () => {
          valueApplied++;
        }) as Record<string, unknown>;
        if (applied + valueApplied > 0) await saveTranslations(loc, working);
        out.push({
          label: `translations/${loc}`,
          status: "applied",
          detail: `パス指定${applied}/${patches.length}件＋値一致${valueApplied}件適用`,
        });
        scanTree(working, `translations/${loc}`, hits);
      } catch (e) {
        out.push({ label: `translations/${loc}`, status: "error", detail: String(e) });
      }
    }

    // ── コラム残存スキャン（レポートのみ・書き換えない） ──
    try {
      const cols = await getColumns();
      for (const col of cols) {
        const c = col as unknown as Record<string, unknown>;
        scanTree(
          {
            title: c.title,
            excerpt: c.excerpt,
            content: c.content,
            faq: c.faq,
            translations: c.translations,
          },
          `columns/${String(c.slug ?? c.id)}`,
          hits,
        );
      }
    } catch (e) {
      out.push({ label: "columns/scan", status: "error", detail: String(e) });
    }

    setResults(out);
    setScanHits(hits);
    setRunning(false);
  };

  const total = Object.values(COMPLIANCE_TRANSLATION_PATCHES).flat().length;

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">表示コンプライアンス是正 一括適用</h1>
      <p className="mb-6 max-w-2xl text-sm text-text-muted">
        DB翻訳値の「ワンストップ／一站式／one-stop」等の業務混合表現と、
        「4カ国」等の国数表記（→中国・台湾・タイの具体列挙）を、
        4言語・計{total}件、現在値と照合してから書き換えます（不一致は自動スキップ）。
        適用後に翻訳データ全体と全コラムを走査し、残存箇所を下に報告します（報告のみ・自動書き換えなし）。
      </p>

      <button
        onClick={run}
        disabled={running}
        className="relative overflow-hidden rounded-lg px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
      >
        <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
        <span className="relative">{running ? "適用中..." : "一括適用＋残存スキャン"}</span>
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

      {scanHits !== null && (
        <div className="mt-8 max-w-3xl">
          <h2 className="text-base font-bold">
            残存スキャン結果：{scanHits.length}件
          </h2>
          <p className="mb-3 mt-1 text-xs text-text-muted">
            禁止語・国数表記を含む値の一覧（適用後の状態）。コラム本文等は文脈判断のうえ個別に是正してください。
          </p>
          {scanHits.length === 0 ? (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
              残存なし（翻訳4言語・全コラム）
            </p>
          ) : (
            <ul className="space-y-2">
              {scanHits.map((h, i) => (
                <li key={i} className="rounded-lg bg-surface-dim px-3 py-2 text-xs">
                  <div className="font-mono text-text-muted">{h.where}</div>
                  <div className="mt-1">
                    <span className="mr-2 rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-600">{h.term}</span>
                    <span className="text-text-muted">…{h.excerpt}…</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
