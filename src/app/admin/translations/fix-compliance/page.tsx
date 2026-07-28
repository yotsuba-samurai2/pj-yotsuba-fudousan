"use client";

import { useState } from "react";
import {
  getTranslations,
  saveTranslations,
  getColumns,
  updateColumn,
  getAccessToken,
  type FirestoreColumn,
} from "@/lib/admin-api";
import {
  COMPLIANCE_TRANSLATION_PATCHES,
  COMPLIANCE_VALUE_PATCHES,
  COMPLIANCE_SCAN_TERMS,
  COMPLIANCE_SCAN_EXCLUSIONS,
  COMPLIANCE_COLUMN_PATCHES,
  COLUMN_PATCH_FIELDS,
  type ColumnPatch,
  type ColumnPatchField,
} from "@/lib/data/compliance-patches";
import type { LangCode } from "@/config/languages";

/**
 * 表示コンプライアンス是正の一括適用（2026-07-19 浦松指示 / 2026-07-29 指示書10D で拡張）。
 * - 翻訳データ：パッチのfrom値と現在値を照合してから書き換え（不一致はスキップ）
 *   ＝fix-sr-notation と同方式。同一キーに複数from候補あり（適用順の不確実性対策）。
 * - コラム本文：ColumnPatch による部分一致置換。**ドライラン → 差分確認 → 適用** の3段。
 *   本番DBの書き換えのため、ドライランを経ずに適用ボタンは押せない（安全装置5-1）。
 * - 適用後スキャン：翻訳4言語＋全コラムを禁止語リストで走査し、残存箇所を報告。
 */

const locales: LangCode[] = ["ja", "en", "zh-tw", "zh"];
const TRANSLATION_LOCALES = ["en", "zh-tw", "zh"] as const;

/** 1コラムでこの件数を超えたら from が短すぎる可能性を警告する（安全装置5-4） */
const PER_COLUMN_WARN_THRESHOLD = 10;

type Result = { label: string; status: "applied" | "skipped" | "error"; detail?: string };
type ScanHit = { where: string; term: string; excerpt: string };

/** ドライランで検出した1置換 */
type ColumnDiff = {
  slug: string;
  columnId: string;
  /** "content" / "translations.en.excerpt" など */
  path: string;
  patchIndex: number;
  from: string;
  to: string;
  note?: string;
  /** この文字列での出現回数 */
  occurrences: number;
  beforeCtx: string;
  afterCtx: string;
};

/** ドライランの成果物。適用ボタンはこれが無いと押せない */
type DryRun = {
  diffs: ColumnDiff[];
  /** 1件もヒットしなかったパッチ（安全装置5-3） */
  unmatched: ColumnPatch[];
  /** slug ごとの置換件数（警告判定用） */
  perColumn: Record<string, number>;
  /** 適用時に PATCH する差分（columnId → 変更後フィールド） */
  updates: Array<{
    columnId: string;
    slug: string;
    business: string;
    data: Partial<FirestoreColumn>;
  }>;
  /** 退避用：対象コラムの現在値（安全装置5-2） */
  backup: FirestoreColumn[];
};

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

/** 文字列内で除外句が占める範囲（この中に落ちたヒットは報告しない） */
function excludedRanges(s: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  for (const ex of COMPLIANCE_SCAN_EXCLUSIONS) {
    let i = s.indexOf(ex);
    while (i >= 0) {
      ranges.push([i, i + ex.length]);
      i = s.indexOf(ex, i + ex.length);
    }
  }
  return ranges;
}

/** 値ツリーを再帰走査して禁止語を含む文字列リーフを列挙（全出現・除外句あり） */
function scanTree(node: unknown, prefix: string, out: ScanHit[]) {
  if (typeof node === "string") {
    const excluded = excludedRanges(node);
    for (const term of COMPLIANCE_SCAN_TERMS) {
      let i = node.indexOf(term);
      while (i >= 0) {
        const inExcluded = excluded.some(([s, e]) => i >= s && i + term.length <= e);
        if (!inExcluded) {
          out.push({
            where: prefix,
            term,
            excerpt: node.slice(Math.max(0, i - 20), i + term.length + 20),
          });
        }
        i = node.indexOf(term, i + term.length);
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

/**
 * 値ツリーを再帰走査し、部分一致で置換する（全出現）。
 * `replace()` は最初の1件しか置換しないため split().join() を使う
 * （正規表現にすると from に含まれる記号のエスケープが必要になる）。
 */
function applySubstringPatches(
  node: unknown,
  patches: Array<{ patch: ColumnPatch; index: number }>,
  prefix: string,
  log: (path: string, entry: { patch: ColumnPatch; index: number }, occurrences: number, beforeCtx: string, afterCtx: string) => void,
): unknown {
  if (typeof node === "string") {
    let s = node;
    for (const entry of patches) {
      const { from, to } = entry.patch;
      if (!from || !s.includes(from)) continue;
      const i = s.indexOf(from);
      const beforeCtx = s.slice(Math.max(0, i - 30), i + from.length + 30);
      const occurrences = s.split(from).length - 1;
      s = s.split(from).join(to);
      const j = Math.max(0, i);
      const afterCtx = s.slice(Math.max(0, j - 30), j + to.length + 30);
      log(prefix, entry, occurrences, beforeCtx, afterCtx);
    }
    return s;
  }
  if (Array.isArray(node)) {
    return node.map((v, i) => applySubstringPatches(v, patches, `${prefix}.${i}`, log));
  }
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = applySubstringPatches(v, patches, `${prefix}.${k}`, log);
    }
    return out;
  }
  return node;
}

/** そのコラム・そのフィールドに適用されるパッチを絞り込む */
function patchesFor(slug: string, field: ColumnPatchField) {
  return COMPLIANCE_COLUMN_PATCHES.map((patch, index) => ({ patch, index })).filter(
    ({ patch }) =>
      (patch.slug === "*" || patch.slug === slug) &&
      (!patch.fields || patch.fields.includes(field)),
  );
}

async function revalidateColumns(targets: Array<{ business: string; slug: string }>) {
  try {
    const token = await getAccessToken();
    const paths = new Set<string>();
    for (const { business, slug } of targets) {
      const businessPath = business === "realestate" ? "" : `/${business}`;
      paths.add(`${businessPath}/column`);
      paths.add(`${businessPath}/column/${slug}`);
      paths.add(`${businessPath}/sitemap.xml`);
    }
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ paths: [...paths] }),
    });
  } catch (err) {
    console.error("Revalidation failed:", err);
  }
}

export default function FixCompliancePage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [scanHits, setScanHits] = useState<ScanHit[] | null>(null);

  // ── コラム置換（3段） ──
  const [dryRunning, setDryRunning] = useState(false);
  const [applying, setApplying] = useState(false);
  const [dryRun, setDryRun] = useState<DryRun | null>(null);
  const [applyResults, setApplyResults] = useState<Result[] | null>(null);
  const [columnScanHits, setColumnScanHits] = useState<ScanHit[] | null>(null);

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

  /** (a) ドライラン：置換対象を洗い出すだけ。保存しない */
  const runDryRun = async () => {
    setDryRunning(true);
    setApplyResults(null);
    setColumnScanHits(null);
    try {
      const cols = await getColumns();
      const diffs: ColumnDiff[] = [];
      const matchedPatchIndexes = new Set<number>();
      const perColumn: Record<string, number> = {};
      const updates: DryRun["updates"] = [];
      const backup: FirestoreColumn[] = [];

      for (const col of cols) {
        const slug = col.slug;
        const columnId = col.id;
        const data: Partial<FirestoreColumn> = {};
        let changedHere = 0;

        // prefix は再帰先の実パス（faq なら "faq.0.answer" まで入る）
        const record =
          () =>
          (
            prefix: string,
            entry: { patch: ColumnPatch; index: number },
            occurrences: number,
            beforeCtx: string,
            afterCtx: string,
          ) => {
            matchedPatchIndexes.add(entry.index);
            changedHere += occurrences;
            diffs.push({
              slug,
              columnId,
              path: prefix,
              patchIndex: entry.index,
              from: entry.patch.from,
              to: entry.patch.to,
              note: entry.patch.note,
              occurrences,
              beforeCtx,
              afterCtx,
            });
          };

        // 日本語（トップレベルのフィールド）
        for (const field of COLUMN_PATCH_FIELDS) {
          const patches = patchesFor(slug, field);
          if (patches.length === 0) continue;
          const before = col[field];
          if (before === undefined || before === null) continue;
          const after = applySubstringPatches(before, patches, field, record());
          if (JSON.stringify(after) !== JSON.stringify(before)) {
            (data as Record<string, unknown>)[field] = after;
          }
        }

        // 翻訳版（translations.<locale>.<field>）。日本語の from が翻訳版に無いのは正常
        if (col.translations) {
          const nextTranslations = JSON.parse(
            JSON.stringify(col.translations),
          ) as NonNullable<FirestoreColumn["translations"]>;
          let translationsChanged = false;
          for (const loc of TRANSLATION_LOCALES) {
            const t = nextTranslations[loc];
            if (!t) continue;
            for (const field of COLUMN_PATCH_FIELDS) {
              const patches = patchesFor(slug, field);
              if (patches.length === 0) continue;
              const before = (t as Record<string, unknown>)[field];
              if (before === undefined || before === null) continue;
              const path = `translations.${loc}.${field}`;
              const after = applySubstringPatches(before, patches, path, record());
              if (JSON.stringify(after) !== JSON.stringify(before)) {
                (t as Record<string, unknown>)[field] = after;
                translationsChanged = true;
              }
            }
          }
          if (translationsChanged) data.translations = nextTranslations;
        }

        if (Object.keys(data).length > 0) {
          perColumn[slug] = changedHere;
          updates.push({ columnId, slug, business: col.business, data });
          backup.push(col);
        }
      }

      const unmatched = COMPLIANCE_COLUMN_PATCHES.filter((_, i) => !matchedPatchIndexes.has(i));
      setDryRun({ diffs, unmatched, perColumn, updates, backup });
    } catch (e) {
      setDryRun(null);
      setApplyResults([{ label: "columns/dry-run", status: "error", detail: String(e) }]);
    }
    setDryRunning(false);
  };

  /** (c) 適用：1コラムずつ保存。失敗したらそこで止める（安全装置5-5） */
  const applyColumnPatches = async () => {
    if (!dryRun) return; // 安全装置5-1（UI側でも disabled）
    setApplying(true);
    const out: Result[] = [];
    const done: Array<{ business: string; slug: string }> = [];

    for (const u of dryRun.updates) {
      try {
        await updateColumn(u.columnId, u.data);
        done.push({ business: u.business, slug: u.slug });
        out.push({
          label: `columns/${u.slug}`,
          status: "applied",
          detail: `${Object.keys(u.data).join(", ")} を更新`,
        });
      } catch (e) {
        out.push({ label: `columns/${u.slug}`, status: "error", detail: `${String(e)}／ここで中断しました` });
        break;
      }
    }

    if (done.length > 0) await revalidateColumns(done);

    // 適用後の再スキャン
    const hits: ScanHit[] = [];
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
      setColumnScanHits(hits);
    } catch (e) {
      out.push({ label: "columns/rescan", status: "error", detail: String(e) });
    }

    setApplyResults(out);
    setDryRun(null); // 適用済み。再度押すにはドライランからやり直す
    setApplying(false);
  };

  /** 安全装置5-2：適用前に対象コラムの現在値をJSONで退避 */
  const downloadBackup = () => {
    if (!dryRun) return;
    const blob = new Blob([JSON.stringify(dryRun.backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `columns-backup-${dryRun.backup.length}件.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const total = Object.values(COMPLIANCE_TRANSLATION_PATCHES).flat().length;
  const warnColumns = dryRun
    ? Object.entries(dryRun.perColumn).filter(([, n]) => n > PER_COLUMN_WARN_THRESHOLD)
    : [];

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
            固有名詞「東京開業ワンストップセンター（TOSBEC）」は除外しています。
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

      {/* ───────── コラム本文の一括置換（ドライラン → 差分確認 → 適用） ───────── */}
      <hr className="my-10 max-w-3xl border-border" />

      <h2 className="mb-1 text-lg font-bold">コラム本文の一括置換</h2>
      <p className="mb-4 max-w-2xl text-sm text-text-muted">
        コラム本文は長文のため完全一致では置換できません。ここでは
        <strong className="text-text">部分一致</strong>で
        {COMPLIANCE_COLUMN_PATCHES.length}件のパッチを適用します（日本語＋翻訳版の
        title / excerpt / content / faq を走査）。
        <strong className="text-text">
          本番DBの書き換えのため、必ずドライランで差分を確認してから適用してください。
        </strong>
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={runDryRun}
          disabled={dryRunning || applying}
          className="rounded-lg border border-border px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          {dryRunning ? "照合中..." : "コラム置換：ドライラン"}
        </button>
        <button
          onClick={downloadBackup}
          disabled={!dryRun || dryRun.updates.length === 0}
          className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-muted disabled:opacity-40"
        >
          現在値をJSONで退避
        </button>
        <button
          onClick={applyColumnPatches}
          disabled={!dryRun || dryRun.updates.length === 0 || applying}
          className="relative overflow-hidden rounded-lg px-6 py-2 text-sm font-semibold text-text disabled:opacity-40"
        >
          <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
          <span className="relative">{applying ? "適用中..." : "この内容で適用する"}</span>
        </button>
      </div>
      {!dryRun && !applyResults && (
        <p className="mt-2 text-xs text-text-muted">
          ※「適用する」はドライラン実行後にのみ押せます。
        </p>
      )}

      {dryRun && (
        <div className="mt-6 max-w-3xl">
          <h3 className="text-base font-bold">
            ドライラン結果：{dryRun.diffs.length}箇所／{dryRun.updates.length}コラム
          </h3>

          {warnColumns.length > 0 && (
            <div className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
              <strong>警告：</strong>次のコラムで置換が{PER_COLUMN_WARN_THRESHOLD}件を超えました。
              from が短すぎる可能性があります。差分を必ず確認してください。
              <ul className="mt-1 list-inside list-disc font-mono">
                {warnColumns.map(([slug, n]) => (
                  <li key={slug}>
                    {slug}：{n}件
                  </li>
                ))}
              </ul>
            </div>
          )}

          {dryRun.unmatched.length > 0 && (
            <div className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
              <strong>不一致スキップ：{dryRun.unmatched.length}件</strong>
              <p className="mt-1">
                下記の from はどのコラムにも見つかりませんでした。
                取得後に本文が編集された可能性があります（近い文字列に合わせず、内容を確認してください）。
              </p>
              <ul className="mt-2 space-y-1">
                {dryRun.unmatched.map((p, i) => (
                  <li key={i} className="rounded bg-white/60 px-2 py-1">
                    <span className="font-mono">{p.slug}</span>
                    {p.note && <span className="ml-2 text-yellow-700">（{p.note}）</span>}
                    <div className="mt-0.5 break-all">from:「{p.from}」</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {dryRun.diffs.length === 0 ? (
            <p className="mt-3 rounded-lg bg-surface-dim px-3 py-2 text-xs text-text-muted">
              置換対象はありません（すべて適用済みか、本文が変更されています）。
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {dryRun.diffs.map((d, i) => (
                <li key={i} className="rounded-lg bg-surface-dim px-3 py-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-text">{d.slug}</span>
                    <span className="rounded bg-white/60 px-1.5 py-0.5 font-mono text-text-muted">
                      {d.path}
                    </span>
                    {d.occurrences > 1 && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700">
                        {d.occurrences}箇所
                      </span>
                    )}
                  </div>
                  {d.note && <p className="mt-1 text-text-muted">{d.note}</p>}
                  <div className="mt-2 rounded bg-red-50 px-2 py-1 text-red-800">
                    <span className="mr-1 font-semibold">変更前</span>…{d.beforeCtx}…
                  </div>
                  <div className="mt-1 rounded bg-green-50 px-2 py-1 text-green-800">
                    <span className="mr-1 font-semibold">変更後</span>…{d.afterCtx}…
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {applyResults && (
        <div className="mt-6 max-w-3xl">
          <h3 className="text-base font-bold">適用結果</h3>
          <ul className="mt-2 space-y-2">
            {applyResults.map((r, i) => (
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

          {columnScanHits !== null && (
            <div className="mt-6">
              <h3 className="text-base font-bold">適用後のコラム残存スキャン：{columnScanHits.length}件</h3>
              {columnScanHits.length === 0 ? (
                <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                  残存なし（全コラム）
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {columnScanHits.map((h, i) => (
                    <li key={i} className="rounded-lg bg-surface-dim px-3 py-2 text-xs">
                      <div className="font-mono text-text-muted">{h.where}</div>
                      <div className="mt-1">
                        <span className="mr-2 rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-600">
                          {h.term}
                        </span>
                        <span className="text-text-muted">…{h.excerpt}…</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
