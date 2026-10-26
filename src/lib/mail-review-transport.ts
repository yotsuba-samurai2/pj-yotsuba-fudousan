import { z } from "zod";
import { mailReviewCommandSchema, mailReviewReferenceSchema } from "./mail-review-contract";
import type { MailReviewTransport } from "./mail-review-session";

/** Inject the existing Supabase getSession and same-origin fetch. No token/config persists in session storage. */
export function createMailReviewTransport(options: { propertyId: string; operatorId: string;
  readSession: () => Promise<{ uid: string; accessToken: string } | null>; fetch: typeof fetch }): MailReviewTransport {
  const propertyId = z.uuid().parse(options.propertyId).toLowerCase(), operatorId = z.uuid().parse(options.operatorId).toLowerCase();
  return async (action, input) => {
    if (!["apply", "reconcile", "inspect"].includes(action)) throw new Error("INVALID_ACTION");
    const parsed = (action === "inspect" ? mailReviewReferenceSchema : mailReviewCommandSchema).safeParse(input);
    if (!parsed.success || parsed.data.propertyId !== propertyId) throw new Error("PROPERTY_TARGET_CONFLICT");
    const session = await options.readSession();
    if (!session || session.uid.toLowerCase() !== operatorId || !session.accessToken) return Response.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    return options.fetch(`/api/admin/bukken/${propertyId}/mail-review/${action}`, { method: "POST", cache: "no-store", credentials: "omit", redirect: "error",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` }, body: JSON.stringify(parsed.data) });
  };
}
