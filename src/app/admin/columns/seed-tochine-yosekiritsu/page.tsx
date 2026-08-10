"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getColumns, upsertColumnBySlug } from "@/lib/admin-api";
import type { ColumnStatus } from "@/lib/admin-api";
import { TOCHINE_YOSEKIRITSU_SEED } from "@/lib/data/tochine-yosekiritsu-seed";

type ItemResult = {
  slug: string;
  title: string;
  status: "pending" | "done" | "error";
  action?: "created" | "updated";
  message?: string;
};

/**
 * 容積率補正と土地値のコラム1本（4ロケール）のupsert投入。
 *
 * 原稿＝四葉基幹CRM「コラム草稿_容積率補正と土地値_ja_v0.1.md」＋同「_多言語_v0.1.md」
 * （2026-08-10 Claude作成・浦松検収済）。
 *
 * status="draft" で入り、浦松が最終確認のうえ管理画面から公開へ切り替える。
 * **このページは公開までは行わない。**
 *
 * status の扱いは seed-leaving-japan と同じ事故防止措置を踏襲する。
 * 投入前に既存コラムを取得し、既に存在する slug については既存の status を
 * そのまま引き継ぐ（新規作成のときだけ seed 定数の "draft" を使う）。
 * これにより本文の修正を何度でも安全に再投入できる。
 */
export default function SeedTochineYosekiritsuPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ItemResult[]>(
    TOCHINE_YOSEKIRITSU_SEED.map((a) => ({
      slug: a.slug,
      title: a.title,
      status: "pending",
    })),
  );
  const router = useRouter();

  const handleRun = async () => {
    setRunning(true);

    let existingStatusBySlug: Record<string, ColumnStatus>;
    try {
      const existing = await getColumns("realestate");
      existingStatusBySlug = Object.fromEntries(
        existing.map((c) => [c.slug, c.status]),
      );
    } catch (err) {
      setResults((prev) =>
        prev.map((r) => ({
          ...r,
          status: "error",
          message: `既存コラムの取得に失敗したため中止しました（公開中の記事をdraftに戻さないため）: ${String(err)}`,
        })),
      );
      setRunning(false);
      return;
    }

    for (let i = 0; i < TOCHINE_YOSEKIRITSU_SEED.length; i++) {
      const seeded = TOCHINE_YOSEKIRITSU_SEED[i];
      const keptStatus = existingStatusBySlug[seeded.slug];
      const article = keptStatus ? { ...seeded, status: keptStatus } : seeded;
      try {
        const { action } = await upsertColumnBySlug(
          article.business,
          article.slug,
          article,
        );
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "done", action } : r,
          ),
        );
      } catch (err) {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "error", message: String(err) } : r,
          ),
        );
      }
    }

    setRunning(false);
    router.refresh();
  };

  const done = results.filter((r) => r.status === "done").length;
  const errors = results.filter((r) => r.status === "error").length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">
        容積率補正と土地値のコラム投入（1本・4ロケール）
      </h1>

      <div className="mt-4 space-y-2 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm">
        <p>
          <strong>下書きで投入します。</strong>
          公開はこのページでは行いません。投入後、管理画面のコラム一覧から内容を確認し、
          浦松の最終確認を経てから公開へ切り替えてください。
        </p>
        <p>
          slug が既にある場合は
          <strong>既存の公開状態をそのまま引き継ぎます</strong>
          （公開中の記事が下書きに戻ることはありません）。何度実行しても重複しません。
        </p>
        <p className="text-amber-900">
          本文中の数値は<strong>すべて説明用の仮設定</strong>で、実案件の数値は含まれていません。
          容積率差の累乗補正（指数0.5〜0.7）は
          <strong>法令ではなく実務上の経験則</strong>である旨を本文に明記しています。
        </p>
        <p className="text-amber-900">
          <code>date</code> は投入日（2026-08-10）です。
          <strong>公開に切り替えるときに、実際の公開日へ直してください。</strong>
          この値は記事の表示日付と sitemap の <code>lastmod</code> の両方に効きます
          （下書きのあいだは sitemap に出ないため実害はありません）。
        </p>
        <p className="text-amber-900">
          <code>locales</code> は ja / en / zh-tw / zh の4件です。
          <strong>4ロケールとも本文が別内容</strong>
          のため、各ロケールURLが自己canonicalになります （PR#212 と同じ扱い。PR#210・#211
          の ja 固定とは逆なので混同しないこと）。
        </p>
      </div>

      <button
        type="button"
        onClick={handleRun}
        disabled={running}
        className="mt-6 rounded-md bg-primary px-5 py-2.5 text-white disabled:opacity-50"
      >
        {running
          ? "投入中…"
          : `${TOCHINE_YOSEKIRITSU_SEED.length}本を投入する（新規は下書き）`}
      </button>

      <p className="mt-3 text-sm text-muted-foreground">
        完了 {done} / {results.length}
        {errors > 0 ? ` ・ エラー ${errors}` : ""}
      </p>

      <ul className="mt-6 space-y-3">
        {results.map((r) => (
          <li key={r.slug} className="rounded-md border p-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {r.slug}
                </p>
              </div>
              <span className="shrink-0 text-xs">
                {r.status === "pending" && "未実行"}
                {r.status === "done" &&
                  (r.action === "created" ? "新規作成" : "更新")}
                {r.status === "error" && "エラー"}
              </span>
            </div>
            {r.message && (
              <p className="mt-2 text-xs text-red-600">{r.message}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
