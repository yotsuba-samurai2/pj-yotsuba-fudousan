// Owns only the newly spawned process group. Never searches for or kills another Chrome/profile.
import { spawn } from "node:child_process";
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const exists = pid => { try { process.kill(-pid, 0); return true; } catch (e) { if (e.code === "ESRCH") return false; throw e; } };
async function stop(pid) {
  if (!exists(pid)) return true;
  for (const signal of ["SIGTERM", "SIGKILL"]) {
    try { process.kill(-pid, signal); } catch (e) { if (e.code === "ESRCH") return true; throw e; }
    for (let n = 0; n < 100; n++) { if (!exists(pid)) return true; await pause(20); }
  }
  return !exists(pid);
}
export async function runOwnedProcessGroup(file, args, { env, timeout = 30000, drainTimeout = 1000, maxBuffer = 4000000 } = {}) {
  const child = spawn(file, args, { env, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "", stderr = "", timedOut = false, exceeded = false, cleanupPromise;
  const cleanup = () => cleanupPromise ??= child.pid ? stop(child.pid).catch(() => false) : Promise.resolve(true);
  let settle;
  const outcomePromise = new Promise(resolve => { settle = resolve; });
  const timer = setTimeout(async () => { timedOut = true; await cleanup(); settle({ code: null, signal: null }); }, timeout);
  const collect = (kind, chunk) => {
    if (exceeded) return;
    if (Buffer.byteLength(stdout) + Buffer.byteLength(stderr) + Buffer.byteLength(chunk) > maxBuffer) { exceeded = true; void cleanup().then(() => settle({ code: null, signal: null })); return; }
    if (kind === "stdout") stdout += chunk.toString(); else stderr += chunk.toString();
  };
  child.stdout.setEncoding("utf8"); child.stderr.setEncoding("utf8");
  child.stdout.on("data", c => collect("stdout", c)); child.stderr.on("data", c => collect("stderr", c));
  child.once("error", error => settle({ code: null, signal: null, spawnError: error.code }));
  child.once("exit", (code, signal) => { void cleanup(); settle({ code, signal }); });
  const outcome = await outcomePromise;
  clearTimeout(timer);
  const groupStopped = await cleanup();
  // A child can leave the owned group and retain a pipe. Bound draining too; never find/kill that other group.
  const drained = await Promise.all([child.stdout, child.stderr].map(stream => new Promise(resolve => {
    if (stream.destroyed) return resolve(true);
    const done = value => { clearTimeout(limit); stream.off("close", closed); resolve(value); };
    const closed = () => done(true), limit = setTimeout(() => done(false), drainTimeout);
    stream.once("close", closed);
  })));
  const outputDrained = drained.every(Boolean);
  if (!outputDrained) { child.stdout.destroy(); child.stderr.destroy(); }
  return { ...outcome, stdout, stderr, groupStopped, outputDrained, timedOut, outputLimitExceeded: exceeded };
}
