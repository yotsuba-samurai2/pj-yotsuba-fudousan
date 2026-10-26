import { afterEach, expect, it, vi } from "vitest";
const h = vi.hoisted(() => ({ session: null as null | { user: { id: string }; access_token: string }, error: null as unknown }));
vi.mock("@/lib/supabase/client", () => ({ getSupabaseClient: () => ({ auth: { getSession: async () => ({ data: { session: h.session }, error: h.error }) } }) }));
import { createBukkenMailReviewTransport } from "../admin-api";
const propertyId = "00000000-0000-4000-8000-000000000057", uid = "00000000-0000-4000-8000-000000000058";
afterEach(() => { vi.unstubAllGlobals(); h.session = null; h.error = null; });
it("binds the existing Supabase session, rechecks account changes and never sends on auth errors", async () => {
  const fetcher = vi.fn().mockResolvedValue(Response.json({})); vi.stubGlobal("fetch", fetcher);
  h.session = { user: { id: uid }, access_token: "synthetic-session-token" };
  const send = createBukkenMailReviewTransport(propertyId, uid), ref = { propertyId, reviewRef: "synthetic-ui", reviewHash: "a".repeat(64) };
  expect(fetcher).not.toHaveBeenCalled(); await send("inspect", ref); expect(fetcher).toHaveBeenCalledTimes(1);
  expect(fetcher.mock.calls[0][1].headers.Authorization).toBe("Bearer synthetic-session-token");
  h.session.user.id = propertyId; expect((await send("inspect", ref)).status).toBe(401); expect(fetcher).toHaveBeenCalledTimes(1);
  h.session.user.id = uid; h.error = new Error("PRIVATE_AUTH_FAILURE");
  const denied = await send("inspect", ref); expect(denied.status).toBe(401); expect(await denied.text()).not.toContain("PRIVATE_AUTH_FAILURE"); expect(fetcher).toHaveBeenCalledTimes(1);
});
