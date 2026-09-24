import type { FeedProvider } from "@/lib/school-rental-feed";

/**
 * データ利用許諾台帳（ペット横断 指示書 版2.0 第7章）。
 * - 用途ごとに別々に確認する。閲覧できること・広告転載区分は、保存や集計公表の許諾の代わりにならない。
 * - ここに無い組合せはすべて拒否する。2026-09-24 時点で確認済みの許諾は無い（Phase 1 報告書 第7章）。
 * - 追加・変更は PR で行い、浦松の確認を経てマージする。リクエストや DB からは受け取らない。
 * - evidenceRef には書面回答等の所在だけを書く。個人名・会員ID・パスワードは書かない。
 */
export const permissionUses = ["store", "aggregate", "ad", "image", "sns"] as const;
/** store＝内部保存・加工／aggregate＝集計公表／ad＝個別広告／image＝画像・図面転載／sns＝SNS・広告配信 */
export type PermissionUse = typeof permissionUses[number];

export type LedgerEntry = {
  provider: FeedProvider;
  use: PermissionUse;
  status: "confirmed" | "contact-pending" | "expired" | "revoked";
  /** 媒体規約・会員契約の版。 */
  termsVersion: string;
  /** 確認日（YYYY-MM-DD）。 */
  checkedOn: string;
  /** この記載が効力を持ち始める日時（ISO 8601）。撤回は新しい validFrom の revoked 行を足す。 */
  validFrom: string;
  /** 許諾の期限（ISO 8601）。無期限なら null。 */
  validUntil: string | null;
  evidenceRef: string;
  /** 公開時の出典表記。媒体名の表記が許されている場合だけ入れる。 */
  attribution: string | null;
};

export const DATA_USE_LEDGER: readonly LedgerEntry[] = [];

/** その時点で効力を持つ記載（validFrom が最も新しいもの。同時刻なら確認済み以外＝拒否側を採る）。 */
function effectiveEntry(ledger: readonly LedgerEntry[], provider: string, use: PermissionUse, now: Date) {
  let found: LedgerEntry | undefined;
  for (const entry of ledger) {
    if (entry.provider !== provider || entry.use !== use) continue;
    const from = Date.parse(entry.validFrom);
    if (!Number.isFinite(from) || from > now.getTime()) continue;
    const current = found ? Date.parse(found.validFrom) : -Infinity;
    if (from > current || (from === current && entry.status !== "confirmed")) found = entry;
  }
  return found;
}

export function isPermitted(ledger: readonly LedgerEntry[], provider: string, use: PermissionUse, now: Date) {
  const entry = effectiveEntry(ledger, provider, use, now);
  if (!entry || entry.status !== "confirmed") return false;
  if (entry.validUntil === null) return true;
  const until = Date.parse(entry.validUntil);
  return Number.isFinite(until) && now.getTime() < until;
}

/** 集計公表の出典表記。許諾が無い、または表記の許可が無ければ null。 */
export function aggregateAttribution(ledger: readonly LedgerEntry[], provider: string, now: Date) {
  if (!isPermitted(ledger, provider, "aggregate", now)) return null;
  return effectiveEntry(ledger, provider, "aggregate", now)?.attribution ?? null;
}
