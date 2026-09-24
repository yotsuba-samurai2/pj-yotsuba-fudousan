// ペット横断 指示書 版2.0 第4.2章・受入テスト T01・T03（保存の scope 分離・楽観ロック）
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { currentSurveyScope } from "@/lib/rental-survey/scope";
import {
  findFinalization, findLatestFinalization, insertBatch, insertFinalization,
  listBatchMetadata, listFinalizations, readBatches, readLatestFinalization,
} from "@/lib/rental-survey/store";
import { planFinalization } from "@/lib/rental-survey/finalize";
import { batch, confirmedLedger, NOW, storedBatches } from "./rental-survey-fixtures";

// 学区のテーブル（schoolRentalFeed）に触れたら即失敗する Prisma のモック
vi.mock("@/lib/prisma", () => {
  const delegate = () => ({ create: vi.fn(), findFirst: vi.fn(), findMany: vi.fn() });
  const school = new Proxy({}, { get: () => { throw new Error("school_rental_feeds must not be touched"); } });
  return { prisma: { rentalSurveyBatch: delegate(), rentalSurveyFinalization: delegate(), schoolRentalFeed: school } };
});
vi.mock("@/lib/db/properties", () => ({ getProperties: vi.fn() }));

const scope = currentSurveyScope("bunkyo-rent-pet")!;
const batches = vi.mocked(prisma.rentalSurveyBatch);
const finals = vi.mocked(prisma.rentalSurveyFinalization);
const known = (code: string) => new Prisma.PrismaClientKnownRequestError(code, { code, clientVersion: "test" });
const whereOf = (fn: { mock: { calls: unknown[][] } }) => (fn.mock.calls[0][0] as { where?: Record<string, unknown>; data?: Record<string, unknown> });

beforeEach(() => {
  vi.clearAllMocks();
  batches.create.mockResolvedValue({ id: "new-batch" } as never);
  batches.findMany.mockResolvedValue([]);
  finals.create.mockResolvedValue({} as never);
  finals.findFirst.mockResolvedValue(null);
  finals.findMany.mockResolvedValue([]);
});

describe("学区データを変えない（T01）", () => {
  it("ペット調査の保存・確定・読取はすべて調査テーブルだけを使い、scope・版で絞る", async () => {
    await insertBatch(scope, batch("reins"));
    await readBatches(scope, ["a", "b"]);
    await listBatchMetadata(scope);
    await findLatestFinalization(scope);
    await findFinalization(scope, "fin-1");
    await listFinalizations(scope);
    const plan = planFinalization({ scope, batches: storedBatches(), latest: null, ledger: confirmedLedger(["store"]), now: NOW });
    if (!plan.ok) throw new Error(plan.error);
    await insertFinalization(scope, plan.data, 0);
    for (const fn of [batches.findMany, finals.findFirst, finals.findMany]) for (const [args] of fn.mock.calls)
      expect((args as { where: Record<string, unknown> }).where).toMatchObject({ scopeId: "bunkyo-rent-pet", scopeVersion: 1 });
    expect(whereOf(batches.create).data).toMatchObject({ scopeId: "bunkyo-rent-pet", scopeVersion: 1, provider: "reins" });
    expect(whereOf(finals.create).data).toMatchObject({ scopeId: "bunkyo-rent-pet", scopeVersion: 1, sequence: 1 });
  });

  it("バッチ一覧は観測行（payload）を返さない", async () => {
    await listBatchMetadata(scope);
    expect((batches.findMany.mock.calls[0][0] as { select: Record<string, boolean> }).select).not.toHaveProperty("payload");
  });

  it("scope が一致しないバッチは保存しない", async () => {
    await expect(insertBatch(scope, batch("reins", undefined, { scopeVersion: 2 }))).rejects.toThrow();
    expect(batches.create).not.toHaveBeenCalled();
  });

  it("未完了・失敗のバッチは状態だけを記録し、観測行を保存しない", async () => {
    await insertBatch(scope, batch("reins", [], { status: "failed", allPagesChecked: false, expectedCount: undefined, failureReason: "ログイン切れ" }));
    expect(whereOf(batches.create).data).toMatchObject({ status: "failed", payload: Prisma.DbNull, recordCount: 0 });
  });
});

describe("同時更新の検出（T03）", () => {
  it("確定は expectedSequence + 1 で追記し、先を越されたら false（上書きしない）", async () => {
    finals.create.mockRejectedValueOnce(known("P2002"));
    const plan = planFinalization({ scope, batches: storedBatches(), latest: null, ledger: confirmedLedger(["store"]), now: NOW });
    if (!plan.ok) throw new Error(plan.error);
    await expect(insertFinalization(scope, plan.data, 4)).resolves.toBe(false);
    expect(whereOf(finals.create).data).toMatchObject({ sequence: 5 });
  });

  it("一意制約違反以外の失敗は隠さない", async () => {
    finals.create.mockRejectedValueOnce(new Error("connection lost"));
    const plan = planFinalization({ scope, batches: storedBatches(), latest: null, ledger: confirmedLedger(["store"]), now: NOW });
    if (!plan.ok) throw new Error(plan.error);
    await expect(insertFinalization(scope, plan.data, 0)).rejects.toThrow("connection lost");
  });
});

describe("テーブル未作成（本番はコード先行・マイグレーションは承認後）", () => {
  it("公開面の読取は未確定として扱う", async () => {
    finals.findFirst.mockRejectedValueOnce(known("P2021"));
    await expect(readLatestFinalization("bunkyo-rent-pet", 1)).resolves.toBeNull();
  });

  it("管理APIの読取・書込は例外にする（黙って成功させない）", async () => {
    finals.findFirst.mockRejectedValueOnce(known("P2021"));
    await expect(findLatestFinalization(scope)).rejects.toThrow();
    batches.create.mockRejectedValueOnce(known("P2021"));
    await expect(insertBatch(scope, batch("reins"))).rejects.toThrow();
  });

  it("公開面の読取は未知の scope・現行でない版では DB を読まない", async () => {
    await expect(readLatestFinalization("bunkyo-rent-175000-area-48", 1)).resolves.toBeNull();
    await expect(readLatestFinalization("bunkyo-rent-pet", 2)).resolves.toBeNull();
    expect(finals.findFirst).not.toHaveBeenCalled();
  });
});
