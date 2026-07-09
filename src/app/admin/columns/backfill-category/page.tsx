"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getColumns, type FirestoreColumn } from "@/lib/firestore/columns";

/**
 * コラムcategoryの公開表記統一（診断結果に基づく後埋め・2026-07-09）。
 *
 * ① 台湾9本: base.category / translations["zh-tw"].category を
 *    内部クラスタ管理ラベルから公開用の "日本不動產繼承" に統一。
 * ② overseas-owners-guide-japan-real-estate-sale: translations.{en,zh-tw,zh}.category が
 *    未設定だったため追加（base=ja の "海外オーナー向け" は変更しない）。
 *
 * 書き込みは updateDoc に dot-path（例: "translations.zh-tw.category"）を渡す方式のみ。
 * ネストしたtranslationsオブジェクトを丸ごと上書きすると title/excerpt/content 等の
 * 既存フィールドを消してしまうため、必ずリーフのフィールドパスを個別指定する
 * （updateColumn()のような上位オブジェクトのspreadは使わない）。
 *
 * 現在値と提案値が一致する行は自動スキップ（冪等）。上記フィールド以外は一切変更しない。
 */

const TAIWAN_SLUGS = [
  "taiwan-souzoku-japan-fudosan",
  "taiwan-souzoku-baikyaku",
  "taiwan-souzoku-kanri-katsuyo",
  "taiwan-jin-souzoku-tetsuzuki",
  "taiwan-souzoku-guide",
  "taiwan-tokyo-fudosan-toshi",
  "bunkyo-shueki-bukken",
  "taiwan-tetsuzuki-onestop",
  "taiwan",
];
const TAIWAN_CATEGORY = "日本不動產繼承";

const OVERSEAS_SLUG = "overseas-owners-guide-japan-real-estate-sale";
const OVERSEAS_CATEGORY: Record<"en" | "zh-tw" | "zh", string> = {
  en: "For Overseas Owners",
  "zh-tw": "海外業主專屬",
  zh: "海外业主专属",
};

type FieldChange = { path: string; label: string; current?: string; proposed: string };

type Row = {
  id: string;
  slug: string;
  changes: FieldChange[]; // 現状 !== 提案 のフィールドのみ（＝実際に書き込む対象）
  allFields: FieldChange[]; // 表示用（変更なしのフィールドも含む）
  result?: "applied" | "error" | "skipped";
  detail?: string;
};

export default function BackfillCategoryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const all = await getColumns("realestate");
      const built: Row[] = [];

      for (const slug of TAIWAN_SLUGS) {
        const c = all.find((x) => x.slug === slug) as FirestoreColumn | undefined;
        if (!c) continue;
        const curBase = c.category;
        const curZhTw = c.translations?.["zh-tw"]?.category;
        const allFields: FieldChange[] = [
          { path: "category", label: "base.category", current: curBase, proposed: TAIWAN_CATEGORY },
          {
            path: "translations.zh-tw.category",
            label: "translations.zh-tw.category",
            current: curZhTw,
            proposed: TAIWAN_CATEGORY,
          },
        ];
        built.push({
          id: c.id,
          slug,
          allFields,
          changes: allFields.filter((f) => f.current !== f.proposed),
        });
      }

      const o = all.find((x) => x.slug === OVERSEAS_SLUG) as FirestoreColumn | undefined;
      if (o) {
        const allFields: FieldChange[] = (["en", "zh-tw", "zh"] as const).map((loc) => ({
          path: `translations.${loc}.category`,
          label: `translations.${loc}.category`,
          current: o.translations?.[loc]?.category,
          proposed: OVERSEAS_CATEGORY[loc],
        }));
        built.push({
          id: o.id,
          slug: OVERSEAS_SLUG,
          allFields,
          changes: allFields.filter((f) => f.current !== f.proposed),
        });
      }

      setRows(built);
      setLoading(false);
    })();
  }, []);

  const targets = rows.filter((r) => r.changes.length > 0);

  const run = async () => {
    setRunning(true);
    for (const row of targets) {
      try {
        const payload: Record<string, string> = {};
        for (const c of row.changes) payload[c.path] = c.proposed;
        await updateDoc(doc(db, "columns", row.id), payload);
        setRows((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, result: "applied" } : r)),
        );
      } catch (e) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === row.id ? { ...r, result: "error", detail: String(e) } : r,
          ),
        );
      }
    }
    setRunning(false);
    setDone(true);
  };

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">コラムcategory 後埋め</h1>
      <p className="mb-2 max-w-2xl text-sm text-text-muted">
        台湾9本のcategoryを「{TAIWAN_CATEGORY}」に統一し、overseas-owners-guide-japan-real-estate-saleの
        category翻訳（en/zh-tw/zh）を追加します。上記以外のフィールドは一切変更しません。
      </p>
      <p className="mb-6 max-w-2xl rounded-lg bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
        現状値と提案値が一致するフィールドは自動スキップされます（再実行しても安全・冪等）。
      </p>

      {loading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : (
        <>
          <div className="mb-4 space-y-4">
            {rows.map((r) => (
              <div key={r.id} className="overflow-x-auto rounded-xl border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border bg-surface-dim px-4 py-2">
                  <span className="font-mono text-xs font-medium text-text">{r.slug}</span>
                  {r.result === "applied" && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                      適用
                    </span>
                  )}
                  {r.result === "error" && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600">
                      エラー: {r.detail}
                    </span>
                  )}
                  {!r.result && r.changes.length === 0 && (
                    <span className="text-[10px] text-text-muted/50">変更なし（スキップ）</span>
                  )}
                </div>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2 font-medium text-text-muted">フィールド</th>
                      <th className="px-4 py-2 font-medium text-text-muted">現状</th>
                      <th className="px-4 py-2 font-medium text-text-muted">→ 提案</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.allFields.map((f) => {
                      const willChange = f.current !== f.proposed;
                      return (
                        <tr key={f.path} className="border-b border-border last:border-b-0">
                          <td className="px-4 py-2 font-mono text-text-muted">{f.label}</td>
                          <td className="px-4 py-2 text-text-muted">
                            {f.current ?? "(未設定)"}
                          </td>
                          <td className={`px-4 py-2 ${willChange ? "font-medium text-text" : "text-text-muted/50"}`}>
                            {willChange ? f.proposed : "―（変更なし）"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <p className="mb-4 text-sm text-text-muted">
            書き込み対象: {targets.length}件（未一致フィールドのみ） / 全{rows.length}件
          </p>

          <button
            onClick={run}
            disabled={running || done || targets.length === 0}
            className="relative overflow-hidden rounded-lg px-6 py-2 text-sm font-semibold text-text disabled:opacity-50"
          >
            <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
            <span className="relative">
              {running ? "適用中..." : done ? "完了" : `${targets.length}件に適用する`}
            </span>
          </button>
        </>
      )}
    </div>
  );
}
