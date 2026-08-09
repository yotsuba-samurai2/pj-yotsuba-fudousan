"use client";

import { useState } from "react";
import { getColumns, updateColumn } from "@/lib/admin-api";
import {
  NOZEI_KANRININ_CONSISTENCY_PATCHES,
  OVERSEAS_GUIDE_SLUG,
  FORBIDDEN_TERMS,
} from "@/lib/data/nozei-kanrinin-consistency-patches";

/**
 * 売却ガイド /column/overseas-owners-guide-japan-real-estate-sale の是正。
 *
 * 2026-08-09 の浦松決定「納税管理人には四葉は就任せず、税理士におつなぎする」を
 * 本コラムにも反映する。特集 /leaving-japan と離日売却クラスタ7本は反映済みで、
 * 本コラムだけが「行政書士として直接就任」のまま残り、**公開中のページ同士で
 * 食い違っている**状態を解消する。あわせて「提携税理士」等も是正する。
 *
 * 手本＝fix-kaigai-owner-crosslink。
 * ・find の出現数が想定と一致した場合のみ置換する（不一致＝スキップして理由を出す）
 * ・marker で適用済みを判定するので、何度押しても重複しない
 * ・**まず「確認のみ（dry-run）」で当たり外れを見てから「適用」を押すこと**
 */

type Status = "applied" | "would-apply" | "already" | "skipped" | "error";
type Result = { label: string; status: Status; detail?: string };

function getNested(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((a, k) => {
    if (a && typeof a === "object") return (a as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}

export default function FixNozeiKanrininConsistencyPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [scan, setScan] = useState<string[]>([]);

  const run = async (dryRun: boolean) => {
    setRunning(true);
    const out: Result[] = [];

    try {
      const all = await getColumns("realestate");
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

      // path ごとに置換後の文字列を積み上げる
      const next: Record<string, string> = {};

      for (const p of NOZEI_KANRININ_CONSISTENCY_PATCHES) {
        const base =
          next[p.path] ?? (getNested(current, p.path) as string | undefined);

        if (typeof base !== "string") {
          out.push({ label: p.label, status: "skipped", detail: `${p.path} が文字列ではありません` });
          continue;
        }
        if (base.includes(p.marker)) {
          out.push({ label: p.label, status: "already", detail: "適用済み" });
          continue;
        }
        const hits = base.split(p.find).length - 1;
        if (hits !== p.count) {
          out.push({
            label: p.label,
            status: "skipped",
            detail: `find の出現数が ${hits}（想定 ${p.count}）。本番の現在値が変わっています。find を更新してください`,
          });
          continue;
        }
        next[p.path] = base.split(p.find).join(p.replace);
        out.push({ label: p.label, status: dryRun ? "would-apply" : "applied" });
      }

      if (!dryRun && Object.keys(next).length > 0) {
        const id = current.id as string;
        const payload: Record<string, unknown> = {};
        for (const [path, value] of Object.entries(next)) {
          if (path === "content") {
            payload.content = value;
          } else {
            // translations.<locale>.content
            const locale = path.split(".")[1];
            const tr = {
              ...((current.translations as Record<string, unknown>) ?? {}),
              ...((payload.translations as Record<string, unknown>) ?? {}),
            };
            tr[locale] = {
              ...((tr[locale] as Record<string, unknown>) ?? {}),
              content: value,
            };
            payload.translations = tr;
          }
        }
        await updateColumn(id, payload as never);
      }

      // 禁止語スキャン（報告のみ）
      const scanTargets: string[] = [
        (next["content"] ?? (current.content as string)) || "",
        ...["en", "zh-tw", "zh"].map(
          (l) =>
            next[`translations.${l}.content`] ??
            ((getNested(current, `translations.${l}.content`) as string) || ""),
        ),
      ];
      const found: string[] = [];
      FORBIDDEN_TERMS.forEach((term) => {
        const n = scanTargets.reduce(
          (acc, t) => acc + (t.split(term).length - 1),
          0,
        );
        if (n > 0) found.push(`${term}（${n}件）`);
      });
      setScan(found);
    } catch (err) {
      out.push({ label: "実行", status: "error", detail: String(err) });
    }

    setResults(out);
    setRunning(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">
        売却ガイドの是正（納税管理人・提携表記）
      </h1>
      <p className="mt-2 font-mono text-sm text-muted-foreground">
        /column/{OVERSEAS_GUIDE_SLUG}
      </p>

      <div className="mt-4 space-y-2 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm">
        <p>
          <strong>まず「確認のみ」を押してください。</strong>
          find が本番の現在値と一致しないパッチはスキップされ、理由が出ます。
        </p>
        <p>
          何度押しても重複しません（marker で適用済みを判定します）。
          公開状態は変更しません。
        </p>
        <p className="text-amber-900">
          <strong>スコープ外：</strong>
          事実4の「e-Taxが利用できない非居住者にとって」は今回当てていません。
          国税庁A1-7は納税管理人届出書のe-Tax提出を標準の方法として案内しており
          誤読を招くおそれがありますが、読点の全角/半角がロケールにより揺れて
          誤爆する risk があるため、別途 浦松の判断で。
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => run(true)}
          disabled={running}
          className="rounded-md border px-5 py-2.5 disabled:opacity-50"
        >
          確認のみ（dry-run）
        </button>
        <button
          type="button"
          onClick={() => run(false)}
          disabled={running}
          className="rounded-md bg-primary px-5 py-2.5 text-white disabled:opacity-50"
        >
          適用する
        </button>
      </div>

      {results.length > 0 && (
        <ul className="mt-6 space-y-2">
          {results.map((r, i) => (
            <li key={i} className="rounded-md border p-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span>{r.label}</span>
                <span className="shrink-0 text-xs">
                  {r.status === "applied" && "適用した"}
                  {r.status === "would-apply" && "適用できる"}
                  {r.status === "already" && "適用済み"}
                  {r.status === "skipped" && "スキップ"}
                  {r.status === "error" && "エラー"}
                </span>
              </div>
              {r.detail && (
                <p className="mt-1 text-xs text-muted-foreground">{r.detail}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {results.length > 0 && (
        <div className="mt-6 rounded-md border p-4 text-sm">
          <p className="font-medium">禁止語スキャン（4ロケール合計・報告のみ）</p>
          {scan.length === 0 ? (
            <p className="mt-2 text-green-700">残存なし</p>
          ) : (
            <ul className="mt-2 list-inside list-disc text-red-600">
              {scan.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
