import { test } from "node:test";
import assert from "node:assert/strict";
import { runOwnedProcessGroup } from "./owned-process-group.mjs";
const env = { PATH: "/usr/bin:/bin:/opt/homebrew/bin" };
test("normal output is drained and group termination is confirmed", async () => {
  const r = await runOwnedProcessGroup(process.execPath, ["-e", "process.stdout.write('synthetic-ok');process.stderr.write('synthetic-diagnostic')"], { env });
  assert.equal(r.code, 0); assert.equal(r.stdout, "synthetic-ok"); assert.equal(r.stderr, "synthetic-diagnostic"); assert.equal(r.groupStopped, true); assert.equal(r.timedOut, false);
});
test("timeout stops only the owned parent and child group", async () => {
  const code = "require('node:child_process').spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'});process.stdout.write('ready');setInterval(()=>{},1000)";
  const r = await runOwnedProcessGroup(process.execPath, ["-e", code], { env, timeout: 300 });
  assert.equal(r.stdout, "ready"); assert.equal(r.timedOut, true); assert.equal(r.groupStopped, true);
});
test("parent exit also stops remaining child before reporting cleanup", async () => {
  const code = "const c=require('node:child_process').spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'});c.unref();process.stdout.write('parent-done')";
  const r = await runOwnedProcessGroup(process.execPath, ["-e", code], { env, timeout: 3000 });
  assert.equal(r.code, 0); assert.equal(r.stdout, "parent-done"); assert.equal(r.timedOut, false); assert.equal(r.groupStopped, true);
});
test("missing executable does not claim a live group or delete unrelated processes", async () => {
  const r = await runOwnedProcessGroup("/nonexistent-yotsuba-synthetic-process", [], { env });
  assert.equal(r.spawnError, "ENOENT"); assert.equal(r.groupStopped, true);
});
test("a separate group holding pipes times out the drain and cannot authorize cleanup", async () => {
  // This synthetic child exits itself shortly afterwards; the helper must not search for or kill it.
  const code = "const c=require('node:child_process').spawn(process.execPath,['-e','setTimeout(()=>{},600)'],{detached:true,stdio:['ignore',1,2]});c.unref()";
  const r = await runOwnedProcessGroup(process.execPath, ["-e", code], { env, timeout: 3000, drainTimeout: 40 });
  assert.equal(r.groupStopped, true); assert.equal(r.outputDrained, false);
  await new Promise(resolve => setTimeout(resolve, 700));
});
