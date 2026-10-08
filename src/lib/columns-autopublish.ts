import "server-only";

import type { Business } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { updateColumn, upsertColumnBySlug } from "@/lib/db/columns";
import { refreshColumnPublication } from "@/lib/column-publication-cache";
import type { ColumnInput } from "@/lib/column-shared";
import { REALESTATE_COLUMNS_DAILY_SEED } from "@/lib/data/realestate-columns-daily-seed";
import { SOUZOKU_LEGAL_COLUMNS_SEED } from "@/lib/data/souzoku-legal-columns-seed";
import { LABOR_COLUMNS_SEED } from "@/lib/data/labor-columns-seed";
import {
  AUTOPUBLISH_MAX_PER_RUN,
  articleKey,
  classifyAutopublish,
  columnPath,
  todayInJst,
  type AutopublishItem,
  type AutopublishOverview,
  type AutopublishRunResult,
  type DbColumnState,
} from "@/lib/columns-autopublish-shared";

/**
 * コラムの「正午の自動公開」のサーバー側（2026-10-08〜）。
 * 仕組みと運用は src/lib/columns-autopublish-shared.ts の冒頭と docs/columns-autopublish.md。
 *
 * 呼び出し元：
 * - POST /api/cron/columns-autopublish（GitHub Actions・合言葉で認証）→ publishPendingColumns
 * - /api/admin/columns/autopublish（管理画面・ログインで認証）→ 一覧・保留・今すぐ公開
 */

type ErrorEntry = { key: string; message: string };

/** 自動公開の対象＝Daily Columns が毎日書き足す、追記型の3つのseed */
function dailySeedArticles(): ColumnInput[] {
  return [...REALESTATE_COLUMNS_DAILY_SEED, ...SOUZOKU_LEGAL_COLUMNS_SEED, ...LABOR_COLUMNS_SEED];
}

/** seed の (business, slug) がDBでどうなっているかを1回のクエリで読む */
async function loadDbStates(articles: readonly ColumnInput[]): Promise<DbColumnState[]> {
  const slugsByBusiness = new Map<string, string[]>();
  for (const article of articles) {
    const slugs = slugsByBusiness.get(article.business) ?? [];
    slugs.push(article.slug);
    slugsByBusiness.set(article.business, slugs);
  }
  if (slugsByBusiness.size === 0) return [];
  return prisma.column.findMany({
    where: {
      OR: [...slugsByBusiness].map(([business, slugs]) => ({
        business: business as Business,
        slug: { in: slugs },
      })),
    },
    select: { id: true, business: true, slug: true, status: true },
  });
}

function toItem(article: ColumnInput, id?: string): AutopublishItem {
  return {
    key: articleKey(article.business, article.slug),
    business: article.business,
    slug: article.slug,
    title: article.title,
    date: article.date,
    category: article.category,
    path: columnPath(article.business, article.slug),
    ...(id ? { id } : {}),
  };
}

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function classifyNow(now: Date) {
  const articles = dailySeedArticles();
  const todayJst = todayInJst(now);
  const rows = await loadDbStates(articles);
  return { todayJst, ...classifyAutopublish(articles, rows, todayJst) };
}

/** 管理画面の一覧（公開待ち・保留中・日付待ち） */
export async function getAutopublishOverview(now = new Date()): Promise<AutopublishOverview> {
  const c = await classifyNow(now);
  return {
    generatedAt: now.toISOString(),
    todayJst: c.todayJst,
    pending: c.pending.map((article) => toItem(article)),
    held: c.held.map(({ article, id }) => toItem(article, id)),
    scheduled: c.scheduled.map((article) => toItem(article)),
    publishedCount: c.published.length,
  };
}

/** id がある＝保留中（下書き）の記事。無い＝DB未登録の記事 */
type PublishTarget = { article: ColumnInput; id?: string };

async function publishTargets(targets: readonly PublishTarget[]): Promise<{
  published: AutopublishItem[];
  errors: ErrorEntry[];
  refreshError?: string;
}> {
  const published: AutopublishItem[] = [];
  const errors: ErrorEntry[] = [];
  for (const { article, id } of targets) {
    try {
      if (id) {
        // 保留中の記事は、本文を seed で上書きしない。管理画面で手直ししていても、その内容のまま公開する
        await updateColumn(id, { status: "published" });
      } else {
        await upsertColumnBySlug(article.business, article.slug, { ...article, status: "published" });
      }
      published.push(toItem(article, id));
    } catch (err) {
      errors.push({ key: articleKey(article.business, article.slug), message: messageOf(err) });
    }
  }
  if (published.length === 0) return { published, errors };
  try {
    // 詳細ページ（全言語）・一覧・サイトマップの再生成と、IndexNow への通知
    await refreshColumnPublication(published);
    return { published, errors };
  } catch (err) {
    return { published, errors, refreshError: messageOf(err) };
  }
}

/**
 * 正午の自動公開。DBに無い記事（公開待ち）をすべて公開する。保留中（下書き）には触れない。
 * - dryRun：対象を返すだけでDBは変えない
 * - force：上限（AUTOPUBLISH_MAX_PER_RUN）を超えても公開する（管理画面の「今すぐ公開」と、手動実行の force）
 */
export async function publishPendingColumns(
  opts: { dryRun?: boolean; force?: boolean; now?: Date } = {},
): Promise<AutopublishRunResult> {
  const now = opts.now ?? new Date();
  const c = await classifyNow(now);
  const base = {
    dryRun: Boolean(opts.dryRun),
    runAt: now.toISOString(),
    todayJst: c.todayJst,
    targets: c.pending.map((article) => toItem(article)),
    held: c.held.map(({ article, id }) => toItem(article, id)),
    scheduled: c.scheduled.map((article) => toItem(article)),
  };
  if (c.pending.length > AUTOPUBLISH_MAX_PER_RUN && !opts.force) {
    return {
      ...base,
      ok: false,
      published: [],
      errors: [],
      blocked:
        `公開待ちが${c.pending.length}本あり、1回の上限（${AUTOPUBLISH_MAX_PER_RUN}本）を超えたため止めました。` +
        "対象を確かめてから、管理画面の「今すぐ公開」か、手動実行（force）で公開してください。",
    };
  }
  if (base.dryRun || c.pending.length === 0) {
    return { ...base, ok: true, published: [], errors: [] };
  }
  const result = await publishTargets(c.pending.map((article) => ({ article })));
  return {
    ...base,
    ok: result.errors.length === 0 && !result.refreshError,
    published: result.published,
    errors: result.errors,
    ...(result.refreshError ? { refreshError: result.refreshError } : {}),
  };
}

/** 管理画面から：指定した記事を今すぐ公開する（公開待ち・保留中のどちらでも） */
export async function publishColumnsByKey(
  keys: readonly string[],
  now = new Date(),
): Promise<AutopublishRunResult> {
  const c = await classifyNow(now);
  const wanted = new Set(keys);
  const targets: PublishTarget[] = [
    ...c.pending
      .filter((article) => wanted.has(articleKey(article.business, article.slug)))
      .map((article) => ({ article })),
    ...c.held.filter(({ article }) => wanted.has(articleKey(article.business, article.slug))),
  ];
  const found = new Set(targets.map(({ article }) => articleKey(article.business, article.slug)));
  const notFound: ErrorEntry[] = [...wanted]
    .filter((key) => !found.has(key))
    .map((key) => ({
      key,
      message: "公開待ち・保留中のどちらにもありません（公開済みか、日付が明日以降の記事です）",
    }));
  const result = await publishTargets(targets);
  const errors = [...notFound, ...result.errors];
  return {
    ok: errors.length === 0 && !result.refreshError,
    dryRun: false,
    runAt: now.toISOString(),
    todayJst: c.todayJst,
    targets: targets.map(({ article, id }) => toItem(article, id)),
    published: result.published,
    held: [],
    scheduled: [],
    errors,
    ...(result.refreshError ? { refreshError: result.refreshError } : {}),
  };
}

/**
 * 管理画面から：指定した記事を保留にする。
 * 保留＝下書き（status=draft）としてDBに入れること。公開ページには出ず、正午の自動公開の対象からも外れる。
 */
export async function holdColumnsByKey(
  keys: readonly string[],
  now = new Date(),
): Promise<{ ok: boolean; held: AutopublishItem[]; errors: ErrorEntry[] }> {
  const c = await classifyNow(now);
  const holdable = new Map(
    [...c.pending, ...c.scheduled].map((article) => [articleKey(article.business, article.slug), article]),
  );
  const alreadyHeld = new Set(c.held.map(({ article }) => articleKey(article.business, article.slug)));
  const held: AutopublishItem[] = [];
  const errors: ErrorEntry[] = [];
  // 一覧を読んだあと、正午の自動公開と行き違いで公開されていた記事。下書きに戻したので公開ページも消す
  const raced: AutopublishItem[] = [];
  for (const key of new Set(keys)) {
    if (alreadyHeld.has(key)) continue;
    const article = holdable.get(key);
    if (!article) {
      errors.push({ key, message: "公開待ちの記事ではありません（すでに公開済みか、seedにない記事です）" });
      continue;
    }
    try {
      const { id, action } = await upsertColumnBySlug(article.business, article.slug, {
        ...article,
        status: "draft",
      });
      const item = toItem(article, id);
      held.push(item);
      if (action === "updated") raced.push(item);
    } catch (err) {
      errors.push({ key, message: messageOf(err) });
    }
  }
  if (raced.length > 0) {
    try {
      await refreshColumnPublication(raced);
    } catch (err) {
      errors.push({ key: raced.map((item) => item.key).join(","), message: messageOf(err) });
    }
  }
  return { ok: errors.length === 0, held, errors };
}
