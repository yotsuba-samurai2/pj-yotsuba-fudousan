"use client";

import { useState } from "react";
import { getTranslations, saveTranslations } from "@/lib/admin-api";
import {
  normalizeNapAddress,
  NAP_BAD_VARIANTS,
  NAP_OFFICIAL,
} from "@/lib/data/nap-address-patches";
import type { LangCode } from "@/config/languages";

/**
 * NAP住所 正式表記への一括是正（2026-07-20 浦松指示）。
 * - 表示側UI翻訳（DB translationテーブル・4言語）の住所文字列を正式表記へ正規化。
 *   `小日向４丁目２－５ 小日向安田ビル ２０３`（全角－・半角スペース／labor 2F→203／英語はローマ字維持）。
 * - JSON-LD（seo.ts / office.ts）は既に正式表記のため対象外。
 * - 正規化はアンカー一致箇所のみ置換＝「小日向・茗荷谷駅…」等の近隣地名の言及は不変。
 * - 適用後、翻訳4言語を走査して残存変種を報告（0件になることを確認）。
 */

const locales: LangCode[] = ["ja", "en", "zh-tw", "zh"];

type Result = {
  locale: LangCode;
  status: "applied" | "nochange" | "error";
  changed: number;
  address?: { full?: string; street?: string; building?: string };
  detail?: string;
};
type ScanHit = { where: string; term: string; excerpt: string };

/** 値ツリーを再帰走査し、全文字列リーフを正規化。変更件数を数える */
function normalizeTree(node: unknown, onChange: (path: string) => void, prefix: string): unknown {
  if (typeof node === "string") {
    const next = normalizeNapAddress(node);
    if (next !== node) onChange(prefix);
    return next;
  }
  if (Array.isArray(node)) {
    return node.map((v, i) => normalizeTree(v, onChange, `${prefix}.${i}`));
  }
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = normalizeTree(v, onChange, `${prefix}.${k}`);
    return out;
  }
  return node;
}

/** 値ツリーを走査し、残ってはならない変種を含む文字列リーフを列挙 */
function scanTree(node: unknown, prefix: string, out: ScanHit[]) {
  if (typeof node === "string") {
    for (const term of NAP_BAD_VARIANTS) {
      const i = node.indexOf(term);
      if (i >= 0) {
        out.push({ where: prefix, term, excerpt: node.slice(Math.max(0, i - 16), i + term.length + 16) });
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

function getAddr(data: Record<string, unknown>) {
  const a = (data.address ?? {}) as Record<string, unknown>;
  return {
    full: typeof a.full === "string" ? a.full : undefined,
    street: typeof a.street === "string" ? a.street : undefined,
    building: typeof a.building === "string" ? a.building : undefined,
  };
}

export default function FixNapAddressPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [scanHits, setScanHits] = useState<ScanHit[] | null>(null);

  const run = async () => {
    setRunning(true);
    const out: Result[] = [];
    const hits: ScanHit[] = [];

    for (const loc of locales) {
      try {
        const data = (await getTranslations(loc)) ?? {};
        const working = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
        const changedPaths: string[] = [];
        const normalized = normalizeTree(working, (p) => changedPaths.push(p), `translations/${loc}`) as Record<
          string,
          unknown
        >;
        if (changedPaths.length > 0) {
          await saveTranslations(loc, normalized);
          out.push({ locale: loc, status: "applied", changed: changedPaths.length, address: getAddr(normalized) });
        } else {
          out.push({ locale: loc, status: "nochange", changed: 0, address: getAddr(normalized) });
        }
        scanTree(normalized, `translations/${loc}`, hits);
      } catch (e) {
        out.push({ locale: loc, status: "error", changed: 0, detail: String(e) });
      }
    }

    setResults(out);
    setScanHits(hits);
    setRunning(false);
  };

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">NAP住所 正式表記 一括是正</h1>
      <p className="mb-2 max-w-2xl text-sm text-text-muted">
        DB翻訳値（4言語）の住所を正式表記
        <span className="mx-1 font-mono">{NAP_OFFICIAL.streetJa} {NAP_OFFICIAL.buildingJa}</span>
        へ正規化します（全角「－」・番地/ビル名/部屋番号の半角スペース、labor「2F」→「203」、英語はローマ字維持）。
        近隣地名の言及（「小日向・茗荷谷駅…」等）は変更しません。適用後、残存変種を走査して下に報告します。
      </p>

      <button
        onClick={run}
        disabled={running}
        className="relative overflow-hidden rounded-lg px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
      >
        <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
        <span className="relative">{running ? "適用中..." : "一括正規化＋残存スキャン"}</span>
      </button>

      {results.length > 0 && (
        <ul className="mt-6 max-w-3xl space-y-2">
          {results.map((r) => (
            <li key={r.locale} className="rounded-lg bg-surface-dim px-3 py-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-text-muted">translations/{r.locale}</span>
                <span
                  className={
                    r.status === "applied"
                      ? "shrink-0 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700"
                      : r.status === "nochange"
                        ? "shrink-0 rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600"
                        : "shrink-0 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-600"
                  }
                >
                  {r.status === "applied" ? `是正 ${r.changed}件` : r.status === "nochange" ? "変更なし" : "エラー"}
                </span>
              </div>
              {r.address && (
                <div className="mt-1 space-y-0.5 font-mono text-text-muted">
                  <div>full: {r.address.full ?? "—"}</div>
                  <div>street: {r.address.street ?? "—"} / building: {r.address.building ?? "—"}</div>
                </div>
              )}
              {r.detail && <p className="mt-1 text-red-600">{r.detail}</p>}
            </li>
          ))}
        </ul>
      )}

      {scanHits !== null && (
        <div className="mt-8 max-w-3xl">
          <h2 className="text-base font-bold">残存スキャン結果：{scanHits.length}件</h2>
          <p className="mb-3 mt-1 text-xs text-text-muted">正規化後に残る非正式表記の一覧（翻訳4言語）。</p>
          {scanHits.length === 0 ? (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">残存なし（翻訳4言語）</p>
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
