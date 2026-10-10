import type { BusinessKey, ColumnInput, ColumnStatus } from "@/lib/column-shared";

/**
 * コラムの「正午の自動公開」で、画面とサーバーが共有する定数・型・判定（2026-10-08〜）。
 * Prisma を import しないこと（管理画面のクライアントからも読む純粋モジュール）。
 *
 * 仕組み（設計の正本は docs/columns-autopublish.md）：
 * - 追記型の3つのseed（不動産daily・行政書士・社労士）にあって、DBにまだ無い記事を
 *   毎日12時台（JST）に自動で公開する。起動は GitHub Actions（columns-autopublish.yml）
 * - 止めたい記事は、管理画面 /admin/columns/autopublish で「保留」を押す。
 *   保留＝その記事を**下書き（status=draft）としてDBに入れる**こと。
 *   自動公開は「DBに無い記事」だけを対象にするので、下書きは公開されない
 * - DBに既にある記事（公開・下書き・削除）には、自動公開は一切触れない。
 *   手で非公開にした記事が、翌日の正午に勝手に戻ることはない
 */

/** 自動公開の時刻（JST）。GitHub Actions の cron は 03:00 UTC＝12:00 JST */
export const AUTOPUBLISH_HOUR_JST = 12;

/**
 * 1回の自動公開で出してよい本数の上限。
 * ふだんは1日6本。これを大きく超えるのは、DBの取り違えや投入の失敗が続いたときなので、
 * 公開せずに止めて人に回す（Issue が立つ）。止めた分は、確認のうえ
 * 管理画面の「今すぐ公開」か、workflow_dispatch の force で出す。
 */
export const AUTOPUBLISH_MAX_PER_RUN = 24;

export type AutopublishItem = {
  /** `${business}:${slug}` */
  key: string;
  business: BusinessKey;
  slug: string;
  title: string;
  date: string;
  category: string;
  /** 日本語ページのパス（/column/… ・/legal/column/… ・/labor/column/…） */
  path: string;
  /** DBにある場合の id（保留中＝下書きの記事だけが持つ） */
  id?: string;
  /** Quality hold without writing a draft to DB. Explicit per-article publishing is separate. */
  qualityHoldReasons?: string[];
  skipReason?: string;
};

/** 管理画面の一覧 */
export type AutopublishOverview = {
  generatedAt: string;
  /** 判定に使った「今日」（JST・YYYY-MM-DD） */
  todayJst: string;
  /** DBに無い記事＝次の正午に公開される */
  pending: AutopublishItem[];
  /** DBに下書きで入っている記事＝自動公開しない（保留中） */
  held: AutopublishItem[];
  /** date が明日以降の記事＝その日まで対象外 */
  scheduled: AutopublishItem[];
  publishedCount: number;
};

/** 自動公開・手動公開の結果 */
export type AutopublishRunResult = {
  ok: boolean;
  dryRun: boolean;
  runAt: string;
  todayJst: string;
  /** 今回公開する（した）対象 */
  targets: AutopublishItem[];
  /** 実際に公開した記事（dryRun では空） */
  published: AutopublishItem[];
  /** Registered by a concurrent operation; never republished or notified again. */
  skipped?: AutopublishItem[];
  /** 保留中のため公開しなかった記事 */
  held: AutopublishItem[];
  scheduled: AutopublishItem[];
  errors: { key: string; message: string }[];
  /** DBの更新は済んだが、公開ページの再生成に失敗したとき */
  refreshError?: string;
  /** 上限超えなどで公開を止めたときの理由 */
  blocked?: string;
};

export type DbColumnState = {
  id: string;
  business: BusinessKey;
  slug: string;
  status: ColumnStatus;
};

type SeedLike = Pick<ColumnInput, "business" | "slug" | "date">;

export type AutopublishClassification<T extends SeedLike> = {
  pending: T[];
  held: { article: T; id: string }[];
  scheduled: T[];
  published: T[];
  deleted: T[];
};

export function articleKey(business: string, slug: string): string {
  return `${business}:${slug}`;
}

export function columnPath(business: BusinessKey, slug: string): string {
  return `${business === "realestate" ? "" : `/${business}`}/column/${slug}`;
}

/** JST の日付（YYYY-MM-DD）。seed の date は JST の公開日なので、比較もJSTで行う */
export function todayInJst(now: Date): string {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/**
 * seed の記事を、DBの状態で振り分ける。
 * - DBに無い：date が今日以前なら pending（自動公開の対象）、明日以降なら scheduled
 * - DBに下書き：held（保留中。自動公開しない）
 * - DBに公開・削除：published / deleted（触らない）
 * 同じ (business, slug) が重複していたら最初の1件だけを使う。出力は date の古い順。
 */
export function classifyAutopublish<T extends SeedLike>(
  articles: readonly T[],
  rows: readonly DbColumnState[],
  todayJst: string,
): AutopublishClassification<T> {
  const byKey = new Map(rows.map((row) => [articleKey(row.business, row.slug), row]));
  const result: AutopublishClassification<T> = {
    pending: [],
    held: [],
    scheduled: [],
    published: [],
    deleted: [],
  };
  const seen = new Set<string>();
  const sorted = [...articles].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      articleKey(a.business, a.slug).localeCompare(articleKey(b.business, b.slug)),
  );
  for (const article of sorted) {
    const key = articleKey(article.business, article.slug);
    if (seen.has(key)) continue;
    seen.add(key);
    const row = byKey.get(key);
    if (!row) {
      (article.date > todayJst ? result.scheduled : result.pending).push(article);
    } else if (row.status === "draft") {
      result.held.push({ article, id: row.id });
    } else if (row.status === "published") {
      result.published.push(article);
    } else {
      result.deleted.push(article);
    }
  }
  return result;
}
