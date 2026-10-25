import { afterEach, expect, it, vi } from "vitest";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { mediaState } from "./fixtures";
import { runLocalPlanCli } from "../../../../scripts/property-sync/plan-local";

const fault = vi.hoisted(() => ({ name: "" }));
vi.mock("node:fs/promises", async importOriginal => {
  const actual = await importOriginal<typeof import("node:fs/promises")>();
  return { ...actual, open: async (...args: Parameters<typeof actual.open>) => {
    const handle = await actual.open(...args);
    if (args[1] === "wx" && String(args[0]).endsWith(`/${fault.name}`)) {
      const originalWrite = handle.writeFile.bind(handle);
      handle.writeFile = async () => {
        await originalWrite("{\"partial\":");
        throw new Error("PRIVATE_CANARY_DO_NOT_LOG");
      };
    }
    return handle;
  } };
});

const folders: string[] = [];
afterEach(async () => {
  fault.name = "";
  await Promise.all(folders.splice(0).map(path => rm(path, { recursive: true, force: true })));
});
async function fixture() {
  const dir = await mkdtemp(resolve(tmpdir(), "yotsuba-plan-failure-")); folders.push(dir);
  const state = mediaState(), at = new Date().toISOString();
  const scope = { market: "residential_rental", audience: "global", clientRef: null };
  const context = { requestedScope: scope, mediaState: state,
    snapshot: { propertyId: state.propertyId, episodeId: state.episodeId, market: "residential_rental", snapshotRef: "synthetic", capturedAt: at, version: state.listing.propertyVersion },
    ruleHistory: [{ id: "synthetic", version: 1, scope, status: "approved", effectiveFrom: "2026-10-01T00:00:00.000Z", effectiveUntil: null,
      approvedAt: "2026-10-01T00:00:00.000Z", approvalRef: "synthetic",
      criteria: { market: "residential_rental", rentMinYen: 100, rentMaxYen: 200, minLayoutRooms: 2, preferredAreaSqm: null,
        leaseTypes: ["ordinary"], schoolScopeRef: "synthetic", companyIncomeMinYen: 100, incomeTaxBasis: "included", maxEvidenceAgeHours: 1 } }],
  };
  const request = { planId: "00000000-0000-4000-8000-000000000002", jobVersion: 1,
    expiresAt: new Date(Date.now() + 60_000).toISOString(), intent: { desiredState: "published", managementId: "mgmt", publicId: "pub" } };
  await writeFile(resolve(dir, "context.json"), JSON.stringify(context));
  await writeFile(resolve(dir, "request.json"), JSON.stringify(request));
  return { dir, out: resolve(dir, "output"), args: ["create", "--request", resolve(dir, "request.json"), "--context", resolve(dir, "context.json"), "--out", resolve(dir, "output")] };
}

it.each(["report.json", "plan.json", "reference.json", "manifest.json"])("%sの部分書込み障害を完了扱いせず、既存証跡を残す", async name => {
  const f = await fixture(); fault.name = name;
  await expect(runLocalPlanCli(f.args)).rejects.toThrow(/^OUTPUT_INCOMPLETE$/);
  const files = await readdir(f.out);
  expect(files).toContain(name);
  const partial = await readFile(resolve(f.out, name), "utf8");
  expect(partial).toBe("{\"partial\":");
  if (name !== "manifest.json") expect(files).not.toContain("manifest.json");
  else expect(() => JSON.parse(partial)).toThrow();
  // A second run must not overwrite or silently complete an uncertain partial directory.
  fault.name = "";
  await expect(runLocalPlanCli(f.args)).rejects.toThrow(/^OUTPUT_ALREADY_EXISTS$/);
  expect(await readFile(resolve(f.out, name), "utf8")).toBe(partial);
});
