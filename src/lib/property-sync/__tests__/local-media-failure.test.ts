import { afterEach, expect, it, vi } from "vitest";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createMediaStateFile, applyMediaCommandFile } from "../local-media-store";
import { verifyMediaJournal } from "../audit";
import { mediaState, now, request } from "./fixtures";
const fault = vi.hoisted(() => ({ afterRename: false, cleanup: false, directorySync: false, underreportedSize: false }));
vi.mock("node:fs/promises", async importOriginal => {
  const fs = await importOriginal<typeof import("node:fs/promises")>();
  return { ...fs,
    open: async (...args: Parameters<typeof fs.open>) => {
      const handle = await fs.open(...args);
      return new Proxy(handle, { get(target, key) {
        if (key === "sync") return async () => {
          if (fault.directorySync && (await target.stat()).isDirectory()) throw new Error("synthetic directory sync failure");
          return target.sync();
        };
        if (key === "stat" && fault.underreportedSize) return async () => {
          const value = await target.stat();
          if (value.isFile()) value.size = 1;
          return value;
        };
        const value = Reflect.get(target, key);
        return typeof value === "function" ? value.bind(target) : value;
      } });
    },
    rename: async (...args: Parameters<typeof fs.rename>) => { await fs.rename(...args); if (fault.afterRename) throw new Error("synthetic lost result"); },
    unlink: async (path: Parameters<typeof fs.unlink>[0]) => { if (fault.cleanup && String(path).endsWith(".lock")) throw new Error("synthetic cleanup failure"); return fs.unlink(path); },
  };
});
const directories: string[] = [];
afterEach(async () => { fault.afterRename = false; fault.cleanup = false; fault.directorySync = false; fault.underreportedSize = false; await Promise.all(directories.splice(0).map(d => rm(d, { recursive: true, force: true }))); });
async function setup() { const dir = await mkdtemp(join(tmpdir(), "yotsuba-audit-fault-")); directories.push(dir); const file = join(dir, "state.json"); await createMediaStateFile(file, mediaState()); return file; }
it("rename後の結果喪失を明示し、同一request再送で履歴を重複させない", async () => {
  const file = await setup(), r = request(); fault.afterRename = true;
  expect(await applyMediaCommandFile(file, r)).toEqual({ status: "held", reason: "STORE_OUTCOME_UNKNOWN" });
  fault.afterRename = false;
  expect(await applyMediaCommandFile(file, r)).toMatchObject({ status: "unchanged", replayed: true, auditSequence: 1 });
  expect(verifyMediaJournal(JSON.parse(await readFile(file, "utf8")))?.events).toHaveLength(1);
});
it("cleanup失敗で保存済み状態を失敗扱いして再実行せず、残留lockで保留する", async () => {
  const file = await setup(), r = request(); fault.cleanup = true;
  expect(await applyMediaCommandFile(file, r)).toEqual({ status: "held", reason: "STORE_OUTCOME_UNKNOWN" });
  expect(verifyMediaJournal(JSON.parse(await readFile(file, "utf8")))?.events).toHaveLength(1);
  fault.cleanup = false;
  expect(await applyMediaCommandFile(file, r)).toEqual({ status: "held", reason: "STORE_BUSY" });
});
it("directory同期失敗は結果不明とし、同じrequestの再送も同期成功まで保留する", async () => {
  const file = await setup(), r = request(); fault.directorySync = true;
  expect(await applyMediaCommandFile(file, r)).toEqual({ status: "held", reason: "STORE_OUTCOME_UNKNOWN" });
  const saved = await readFile(file, "utf8");
  expect(verifyMediaJournal(JSON.parse(saved))?.events).toHaveLength(1);
  expect(await applyMediaCommandFile(file, r)).toEqual({ status: "held", reason: "STORE_OUTCOME_UNKNOWN" });
  expect(await readFile(file, "utf8")).toBe(saved);
  fault.directorySync = false;
  expect(await applyMediaCommandFile(file, r)).toMatchObject({ status: "unchanged", replayed: true, auditSequence: 1 });
  expect(await readFile(file, "utf8")).toBe(saved);
});
it("初期fileのdirectory同期失敗も通知し、存在するfileを上書きしない", async () => {
  const dir = await mkdtemp(join(tmpdir(), "yotsuba-create-sync-")); directories.push(dir);
  const file = join(dir, "state.json"); fault.directorySync = true;
  await expect(createMediaStateFile(file, mediaState())).rejects.toThrow("STORE_OUTCOME_UNKNOWN");
  const saved = await readFile(file, "utf8");
  expect(verifyMediaJournal(JSON.parse(saved))?.events).toHaveLength(0);
  fault.directorySync = false;
  await expect(createMediaStateFile(file, mediaState())).rejects.toMatchObject({ code: "EEXIST" });
  expect(await readFile(file, "utf8")).toBe(saved);
});
it("他ユーザーに読める監査fileを保留し、自動で権限変更や保存をしない", async () => {
  const file = await setup(), before = await readFile(file, "utf8"); await chmod(file, 0o644);
  expect(await applyMediaCommandFile(file, request())).toEqual({ status: "held", reason: "AUDIT_INTEGRITY_ERROR" });
  expect(await readFile(file, "utf8")).toBe(before);
});
it("stat後に増えた想定のfileも実readの8MB上限で止め、短い内容へ置換しない", async () => {
  const file = await setup(), before = (await readFile(file, "utf8")).padEnd(8_000_001, " ");
  await writeFile(file, before); fault.underreportedSize = true;
  expect(await applyMediaCommandFile(file, request())).toEqual({ status: "held", reason: "AUDIT_INTEGRITY_ERROR" });
  expect(await readFile(file, "utf8")).toBe(before);
});
it("既存のgenesis例外と監査時刻を保持し、戻り値へjournalや実行権限を足さない", async () => {
  const file = await setup();
  await expect(createMediaStateFile(file, {})).rejects.toThrow("INVALID_MEDIA_STATE");
  const unknownGenesis = mediaState(); delete unknownGenesis.listing.changedAt;
  await expect(createMediaStateFile(file, unknownGenesis)).rejects.toThrow("EXPLICIT_GENESIS_REQUIRED");
  const result = await applyMediaCommandFile(file, request());
  expect(Object.keys(result).sort()).toEqual(["auditSequence", "replayed", "state", "status"]);
  expect(verifyMediaJournal(JSON.parse(await readFile(file, "utf8")))?.events[0].at).toBe(now);
});
