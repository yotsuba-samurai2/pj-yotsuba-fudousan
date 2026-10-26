import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createAdminMailReviewHandler } from "../db/admin-mail-review-handler";
const h = vi.hoisted(() => ({ user: null as null | Record<string, unknown> }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth: { getUser: async () => ({ data: { user: h.user }, error: h.user ? null : { message: "invalid" } }) } }) }));
const uid = "00000000-0000-4000-8000-000000000058", propertyId = "00000000-0000-4000-8000-000000000057";
const reference = { propertyId, reviewRef: "synthetic-ui", reviewHash: "a".repeat(64) };
beforeEach(() => {
  h.user = { id: uid, email: "operator@example.test", email_confirmed_at: "2026-01-01T00:00:00Z" };
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.test"); vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "synthetic-only"); vi.stubEnv("ADMIN_OPERATOR_EMAILS", "operator@example.test");
});
afterEach(() => vi.unstubAllEnvs());
const request = (body: unknown = reference) => new NextRequest("https://example.test/api/review", { method: "POST", headers: { Authorization: "Bearer synthetic-token", "content-type": "application/json" }, body: JSON.stringify(body) });
it("binds the existing admin verifier's UID and does not expose source records", async () => {
  const store = { apply: vi.fn(), reconcile: vi.fn(), inspect: vi.fn().mockResolvedValue({ status: "present", revision: 1, headHash: "b".repeat(64), reviewStatus: "active", expiresAt: "2026-10-27T00:00:00.000Z" }) };
  const response = await createAdminMailReviewHandler(store)(request(), propertyId, "inspect");
  expect(response.status).toBe(200); expect(store.inspect).toHaveBeenCalledWith(reference, uid); expect(response.headers.get("cache-control")).toBe("no-store");
  store.inspect.mockResolvedValue({ status: "present", revision: 1, headHash: "b".repeat(64), reviewStatus: "active", expiresAt: "2026-10-27T00:00:00.000Z", record: { ad: "PRIVATE_AD" } });
  const rejected = await createAdminMailReviewHandler(store)(request(), propertyId, "inspect"); expect(rejected.status).toBe(503); expect(await rejected.text()).not.toContain("PRIVATE_AD");
});
it.each(["missing-user", "unconfirmed", "foreign-user", "allowlist-missing", "db-disabled"])("%s stops before body/store access", async variant => {
  const store = { apply: vi.fn(), reconcile: vi.fn(), inspect: vi.fn() };
  if (variant === "missing-user") h.user = null;
  if (variant === "unconfirmed") h.user!.email_confirmed_at = null;
  if (variant === "foreign-user") h.user!.email = "other@example.test";
  if (variant === "allowlist-missing") vi.stubEnv("ADMIN_OPERATOR_EMAILS", "");
  const response = await createAdminMailReviewHandler(variant === "db-disabled" ? undefined : store)(request({ private: "PRIVATE_BODY" }), propertyId, "inspect");
  expect(response.status).toBe(variant === "missing-user" ? 401 : ["unconfirmed", "foreign-user"].includes(variant) ? 403 : 503);
  expect(store.inspect).not.toHaveBeenCalled(); expect(store.apply).not.toHaveBeenCalled(); expect(await response.text()).not.toContain("PRIVATE_BODY");
});
