import { cache } from "react";
import { Prisma } from "@prisma/client";
import type { LangCode } from "@/config/languages";
import { getProperties } from "@/lib/db/properties";
import { prisma } from "@/lib/prisma";
import { isPubliclyVisible, toPublicProperty } from "@/lib/property-shared";
import { registeredRentalIdentity } from "@/lib/registered-rental-identity";
import type { SurveyBatch } from "./batch";
import type { FinalizationData, StoredBatch, StoredFinalization } from "./finalize";
import { DATA_USE_LEDGER, type LedgerEntry } from "./permissions";
import { currentSurveyScope, scopeKey, type SurveyScope } from "./scope";
import { buildPublicSurveySummary, canPublishAggregate, HIDDEN_SURVEY_SUMMARY, publicSurveyScopes, type PublicSurveySummary } from "./summary";
import type { UnitIdentity } from "./units";

/**
 * 調査 scope の保存層。全関数が検証済みの scope を受け取り、scope・版で必ず絞る（provider だけの置換・削除はしない）。
 * 学区の school_rental_feeds には触れない。
 * 本番はコード先行・マイグレーションは承認後に手動適用のため、公開面の読取はテーブル未作成（P2021）を hidden として扱う。
 */
function isMissingTable(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";
}
function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
const scoped = (scope: SurveyScope) => ({ scopeId: scope.scopeId, scopeVersion: scope.version });

/** 現在の確定（sequence 最大）。管理APIの楽観ロック用でキャッシュしない。テーブル未作成なら例外。 */
export async function findLatestFinalization(scope: SurveyScope): Promise<StoredFinalization | null> {
  return prisma.rentalSurveyFinalization.findFirst({ where: scoped(scope), orderBy: { sequence: "desc" } });
}

export async function findFinalization(scope: SurveyScope, id: string): Promise<StoredFinalization | null> {
  return prisma.rentalSurveyFinalization.findFirst({ where: { ...scoped(scope), id } });
}

export async function listFinalizations(scope: SurveyScope, take = 20): Promise<StoredFinalization[]> {
  return prisma.rentalSurveyFinalization.findMany({ where: scoped(scope), orderBy: { sequence: "desc" }, take });
}

/** 管理画面向けのバッチ一覧。観測行（payload）は返さない。 */
export async function listBatchMetadata(scope: SurveyScope, take = 50) {
  return prisma.rentalSurveyBatch.findMany({
    where: scoped(scope), orderBy: { createdAt: "desc" }, take,
    select: { id: true, provider: true, status: true, failureReason: true, observedFrom: true, observedTo: true, expectedCount: true, recordCount: true, allPagesChecked: true, createdAt: true },
  });
}

/** 指定IDのうち、この scope・版に属するバッチだけを返す（別 scope のIDは結果に含まれない）。 */
export async function readBatches(scope: SurveyScope, ids: string[]): Promise<StoredBatch[]> {
  return prisma.rentalSurveyBatch.findMany({
    where: { ...scoped(scope), id: { in: ids } },
    select: { id: true, scopeId: true, scopeVersion: true, provider: true, status: true, observedFrom: true, observedTo: true, payload: true },
  });
}

/** バッチを追記する。verified 以外は観測行を保存しない。 */
export async function insertBatch(scope: SurveyScope, batch: SurveyBatch) {
  if (batch.scopeId !== scope.scopeId || batch.scopeVersion !== scope.version) throw new Error("scope mismatch");
  const row = await prisma.rentalSurveyBatch.create({
    data: {
      ...scoped(scope),
      provider: batch.provider,
      status: batch.status,
      failureReason: batch.failureReason ?? null,
      observedFrom: new Date(batch.observedFrom),
      observedTo: new Date(batch.observedTo),
      expectedCount: batch.expectedCount ?? null,
      recordCount: batch.records.length,
      allPagesChecked: batch.allPagesChecked,
      payload: batch.status === "verified" ? (batch as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
    },
    select: { id: true },
  });
  return row.id;
}

/**
 * 確定ログに1行足す。sequence は expectedSequence + 1。
 * 同じ scope・版の同時確定は一意制約違反（P2002）になり、false を返す（呼び出し側は 409）。
 */
export async function insertFinalization(scope: SurveyScope, data: FinalizationData, expectedSequence: number) {
  try {
    await prisma.rentalSurveyFinalization.create({
      data: { ...scoped(scope), sequence: expectedSequence + 1, ...data, snapshot: data.snapshot as unknown as Prisma.InputJsonValue },
    });
    return true;
  } catch (error) {
    if (isUniqueViolation(error)) return false;
    throw error;
  }
}

/** 公開面の読取。引数付きの cache で scope ごとに分ける。テーブル未作成なら未確定（null）。 */
export const readLatestFinalization = cache(async (scopeId: string, scopeVersion: number) => {
  const scope = currentSurveyScope(scopeId);
  if (!scope || scope.version !== scopeVersion) return null;
  try {
    return await findLatestFinalization(scope);
  } catch (error) {
    if (isMissingTable(error)) return null;
    throw error;
  }
});

/** 言語 l で当サイトに公開中の自社賃貸物件の住戸（V_l）。公開面と同じ判定（toPublicProperty → isPubliclyVisible）を使う。 */
export const readVisibleRentalIdentities = cache(async (locale: LangCode): Promise<UnitIdentity[]> => {
  const now = new Date();
  const properties = await getProperties();
  return properties.flatMap(p => {
    if (p.dealType !== "rental" || !isPubliclyVisible(toPublicProperty(p), locale, now)) return [];
    const identity = registeredRentalIdentity(p);
    return identity ? [identity] : [];
  });
});

/** 公開用の集計。フラグ・許諾が無ければ DB を読まずに hidden を返す。 */
export async function getPublicSurveySummary(scopeId: string, locale: LangCode, options: {
  env?: Record<string, string | undefined>; ledger?: readonly LedgerEntry[]; now?: Date;
} = {}): Promise<PublicSurveySummary> {
  const ledger = options.ledger ?? DATA_USE_LEDGER;
  const now = options.now ?? new Date();
  const scope = currentSurveyScope(scopeId);
  const publicScopes = publicSurveyScopes(options.env ?? process.env);
  if (!scope || !publicScopes.has(scopeKey(scope)) || !canPublishAggregate(ledger, scope.providers, now)) return HIDDEN_SURVEY_SUMMARY;
  const [finalization, visible] = await Promise.all([readLatestFinalization(scope.scopeId, scope.version), readVisibleRentalIdentities(locale)]);
  return buildPublicSurveySummary({ scope, finalization, visible, ledger, publicScopes, now });
}
