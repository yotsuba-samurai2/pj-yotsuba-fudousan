"use client";

import { useState } from "react";
import { getColumns, updateColumn } from "@/lib/admin-api";
import type { FirestoreColumn } from "@/lib/admin-api";
import {
  GAITAMEHO_CORRECTION_PATCHES,
  OVERSEAS_GUIDE_SLUG,
  GAITAMEHO_EXPECT_TERMS,
} from "@/lib/data/gaitameho-correction-patches";

/**
 * 既存コラム /column/overseas-owners-guide-japan-real-estate-sale の外為法記述を是正する。
 * P1＝Q7「非居住者間の取得は報告不要」（2026-04-01以降は免除廃止／記事内で自己矛盾）を4ロケール、
 * P2＝Q11の罰則「50万円以下の過料」→「六月以下の拘禁刑または50万円以下の罰金（外為法第71条第3号）」を4ロケール、
 * P3＝買主側の新コラムへのクロスリンクを ja に1件。
 * 手本＝add-leaving-japan-link（marker で適用済み判定＝複数回押しても重複しない）。
 *
 * ・**まず「確認のみ（dry-run）」で当たり外れを見てから「適用」を押すこと。**
 * ・find は 2026-08-12 に本番4ロケールの公開HTMLから実測した文字列。本番の現在値と
 *   差異があれば該当パッチだけスキップされ、理由が下に出る（＝勝手に壊さない）。
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

export default function FixGaitamehoCorrectionsPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const run = async (dryRun: boolean) => {
    setRunning(true);
    const out: Result[] = [];

    try {
      const all = await getColumns();
      const current = all.find(
        (c) => (c as unknown as Record<string, unknown>).slug === OVERSEAS_GUIDE_SLUG,
      ) as unknown as Record<string, unknown> | undefined;

      if (!current) {
        setResults([
          { label: OVERSEAS_GUIDE_SLUG, status: "error", detail: "コラムが見つかりません" },
        ]);
        setRunning(false);
        return;
      }

      const updates: Record<string, string> = {};

      for (const p of GAITAMEHO_CORRECTION_PATCHES) {
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
      for (const e of GAITAMEHO_EXPECT_TERMS) {
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
      <h1 className="mb-1 text-lg font-bold">
        海外オーナー売却コラムの外為法記述を是正（4ロケール＋クロスリンク）
      </h1>
      <p className="mb-2 max-w-2xl text-sm text-text-muted">
        <code>{OVERSEAS_GUIDE_SLUG}</code> に対して計
        {GAITAMEHO_CORRECTION_PATCHES.length}件当てます。内訳は、
        <strong>P1</strong>＝Q7「非居住者間の取得は報告不要」の是正（2026年4月1日以降は免除が廃止。
        同記事Q11と矛盾していた）を ja / en / zh-tw / zh の4件、
        <strong>P2</strong>＝Q11の罰則「50万円以下の過料」を
        「六月以下の拘禁刑または50万円以下の罰金（外為法第71条第3号）」に是正する4件、
        <strong>P3</strong>＝買主側の新コラムへのクロスリンク1件（ja のみ。
        新コラムが日本語のみ公開のため、翻訳の公開後に en / zh-tw / zh を追加すること）。
      </p>
      <p className="mb-6 max-w-2xl rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
        <strong>先に「確認のみ」を実行してください。</strong>照合用の find は 2026-08-12 に
        本番4ロケールの公開HTMLから実測した文字列で、採取時点ではいずれも出現1回でした。
        本番の現在値と差異があれば該当パッチだけスキップされ、理由が表示されます。
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
