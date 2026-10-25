// Existing Chrome only. New temporary profile, file URL, no server/port/install or external traffic.
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, lstat, rm, realpath } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { runOwnedProcessGroup } from "./owned-process-group.mjs";
const exec = promisify(execFile), root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const prepareOnly = process.argv[2] === "--prepare-only";
assert.ok(process.argv.length === 2 || prepareOnly && process.argv.length === 3);
const temporary = await realpath(await mkdtemp("/tmp/yotsuba-ui40-")), identity = await lstat(temporary);
let result, failure, cleanupConfirmed = true, browserStarted = false, isolationVerification, probeDirectoryRemoved = false;
try {
  const bundle = resolve(temporary, "app.js"), page = resolve(temporary, "index.html"), profile = resolve(temporary, "network.sb");
  // Human-approved exception: only bind/listen on this Mac's Chrome SingletonSocket name pattern.
  // No outbound exception, TCP/UDP listener, persisted OS setting, or existing Chrome profile.
  const darwin = (await exec("/usr/bin/getconf", ["DARWIN_USER_TEMP_DIR"])).stdout.trim();
  assert.equal(darwin, "/var/folders/1q/lkpf2hnj2fg5lwxnfbd9mc500000gn/T/");
  // SBPL on this host does not match the counted {6} spelling (unit40 file-only probe).
  // Spell the same six-character set explicitly; do not broaden to a wildcard or +.
  const pattern = "^(/private)?/var/folders/1q/lkpf2hnj2fg5lwxnfbd9mc500000gn/T/com[.]google[.]Chrome[.]" + "[A-Za-z0-9]".repeat(6) + "/SingletonSocket$";
  // macOS's installed com.apple.smbd.sb uses direct path filters for Unix socket bind.
  // Keep the exact same approved path set and operations; no additional exception.
  const policy = `(version 1)\n(allow default)\n(deny network*)\n(allow network-bind (regex #"${pattern}"))\n(allow network-inbound (regex #"${pattern}"))\n`;
  await writeFile(profile, policy, { mode: 0o600 });
  const policyHash = createHash("sha256").update(policy).digest("hex");
  if (!prepareOnly) {
    await writeFile(resolve(root, "../evidence/unit40-browser", `network-${policyHash}.sb`), policy, { mode: 0o600 });
    const probeDir = await mkdtemp(resolve(darwin, "com.google.Chrome.")), probeIdentity = await lstat(probeDir);
    try {
      const probe = await exec("/usr/bin/sandbox-exec", ["-f", profile, process.execPath, resolve(root, "scripts/property-sync/browser-isolation-probe.mjs"), probeDir],
        { env: { PATH: "/usr/bin:/bin:/opt/homebrew/bin", LANG: "C" }, timeout: 12000, maxBuffer: 100000 });
      isolationVerification = JSON.parse(probe.stdout); assert.equal(isolationVerification.passed, true); assert.equal(isolationVerification.checks.length, 7);
    } finally {
      const end = await lstat(probeDir); assert.equal(end.isSymbolicLink(), false); assert.equal(end.ino, probeIdentity.ino); assert.equal(end.dev, probeIdentity.dev);
      await rm(probeDir, { recursive: true });
      probeDirectoryRemoved = true;
    }
    await writeFile(resolve(root, "../evidence/unit40-browser", `isolation-${Date.now()}.json`), JSON.stringify({ ...isolationVerification, policyHash }, null, 2), { flag: "wx", mode: 0o600 });
  }
  await build({ absWorkingDir: root, entryPoints: ["scripts/property-sync/recovery-browser-entry.tsx"], outfile: bundle, bundle: true, platform: "browser", format: "iife", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' },
    plugins: [{ name: "no-upload-transport", setup(b) { b.onResolve({ filter: /^@\/lib\/admin-api$/ }, () => ({ path: "no-upload", namespace: "mock" }));
      b.onLoad({ filter: /.*/, namespace: "mock" }, () => ({ contents: 'export async function uploadImage(){throw new Error("UPLOAD_DISABLED");}' })); } }] });
  const js = await readFile(bundle, "utf8");
  await writeFile(page, '<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; connect-src \'none\'; img-src \'none\';"><div id="root"></div><pre id="result">PENDING</pre><script>' + js.replaceAll('</script', '<\\/script') + '</script>', { mode: 0o600 });
  if (prepareOnly) {
    const artifact = `evidence/unit40-browser/prepared-ui-${Date.now()}.html`, contents = await readFile(page);
    await writeFile(resolve(root, "..", artifact), contents, { flag: "wx", mode: 0o600 });
    result = { status: "prepared_only", testsStarted: false, browserStarted: false, artifact, sha256: createHash("sha256").update(contents).digest("hex") };
  } else {
  browserStarted = true;
  const execution = await runOwnedProcessGroup("/usr/bin/sandbox-exec", ["-f", profile, chrome, "--headless", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-background-networking", "--disable-component-update", "--disable-sync", "--disable-breakpad", "--host-resolver-rules=MAP * ~NOTFOUND", `--user-data-dir=${resolve(temporary, "profile")}`, "--dump-dom", "--virtual-time-budget=15000", pathToFileURL(page).href],
    { env: { PATH: "/usr/bin:/bin:/opt/homebrew/bin", LANG: "C", TMPDIR: temporary + "/" }, timeout: 30000, maxBuffer: 4000000 });
  cleanupConfirmed = execution.groupStopped && execution.outputDrained;
  if (!cleanupConfirmed || execution.code !== 0 || execution.timedOut || execution.outputLimitExceeded) throw Object.assign(new Error("BROWSER_EXECUTION_INCOMPLETE"), { code: execution.code, stderr: execution.stderr });
  const { stdout } = execution;
  const match = stdout.match(/<pre id="result">([^<]+)<\/pre>/); assert.ok(match);
  result = JSON.parse(match[1].replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&gt;", ">").replaceAll("&lt;", "<"));
  const expected = ["reopen_only_inspects_and_preserves_editability", "double_click_leave_reopen_and_unknown_result", "lost_notification_reply_and_completed_request_do_not_resend", "permission_loss_clears_actions_until_reinspection", "property_switch_hides_old_actions_even_when_reply_arrives", "confirmed_held_save_can_reopen_and_save_without_dropping_reference"];
  if (result.success) {
    assert.deepEqual(result.checks, expected.map(name => ({ name, passed: true })));
    assert.equal(result.actualDom, true); assert.equal(result.realSessionStorage, true); assert.equal(result.fullPageReloadVerified, false);
    assert.equal(result.externalEffects, 0); assert.equal(result.writes, 2); assert.deepEqual(result.mockRuns, { cache: 2, notification: 1 });
  }
  result.isolationVerification = isolationVerification; result.browserSandboxDisabled = false; result.onlyApprovedSingletonBindInbound = true; result.hostResolverRules = "MAP * ~NOTFOUND";
  result.browserProcessGroupStopped = cleanupConfirmed;
  }
} catch (e) { failure = { status: "failed", reason: String(e.message).slice(0, 400), code: e.code, diagnostic: String(e.stderr ?? "").slice(0, 3000) }; }
finally {
  const end = await lstat(temporary); assert.equal(end.isSymbolicLink(), false); assert.equal(end.ino, identity.ino); assert.equal(end.dev, identity.dev);
  if (cleanupConfirmed) await rm(temporary, { recursive: true });
}
// Removing the owned profile directory does not prove Chrome's separate macOS IPC directory was removed.
console.log(JSON.stringify({ ...(failure ?? result), browserStarted, isolationVerification, probeDirectoryRemoved,
  chromeIpcCleanup: browserStarted ? "not_verified" : "not_created", temporaryProfileRemoved: cleanupConfirmed,
  ...(!cleanupConfirmed ? { retainedTemporaryDirectory: temporary } : {}) }, null, 2));
if (failure || !prepareOnly && !result?.success) process.exitCode = 1;
