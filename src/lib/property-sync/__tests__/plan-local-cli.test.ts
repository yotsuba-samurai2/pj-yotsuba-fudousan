import { afterEach, expect, it } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, readdir, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { mediaState } from "./fixtures";

const exec = promisify(execFile), folders: string[] = [];
afterEach(async () => { await Promise.all(folders.splice(0).map(p => rm(p, { recursive: true, force: true }))); });
async function fixture() {
  const dir = await mkdtemp(resolve(tmpdir(), "yotsuba-plan-cli-")); folders.push(dir);
  const state = mediaState(), scope = { market: "residential_rental", audience: "global", clientRef: null };
  const context = { requestedScope: scope, mediaState: state,
    snapshot: { propertyId: state.propertyId, episodeId: state.episodeId, market: "residential_rental",
      snapshotRef: "synthetic-local", capturedAt: new Date().toISOString(), version: state.listing.propertyVersion },
    ruleHistory: [{ id: "synthetic", version: 1, scope, status: "approved",
      effectiveFrom: "2026-10-01T00:00:00.000Z", effectiveUntil: null,
      approvedAt: "2026-10-01T00:00:00.000Z", approvalRef: "PRIVATE_CANARY",
      criteria: { market: "residential_rental", rentMinYen: 100, rentMaxYen: 200,
        minLayoutRooms: 2, preferredAreaSqm: null, leaseTypes: ["ordinary"], schoolScopeRef: "PRIVATE_CANARY",
        companyIncomeMinYen: 100, incomeTaxBasis: "included", maxEvidenceAgeHours: 1 } }],
  };
  const request = { planId: "00000000-0000-4000-8000-000000000002", jobVersion: 1,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    intent: { desiredState: "published", managementId: "mgmt", publicId: "pub" } };
  await writeFile(resolve(dir, "context.json"), JSON.stringify(context), { mode: 0o600 });
  await writeFile(resolve(dir, "request.json"), JSON.stringify(request), { mode: 0o600 });
  return { dir, context, request };
}
async function cli(args: string[]) {
  try {
    const result = await exec(process.execPath, ["--import", "tsx", "scripts/property-sync/plan-local.ts", ...args],
      { cwd: process.cwd(), env: { NODE_ENV: "test" }, timeout: 10_000 });
    return { ...result, code: 0 };
  } catch (error) {
    const e = error as { stdout: string; stderr: string; code: number };
    return { stdout: e.stdout, stderr: e.stderr, code: e.code };
  }
}
function createArgs(dir: string, out = "created") {
  return ["create", "--request", resolve(dir, "request.json"), "--context", resolve(dir, "context.json"), "--out", resolve(dir, out)];
}
function checkArgs(dir: string) {
  return ["check", "--plan", resolve(dir, "created/plan.json"), "--reference", resolve(dir, "created/reference.json"),
    "--context", resolve(dir, "context.json"), "--out", resolve(dir, "checked")];
}

it("実CLIで計画を0600/0700の別ファイルへ書き、社内条件を複写しない", async () => {
  const { dir } = await fixture(), run = await cli(createArgs(dir));
  expect(run.code).toBe(0); expect(run.stderr).toBe("");
  expect(JSON.parse(run.stdout)).toMatchObject({ status: "written", result: "planned", executable: false });
  const out = resolve(dir, "created");
  expect((await stat(out)).mode & 0o777).toBe(0o700);
  const manifest = JSON.parse(await readFile(resolve(out, "manifest.json"), "utf8"));
  expect(manifest).toMatchObject({ complete: true, executable: false, classification: "private_local_preview" });
  for (const name of await readdir(out)) {
    const file = resolve(out, name), bytes = await readFile(file);
    expect((await stat(file)).mode & 0o777).toBe(0o600);
    expect(bytes.toString()).not.toMatch(/PRIVATE_CANARY|companyIncomeMinYen|rentMaxYen/);
    if (name !== "manifest.json") expect(createHash("sha256").update(bytes).digest("hex")).toBe(manifest.files[name]);
  }
});

it("別の期待参照と新しいcontextから検査し、照合が通っても実行保留を記録する", async () => {
  const f = await fixture(); expect((await cli(createArgs(f.dir))).code).toBe(0);
  f.context.snapshot.capturedAt = new Date().toISOString();
  await writeFile(resolve(f.dir, "context.json"), JSON.stringify(f.context));
  const run = await cli(checkArgs(f.dir));
  expect(run.code).toBe(0);
  expect(JSON.parse(run.stdout)).toMatchObject({ result: "held", executable: false, identityChecksPassed: true });
  const report = JSON.parse(await readFile(resolve(f.dir, "checked/report.json"), "utf8"));
  expect(report.result).toMatchObject({ reason: "ELIGIBILITY_AND_EXECUTION_GATES_UNIMPLEMENTED" });
});

it("計画の変更は既存の期待参照と衝突し、検査証跡に保留を残す", async () => {
  const f = await fixture(); await cli(createArgs(f.dir));
  const file = resolve(f.dir, "created/plan.json"), plan = JSON.parse(await readFile(file, "utf8"));
  plan.intent.publicId = "tampered"; await writeFile(file, JSON.stringify(plan));
  const run = await cli(checkArgs(f.dir));
  expect(run.code).toBe(0); expect(JSON.parse(run.stdout)).toMatchObject({ result: "held", identityChecksPassed: false });
  const report = JSON.parse(await readFile(resolve(f.dir, "checked/report.json"), "utf8"));
  expect(report.result.reason).toBe("PLAN_REFERENCE_MISMATCH");
});

it("未確定・未知キーを含む入力は生値を保存せず保留報告だけを生成", async () => {
  const f = await fixture();
  await writeFile(resolve(f.dir, "request.json"), JSON.stringify({ ...f.request, internal: { ad: "PRIVATE_CANARY" } }));
  const run = await cli(createArgs(f.dir));
  expect(run.code).toBe(0); expect(JSON.parse(run.stdout)).toMatchObject({ result: "held", executable: false });
  expect((await readdir(resolve(f.dir, "created"))).sort()).toEqual(["manifest.json", "report.json"]);
  expect(await readFile(resolve(f.dir, "created/report.json"), "utf8")).not.toContain("PRIVATE_CANARY");
});

it("既存の出力directoryと計画を上書きしない", async () => {
  const f = await fixture(); await cli(createArgs(f.dir));
  const file = resolve(f.dir, "created/report.json"), before = await readFile(file, "utf8");
  const run = await cli(createArgs(f.dir));
  expect(run.code).toBe(1); expect(JSON.parse(run.stderr).reason).toBe("OUTPUT_ALREADY_EXISTS");
  expect(await readFile(file, "utf8")).toBe(before);
});

it("期待参照を省略した検査や未知の実行modeを受け付けない", async () => {
  const f = await fixture();
  for (const args of [["check", "--plan", resolve(f.dir, "request.json"), "--context", resolve(f.dir, "context.json"), "--out", resolve(f.dir, "out")],
    ["apply", ...createArgs(f.dir).slice(1)]]) {
    const run = await cli(args);
    expect(run.code).toBe(1); expect(JSON.parse(run.stderr).reason).toBe("INVALID_ARGUMENTS");
  }
});

it("末尾symlinkとサイズ超過の入力を拒否し、入力内容やpathを出さない", async () => {
  const f = await fixture();
  await symlink(resolve(f.dir, "context.json"), resolve(f.dir, "link.json"));
  const args = createArgs(f.dir); args[4] = resolve(f.dir, "link.json");
  let run = await cli(args);
  expect(run.code).toBe(1); expect(JSON.parse(run.stderr).reason).toBe("LOCAL_INPUT_INVALID");
  expect(run.stderr).not.toContain(f.dir);
  await writeFile(resolve(f.dir, "request.json"), "PRIVATE_CANARY".padEnd(8_000_001, "x"));
  run = await cli(createArgs(f.dir));
  expect(run.code).toBe(1); expect(JSON.parse(run.stderr).reason).toBe("LOCAL_INPUT_INVALID");
  expect(run.stderr).not.toContain("PRIVATE_CANARY"); expect(run.stderr.length).toBeLessThan(200);
});
