import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { applyReadAttemptFile, createReadAttemptFile, readAttemptFile } from "../local-read-attempt-store";
import { clock, completion, registry, request } from "./read-registry-fixtures";

const fault = vi.hoisted(() => ({ afterRename: false, directorySync: false, partial: false, cleanup: false }));
vi.mock("node:fs/promises", async importOriginal => {
  const fs = await importOriginal<typeof import("node:fs/promises")>();
  return { ...fs, open: async (...args: Parameters<typeof fs.open>) => {
    const handle = await fs.open(...args), path = String(args[0]);
    return new Proxy(handle, { get(target, key) {
      if (key === "writeFile" && fault.partial && path.endsWith(".tmp")) return async () => { await target.writeFile("{partial"); throw new Error("synthetic partial"); };
      if (key === "sync" && fault.directorySync && !path.endsWith(".json") && !path.endsWith(".tmp")) return async () => { throw new Error("synthetic sync"); };
      const value = Reflect.get(target, key, target); return typeof value === "function" ? value.bind(target) : value;
    } });
  }, rename: async (...args: Parameters<typeof fs.rename>) => { await fs.rename(...args); if (fault.afterRename) throw new Error("synthetic response loss"); },
  unlink: async (path: Parameters<typeof fs.unlink>[0]) => { if (fault.cleanup && String(path).endsWith(".lock")) throw new Error("synthetic lock cleanup"); return fs.unlink(path); } };
});
const dirs: string[] = [];
beforeEach(() => { vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(new Date(clock(0))); });
afterEach(async () => { Object.assign(fault, { afterRename: false, directorySync: false, partial: false, cleanup: false }); vi.useRealTimers(); await Promise.all(dirs.splice(0).map(d => rm(d, { recursive: true, force: true }))); });
async function load(file: string) { const result = await readAttemptFile(file); if (result.status !== "read") throw new Error(result.reason); return result.journal; }
async function setup() {
  const dir = await mkdtemp(join(tmpdir(), "yotsuba-read-attempt-")); dirs.push(dir); const file = join(dir, "read.json"), j = registry();
  expect(await createReadAttemptFile(file, j.genesis.input, clock(0))).toMatchObject({ status: "created", executable: false }); return file;
}

it("private fileでCAS予約と監査を保存し二重開始を防ぐ", async () => {
  const file = await setup(), j = await load(file), a = request(j), b = request(j, 2);
  const results = await Promise.all([applyReadAttemptFile(file, a), applyReadAttemptFile(file, b)]);
  expect(results.filter(r => r.status === "recorded" && r.outcome.status === "started")).toHaveLength(1);
  const current = await load(file), loser = current.events.some(e => e.request.requestId === a.requestId) ? b : a;
  expect(await applyReadAttemptFile(file, loser)).toMatchObject({ status: "recorded", outcome: { status: "held", reason: "READ_REGISTRY_CONFLICT" } });
  expect((await load(file)).state.attempts).toHaveLength(1); expect((await stat(file)).mode & 0o777).toBe(0o600);
  const saved = await readFile(file, "utf8"); expect(await createReadAttemptFile(file, j.genesis.input, clock(0))).toMatchObject({ reason: "STORE_ALREADY_EXISTS" });
  expect(await readFile(file, "utf8")).toBe(saved);
});
it.each(["start", "completion"])("%s保存応答喪失を同requestで再照合し、再送実行許可を返さない", async phase => {
  const file = await setup(); let j = await load(file), r = request(j);
  if (phase === "completion") { await applyReadAttemptFile(file, r); j = await load(file); r = completion(j); vi.setSystemTime(new Date(clock(1000))); }
  fault.afterRename = true; expect(await applyReadAttemptFile(file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  const saved = await load(file); expect(saved.events).toHaveLength(phase === "start" ? 1 : 2);
  fault.afterRename = false; expect(await applyReadAttemptFile(file, r)).toMatchObject({ status: "recorded", replayed: true, executable: false });
  expect(await load(file)).toEqual(saved);
  vi.setSystemTime(new Date(clock(150000)));
  expect(await applyReadAttemptFile(file, request(saved, 3))).toMatchObject({ status: "recorded", outcome: { status: "held", reason: phase === "start" ? "READ_ATTEMPT_IN_FLIGHT" : "READ_SUCCEEDED" } });
});
it("fsync障害が続く間は再送を保存確定へ変えない", async () => {
  const file = await setup(), r = request(await load(file)); fault.directorySync = true;
  expect(await applyReadAttemptFile(file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  expect(await applyReadAttemptFile(file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  fault.directorySync = false; expect(await applyReadAttemptFile(file, r)).toMatchObject({ status: "recorded", replayed: true });
  expect((await load(file)).state.attempts).toHaveLength(1);
});
it("completionの部分書込みでも未完了予約と旧監査を保持", async () => {
  const file = await setup(); await applyReadAttemptFile(file, request(await load(file)));
  const j = await load(file), saved = await readFile(file, "utf8"); vi.setSystemTime(new Date(clock(1000))); fault.partial = true;
  expect(await applyReadAttemptFile(file, completion(j))).toMatchObject({ reason: "LOCAL_IO_ERROR" });
  expect(await readFile(file, "utf8")).toBe(saved); expect((await load(file)).state.attempts[0].status).toBe("started");
});
it("残留lockを期限だけで解除しない", async () => {
  const file = await setup(), r = request(await load(file)); fault.cleanup = true;
  expect(await applyReadAttemptFile(file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" }); fault.cleanup = false;
  vi.setSystemTime(new Date(clock(150000))); expect(await applyReadAttemptFile(file, r)).toMatchObject({ reason: "STORE_BUSY" });
  expect((await load(file)).state.attempts).toHaveLength(1);
});
it("保管側の時刻でbackoffと次timeoutを再計算", async () => {
  const file = await setup(); await applyReadAttemptFile(file, request(await load(file))); vi.setSystemTime(new Date(clock(1000)));
  await applyReadAttemptFile(file, completion(await load(file), 2, "failed"));
  vi.setSystemTime(new Date(clock(2999))); expect(await applyReadAttemptFile(file, request(await load(file), 3))).toMatchObject({ outcome: { status: "held", reason: "READ_BACKOFF_NOT_ELAPSED" } });
  vi.setSystemTime(new Date(clock(3000))); expect(await applyReadAttemptFile(file, request(await load(file), 4))).toMatchObject({ outcome: { status: "started" } });
  expect((await load(file)).state.attempts[1].startedAt).toBe(clock(3000));
});
