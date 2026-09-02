"use client";

import { useState } from "react";
import { getTranslations, saveTranslations } from "@/lib/admin-api";
import {
  LABOR_OFFICE_INFO,
  OFFICE_INFO_BAD_TERMS,
  type OfficeInfoRow,
} from "@/lib/data/labor-office-info-patches";
import type { LangCode } from "@/config/languages";

/**
 * labor.aboutPage.officeInfo（事務所情報の表）を4言語まとめて置き換える。
 *
 * 2026-08-13 新設。/admin/translations は `{label,value}` の配列を
 * 「配列データは直接編集できません」として読み取り専用にしているため、
 * この表だけは通常の管理画面から直せない。
 *
 * ★置き換えであって追記ではない。適用前に現行の中身を表示し、
 *   何が消えるかを確認してから実行できるようにしている。
 */

const locales: LangCode[] = ["ja", "en", "zh-tw", "zh"];

type Result = {
  locale: LangCode;
  status: "applied" | "error";
  before: OfficeInfoRow[];
  after: OfficeInfoRow[];
  detail?: string;
};

function readOfficeInfo(data: Record<string, unknown>): OfficeInfoRow[] {
  const labor = data.labor as Record<string, unknown> | undefined;
  const about = labor?.aboutPage as Record<string, unknown> | undefined;
  const rows = about?.officeInfo;
  if (!Array.isArray(rows)) return [];
  return rows.filter(
    (r): r is OfficeInfoRow =>
      !!r && typeof r === "object" && typeof (r as OfficeInfoRow).label === "string",
  );
}

/** 適用後に残ってはならない語を走査する */
function scanBad(rows: OfficeInfoRow[]): string[] {
  const hits: string[] = [];
  for (const r of rows) {
    for (const t of OFFICE_INFO_BAD_TERMS) {
      if (r.label.includes(t) || r.value.includes(t)) hits.push(`${r.label}: ${t}`);
    }
  }
  return hits;
}

export default function FixLaborOfficeInfoPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [preview, setPreview] = useState<Result[] | null>(null);
  const [bad, setBad] = useState<string[] | null>(null);

  /** 読むだけ。保存しない */
  const load = async () => {
    setRunning(true);
    const out: Result[] = [];
    for (const loc of locales) {
      try {
        const data = (await getTranslations(loc)) ?? {};
        out.push({
          locale: loc,
          status: "applied",
          before: readOfficeInfo(data as Record<string, unknown>),
          after: LABOR_OFFICE_INFO[loc],
        });
      } catch (e) {
        out.push({ locale: loc, status: "error", before: [], after: [], detail: String(e) });
      }
    }
    setPreview(out);
    setResults([]);
    setBad(null);
    setRunning(false);
  };

  const run = async () => {
    setRunning(true);
    const out: Result[] = [];
    const hits: string[] = [];
    for (const loc of locales) {
      try {
        const data = ((await getTranslations(loc)) ?? {}) as Record<string, unknown>;
        const working = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
        const before = readOfficeInfo(working);

        const labor = (working.labor ?? {}) as Record<string, unknown>;
        const about = (labor.aboutPage ?? {}) as Record<string, unknown>;
        about.officeInfo = LABOR_OFFICE_INFO[loc];
        labor.aboutPage = about;
        working.labor = labor;

        await saveTranslations(loc, working);
        out.push({ locale: loc, status: "applied", before, after: LABOR_OFFICE_INFO[loc] });
        scanBad(LABOR_OFFICE_INFO[loc]).forEach((h) => hits.push(`${loc} / ${h}`));
      } catch (e) {
        out.push({ locale: loc, status: "error", before: [], after: [], detail: String(e) });
      }
    }
    setResults(out);
    setBad(hits);
    setPreview(null);
    setRunning(false);
  };

  const rowsTable = (rows: OfficeInfoRow[]) =>
    rows.length === 0 ? (
      <p className="text-xs text-text-muted">（空）</p>
    ) : (
      <dl className="divide-y divide-border rounded-lg border border-border">
        {rows.map((r, i) => (
          <div key={`${r.label}-${i}`} className="flex gap-3 px-3 py-1.5 text-xs">
            <dt className="w-32 shrink-0 font-medium text-text">{r.label}</dt>
            <dd className="text-text-muted">{r.value}</dd>
          </div>
        ))}
      </dl>
    );

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">社労士 事務所情報の表を置き換える</h1>
      <p className="mb-4 max-w-2xl text-sm text-text-muted">
        <span className="font-mono">labor.aboutPage.officeInfo</span> を4言語まとめて置き換えます。
        通常の翻訳管理画面は「配列データは直接編集できません」として、この表を読み取り専用にしているためです。
        <strong className="text-text">置き換えであって追記ではありません。</strong>
        先に「現行を読む」で、何が消えるかを確認してください。
      </p>

      <div className="flex gap-3">
        <button
          onClick={load}
          disabled={running}
          className="rounded-lg border border-border px-5 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          {running ? "読込中..." : "現行を読む（保存しない）"}
        </button>
        <button
          onClick={run}
          disabled={running}
          className="relative overflow-hidden rounded-lg px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
        >
          <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
          <span className="relative">{running ? "適用中..." : "4言語に適用する"}</span>
        </button>
      </div>

      {(preview ?? results).length > 0 && (
        <div className="mt-6 max-w-4xl space-y-6">
          {(preview ?? results).map((r) => (
            <div key={r.locale} className="rounded-lg bg-surface-dim p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs text-text-muted">translations/{r.locale}</span>
                <span
                  className={
                    r.status === "applied"
                      ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                      : "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600"
                  }
                >
                  {preview ? `現行 ${r.before.length}行 → 適用後 ${r.after.length}行` : r.status === "applied" ? "適用" : "エラー"}
                </span>
              </div>
              {r.detail && <p className="mb-2 text-xs text-red-600">{r.detail}</p>}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-bold text-text">現行（消えます）</p>
                  {rowsTable(r.before)}
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold text-text">適用後</p>
                  {rowsTable(r.after)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {bad !== null && (
        <p className="mt-4 max-w-2xl text-sm">
          残ってはならない語の走査：
          <strong className={bad.length === 0 ? "text-green-700" : "text-red-600"}>
            {bad.length === 0 ? "0件" : `${bad.length}件（${bad.join(" / ")}）`}
          </strong>
        </p>
      )}

      {results.length > 0 && (
        <p className="mt-4 max-w-2xl text-xs text-text-muted">
          ★登録番号の行は実番号（第13260359号・2026年9月1日登録）で入ります。
          正本は <span className="font-mono">src/lib/shared/sr-registration.ts</span>、
          行の体裁は <span className="font-mono">labor-office-info-patches.ts</span> の
          <span className="font-mono"> REGISTRATION_ROW </span> です。
        </p>
      )}
    </div>
  );
}
