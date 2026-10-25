import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { chmod, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, expect, it, vi } from "vitest";
import { applyPlanRegistryFile, createPlanRegistryFile, readPlanRegistryFile } from "../local-plan-store";
import { verifyPlanRegistry, type PlanRegistry, type PlanRegistryRequest } from "../plan-registry";
import type { ChangePlan } from "../change-plan";
import { contentHash } from "../rules";

const fault = vi.hoisted(() => ({ initialWrite: false, tempWrite: false, afterRename: false, directorySync: false, cleanup: false, smallStat: false }));
vi.mock("node:fs/promises", async importOriginal => {
  const fs = await importOriginal<typeof import("node:fs/promises")>();
  return { ...fs,
    open: async (...args: Parameters<typeof fs.open>) => {
      const handle = await fs.open(...args), path = String(args[0]);
      const partial = (fault.tempWrite && path.endsWith(".tmp")) || (fault.initialWrite && args[1] === "wx" && path.endsWith("registry.json"));
      return new Proxy(handle, { get(target, key) {
        if (key === "writeFile" && partial) return async () => { await target.writeFile("{partial"); throw new Error("synthetic partial write"); };
        if (key === "sync" && fault.directorySync && !path.endsWith(".json") && !path.endsWith(".tmp")) return async () => { throw new Error("synthetic directory sync"); };
        if (key === "stat" && fault.smallStat && typeof args[1] === "number") return async () => { const value = await target.stat(); value.size = 1; return value; };
        const value = Reflect.get(target, key, target);
        return typeof value === "function" ? value.bind(target) : value;
      } });
    },
    rename: async (...args: Parameters<typeof fs.rename>) => { await fs.rename(...args); if (fault.afterRename) throw new Error("synthetic response lost"); },
    unlink: async (path: Parameters<typeof fs.unlink>[0]) => { if (fault.cleanup && String(path).endsWith(".lock")) throw new Error("synthetic cleanup"); return fs.unlink(path); },
  };
});
const directories: string[] = [];
afterEach(async () => {
  Object.assign(fault, { initialWrite: false, tempWrite: false, afterRename: false, directorySync: false, cleanup: false, smallStat: false });
  await Promise.all(directories.splice(0).map(d => rm(d, { recursive: true, force: true })));
});
async function setup(create = true) {
  const directory = await mkdtemp(join(tmpdir(), "yotsuba-plan-store-")); directories.push(directory);
  const file = join(directory, "registry.json"), at = new Date(Date.now() - 1000).toISOString();
  const binding = { propertyId: randomUUID(), episodeId: "episode-test", media: "athome" as const };
  if (create) expect(await createPlanRegistryFile(file, binding, at)).toMatchObject({ status: "created", executable: false });
  return { file, binding, at };
}
async function journal(file: string) {
  const result = await readPlanRegistryFile(file);
  if (result.status !== "read") throw new Error(result.reason);
  return result.journal;
}
function request(journal: PlanRegistry): PlanRegistryRequest {
  const at = new Date().toISOString();
  const plan: ChangePlan = { schemaVersion: 1, executable: false, planId: randomUUID(), jobVersion: journal.state.latestJobVersion + 1,
    createdAt: at, expiresAt: new Date(Date.now() + 3_600_000).toISOString(), binding: journal.genesis.binding,
    scope: { market: "residential_rental", audience: "global", clientRef: null },
    rule: { id: "synthetic", version: 1, hash: "a".repeat(64) }, source: { snapshotRef: "synthetic", capturedAt: at,
      version: { updatedAt: at, fullHash: "b".repeat(64) } }, listingBefore: { revision: 0, hash: "c".repeat(64) },
    intent: { desiredState: "published", managementId: null, publicId: null } };
  const current = journal.state.activePlan;
  return { requestId: randomUUID(), actorRef: "operator-test", at,
    expected: { revision: journal.state.revision, headHash: journal.headHash }, command: { type: "register", plan,
      expectedActive: current ? { planId: current.planId, jobVersion: current.jobVersion, hash: contentHash(current) } : null } };
}

it("0600の新規storeへatomicに記録し、同じrequestを重複記録しない", async () => {
  const f = await setup(), before = await journal(f.file), r = request(before);
  expect((await stat(f.file)).mode & 0o777).toBe(0o600);
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ status: "recorded", executable: false, replayed: false, outcome: { status: "registered" } });
  const after = await readFile(f.file, "utf8");
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ status: "recorded", replayed: true });
  expect(await readFile(f.file, "utf8")).toBe(after);
  expect((await journal(f.file)).events).toHaveLength(1);
  expect(await readdir(dirname(f.file))).toEqual(["registry.json"]);
  expect(await createPlanRegistryFile(f.file, f.binding, f.at)).toMatchObject({ reason: "STORE_ALREADY_EXISTS" });
  expect(await readFile(f.file, "utf8")).toBe(after);
});

it("競合writerは一方だけ登録し、再読取り後の古いCASは監査上保留する", async () => {
  const f = await setup(), before = await journal(f.file), a = request(before), b = request(before);
  const results = await Promise.all([applyPlanRegistryFile(f.file, a), applyPlanRegistryFile(f.file, b)]);
  expect(results.filter(r => r.status === "recorded" && r.outcome.status === "registered")).toHaveLength(1);
  const current = await journal(f.file);
  expect(current.state.latestJobVersion).toBe(1);
  const losing = current.state.activePlan?.planId === (a.command.type === "register" ? a.command.plan.planId : "") ? b : a;
  expect(await applyPlanRegistryFile(f.file, losing)).toMatchObject({ status: "recorded", outcome: { status: "held", reason: "REGISTRY_CONFLICT" } });
  expect((await journal(f.file)).state).toMatchObject({ latestJobVersion: 1, revision: 2 });
});

it.each(["symlink", "unsafe-mode", "directory", "fifo", "malformed", "oversize", "growth"])("不正なfile %sを変更しない", async kind => {
  const f = await setup(), original = await readFile(f.file, "utf8"), r = request(await journal(f.file));
  let target = f.file;
  if (kind === "symlink") { target = join(dirname(f.file), "linked.json"); await symlink(f.file, target); }
  if (kind === "unsafe-mode") await chmod(f.file, 0o644);
  if (kind === "directory") target = dirname(f.file);
  if (kind === "fifo") { target = join(dirname(f.file), "pipe"); execFileSync("mkfifo", [target]); }
  if (kind === "malformed") await writeFile(f.file, "{bad");
  if (kind === "oversize" || kind === "growth") { await writeFile(f.file, " ".repeat(8_000_001)); fault.smallStat = kind === "growth"; }
  const before = kind === "directory" ? null : await readFile(f.file, "utf8");
  expect((await readPlanRegistryFile(target)).status).toBe("held");
  expect((await applyPlanRegistryFile(target, r)).status).toBe("held");
  if (before !== null) expect(await readFile(f.file, "utf8")).toBe(before);
  if (kind === "symlink") expect(await readFile(f.file, "utf8")).toBe(original);
});

it("残留lockを自動削除せず既存storeを保持", async () => {
  const f = await setup(), r = request(await journal(f.file)), before = await readFile(f.file, "utf8");
  await writeFile(f.file + ".lock", "synthetic", { mode: 0o600 });
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ reason: "STORE_BUSY" });
  expect(await readFile(f.file, "utf8")).toBe(before);
  expect(await readFile(f.file + ".lock", "utf8")).toBe("synthetic");
});

it("一時file書込み途中の障害は元のstate/auditを保持する", async () => {
  const f = await setup(), r = request(await journal(f.file)), before = await readFile(f.file, "utf8"); fault.tempWrite = true;
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ reason: "LOCAL_IO_ERROR" });
  expect(await readFile(f.file, "utf8")).toBe(before);
  expect(await readdir(dirname(f.file))).toEqual(["registry.json"]);
});

it.each(["rename-response", "directory-sync"])("%sの保存結果不明は再読取り/同じrequestIdで重複を防ぐ", async kind => {
  const f = await setup(), r = request(await journal(f.file));
  fault.afterRename = kind === "rename-response"; fault.directorySync = kind === "directory-sync";
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  fault.afterRename = false; fault.directorySync = false;
  expect((await journal(f.file)).events).toHaveLength(1);
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ status: "recorded", replayed: true });
  expect((await journal(f.file)).events).toHaveLength(1);
});

it("lock cleanup失敗後も保存済み結果を維持し、残留lockで停止", async () => {
  const f = await setup(), r = request(await journal(f.file)); fault.cleanup = true;
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  expect((await journal(f.file)).events).toHaveLength(1);
  fault.cleanup = false;
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ reason: "STORE_BUSY" });
});

it("同期障害が続く間は再送もUNKNOWNを維持し、同期復旧後だけ成功する", async () => {
  const f = await setup(), r = request(await journal(f.file)); fault.directorySync = true;
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  expect((await journal(f.file)).events).toHaveLength(1);
  fault.directorySync = false;
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ status: "recorded", replayed: true });
  expect((await journal(f.file)).events).toHaveLength(1);
});

it("初期作成の部分fileを成功扱いや上書きしない", async () => {
  const f = await setup(false); fault.initialWrite = true;
  expect(await createPlanRegistryFile(f.file, f.binding, f.at)).toMatchObject({ reason: "STORE_OUTCOME_UNKNOWN" });
  fault.initialWrite = false;
  expect(await readFile(f.file, "utf8")).toBe("{partial");
  expect(await createPlanRegistryFile(f.file, f.binding, f.at)).toMatchObject({ reason: "STORE_ALREADY_EXISTS" });
  expect((await readPlanRegistryFile(f.file)).status).toBe("held");
});

it("未来のrequestを保管側clockで拒否し、履歴を汚染しない", async () => {
  const f = await setup(), r = request(await journal(f.file)), before = await readFile(f.file, "utf8");
  r.at = new Date(Date.now() + 86_400_000).toISOString();
  expect(await applyPlanRegistryFile(f.file, r)).toMatchObject({ reason: "REQUEST_FROM_FUTURE" });
  expect(await readFile(f.file, "utf8")).toBe(before);
  expect(verifyPlanRegistry(JSON.parse(before))).toBeDefined();
});
