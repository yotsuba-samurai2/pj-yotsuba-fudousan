import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import { runDemoCli } from "../../../../scripts/property-sync/demo-local";

const fault = vi.hoisted(() => ({ filename: "", directorySync: false }));
vi.mock("node:fs/promises", async importOriginal => {
  const fs = await importOriginal<typeof import("node:fs/promises")>();
  return { ...fs, open: async (...args: Parameters<typeof fs.open>) => {
    const handle = await fs.open(...args), path = String(args[0]);
    if (args[1] === "wx" && path.endsWith("/" + fault.filename)) {
      const original = handle.writeFile.bind(handle); handle.writeFile = async () => { await original("PARTIAL"); throw new Error("PRIVATE_WRITE_ERROR"); };
    }
    if (args[1] === "r" && fault.directorySync) handle.sync = async () => { throw new Error("PRIVATE_SYNC_ERROR"); };
    return handle;
  } };
});
const folders: string[] = [];
afterEach(async () => { fault.filename = ""; fault.directorySync = false; await Promise.all(folders.splice(0).map(path => rm(path, { recursive: true, force: true }))); });
async function fixture() { const dir = await mkdtemp(resolve(tmpdir(), "yotsuba-demo-failure-")); folders.push(dir); const out = resolve(dir, "out"); return { out, args: ["--case", "all", "--out", out] }; }
it.each(["report.json", "README.md", "manifest.json"])("%sの部分書込みを完了扱いせず保持", async filename => {
  const f = await fixture(); fault.filename = filename;
  await expect(runDemoCli(f.args)).rejects.toThrow(/^OUTPUT_INCOMPLETE$/); expect(await readFile(resolve(f.out, filename), "utf8")).toBe("PARTIAL");
  if (filename !== "manifest.json") expect(await readdir(f.out)).not.toContain("manifest.json");
  fault.filename = ""; await expect(runDemoCli(f.args)).rejects.toThrow(/^OUTPUT_ALREADY_EXISTS$/); expect(await readFile(resolve(f.out, filename), "utf8")).toBe("PARTIAL");
});
it("manifest存在だけで永続化成功としない、directory fsync障害は結果不明として保持", async () => {
  const f = await fixture(); fault.directorySync = true; await expect(runDemoCli(f.args)).rejects.toThrow(/^OUTPUT_INCOMPLETE$/);
  const manifest = JSON.parse(await readFile(resolve(f.out, "manifest.json"), "utf8")); expect(manifest.durabilityRequiresSuccessfulCliExit).toBe(true);
  fault.directorySync = false; await expect(runDemoCli(f.args)).rejects.toThrow(/^OUTPUT_ALREADY_EXISTS$/);
});
