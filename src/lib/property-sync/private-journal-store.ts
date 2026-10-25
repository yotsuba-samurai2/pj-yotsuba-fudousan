import "server-only";
import { constants } from "node:fs";
import { open, rename, unlink } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

const MAX_BYTES = 8_000_000;
const held = (reason: string) => ({ status: "held" as const, executable: false as const, reason });
async function syncDirectory(file: string) {
  const directory = await open(dirname(file), constants.O_RDONLY);
  try { await directory.sync(); } finally { await directory.close(); }
}
async function syncStoredJournal(file: string) {
  const handle = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try { await handle.sync(); } finally { await handle.close(); }
  await syncDirectory(file);
}

/** Private regular files only; bound the actual read even if another process grows the file. */
async function readJournal<J>(file: string, verify: (value: unknown) => J | undefined): Promise<J | undefined> {
  const input = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const stat = await input.stat();
    if (!stat.isFile() || stat.size > MAX_BYTES || (stat.mode & 0o077) !== 0) return undefined;
    const buffer = Buffer.alloc(MAX_BYTES + 1);
    let offset = 0;
    while (offset < buffer.length) {
      const { bytesRead } = await input.read(buffer, offset, buffer.length - offset, offset);
      if (!bytesRead) break;
      offset += bytesRead;
    }
    if (offset > MAX_BYTES) return undefined;
    return verify(JSON.parse(buffer.subarray(0, offset).toString("utf8")));
  } finally { await input.close(); }
}

type Held = ReturnType<typeof held>;
type Recorded<J, O> = { status: "recorded"; executable: false; journal: J; outcome: O; replayed: boolean };

/** Internal factory: domain validation/replay stays in the supplied journal implementation. */
export function createPrivateJournalStore<J, O>(adapter: {
  create(binding: unknown, createdAt: string): J;
  verify(input: unknown): J | undefined;
  append(input: unknown, request: unknown, now: string): Held | Recorded<J, O>;
  errors: { invalidGenesis: string; invalidFile: string; capacity: string };
}) {
  /** No overwrite or automatic repair. A partial creation is retained for inspection. */
  async function create(file: string, binding: unknown, createdAt: string) {
    let journal: J;
    try { journal = adapter.create(binding, createdAt); } catch { return held(adapter.errors.invalidGenesis); }
    let handle;
    try { handle = await open(file, "wx", 0o600); }
    catch (error) { return held((error as NodeJS.ErrnoException).code === "EEXIST" ? "STORE_ALREADY_EXISTS" : "LOCAL_IO_ERROR"); }
    let complete = false;
    try { await handle.writeFile(JSON.stringify(journal) + "\n"); await handle.sync(); complete = true; }
    catch { /* Creation may have left a partial file; never silently replace it. */ }
    try { await handle.close(); if (complete) await syncDirectory(file); }
    catch { complete = false; }
    return complete ? { status: "created" as const, executable: false as const, journal } : held("STORE_OUTCOME_UNKNOWN");
  }

  async function read(file: string) {
    try {
      const journal = await readJournal(file, adapter.verify);
      return journal ? { status: "read" as const, executable: false as const, journal } : held(adapter.errors.invalidFile);
    } catch { return held("LOCAL_IO_ERROR"); }
  }

  /** Cooperating local writers only. The lock is never expired/removed automatically. */
  async function apply(file: string, request: unknown) {
    let lock;
    try { lock = await open(`${file}.lock`, "wx", 0o600); }
    catch (error) { return held((error as NodeJS.ErrnoException).code === "EEXIST" ? "STORE_BUSY" : "LOCAL_IO_ERROR"); }
    let temporary: string | undefined, savedOutcomePossible = false;
    let result: Held | Recorded<J, O>;
    try {
      const input = await readJournal(file, adapter.verify);
      if (!input) result = held(adapter.errors.invalidFile);
      else {
        const next = adapter.append(input, request, new Date().toISOString());
        result = next;
        if (next.status === "recorded" && next.replayed) {
          // A prior response may have been lost before directory fsync. Retry must confirm durability.
          savedOutcomePossible = true; await syncStoredJournal(file);
        } else if (next.status === "recorded") {
          const serialized = JSON.stringify(next.journal) + "\n";
          if (Buffer.byteLength(serialized) > MAX_BYTES) result = held(adapter.errors.capacity);
          else {
            temporary = `${file}.${randomUUID()}.tmp`;
            const output = await open(temporary, "wx", 0o600);
            try { await output.writeFile(serialized); await output.sync(); } finally { await output.close(); }
            savedOutcomePossible = true; await rename(temporary, file); temporary = undefined;
            await syncDirectory(file);
          }
        }
      }
    } catch { result = held(savedOutcomePossible ? "STORE_OUTCOME_UNKNOWN" : "LOCAL_IO_ERROR"); }
    finally { if (temporary) await unlink(temporary).catch(() => undefined); }
    try { await lock.close(); await unlink(`${file}.lock`); }
    catch { return held("STORE_OUTCOME_UNKNOWN"); }
    return result;
  }

  return { create, read, apply };
}
