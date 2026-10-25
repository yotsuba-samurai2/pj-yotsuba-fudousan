/** Local files only. Never imports a database, media adapter, credentials or scheduler. */
import { constants } from "node:fs";
import { mkdir, open } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createChangePlan, preflightChangePlan } from "../../src/lib/property-sync/change-plan";
import { contentHash } from "../../src/lib/property-sync/rules";

const MAX_INPUT_BYTES = 8_000_000;
class LocalPlanError extends Error {}
const sha256 = (bytes: string | Uint8Array) => createHash("sha256").update(bytes).digest("hex");

function argumentsFor(argv: string[]) {
  const [mode, ...args] = argv;
  const flags = mode === "create" ? ["--request", "--context", "--out"]
    : mode === "check" ? ["--plan", "--reference", "--context", "--out"] : undefined;
  if (!flags || args.length !== flags.length * 2) throw new LocalPlanError("INVALID_ARGUMENTS");
  const values: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i], value = args[i + 1];
    if (!flags.includes(flag) || flag in values || !value || value.startsWith("--")) throw new LocalPlanError("INVALID_ARGUMENTS");
    values[flag] = resolve(value);
  }
  if (flags.some(flag => !values[flag])) throw new LocalPlanError("INVALID_ARGUMENTS");
  return { mode, values };
}

async function readJson(file: string): Promise<{ value: unknown; hash: string }> {
  // NONBLOCK prevents a FIFO from hanging before fstat can reject it; reject final-component symlinks.
  let handle;
  try { handle = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK); }
  catch { throw new LocalPlanError("LOCAL_INPUT_INVALID"); }
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_INPUT_BYTES) throw new LocalPlanError("LOCAL_INPUT_INVALID");
    const buffer = Buffer.alloc(MAX_INPUT_BYTES + 1);
    let length = 0;
    while (length < buffer.length) {
      const { bytesRead } = await handle.read(buffer, length, buffer.length - length, null);
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length > MAX_INPUT_BYTES) throw new LocalPlanError("LOCAL_INPUT_INVALID");
    const bytes = buffer.subarray(0, length);
    return { value: JSON.parse(bytes.toString("utf8")) as unknown, hash: sha256(bytes) };
  } catch { throw new LocalPlanError("LOCAL_INPUT_INVALID"); }
  finally { await handle.close(); }
}

async function writeNew(file: string, value: unknown): Promise<string> {
  const text = JSON.stringify(value, null, 2) + "\n";
  const handle = await open(file, "wx", 0o600);
  try { await handle.writeFile(text); await handle.sync(); } finally { await handle.close(); }
  return sha256(text);
}

export async function runLocalPlanCli(argv: string[]) {
  const { mode, values } = argumentsFor(argv);
  const context = await readJson(values["--context"]);
  const inputs: Record<string, string> = { contextSha256: context.hash };
  let result;
  // Time is the local process clock; no CLI flag can claim a different validation instant.
  let at: string;
  if (mode === "create") {
    const request = await readJson(values["--request"]);
    inputs.requestSha256 = request.hash;
    at = new Date().toISOString();
    result = createChangePlan(request.value, context.value, at);
  } else {
    const plan = await readJson(values["--plan"]), reference = await readJson(values["--reference"]);
    inputs.planSha256 = plan.hash; inputs.referenceSha256 = reference.hash;
    at = new Date().toISOString();
    result = preflightChangePlan(plan.value, context.value, reference.value, at);
  }
  const record = { schemaVersion: 1, runId: randomUUID(), mode, at, executable: false,
    classification: "private_local_preview", inputHashes: inputs, result };
  const report = { ...record, recordHash: contentHash(record) };
  const out = values["--out"];
  try { await mkdir(out, { mode: 0o700 }); }
  catch (error) { throw new LocalPlanError((error as NodeJS.ErrnoException).code === "EEXIST" ? "OUTPUT_ALREADY_EXISTS" : "LOCAL_OUTPUT_ERROR"); }
  const files: Record<string, string> = {};
  try {
    files["report.json"] = await writeNew(resolve(out, "report.json"), report);
    if (result.status === "planned") {
      files["plan.json"] = await writeNew(resolve(out, "plan.json"), result.plan);
      files["reference.json"] = await writeNew(resolve(out, "reference.json"), result.reference);
    }
    // Manifest last: its absence means output was not completely written. No automatic cleanup.
    await writeNew(resolve(out, "manifest.json"), { schemaVersion: 1, complete: true,
      executable: false, classification: "private_local_preview", files });
  } catch { throw new LocalPlanError("OUTPUT_INCOMPLETE"); }
  return { status: "written", mode, result: result.status, executable: false,
    identityChecksPassed: result.status === "held" ? result.identityChecksPassed : false,
    files: Object.keys(files).concat("manifest.json") };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runLocalPlanCli(process.argv.slice(2)).then(result => process.stdout.write(JSON.stringify(result) + "\n"))
    .catch(error => {
      // Never echo raw source data, arguments, parser messages or credential-like input.
      process.stderr.write(JSON.stringify({ status: "error", executable: false,
        reason: error instanceof LocalPlanError ? error.message : "LOCAL_IO_ERROR" }) + "\n");
      process.exitCode = 1;
    });
}
