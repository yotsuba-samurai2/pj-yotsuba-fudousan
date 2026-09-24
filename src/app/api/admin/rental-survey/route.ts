import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { AuthError, verifyAdminRequest } from "@/lib/api-auth";
import { MAX_SURVEY_BODY_BYTES, surveyBatchSchema } from "@/lib/rental-survey/batch";
import { planFinalization, planRollback, type FinalizationPlan, type StoredFinalization } from "@/lib/rental-survey/finalize";
import { DATA_USE_LEDGER, isPermitted } from "@/lib/rental-survey/permissions";
import { resolveSurveyScope } from "@/lib/rental-survey/scope";
import { surveySnapshotSchema } from "@/lib/rental-survey/units";
import {
  findFinalization, findLatestFinalization, insertBatch, insertFinalization,
  listBatchMetadata, listFinalizations, readBatches,
} from "@/lib/rental-survey/store";

/**
 * 調査 scope（ペット等）の管理API。学区の /api/admin/bukken/school-rentals とは別経路で、学区データには触れない。
 * 順序：管理者認証 → サイズ → scope → 許諾（台帳はコード内の定数のみ。リクエストからは受け取らない）→ 確定条件 → dryRun。
 */
const NO_STORE = { "Cache-Control": "private, no-store" };
const error = (status: number, message: string) => NextResponse.json({ error: message }, { status, headers: NO_STORE });

function errorResponse(e: unknown) {
  if (e instanceof AuthError) return error(e.status, e.message);
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") return error(503, "調査データの保存先が未作成です（マイグレーション未適用）");
  // Prisma のエラー文には呼び出し時のデータが含まれ得るため、ログにはコードと種類だけを残す（指示書 第11章）
  console.error("Rental survey admin failed", e instanceof Prisma.PrismaClientKnownRequestError ? e.code : e instanceof Error ? e.name : "unknown");
  return error(500, "調査データの処理に失敗しました");
}

const isSequence = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 0;
const isId = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.length <= 64;

export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const params = req.nextUrl.searchParams;
    const scope = resolveSurveyScope(params.get("scopeId"), Number(params.get("scopeVersion")));
    if (!scope) return error(400, "scopeId と scopeVersion（現行の版）を指定してください");
    const now = new Date();
    const [batches, finalizations] = await Promise.all([listBatchMetadata(scope), listFinalizations(scope)]);
    return NextResponse.json({
      scope: { scopeId: scope.scopeId, version: scope.version, providers: scope.providers },
      permissions: scope.providers.map(provider => ({
        provider,
        store: isPermitted(DATA_USE_LEDGER, provider, "store", now),
        aggregate: isPermitted(DATA_USE_LEDGER, provider, "aggregate", now),
      })),
      batches,
      finalizations: finalizations.map(f => {
        const snapshot = surveySnapshotSchema.safeParse(f.snapshot);
        return {
          id: f.id, sequence: f.sequence, providers: f.providers, dedupVersion: f.dedupVersion,
          observedFrom: f.observedFrom, observedTo: f.observedTo, createdAt: f.createdAt, rolledBackFrom: f.rolledBackFrom,
          ...(snapshot.success ? { x: snapshot.data.units.length, excludedObservations: snapshot.data.excludedObservations, excludedUnits: snapshot.data.excludedUnits, targetBreakdown: snapshot.data.targetBreakdown } : { invalid: true }),
        };
      }),
    }, { headers: NO_STORE });
  } catch (e) { return errorResponse(e); }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    if (Number(req.headers.get("content-length") ?? 0) > MAX_SURVEY_BODY_BYTES) return error(413, "ファイルが大きすぎます");
    const raw = await req.text();
    if (raw.length > MAX_SURVEY_BODY_BYTES) return error(413, "ファイルが大きすぎます");
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return error(400, "JSONを確認してください"); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return error(400, "JSONを確認してください");
    const scope = resolveSurveyScope(body.scopeId, body.scopeVersion);
    if (!scope) return error(400, "scopeId と scopeVersion（現行の版）を指定してください");
    if (typeof body.dryRun !== "boolean") return error(400, "dryRun（true＝確認のみ／false＝保存）を指定してください");
    const now = new Date();

    if (body.action === "save-batch") {
      const parsed = surveyBatchSchema.safeParse(body.batch);
      if (!parsed.success) return error(400, parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(" / "));
      const batch = parsed.data;
      if (batch.scopeId !== scope.scopeId || batch.scopeVersion !== scope.version) return error(400, "バッチの scope・版が指定と一致しません");
      if (!(scope.providers as readonly string[]).includes(batch.provider)) return error(400, "この scope の対象媒体ではありません");
      if (Date.parse(batch.observedTo) > now.getTime()) return error(400, "観測終了に未来の日時は指定できません");
      if (!isPermitted(DATA_USE_LEDGER, batch.provider, "store", now)) return error(403, "この媒体の内部保存・加工の許諾が確認されていません");
      if (body.dryRun) return NextResponse.json({ dryRun: true, provider: batch.provider, status: batch.status, recordCount: batch.records.length }, { headers: NO_STORE });
      const id = await insertBatch(scope, batch);
      return NextResponse.json({ saved: true, id }, { headers: NO_STORE });
    }

    if (body.action === "finalize" || body.action === "rollback") {
      if (!isSequence(body.expectedSequence)) return error(400, "expectedSequence（現在の確定の番号。未確定なら0）を指定してください");
      let plan: FinalizationPlan;
      let latest: StoredFinalization | null;
      if (body.action === "finalize") {
        const ids = body.batchIds;
        if (!Array.isArray(ids) || !ids.length || ids.length > scope.providers.length || !ids.every(isId) || new Set(ids).size !== ids.length)
          return error(400, "batchIds を確認してください");
        const [current, batches] = await Promise.all([findLatestFinalization(scope), readBatches(scope, ids)]);
        latest = current;
        if (batches.length !== ids.length) return error(400, "この scope・版に属さないバッチが含まれています");
        if ((latest?.sequence ?? 0) !== body.expectedSequence) return error(409, "別の確定が先に保存されました。再確認してください");
        plan = planFinalization({ scope, batches, latest, ledger: DATA_USE_LEDGER, now });
      } else {
        if (!isId(body.targetId)) return error(400, "targetId を指定してください");
        const [current, target] = await Promise.all([findLatestFinalization(scope), findFinalization(scope, body.targetId)]);
        latest = current;
        if ((latest?.sequence ?? 0) !== body.expectedSequence) return error(409, "別の確定が先に保存されました。再確認してください");
        plan = planRollback({ scope, target, latest, ledger: DATA_USE_LEDGER, now });
      }
      if (!plan.ok) return error(plan.status, plan.error);
      const summary = { x: plan.data.snapshot.units.length, excludedObservations: plan.data.snapshot.excludedObservations, excludedUnits: plan.data.snapshot.excludedUnits, targetBreakdown: plan.data.snapshot.targetBreakdown };
      if (body.dryRun) return NextResponse.json({ dryRun: true, ...summary }, { headers: NO_STORE });
      if (!await insertFinalization(scope, plan.data, body.expectedSequence)) return error(409, "別の確定が先に保存されました。再確認してください");
      return NextResponse.json({ saved: true, sequence: body.expectedSequence + 1, ...summary }, { headers: NO_STORE });
    }

    return error(400, "action は save-batch・finalize・rollback のいずれかです");
  } catch (e) { return errorResponse(e); }
}
