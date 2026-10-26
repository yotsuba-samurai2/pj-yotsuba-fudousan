/** Local normalized input only. No connector, credentials, links, attachments, DB or mail sending. */
import { constants } from "node:fs";
import { open } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import { applyMailInboxFile, createMailInboxFile, readMailInboxFile } from "../../src/lib/property-sync/local-mail-inbox";

class IntakeError extends Error {}
async function readPrivateInput(file: string) {
  const handle = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || (stat.mode & 0o077) !== 0 || stat.size > 2_000_000) throw new IntakeError("INPUT_NOT_PRIVATE_OR_TOO_LARGE");
    const data = Buffer.alloc(2_000_001);
    let offset = 0;
    while (offset < data.length) {
      const read = await handle.read(data, offset, data.length - offset, offset);
      if (!read.bytesRead) break;
      offset += read.bytesRead;
    }
    if (offset > 2_000_000) throw new IntakeError("INPUT_TOO_LARGE");
    const parsed = z.object({ schemaVersion: z.literal(1), messages: z.array(z.unknown()).min(1).max(25) }).strict()
      .safeParse(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(data.subarray(0, offset))));
    if (!parsed.success) throw new IntakeError("INVALID_MAIL_BATCH");
    return parsed.data.messages;
  } finally { await handle.close(); }
}
async function checkPrivateParent(file: string) {
  const handle = await open(dirname(file), constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const stat = await handle.stat();
    if (!stat.isDirectory() || (stat.mode & 0o077) !== 0) throw new IntakeError("INBOX_DIRECTORY_NOT_PRIVATE");
  } finally { await handle.close(); }
}

export async function runMailIntakeCli(argv: string[]) {
  if (argv.length !== 6) throw new IntakeError("INVALID_ARGUMENTS");
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!["--input", "--inbox", "--mailbox"].includes(argv[i]) || argv[i] in args || !argv[i + 1] || argv[i + 1].startsWith("--")) throw new IntakeError("INVALID_ARGUMENTS");
    args[argv[i]] = argv[i + 1];
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(args["--mailbox"])) throw new IntakeError("INVALID_MAILBOX_REFERENCE");
  const file = resolve(args["--inbox"]), input = resolve(args["--input"]);
  if (input === file) throw new IntakeError("INPUT_EQUALS_INBOX");
  // Files are private; caller chooses a private directory outside public/build/repository artifacts.
  await checkPrivateParent(file);
  const messages = await readPrivateInput(input);
  const created = await createMailInboxFile(file, { mailboxRef: args["--mailbox"] }, new Date().toISOString());
  if (created.status !== "created" && created.reason !== "STORE_ALREADY_EXISTS") throw new IntakeError(created.reason);
  const counts = { queued: 0, replayed: 0, excluded: 0, held: 0, possibleDuplicates: 0 };
  const reasons: Record<string, number> = {};
  for (const mail of messages) {
    const current = await readMailInboxFile(file);
    if (current.status !== "read") throw new IntakeError(current.reason);
    if (current.journal.genesis.binding.mailboxRef !== args["--mailbox"]) throw new IntakeError("MAILBOX_MISMATCH");
    const result = await applyMailInboxFile(file, { expectedHeadHash: current.journal.headHash, mail });
    if (result.status === "held") {
      const excluded = ["OUTSIDE_MAIL_WINDOW", "NOT_INCOMING_MAIL", "AUTOMATION_REPORT"].includes(result.reason);
      counts[excluded ? "excluded" : "held"]++; reasons[result.reason] = (reasons[result.reason] ?? 0) + 1;
      // Unknown durability must be reconciled before any further write in this run.
      if (result.reason === "STORE_OUTCOME_UNKNOWN" || result.reason === "STORE_BUSY") break;
    } else {
      counts[result.replayed ? "replayed" : "queued"]++;
      if (result.outcome.possibleDuplicateOf) counts.possibleDuplicates++;
    }
  }
  return { status: counts.held ? "held" : "completed", executable: false, publicationEligible: false,
    counts, unprocessed: messages.length - counts.queued - counts.replayed - counts.excluded - counts.held, reasons };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runMailIntakeCli(process.argv.slice(2)).then(result => {
    process.stdout.write(JSON.stringify(result) + "\n"); if (result.status === "held") process.exitCode = 2;
  }).catch(error => {
    process.stderr.write(JSON.stringify({ status: "error", executable: false,
      reason: error instanceof IntakeError ? error.message : "LOCAL_MAIL_INTAKE_FAILED" }) + "\n"); process.exitCode = 1;
  });
}
