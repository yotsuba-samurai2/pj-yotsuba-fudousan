import { surveyBatchSchema, type SurveyBatch } from "./batch";
import { isPermitted, type LedgerEntry } from "./permissions";
import { DEDUP_VERSION, type SurveyScope } from "./scope";
import { compileSurveySnapshot, surveySnapshotSchema, type Observation, type SurveySnapshot } from "./units";

/**
 * 確定・巻き戻しの可否を決める（ペット横断 指示書 版2.0 第4.2章）。DB には触れない。
 * - 確定：対象媒体すべての verified バッチが1つずつそろい、観測期間の幅が上限内で、現在の確定より古くないこと。
 * - 途中取得・失敗・媒体欠落・別 scope のバッチでは確定を置き換えない。
 * - 巻き戻し：同じ scope・版の過去の確定を写す。同一性判定の版が古いもの・許諾を失ったものには戻さない。
 */
export type StoredBatch = {
  id: string; scopeId: string; scopeVersion: number; provider: string; status: string;
  observedFrom: Date; observedTo: Date; payload: unknown;
};
export type StoredFinalization = {
  id: string; scopeId: string; scopeVersion: number; sequence: number; batchIds: string[]; providers: string[];
  dedupVersion: number; observedFrom: Date; observedTo: Date; snapshot: unknown; rolledBackFrom: string | null; createdAt: Date;
};
export type FinalizationData = {
  batchIds: string[]; providers: string[]; dedupVersion: number;
  observedFrom: Date; observedTo: Date; snapshot: SurveySnapshot; rolledBackFrom: string | null;
};
export type FinalizationPlan =
  | { ok: true; data: FinalizationData }
  | { ok: false; status: 400 | 403 | 409; error: string };

const DAY_MS = 86_400_000;
const fail = (status: 400 | 403 | 409, error: string): FinalizationPlan => ({ ok: false, status, error });

export function planFinalization({ scope, batches, latest, ledger, now }: {
  scope: SurveyScope; batches: StoredBatch[]; latest: StoredFinalization | null; ledger: readonly LedgerEntry[]; now: Date;
}): FinalizationPlan {
  const byProvider = new Map<string, StoredBatch>();
  for (const b of batches) {
    if (b.scopeId !== scope.scopeId || b.scopeVersion !== scope.version) return fail(400, "別の scope・版のバッチは確定に使えません");
    if (byProvider.has(b.provider)) return fail(400, "同じ媒体のバッチが複数指定されています");
    byProvider.set(b.provider, b);
  }
  const missing = scope.providers.filter(p => !byProvider.has(p));
  const extra = [...byProvider.keys()].filter(p => !(scope.providers as readonly string[]).includes(p));
  if (missing.length || extra.length)
    return fail(400, `対象媒体のバッチがそろっていません（不足：${missing.join("・") || "なし"}／対象外：${extra.join("・") || "なし"}）`);
  const denied = scope.providers.filter(p => !isPermitted(ledger, p, "store", now));
  if (denied.length) return fail(403, `内部保存・加工の許諾が確認されていない媒体があります：${denied.join("・")}`);
  const parsed: SurveyBatch[] = [];
  for (const b of byProvider.values()) {
    if (b.status !== "verified") return fail(400, `${b.provider} のバッチは確定に使えない状態です（${b.status}）`);
    const batch = surveyBatchSchema.safeParse(b.payload);
    if (!batch.success || batch.data.status !== "verified" || batch.data.provider !== b.provider
      || batch.data.scopeId !== scope.scopeId || batch.data.scopeVersion !== scope.version)
      return fail(400, `${b.provider} のバッチの内容を確認できません`);
    parsed.push(batch.data);
  }
  const from = Math.min(...parsed.map(b => Date.parse(b.observedFrom)));
  const to = Math.max(...parsed.map(b => Date.parse(b.observedTo)));
  if (to > now.getTime()) return fail(400, "観測終了に未来の日時は使えません");
  if (to - from > scope.maxWindowDays * DAY_MS) return fail(400, `観測期間の幅が${scope.maxWindowDays}日を超えています`);
  if (latest && to < latest.observedTo.getTime()) return fail(409, "現在の確定より古い観測です。戻す場合は巻き戻しを使ってください");
  const observations: Observation[] = parsed.flatMap(b => b.records.map(r => ({ ...r, provider: b.provider })));
  return {
    ok: true,
    data: {
      batchIds: [...byProvider.values()].map(b => b.id).sort(),
      providers: [...scope.providers].sort(),
      dedupVersion: DEDUP_VERSION,
      observedFrom: new Date(from),
      observedTo: new Date(to),
      snapshot: compileSurveySnapshot(observations, scope),
      rolledBackFrom: null,
    },
  };
}

export function planRollback({ scope, target, latest, ledger, now }: {
  scope: SurveyScope; target: StoredFinalization | null; latest: StoredFinalization | null; ledger: readonly LedgerEntry[]; now: Date;
}): FinalizationPlan {
  if (!target || target.scopeId !== scope.scopeId || target.scopeVersion !== scope.version) return fail(400, "この scope・版の確定が見つかりません");
  if (latest?.id === target.id) return fail(400, "指定の確定はすでに現在の確定です");
  if (target.dedupVersion !== DEDUP_VERSION) return fail(400, "同一性判定の版が古い確定には戻せません");
  const denied = target.providers.filter(p => !isPermitted(ledger, p, "store", now));
  if (denied.length) return fail(403, `許諾が確認できない媒体を含む確定には戻せません：${denied.join("・")}`);
  const snapshot = surveySnapshotSchema.safeParse(target.snapshot);
  if (!snapshot.success) return fail(400, "戻し先の確定の内容を確認できません");
  return {
    ok: true,
    data: {
      batchIds: target.batchIds, providers: target.providers, dedupVersion: target.dedupVersion,
      observedFrom: target.observedFrom, observedTo: target.observedTo, snapshot: snapshot.data, rolledBackFrom: target.id,
    },
  };
}
