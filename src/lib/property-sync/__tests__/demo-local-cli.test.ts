import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { afterEach, expect, it } from "vitest";

const folders: string[] = [];
afterEach(async () => { await Promise.all(folders.splice(0).map(path => rm(path, { recursive: true, force: true }))); });
async function folder() { const path = await mkdtemp(resolve(tmpdir(), "yotsuba-demo-cli-")); folders.push(path); return path; }
const cli = (args: string[]) => spawnSync(process.execPath, ["--import", "tsx", "scripts/property-sync/demo-local.ts", ...args], { cwd: process.cwd(), encoding: "utf8", timeout: 20000 });
const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

it("実CLIで合成5ケースを走らせ期待一致・診断完了・出力完了を分離", async () => {
  const out = resolve(await folder(), "result"), result = cli(["--case", "all", "--out", out]);
  expect(result.status).toBe(0); expect(result.stderr).toBe("");
  expect(JSON.parse(result.stdout)).toMatchObject({ status: "written", sourceOrigin: "synthetic_generated", purpose: "diagnostic_demo", executable: false,
    outputComplete: true, expectedResultMatched: true, realSettingsVerified: false, realPermissionsVerified: false, mediaConnectionVerified: false });
  const reportBytes = await readFile(resolve(out, "report.json")), report = JSON.parse(reportBytes.toString()), manifest = JSON.parse(await readFile(resolve(out, "manifest.json"), "utf8"));
  expect(report.cases).toHaveLength(5); expect(report.cases.every((c: { expectedResultMatched: boolean }) => c.expectedResultMatched)).toBe(true);
  expect(report.cases.find((c: { scenario: string }) => c.scenario === "baseline").result).toMatchObject({ diagnosticComplete: true, executable: false, checks: { capacity: { state: "unreserved" } } });
  expect(report.cases.find((c: { scenario: string }) => c.scenario === "missing-permission").result.checks.permissions).toMatchObject({ evidenceMatched: false, reason: "PERMISSION_MISSING" });
  expect(report.cases.find((c: { scenario: string }) => c.scenario === "unknown-capacity").result.checks.capacity).toMatchObject({ reason: "CAPACITY_CONFIG_UNCONFIRMED" });
  expect(report.cases.filter((c: { scenario: string }) => c.scenario.startsWith("changed-")).every((c: { result: { diagnosticComplete: boolean } }) => !c.result.diagnosticComplete)).toBe(true);
  expect(manifest).toMatchObject({ outputComplete: true, executable: false, sourceOrigin: "synthetic_generated", purpose: "diagnostic_demo", durabilityRequiresSuccessfulCliExit: true });
  expect(manifest.files["report.json"]).toBe(hash(reportBytes)); expect(manifest.files["README.md"]).toBe(hash(await readFile(resolve(out, "README.md"))));
  expect((await stat(out)).mode & 0o777).toBe(0o700);
  for (const name of ["report.json", "README.md", "manifest.json"]) expect((await stat(resolve(out, name))).mode & 0o777).toBe(0o600);
  expect(reportBytes.toString() + result.stdout + result.stderr).not.toMatch(/SYNTHETIC_PRIVATE_|adNote|priceYen|rentMinYen|recordJson|contractRef/);
});
it("単一ケース指定も新規出力に限定、既存成果物を上書きしない", async () => {
  const out = resolve(await folder(), "result"); expect(cli(["--out", out, "--case", "baseline"]).status).toBe(0);
  const before = await readFile(resolve(out, "report.json")); const second = cli(["--case", "baseline", "--out", out]);
  expect(second.status).toBe(1); expect(JSON.parse(second.stderr)).toMatchObject({ reason: "OUTPUT_ALREADY_EXISTS", executable: false });
  expect(await readFile(resolve(out, "report.json"))).toEqual(before);
});
it.each([
  { args: ["--case", "PRIVATE_UNKNOWN", "--out", "unused"], reason: "UNKNOWN_SYNTHETIC_CASE" },
  { args: ["--input", "PRIVATE_INPUT", "--out", "unused"], reason: "INVALID_ARGUMENTS" },
  { args: ["--case", "all", "--case", "baseline"], reason: "INVALID_ARGUMENTS" },
  { args: ["--case", "all"], reason: "INVALID_ARGUMENTS" },
])( "未知case/不正引数を固定errorで拒否: $reason $args", ({ args, reason }) => {
  const result = cli(args); expect(result.status).toBe(1); expect(result.stdout).toBe("");
  expect(JSON.parse(result.stderr).reason).toBe(reason);
  expect(result.stderr).not.toMatch(/PRIVATE_|unused/);
});
it("出力先が既存fileでも内容を保護", async () => {
  const out = resolve(await folder(), "result"); await writeFile(out, "keep"); const result = cli(["--case", "all", "--out", out]);
  expect(result.status).toBe(1); expect(await readFile(out, "utf8")).toBe("keep");
});
it("実CLIで合成接続12ケースを保存し、実公開・再送成功と混同しない", async () => {
  const out = resolve(await folder(), "workflow"), result = cli(["--case", "workflow-all", "--out", out]);
  expect(result.status).toBe(0); expect(result.stderr).toBe("");
  expect(JSON.parse(result.stdout)).toMatchObject({ purpose: "workflow_demo", executable: false, expectedResultMatched: true });
  const bytes = await readFile(resolve(out, "report.json")), report = JSON.parse(bytes.toString());
  const manifest = JSON.parse(await readFile(resolve(out, "manifest.json"), "utf8"));
  expect(report.cases).toHaveLength(12);
  expect(report.cases.every((c: { expectedResultMatched: boolean }) => c.expectedResultMatched)).toBe(true);
  expect(report.cases.find((c: { scenario: string }) => c.scenario === "workflow-success").result).toMatchObject({ status: "simulated", mockReadbackMatched: true, realObservationAvailable: false });
  expect(report.cases.find((c: { scenario: string }) => c.scenario === "workflow-response-unknown").result).toMatchObject({ status: "unknown", submissionCalls: 1, unknownResolvedByReadback: false });
  expect(manifest.files["report.json"]).toBe(hash(bytes));
  expect(manifest.files["README.md"]).toBe(hash(await readFile(resolve(out, "README.md"))));
  expect((await stat(out)).mode & 0o777).toBe(0o700);
  for (const name of ["report.json", "README.md", "manifest.json"]) expect((await stat(resolve(out, name))).mode & 0o777).toBe(0o600);
  expect(bytes.toString() + result.stdout + result.stderr).not.toMatch(/SYNTHETIC_PRIVATE_|adNote|recordJson|contractRef/);
});
it("接続フローの保存失敗もworkflowの証跡として分類し既存fileを保持", async () => {
  const out = resolve(await folder(), "workflow"); await writeFile(out, "keep");
  const result = cli(["--out", out, "--case", "workflow-success"]);
  expect(result.status).toBe(1);
  expect(JSON.parse(result.stderr)).toMatchObject({ purpose: "workflow_demo", reason: "OUTPUT_ALREADY_EXISTS", executable: false });
  expect(await readFile(out, "utf8")).toBe("keep");
});
