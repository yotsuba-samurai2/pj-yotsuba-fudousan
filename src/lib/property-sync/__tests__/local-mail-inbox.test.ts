import { chmod, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import { applyMailInboxFile, createMailInboxFile, readMailInboxFile } from "../local-mail-inbox";
import { MAIL_WINDOW_MS, type MailEnvelope } from "../mail-intake";
import { runMailIntakeCli } from "../../../../scripts/property-sync/mail-local";

const fault = vi.hoisted(() => ({ afterRename: false, duringWrite: false }));
vi.mock("node:fs/promises", async original => {
  const fs = await original<typeof import("node:fs/promises")>();
  return { ...fs,
    rename: async (...args: Parameters<typeof fs.rename>) => { await fs.rename(...args); if (fault.afterRename) throw new Error("synthetic lost response"); },
    open: async (...args: Parameters<typeof fs.open>) => {
      const handle = await fs.open(...args);
      if (!fault.duringWrite || !String(args[0]).endsWith(".tmp")) return handle;
      return new Proxy(handle, { get(target, key) {
        if (key === "writeFile") return async () => { await target.writeFile("{partial"); throw new Error("synthetic interrupted write"); };
        const value = Reflect.get(target, key, target);
        return typeof value === "function" ? value.bind(target) : value;
      } });
    },
  };
});
const directories: string[] = [];
afterEach(async () => {
  vi.useRealTimers();
  fault.afterRename = false; fault.duringWrite = false;
  await Promise.all(directories.splice(0).map(d => rm(d, { recursive: true, force: true })));
});
function mail(messageId = "synthetic-1"): MailEnvelope {
  return { schemaVersion: 1, mailboxRef: "synthetic-work", messageId,
    receivedAt: new Date(Date.now() - 1000).toISOString(), receivedAtBasis: "provider_internal_date", folder: "incoming",
    subject: "合成物件メール", attachmentsPresent: false,
    parts: [{ mimeType: "text/plain", decoding: "confirmed", decodedText: "物件名: 合成物件\n取引種別: 賃貸\n用途: 居住用\n賃料: 120000円\n間取り: 1LDK\n専有面積: 19㎡\nAD: PRIVATE_MAIL_CANARY\n所在地: PRIVATE_ADDRESS_CANARY" }] };
}
async function setup() {
  const dir = await mkdtemp(join(tmpdir(), "yotsuba-mail-test-")); directories.push(dir);
  const file = join(dir, "inbox.json");
  const created = await createMailInboxFile(file, { mailboxRef: "synthetic-work" }, new Date(Date.now() - 2000).toISOString());
  if (created.status !== "created") throw new Error(created.reason);
  return { dir, file, headHash: created.journal.headHash };
}
async function read(file: string) {
  const r = await readMailInboxFile(file); if (r.status !== "read") throw new Error(r.reason); return r.journal;
}

it("実ファイルの競合は一方のみ保存し、同じmailの再送は古いheadでも二重記録しない", async () => {
  const f = await setup(), a = mail(), b = mail("synthetic-2");
  const results = await Promise.all([a, b].map(m => applyMailInboxFile(f.file, { expectedHeadHash: f.headHash, mail: m })));
  expect(results.filter(r => r.status === "recorded")).toHaveLength(1);
  const current = await read(f.file), saved = current.entries[0].candidate.messageId;
  expect(current.entries).toHaveLength(1);
  const winner = saved === a.messageId ? a : b, loser = saved === a.messageId ? b : a;
  expect(await applyMailInboxFile(f.file, { expectedHeadHash: f.headHash, mail: winner })).toMatchObject({ status: "recorded", replayed: true });
  expect(await applyMailInboxFile(f.file, { expectedHeadHash: f.headHash, mail: loser })).toMatchObject({ reason: "MAIL_INBOX_CONFLICT" });
  expect((await stat(f.file)).mode & 0o777).toBe(0o600);
  expect(await readdir(f.dir)).toEqual(["inbox.json"]);
  expect(await readFile(f.file, "utf8")).not.toContain("PRIVATE_");
});

it.each(["before-save", "after-save"])("%sの障害で原本を保ち、保存後の応答喪失は再読取りと同一mailで復旧", async phase => {
  const f = await setup(), before = await readFile(f.file, "utf8"), m = mail(), request = { expectedHeadHash: f.headHash, mail: m };
  fault.duringWrite = phase === "before-save"; fault.afterRename = phase === "after-save";
  expect(await applyMailInboxFile(f.file, request)).toMatchObject({ reason: phase === "before-save" ? "LOCAL_IO_ERROR" : "STORE_OUTCOME_UNKNOWN" });
  fault.duringWrite = false; fault.afterRename = false;
  if (phase === "before-save") expect(await readFile(f.file, "utf8")).toBe(before);
  else expect((await read(f.file)).entries).toHaveLength(1);
  expect(await applyMailInboxFile(f.file, request)).toMatchObject({ status: "recorded", replayed: phase === "after-save" });
  expect((await read(f.file)).entries).toHaveLength(1);
});

it("CLIで合成メールを保存・再実行し、期限外/送信済みを除外、別mailboxを拒否する", async () => {
  const f = await setup(), input = join(f.dir, "input.json"), first = mail(), second = { ...first, messageId: "synthetic-2" };
  const batch = { schemaVersion: 1, messages: [first, second,
    { ...first, messageId: "old", receivedAt: new Date(Date.now() - MAIL_WINDOW_MS - 1000).toISOString() },
    { ...first, messageId: "sent", folder: "sent" }] };
  await writeFile(input, JSON.stringify(batch), { mode: 0o600 });
  const args = ["--input", input, "--inbox", f.file, "--mailbox", "synthetic-work"];
  expect(await runMailIntakeCli(args)).toMatchObject({ status: "completed", counts: { queued: 2, replayed: 0, excluded: 2, held: 0, possibleDuplicates: 1 }, unprocessed: 0 });
  const output = await runMailIntakeCli(args);
  expect(output).toMatchObject({ status: "completed", counts: { queued: 0, replayed: 2, excluded: 2 }, unprocessed: 0 });
  expect(JSON.stringify(output)).not.toContain("synthetic-1"); expect(JSON.stringify(output)).not.toContain("PRIVATE_");
  const box = await read(f.file);
  expect(box.entries).toHaveLength(2);
  expect(box.entries[0].candidate.fields).toMatchObject({ mainRooms: 1, kitchen: "LDK", areaSqm: 19 });
  const other = { ...first, mailboxRef: "different-work" };
  await writeFile(input, JSON.stringify({ schemaVersion: 1, messages: [other] }));
  expect(await runMailIntakeCli(args)).toMatchObject({ status: "held", counts: { held: 1 }, reasons: { MAILBOX_MISMATCH: 1 } });
  expect(await read(f.file)).toEqual(box);
});

it("CLIは不明な保存結果で後続を止め、同一入力の再照合後にだけ継続する", async () => {
  const f = await setup(), input = join(f.dir, "input.json");
  await writeFile(input, JSON.stringify({ schemaVersion: 1, messages: [mail(), mail("synthetic-2")] }), { mode: 0o600 });
  const args = ["--input", input, "--inbox", f.file, "--mailbox", "synthetic-work"];
  fault.afterRename = true;
  expect(await runMailIntakeCli(args)).toMatchObject({ status: "held", counts: { held: 1, queued: 0 }, unprocessed: 1, reasons: { STORE_OUTCOME_UNKNOWN: 1 } });
  fault.afterRename = false;
  expect(await runMailIntakeCli(args)).toMatchObject({ status: "completed", counts: { queued: 1, replayed: 1 }, unprocessed: 0 });
  expect((await read(f.file)).entries).toHaveLength(2);
});

it("公開権限の入力ファイル/候補directoryを拒否し、既存候補は変更しない", async () => {
  const f = await setup(), before = await readFile(f.file, "utf8"), input = join(f.dir, "input.json");
  await writeFile(input, JSON.stringify({ schemaVersion: 1, messages: [mail()] }), { mode: 0o644 });
  const args = ["--input", input, "--inbox", f.file, "--mailbox", "synthetic-work"];
  await expect(runMailIntakeCli(args)).rejects.toThrow("INPUT_NOT_PRIVATE_OR_TOO_LARGE");
  await chmod(input, 0o600); await chmod(f.dir, 0o755);
  await expect(runMailIntakeCli(args)).rejects.toThrow("INBOX_DIRECTORY_NOT_PRIVATE");
  expect(await readFile(f.file, "utf8")).toBe(before);
});

it("受信7日境界で保存応答を失っても、期限後は保存済み結果だけ照合し新規旧mailは除外する", async () => {
  vi.useFakeTimers({ toFake: ["Date"] });
  const at = Date.parse("2026-10-26T00:00:00.000Z"); vi.setSystemTime(at);
  const f = await setup(), input = join(f.dir, "input.json"), m = mail();
  m.receivedAt = new Date(at - MAIL_WINDOW_MS + 1).toISOString();
  const unseen = { ...m, messageId: "unseen-old" };
  await writeFile(input, JSON.stringify({ schemaVersion: 1, messages: [m, unseen] }), { mode: 0o600 });
  const args = ["--input", input, "--inbox", f.file, "--mailbox", "synthetic-work"];
  fault.afterRename = true;
  expect(await runMailIntakeCli(args)).toMatchObject({ status: "held", unprocessed: 1 });
  fault.afterRename = false; vi.setSystemTime(at + 2);
  expect(await runMailIntakeCli(args)).toMatchObject({ status: "completed", counts: { replayed: 1, excluded: 1, queued: 0, held: 0 } });
  expect((await read(f.file)).entries).toHaveLength(1);
});

it("独立NodeプロセスのCLIも専用tsconfigで起動し、環境変数や資格情報なしで保存・再送できる", async () => {
  const f = await setup(), input = join(f.dir, "input.json");
  await writeFile(input, JSON.stringify({ schemaVersion: 1, messages: [mail()] }), { mode: 0o600 });
  const argv = ["--import", "tsx", "scripts/property-sync/mail-local.ts", "--input", input, "--inbox", f.file, "--mailbox", "synthetic-work"];
  const options = { cwd: process.cwd(), env: { PATH: process.env.PATH, NODE_ENV: "test" as const, TSX_TSCONFIG_PATH: "scripts/property-sync/tsconfig.json" }, encoding: "utf8" as const, timeout: 10000 };
  expect(JSON.parse(execFileSync(process.execPath, argv, options))).toMatchObject({ status: "completed", counts: { queued: 1, held: 0 } });
  expect(JSON.parse(execFileSync(process.execPath, argv, options))).toMatchObject({ status: "completed", counts: { replayed: 1, held: 0 } });
});
