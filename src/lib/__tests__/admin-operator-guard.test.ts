import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { verifyAdminRequest, verifyInquiryOwner, INQUIRY_OWNER_EMAIL } from "../api-auth";
import { GET, POST } from "@/app/api/admin/bukken/route";
import { GET as detail, PATCH, DELETE } from "@/app/api/admin/bukken/[id]/route";

const h = vi.hoisted(() => ({ user: null as null | Record<string, unknown>, read: vi.fn(), write: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth: { getUser: async () => ({ data: { user: h.user }, error: h.user ? null : { message: "invalid" } }) } }) }));
vi.mock("@/lib/db/properties", () => ({ getProperties: h.read, getPropertyById: h.read, getPropertyBySlugAdmin: h.read, createProperty: h.write, updatePropertyIfUnchanged: h.write, deleteProperty: h.write }));
vi.mock("@/lib/property-publication-notify", () => ({ recordPropertyPublicationChange: h.write, scheduleDuePropertyNotifications: h.write }));
const req = () => new NextRequest("https://example.test/api/admin/bukken", { headers: { Authorization: "Bearer test-token" } });
const owner = { id: "owner", email: "operator@example.test", email_confirmed_at: "2026-01-01T00:00:00Z" };
beforeEach(() => {
  vi.clearAllMocks(); h.user = { ...owner }; h.read.mockResolvedValue([]);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.test");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-only");
  vi.stubEnv("ADMIN_OPERATOR_EMAILS", "operator@example.test");
});
afterEach(() => vi.unstubAllEnvs());

describe("F-001 admin authorization", () => {
  it("allows the approved inquiry owner as the sole operator and rejects another confirmed user", async () => {
    vi.stubEnv("ADMIN_OPERATOR_EMAILS", INQUIRY_OWNER_EMAIL);
    h.user = { ...owner, email: INQUIRY_OWNER_EMAIL };
    expect((await GET(req())).status).toBe(200);
    await expect(verifyInquiryOwner(req())).resolves.toMatchObject({ email: INQUIRY_OWNER_EMAIL });
    h.user = { ...owner, email: "another@example.test" };
    await expect(verifyAdminRequest(req())).rejects.toMatchObject({ status: 403 });
  });
  it("permits only server-verified confirmed emails in the explicit allowlist", async () => {
    vi.stubEnv("ADMIN_OPERATOR_EMAILS", " OPERATOR@example.test , second@example.test ");
    expect(await verifyAdminRequest(req())).toEqual({ uid: "owner", email: "operator@example.test" });
    expect((await GET(req())).status).toBe(200);
  });
  it.each([undefined, "", "   ", "*", "@example.test", "operator@example.test,", "operator@example.test,broken"])("missing/invalid configuration (%s) fails closed", async value => {
    vi.stubEnv("ADMIN_OPERATOR_EMAILS", value);
    await expect(verifyAdminRequest(req())).rejects.toMatchObject({ status: 503 });
    expect(h.read).not.toHaveBeenCalled();
  });
  it.each([
    { ...owner, email: "self-registered@example.test" },
    { ...owner, email_confirmed_at: null },
    { ...owner, email: undefined },
    { ...owner, email: "self-registered@example.test", user_metadata: { role: "admin", email: "operator@example.test" } },
  ])("rejects unapproved/unconfirmed user regardless of editable metadata", async user => {
    h.user = user;
    const ctx = { params: Promise.resolve({ id: "unit" }) };
    const responses = await Promise.all([GET(req()), POST(req()), detail(req(), ctx), PATCH(req(), ctx), DELETE(req(), ctx)]);
    expect(responses.map(r => r.status)).toEqual([403, 403, 403, 403, 403]);
    expect(h.read).not.toHaveBeenCalled(); expect(h.write).not.toHaveBeenCalled();
    for (const response of responses) expect(await response.text()).not.toContain("self-registered");
  });
  it("retains 401 for absent/invalid sessions", async () => {
    h.user = null;
    await expect(verifyAdminRequest(req())).rejects.toMatchObject({ status: 401 });
    await expect(verifyAdminRequest(new NextRequest("https://example.test"))).rejects.toMatchObject({ status: 401 });
  });
  it("does not broaden the separate inquiry owner permission", async () => {
    await expect(verifyInquiryOwner(req())).rejects.toMatchObject({ status: 403 });
    h.user = { ...owner, email: INQUIRY_OWNER_EMAIL };
    await expect(verifyInquiryOwner(req())).resolves.toMatchObject({ uid: "owner" });
    await expect(verifyAdminRequest(req())).rejects.toMatchObject({ status: 403 });
  });
});
