// ペット横断 指示書 版2.0 第4・7章：調査 scope の管理API（認証・scope・許諾・楽観ロック・dryRun）
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { AuthError, verifyAdminRequest } from "../api-auth";
import { GET, POST } from "@/app/api/admin/rental-survey/route";
import type { LedgerEntry } from "@/lib/rental-survey/permissions";
import {
  findFinalization, findLatestFinalization, insertBatch, insertFinalization,
  listBatchMetadata, listFinalizations, readBatches,
} from "@/lib/rental-survey/store";
import { batch, confirmedLedger, finalization, record, storedBatches } from "./rental-survey-fixtures";

const h = vi.hoisted(() => ({ ledger: [] as LedgerEntry[] }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../api-auth", async importOriginal => ({ ...await importOriginal<typeof import("../api-auth")>(), verifyAdminRequest: vi.fn() }));
vi.mock("@/lib/rental-survey/permissions", async importOriginal => ({ ...await importOriginal<typeof import("@/lib/rental-survey/permissions")>(), DATA_USE_LEDGER: h.ledger }));
vi.mock("@/lib/rental-survey/store", () => ({
  findFinalization: vi.fn(), findLatestFinalization: vi.fn(), insertBatch: vi.fn(), insertFinalization: vi.fn(),
  listBatchMetadata: vi.fn(), listFinalizations: vi.fn(), readBatches: vi.fn(),
}));

const store = [findFinalization, findLatestFinalization, insertBatch, insertFinalization, listBatchMetadata, listFinalizations, readBatches];
const url = "https://test.invalid/api/admin/rental-survey";
const post = (body: unknown, headers: Record<string, string> = {}) => POST(new NextRequest(url, { method: "POST", body: JSON.stringify(body), headers }));
const base = { scopeId: "bunkyo-rent-pet", scopeVersion: 2 };
const permit = (uses: ("store" | "aggregate")[] = ["store"]) => h.ledger.push(...confirmedLedger(uses));

beforeEach(() => {
  vi.clearAllMocks();
  h.ledger.length = 0;
  vi.mocked(verifyAdminRequest).mockResolvedValue({ uid: "admin", email: undefined });
  vi.mocked(findLatestFinalization).mockResolvedValue(null);
  vi.mocked(readBatches).mockResolvedValue(storedBatches());
  vi.mocked(insertBatch).mockResolvedValue("new-batch");
  vi.mocked(insertFinalization).mockResolvedValue(true);
  vi.mocked(listBatchMetadata).mockResolvedValue([]);
  vi.mocked(listFinalizations).mockResolvedValue([]);
});

describe("入口の順序", () => {
  it("認証が最初：未認証なら何も読まず書かない", async () => {
    vi.mocked(verifyAdminRequest).mockRejectedValue(new AuthError("unauthorized", 401));
    expect((await post({ ...base, action: "save-batch", dryRun: false, batch: batch("reins") })).status).toBe(401);
    expect((await GET(new NextRequest(`${url}?scopeId=bunkyo-rent-pet&scopeVersion=2`))).status).toBe(401);
    for (const fn of store) expect(fn).not.toHaveBeenCalled();
  });

  it("大きすぎる本文は読む前に拒否する", async () => {
    expect((await post({ ...base }, { "content-length": "6000000" })).status).toBe(413);
  });

  it.each([
    ["scope 欠落", { scopeVersion: 1 }], ["未知の scope", { scopeId: "x", scopeVersion: 1 }],
    ["学区の scope", { scopeId: "bunkyo-rent-175000-area-48", scopeVersion: 1 }], ["現行でない版", { scopeId: "bunkyo-rent-pet", scopeVersion: 1 }],
  ])("%s は 400（全 scope と解釈しない）", async (_, scope) => {
    permit();
    expect((await post({ ...scope, action: "save-batch", dryRun: false, batch: batch("reins") })).status).toBe(400);
    for (const fn of store) expect(fn).not.toHaveBeenCalled();
  });

  it("dryRun の指定が無ければ 400", async () => {
    permit();
    expect((await post({ ...base, action: "save-batch", batch: batch("reins") })).status).toBe(400);
    expect(insertBatch).not.toHaveBeenCalled();
  });

  it("GET も scope 必須で、観測行ではなくメタ情報と許諾の有無だけを返す", async () => {
    expect((await GET(new NextRequest(url))).status).toBe(400);
    const res = await GET(new NextRequest(`${url}?scopeId=bunkyo-rent-pet&scopeVersion=2`));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.permissions).toHaveLength(3);
    expect(json.permissions.every((p: { store: boolean; aggregate: boolean }) => !p.store && !p.aggregate)).toBe(true);
    expect(res.headers.get("cache-control")).toContain("no-store");
  });
});

describe("バッチの保存", () => {
  it("許諾の無い台帳では 403 で保存しない", async () => {
    expect((await post({ ...base, action: "save-batch", dryRun: false, batch: batch("reins") })).status).toBe(403);
    expect(insertBatch).not.toHaveBeenCalled();
  });

  it("dryRun は検証だけで書き込まない", async () => {
    permit();
    const res = await post({ ...base, action: "save-batch", dryRun: true, batch: batch("reins") });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ dryRun: true, recordCount: 1 });
    expect(insertBatch).not.toHaveBeenCalled();
  });

  it("失敗時のログにデータを出さない（コードと種類だけ）", async () => {
    permit();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(insertBatch).mockRejectedValue(new Error("Invalid invocation { building: \"SECRET-BUILDING\" }"));
    expect((await post({ ...base, action: "save-batch", dryRun: false, batch: batch("reins") })).status).toBe(500);
    const logged = spy.mock.calls.flat();
    expect(logged.every(arg => typeof arg === "string")).toBe(true); // Error オブジェクト（本文にデータを含み得る）を渡さない
    expect(logged.join(" ")).not.toContain("SECRET-BUILDING");
    spy.mockRestore();
  });

  it("許諾があり dryRun: false なら保存する", async () => {
    permit();
    expect((await post({ ...base, action: "save-batch", dryRun: false, batch: batch("reins") })).status).toBe(200);
    expect(insertBatch).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["件数の不一致", batch("reins", [record()], { expectedCount: 2 })],
    ["未知の項目（賃料）", batch("reins", [{ ...record(), rentYen: 1 } as never])],
    ["別の版", batch("reins", undefined, { scopeVersion: 1 })],
    ["未来の観測", batch("reins", undefined, { observedTo: "2099-01-01T00:00:00Z" })],
  ])("%s は保存しない", async (_, b) => {
    permit();
    expect((await post({ ...base, action: "save-batch", dryRun: false, batch: b })).status).toBe(400);
    expect(insertBatch).not.toHaveBeenCalled();
  });
});

describe("確定・巻き戻し", () => {
  const ids = storedBatches().map(b => b.id);

  it("許諾が無ければ 403", async () => {
    expect((await post({ ...base, action: "finalize", dryRun: false, batchIds: ids, expectedSequence: 0 })).status).toBe(403);
    expect(insertFinalization).not.toHaveBeenCalled();
  });

  it("dryRun は件数だけ返して書き込まない", async () => {
    permit();
    const res = await post({ ...base, action: "finalize", dryRun: true, batchIds: ids, expectedSequence: 0 });
    expect(await res.json()).toMatchObject({ dryRun: true, x: 1 });
    expect(insertFinalization).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("別の確定が先に入っていれば 409（古い番号で上書きしない）", async () => {
    permit();
    vi.mocked(findLatestFinalization).mockResolvedValue(finalization({ sequence: 3 }));
    expect((await post({ ...base, action: "finalize", dryRun: false, batchIds: ids, expectedSequence: 2 })).status).toBe(409);
    vi.mocked(findLatestFinalization).mockResolvedValue(null);
    vi.mocked(insertFinalization).mockResolvedValue(false);
    expect((await post({ ...base, action: "finalize", dryRun: false, batchIds: ids, expectedSequence: 0 })).status).toBe(409);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("この scope・版に属さないバッチIDが混ざれば 400", async () => {
    permit();
    vi.mocked(readBatches).mockResolvedValue(storedBatches().slice(1));
    expect((await post({ ...base, action: "finalize", dryRun: false, batchIds: ids, expectedSequence: 0 })).status).toBe(400);
    expect(insertFinalization).not.toHaveBeenCalled();
  });

  it("確定できれば番号を1つ進めて保存する", async () => {
    permit();
    const res = await post({ ...base, action: "finalize", dryRun: false, batchIds: ids, expectedSequence: 0 });
    expect(await res.json()).toMatchObject({ saved: true, sequence: 1, x: 1 });
    expect(vi.mocked(insertFinalization).mock.calls[0][2]).toBe(0);
    // 件数枠を出す LP をすぐ再生成する（ふだんは1時間ごと）
    expect(revalidatePath).toHaveBeenCalledWith("/ja/pet-housing");
  });

  it("LP の再生成に失敗しても、保存済みの確定は成功として返す", async () => {
    permit();
    vi.mocked(revalidatePath).mockImplementationOnce(() => { throw new Error("no store"); });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await post({ ...base, action: "finalize", dryRun: false, batchIds: ids, expectedSequence: 0 });
    expect(res.status).toBe(200);
    expect(error.mock.calls.flat().every(a => typeof a === "string")).toBe(true);
    error.mockRestore();
  });

  it("巻き戻し先が見つからなければ 400", async () => {
    permit();
    vi.mocked(findFinalization).mockResolvedValue(null);
    vi.mocked(findLatestFinalization).mockResolvedValue(finalization({ id: "fin-2", sequence: 2 }));
    expect((await post({ ...base, action: "rollback", dryRun: false, targetId: "fin-x", expectedSequence: 2 })).status).toBe(400);
    expect(insertFinalization).not.toHaveBeenCalled();
  });

  it("巻き戻しは過去の確定を写して番号を進める", async () => {
    permit();
    vi.mocked(findFinalization).mockResolvedValue(finalization({ id: "fin-1", sequence: 1 }));
    vi.mocked(findLatestFinalization).mockResolvedValue(finalization({ id: "fin-2", sequence: 2 }));
    expect((await post({ ...base, action: "rollback", dryRun: false, targetId: "fin-1", expectedSequence: 2 })).status).toBe(200);
    expect(vi.mocked(insertFinalization).mock.calls[0][1]).toMatchObject({ rolledBackFrom: "fin-1" });
    expect(revalidatePath).toHaveBeenCalledWith("/ja/pet-housing");
  });

  it("保存先が未作成なら 503（黙って成功させない）", async () => {
    permit();
    vi.mocked(findLatestFinalization).mockRejectedValue(new Prisma.PrismaClientKnownRequestError("P2021", { code: "P2021", clientVersion: "test" }));
    expect((await post({ ...base, action: "finalize", dryRun: false, batchIds: ids, expectedSequence: 0 })).status).toBe(503);
  });
});
