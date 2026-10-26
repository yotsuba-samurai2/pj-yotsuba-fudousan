import "server-only";
import type { NextRequest } from "next/server";
import { AuthError, verifyAdminRequest } from "../api-auth";
import { createMailReviewHttpHandler } from "../mail-review-http";
import type { createMailReviewCommands } from "./mail-review-commands";

/** Existing admin authorization, explicitly injected DB store. No production route or default DB client. */
export function createAdminMailReviewHandler(store?: ReturnType<typeof createMailReviewCommands>) {
  const handler = createMailReviewHttpHandler({ store, authorize: async request => {
    try { return await verifyAdminRequest(request as NextRequest); }
    catch (error) { return { status: error instanceof AuthError && [401, 403].includes(error.status) ? error.status as 401 | 403 : 503 }; }
  } });
  return (request: NextRequest, propertyId: string, action: "apply" | "reconcile" | "inspect") => handler(request, propertyId, action);
}
