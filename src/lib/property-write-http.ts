import { z } from "zod";
import { propertyWriteCommandSchema, propertyWriteResponseSchema } from "./property-write-contract";
import type { createPropertyWriteRequests } from "./db/property-write-requests";

type Store = Pick<ReturnType<typeof createPropertyWriteRequests>, "apply" | "reconcile">;
type Authorization = { uid: string } | { status: 401 | 403 | 503 };
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const error = (code: string, status: number) => Response.json({ error: code }, { status, headers });

export async function readPropertyRequestBody(request: Request, maxBytes = 2_100_000) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json" || !request.body) throw new Error("INVALID_BODY");
  const reader = request.body.getReader(), chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const chunk = await reader.read(); if (chunk.done) break;
      size += chunk.value.byteLength;
      // A 1 MB JSON patch is itself JSON-escaped in this envelope.
      if (size > maxBytes) { await reader.cancel(); throw new Error("BODY_TOO_LARGE"); }
      chunks.push(chunk.value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

/**
 * Local composition point; deliberately NOT registered as a production Next route.
 * The caller must inject the existing admin verifier and an explicitly approved store.
 * Authentication precedes reading even the body. Actor comes only from auth;
 * the reviewed body property ID must match the route before using the route ID for the store.
 */
export function createPropertyWriteHttpHandler(dependencies: {
  authorize: (request: Request) => Promise<Authorization>;
  store?: Store;
}) {
  return async (request: Request, propertyId: string): Promise<Response> => {
    if (request.method !== "POST") return error("METHOD_NOT_ALLOWED", 405);
    let auth: Authorization;
    try { auth = await dependencies.authorize(request); }
    catch { return error("AUTH_UNAVAILABLE", 503); }
    if ("status" in auth) return error(auth.status === 401 ? "AUTH_REQUIRED" : auth.status === 403 ? "FORBIDDEN" : "AUTH_UNAVAILABLE", auth.status);
    const uid = z.uuid().safeParse(auth.uid), id = z.uuid().safeParse(propertyId);
    if (!uid.success) return error("AUTH_UNAVAILABLE", 503);
    if (!id.success) return error("INVALID_PROPERTY_ID", 400);
    if (!dependencies.store) return error("STORE_DISABLED", 503);
    let body;
    try { body = propertyWriteCommandSchema.safeParse(await readPropertyRequestBody(request)); }
    catch { return error("INVALID_REQUEST", 400); }
    if (!body.success) return error("INVALID_REQUEST", 400);
    const { operation, propertyId: reviewedPropertyId, ...command } = body.data;
    if (reviewedPropertyId !== id.data.toLowerCase()) return error("PROPERTY_TARGET_CONFLICT", 409);
    const unknown = { status: "unknown", reason: "STORE_OUTCOME_UNKNOWN" } as const;
    let result;
    try { result = await dependencies.store[operation]({ ...command, propertyId: id.data.toLowerCase(), actorRef: `admin:${uid.data.toLowerCase()}` }); }
    catch { result = unknown; }
    // Exact allowlist: an accidental nested/raw field or malformed result never crosses HTTP.
    const checked = propertyWriteResponseSchema.safeParse({ propertyId: reviewedPropertyId, requestId: command.requestId, result, publication: "not_checked" });
    const response = checked.success && (!("requestId" in checked.data.result) || checked.data.result.requestId === command.requestId)
      ? checked.data : { propertyId: reviewedPropertyId, requestId: command.requestId, result: unknown, publication: "not_checked" };
    return Response.json(response, { status: response.result.status === "applied" ? 200 : response.result.status === "held" ? 409 : 503, headers });
  };
}
