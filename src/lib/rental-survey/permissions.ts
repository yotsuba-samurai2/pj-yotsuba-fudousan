import type { FeedProvider } from "@/lib/school-rental-feed";

/**
 * データ利用許諾台帳（ペット横断 指示書 版2.0 第7章）。
 * - 用途ごとに別々に確認する。閲覧できること・広告転載区分は、保存や集計公表の許諾の代わりにならない。
 * - ここに無い組合せはすべて拒否する。
 * - 2026-09-24：4媒体の「内部保存・加工」と「集計公表」を、浦松（宅地建物取引士・会員）の判断として記載した。
 *   媒体の書面回答は無い（根拠は evidenceRef）。公表は媒体名を出さない当社の独自集計とし、attribution は null。
 *   指示書 第7章は「媒体名の省略・独自集計の表記は許諾確認の代わりにならない」としているため、判断の根拠をここに残す。
 *   個別広告・画像転載・SNS は未確認のまま（記載なし＝拒否）。書面回答が届いたら evidenceRef と termsVersion を更新する。
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

/** 2026-09-24 浦松判断の記載（媒体の書面回答なし）。撤回するときは、新しい validFrom の revoked 行を足す。 */
const JUDGED_ON = "2026-09-24";
const JUDGED_FROM = "2026-09-24T00:00:00+09:00";
const JUDGED_TERMS = "会員規約（版は未確認・書面回答なし）";
const JUDGED_EVIDENCE: Record<"store" | "aggregate", string> = {
  store: "2026-09-24 浦松判断：会員として、媒介目的（ペット住宅の相談者への物件提案）の内部利用。媒体の書面回答なし",
  aggregate: "2026-09-24 浦松判断：媒体名を出さない当社の独自集計として、件数のみを /pet-housing に公表。媒体の書面回答なし",
};

export const DATA_USE_LEDGER: readonly LedgerEntry[] = (["reins", "atbb", "itandi", "eslife"] as const).flatMap(provider =>
  (["store", "aggregate"] as const).map((use): LedgerEntry => ({
    provider, use, status: "confirmed", termsVersion: JUDGED_TERMS, checkedOn: JUDGED_ON,
    validFrom: JUDGED_FROM, validUntil: null, evidenceRef: JUDGED_EVIDENCE[use], attribution: null,
  })),
);

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
