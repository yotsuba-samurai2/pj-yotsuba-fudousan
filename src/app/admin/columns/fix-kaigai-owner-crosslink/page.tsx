"use client";

import { useState } from "react";
import { getColumns, updateColumn } from "@/lib/admin-api";
import type { FirestoreColumn } from "@/lib/admin-api";
import {
  KAIGAI_OWNER_COLUMN_PATCHES,
  KAIGAI_OWNER_COLUMN_SLUG,
  KAIGAI_OWNER_EXPECT_TERMS,
  KAIGAI_OWNER_SCAN_TERMS,
  repeatedUnitOf,
  collapseRepeats,
} from "@/lib/data/kaigai-owner-column-patches";

/**
 * 既存コラム /column/overseas-owners-guide-japan-real-estate-sale の §2-4 改修を適用する
 * （AI指名獲得_3レーン実装パック_v1 §2-4／2026-07-27 浦松承認）。手本＝fix-sr-notation。
 *
 * ・find の出現数が想定と一致した場合のみ置換する（不一致＝スキップして理由を出す）。
 * ・**まず「確認のみ（dry-run）」で当たり外れを見てから「適用」を押すこと。**
 *   find 文字列は 2026-07-09 のバックアップから採取しており、本番の現在値と差異がありうる。
 * ・適用後は禁止語スキャンと期待語チェックの結果を出す（自動置換はしない＝報告のみ）。
 */

type Status = "applied" | "would-apply" | "already" | "skipped" | "error";
type Result = { label: string; status: Status; detail?: string };

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

export default function FixKaigaiOwnerCrosslinkPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const run = async (dryRun: boolean) => {
    setRunning(true);
    const out: Result[] = [];

    try {
      const all = await getColumns();
      const current = all.find(
        (c) => (c as unknown as Record<string, unknown>).slug === KAIGAI_OWNER_COLUMN_SLUG,
      ) as unknown as Record<string, unknown> | undefined;

      if (!current) {
        setResults([
          { label: KAIGAI_OWNER_COLUMN_SLUG, status: "error", detail: "コラムが見つかりません" },
        ]);
        setRunning(false);
        return;
      }

      const updates: Record<string, string> = {};

      for (const p of KAIGAI_OWNER_COLUMN_PATCHES) {
        const base = updates[p.path] ?? (getNested(current, p.path) as string | undefined);
        if (typeof base !== "string") {
          out.push({ label: p.label, status: "skipped", detail: `${p.path} が文字列でない` });
          continue;
        }
        // 【冪等性の要】marker（挿入後にだけ存在する文字列）で適用済みを判定する。
        // find の出現数で判定すると、replace が find を含むパッチ（見出しを残して後ろに足す形）は
        // 適用後も find が残るため何度でも再挿入される（2026-07-27 本番で①6回・③5回の重複を発生させた）。
        if (base.includes(p.marker)) {
          out.push({ label: p.label, status: "already", detail: "適用済み（marker検出）" });
          continue;
        }
        const count = base.split(p.find).length - 1;
        if (count !== p.count) {
          out.push({
            label: p.label,
            status: "skipped",
            detail: `find の出現数が不一致（実際${count} / 想定${p.count}）。本番の現在値が 2026-07-09 バックアップと異なる可能性。find を更新して再実行`,
          });
          continue;
        }
        updates[p.path] = base.split(p.find).join(p.replace);
        out.push({
          label: p.label,
          status: dryRun ? "would-apply" : "applied",
          detail: `${p.path}（${p.find.length}字 → ${p.replace.length}字）`,
        });
      }

      if (!dryRun && Object.keys(updates).length) {
        const working = JSON.parse(JSON.stringify(current)) as Record<string, unknown>;
        for (const [path, value] of Object.entries(updates)) setNested(working, path, value);
        const payload: Record<string, unknown> = {};
        for (const key of new Set(Object.keys(updates).map((x) => x.split(".")[0]))) {
          payload[key] = working[key];
        }
        await updateColumn(
          current.id as string,
          payload as Partial<FirestoreColumn>,
        );
      }

      // ── 反映後（dry-run時は反映見込み）の本文でスキャン ──
      const finalOf = (path: string) =>
        updates[path] ?? ((getNested(current, path) as string | undefined) ?? "");
      const pathOf = (loc: string) => (loc === "ja" ? "content" : `translations.${loc}.content`);

      for (const e of KAIGAI_OWNER_EXPECT_TERMS) {
        const body = finalOf(pathOf(e.locale));
        out.push({
          label: `期待語チェック ${e.locale}「${e.term}」`,
          status: body.includes(e.term) ? "applied" : "skipped",
          detail: body.includes(e.term) ? "含まれる" : "含まれない（要確認）",
        });
      }

      for (const loc of ["ja", "en", "zh-tw", "zh"]) {
        const body = finalOf(pathOf(loc));
        const hits = KAIGAI_OWNER_SCAN_TERMS.filter((t) => body.includes(t));
        if (hits.length) {
          out.push({
            label: `禁止語スキャン ${loc}`,
            status: "skipped",
            detail: `残存: ${hits.join("・")}（今回の承認範囲外のため自動置換していません）`,
          });
        }
      }
    } catch (e) {
      out.push({ label: "実行", status: "error", detail: String(e) });
    }

    setResults(out);
    setRunning(false);
  };

  /**
   * 【重複除去】2026-07-27 の冪等性バグで積み上がった重複挿入を1つに畳む。冪等。
   * dryRun=true なら書き込まずに件数だけ出す。
   */
  const dedupe = async (dryRun: boolean) => {
    setRunning(true);
    const out: Result[] = [];
    try {
      const all = await getColumns();
      const current = all.find(
        (c) => (c as unknown as Record<string, unknown>).slug === KAIGAI_OWNER_COLUMN_SLUG,
      ) as unknown as Record<string, unknown> | undefined;
      if (!current) {
        setResults([{ label: KAIGAI_OWNER_COLUMN_SLUG, status: "error", detail: "コラムが見つかりません" }]);
        setRunning(false);
        return;
      }

      const updates: Record<string, string> = {};
      for (const p of KAIGAI_OWNER_COLUMN_PATCHES) {
        const unit = repeatedUnitOf(p);
        if (!unit) continue; // replace が find で始まらない＝積み上がらないパッチ
        const base = updates[p.path] ?? (getNested(current, p.path) as string | undefined);
        if (typeof base !== "string") continue;
        const [fixed, removed] = collapseRepeats(base, unit);
        if (removed > 0) {
          updates[p.path] = fixed;
          out.push({
            label: p.label,
            status: dryRun ? "would-apply" : "applied",
            detail: `重複 ${removed} 個を除去（残り1つ）`,
          });
        } else {
          out.push({ label: p.label, status: "already", detail: "重複なし" });
        }
      }

      if (!dryRun && Object.keys(updates).length) {
        const working = JSON.parse(JSON.stringify(current)) as Record<string, unknown>;
        for (const [path, value] of Object.entries(updates)) setNested(working, path, value);
        const payload: Record<string, unknown> = {};
        for (const key of new Set(Object.keys(updates).map((x) => x.split(".")[0]))) {
          payload[key] = working[key];
        }
        await updateColumn(current.id as string, payload as Partial<FirestoreColumn>);
      }

      // 最終状態で marker が各1回になっているかを検算
      const finalOf = (path: string) =>
        updates[path] ?? ((getNested(current, path) as string | undefined) ?? "");
      for (const p of KAIGAI_OWNER_COLUMN_PATCHES) {
        const n = finalOf(p.path).split(p.marker).length - 1;
        if (n !== 1) {
          out.push({ label: `検算 ${p.label}`, status: "skipped", detail: `marker が ${n} 回（期待1回）` });
        }
      }
      out.push({
        label: "検算",
        status: "applied",
        detail: `全${KAIGAI_OWNER_COLUMN_PATCHES.length}件の marker 出現数を確認しました`,
      });
    } catch (e) {
      out.push({ label: "実行", status: "error", detail: String(e) });
    }
    setResults(out);
    setRunning(false);
  };

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">
        海外オーナー売却コラム §2-4 改修（4言語）
      </h1>
      <p className="mb-2 max-w-2xl text-sm text-text-muted">
        <code>{KAIGAI_OWNER_COLUMN_SLUG}</code> に、①要約への{" "}
        <code>/kaigai-owner</code> 導線 ②事実4の比較表＋独占業務の整理 ③事実1の
        10.21%／20.42% 対比 を、ja / en / zh-tw / zh の計
        {KAIGAI_OWNER_COLUMN_PATCHES.length}件当てます。
      </p>
      <p className="mb-3 max-w-2xl rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
        <strong>先に「確認のみ」を実行してください。</strong>照合用の find 文字列は
        2026-07-09 のバックアップから採取しており、本番の現在値と差異がありうるため、
        不一致はすべてスキップされます。全件が「適用予定」になってから「適用」を押してください。
        適用済みの判定は marker（挿入後にだけ存在する文字列）で行うため、
        「適用」を複数回押しても重複しません。
      </p>
      <p className="mb-6 max-w-2xl rounded-lg bg-red-50 p-3 text-sm text-red-800">
        <strong>2026-07-27 の不具合について。</strong>当初は find の出現数で適用済みを判定していたため、
        ①③のように「見出しを残して後ろに足す」パッチが押すたびに重複挿入されました
        （本番で ja: ①6回・③5回）。現在は marker 判定に修正済みです。
        すでに重複している本文は、下の<strong>「重複を除去」</strong>で1つに畳めます（冪等）。
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => run(true)}
          disabled={running}
          className="rounded-lg border border-border px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          {running ? "実行中..." : "確認のみ（dry-run）"}
        </button>
        <button
          onClick={() => run(false)}
          disabled={running}
          className="relative overflow-hidden rounded-lg px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
          <span className="relative">{running ? "適用中..." : "適用"}</span>
        </button>
        <span className="mx-2 w-px self-stretch bg-border" aria-hidden="true" />
        <button
          onClick={() => dedupe(true)}
          disabled={running}
          className="rounded-lg border border-border px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          {running ? "実行中..." : "重複を確認（dry-run）"}
        </button>
        <button
          onClick={() => dedupe(false)}
          disabled={running}
          className="rounded-lg border border-red-300 bg-red-50 px-6 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
        >
          {running ? "実行中..." : "重複を除去"}
        </button>
      </div>

      {results.length > 0 && (
        <ul className="mt-6 max-w-3xl space-y-2">
          {results.map((r, i) => (
            <li key={i} className="rounded-lg bg-surface-dim px-3 py-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-text-muted">{r.label}</span>
                <span
                  className={
                    r.status === "applied" || r.status === "would-apply"
                      ? "shrink-0 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700"
                      : r.status === "already"
                        ? "shrink-0 rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700"
                        : r.status === "skipped"
                          ? "shrink-0 rounded-full bg-yellow-100 px-2 py-0.5 font-medium text-yellow-700"
                          : "shrink-0 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-600"
                  }
                >
                  {r.status === "applied"
                    ? "適用"
                    : r.status === "would-apply"
                      ? "適用予定"
                      : r.status === "already"
                        ? "適用済み"
                        : r.status === "skipped"
                          ? "スキップ"
                          : "エラー"}
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
