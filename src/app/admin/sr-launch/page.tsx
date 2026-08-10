"use client";

import { useState } from "react";
import {
  getAccessToken,
  getTranslations,
  saveTranslations,
  getColumns,
  updateColumn,
  type FirestoreColumn,
} from "@/lib/admin-api";
import {
  REGISTRATION_NUMBER,
  IS_PLACEHOLDER,
  SR_LAUNCH_TRANSLATION_PATCHES,
  SR_LAUNCH_COLUMN_PATCHES,
  SR_LAUNCH_SCAN_TERMS,
  SR_LAUNCH_KEEP_AS_IS,
  type SrLaunchColumnPatch,
} from "@/lib/data/sr-launch-patches";
import type { LangCode } from "@/config/languages";

/**
 * 社会保険労務士 開業版パッチの適用（2026年9月1日／登録日）。
 *
 * ■ /admin/fix-sr-notation との違い
 *   あちらは from→to の一方向で、7月8日に「三士業表示 → 二士業表示」を適用した。
 *   **逆に流すことはできない。** 本画面が開業版（二士業 → 三士業）を担う。
 *
 * ■ 安全装置
 *   5-0 REGISTRATION_NUMBER がプレースホルダーのままなら適用させない ← 本画面で新設
 *   5-1 ドライランを経ずに適用ボタンを押せない
 *   5-2 対象の現在値をJSONで退避できる
 *   5-3 1件も一致しなかったパッチを明示的に報告する
 *   5-4 1コラムで閾値を超える置換が起きたら警告する
 *   5-5 1件ずつ保存し、失敗したらそこで止める
 *   5-6 「残すべき文字列」が消えていないかを適用後に検査する ← 本画面で新設
 */

const LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];
const PER_COLUMN_WARN_THRESHOLD = 10;
const FIELDS = ["title", "excerpt", "content", "faq", "keywords"] as const;

type Result = { label: string; status: "applied" | "skipped" | "error"; detail?: string };
type ScanHit = { where: string; term: string; excerpt: string };

type ColumnDiff = {
  slug: string;
  path: string;
  from: string;
  to: string;
  note?: string;
  occurrences: number;
  beforeCtx: string;
};

type DryRun = {
  diffs: ColumnDiff[];
  unmatched: SrLaunchColumnPatch[];
  perColumn: Record<string, number>;
  updates: Array<{ columnId: string; slug: string; business: string; data: Partial<FirestoreColumn> }>;
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
    if (typeof cur[keys[i]] !== "object" || cur[keys[i]] === null) cur[keys[i]] = {};
    cur = cur[keys[i]] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

/** 部分一致で全出現を置換する。replace() は最初の1件しか置換しないため split().join() を使う */
function applySubstring(
  node: unknown,
  patches: Array<{ patch: SrLaunchColumnPatch; index: number }>,
  prefix: string,
  log: (path: string, e: { patch: SrLaunchColumnPatch; index: number }, occ: number, ctx: string) => void,
): unknown {
  if (typeof node === "string") {
    let s = node;
    for (const entry of patches) {
      const { from, to } = entry.patch;
      if (!from || !s.includes(from)) continue;
      const i = s.indexOf(from);
      const ctx = s.slice(Math.max(0, i - 30), i + from.length + 30);
      const occ = s.split(from).length - 1;
      s = s.split(from).join(to);
      log(prefix, entry, occ, ctx);
    }
    return s;
  }
  if (Array.isArray(node)) return node.map((v, i) => applySubstring(v, patches, `${prefix}.${i}`, log));
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = applySubstring(v, patches, `${prefix}.${k}`, log);
    return out;
  }
  return node;
}

function scanTree(node: unknown, where: string, hits: ScanHit[]) {
  if (typeof node === "string") {
    for (const term of SR_LAUNCH_SCAN_TERMS) {
      const i = node.indexOf(term);
      if (i >= 0) hits.push({ where, term, excerpt: node.slice(Math.max(0, i - 40), i + term.length + 40) });
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => scanTree(v, `${where}.${i}`, hits));
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) scanTree(v, `${where}.${k}`, hits);
  }
}

function countKeep(node: unknown, counts: Record<string, number>) {
  if (typeof node === "string") {
    for (const k of SR_LAUNCH_KEEP_AS_IS) {
      const n = node.split(k).length - 1;
      if (n) counts[k] = (counts[k] ?? 0) + n;
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v) => countKeep(v, counts));
    return;
  }
  if (node && typeof node === "object") for (const v of Object.values(node)) countKeep(v, counts);
}

async function revalidate(targets: Array<{ business: string; slug: string }>) {
  try {
    const token = await getAccessToken();
    const paths = new Set<string>(["/", "/about", "/legal", "/labor"]);
    for (const { business, slug } of targets) {
      const bp = business === "realestate" ? "" : `/${business}`;
      paths.add(`${bp}/column`);
      paths.add(`${bp}/column/${slug}`);
    }
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      body: JSON.stringify({ paths: [...paths] }),
    });
  } catch (e) {
    console.error("Revalidation failed:", e);
  }
}

export default function SrLaunchPage() {
  const [trResults, setTrResults] = useState<Result[] | null>(null);
  const [trRunning, setTrRunning] = useState(false);
  const [dryRunning, setDryRunning] = useState(false);
  const [applying, setApplying] = useState(false);
  const [dryRun, setDryRun] = useState<DryRun | null>(null);
  const [applyResults, setApplyResults] = useState<Result[] | null>(null);
  const [scanHits, setScanHits] = useState<ScanHit[] | null>(null);
  const [keepBefore, setKeepBefore] = useState<Record<string, number> | null>(null);
  const [keepAfter, setKeepAfter] = useState<Record<string, number> | null>(null);

  /** (A) 翻訳データの適用 */
  const runTranslations = async () => {
    if (IS_PLACEHOLDER) return;
    setTrRunning(true);
    const out: Result[] = [];
    try {
      for (const loc of LOCALES) {
        const data = (await getTranslations(loc)) as unknown as Record<string, unknown>;
        const working = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
        let applied = 0;
        let skipped = 0;
        for (const p of SR_LAUNCH_TRANSLATION_PATCHES[loc] ?? []) {
          const cur = getNested(working, p.path);
          if (cur === p.to) {
            skipped++;
            continue;
          }
          if (cur !== p.from) {
            out.push({
              label: `${loc} / ${p.path}`,
              status: "skipped",
              detail: `現在値が想定と違う: ${String(cur).slice(0, 60)}`,
            });
            skipped++;
            continue;
          }
          setNested(working, p.path, p.to);
          applied++;
        }
        if (applied > 0) {
          await saveTranslations(loc, working as never);
          out.push({ label: `${loc} 翻訳データ`, status: "applied", detail: `${applied}件を適用（スキップ${skipped}）` });
        } else {
          out.push({ label: `${loc} 翻訳データ`, status: "skipped", detail: `適用0件（スキップ${skipped}）` });
        }
      }
    } catch (e) {
      out.push({ label: "翻訳データ", status: "error", detail: String(e) });
    }
    setTrResults(out);
    setTrRunning(false);
  };

  /** (B) コラムのドライラン */
  const runDryRun = async () => {
    setDryRunning(true);
    setApplyResults(null);
    try {
      const cols = await getColumns();
      const diffs: ColumnDiff[] = [];
      const perColumn: Record<string, number> = {};
      const matched = new Set<number>();
      const updates: DryRun["updates"] = [];
      const backup: FirestoreColumn[] = [];
      const kb: Record<string, number> = {};
      const entries = SR_LAUNCH_COLUMN_PATCHES.map((patch, index) => ({ patch, index }));

      for (const col of cols) {
        const c = col as unknown as Record<string, unknown>;
        countKeep(c, kb);
        const slug = String(c.slug ?? "");
        const data: Record<string, unknown> = {};
        const record =
          (path: string, e: { patch: SrLaunchColumnPatch; index: number }, occ: number, ctx: string) => {
            matched.add(e.index);
            perColumn[slug] = (perColumn[slug] ?? 0) + occ;
            diffs.push({
              slug,
              path,
              from: e.patch.from,
              to: e.patch.to,
              note: e.patch.note,
              occurrences: occ,
              beforeCtx: ctx,
            });
          };

        for (const f of FIELDS) {
          if (c[f] === undefined) continue;
          const after = applySubstring(c[f], entries, f, record);
          if (JSON.stringify(after) !== JSON.stringify(c[f])) data[f] = after;
        }
        const tr = c.translations as Record<string, unknown> | undefined;
        if (tr) {
          const afterTr = JSON.parse(JSON.stringify(tr)) as Record<string, unknown>;
          let changed = false;
          for (const [lang, v] of Object.entries(afterTr)) {
            const a = applySubstring(v, entries, `translations.${lang}`, record);
            if (JSON.stringify(a) !== JSON.stringify(v)) {
              afterTr[lang] = a;
              changed = true;
            }
          }
          if (changed) data.translations = afterTr;
        }
        if (Object.keys(data).length > 0) {
          updates.push({
            columnId: String(c.id ?? ""),
            slug,
            business: String(c.business ?? "realestate"),
            data: data as Partial<FirestoreColumn>,
          });
          backup.push(col);
        }
      }
      setKeepBefore(kb);
      setDryRun({
        diffs,
        unmatched: SR_LAUNCH_COLUMN_PATCHES.filter((_, i) => !matched.has(i)),
        perColumn,
        updates,
        backup,
      });
    } catch (e) {
      setDryRun(null);
      setApplyResults([{ label: "ドライラン", status: "error", detail: String(e) }]);
    }
    setDryRunning(false);
  };

  /** (C) コラムの適用：1件ずつ保存し、失敗したら止める */
  const applyColumns = async () => {
    if (!dryRun || IS_PLACEHOLDER) return;
    setApplying(true);
    const out: Result[] = [];
    try {
      for (const u of dryRun.updates) {
        try {
          await updateColumn(u.columnId, u.data as never);
          out.push({ label: u.slug, status: "applied", detail: `${dryRun.perColumn[u.slug] ?? 0}件` });
        } catch (e) {
          out.push({ label: u.slug, status: "error", detail: String(e) });
          break;
        }
      }
      await revalidate(dryRun.updates.map((u) => ({ business: u.business, slug: u.slug })));

      const hits: ScanHit[] = [];
      const ka: Record<string, number> = {};
      for (const loc of LOCALES) scanTree(await getTranslations(loc), `translations/${loc}`, hits);
      for (const col of await getColumns()) {
        const c = col as unknown as Record<string, unknown>;
        scanTree(c, `column/${String(c.slug ?? "")}`, hits);
        countKeep(c, ka);
      }
      setScanHits(hits);
      setKeepAfter(ka);
    } catch (e) {
      out.push({ label: "適用", status: "error", detail: String(e) });
    }
    setApplyResults(out);
    setApplying(false);
  };

  const downloadBackup = () => {
    if (!dryRun) return;
    const blob = new Blob([JSON.stringify(dryRun.backup, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sr-launch-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const warned = Object.entries(dryRun?.perColumn ?? {}).filter(([, n]) => n > PER_COLUMN_WARN_THRESHOLD);
  const keepLost = Object.entries(keepBefore ?? {}).filter(([k, n]) => (keepAfter?.[k] ?? n) < n);

  return (
    <div className="mx-auto max-w-5xl p-6 text-sm">
      <h1 className="text-xl font-bold">社労士 開業版パッチの適用（登録日）</h1>
      <p className="mt-2 text-text-muted">
        二士業表示 → 三士業表示。<b>/admin/fix-sr-notation は逆適用できない</b>ため、開業版は本画面で行う。
      </p>

      <div
        className={`mt-6 rounded-lg border p-4 ${
          IS_PLACEHOLDER ? "border-red-400 bg-red-50" : "border-green-400 bg-green-50"
        }`}
      >
        <p className="font-bold">
          {IS_PLACEHOLDER ? "⛔ 登録番号が未設定です。適用できません。" : "✅ 登録番号が設定されています。"}
        </p>
        <p className="mt-1">
          現在の値：<code className="rounded bg-white px-1">{REGISTRATION_NUMBER}</code>
        </p>
        {IS_PLACEHOLDER && (
          <p className="mt-2">
            <code>src/lib/data/sr-launch-patches.ts</code> の <code>REGISTRATION_NUMBER</code> を、
            <b>登録証で確認した実数</b>に差し替えてデプロイしてください。
            <br />
            ※ 試験合格番号「令和7年 第202500525号」と取り違えないこと。
          </p>
        )}
      </div>

      <section className="mt-8">
        <h2 className="font-bold">A. 翻訳データ（4言語 × 5キー）</h2>
        <p className="mt-1 text-text-muted">
          資格表記3キー・フッター登録番号・未開業注記。現在値が想定と違えばスキップして報告します。
        </p>
        <button
          onClick={runTranslations}
          disabled={trRunning || IS_PLACEHOLDER}
          className="mt-3 rounded bg-primary px-4 py-2 font-bold text-white disabled:opacity-40"
        >
          {trRunning ? "適用中…" : "翻訳データに適用"}
        </button>
        {trResults && (
          <ul className="mt-3 space-y-1">
            {trResults.map((r, i) => (
              <li
                key={i}
                className={
                  r.status === "error" ? "text-red-600" : r.status === "skipped" ? "text-amber-700" : "text-green-700"
                }
              >
                [{r.status}] {r.label}
                {r.detail ? ` — ${r.detail}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-bold">B. コラム本文（ドライラン → 差分確認 → 適用）</h2>
        <button
          onClick={runDryRun}
          disabled={dryRunning}
          className="mt-3 rounded border border-primary px-4 py-2 font-bold text-primary disabled:opacity-40"
        >
          {dryRunning ? "走査中…" : "① ドライラン"}
        </button>

        {dryRun && (
          <div className="mt-4 space-y-4">
            <p>
              置換候補 <b>{dryRun.diffs.reduce((a, d) => a + d.occurrences, 0)}</b> 件 / 対象コラム{" "}
              <b>{dryRun.updates.length}</b> 本
            </p>

            {dryRun.unmatched.length > 0 && (
              <div className="rounded border border-amber-400 bg-amber-50 p-3">
                <p className="font-bold">⚠️ 1件も一致しなかったパッチ（{dryRun.unmatched.length}件）</p>
                <p className="text-text-muted">DBに無いか、文言が変わっています。放置せず原因を確かめてください。</p>
                <ul className="mt-2 list-disc pl-5">
                  {dryRun.unmatched.map((p, i) => (
                    <li key={i}>
                      <code>{p.from}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {warned.length > 0 && (
              <div className="rounded border border-amber-400 bg-amber-50 p-3">
                <p className="font-bold">⚠️ 1コラムで{PER_COLUMN_WARN_THRESHOLD}件を超えた置換</p>
                <ul className="mt-2 list-disc pl-5">
                  {warned.map(([s, n]) => (
                    <li key={s}>
                      {s}：{n}件
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <details className="rounded border border-border p-3">
              <summary className="cursor-pointer font-bold">差分を見る（{dryRun.diffs.length}箇所）</summary>
              <ul className="mt-2 space-y-2">
                {dryRun.diffs.map((d, i) => (
                  <li key={i} className="border-t border-border pt-2">
                    <p className="font-mono text-xs text-text-muted">
                      {d.slug} / {d.path} ×{d.occurrences}
                    </p>
                    <p className="text-red-700">− {d.beforeCtx}</p>
                    <p className="text-green-700">
                      ＋ {d.from} → {d.to}
                    </p>
                    {d.note && <p className="text-xs text-text-muted">※ {d.note}</p>}
                  </li>
                ))}
              </ul>
            </details>

            <div className="flex gap-3">
              <button onClick={downloadBackup} className="rounded border border-border px-4 py-2">
                ② 現在値をJSONで退避
              </button>
              <button
                onClick={applyColumns}
                disabled={applying || IS_PLACEHOLDER}
                className="rounded bg-primary px-4 py-2 font-bold text-white disabled:opacity-40"
              >
                {applying ? "適用中…" : "③ 適用する"}
              </button>
            </div>
          </div>
        )}

        {applyResults && (
          <ul className="mt-4 space-y-1">
            {applyResults.map((r, i) => (
              <li key={i} className={r.status === "error" ? "text-red-600" : "text-green-700"}>
                [{r.status}] {r.label}
                {r.detail ? ` — ${r.detail}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      {scanHits && (
        <section className="mt-10">
          <h2 className="font-bold">C. 適用後スキャン</h2>
          {scanHits.length === 0 ? (
            <p className="mt-2 text-green-700">✅ 未開業注記の残存 0件。</p>
          ) : (
            <div className="mt-2 rounded border border-red-400 bg-red-50 p-3">
              <p className="font-bold">⚠️ 残存 {scanHits.length}件</p>
              <ul className="mt-2 space-y-1">
                {scanHits.map((h, i) => (
                  <li key={i}>
                    <code className="text-xs">{h.where}</code>：<b>{h.term}</b> — {h.excerpt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <p className="font-bold">残すべき文字列の保全</p>
            {keepLost.length === 0 ? (
              <p className="mt-1 text-green-700">✅ 保護対象は減っていません。</p>
            ) : (
              <div className="mt-1 rounded border border-red-400 bg-red-50 p-3">
                <p className="font-bold">⛔ 消えてはいけない文字列が減りました。退避JSONから復旧してください。</p>
                <ul className="mt-2 list-disc pl-5">
                  {keepLost.map(([k, n]) => (
                    <li key={k}>
                      <code>{k}</code>：{n} → {keepAfter?.[k] ?? 0}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mt-10 rounded border border-border p-4">
        <h2 className="font-bold">本画面が扱わないもの（コード側・別作業）</h2>
        <ul className="mt-2 list-disc pl-5 text-text-muted">
          <li>
            <code>NEXT_PUBLIC_SR_LAUNCHED=true</code>（env 1行）
          </li>
          <li>
            <code>CannotHandle.tsx</code> の「開業までお受けできません」の一文を削除
          </li>
          <li>
            <code>seo.ts</code> の hasCredential（credentialCategory・identifier・recognizedBy を<b>同時に</b>差し替え）
          </li>
          <li>
            <code>llms.txt</code>・A2Aカード（3サイト）
          </li>
          <li>samurai.co.jp の会員プロフィール（別サイトの管理画面）</li>
        </ul>
        <p className="mt-2 text-text-muted">
          詳細は Drive の <code>20B_9月1日_未開業注記リスト.md</code> と <code>20_当日_一斉切替.md</code>。
        </p>
      </section>
    </div>
  );
}
