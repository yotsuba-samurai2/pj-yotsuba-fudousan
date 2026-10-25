import { expect, it } from "vitest";
import { createDbMediaStore, mediaSql, RolledBackTransaction, type SqlPort, type SqlTransaction } from "../db-media-store";
import { createMediaJournal } from "../audit";
import { mediaState, request, observe } from "./fixtures";

function mockPort() {
  const j = createMediaJournal(mediaState());
  let row = { version: 0, genesis: j.genesis, state: j.state, head_hash: j.headHash }, events: Record<string, unknown>[] = [];
  let serial = Promise.resolve();
  const calls: { sql: string; parameters: readonly unknown[] }[] = [];
  const fault = { updateConflict: false, insertFailure: false, commitUncertain: false };
  const port: SqlPort = { async transaction<T>(run: (tx: SqlTransaction) => Promise<T>): Promise<T> {
    const predecessor = serial; let release!: () => void; serial = new Promise(resolve => { release = resolve; }); await predecessor;
    const oldRow = structuredClone(row), oldEvents = structuredClone(events);
    try {
      const result = await run({ async query(sql, parameters) {
        calls.push({ sql, parameters });
        if (sql === mediaSql.state) return { rows: [structuredClone(row)] };
        if (sql === mediaSql.events) return { rows: structuredClone(events) };
        if (sql === mediaSql.append) {
          if (fault.insertFailure) throw new Error("PRIVATE_DATABASE_ERROR");
          events.push({ event: JSON.parse(parameters[5] as string) }); return { rows: [] };
        }
        if (sql === mediaSql.update) {
          if (fault.updateConflict || parameters[5] !== row.version || parameters[6] !== row.head_hash) return { rows: [] };
          row = { ...row, version: row.version + 1, state: JSON.parse(parameters[3] as string), head_hash: parameters[4] as string }; return { rows: [{ version: row.version }] };
        }
        throw new Error("UNEXPECTED_SQL");
      } });
      if (fault.commitUncertain) { fault.commitUncertain = false; throw { committed: true }; }
      return result;
    } catch (error) {
      if (error && typeof error === "object" && "committed" in error) throw error;
      row = oldRow; events = oldEvents; throw new RolledBackTransaction();
    } finally { release(); }
  } };
  return { port, calls, fault, inspect: () => ({ row, events }) };
}
const key = () => { const s = mediaState(); return { propertyId: s.propertyId, episodeId: s.episodeId, media: s.media }; };
it("状態と監査を同一transactionで更新し、再送では書かない", async () => {
  const db = mockPort(), store = createDbMediaStore(db.port), r = request();
  expect(await store.apply(key(), r)).toMatchObject({ status: "applied", auditSequence: 1 });
  const writes = db.calls.filter(c => c.sql === mediaSql.append || c.sql === mediaSql.update).length;
  expect(await store.apply(key(), r)).toMatchObject({ status: "unchanged", replayed: true });
  expect(db.calls.filter(c => c.sql === mediaSql.append || c.sql === mediaSql.update)).toHaveLength(writes);
  expect(db.inspect().events).toHaveLength(1); expect(db.inspect().row.version).toBe(1);
  expect(db.calls.every(c => !/\b(?:update|insert into|delete from)\s+(?:public\.)?properties\b/i.test(c.sql))).toBe(true);
});
it.each(["updateConflict", "insertFailure"] as const)("%sなら監査と状態を両方rollbackする", async fault => {
  const db = mockPort(); db.fault[fault] = true; const before = structuredClone(db.inspect());
  expect(await createDbMediaStore(db.port).apply(key(), request())).toEqual({ status: "held", reason: "TRANSACTION_ROLLED_BACK" });
  expect(db.inspect()).toEqual(before);
});
it("commit結果不明後は同一requestIdの再読取りで重複を作らない", async () => {
  const db = mockPort(), store = createDbMediaStore(db.port), r = request(); db.fault.commitUncertain = true;
  expect(await store.apply(key(), r)).toEqual({ status: "held", reason: "STORE_OUTCOME_UNKNOWN" });
  expect(await store.apply(key(), r)).toMatchObject({ status: "unchanged", replayed: true }); expect(db.inspect().events).toHaveLength(1);
});
it("同時観測は一方だけ採用し、保留した試行も監査に残す", async () => {
  const db = mockPort(), store = createDbMediaStore(db.port); const b = observe(); b.evidence.evidenceId = "second";
  const result = await Promise.all([store.apply(key(), request()), store.apply(key(), request(b))]);
  expect(result.map(r => r.status).sort()).toEqual(["applied", "held"]); expect(db.inspect().events).toHaveLength(2);
  expect(db.inspect().row.state.observations.mobileWeb?.revision).toBe(1);
});
it("不正bindingはSQLを呼ばず、返された別bindingの状態は拒否する", async () => {
  const db = mockPort(), store = createDbMediaStore(db.port);
  expect(await store.apply({ ...key(), propertyId: "sql-injection" }, request())).toMatchObject({ reason: "INVALID_BINDING" }); expect(db.calls).toHaveLength(0);
  expect(await store.apply({ ...key(), episodeId: "other" }, request())).toMatchObject({ reason: "AUDIT_INTEGRITY_ERROR" });
});
it("保存済みstate/hashの不一致を検出し書き込まない", async () => {
  const db = mockPort(); db.inspect().row.state.listing.publicId = "tampered";
  expect(await createDbMediaStore(db.port).apply(key(), request())).toMatchObject({ reason: "AUDIT_INTEGRITY_ERROR" }); expect(db.inspect().events).toHaveLength(0);
});
