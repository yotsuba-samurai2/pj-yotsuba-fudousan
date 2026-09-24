import { createHash } from "node:crypto";
import type { LangCode } from "@/config/languages";
import { isPubliclyVisible, toPublicProperty, type AdminProperty, type PropertyInput } from "@/lib/property-shared";
import { addLocalePrefix, SUPPORTED_LOCALES } from "@/lib/locale";

/**
 * 物件の「公開内容の実質的な変更」の検知と、検索エンジン通知（IndexNow）の永続的な再試行。
 * DB・送信は呼び出し側から注入する（純粋ロジック＝テスト可能）。
 *
 * - ハッシュの入力は toPublicProperty() の公開値だけ。internal・原本・確認記録は入らない。
 * - 情報更新日・次回更新予定日・賃貸の確認期限（availabilityExpiresAt）だけの変化は「変更なし」。
 * - 変更1件＝イベント1行。再試行は同じ行に対して行う（同じ変更を別の変更として増やさない）。
 *   A→B→A は内容が毎回変わるので、それぞれ別のイベントになる。
 * - 通知の成否は保存・公開停止の成否に影響させない。
 */

export type PublicationEventKind = "published" | "changed" | "unpublished" | "expired";
export type NotifyStatus = "pending" | "sent" | "skipped" | "failed";

export type PublicationEvent = {
  id: string;
  slug: string;
  kind: PublicationEventKind;
  urls: string[];
  notifyStatus: NotifyStatus;
  attempts: number;
  nextAttemptAt: Date | null;
  createdAt: Date;
};

export interface PublicationEventStore {
  insert(e: { slug: string; kind: PublicationEventKind; contentHash: string | null; urls: string[]; nextAttemptAt: Date }): Promise<void>;
  due(now: Date, limit: number): Promise<PublicationEvent[]>;
  mark(id: string, patch: { notifyStatus: NotifyStatus; attempts: number; nextAttemptAt: Date | null; lastStatus: number | null }): Promise<void>;
  latestKind(slug: string): Promise<PublicationEventKind | null>;
}

type Snapshot = { locales: LangCode[]; hash: string | null };

function canonical(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(canonical);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v).filter(([, x]) => x !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => [k, canonical(x)]),
    );
  }
  return v;
}

/** 検索エンジン向けの公開内容ハッシュ（contentReview の digest とは別物） */
export function publicContentHash(p: AdminProperty | PropertyInput): string {
  const pub = toPublicProperty(p);
  const { infoUpdatedAt: _i, nextUpdateAt: _n, status: _s, ...rest } = pub;
  void _i; void _n; void _s;
  const spec = { ...(rest.spec as Record<string, unknown>) };
  delete spec.availabilityExpiresAt;
  return createHash("sha256").update(JSON.stringify(canonical({ ...rest, spec }))).digest("hex");
}

export function publicationSnapshot(p: AdminProperty | PropertyInput | null | undefined, now: Date): Snapshot {
  if (!p) return { locales: [], hash: null };
  const pub = toPublicProperty(p);
  const locales = SUPPORTED_LOCALES.filter((l) => isPubliclyVisible(pub, l, now));
  return { locales, hash: locales.length > 0 ? publicContentHash(p) : null };
}

/** 通知対象＝自社の正規公開パスのみ（個別URL＋対応する一覧URL）。管理画面・取得元URLは入らない */
export function publicationPaths(slug: string, locales: readonly LangCode[]): string[] {
  return locales.flatMap((l) => [addLocalePrefix(`/bukken/${slug}`, l), addLocalePrefix("/bukken", l)]);
}

export type PublicationChange = { kind: PublicationEventKind; urls: string[]; contentHash: string | null };

/** 変更前後の公開状態を比べる。実質的な変化が無ければ null（＝通知しない） */
export function detectPublicationChange(
  before: AdminProperty | PropertyInput | null | undefined,
  after: AdminProperty | PropertyInput | null | undefined,
  now: Date,
): PublicationChange | null {
  const slug = after?.slug ?? before?.slug;
  if (!slug) return null;
  const a = publicationSnapshot(before, now);
  const b = publicationSnapshot(after, now);
  const sameLocales = a.locales.length === b.locales.length && a.locales.every((l) => b.locales.includes(l));
  if (sameLocales && a.hash === b.hash) return null;
  const affected = SUPPORTED_LOCALES.filter((l) => a.locales.includes(l) || b.locales.includes(l));
  if (affected.length === 0) return null; // 下書き同士の内部編集
  const kind: PublicationEventKind = a.locales.length === 0 ? "published" : b.locales.length === 0 ? "unpublished" : "changed";
  const urls = [...new Set(publicationPaths(slug, affected).concat(before && before.slug !== slug ? publicationPaths(before.slug, a.locales) : []))];
  return { kind, urls, contentHash: b.hash };
}

export async function recordPublicationChange(
  store: PublicationEventStore,
  before: AdminProperty | PropertyInput | null | undefined,
  after: AdminProperty | PropertyInput | null | undefined,
  now: Date,
): Promise<PublicationChange | null> {
  const change = detectPublicationChange(before, after, now);
  if (!change) return null;
  await store.insert({ slug: (after?.slug ?? before!.slug), ...change, nextAttemptAt: now });
  return change;
}

export const MAX_NOTIFY_ATTEMPTS = 6;
const BACKOFF_BASE_MS = 5 * 60 * 1000;
/** 設定不備（キー不一致・ホスト不一致・不正なURL）。再試行しても直らない */
const PERMANENT_STATUSES = new Set([400, 403, 422]);

export type NotifyResult = { ok: boolean; status?: number; skipped?: string };

/** 期限が来た未送信イベントを送る。429・5xx・タイムアウトは上限つきバックオフで再試行 */
export async function processPendingNotifications(
  store: PublicationEventStore,
  send: (urls: string[]) => Promise<NotifyResult>,
  now: Date,
  limit = 20,
): Promise<{ sent: number; retry: number; failed: number; skipped: number }> {
  const out = { sent: 0, retry: 0, failed: 0, skipped: 0 };
  for (const e of await store.due(now, limit)) {
    let r: NotifyResult;
    try {
      r = await send(e.urls);
    } catch {
      r = { ok: false };
    }
    const attempts = e.attempts + 1;
    if (r.ok) {
      // 本番以外では実送信しない（skipped）。「送信済み」とは記録しない
      const status: NotifyStatus = r.skipped ? "skipped" : "sent";
      await store.mark(e.id, { notifyStatus: status, attempts, nextAttemptAt: null, lastStatus: r.status ?? null });
      out[status === "sent" ? "sent" : "skipped"]++;
    } else if ((r.status !== undefined && PERMANENT_STATUSES.has(r.status)) || attempts >= MAX_NOTIFY_ATTEMPTS) {
      await store.mark(e.id, { notifyStatus: "failed", attempts, nextAttemptAt: null, lastStatus: r.status ?? null });
      out.failed++;
    } else {
      const next = new Date(now.getTime() + BACKOFF_BASE_MS * 2 ** (attempts - 1));
      await store.mark(e.id, { notifyStatus: "pending", attempts, nextAttemptAt: next, lastStatus: r.status ?? null });
      out.retry++;
    }
  }
  return out;
}
