/** Synthetic data only. Does not read external inputs, database settings or credentials. */
import { mkdir, open } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import { runSyntheticDiagnostic, syntheticDiagnosticCases, type SyntheticDiagnosticCase } from "../../src/lib/property-sync/synthetic-diagnostic";

import { runSyntheticWorkflow, syntheticWorkflowCases, type SyntheticWorkflowCase } from "../../src/lib/property-sync/synthetic-workflow";

class DemoError extends Error {}
const isWorkflowCase = (value: string) => value === "workflow-all" || syntheticWorkflowCases.includes(value as SyntheticWorkflowCase);
const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");
async function write(file: string, text: string) {
  const handle = await open(file, "wx", 0o600);
  try { await handle.writeFile(text); await handle.sync(); } finally { await handle.close(); }
  return sha256(text);
}
const encode = (data: unknown) => JSON.stringify(data, null, 2) + "\n";

export async function runDemoCli(argv: string[]) {
  if (argv.length !== 4) throw new DemoError("INVALID_ARGUMENTS");
  const values: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!["--case", "--out"].includes(argv[i]) || argv[i] in values || !argv[i + 1] || argv[i + 1].startsWith("--")) throw new DemoError("INVALID_ARGUMENTS");
    values[argv[i]] = argv[i + 1];
  }
  if (!values["--case"] || !values["--out"]) throw new DemoError("INVALID_ARGUMENTS");
  const selected = values["--case"];
  const workflow = isWorkflowCase(selected);
  if (selected !== "all" && !workflow && !syntheticDiagnosticCases.includes(selected as SyntheticDiagnosticCase)) throw new DemoError("UNKNOWN_SYNTHETIC_CASE");
  const cases = selected === "all" ? syntheticDiagnosticCases : selected === "workflow-all" ? syntheticWorkflowCases
    : [selected as SyntheticDiagnosticCase | SyntheticWorkflowCase];
  const results = [];
  for (const scenario of cases) results.push(syntheticWorkflowCases.includes(scenario as SyntheticWorkflowCase)
    ? await runSyntheticWorkflow(scenario as SyntheticWorkflowCase) : await runSyntheticDiagnostic(scenario as SyntheticDiagnosticCase));
  const label = { sourceOrigin: "synthetic_generated", purpose: workflow ? "workflow_demo" : "diagnostic_demo", executable: false, realSettingsVerified: false, realPermissionsVerified: false, mediaConnectionVerified: false };
  const report = { schemaVersion: 1, runId: randomUUID(), ...label, expectedResultMatched: results.every(r => r.expectedResultMatched), cases: results };
  const out = resolve(values["--out"]);
  try { await mkdir(out, { mode: 0o700 }); }
  catch (error) { throw new DemoError((error as NodeJS.ErrnoException).code === "EEXIST" ? "OUTPUT_ALREADY_EXISTS" : "LOCAL_OUTPUT_ERROR"); }
  const files: Record<string, string> = {};
  try {
    files["report.json"] = await write(resolve(out, "report.json"), encode(report));
    files["README.md"] = await write(resolve(out, "README.md"), `# 合成データの${workflow ? "接続フロー" : "診断"}デモ\n\nsourceOrigin: synthetic_generated / purpose: ${label.purpose}\n\nこの出力は架空の物件・許諾・枠設定によるローカル検証です。実DB・媒体・実設定・実許諾は検証していません。全executable:false。\n\nexpectedResultMatchedは合成ケースの期待結果との一致、diagnosticCompleteは検査終了、manifestのoutputCompleteはファイル保存完了だけを示します。業務条件の合格や実行許可ではありません。${workflow ? "\n\n確認は合成入力による模擬確認のみ。反映先はメモリ内、観測はmockです。予約はattemptedのまま保持し、実枠の解放や実公開の根拠に使いません。" : ""}\n\n` + results.map(r => `- ${r.scenario}: 期待一致=${r.expectedResultMatched} / ${r.result.reason}`).join("\n") + "\n");
    // Manifest is last. An absent manifest means an incomplete output directory; retain it for inspection.
    await write(resolve(out, "manifest.json"), encode({ schemaVersion: 1, ...label, outputComplete: true, durabilityRequiresSuccessfulCliExit: true,
      expectedResultMatched: report.expectedResultMatched, files }));
    const directory = await open(out, "r"); try { await directory.sync(); } finally { await directory.close(); }
  } catch { throw new DemoError("OUTPUT_INCOMPLETE"); }
  return { status: "written", ...label, outputComplete: true, expectedResultMatched: report.expectedResultMatched,
    cases: results.map(r => ({ scenario: r.scenario, expectedResultMatched: r.expectedResultMatched, reason: r.result.reason })), files };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const argv = process.argv.slice(2), selected = argv[argv.indexOf("--case") + 1];
  runDemoCli(argv).then(result => { process.stdout.write(JSON.stringify(result) + "\n"); if (!result.expectedResultMatched) process.exitCode = 2; })
    .catch(error => { process.stderr.write(JSON.stringify({ status: "error", executable: false, sourceOrigin: "synthetic_generated", purpose: isWorkflowCase(selected) ? "workflow_demo" : "diagnostic_demo",
      reason: error instanceof DemoError ? error.message : "SYNTHETIC_DEMO_FAILED" }) + "\n"); process.exitCode = 1; });
}
