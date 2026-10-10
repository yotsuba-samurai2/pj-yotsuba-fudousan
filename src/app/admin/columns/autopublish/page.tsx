"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  getAutopublishOverview,
  holdAutopublishColumns,
  publishAllPendingColumns,
  publishAutopublishColumns,
} from "@/lib/admin-api";
import {
  AUTOPUBLISH_HOUR_JST,
  type AutopublishItem,
  type AutopublishOverview,
} from "@/lib/columns-autopublish-shared";

/**
 * 正午の自動公開の確認と保留（2026-10-08〜）。
 *
 * 毎朝7時の「四葉コラム」ドキュメントを読み、止めたい記事があればここで「保留」を押す。
 * 何もしなければ、公開待ちの記事は12時台（JST）に GitHub Actions が自動で公開する。
 * 保留＝下書きとしてDBに入れること。自動公開はDBに無い記事だけが対象なので、保留した記事は出ない。
 * 仕組みの正本は docs/columns-autopublish.md。
 */

const businessLabels: Record<AutopublishItem["business"], string> = {
  realestate: "不動産",
  legal: "行政書士",
  labor: "社労士",
};

type ActionResult = {
  ok: boolean;
  errors: { key: string; message: string }[];
  refreshError?: string;
};

function formatJst(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ColumnsAutopublishPage() {
  const [overview, setOverview] = useState<AutopublishOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setOverview(await getAutopublishOverview());
    } catch (err) {
      setError(err instanceof Error ? err.message : "一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const run = async (busyKey: string, action: () => Promise<ActionResult>, doneMessage: string) => {
    setBusy(busyKey);
    setNotice("");
    setError("");
    try {
      const result = await action();
      const problems = [
        ...result.errors.map((e) => `${e.key}：${e.message}`),
        ...(result.refreshError ? [`公開ページの更新：${result.refreshError}`] : []),
      ];
      if (result.ok) setNotice(doneMessage);
      else setError(problems.join("\n") || "一部の処理に失敗しました");
    } catch (err) {
      setError(err instanceof Error ? err.message : "処理に失敗しました");
    } finally {
      setBusy(null);
      await load();
    }
  };

  const hold = (items: AutopublishItem[]) =>
    run(
      items.length === 1 ? items[0].key : "hold-all",
      () => holdAutopublishColumns(items.map((item) => item.key)),
      `${items.length}本を保留にしました。正午には公開されません。`,
    );

  const publish = (item: AutopublishItem) => {
    if (!window.confirm(`「${item.title}」を今すぐ公開しますか？`)) return;
    run(item.key, () => publishAutopublishColumns([item.key]), "公開しました。");
  };

  const publishAllNow = () => {
    const count = overview?.pending.length ?? 0;
    if (!window.confirm(`公開待ちの${count}本を、正午を待たずに今すぐ公開しますか？（保留中の記事は公開しません）`)) return;
    run("publish-all", publishAllPendingColumns, `${count}本を公開しました。`);
  };

  const holdAll = () => {
    const items = overview?.pending ?? [];
    if (!window.confirm(`公開待ちの${items.length}本をすべて保留にしますか？`)) return;
    hold(items);
  };

  const pending = overview?.pending ?? [];
  const held = overview?.held ?? [];
  const scheduled = overview?.scheduled ?? [];

  const row = (item: AutopublishItem, actions: ReactNode) => (
    <li
      key={item.key}
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface-dim px-3 py-2 text-sm"
    >
      <span className="min-w-0 flex-1">
        <span className="mr-2 text-xs text-text-muted">
          {businessLabels[item.business]}・{item.date}
        </span>
        <span className="break-words">{item.title}</span>
        {item.qualityHoldReasons?.length ? (
          <span className="mt-1 block text-xs text-amber-700">
            自動公開は確認待ち：{item.qualityHoldReasons.join("／")}
          </span>
        ) : null}
      </span>
      <span className="flex shrink-0 gap-2">{actions}</span>
    </li>
  );

  const smallButton = "rounded-lg border border-border px-3 py-1 text-xs disabled:opacity-50";

  return (
    <div className="p-6">
      <h1 className="mb-1 text-lg font-bold">コラムの自動公開（毎日{AUTOPUBLISH_HOUR_JST}時台）</h1>
      <p className="mb-4 max-w-3xl text-sm text-text-muted">
        レビューと4言語の確認が通った記事は、毎日{AUTOPUBLISH_HOUR_JST}時台に自動で公開されます。
        朝7時のドキュメントを読んで、止めたい記事があれば「保留」を押してください。
        保留した記事は下書きとして保存され、自動では公開されません。
      </p>

      {notice && (
        <p className="mb-4 max-w-3xl rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</p>
      )}
      {error && (
        <p className="mb-4 max-w-3xl whitespace-pre-line rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="max-w-3xl space-y-6">
        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-base font-bold">公開待ち（{loading ? "…" : `${pending.length}本`}）</h2>
            <button
              type="button"
              onClick={holdAll}
              disabled={busy !== null || pending.length === 0}
              className={smallButton}
            >
              すべて保留
            </button>
            <button
              type="button"
              onClick={publishAllNow}
              disabled={busy !== null || pending.length === 0}
              className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
            >
              今すぐ公開
            </button>
          </div>
          <p className="mb-3 text-xs text-text-muted">
            確認済みの記事を今日の{AUTOPUBLISH_HOUR_JST}時台に公開します（{AUTOPUBLISH_HOUR_JST}
            時を過ぎていれば、翌日の{AUTOPUBLISH_HOUR_JST}時台）。確認待ちの理由がある記事は自動公開しません。
          </p>
          {pending.length === 0 ? (
            <p className="text-sm text-text-muted">{loading ? "読み込み中…" : "公開待ちの記事はありません。"}</p>
          ) : (
            <ul className="space-y-2">
              {pending.map((item) =>
                row(
                  item,
                  <button
                    type="button"
                    onClick={() => hold([item])}
                    disabled={busy !== null}
                    className={smallButton}
                  >
                    {busy === item.key ? "保留中…" : "保留"}
                  </button>,
                ),
              )}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-1 text-base font-bold">保留中（{loading ? "…" : `${held.length}本`}）</h2>
          <p className="mb-3 text-xs text-text-muted">
            下書きとして保存されていて、自動では公開されません。直すときは「編集」、出してよければ「公開する」。
          </p>
          {held.length === 0 ? (
            <p className="text-sm text-text-muted">{loading ? "読み込み中…" : "保留中の記事はありません。"}</p>
          ) : (
            <ul className="space-y-2">
              {held.map((item) =>
                row(
                  item,
                  <>
                    {item.id && (
                      <Link href={`/admin/columns/${item.id}`} className={smallButton}>
                        編集
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => publish(item)}
                      disabled={busy !== null}
                      className={smallButton}
                    >
                      {busy === item.key ? "公開中…" : "公開する"}
                    </button>
                  </>,
                ),
              )}
            </ul>
          )}
        </section>

        {scheduled.length > 0 && (
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="mb-1 text-base font-bold">日付待ち（{scheduled.length}本）</h2>
            <p className="mb-3 text-xs text-text-muted">記事の日付が明日以降のため、その日になるまで公開されません。</p>
            <ul className="space-y-2">
              {scheduled.map((item) =>
                row(
                  item,
                  <button
                    type="button"
                    onClick={() => hold([item])}
                    disabled={busy !== null}
                    className={smallButton}
                  >
                    保留
                  </button>,
                ),
              )}
            </ul>
          </section>
        )}

        <p className="text-xs text-text-muted">
          {overview && `公開済み ${overview.publishedCount}本・${formatJst(overview.generatedAt)} 時点。`}
          従来の投入画面（seed-…）から投入すると、範囲に入った保留中の記事も公開されます（最新日のみ・全件とも）。
        </p>

        <div className="flex gap-3">
          <button type="button" onClick={() => load()} disabled={loading || busy !== null} className={smallButton}>
            再読み込み
          </button>
          <Link href="/admin/columns" className={smallButton}>
            コラム一覧へ
          </Link>
        </div>
      </div>
    </div>
  );
}
