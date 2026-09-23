import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { AuthError, verifyAdminRequest } from "../api-auth";
import { POST } from "@/app/api/admin/bukken/school-rentals/route";
import { readSchoolRentalFeeds, registeredRentalIdentities, saveSchoolRentalFeed } from "../school-rental-feed-store";
vi.mock("../api-auth", async importOriginal => ({ ...await importOriginal<typeof import("../api-auth")>(), verifyAdminRequest: vi.fn() }));
vi.mock("../school-rental-feed-store", () => ({ readSchoolRentalFeeds: vi.fn(), registeredRentalIdentities: vi.fn(), saveSchoolRentalFeed: vi.fn(), previewFeedReplacement: vi.fn(() => ({ summaries: [], excluded: [], adCandidates: [] })) }));
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(verifyAdminRequest).mockResolvedValue({ uid: "admin", email: undefined });
  vi.mocked(readSchoolRentalFeeds).mockResolvedValue([]);
  vi.mocked(registeredRentalIdentities).mockResolvedValue([]);
  vi.mocked(saveSchoolRentalFeed).mockResolvedValue(true);
});
function body() { return { action: "preview", feed: { version: 1, provider: "reins", scope: "bunkyo-rent-175000-area-48", checkedAt: new Date(Date.now()-60000).toISOString(), complete: true, records: [] } }; }
function request(value: unknown) { return new NextRequest("https://test.invalid/api/admin/bukken/school-rentals", { method: "POST", body: JSON.stringify(value) }); }
it("authenticates before reading or writing private feeds", async () => {
  vi.mocked(verifyAdminRequest).mockRejectedValue(new AuthError("unauthorized",401));
  expect((await POST(request(body()))).status).toBe(401);
  expect(readSchoolRentalFeeds).not.toHaveBeenCalled(); expect(saveSchoolRentalFeed).not.toHaveBeenCalled();
});
it("previews without saving", async () => {
  const result = await POST(request(body())); expect(result.status).toBe(200);
  expect(await result.json()).toMatchObject({ expectedUpdatedAt: null }); expect(saveSchoolRentalFeed).not.toHaveBeenCalled();
});
it("refuses future or incomplete snapshots while allowing weekly snapshots", async () => {
  const weekly = body(); weekly.feed.checkedAt = new Date(Date.now()-7*86400000).toISOString();
  expect((await POST(request(weekly))).status).toBe(200);
  const b = body(); b.feed.checkedAt = new Date(Date.now()+86400000).toISOString();
  expect((await POST(request(b))).status).toBe(400);
  const c = body(); c.feed.complete = false;
  expect((await POST(request(c))).status).toBe(400); expect(saveSchoolRentalFeed).not.toHaveBeenCalled();
});
it("requires the preview revision and reports CAS conflicts", async () => {
  const b = { ...body(), action: "save" };
  expect((await POST(request(b))).status).toBe(400);
  vi.mocked(saveSchoolRentalFeed).mockResolvedValue(false);
  expect((await POST(request({ ...b, expectedUpdatedAt: "2026-09-23T00:00:00Z" }))).status).toBe(409);
});
it("stores a checked feed only on explicit save", async () => {
  expect((await POST(request({ ...body(), action: "save", expectedUpdatedAt: null }))).status).toBe(200);
  expect(saveSchoolRentalFeed).toHaveBeenCalledTimes(1);
});
