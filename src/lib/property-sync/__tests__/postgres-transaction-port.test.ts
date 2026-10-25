import { expect, it, vi } from "vitest";
import { createPostgresTransactionPort, type PostgresTransactionClient } from "../postgres-transaction-port";
import { createDbMediaStore, RolledBackTransaction } from "../db-media-store";
import { mediaState, request } from "./fixtures";

function lease(fail?: string) {
  const calls: string[] = [];
  const client: PostgresTransactionClient = {
    async query(sql, parameters) {
      calls.push(sql);
      if (sql === fail) throw new Error("PRIVATE_DRIVER_CONNECTION_OR_PARAMETER");
      return { rows: sql === "SELECT $1" ? [{ value: parameters[0] }] : [] };
    },
    async close() { calls.push("close"); if (fail === "close") throw new Error("PRIVATE_CLOSE_ERROR"); },
  };
  return { client, calls };
}

it("同じ専有clientでパラメーター付きSQLをcommitし、終了してから結果を返す", async () => {
  const l = lease(), connect = vi.fn(async () => l.client);
  const result = await createPostgresTransactionPort(connect).transaction(async tx => tx.query("SELECT $1", ["synthetic"]));
  expect(result.rows).toEqual([{ value: "synthetic" }]);
  expect(l.calls).toEqual(["BEGIN", "SELECT $1", "COMMIT", "close"]);
  expect(connect).toHaveBeenCalledTimes(1);
});

it("callback失敗後にrollback応答を確認した場合だけ既知の取消にする", async () => {
  const l = lease("INSERT");
  await expect(createPostgresTransactionPort(async () => l.client).transaction(tx => tx.query("INSERT", []))).rejects.toBeInstanceOf(RolledBackTransaction);
  expect(l.calls).toEqual(["BEGIN", "INSERT", "ROLLBACK", "close"]);
});

it.each(["BEGIN", "ROLLBACK", "COMMIT", "close"])("%sで応答喪失したら保存結果不明のまま、再送せず生エラーを除外する", async failure => {
  const l = lease(failure), connect = vi.fn(async () => l.client);
  await expect(createPostgresTransactionPort(connect).transaction(async tx => {
    if (failure === "ROLLBACK") throw new Error("PRIVATE_CALLBACK_ERROR");
    return tx.query("INSERT", []);
  })).rejects.toThrow(/^POSTGRES_TRANSACTION_OUTCOME_UNKNOWN$/);
  expect(connect).toHaveBeenCalledTimes(1);
  expect(l.calls.at(-1)).toBe("close");
  if (failure === "BEGIN") expect(l.calls).toEqual(["BEGIN", "close"]);
  if (failure === "COMMIT" || failure === "close") expect(l.calls).not.toContain("ROLLBACK");
});

it("接続段階で投げられた取消型エラーも、rollback確認なしでは既知の取消にしない", async () => {
  const connect = vi.fn(async () => { throw new RolledBackTransaction(); });
  const s = mediaState(), key = { propertyId: s.propertyId, episodeId: s.episodeId, media: s.media };
  expect(await createDbMediaStore(createPostgresTransactionPort(connect)).apply(key, request())).toEqual({ status: "held", reason: "STORE_OUTCOME_UNKNOWN" });
  expect(connect).toHaveBeenCalledTimes(1);
});

it("並行要求は独立leaseを使い、片側rollbackは他方のcommitを妨げない", async () => {
  const a = lease(), b = lease();
  const connect = vi.fn().mockResolvedValueOnce(a.client).mockResolvedValueOnce(b.client);
  let unlock!: () => void;
  const barrier = new Promise<void>(resolve => { unlock = resolve; });
  const port = createPostgresTransactionPort(connect);
  const first = port.transaction(async tx => { await tx.query("A", []); await barrier; return "A"; });
  const second = port.transaction(async tx => { await tx.query("B", []); unlock(); throw new Error("SYNTHETIC_FAILURE"); });
  const result = await Promise.allSettled([first, second]);
  expect(result[0]).toEqual({ status: "fulfilled", value: "A" });
  expect(result[1].status).toBe("rejected");
  if (result[1].status === "rejected") expect(result[1].reason).toBeInstanceOf(RolledBackTransaction);
  expect(a.calls).toEqual(["BEGIN", "A", "COMMIT", "close"]);
  expect(b.calls).toEqual(["BEGIN", "B", "ROLLBACK", "close"]);
  expect(connect).toHaveBeenCalledTimes(2);
});
