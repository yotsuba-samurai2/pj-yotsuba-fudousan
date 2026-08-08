"use client";

import { useState } from "react";
import { getColumns, updateColumn } from "@/lib/admin-api";
import type { FirestoreColumn } from "@/lib/admin-api";
import {
  LEAVING_JAPAN_COLUMN_PATCHES,
  LEAVING_JAPAN_COLUMN_SLUG,
  LEAVING_JAPAN_EXPECT_TERMS,
} from "@/lib/data/leaving-japan-column-patches";

/**
 * 既存コラム /column/overseas-owners-guide-japan-real-estate-sale の要約ブロックに
 * /leaving-japan（緊急帰国・不動産スピード換金 特集）への導線を1行足す（ja・zh の2件）。
 * 手本＝fix-kaigai-owner-crosslink（marker で適用済み判定＝複数回押しても重複しない）。
 *
 * ・**まず「確認のみ（dry-run）」で当たり外れを見てから「適用」を押すこと。**
 * ・find は 2026-07-27 適用済みパッチの挿入文を anchor にしている。本番の現在値と
 *   差異があれば全件スキップされ、理由が下に出る（＝勝手に壊さない）。
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

export default function AddLeavingJapanLinkPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const run = async (dryRun: boolean) => {
    setRunning(true);
    const out: Result[] = [];

    try {
      const all = await getColumns();
      const current = all.find(
        (c) => (c as unknown as Record<string, unknown>).slug === LEAVING_JAPAN_COLUMN_SLUG,
      ) as unknown as Record<string, unknown> | undefined;

      if (!current) {
        setResults([
          { label: LEAVING_JAPAN_COLUMN_SLUG, status: "error", detail: "コラムが見つかりません" },
        ]);
        setRunning(false);
        return;
      }

      const updates: Record<string, string> = {};

      for (const p of LEAVING_JAPAN_COLUMN_PATCHES) {
        const base = updates[p.path] ?? (getNested(current, p.path) as string | undefined);
        if (typeof base !== "string") {
          out.push({ label: p.label, status: "skipped", detail: `${p.path} が文字列でない` });
          continue;
        }
        // marker（挿入後にだけ存在する文字列）で適用済みを判定（重複挿入の防止）
        if (base.includes(p.marker)) {
          out.push({ label: p.label, status: "already", detail: "適用済み（marker検出）" });
          continue;
        }
        const count = base.split(p.find).length - 1;
        if (count !== p.count) {
          out.push({
            label: p.label,
            status: "skipped",
            detail: `find の出現数が不一致（実際${count} / 想定${p.count}）。本番の現在値が anchor と異なる可能性。find を更新して再実行`,
          });
          continue;
        }
        updates[p.path] = base.split(p.find).join(p.replace);
        out.push({
          label: p.label,
          status: dryRun ? "would-apply" : "applied",
          detail: `${p.path}（+${p.replace.length - p.find.length}字）`,
        });
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

      // 反映後（dry-run時は反映見込み）の本文で期待語チェック
      const finalOf = (path: string) =>
        updates[path] ?? ((getNested(current, path) as string | undefined) ?? "");
      const pathOf = (loc: string) => (loc === "ja" ? "content" : `translations.${loc}.content`);
      for (const e of LEAVING_JAPAN_EXPECT_TERMS) {
        const body = finalOf(pathOf(e.locale));
        out.push({
          label: `期待語チェック ${e.locale}「${e.term}」`,
          status: body.includes(e.term) ? "applied" : "skipped",
          detail: body.includes(e.term) ? "含まれる" : "含まれない（要確認）",
        });
      }
    } catch (e) {
      out.push({ label: "実行", status: "error", detail: String(e) });
    }

    setResults(out);
    setRunning(false);
  };

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">海外オーナー売却コラムに /leaving-japan 導線を追加（ja・zh）</h1>
      <p className="mb-2 max-w-2xl text-sm text-text-muted">
        <code>{LEAVING_JAPAN_COLUMN_SLUG}</code> の要約ブロックに、
        <code>/leaving-japan</code>（緊急帰国・不動産スピード換金 特集）への1行を ja / zh の計
        {LEAVING_JAPAN_COLUMN_PATCHES.length}件当てます。en・zh-tw は当該ロケール版ページの公開時に追加します。
      </p>
      <p className="mb-6 max-w-2xl rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
        <strong>先に「確認のみ」を実行してください。</strong>照合用の find は 2026-07-27
        適用済みパッチの挿入文を anchor にしています。本番の現在値と差異があればスキップされます。
        全件が「適用予定」になってから「適用」を押してください。適用済みの判定は
        marker で行うため、複数回押しても重複しません。
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
