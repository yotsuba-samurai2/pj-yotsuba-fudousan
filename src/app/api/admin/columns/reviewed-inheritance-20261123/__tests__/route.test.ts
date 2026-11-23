import { readFileSync } from "node:fs";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminColumn } from "@/lib/column-shared";
import { ColumnUpdateConflictError } from "@/lib/column-update-conflict";
import { GET, PATCH } from "../route";
import { inheritanceFingerprint } from "@/lib/inheritance-correction";
import type { CorrectionInput } from "@/lib/inheritance-correction-types";

const mock = vi.hoisted(() => ({
  get: vi.fn(), update: vi.fn(), auth: vi.fn(), refresh: vi.fn(),
  keys: [
    ["legal", "souzoku-kaigai-gaikokuseki"],
    ["legal", "kaigai-honkon-singapore-souzokunin-isanbunkatsu-shomei"],
    ["legal", "chugoku-tairiku-souzokunin-shinzoku-koshosho-ryoji-ninsho"],
    ["realestate", "taiwan-souzoku-kanri-katsuyo"],
    ["realestate", "taiwan-souzoku-japan-fudosan"],
  ] as const,
}));
vi.mock("@/lib/api-auth", () => ({
  AuthError: class AuthError extends Error {
    constructor(message: string, public status: number) { super(message); }
  },
  verifyAdminRequest: mock.auth,
}));
vi.mock("@/lib/db/columns", () => ({ getColumnBySlug: mock.get, updateColumn: mock.update }));
vi.mock("@/lib/column-publication-cache", () => ({
  ColumnPublicationRefreshError: class ColumnPublicationRefreshError extends Error {},
  refreshColumnPublication: mock.refresh,
}));
vi.mock("@/lib/data/reviewed-inheritance-20261123.json", async () => {
  const { inheritanceFingerprint } = await import("@/lib/inheritance-correction");
  const { fakeOriginal, fakeRevised } = await import("./test-fixtures");
  return { default: await Promise.all(mock.keys.map(async ([business, slug]) => {
    const original = fakeOriginal(business, slug);
    const revised = fakeRevised(original);
    return { business, slug, date: original.date, locales: original.locales, revised,
      originalFingerprint: await inheritanceFingerprint(original),
      revisedFingerprint: await inheritanceFingerprint(revised) };
  })) };
});

import { AuthError } from "@/lib/api-auth";
import { ColumnPublicationRefreshError } from "@/lib/column-publication-cache";
import { fakeOriginal, fakeRevised } from "./test-fixtures";

const endpoint = "https://example.test/api/admin/columns/reviewed-inheritance-20261123";
function request(method: "GET" | "PATCH", body?: unknown, auth: string | null = "Bearer admin", origin: string | null = new URL(endpoint).origin) {
  return new NextRequest(endpoint, {
    method, headers: { ...(auth === null ? {} : { Authorization: auth }),
      ...(origin === null ? {} : { Origin: origin }), "Content-Type": "application/json" },
    ...(method === "PATCH" ? { body: JSON.stringify(body) } : {}),
  });
}
let data: AdminColumn[];

async function confirmation(index = 0) {
  const response = await GET(request("GET"));
  expect(response.status).toBe(200);
  const result = await response.json();
  expect(result.rows[index].state).toBe("ready");
  return result.rows[index].confirmation as CorrectionInput;
}

beforeEach(() => {
  vi.resetAllMocks();
  data = mock.keys.map(([business, slug]) => fakeOriginal(business, slug));
  mock.auth.mockImplementation(async (req: NextRequest) => {
    const token = req.headers.get("Authorization");
    if (!token) throw new AuthError("認証が必要", 401);
    if (token !== "Bearer admin") throw new AuthError("管理者のみ", 403);
    return { uid: "fixture-operator" };
  });
  mock.get.mockImplementation(async (business: string, slug: string) =>
    structuredClone(data.find(row => row.business === business && row.slug === slug) ?? null));
  mock.update.mockImplementation(async (id: string, patch: Partial<AdminColumn>, timestamp: string) => {
    const index = data.findIndex(row => row.id === id);
    if (index < 0 || data[index].updatedAt !== timestamp) throw new ColumnUpdateConflictError();
    data[index] = { ...data[index], ...patch, updatedAt: "2026-11-24T00:00:00.000Z" };
  });
});

describe("fixed five-article admin correction", () => {
  for (const [auth, status] of [[null, 401], ["Bearer ordinary-user", 403]] as const) {
    it("rejects unauthenticated or unauthorized GET and PATCH before any record access: " + status, async () => {
      expect((await GET(request("GET", undefined, auth))).status).toBe(status);
      expect((await PATCH(request("PATCH", {}, auth))).status).toBe(status);
      expect(mock.get).not.toHaveBeenCalled();
      expect(mock.update).not.toHaveBeenCalled();
      expect(mock.refresh).not.toHaveBeenCalled();
    });
  }

  it("returns a private read-only preview for exactly five pairs, with only real languages and fields", async () => {
    const r = await GET(request("GET"));
    expect(r.headers.get("Cache-Control")).toBe("private, no-store");
    const { rows } = await r.json();
    expect(rows.map((row: CorrectionInput) => [row.business, row.slug])).toEqual(mock.keys);
    expect(rows[0].changes.map((change: { lang: string }) => change.lang)).toEqual(["ja", "en", "zh-tw", "zh"]);
    expect(rows[3].changes.map((change: { lang: string }) => change.lang)).toEqual(["zh-tw", "zh-tw"]);
    expect(rows[3].changes[1].field).toBe("faq");
    expect(mock.get.mock.calls).toEqual(mock.keys);
    expect(mock.update).not.toHaveBeenCalled();
  });

  it("rejects missing or cross-site origin on writes, even with admin authentication", async () => {
    const c = await confirmation();
    mock.get.mockClear();
    expect((await PATCH(request("PATCH", c, "Bearer admin", null))).status).toBe(403);
    expect((await PATCH(request("PATCH", c, "Bearer admin", "https://elsewhere.test"))).status).toBe(403);
    expect(mock.get).not.toHaveBeenCalled();
    expect(mock.update).not.toHaveBeenCalled();
  });

  it("rejects a different slug or namespace, arbitrary material, and tampered fingerprints", async () => {
    const c = await confirmation();
    mock.get.mockClear();
    for (const invalid of [{ ...c, slug: "another-live-article" }, { ...c, business: "realestate" }]) {
      expect((await PATCH(request("PATCH", invalid))).status).toBe(404);
    }
    expect((await PATCH(request("PATCH", { ...c, content: "client-supplied" }))).status).toBe(400);
    expect((await PATCH(request("PATCH", { ...c, revisedFingerprint: "0".repeat(64) }))).status).toBe(409);
    expect(mock.get).not.toHaveBeenCalled();
    expect(mock.update).not.toHaveBeenCalled();
  });

  it("stops after unreviewed CMS edits, missing rows and metadata changes", async () => {
    const c = await confirmation();
    const existing = data[0];
    for (const row of [
      { ...existing, content: "later unpublished wording" },
      { ...existing, status: "draft" as const },
      { ...existing, date: "2020-12-01" },
      { ...existing, locales: ["ja"] as const },
    ]) {
      data[0] = { ...row, locales: [...(row.locales ?? [])] };
      expect((await PATCH(request("PATCH", c))).status).toBe(409);
    }
    data = data.slice(1);
    expect((await PATCH(request("PATCH", c))).status).toBe(409);
    expect(mock.update).not.toHaveBeenCalled();
  });

  it("previews a stale row as blocked without applying any of the other rows", async () => {
    data[2].translations!.en!.content = "independently revised in CMS";
    const r = await GET(request("GET"));
    expect(r.status).toBe(200);
    const { rows } = await r.json();
    expect(rows.map((row: { state: string }) => row.state)).toEqual(["ready", "ready", "blocked", "ready", "ready"]);
    expect(rows[2].confirmation).toBeUndefined();
    expect(rows[2].changes).toEqual([]);
    expect(mock.update).not.toHaveBeenCalled();
  });

  it("requires the live preview version and propagates a DB compare-and-set race", async () => {
    const c = await confirmation();
    expect((await PATCH(request("PATCH", { ...c, expectedUpdatedAt: "2026-11-18T00:00:00.000Z" }))).status).toBe(409);
    expect(mock.update).not.toHaveBeenCalled();
    mock.update.mockRejectedValueOnce(new ColumnUpdateConflictError());
    expect((await PATCH(request("PATCH", c))).status).toBe(409);
    expect(mock.update.mock.calls[0][2]).toBe(c.expectedUpdatedAt);
    expect(mock.refresh).not.toHaveBeenCalled();
  });

  it("applies one Taiwan article with mirrored base material and preserves all metadata, other rows and idempotence", async () => {
    const c = await confirmation(3);
    const before = structuredClone(data);
    const response = await PATCH(request("PATCH", c));
    expect(await response.json()).toEqual({ outcome: "saved" });
    expect(mock.update.mock.calls[0][0]).toBe(before[3].id);
    expect(Object.keys(mock.update.mock.calls[0][1]).sort()).toEqual(["content", "faq", "translations"]);
    const { content, faq, translations, updatedAt } = data[3];
    const materialKeys = ["content", "faq", "translations", "updatedAt"];
    const metadata = (row: AdminColumn) => Object.fromEntries(Object.entries(row).filter(([key]) => !materialKeys.includes(key)));
    expect(metadata(data[3])).toEqual(metadata(before[3]));
    expect(updatedAt).not.toBe(before[3].updatedAt);
    expect(content).toBe(translations?.["zh-tw"]?.content);
    expect(faq).toEqual(translations?.["zh-tw"]?.faq);
    expect(translations?.["zh-tw"]?.author).toEqual(before[3].translations?.["zh-tw"]?.author);
    expect(translations?.["zh-tw"]?.tags).toEqual(["keep"]);
    expect(translations?.["zh-tw"]?.keywords).toEqual(["keep"]);
    expect(await inheritanceFingerprint(data[3])).toBe(c.revisedFingerprint);
    expect(data.filter((_, i) => i !== 3)).toEqual(before.filter((_, i) => i !== 3));
    expect(mock.refresh.mock.calls).toEqual([[ [before[3]] ]]);
    expect(await (await PATCH(request("PATCH", c))).json()).toEqual({ outcome: "unchanged" });
    expect(mock.update).toHaveBeenCalledTimes(1);
    expect(mock.refresh).toHaveBeenCalledTimes(1);
  });

  it("reports successful DB update separately when only publication refresh fails", async () => {
    const c = await confirmation();
    mock.refresh.mockRejectedValueOnce(new ColumnPublicationRefreshError());
    const r = await PATCH(request("PATCH", c));
    expect(r.status).toBe(503);
    expect(await r.json()).toMatchObject({ mutationSucceeded: true });
    expect(data[0].content).toBe(fakeRevised(fakeOriginal(...mock.keys[0])).content);
    expect(await (await PATCH(request("PATCH", c))).json()).toEqual({ outcome: "unchanged" });
    expect(mock.update).toHaveBeenCalledTimes(1);
  });

  it("pins the actual checked-in manifest to the same five IDs and valid revised fingerprints", async () => {
    // Read the real file, not the route mock. No git history or production is needed.
    const real = JSON.parse(readFileSync("src/lib/data/reviewed-inheritance-20261123.json", "utf8"));
    expect(real.map((row: CorrectionInput) => [row.business, row.slug])).toEqual(mock.keys);
    expect(real.flatMap((row: { locales: string[] }) => row.locales)).toHaveLength(14);
    for (const row of real) {
      expect(await inheritanceFingerprint(row.revised)).toBe(row.revisedFingerprint);
      expect(row.originalFingerprint).not.toBe(row.revisedFingerprint);
    }
  });
});
