import { z } from "zod";
import { mailReviewCommandSchema, mailReviewResultSchema, mailReviewReferenceSchema, mailReviewInspectionSchema } from "./mail-review-contract";
import { readPropertyRequestBody } from "./property-write-http";
import type { createMailReviewCommands } from "./db/mail-review-commands";

type Authorization = { uid: string } | { status: 401 | 403 | 503 };
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const error = (error: string, status: number) => Response.json({ error }, { status, headers });
/** Unregistered composition point. Inject existing verifyAdminRequest; no default store or route. */
export function createMailReviewHttpHandler(dependencies: { authorize: (r: Request) => Promise<Authorization>;
  store?: Pick<ReturnType<typeof createMailReviewCommands>, "apply" | "reconcile"> & Partial<Pick<ReturnType<typeof createMailReviewCommands>, "inspect">> }) {
  return async (request: Request, propertyId: string, action: "apply" | "reconcile" | "inspect") => {
    if (request.method !== "POST") return error("METHOD_NOT_ALLOWED", 405);
    let auth: Authorization;
    try { auth = await dependencies.authorize(request); } catch { return error("AUTH_UNAVAILABLE", 503); }
    if ("status" in auth) return error(auth.status === 401 ? "AUTH_REQUIRED" : auth.status === 403 ? "FORBIDDEN" : "AUTH_UNAVAILABLE", auth.status);
    if (!z.uuid().safeParse(auth.uid).success) return error("AUTH_UNAVAILABLE", 503);
    if (!z.uuid().safeParse(propertyId).success || !["apply", "reconcile", "inspect"].includes(action)) return error("INVALID_TARGET", 400);
    if (!dependencies.store) return error("STORE_DISABLED", 503);
    if (action === "inspect") {
      if (!dependencies.store.inspect) return error("STORE_DISABLED", 503);
      let body;
      try { body = mailReviewReferenceSchema.safeParse(await readPropertyRequestBody(request, 4096)); } catch { return error("INVALID_REQUEST", 400); }
      if (!body.success) return error("INVALID_REQUEST", 400);
      if (body.data.propertyId !== propertyId.toLowerCase()) return error("PROPERTY_TARGET_CONFLICT", 409);
      const unavailable = { status: "unavailable" } as const;
      let result;
      try { result = await dependencies.store.inspect(body.data, auth.uid.toLowerCase()); } catch { result = unavailable; }
      const checked = mailReviewInspectionSchema.safeParse(result), safe = checked.success ? checked.data : unavailable;
      return Response.json({ ...body.data, result: safe }, { status: safe.status === "present" ? 200 : 503, headers });
    }
    let body;
    try { body = mailReviewCommandSchema.safeParse(await readPropertyRequestBody(request, 4096)); } catch { return error("INVALID_REQUEST", 400); }
    if (!body.success) return error("INVALID_REQUEST", 400);
    if (body.data.propertyId !== propertyId.toLowerCase()) return error("PROPERTY_TARGET_CONFLICT", 409);
    const unknown = { status: "unknown", reason: "STORE_OUTCOME_UNKNOWN" } as const;
    let result;
    try { result = await dependencies.store[action](body.data, auth.uid.toLowerCase()); } catch { result = unknown; }
    const checked = mailReviewResultSchema.safeParse(result);
    const safe = checked.success && (checked.data.status !== "recorded" || checked.data.requestId === body.data.requestId) ? checked.data : unknown;
    return Response.json({ propertyId: body.data.propertyId, requestId: body.data.requestId, result: safe },
      { status: safe.status === "recorded" ? 200 : safe.status === "held" ? 409 : 503, headers });
  };
}
