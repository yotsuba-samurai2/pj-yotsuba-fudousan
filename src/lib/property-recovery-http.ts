import { z } from "zod";
import { readPropertyRequestBody } from "./property-write-http";
import { propertyRecoveryCommandSchema, propertyRecoveryResponseSchema, type PropertyRecoveryRef, type PropertyRecoverySummary } from "./property-recovery-contract";
import { publicationEffectInitiatorHash, verifyEffectRecord, type PublicationEffectStore, type createPublicationEffectRunner } from "./property-publication-effects";
import type { createPropertyWriteRequests } from "./db/property-write-requests";

const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const error = (code: string, status: number) => Response.json({ error: code }, { status, headers });

/** Explicit local composition only. No production route/credentials/provider defaults. */
export function createPropertyRecoveryHttpHandler(dependencies: {
  authorize: (request: Request) => Promise<{ uid: string } | { status: 401 | 403 | 503 }>;
  store?: PublicationEffectStore;
  runner?: ReturnType<typeof createPublicationEffectRunner>;
  receipts?: Pick<ReturnType<typeof createPropertyWriteRequests>, "inspectHeld">;
}) {
  return async (request: Request, propertyId: string): Promise<Response> => {
    if (request.method !== "POST") return error("METHOD_NOT_ALLOWED", 405);
    let auth;
    try { auth = await dependencies.authorize(request); } catch { return error("AUTH_UNAVAILABLE", 503); }
    if ("status" in auth) return error(auth.status === 401 ? "AUTH_REQUIRED" : auth.status === 403 ? "FORBIDDEN" : "AUTH_UNAVAILABLE", auth.status);
    const uid = z.uuid().safeParse(auth.uid), id = z.uuid().safeParse(propertyId);
    if (!uid.success) return error("AUTH_UNAVAILABLE", 503);
    if (!id.success) return error("INVALID_PROPERTY_ID", 400);
    if (!dependencies.store) return error("STORE_DISABLED", 503);
    let command;
    try { command = propertyRecoveryCommandSchema.safeParse(await readPropertyRequestBody(request, 2048)); } catch { return error("INVALID_REQUEST", 400); }
    if (!command.success) return error("INVALID_REQUEST", 400);
    if (command.data.propertyId !== id.data.toLowerCase()) return error("PROPERTY_TARGET_CONFLICT", 409);
    const { operation, ...ref } = command.data;
    const owner = publicationEffectInitiatorHash(`admin:${uid.data.toLowerCase()}`);
    const summary = (reference: PropertyRecoveryRef) => dependencies.store!.change<PropertyRecoverySummary | null>(reference, raw => {
      const row = raw && verifyEffectRecord(raw);
      // Legacy/unbound plans, foreign owners and missing requests are indistinguishable to this endpoint.
      if (!row || row.plan.initiatorHash !== owner || row.plan.propertyId !== reference.propertyId || row.plan.requestId !== reference.requestId) return { value: null };
      return { value: { revision: row.revision, resultVersion: row.plan.resultVersion,
        cache: { status: row.state.cache.status, attempts: row.state.cache.attempts },
        notification: { status: row.state.notification.status, attempts: row.state.notification.attempts } } };
    });
    try {
      let current = await summary(ref);
      if (!current) {
        if (operation !== "status" || !dependencies.receipts) return error("REQUEST_NOT_AVAILABLE", 404);
        const receipt = await dependencies.receipts.inspectHeld({ ...ref, actorRef: `admin:${uid.data.toLowerCase()}` });
        if (!receipt) return error("REQUEST_NOT_AVAILABLE", 404);
        const body = propertyRecoveryResponseSchema.safeParse({ ...receipt, outcome: "confirmed_held", publication: "not_checked" });
        if (!body.success || body.data.propertyId !== ref.propertyId || body.data.requestId !== ref.requestId) return error("RESULT_UNAVAILABLE", 503);
        return Response.json(body.data, { headers });
      }
      let outcome: string = "status";
      if (operation !== "status") {
        if (!dependencies.runner) return error("EFFECT_DISABLED", 503);
        outcome = (await dependencies.runner.resume(ref, operation)).status;
        current = await summary(ref); if (!current) return error("REQUEST_NOT_AVAILABLE", 404);
      }
      const body = propertyRecoveryResponseSchema.safeParse({ ...ref, summary: current, outcome, publication: "not_checked" });
      if (!body.success) return error("RESULT_UNAVAILABLE", 503);
      return Response.json(body.data, { headers });
    } catch { return error("RESULT_UNAVAILABLE", 503); }
  };
}
